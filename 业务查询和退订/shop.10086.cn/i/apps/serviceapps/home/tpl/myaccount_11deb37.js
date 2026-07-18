define(["template", ""], function (a) {
  return a("myaccount", function (a) {
    "use strict";
    var c = this,
      g = (c.$helpers, a.userType),
      b = "";
    return (
      0 == g
        ? (b +=
            '\r\n<div class="ued-gbox bdr-1 pdr-20 pd-10">\r\n    <h3 class="ued-tit">我的账户</h3>\r\n    <div class="mgt-20 myinfo">\r\n        <div class="clearfix mgt-10 ">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10 sub-site-loading" id="stc_balance"></span><span id="stc_balance_unit">元</span><a href="javascript:;" class="bl-approve">交费></a></p>\r\n            可用余额：\r\n        </div>\r\n        <div class="clearfix mgt-10 none" id="ye-arrearage">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10 sub-site-loading" id="stc_arrearage"></span><span id="stc_arrearage_unit">元</span><a href="javascript:;" class="bl-arrearage">交费></a></p>\r\n            欠费金额：\r\n        </div>\r\n        <div class="clearfix mgt-15">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10 sub-site-loading" id="stc_tolbalance"></span><span id="stc_tolbalance_unit">元</span><a href="javascript:;" class="bl-overall">账单></a></p>\r\n            账户总余额 \r\n            <span class="ued-info2 rel js_info bg-tip-1" style="z-index: 11">\r\n                <span style="width: 220px; left:-95px; top:25px;" class="ued-tag abs">\r\n                    <em class="ued-cor-2"></em>\r\n                    账户总余额包括可用余额、协议款余额、专项余额等\r\n               </span>\r\n            </span>：\r\n        </div>\r\n        <div class="clearfix mgt-15">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10 sub-site-loading" id="stc_real"></span><span id="stc_real_unit">元</span><a href="javascript:;" class="bl-consume">详单></a></p>\r\n            当月消费\r\n            <span class="ued-info2 rel js_info bg-tip-1">\r\n                <span style="width: 220px; left:-95px; top:25px;" class="ued-tag abs">\r\n                    <em class="ued-cor-2"></em>\r\n                    当月消费是本账期的一个消费总和\r\n               </span>\r\n            </span>：\r\n        </div>\r\n        <div class="clearfix mgt-15">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10 sub-site-loading" id="stc_point"></span><span id="stc_point_unit">AI豆</span></p>\r\n            我的AI豆：\r\n        </div>\r\n    </div>\r\n</div>\r\n')
        : 1 == g &&
          (b +=
            '\r\n<div class="ued-gbox bdr-1 pd-10">\r\n    <h3 class="ued-tit">我的订单</h3>\r\n    <div class="mgt-20">\r\n        <div class="clearfix mgt-10 point-pp">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10" id="order-wait"></span>笔</p>\r\n            <span class="icon-shop1 fl mgr-15"></span>商品待付款：\r\n        </div>\r\n        <div class="clearfix mgt-25 point-ss">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10" id="order-ss"></span>笔</p>\r\n            <span class="icon-shop2 fl mgr-15"></span>商品已完成：\r\n        </div>\r\n        <div class="clearfix mgt-25 point-cl">\r\n            <p class="fr"><span class="color-1 fs-18 inline-block mgr-10" id="order-cal"></span>笔</p>\r\n            <span class="icon-shop3 fl mgr-15"></span>商品已取消：\r\n        </div>\r\n    </div>\r\n    <div class="tc mgt-30">\r\n        <button class="ued-btn2 mgr-25" id="pre-order">预购订单</button>\r\n        <button class="ued-btn2" id="recharge-order">充值订单</button>\r\n    </div>\r\n</div>\r\n'),
      (b += "\r\n"),
      new String(b)
    );
  });
});
