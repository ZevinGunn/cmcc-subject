define(function (require) {
  var a = require("stcutil"),
    c = Namespace("all.constant"),
    y =
      (new Array(),
      new Array(),
      new Array(),
      new Array(),
      ["043A", "lyZA", "OQGK", "043A", "6ykk", "OQGK", "lyZA", "6ykk"]),
    h = y
      .filter(function (e, i) {
        return i % 2 == 0;
      })
      .join(""),
    v = function (req, a, c, y) {
      if (null != req.phoneNo && null != req.provCode) {
        null == req.channel && (req.channel = "00");
        var h = {
          amountFlag: req.amountFlag,
          saleFlag: req.saleFlag,
          enableFlag: req.enableFlag,
          enableType: req.enableType,
          saleQueryType: req.saleQueryType,
          phoneNo: req.phoneNo,
          provCode: req.provCode,
          channel: req.channel,
        };
        require(["commonutil"], function (v) {
          v.POST("/v1/pay/payrule/" + req.user_id, h, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    g = function (req, a, c, y) {
      if (null != req.phoneNo && null != req.provCode) {
        null == req.channel && (req.channel = "00");
        var h = {
          amountFlag: req.amountFlag,
          saleFlag: req.saleFlag,
          enableFlag: req.enableFlag,
          phoneNo: req.phoneNo,
          provCode: req.provCode,
          channel: req.channel,
          payPhoneNo: req.payPhoneNo,
          activityType: req.activityType,
          activityArea: req.activityArea,
        };
        require(["commonutil"], function (v) {
          v.POST("/v1/pay/payrule4p/" + req.payPhoneNo, h, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    T = function (req, a, c, y) {
      var h = "00";
      if (null != req.phoneNo) {
        var v = { chargeCell: req.phoneNo, channel: h };
        require(["commonutil"], function (h) {
          h.GET("/v1/pay/flow/moblevalidate/" + req.user_id, v, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    P = function (a, c, y, h, v) {
      null != a
        ? require(["commonutil"], function (g) {
            g.GET("/v1/cust/notebook/" + a, { num_flag: v }, c, y, h);
          })
        : "function" == typeof y && y("", "请求参数错误");
    },
    O = function (a, c, y, h, v) {
      null != a
        ? require(["commonutil"], function (g) {
            g.GET("/v1/cust/lovenotebook/" + a, { num_flag: v }, c, y, h);
          })
        : "function" == typeof y && y("", "请求参数错误");
    },
    N = function (req, a, c, y) {
      if (null != req.phonenum) {
        var h = "/v1/cust/lovebookhis/" + req.phonenum,
          v = { qryType: req.qryType };
        require(["commonutil"], function (g) {
          g.GET(h, v, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    k = function (req, a, c, y) {
      if (null != req.phonenum) {
        var h = "/v1/cust/lovebookhisdel/" + req.phonenum,
          v = { nobook: req.nobook };
        require(["commonutil"], function (g) {
          g.POST(h, v, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    C = function (req, a, c, y) {
      if (
        null != req.phonenum &&
        null != req.nobook_name &&
        null != req.nobook &&
        null != req.code
      ) {
        var h = {
            nobook_name: req.nobook_name,
            nobook: req.nobook,
            code: req.code,
            num_flag: req.numflag,
            balance_threshold: req.balance_threshold,
            channel: req.channel,
            reserves: req.reserves,
          },
          v = "/v1/cust/notebookmodify/" + req.phonenum + "/" + req.code;
        require(["commonutil"], function (g) {
          g.POST(v, h, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    R = function (req, a, c, y) {
      if (null != req.phonenum && null != req.nobook) {
        var h = { channel: req.channel };
        require(["commonutil"], function (v) {
          v.POST(
            "/v1/cust/notebookdel/" + req.phonenum + "/" + req.nobook,
            h,
            a,
            c,
            y
          );
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    S = function (req, a, c, y) {
      if (null != req.phonenum && null != req.phone_no) {
        var h = { channel: req.channel, delType: "1" };
        require(["commonutil"], function (v) {
          v.POST(
            "/v1/cust/notebookdel/" + req.phonenum + "/" + req.phone_no,
            h,
            a,
            c,
            y
          );
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    b = function (req, a, c, y) {
      if (
        null != req.phonenum &&
        null != req.nobook &&
        null != req.nobook_name
      ) {
        var h = {
          nobook: req.nobook,
          nobook_name: req.nobook_name,
          num_flag: req.numflag,
          balance_threshold: req.balance_threshold,
          channel: req.channel,
        };
        require(["commonutil"], function (v) {
          v.POST("/v1/cust/notebook/" + req.phonenum, h, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    E = function (req, a, c, y) {
      var h = { code: req.code },
        v = "/v1/cust/retrylovenobookmodify/" + req.phonenum;
      require(["commonutil"], function (g) {
        g.POST(v, h, a, c, y);
      });
    },
    A = function (req, a, c, y) {
      var h = "/v1/cust/isnobook/" + req.phonenum,
        v = { nobook: req.nobook };
      require(["commonutil"], function (g) {
        g.GET(h, v, a, c, y);
      });
    },
    I = function (req, a, c, y) {
      if (null != req.phonenum && null != req.cardPwd) {
        var h = {
            cardPwd: req.cardPwd,
            chargedNum: req.phonenum,
            longliveLolita: req.longliveLolita,
          },
          v = "/v1/pay/card/";
        null != req.user && (v += req.user),
          null != req.captchaVal && (v = v + "?captchaVal=" + req.captchaVal);
        var g = req.user;
        req.isLogin || (g = "guest"),
          require(["commonutil"], function (g) {
            g.POST(v, h, a, c, y, { inx: "rechargecard", flag: "true" });
          });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    M = function (req, a, y, h, v) {
      var g = "00";
      "undefined" != typeof req.channel && (g = req.channel);
      var T = window.location.href + "";
      if ((T.indexOf("/itemcollect") > 0 && (g = "0001"), req.status))
        var P = "/v1/pay/saveorder/" + req.payPhoneNo;
      else var P = "/v1/pay/saveorder4t/" + req.payPhoneNo;
      null != req.captchaVal && (P = P + "?captchaVal=" + req.captchaVal),
        (c.SORDERPPHONE = req.phoneNo),
        (c.SORDERAMOUNT = req.payAmount),
        (c.SORDERPROV = req.provCode);
      var O = {};
      if (
        ((O =
          "1" == req.numFlag
            ? { inx: "rechargelove", flag: "true", unlogin: "special" }
            : { inx: "rechargecredit", flag: "true", unlogin: "special" }),
        null != req.payPhoneNo &&
          null != req.chargeAmount &&
          null != req.payAmount &&
          null != req.provCode)
      )
        if (1 == v) {
          var N = {
            channel: g,
            amount: req.payAmount,
            chargeMoney: req.chargeAmount,
            choseMoney: req.choseMoney,
            activityNO: req.activityNO,
            operateId: req.operateId,
            homeProv: req.provCode,
            prodID: req.prodID,
            source: req.sources,
            numFlag: req.numFlag,
            pCardNo: req.pcardNo,
            source: req.source,
            invoinceType: req.invoinceType,
          };
          req.fkToken && (N.fkToken = req.fkToken),
            (P +=
              P.indexOf("?") > -1
                ? "&provinceId=" + req.provCode
                : "?provinceId=" + req.provCode),
            require(["commonutil"], function (c) {
              c.POST(P, N, a, y, h, O);
            });
        } else {
          var N = {
            channel: g,
            amount: req.payAmount,
            chargeMoney: req.chargeAmount,
            choseMoney: req.choseMoney,
            activityNO: req.activityNO,
            operateId: req.operateId,
            homeProv: req.provCode,
            prodID: req.prodID,
            source: req.sources,
            numFlag: req.numFlag,
            source: req.source,
            invoinceType: req.invoinceType,
          };
          req.fkToken && (N.fkToken = req.fkToken),
            (P +=
              P.indexOf("?") > -1
                ? "&provinceId=" + req.provCode
                : "?provinceId=" + req.provCode),
            require(["commonutil"], function (c) {
              c.POST(P, N, a, y, h, O);
            });
        }
      else "function" == typeof y && y("", "请求参数错误");
    },
    F = function (req, a, y, h) {
      var v = "00",
        g = "/v1/pay/saveinterorder/" + req.payPhoneNo;
      if (
        (null != req.captchaVal && (g = g + "?captchaVal=" + req.captchaVal),
        "undefined" != typeof req.channel && (v = req.channel),
        (c.SORDERPPHONE = req.phoneNo),
        (c.SORDERAMOUNT = req.payAmount),
        (c.SORDERPROV = req.provCode),
        null != req.payPhoneNo &&
          null != req.chargeAmount &&
          null != req.payAmount &&
          null != req.provCode)
      ) {
        var T = {
          channel: v,
          amount: req.payAmount,
          chargeMoney: req.chargeAmount,
          choseMoney: req.choseMoney,
          activityNO: req.activityNO,
          operateId: req.operateId,
          homeProv: req.provCode,
          prodID: req.prodID,
          source: req.source,
        };
        req.fkToken && (T.fkToken = req.fkToken),
          (g +=
            g.indexOf("?") > -1
              ? "&provinceId=" + req.provCode
              : "?provinceId=" + req.provCode),
          require(["commonutil"], function (c) {
            c.POST(g, T, a, y, h, { inx: "rechargecredit", flag: "true" });
          });
      } else "function" == typeof y && y("", "请求参数错误");
    },
    G = function (req, a, c, y) {
      null != req.orderId
        ? require(["commonutil"], function (h) {
            h.GET("/v1/pay/orderqry/" + req.orderId, {}, a, c, y);
          })
        : "function" == typeof c && c("", "请求参数错误");
    },
    V = function (req, a, c, y) {
      if (null != req.orderId) {
        var h = "?";
        for (var v in req)
          "f" != v && "p" != v && (h += v + "=" + req[v] + "&");
        (h = h.substring(0, h.length - 1)),
          require(["commonutil"], function (v) {
            v.GET("/v1/pay/paycallback" + h, {}, a, c, y);
          });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    D = function (req, a, c, y) {
      var h = (parseInt(req.r), parseInt(req.n), req.user),
        v = req.startMon,
        g = req.endMon,
        T = (req.currMon, null);
      (T =
        "" == req.status
          ? h + "_" + v + "_" + g
          : h + "_" + v + "_" + g + "_" + req.status),
        L(
          req,
          function (c) {
            "function" == typeof a && a(c);
          },
          function (a, y) {
            "function" == typeof c && c(a, y);
          },
          function (a, c) {
            "function" == typeof y && y(a, c);
          }
        );
    },
    _ = function (req, a, c, y) {
      if (null != req.user) {
        var h = {
          phoneNo: req.user,
          orderType: req.orderType,
          startTime: req.startMon,
          endTime: req.endMon,
          pageNo: req.pageNo,
        };
        (h.channel = null == req.channel ? "00" : req.channel),
          (h.goodsName = null == req.goodsName ? "" : req.goodsName),
          (h.orderStatus =
            null == req.status || 8 == req.status ? "" : req.status),
          require(["commonutil"], function (v) {
            v.POST(
              "/v1/pay/flow/orderList",
              h,
              function (c) {
                a(c);
              },
              function () {
                c();
              },
              function () {
                y();
              }
            );
          });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    w = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        var v = {
          orderId: req.orderId,
          phoneNo: req.phoneNo,
          orderChannel: req.channel,
        };
        h.POST("/v1/pay/flow/repayorder", v, a, c, y);
      });
    },
    H = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        var v = {
          orderId: req.orderId,
          channel: req.channel,
          payWay: req.payWay,
          shouldFee: req.shouldFee,
          chargeFee: req.chargeFee,
          phoneNo: req.phoneNo,
        };
        req.status
          ? h.POST("/v1/pay/repayorder/" + req.loginNo, v, a, c, y)
          : h.POST("/v1/pay/repayorder4t/" + req.loginNo, v, a, c, y);
      });
    },
    B = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.POST(
          "/v1/pay/deleteorder/" + req.user_id,
          {
            orderId: req.order_id,
            payDate: req.qry_date,
            channel: req.channel,
          },
          a,
          c,
          y
        );
      });
    },
    L = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET(
          "/v1/pay/payorderlist/" + req.user,
          {
            payStartDate: req.startMon,
            payEndDate: req.endMon,
            numType: req.numType,
          },
          a,
          c,
          y
        );
      });
    },
    U = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET(
          "/v1/cust/his/" + req.user,
          { startTime: req.startTime, endTime: req.endTime },
          function (c, y) {
            "function" == typeof a &&
              (null != y.paging.sOperTime ? a(c, y.paging.sOperTime) : a(c));
          },
          function (a, y, h) {
            c(a, y, h);
          },
          y,
          { inx: "recharhisqry", flag: "true" }
        );
      });
    },
    Q = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET(
          "/v1/res/precheck/" + req.user + "?captchaVal=" + req.captchaVal,
          {},
          a,
          c,
          y
        );
      });
    },
    W = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET("/v1/paypoint/rmdpoint/" + req.user, {}, a, c, y);
      });
    },
    j = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        var v = { phoneNo: req.payPhoneNo, payPoint: req.payPoint };
        h.POST("/v1/pay/pointsms/" + req.user, v, a, c, y);
      });
    },
    J = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.ASYNCPOST(
          "/v1/pay/pointvalid/" + req.user,
          { sms_code: req.smsCode, serial_no: req.serialNo },
          a,
          c,
          y
        );
      });
    },
    Y = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        var v = {
          channel: req.channel,
          queryValue: req.payPhoneNo,
          pointNum: req.pointNum,
          pointMoney: req.pointMoney,
          chargeMoney: req.chargeAmount,
          amount: req.payAmount,
          servPwd: req.servPwd,
          smsCode: req.smsCode,
          homeProv: req.provCode,
          serialNo: req.serialNo,
        };
        h.ASYNCPOST(
          "/v1/paypoint/savepointorder/" +
            req.user +
            "?captchaVal=" +
            req.captchaVal,
          v,
          a,
          c,
          y,
          { inx: "rechargejf", flag: "true" }
        );
      });
    },
    K = function (req, a, y, h) {
      (c.SORDERPPHONE = req.payPhoneNo),
        (c.SORDERAMOUNT = req.payAmount),
        (c.SORDERPROV = req.provCode),
        require(["commonutil"], function (c) {
          var v = {
            payPhoneNo: req.user,
            channel: req.channel,
            queryValue: req.payPhoneNo,
            pointNum: req.pointNum,
            pointMoney: req.pointMoney,
            chargeMoney: req.chargeAmount,
            amount: req.payAmount,
            smsCode: req.smsCode,
            homeProv: req.provCode,
            serialNo: req.serialNo,
            source: req.source,
            md5: req.md5,
          };
          c.ASYNCPOST(
            "/v1/paypoint/savehybridorder/" +
              req.payPhoneNo +
              "?provinceId=" +
              req.provCode,
            v,
            a,
            y,
            h,
            { inx: "rechargejf", flag: "true" }
          );
        });
    },
    Z = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET("/v1/flow/gprs/", {}, a, c, y);
      });
    },
    z = function (req, a, y, h) {
      var v = "00",
        g = "/v1/flow/gprs/saveorder/" + req.userid;
      if (
        ("undefined" != typeof req.channel && (v = req.channel),
        (c.SORDERPPHONE = req.phoneNo),
        (c.SORDERAMOUNT = req.payAmount),
        (c.SORDERPROV = req.provCode),
        null != req.phoneNo &&
          null != req.shouldFee &&
          null != req.initFee &&
          null != req.cardCode)
      ) {
        var T = {
          cardType: req.cardType,
          channel: v,
          cardCode: req.cardCode,
          openType: req.openType,
          cardValue: req.cardValue,
          initFee: req.initFee,
          saleDiscount: req.saleDiscount,
          shouldFee: req.shouldFee,
          phoneNo: req.phoneNo,
          validTime: req.validTime,
        };
        require(["commonutil"], function (c) {
          c.POST(g, T, a, y, h, { inx: "rechargegprs", flag: "true" });
        });
      } else "function" == typeof y && y("", "请求参数错误");
    },
    X = function (req, a, c, y) {
      if (null != req.orderId) {
        var h = "?";
        for (var v in req)
          "f" != v && "p" != v && (h += v + "=" + req[v] + "&");
        (h = h.substring(0, h.length - 1)),
          require(["commonutil"], function (v) {
            v.GET("/v1/pay/flow/paycallback" + h, {}, a, c, y);
          });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    $ = function (req, a) {
      require(["commonutil"], function (c) {
        c.GET(
          "/v1/pay/fastpaypromt",
          { provCode: req.provCode, channel: req.channel },
          function (c) {
            "function" == typeof a && a(c);
          },
          function () {},
          function () {}
        );
      });
    },
    no = function (req, a, c, y) {
      var h = "00";
      if (null != req.phoneNo) {
        var v = {
          chargeCell: req.phoneNo,
          flowType: req.flowType,
          payWay: req.payWay,
          channel: h,
        };
        require(["commonutil"], function (h) {
          h.GET("/v1/pay/flow/goodslist/" + req.user_id, v, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    oo = function (req, a, c, y) {
      var h = "00";
      if (null != req.phoneNo) {
        var v = {
          chargeCell: req.phoneNo,
          flowType: req.flowType,
          exchangeType: req.payWay,
          clientType: req.clientType,
          channel: h,
        };
        require(["commonutil"], function (h) {
          h.GET("/v1/pay/flow/getreminder/" + req.user_id, v, a, c, y);
        });
      } else "function" == typeof c && c("", "请求参数错误");
    },
    eo = function (req, y, v, g) {
      var T = "00";
      "undefined" != typeof req.channel && (T = req.channel);
      var P = "client" == req.userNum ? "" : req.userNum;
      (c.SORDERPPHONE = req.chargeCell),
        (c.SORDERAMOUNT = req.orderPrice),
        (c.SORDERPROV = req.provCode);
      var O = sessionStorage.getItem("encryptToken");
      O || "undefined" == O || (O = "yxfmxifprj"),
        (req.chargeCell = a.getAesString(req.chargeCell, h, h)),
        (req.chargeCell = base64encode(req.chargeCell));
      var N = "/v1/pay/flow/submitPay/" + req.chargeCell,
        k = {};
      if (
        ((k =
          "1" == req.numFlag
            ? { inx: "rechargelovegprs", flag: "true" }
            : { inx: "rechargegprs", flag: "true" }),
        null != req.chargeCell &&
          null != req.goodsPrice &&
          null != req.orderPrice &&
          null != req.goodsId)
      ) {
        var C = {
          channel: T,
          chargeCell: req.chargeCell,
          userNum: P,
          userType: req.userType,
          goodsId: req.goodsId,
          exchangeType: req.exchangeType,
          goodsPrice: req.goodsPrice,
          discountId: req.discountId,
          orderPrice: req.orderPrice,
          productTraffic: req.productTraffic,
          numFlag: req.numFlag,
          cardTicketId: req.cardTicketId,
          cardName: req.cardName,
          tag: req.tag,
          couponVersion: req.couponVersion,
        };
        require(["commonutil"], function (a) {
          a.POST(N, C, y, v, g, k);
        });
      } else "function" == typeof v && v("", "请求参数错误");
    },
    ao = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET(
          "/v1/pay/payenablev2/" + req.prov_code + "?channel=" + req.channel,
          {},
          a,
          c,
          y
        );
      });
    },
    to = function (req, a, y, h) {
      var v = "00",
        g = "/v1/pay/savebroadorder/" + req.payPhoneNo;
      if (
        (null != req.captchaVal && (g = g + "?captchaVal=" + req.captchaVal),
        "undefined" != typeof req.channel && (v = req.channel),
        (c.SORDERPPHONE = req.phoneNo),
        (c.SORDERAMOUNT = req.payAmount),
        (c.SORDERPROV = req.provCode),
        null != req.payPhoneNo &&
          null != req.chargeAmount &&
          null != req.choseMoney &&
          null != req.payAmount &&
          null != req.provCode)
      ) {
        var T = {
          channel: v,
          amount: req.payAmount,
          chargeMoney: req.chargeAmount,
          choseMoney: req.choseMoney,
          homeProv: req.provCode,
          source: req.source,
        };
        req.fkToken && (T.fkToken = req.fkToken),
          (g +=
            g.indexOf("?") > -1
              ? "&provinceId=" + req.provCode
              : "?provinceId=" + req.provCode),
          require(["commonutil"], function (c) {
            c.POST(g, T, a, y, h, { unlogin: "special" });
          });
      } else "function" == typeof y && y("", "请求参数错误");
    },
    co = function (req, a, y, h) {
      var v = "00",
        g = "/v1/pay/savefixedorder/" + req.payPhoneNo;
      if (
        (null != req.captchaVal && (g = g + "?captchaVal=" + req.captchaVal),
        "undefined" != typeof req.channel && (v = req.channel),
        (c.SORDERPPHONE = req.phoneNo),
        (c.SORDERAMOUNT = req.payAmount),
        (c.SORDERPROV = req.provCode),
        null != req.payPhoneNo &&
          null != req.chargeAmount &&
          null != req.choseMoney &&
          null != req.payAmount &&
          null != req.provCode)
      ) {
        var T = {
          channel: v,
          amount: req.payAmount,
          chargeMoney: req.chargeAmount,
          choseMoney: req.choseMoney,
          homeProv: req.provCode,
          source: req.source,
        };
        (g +=
          g.indexOf("?") > -1
            ? "&provinceId=" + req.provCode
            : "?provinceId=" + req.provCode),
          req.fkToken && (T.fkToken = req.fkToken),
          require(["commonutil"], function (c) {
            c.POST(g, T, a, y, h);
          });
      } else "function" == typeof y && y("", "请求参数错误");
    },
    uo = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET("/v1/cust/creditPointQry/" + req.userId, {}, a, c, y);
      });
    },
    ro = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        h.GET("/v1/pay/payrulelimit", { operateId: req.operateId }, a, c, y);
      });
    },
    lo = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        var v = "/v1/pay/unpaidorderflagquery/" + req.loginNo;
        h.POST(v, req, a, c, y);
      });
    },
    io = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        var v =
          "/v1/cust/shoporder4freelogin/" +
          req.credentialsNo +
          "/" +
          req.loginLessqCode +
          "/token";
        h.GET(v, {}, a, c, y);
      });
    },
    fo = function (req, a, c, y) {
      require(["commonutil"], function (h) {
        var v = "/v1/paypoint/limitinfo";
        h.GET(v, { provCode: req.province }, a, c, y);
      });
    };
  return {
    getToken: function (req, a, c, y) {
      io(req, a, c, y);
    },
    getPayRelRule: function (req, a, c, y) {
      v(req, a, c, y);
    },
    getCombinePayRelRule: function (req, a, c, y) {
      g(req, a, c, y);
    },
    getGprsPayEnable: function (req, a, c, y) {
      T(req, a, c, y);
    },
    getRechargeBookInfo: function (a, c, y, h, v) {
      P(a, c, y, h, v);
    },
    getRecLoveBookInfo: function (a, c, y, h, v) {
      O(a, c, y, h, v);
    },
    getPhoneType: function (req, a, c, y) {
      A(req, a, c, y);
    },
    getAddHis: function (req, a, c, y) {
      N(req, a, c, y);
    },
    deleteHis: function (req, a, c, y) {
      k(req, a, c, y);
    },
    sendAgain: function (req, a, c, y) {
      E(req, a, c, y);
    },
    putRechargeBook: function (req, a, c, y) {
      C(req, a, c, y);
    },
    deleteRechargeBook: function (req, a, c, y) {
      R(req, a, c, y);
    },
    removeBind: function (req, a, c, y) {
      S(req, a, c, y);
    },
    postRechargeBook: function (req, a, c, y) {
      b(req, a, c, y);
    },
    postPayCard: function (req, a, c, y) {
      I(req, a, c, y);
    },
    postPaySaveOrder: function (req, a, c, y, h) {
      M(req, a, c, y, h);
    },
    postPaySaveInterOrder: function (req, a, c, y) {
      F(req, a, c, y);
    },
    getPayOrderQry: function (req, a, c, y) {
      G(req, a, c, y);
    },
    getPayCallBack: function (req, a, c, y) {
      V(req, a, c, y);
    },
    getGprsRechargeRecord: function (req, a, c, y) {
      _(req, a, c, y);
    },
    getRechargeRecord: function (req, a, c, y) {
      D(req, a, c, y);
    },
    deleteOrderRecord: function (req, a, c, y) {
      B(req, a, c, y);
    },
    getRepayOrder: function (req, a, c, y) {
      H(req, a, c, y);
    },
    getRechargeHis: function (req, a, c, y) {
      U(req, a, c, y);
    },
    identifyCode: function (req, a, c, y) {
      Q(req, a, c, y);
    },
    getPointsForOther: function (req, a, c, y) {
      W(req, a, c, y);
    },
    sendSms: function (req, a, c, y) {
      j(req, a, c, y);
    },
    checkVec: function (req, a, c, y) {
      J(req, a, c, y);
    },
    postSaveJfOrder: function (req, a, c, y) {
      Y(req, a, c, y);
    },
    postSaveHybridJfOrder: function (req, a, c, y) {
      K(req, a, c, y);
    },
    getGprsItems: function (req, a, c, y) {
      Z(req, a, c, y);
    },
    postGprsSaveOrder: function (req, a, c, y) {
      z(req, a, c, y);
    },
    getGprsPayCallBack: function (req, a, c, y) {
      X(req, a, c, y);
    },
    getFastRechargePro: function (req, a, c, y) {
      $(req, a, c, y);
    },
    getGprsPayGoodsList: function (req, a, c, y) {
      no(req, a, c, y);
    },
    getGprsReminder: function (req, a, c, y) {
      oo(req, a, c, y);
    },
    postSaveGprsMoneyOrder: function (req, a, c, y) {
      eo(req, a, c, y);
    },
    getGprsRepayOrder: function (req, a, c, y) {
      w(req, a, c, y);
    },
    getUserCredit: function (req, a, c, y) {
      uo(req, a, c, y);
    },
    getPayRuleLimit: function (req, a, c, y) {
      ro(req, a, c, y);
    },
    getProvPayEnable: function (req, a, c, y) {
      ao(req, a, c, y);
    },
    postPaySaveBroBand: function (req, a, c, y) {
      to(req, a, c, y);
    },
    postPaySaveLandline: function (req, a, c, y) {
      co(req, a, c, y);
    },
    getUnpayOrder: function (req, a, c, y) {
      lo(req, a, c, y);
    },
    qryJFprovinceLimit: function (req, a, c, y) {
      fo(req, a, c, y);
    },
  };
});
