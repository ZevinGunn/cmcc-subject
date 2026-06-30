import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3100),
  cocBaseUrl: process.env.COC_BASE_URL || 'https://dev.coc.10086.cn',
  layoutBaseUrl:
    process.env.LAYOUT_BASE_URL ||
    'https://res.coc.10086.cn/res/cdn/coc1/fixedPath',
  c1Url:
    process.env.C1_URL ||
    'https://yxfk.market.chinamobile.com:8081/mgt/decision-engine/udid/c1?',
  defaultChannelCode: process.env.DEFAULT_CHANNEL_CODE || 'P00000139704',
  defaultReferer: process.env.DEFAULT_REFERER || 'bojinyear'
};

export function buildPageReferer(referer, channelCode) {
  const page = referer || config.defaultReferer;
  const channel = channelCode || config.defaultChannelCode;
  return `${config.cocBaseUrl}/coc3/canvas/rightsmarket-h5-canvas/online/${encodeURIComponent(
    page
  )}?channelCode=${encodeURIComponent(channel)}&pageRecorded=true`;
}

export function buildLayoutUrl(code, layoutFamily = 'rightsmarket-h5-canvas') {
  return `${config.layoutBaseUrl}/production.${layoutFamily}.online.layout.${encodeURIComponent(
    code
  )}.json?tes=${Date.now()}`;
}
