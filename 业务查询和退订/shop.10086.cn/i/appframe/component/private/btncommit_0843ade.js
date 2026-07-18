define("btncommit", function () {
  function a(a) {
    if ((a.btn && $(a.btn).attr("disabled", !0).val(a.afterText), a.waitDom)) {
      var g = $(a.waitDom).parents("table").find("th").length;
      $(a.waitDom).html(
        "<tr><td class='bd-4' colspan=" +
          g +
          " style='height:150px;text-align: center;vertical-align: middle;'><img src='/i/nresource/image/loading.gif'></td></tr>"
      );
    }
  }
  function g(a) {
    $(a.btn).removeAttr("disabled").val(a.beforeText);
  }
  function c(a) {
    var g = $("table tbody.err")
        .siblings("thead")
        .children()
        .children("th").length,
      c = a.info,
      b = c.text,
      y = c.remark1,
      k = /^[0-9]+.?[0-9]*$/;
    "" == y || k.test(y)
      ? ((y = ""), ("" == b || null == b || void 0 == b) && (b = h))
      : (b = ""),
      (img = void 0 != v[a.img] ? "/i/nresource/image/nodata/" + v[a.img] : "");
    var w = "30";
    void 0 != a.imgHeight && (w = a.imgHeight);
    var z =
        "" == img ? "" : "<img style='cursor:default;' src='" + img + "' />",
      A =
        "<tr><td colspan=" +
        g +
        " style='width:984px;'><div style='height:100px; text-align:center; padding:40px;'><div style='zoom: 1;display: inline-block;*display:inline;vertical-align: top;'>" +
        z +
        "</div><div style='zoom: 1; display: inline-block; vertical-align: top;*display:inline; color: rgb(204, 204, 204); text-align:left;margin-left: 10px;'><div style='font-size: 12px;color:#dadada;font-family: Microsoft YaHei;height: " +
        w +
        "px;line-height: " +
        w +
        "px;'>" +
        b +
        "</div><div style='font-size: 14px;line-height: 25px; color:black;'>" +
        y +
        "</div></div></div></td></tr>";
    $("table tbody.err").html(A);
  }
  var v = {},
    h = "系统开小差了，请稍候再试";
  return (
    (v.eticket = "eticket-no-data.png"),
    (v.fav = "fav-no-data.png"),
    (v.jf = "jf-no-data.png"),
    (v.msg = "msg-no-data.png"),
    (v.order = "order-no-data.png"),
    (v.recAddr = "recAddr-no-data.png"),
    (v.recharge = "recharge-no-data.png"),
    (v.ticket = "ticket-no-data.png"),
    (v.fail = "failed.png"),
    (v.myfav = "myfav.png"),
    (v.notice = "notice.png"),
    (v.ordernodata = "ordernodata.png"),
    (v.busideal = "busideal.png"),
    (v.detailqry = "detailqry.png"),
    {
      afterCommit: function (g) {
        a(g);
      },
      revertCommit: function (a) {
        g(a);
      },
      getTabErr: function (a) {
        c(a);
      },
    }
  );
});
