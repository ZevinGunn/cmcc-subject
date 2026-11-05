"""Read-only official page collector and SQLite knowledge store. No page scripts run."""
import datetime
import hashlib
import json
import os
import re
import sqlite3
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://ysmapp.bj.10086.cn'
ENTRY = ORIGIN + '//app//channel-web//busiCore//showIndexCommon.action'
VOID = {'img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'area', 'base', 'wbr', 'embed', 'param', 'col'}
BLOCK = {'p', 'div', 'tr', 'li', 'br', 'table', 'h1', 'h2', 'h3', 'h4'}


def identifier(value):
    if not isinstance(value, str) or not re.fullmatch(r'A\d{7}', value):
        raise ValueError('业务 ID 必须为 A 加 7 位数字，例如 A1000770')
    return value


def source_url(value):
    return ENTRY + '?submitWarePackageId=' + identifier(value)


def now():
    return datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec='seconds')


class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def walk(self, tag=None):
        for child in self.children:
            if isinstance(child, Node):
                if tag is None or child.tag == tag:
                    yield child
                yield from child.walk(tag)

    def text(self):
        if self.tag in ('script', 'style', 'noscript'):
            return ''
        result = ''.join(c.text() if isinstance(c, Node) else c for c in self.children)
        if self.tag in ('td', 'th'):
            result += '\t'
        if self.tag in BLOCK:
            result += '\n'
        return result


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def clean(node):
    return '\n'.join(re.sub(r'[ \t\r\f\v]+', ' ', line).strip() for line in node.text().split('\n') if line.strip())


def parse_page(html, package_id):
    parser = PageParser()
    parser.feed(html)
    root = parser.root
    titles = list(root.walk('title'))
    title = clean(titles[0]) if titles else ''
    by_name = {n.attrs.get('name'): n for n in root.walk('span') if n.attrs.get('name')}
    businesses = []
    for anchor in root.walk('a'):
        type_id = anchor.attrs.get('id', '')
        if not re.fullmatch(r'B\d+', type_id):
            continue
        metadata = {n.attrs.get('name'): clean(n) for n in anchor.walk('span') if n.attrs.get('name')}
        prefixes = [x.strip() for x in metadata.get('table_introduce', '').split(',') if x.strip()]
        headings = metadata.get('table_introduce_head', '').split(',')
        sections = []
        for i, prefix in enumerate(prefixes):
            element = by_name.get(prefix + '_' + type_id)
            if element is None:
                continue
            images = []
            for img in element.walk('img'):
                url = urllib.parse.urljoin(ORIGIN + '/app/channel-web/', img.attrs.get('src', ''))
                parsed = urllib.parse.urlsplit(url)
                if parsed.scheme in ('https', 'http') and parsed.hostname and not parsed.query:
                    images.append(url)
            tables = []
            for table in element.walk('table'):
                rows = []
                for row in table.walk('tr'):
                    cells = [clean(cell) for cell in row.children if isinstance(cell, Node) and cell.tag in ('td', 'th')]
                    if cells:
                        rows.append(cells)
                if rows:
                    tables.append(rows)
            sections.append({'heading': headings[i].strip() if i < len(headings) else prefix,
                             'content': clean(element), 'images': list(dict.fromkeys(images)), 'tables': tables})
        names = [clean(n) for n in anchor.children if isinstance(n, Node) and n.tag == 'span' and not n.attrs.get('name')]
        name = names[0] if names else type_id
        intro = '\n\n'.join(s['content'] for s in sections if '介绍' in s['heading'] or '资费' in s['heading'])
        rules = '\n\n'.join(s['content'] for s in sections if '规则' in s['heading'] or '说明' in s['heading'])
        # Only keep the read-only plan-query path; never capture employee/session form values.
        query = metadata.get('query_wareplans', '')
        query = query if re.fullmatch(r'/?[\w/.-]+\.action', query) else ''
        businesses.append({'type_id': type_id, 'name': name, 'introduction': intro, 'rules': rules,
                           'dynamic_pricing': bool(query), 'query_action': query, 'sections': sections})
    has_content = any(s['content'] or s['images'] for b in businesses for s in b['sections'])
    status = 'ok' if businesses and has_content else 'partial' if businesses else 'unavailable'
    message = '' if status == 'ok' else '页面有业务但未提取到介绍与规则' if businesses else ('官方返回提示页，未提供业务内容' if title == '提示' else '未识别到官方业务结构')
    return {'title': title, 'businesses': businesses, 'status': status, 'message': message}


def connect(db_path):
    path = Path(db_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path, timeout=30)
    db.row_factory = sqlite3.Row
    db.executescript((ROOT / 'data/grid-schema.sql').read_text())
    return db


