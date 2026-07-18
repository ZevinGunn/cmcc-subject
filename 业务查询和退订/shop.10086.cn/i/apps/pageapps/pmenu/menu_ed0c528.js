define(["template", ""], function (a) {
  return a("web_view/apps/pageapps/pmenu/menu", function (a) {
    "use strict";
    var c = this,
      h = (c.$helpers, c.$each),
      w = a.data,
      k = (a.$value, a.$index, c.$escape),
      v = (a.kid, a.index, "");
    return (
      h(w.menu, function (a, c) {
        (v += "\r\n"),
          "home" == a.inx
            ? (v += "\r\n	\r\n")
            : 1 == c
            ? ((v +=
                '\r\n<ul class="list-c1 js_list_active">\r\n    <li>\r\n        <a class="li-active"><i></i>'),
              (v += k(a.name)),
              (v +=
                '</a>\r\n        <ul class="list-c1-son" style="display:block;">\r\n        	'),
              h(a.child, function (a) {
                (v += '\r\n            	<li><a track-area="02" alis='),
                  (v += k(a.inx)),
                  (v += " code="),
                  (v += k(a.funcode)),
                  (v += " "),
                  a.attr && ((v += "hlink="), (v += k(a.attr.hlink))),
                  (v += ">"),
                  (v += k(a.name)),
                  a.isnew && (v += '<span class="new-func"></span>'),
                  (v += "</a></li>\r\n            ");
              }),
              (v += "\r\n        </ul>\r\n    </li>\r\n</ul>\r\n"))
            : ((v +=
                '\r\n<ul class="list-c1 js_list_active">\r\n    <li>\r\n        <a><i></i>'),
              (v += k(a.name)),
              (v += "\r\n     "),
              "150000" == a.funcode &&
                (v +=
                  '\r\n        <span class="news-noread-tip"></span>\r\n     '),
              (v +=
                '\r\n        </a>\r\n        <ul class="list-c1-son">\r\n        	'),
              h(a.child, function (a) {
                (v +=
                  '\r\n            	<li>\r\n                    <a track-area="02" alis='),
                  (v += k(a.inx)),
                  (v += " code="),
                  (v += k(a.funcode)),
                  (v += " "),
                  a.attr && ((v += "hlink="), (v += k(a.attr.hlink))),
                  (v += ">"),
                  (v += k(a.name)),
                  (v += "\r\n                      "),
                  a.isnew &&
                    (v +=
                      '\r\n                        <span class="new-func"></span>\r\n                       '),
                  (v += "\r\n                       "),
                  "150300" == a.funcode &&
                    (v +=
                      '\r\n                        <span class="news-noread-tip" style="top:0px"></span>\r\n                       '),
                  (v +=
                    "\r\n                    </a>\r\n            	</li>\r\n            ");
              }),
              (v += "\r\n        </ul>\r\n    </li>\r\n</ul>    \r\n")),
          (v += "\r\n");
      }),
      (v += "\r\n"),
      new String(v)
    );
  });
});
