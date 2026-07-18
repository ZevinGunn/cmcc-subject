define(["template", ""], function (c) {
  return c("noticeTop", function (c) {
    "use strict";
    var a = this,
      g = (a.$helpers, c.data),
      h = a.$each,
      v = (c.value, c.index, a.$escape),
      b = "";
    return (
      g &&
        ((b +=
          '\r\n<div class="ued-location" id="stc-content-notice"  style="height:30px ;background-image:url(\'/i/nresource/image/bg2.png\') ;">\r\n	<div class="stc-content-public">\r\n		\r\n		<div class="stc-common-inline" style="margin-top: 7px; margin-left: 10px; width: 19px; height: 19px; vertical-align: top; background: url(\'/i/nresource/image/icon-12.png\') no-repeat;">\r\n		</div>\r\n		\r\n		<div class="stc-common-inline stc-notice-list-data" style="width:600px;">\r\n			<span class="fl">&nbsp;&nbsp;&nbsp;公告:&nbsp;&nbsp;&nbsp;</span>\r\n			<div class="stc-user-notice-list fl" style="cursor:pointer;height:30px;line-height:30px;overflow: hidden;" inx="0" id="noticeTitle">\r\n			\r\n				<ul">\r\n					'),
        h(g, function (c) {
          (b +=
            "\r\n					<li style='height:30px;line-height:30px;' class=\"noticeTitle_new\">"),
            (b += v(c.title)),
            (b += "</li>\r\n					");
        }),
        (b +=
          '\r\n				</ul>\r\n			</div>\r\n			\r\n		</div>\r\n		\r\n		<div class="stc-common-inline" style="vertical-align: top; width: 500px;">\r\n			<div class="stc-common-inline stc-notice-derection" style="width: 16px; height: 16px; vertical-align: top; margin-top: 7px; margin-left: 530px; background: url(\'/i/nresource/image/t_close.png\')no-repeat;">\r\n			</div>\r\n		</div>\r\n		\r\n	</div>\r\n</div>\r\n')),
      (b += "\r\n"),
      new String(b)
    );
  });
});
