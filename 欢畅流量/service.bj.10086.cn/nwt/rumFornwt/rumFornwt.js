(function () {
  function loadScriptAsync(url) {
    // 创建一个新的script标签
    var script = document.createElement("script");
    //配置script标签类型
    script.type = "text/javascript";
    //设置此标签异步执行
    script.async = true;
    //设置此标签地址指向采集脚本
    script.src = url;
    // 将script标签添加到文档的head中
    // 如果想要异步加载并尽快执行，可以使用document.head.appendChild(script);
    document.body.appendChild(script);
  }

  window.addEventListener("load", function () {
    loadScriptAsync("https://service.bj.10086.cn/nwt/rum/");
  });
})();
