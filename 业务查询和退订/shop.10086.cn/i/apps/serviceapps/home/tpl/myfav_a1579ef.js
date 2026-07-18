define(["template", ""], function (a) {
  return a("myfav", function (a) {
    "use strict";
    var c = this,
      g = (c.$helpers, a.data),
      h = c.$escape,
      v = c.$each,
      _ = (a.$value, a.$index, a.lovedata),
      y = a.packdata,
      M = a.util,
      w = "";
    return (
      g
        ? ((w +=
            '\r\n	<div class="ued-gbox bdr-1 pdr-20">\r\n	    <h3 id="stc_myfav_btn" class="ued-tit">我的收藏</h3>                        \r\n	    <!--ued-viwe star-->\r\n	    <div class="ued-viwe js_viwe h-200" style="text-align: center;height:200px;">\r\n	    '),
          g &&
            ((w += "    \r\n	        "),
            0 == g.length &&
              ((w +=
                '\r\n	        <div style="height:100px; text-align:center; padding:40px;"><div style="zoom: 1;display: inline-block;*display:inline;vertical-align: top;"><img src="/i/nresource/image/myfav.png" /></div><div style="zoom: 1; display: inline-block; vertical-align: top;*display:inline; color: rgb(204, 204, 204); margin:9px 0 0 10px; text-align:left;"><div style="font-size: 12px;font-family: Microsoft YaHei;height: 30px;line-height: 30px;color:#dadada">您还未收藏任何商品呦</div><div style="font-size: 12px;line-height: 25px;">赶快去<a class="store color-2" target=\'_blank\' href='),
              (w += h(g.stcDic.getShopLink())),
              (w +=
                ' style="margin:0 5px;cursor:pointer; line-height:25px;text-decoration:none;">商城首页&gt;</a>看看吧</div></div></div>\r\n	        ')),
            (w += "\r\n	        "),
            g.length > 0 &&
              ((w +=
                '\r\n	        <ul class="ued-viwe-big" id="fav_ul">\r\n	        '),
              v(g, function (a, c) {
                (w += "\r\n	        	"),
                  c % 3 == 0
                    ? ((w += "\r\n	            <li>\r\n	            	"),
                      54 == a.status
                        ? ((w +=
                            '\r\n	                <a class="tc fl disabled" href="javascript:;">\r\n	                    <img src data-src='),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                    <p class="offstore">已失效</p>\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                "))
                        : ((w +=
                            '\r\n	                <a class="tc fl" target="_blank" href='),
                          (w += h(a.snapUrl)),
                          (w += ">\r\n	                    <img src data-src="),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                    '),
                          52 == a.status &&
                            (w +=
                              '\r\n	                    <p class="offstore">已下架</p>\r\n	                    '),
                          (w += '\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                ")),
                      (w += "\r\n	            "))
                    : c % 3 == 2
                    ? ((w += "\r\n	                "),
                      54 == a.status
                        ? ((w +=
                            '\r\n	                <a class="tc fl disabled" href="javascript:;">\r\n	                    <img src data-src='),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                     <p class="offstore">已失效</p>\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                "))
                        : ((w +=
                            '\r\n	                <a class="tc fl" target="_blank" href='),
                          (w += h(a.snapUrl)),
                          (w += ">\r\n	                    <img src data-src="),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                    '),
                          52 == a.status &&
                            (w +=
                              '\r\n	                    <p class="offstore">已下架</p>\r\n	                    '),
                          (w += '\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                ")),
                      (w += "\r\n	            </li>\r\n	            "))
                    : c == g.length - 1 && c % 3 != 2
                    ? ((w += "\r\n	                 "),
                      54 == a.status
                        ? ((w +=
                            '\r\n	                <a class="tc fl disabled" href="javascript:;">\r\n	                    <img src data-src='),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                     <p class="offstore">已失效</p>\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                "))
                        : ((w +=
                            '\r\n	                <a class="tc fl" target="_blank" href='),
                          (w += h(a.snapUrl)),
                          (w += ">\r\n	                    <img src data-src="),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                    '),
                          52 == a.status &&
                            (w +=
                              '\r\n	                    <p class="offstore">已下架</p>\r\n	                    '),
                          (w += '\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                ")),
                      (w += "\r\n	           </li>\r\n	            "))
                    : ((w += "\r\n	                 "),
                      54 == a.status
                        ? ((w +=
                            '\r\n	                <a class="tc fl disabled" href="javascript:;">\r\n	                    <img src data-src='),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                     <p class="offstore">已失效</p>\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                "))
                        : ((w +=
                            '\r\n	                <a class="tc fl" target="_blank" href='),
                          (w += h(a.snapUrl)),
                          (w += ">\r\n	                    <img src data-src="),
                          (w += h(a.imgUrl)),
                          (w +=
                            ' style="width:91px;height:91px;"/>\r\n	                    '),
                          52 == a.status &&
                            (w +=
                              '\r\n	                    <p class="offstore">已下架</p>\r\n	                    '),
                          (w += '\r\n	                    <p class="mgt-20">'),
                          (w += h(a.prodName)),
                          (w +=
                            '</p>\r\n	                    <p class="mgt-5 color-1">￥'),
                          (w += h(a.prodPrice)),
                          (w +=
                            "</p>\r\n	                </a>\r\n	                ")),
                      (w += "                              \r\n	            ")),
                  (w += "\r\n				");
              }),
              (w += "\r\n	        </ul>\r\n	        "),
              g.length > 3 &&
                (w +=
                  '\r\n	        <ul class="tab_pic_num" id="fav-pro">\r\n	            <li class="arrowl"></li>\r\n	            <li class="arrowr"></li>\r\n	        </ul>\r\n	        '),
              (w += "\r\n	    ")),
            (w += "\r\n	")),
          (w += "    \r\n	     </div>\r\n	    <!--ued-viwe end-->\r\n	</div>\r\n"))
        : _
        ? ((w +=
            '\r\n	<div class="ued-gbox pdl-20">\r\n	    <h3 class="ued-tit">猜你喜欢</h3>\r\n	    <!--ued-viwe star-->\r\n	    <div class="ued-viwe js_viwe"  style="text-align: center;height:200px;">\r\n	        '),
          _ &&
            ((w += "    \r\n		        "),
            0 == _.length &&
              ((w +=
                '\r\n		        <div style="height:100px; text-align:center; padding:40px;"><div style="zoom: 1;display: inline-block;*display:inline;vertical-align: top;"><img src="/i/nresource/image/myfav.png" /></div><div style="zoom: 1; display: inline-block; vertical-align: top;*display:inline; color: rgb(204, 204, 204); margin:9px 0 0 10px; text-align:left;"><div style="font-size: 16px;font-family: Microsoft YaHei;height: 30px;line-height: 30px;">没有查询出来任何商品呦</div><div style="font-size: 12px;line-height: 25px;">赶快去<a class="store color-2" target=\'_blank\' href='),
              (w += h(_.stcDic.getShopLink())),
              (w +=
                ' style="margin:0px 10px; cursor:pointer;line-height:25px;">商城首页&gt;</a>看看吧</div></div></div>\r\n		        ')),
            (w += "\r\n		        "),
            _.length > 0 &&
              ((w +=
                '\r\n		        <ul class="guess-love" id="guess_ul">\r\n		        	'),
              v(_, function (a, c) {
                (w += "\r\n			        	"),
                  c % 3 == 0
                    ? ((w += "\r\n			            <li>\r\n			                <a id="),
                      (w += h(
                        "W15_rec_" +
                          (c + 1) +
                          "_" +
                          a.item_id +
                          "_" +
                          a.trace_id
                      )),
                      (w += ' class="tc fl" target="_blank" '),
                      1 == a.isElearn
                        ? (a.skuid &&
                            ((w += " skuid="), (w += h(a.skuid)), (w += " ")),
                          (w += " skuInx="),
                          (w += h(c + 1)),
                          (w += " "))
                        : ((w += " goodsid = "),
                          (w += h(a.data_id)),
                          (w += " ")),
                      (w += " href="),
                      (w += h(a.url)),
                      (w += " _index = "),
                      (w += h(c)),
                      (w += ">\r\n			                    <img src data-src="),
                      (w += h(a.picture_url)),
                      (w +=
                        ' style="width:91px;height:91px;" />\r\n			                    <p class="">'),
                      (w += h(a.title)),
                      (w +=
                        '</p>\r\n			                    <p class="mgt-5 color-1 bd">￥'),
                      (w += h(a.min_price)),
                      (w += "</p>\r\n			                </a>\r\n			            "))
                    : c % 3 == 2
                    ? ((w += "\r\n			                <a id="),
                      (w += h(
                        "W15_rec_" +
                          (c + 1) +
                          "_" +
                          a.item_id +
                          "_" +
                          a.trace_id
                      )),
                      (w += ' class="tc fl" target="_blank" '),
                      1 == a.isElearn
                        ? (a.skuid &&
                            ((w += " skuid="), (w += h(a.skuid)), (w += " ")),
                          (w += " skuInx="),
                          (w += h(c + 1)),
                          (w += " "))
                        : ((w += " goodsid = "),
                          (w += h(a.data_id)),
                          (w += " ")),
                      (w += " href="),
                      (w += h(a.url)),
                      (w += " _index = "),
                      (w += h(c)),
                      (w += ">\r\n			                    <img src data-src="),
                      (w += h(a.picture_url)),
                      (w +=
                        ' style="width:91px;height:91px;" />\r\n			                    <p class="">'),
                      (w += h(a.title)),
                      (w +=
                        '</p>\r\n			                    <p class="mgt-5 color-1 bd">￥'),
                      (w += h(a.min_price)),
                      (w +=
                        "</p>\r\n			                </a> \r\n			            </li>\r\n			            "))
                    : c == _.length - 1 && c % 3 != 2
                    ? ((w += "\r\n			                 <a id="),
                      (w += h(
                        "W15_rec_" +
                          (c + 1) +
                          "_" +
                          a.item_id +
                          "_" +
                          a.trace_id
                      )),
                      (w += ' class="tc fl" target="_blank" '),
                      1 == a.isElearn
                        ? (a.skuid &&
                            ((w += " skuid="), (w += h(a.skuid)), (w += " ")),
                          (w += " skuInx="),
                          (w += h(c + 1)),
                          (w += " "))
                        : ((w += " goodsid = "),
                          (w += h(a.data_id)),
                          (w += " ")),
                      (w += " href="),
                      (w += h(a.url)),
                      (w += " _index = "),
                      (w += h(c)),
                      (w += ">\r\n			                    <img src data-src="),
                      (w += h(a.picture_url)),
                      (w +=
                        ' style="width:91px;height:91px;"/>\r\n			                    <p class="">'),
                      (w += h(a.title)),
                      (w +=
                        '</p>\r\n			                    <p class="mgt-5 color-1 bd">￥'),
                      (w += h(a.min_price)),
                      (w +=
                        "</p>\r\n			                </a>  \r\n			           </li>\r\n			            "))
                    : ((w += "\r\n			                 <a id="),
                      (w += h(
                        "W15_rec_" +
                          (c + 1) +
                          "_" +
                          a.item_id +
                          "_" +
                          a.trace_id
                      )),
                      (w += ' class="tc fl" target="_blank" '),
                      1 == a.isElearn
                        ? (a.skuid &&
                            ((w += " skuid="), (w += h(a.skuid)), (w += " ")),
                          (w += " skuInx="),
                          (w += h(c + 1)),
                          (w += " "))
                        : ((w += " goodsid = "),
                          (w += h(a.data_id)),
                          (w += " ")),
                      (w += " href="),
                      (w += h(a.url)),
                      (w += " _index = "),
                      (w += h(c)),
                      (w += ">\r\n			                    <img src data-src="),
                      (w += h(a.picture_url)),
                      (w +=
                        ' style="width:91px;height:91px;" />\r\n			                    <p class="">'),
                      (w += h(a.title)),
                      (w +=
                        '</p>\r\n			                    <p class="mgt-5 color-1 bd">￥'),
                      (w += h(a.min_price)),
                      (w +=
                        "</p>\r\n			                </a>                                \r\n			            ")),
                  (w += "\r\n					");
              }),
              (w += "\r\n		        </ul>\r\n	        		"),
              _.length > 3 &&
                (w +=
                  '\r\n			        <ul class="tab_pic_num" id="love-pro">\r\n			            <li class="arrowl"></li>\r\n	           			<li class="arrowr"></li>\r\n			        </ul>\r\n			        '),
              (w += "\r\n		    	")),
            (w += "\r\n			")),
          (w += "  \r\n	     </div>\r\n	    <!--ued-viwe end-->\r\n	</div>\r\n"))
        : y &&
          ((w +=
            '	\r\n	<h3 class="ued-tit" id="stc_packramin_btn">套餐余量</h3>\r\n	<h3 class="ued-none-remain" id="show_msg"></h3>\r\n	 '),
          y &&
            ((w += "\r\n	 	"),
            v(y, function (a, c) {
              (w += '\r\n	        	<div class="clearfix over-h mgl-50 '),
                0 == c && (w += "mgt-5"),
                (w += " pdt-30 "),
                c == y.length - 1 && (w += "pdb-20"),
                (w += '">\r\n                <span class="icon-meal '),
                (w += h(a.icon)),
                (w +=
                  ' fl mgr-10"></span>\r\n                <span class="w120 fl" style="height:20px;line-height:20px">'),
                (w += h(a.name)),
                (w +=
                  "</span>\r\n                <!--Modify by tianhq@20160926-->\r\n                "),
                "03" == a.realUnit || "04" == a.realUnit || "05" == a.realUnit
                  ? ((w += "\r\n                    "),
                    "1" == a.unLimitTypeinfo
                      ? ((w += "\r\n                        "),
                        a.balMealKB >= 0 && a.balMealKB < 1024
                          ? ((w +=
                              '\r\n                            <span class="fl w120 mgt5" style="width:160px !important">剩余<span class="color-1 fs-14">'),
                            (w += h(a.balMealKB.toFixed(0))),
                            (w +=
                              "</span>KB</span>\r\n                        "))
                          : ((w +=
                              '\r\n                            <span class="fl w120 mgt5 fs-14" style="width:160px !important">剩余'),
                            a.balMealGB > 0
                              ? ((w += '<span class="color-1 fs-14">'),
                                (w += h(
                                  0 == a.balMealMB
                                    ? a.balMealGB
                                    : (
                                        a.balMealGB +
                                        a.balMealMB / 1024
                                      ).toFixed(2)
                                )),
                                (w += "</span>GB"))
                              : a.balMealMB > 0 &&
                                ((w += '<span class="color-1 fs-14">'),
                                (w += h(a.balMealMB)),
                                (w += "</span>MB")),
                            (w += "</span>\r\n                        ")),
                        (w += "\r\n                    "))
                      : ((w += "\r\n                         "),
                        a.useMealKB >= 0 && a.useMealKB < 1024
                          ? ((w +=
                              '\r\n                            <span class="fl w120 mgt5" style="width:160px !important">已用<span class="color-1 fs-14">'),
                            (w += h(a.useMealKB.toFixed(0))),
                            (w +=
                              "</span>KB</span>\r\n                        "))
                          : ((w +=
                              '\r\n                            <span class="fl w120 mgt5 fs-14" style="width:160px !important">已用'),
                            a.useMealGB > 0
                              ? ((w += '<span class="color-1 fs-14">'),
                                (w += h(
                                  0 == a.useMealMB
                                    ? a.useMealGB
                                    : (
                                        a.useMealGB +
                                        a.useMealMB / 1024
                                      ).toFixed(2)
                                )),
                                (w += "</span>GB"))
                              : a.useMealMB > 0 &&
                                ((w += '<span class="color-1 fs-14">'),
                                (w += h(a.useMealMB)),
                                (w += "</span>MB")),
                            (w += "</span>\r\n                        ")),
                        (w += "\r\n                    ")),
                    (w += "\r\n                "))
                  : ((w +=
                      '\r\n                    <span class="fl w120 mgt5" style="width:160px !important">剩余<span class="color-1 fs-14">'),
                    (w += h(a.balMeal)),
                    (w += "</span>"),
                    (w += h(M.getPackUnits(a.realUnit))),
                    (w += "</span>\r\n                ")),
                (w += "\r\n\r\n                "),
                ("03" != a.realUnit &&
                  "04" != a.realUnit &&
                  "05" != a.realUnit) ||
                "2" != a.unLimitTypeinfo
                  ? ((w += "\r\n                    "),
                    0 != a.totalMeal
                      ? ((w +=
                          '\r\n                        <div class="count-line fl mgt-5 mgr-20"><div class="'),
                        (w += h(a.colors)),
                        (w += ' rel" style="width:'),
                        (w += h(a.percent)),
                        (w += '%"><span>'),
                        (w += h(a.percent)),
                        (w += "%</span></div></div>\r\n                    "))
                      : ((w +=
                          '\r\n                        <div class="count-line fl mgt-5 mgr-20"><div class="'),
                        (w += h(a.colors)),
                        (w +=
                          ' rel" style="width:100%"><span>100%</span></div></div>\r\n                    ')),
                    (w += "\r\n                "))
                  : ((w +=
                      '\r\n                    <div class="count-line fl mgt-5 mgr-20"><div class="'),
                    (w += h(a.colors)),
                    (w +=
                      ' rel" style="width:100%"><span></span></div></div>\r\n                ')),
                (w += "\r\n\r\n                \r\n                "),
                "03" == a.realUnit || "04" == a.realUnit || "05" == a.realUnit
                  ? ((w += "\r\n                    "),
                    "1" == a.unLimitTypeinfo &&
                      ((w += "\r\n                        "),
                      a.totalMealKB >= 0 && a.totalMealKB < 1024
                        ? ((w +=
                            '\r\n                        <span class="w80 fl mgr-10" style="width:145px !important;height:20px;line-height:20px;margin-top:-2px;">共<span class="fs-14">'),
                          (w += h(a.totalMealKB.toFixed(0))),
                          (w += "</span>KB</span>\r\n                        "))
                        : ((w +=
                            '\r\n                        <span class="w80 fl mgr-10 fs-14" style="width:145px !important;height:20px;line-height:20px;margin-top:-2px;">共'),
                          a.totalMealGB > 0
                            ? ((w += '<span class="fs-14">'),
                              (w += h(
                                0 == a.totalMealMB
                                  ? a.totalMealGB
                                  : (
                                      a.totalMealGB +
                                      a.totalMealMB / 1024
                                    ).toFixed(2)
                              )),
                              (w += "</span>GB"))
                            : a.totalMealMB > 0 &&
                              ((w += '<span class="fs-14">'),
                              (w += h(a.totalMealMB)),
                              (w += "</span>MB")),
                          (w += "</span>\r\n                        ")),
                      (w += "\r\n                    ")),
                    (w += "\r\n                "))
                  : ((w +=
                      '\r\n                    <span class="w80 fl mgr-10" style="width:145px !important;height:20px;line-height:20px;margin-top:-2px;">共<span class="fs-14">'),
                    (w += h(a.totalMeal)),
                    (w += "</span>"),
                    (w += h(M.getPackUnits(a.realUnit))),
                    (w += "</span>\r\n                ")),
                (w +=
                  '\r\n                \r\n                <!-- <span class="fl">剩余日均<span class="color-1">20</span>分钟/天</span> -->\r\n            </div>\r\n	    ');
            }),
            (w += "\r\n	")),
          (w += "\r\n")),
      (w += "\r\n\r\n                        "),
      new String(w)
    );
  });
});
