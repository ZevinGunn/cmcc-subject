import { buildLayoutUrl, config } from './config.js';
import { isSkuId, normalizeCode } from './validators.js';
import { findProduct } from './productStore.js';

function flattenDeep(value, result = []) {
  if (Array.isArray(value)) {
    for (const item of value) flattenDeep(item, result);
    return result;
  }
  if (value && typeof value === 'object') result.push(value);
  return result;
}

function parseSpecify(specify) {
  if (!specify || typeof specify !== 'string') return null;
  try {
    return JSON.parse(specify);
  } catch {
    return null;
  }
}

function collectRuleNames(item) {
  if (!Array.isArray(item.ruleCases)) return [];
  return item.ruleCases.map((rule) => rule?.name).filter(Boolean);
}

function getLayoutNodes(layout) {
  return flattenDeep([layout.instanceList || [], layout.pageInstanceList || []]);
}

function getComponentSkuId(specify) {
  return specify?.vipSkuId || specify?.skuid || specify?.skuId || specify?.skuID || '';
}

function getComponentImage(specify) {
  return specify?.orderImg || specify?.img0 || specify?.img || specify?.backgroundUrl || '';
}

function isOrderComponent(item) {
  const name = item.specify?.name || item.moduleId || '';
  return (
    name === 'Rights-PictureMemberOrderComp' ||
    name === 'Rights-PictureGoodsOrderComp' ||
    name.includes('Order') ||
    Boolean(getComponentSkuId(item.specify))
  );
}

export function extractLayoutInfo(code, layout) {
  const nodes = getLayoutNodes(layout);
  const components = [];
  const rules = new Set();

  for (const node of nodes) {
    for (const name of collectRuleNames(node)) rules.add(name);
    const instance = node.instance || node;
    const specify = parseSpecify(instance.specify);
    if (!specify) continue;
    components.push({
      moduleId: node.moduleId || instance.moduleId || specify.name,
      instanceId: node.instanceId || instance.id || specify.exampleId,
      specify,
      rules: collectRuleNames(node)
    });
  }

  const orderComp =
    components.find((item) => item.specify?.name === 'Rights-PictureMemberOrderComp') ||
    components.find((item) => item.specify?.name === 'Rights-PictureGoodsOrderComp') ||
    components.find(isOrderComponent);
  const skuId = getComponentSkuId(orderComp?.specify);

  return {
    code,
    name: layout.name || '',
    title: layout.title || layout.name || '',
    description: layout.description || '',
    beginTime: layout.beginTime || '',
    endTime: layout.endTime || '',
    skuId,
    referer: code,
    touchCode: layout.touchCode || '',
    layoutFamily: layout.pageInstanceList ? 'package-h5-canvas' : 'rightsmarket-h5-canvas',
    orderImg: getComponentImage(orderComp?.specify),
    bottomImg: orderComp?.specify?.bottomImg || '',
    component: orderComp
      ? {
          moduleId: orderComp.moduleId,
          instanceId: orderComp.instanceId,
          name: orderComp.specify.name || '',
          title: orderComp.specify.title || '',
          vipType: orderComp.specify.vipType || null,
          rawSkuField: orderComp.specify.vipSkuId
            ? 'vipSkuId'
            : orderComp.specify.skuid
              ? 'skuid'
              : orderComp.specify.skuId
                ? 'skuId'
                : orderComp.specify.skuID
                  ? 'skuID'
                  : ''
        }
      : null,
    rules: [...rules]
  };
}

export async function resolveProductInput(input) {
  const value = normalizeCode(input);
  if (!value) {
    throw Object.assign(new Error('请输入权益 code 或 skuId'), { status: 400 });
  }

  const fallback = await findProduct(value);
  if (isSkuId(value)) {
    return {
      input: value,
      inputType: 'skuId',
      skuId: value,
      code: fallback?.code || '',
      productCode: fallback?.productCode || '',
      pageId: fallback?.pageId || '',
      protocolSequenceId: fallback?.protocolSequenceId || '',
      orderMode: fallback?.orderMode || 'rights',
      touchCode: fallback?.touchCode || fallback?.channelCode || '',
      name: fallback?.name || '',
      channelCode: fallback?.channelCode || config.defaultChannelCode,
      selfChannelCode: fallback?.selfChannelCode || fallback?.channelCode || config.defaultChannelCode,
      referer: fallback?.referer || config.defaultReferer,
      source: fallback ? 'local' : 'input'
    };
  }

  const families = fallback?.layoutFamily
    ? [fallback.layoutFamily]
    : ['rightsmarket-h5-canvas', 'package-h5-canvas'];
  let response;
  let layoutFamily = families[0];
  let url = '';
  for (const family of families) {
    url = buildLayoutUrl(value, family);
    response = await fetch(url, {
      headers: {
        Accept: 'application/json,text/plain,*/*',
        Referer: `${config.cocBaseUrl}/`
      }
    });
    layoutFamily = family;
    if (response.ok) break;
  }

  if (!response?.ok) {
    if (fallback) {
      return {
        ...fallback,
        input: value,
        inputType: 'code',
        source: 'local',
        warning: `layout 拉取失败：HTTP ${response.status}`
      };
    }
    throw Object.assign(new Error(`layout 拉取失败：HTTP ${response.status}`), {
      status: 502
    });
  }

  const layout = await response.json();
  const parsed = extractLayoutInfo(value, layout);
  parsed.layoutFamily = parsed.layoutFamily || layoutFamily;
  if (!parsed.skuId && fallback?.skuId) parsed.skuId = fallback.skuId;

  return {
    ...fallback,
    ...parsed,
    input: value,
    inputType: 'code',
    channelCode: fallback?.channelCode || config.defaultChannelCode,
    selfChannelCode: fallback?.selfChannelCode || fallback?.channelCode || config.defaultChannelCode,
    referer: fallback?.referer || parsed.referer || value,
    orderMode: fallback?.orderMode || 'rights',
    productCode: fallback?.productCode || parsed.skuId,
    pageId: fallback?.pageId || String(layout.id || ''),
    protocolSequenceId: fallback?.protocolSequenceId || '',
    touchCode: fallback?.touchCode || parsed.touchCode || fallback?.channelCode || '',
    smsCodeTypeEnum: fallback?.smsCodeTypeEnum || '',
    source: parsed.skuId ? 'layout' : 'layout-no-sku'
  };
}
