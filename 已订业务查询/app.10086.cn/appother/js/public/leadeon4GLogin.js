(function () {
  /**
   * 如果要使用4G免登需要H5页面加入标签：<meta content="always" name="referrer">
   */
  var leadeon4GLogin = {
    host: "https://app.10086.cn/",
    flowhost: "https://flow.clientaccess.10086.cn/",
    /**
     *  4G免登录图片资源请求（第三方使用）
     *  @param {Object} succee 图片加载成功成功后执行succee方法(succee方法中判断gateWayToken存在说明4G免登成功,不存在说明免登失败),非必传
     *  @param {Object} error 图片加载失败后执行error方法,非必传
     */
    gateWayOpenLogin: function (succee, error) {
      var bigImg = document.createElement("img");
      var myDate = new Date();
      // alert(myDate.getTime());
      //为了解决某些浏览器会缓存当前的get请求，后面追加了随机数
      bigImg.src =
        "http://app.10086.cn/biz-sso/autoLogin/gateWayOpenLogin?date=" +
        myDate.getTime();
      document.body.appendChild(bigImg);
      //监听图片加载成功事件
      bigImg.onload = function () {
        //加载成功以后会给浏览器写入cookie设置AES加密写gateWayToken
        //移除图片
        document.body.removeChild(bigImg);
        if (!!succee) {
          succee();
        }
      };
      //监听图片加载失败事件
      bigImg.onerror = function () {
        //移除图片
        document.body.removeChild(bigImg);
        if (!!error) {
          error();
        }
        // console.log("图片加载失败！");
      };
    },
    /**
     * 4G免登+用户可选登录方法（手厅内部项目使用）
     *  @param {Object} init 4G登陆成功之后页面的初始化逻辑 必传参数
     *  @param {String} url  走sso登陆或sso校验的回调页面地址  必传参数
     *  @param {String} networkEnvironment  当前网络的环境，灰度(用gray字段)还是正式(不是gray的字符串)  调用会话校验的时候需要判断当前环境 必传参数
     *  @param {Object} fourGfail 4g登陆失败的逻辑 非必传
     *  @param {Object} internetLogin 互联网用户登陆成功之后的逻辑 非必传
     *  @param {Object} requestError 图片加载ajax请求失败的处理逻辑 非必传
     *  @param {Object} converRequestError 检验会话ajax请求失败的处理逻辑 非必传
     */
    gateWayLogin: function (
      init,
      url,
      networkEnvironment,
      fourGfail,
      internetLogin,
      requestError,
      converRequestError
    ) {
      var _this = this;
      var normal = function () {};
      var fourGfail1 = !!fourGfail ? fourGfail : normal; // 4g登陆失败参数做异常处理
      var internetLogin1 = !!internetLogin ? internetLogin : normal; // 互联网用户登陆成功参数做异常处理
      var requestError1 = !!requestError ? requestError : normal; // 图片加载ajax请求失败的参数做异常处理
      var converRequestError1 = !!converRequestError
        ? converRequestError
        : normal; // 检验会话ajax请求失败的参数做异常处理
      // 进入页面判断cookie中是否有这些参数
      //telNum为手机号
      //JSESSIONID为用户的会话信息
      if (
        !!_this.getCookie("telNum") &&
        !!_this.getCookie("JSESSIONID") &&
        (_this.getCookie("LC") == "" ||
          _this.getCookie("LC") == null ||
          _this.getCookie("LC") == "null" ||
          _this.getCookie("c") == _this.getCookie("LC"))
      ) {
        _this.checkoutConversation(
          init,
          networkEnvironment,
          converRequestError1
        );
      } else if (
        !!_this.getCookie("clientid") &&
        _this.getCookie("clientid") == 1
      ) {
        //互联网账户处理逻辑
        internetLogin1();
      } else if (
        !!_this.getCookie("is_login") &&
        _this.getCookie("is_login") == "true"
      ) {
        //sso
        _this.ssoInspect(url);
      } else {
        //4G免登逻辑
        _this.fourGlogin(
          init,
          url,
          networkEnvironment,
          fourGfail1,
          internetLogin1,
          requestError1
        );
      }
    },
    /**
     *  4G免登录逻辑
     *  @param {Object} init 4G登陆成功之后页面的初始化逻辑 必传参数
     *  @param {String} url  走sso登陆或sso校验的回调页面地址  必传参数
     *  @param {String} networkEnvironment  当前网络的环境，灰度(用gray字段)还是正式(不是gray的字符串)  调用会话校验的时候需要判断当前环境 必传参数
     *  @param {Object} fourGfail 4g登陆失败的逻辑 非必传
     *  @param {Object} internetLogin 互联网用户登陆成功之后的逻辑 非必传
     *  @param {Object} requestError 图片加载ajax请求失败的处理逻辑 非必传
     */
    fourGlogin: function (
      init,
      url,
      networkEnvironment,
      fourGfail,
      internetLogin,
      requestError
    ) {
      var _this = this;
      var myDate = new Date();
      var ua = navigator.userAgent;
      var normal = function () {};
      var fourGfail1 = !!fourGfail ? fourGfail : normal; // 4g登陆失败参数做异常处理
      var internetLogin1 = !!internetLogin ? internetLogin : normal; // 互联网用户登陆成功参数做异常处理
      var requestError1 = !!requestError ? requestError : normal; // 检验会话和图片加载ajax请求失败的参数做异常处理
      if (
        !!_this.getCookie("is4GLogin") &&
        _this.getCookie("is4GLogin") == "false"
      ) {
        fourGfail1();
      } else if (
        !_this.getCookie("is4GLogin") ||
        (!!_this.getCookie("is4GLogin") &&
          _this.getCookie("is4GLogin") == "true")
      ) {
        var connectionType =
          "bluetooth,ethernet,none,mixed,other,unknown,wifi,wimax"; //网络类型
        if (
          /windows | leadeon | wifi/gi.test(ua.toLowerCase()) ||
          (!!navigator.connection &&
            !!navigator.connection.type &&
            connectionType.indexOf(navigator.connection.type) > -1)
        ) {
          fourGfail1();
        } else {
          _this.clearCookie(
            ["c", "is_login"],
            [
              "app.10086.cn",
              ".10086.cn",
              "flow.clientaccess.10086.cn",
              "testh.app.coc.10086.cn",
              "h.app.coc.10086.cn",
            ]
          );
          var bigImg = document.createElement("img");
          //为了解决某些浏览器会缓存当前的get请求，后面追加了随机数
          bigImg.src =
            networkEnvironment.indexOf("gray") > -1
              ? "http://app.10086.cn/biz-sso-gray/autoLogin/gateWayLogin?date=" +
                myDate.getTime()
              : "http://app.10086.cn/biz-sso/autoLogin/gateWayLogin?date=" +
                myDate.getTime();
          document.body.appendChild(bigImg);
          //监听图片加载成功事件
          bigImg.onload = function () {
            //加载成功以后会给浏览器写入cookie：JSESSIONID、UID、telNum、is4GLogin
            //telNum为手机号
            //is4GLogin的值(字符串类型)为true免登成功，false免登失败
            //移除图片
            document.body.removeChild(bigImg);
            _this.gateWayLogin(
              init,
              url,
              networkEnvironment,
              fourGfail1,
              internetLogin1,
              requestError1
            );
          };
          //监听图片加载失败事件
          bigImg.onerror = function () {
            //移除图片
            document.body.removeChild(bigImg);
            requestError1();
            // console.log("图片加载失败！");
          };
        }
      }
    },
    /**
     * 原生js发送ajax会话校验请求
     *  @param {Object} init 4G登陆成功之后页面的初始化逻辑 必传参数
     *  @param {String} networkEnvironment  当前网络的环境，灰度(用gray字段)还是正式(不是gray的字符串)  调用会话校验的时候需要判断当前环境 必传参数
     *  @param {Object} converRequestError 检验会话jax请求失败的处理逻辑 非必传
     */
    checkoutConversation: function (
      init,
      networkEnvironment,
      converRequestError
    ) {
      var _this = this;
      var requestUrl = "";
      if (window.location.href.indexOf("flow.clientaccess") >= 0) {
        requestUrl =
          networkEnvironment.indexOf("gray") > -1
            ? _this.flowhost + "biz-sso-gray/autoLogin/gateWayLoginSessionCheck"
            : _this.flowhost + "biz-sso/autoLogin/gateWayLoginSessionCheck";
      } else {
        requestUrl =
          networkEnvironment.indexOf("gray") > -1
            ? _this.host + "biz-sso-gray/autoLogin/gateWayLoginSessionCheck"
            : _this.host + "biz-sso/autoLogin/gateWayLoginSessionCheck";
      }
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", requestUrl, true);
      // 添加http头，发送信息至服务器时内容编码类型
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            var data = JSON.parse(xhr.response);
            if (!!data && data.retCode == "000000") {
              init();
            } else if (/^4\d{5}$/.test(data.retCode)) {
              _this.clearCookie(
                ["c", "is_login"],
                [
                  "app.10086.cn",
                  ".10086.cn",
                  "flow.clientaccess.10086.cn",
                  "testh.app.coc.10086.cn",
                  "h.app.coc.10086.cn",
                ]
              );
              window.location.reload();
            } else {
              console.log("检验会话接口有返回值但非4开头的编码");
            }
          } else {
            converRequestError();
          }
        }
      };
    },
    /**
     * sso校验check
     */
    ssoInspect: function (urls) {
      var timestamp = new Date().getTime(); //时间戳
      var channelID = "";
      if (window.location.href.indexOf("flow.clientaccess") >= 0) {
        channelID = 12016;
      } else {
        channelID = 12006;
      }
      window.location.href =
        "https://login.10086.cn/SSOCheck.action?channelID=" +
        channelID +
        "&backUrl=" +
        encodeURIComponent(urls) +
        "&timestamp=" +
        timestamp;
    },
    /**
     * sso登陆
     */
    ssoLogin: function (urls) {
      var timestamp = new Date().getTime();
      var channelID = "";
      if (window.location.href.indexOf("flow.clientaccess") >= 0) {
        channelID = 12016;
      } else {
        channelID = 12006;
      }
      window.location.href =
        "https://login.10086.cn/html/login/touch.html?channelID=" +
        channelID +
        "&backUrl=" +
        encodeURIComponent(urls) +
        "&timestamp=" +
        timestamp;
    },
    /**
     * 原生toast信息提示
     * @param {Object} msg 提示信息
     * @param {Object} time 设置显示时长  单位为毫秒
     */
    toastPlug(msg, time) {
      var toast = document.querySelector(".toast");
      if (
        toast == null ||
        "undefined" ==
          typeof document.querySelector(".toast").getAttribute("id") ||
        undefined == document.querySelector(".toast").getAttribute("id")
      ) {
        //提示框不存在
        var row =
          "<div class='toast' id='toast' style='width: 100%; z-index:99999; position: fixed; top:50%; text-align: center;'>";
        row +=
          "<p id='toa-text' style='color:#FFFFFF;background-color:rgba(0,0,0,0.6); display: inline-block; margin: auto; border-radius: 3px; padding: 8px 10px;'>" +
          msg +
          "</p>";
        row += "</div>";
        document.querySelector("body").innerHTML = row;
        var toast1 = document.querySelector(".toast");
        setTimeout(function () {
          toast1.parentNode.removeChild(toast1);
        }, time);
      } else {
        document.querySelector("#toa-text").innerHTML = msg;
        setTimeout(function () {
          toast.parentNode.removeChild(toast);
        }, time);
      }
    },
    /**
     * 原生js获取cookie的值
     * @param {String} key cookie的名称
     */
    getCookie: function (key) {
      var arr1 = document.cookie.split("; "); //由于cookie是通过一个分号+空格的形式串联起来的，所以这里需要先按分号空格截断,变成[name=Jack,pwd=123456,age=22]数组类型；
      for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split("="); //通过=截断，把name=Jack截断成[name,Jack]数组；
        if (arr2[0] == key) {
          return decodeURI(arr2[1]);
        }
      }
      return "";
    },
    /**
     * 原生js清理cookie的值
     * @param {Array}  clearCookieArr  不需要要删除的cookie的数组非必传，不传清cookie中的所有值
     * @param {Array}  clearCookiePath 要删除的cookie的域名,数组里面传字符串。必传
     */
    clearCookie: function (clearCookieArr, clearCookiePath) {
      var arr1 = document.cookie.split("; "); //由于cookie是通过一个分号+空格的形式串联起来的，所以这里需要先按分号空格截断,变成[name=Jack,pwd=123456,age=22]数组类型；
      for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split("="); //通过=截断，把name=Jack截断成[name,Jack]数组；
        if (!clearCookieArr) {
          this.commonClearCookie(arr2[0], clearCookiePath);
        } else {
          if (clearCookieArr.indexOf(arr2[0]) == -1) {
            this.commonClearCookie(arr2[0], clearCookiePath);
          }
        }
      }
    },
    /**
     * 原生js清理cookie的公共体
     * @param {String}  clearCookieKey 要删除的cookie值的键名
     * @param {Array}  clearCookiePath 要删除的cookie的域名,数组里面传字符串
     */
    commonClearCookie: function (clearCookieKey, clearCookiePath) {
      var time = new Date(new Date().getTime() - 10 * 60 * 1000); // 设置失效时间
      document.cookie =
        clearCookieKey + "=;;path=/;expires=" + time.toGMTString();
      for (var j = 0; j < clearCookiePath.length; j++) {
        document.cookie =
          clearCookieKey +
          "=;domain=" +
          clearCookiePath[j] +
          ";path=/;expires=" +
          time.toGMTString();
      }
    },
  };
  window.leadeon4GLogin = leadeon4GLogin;
})();
