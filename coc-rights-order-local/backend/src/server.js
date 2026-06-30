import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import { listProducts } from './productStore.js';
import { resolveProductInput } from './layoutResolver.js';
import { assertPhone, assertSkuId, assertSmsCode } from './validators.js';
import { directOrder, getC1Token, getSkuType, sendSms } from './cocClient.js';
import { packageBookProduct, packageLoginCheck, packageSmsCode } from './cocClient.js';
import { makeDirectOrderRequest, makeSmsRequest } from './orderBuilder.js';
import {
  makePackageBookProductRequest,
  makePackageLoginCheckRequest,
  makePackageSmsRequest
} from './packageOrderBuilder.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));
app.use(
  morgan('dev', {
    skip: (req) => ['/api/sms/send', '/api/order/direct'].includes(req.path)
  })
);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'coc-rights-order-local' });
});

app.get('/api/products', async (req, res, next) => {
  try {
    res.json({ success: true, data: await listProducts() });
  } catch (error) {
    next(error);
  }
});

app.get('/api/layout/resolve', async (req, res, next) => {
  try {
    const data = await resolveProductInput(req.query.code || req.query.input);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sku/type', async (req, res, next) => {
  try {
    assertSkuId(req.body.skuId);
    const data = await getSkuType(req.body.skuId, {
      referer: req.body.referer,
      channelCode: req.body.channelCode
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.get('/api/risk/c1', async (req, res, next) => {
  try {
    const data = await getC1Token({
      referer: req.query.code || req.query.referer,
      channelCode: req.query.channelCode
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sms/send', async (req, res, next) => {
  try {
    const {
      phone,
      skuId,
      referer,
      channelCode,
      orderMode,
      pageId,
      productCode,
      touchCode,
      smsCodeTypeEnum
    } = req.body;
    assertPhone(phone);
    if (orderMode === 'package') {
      const encrypted = makePackageSmsRequest({
        phone,
        pageId,
        productCode: productCode || skuId,
        touchCode: touchCode || channelCode,
        smsCodeTypeEnum: smsCodeTypeEnum || '505'
      });
      const data = await packageSmsCode(encrypted.body, {
        referer,
        pageId,
        channelCode: touchCode || channelCode,
        headers: encrypted.headers
      });
      return res.json({ success: true, data });
    }
    assertSkuId(skuId);
    const payload = makeSmsRequest({ phone, skuId });
    const data = await sendSms(payload, { referer, channelCode });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.post('/api/package/login-check', async (req, res, next) => {
  try {
    const { phone, smsCode, userId = '', referer, pageId, channelCode, touchCode } = req.body;
    assertPhone(phone);
    assertSmsCode(smsCode);
    const encrypted = makePackageLoginCheckRequest({ phone, smsCode, userId });
    const data = await packageLoginCheck(encrypted.body, {
      referer,
      pageId,
      channelCode: touchCode || channelCode,
      headers: encrypted.headers
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.post('/api/order/direct', async (req, res, next) => {
  try {
    const {
      phone,
      smsCode,
      skuId,
      channelCode = config.defaultChannelCode,
      selfChannelCode = channelCode,
      referer = config.defaultReferer,
      receipt = true,
      receiptModule = true,
      operDfp = null,
      orderMode,
      pageId,
      productCode,
      touchCode,
      protocolSequenceId,
      userId = ''
    } = req.body;
    assertPhone(phone);
    assertSmsCode(smsCode);
    if (orderMode === 'package') {
      const payload = makePackageBookProductRequest({
        phone,
        smsCode,
        pageId,
        productCode: productCode || skuId,
        touchCode: touchCode || channelCode,
        protocolSequenceId,
        referer,
        userId
      });
      const data = await packageBookProduct(payload, {
        referer,
        pageId,
        channelCode: touchCode || channelCode
      });
      return res.json({ success: true, data });
    }
    assertSkuId(skuId);
    const payload = makeDirectOrderRequest({
      phone,
      smsCode,
      skuId,
      channelCode,
      selfChannelCode,
      referer,
      receipt,
      receiptModule,
      operDfp
    });
    const data = await directOrder(payload, { referer, channelCode });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message: error.message || '服务异常',
    data: error.data || null
  });
});

app.listen(config.port, () => {
  console.log(`COC rights order backend listening on http://localhost:${config.port}`);
});
