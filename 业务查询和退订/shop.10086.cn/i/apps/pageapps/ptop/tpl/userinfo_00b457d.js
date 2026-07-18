define(["template", ""], function (a) {
  return a("userinfo", function (a) {
    "use strict";
    var c = this,
      _ = (c.$helpers, a.type),
      v = a.data,
      y = c.$escape,
      h = c.$each,
      g = (a.$value, a.$index, "");
    return (
      "userinfo" == _
        ? ((g +=
            '\r\n<span class="fl stc_top_welcome" id="stc_welcome"></span>\r\n<div class="ued-select fl js_select">\r\n    <div '),
          "1" == v.data.userType &&
            null != v.data.userAccountList &&
            (g += 'class="showval"'),
          (g += '>\r\n      <span class="js_selItem selItem">\r\n            '),
          v.haveclick && "0" != v.haveclick
            ? ((g += "\r\n                "),
              (g += y(v.mobile)),
              (g += "\r\n            "))
            : ((g += "\r\n                "),
              (g += y(v.mobile2)),
              (g += "\r\n            ")),
          (g += "\r\n      </span>\r\n      "),
          "0" == v.data.userType && (g += "\r\n\r\n      "),
          (g += "\r\n      "),
          "1" == v.data.userType &&
            null != v.data.userAccountList &&
            (g += '<a href="javascript:void(0)" class="selbtn js_selbtn"></a>'),
          (g += "\r\n    </div>\r\n    "),
          "1" == v.data.userType &&
            null != v.data.userAccountList &&
            ((g +=
              '\r\n    <div class="sel-list js_selList" style="display: none;">\r\n      <ul>\r\n         <li>'),
            (g += y(v.data.loginValue)),
            (g += "</li>\r\n      	 "),
            h(v.data.userAccountList, function (a) {
              (g += "\r\n      	   "),
                a &&
                  ((g += "\r\n           <li>"),
                  (g += y(a.userAccountID)),
                  (g += "</li>\r\n           ")),
                (g += "\r\n         ");
            }),
            (g += "\r\n      </ul>\r\n    </div>\r\n    ")),
          (g +=
            '\r\n</div>\r\n<span class="fs-14" id="stc_careLang"></span>\r\n'))
        : "0" == _
        ? (g +=
            '\r\n<ul class="clearfix fm-yahei">\r\n    <li>\r\n    <div class="vm js_hover2 rel">星级：<span class="rank" id="stc_rank_info"><i class="star"></i><i class="star"></i><i class="star"></i><i class="star"></i><i class="star"></i></span><span class="fs-14 stc-level pdl-10"></span>\r\n        <div class="ued-pop js_hoverCont" style="display: none;opacity:0.8">星级得分：<span id="mylevel"></span></div>\r\n    </div>\r\n    </li>\r\n    <li class="pdl-0"><span id="stc_user_bland"></span>当前套餐：<span id="stc_cur_packages"></span></li>\r\n</ul>\r\n')
        : "1" == _ &&
          (g +=
            '\r\n<ul class="clearfix fm-yahei">\r\n    <li id="stc_reg_accown"><a class="icon-mobile" id="stc_reg_acc">绑定账号</a></li>\r\n    <li id="stc_reg_accnet">网龄：<span id = "stc_net_age"></span></li>\r\n</ul>\r\n'),
      (g += "\r\n"),
      new String(g)
    );
  });
});