def seed(db):
    data = json.loads((ROOT / 'data/grid-businesses.json').read_text())
    with db:
        for item in data['contracts']:
            db.execute('INSERT OR IGNORE INTO grid_packages(package_id,configured_name,source_url,source_kind) VALUES(?,?,?,?)',
                       (item['id'], item['name'], source_url(item['id']), 'seed'))
        defaults = {'startId': 'A1000959', 'endId': 'A1001058', 'intervalMs': 500}
        for key, value in defaults.items():
            db.execute('INSERT OR IGNORE INTO grid_settings VALUES(?,?)', (key, json.dumps(value)))


def save_result(db, package_id, parsed, http_status=200, digest=None):
    stamp = now()
    with db:
        db.execute('UPDATE grid_packages SET status=?,last_attempt_at=?,http_status=?,error=? WHERE package_id=?',
                   (parsed['status'], stamp, http_status, parsed['message'], package_id))
        if parsed['businesses']:
            db.execute('DELETE FROM grid_businesses WHERE package_id=?', (package_id,))
            db.execute('UPDATE grid_packages SET title=?,last_success_at=?,content_hash=? WHERE package_id=?',
                       (parsed['title'], stamp, digest, package_id))
            for business in parsed['businesses']:
                db.execute('INSERT INTO grid_businesses VALUES(?,?,?,?,?,?,?,?)',
                           (package_id, business['type_id'], business['name'], business['introduction'], business['rules'],
                            int(business['dynamic_pricing']), business['query_action'], stamp))
                for i, section in enumerate(business['sections']):
                    db.execute('INSERT INTO grid_sections VALUES(?,?,?,?,?,?)', (package_id, business['type_id'], i,
                               section['heading'], section['content'], json.dumps(section['images'], ensure_ascii=False)))
                    for ti, table in enumerate(section['tables']):
                        for ri, cells in enumerate(table):
                            db.execute('INSERT INTO grid_tariff_rows VALUES(?,?,?,?,?,?)',
                                       (package_id, business['type_id'], i, ti, ri, json.dumps(cells, ensure_ascii=False)))
        db.execute('INSERT INTO grid_fetch_history(package_id,fetched_at,status,http_status,content_hash,message) VALUES(?,?,?,?,?,?)',
                   (package_id, stamp, parsed['status'], http_status, digest, parsed['message']))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch_page(package_id):
    request = urllib.request.Request(source_url(package_id), headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html'})
    opener = urllib.request.build_opener(NoRedirect)
    with opener.open(request, timeout=15) as response:
        body = response.read(4 * 1024 * 1024 + 1)
        if len(body) > 4 * 1024 * 1024:
            raise ValueError('官方页面超过 4MB 限制')
        charset = response.headers.get_content_charset() or 'utf-8'
        return body.decode(charset, errors='replace'), response.status


def settings(db):
    return {row['key']: json.loads(row['value']) for row in db.execute('SELECT * FROM grid_settings')}


def configure(db, args):
    ids = list(dict.fromkeys(args.get('ids', [])))
    if len(ids) > 500:
        raise ValueError('一次最多配置 500 个业务 ID')
    ids = [identifier(x) for x in ids]
    values = args.get('settings', {})
    if values:
        start, end = identifier(values['startId']), identifier(values['endId'])
        if not 0 <= int(end[1:]) - int(start[1:]) < 500:
            raise ValueError('发现范围需为顺序排列的最多 500 个编号')
        interval = values.get('intervalMs', 500)
        if not isinstance(interval, int) or not 300 <= interval <= 10000:
            raise ValueError('请求间隔须在 300 至 10000 毫秒之间')
    with db:
        for package_id in ids:
            db.execute('INSERT OR IGNORE INTO grid_packages(package_id,source_url,source_kind) VALUES(?,?,?)', (package_id, source_url(package_id), 'manual'))
        for key in ('startId', 'endId', 'intervalMs'):
            if values:
                db.execute('INSERT OR REPLACE INTO grid_settings VALUES(?,?)', (key, json.dumps(values[key])))
    return {'configured': len(ids), 'settings': settings(db)}


def detail(db, package_id):
    package = db.execute('SELECT * FROM grid_packages WHERE package_id=?', (identifier(package_id),)).fetchone()
    if not package:
        return None
    result = dict(package)
    result['businesses'] = []
    for row in db.execute('SELECT * FROM grid_businesses WHERE package_id=? ORDER BY type_id', (package_id,)):
        item = dict(row)
        item['sections'] = []
        for section in db.execute('SELECT * FROM grid_sections WHERE package_id=? AND type_id=? ORDER BY position', (package_id, row['type_id'])):
            section = dict(section)
            section['images'] = json.loads(section.pop('images_json'))
            tables = {}
            for tr in db.execute('SELECT * FROM grid_tariff_rows WHERE package_id=? AND type_id=? AND section_position=? ORDER BY table_position,row_position',
                                 (package_id, row['type_id'], section['position'])):
                tables.setdefault(tr['table_position'], []).append(json.loads(tr['cells_json']))
            section['tables'] = list(tables.values())
            item['sections'].append(section)
        result['businesses'].append(item)
    return result


def summary(db):
    return {'total': db.execute('SELECT count(*) FROM grid_packages').fetchone()[0],
            'businesses': db.execute('SELECT count(*) FROM grid_businesses').fetchone()[0],
            'tariffRows': db.execute('SELECT count(*) FROM grid_tariff_rows').fetchone()[0],
            'statuses': dict(db.execute('SELECT status,count(*) FROM grid_packages GROUP BY status').fetchall()),
            'lastAttemptAt': db.execute('SELECT max(last_attempt_at) FROM grid_packages').fetchone()[0]}


def listing(db, args):
    terms = str(args.get('q', ''))[:200].split()
    clauses, params = [], []
    for term in terms:
        clauses.append("(p.package_id LIKE ? ESCAPE '\\' OR p.configured_name LIKE ? ESCAPE '\\' OR p.title LIKE ? ESCAPE '\\' OR EXISTS(SELECT 1 FROM grid_businesses b WHERE b.package_id=p.package_id AND (b.name||b.introduction||b.rules) LIKE ? ESCAPE '\\'))")
        term = '%' + term.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_') + '%'
        params.extend([term] * 4)
    if args.get('status'):
        clauses.append('p.status=?')
        params.append(args['status'])
    where = ' WHERE ' + ' AND '.join(clauses) if clauses else ''
    total = db.execute('SELECT count(*) FROM grid_packages p' + where, params).fetchone()[0]
    page = max(1, int(args.get('page', 1)))
    size = max(1, min(100, int(args.get('pageSize', 30))))
    rows = db.execute('SELECT p.*,(SELECT count(*) FROM grid_businesses b WHERE b.package_id=p.package_id) AS business_count FROM grid_packages p' + where + ' ORDER BY p.package_id LIMIT ? OFFSET ?', params + [size, (page-1)*size])
    return {'items': [dict(row) for row in rows], 'total': total, 'page': page, 'pageSize': size, 'summary': summary(db)}


def scan(db, args):
    config = settings(db)
    if args.get('mode') == 'discover':
        ids = ['A' + str(n).zfill(7) for n in range(int(config['startId'][1:]), int(config['endId'][1:]) + 1)]
        kind = 'discovered'
    else:
        ids = args.get('ids') or [row[0] for row in db.execute('SELECT package_id FROM grid_packages WHERE enabled=1 ORDER BY package_id')]
        ids = [identifier(x) for x in ids]
        kind = 'manual'
    for i, package_id in enumerate(ids):
        with db:
            db.execute('INSERT OR IGNORE INTO grid_packages(package_id,source_url,source_kind) VALUES(?,?,?)', (package_id, source_url(package_id), kind))
        code = None
        try:
            html, code = fetch_page(package_id)
            digest = hashlib.sha256(html.encode()).hexdigest()
            parsed = parse_page(html, package_id)
        except Exception as error:
            code = error.code if isinstance(error, urllib.error.HTTPError) else code
            parsed = {'businesses': [], 'status': 'error', 'message': '官方 HTTP ' + str(code) if code else '读取官方页面失败：' + type(error).__name__}
            digest = None
        save_result(db, package_id, parsed, code, digest)
        emit({'progress': i+1, 'total': len(ids), 'id': package_id, 'status': parsed['status']})
        if code in (403, 429):
            emit({'paused': True, 'message': '官方返回访问限制，已停止本轮采集', 'summary': summary(db)})
            return
        if i+1 < len(ids):
            time.sleep(config['intervalMs'] / 1000)
    emit({'done': True, 'summary': summary(db)})


def export(db, directory):
    output = Path(directory)
    output.mkdir(parents=True, exist_ok=True)
    records = [detail(db, row[0]) for row in db.execute('SELECT package_id FROM grid_packages ORDER BY package_id')]
    (output / 'grid-knowledge.json').write_text(json.dumps({'generatedAt': now(), 'summary': summary(db), 'packages': records}, ensure_ascii=False, indent=2))
    (output / 'grid-knowledge.sql').write_text('\n'.join(db.iterdump()))
    target = sqlite3.connect(output / 'grid-knowledge.sqlite')
    db.backup(target)
    target.close()
    return {'directory': str(output), 'summary': summary(db)}


def emit(value):
    print(json.dumps(value, ensure_ascii=False), flush=True)


def main():
    args = json.load(sys.stdin)
    db = connect(args.get('dbPath', ROOT / 'data/grid-catalog.sqlite'))
    try:
        seed(db)
        operation = args.get('operation', 'summary')
        if operation == 'scan':
            scan(db, args)
            return
        actions = {'summary': lambda: summary(db), 'list': lambda: listing(db, args),
                   'detail': lambda: detail(db, args['id']), 'settings': lambda: settings(db),
                   'configure': lambda: configure(db, args), 'export': lambda: export(db, args['directory'])}
        emit({'result': actions[operation]()})
    finally:
        db.close()


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        emit({'error': str(error) if isinstance(error, (ValueError, KeyError)) else type(error).__name__})
        sys.exit(1)
