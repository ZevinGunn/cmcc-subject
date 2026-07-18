!(function () {
  var c = location.hostname;
  (window.CollecterInit = function () {
    window.Collecter.init({ req_appkey: "shop_search", fpcdom: c });
  }),
    (window.DomLoadCompleted = function () {
      for (
        var c = document.getElementsByTagName("button"), w = 0;
        w < c.length;
        w++
      )
        window.Collecter.addEventListener(
          c[w],
          "click",
          window.Collecter.clickAListener
        );
      for (
        var a = document.getElementsByTagName("form"), w = 0;
        w < a.length;
        w++
      )
        window.Collecter.addEventListener(
          a[w],
          "submit",
          window.Collecter.submitFormListener
        );
      $(document).on("click", "a", window.Collecter.clickAListener);
      var C = window.onbeforeunload;
      (window.onbeforeunload = function () {
        window.Collecter.closeListener(), C();
      }),
        navigator.userAgent.indexOf("Mac") > -1 &&
          window.addEventListener("pagehide", function () {
            window.Collecter.closeListener();
          });
    });
})();
