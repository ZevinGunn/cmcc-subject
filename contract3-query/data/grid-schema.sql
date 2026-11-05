PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS grid_packages (
  package_id TEXT PRIMARY KEY,
  configured_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL,
  source_kind TEXT NOT NULL DEFAULT 'manual',
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
  status TEXT NOT NULL DEFAULT 'pending',
  last_attempt_at TEXT,
  last_success_at TEXT,
  http_status INTEGER,
  error TEXT NOT NULL DEFAULT '',
  content_hash TEXT
);
CREATE TABLE IF NOT EXISTS grid_businesses (
  package_id TEXT NOT NULL REFERENCES grid_packages(package_id),
  type_id TEXT NOT NULL,
  name TEXT NOT NULL,
  introduction TEXT NOT NULL DEFAULT '',
  rules TEXT NOT NULL DEFAULT '',
  dynamic_pricing INTEGER NOT NULL DEFAULT 0,
  query_action TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL,
  PRIMARY KEY(package_id,type_id)
);
CREATE TABLE IF NOT EXISTS grid_sections (
  package_id TEXT NOT NULL,
  type_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  heading TEXT NOT NULL,
  content TEXT NOT NULL,
  images_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY(package_id,type_id,position),
  FOREIGN KEY(package_id,type_id) REFERENCES grid_businesses(package_id,type_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS grid_tariff_rows (
  package_id TEXT NOT NULL,
  type_id TEXT NOT NULL,
  section_position INTEGER NOT NULL,
  table_position INTEGER NOT NULL,
  row_position INTEGER NOT NULL,
  cells_json TEXT NOT NULL,
  PRIMARY KEY(package_id,type_id,section_position,table_position,row_position),
  FOREIGN KEY(package_id,type_id) REFERENCES grid_businesses(package_id,type_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS grid_fetch_history (
  id INTEGER PRIMARY KEY,
  package_id TEXT NOT NULL REFERENCES grid_packages(package_id),
  fetched_at TEXT NOT NULL,
  status TEXT NOT NULL,
  http_status INTEGER,
  content_hash TEXT,
  message TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS grid_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS grid_business_name ON grid_businesses(name);
CREATE INDEX IF NOT EXISTS grid_package_status ON grid_packages(status);
CREATE VIEW IF NOT EXISTS grid_knowledge AS
SELECT p.package_id, p.configured_name, p.title, p.source_url, p.source_kind,
       p.status, p.last_attempt_at, p.last_success_at, p.error,
       b.type_id, b.name, b.introduction, b.rules, b.dynamic_pricing,
       b.query_action, b.updated_at
FROM grid_packages p LEFT JOIN grid_businesses b USING(package_id);
