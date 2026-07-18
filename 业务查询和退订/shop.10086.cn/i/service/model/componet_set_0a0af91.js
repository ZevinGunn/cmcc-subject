define(["stcDic"], function (c) {
  var b = [
      { funcode: "070000", inx: "home", imginx: "0", crumb: "" },
      { funcode: "010000", inx: "ordercenter", imginx: "3", crumb: "" },
      { funcode: "040000", inx: "chargecenter", imginx: "4", crumb: "" },
      { funcode: "020000", inx: "accountcenter", imginx: "2", crumb: "" },
      { funcode: "060000", inx: "securityset", imginx: "5", crumb: "" },
      { funcode: "140000", inx: "myInfo", imginx: "8", crumb: "" },
      { funcode: "150000", inx: "msgcenter", imginx: "9", crumb: "" },
      {
        funcode: "150100",
        inx: "advicearrival",
        imginx: "9",
        crumb: "到货通知",
      },
      { funcode: "150200", inx: "msgremind", imginx: "9", crumb: "消息提醒" },
      { funcode: "150300", inx: "mynews", imginx: "9", crumb: "消息查看" },
      { funcode: "010600", inx: "myorders", belongto: "2", crumb: "商品订单" },
      {
        funcode: "010700",
        inx: "mypreorders",
        belongto: "2",
        crumb: "预购订单",
      },
      {
        funcode: "010900",
        inx: "advicearrival",
        belongto: "2",
        crumb: "到货通知",
      },
      {
        funcode: "011000",
        inx: "starprefecture",
        crumb: "星级专区",
        belongto: "2",
      },
      {
        funcode: "011100",
        inx: "liferecharhisqry",
        belongto: "2",
        crumb: "生活缴费记录查询",
      },
      {
        funcode: "011300",
        inx: "bandorderqry",
        belongto: "2",
        crumb: "宽带预约订单",
      },
      {
        funcode: "010800",
        inx: "rechargerecord",
        belongto: "2",
        crumb: "充值订单",
      },
      {
        funcode: "010801",
        inx: "rechargeurecord",
        belongto: "2",
        crumb: "充值订单",
      },
      { funcode: "010400", inx: "myfav", belongto: "2", crumb: "我的收藏" },
      {
        funcode: "010300",
        inx: "recaddrmag",
        belongto: "2",
        crumb: "收货地址",
      },
      {
        funcode: "010200",
        inx: "invoicemag",
        belongto: "2",
        crumb: "发票设置",
      },
      {
        funcode: "040100",
        inx: "rechargecredit",
        belongto: "2",
        crumb: "在线充值",
      },
      {
        funcode: "040200",
        inx: "rechargecard",
        belongto: "2",
        crumb: "充值卡充值",
      },
      {
        funcode: "040400",
        inx: "rechargejf",
        belongto: "2",
        crumb: "AI豆充值",
      },
      { funcode: "040500", inx: "rechargegprs", crumb: "充流量" },
      {
        funcode: "040600",
        inx: "rechargeinterofth",
        crumb: "物联网交费",
        belongto: "2",
      },
      {
        funcode: "040700",
        inx: "kdrecharge",
        crumb: "宽带续费",
        attr: {
          hlink: 1,
          href: "http://www.qh.10086.cn/business/service/broadBand.html",
        },
      },
      {
        funcode: "040800",
        inx: "rechargelove",
        crumb: "爱心充值",
        belongto: "2",
        isnew: !0,
      },
      {
        funcode: "040900",
        inx: "rechargelife",
        crumb: "生活缴费",
        belongto: "2",
      },
      { funcode: "040300", inx: "rechargecredit", crumb: "手机交费" },
      { funcode: "020600", inx: "billqry", belongto: "0", crumb: "账单查询" },
      {
        funcode: "020700",
        inx: "billdetailqry",
        belongto: "0",
        crumb: "详单查询",
      },
      { funcode: "030200", inx: "mainpackchange", belongto: "0", crumb: "" },
      { funcode: "030100", inx: "browse_handle", belongto: "0", crumb: "" },
      {
        funcode: "020400",
        inx: "packremainqry",
        belongto: "0",
        crumb: "套餐余量查询",
      },
      {
        funcode: "020500",
        inx: "recharhisqry",
        belongto: "0",
        crumb: "交费记录查询",
      },
      {
        funcode: "020300",
        inx: "pointqry",
        belongto: "0",
        crumb: "AI豆明细查询",
      },
      { funcode: "020200", inx: "mycoupons", belongto: "0", crumb: "我的卡券" },
      { funcode: "020201", inx: "myfcode", belongto: "0", crumb: "我的F码" },
      {
        funcode: "020800",
        inx: "custinfoqry",
        belongto: "0",
        imgInx: "4",
        crumb: "用户信息查询",
      },
      {
        funcode: "020900",
        inx: "busiqrydeal",
        belongto: "0",
        crumb: "业务查询退订",
      },
      {
        funcode: "021000",
        inx: "belongqry",
        belongto: "2",
        crumb: "归属地查询",
      },
      {
        funcode: "021100",
        inx: "presentfee",
        belongto: "2",
        crumb: "赠送与返回话费查询",
      },
      { funcode: "021200", inx: "comment", belongto: "2", crumb: "发表评论" },
      { funcode: "021400", inx: "flowqry", belongto: "2", crumb: "流量账单" },
      {
        funcode: "021500",
        inx: "setprotect",
        belongto: "2",
        crumb: '"呼死你"防护业务设置查询',
      },
      {
        funcode: "021700",
        inx: "haraprotect",
        belongto: "2",
        crumb: "高频电话骚扰防护业务设置",
      },
      { funcode: "120000", inx: "orderservice", imginx: "6", crumb: "" },
      {
        funcode: "120001",
        inx: "returnorderqry",
        belongto: "2",
        crumb: "退货申请查询",
      },
      { funcode: "120002", inx: "myinvoice", belongto: "2", crumb: "我的发票" },
      {
        funcode: "120008",
        inx: "Guangd",
        crumb: "我的发票-广东",
        attr: {
          hlink: 1,
          href: "https://gd.10086.cn/my/ELECTRONIC_INVOICE.shtml?WT.mc_id=GDFWELEC050100O0001",
          belongto: "2",
        },
      },
      { funcode: "130000", inx: "email", imginx: "8", crumb: "" },
      { funcode: "130001", inx: "remail", pageheight: "800", crumb: "139邮箱" },
      { funcode: "140000", inx: "mymsg", crumb: "我的信息" },
      {
        funcode: "010100",
        inx: "reginfoset",
        belongto: "1",
        imgInx: "2",
        crumb: "",
      },
      {
        funcode: "010700",
        inx: "message",
        news: 0,
        belongto: "2",
        imgInx: "6",
        crumb: "",
      },
      {
        funcode: "050100",
        inx: "noticeinfo",
        belongto: "2",
        crumb: "公告信息",
      },
      {
        funcode: "160100",
        inx: "lingquan",
        imginx: "10",
        crumb: "领券",
        attr: {
          hlink: 1,
          href: "http://shop.10086.cn/i/gray/vouchercent.html",
          bread: ["商城", "个人中心", "领券"],
        },
        belongto: "2",
      },
      { funcode: "020200", inx: "mycoupons", imginx: "10", crumb: "我的卡券" },
      { funcode: "020201", inx: "myfcode", imginx: "10", crumb: "我的F码" },
      {
        funcode: "060100",
        inx: "securitycenter",
        crumb: "安全助手",
        attr: {
          hlink: 1,
          href:
            "https://login.10086.cn/home/safe.htm?backurl=" + c.getWebAddress(),
          bread: ["商城", "个人中心", "安全助手"],
        },
        belongto: "2",
      },
      {
        funcode: "060200",
        inx: "phone_manage",
        crumb: "帐号绑定",
        attr: {
          hlink: 1,
          href:
            "https://login.10086.cn/account/bind.htm?backurl=" +
            c.getWebAddress(),
          bread: ["商城", "个人中心", "帐号绑定"],
        },
        belongto: "1",
      },
      {
        funcode: "060300",
        inx: "securitysetting",
        crumb: "密保设置",
        attr: {
          hlink: 1,
          href:
            "https://login.10086.cn/security/questionDetail.htm?backurl=" +
            c.getWebAddress(),
        },
        belongto: "2",
      },
      {
        funcode: "060400",
        inx: "loginsafe",
        crumb: "登录安全",
        attr: {
          hlink: 1,
          href:
            "https://login.10086.cn/protect/protect_web.htm?backurl=" +
            c.getWebAddress(),
        },
        belongto: "2",
      },
      {
        funcode: "060500",
        inx: "passwordmg",
        crumb: "密码管理",
        attr: {
          hlink: 1,
          href:
            "https://login.10086.cn/account/myHome.htm?backurl=" +
            c.getWebAddress(),
        },
        belongto: "2",
      },
      {
        funcode: "042000",
        inx: "rechargebroband",
        belongto: "2",
        crumb: "宽带交费",
      },
      {
        funcode: "044000",
        inx: "rechargelandline",
        belongto: "2",
        crumb: "固话交费",
      },
      {
        funcode: "021800",
        inx: "mybroadband",
        belongto: "2",
        crumb: "我的宽带",
      },
      {
        funcode: "011500",
        inx: "newBroadBandOrder",
        belongto: "2",
        crumb: "宽带订单",
      },
      {
        funcode: "",
        inx: "mobilebusiness",
        name: "省份业务专区",
        crumb: "省份业务专区",
      },
      {
        funcode: "011700",
        inx: "familyorder",
        belongto: "2",
        crumb: "业务办理类订单",
      },
      {
        funcode: "080000",
        inx: "characteristic",
        imginx: "8",
        crumb: "特色专区",
      },
      {
        funcode: "080001",
        inx: "emergency",
        crumb: "紧急开机",
        attr: {
          hlink: 1,
          href: "http://hl.10086.cn/apps/busi/semergency/sEmergencyBoot.html",
          belongto: "2",
        },
      },
      {
        funcode: "080002",
        inx: "guarantee",
        crumb: "担保开机",
        attr: {
          hlink: 1,
          href: "http://hl.10086.cn/apps/busi/semergency/sAssureBoot.html",
          belongto: "2",
        },
      },
      {
        funcode: "080003",
        inx: "newspaperstop",
        crumb: "手机报停",
        attr: {
          hlink: 1,
          href: "http://hl.10086.cn/apps/busi/stop-phone/stop-phone.html",
          belongto: "2",
        },
      },
      {
        funcode: "080004",
        inx: "forwardset",
        crumb: "呼叫转移设置",
        attr: {
          hlink: 1,
          href: "http://hl.10086.cn/apps/busi/call-shift/call-shift.html",
          belongto: "2",
        },
      },
      {
        funcode: "080005",
        inx: "callwait",
        crumb: "呼叫等待",
        attr: {
          hlink: 1,
          href: "http://hl.10086.cn/apps/busi/call-wait/call-wait.html",
          belongto: "2",
        },
      },
      {
        funcode: "080006",
        inx: "cryptographic",
        crumb: "密码服务",
        attr: {
          hlink: 1,
          href: "http://hl.10086.cn/apps/busi/pwd-manage/pwd-manage.html",
          belongto: "2",
        },
      },
      {
        funcode: "080007",
        inx: "shutdown",
        crumb: "停开机",
        attr: {
          hlink: 1,
          href: "http://www.ln.10086.cn/service/static/doBusiness/stopOrOpen.html",
          belongto: "2",
        },
      },
      {
        funcode: "080008",
        inx: "trafficshar",
        crumb: "亲情网流量共享",
        attr: {
          hlink: 1,
          href: "http://www.ln.10086.cn/service/static/doBusiness/userRelationQqwgx.html",
          belongto: "2",
        },
      },
      {
        funcode: "080009",
        inx: "spenquiry",
        crumb: "sp业务查询",
        attr: {
          hlink: 1,
          href: "http://www.ln.10086.cn/service/static/myMobile/querySpBusi.html",
          belongto: "2",
        },
      },
      {
        funcode: "080010",
        inx: "spincrement",
        crumb: "sp增值服务商查询",
        attr: {
          hlink: 1,
          href: "http://www.ln.10086.cn/service/static/myMobile/querySpBusiUser.html",
          belongto: "2",
        },
      },
      {
        funcode: "080011",
        inx: "delay",
        crumb: "充值卡延期",
        attr: {
          hlink: 1,
          href: "http://www.ln.10086.cn/service/static/myMobile/cardRecharge.html",
          belongto: "2",
        },
      },
      {
        funcode: "080012",
        inx: "mobilemall",
        crumb: "手机/号卡商城",
        attr: {
          hlink: 1,
          href: "https://www.xj.10086.cn/mall/",
          belongto: "2",
        },
      },
      {
        funcode: "080013",
        inx: "redeem",
        crumb: "AI豆兑换",
        attr: {
          hlink: 1,
          href: "https://www.xj.10086.cn/pservice/exScore/res_ht/scoreExDisc.html?ID=2018051100010357",
          belongto: "2",
        },
      },
      {
        funcode: "080014",
        inx: "broadband",
        crumb: "我的宽带",
        attr: {
          hlink: 1,
          href: "https://www.xj.10086.cn/pservice/homeBroadBand/myBroadbandHtml/broadBandInfoShutdown.html",
          belongto: "2",
        },
      },
      {
        funcode: "080015",
        inx: "uyghur",
        crumb: "维文网厅",
        attr: {
          hlink: 1,
          href: "http://www.xj.10086.cn/uyghur/app",
          belongto: "2",
        },
      },
      {
        funcode: "080016",
        inx: "loss",
        crumb: "挂失/解挂",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T19yETByY_1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080017",
        inx: "fwservice",
        crumb: "流量提醒服务",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/static/myMobile/accountBalanceRemind.html?id=flow",
          belongto: "2",
        },
      },
      {
        funcode: "080018",
        inx: "shutdown",
        crumb: "停开机",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T19tETByV_1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080019",
        inx: "sopening",
        crumb: "4G服务开通",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T19RETByJ_1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080020",
        inx: "callerid",
        crumb: "来电显示",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T18aJTByLT1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080021",
        inx: "callhold",
        crumb: "呼叫保持",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T18RJTByLT1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080022",
        inx: "callwaiting",
        crumb: "呼叫等待",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T18tJTByLT1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080023",
        inx: "partycall",
        crumb: "三方通话",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T18yJTByLT1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080024",
        inx: "gprs",
        crumb: "GPRS",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/template/T1EtJTByLT1RXx1p6K.html",
          belongto: "2",
        },
      },
      {
        funcode: "080025",
        inx: "feeinformation",
        crumb: "订制话费信息",
        attr: {
          hlink: 1,
          href: "https://www.hn.10086.cn/service/static/myMobile/accountBalanceRemind.html",
          belongto: "2",
        },
      },
      {
        funcode: "080026",
        inx: "mallorder",
        crumb: "商城订单",
        attr: {
          hlink: 1,
          href: "http://www.hn.10086.cn/shop/myOrder/toMyAllOrderList",
          belongto: "2",
        },
      },
      {
        funcode: "080027",
        inx: "custstarQuery",
        crumb: "客户星级评定查询",
        attr: {
          hlink: 1,
          href: "http://www.hl.10086.cn/apps/qry/custstar-query/custstar-query.html",
          belongto: "2",
        },
      },
      {
        funcode: "080028",
        inx: "orderList",
        crumb: "订单查询",
        attr: {
          hlink: 1,
          href: "http://www.hl.10086.cn/apps/qry/order-info-query/get-order-list.html",
          belongto: "2",
        },
      },
      {
        funcode: "080029",
        inx: "crbt",
        crumb: "彩铃",
        attr: {
          hlink: 1,
          href: "http://hl.10086.cn/apps/login/ssoLoginBox.html#http://www.hl.10086.cn/apps/busi/crbt/crbt.html",
          belongto: "2",
        },
      },
      {
        funcode: "080030",
        inx: "eInvoice",
        crumb: "电子发票",
        attr: {
          hlink: 1,
          href: "http://service.gx.10086.cn/operate/dzfpdz.jsp",
          belongto: "2",
        },
      },
      {
        funcode: "080031",
        inx: "myOrder",
        crumb: "我的订单",
        attr: {
          hlink: 1,
          href: "http://service.gx.10086.cn/operate/wddd_3.jsp",
          belongto: "2",
        },
      },
      {
        funcode: "080032",
        inx: "friendship",
        crumb: "广西亲情网",
        attr: {
          hlink: 1,
          href: "http://service.gx.10086.cn/operate/homeunlimit.jsp",
          belongto: "2",
        },
      },
      {
        funcode: "080033",
        inx: "appointment",
        crumb: "营业厅预约选号",
        attr: {
          hlink: 1,
          href: "http://service.gx.10086.cn/card/plan/index2.jsp",
          belongto: "2",
        },
      },
      {
        funcode: "080034",
        inx: "queryRealName",
        crumb: "实名制查询",
        attr: {
          hlink: 1,
          href: "https://service.cq.10086.cn/myMobile/queryRealName.html",
          belongto: "2",
        },
      },
      {
        funcode: "080035",
        inx: "starServiceIndex",
        crumb: "星级服务",
        attr: {
          hlink: 1,
          href: "https://service.cq.10086.cn/act/starservice/StarServiceIndex.html",
          belongto: "2",
        },
      },
      {
        funcode: "080036",
        inx: "searchAddress",
        crumb: "小区覆盖查询",
        attr: {
          hlink: 1,
          href: "https://service.cq.10086.cn/broadBrand/SearchAddress.html",
          belongto: "2",
        },
      },
      {
        funcode: "080037",
        inx: "fluxBill",
        crumb: "流量账单",
        attr: {
          hlink: 1,
          href: "https://service.cq.10086.cn/myMobile/fluxBill.html",
          belongto: "2",
        },
      },
      {
        funcode: "080038",
        inx: "remainSet",
        crumb: "提醒设置",
        attr: {
          hlink: 1,
          href: "https://service.cq.10086.cn/myMobile/RemainSet.html",
          belongto: "2",
        },
      },
      {
        funcode: "080039",
        inx: "terminalShare",
        crumb: "多终端共享",
        attr: {
          hlink: 1,
          href: "https://service.cq.10086.cn/myMobile/terminalShare.html",
          belongto: "2",
        },
      },
    ],
    h = [
      {
        funcode: "040100",
        inx: "rechargecredit",
        crumb: ["商城", "个人中心", "银行卡充值"],
        belongto: "2",
        imgInx: "18",
      },
      {
        funcode: "010800",
        inx: "rechargerecord",
        crumb: ["商城", "个人中心", "充值订单"],
        belongto: "2",
        imgInx: "22",
      },
      {
        funcode: "010801",
        inx: "rechargeurecord",
        crumb: ["商城", "个人中心", "充值订单"],
        belongto: "2",
        imgInx: "22",
      },
      {
        funcode: "010600",
        inx: "myorders",
        crumb: ["商城", "个人中心", "商品订单"],
        belongto: "2",
        imgInx: "16",
      },
      {
        funcode: "010400",
        inx: "myfav",
        crumb: ["商城", "个人中心", "我的收藏"],
        belongto: "2",
        imgInx: "12",
      },
      {
        funcode: "010300",
        inx: "recaddrmag",
        crumb: ["商城", "个人中心", "收货地址"],
        belongto: "2",
        imgInx: "8",
      },
      {
        funcode: "010200",
        inx: "invoicemag",
        crumb: ["商城", "个人中心", "发票信息"],
        belongto: "2",
        imgInx: "10",
      },
      {
        funcode: "010700",
        inx: "mypreorders",
        crumb: ["商城", "个人中心", "预购订单"],
        belongto: "2",
        imgInx: "14",
      },
      {
        funcode: "040200",
        inx: "rechargecard",
        crumb: ["商城", "个人中心", "充值卡充值"],
        belongto: "2",
        imgInx: "20",
      },
    ],
    a = function (c, a) {
      var g = "";
      switch (a) {
        case 0:
          g = b[0];
          for (var i = 0; i < b.length; i++)
            if (b[i].funcode == c) {
              g = b[i];
              break;
            }
          break;
        case 1:
          g = h[0];
          for (var i = 0; i < h.length; i++)
            if (h[i].funcode == c) {
              g = h[i];
              break;
            }
      }
      return g;
    },
    g = function (c, a) {
      var g = "";
      switch (a) {
        case 0:
          g = b[0];
          for (var i = 0; i < b.length; i++)
            if (b[i].inx == c) {
              g = b[i];
              break;
            }
          break;
        case 1:
          g = h[0];
          for (var i = 0; i < h.length; i++)
            if (h[i].inx == c) {
              g = h[i];
              break;
            }
      }
      return g;
    },
    w = function (c) {
      for (var h = !1, i = 0; i < b.length; i++)
        if (c == b[i].inx) {
          h = !0;
          break;
        }
      return h;
    };
  return {
    joinJson: function (c, b) {
      var h = a(c.funcode, b);
      for (var g in h) {
        var w = h[g];
        "funcode" != g && (c[g] = w);
      }
      return (
        (c.crumb =
          "070000" == c.funcode
            ? ["商城", c.name]
            : ["商城", "个人中心", c.name]),
        c
      );
    },
    getObject: function (c, b) {
      return a(c, b);
    },
    getObjectByName: function (c, b) {
      return g(c, b);
    },
    isMenuItem: function (c) {
      return w(c);
    },
  };
});
