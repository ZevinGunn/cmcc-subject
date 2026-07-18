define(["template", ""], function (a) {
  return a("easyentry", function (a) {
    "use strict";
    var c = this,
      y = (c.$helpers, c.$each),
      v = a.data,
      h = (a.$value, a.$index, c.$escape),
      g = "";
    return (
      (g +=
        '<div>\r\n	<div class="stc-easy-entry-item stc-common-inline stc-easy-entry-itemsty-shoppingcar" hit="false">\r\n			<div class="stc-easy-entry-item-ico stc-easy-entry-item-shoppingcar" flag="inner" ahref="javascript:void(0);" >\r\n			<strong id="sideShoppingcarCount" class="shoppingcar-count"></strong>\r\n			</div>\r\n            <div class="shopping-trolley-list side-shopping-list" id="sideShoppingTrolley">\r\n            	<div class="side-shoplist-box">\r\n					<img style=\'margin: 5px auto;;width: 40px;height: 40px;\' src=\'/i/nresource/image/loading.gif\'>	\r\n            	</div>\r\n				<div class="blank-block"></div>\r\n            </div>\r\n	</div>\r\n	'),
      y(v, function (a) {
        (g +=
          '\r\n		<div class="stc-easy-entry-item stc-common-inline" hit="false">\r\n			<div class="stc-easy-entry-item-ico stc-easy-entry-itemsty-'),
          (g += h(a.imgInx)),
          (g += ' stc-easy-entry-other" flag="'),
          (g += h(a.type)),
          (g += '" ahref="javascript:scroll(0,0)" '),
          14 == a.imgInx && (g += 'id="order-online"'),
          (g += " ></div>\r\n		</div>\r\n	");
      }),
      (g +=
        '\r\n	<div class="stc-easy-entry-item stc-common-inline" hit="false">\r\n			<div class="stc-easy-entry-item-ico stc-easy-entry-itemsty-12 stc-easy-entry-other" flag="inner" ahref="javascript:scroll(0,0)" ></div>\r\n	</div>\r\n	<div class="stc-common-inline" hit="false">\r\n			<div class="stc-easy-entry-item-ico stc-easy-entry-itemsty-love stc-easy-entry-other" flag="inner" ahref="rechargelove" ></div>\r\n	</div>\r\n</div>'),
      new String(g)
    );
  });
});
