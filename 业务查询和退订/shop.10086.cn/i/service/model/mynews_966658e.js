define(function (require) {
  var c = function (req, c, a) {
      g(
        req,
        function (g) {
          "function" == typeof c && c(g);
        },
        function (c, g) {
          "function" == typeof a && a(c, g);
        },
        function (c, g) {
          "function" == typeof error && error(c, g);
        }
      );
    },
    g = function (req, c, g, a) {
      require(["commonutil"], function (y) {
        var T = "/v1/cust/msgqry/" + req.userId + "/" + req.busiType,
          v = { pageindex: req.pageindex, pagesize: req.pagesize };
        y.GET(T, v, c, g, a, { inx: "mynews", flag: "true" });
      });
    },
    a = function (req, c, g, a) {
      y(
        req,
        function (g) {
          "function" == typeof c && c(g);
        },
        function (c, a) {
          "function" == typeof g && g(c, a);
        },
        function (c, g) {
          "function" == typeof a && a(c, g);
        }
      );
    },
    y = function (req, c, g, a) {
      require(["commonutil"], function (y) {
        var T = "/v1/cust/msgdel/" + req.userId + "/" + req.msgid;
        y.GET(T, {}, c, g, a);
      });
    },
    T = function (req, c, g, a) {
      v(
        req,
        function (g) {
          "function" == typeof c && c(g);
        },
        function (c, a) {
          "function" == typeof g && g(c, a);
        },
        function (c, g) {
          "function" == typeof a && a(c, g);
        }
      );
    },
    v = function (req, c, g, a) {
      require(["commonutil"], function (y) {
        var T = "/v1/cust/msgread/" + req.userId + "/" + req.msgid;
        y.GET(T, {}, c, g, a);
      });
    },
    b = function (req, c, g, a) {
      require(["commonutil"], function (y) {
        var T = "/v1/cust/message/" + req.user_id + "/noread",
          v = {};
        y.GET(T, v, c, g, a);
      });
    },
    G = function (req, c, g, a) {
      require(["commonutil"], function (y) {
        var T = "/v1/cust/message/" + req.user_id + "/readtype",
          v = { busitype: req.busiType, user_id: req.user_id };
        y.GET(T, v, c, g, a);
      });
    },
    N = function (req, c, g, a) {
      require(["commonutil"], function (y) {
        var T = "/v1/cust/getMsgUnreadNum/" + req.user_id,
          v = { userAccount: req.userAccount, bigType: req.bigType };
        y.POST(T, v, c, g, a);
      });
    },
    _ = function (req, c, g, a) {
      require(["commonutil"], function (y) {
        var T = "/v1/cust/getGroupMsgList/" + req.user_id,
          v = "30",
          b = {
            userAccount: req.userAccount,
            offset: req.pageindex,
            size: req.pagesize,
            bigType: req.bigType,
            msgType: req.msgType,
            jumpType: v,
          };
        y.POST(T, b, c, g, a);
      });
    };
  return {
    getTotalNewsInfo: function (req, g, a, y) {
      c(req, g, a, y);
    },
    deleteNews: function (req, c, g, y) {
      a(req, c, g, y);
    },
    readMsgInfo: function (req, c, g, a) {
      T(req, c, g, a);
    },
    unReadNewsNumber: function (req, c, g, a) {
      b(req, c, g, a);
    },
    readAllNew: function (req, c, g, a) {
      G(req, c, g, a);
    },
    getMsgUnreadNum: function (req, c, g, a) {
      N(req, c, g, a);
    },
    getGroupMsgList: function (req, c, g, a) {
      _(req, c, g, a);
    },
  };
});
