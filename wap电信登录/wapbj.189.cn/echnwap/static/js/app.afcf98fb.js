(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["app"],
  {
    0: function (n, e, t) {
      n.exports = t("56d7");
    },
    "0682": function (n, e, t) {
      "use strict";
      t("b277");
    },
    1: function (n, e) {},
    "1be0": function (n, e, t) {},
    "2f1b": function (n, e, t) {},
    "41cb": function (n, e, t) {
      "use strict";
      var r = t("5530"),
        a =
          (t("d3b7"),
          t("3ca3"),
          t("ddb0"),
          t("b0c0"),
          t("ac1f"),
          t("5319"),
          t("fb6a"),
          t("1276"),
          t("2b0e")),
        o = t("8c4f"),
        u = t("4ec3");
      function c() {
        var n = new Date(),
          e = n.getFullYear(),
          t = n.getMonth() + 1;
        t >= 1 && t <= 9 && (t = "0" + t);
        var r = new Date(e, t, 0),
          a = r.getDate();
        a >= 0 && a <= 9 && (a = "0" + a);
        var o = e + "" + t + a + "21";
        return o;
      }
      function i() {
        var n = new Date(),
          e = n.getFullYear(),
          t = n.getMonth() + 2;
        return t >= 1 && t <= 9 && (t = "0" + t), e + "" + t + "0100";
      }
      function l() {
        var n = new Date(),
          e = n.getMonth() + 1,
          t = n.getDate(),
          r = n.getHours();
        e >= 1 && e <= 9 && (e = "0" + e),
          t >= 0 && t <= 9 && (t = "0" + t),
          r >= 0 && r <= 9 && (r = "0" + r);
        var a = n.getFullYear() + "" + e + t + r;
        return a;
      }
      function d() {
        var n = window.noticTypeUnchack + "",
          e = c(),
          t = l(),
          r = i(),
          a = !0;
        "uncheck" == n && (a = !1),
          a &&
            e <= t &&
            t < r &&
            (location.href =
              "https://wapbj.189.cn/echnwap/announDetail?busiType=common");
      }
      function p() {
        var n = new Date(),
          e = n.getFullYear(),
          t = n.getMonth() + 1;
        t >= 1 && t <= 9 && (t = "0" + t);
        var r = new Date(e, t, 0),
          a = r.getDate();
        a >= 0 && a <= 9 && (a = "0" + a);
        var o = e + "" + t + a + "22";
        return o;
      }
      function h() {
        var n = window.noticTypeUnchack + "",
          e = p(),
          t = l(),
          r = i(),
          a = !0;
        "uncheck" == n && (a = !1),
          a &&
            e <= t &&
            t < r &&
            (location.href =
              "https://wapbj.189.cn/echnwap/announDetail?busiType=signOrder");
      }
      t("caad"), t("2532");
      function s() {
        var n = window.location.href,
          e = {
            systemName: "月末不加公告清单系统",
            links: [
              {
                linkName: "公告页",
                linkUrl: "https://wapbj.189.cn/echnwap/announDetail",
              },
              {
                linkName: "预约过户资料填写页",
                linkUrl: "https://wapbj.189.cn/echnwap/AppointmentTransfer",
              },
              {
                linkName: "预约过户结果页",
                linkUrl: "https://wapbj.189.cn/echnwap/AppointmentResult",
              },
              {
                linkName: "预约过户我的订单",
                linkUrl: "https://wapbj.189.cn/echnwap/AppointmentOrder",
              },
              {
                linkName: "预约过户订单详情",
                linkUrl:
                  "https://wapbj.189.cn/echnwap/AppointmentOrderDetailed",
              },
              {
                linkName: "诈骗电话举报",
                linkUrl: "https://wapbj.189.cn/echnwap/FraudReport",
              },
              {
                linkName: "补换卡身份验证",
                linkUrl:
                  "https://wapbj.189.cn/echnwap/Authentication_ReplaceCard",
              },
              {
                linkName: "特色业务",
                linkUrl: "https://wapbj.189.cn/echnwap/FeaturedBusiness",
              },
              {
                linkName: "补换卡登录",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountLandCard",
              },
              {
                linkName: "补换卡业务办理",
                linkUrl: "https://wapbj.189.cn/echnwap/dealwithOnline",
              },
              {
                linkName: "号卡激活业务",
                linkUrl: "https://wapbj.189.cn/echnwap/activationForm",
              },
              {
                linkName: "号卡激活校验",
                linkUrl: "https://wapbj.189.cn/echnwap/JcardLand",
              },
              {
                linkName: "补换卡业务订单",
                linkUrl: "https://wapbj.189.cn/echnwap/BcardOrder",
              },
              {
                linkName: "补换卡结果",
                linkUrl: "https://wapbj.189.cn/echnwap/WaitResult",
              },
              {
                linkName: "激活结果",
                linkUrl: "https://wapbj.189.cn/echnwap/WaitResultb",
              },
              {
                linkName: "补换卡物流信息",
                linkUrl: "https://wapbj.189.cn/echnwap/BcardyLogistics",
              },
              {
                linkName: "实名补拍登录",
                linkUrl: "https://wapbj.189.cn/echnwap/RealnameLand",
              },
              {
                linkName: "实名补拍验证",
                linkUrl: "https://wapbj.189.cn/echnwap/Authentication_Realname",
              },
              {
                linkName: "补拍订单",
                linkUrl: "https://wapbj.189.cn/echnwap/RealnameOrder",
              },
              {
                linkName: "补拍办理结果",
                linkUrl: "https://wapbj.189.cn/echnwap/StatusResult",
              },
              {
                linkName: "实人认证验证",
                linkUrl:
                  "https://wapbj.189.cn/echnwap/Authentication_RealPerson",
              },
              {
                linkName: "实人认证活体结果",
                linkUrl: "https://wapbj.189.cn/echnwap/EntityResult",
              },
              {
                linkName: "实人认证结果",
                linkUrl: "https://wapbj.189.cn/echnwap/HujinResult",
              },
              {
                linkName: "投诉与建议",
                linkUrl: "https://wapbj.189.cn/echnwap/ComplaintSuggestions",
              },
              {
                linkName: "投诉单进展",
                linkUrl: "https://wapbj.189.cn/echnwap/ComplaintProgress",
              },
              {
                linkName: "投诉单列表",
                linkUrl: "https://wapbj.189.cn/echnwap/ComplaintList",
              },
              {
                linkName: "故障单查询",
                linkUrl: "https://wapbj.189.cn/echnwap/FaultSearch",
              },
              {
                linkName: "故障单申告",
                linkUrl: "https://wapbj.189.cn/echnwap/FaultDeclaration",
              },
              {
                linkName: "故障单查询",
                linkUrl: "https://wapbj.189.cn/echnwap/FaultQuery",
              },
              {
                linkName: "故障单查询结果",
                linkUrl: "https://wapbj.189.cn/echnwap/FaultQueryResult",
              },
              {
                linkName: "puk码查询",
                linkUrl: "https://wapbj.189.cn/echnwap/PukQuery",
              },
              {
                linkName: "信用度查询",
                linkUrl: "https://wapbj.189.cn/echnwap/CreditSearch",
              },
              {
                linkName: "信用度调整",
                linkUrl: "https://wapbj.189.cn/echnwap/CreditAdjust",
              },
              {
                linkName: "主副卡余额查询",
                linkUrl: "https://wapbj.189.cn/echnwap/CardQuery",
              },
              {
                linkName: "余额明细",
                linkUrl: "https://wapbj.189.cn/echnwap/AmountDetailed",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/recharge",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/rechargeNI",
              },
              {
                linkName: "IPTV充值查询",
                linkUrl: "https://wapbj.189.cn/echnwap/IptvQuery",
              },
              {
                linkName: "IPTV充值查询满屏",
                linkUrl: "https://wapbj.189.cn/echnwap/IptvQueryb",
              },
              {
                linkName: "支付主页",
                linkUrl: "https://wapbj.189.cn/echnwap/PayHome",
              },
              {
                linkName: "支付结果",
                linkUrl: "https://wapbj.189.cn/echnwap/PayStatus",
              },
              {
                linkName: "电子发票",
                linkUrl: "https://wapbj.189.cn/echnwap/InvoiceHome",
              },
              {
                linkName: "开票说明",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceExplain",
              },
              {
                linkName: "常见问题",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceQuestion",
              },
              {
                linkName: "发票抬头设置",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceInfoPage",
              },
              {
                linkName: "开发票",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceSubmit",
              },
              {
                linkName: "查看发票",
                linkUrl: "https://wapbj.189.cn/echnwap/InvoiceDetailed",
              },
              {
                linkName: "查看发票",
                linkUrl: "https://wapbj.189.cn/echnwap/AcceptedInvoice",
              },
              {
                linkName: "电子发票",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceHomeGM",
              },
              {
                linkName: "开票说明",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceExplainGM",
              },
              {
                linkName: "常见问题",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceQuestionGM",
              },
              {
                linkName: "发票抬头设置",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceInfoPageGM",
              },
              {
                linkName: "开发票",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceSubmitGM",
              },
              {
                linkName: "查看发票",
                linkUrl: "https://wapbj.189.cn/echnwap/InvoiceDetailedGM",
              },
              {
                linkName: "查看发票",
                linkUrl: "https://wapbj.189.cn/echnwap/AcceptedInvoiceGM",
              },
              {
                linkName: "线上销户登录",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountLand",
              },
              {
                linkName: "线上销户查询",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountLandb",
              },
              {
                linkName: "销户欠费",
                linkUrl: "https://wapbj.189.cn/echnwap/ArrearsBackup",
              },
              {
                linkName: "销户申请",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountList",
              },
              {
                linkName: "销户受理中",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountAccept",
              },
              {
                linkName: "销户失败",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountFail",
              },
              {
                linkName: "销户退款",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountDrawback",
              },
              {
                linkName: "销户退款",
                linkUrl: "https://wapbj.189.cn/echnwap/ResultFeedback",
              },
              {
                linkName: "销户退款",
                linkUrl: "https://wapbj.189.cn/echnwap/AffirmDrawback",
              },
              {
                linkName: "认证结果",
                linkUrl: "https://wapbj.189.cn/echnwap/AuthResult",
              },
            ],
          };
        for (var t in ((n = n.includes("?")
          ? n.split("?")[0].split("/").pop().toLowerCase()
          : n.split("/").pop().toLowerCase()),
        e.links))
          if (e.links[t].linkUrl.split("/").pop().toLowerCase() == n) return !0;
        return (
          "https://wapbj.189.cn/wap2017/index/card_Active.html?I6tyMOju=qarhrakvy5Ivy5IvyCSv_HS87FI_5nfldy_eJtSQmWQqqqqqqqqqqqqqya" ==
          window.location.href
        );
      }
      function m() {
        var n = window.location.href;
        n = n.includes("?")
          ? n.split("?")[0].split("/").pop().toLowerCase()
          : n.split("/").pop().toLowerCase();
        var e = {
          systemName: "签字名单（月末22点专用拦截）",
          links: [
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_New",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_SuppleSign",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_Company",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_CNew",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_CNew_2",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_Fusion",
            },
            {
              linkName: "协议单签字",
              linkUrl:
                "https://wapbj.189.cn/echnwap/EshopQuickSign_FusionFrist",
            },
            {
              linkName: "协议单签字",
              linkUrl:
                "https://wapbj.189.cn/echnwap/EshopQuickSign_FusionRegist",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_FusionPay",
            },
            {
              linkName: "融合业务支付",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_FusionPay",
            },
            {
              linkName: "协议单签字",
              linkUrl:
                "https://wapbj.189.cn/echnwap/EshopQuickSign_FusionResult",
            },
            {
              linkName: "融合业务结果",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_FusionResult",
            },
            {
              linkName: "协议单签字",
              linkUrl:
                "https://wapbj.189.cn/echnwap/EshopQuickSign_Fusion_AuthResult",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_Fusion",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_FusionFrist",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/EshopQuickSign_MultiSign",
            },
            {
              linkName: "批量协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_MultiSign",
            },
            {
              linkName: "补换卡签字",
              linkUrl:
                "https://wapbj.189.cn/echnwap/EshopQuickSign_replaceCard",
            },
            {
              linkName: "补换卡签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_replaceCard",
            },
            {
              linkName: "混合业务首页",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_FusionRegist",
            },
            {
              linkName: "混合业务实名认证结果",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_Fusion_AuthResult",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_SuppleSign",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_CNew",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_CNew_2",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_Company",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_NNew",
            },
            {
              linkName: "协议单签字",
              linkUrl: "https://wapbj.189.cn/echnwap/Sign_Sign",
            },
          ],
        };
        for (var t in e.links)
          if (e.links[t].linkUrl.split("/").pop().toLowerCase() == n) return !0;
        return !1;
      }
      function f(n) {
        var e = n,
          t = {
            systemName: "跳转登录页清单系统",
            links: [
              {
                linkName: "视频彩铃",
                linkUrl: "https://wapbj.189.cn/echnwap/VideoRBT",
              },
              {
                linkName: "来电名片",
                linkUrl: "https://wapbj.189.cn/echnwap/CardHomePage",
              },
              {
                linkName: "停机保号",
                linkUrl: "https://wapbj.189.cn/echnwap/ShutdownKeep",
              },
              {
                linkName: "已订业务退订",
                linkUrl: "https://wapbj.189.cn/echnwap/BusinessUnsubscribe",
              },
              {
                linkName: "增值业务查询及退订一键诊断",
                linkUrl:
                  "https://wapbj.189.cn/echnwap/diagnosisPage_BusinessUnsubscribe",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/recharge",
              },
              {
                linkName: "副卡办理",
                linkUrl: "https://wapbj.189.cn/echnwap/retrofittingCard",
              },
              {
                linkName: "智能推荐",
                linkUrl: "https://wapbj.189.cn/echnwap/PopularRecom",
              },
              {
                linkName: "流量包退订",
                linkUrl: "https://wapbj.189.cn/echnwap/UnsubscribePage",
              },
              {
                linkName: "流量包聚合页",
                linkUrl: "https://wapbj.189.cn/echnwap/TrafficPacket",
              },
              {
                linkName: "电子发票",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceHome",
              },
              {
                linkName: "发票抬头设置",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceInfoPage",
              },
              {
                linkName: "呼叫转移",
                linkUrl:
                  "https://wapbj.189.cn/echnwap/CallForwarding?serv_code=Business_HZSZ_01",
              },
              {
                linkName: "信用度调整",
                linkUrl: "https://wapbj.189.cn/echnwap/CreditAdjust",
              },
              {
                linkName: "阈值提醒",
                linkUrl: "https://wapbj.189.cn/echnwap/thresholdAlert",
              },
            ],
          };
        for (var r in t.links)
          if (
            e
              .toLowerCase()
              .indexOf(t.links[r].linkUrl.split("/").pop().toLowerCase()) > -1
          ) {
            var a = t.links[r].linkName;
            return (
              "来电名片" == t.links[r].linkName &&
                (e.indexOf("on_hook") > -1 && (a = "挂机短信"),
                e.indexOf("month_voice_pack") > -1 && (a = "包月语音包"),
                e.indexOf("business_card") > -1 && (a = "个人名片")),
              { status: !0, linkName: a }
            );
          }
      }
      function b(n) {
        var e = n,
          t = {
            systemName: "跳转登录页清单系统",
            links: [
              {
                linkName: "视频彩铃",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountLands_final",
              },
              {
                linkName: "来电名片",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountLandb_final",
              },
              {
                linkName: "停机保号",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountSelect_final",
              },
              {
                linkName: "已订业务退订",
                linkUrl: "https://wapbj.189.cn/echnwap/ArrearsBackup_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountList_final",
              },
              {
                linkName: "充值缴费",
                linkUrl:
                  "https://wapbj.189.cn/echnwap/AccountListComplain_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountBroad_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountAccept_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountFail_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountDrawback_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/ResultFeedback_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AffirmDrawback_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/contractPay_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/contractPayResult_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AuthResult_final",
              },
              {
                linkName: "充值缴费",
                linkUrl: "https://wapbj.189.cn/echnwap/AccountPayResult_final",
              },
            ],
          };
        for (var r in t.links)
          if (
            e
              .toLowerCase()
              .indexOf(t.links[r].linkUrl.split("/").pop().toLowerCase()) > -1
          )
            return { status: !0, linkName: linkName };
      }
      function k(n) {
        var e = n,
          t = {
            systemName: "未登录跳转页面",
            links: [
              {
                linkName: "补卡身份验证",
                linkUrl:
                  "https://wapbj.189.cn/echnwap/Authentication_ReplaceCardOffline",
              },
            ],
          };
        for (var r in t.links)
          if (
            e
              .toLowerCase()
              .indexOf(t.links[r].linkUrl.split("/").pop().toLowerCase()) > -1
          )
            return { status: !0 };
      }
      function w(n) {
        var e = n,
          t = {
            systemName: "跳转闺蜜机登录页清单系统",
            links: [
              {
                linkName: "电子发票",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceHomeGM",
              },
              {
                linkName: "开票说明",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceExplainGM",
              },
              {
                linkName: "常见问题",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceQuestionGM",
              },
              {
                linkName: "发票抬头设置",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceInfoPageGM",
              },
              {
                linkName: "开发票",
                linkUrl: "https://wapbj.189.cn/echnwap/invoiceSubmitGM",
              },
              {
                linkName: "查看发票",
                linkUrl: "https://wapbj.189.cn/echnwap/InvoiceDetailedGM",
              },
              {
                linkName: "查看发票",
                linkUrl: "https://wapbj.189.cn/echnwap/AcceptedInvoiceGM",
              },
              {
                linkName: "主副卡余额查询",
                linkUrl: "https://wapbj.189.cn/echnwap/CardQueryGM",
              },
              {
                linkName: "使用量查询",
                linkUrl: "https://wapbj.189.cn/echnwap/UsageInquiry",
              },
              {
                linkName: "话费账单",
                linkUrl: "https://wapbj.189.cn/echnwap/PhoneBill",
              },
            ],
          };
        for (var r in t.links)
          if (
            e
              .toLowerCase()
              .indexOf(t.links[r].linkUrl.split("/").pop().toLowerCase()) > -1
          ) {
            var a = t.links[r].linkName;
            return { status: !0, linkName: a };
          }
      }
      function g(n) {
        var e = n,
          t = {
            systemName: "跳转滑块验证码登录页清单",
            links: [
              {
                linkName: "已订业务退订",
                linkUrl: "https://wapbj.189.cn/echnwap/BusinessUnsubscribe",
              },
              {
                linkName: "信用度调整",
                linkUrl: "https://wapbj.189.cn/echnwap/CreditAdjust",
              },
            ],
          };
        for (var r in t.links)
          if (
            e
              .toLowerCase()
              .indexOf(t.links[r].linkUrl.split("/").pop().toLowerCase()) > -1
          )
            return { status: !0, linkName: t.links[r].linkName };
      }
      var C = t("ed08"),
        P = t("fb91");
      a["a"].use(o["a"]);
      var y = new o["a"]({
        mode: "history",
        base: "/echnwap/",
        routes: [
          { path: "/", redirect: "/Marketing" },
          {
            path: "/recharge",
            name: "充值缴费",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-c9db57a2"),
                t.e("chunk-636ed49a"),
              ]).then(t.bind(null, "84ac"));
            },
          },
          {
            path: "/rechargeNI",
            name: "充值缴费",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-c9db57a2"),
                t.e("chunk-3252f0de"),
              ]).then(t.bind(null, "d9b3"));
            },
          },
          {
            path: "/IptvQuery",
            name: "IPTV充值查询",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-82f50694"),
              ]).then(t.bind(null, "40ab"));
            },
          },
          {
            path: "/IptvQueryb",
            name: "IPTV充值查询满屏",
            component: function () {
              return t.e("chunk-7f0cc07e").then(t.bind(null, "4ac9"));
            },
          },
          {
            path: "/PayHome",
            name: "支付主页",
            component: function () {
              return t.e("chunk-3baace8e").then(t.bind(null, "cfd4"));
            },
          },
          {
            path: "/PayHomeToB",
            name: "支付主页",
            component: function () {
              return t.e("chunk-6c98f31e").then(t.bind(null, "bb40"));
            },
          },
          {
            path: "/PayStatus",
            name: "支付结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-0d202cc7"),
              ]).then(t.bind(null, "c557"));
            },
          },
          {
            path: "/PayStatusToB",
            name: "支付结果",
            component: function () {
              return t.e("chunk-6cd29189").then(t.bind(null, "00ec"));
            },
          },
          {
            path: "/Marketing",
            name: "特色业务",
            component: function () {
              return t.e("chunk-7d59adfc").then(t.bind(null, "b70e"));
            },
          },
          {
            path: "/announList",
            name: "历史公告",
            component: function () {
              return t.e("chunk-362bf79e").then(t.bind(null, "b43d"));
            },
          },
          {
            path: "/announDetail",
            name: "公告",
            component: function () {
              return t.e("chunk-8631d4c2").then(t.bind(null, "7f30"));
            },
          },
          {
            path: "/invoiceHome",
            name: "电子发票",
            component: function () {
              return t.e("chunk-0d3e0a2e").then(t.bind(null, "e454"));
            },
          },
          {
            path: "/invoiceExplain",
            name: "开票说明",
            component: function () {
              return t.e("chunk-4fd0fc76").then(t.bind(null, "1873"));
            },
          },
          {
            path: "/invoiceQuestion",
            name: "常见问题",
            component: function () {
              return t.e("chunk-54dccb6e").then(t.bind(null, "0d30"));
            },
          },
          {
            path: "/invoiceInfoPage",
            name: "发票抬头设置",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-167b298a"),
              ]).then(t.bind(null, "4db6"));
            },
          },
          {
            path: "/invoiceSubmit",
            name: "开发票",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-4dd7de24"),
                t.e("chunk-163f8756"),
                t.e("chunk-6463c298"),
              ]).then(t.bind(null, "4ef2"));
            },
          },
          {
            path: "/invoiceDetail",
            name: "查看发票",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-4dd7de24"),
                t.e("chunk-60ce0830"),
              ]).then(t.bind(null, "53d8"));
            },
          },
          {
            path: "/acceptedInvoice",
            name: "查看发票",
            component: function () {
              return t.e("chunk-78a178a9").then(t.bind(null, "76a7"));
            },
          },
          {
            path: "/CardQuery",
            name: "主副卡余额查询",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-67ce89b4"),
              ]).then(t.bind(null, "7ed81"));
            },
          },
          {
            path: "/OrangeInstallment",
            name: "橙分期",
            component: function () {
              return t.e("chunk-360944be").then(t.bind(null, "134a"));
            },
          },
          {
            path: "/AmountDetailed",
            name: "余额明细",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-90ad22d2"),
              ]).then(t.bind(null, "4bcc"));
            },
          },
          {
            path: "/CardSplitLand",
            name: "线上拆分主副卡登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-ed9047b8"),
              ]).then(t.bind(null, "67d6"));
            },
          },
          {
            path: "/CardSplitNumber",
            name: "线上拆分主副卡",
            component: function () {
              return t.e("chunk-b62f8edc").then(t.bind(null, "c2fc"));
            },
          },
          {
            path: "/CardSplitPackage",
            name: "选择套餐",
            component: function () {
              return t.e("chunk-777268e2").then(t.bind(null, "ca5ea"));
            },
          },
          {
            path: "/pageImage",
            name: "中国电信",
            component: function () {
              return t.e("chunk-68c4d9ae").then(t.bind(null, "e149"));
            },
          },
          {
            path: "/CardSplitConfirm",
            name: "套餐确认",
            component: function () {
              return t.e("chunk-2c8dda52").then(t.bind(null, "9b5a"));
            },
          },
          {
            path: "/Authentication_CardSplit",
            name: "线上拆分主副卡身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-7bf7d6c8"),
              ]).then(t.bind(null, "82b1"));
            },
          },
          {
            path: "/CardSplitActive",
            name: "线上拆分主副卡验证结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-3857bda9"),
              ]).then(t.bind(null, "6fe5"));
            },
          },
          {
            path: "/CardSplitResult",
            name: "线上拆分主副卡办理结果",
            component: function () {
              return t.e("chunk-f55ec242").then(t.bind(null, "1b9d"));
            },
          },
          {
            path: "/BroadDisassembly",
            name: "宽带预约拆机",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-a53519a6"),
              ]).then(t.bind(null, "9c16"));
            },
          },
          {
            path: "/Authentication_BroadDisassembly",
            name: "宽带预约拆机实人认证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-6ff12b06"),
              ]).then(t.bind(null, "c4d3"));
            },
          },
          {
            path: "/AuthResult_BroadDisassembly",
            name: "宽带预约拆机实人认证结果页面",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-50a7e2c7"),
              ]).then(t.bind(null, "4771"));
            },
          },
          {
            path: "/BroadDisassemblyOrder",
            name: "宽带预约拆机查询结果",
            component: function () {
              return t.e("chunk-18c3ed5f").then(t.bind(null, "488e"));
            },
          },
          {
            path: "/ResourceQuery",
            name: "宽带资源查询",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-19cd044d"),
              ]).then(t.bind(null, "bc1a"));
            },
          },
          {
            path: "/SearchQueryMap",
            name: "宽带资源查询",
            component: function () {
              return t.e("chunk-f69ead90").then(t.bind(null, "a324"));
            },
          },
          {
            path: "/AccountLand",
            name: "线上销户登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2604a93e"),
              ]).then(t.bind(null, "32daa"));
            },
          },
          {
            path: "/AccountLandb",
            name: "线上销户查询",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-dc287954"),
              ]).then(t.bind(null, "5030f"));
            },
          },
          {
            path: "/ArrearsBackup",
            name: "销户欠费",
            component: function () {
              return t.e("chunk-189b5346").then(t.bind(null, "e118"));
            },
          },
          {
            path: "/AccountList",
            name: "销户申请",
            component: function () {
              return t.e("chunk-99af461e").then(t.bind(null, "e3b1"));
            },
          },
          {
            path: "/AccountAccept",
            name: "销户受理中",
            component: function () {
              return t.e("chunk-2af326d5").then(t.bind(null, "47e7"));
            },
          },
          {
            path: "/AccountFail",
            name: "销户失败",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-d0e15096"),
              ]).then(t.bind(null, "a53c"));
            },
          },
          {
            path: "/AccountDrawback",
            name: "销户退款",
            component: function () {
              return t.e("chunk-dd3eb46e").then(t.bind(null, "7700"));
            },
          },
          {
            path: "/ResultFeedback",
            name: "销户退款",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-106d7c43"),
              ]).then(t.bind(null, "2512"));
            },
          },
          {
            path: "/AffirmDrawback",
            name: "销户退款",
            component: function () {
              return t.e("chunk-869c0b64").then(t.bind(null, "4d62"));
            },
          },
          {
            path: "/AuthResult",
            name: "认证结果",
            component: function () {
              return t.e("chunk-14fef602").then(t.bind(null, "9dd6"));
            },
          },
          {
            path: "/AccountLands_new",
            redirect: function (n) {
              return {
                path: "/AccountLands_newV2",
                query: n.query,
                hash: n.hash,
              };
            },
          },
          {
            path: "/AccountLandb_new",
            name: "线上销户查询",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-ee56bdd6"),
              ]).then(t.bind(null, "85a8"));
            },
          },
          {
            path: "/ArrearsBackup_new",
            name: "销户欠费",
            component: function () {
              return t.e("chunk-6cf55c51").then(t.bind(null, "8233"));
            },
          },
          {
            path: "/AccountList_new",
            name: "销户申请",
            component: function () {
              return t.e("chunk-e4e990d0").then(t.bind(null, "4c23"));
            },
          },
          {
            path: "/AccountListComplain_new",
            name: "销户申请",
            component: function () {
              return t.e("chunk-40a14793").then(t.bind(null, "c779"));
            },
          },
          {
            path: "/AccountAccept_new",
            name: "销户受理中",
            component: function () {
              return t.e("chunk-804374e4").then(t.bind(null, "48cc"));
            },
          },
          {
            path: "/AccountFail_new",
            name: "销户失败",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-fff197d6"),
              ]).then(t.bind(null, "16e6"));
            },
          },
          {
            path: "/AccountDrawback_new",
            name: "销户退款",
            component: function () {
              return t.e("chunk-582387ba").then(t.bind(null, "620b"));
            },
          },
          {
            path: "/ResultFeedback_new",
            name: "销户退款",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-4c972419"),
              ]).then(t.bind(null, "f03d"));
            },
          },
          {
            path: "/AffirmDrawback_new",
            name: "销户退款",
            component: function () {
              return t.e("chunk-560bb547").then(t.bind(null, "960b"));
            },
          },
          {
            path: "/contractPay_new",
            name: "销户退款",
            component: function () {
              return t.e("chunk-fa151246").then(t.bind(null, "9204"));
            },
          },
          {
            path: "/contractPayResult_new",
            name: "销户退款结果",
            component: function () {
              return t.e("chunk-1e130d88").then(t.bind(null, "8e00"));
            },
          },
          {
            path: "/AuthResult_new",
            name: "认证结果",
            component: function () {
              return t.e("chunk-227b7aaa").then(t.bind(null, "6946"));
            },
          },
          {
            path: "/AccountPayResult_new",
            name: "缴费结果",
            component: function () {
              return t.e("chunk-8e98cea2").then(t.bind(null, "65f9"));
            },
          },
          {
            path: "/AccountLands_newV2",
            name: "线上销户登录",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-24c55c4c"),
              ]).then(t.bind(null, "3b1e"));
            },
          },
          {
            path: "/AccountLandb_newV2",
            name: "线上销户查询",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-153a9828"),
              ]).then(t.bind(null, "5ba7"));
            },
          },
          {
            path: "/ArrearsBackup_newV2",
            name: "销户欠费",
            meta: { title: "号卡自助销户" },
            component: function () {
              return t.e("chunk-7d5b179a").then(t.bind(null, "d0d6"));
            },
          },
          {
            path: "/AccountList_newV2",
            name: "销户申请",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b28f76d2"),
              ]).then(t.bind(null, "796d"));
            },
          },
          {
            path: "/AccountListComplain_newV2",
            name: "销户申请",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-0140dce0"),
              ]).then(t.bind(null, "5057"));
            },
          },
          {
            path: "/AccountAccept_newV2",
            name: "销户受理中",
            meta: { title: "号卡自助销户" },
            component: function () {
              return t.e("chunk-8f2f8a10").then(t.bind(null, "76db"));
            },
          },
          {
            path: "/AccountFail_newV2",
            name: "销户失败",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-bf914364"),
              ]).then(t.bind(null, "dea2"));
            },
          },
          {
            path: "/AccountDrawback_newV2",
            name: "销户退款",
            meta: { title: "号卡自助销户" },
            component: function () {
              return t.e("chunk-4326a6d8").then(t.bind(null, "a55a"));
            },
          },
          {
            path: "/ResultFeedback_newV2",
            name: "销户退款",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1fbe7492"),
              ]).then(t.bind(null, "1b00"));
            },
          },
          {
            path: "/AffirmDrawback_newV2",
            name: "销户退款",
            meta: { title: "号卡自助销户" },
            component: function () {
              return t.e("chunk-1bbb26cc").then(t.bind(null, "0de0"));
            },
          },
          {
            path: "/contractPay_newV2",
            name: "销户退款",
            meta: { title: "号卡自助销户" },
            component: function () {
              return t.e("chunk-5fa19d4a").then(t.bind(null, "4e6e"));
            },
          },
          {
            path: "/contractPayResult_newV2",
            name: "销户退款结果",
            meta: { title: "号卡自助销户" },
            component: function () {
              return t.e("chunk-8ad2faaa").then(t.bind(null, "4a96"));
            },
          },
          {
            path: "/AuthResult_newV2",
            name: "认证结果",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-5e022764"),
              ]).then(t.bind(null, "770f"));
            },
          },
          {
            path: "/AccountPayResult_newV2",
            name: "缴费结果",
            meta: { title: "号卡自助销户" },
            component: function () {
              return t.e("chunk-419a07ba").then(t.bind(null, "ce28"));
            },
          },
          {
            path: "/diagnosisPage",
            name: "一键诊断",
            component: function () {
              return t.e("chunk-57153812").then(t.bind(null, "4691"));
            },
          },
          {
            path: "/diagnosisPage_flow",
            name: "流量包查询及退订一键诊断",
            component: function () {
              return t.e("chunk-21673c28").then(t.bind(null, "ec84"));
            },
          },
          {
            path: "/diagnosisPage_ReBroad",
            name: "宽带移机诊断",
            component: function () {
              return t.e("chunk-16ed5c39").then(t.bind(null, "6328"));
            },
          },
          {
            path: "/diagnosisPage_video",
            name: "彩铃订购及退订一键诊断",
            component: function () {
              return t.e("chunk-2527cd18").then(t.bind(null, "3211"));
            },
          },
          {
            path: "/diagnosisPage_BusinessUnsubscribe",
            name: "增值业务查询及退订一键诊断",
            component: function () {
              return t.e("chunk-3abd282c").then(t.bind(null, "bc80"));
            },
          },
          {
            path: "/AccountLands_final",
            name: "线上销户登录",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-191b5953"),
              ]).then(t.bind(null, "ab7c"));
            },
          },
          {
            path: "/AccountLandb_final",
            name: "线上销户订单查询",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-2d0d3daa"),
                t.e("chunk-163f8756"),
                t.e("chunk-40ddeb5b"),
              ]).then(t.bind(null, "4f9e"));
            },
          },
          {
            path: "/AccountSelect_final",
            name: "线上销户",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-c43e05fe").then(t.bind(null, "b410"));
            },
          },
          {
            path: "/AccountOrder_final",
            name: "线上销户订单",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-3b31ee6e").then(t.bind(null, "605df"));
            },
          },
          {
            path: "/AccountLandb_final",
            name: "线上销户查询",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-2d0d3daa"),
                t.e("chunk-163f8756"),
                t.e("chunk-40ddeb5b"),
              ]).then(t.bind(null, "4f9e"));
            },
          },
          {
            path: "/ArrearsBackup_final",
            name: "销户欠费",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-bb3de87c").then(t.bind(null, "2a7a"));
            },
          },
          {
            path: "/AccountList_final",
            name: "销户申请",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2d51ed3c"),
              ]).then(t.bind(null, "5f5b"));
            },
          },
          {
            path: "/AccountListComplain_final",
            name: "销户申请",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-1661c8a2"),
              ]).then(t.bind(null, "7fb5"));
            },
          },
          {
            path: "/AccountBroad_final",
            name: "销户申请",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-4ec9a759"),
              ]).then(t.bind(null, "3e79"));
            },
          },
          {
            path: "/AccountAccept_final",
            name: "销户受理中",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-7b695a66").then(t.bind(null, "a54c"));
            },
          },
          {
            path: "/AccountFail_final",
            name: "销户失败",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-f8702e9c"),
              ]).then(t.bind(null, "accd"));
            },
          },
          {
            path: "/AccountDrawback_final",
            name: "销户退款",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-2973fdfa").then(t.bind(null, "df12"));
            },
          },
          {
            path: "/ResultFeedback_final",
            name: "销户退款",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1f9159ba"),
              ]).then(t.bind(null, "4431"));
            },
          },
          {
            path: "/AffirmDrawback_final",
            name: "销户退款",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-29fdaac9").then(t.bind(null, "9e5c"));
            },
          },
          {
            path: "/contractPay_final",
            name: "销户退款",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-232c1a68").then(t.bind(null, "c5cd"));
            },
          },
          {
            path: "/contractPayResult_final",
            name: "销户退款结果",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-4e3b7921").then(t.bind(null, "102f"));
            },
          },
          {
            path: "/AuthResult_final",
            name: "认证结果",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-b973d284").then(t.bind(null, "445f"));
            },
          },
          {
            path: "/AccountPayResult_final",
            name: "缴费结果",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return t.e("chunk-d5ec9930").then(t.bind(null, "e633"));
            },
          },
          {
            path: "/AccountCancelPage",
            name: "自主销户",
            meta: { title: "自主销户" },
            component: function () {
              return t.e("chunk-9bf14a38").then(t.bind(null, "ba5c"));
            },
          },
          {
            path: "/ReplaceCardPage",
            name: "补换卡聚合页",
            component: function () {
              return t.e("chunk-f6b55230").then(t.bind(null, "580b"));
            },
          },
          {
            path: "/Authentication_ReplaceCard",
            name: "补换卡身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-4c89b470"),
              ]).then(t.bind(null, "aa47"));
            },
          },
          {
            path: "/FeaturedBusiness",
            name: "特色业务",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-54e27f18"),
              ]).then(t.bind(null, "952d"));
            },
          },
          {
            path: "/AccountLandCard",
            name: "补换卡登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-05c306cb"),
              ]).then(t.bind(null, "46d6"));
            },
          },
          {
            path: "/dealwithOnline",
            name: "补换卡业务办理",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-7bde4b36"),
              ]).then(t.bind(null, "ca73"));
            },
          },
          {
            path: "/activationForm",
            name: "号卡激活业务",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-469aa0b6"),
              ]).then(t.bind(null, "b809"));
            },
          },
          {
            path: "/JcardLand",
            name: "号卡激活校验",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-5846bb81"),
              ]).then(t.bind(null, "0305"));
            },
          },
          {
            path: "/Authentication_ActiveCard",
            name: "补换卡激活身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-cb3efdde"),
              ]).then(t.bind(null, "6f0e"));
            },
          },
          {
            path: "/BcardOrder",
            name: "补换卡业务订单",
            component: function () {
              return t.e("chunk-3219c62a").then(t.bind(null, "dd38"));
            },
          },
          {
            path: "/WaitResult",
            name: "补换卡结果",
            component: function () {
              return t.e("chunk-0123dda2").then(t.bind(null, "4871"));
            },
          },
          {
            path: "/WaitResultb",
            name: "激活结果",
            component: function () {
              return t.e("chunk-63153dca").then(t.bind(null, "6696"));
            },
          },
          {
            path: "/BcardyLogistics",
            name: "补换卡物流信息",
            component: function () {
              return t.e("chunk-7006bb1b").then(t.bind(null, "0acc"));
            },
          },
          {
            path: "/Authentication_AccountCancel",
            name: "销户身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-244e22fc"),
              ]).then(t.bind(null, "7586"));
            },
          },
          {
            path: "/Authentication_AccountCancel_new",
            name: "销户身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-72e4f398"),
              ]).then(t.bind(null, "c8eb"));
            },
          },
          {
            path: "/Authentication_AccountCancel_newV2",
            name: "销户身份验证",
            meta: { title: "号卡自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-16eb86f1"),
              ]).then(t.bind(null, "73bc"));
            },
          },
          {
            path: "/Authentication_AccountCancel_final",
            name: "销户身份验证",
            meta: { title: "线上宽带自助销户" },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-1424110c"),
              ]).then(t.bind(null, "8fc1"));
            },
          },
          {
            path: "/Authentication_ReplaceCard",
            name: "补换卡身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-4c89b470"),
              ]).then(t.bind(null, "aa47"));
            },
          },
          {
            path: "/Authentication_CallForwarding",
            name: "呼叫转移验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-37cedda5"),
              ]).then(t.bind(null, "e0fb"));
            },
          },
          {
            path: "/ActiveResult",
            name: "呼叫转移验证结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-4890fe00"),
              ]).then(t.bind(null, "0ed5"));
            },
          },
          {
            path: "/BusiResult",
            name: "呼叫转移服务订购",
            component: function () {
              return t.e("chunk-29f4c98c").then(t.bind(null, "0a57"));
            },
          },
          {
            path: "/CallForwarding",
            name: "呼叫转移设置",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-5cc34bc9"),
              ]).then(t.bind(null, "86d6"));
            },
          },
          {
            path: "/CallOrder",
            name: "呼转我的订单",
            component: function () {
              return t.e("chunk-4c5461de").then(t.bind(null, "5c1c"));
            },
          },
          {
            path: "/CallOrderDetailed",
            name: "呼转订单详情",
            component: function () {
              return t.e("chunk-2bba0234").then(t.bind(null, "2c3b"));
            },
          },
          {
            path: "/OrderResult",
            name: "呼转订购结果",
            component: function () {
              return t.e("chunk-1cc4413f").then(t.bind(null, "0135"));
            },
          },
          {
            path: "/RealnameLand",
            name: "实名补拍登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-cf4d764a"),
              ]).then(t.bind(null, "bf6f"));
            },
          },
          {
            path: "/RealnameLandOrderSelect",
            name: "实名补拍订单查询",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-5afe8c84"),
              ]).then(t.bind(null, "47b1"));
            },
          },
          {
            path: "/Authentication_Realname",
            name: "实名补拍验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-3c853114"),
              ]).then(t.bind(null, "acbd"));
            },
          },
          {
            path: "/RealnameOrder",
            name: "补拍订单",
            component: function () {
              return t.e("chunk-4e9e6830").then(t.bind(null, "e789"));
            },
          },
          {
            path: "/StatusResult",
            name: "补拍办理结果",
            component: function () {
              return t.e("chunk-f7f79f2a").then(t.bind(null, "2229"));
            },
          },
          {
            path: "/RealpersonLand",
            name: "实人认证登录",
            component: function () {
              return t.e("chunk-78d65188").then(t.bind(null, "e210"));
            },
          },
          {
            path: "/RealpersonOnceLogin",
            name: "实人认证一键登录",
            component: function () {
              return t.e("chunk-e33f462e").then(t.bind(null, "b52b"));
            },
          },
          {
            path: "/Authentication_RealPerson",
            name: "实人认证验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-437b6359"),
              ]).then(t.bind(null, "7eee"));
            },
          },
          {
            path: "/EntityResult",
            name: "实人认证活体结果",
            component: function () {
              return t.e("chunk-0f693934").then(t.bind(null, "faf7"));
            },
          },
          {
            path: "/HujinResult",
            name: "实人认证结果",
            component: function () {
              return t.e("chunk-64affaea").then(t.bind(null, "2fc9"));
            },
          },
          {
            path: "/NumberIndex",
            name: "号码甄选馆首页",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2b349da6"),
                t.e("chunk-2de28c86"),
              ]).then(t.bind(null, "7ea8"));
            },
          },
          {
            path: "/NumberReservation",
            name: "号码甄选馆号码预约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-ce4cbb50"),
              ]).then(t.bind(null, "eac3"));
            },
          },
          {
            path: "/InforSubmitvs",
            name: "号码甄选馆资料提交",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-7fa851fc"),
              ]).then(t.bind(null, "ab3f"));
            },
          },
          {
            path: "/NumberResult",
            name: "号码甄选馆结果页",
            component: function () {
              return t.e("chunk-457092c6").then(t.bind(null, "ef58"));
            },
          },
          {
            path: "/CardHomePage",
            name: "来电名片",
            component: function () {
              return t.e("chunk-0583eb81").then(t.bind(null, "a6a0"));
            },
          },
          {
            path: "/CardHomeShow",
            name: "来电显示",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b291aa08"),
              ]).then(t.bind(null, "5c9b"));
            },
          },
          {
            path: "/CardHomeShowOption",
            name: "来电显示",
            component: function () {
              return t.e("chunk-0518137c").then(t.bind(null, "4b33"));
            },
          },
          {
            path: "/Authentication_cardHomeShow",
            name: "来电显示身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-4c907bbe"),
              ]).then(t.bind(null, "fd83"));
            },
          },
          {
            path: "/CardHomeShowResult",
            name: "来电显示结果页面",
            component: function () {
              return t.e("chunk-50d4dfea").then(t.bind(null, "3140"));
            },
          },
          {
            path: "/VideoRBT",
            name: "视频彩铃",
            component: function () {
              return t.e("chunk-cbf1572e").then(t.bind(null, "83c8"));
            },
          },
          {
            path: "/ReportingLossUncoupling",
            name: "挂失解挂",
            component: function () {
              return t.e("chunk-ead29414").then(t.bind(null, "adfe"));
            },
          },
          {
            path: "/PukQuery",
            name: "PUK码查询",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-49a11d40"),
              ]).then(t.bind(null, "dd14"));
            },
          },
          {
            path: "/PremiumOrder",
            name: "优品包我的订单",
            component: function () {
              return t.e("chunk-1f457048").then(t.bind(null, "b9d7"));
            },
          },
          {
            path: "/PremiumOrderDetailed",
            name: "优品包订单详情",
            component: function () {
              return t.e("chunk-513ab0c2").then(t.bind(null, "816e"));
            },
          },
          {
            path: "/PremiumOrderResult",
            name: "优品包订购结果",
            component: function () {
              return t.e("chunk-98fa0654").then(t.bind(null, "1af6"));
            },
          },
          {
            path: "/Premium",
            name: "天翼高清优品包",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-3e9720bd"),
              ]).then(t.bind(null, "2e7b"));
            },
          },
          {
            path: "/PremiumLand",
            name: "天翼高清优品包登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-433fb422"),
              ]).then(t.bind(null, "dca9"));
            },
          },
          {
            path: "/BusinessUnsubscribe",
            name: "已订业务退订",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-5d463a9d"),
              ]).then(t.bind(null, "1373"));
            },
          },
          {
            path: "/ServiceReminder",
            name: "已订服务提醒",
            component: function () {
              return t.e("chunk-d70101d6").then(t.bind(null, "e7bf"));
            },
          },
          {
            path: "/CreditSearch",
            name: "信用度查询",
            component: function () {
              return t.e("chunk-1d5edea2").then(t.bind(null, "2685"));
            },
          },
          {
            path: "/CreditAdjust",
            name: "信用度调整",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-746bd5de"),
              ]).then(t.bind(null, "fa92"));
            },
          },
          {
            path: "/FraudReport",
            name: "诈骗号码举报",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-650bca75"),
              ]).then(t.bind(null, "dfd0f"));
            },
          },
          {
            path: "/ComplaintSuggestions",
            name: "投诉与建议",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2d0b6e8d"),
              ]).then(t.bind(null, "1ebe"));
            },
          },
          {
            path: "/ComplaintProgress",
            name: "投诉单进展",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2d210bbf"),
              ]).then(t.bind(null, "b8c6"));
            },
          },
          {
            path: "/ComplaintList",
            name: "投诉单列表",
            component: function () {
              return t.e("chunk-2d221f1c").then(t.bind(null, "cd05"));
            },
          },
          {
            path: "/FaultSearch",
            name: "故障单查询",
            component: function () {
              return t.e("chunk-2d0b2168").then(t.bind(null, "232c"));
            },
          },
          {
            path: "/FaultDeclaration",
            name: "故障单申告",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6e61047b"),
              ]).then(t.bind(null, "5185"));
            },
          },
          {
            path: "/GreenInternetLogin",
            name: "绿色上网登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6f919dc6"),
              ]).then(t.bind(null, "c6c0"));
            },
          },
          {
            path: "/FaultQuery",
            name: "故障单查询",
            component: function () {
              return t.e("chunk-46ecb8fe").then(t.bind(null, "6bb4"));
            },
          },
          {
            path: "/FaultQueryResult",
            name: "故障单查询结果",
            component: function () {
              return t.e("chunk-646f11d7").then(t.bind(null, "1f2b"));
            },
          },
          {
            path: "/BroadbandRenewlogin1",
            name: "登录",
            component: function () {
              return t.e("chunk-022bb17c").then(t.bind(null, "b7c0"));
            },
          },
          {
            path: "/BroadbandRenewlogin",
            name: "登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-334a7d5a"),
              ]).then(t.bind(null, "73a0"));
            },
          },
          {
            path: "/BroadbandQueryOrder",
            name: "宽带续约订单查询",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-451cd042"),
              ]).then(t.bind(null, "6d07"));
            },
          },
          {
            path: "/BroadbandRenew",
            name: "宽带续约",
            component: function () {
              return t.e("chunk-e42f71a2").then(t.bind(null, "4bba"));
            },
          },
          {
            path: "/BroadbandRenewOrderList",
            name: "宽带续约订单列表",
            component: function () {
              return t.e("chunk-1ae9f8df").then(t.bind(null, "1e8c"));
            },
          },
          {
            path: "/BroadbandOnDoorLogin",
            name: "宽带上门预约",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-fa325e1a"),
              ]).then(t.bind(null, "3fca"));
            },
          },
          {
            path: "/BroadbandOnDoorOrder",
            name: "宽带上门订单",
            component: function () {
              return t.e("chunk-0929fe64").then(t.bind(null, "10c9"));
            },
          },
          {
            path: "/BroadbandOnDoorConfirm",
            name: "宽带上门确认",
            component: function () {
              return t.e("chunk-ba0a87b6").then(t.bind(null, "6485"));
            },
          },
          {
            path: "/BroadbandOnDoorResult",
            name: "宽带上门结果",
            component: function () {
              return t.e("chunk-c0274a24").then(t.bind(null, "22c2"));
            },
          },
          {
            path: "/confirmOrder",
            name: "确认订单",
            component: function () {
              return t.e("chunk-67bbf30b").then(t.bind(null, "7b67"));
            },
          },
          {
            path: "/passwordModification",
            name: "密码修改",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-428eee6f"),
              ]).then(t.bind(null, "2f0f"));
            },
          },
          {
            path: "/passwordReset",
            name: "宽带密码重置",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-3af22b46"),
              ]).then(t.bind(null, "0381"));
            },
          },
          {
            path: "/stopRepeaterLogin",
            name: "停复机登录",
            component: function () {
              return t.e("chunk-14144d5a").then(t.bind(null, "1146"));
            },
          },
          {
            path: "/halt",
            name: "停机",
            component: function () {
              return t.e("chunk-6c374a2a").then(t.bind(null, "7097"));
            },
          },
          {
            path: "/duplicateMachine",
            name: "复机",
            component: function () {
              return t.e("chunk-340e7630").then(t.bind(null, "eeb3"));
            },
          },
          {
            path: "/RelocationLand",
            name: "宽带移机登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6956aa00"),
              ]).then(t.bind(null, "e1b5"));
            },
          },
          {
            path: "/RelocationApplication",
            name: "宽带移机申请",
            component: function () {
              return t.e("chunk-4037fc92").then(t.bind(null, "50f7"));
            },
          },
          {
            path: "/ContactInformation",
            name: "移机联系方式",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-52485f0a"),
              ]).then(t.bind(null, "8ea2"));
            },
          },
          {
            path: "/RelocationOrderResult",
            name: "移机订购结果",
            component: function () {
              return t.e("chunk-9df40a00").then(t.bind(null, "4a01"));
            },
          },
          {
            path: "/oldUsers",
            name: "老用户加装宽带",
            component: function () {
              return t.e("chunk-6ad70cbb").then(t.bind(null, "1f937"));
            },
          },
          {
            path: "/oldStep",
            name: "填写安装地址",
            component: function () {
              return t.e("chunk-fa8d6914").then(t.bind(null, "0fed"));
            },
          },
          {
            path: "/oldStep2",
            name: "入网信息",
            component: function () {
              return t.e("chunk-316b6d64").then(t.bind(null, "ac6b"));
            },
          },
          {
            path: "/oldStep3",
            name: "选择宽带产品",
            component: function () {
              return t.e("chunk-41ad05a4").then(t.bind(null, "6120"));
            },
          },
          {
            path: "/searchAdress",
            name: "搜索地址",
            component: function () {
              return t.e("chunk-e77a05a0").then(t.bind(null, "fb44"));
            },
          },
          {
            path: "/ReportingLossUncouplingResult",
            name: "挂失解挂结果",
            component: function () {
              return t.e("chunk-7b76f9f8").then(t.bind(null, "acf6"));
            },
          },
          {
            path: "/Authentication_ReportingLossUncoupling",
            name: "挂失解挂验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-8f21e4fa"),
              ]).then(t.bind(null, "a37f"));
            },
          },
          {
            path: "/PackageLand",
            name: "套餐变更登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-1f11a05c"),
              ]).then(t.bind(null, "828d"));
            },
          },
          {
            path: "/PackageChanges",
            name: "套餐变更",
            component: function () {
              return t.e("chunk-447f05c6").then(t.bind(null, "8ed7"));
            },
          },
          {
            path: "/PackageChangeAggregate",
            name: "套餐变更",
            component: function () {
              return t.e("chunk-40e773ac").then(t.bind(null, "e992"));
            },
          },
          {
            path: "/PackageConfirm",
            name: "套餐变更确认",
            component: function () {
              return t.e("chunk-54dcd7b8").then(t.bind(null, "0e77"));
            },
          },
          {
            path: "/PackageChangeAggregateConfirm",
            name: "套餐变更确认",
            component: function () {
              return t.e("chunk-c7ad3d90").then(t.bind(null, "832c"));
            },
          },
          {
            path: "/PackageSign",
            name: "套餐变更签名",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-20950028"),
              ]).then(t.bind(null, "47c2"));
            },
          },
          {
            path: "/PackageResult",
            name: "派单状态",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-cbe087da"),
              ]).then(t.bind(null, "caca"));
            },
          },
          {
            path: "/ShutdownKeep",
            name: "停机保号",
            component: function () {
              return t.e("chunk-57dedde8").then(t.bind(null, "2c43"));
            },
          },
          {
            path: "/ShutdownResult",
            name: "停机保号结果",
            component: function () {
              return t.e("chunk-6c367768").then(t.bind(null, "6282"));
            },
          },
          {
            path: "/NetEnter",
            name: "绿色上网查询登录",
            component: function () {
              return t.e("chunk-1a0049fe").then(t.bind(null, "7ae4"));
            },
          },
          {
            path: "/GreenInternet",
            name: "绿色上网",
            component: function () {
              return t.e("chunk-d4850e8a").then(t.bind(null, "829d"));
            },
          },
          {
            path: "/GreenInternetOrder",
            name: "绿色上网查询订单",
            component: function () {
              return t.e("chunk-da702f82").then(t.bind(null, "d15b"));
            },
          },
          {
            path: "/OpenoverInternerLogin",
            name: "宽带停复机登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-c6b02c3a"),
              ]).then(t.bind(null, "942a"));
            },
          },
          {
            path: "/OpenoverInterner",
            name: "宽带停复机",
            component: function () {
              return t.e("chunk-714c33ae").then(t.bind(null, "9966"));
            },
          },
          {
            path: "/BroadacCountQuery",
            name: "宽带账户登录",
            component: function () {
              return t.e("chunk-71ed7806").then(t.bind(null, "5833"));
            },
          },
          {
            path: "/BroadacCountSelect",
            name: "宽带账户查询",
            component: function () {
              return t.e("chunk-a37c0d44").then(t.bind(null, "c643"));
            },
          },
          {
            path: "/BroadacCountResult",
            name: "宽带账户查询结果",
            component: function () {
              return t.e("chunk-099a4d96").then(t.bind(null, "a9b4"));
            },
          },
          {
            path: "/HYBroadbandOrderlogin",
            name: "华翼宽带续费登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-3402cf12"),
              ]).then(t.bind(null, "8841"));
            },
          },
          {
            path: "/HYBroadbandRenew",
            name: "华翼宽带续费",
            component: function () {
              return t.e("chunk-4ed990b2").then(t.bind(null, "6795"));
            },
          },
          {
            path: "/HYConfirmOrder",
            name: "华翼宽带订单支付",
            component: function () {
              return t.e("chunk-6ade6aa6").then(t.bind(null, "a922"));
            },
          },
          {
            path: "/HYBroadbandPayResult",
            name: "华翼宽带订单支付结果",
            component: function () {
              return t.e("chunk-43c372c9").then(t.bind(null, "6a05"));
            },
          },
          {
            path: "/HYBroadBandSelect",
            name: "华翼宽带选择业务",
            component: function () {
              return t.e("chunk-185819c3").then(t.bind(null, "aa20"));
            },
          },
          {
            path: "/HYBroadbandOrder",
            name: "华翼宽带订单查询结果",
            component: function () {
              return t.e("chunk-45e0f5bc").then(t.bind(null, "86ec"));
            },
          },
          {
            path: "/HYBroadbandOrderQuery",
            name: "华翼宽带订单查询",
            component: function () {
              return t.e("chunk-d00273be").then(t.bind(null, "16e1"));
            },
          },
          {
            path: "/AppointmentTransfer",
            name: "预约过户资料填写页",
            beforeEnter: function (n, e, t) {
              window.location.href =
                "https://wapbj.189.cn/echnwap/announDetail?busiType=CommonNotice";
            },
          },
          {
            path: "/AppointmentOrder",
            name: "预约过户我的订单",
            component: function () {
              return Promise.all([
                t.e("chunk-2d0d3daa"),
                t.e("chunk-787862c1"),
              ]).then(t.bind(null, "7467"));
            },
          },
          {
            path: "/AppointmentOrderDetailed",
            name: "预约过户订单详情",
            component: function () {
              return t.e("chunk-92f438e0").then(t.bind(null, "11d9"));
            },
          },
          {
            path: "/AppointmentResult",
            name: "预约过户结果页",
            component: function () {
              return t.e("chunk-677e21b9").then(t.bind(null, "88b2"));
            },
          },
          {
            path: "/ConfigurePoster",
            name: "配置海报",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-2d216257"),
                t.e("chunk-2d21d0c2"),
                t.e("chunk-163f8756"),
                t.e("chunk-499f8d26"),
              ]).then(t.bind(null, "e9ed"));
            },
          },
          {
            path: "/busiUrlConfig",
            name: "配置链接",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-a0334926"),
              ]).then(t.bind(null, "ec30"));
            },
          },
          {
            path: "/SalesLand",
            name: "销量查询",
            component: function () {
              return t.e("chunk-41f9cc14").then(t.bind(null, "5072"));
            },
          },
          {
            path: "/SalesQueryResults",
            name: "查询结果",
            component: function () {
              return t.e("chunk-599d651e").then(t.bind(null, "5a5f"));
            },
          },
          {
            path: "/SalesQueryDetail",
            name: "销量详情",
            component: function () {
              return t.e("chunk-2622add2").then(t.bind(null, "dc96"));
            },
          },
          {
            path: "/fusionBroadbandInitNew",
            name: "老用户加装宽带",
            component: function () {
              return t.e("chunk-1e429831").then(t.bind(null, "a50a"));
            },
          },
          {
            path: "/fusionBroadbandAddressNew",
            name: "老用户加装宽带地址选择",
            component: function () {
              return t.e("chunk-f8335db0").then(t.bind(null, "f4e7"));
            },
          },
          {
            path: "/fusionBroadbandOrderNew",
            name: "老用户加装宽带生成订单",
            component: function () {
              return t.e("chunk-4c67b72c").then(t.bind(null, "b82e"));
            },
          },
          {
            path: "/fusionBroadbandOrderNewDsr",
            name: "老用户加装宽带Dsr订单页",
            component: function () {
              return t.e("chunk-cf107966").then(t.bind(null, "7800"));
            },
          },
          {
            path: "/fusionBroadbandPersonNew",
            name: "老用户加装宽带录入资料",
            component: function () {
              return t.e("chunk-f033d426").then(t.bind(null, "667b"));
            },
          },
          {
            path: "/fusionBroadbandConfirmPage",
            name: "老系统加装宽带支付页面",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-72e209e6"),
              ]).then(t.bind(null, "7265"));
            },
          },
          {
            path: "/fusionBroadbandResultNew",
            name: "老用户加装支付结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-5cdb530e"),
              ]).then(t.bind(null, "8d29"));
            },
          },
          {
            path: "/installBroadbandPolicyLogin",
            name: "老用户加装宽带登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6d06a0fc"),
              ]).then(t.bind(null, "261d"));
            },
          },
          {
            path: "/installBroadbandPolicyInit",
            name: "老用户加装宽带",
            component: function () {
              return t.e("chunk-5c0c17bc").then(t.bind(null, "d7d5"));
            },
          },
          {
            path: "/installBroadbandPolicyAddress",
            name: "老用户加装宽带地址选择",
            component: function () {
              return t.e("chunk-4c8ce0a1").then(t.bind(null, "970f"));
            },
          },
          {
            path: "/installBroadbandPolicyOrder",
            name: "老用户加装宽带生成订单",
            component: function () {
              return t.e("chunk-4374b725").then(t.bind(null, "9b81"));
            },
          },
          {
            path: "/installBroadbandPolicyConfirm",
            name: "老用户加装宽带支付",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2ae53715"),
              ]).then(t.bind(null, "dbd2"));
            },
          },
          {
            path: "/installBroadbandPolicyResult",
            name: "老用户加装宽带结果",
            component: function () {
              return t.e("chunk-076f66ae").then(t.bind(null, "6eb2"));
            },
          },
          {
            path: "/TyBroadbandQueryLogin",
            name: "天翼宽带订购查询",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-6eb91649"),
              ]).then(t.bind(null, "9140"));
            },
          },
          {
            path: "/TyBroadbandQueryResult",
            name: "天翼宽带订购查询结果",
            component: function () {
              return t.e("chunk-5b873870").then(t.bind(null, "3eea"));
            },
          },
          {
            path: "/SatisfactionPage1",
            name: "旧版满意度评价",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-06ac519e"),
              ]).then(t.bind(null, "d849"));
            },
          },
          {
            path: "/SatisfactionPage",
            name: "满意度评价",
            component: function () {
              return t.e("chunk-dbc1708e").then(t.bind(null, "b565"));
            },
          },
          {
            path: "/CustomerLand",
            name: "满意度评价登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-529c790d"),
              ]).then(t.bind(null, "8ec4"));
            },
          },
          {
            path: "/CustomerList",
            name: "我的反馈",
            component: function () {
              return t.e("chunk-2d21eee6").then(t.bind(null, "d851"));
            },
          },
          {
            path: "/ImprovePage",
            name: "满意度评价",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-56a4714a"),
              ]).then(t.bind(null, "c384"));
            },
          },
          {
            path: "/TianyiDetails",
            name: "天翼云眼",
            component: function () {
              return t.e("chunk-0bf72054").then(t.bind(null, "48eb"));
            },
          },
          {
            path: "/Confirmation",
            name: "云服务成功页",
            component: function () {
              return t.e("chunk-019e27b0").then(t.bind(null, "d30d"));
            },
          },
          {
            path: "/PlacePage",
            name: "云服务下单页面",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-ef0c2744"),
              ]).then(t.bind(null, "9d71"));
            },
          },
          {
            path: "/MallRedirect",
            name: "页面跳转中",
            component: function () {
              return t.e("chunk-2e5a24ec").then(t.bind(null, "ff56"));
            },
          },
          {
            path: "/magic6Pro",
            name: "荣耀终端预约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6ca9a068"),
              ]).then(t.bind(null, "3945"));
            },
          },
          {
            path: "/magic6ProResult",
            name: "荣耀终端预约",
            component: function () {
              return t.e("chunk-28de828d").then(t.bind(null, "909fb"));
            },
          },
          {
            path: "/reservationMate",
            name: "华为终端预约",
            component: function () {
              return t.e("chunk-10d7f4b4").then(t.bind(null, "4e86"));
            },
          },
          {
            path: "/ReservationIphone15",
            name: "苹果终端预约",
            component: function () {
              return t.e("chunk-7a23e07c").then(t.bind(null, "52c8"));
            },
          },
          {
            path: "/iphone15Result",
            name: "苹果终端预约",
            component: function () {
              return t.e("chunk-24b47b83").then(t.bind(null, "96cc"));
            },
          },
          {
            path: "/mateResult",
            name: "华为终端预约",
            component: function () {
              return t.e("chunk-436c72dc").then(t.bind(null, "c7ee"));
            },
          },
          {
            path: "/companyNetworking",
            name: "商企组网",
            component: function () {
              return t.e("chunk-10f762fe").then(t.bind(null, "94ed"));
            },
          },
          {
            path: "/merchantGoldCard",
            name: "商户金卡",
            component: function () {
              return t.e("chunk-a6475e20").then(t.bind(null, "e1c6"));
            },
          },
          {
            path: "/cloudProductShow",
            name: "云产品",
            component: function () {
              return t.e("chunk-48b74e2a").then(t.bind(null, "e9ee"));
            },
          },
          {
            path: "/hotelPerfectAlliance",
            name: "酒店完美联盟",
            component: function () {
              return t.e("chunk-6512b497").then(t.bind(null, "9676"));
            },
          },
          {
            path: "/cloudComput",
            name: "云电脑（政企版）",
            component: function () {
              return t.e("chunk-3262e5f6").then(t.bind(null, "fb2e"));
            },
          },
          {
            path: "/cloudComputPublic",
            name: "云电脑（公众版）",
            component: function () {
              return t.e("chunk-ff9ad874").then(t.bind(null, "b68f"));
            },
          },
          {
            path: "/enterpriseCloudDisk",
            name: "企业云盘",
            component: function () {
              return t.e("chunk-6f8be7a4").then(t.bind(null, "7bd2"));
            },
          },
          {
            path: "/tianyicloudConference",
            name: "天翼云会议",
            component: function () {
              return t.e("chunk-174d70a6").then(t.bind(null, "978a"));
            },
          },
          {
            path: "/gasTV",
            name: "燃气卫士",
            component: function () {
              return t.e("chunk-15542059").then(t.bind(null, "3b8d"));
            },
          },
          {
            path: "/tykj",
            name: "天翼看家",
            component: function () {
              return t.e("chunk-14fa442a").then(t.bind(null, "1cf9"));
            },
          },
          {
            path: "/brightKitchenStove",
            name: "明厨亮灶",
            component: function () {
              return t.e("chunk-25f6ce48").then(t.bind(null, "0d8a"));
            },
          },
          {
            path: "/satellite",
            name: "卫星业务",
            component: function () {
              return t.e("chunk-956a63ea").then(t.bind(null, "e04d"));
            },
          },
          {
            path: "/publicLogin",
            name: "登录页",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-cc379484"),
              ]).then(t.bind(null, "f360"));
            },
          },
          {
            path: "/publicLoginB",
            name: "登录页",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b087e6ce"),
              ]).then(t.bind(null, "eeb9"));
            },
          },
          {
            path: "/publicLoginBPuzzle",
            name: "登录页",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-05b1fcc9"),
              ]).then(t.bind(null, "484c"));
            },
          },
          {
            path: "/publicLoginPuzzle",
            name: "登录页",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2f621e1c"),
              ]).then(t.bind(null, "dcd3"));
            },
          },
          {
            path: "/publicLogin_toPage",
            name: "登录页",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-a29e70d8"),
              ]).then(t.bind(null, "5aaf"));
            },
          },
          {
            path: "/QwWifiLand",
            name: "全屋WiFi登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b8150e3c"),
              ]).then(t.bind(null, "cecd"));
            },
          },
          {
            path: "/TykjLand",
            name: "天翼看家登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b8150e3c"),
              ]).then(t.bind(null, "cecd"));
            },
          },
          {
            path: "/TyIptvLand",
            name: "天翼高清登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b8150e3c"),
              ]).then(t.bind(null, "cecd"));
            },
          },
          {
            path: "/PackageSelection",
            name: "套餐选择",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-736862fe"),
              ]).then(t.bind(null, "10e4"));
            },
          },
          {
            path: "/SmartHomePackageConfirm",
            name: "套餐确认",
            component: function () {
              return t.e("chunk-0eab5522").then(t.bind(null, "4a7f"));
            },
          },
          {
            path: "/SmartHomeResult",
            name: "办理结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-3bd1dc8e"),
              ]).then(t.bind(null, "272a"));
            },
          },
          {
            path: "/EnterpriseDayActivities",
            name: "华为、苹果新机预约",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-bb3ca54a"),
              ]).then(t.bind(null, "f9e0"));
            },
          },
          {
            path: "/CouponPage",
            name: "华为、苹果新机预约",
            component: function () {
              return t.e("chunk-867dca54").then(t.bind(null, "223d"));
            },
          },
          {
            path: "/EnterPayResult",
            name: "华为、苹果新机预约",
            component: function () {
              return t.e("chunk-eae2096a").then(t.bind(null, "77d7"));
            },
          },
          {
            path: "/ContractPage",
            name: "合约解除首页",
            component: function () {
              return t.e("chunk-2bcc660e").then(t.bind(null, "9c1c"));
            },
          },
          {
            path: "/ContractList",
            name: "合约解除业务",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2bc4d00b"),
              ]).then(t.bind(null, "b882"));
            },
          },
          {
            path: "/ContractAccountLogin",
            name: "合约解除登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-35fd9c14"),
              ]).then(t.bind(null, "8a67"));
            },
          },
          {
            path: "/ContractListResult",
            name: "合约解除交易结果",
            component: function () {
              return t.e("chunk-45446518").then(t.bind(null, "e8f0"));
            },
          },
          {
            path: "/preDepositHigh_login",
            name: "预存平台登录",
            meta: { trackingEntry: !0 },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-5409bf18"),
              ]).then(t.bind(null, "46e0"));
            },
          },
          {
            path: "/preDepositCfq_list",
            name: "档位选择",
            component: function () {
              return t.e("chunk-ecac73ca").then(t.bind(null, "6abb"));
            },
          },
          {
            path: "/preDepositCfq_confirm",
            name: "档位确认",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-7a9832e9"),
              ]).then(t.bind(null, "c52a"));
            },
          },
          {
            path: "/preDeposit_result",
            name: "订单结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-55871600"),
              ]).then(t.bind(null, "b4e0"));
            },
          },
          {
            path: "/BusinessActivities",
            name: "商机单",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b797b700"),
              ]).then(t.bind(null, "aceb"));
            },
          },
          {
            path: "/BusinessResult",
            name: "商机单办理结果",
            component: function () {
              return t.e("chunk-65e63f54").then(t.bind(null, "de6e"));
            },
          },
          {
            path: "/PreBusinessActivities",
            name: "商机单",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-be702be2"),
              ]).then(t.bind(null, "8c88"));
            },
          },
          {
            path: "/PreBusinessResult",
            name: "商机单办理结果",
            component: function () {
              return t.e("chunk-b16316ea").then(t.bind(null, "117a"));
            },
          },
          {
            path: "/double11Activity",
            name: "双十一活动聚合页",
            component: function () {
              return t.e("chunk-2256e58a").then(t.bind(null, "3cbb"));
            },
          },
          {
            path: "/Authentication_reinstallationNum",
            name: "销号复装",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-b25868ac"),
              ]).then(t.bind(null, "1548"));
            },
          },
          {
            path: "/reinstallationNum",
            name: "销号复装",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-ff47672a"),
              ]).then(t.bind(null, "7bdf"));
            },
          },
          {
            path: "/reinstallationResult",
            name: "销号复装",
            component: function () {
              return t.e("chunk-40bad494").then(t.bind(null, "0248"));
            },
          },
          {
            path: "/ReassembleLogon",
            name: "销号复装",
            component: function () {
              return t.e("chunk-0f55ef91").then(t.bind(null, "e49c"));
            },
          },
          {
            path: "/FttrLogin",
            name: "FTTR千兆提速",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-f176a570"),
              ]).then(t.bind(null, "14bb"));
            },
          },
          {
            path: "/FttrOption",
            name: "FTTR千兆提速",
            component: function () {
              return t.e("chunk-c17d6d10").then(t.bind(null, "52fb"));
            },
          },
          {
            path: "/FttrsConfirm",
            name: "FTTR千兆提速",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2b9e9bfb"),
              ]).then(t.bind(null, "c3be"));
            },
          },
          {
            path: "/FttrsResult",
            name: "FTTR千兆提速",
            component: function () {
              return t.e("chunk-338ecd68").then(t.bind(null, "4a94"));
            },
          },
          {
            path: "/FttrLogon",
            name: "灵犀组网",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-9ad0520e"),
              ]).then(t.bind(null, "8c09"));
            },
          },
          {
            path: "/zuwDetails",
            name: "组网详情",
            component: function () {
              return t.e("chunk-928ea390").then(t.bind(null, "11c0"));
            },
          },
          {
            path: "/FttrConfirm",
            name: "组网订单详情",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6aba4181"),
              ]).then(t.bind(null, "6053"));
            },
          },
          {
            path: "/FttrResult",
            name: "组网订单结果",
            component: function () {
              return t.e("chunk-60cc6d0d").then(t.bind(null, "3bca"));
            },
          },
          {
            path: "/AccountLand_new",
            name: "补卡登录",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-ee692176"),
              ]).then(t.bind(null, "efc1"));
            },
          },
          {
            path: "/Authentication_ReplaceCardOffline",
            name: "补卡身份验证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-a6042332"),
              ]).then(t.bind(null, "e0c5"));
            },
          },
          {
            path: "/activationForm_new",
            name: "补卡激活",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-8efaafe8"),
              ]).then(t.bind(null, "1f6b"));
            },
          },
          {
            path: "/waitResult_new",
            name: "补卡激活结果",
            component: function () {
              return t.e("chunk-4c73fe1d").then(t.bind(null, "05d9"));
            },
          },
          {
            path: "/waitResultFinal_new",
            name: "激活结果页",
            component: function () {
              return t.e("chunk-a7104ba0").then(t.bind(null, "9543"));
            },
          },
          {
            path: "/IntranetLogon",
            name: "内网服务登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-19fd0ab9"),
              ]).then(t.bind(null, "c6ac"));
            },
          },
          {
            path: "/IntranetList",
            name: "内网服务列表",
            component: function () {
              return t.e("chunk-bc51006a").then(t.bind(null, "2bf6"));
            },
          },
          {
            path: "/IntranetQuery",
            name: "内网服务查询",
            component: function () {
              return t.e("chunk-f8c46712").then(t.bind(null, "d2ed"));
            },
          },
          {
            path: "/IntranetOrder",
            name: "内网服务订单管理",
            component: function () {
              return t.e("chunk-3cb3c6b0").then(t.bind(null, "e5ce"));
            },
          },
          {
            path: "/IntranetDiagnos",
            name: "内网服务诊断排除",
            component: function () {
              return t.e("chunk-5e024859").then(t.bind(null, "3040"));
            },
          },
          {
            path: "/FailResult",
            name: "办理失败",
            component: function () {
              return t.e("chunk-002b15b8").then(t.bind(null, "edd8"));
            },
          },
          {
            path: "/retrofittingCard",
            name: "副卡办理",
            component: function () {
              return t.e("chunk-a2983aa4").then(t.bind(null, "d23d"));
            },
          },
          {
            path: "/Authentication_retrofittingCard",
            name: "副卡办理实人认证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-16f7a963"),
              ]).then(t.bind(null, "b8d8"));
            },
          },
          {
            path: "/retrofittingCard_result",
            name: "副卡办理结果页面",
            component: function () {
              return t.e("chunk-279f9956").then(t.bind(null, "2a6b"));
            },
          },
          {
            path: "/reCardLogin",
            name: "副卡办理登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-020d4766"),
              ]).then(t.bind(null, "c99e"));
            },
          },
          {
            path: "/quantumCryptography",
            name: "量子密信",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-db0aac98"),
              ]).then(t.bind(null, "0f22"));
            },
          },
          {
            path: "/handleQuantum",
            name: "办理量子密信",
            component: function () {
              return t.e("chunk-05cb3e08").then(t.bind(null, "3360"));
            },
          },
          {
            path: "/submitQuantum",
            name: "提交量子密信",
            component: function () {
              return t.e("chunk-5ac85eb6").then(t.bind(null, "4109"));
            },
          },
          {
            path: "/PopularRecom",
            name: "智能推荐",
            component: function () {
              return t.e("chunk-b4bda9c6").then(t.bind(null, "d11a"));
            },
          },
          {
            path: "/installBroadbandBCLogin",
            name: "老用户加装宽带登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-41f09b66"),
              ]).then(t.bind(null, "1ddac"));
            },
          },
          {
            path: "/installBroadbandBCInit",
            name: "老用户加装宽带",
            component: function () {
              return t.e("chunk-4a6913a3").then(t.bind(null, "5c98"));
            },
          },
          {
            path: "/installBroadbandBCAddress",
            name: "老用户加装宽带地址选择",
            component: function () {
              return t.e("chunk-04b27c88").then(t.bind(null, "bc06"));
            },
          },
          {
            path: "/installBroadbandBCOrder",
            name: "老用户加装宽带生成订单",
            component: function () {
              return t.e("chunk-e3d7f764").then(t.bind(null, "8c1d"));
            },
          },
          {
            path: "/installBroadbandBCConfirm",
            name: "老用户加装宽带支付",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-27640605"),
              ]).then(t.bind(null, "e833"));
            },
          },
          {
            path: "/installBroadbandBCResult",
            name: "老用户加装宽带支付结果",
            component: function () {
              return t.e("chunk-2c2b8e6a").then(t.bind(null, "3a00"));
            },
          },
          {
            path: "/TrafficPacket",
            name: "流量包聚合页",
            component: function () {
              return t.e("chunk-7ee064b1").then(t.bind(null, "1c93"));
            },
          },
          {
            path: "/UnsubscribePage",
            name: "流量包退订",
            component: function () {
              return t.e("chunk-dfbb9632").then(t.bind(null, "c032"));
            },
          },
          {
            path: "/GovPublicLand",
            name: "政企客户办理公众业务聚合页",
            meta: { title: "政企客户办理公众业务" },
            component: function () {
              return t.e("chunk-a56f6f22").then(t.bind(null, "ab15"));
            },
          },
          {
            path: "/GovPublicManagerOrders",
            name: "政企客户办理公众业务",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2da504c0"),
              ]).then(t.bind(null, "8723"));
            },
          },
          {
            path: "/GovPublicVipHallOrders",
            name: "政企客户办理公众业务",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-142a6897"),
              ]).then(t.bind(null, "cdae"));
            },
          },
          {
            path: "/GovPublicVipHallOrderDetail",
            name: "政企客户办理公众业务",
            component: function () {
              return t.e("chunk-228f2f22").then(t.bind(null, "3d46"));
            },
          },
          {
            path: "/GovPublicPoster",
            name: "政企客户办理公众业务",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-2d21d0c2"),
                t.e("chunk-163f8756"),
                t.e("chunk-5fac2c85"),
              ]).then(t.bind(null, "30a9"));
            },
          },
          {
            path: "/PreAcceptLogin",
            name: "政企厅受理",
            component: function () {
              return t.e("chunk-48b52045").then(t.bind(null, "e821"));
            },
          },
          {
            path: "/PreAcceptChangePageb",
            name: "政企厅受理",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-30e35285"),
              ]).then(t.bind(null, "812b"));
            },
          },
          {
            path: "/PreAcceptOperatorAuth",
            name: "政企厅受理",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-1a2de31e"),
              ]).then(t.bind(null, "d778"));
            },
          },
          {
            path: "/PreAcceptPersonalAuth",
            name: "政企厅受理",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-22ed1796"),
              ]).then(t.bind(null, "0713"));
            },
          },
          {
            path: "/PreAcceptNonIdPersonal",
            name: "政企厅受理-个人非身份证",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-a8f7d7e2"),
              ]).then(t.bind(null, "b6c5"));
            },
          },
          {
            path: "/PreAcceptPageStatusa",
            name: "业务预受理-活体结果",
            component: function () {
              return t.e("chunk-2db3f14c").then(t.bind(null, "c896"));
            },
          },
          {
            path: "/PreAcceptMultiSign",
            name: "政企厅受理",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-2d216257"),
                t.e("chunk-303a2ef0"),
              ]).then(t.bind(null, "b923"));
            },
          },
          {
            path: "/PreAcceptResult",
            name: "政企厅受理",
            component: function () {
              return t.e("chunk-ae20af3c").then(t.bind(null, "154b"));
            },
          },
          {
            path: "/AcceptanceLogin",
            name: "业务预受理登录",
            component: function () {
              return t.e("chunk-658e735a").then(t.bind(null, "bf99"));
            },
          },
          {
            path: "/IduserPage",
            name: "身份证用户",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-02df418e"),
              ]).then(t.bind(null, "481c"));
            },
          },
          {
            path: "/WrongIduserPage",
            name: "非身份证用户",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-20b3fd8a"),
              ]).then(t.bind(null, "f03b"));
            },
          },
          {
            path: "/ChangePageb",
            name: "单位信息填写",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-d40477fa"),
              ]).then(t.bind(null, "ebb57"));
            },
          },
          {
            path: "/OtherBusinesses",
            name: "政企-其他业务",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-39c05349"),
              ]).then(t.bind(null, "fd44"));
            },
          },
          {
            path: "/OperatorAuthentication",
            name: "政企-经办人认证",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-88977b30"),
              ]).then(t.bind(null, "032b"));
            },
          },
          {
            path: "/normalAuthentication",
            name: "普通用户-实名认证",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-3af2c2d8"),
              ]).then(t.bind(null, "88dd"));
            },
          },
          {
            path: "/BusinessAcceptance",
            name: "政企-业务受理",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-30b476bb"),
              ]).then(t.bind(null, "8c86f"));
            },
          },
          {
            path: "/PageStatusa",
            name: "活体认证成功",
            component: function () {
              return t.e("chunk-940fb8c2").then(t.bind(null, "f571"));
            },
          },
          {
            path: "/PageStatusb",
            name: "提交成功",
            component: function () {
              return t.e("chunk-a38e890c").then(t.bind(null, "0427"));
            },
          },
          {
            path: "/EshopQuickSign",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-f6bbd5ce"),
              ]).then(t.bind(null, "6a31"));
            },
          },
          {
            path: "/EshopQuickSign_New",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-5d468940"),
              ]).then(t.bind(null, "4f72"));
            },
          },
          {
            path: "/EshopQuickSign_SuppleSign",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-262daf74"),
              ]).then(t.bind(null, "9fb8"));
            },
          },
          {
            path: "/EshopQuickSign_Company",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-186cb4b4"),
              ]).then(t.bind(null, "0f16"));
            },
          },
          {
            path: "/EshopQuickSign_CNew",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-eac44094"),
              ]).then(t.bind(null, "ecae"));
            },
          },
          {
            path: "/EshopQuickSign_CNew_2",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-0d295c08"),
              ]).then(t.bind(null, "41e5"));
            },
          },
          {
            path: "/EshopQuickSign_Fusion",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1720455f"),
              ]).then(t.bind(null, "d2cd"));
            },
          },
          {
            path: "/EshopQuickSign_FusionFrist",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1b466372"),
              ]).then(t.bind(null, "21af"));
            },
          },
          {
            path: "/EshopQuickSign_FusionRegist",
            name: "混合业务首页",
            component: function () {
              return t.e("chunk-6790ef6f").then(t.bind(null, "153d"));
            },
          },
          {
            path: "/EshopQuickSign_FusionPay",
            name: "融合业务支付",
            component: function () {
              return t.e("chunk-785e6c00").then(t.bind(null, "e85a"));
            },
          },
          {
            path: "/Sign_FusionPay",
            name: "融合业务支付",
            component: function () {
              return t.e("chunk-785e6c00").then(t.bind(null, "e85a"));
            },
          },
          {
            path: "/EshopQuickSign_FusionResult",
            name: "融合业务结果",
            component: function () {
              return t.e("chunk-d26b87de").then(t.bind(null, "7fca"));
            },
          },
          {
            path: "/Sign_FusionResult",
            name: "融合业务结果",
            component: function () {
              return t.e("chunk-d26b87de").then(t.bind(null, "7fca"));
            },
          },
          {
            path: "/EshopQuickSign_Fusion_AuthResult",
            name: "混合业务实名认证结果",
            component: function () {
              return t.e("chunk-4fcb878c").then(t.bind(null, "4ea5"));
            },
          },
          {
            path: "/Sign_Fusion",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1720455f"),
              ]).then(t.bind(null, "d2cd"));
            },
          },
          {
            path: "/Sign_FusionFrist",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1b466372"),
              ]).then(t.bind(null, "21af"));
            },
          },
          {
            path: "/EshopQuickSign_MultiSign",
            name: "批量协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-6a30e9ac"),
              ]).then(t.bind(null, "4b92"));
            },
          },
          {
            path: "/Sign_MultiSign",
            name: "批量协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-6a30e9ac"),
              ]).then(t.bind(null, "4b92"));
            },
          },
          {
            path: "/EshopQuickSign_replaceCard",
            name: "补换卡签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-5edd4ab4"),
              ]).then(t.bind(null, "e031"));
            },
          },
          {
            path: "/Sign_replaceCard",
            name: "补换卡签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-5edd4ab4"),
              ]).then(t.bind(null, "e031"));
            },
          },
          {
            path: "/Sign_FusionRegist",
            name: "混合业务首页",
            component: function () {
              return t.e("chunk-6790ef6f").then(t.bind(null, "153d"));
            },
          },
          {
            path: "/Sign_Fusion_AuthResult",
            name: "混合业务实名认证结果",
            component: function () {
              return t.e("chunk-4fcb878c").then(t.bind(null, "4ea5"));
            },
          },
          {
            path: "/Sign_SuppleSign",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-262daf74"),
              ]).then(t.bind(null, "9fb8"));
            },
          },
          {
            path: "/Sign_CNew",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-eac44094"),
              ]).then(t.bind(null, "ecae"));
            },
          },
          {
            path: "/Sign_CNew_2",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-0d295c08"),
              ]).then(t.bind(null, "41e5"));
            },
          },
          {
            path: "/Sign_Company",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-186cb4b4"),
              ]).then(t.bind(null, "0f16"));
            },
          },
          {
            path: "/Sign_NNew",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-5d468940"),
              ]).then(t.bind(null, "4f72"));
            },
          },
          {
            path: "/Sign_Sign",
            name: "协议单签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-f6bbd5ce"),
              ]).then(t.bind(null, "6a31"));
            },
          },
          {
            path: "/EshopSubCardPrompt",
            name: "副卡提示页面",
            component: function () {
              return t.e("chunk-2bc3b660").then(t.bind(null, "3f53"));
            },
          },
          {
            path: "/EshopSubCardAuthResult",
            name: "副卡活体结果页面",
            component: function () {
              return t.e("chunk-7f45659e").then(t.bind(null, "c51e"));
            },
          },
          {
            path: "/EshopResult",
            name: "协议单签字结果",
            component: function () {
              return t.e("chunk-025043c7").then(t.bind(null, "c38b"));
            },
          },
          {
            path: "/EshopResult2",
            name: "协议单签字结果",
            component: function () {
              return t.e("chunk-025043c7").then(t.bind(null, "c38b"));
            },
          },
          {
            path: "/SchoolCommodity",
            name: "北京电信校园专属产品-清华",
            component: function () {
              return t.e("chunk-7e603bab").then(t.bind(null, "045f"));
            },
          },
          {
            path: "/SchoolRDCommodity",
            name: "北京电信校园专属产品-人大",
            component: function () {
              return t.e("chunk-2b77a29b").then(t.bind(null, "69ba"));
            },
          },
          {
            path: "/SchoolCommodityBSU",
            name: "北京电信校园专属产品-北体大",
            component: function () {
              return t.e("chunk-90c5e664").then(t.bind(null, "246b"));
            },
          },
          {
            path: "/SchoolCommodityMUC",
            name: "北京电信校园专属产品-中央民族大学",
            beforeEnter: function (n, e, t) {
              t({
                path: "/University",
                query: { school: "Minzu_University_of_China" },
              });
            },
          },
          {
            path: "/University",
            name: "北京电信校园专属产品",
            component: function () {
              return t.e("chunk-5e7b6f41").then(t.bind(null, "7a48"));
            },
          },
          {
            path: "/ForeignerFriendlyBusiness",
            name: "外国人友好营业厅公示",
            component: function () {
              return t.e("chunk-4abeecce").then(t.bind(null, "6220"));
            },
          },
          {
            path: "/NumberApply",
            name: "Apply For A New Sim Card 号卡申请",
            component: function () {
              return t.e("chunk-4f9a5d9e").then(t.bind(null, "4d9b"));
            },
          },
          {
            path: "/ReservationRule",
            name: "Apply For A New Sim Card 号卡申请",
            component: function () {
              return t.e("chunk-322d758f").then(t.bind(null, "1d62"));
            },
          },
          {
            path: "/ApplyReservation",
            name: "Apply For A New Sim Card 号卡申请结果",
            component: function () {
              return t.e("chunk-0c1ab1d1").then(t.bind(null, "7297"));
            },
          },
          {
            path: "/LimitCheck",
            name: "达量限速检测登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6a5374ee"),
              ]).then(t.bind(null, "da4b"));
            },
          },
          {
            path: "/LimitCheckResult",
            name: "达量限速检测",
            component: function () {
              return t.e("chunk-4ec6a7ab").then(t.bind(null, "64eb"));
            },
          },
          {
            path: "/installBroadbandOULogin",
            name: "老用户加装宽带登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-4ddd53fa"),
              ]).then(t.bind(null, "c8ff"));
            },
          },
          {
            path: "/installBroadbandOUInit",
            name: "老用户加装宽带",
            component: function () {
              return t.e("chunk-cc1138ac").then(t.bind(null, "eb76"));
            },
          },
          {
            path: "/installBroadbandOUAddress",
            name: "老用户加装宽带地址选择",
            component: function () {
              return t.e("chunk-0c625a28").then(t.bind(null, "fa66"));
            },
          },
          {
            path: "/installBroadbandOUOrder",
            name: "老用户加装宽带生成订单",
            component: function () {
              return t.e("chunk-23445f6e").then(t.bind(null, "2d7b"));
            },
          },
          {
            path: "/installBroadbandOUConfirm",
            name: "老用户加装宽带支付",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-30d65c64"),
              ]).then(t.bind(null, "317b"));
            },
          },
          {
            path: "/installBroadbandOUResult",
            name: "老用户加装宽带支付结果",
            component: function () {
              return t.e("chunk-f01ee8fa").then(t.bind(null, "6922"));
            },
          },
          {
            path: "/installBroadbandOULogin_FREE",
            name: "老用户加装宽带登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-74132368"),
              ]).then(t.bind(null, "994f"));
            },
          },
          {
            path: "/installBroadbandOUInit_FREE",
            name: "老用户加装宽带",
            component: function () {
              return t.e("chunk-4a1f9838").then(t.bind(null, "29dc"));
            },
          },
          {
            path: "/installBroadbandOUAddress_FREE",
            name: "老用户加装宽带地址选择",
            component: function () {
              return t.e("chunk-33ab8fdc").then(t.bind(null, "8ed0"));
            },
          },
          {
            path: "/installBroadbandOUOrder_FREE",
            name: "老用户加装宽带生成订单",
            component: function () {
              return t.e("chunk-0531ce4e").then(t.bind(null, "db87"));
            },
          },
          {
            path: "/installBroadbandOUConfirm_FREE",
            name: "老用户加装宽带支付",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-42efb042"),
              ]).then(t.bind(null, "f8e8"));
            },
          },
          {
            path: "/installBroadbandOUResult_FREE",
            name: "老用户加装宽带支付结果",
            component: function () {
              return t.e("chunk-496bd5a6").then(t.bind(null, "ca25"));
            },
          },
          {
            path: "/installBroadbandBCLogin_New",
            name: "加装宽带登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-48368554"),
              ]).then(t.bind(null, "1f10"));
            },
          },
          {
            path: "/installBroadbandBCInit_New",
            name: "加装宽带",
            component: function () {
              return t.e("chunk-268f51e3").then(t.bind(null, "40cf"));
            },
          },
          {
            path: "/installBroadbandBCInitPage_New",
            name: "加装宽带档位",
            component: function () {
              return t.e("chunk-dde6860c").then(t.bind(null, "dc1c"));
            },
          },
          {
            path: "/installBroadbandBCAddress_New",
            name: "加装宽带地址选择",
            component: function () {
              return t.e("chunk-08e67ce3").then(t.bind(null, "fbd1"));
            },
          },
          {
            path: "/installBroadbandBCOrder_New",
            name: "加装宽带生成订单",
            component: function () {
              return t.e("chunk-e90aaf40").then(t.bind(null, "6c87"));
            },
          },
          {
            path: "/installBroadbandBCConfirm_New",
            name: "加装宽带支付",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6c3d2c6a"),
              ]).then(t.bind(null, "8dae"));
            },
          },
          {
            path: "/installBroadbandBCResult_New",
            name: "加装宽带支付结果",
            component: function () {
              return t.e("chunk-1c05c814").then(t.bind(null, "04d1"));
            },
          },
          {
            path: "/enjoyBroadbands",
            name: "宽带档位展示",
            component: function () {
              return t.e("chunk-0c451a4b").then(t.bind(null, "b4e6"));
            },
          },
          {
            path: "/installBroadbandBCLogin_Plus",
            name: "加装宽带",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-3a9ab88c"),
              ]).then(t.bind(null, "b85a"));
            },
          },
          {
            path: "/installBroadbandBCInit_Plus",
            name: "加装宽带",
            component: function () {
              return t.e("chunk-570d824c").then(t.bind(null, "9151"));
            },
          },
          {
            path: "/installBroadbandBCAddress_Plus",
            name: "加装宽带",
            component: function () {
              return t.e("chunk-6c25e24c").then(t.bind(null, "2d24"));
            },
          },
          {
            path: "/installBroadbandBCOrder_Plus",
            name: "加装宽带",
            component: function () {
              return t.e("chunk-8364b542").then(t.bind(null, "6875"));
            },
          },
          {
            path: "/installBroadbandBCConfirm_Plus",
            name: "加装宽带",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-166e6664"),
              ]).then(t.bind(null, "450f"));
            },
          },
          {
            path: "/installBroadbandBCResult_Plus",
            name: "加装宽带",
            component: function () {
              return t.e("chunk-19cf4599").then(t.bind(null, "3e27"));
            },
          },
          {
            path: "/StarCardLogon",
            name: "星卡登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-70c0967b"),
              ]).then(t.bind(null, "08c1"));
            },
          },
          {
            path: "/StarCard",
            name: "星卡",
            component: function () {
              return t.e("chunk-7043a848").then(t.bind(null, "7039"));
            },
          },
          {
            path: "/installBroadbandBCLogin_PlusC",
            name: "单宽转融",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-5d2ddacf"),
              ]).then(t.bind(null, "4a64"));
            },
          },
          {
            path: "/installBroadbandBCNumber_PlusC",
            name: "单宽转融",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-7e0a2b36"),
              ]).then(t.bind(null, "3936"));
            },
          },
          {
            path: "/installBroadbandBCInit_PlusC",
            name: "单宽转融",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-17c4f74c"),
              ]).then(t.bind(null, "5cac"));
            },
          },
          {
            path: "/installBroadbandBCResult_PlusC",
            name: "单宽转融",
            component: function () {
              return t.e("chunk-46370e7d").then(t.bind(null, "2848"));
            },
          },
          {
            path: "/reservationIphone16",
            name: "Iphone16预约",
            component: function () {
              return t.e("chunk-55306f8a").then(t.bind(null, "79c5"));
            },
          },
          {
            path: "/iphone16Result",
            name: "Iphone16预约",
            component: function () {
              return t.e("chunk-10262ee1").then(t.bind(null, "b9e1"));
            },
          },
          {
            path: "/noLoginError",
            name: "您好，请先登录",
            component: function () {
              return t.e("chunk-11120274").then(t.bind(null, "e853"));
            },
          },
          {
            path: "/invoiceHomeGM",
            name: "电子发票",
            component: function () {
              return t.e("chunk-c057ef7a").then(t.bind(null, "6771"));
            },
          },
          {
            path: "/invoiceExplainGM",
            name: "开票说明",
            component: function () {
              return t.e("chunk-55b0f89a").then(t.bind(null, "faa4"));
            },
          },
          {
            path: "/invoiceQuestionGM",
            name: "常见问题",
            component: function () {
              return t.e("chunk-46b342be").then(t.bind(null, "b530"));
            },
          },
          {
            path: "/invoiceInfoPageGM",
            name: "发票抬头设置",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-eb061648"),
              ]).then(t.bind(null, "562b"));
            },
          },
          {
            path: "/invoiceSubmitGM",
            name: "开发票",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-4dd7de24"),
                t.e("chunk-163f8756"),
                t.e("chunk-728d8d8a"),
              ]).then(t.bind(null, "ad98"));
            },
          },
          {
            path: "/invoiceDetailGM",
            name: "查看发票",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-4dd7de24"),
                t.e("chunk-abe8f50c"),
              ]).then(t.bind(null, "3b59"));
            },
          },
          {
            path: "/acceptedInvoiceGM",
            name: "查看发票",
            component: function () {
              return t.e("chunk-854cfd72").then(t.bind(null, "f777"));
            },
          },
          {
            path: "/CardQueryGM",
            name: "主副卡余额查询",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-4d6a16ee"),
              ]).then(t.bind(null, "18f8"));
            },
          },
          {
            path: "/AmountDetailedGM",
            name: "余额明细",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-207263a3"),
              ]).then(t.bind(null, "727f"));
            },
          },
          {
            path: "/paychargeGM",
            name: "充值缴费",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-59e16527"),
              ]).then(t.bind(null, "78b4"));
            },
          },
          {
            path: "/PayHomeGM",
            name: "支付主页",
            component: function () {
              return Promise.all([
                t.e("chunk-2d21d0c2"),
                t.e("chunk-30d3397e"),
              ]).then(t.bind(null, "68cd"));
            },
          },
          {
            path: "/PayStatusGM",
            name: "支付结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-47344eb6"),
              ]).then(t.bind(null, "2bd8"));
            },
          },
          {
            path: "/publicLoginGM",
            name: "登录页",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-24f8f4ac"),
              ]).then(t.bind(null, "f870"));
            },
          },
          {
            path: "/UsageInquiry",
            name: "使用量查询",
            component: function () {
              return t.e("chunk-2208b26e").then(t.bind(null, "e303"));
            },
          },
          {
            path: "/PhoneBill",
            name: "话费账单",
            component: function () {
              return t.e("chunk-1d4be19a").then(t.bind(null, "e928"));
            },
          },
          {
            path: "/GMdevicePage",
            name: "自助办理更便捷，特色业务抢先看",
            component: function () {
              return t.e("chunk-4b00172b").then(t.bind(null, "0fe7"));
            },
          },
          {
            path: "/SearchBusinessHall",
            name: "营业厅查询",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-8b9298aa"),
              ]).then(t.bind(null, "e539"));
            },
          },
          {
            path: "/reservationHW",
            name: "华为Pura70预约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-0a918875"),
              ]).then(t.bind(null, "1a5b"));
            },
          },
          {
            path: "/hwResult",
            name: "华为Pura70预约",
            component: function () {
              return t.e("chunk-47ace52a").then(t.bind(null, "d0ab"));
            },
          },
          {
            path: "/reservationHWMM",
            name: "华为麦芒30预约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-ff3b45b6"),
              ]).then(t.bind(null, "bdca"));
            },
          },
          {
            path: "/reservationZXPad",
            name: "中兴平板云电脑预约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-070fe93c"),
              ]).then(t.bind(null, "47ae"));
            },
          },
          {
            path: "/hwmmResult",
            name: "华为麦芒30预约",
            component: function () {
              return t.e("chunk-30eb2c7b").then(t.bind(null, "ca72"));
            },
          },
          {
            path: "/zxPadResult",
            name: "中兴平板云电脑预约",
            component: function () {
              return t.e("chunk-6e276ee6").then(t.bind(null, "fc66"));
            },
          },
          {
            path: "/iphone16Result_New",
            name: "Iphone16预约",
            component: function () {
              return t.e("chunk-74bbbec7").then(t.bind(null, "2ccfb"));
            },
          },
          {
            path: "/reservationIphone16_New",
            name: "小米手机终端预约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-1611351e"),
              ]).then(t.bind(null, "3045"));
            },
          },
          {
            path: "/reservationHonor400",
            name: "终端预约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-62fcacff"),
              ]).then(t.bind(null, "ef11"));
            },
          },
          {
            path: "/honor400Result",
            name: "终端预约",
            component: function () {
              return t.e("chunk-e62614b8").then(t.bind(null, "24c4"));
            },
          },
          {
            path: "/reservationFail",
            name: "预约失败",
            component: function () {
              return t.e("chunk-26b4ea4a").then(t.bind(null, "adbb"));
            },
          },
          {
            path: "/Double11Active",
            name: "北京电信活动专区",
            component: function () {
              return t.e("chunk-3db6f122").then(t.bind(null, "d7a3"));
            },
          },
          {
            path: "/Double11Active_short",
            name: "北京电信活动专区",
            component: function () {
              return t.e("chunk-802ce902").then(t.bind(null, "059f"));
            },
          },
          {
            path: "/scratchLogon",
            name: "话费刮刮乐",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-b0083200"),
              ]).then(t.bind(null, "d9ae"));
            },
          },
          {
            path: "/scratchCard",
            name: "话费刮刮乐",
            component: function () {
              return t.e("chunk-39fa07a5").then(t.bind(null, "c94e"));
            },
          },
          {
            path: "/starCardOldUserLottery",
            name: "星卡老用户抽奖",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-01280438"),
              ]).then(t.bind(null, "360e"));
            },
          },
          {
            path: "/highMember_cvip_qy_activity_login",
            name: "权益活动登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6deb5a19"),
              ]).then(t.bind(null, "2477"));
            },
          },
          {
            path: "/starCardOldUserLotteryWin",
            name: "星卡老用户抽奖结果",
            component: function () {
              return t.e("chunk-711c6811").then(t.bind(null, "1bb6"));
            },
          },
          {
            path: "/starCardOldUserLotteryFail",
            name: "星卡老用户抽奖",
            component: function () {
              return t.e("chunk-5d8ec4e4").then(t.bind(null, "aaeb"));
            },
          },
          {
            path: "/GovernmentLogin",
            name: "政企电子化登录",
            component: function () {
              return t.e("chunk-124f237d").then(t.bind(null, "be9b"));
            },
          },
          {
            path: "/ElectronList",
            name: "政企电子化列表",
            component: function () {
              return t.e("chunk-7680786e").then(t.bind(null, "a054"));
            },
          },
          {
            path: "/OSSign",
            name: "政企电子化签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-2d216257"),
                t.e("chunk-391cc822"),
                t.e("chunk-099963fb"),
              ]).then(t.bind(null, "0672"));
            },
          },
          {
            path: "/SatisfactionEvaluation",
            name: "满意度评价",
            component: function () {
              return t.e("chunk-4d76850e").then(t.bind(null, "6923"));
            },
          },
          {
            path: "/SatisfactionEvaluation_zq",
            name: "满意度评价",
            component: function () {
              return t.e("chunk-e1e86a30").then(t.bind(null, "b248"));
            },
          },
          {
            path: "/SatisfactionResult",
            name: "满意度评价",
            component: function () {
              return t.e("chunk-575e3352").then(t.bind(null, "8d1d"));
            },
          },
          {
            path: "/signature",
            name: "您好，请签字",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-7b4f6b1c"),
              ]).then(t.bind(null, "a553"));
            },
          },
          {
            path: "/preDepositHigh_loginDB",
            name: "预存平台登录",
            meta: { trackingEntry: !0 },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-7c82ad96"),
              ]).then(t.bind(null, "e4f5"));
            },
          },
          {
            path: "/preDepositCfq_listDB",
            name: "档位选择",
            component: function () {
              return t.e("chunk-760e79a2").then(t.bind(null, "84fb"));
            },
          },
          {
            path: "/preDepositCfq_confirmDB",
            name: "档位确认",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-4595a1fc"),
              ]).then(t.bind(null, "88a7"));
            },
          },
          {
            path: "/preDeposit_resultDB",
            name: "订单结果",
            component: function () {
              return t.e("chunk-332f7ebd").then(t.bind(null, "d833"));
            },
          },
          {
            path: "/preDepositHigh_loginXB",
            name: "预存平台登录",
            meta: { trackingEntry: !0 },
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-07c326e8"),
              ]).then(t.bind(null, "093a"));
            },
          },
          {
            path: "/preDepositCfq_listXB",
            name: "档位选择",
            component: function () {
              return t.e("chunk-e6c4bab4").then(t.bind(null, "3846"));
            },
          },
          {
            path: "/preDepositCfq_confirmXB",
            name: "档位确认",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-6dc78da8"),
              ]).then(t.bind(null, "d158"));
            },
          },
          {
            path: "/preDeposit_resultXB",
            name: "订单结果",
            component: function () {
              return t.e("chunk-2b29ef0b").then(t.bind(null, "dc41"));
            },
          },
          {
            path: "/TrafficZone",
            name: "流量专区",
            meta: { trackingEntry: !0 },
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-2b349da6"),
                t.e("chunk-0456245c"),
              ]).then(t.bind(null, "7a34"));
            },
          },
          {
            path: "/TrafficResult",
            name: "流量专区",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-126b31e7"),
              ]).then(t.bind(null, "f0d8"));
            },
          },
          {
            path: "/satisfaction_ff",
            name: "满意度反馈",
            component: function () {
              return t.e("chunk-421e3b38").then(t.bind(null, "8f32"));
            },
          },
          {
            path: "/satisfaction_ffResult",
            name: "满意度反馈",
            component: function () {
              return t.e("chunk-d7a9519e").then(t.bind(null, "a6d2"));
            },
          },
          {
            path: "/DlifeCallBack",
            name: "登录",
            component: function () {
              return t.e("chunk-467d19da").then(t.bind(null, "7471"));
            },
          },
          {
            path: "/broadbandSpeedUp_login",
            name: "登录",
            meta: { trackingEntry: !0 },
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-7e34c414"),
              ]).then(t.bind(null, "a9d3"));
            },
          },
          {
            path: "/broadbandSpeedUp_Renew",
            name: "宽带续约",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-ff48172c"),
              ]).then(t.bind(null, "ebdf"));
            },
          },
          {
            path: "/broadbandSpeedUp_Confirm",
            name: "确认订单",
            component: function () {
              return t.e("chunk-b164ec8a").then(t.bind(null, "3d87"));
            },
          },
          {
            path: "/broadbandSpeedUp_Result",
            name: "订单结果",
            component: function () {
              return t.e("chunk-28b7539c").then(t.bind(null, "6d67"));
            },
          },
          {
            path: "/SubsidyCalculator",
            name: "国补计算器",
            component: function () {
              return t.e("chunk-1fd4aa6f").then(t.bind(null, "d672"));
            },
          },
          {
            path: "/ArrearsInquiryLogin",
            name: "欠费查询登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-4eb4df35"),
              ]).then(t.bind(null, "955b"));
            },
          },
          {
            path: "/ArrearsInquiry",
            name: "欠费查询",
            component: function () {
              return t.e("chunk-3656f203").then(t.bind(null, "e4c2"));
            },
          },
          {
            path: "/ArrearsInquiry_pay",
            name: "欠费查询",
            component: function () {
              return t.e("chunk-61860d01").then(t.bind(null, "7201"));
            },
          },
          {
            path: "/ArrearsInquiry_result",
            name: "欠费查询",
            component: function () {
              return t.e("chunk-aa9fc9e4").then(t.bind(null, "caa6"));
            },
          },
          {
            path: "/diagnosisPage_CallForwarding",
            name: "呼叫转移一键诊断",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-60891dd4"),
              ]).then(t.bind(null, "3a45"));
            },
          },
          {
            path: "/installBroadbandSQLogin",
            name: "商圈加装宽带登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-98954a12"),
              ]).then(t.bind(null, "d16a"));
            },
          },
          {
            path: "/installBroadbandSQInit",
            name: "商圈加装宽带",
            component: function () {
              return t.e("chunk-8529784e").then(t.bind(null, "6dbd"));
            },
          },
          {
            path: "/installBroadbandSQAddress",
            name: "商圈加装宽带地址选择",
            component: function () {
              return t.e("chunk-334bb569").then(t.bind(null, "05fa"));
            },
          },
          {
            path: "/installBroadbandSQOrder",
            name: "商圈加装宽带生成订单",
            component: function () {
              return t.e("chunk-740d6e58").then(t.bind(null, "793c"));
            },
          },
          {
            path: "/installBroadbandSQConfirm",
            name: "商圈加装宽带支付",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-312214fa"),
              ]).then(t.bind(null, "f8b1"));
            },
          },
          {
            path: "/installBroadbandSQResult",
            name: "商圈加装宽带支付结果",
            component: function () {
              return t.e("chunk-098b85b2").then(t.bind(null, "c396"));
            },
          },
          {
            path: "/xunjian/reportdata",
            name: "巡检报告",
            component: function () {
              return t.e("chunk-a4f6eeee").then(t.bind(null, "e719"));
            },
          },
          {
            path: "/xunjian/report",
            name: "巡检报告",
            component: function () {
              return t.e("chunk-32e2553e").then(t.bind(null, "a797"));
            },
          },
          {
            path: "/broadCardan_confirm",
            name: "信息确认",
            component: function () {
              return t.e("chunk-511ed362").then(t.bind(null, "b9ef"));
            },
          },
          {
            path: "/signature_broad",
            name: "宽带签名",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-b565554a"),
              ]).then(t.bind(null, "b478"));
            },
          },
          {
            path: "/Accounet_pre_confirm",
            name: "订单确认",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-26174f0b"),
              ]).then(t.bind(null, "0ceb"));
            },
          },
          {
            path: "/Accounet_pre_confirmResult",
            name: "订单确认",
            component: function () {
              return t.e("chunk-66672a17").then(t.bind(null, "cc52"));
            },
          },
          {
            path: "/thresholdAlert",
            name: "阈值提醒",
            component: function () {
              return t.e("chunk-77ea095b").then(t.bind(null, "8a55"));
            },
          },
          {
            path: "/thresholdConfirm",
            name: "阈值提醒",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-75495d54"),
              ]).then(t.bind(null, "75e8"));
            },
          },
          {
            path: "/thresholdResult",
            name: "阈值提醒",
            component: function () {
              return t.e("chunk-12f7839c").then(t.bind(null, "905d"));
            },
          },
          {
            path: "/trafficCap",
            name: "套外上网暂停",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-9d99740c"),
              ]).then(t.bind(null, "67ea"));
            },
          },
          {
            path: "/trafficCapResult",
            name: "套外上网暂停",
            component: function () {
              return t.e("chunk-ea5c70a8").then(t.bind(null, "87e0"));
            },
          },
          {
            path: "/consumerRealName",
            name: "消费百科网",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-50a13a85"),
                t.e("chunk-d0d88132"),
              ]).then(t.bind(null, "a001"));
            },
          },
          {
            path: "/consumerConfirm",
            name: "消费百科网",
            component: function () {
              return t.e("chunk-10230712").then(t.bind(null, "b60b"));
            },
          },
          {
            path: "/consumerResult",
            name: "消费百科网",
            component: function () {
              return t.e("chunk-66f108a4").then(t.bind(null, "2fa0"));
            },
          },
          {
            path: "/broadbandTroubleshootingLogin",
            name: "宽带自助排障登录",
            component: function () {
              return t.e("chunk-59c6208a").then(t.bind(null, "54cc"));
            },
          },
          {
            path: "/broadbandTroubleshooting",
            name: "宽带自助排障",
            component: function () {
              return t.e("chunk-7d6a56a1").then(t.bind(null, "340f"));
            },
          },
          {
            path: "/broadWeb",
            name: "老用户加装宽带",
            component: function () {
              return t.e("chunk-7a217b3a").then(t.bind(null, "91bb"));
            },
          },
          {
            path: "/renewalLogin",
            name: "移动续约登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-4086d6cd"),
              ]).then(t.bind(null, "9b7e"));
            },
          },
          {
            path: "/IVRLogin",
            name: "IVR业务协议签字登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-c24d8570"),
              ]).then(t.bind(null, "7773"));
            },
          },
          {
            path: "/renewalPackage",
            name: "移动续约",
            component: function () {
              return t.e("chunk-60b5460c").then(t.bind(null, "5953"));
            },
          },
          {
            path: "/renewalPublicPackage",
            name: "移动续约",
            component: function () {
              return t.e("chunk-dfcb5e80").then(t.bind(null, "9cb9"));
            },
          },
          {
            path: "/renewalSchoolPackage",
            name: "移动续约",
            component: function () {
              return t.e("chunk-785cb59f").then(t.bind(null, "da49"));
            },
          },
          {
            path: "/agent/smartLogin",
            name: "智能套餐助手登录",
            component: function () {
              return Promise.all([
                t.e("chunk-60edd172"),
                t.e("chunk-163f8756"),
                t.e("chunk-26885a53"),
              ]).then(t.bind(null, "ec8f"));
            },
          },
          {
            path: "/agent/smartPackage",
            name: "智能套餐助手",
            component: function () {
              return t.e("chunk-0a97dd28").then(t.bind(null, "fb0a"));
            },
          },
          {
            path: "/agent/smartPackageConfirm",
            name: "智能套餐确认",
            component: function () {
              return t.e("chunk-3960b932").then(t.bind(null, "c07f"));
            },
          },
          {
            path: "/agent/smartPackageResult",
            name: "智能套餐办理结果",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-db96342c"),
              ]).then(t.bind(null, "fcab"));
            },
          },
          {
            path: "/renewalConfirm",
            name: "移动续约",
            component: function () {
              return t.e("chunk-2f0fffca").then(t.bind(null, "9efe"));
            },
          },
          {
            path: "/renewalResult",
            name: "移动续约",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-e5007170"),
              ]).then(t.bind(null, "d3f9"));
            },
          },
          {
            path: "/sandTableUpload",
            name: "上传证件照片",
            component: function () {
              return t.e("chunk-053a951e").then(t.bind(null, "65d9"));
            },
          },
        ],
      });
      function F(n, e) {
        var t = f(n),
          r = k(n),
          a = w(n);
        if (
          (console.log("whiteListTest2" + t),
          console.log("whiteListTest4" + r),
          a && 1 == a.status)
        ) {
          window.sessionStorage.setItem("loginUrl", window.location.href),
            window.sessionStorage.setItem("loginUrl-1", o),
            window.sessionStorage.setItem("loginUrl-2", e),
            window.sessionStorage.setItem("loginTitle", a.linkName);
          var o = window.location.href,
            u = window.location.href.indexOf("/?"),
            c = window.location.href.indexOf("/", u + 1);
          u > -1
            ? ((o = o.slice(0, u) + o.slice(c)), window.location.replace(o))
            : window.location.replace(
                "https://wapbj.189.cn/echnwap/publicLoginGM?logStatu=serv"
              );
        } else if (t && 1 == t.status) {
          window.sessionStorage.setItem("loginUrl", window.location.href),
            window.sessionStorage.setItem("loginUrl-1", d),
            window.sessionStorage.setItem("loginUrl-2", e),
            window.sessionStorage.setItem("loginTitle", t.linkName);
          var i = g(d),
            l = i && 1 == i.status ? "publicLoginPuzzle" : "publicLogin",
            d = window.location.href,
            p = window.location.href.indexOf("/?"),
            h = window.location.href.indexOf("/", p + 1);
          p > -1
            ? ((d = d.slice(0, p) + d.slice(h)), window.location.replace(d))
            : window.location.replace(
                "https://wapbj.189.cn/echnwap/" + l + "?logStatu=serv"
              );
        } else
          r && 1 == r.status
            ? (console.log("whiteListTest4" + r),
              window.location.replace(
                "https://wapbj.189.cn/echnwap/noLoginError"
              ))
            : e();
      }
      y.beforeEach(function (n, e, t) {
        var a = e.query.channel || "",
          o = e.query.channelId || "",
          c = n.query.channel || "",
          i = n.query.channelId || "";
        if (
          (console.log(n),
          console.log(e),
          console.log("" != a || "" != o),
          console.log(!c),
          console.log(!i),
          console.log("-------"),
          !(("" == a && "" == o) || c || i))
        )
          return (
            console.log("走了1"),
            void t({
              path: n.path,
              query: Object(r["a"])(
                Object(r["a"])({}, n.query),
                {},
                { channel: a || o }
              ),
            })
          );
        if ((console.log("走了2"), t(), a || o || c || i)) {
          console.log("调用了");
          var l = { channel: c || i || a || o };
          Object(u["Lb"])(l);
        }
      }),
        y.beforeEach(function (n, e, t) {
          if (
            (n.meta && n.meta.trackingEntry
              ? Object(P["c"])(n.query)
                ? Object(P["a"])(n.query)
                : Object(P["b"])()
              : Object(P["c"])(n.query) && Object(P["a"])(n.query),
            n.path &&
              (document.title =
                (n.meta && n.meta.title) || n.name || "掌上营业厅"),
            console.log(window.location.href),
            console.log(n),
            window.location.href.indexOf("/#/") > -1)
          ) {
            var r = window.location.href.replace("/#/", "/");
            window.location.replace(r);
          } else {
            var a = window.location.href,
              o = window.location.href.indexOf("/?LSsoQnpf9ccH"),
              c = window.location.href.indexOf("#/", o + 1);
            if (o > -1 && c > -1)
              return (
                (a = a.slice(0, o) + a.slice(c + 1)),
                void window.location.replace(a)
              );
            -1 == n.path.indexOf("/NumberIndex") &&
              (document.querySelector("body").setAttribute("class", ""),
              document.querySelector("html").setAttribute("class", ""));
            var i = m(),
              l = s();
            i ? h() : 0 == l && d(),
              n.query.utm_scha &&
                Object(u["bj"])({ utm_scha: n.query.utm_scha }).then(
                  function () {
                    console.log("设置了utm_scha=" + n.query.utm_scha);
                  }
                ),
              Object(u["rg"])()
                .then(function (e) {
                  if (0 == e.result)
                    if ("" == e.object) F(n.fullPath, t);
                    else {
                      var r = b(n.fullPath);
                      if (r && 1 == r.status) (window.loginNum = e.object), t();
                      else {
                        var a = /^(B|b)\d{8}$/,
                          o = window.sessionStorage.getItem("ssoLoginNum");
                        if (a.test(e.object) && null != o && "" != o) {
                          var c = { phoneNumber: o };
                          Object(u["nf"])(c).then(function (n) {
                            "0" == n.result && (window.loginNum = o), t();
                          });
                        } else (window.loginNum = e.object), t();
                      }
                    }
                })
                .catch(function (n) {
                  t();
                });
          }
        });
      var N = function (n) {
        var e = null;
        if (document.cookie && "" != document.cookie)
          for (var t = document.cookie.split(";"), r = 0; r < t.length; r++) {
            var a = t[r];
            if (
              ((a = a.replace(/^\s*|\s*$/g, "")),
              a.substring(0, n.length + 1) == n + "=")
            ) {
              e = decodeURIComponent(a.substring(n.length + 1));
              break;
            }
          }
        return e;
      };
      y.afterEach(function (n, e) {
        navigator.userAgent.toLowerCase();
        try {
          uni.postMessage({ data: n.fullPath }), console.log("bbbbbbbb");
        } catch (t) {
          console.log(t);
        }
        "Qk04YWN5M1d1VlpWRU5uYWlnMzVaUT09" != Object(C["b"])(N("phoneNo"))
          ? (Object(u["vh"])({ busiType: "CommonNotice" }).then(function (n) {
              "0" == n.result &&
                null != n.object &&
                (window.sessionStorage.setItem("busiType", n.object),
                y.push({
                  path: "/announDetail",
                  query: { busiType: "CommonNotice" },
                }));
            }),
            console.log(n),
            Object(u["vh"])({ busiType: n.path.split("/")[1] }).then(function (
              n
            ) {
              "0" == n.result &&
                null != n.object &&
                (window.sessionStorage.setItem("busiType", n.object),
                y.push({
                  path: "/announDetail",
                  query: { busiType: "CommonNotice" },
                }));
            }))
          : console.log("灰度环境");
      });
      e["a"] = y;
    },
    "43a1": function (n, e, t) {},
    "4dcb": function (n, e, t) {},
    "4ec3": function (n, e, t) {
      "use strict";
      t.d(e, "Wi", function () {
        return p;
      }),
        t.d(e, "Xi", function () {
          return h;
        }),
        t.d(e, "Vj", function () {
          return s;
        }),
        t.d(e, "Fd", function () {
          return m;
        }),
        t.d(e, "bj", function () {
          return f;
        }),
        t.d(e, "Sd", function () {
          return b;
        }),
        t.d(e, "Qb", function () {
          return k;
        }),
        t.d(e, "C", function () {
          return w;
        }),
        t.d(e, "zd", function () {
          return g;
        }),
        t.d(e, "Xj", function () {
          return C;
        }),
        t.d(e, "Ue", function () {
          return P;
        }),
        t.d(e, "Vb", function () {
          return y;
        }),
        t.d(e, "Cg", function () {
          return F;
        }),
        t.d(e, "ce", function () {
          return N;
        }),
        t.d(e, "ph", function () {
          return B;
        }),
        t.d(e, "Se", function () {
          return v;
        }),
        t.d(e, "Nc", function () {
          return S;
        }),
        t.d(e, "tj", function () {
          return O;
        }),
        t.d(e, "Qe", function () {
          return R;
        }),
        t.d(e, "Re", function () {
          return A;
        }),
        t.d(e, "xh", function () {
          return j;
        }),
        t.d(e, "pi", function () {
          return _;
        }),
        t.d(e, "oh", function () {
          return I;
        }),
        t.d(e, "wh", function () {
          return U;
        }),
        t.d(e, "vh", function () {
          return T;
        }),
        t.d(e, "rg", function () {
          return L;
        }),
        t.d(e, "xi", function () {
          return q;
        }),
        t.d(e, "vi", function () {
          return D;
        }),
        t.d(e, "wi", function () {
          return x;
        }),
        t.d(e, "yc", function () {
          return E;
        }),
        t.d(e, "Bj", function () {
          return M;
        }),
        t.d(e, "Df", function () {
          return Q;
        }),
        t.d(e, "Pj", function () {
          return $;
        }),
        t.d(e, "H", function () {
          return H;
        }),
        t.d(e, "J", function () {
          return G;
        }),
        t.d(e, "Dh", function () {
          return V;
        }),
        t.d(e, "mh", function () {
          return Y;
        }),
        t.d(e, "Bf", function () {
          return W;
        }),
        t.d(e, "Cf", function () {
          return z;
        }),
        t.d(e, "be", function () {
          return Z;
        }),
        t.d(e, "D", function () {
          return J;
        }),
        t.d(e, "Tc", function () {
          return K;
        }),
        t.d(e, "Vf", function () {
          return X;
        }),
        t.d(e, "jh", function () {
          return nn;
        }),
        t.d(e, "Cc", function () {
          return en;
        }),
        t.d(e, "Ph", function () {
          return tn;
        }),
        t.d(e, "Nf", function () {
          return rn;
        }),
        t.d(e, "Bh", function () {
          return an;
        }),
        t.d(e, "ug", function () {
          return on;
        }),
        t.d(e, "me", function () {
          return un;
        }),
        t.d(e, "Zj", function () {
          return cn;
        }),
        t.d(e, "Hb", function () {
          return ln;
        }),
        t.d(e, "pe", function () {
          return dn;
        }),
        t.d(e, "Gb", function () {
          return pn;
        }),
        t.d(e, "Ug", function () {
          return hn;
        }),
        t.d(e, "Mh", function () {
          return sn;
        }),
        t.d(e, "eg", function () {
          return mn;
        }),
        t.d(e, "Rf", function () {
          return fn;
        }),
        t.d(e, "Wf", function () {
          return bn;
        }),
        t.d(e, "Pf", function () {
          return kn;
        }),
        t.d(e, "Mi", function () {
          return wn;
        }),
        t.d(e, "rh", function () {
          return gn;
        }),
        t.d(e, "Qf", function () {
          return Cn;
        }),
        t.d(e, "Fc", function () {
          return Pn;
        }),
        t.d(e, "Ec", function () {
          return yn;
        }),
        t.d(e, "vg", function () {
          return Fn;
        }),
        t.d(e, "rj", function () {
          return Nn;
        }),
        t.d(e, "Sc", function () {
          return Bn;
        }),
        t.d(e, "Yj", function () {
          return vn;
        }),
        t.d(e, "nf", function () {
          return Sn;
        }),
        t.d(e, "T", function () {
          return On;
        }),
        t.d(e, "Pe", function () {
          return Rn;
        }),
        t.d(e, "ch", function () {
          return An;
        }),
        t.d(e, "Uc", function () {
          return jn;
        }),
        t.d(e, "Rj", function () {
          return _n;
        }),
        t.d(e, "Ji", function () {
          return In;
        }),
        t.d(e, "Li", function () {
          return Un;
        }),
        t.d(e, "Ah", function () {
          return Tn;
        }),
        t.d(e, "Af", function () {
          return Ln;
        }),
        t.d(e, "df", function () {
          return qn;
        }),
        t.d(e, "ub", function () {
          return Dn;
        }),
        t.d(e, "eh", function () {
          return xn;
        }),
        t.d(e, "Vg", function () {
          return En;
        }),
        t.d(e, "Hi", function () {
          return Mn;
        }),
        t.d(e, "Ie", function () {
          return Qn;
        }),
        t.d(e, "ad", function () {
          return $n;
        }),
        t.d(e, "Sf", function () {
          return Hn;
        }),
        t.d(e, "Ab", function () {
          return Gn;
        }),
        t.d(e, "sc", function () {
          return Vn;
        }),
        t.d(e, "V", function () {
          return Yn;
        }),
        t.d(e, "Bc", function () {
          return Wn;
        }),
        t.d(e, "Xb", function () {
          return zn;
        }),
        t.d(e, "G", function () {
          return Zn;
        }),
        t.d(e, "ef", function () {
          return Jn;
        }),
        t.d(e, "dh", function () {
          return Kn;
        }),
        t.d(e, "Yg", function () {
          return Xn;
        }),
        t.d(e, "xb", function () {
          return ne;
        }),
        t.d(e, "Bi", function () {
          return ee;
        }),
        t.d(e, "zi", function () {
          return te;
        }),
        t.d(e, "Gi", function () {
          return re;
        }),
        t.d(e, "Jh", function () {
          return ae;
        }),
        t.d(e, "tc", function () {
          return oe;
        }),
        t.d(e, "qg", function () {
          return ue;
        }),
        t.d(e, "cd", function () {
          return ce;
        }),
        t.d(e, "wb", function () {
          return ie;
        }),
        t.d(e, "Tf", function () {
          return le;
        }),
        t.d(e, "Be", function () {
          return de;
        }),
        t.d(e, "vc", function () {
          return pe;
        }),
        t.d(e, "Bb", function () {
          return he;
        }),
        t.d(e, "wc", function () {
          return se;
        }),
        t.d(e, "Cb", function () {
          return me;
        }),
        t.d(e, "W", function () {
          return fe;
        }),
        t.d(e, "ni", function () {
          return be;
        }),
        t.d(e, "Uf", function () {
          return ke;
        }),
        t.d(e, "rc", function () {
          return we;
        }),
        t.d(e, "fh", function () {
          return ge;
        }),
        t.d(e, "Db", function () {
          return Ce;
        }),
        t.d(e, "U", function () {
          return Pe;
        }),
        t.d(e, "Yc", function () {
          return ye;
        }),
        t.d(e, "Zc", function () {
          return Fe;
        }),
        t.d(e, "kh", function () {
          return Ne;
        }),
        t.d(e, "Gc", function () {
          return Be;
        }),
        t.d(e, "Fi", function () {
          return ve;
        }),
        t.d(e, "Ai", function () {
          return Se;
        }),
        t.d(e, "zb", function () {
          return Oe;
        }),
        t.d(e, "ei", function () {
          return Re;
        }),
        t.d(e, "ai", function () {
          return Ae;
        }),
        t.d(e, "ci", function () {
          return je;
        }),
        t.d(e, "Xh", function () {
          return _e;
        }),
        t.d(e, "Vh", function () {
          return Ie;
        }),
        t.d(e, "Zh", function () {
          return Ue;
        }),
        t.d(e, "bi", function () {
          return Te;
        }),
        t.d(e, "di", function () {
          return Le;
        }),
        t.d(e, "Yh", function () {
          return qe;
        }),
        t.d(e, "Wh", function () {
          return De;
        }),
        t.d(e, "bc", function () {
          return xe;
        }),
        t.d(e, "Ij", function () {
          return Ee;
        }),
        t.d(e, "Si", function () {
          return Me;
        }),
        t.d(e, "cg", function () {
          return Qe;
        }),
        t.d(e, "gc", function () {
          return $e;
        }),
        t.d(e, "vj", function () {
          return He;
        }),
        t.d(e, "yb", function () {
          return Ge;
        }),
        t.d(e, "mf", function () {
          return Ve;
        }),
        t.d(e, "ti", function () {
          return Ye;
        }),
        t.d(e, "Tj", function () {
          return We;
        }),
        t.d(e, "ui", function () {
          return ze;
        }),
        t.d(e, "qi", function () {
          return Ze;
        }),
        t.d(e, "ri", function () {
          return Je;
        }),
        t.d(e, "u", function () {
          return Ke;
        }),
        t.d(e, "s", function () {
          return Xe;
        }),
        t.d(e, "z", function () {
          return nt;
        }),
        t.d(e, "x", function () {
          return et;
        }),
        t.d(e, "o", function () {
          return tt;
        }),
        t.d(e, "p", function () {
          return rt;
        }),
        t.d(e, "v", function () {
          return at;
        }),
        t.d(e, "j", function () {
          return ot;
        }),
        t.d(e, "k", function () {
          return ut;
        }),
        t.d(e, "l", function () {
          return ct;
        }),
        t.d(e, "A", function () {
          return it;
        }),
        t.d(e, "m", function () {
          return lt;
        }),
        t.d(e, "q", function () {
          return dt;
        }),
        t.d(e, "Rb", function () {
          return pt;
        }),
        t.d(e, "Fh", function () {
          return ht;
        }),
        t.d(e, "ic", function () {
          return st;
        }),
        t.d(e, "R", function () {
          return mt;
        }),
        t.d(e, "Ef", function () {
          return ft;
        }),
        t.d(e, "Ti", function () {
          return bt;
        }),
        t.d(e, "li", function () {
          return kt;
        }),
        t.d(e, "id", function () {
          return wt;
        }),
        t.d(e, "Kc", function () {
          return gt;
        }),
        t.d(e, "Pb", function () {
          return Ct;
        }),
        t.d(e, "Lc", function () {
          return Pt;
        }),
        t.d(e, "Sg", function () {
          return yt;
        }),
        t.d(e, "kc", function () {
          return Ft;
        }),
        t.d(e, "jc", function () {
          return Nt;
        }),
        t.d(e, "lc", function () {
          return Bt;
        }),
        t.d(e, "Wc", function () {
          return vt;
        }),
        t.d(e, "Xc", function () {
          return St;
        }),
        t.d(e, "Vc", function () {
          return Ot;
        }),
        t.d(e, "Th", function () {
          return Rt;
        }),
        t.d(e, "ab", function () {
          return At;
        }),
        t.d(e, "bb", function () {
          return jt;
        }),
        t.d(e, "jj", function () {
          return _t;
        }),
        t.d(e, "Hh", function () {
          return It;
        }),
        t.d(e, "We", function () {
          return Ut;
        }),
        t.d(e, "Kj", function () {
          return Tt;
        }),
        t.d(e, "Jj", function () {
          return Lt;
        }),
        t.d(e, "qe", function () {
          return qt;
        }),
        t.d(e, "tg", function () {
          return Dt;
        }),
        t.d(e, "tb", function () {
          return xt;
        }),
        t.d(e, "Ge", function () {
          return Et;
        }),
        t.d(e, "wd", function () {
          return Mt;
        }),
        t.d(e, "S", function () {
          return Qt;
        }),
        t.d(e, "ee", function () {
          return $t;
        }),
        t.d(e, "gg", function () {
          return Ht;
        }),
        t.d(e, "ec", function () {
          return Gt;
        }),
        t.d(e, "Xe", function () {
          return Vt;
        }),
        t.d(e, "db", function () {
          return Yt;
        }),
        t.d(e, "se", function () {
          return Wt;
        }),
        t.d(e, "we", function () {
          return zt;
        }),
        t.d(e, "te", function () {
          return Zt;
        }),
        t.d(e, "Ng", function () {
          return Jt;
        }),
        t.d(e, "zg", function () {
          return Kt;
        }),
        t.d(e, "bg", function () {
          return Xt;
        }),
        t.d(e, "sg", function () {
          return nr;
        }),
        t.d(e, "re", function () {
          return er;
        }),
        t.d(e, "ue", function () {
          return tr;
        }),
        t.d(e, "Nh", function () {
          return rr;
        }),
        t.d(e, "Q", function () {
          return ar;
        }),
        t.d(e, "Fg", function () {
          return or;
        }),
        t.d(e, "Ad", function () {
          return ur;
        }),
        t.d(e, "rd", function () {
          return cr;
        }),
        t.d(e, "ak", function () {
          return ir;
        }),
        t.d(e, "ck", function () {
          return lr;
        }),
        t.d(e, "bk", function () {
          return dr;
        }),
        t.d(e, "Ff", function () {
          return pr;
        }),
        t.d(e, "Ae", function () {
          return hr;
        }),
        t.d(e, "Jf", function () {
          return sr;
        }),
        t.d(e, "Yi", function () {
          return mr;
        }),
        t.d(e, "Zi", function () {
          return fr;
        }),
        t.d(e, "Uj", function () {
          return br;
        }),
        t.d(e, "mg", function () {
          return kr;
        }),
        t.d(e, "Me", function () {
          return wr;
        }),
        t.d(e, "Kb", function () {
          return gr;
        }),
        t.d(e, "Ne", function () {
          return Cr;
        }),
        t.d(e, "ne", function () {
          return Pr;
        }),
        t.d(e, "Fb", function () {
          return yr;
        }),
        t.d(e, "Xd", function () {
          return Fr;
        }),
        t.d(e, "Le", function () {
          return Nr;
        }),
        t.d(e, "jg", function () {
          return Br;
        }),
        t.d(e, "fg", function () {
          return vr;
        }),
        t.d(e, "td", function () {
          return Sr;
        }),
        t.d(e, "ae", function () {
          return Or;
        }),
        t.d(e, "Cj", function () {
          return Rr;
        }),
        t.d(e, "Gd", function () {
          return Ar;
        }),
        t.d(e, "Og", function () {
          return jr;
        }),
        t.d(e, "Gf", function () {
          return _r;
        }),
        t.d(e, "bh", function () {
          return Ir;
        }),
        t.d(e, "kd", function () {
          return Ur;
        }),
        t.d(e, "dg", function () {
          return Tr;
        }),
        t.d(e, "Ve", function () {
          return Lr;
        }),
        t.d(e, "og", function () {
          return qr;
        }),
        t.d(e, "Oh", function () {
          return Dr;
        }),
        t.d(e, "Ii", function () {
          return xr;
        }),
        t.d(e, "pg", function () {
          return Er;
        }),
        t.d(e, "Oj", function () {
          return Mr;
        }),
        t.d(e, "Wd", function () {
          return Qr;
        }),
        t.d(e, "Fe", function () {
          return $r;
        }),
        t.d(e, "De", function () {
          return Hr;
        }),
        t.d(e, "Ee", function () {
          return Gr;
        }),
        t.d(e, "lh", function () {
          return Vr;
        }),
        t.d(e, "Rh", function () {
          return Yr;
        }),
        t.d(e, "Wj", function () {
          return Wr;
        }),
        t.d(e, "nj", function () {
          return zr;
        }),
        t.d(e, "Eh", function () {
          return Zr;
        }),
        t.d(e, "Tb", function () {
          return Jr;
        }),
        t.d(e, "Pc", function () {
          return Kr;
        }),
        t.d(e, "Qc", function () {
          return Xr;
        }),
        t.d(e, "dc", function () {
          return na;
        }),
        t.d(e, "Zf", function () {
          return ea;
        }),
        t.d(e, "zj", function () {
          return ta;
        }),
        t.d(e, "yh", function () {
          return ra;
        }),
        t.d(e, "Aj", function () {
          return aa;
        }),
        t.d(e, "cb", function () {
          return oa;
        }),
        t.d(e, "ib", function () {
          return ua;
        }),
        t.d(e, "Xf", function () {
          return ca;
        }),
        t.d(e, "Yf", function () {
          return ia;
        }),
        t.d(e, "kg", function () {
          return la;
        }),
        t.d(e, "wg", function () {
          return da;
        }),
        t.d(e, "ve", function () {
          return pa;
        }),
        t.d(e, "xe", function () {
          return ha;
        }),
        t.d(e, "qd", function () {
          return sa;
        }),
        t.d(e, "Eb", function () {
          return ma;
        }),
        t.d(e, "eb", function () {
          return fa;
        }),
        t.d(e, "fb", function () {
          return ba;
        }),
        t.d(e, "mj", function () {
          return ka;
        }),
        t.d(e, "yg", function () {
          return wa;
        }),
        t.d(e, "ze", function () {
          return ga;
        }),
        t.d(e, "Gh", function () {
          return Ca;
        }),
        t.d(e, "Ze", function () {
          return Pa;
        }),
        t.d(e, "Ye", function () {
          return ya;
        }),
        t.d(e, "af", function () {
          return Fa;
        }),
        t.d(e, "jb", function () {
          return Na;
        }),
        t.d(e, "b", function () {
          return Ba;
        }),
        t.d(e, "Wg", function () {
          return va;
        }),
        t.d(e, "Lh", function () {
          return Sa;
        }),
        t.d(e, "c", function () {
          return Oa;
        }),
        t.d(e, "Pi", function () {
          return Ra;
        }),
        t.d(e, "uj", function () {
          return Aa;
        }),
        t.d(e, "Ob", function () {
          return ja;
        }),
        t.d(e, "Fj", function () {
          return _a;
        }),
        t.d(e, "Hg", function () {
          return Ia;
        }),
        t.d(e, "uh", function () {
          return Ua;
        }),
        t.d(e, "Hc", function () {
          return Ta;
        }),
        t.d(e, "Xg", function () {
          return La;
        }),
        t.d(e, "d", function () {
          return qa;
        }),
        t.d(e, "a", function () {
          return Da;
        }),
        t.d(e, "N", function () {
          return xa;
        }),
        t.d(e, "O", function () {
          return Ea;
        }),
        t.d(e, "Z", function () {
          return Ma;
        }),
        t.d(e, "Y", function () {
          return Qa;
        }),
        t.d(e, "ac", function () {
          return $a;
        }),
        t.d(e, "Dj", function () {
          return Ha;
        }),
        t.d(e, "Ei", function () {
          return Ga;
        }),
        t.d(e, "Di", function () {
          return Va;
        }),
        t.d(e, "Ni", function () {
          return Ya;
        }),
        t.d(e, "Oi", function () {
          return Wa;
        }),
        t.d(e, "lg", function () {
          return za;
        }),
        t.d(e, "bf", function () {
          return Za;
        }),
        t.d(e, "Ig", function () {
          return Ja;
        }),
        t.d(e, "Ui", function () {
          return Ka;
        }),
        t.d(e, "Ch", function () {
          return Xa;
        }),
        t.d(e, "gh", function () {
          return no;
        }),
        t.d(e, "hh", function () {
          return eo;
        }),
        t.d(e, "Uh", function () {
          return to;
        }),
        t.d(e, "de", function () {
          return ro;
        }),
        t.d(e, "Qh", function () {
          return ao;
        }),
        t.d(e, "qh", function () {
          return oo;
        }),
        t.d(e, "Ac", function () {
          return uo;
        }),
        t.d(e, "if", function () {
          return co;
        }),
        t.d(e, "kj", function () {
          return io;
        }),
        t.d(e, "aj", function () {
          return lo;
        }),
        t.d(e, "of", function () {
          return po;
        }),
        t.d(e, "ff", function () {
          return ho;
        }),
        t.d(e, "gf", function () {
          return so;
        }),
        t.d(e, "lf", function () {
          return mo;
        }),
        t.d(e, "cf", function () {
          return fo;
        }),
        t.d(e, "kf", function () {
          return bo;
        }),
        t.d(e, "rf", function () {
          return ko;
        }),
        t.d(e, "sf", function () {
          return wo;
        }),
        t.d(e, "tf", function () {
          return go;
        }),
        t.d(e, "uf", function () {
          return Co;
        }),
        t.d(e, "vf", function () {
          return Po;
        }),
        t.d(e, "wf", function () {
          return yo;
        }),
        t.d(e, "xf", function () {
          return Fo;
        }),
        t.d(e, "yf", function () {
          return No;
        }),
        t.d(e, "zf", function () {
          return Bo;
        }),
        t.d(e, "jf", function () {
          return vo;
        }),
        t.d(e, "qf", function () {
          return So;
        }),
        t.d(e, "If", function () {
          return Oo;
        }),
        t.d(e, "mc", function () {
          return Ro;
        }),
        t.d(e, "ob", function () {
          return Ao;
        }),
        t.d(e, "qb", function () {
          return jo;
        }),
        t.d(e, "mb", function () {
          return _o;
        }),
        t.d(e, "pb", function () {
          return Io;
        }),
        t.d(e, "Of", function () {
          return Uo;
        }),
        t.d(e, "mi", function () {
          return To;
        }),
        t.d(e, "cc", function () {
          return Lo;
        }),
        t.d(e, "oi", function () {
          return qo;
        }),
        t.d(e, "Qj", function () {
          return Do;
        }),
        t.d(e, "ih", function () {
          return xo;
        }),
        t.d(e, "uc", function () {
          return Eo;
        }),
        t.d(e, "od", function () {
          return Mo;
        }),
        t.d(e, "I", function () {
          return Qo;
        }),
        t.d(e, "xc", function () {
          return $o;
        }),
        t.d(e, "Ej", function () {
          return Ho;
        }),
        t.d(e, "ag", function () {
          return Go;
        }),
        t.d(e, "Jc", function () {
          return Vo;
        }),
        t.d(e, "sh", function () {
          return Yo;
        }),
        t.d(e, "ke", function () {
          return Wo;
        }),
        t.d(e, "si", function () {
          return zo;
        }),
        t.d(e, "r", function () {
          return Zo;
        }),
        t.d(e, "t", function () {
          return Jo;
        }),
        t.d(e, "w", function () {
          return Ko;
        }),
        t.d(e, "B", function () {
          return Xo;
        }),
        t.d(e, "n", function () {
          return nu;
        }),
        t.d(e, "y", function () {
          return eu;
        }),
        t.d(e, "Vd", function () {
          return tu;
        }),
        t.d(e, "Td", function () {
          return ru;
        }),
        t.d(e, "f", function () {
          return au;
        }),
        t.d(e, "i", function () {
          return ou;
        }),
        t.d(e, "g", function () {
          return uu;
        }),
        t.d(e, "e", function () {
          return cu;
        }),
        t.d(e, "h", function () {
          return iu;
        }),
        t.d(e, "Jg", function () {
          return lu;
        }),
        t.d(e, "Rc", function () {
          return du;
        }),
        t.d(e, "Kh", function () {
          return pu;
        }),
        t.d(e, "Ud", function () {
          return hu;
        }),
        t.d(e, "nh", function () {
          return su;
        }),
        t.d(e, "hb", function () {
          return mu;
        }),
        t.d(e, "gb", function () {
          return fu;
        }),
        t.d(e, "Yd", function () {
          return bu;
        }),
        t.d(e, "Sj", function () {
          return ku;
        }),
        t.d(e, "Od", function () {
          return wu;
        }),
        t.d(e, "Jd", function () {
          return gu;
        }),
        t.d(e, "Hd", function () {
          return Cu;
        }),
        t.d(e, "Rd", function () {
          return Pu;
        }),
        t.d(e, "Ld", function () {
          return yu;
        }),
        t.d(e, "Kd", function () {
          return Fu;
        }),
        t.d(e, "Id", function () {
          return Nu;
        }),
        t.d(e, "Pd", function () {
          return Bu;
        }),
        t.d(e, "Nd", function () {
          return vu;
        }),
        t.d(e, "Md", function () {
          return Su;
        }),
        t.d(e, "Qd", function () {
          return Ou;
        }),
        t.d(e, "sd", function () {
          return Ru;
        }),
        t.d(e, "Lf", function () {
          return Au;
        }),
        t.d(e, "hi", function () {
          return ju;
        }),
        t.d(e, "ii", function () {
          return _u;
        }),
        t.d(e, "ji", function () {
          return Iu;
        }),
        t.d(e, "gi", function () {
          return Uu;
        }),
        t.d(e, "fi", function () {
          return Tu;
        }),
        t.d(e, "he", function () {
          return Lu;
        }),
        t.d(e, "ie", function () {
          return qu;
        }),
        t.d(e, "zc", function () {
          return Du;
        }),
        t.d(e, "Rg", function () {
          return xu;
        }),
        t.d(e, "Lg", function () {
          return Eu;
        }),
        t.d(e, "hj", function () {
          return Mu;
        }),
        t.d(e, "ij", function () {
          return Qu;
        }),
        t.d(e, "Ci", function () {
          return $u;
        }),
        t.d(e, "Dc", function () {
          return Hu;
        }),
        t.d(e, "Ib", function () {
          return Gu;
        }),
        t.d(e, "Lb", function () {
          return Vu;
        }),
        t.d(e, "bd", function () {
          return Yu;
        }),
        t.d(e, "ud", function () {
          return Wu;
        }),
        t.d(e, "Zd", function () {
          return zu;
        }),
        t.d(e, "xg", function () {
          return Zu;
        }),
        t.d(e, "rb", function () {
          return Ju;
        }),
        t.d(e, "ye", function () {
          return Ku;
        }),
        t.d(e, "Zb", function () {
          return Xu;
        }),
        t.d(e, "Yb", function () {
          return nc;
        }),
        t.d(e, "Ub", function () {
          return ec;
        }),
        t.d(e, "fc", function () {
          return tc;
        }),
        t.d(e, "E", function () {
          return rc;
        }),
        t.d(e, "F", function () {
          return ac;
        }),
        t.d(e, "dd", function () {
          return oc;
        }),
        t.d(e, "ed", function () {
          return uc;
        }),
        t.d(e, "Kf", function () {
          return cc;
        }),
        t.d(e, "M", function () {
          return ic;
        }),
        t.d(e, "gd", function () {
          return lc;
        }),
        t.d(e, "hd", function () {
          return dc;
        }),
        t.d(e, "fd", function () {
          return pc;
        }),
        t.d(e, "oe", function () {
          return hc;
        }),
        t.d(e, "Mj", function () {
          return sc;
        }),
        t.d(e, "qj", function () {
          return mc;
        }),
        t.d(e, "Zg", function () {
          return fc;
        }),
        t.d(e, "Sb", function () {
          return bc;
        }),
        t.d(e, "Ki", function () {
          return kc;
        }),
        t.d(e, "hc", function () {
          return wc;
        }),
        t.d(e, "Te", function () {
          return gc;
        }),
        t.d(e, "Oc", function () {
          return Cc;
        }),
        t.d(e, "Wb", function () {
          return Pc;
        }),
        t.d(e, "Vi", function () {
          return yc;
        }),
        t.d(e, "Sh", function () {
          return Fc;
        }),
        t.d(e, "jd", function () {
          return Nc;
        }),
        t.d(e, "P", function () {
          return Bc;
        }),
        t.d(e, "Ih", function () {
          return vc;
        }),
        t.d(e, "Ic", function () {
          return Sc;
        }),
        t.d(e, "Ri", function () {
          return Oc;
        }),
        t.d(e, "yd", function () {
          return Rc;
        }),
        t.d(e, "xd", function () {
          return Ac;
        }),
        t.d(e, "gj", function () {
          return jc;
        }),
        t.d(e, "Qi", function () {
          return _c;
        }),
        t.d(e, "vd", function () {
          return Ic;
        }),
        t.d(e, "Mg", function () {
          return Uc;
        }),
        t.d(e, "pd", function () {
          return Tc;
        }),
        t.d(e, "ej", function () {
          return Lc;
        }),
        t.d(e, "fe", function () {
          return qc;
        }),
        t.d(e, "He", function () {
          return Dc;
        }),
        t.d(e, "Je", function () {
          return xc;
        }),
        t.d(e, "Ke", function () {
          return Ec;
        }),
        t.d(e, "Oe", function () {
          return Mc;
        }),
        t.d(e, "vb", function () {
          return Qc;
        }),
        t.d(e, "sb", function () {
          return $c;
        }),
        t.d(e, "xj", function () {
          return Hc;
        }),
        t.d(e, "ge", function () {
          return Gc;
        }),
        t.d(e, "Qg", function () {
          return Vc;
        }),
        t.d(e, "Pg", function () {
          return Yc;
        }),
        t.d(e, "Hj", function () {
          return Wc;
        }),
        t.d(e, "Nb", function () {
          return zc;
        }),
        t.d(e, "Mb", function () {
          return Zc;
        }),
        t.d(e, "sj", function () {
          return Jc;
        }),
        t.d(e, "Lj", function () {
          return Kc;
        }),
        t.d(e, "Ce", function () {
          return Xc;
        }),
        t.d(e, "Tg", function () {
          return ni;
        }),
        t.d(e, "je", function () {
          return ei;
        }),
        t.d(e, "dj", function () {
          return ti;
        }),
        t.d(e, "lb", function () {
          return ri;
        }),
        t.d(e, "kb", function () {
          return ai;
        }),
        t.d(e, "yi", function () {
          return oi;
        }),
        t.d(e, "wj", function () {
          return ui;
        }),
        t.d(e, "ah", function () {
          return ci;
        }),
        t.d(e, "cj", function () {
          return ii;
        }),
        t.d(e, "lj", function () {
          return li;
        }),
        t.d(e, "ki", function () {
          return di;
        }),
        t.d(e, "Jb", function () {
          return pi;
        }),
        t.d(e, "Mf", function () {
          return hi;
        }),
        t.d(e, "md", function () {
          return si;
        }),
        t.d(e, "Dg", function () {
          return mi;
        }),
        t.d(e, "hf", function () {
          return fi;
        }),
        t.d(e, "ig", function () {
          return bi;
        }),
        t.d(e, "Ag", function () {
          return ki;
        }),
        t.d(e, "ng", function () {
          return wi;
        }),
        t.d(e, "le", function () {
          return gi;
        }),
        t.d(e, "nd", function () {
          return Ci;
        }),
        t.d(e, "Mc", function () {
          return Pi;
        }),
        t.d(e, "Gj", function () {
          return yi;
        }),
        t.d(e, "yj", function () {
          return Fi;
        }),
        t.d(e, "K", function () {
          return Ni;
        }),
        t.d(e, "L", function () {
          return Bi;
        }),
        t.d(e, "Kg", function () {
          return vi;
        }),
        t.d(e, "ld", function () {
          return Si;
        }),
        t.d(e, "Nj", function () {
          return Oi;
        }),
        t.d(e, "pf", function () {
          return Ri;
        }),
        t.d(e, "Bg", function () {
          return Ai;
        }),
        t.d(e, "Bd", function () {
          return ji;
        }),
        t.d(e, "Ed", function () {
          return _i;
        }),
        t.d(e, "Cd", function () {
          return Ii;
        }),
        t.d(e, "Dd", function () {
          return Ui;
        }),
        t.d(e, "hg", function () {
          return Ti;
        }),
        t.d(e, "pc", function () {
          return Li;
        }),
        t.d(e, "oc", function () {
          return qi;
        }),
        t.d(e, "nc", function () {
          return Di;
        }),
        t.d(e, "qc", function () {
          return xi;
        }),
        t.d(e, "fj", function () {
          return Ei;
        }),
        t.d(e, "Eg", function () {
          return Mi;
        }),
        t.d(e, "nb", function () {
          return Qi;
        }),
        t.d(e, "Hf", function () {
          return $i;
        }),
        t.d(e, "th", function () {
          return Hi;
        }),
        t.d(e, "oj", function () {
          return Gi;
        }),
        t.d(e, "pj", function () {
          return Vi;
        });
      t("d3b7");
      var r = t("bc3a"),
        a = t.n(r),
        o = (t("41cb"), t("d399"));
      (a.a.defaults.baseURL = Object({
        NODE_ENV: "production",
        BASE_URL: "/echnwap/",
      }).VUE_APP_BASE_API),
        a.a.interceptors.request.use(
          function (n) {
            return (
              (n.headers = Object.assign(n.headers, {
                "Content-Type": "application/json; charset=utf-8",
              })),
              n
            );
          },
          function (n) {
            Object(o["a"])({
              message: n.message,
              forbidClick: !0,
              loadingType: "spinner",
            }),
              Promise.reject(n);
          }
        ),
        a.a.interceptors.response.use(
          function (n) {
            var e = n.data;
            return e;
          },
          function (n) {
            return Promise.reject(n);
          }
        );
      var u = a.a,
        c = {
          PHONE_NBR_SELECTION: {
            externalScenario: "1",
            externalScenarioRemark: "",
          },
          CONSUMER_ENCYCLOPEDIA: {
            externalScenario: "1",
            externalScenarioRemark: "",
          },
          RETROFITTINGCARD: {
            externalScenario: "1",
            externalScenarioRemark: "",
          },
          REALPERSON: { externalScenario: "11", externalScenarioRemark: "" },
          SANDTABLEUPLOAD: {
            externalScenario: "11",
            externalScenarioRemark: "",
          },
          REALPERSONOAO: { externalScenario: "13", externalScenarioRemark: "" },
          BROADDISASSEMBLY: {
            externalScenario: "8",
            externalScenarioRemark: "",
          },
          CANCELACCOUNTAUTO: {
            externalScenario: "12",
            externalScenarioRemark: "",
          },
          GSJG_REALPERSON: {
            externalScenario: "5",
            externalScenarioRemark: "",
          },
          replaceCard: { externalScenario: "3", externalScenarioRemark: "" },
          replaceCardOffline: {
            externalScenario: "3",
            externalScenarioRemark: "",
          },
          CALLFORWARDING: {
            externalScenario: "99",
            externalScenarioRemark: "呼叫转移办理",
          },
          CARDHOMESHOWOPTION: {
            externalScenario: "99",
            externalScenarioRemark: "来电名片显示办理",
          },
          CARDSPLIT: {
            externalScenario: "99",
            externalScenarioRemark: "主副卡拆分办理",
          },
          REINSTALLATIONNUM: {
            externalScenario: "99",
            externalScenarioRemark: "销号复装",
          },
          singleBroadAddC: {
            externalScenario: "99",
            externalScenarioRemark: "2B2C加装",
          },
        },
        i = "REALPERSONOAO";
      function l(n) {
        return n
          ? c[n]
            ? c[n]
            : n === i || 0 === n.indexOf(i + "_")
            ? c.REALPERSONOAO
            : null
          : null;
      }
      function d(n) {
        if (!n || (340 != n.serverName && "340" !== n.serverName)) return n;
        if (!n.busiType) return n;
        if (null != n.externalScenario && "" !== n.externalScenario) return n;
        var e = l(n.busiType);
        return e
          ? Object.assign({}, n, {
              externalScenario: e.externalScenario,
              externalScenarioRemark: e.externalScenarioRemark || "",
            })
          : n;
      }
      function p(n) {
        return u({
          method: "post",
          url: "/wap2017/re/sms/sendRandByUnlog",
          data: n,
        });
      }
      function h(n) {
        return u({
          method: "post",
          url: "/wap2017/re/sms/sendRandByUnlogNew",
          data: n,
        });
      }
      function s(n) {
        return u({
          method: "post",
          url: "/wap2017/re/sms/validRandUnlog",
          data: n,
        });
      }
      function m(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpt/optConfirm",
          data: n,
        });
      }
      function f(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/login/sessionUtmScha",
          data: n,
        });
      }
      function b(n) {
        return u({
          method: "get",
          url: "/wap2017/re/wapFree/realperson/h5CallBackCheck",
          params: n,
        });
      }
      function k(n) {
        return u({
          method: "get",
          url: "/wap2017/re/wapFree/rand/checkImgA",
          params: n,
          responseType: "blob",
        });
      }
      function w(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rand/validRand",
          data: n,
        });
      }
      function g(n) {
        return u({
          method: "get",
          url: "/wap2017/re/wapFree/rand/getSliderChallenge",
          params: n,
        });
      }
      function C(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rand/validSlider",
          data: n,
        });
      }
      function P(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/paymentFeeLogin",
          data: n,
        });
      }
      function y(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/checkPayState",
          data: n,
        });
      }
      function F(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/qryOwe",
          data: n,
        });
      }
      function N(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/iptvRecordQueryforRecharge",
          data: n,
        });
      }
      function B(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/queryIptvNumByPhoneNum",
          data: n,
        });
      }
      function v(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/paymentFeeInit",
          data: n,
        });
      }
      function S(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/doPaymentFee",
          data: n,
        });
      }
      function O(n) {
        return u({
          method: "post",
          url: "/wap2017/re/feedBack/subPending",
          data: n,
        });
      }
      function R(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/payResult",
          data: n,
        });
      }
      function A(n) {
        return u({
          method: "post",
          url: "/wap2017/re/paymentForExter/payResult",
          data: n,
        });
      }
      function j(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/notice/queryNoticeInit",
          data: n,
        });
      }
      function _(n) {
        return u({ method: "post", url: "/remote_addr", data: n });
      }
      function I(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/notice/queryHistoryNotice",
          data: n,
        });
      }
      function U(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/notice/queryNoticeDetails",
          data: n,
        });
      }
      var T = function (n) {
        return u.post("/wap2017/re/wapFree/notice/queryNoticeDateFlag", n);
      };
      function L(n) {
        return u({
          method: "post",
          url: "/wap2017/re/activity/qryLoginAccno",
          data: n,
        });
      }
      function q(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rightsInterests/qryLoginAccno",
          data: n,
        });
      }
      function D(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rightsInterests/checkPhoneNum",
          data: n,
        });
      }
      function x(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rightsInterests/loginInit",
          data: n,
        });
      }
      function E() {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rightsInterests/contractValidCheck",
        });
      }
      function M(n) {
        return u({
          method: "post",
          url: "/wap2017/re/login/testLogin",
          data: n,
        });
      }
      function Q(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/printInvoiceInfo",
          data: n,
        });
      }
      function $(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/updateInfo",
          data: n,
        });
      }
      function H(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/MonthlyBill",
          data: n,
        });
      }
      function G(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/Payment",
          data: n,
        });
      }
      function V(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/queryOrderByPhoneNew",
          data: n,
        });
      }
      function Y(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/queryEleinvoiceByPhone",
          data: n,
        });
      }
      function W(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/printEleinvoice",
          data: n,
        });
      }
      function z(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/printEleinvoiceMerge",
          data: n,
        });
      }
      function Z(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/rePrintEleinvoice",
          data: n,
        });
      }
      function J(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/newEleInvoice/Invoice",
          data: n,
        });
      }
      function K(n) {
        return u({
          method: "get",
          url: "/wap2017/re/wapFree/newEleInvoice/downLoad",
          params: n,
          responseType: "blob",
          headers: { client_type: "DESKTOP_WEB" },
        });
      }
      function X(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/qryLst",
          data: n,
        });
      }
      function nn(n) {
        return u({
          method: "get",
          url: "/wap2017/re/credit/queryCreditValue",
          params: n,
        });
      }
      function en(n) {
        return u({ method: "post", url: "/wap2017/re/credit/optOn", data: n });
      }
      function tn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/queryViceCardBalance",
          data: n,
        });
      }
      function rn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/qryAccountBal",
          data: n,
        });
      }
      function an(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/externalInterface/provinceFacade",
          data: n,
        });
      }
      function on(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/mainSubOffer/qryMainCardNum",
          data: n,
        });
      }
      function un(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cardSplit/mainCardSplitCheck",
          data: n,
        });
      }
      function cn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cardSplit/viceCardSplitCheck",
          data: n,
        });
      }
      function ln(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cardSplit/mainSubOfferCheck",
          data: n,
        });
      }
      function dn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cardSplit/mainViceOwnerCheck",
          data: n,
        });
      }
      function pn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cardSplit/cardSplitHandle",
          data: n,
        });
      }
      function hn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinueOrder/queryAllOrderByBNum",
          data: n,
        });
      }
      function sn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFContinue/queryServSpeckNew",
          data: n,
        });
      }
      function mn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinue/qryCertForCustNum",
          data: n,
        });
      }
      function fn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinue/qryAllNumByCard",
          data: n,
        });
      }
      function bn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/qryBroadAddressByBnum",
          data: n,
        });
      }
      function kn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinue/qryAddForBNum",
          data: n,
        });
      }
      function wn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/saveIsmantlingInfo",
          data: n,
        });
      }
      function gn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/queryIsmantlingInfo",
          data: n,
        });
      }
      function Cn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/qryAllCommunityMsg",
          data: n,
        });
      }
      function Pn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/qryDetailAddr",
          data: n,
        });
      }
      function yn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/qryRoomId",
          data: n,
        });
      }
      function Fn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadPre/qryMemberAddr",
          data: n,
        });
      }
      function Nn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/stopOrOpen/stopOrOpenCheck",
          data: n,
        });
      }
      function Bn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/stopOrOpen/dostopOrOpen",
          data: n,
        });
      }
      function vn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/stopOrOpen/validatePhoneCertMatch",
          data: n,
        });
      }
      function Sn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositInitNew",
          data: n,
        });
      }
      function On(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/autoLoginCheck",
          data: n,
        });
      }
      function Rn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/passwordCheck",
          data: n,
        });
      }
      function An(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/queryCancelAccountAutoInfo",
          data: n,
        });
      }
      function jn(n) {
        return u({
          method: "get",
          url: "/wap2017/re/wapFree/cancelAccount/downloadAutoFile",
          params: n,
          responseType: "blob",
        });
      }
      function _n(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/uploadAuthVideo",
          data: n,
        });
      }
      function In(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/saveInit",
          data: n,
        });
      }
      function Un(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/saveInitOrder",
          data: n,
        });
      }
      function Tn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/queryNumsForLoginNum",
          data: n,
        });
      }
      function Ln(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/prePhoneNumCheck",
          data: n,
        });
      }
      function qn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/preBroadbandCheck",
          data: n,
        });
      }
      function Dn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/addressMask",
          data: n,
        });
      }
      function xn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/queryCancelBroadOrder",
          data: n,
        });
      }
      function En(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/queryAllSalesInfo",
          data: n,
        });
      }
      function Mn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/saveDevOrBuildingInfo",
          data: n,
        });
      }
      function Qn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/orderQueryLoginByCert",
          data: n,
        });
      }
      function $n(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/feeInfoCheck",
          data: n,
        });
      }
      function Hn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/qryBalanceDetail",
          data: n,
        });
      }
      function Gn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/cancelSalesInfo",
          data: n,
        });
      }
      function Vn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/contractDamagesGZFPayCore",
          data: n,
        });
      }
      function Yn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/balanceTransfer",
          data: n,
        });
      }
      function Wn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/createLogisticsOrder",
          data: n,
        });
      }
      function zn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/checkPhoneStatus",
          data: n,
        });
      }
      function Zn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/JTCommonRest/JtDoubleList",
          data: n,
        });
      }
      function Jn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/preCancelBroadForCustomer",
          data: n,
        });
      }
      function Kn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/queryCancelBroadForCustomer",
          data: n,
        });
      }
      function Xn(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/queryBuildingInfo",
          data: n,
        });
      }
      function ne(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/cancelBroadAct",
          data: n,
        });
      }
      function ee(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/saveCancelAccountInfo",
          data: n,
        });
      }
      function te(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/saveBroadComplaintOrder",
          data: n,
        });
      }
      function re(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/saveDevInfo",
          data: n,
        });
      }
      function ae(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/querySalesInfo",
          data: n,
        });
      }
      function oe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/contractCommonResult",
          data: n,
        });
      }
      function ue(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/qryLastPhoneNum",
          data: n,
        });
      }
      function ce(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/fuKaCheck",
          data: n,
        });
      }
      function ie(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/cancelAct",
          data: n,
        });
      }
      function le(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/qryBalanceDetail",
          data: n,
        });
      }
      function de(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/onlyDevCheck",
          data: n,
        });
      }
      function pe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/contractDamagesGZFPayCore",
          data: n,
        });
      }
      function he(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/cancelSalesInfo",
          data: n,
        });
      }
      function se(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/contractDamagesRecharge",
          data: n,
        });
      }
      function me(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/cancelSkipFee",
          data: n,
        });
      }
      function fe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/balanceTransfer",
          data: n,
        });
      }
      function be(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/refundBalance",
          data: n,
        });
      }
      function ke(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/qryBalanceDrawRecord",
          data: n,
        });
      }
      function we(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/contarctCheck",
          data: n,
        });
      }
      function ge(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/queryCardCheck",
          data: n,
        });
      }
      function Ce(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/cardCheck",
          data: n,
        });
      }
      function Pe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/autoStarCheck",
          data: n,
        });
      }
      function ye(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/feeCheck",
          data: n,
        });
      }
      function Fe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/feeCheckNew",
          data: n,
        });
      }
      function Ne(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/queryCustInfo",
          data: n,
        });
      }
      function Be(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/devCheck",
          data: n,
        });
      }
      function ve(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/saveComplaintOrder",
          data: n,
        });
      }
      function Se(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/saveCancelAccountAutoInfo",
          data: n,
        });
      }
      function Oe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/payResult",
          data: n,
        });
      }
      function Re(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealName",
          data: d(n),
        });
      }
      function Ae(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealName",
          data: n,
        });
      }
      function je(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealName",
          data: n,
        });
      }
      function _e(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealName",
          data: n,
        });
      }
      function Ie(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealName",
          data: n,
        });
      }
      function Ue(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/manageRealName",
          data: d(n),
        });
      }
      function Te(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/manageRealName",
          data: n,
        });
      }
      function Le(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/manageRealName",
          data: n,
        });
      }
      function qe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/manageRealName",
          data: n,
        });
      }
      function De(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/manageRealName",
          data: n,
        });
      }
      function xe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/callTrans/checkTranferOffer",
          data: n,
        });
      }
      function Ee(n) {
        return u({
          method: "post",
          url: "/wap2017/re/callTrans/prodOrder",
          data: n,
        });
      }
      function Me(n) {
        return u({
          method: "post",
          url: "/wap2017/re/callTrans/saveTransferInfo",
          data: n,
        });
      }
      function Qe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/callTrans/qryLst",
          data: n,
        });
      }
      function $e(n) {
        return u({
          method: "post",
          url: "/wap2017/re/callTrans/chkIdCard",
          data: n,
        });
      }
      function He(n) {
        return u({
          method: "post",
          url: "/wap2017/re/callTrans/optOn",
          data: n,
        });
      }
      function Ge(n) {
        return u({
          method: "post",
          url: "/wap2017/re/callTrans/optChange",
          data: n,
        });
      }
      function Ve(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDeposit/preDepositInit",
          data: n,
        });
      }
      function Ye(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/replaceCheck",
          data: n,
        });
      }
      function We(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/userCertTypeCheck",
          data: n,
        });
      }
      function ze(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/replaceCommonCheck",
          data: n,
        });
      }
      function Ze(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/queryOrderInfoByPhone",
          data: n,
        });
      }
      function Je(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/saveImageInfo",
          data: n,
        });
      }
      function Ke(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/queryCardInfo",
          data: n,
        });
      }
      function Xe(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/queryCardCheck",
          data: n,
        });
      }
      function nt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/queryCardCheck",
          data: n,
        });
      }
      function et(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/queryCardRelease",
          data: n,
        });
      }
      function tt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/genGroupLink",
          data: n,
        });
      }
      function rt(n) {
        return u({
          method: "get",
          url: "/wap2017/re/realName/h5CallBackCheck",
          params: n,
        });
      }
      function at(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/queryCardOrderCheck",
          data: n,
        });
      }
      function ot(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/cancelCardOrder",
          data: n,
        });
      }
      function ut(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/cancelCardOrderByPhone",
          data: n,
        });
      }
      function ct(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/checkESimCard",
          data: n,
        });
      }
      function it(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/saveUploadReceipt",
          data: n,
        });
      }
      function lt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/doReplaceCardOrder",
          data: n,
        });
      }
      function dt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/modifyActiveOrder",
          data: n,
        });
      }
      function pt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/checkNumRealName",
          data: n,
        });
      }
      function ht(n) {
        return u({
          method: "post",
          url: "/wap2017/re/realName/queryOrderInfoByPhone",
          data: n,
        });
      }
      function st(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonSaveImageInfo",
          data: n,
        });
      }
      function mt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/antiFraud/getToken",
          data: n,
        });
      }
      function ft(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/antiFraud/prodOrder",
          data: n,
        });
      }
      function bt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/antiFraud/saveUploadReceipt",
          data: n,
        });
      }
      function kt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/replaceCommonCheck",
          data: n,
        });
      }
      function wt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadHYContinue/generateToken",
          data: n,
        });
      }
      function gt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadHYContinue/doPasswordChange",
          data: n,
        });
      }
      function Ct(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadHYContinue/checkIdcradQueryBnum",
          data: n,
        });
      }
      function Pt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadHYContinue/doPasswordReset",
          data: n,
        });
      }
      function yt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/queryAdviceTypeList",
          data: n,
        });
      }
      function Ft(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/complaintsFeedbackFra",
          data: n,
        });
      }
      function Nt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/complaintStatusQueryEop",
          data: n,
        });
      }
      function Bt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/complaintStatusQueryEop",
          data: n,
        });
      }
      function vt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/faultPageInit",
          data: n,
        });
      }
      function St(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/faultbyProduct4L",
          data: n,
        });
      }
      function Ot(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/faultFeedbackFra",
          data: n,
        });
      }
      function Rt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/queryfaultFeedbackFra",
          data: n,
        });
      }
      function At(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/broadGzdBusinessFra",
          data: n,
        });
      }
      function jt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/broadGzdDetailFra",
          data: n,
        });
      }
      function _t(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/signSave",
          data: n,
        });
      }
      function It(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/queryPhoneNbrForBid",
          data: n,
        });
      }
      function Ut(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBidExtra/phoneNumStyleQuery",
          data: n,
        });
      }
      function Tt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/turntToBidInfo",
          data: n,
        });
      }
      function Lt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/turnToChoosePackageForBid",
          data: n,
        });
      }
      function qt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/orderCreate",
          data: n,
        });
      }
      function Dt(n, e) {
        return u({ method: "post", url: n, data: e });
      }
      function xt(n, e) {
        return u({ method: "post", url: n, data: e });
      }
      function Et(n) {
        return u({ method: "post", url: "/wap2017/re/valueAdd/opt", data: n });
      }
      function Mt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/valueAdd/getSalesByphone",
          data: n,
        });
      }
      function Qt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/valueAdd/applyPackage",
          data: n,
        });
      }
      function $t(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBidExtra/isCollected",
          data: n,
        });
      }
      function Ht(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBidExtra/qryCollect",
          data: n,
        });
      }
      function Gt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/checkUserIdCard",
          data: n,
        });
      }
      function Vt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/orderSubmit",
          data: n,
        });
      }
      function Yt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/pwFreelogin/broadLogin",
          data: n,
        });
      }
      function Wt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/login",
          data: n,
        });
      }
      function zt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/isLogin",
          data: n,
        });
      }
      function Zt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/orderCancel",
          data: n,
        });
      }
      function Jt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/qryUserOrder",
          data: n,
        });
      }
      function Kt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/qryOrderForBid",
          data: n,
        });
      }
      function Xt(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/qryByOrderId",
          data: n,
        });
      }
      function nr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/qryLogisticsByOid",
          data: n,
        });
      }
      function er(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/doPaymentFee",
          data: n,
        });
      }
      function tr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBid/payResult",
          data: n,
        });
      }
      function rr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBidExtra/queryUserLike",
          data: n,
        });
      }
      function ar(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNbrBidExtra/addUserLike",
          data: n,
        });
      }
      function or(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/qryPhoneNumAndBusiTime",
          data: n,
        });
      }
      function ur(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/getSubscr",
          data: n,
        });
      }
      function cr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/getIPTVSubscr",
          data: n,
        });
      }
      function ir(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/withdrawIPTVSubscr",
          data: n,
        });
      }
      function lr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/withdrawSubscr",
          data: n,
        });
      }
      function dr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/valueAdd/option",
          data: n,
        });
      }
      function pr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/protocol/protocolConfirm",
          data: n,
        });
      }
      function hr(n, e) {
        return u({ method: "post", url: n, data: e });
      }
      function sr(n, e) {
        return u({ method: "post", url: n, data: e });
      }
      function mr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/sms/sendRandProtocol",
          data: n,
        });
      }
      function fr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/sms/sendRandProtocolV3",
          data: n,
        });
      }
      function br(n) {
        return u({
          method: "post",
          url: "/wap2017/re/sms/validRandProtocol",
          data: n,
        });
      }
      function kr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/busi/qryExplain",
          data: n,
        });
      }
      function wr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/packageChangePreCheck",
          data: n,
        });
      }
      function gr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/changeCheck",
          data: n,
        });
      }
      function Cr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/packageChangeQuery",
          data: n,
        });
      }
      function Pr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/mainSubOfferCheck",
          data: n,
        });
      }
      function yr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/cardSheetsQuery",
          data: n,
        });
      }
      function Fr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/iCallOrder",
          data: n,
        });
      }
      function Nr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/packageChangeAutoHandle",
          data: n,
        });
      }
      function Br(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/qryCurrentOffer",
          data: n,
        });
      }
      function vr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/qryChooseOfferInfo",
          data: n,
        });
      }
      function Sr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageChange/getPackageChangeParam",
          data: n,
        });
      }
      function Or(n) {
        return u({
          method: "post",
          url: "/wap2017/re/busi/qryExplain",
          data: n,
        });
      }
      function Rr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/stopOrOpen/stopOrOpenCheck",
          data: n,
        });
      }
      function Ar(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/protocol/protocolConfirm",
          data: n,
        });
      }
      function jr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/stopOrOpen/queryAccNumOfferInfo",
          data: n,
        });
      }
      function _r(n) {
        return u({
          method: "post",
          url: "/wap2017/re/CommonAccQuery/pukQry",
          data: n,
        });
      }
      function Ir(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinue/queryCBumByCNum",
          data: n,
        });
      }
      function Ur(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadHYContinue/getAllNumByCNum",
          data: n,
        });
      }
      function Tr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinue/qryCertForBNum",
          data: n,
        });
      }
      function Lr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadPre/phoneFraudReport",
          data: n,
        });
      }
      function qr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/healthyInternet/qryHealthyOrder",
          data: n,
        });
      }
      function Dr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinueOrder/queryUsingPlan",
          data: n,
        });
      }
      function xr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/healthyInternet/saveHealthyOrder",
          data: n,
        });
      }
      function Er(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/healthyInternet/qryHealthyOrderByB",
          data: n,
        });
      }
      function Mr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/healthyInternet/updateHealthyOrderStatus",
          data: n,
        });
      }
      function Qr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/healthyInternet/qryCertForCustNum",
          data: n,
        });
      }
      function $r(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/OpenOverInternet/queryCBumByCNum",
          data: n,
        });
      }
      function Hr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/OpenOverInternet/qryCertForBNum",
          data: n,
        });
      }
      function Gr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/OpenOverInternet/qryCertForCustNum",
          data: n,
        });
      }
      function Vr(n) {
        return u({
          method: "get",
          url: "/wap2017/re/wapFree/onePersonOneCode/queryDepartment",
          params: n,
        });
      }
      function Yr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/onePersonOneCode/queryWorkNumAndSendCode",
          data: n,
        });
      }
      function Wr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/onePersonOneCode/validRandUnlog",
          data: n,
        });
      }
      function zr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/onePersonOneCode/staffCodeByTotalSale",
          data: n,
        });
      }
      function Zr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/onePersonOneCode/queryOrderDetail",
          data: n,
        });
      }
      function Jr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/OpenOverInternet/checkOften",
          data: n,
        });
      }
      function Kr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/OpenOverInternet/doStart",
          data: n,
        });
      }
      function Xr(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/OpenOverInternet/doStop",
          data: n,
        });
      }
      function na(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/OpenOverInternet/checkUser",
          data: n,
        });
      }
      function ea(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadAccountQuery/qryBroadNum",
          data: n,
        });
      }
      function ta(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/superiorPackage/superiorPackageCheck",
          data: n,
        });
      }
      function ra(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/getAccNum/queryNumberForB",
          data: n,
        });
      }
      function aa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/superiorPackage/qryCertForCustNum",
          data: n,
        });
      }
      function oa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/broadInstallerInfoSave",
          data: n,
        });
      }
      function ua(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/broadPreVerifyForZero",
          data: n,
        });
      }
      function ca(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/qryBroadCustInfo",
          data: n,
        });
      }
      function ia(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/qryBroadInstallerAddress",
          data: n,
        });
      }
      function la(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadband/qryCustomNameInfo",
          data: n,
        });
      }
      function da(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNumberUtil/qryLst",
          data: n,
        });
      }
      function pa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NfcVicecardInstall/numberPoolQuery",
          data: n,
        });
      }
      function ha(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNumberUtil/occupyPhoneNum",
          data: n,
        });
      }
      function sa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYContinueOrder/getDCJKFee",
          data: n,
        });
      }
      function ma(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFContinue/cardPhoneCheck",
          data: n,
        });
      }
      function fa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/broadOrderInfoConfirm",
          data: n,
        });
      }
      function ba(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/broadOrderInfoSumbit",
          data: n,
        });
      }
      function ka(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/login/ssoLogin",
          data: n,
        });
      }
      function wa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapBroad/iptv/qryOrderByBNum",
          data: n,
        });
      }
      function ga(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/weChatPay",
          data: n,
        });
      }
      function Ca(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/queryOrderResult",
          data: n,
        });
      }
      function Pa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/FusionBroadbandNewPolicy/broadPreVerifyForZero",
          data: n,
        });
      }
      function ya(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/FusionBroadbandNewPolicy/broadOrderInfoSumbit",
          data: n,
        });
      }
      function Fa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/FusionBroadbandNewPolicy/queryOrderResult",
          data: n,
        });
      }
      function Na(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadAccountQuery/broadQuery",
          data: n,
        });
      }
      function Ba(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadAccountQuery/CheckDetalsForB",
          data: n,
        });
      }
      function va(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/phoneNumberChange/queryOrder",
          data: n,
        });
      }
      function Sa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadHYContinue/queryServSpeck",
          data: n,
        });
      }
      function Oa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadHYContinue/doBroadbandServ",
          data: n,
        });
      }
      function Ra(n) {
        return u({
          method: "post",
          url: "/wap2017/re/feedBack/saveNotJojn",
          data: n,
        });
      }
      function Aa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/feedBack/subRes",
          data: n,
        });
      }
      function ja(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/checkForBroadMobile",
          data: n,
        });
      }
      function _a(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/login/kdSsoLogin",
          data: n,
        });
      }
      function Ia(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/qryPortInfoAndCheck",
          data: n,
        });
      }
      function Ua(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/queryMoveHomeRights",
          data: n,
        });
      }
      function Ta(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadPre/doBroadbandMobile",
          data: n,
        });
      }
      function La(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFContinue/queryBroadbandResult",
          data: n,
        });
      }
      function qa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadAccountQuery/queryOrderInfoByPhone",
          data: n,
        });
      }
      function Da(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/qryPortInfoAndCheck",
          data: n,
        });
      }
      function xa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadPre/queryInfoByOrderResult",
          data: n,
        });
      }
      function Ea(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadPre/queryInfoResult",
          data: n,
        });
      }
      function Ma(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadPre/broadBandInstallQry",
          data: n,
        });
      }
      function Qa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/broadPre/broadBandInstallBook",
          data: n,
        });
      }
      function $a(n) {
        return u({
          method: "post",
          url: "/wap2017/re/paymentForExter/check",
          data: n,
        });
      }
      function Ha(n) {
        return u({
          method: "post",
          url: "/wap2017/re/paymentForExter/payment",
          data: n,
        });
      }
      function Ga(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/saveCloudProductNoOAO",
          data: n,
        });
      }
      function Va(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/saveCloudProduct",
          data: n,
        });
      }
      function Ya(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/saveNewPhone",
          data: n,
        });
      }
      function Wa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/saveNewPhoneNoOAO",
          data: n,
        });
      }
      function za(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/qryExistingOrder",
          data: n,
        });
      }
      function Za(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/onePersonOneCode/posterUrlConfirm",
          data: n,
        });
      }
      function Ja(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/onePersonOneCode/qryPosterUrlConfirm",
          data: n,
        });
      }
      function Ka(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/selectOrderDetails",
          data: n,
        });
      }
      function Xa(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapBroad/qwWiFi/qryOrderByBNum",
          data: n,
        });
      }
      function no(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFContinue/qryCertForBNum",
          data: n,
        });
      }
      function eo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFContinue/qryCertForCustNum",
          data: n,
        });
      }
      function to(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapBroad/qwWiFi/weChatPay",
          data: n,
        });
      }
      function ro(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapBroad/iptv/weChatPay",
          data: n,
        });
      }
      function ao(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapBroad/qwWiFi/queryOrderResult",
          data: n,
        });
      }
      function oo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapBroad/iptv/queryOrderResult",
          data: n,
        });
      }
      function uo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/terminalRiscount828/couponNoPayOrder",
          data: n,
        });
      }
      function co(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/terminalRiscount828/preDepositCommonResult",
          data: n,
        });
      }
      function io(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/messageWarm/smsRemindDetailFra",
          data: n,
        });
      }
      function lo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/messageWarm/serviceRemindChange",
          data: n,
        });
      }
      function po(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositList",
          data: n,
        });
      }
      function ho(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preCommonCheck",
          data: n,
        });
      }
      function so(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preCommonCheckDB",
          data: n,
        });
      }
      function mo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositConfirmPrice",
          data: n,
        });
      }
      function fo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preActiveMeta",
          data: n,
        });
      }
      function bo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositConfirm",
          data: n,
        });
      }
      function ko(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositSubGZFPay",
          data: n,
        });
      }
      function wo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositSubGZFPayConfig",
          data: n,
        });
      }
      function go(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositSubGZFPayCore",
          data: n,
        });
      }
      function Co(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositSubGZFPayOAO",
          data: n,
        });
      }
      function Po(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositUnPay",
          data: n,
        });
      }
      function yo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositUnPayConfig",
          data: n,
        });
      }
      function Fo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositUnPayCore",
          data: n,
        });
      }
      function No(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositUnPayCoreDB",
          data: n,
        });
      }
      function Bo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositUnPayOAO",
          data: n,
        });
      }
      function vo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositCommonResult",
          data: n,
        });
      }
      function So(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositOAOOrderQuery",
          data: n,
        });
      }
      function Oo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/preDepositCommonResult",
          data: n,
        });
      }
      function Ro(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preDepositNew/configPreDepositSessionFlag",
          data: n,
        });
      }
      function Ao(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/qryActiveInfo",
          data: n,
        });
      }
      function jo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/qryImage",
          data: n,
        });
      }
      function _o(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/busiActiveInfo",
          data: n,
        });
      }
      function Io(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/qryOrderInfo",
          data: n,
        });
      }
      function Uo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/qryActiveInfoShow",
          data: n,
        });
      }
      function To(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/rechargePaymentCheck",
          data: n,
        });
      }
      function Lo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/checkUseCustName",
          data: n,
        });
      }
      function qo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/reinstallationNum/reinstallNumLoginCheck",
          data: n,
        });
      }
      function Do(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/reinstallationNum/updateReinstallNumOrder",
          data: n,
        });
      }
      function xo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/contractList/querySalesInfo",
          data: n,
        });
      }
      function Eo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/contractList/contractCommonResult",
          data: n,
        });
      }
      function Mo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/contractList/getContractListPay",
          data: n,
        });
      }
      function Qo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/contractList/OfferCheck",
          data: n,
        });
      }
      function $o(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/contractList/contractListRecharge",
          data: n,
        });
      }
      function Ho(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/contractList/toContractCancel",
          data: n,
        });
      }
      function Go(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/lxNetWork/qryBroadRate",
          data: n,
        });
      }
      function Vo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/lxNetWork/doLXNetWorkOrder",
          data: n,
        });
      }
      function Yo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/lxNetWork/queryLXNetWorkOrder",
          data: n,
        });
      }
      function Wo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/loginByIDNamePhone",
          data: n,
        });
      }
      function zo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/saveImageInfo",
          data: n,
        });
      }
      function Zo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/modifyActiveOrder",
          data: n,
        });
      }
      function Jo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/queryCardCheck",
          data: n,
        });
      }
      function Ko(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/queryCardOrderCheck",
          data: n,
        });
      }
      function Xo(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/saveUploadReceipt",
          data: n,
        });
      }
      function nu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/doReplaceCardOrder",
          data: n,
        });
      }
      function eu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/queryCardRelease",
          data: n,
        });
      }
      function tu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/InNetWorkSev/queryConnectServNumList",
          data: n,
        });
      }
      function ru(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/InNetWorkSev/addConnectServNum",
          data: n,
        });
      }
      function au(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/InNetWorkSev/queryServNumInfo",
          data: n,
        });
      }
      function ou(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/InNetWorkSev/inNetWorkSevHandle",
          data: n,
        });
      }
      function uu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/InNetWorkSev/queryOrderDetails",
          data: n,
        });
      }
      function cu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/InNetWorkSev/queryOrderByPhone",
          data: n,
        });
      }
      function iu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/InNetWorkSev/inNetWorkSevCancelOrder",
          data: n,
        });
      }
      function lu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fttrUpPackage/qryRuleCheck",
          data: n,
        });
      }
      function du(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fttrUpPackage/doUpPackageOrder",
          data: n,
        });
      }
      function pu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NfcVicecardInstall/orderQuery",
          data: n,
        });
      }
      function hu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NfcVicecardInstall/handleOrderChoose",
          data: n,
        });
      }
      function su(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/queryFlowAccount",
          data: n,
        });
      }
      function mu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/FusionBroadbandNewPolicy/broadPreVerifyFor2B2C",
          data: n,
        });
      }
      function fu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/FusionBroadbandNewPolicy/broadOrderInfoSumbitFor2B2C",
          data: n,
        });
      }
      function bu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/certOpportunity/imageBase64SFTP",
          data: n,
        });
      }
      function ku(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/uploadCertPhoto",
          data: n,
        });
      }
      function wu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/submitOrder",
          data: n,
        });
      }
      function gu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/loginCheck",
          data: n,
        });
      }
      function Cu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/createPoster",
          data: n,
        });
      }
      function Pu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/userLoginByPoster",
          data: n,
        });
      }
      function yu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/qryManagerOrders",
          data: n,
        });
      }
      function Fu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/qryCertPhotos",
          data: n,
        });
      }
      function Nu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/generateMainOrder",
          data: n,
        });
      }
      function Bu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/updateOrderStatus",
          data: n,
        });
      }
      function vu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/qryVipHallBatchOrders",
          data: n || {},
        });
      }
      function Su(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/qryOrdersByMainId",
          data: n,
        });
      }
      function Ou(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/govPublicBiz/updateSixLevelOrderStatus",
          data: n,
        });
      }
      function Ru(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/certOpportunity/getOutTradeNo",
          data: n,
        });
      }
      function Au(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/certOpportunity/qryAccNumByCetrNum",
          data: n,
        });
      }
      function ju(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealNameSign",
          data: d(n),
        });
      }
      function _u(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealNameSign",
          data: n,
        });
      }
      function Iu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealNameSign",
          data: n,
        });
      }
      function Uu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealNameSign",
          data: n,
        });
      }
      function Tu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/realperson/commonManageRealNameSign",
          data: n,
        });
      }
      function Lu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/externalOrder/localBusiAuthentication",
          data: n,
        });
      }
      function qu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/externalOrder/localBusiService",
          data: n,
        });
      }
      function Du(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/coreBusiSubscr",
          data: n,
        });
      }
      function xu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/IntelligentRecommend/queryActiveList",
          data: n,
        });
      }
      function Eu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/eshopQuickSign/qrySignHtml",
          data: n,
        });
      }
      function Mu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/eshopQuickSign/signPdfSave",
          data: n,
        });
      }
      function Qu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/eshopQuickSign/oldUserSignPdfSave",
          data: n,
        });
      }
      function $u(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/certOpportunity/saveCertOaoInfo",
          data: n,
        });
      }
      function Hu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/certOpportunity/custPicUpload",
          data: n,
        });
      }
      function Gu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/certOpportunity/certOaoOrder",
          data: n,
        });
      }
      function Vu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/commonUtils/channelCache",
          data: n,
        });
      }
      function Yu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/foreignNumCard/foreignNumCardCheckAndOAO",
          data: n,
        });
      }
      function Wu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/speedLimit/getRateDetail",
          data: n,
        });
      }
      function zu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/oldUserInstallBroadband/installBroadbandCheck",
          data: n,
        });
      }
      function Zu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/oldUserInstallBroadband/qryCustomNameInfo",
          data: n,
        });
      }
      function Ju(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/oldUserInstallBroadband/calculatePrice",
          data: n,
        });
      }
      function Ku(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/oldUserInstallBroadband/submitOrder",
          data: n,
        });
      }
      function Xu(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/getAccNum/checkTelNum",
          data: n,
        });
      }
      function nc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/getAccNum/checkPhoneStatus",
          data: n,
        });
      }
      function ec(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/getAccNum/checkOwnBalance",
          data: n,
        });
      }
      function tc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/commonUtils/checkWhiteList",
          data: n,
        });
      }
      function rc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/eshopQuickSign/JDQrySignHtml",
          data: n,
        });
      }
      function ac(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/eshopQuickSign/JDSignPdfSave",
          data: n,
        });
      }
      function oc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNew2B2C/ruleCheck",
          data: n,
        });
      }
      function uc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNew2B2C/submitOrder",
          data: n,
        });
      }
      function cc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNew2B2C/qryCustomNameInfo",
          data: n,
        });
      }
      function ic(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFContinue/queryCBumByCNum",
          data: n,
        });
      }
      function lc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNewSecond/ruleCheck",
          data: n,
        });
      }
      function dc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNewSecond/submitOrder",
          data: n,
        });
      }
      function pc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNewSecond/qryCustomNameInfo",
          data: n,
        });
      }
      function hc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/mainSubOffer/mainSubOfferInfoCheck",
          data: n,
        });
      }
      function sc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/upStarCard/upStarCardCheck",
          data: n,
        });
      }
      function mc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccount/starCheck",
          data: n,
        });
      }
      function fc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ReplaceCardOffline/queryBureauDirectionByPhoneNum",
          data: n,
        });
      }
      function bc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandSingleAddPhone/checkOfferInfo",
          data: n,
        });
      }
      function kc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandSingleAddPhone/saveInitInfo",
          data: n,
        });
      }
      function wc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandSingleAddPhone/chooseNumSubmit",
          data: n,
        });
      }
      function gc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/paymentFeeInitgm",
          data: n,
        });
      }
      function Cc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/doPaymentFeegm",
          data: n,
        });
      }
      function Pc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/payment/checkPayStategm",
          data: n,
        });
      }
      function yc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/selectStore",
          data: n,
        });
      }
      function Fc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/activityConfigZone/queryZoneActiveInfo",
          data: n,
        });
      }
      function Nc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/activityConfigZone/getActiveId",
          data: n,
        });
      }
      function Bc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rightsInterestsAct/activityCheckV3",
          data: n,
        });
      }
      function vc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rightsInterestsAct/queryPreactiveInfo",
          data: n,
        });
      }
      function Sc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/rightsInterestsAct/doCheckRightsInterestsV3",
          data: n,
        });
      }
      function Oc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/preAccept/savePhoneReservation",
          data: n,
        });
      }
      function Rc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ossSign/getSignOrderList",
          data: n,
        });
      }
      function Ac(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ossSign/getSignOrderContent",
          data: n,
        });
      }
      function jc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ossSign/signOSSOrder",
          data: n,
        });
      }
      function _c(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/ossSign/saveOSSSatisfaction",
          data: n,
        });
      }
      function Ic(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NewRealName/getReqId",
          data: n,
        });
      }
      function Uc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NewRealName/qrySignHtml",
          data: n,
        });
      }
      function Tc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/remoteBatchSign/getCustOrderNbr",
          data: n,
        });
      }
      function Lc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/remoteBatchSign/signImageBatch",
          data: n,
        });
      }
      function qc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/certOpportunity/judgeOrderTimeOut",
          data: n,
        });
      }
      function Dc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NewRealName/orderCheck",
          data: n,
        });
      }
      function xc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NewRealName/orderSubmit",
          data: n,
        });
      }
      function Ec(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NewRealName/orderSubmitAgain",
          data: n,
        });
      }
      function Mc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NewRealName/passOrderStatus",
          data: n,
        });
      }
      function Qc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/signDocument/signHtml",
          data: n,
        });
      }
      function $c(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/calculatePrice",
          data: n,
        });
      }
      function Hc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/submitPricePay",
          data: n,
        });
      }
      function Gc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cancelAccountBusi/liquidatedPricePayOrderQry",
          data: n,
        });
      }
      function Vc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/queryAccountPackageDetail",
          data: n,
        });
      }
      function Yc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/queryAccountBill",
          data: n,
        });
      }
      function Wc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/trafficZone/userCheck",
          data: n,
        });
      }
      function zc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/feedBack/checkFFSatisfaction",
          data: n,
        });
      }
      function Zc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/cBroadbandNew/checkAddressFreePort",
          data: n,
        });
      }
      function Jc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/feedBack/subFFSatisfaction",
          data: n,
        });
      }
      function Kc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/login/unifyAccountLogin",
          data: n,
        });
      }
      function Xc(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/login/openAccessToken",
          data: n,
        });
      }
      function ni(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/balanceNewQuery/queryAllNumBalance",
          data: n,
        });
      }
      function ei(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/login/localSsoLogin",
          data: n,
        });
      }
      function ti(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/signDocument/signHtmlXB",
          data: n,
        });
      }
      function ri(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFUpPackage/broadUpUserCheck",
          data: n,
        });
      }
      function ai(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/broadTYCFUpPackage/broadUpOrderSubmit",
          data: n,
        });
      }
      function oi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNew2B2C/ruleCheckFree",
          data: n,
        });
      }
      function ui(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandNew2B2C/submitOrderFree",
          data: n,
        });
      }
      function ci(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/commonUtils/queryBusiInfoByType",
          data: n,
        });
      }
      function ii(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/protocolSign/signConfig",
          data: n,
        });
      }
      function li(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/replaceCard/spliceAgreement",
          data: n,
        });
      }
      function di(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/uploadCrmCommon/realNameUpload",
          data: n,
        });
      }
      function pi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/uploadCrmCommon/certResultReturnCrm",
          data: n,
        });
      }
      function hi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/mainSubOffer/qryAccNumStatus",
          data: n,
        });
      }
      function si(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/BroadExpireRenewals/getChargeAndOrderInfo",
          data: n,
        });
      }
      function mi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/BroadExpireRenewals/qryPayInfo",
          data: n,
        });
      }
      function fi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/local/paymentBroad/preCreateOrderForRongheH5",
          data: n,
        });
      }
      function bi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/uploadCrmCommon/qryCrmInfoByNbr",
          data: n,
        });
      }
      function ki(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/BroadExpireRenewals/qryOrderHandler",
          data: n,
        });
      }
      function wi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/BroadExpireRenewals/qryGroupReceiptHtmlByCoNbr",
          data: n,
        });
      }
      function gi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/payment/loginCancelContract",
          data: n,
        });
      }
      function Ci(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/payment/getContractList",
          data: n,
        });
      }
      function Pi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/payment/doPaymentContract",
          data: n,
        });
      }
      function yi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/trafficZone/trafficSubGZFPayCore",
          data: n,
        });
      }
      function Fi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/superiorPackage/superiorOrderSubmit",
          data: n,
        });
      }
      function Ni(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandBusinessDistrict/ruleCheck",
          data: n,
        });
      }
      function Bi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandBusinessDistrict/submitOrder",
          data: n,
        });
      }
      function vi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/fusionBroadbandBusinessDistrict/qryCustomNameInfo",
          data: n,
        });
      }
      function Si(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/CASign/getCAName",
          data: n,
        });
      }
      function Oi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/CASign/updateCAMessage",
          data: n,
        });
      }
      function Ri(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/upStarCard/preDepositLogin",
          data: n,
        });
      }
      function Ai(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/restapi/qryordinfo",
          data: n,
        });
      }
      function ji(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/getfuncPrd",
          data: n,
        });
      }
      function _i(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/getfuncPrdV2",
          data: n,
        });
      }
      function Ii(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/getfuncPrdOrder",
          data: n,
        });
      }
      function Ui(n) {
        return u({
          method: "post",
          url: "/wap2017/re/queryBusiness/getfuncPrdOrderV2",
          data: n,
        });
      }
      function Ti(n) {
        return u({
          method: "post",
          url: "/wap2017/re/credit/qryCreditLst",
          data: n,
        });
      }
      function Li(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/consumerEncyclopediaInfoQry",
          data: n,
        });
      }
      function qi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/consumerEncyclopediaCheck",
          data: n,
        });
      }
      function Di(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/consumerEncyclopediaBusi",
          data: n,
        });
      }
      function xi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/busiOpportunity/consumerEncyclopediaReBusi",
          data: n,
        });
      }
      function Ei(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/BroadExpireRenewals/signInfoCollection",
          data: n,
        });
      }
      function Mi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/NewRealName/qryPhoneListByItemId",
          data: n,
        });
      }
      function Qi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageBusi/busiCheckFor2B2C",
          data: n,
        });
      }
      function $i(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageBusi/pushOrderFor2B2C",
          data: n,
        });
      }
      function Hi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/packageBusi/queryMobileRenewalOrders",
          data: n,
        });
      }
      function Gi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/starCardCommon/starCardLotteryCheck",
          data: n,
        });
      }
      function Vi(n) {
        return u({
          method: "post",
          url: "/wap2017/re/wapFree/starCardCommon/starCardLotteryOrder",
          data: n,
        });
      }
    },
    "56d7": function (n, e, t) {
      "use strict";
      t.r(e);
      var r = {};
      t.r(r),
        t.d(r, "debounce", function () {
          return cn;
        }),
        t.d(r, "throttle", function () {
          return dn;
        });
      t("e260"),
        t("e6cf"),
        t("cca6"),
        t("a79d"),
        t("159b"),
        t("b64b"),
        t("4de4"),
        t("a15b"),
        t("d3b7"),
        t("25f0");
      var a = t("2b0e"),
        o = function () {
          var n = this,
            e = n.$createElement,
            t = n._self._c || e;
          return t(
            "div",
            { staticStyle: { height: "100%" }, attrs: { id: "app" } },
            [
              t("router-view"),
              t("popup", { ref: "popup" }),
              t("picker", { ref: "picker" }),
              t("vouchersPop", { ref: "vouchersPop" }),
              t("nopicPop", { ref: "nopicPop" }),
            ],
            1
          );
        },
        u = [],
        c = function () {
          var n = this,
            e = n.$createElement,
            t = n._self._c || e;
          return t(
            "div",
            { staticClass: "ui-row" },
            [
              t(
                "van-popup",
                {
                  staticClass: "pointPopup pointNew",
                  style: { width: "80%" },
                  attrs: {
                    "close-on-click-overlay": !1,
                    round: "",
                    "get-container": "body",
                  },
                  model: {
                    value: n.pointPopup,
                    callback: function (e) {
                      n.pointPopup = e;
                    },
                    expression: "pointPopup",
                  },
                },
                [
                  t(
                    "div",
                    {
                      staticClass: "poinTitle",
                      class: n.whiteBg ? "bg-white" : "",
                      style: {
                        background: n.poinTitleStyle ? n.poinTitleStyle : "",
                      },
                    },
                    [
                      t("h1", [n._v(n._s(n.title))]),
                      t("van-icon", {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: !n.hideClose,
                            expression: "!hideClose",
                          },
                        ],
                        staticClass: "closeable",
                        attrs: { name: "cross" },
                        on: {
                          click: function (e) {
                            return n.confirmorCancel();
                          },
                        },
                      }),
                    ],
                    1
                  ),
                  t(
                    "div",
                    {
                      staticClass: "ui-row pd-40",
                      staticStyle: { "background-color": "white" },
                    },
                    [
                      t("div", { staticClass: "ui-row pdb-20" }, [
                        t("p", {
                          staticClass: "fs-24 color-666 lh-xls ",
                          domProps: { innerHTML: n._s(n.content) },
                        }),
                      ]),
                      t(
                        "van-row",
                        {
                          staticClass: "flex",
                          staticStyle: { "justify-content": "center" },
                        },
                        [
                          t(
                            "van-col",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: n.cancelBtn,
                                  expression: "cancelBtn",
                                },
                              ],
                              staticClass: "pd-20",
                              attrs: { span: 12 },
                            },
                            [
                              t(
                                "van-button",
                                {
                                  staticClass: "color-black fs-13",
                                  staticStyle: { padding: "0 0.2rem" },
                                  attrs: { block: "", color: "#EDEDED" },
                                  on: {
                                    click: function (e) {
                                      return n.cancelFun();
                                    },
                                  },
                                },
                                [n._v("取消")]
                              ),
                            ],
                            1
                          ),
                          t(
                            "van-col",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: n.buttonStatus,
                                  expression: "buttonStatus",
                                },
                              ],
                              staticClass: "pd-20",
                              attrs: { span: 12 },
                            },
                            [
                              t(
                                "van-button",
                                {
                                  staticClass: "color-black fs-13",
                                  staticStyle: { padding: "0 0.2rem" },
                                  attrs: {
                                    block: "",
                                    color: n.buttonColor || "#EDEDED",
                                  },
                                  on: {
                                    click: function (e) {
                                      return n.doButCallBack();
                                    },
                                  },
                                },
                                [n._v(n._s(n.buttonName))]
                              ),
                            ],
                            1
                          ),
                          t(
                            "van-col",
                            { staticClass: "pd-20", attrs: { span: 12 } },
                            [
                              t(
                                "van-button",
                                {
                                  directives: [
                                    {
                                      name: "show",
                                      rawName: "v-show",
                                      value: !n.hideConfirm,
                                      expression: "!hideConfirm",
                                    },
                                  ],
                                  staticClass: "color-white fs-13",
                                  staticStyle: { padding: "0 0.2rem" },
                                  attrs: {
                                    block: "",
                                    color:
                                      n.confirmColor ||
                                      "linear-gradient(90deg,#4496ff, #4474ff)",
                                  },
                                  on: {
                                    click: function (e) {
                                      return n.confirm();
                                    },
                                  },
                                },
                                [
                                  n._v(
                                    n._s(
                                      "" == n.callBtnName
                                        ? "确认"
                                        : n.callBtnName
                                    )
                                  ),
                                ]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ]
              ),
              t(
                "van-popup",
                {
                  staticClass: "pointPopup pointNew",
                  style: { width: "80%" },
                  attrs: {
                    "close-on-click-overlay": !1,
                    round: "",
                    "get-container": "body",
                  },
                  model: {
                    value: n.ReminderPop,
                    callback: function (e) {
                      n.ReminderPop = e;
                    },
                    expression: "ReminderPop",
                  },
                },
                [
                  t(
                    "div",
                    { staticClass: "poinTitle" },
                    [
                      t("h1", [n._v(n._s(n.title_1))]),
                      t("van-icon", {
                        staticClass: "closeable",
                        attrs: { name: "cross" },
                        on: {
                          click: function (e) {
                            n.ReminderPop = !1;
                          },
                        },
                      }),
                    ],
                    1
                  ),
                  t(
                    "div",
                    { staticClass: "ui-row pd-30" },
                    [
                      t("p", {
                        staticClass: "fs-28 color-333 pdb-30",
                        domProps: { innerHTML: n._s(n.content_1) },
                      }),
                      t(
                        "van-cell-group",
                        { staticClass: "ui-field-cell" },
                        [
                          t("van-field", {
                            attrs: {
                              label: "手机号",
                              readonly: n.readonlyPhone,
                              maxlength: 11,
                              placeholder: "请输入手机号",
                            },
                            model: {
                              value: n.phoneNumber,
                              callback: function (e) {
                                n.phoneNumber = e;
                              },
                              expression: "phoneNumber",
                            },
                          }),
                          t("van-field", {
                            attrs: {
                              label: "图形验证码",
                              placeholder: "请输入图形验证码",
                            },
                            scopedSlots: n._u([
                              {
                                key: "button",
                                fn: function () {
                                  return [
                                    t("img", {
                                      staticClass: "code-inp",
                                      attrs: { src: n.randImg },
                                      on: { click: n.checkImg },
                                    }),
                                  ];
                                },
                                proxy: !0,
                              },
                            ]),
                            model: {
                              value: n.validCode,
                              callback: function (e) {
                                n.validCode = e;
                              },
                              expression: "validCode",
                            },
                          }),
                          t("van-field", {
                            attrs: {
                              maxlength: 6,
                              label: "短信验证码",
                              placeholder: "请输入短信验证码",
                            },
                            scopedSlots: n._u([
                              {
                                key: "button",
                                fn: function () {
                                  return [
                                    t(
                                      "span",
                                      {
                                        staticClass:
                                          "fs-28 color-blue opacity-l",
                                        on: { click: n.getRandCode },
                                      },
                                      [n._v(n._s(n.randTip))]
                                    ),
                                  ];
                                },
                                proxy: !0,
                              },
                            ]),
                            model: {
                              value: n.randCode,
                              callback: function (e) {
                                n.randCode = e;
                              },
                              expression: "randCode",
                            },
                          }),
                        ],
                        1
                      ),
                      t(
                        "van-row",
                        { staticClass: "ui-row tc pdt-20" },
                        [
                          t(
                            "van-button",
                            {
                              staticClass: "color-white fs-30 mgr-40",
                              staticStyle: { width: "40%" },
                              attrs: {
                                color:
                                  "linear-gradient(90deg,#4496ff, #4474ff)",
                              },
                              on: {
                                click: function (e) {
                                  return n.cancelReFun();
                                },
                              },
                            },
                            [n._v("取消")]
                          ),
                          t(
                            "van-button",
                            {
                              staticClass: "color-white fs-30",
                              staticStyle: { width: "40%" },
                              attrs: {
                                color:
                                  "linear-gradient(90deg,#4496ff, #4474ff)",
                              },
                              on: {
                                click: function (e) {
                                  return n.withdrawConfirm();
                                },
                              },
                            },
                            [n._v("确认")]
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ]
              ),
            ],
            1
          );
        },
        i = [],
        l = t("1da1"),
        d = (t("3ca3"), t("ddb0"), t("2b3d"), t("96cf"), t("4ec3")),
        p = {
          name: "billHome",
          data: function () {
            return {
              pointPopup: !1,
              title: "",
              content: "",
              cancelBtn: !1,
              title_1: "",
              content_1: "",
              cancelBtn_1: !1,
              callBack: null,
              callBackRe: null,
              butCallBack: null,
              whiteBg: !1,
              hideClose: !1,
              hideConfirm: !1,
              confirmColor: "",
              buttonStatus: !1,
              protocolId: "",
              ReminderPop: !1,
              readonlyPhone: !0,
              busiCode: "",
              busiName: "",
              phoneNumber: "",
              validCode: "",
              randImg: "",
              randCode: "",
              randTime: 60,
              randTip: "获取验证码",
              randSend: !0,
              randImgSend: !0,
              buttonName: "返回",
              buttonColor: "",
              callBtnName: "",
              poinTitleStyle: "",
            };
          },
          mounted: function () {},
          methods: {
            doButCallBack: function () {
              this.close(),
                this.butCallBack
                  ? (this.butCallBack(), (this.butCallBack = null))
                  : this.$router.go(-1);
            },
            docallBack: function () {
              "function" == typeof this.callBack &&
                (this.callBack(), (this.callBack = null));
            },
            docallBackRe: function () {
              "function" == typeof this.callBackRe &&
                (this.callBackRe(), (this.callBackRe = null));
            },
            show: function (n) {
              this.pointPopup ||
                ((this.title = n.title || this.title),
                (this.content = n.content || this.content),
                (this.cancelBtn = n.cancelBtn || this.cancelBtn),
                (this.whiteBg = n.whiteBg || this.whiteBg),
                (this.confirmColor = n.confirmColor || this.confirmColor),
                (this.hideClose = n.hideClose || this.hideClose),
                (this.hideConfirm = n.hideConfirm || this.hideConfirm),
                (this.buttonStatus = n.buttonStatus || this.buttonStatus),
                (this.buttonColor = n.buttonColor || this.buttonColor),
                (this.buttonName = n.buttonName || this.buttonName),
                (this.callBtnName = n.callBtnName || this.callBtnName),
                (this.poinTitleStyle = n.poinTitleStyle || this.poinTitleStyle),
                (this.pointPopup = !0),
                n.callBack && (this.callBack = n.callBack),
                n.butCallBack && (this.butCallBack = n.butCallBack),
                this.$forceUpdate());
            },
            showRe: function (n) {
              this.ReminderPop ||
                ((this.title_1 = n.title || this.title_1),
                (this.content_1 = n.content || this.content_1),
                (this.cancelBtn_1 = n.cancelBtn || this.cancelBtn_1),
                (this.phoneNumber = n.phoneNumber || ""),
                (this.readonlyPhone = n.readonlyPhone || !0),
                (this.busiName = n.busiName || ""),
                (this.busiCode = n.busiCode || ""),
                this.checkImg(),
                (this.ReminderPop = !0),
                n.callBack && (this.callBackRe = n.callBack),
                this.$forceUpdate());
            },
            confirm: function () {
              var n = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(function (e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), n.close();
                        case 2:
                          n.docallBack(), n.clearCallback();
                        case 4:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            confirmRe: function () {
              this.closeRe(), this.docallBackRe(), this.clearCallback();
            },
            confirmorCancel: function () {
              this.cancelBtn ? this.close() : this.confirm();
            },
            cancelFun: function () {
              this.close(), this.clearCallback();
            },
            close: function () {
              var n = this;
              return (
                (this.pointPopup = !1),
                new Promise(function (e) {
                  setTimeout(function () {
                    (n.title = ""), (n.content = ""), (n.cancelBtn = !1), e();
                  }, 200);
                })
              );
            },
            clearCallback: function () {
              (this.callBack = null),
                (this.butCallBack = null),
                (this.callBackRe = null);
            },
            cancelReFun: function () {
              this.closeRe(), this.clearCallback();
            },
            closeRe: function () {
              var n = this;
              setTimeout(function () {
                (n.title_1 = ""), (n.content_1 = ""), (n.cancelBtn_1 = !1);
              }, 200),
                (this.ReminderPop = !1);
            },
            clearImg: function () {
              (this.randImgSend = !0),
                (this.randImgFlag = !1),
                (this.randImg = "");
            },
            getRandCode: function () {
              var n = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function e() {
                  var t, r, a, o;
                  return regeneratorRuntime.wrap(function (e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (n.randSend) {
                            e.next = 2;
                            break;
                          }
                          return e.abrupt("return");
                        case 2:
                          if ("" != n.validCode && null != n.validCode) {
                            e.next = 5;
                            break;
                          }
                          return (
                            n.$toast("请输入图形验证码"), e.abrupt("return")
                          );
                        case 5:
                          return (
                            n.$toast.loading({ message: "加载中..." }),
                            (t = { validate: "", randCode: n.validCode }),
                            n.$toast.loading({ message: "加载中..." }),
                            n.$bp.dcsMultiTrack(
                              "SI.si_n",
                              "MM_ORD_DDDG",
                              "SI.si_x",
                              "009"
                            ),
                            (e.next = 11),
                            Object(d["C"])(t)
                          );
                        case 11:
                          if (
                            ((r = e.sent),
                            n.$toast.clear(),
                            "000000" == r.retCode
                              ? (n.$bp.dcsMultiTrack(
                                  "SI.si_n",
                                  "MM_ORD_DDDG",
                                  "SI.si_x",
                                  "010"
                                ),
                                (n.randImgFlag = !0))
                              : (n.$bp.dcsMultiTrack(
                                  "SI.si_n",
                                  "MM_ORD_DDDG",
                                  "SI.si_x",
                                  "011"
                                ),
                                (n.randImgFlag = !1)),
                            n.randImgFlag)
                          ) {
                            e.next = 18;
                            break;
                          }
                          return (
                            n.$toast("请输入正确的图形验证码"),
                            n.checkImg(),
                            e.abrupt("return")
                          );
                        case 18:
                          return (
                            (a = {
                              busiNum: n.phoneNumber,
                              channel: "wap",
                              remark: n.validCode,
                              phoneNumber: n.phoneNumber,
                              busiCode: n.busiCode,
                              busiName: n.busiName,
                            }),
                            n.$toast.loading({ message: "加载中..." }),
                            (e.next = 22),
                            Object(d["Yi"])(a)
                          );
                        case 22:
                          (o = e.sent),
                            n.$toast.clear(),
                            "0001" == o.retCode ||
                              ("0" == o.result
                                ? ((n.protocolId = o.object + ""),
                                  n.$popup.show({
                                    title: "提示",
                                    content: "验证码已下发至手机，请注意查收",
                                  }),
                                  n.randCodeTime())
                                : n.$popup.show({
                                    title: "提示",
                                    content: o.retMsg,
                                  }));
                        case 25:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            checkImg: function () {
              var n = this;
              this.randImgSend &&
                ((this.randImgSend = !1),
                Object(d["Qb"])()
                  .then(function (e) {
                    n.randImgSend = !0;
                    var t = e;
                    window.URL.revokeObjectURL(n.randImg),
                      (n.randImg = window.URL.createObjectURL(t));
                  })
                  .catch(function (e) {
                    console.log(e), n.$toast.clear();
                  }));
            },
            withdrawConfirm: function () {
              var n = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function e() {
                  var t;
                  return regeneratorRuntime.wrap(function (e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if ("" != n.validCode && null != n.validCode) {
                            e.next = 3;
                            break;
                          }
                          return (
                            n.$toast("请输入图形验证码"), e.abrupt("return")
                          );
                        case 3:
                          if ("" != n.randCode && null != n.randCode) {
                            e.next = 6;
                            break;
                          }
                          return (
                            n.$toast("请输入短信验证码"), e.abrupt("return")
                          );
                        case 6:
                          return (
                            n.$toast.loading({ message: "加载中..." }),
                            (e.next = 9),
                            Object(d["Uj"])({
                              rand_code: n.randCode,
                              protocolId: n.protocolId,
                              busiNum: n.phoneNumber,
                            })
                          );
                        case 9:
                          (t = e.sent),
                            n.$toast.clear(),
                            "000000" == t.retCode
                              ? ((n.ReminderPop = !1), n.confirmRe())
                              : n.$popup.show({
                                  title: "提示",
                                  content: t.retMsg,
                                });
                        case 12:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            randCodeTime: function () {
              var n = this;
              (this.randSend = !1),
                (this.randTip = this.randTime + "s后可重新发送");
              var e = setInterval(function () {
                (n.randTime = n.randTime - 1),
                  (n.randTip = n.randTime + "s后可重新发送"),
                  n.randTime <= 0 &&
                    (clearInterval(e),
                    (n.randTip = "获取验证码"),
                    (n.randSend = !0),
                    (n.randTime = 60));
              }, 1e3);
            },
          },
        },
        h = p,
        s = t("2877"),
        m = Object(s["a"])(h, c, i, !1, null, "2940baae", null),
        f = m.exports,
        b = function () {
          var n = this,
            e = n.$createElement,
            t = n._self._c || e;
          return t(
            "div",
            { staticClass: "ui-row" },
            [
              t(
                "van-popup",
                {
                  staticClass: "pointPopup popupRound picker-size",
                  attrs: {
                    round: "",
                    position: "bottom",
                    "get-container": "body",
                  },
                  model: {
                    value: n.selectPicker,
                    callback: function (e) {
                      n.selectPicker = e;
                    },
                    expression: "selectPicker",
                  },
                },
                [
                  t("van-picker", {
                    attrs: {
                      title: n.title,
                      "show-toolbar": "",
                      "value-key": "value",
                      columns: n.SelectList,
                    },
                    on: { confirm: n.confirm, cancel: n.close },
                  }),
                ],
                1
              ),
            ],
            1
          );
        },
        k = [],
        w = {
          name: "picker",
          data: function () {
            return {
              selectPicker: !1,
              title: "",
              SelectList: [],
              callBack: null,
            };
          },
          mounted: function () {},
          methods: {
            changeButtonText: function (n, e) {
              (document.getElementsByClassName(
                "van-picker__cancel"
              )[0].innerHTML = n),
                (document.getElementsByClassName(
                  "van-picker__confirm"
                )[0].innerHTML = e);
            },
            docallBack: function (n) {
              "function" == typeof this.callBack &&
                (this.callBack(n), (this.callBack = null));
            },
            show: function (n) {
              var e = this;
              this.selectPicker ||
                ((this.title = n.title || this.title),
                (this.SelectList = n.SelectList || this.SelectList),
                n.callBack && (this.callBack = n.callBack),
                (this.selectPicker = !0),
                1 == n.changeButtonText &&
                  this.$nextTick(function () {
                    e.changeButtonText(n.cancel, n.confirm);
                  }),
                this.$forceUpdate());
            },
            confirm: function (n) {
              var e = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function t() {
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), e.close();
                        case 2:
                          e.docallBack(n);
                        case 3:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            close: function () {
              var n = this;
              return (
                (this.selectPicker = !1),
                new Promise(function (e) {
                  setTimeout(function () {
                    (n.title = ""), (n.content = ""), (n.cancelBtn = !1), e();
                  }, 200);
                })
              );
            },
          },
        },
        g = w,
        C = (t("0682"), Object(s["a"])(g, b, k, !1, null, null, null)),
        P = C.exports,
        y = function () {
          var n = this,
            e = n.$createElement,
            t = n._self._c || e;
          return t(
            "div",
            { staticClass: "ui-row" },
            [
              t(
                "van-popup",
                {
                  staticClass: "pointPopup pointNew",
                  style: { width: "80%" },
                  attrs: {
                    "close-on-click-overlay": !1,
                    round: "",
                    "get-container": "body",
                  },
                  model: {
                    value: n.ReminderPop,
                    callback: function (e) {
                      n.ReminderPop = e;
                    },
                    expression: "ReminderPop",
                  },
                },
                [
                  t(
                    "div",
                    {
                      staticClass: "poinTitle",
                      style: { background: n.colorTitle ? n.colorTitle : "" },
                    },
                    [
                      t("h1", [
                        n._v(n._s("" == n.title ? "办理凭证" : n.title)),
                      ]),
                      t("van-icon", {
                        staticClass: "closeable",
                        attrs: { name: "cross" },
                        on: {
                          click: function (e) {
                            n.ReminderPop = !1;
                          },
                        },
                      }),
                    ],
                    1
                  ),
                  t(
                    "div",
                    { staticClass: "ui-row pd-30" },
                    [
                      t("p", {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: "" != n.content,
                            expression: "content != ''",
                          },
                        ],
                        staticClass: "fs-28 color-333 pdb-30",
                        domProps: { innerHTML: n._s(n.content) },
                      }),
                      t(
                        "van-cell-group",
                        { staticClass: "ui-field-cell" },
                        [
                          t("van-field", {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: n.businessName,
                                expression: "businessName",
                              },
                            ],
                            attrs: { label: "业务名称", readonly: "" },
                            model: {
                              value: n.businessName,
                              callback: function (e) {
                                n.businessName = e;
                              },
                              expression: "businessName",
                            },
                          }),
                          t("van-field", {
                            attrs: {
                              label: n.phoneName ? n.phoneName : "手机号",
                              readonly: n.readonlyPhone,
                              maxlength: 11,
                              placeholder: "请输入手机号",
                            },
                            model: {
                              value: n.phoneNumber,
                              callback: function (e) {
                                n.phoneNumber = e;
                              },
                              expression: "phoneNumber",
                            },
                          }),
                          t("van-field", {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: n.businessPrice,
                                expression: "businessPrice",
                              },
                            ],
                            attrs: {
                              label: "业务资费",
                              readonly: n.readonlyPhone,
                            },
                            model: {
                              value: n.businessPrice,
                              callback: function (e) {
                                n.businessPrice = e;
                              },
                              expression: "businessPrice",
                            },
                          }),
                          t("van-field", {
                            attrs: {
                              label: "图形验证码",
                              placeholder: "请输入图形验证码",
                            },
                            scopedSlots: n._u([
                              {
                                key: "button",
                                fn: function () {
                                  return [
                                    t("img", {
                                      staticClass: "code-inp",
                                      attrs: { src: n.randImg },
                                      on: { click: n.checkImg },
                                    }),
                                  ];
                                },
                                proxy: !0,
                              },
                            ]),
                            model: {
                              value: n.validCode,
                              callback: function (e) {
                                n.validCode = e;
                              },
                              expression: "validCode",
                            },
                          }),
                          t("van-field", {
                            attrs: {
                              maxlength: 6,
                              label: "短信验证码",
                              placeholder: "请输入短信验证码",
                            },
                            scopedSlots: n._u([
                              {
                                key: "button",
                                fn: function () {
                                  return [
                                    t(
                                      "span",
                                      {
                                        staticClass: "fs-28 opacity-l",
                                        style: {
                                          color: n.colorTips
                                            ? n.colorTips
                                            : "#5b82ff",
                                        },
                                        on: { click: n.getRandCode },
                                      },
                                      [n._v(n._s(n.randTip))]
                                    ),
                                  ];
                                },
                                proxy: !0,
                              },
                            ]),
                            model: {
                              value: n.randCode,
                              callback: function (e) {
                                n.randCode = e;
                              },
                              expression: "randCode",
                            },
                          }),
                        ],
                        1
                      ),
                      t(
                        "van-row",
                        { staticClass: "ui-row tc pdt-20" },
                        [
                          t(
                            "van-button",
                            {
                              staticClass: "color-white fs-30 mgr-40",
                              staticStyle: { width: "40%" },
                              attrs: {
                                color: n.colorCancel
                                  ? n.colorCancel
                                  : "linear-gradient(90deg,#4496ff,#4474ff)",
                              },
                              on: {
                                click: function (e) {
                                  return n.closeRe();
                                },
                              },
                            },
                            [n._v("取消")]
                          ),
                          t(
                            "van-button",
                            {
                              staticClass: "color-white fs-30",
                              staticStyle: { width: "40%" },
                              attrs: {
                                color: n.colorConfirmBtn
                                  ? n.colorConfirmBtn
                                  : "linear-gradient(90deg,#4496ff,#4474ff)",
                              },
                              on: {
                                click: function (e) {
                                  return n.withdrawConfirm();
                                },
                              },
                            },
                            [n._v("确认")]
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ]
              ),
            ],
            1
          );
        },
        F = [],
        N = t("ade3"),
        B = {
          name: "billHome",
          data: function () {
            var n;
            return (
              (n = {
                phoneName: "",
                pointPopup: !1,
                title: "",
                content: "",
                cancelBtn: !1,
              }),
              Object(N["a"])(n, "content", ""),
              Object(N["a"])(n, "callBack", null),
              Object(N["a"])(n, "callBackRe", null),
              Object(N["a"])(n, "butCallBack", null),
              Object(N["a"])(n, "whiteBg", !1),
              Object(N["a"])(n, "hideClose", !1),
              Object(N["a"])(n, "confirmColor", ""),
              Object(N["a"])(n, "buttonStatus", !1),
              Object(N["a"])(n, "protocolId", ""),
              Object(N["a"])(n, "ReminderPop", !1),
              Object(N["a"])(n, "readonlyPhone", !0),
              Object(N["a"])(n, "busiCode", ""),
              Object(N["a"])(n, "busiName", ""),
              Object(N["a"])(n, "phoneNumber", ""),
              Object(N["a"])(n, "validCode", ""),
              Object(N["a"])(n, "randImg", ""),
              Object(N["a"])(n, "randCode", ""),
              Object(N["a"])(n, "randTime", 60),
              Object(N["a"])(n, "randTip", "获取验证码"),
              Object(N["a"])(n, "randSend", !0),
              Object(N["a"])(n, "randImgSend", !0),
              Object(N["a"])(n, "buttonName", "返回"),
              Object(N["a"])(n, "buttonColor", ""),
              Object(N["a"])(n, "callBtnName", ""),
              Object(N["a"])(n, "poinTitleStyle", ""),
              Object(N["a"])(n, "phoneName", ""),
              Object(N["a"])(n, "colorTitle", ""),
              Object(N["a"])(n, "colorConfirmBtn", ""),
              Object(N["a"])(n, "colorCancel", ""),
              Object(N["a"])(n, "colorTips", ""),
              Object(N["a"])(n, "businessPrice", ""),
              Object(N["a"])(n, "businessName", ""),
              Object(N["a"])(n, "keyContentNum", ""),
              Object(N["a"])(n, "qryCodeFlag", !1),
              n
            );
          },
          mounted: function () {},
          methods: {
            doButCallBack: function () {
              this.close(),
                this.butCallBack
                  ? (this.butCallBack(), (this.butCallBack = null))
                  : this.$router.go(-1);
            },
            docallBack: function () {
              "function" == typeof this.callBack &&
                (this.callBack(), (this.callBack = null));
            },
            docallBackRe: function () {
              "function" == typeof this.callBackRe &&
                (this.callBackRe(), (this.callBackRe = null));
            },
            show: function (n) {
              this.ReminderPop ||
                ((this.qryCodeFlag = !1),
                (this.title = n.title || this.title),
                (this.content = n.content || this.content),
                (this.phoneNumber = n.phoneNumber || ""),
                (this.readonlyPhone = "false" != n.readonlyPhone),
                (this.busiName = n.busiName || ""),
                (this.busiCode = n.busiCode || ""),
                (this.businessPrice = n.businessPrice || ""),
                (this.businessName = n.businessName || ""),
                (this.keyContentNum = n.keyContentNum || ""),
                (this.phoneName = n.phoneName || ""),
                n.color &&
                  ((this.colorTitle = n.color.title || ""),
                  (this.colorConfirmBtn = n.color.confirmBtn || ""),
                  (this.colorCancel = n.color.cancelBtn || ""),
                  (this.colorTips = n.color.tips || "")),
                this.checkImg(),
                (this.ReminderPop = !0),
                n.callBack && (this.callBackRe = n.callBack),
                this.$forceUpdate());
            },
            confirm: function () {
              this.close(), this.docallBack();
            },
            confirmRe: function () {
              this.closeRe(), this.docallBackRe();
            },
            confirmorCancel: function () {
              this.cancelBtn ? this.close() : this.confirm();
            },
            close: function () {
              var n = this;
              (this.pointPopup = !1),
                setTimeout(function () {
                  (n.title = ""), (n.content = ""), (n.cancelBtn = !1);
                }, 200);
            },
            closeRe: function () {
              var n = this;
              setTimeout(function () {
                (n.title = ""),
                  (n.content = ""),
                  (n.randCode = ""),
                  (n.validCode = ""),
                  (n.phoneNumber = "");
              }, 200),
                (this.ReminderPop = !1);
            },
            clearImg: function () {
              (this.randImgSend = !0),
                (this.randImgFlag = !1),
                (this.randImg = "");
            },
            getRandCode: function () {
              var n = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function e() {
                  var t, r, a, o;
                  return regeneratorRuntime.wrap(function (e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (n.randSend) {
                            e.next = 2;
                            break;
                          }
                          return e.abrupt("return");
                        case 2:
                          if ("" != n.validCode && null != n.validCode) {
                            e.next = 5;
                            break;
                          }
                          return (
                            n.$toast("请输入图形验证码"), e.abrupt("return")
                          );
                        case 5:
                          return (
                            n.$toast.loading({ message: "加载中..." }),
                            (t = { validate: "", randCode: n.validCode }),
                            n.$toast.loading({ message: "加载中..." }),
                            n.$bp.dcsMultiTrack(
                              "SI.si_n",
                              "MM_ORD_DDDG",
                              "SI.si_x",
                              "009"
                            ),
                            (e.next = 11),
                            Object(d["C"])(t)
                          );
                        case 11:
                          if (
                            ((r = e.sent),
                            n.$toast.clear(),
                            "000000" == r.retCode
                              ? (n.$bp.dcsMultiTrack(
                                  "SI.si_n",
                                  "MM_ORD_DDDG",
                                  "SI.si_x",
                                  "010"
                                ),
                                (n.randImgFlag = !0))
                              : (n.$bp.dcsMultiTrack(
                                  "SI.si_n",
                                  "MM_ORD_DDDG",
                                  "SI.si_x",
                                  "011"
                                ),
                                (n.randImgFlag = !1)),
                            n.randImgFlag)
                          ) {
                            e.next = 18;
                            break;
                          }
                          return (
                            n.$toast("请输入正确的图形验证码"),
                            n.checkImg(),
                            e.abrupt("return")
                          );
                        case 18:
                          return (
                            (a = {
                              busiNum: n.phoneNumber,
                              channel: "wap",
                              remark: n.validCode,
                              phoneNumber: n.phoneNumber,
                              busiCode: n.busiCode,
                              busiName: n.busiName,
                              keyContentNum: n.keyContentNum,
                            }),
                            console.log("11111==>" + n.keyContentNum),
                            n.$toast.loading({ message: "加载中..." }),
                            (e.next = 23),
                            Object(d["Yi"])(a)
                          );
                        case 23:
                          (o = e.sent),
                            n.$toast.clear(),
                            "0001" == o.retCode ||
                              ("0" == o.result
                                ? ((n.qryCodeFlag = !0),
                                  (n.protocolId = o.object + ""),
                                  n.$popup.show({
                                    title: "提示",
                                    content: "验证码已下发至手机，请注意查收",
                                  }),
                                  n.randCodeTime())
                                : n.$popup.show({
                                    title: "提示",
                                    content: o.retMsg,
                                  }));
                        case 26:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            checkImg: function () {
              var n = this;
              this.randImgSend &&
                ((this.randImgSend = !1),
                Object(d["Qb"])()
                  .then(function (e) {
                    n.randImgSend = !0;
                    var t = e;
                    window.URL.revokeObjectURL(n.randImg),
                      (n.randImg = window.URL.createObjectURL(t));
                  })
                  .catch(function (e) {
                    console.log(e), n.$toast.clear();
                  }));
            },
            withdrawConfirm: function () {
              var n = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function e() {
                  var t;
                  return regeneratorRuntime.wrap(function (e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if ("" != n.validCode && null != n.validCode) {
                            e.next = 3;
                            break;
                          }
                          return (
                            n.$toast("请输入图形验证码"), e.abrupt("return")
                          );
                        case 3:
                          if ("" != n.randCode && null != n.randCode) {
                            e.next = 6;
                            break;
                          }
                          return (
                            n.$toast("请输入短信验证码"), e.abrupt("return")
                          );
                        case 6:
                          if (n.qryCodeFlag) {
                            e.next = 9;
                            break;
                          }
                          return (
                            n.$toast("请先获取短信验证码"), e.abrupt("return")
                          );
                        case 9:
                          return (
                            n.$toast.loading({ message: "加载中..." }),
                            (e.next = 12),
                            Object(d["Uj"])({
                              rand_code: n.randCode,
                              protocolId: n.protocolId,
                              busiNum: n.phoneNumber,
                            })
                          );
                        case 12:
                          (t = e.sent),
                            n.$toast.clear(),
                            "000000" == t.retCode
                              ? ((n.ReminderPop = !1), n.confirmRe())
                              : n.$popup.show({
                                  title: "提示",
                                  content: t.retMsg,
                                });
                        case 15:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            randCodeTime: function () {
              var n = this;
              (this.randSend = !1), (this.randTip = this.randTime + "s");
              var e = setInterval(function () {
                (n.randTime = n.randTime - 1),
                  (n.randTip = n.randTime + "s"),
                  n.randTime <= 0 &&
                    (clearInterval(e),
                    (n.randTip = "获取验证码"),
                    (n.randSend = !0),
                    (n.randTime = 60));
              }, 1e3);
            },
          },
        },
        v = B,
        S = Object(s["a"])(v, y, F, !1, null, "9031af86", null),
        O = S.exports,
        R = function () {
          var n = this,
            e = n.$createElement,
            t = n._self._c || e;
          return t(
            "div",
            { staticClass: "ui-row" },
            [
              t(
                "van-popup",
                {
                  staticClass: "pointPopup pointNew",
                  style: { width: "80%" },
                  attrs: {
                    "close-on-click-overlay": !1,
                    round: "",
                    "get-container": "body",
                  },
                  model: {
                    value: n.ReminderPop,
                    callback: function (e) {
                      n.ReminderPop = e;
                    },
                    expression: "ReminderPop",
                  },
                },
                [
                  t(
                    "div",
                    {
                      staticClass: "poinTitle",
                      style: { background: n.colorTitle ? n.colorTitle : "" },
                    },
                    [
                      t("h1", [
                        n._v(n._s("" == n.title ? "办理凭证" : n.title)),
                      ]),
                      t("van-icon", {
                        staticClass: "closeable",
                        attrs: { name: "cross" },
                        on: {
                          click: function (e) {
                            n.ReminderPop = !1;
                          },
                        },
                      }),
                    ],
                    1
                  ),
                  t(
                    "div",
                    { staticClass: "ui-row pd-30" },
                    [
                      t("p", {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: "" != n.content,
                            expression: "content != ''",
                          },
                        ],
                        staticClass: "fs-28 color-333 pdb-30",
                        domProps: { innerHTML: n._s(n.content) },
                      }),
                      t(
                        "van-cell-group",
                        { staticClass: "ui-field-cell" },
                        [
                          t("van-field", {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: n.businessName,
                                expression: "businessName",
                              },
                            ],
                            attrs: { label: "业务名称", readonly: "" },
                            model: {
                              value: n.businessName,
                              callback: function (e) {
                                n.businessName = e;
                              },
                              expression: "businessName",
                            },
                          }),
                          t("van-field", {
                            attrs: {
                              label: n.phoneName ? n.phoneName : "手机号",
                              readonly: n.readonlyPhone,
                              maxlength: 11,
                              placeholder: "请输入手机号",
                            },
                            model: {
                              value: n.phoneNumber,
                              callback: function (e) {
                                n.phoneNumber = e;
                              },
                              expression: "phoneNumber",
                            },
                          }),
                          t("van-field", {
                            attrs: {
                              maxlength: 6,
                              label: "短信验证码",
                              placeholder: "请输入短信验证码",
                            },
                            scopedSlots: n._u([
                              {
                                key: "button",
                                fn: function () {
                                  return [
                                    t(
                                      "span",
                                      {
                                        staticClass: "fs-28 opacity-l",
                                        style: {
                                          color: n.colorTips
                                            ? n.colorTips
                                            : "#5b82ff",
                                        },
                                        on: { click: n.getRandCode },
                                      },
                                      [n._v(n._s(n.randTip))]
                                    ),
                                  ];
                                },
                                proxy: !0,
                              },
                            ]),
                            model: {
                              value: n.randCode,
                              callback: function (e) {
                                n.randCode = e;
                              },
                              expression: "randCode",
                            },
                          }),
                        ],
                        1
                      ),
                      t(
                        "van-row",
                        { staticClass: "ui-row tc pdt-20" },
                        [
                          t(
                            "van-button",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: n.cancelBtn,
                                  expression: "cancelBtn",
                                },
                              ],
                              staticClass: "color-white fs-30 mgr-40",
                              staticStyle: { width: "40%" },
                              attrs: {
                                color: n.colorCancel
                                  ? n.colorCancel
                                  : "linear-gradient(90deg,#4496ff,#4474ff)",
                              },
                              on: {
                                click: function (e) {
                                  return n.closeRe();
                                },
                              },
                            },
                            [n._v("取消")]
                          ),
                          t(
                            "van-button",
                            {
                              staticClass: "color-white fs-30",
                              staticStyle: { width: "40%" },
                              attrs: {
                                color: n.colorConfirmBtn
                                  ? n.colorConfirmBtn
                                  : "linear-gradient(90deg,#4496ff,#4474ff)",
                              },
                              on: {
                                click: function (e) {
                                  return n.withdrawConfirm();
                                },
                              },
                            },
                            [n._v("确认")]
                          ),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ]
              ),
            ],
            1
          );
        },
        A = [],
        j = {
          name: "billHome",
          data: function () {
            var n;
            return (
              (n = {
                phoneName: "",
                pointPopup: !1,
                title: "",
                content: "",
                cancelBtn: !1,
              }),
              Object(N["a"])(n, "content", ""),
              Object(N["a"])(n, "callBack", null),
              Object(N["a"])(n, "callBackRe", null),
              Object(N["a"])(n, "butCallBack", null),
              Object(N["a"])(n, "whiteBg", !1),
              Object(N["a"])(n, "hideClose", !1),
              Object(N["a"])(n, "confirmColor", ""),
              Object(N["a"])(n, "buttonStatus", !1),
              Object(N["a"])(n, "protocolId", ""),
              Object(N["a"])(n, "ReminderPop", !1),
              Object(N["a"])(n, "readonlyPhone", !0),
              Object(N["a"])(n, "busiCode", ""),
              Object(N["a"])(n, "busiName", ""),
              Object(N["a"])(n, "phoneNumber", ""),
              Object(N["a"])(n, "validCode", ""),
              Object(N["a"])(n, "randImg", ""),
              Object(N["a"])(n, "randCode", ""),
              Object(N["a"])(n, "randTime", 60),
              Object(N["a"])(n, "randTip", "获取验证码"),
              Object(N["a"])(n, "randSend", !0),
              Object(N["a"])(n, "randImgSend", !0),
              Object(N["a"])(n, "buttonName", "返回"),
              Object(N["a"])(n, "buttonColor", ""),
              Object(N["a"])(n, "callBtnName", ""),
              Object(N["a"])(n, "poinTitleStyle", ""),
              Object(N["a"])(n, "phoneName", ""),
              Object(N["a"])(n, "colorTitle", ""),
              Object(N["a"])(n, "colorConfirmBtn", ""),
              Object(N["a"])(n, "colorCancel", ""),
              Object(N["a"])(n, "colorTips", ""),
              Object(N["a"])(n, "businessPrice", ""),
              Object(N["a"])(n, "businessName", ""),
              Object(N["a"])(n, "timeS", null),
              Object(N["a"])(n, "Sended", !1),
              n
            );
          },
          mounted: function () {},
          methods: {
            doButCallBack: function () {
              this.close(),
                this.butCallBack
                  ? (this.butCallBack(), (this.butCallBack = null))
                  : this.$router.go(-1);
            },
            docallBack: function () {
              "function" == typeof this.callBack &&
                (this.callBack(), (this.callBack = null));
            },
            docallBackRe: function () {
              "function" == typeof this.callBackRe &&
                (this.callBackRe(), (this.callBackRe = null));
            },
            show: function (n) {
              this.ReminderPop ||
                ((this.title = n.title || this.title),
                (this.content = n.content || this.content),
                (this.phoneNumber = n.phoneNumber || ""),
                (this.cancelBtn = n.cancelBtn || this.cancelBtn),
                (this.readonlyPhone = !1 !== n.readonlyPhone),
                (this.busiName = n.busiName || ""),
                (this.busiCode = n.busiCode || ""),
                (this.businessPrice = n.businessPrice || ""),
                (this.businessName = n.businessName || ""),
                (this.phoneName = n.phoneName || ""),
                n.color &&
                  ((this.colorTitle = n.color.title || ""),
                  (this.colorConfirmBtn = n.color.confirmBtn || ""),
                  (this.colorCancel = n.color.cancelBtn || ""),
                  (this.colorTips = n.color.tips || "")),
                (this.randCode = ""),
                (this.randTip = "获取验证码"),
                (this.randSend = !0),
                (this.randTime = 60),
                (this.Sended = !1),
                clearInterval(this.timeS),
                (this.ReminderPop = !0),
                n.callBack && (this.callBackRe = n.callBack),
                this.$forceUpdate());
            },
            confirm: function () {
              this.close(), this.docallBack();
            },
            confirmRe: function () {
              this.closeRe(), this.docallBackRe();
            },
            confirmorCancel: function () {
              this.cancelBtn ? this.close() : this.confirm();
            },
            close: function () {
              var n = this;
              (this.pointPopup = !1),
                setTimeout(function () {
                  (n.title = ""), (n.content = ""), (n.cancelBtn = !1);
                }, 200);
            },
            closeRe: function () {
              var n = this;
              setTimeout(function () {
                (n.title = ""), (n.content = "");
              }, 200),
                (this.ReminderPop = !1);
            },
            clearImg: function () {
              (this.randImgSend = !0),
                (this.randImgFlag = !1),
                (this.randImg = "");
            },
            getRandCode: function () {
              var n = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function e() {
                  var t, r;
                  return regeneratorRuntime.wrap(function (e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (n.randSend) {
                            e.next = 2;
                            break;
                          }
                          return e.abrupt("return");
                        case 2:
                          return (
                            n.$toast.loading({ message: "加载中..." }),
                            (t = { accNo: n.phoneNumber }),
                            n.$toast.loading({ message: "加载中..." }),
                            (e.next = 7),
                            Object(d["Wi"])(t)
                          );
                        case 7:
                          (r = e.sent),
                            n.$toast.clear(),
                            "0001" == r.retCode ||
                              ("0" == r.result
                                ? ((n.Sended = !0),
                                  (n.protocolId = r.object + ""),
                                  n.$popup.show({
                                    title: "提示",
                                    content: "验证码已下发至手机，请注意查收",
                                  }),
                                  n.randCodeTime())
                                : n.$popup.show({
                                    title: "提示",
                                    content: r.retMsg,
                                  }));
                        case 10:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            withdrawConfirm: function () {
              var n = this;
              return Object(l["a"])(
                regeneratorRuntime.mark(function e() {
                  var t;
                  return regeneratorRuntime.wrap(function (e) {
                    while (1)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if ("" != n.randCode && null != n.randCode) {
                            e.next = 3;
                            break;
                          }
                          return (
                            n.$toast("请输入短信验证码"), e.abrupt("return")
                          );
                        case 3:
                          if (0 != n.Sended) {
                            e.next = 6;
                            break;
                          }
                          return (
                            n.$toast("请先获取短信验证码"), e.abrupt("return")
                          );
                        case 6:
                          return (
                            n.$toast.loading({ message: "加载中..." }),
                            (e.next = 9),
                            Object(d["Vj"])({ rand_code: n.randCode })
                          );
                        case 9:
                          (t = e.sent),
                            n.$toast.clear(),
                            "000000" == t.retCode
                              ? ((n.ReminderPop = !1), n.confirmRe())
                              : n.$popup.show({
                                  title: "提示",
                                  content: t.retMsg,
                                });
                        case 12:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            randCodeTime: function () {
              var n = this;
              (this.randSend = !1),
                (this.randTip = this.randTime + "s"),
                (this.timeS = setInterval(function () {
                  (n.randTime = n.randTime - 1),
                    (n.randTip = n.randTime + "s"),
                    n.randTime <= 0 &&
                      (clearInterval(n.timeS),
                      (n.randTip = "获取验证码"),
                      (n.randSend = !0),
                      (n.randTime = 60));
                }, 1e3));
            },
          },
        },
        _ = j,
        I = Object(s["a"])(_, R, A, !1, null, "11874d60", null),
        U = I.exports,
        T = {
          name: "App",
          components: { popup: f, picker: P, vouchersPop: O, nopicPop: U },
          created: function () {
            this.$toast.setDefaultOptions("loading", {
              forbidClick: !0,
              duration: 0,
            });
          },
          mounted: function () {
            (a["a"].prototype.$popup = this.$refs.popup),
              (a["a"].prototype.$picker = this.$refs.picker),
              (a["a"].prototype.$vouchersPop = this.$refs.vouchersPop),
              (a["a"].prototype.$nopicPop = this.$refs.nopicPop);
          },
        },
        L = T,
        q = Object(s["a"])(L, o, u, !1, null, null, null),
        D = q.exports,
        x = t("41cb"),
        E = (t("499a"), t("b970")),
        M = t("9816"),
        Q = (t("157a"), t("a7fe")),
        $ = t.n(Q),
        H =
          (t("a130"),
          t("1be0"),
          t("6672"),
          t("4dcb"),
          t("2f1b"),
          t("43a1"),
          t("ef4d"),
          {
            data: function () {
              return {};
            },
            created: function () {
              var n = this,
                e =
                  document.documentElement.clientHeight ||
                  document.body.clientHeight;
              window.addEventListener(
                "resize",
                function () {
                  var t =
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
                  e < t && n.resetScroll(), (e = t);
                },
                !1
              ),
                document.body.addEventListener("focusout", function () {
                  var t =
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
                  e < t &&
                    setTimeout(function () {
                      n.resetScroll(), (e = t);
                    }, 100);
                });
            },
            methods: {
              resetScroll: function () {
                setTimeout(function () {
                  var n =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0;
                  console.log(n),
                    document.activeElement.scrollIntoViewIfNeeded(!0),
                    window.scrollTo(0, Math.max(n - 1, 0)),
                    (document.documentElement.scrollTop =
                      document.body.scrollTop =
                        0);
                }, 100);
              },
              goInsertBusiOptInfo: function (n, e, t, r, a, o, u, c) {
                var i = {
                  busiNum:
                    "string" === typeof n && n.length > 20
                      ? n.substring(0, 20)
                      : n,
                  optNum: a,
                  busiType: o,
                  optStauts: u,
                  remark: c,
                  busiName: e,
                  busiCode: t,
                  busiUrl: r,
                  channel: "wap",
                };
                Object(d["Fd"])(i);
              },
            },
          }),
        G = H,
        V =
          (t("ac1f"),
          t("5319"),
          function (n) {
            return n ? n.replace(/(\d{3})(\d{4})(\d{4})+/gm, "$1****$3") : "";
          }),
        Y = { phoneHidden: V },
        W = t("06d9"),
        z = t.n(W),
        Z = t("4eb5"),
        J = t.n(Z),
        K = t("13bf"),
        X = t("58ca"),
        nn = t("8c45"),
        en = t.n(nn),
        tn = t("e762"),
        rn = t("3452"),
        an = t.n(rn),
        on = t("7638"),
        un = null;
      function cn(n) {
        var e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 500;
        return (function () {
          var t = this,
            r = arguments;
          un && clearTimeout(un),
            (un = setTimeout(function () {
              n.apply(t, r);
            }, e));
        })();
      }
      var ln = !0;
      function dn(n) {
        var e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 500;
        return (function () {
          var t = arguments;
          ln &&
            ((ln = !1),
            n.apply(this, t),
            setTimeout(function () {
              ln = !0;
            }, e));
        })();
      }
      var pn = t("3835"),
        hn =
          (t("4fad"),
          {
            Rules: {
              phone: {
                pattern:
                  /^(0|86|17951)?(13[0-9]|15[012356789]|16[2567]|17[012345678]|18[0-9]|14[05679]|19[1356789])[0-9]{8}$/,
                message: "请输入正确的手机号码",
              },
              idCard: {
                pattern:
                  /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                message: "请输入正确的身份证号码",
              },
              email: {
                pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: "请输入正确的邮箱地址",
              },
              custName: {
                pattern:
                  /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/,
                message: "请输入2-10个汉字的姓名",
              },
              telephone: {
                pattern: /^0\d{2,3}-?\d{7,8}$/,
                message: "请输入正确的固定电话",
              },
              postcode: {
                pattern: /^[1-9]\d{5}$/,
                message: "请输入正确的邮政编码",
              },
              BNum: {
                pattern: /^(B|b)\d{8}$/,
                message: "请输入正确的宽带账号",
              },
              validCode: { pattern: /^.+$/, message: "请输入图形验证码" },
            },
            validate: function (n, e) {
              var t = { valid: !0, errors: {} };
              console.log(n);
              for (var r = 0, a = Object.entries(e); r < a.length; r++) {
                var o = Object(pn["a"])(a[r], 2),
                  u = o[0],
                  c = o[1],
                  i = n[c],
                  l = this.Rules[u];
                l
                  ? l.pattern.test(i) ||
                    ((t.valid = !1),
                    (t.message = t.message ? t.message : l.message),
                    (t.errors[u] = { field: u, value: i, message: l.message }))
                  : console.warn("未找到 ".concat(u, " 的验证规则"));
              }
              return t;
            },
            validateField: function (n, e) {
              var t = this.Rules[e];
              return t
                ? {
                    valid: t.pattern.test(n),
                    message: t.pattern.test(n) ? "" : t.message,
                  }
                : (console.warn("未找到 ".concat(e, " 的验证规则")),
                  { valid: !1, message: "无效的验证规则" });
            },
          });
      a["a"].use(en.a),
        a["a"].use(on["a"]),
        a["a"].use(r),
        (a["a"].prototype.$utils = r),
        a["a"].mixin(G);
      var sn = {
        router: x["a"],
        domain: "wapbj.189.cn",
        path: "wap2017/nresource/images",
      };
      a["a"].use(z.a, sn),
        a["a"].use(E["a"]),
        a["a"].use($.a),
        a["a"].use(K["a"]),
        a["a"].use(X["a"]),
        (a["a"].config.productionTip = !1),
        Object.keys(Y).forEach(function (n) {
          a["a"].filter(n, Y[n]);
        });
      var mn = [
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXqR6rzbEH",
        "qDYZby/9s9+psWvYdsYIvcGVBSHDlZlwCQu+T+Retu4aIkLWaF737gwCCxLso",
        "BGY6EKf9Cf0G1IpTLRaKM8VmNGYD/niwA9hD4ykom3wu7tNaPACbfmuYJp5JfJ1YI/zI5SHGPo4h3sAbsi8Le0jumbty065hghhmwIDAQAB",
      ];
      a["a"].use(J.a),
        (a["a"].prototype.$encruption = function (n, e) {
          var t = mn.join(""),
            r = e || t,
            a = new M["a"]();
          return a.setPublicKey(r), a.encrypt(n);
        });
      var fn = [
        "b",
        "j",
        "d",
        "x",
        "x",
        "x",
        "s",
        "k",
        "c",
        "x",
        "x",
        "d",
        "g",
        "j",
        "c",
        "g",
      ];
      (a["a"].prototype.$encodeAES = function (n) {
        var e = an.a.enc.Utf8.parse(fn.join("")),
          t = an.a.enc.Utf8.parse(fn.join("")),
          r = an.a.AES.encrypt(n, e, {
            iv: t,
            mode: an.a.mode.CBC,
            padding: an.a.pad.Pkcs7,
          });
        return encodeURIComponent(tn["Base64"].encode(r.toString()));
      }),
        (a["a"].prototype.$decodeAES = function (n) {
          n = decodeURIComponent(n);
          var e = tn["Base64"].decode(n),
            t = an.a.enc.Utf8.parse(fn.join("")),
            r = an.a.enc.Utf8.parse(fn.join("")),
            a = an.a.AES.decrypt(e, t, {
              iv: r,
              mode: an.a.mode.CBC,
              padding: an.a.pad.Pkcs7,
            });
          return a.toString(an.a.enc.Utf8);
        }),
        new a["a"]({
          el: "#app",
          router: x["a"],
          render: function (n) {
            return n(D);
          },
        }),
        (a["a"].prototype.$validator = hn);
    },
    6672: function (n, e, t) {},
    a130: function (n, e, t) {},
    a7fe: function (n, e) {
      e.install = function (n) {
        (n.prototype.gotolink = function (n) {
          this.$router.push(n);
        }),
          (n.prototype.back = function () {
            this.$router.go(-1);
          });
      };
    },
    b277: function (n, e, t) {},
    ed08: function (n, e, t) {
      "use strict";
      t.d(e, "f", function () {
        return u;
      }),
        t.d(e, "e", function () {
          return c;
        }),
        t.d(e, "d", function () {
          return i;
        }),
        t.d(e, "a", function () {
          return l;
        }),
        t.d(e, "b", function () {
          return s;
        }),
        t.d(e, "c", function () {
          return m;
        }),
        t.d(e, "j", function () {
          return f;
        }),
        t.d(e, "g", function () {
          return b;
        }),
        t.d(e, "i", function () {
          return k;
        }),
        t.d(e, "h", function () {
          return w;
        }),
        t.d(e, "k", function () {
          return g;
        });
      t("53ca"),
        t("4d63"),
        t("ac1f"),
        t("25f0"),
        t("fb6a"),
        t("99af"),
        t("843c"),
        t("38cf"),
        t("a15b"),
        t("d3b7"),
        t("466d"),
        t("841c"),
        t("d81d"),
        t("1276"),
        t("4de4"),
        t("159b"),
        t("b64b");
      var r = t("3452"),
        a = t.n(r),
        o = t("e762");
      function u() {
        return new Date().getTime();
      }
      function c(n) {
        var e = {
            888: "发发发",
            666: "顺顺顺",
            168: "福运来",
            816: "发又顺",
            618: "顺又发",
            918: "就要发",
            958: "就我发",
            998: "久久发",
            899: "久久发",
            699: "久久顺",
            996: "久久顺",
            518: "我要发",
            138: "一生发",
            838: "发上发",
            948: "就是发",
            913: "就要升",
            178: "一起发",
            418: "事业发",
            369: "步步高升",
            468: "步步高升",
            88: "恭喜发财",
            58: "恭喜发财",
            18: "恭喜发财",
            565: "福运相随",
            847: "百事吉",
            202: "两全其美",
            151: "要如意",
            157: "有福气",
            101: "一帆风顺",
            447: "事事吉",
            846: "百事顺",
            446: "事事顺",
            4451: "事事如意",
            749: "喜事久",
            516: "福运来",
            657: "有福气",
            606: "六六大顺",
            303: "三羊开泰",
            505: "五谷丰登",
            909: "九天揽月",
            1010: "十全十美",
            196: "福运来",
            198: "福运来",
            156: "福运来",
            158: "福运来",
            66: "六六大顺",
            57: "福运来",
            520: "我爱你",
            521: "我爱你",
            510: "我依你",
            941: "就是你",
            942: "就是爱",
            912: "就要爱",
            731: "心相印",
            771: "亲亲你",
            770: "亲亲你",
            121: "要爱你",
            257: "爱我妻",
            527: "我爱妻",
            457: "是我妻",
            927: "就爱妻",
            258: "爱我吧",
            813: "伴一生",
            147: "一世情",
            9121: "就要爱你",
            2825: "爱不爱我",
            1452: "你是我爱",
            1372: "一厢情愿",
            8013: "伴你一生",
            1314: "一生一世",
            3013: "想你一生",
            5460: "我思念你",
            3399: "长长久久",
            7731: "心心相印",
            9213: "钟爱一生",
            1573: "一往情深",
            1920: "依旧爱你",
            5240: "我爱是你",
            3344: "生生世世",
            5260: "我暗恋你",
            1711: "一心一意",
            99: "长长久久",
            211: "金榜题名",
            985: "金榜题名",
            100: "一百分",
            541: "我是第一名",
            951: "叫我第一名",
          },
          t = RegExp(
            /888|666|168|816|618|918|958|998|899|699|996|518|138|838|948|913|958|178|418|369|468|88|58|18/
          ),
          r = RegExp(
            /565|847|202|151|157|101|447|846|446|4451|749|516|657|606|303|505|909|1010|168|196|198|156|158|66|516|57/
          ),
          a = RegExp(
            /520|521|510|941|942|912|731|771|770|121|257|527|457|927|258|813|147|9121|2825|1452|1372|8013|1314|3013|5460|3399|7731|9213|1573|1920|5240|3344|5260|1711|99/
          ),
          o = RegExp(/211|985|100|541|951/),
          u = { styleNum: "", styleName: "", styleType: "" };
        for (var c in e)
          if (n.indexOf(c) > -1) {
            (u.styleNum = c), (u.styleName = e[c]);
            break;
          }
        return (
          t.test(n)
            ? (u.styleType = "phoneStyle0")
            : r.test(n)
            ? (u.styleType = "phoneStyle1")
            : a.test(n)
            ? (u.styleType = "phoneStyle2")
            : o.test(n) && (u.styleType = "phoneStyle3"),
          u
        );
      }
      function i(n, e) {
        if (null != n) {
          var t = parseInt(n),
            r = new Date(t),
            a = r.getFullYear(),
            o =
              r.getMonth() + 1 < 10
                ? "0" + (r.getMonth() + 1)
                : r.getMonth() + 1,
            u = r.getDate() < 10 ? "0" + r.getDate() : r.getDate();
          if (e) {
            var c = r.getHours() < 10 ? "0" + r.getHours() : r.getHours(),
              i = r.getMinutes() < 10 ? "0" + r.getMinutes() : r.getMinutes(),
              l = r.getSeconds() < 10 ? "0" + r.getSeconds() : r.getSeconds();
            return a + "-" + o + "-" + u + " " + c + ":" + i + ":" + l;
          }
          return a + "-" + o + "-" + u;
        }
        return "";
      }
      function l(n, e) {
        if ("IDCard" == e) {
          if (18 == n.length)
            n = (n.length, n.slice(0, 6) + "********" + n.slice(14, 17) + "*");
          else {
            if (15 == n.length) return d(n, n.length, "*");
            if (n.length > 7) return p(n, n.length, "*", 4);
          }
          return n;
        }
        var t = n.slice(0, 3),
          r = n.slice(7, 11),
          a = "".concat(t, "****").concat(r);
        return a;
      }
      function d(n, e, t) {
        var r = n.slice(0, 6),
          a = n.slice(-3),
          o = r.padEnd(e - 3, t);
        return o + a;
      }
      function p(n, e, t, r) {
        var a = n.slice(-r);
        if (a.length < e) {
          var o = t.repeat(e - a.length);
          return o + a;
        }
        return a;
      }
      var h = [
        "b",
        "j",
        "d",
        "x",
        "x",
        "x",
        "s",
        "k",
        "c",
        "x",
        "x",
        "d",
        "g",
        "j",
        "c",
        "g",
      ];
      function s(n) {
        var e = a.a.enc.Utf8.parse(h.join("")),
          t = a.a.enc.Utf8.parse(h.join("")),
          r = a.a.AES.encrypt(n, e, {
            iv: t,
            mode: a.a.mode.CBC,
            padding: a.a.pad.Pkcs7,
          });
        return encodeURIComponent(o["Base64"].encode(r.toString()));
      }
      function m(n, e, t) {
        var r = a.a.enc.Utf8.parse(e),
          o = a.a.TripleDES.encrypt(n, r, {
            iv: a.a.enc.Utf8.parse(t),
            mode: a.a.mode.CBC,
            padding: a.a.pad.Pkcs7,
          });
        return o.toString();
      }
      function f(n) {
        return n
          .split("")
          .map(function (n) {
            return ("0" + n.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("");
      }
      function b(n) {
        for (var e = n.toString(), t = "", r = 0; r < e.length; r += 2)
          t += String.fromCharCode(parseInt(e.substr(r, 2), 16));
        return t;
      }
      function k(n) {
        return null === n || void 0 === n || 0 === n.length;
      }
      function w(n) {
        if (!n) return !1;
        var e,
          t = "%()><;@#$&[]{}'-";
        for (e = 0; e < t.length; e++)
          if (-1 != n.indexOf(t.charAt(e))) return !0;
        return !1;
      }
      var g = {
        isTelMobUniNo: function (n) {
          switch (!0) {
            case this.isTelPhNo(n):
              return !0;
            case this.isMbPhNo(n):
              return !0;
            case this.isUniPhNo(n):
              return !0;
            case this.isTelFax(n):
              return !0;
            default:
              return !1;
          }
        },
        isTelPhNo: function (n) {
          return !!n && 11 == n.length && /^(133|153|180|189)\d*$/.test(n);
        },
        isMbPhNo: function (n) {
          return (
            !!n &&
            11 == n.length &&
            /^(134|135|136|137|138|139|147|150|151|152|157|158|159|182|183|184|187|188)\d*$/.test(
              n
            )
          );
        },
        isTelFax: function (n) {
          return !!n && /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(n);
        },
        isMbPhNoInd: function (n) {
          if (!n) return !1;
          var e = n.length;
          switch (!0) {
            case 1 === e:
              return /^(1)\d*$/.test(n);
            case 2 === e:
              return /^(13|15|18|14)\d*$/.test(n);
            case e >= 3:
              return /^(134|135|136|137|138|139|147|150|151|152|157|158|159|182|183|184|187|188)\d*$/.test(
                n
              );
            default:
              return !1;
          }
        },
        isEmail: function (n) {
          return (
            !!n &&
            /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
              n
            )
          );
        },
        isUniPhNo: function (n) {
          return (
            !!n && 11 == n.length && /^13[0-2]|15[56]|18[56]|145\d{8}$/.test(n)
          );
        },
      };
    },
    ef4d: function (n, e, t) {},
    fb91: function (n, e, t) {
      "use strict";
      t.d(e, "c", function () {
        return o;
      }),
        t.d(e, "a", function () {
          return u;
        }),
        t.d(e, "d", function () {
          return c;
        }),
        t.d(e, "b", function () {
          return i;
        });
      t("159b"), t("07ac");
      var r = "wap_track_",
        a = {
          actNo: "".concat(r, "actNo"),
          utm_ch: "".concat(r, "utm_ch"),
          utm_sch: "".concat(r, "utm_sch"),
        };
      function o() {
        var n =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return !!(n.actNo || n.utm_ch || n.utm_sch);
      }
      function u() {
        var n =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        o(n) &&
          (sessionStorage.setItem(a.actNo, n.actNo || ""),
          sessionStorage.setItem(a.utm_ch, n.utm_ch || ""),
          sessionStorage.setItem(a.utm_sch, n.utm_sch || ""));
      }
      function c() {
        var n =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        u(n);
      }
      function i() {
        Object.values(a).forEach(function (n) {
          sessionStorage.removeItem(n);
        });
      }
    },
  },
  [[0, "runtime", "chunk-libs"]],
]);
