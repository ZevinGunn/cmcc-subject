define(["template", ""], function (a) {
  return a("web_view/apps/serviceapps/busideal/busi", function (a) {
    "use strict";
    var b = this,
      c = (b.$helpers, a.data),
      T = b.$each,
      i = (a.value, a.$index, a.i),
      g = (a.child, b.$escape),
      y = a.edata,
      h = a.util,
      v = a.err,
      F = a.empty,
      w = "";
    return (
      c &&
        ((w += "	\r\n	"),
        T(c, function (a) {
          (w += "\r\n	"),
            a.prodType == i &&
              ((w += "\r\n	"),
              T(a.orderBusis, function (a) {
                (w +=
                  '	\r\n		<tr class="">\r\n	        <td class="bd-4 tl pdl-10 pdr-10" style="width:245px">'),
                  (w += g(a.busiName)),
                  (w += '</td>\r\n	        <td class="bd-4">'),
                  (w += g(
                    null == a.busiFee || "" == a.busiFee ? "- -" : a.busiFee
                  )),
                  (w += '</td>\r\n	        <td class="bd-4">'),
                  (w += g(
                    null == a.orderedTime || "" == a.orderedTime
                      ? "- -"
                      : a.orderedTime.substring(0, 4) +
                          "-" +
                          a.orderedTime.substring(4, 6) +
                          "-" +
                          a.orderedTime.substring(6, 8)
                  )),
                  (w += '</td>\r\n	        <td class="bd-4">'),
                  (w += g(
                    null == a.effectTime || "" == a.effectTime
                      ? "- -"
                      : a.effectTime.substring(0, 4) +
                          "-" +
                          a.effectTime.substring(4, 6) +
                          "-" +
                          a.effectTime.substring(6, 8)
                  )),
                  (w += '</td>\r\n	        <td class="bd-4">'),
                  (w += g(
                    "长期有效" == a.extinctTime
                      ? "长期有效"
                      : null == a.extinctTime || "" == a.extinctTime
                      ? "- -"
                      : a.extinctTime.substring(0, 4) +
                        "-" +
                        a.extinctTime.substring(4, 6) +
                        "-" +
                        a.extinctTime.substring(6, 8)
                  )),
                  (w += '</td>\r\n			<td class="bd-4">'),
                  (w += g(
                    "01" != a.isOrdered ||
                      !a.unsubscribeTime ||
                      (null == a.unsubscribeTime && "" == a.unsubscribeTime)
                      ? "- -"
                      : a.unsubscribeTime.substring(0, 4) +
                          "-" +
                          a.unsubscribeTime.substring(4, 6) +
                          "-" +
                          a.unsubscribeTime.substring(6, 8)
                  )),
                  (w += '</td>\r\n	        <td class="bd-4">'),
                  "02" == a.isOrdered &&
                    "01" == a.isUnOrder &&
                    ((w += '<a class="color-2 cancel-busi"  i='),
                    (w += g(
                      a.busiType +
                        "," +
                        a.bizCode +
                        "," +
                        a.busiCode +
                        "," +
                        a.spid +
                        "," +
                        i +
                        "," +
                        a.busiName
                    )),
                    (w += ">退订</a>")),
                  "01" == a.isOrdered && (w += "已退订"),
                  (w += "</td>\r\n	    </tr>\r\n    ");
              }),
              (w += "\r\n    ")),
            (w += "\r\n    ");
        }),
        (w += "\r\n")),
      (w += "    \r\n\r\n"),
      y &&
        ((w += "	\r\n	"),
        T(y, function (a) {
          (w +=
            '	\r\n		<tr class="">\r\n	        <td class="bd-4 tl pdl-10 pdr-10" style="width:245px">'),
            (w += g(a.productName)),
            (w += '</td>\r\n	        <td class="bd-4">'),
            (w += g(
              null == a.bunessFree || "" == a.bunessFree ? "- -" : a.bunessFree
            )),
            (w += '</td>\r\n	        <td class="bd-4">'),
            (w += g(
              null == a.orderTime || "" == a.orderTime
                ? "- -"
                : a.orderTime.substring(0, 4) +
                    "-" +
                    a.orderTime.substring(4, 6) +
                    "-" +
                    a.orderTime.substring(6, 8)
            )),
            (w += '</td>\r\n	        <td class="bd-4">'),
            (w += g(
              null == a.startTime || "" == a.startTime
                ? "- -"
                : a.startTime.substring(0, 4) +
                    "-" +
                    a.startTime.substring(4, 6) +
                    "-" +
                    a.startTime.substring(6, 8)
            )),
            (w += '</td>\r\n	        <td class="bd-4">'),
            (w += g(
              "长期有效" == a.extinctTime
                ? "长期有效"
                : null == a.deadTime || "" == a.deadTime
                ? "- -"
                : a.deadTime.substring(0, 4) +
                  "-" +
                  a.deadTime.substring(4, 6) +
                  "-" +
                  a.deadTime.substring(6, 8)
            )),
            (w += '</td>\r\n	        <td class="bd-4">\r\n	        	'),
            "0" == a.unsubFlag &&
              ((w += '\r\n	        	<a ebusiInfo="'),
              (w += g(h.getJsonObj(a))),
              (w += '" class="color-2 cancel-ebusi">退订</a>\r\n	        	')),
            (w += "\r\n	        </td>\r\n	    </tr>\r\n    ");
        }),
        (w += "\r\n")),
      (w += "  \r\n\r\n"),
      v &&
        ((w +=
          "\r\n<tr>\r\n	<td colspan='6' style='text-align:center;'>\r\n		<div style='display: inline-block;'>\r\n			<img style='float:left;cursor:default;' src='/i/nresource/image/detailqry.png' />\r\n			<span style='height:70px;line-height:70px;display:block;float:left;margin-left:10px;font-size:12px;color:#dadada'>"),
        (w += g(v)),
        (w += "</span>\r\n		</div>\r\n	</td>\r\n</tr>\r\n")),
      (w += "\r\n\r\n\r\n"),
      F &&
        (w +=
          "\r\n<tr>\r\n	<td colspan='6' style='text-align:center;'>\r\n		<div style='display: inline-block;'>\r\n			<img style='float:left;cursor:default;' src='/i/nresource/image/detailqry.png' />\r\n			<span style='height:70px;line-height:70px;display:block;float:left;margin-left:10px;font-size:12px;color:#dadada'>您还没有订购任何业务哦</span>\r\n		</div>\r\n	</td>\r\n</tr>\r\n"),
      (w += "\r\n"),
      new String(w)
    );
  });
});
