!(function (a) {
  function b() {
    var b = g.getBoundingClientRect().width;
    (a.rem = b / 6.4 > 100 ? 100 : b / 6.4 < 50 ? 50 : b / 6.4),
      (g.style.fontSize = a.rem + "px");
  }
  var g = a.document.documentElement,
    e;
  a.addEventListener(
    "resize",
    function () {
      clearTimeout(e), (e = setTimeout(b, 300));
    },
    !1
  ),
    a.addEventListener(
      "pageshow",
      function (a) {
        a.persisted && (clearTimeout(e), (e = setTimeout(b, 300)));
      },
      !1
    ),
    b();
})(window);

window.addEventListener("load", function () {
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 0);
});

var loginCommon = {};
var jsV = "12";
var $valRnum; //是否js 进行附加码校验 ,true 校验 ，false 不校验
var $bmcc_check = "NO"; //是否为北京移动的验证标识
var $isBmccCheck = false; //是否进行北京移动手机号校验
var $last_check_num = ""; //最后一次校验是否为北京移动用户的手机号
var $cm = 1; //当前登录Model
var $isNew;
if (
  $.cookie("c_loginMode") != null &&
  $.cookie("c_loginMode") != "" &&
  $.cookie("c_loginMode") !== "null"
) {
  $cm = parseInt($.cookie("c_loginMode"));
}
$(function () {
  var $backUrl = decodeURIComponent(getQueryString("backUrl"));
  var $channelID = decodeURIComponent(getQueryString("channelID"));
  if ($backUrl == null || $backUrl == "" || $backUrl == undefined) {
    $("#backUrl").val("http://service.bj.10086.cn");
  } else {
    $("#backUrl").val($backUrl);
  }
  if ($channelID == "" || $channelID == null || $channelID == undefined) {
    $("#channelID").val("00100");
  } else {
    $("#channelID").val($channelID);
  }

  //初始化校验是否已有账号登录
  $.ajax({
    type: "POST",
    url: "/checkBJUid.action",
    timeout: 40000,
    dataType: "json",
    success: function (data) {
      if (data.code == "0") {
        window.parent.location.href =
          "/SSOCheck.action?channelID=" +
          $("#channelID").val() +
          "&backUrl=" +
          $("#backUrl").val();
        return;
      }
    },
  });

  $(".login-select div").click(function (event) {
    $(this).removeClass("no-current").siblings().addClass("no-current");
    if ($(this).index() == 0) {
      $(".random-pass-login").show();
      $(".web-pass-login").hide();
    } else if ($(this).index() == 1) {
      $(".random-pass-login").hide();
      $(".web-pass-login").show();
      $("#rnum").val("");
      $("#rnum").attr("placeholder", "请输入附加码");
      $("#captchaValidity").val("0");
      loginCommon.rightVerify = "";
    }
  });
  $(".select").click(function (event) {
    if ($(this).attr("num") == 1) {
      $(this).attr("num", "0");
      $(this).css({
        background:
          "url(/bj/touchbj/images/select.png) 0.03rem bottom no-repeat",
        "-webkit-background-size": "auto 60%",
        "background-size": "auto 60%",
      });
    } else {
      $(this).attr("num", "1");
      $(this).css({
        background:
          "url(/bj/touchbj/images/right.png) 0.03rem bottom no-repeat",
        "-webkit-background-size": "auto 67%",
        "background-size": "auto 67%",
      });
    }
  });

  var $initName = $.cookie("c_loginName"); //获取cookie 中记录的用户名

  if ($initName != null && $initName != "null" && $initName != "") {
    if ($cm == 2) {
      $("#loginName").val($initName);
      // isValidateRnum($initName);
    } else {
      $("#mloginName").val($initName);
    }
  }

  //init login model
  initModel($cm, $initName);

  $("#viewSMSLogin").click(function () {
    var $m1 = $("#loginName").val();
    if (checkMobileNo($m1)) {
      $("#mloginName").val($m1);
    } else {
      $("#mloginName").val("");
    }
    clearMessage();
    smsModeShow();
  });

  $("#viewWebLogin").click(function () {
    var $m1 = $("#mloginName").val();
    if (checkMobileNo($m1)) {
      $("#loginName").val($m1);
    } else {
      $("#loginName").val("");
    }
    clearMessage();
    webModeShow();
  });

  $("#NumImage").click(function () {
    refreshCode();
  });

  $("#webSubmit").click(function () {
    login();
  });

  $("#smsSubmit").click(function () {
    login();
  });
  $("#captchaImg2")
    .off("click")
    .on("click", function () {
      var j = new Image();
      j.onload = function () {
        $("#captchaImg2").attr("src", j.src);
        ajaxCheck2();
      };
      j.src = "/captchazh.htm?type=05&timestamp=" + new Date().getTime();
    });
  $("#captchaImg2").click();
  //回车表单提交
  $("#frmLogin")
    .add("#frmLogin2")
    .keydown(function (event) {
      if (event.keyCode == 13) {
        //回车
        login();
      }
    });

  //验证用户手机号是否为北京移动手机号，并将用户品牌信息存储在会话范围内
  $("#loginName").keyup(function () {
    var $loginName = $(this).val();
    //校验手机号格式
    if (!isNum($loginName)) {
      //手机号非数字类型
      showMessage("请正确输入11位中国移动手机号码!", "loginNameV");
    } else {
      //手机号格式正确
      showMessage("", "loginNameV");
    }
    if ($loginName.length == 11 && isNum($loginName)) {
      if (checkMobileNo($loginName)) {
        // isValidateRnum($loginName);
        bmccMobile($loginName);
      } else {
        showMessage("请正确输入11位中国移动手机号码!", "loginNameV");
      }
    }
  });

  //sms login mobile input keyup
  $("#mloginName").blur(function () {
    var $loginName = $(this).val();
    if ($loginName.length != 11) {
      showMessage("请正确输入11位中国移动手机号码!", "mloginNameV");
    } else {
      showMessage("", "mloginNameV");
      bmccMobile($loginName);
    }
  });

  $("#rnum").keyup(function () {
    var captchatype = $.cookie("captchatype");
    var inputCode = $("#rnum").val();
    if (captchatype == "z" && inputCode.length >= 3) {
      ajaxCheck();
    } else if (captchatype != "z" && parseInt(inputCode.length) >= 4) {
      ajaxCheck();
    }
  });
  $("#loginName")
    .add("#mloginName")
    .focus(function () {
      var $loginName = $(this).val();
      if ($loginName == "手机号码") {
        //$(this).css("color","#000");
        $(this).val("");
      } else {
        if (checkMobileNo($loginName)) {
          if ($cm == 2) {
            isValidateRnum($loginName);
          }
        }
      }
    });

  //密码框获得焦点、对用户名或手机号进行校验*******************************
  $("#web_password").focus(function () {
    $valRnum = true;
    var $loginName = $("#loginName").val();
    if (checkMobileNo($loginName)) {
      isValidateRnum($loginName);
      bmccMobile($loginName);
    } else {
      $("#loginName").val("");
      $("#loginName").focus();
      showMessage("请正确输入11位中国移动手机号码!", "loginNameV");
    }
  });

  $("#smsNum").focus(function () {
    var $phone = $("#mloginName").val();
    if ($(this).val() == "随机密码") {
      $(this).val("");
    }

    if ($phone.length != 11) {
      $("#mloginName").val("");
      $("#mloginName").focus();
      showMessage("请正确输入11位中国移动手机号码!", "mloginNameV");
    }
  });
});
function settime(num) {
  var time;
  var a = $("#sjPasswordBtn");
  var father = $(a).parent();
  var _value = $(a).html();
  time = setInterval(function () {
    --num;
    //console.log(num);
    father.html(num);
    if (num <= 0) {
      $(a).css({
        display: "block",
      });
      father.html('<div class="gain" id="sjPasswordBtn">' + _value + "</div>");
      $("#sjPasswordBtn").bind("click", sendCallback);
      clearInterval(time);
    } else {
      $(a).css({
        display: "none",
      });
    }
  }, 1000);
}

//验证是否为北京移动手机号***************************************
//$async :是否异步 ， true：异步 ；    false:同步
function bmccMobile(userName) {
  userName = $.trim(userName);
  $.ajax({
    type: "POST",
    url: "/chkNumberBjAction.action",
    timeout: 10000,
    async: false,
    dataType: "json",
    data: {
      userName: et(userName),
    },
    success: function (data) {
      if (data) {
        $bmcc_check = "OK"; //验证成功标记
        $last_check_num = userName; //记录本次验证手机账号，如匹配免再次验证
        $isBmccCheck = true;
        return true;
      } else {
        $bmcc_check = "NO";
        if ($cm == 1) {
          showMessage("手机号码非北京移动号码。", "mloginNameV");
        } else {
          showMessage("手机号码非北京移动号码。", "loginNameV");
        }
        $isBmccCheck = false;
        return false;
      }
    },
    error: function () {
      alert("对不起，连接超时，请重新输入！");
    },
  });
}
function checkECode2() {
  var inputCode = $("#inputCode2").val();
  if (
    inputCode == "" ||
    inputCode == null ||
    undefined == inputCode ||
    inputCode == "验证码"
  ) {
    $("#TipSMS").html("图形验证码有误");
    return false;
  }
  var re = ajaxCheck2();
  if ($("#captchaValidity").val() != 0) {
    return false;
  }
  $("#TipSMS").hide();
  return re;
}
function ajaxCheck2() {
  var inputCode = $("#inputCode2").val();
  var checkUrl = "/verifyCaptcha.htm";
  var params = {};
  $("#errinfo").hide();
  if (inputCode.length > 0) {
    // NGCA-622 优化验证码输入后ajax验证速度 赵磊 2015/01/12 start
    // 后台校验验证码是否正确
    params.inputCode = inputCode;
    var re = ajaxCheckCode2(checkUrl, params, inputCode);
    return re;
    // NGCA-622 优化验证码输入后ajax验证速度 赵磊 2015/01/12 end
  } else {
    $("#inputCode2").removeClass("error_bor");
    return "1";
  }
}
function ajaxCheckCode2(checkUrl, params, inputCode) {
  var re = "1";
  $.ajax({
    type: "POST",
    url: checkUrl,
    timeout: 10000,
    async: false,
    dataType: "json",
    data: {
      inputCode: params.inputCode,
    },
    success: function (data) {
      if (data.resultCode == 0) {
        //赋予对象正确的值
        $("#inputCode2").removeClass("error_bor");
        $("#TipSMS").hide();
        $("#captchaValidity").val("0");
        re = "0";
      } else {
        $("#inputCode2").addClass("error_bor");
        $("#TipSMS").html("图形验证码有误");
        $("#captchaValidity").val("1");
        re = "1";
      }
    },
    error: function () {
      alert("对不起，连接超时，请重新输入！");
    },
  });
  return re;
}
//验证发短信
function sendSmsPwd() {
  var $phone = $("#mloginName").val();
  var channelID = $("#channelID").val();
  if (channelID == "" || channelID == null || channelID == undefined) {
    $("#channelID").val("00100");
  } else {
    $("#channelID").val(channelID);
  }
  if ($phone == "" || $phone == "请输入移动手机号") {
    showMessage("请正确输入11位中国移动手机号码!", "mloginNameV");
    return false;
  }
  bmccMobile($phone);
  if ($bmcc_check != "OK") {
    showMessage("手机号码非北京移动号码。", "mloginNameV");
    return false;
  }
  if ("0" !== checkECode2()) {
    $("#captcha2").show();
    return false;
  }
  var token = $("#smsflagCode").val();
  $.ajax({
    type: "POST",
    url: "/loadToken.action",
    timeout: 10000,
    async: false,
    dataType: "json",
    data: {
      userName: et($phone),
    },
    success: function (data) {
      if (data.result == "0000") {
        token = data.result;
      } else {
        token = data.result;
      }
    },
    error: function () {
      alert("对不起，连接超时，请重新输入！");
    },
  });
  sendCallback(token);
  sendSmsPwdNum(60);
}
function sendSmsPwdNum(num) {
  if (num == 0) {
    $("#getSMSPwd").removeAttr("disabled"); //移除disabled属性
    $("#getSMSPwd").html("获取随机密码");
    num = 60;
    return;
  } else {
    $("#getSMSPwd").attr("disabled", "true"); //添加disabled属性
    $("#getSMSPwd").html("重新获取(" + num + ")");
    num--;
  }
  setTimeout(function () {
    sendSmsPwdNum(num);
  }, 1000);
}
function sendCallback(token) {
  var inputCode = "";
  if ($("#inputCode2").val().length != "0") {
    inputCode = $("#inputCode2").val();
  }
  var $phone = $("#mloginName").val();
  var channelID = $("#channelID").val();
  if (channelID == "" || channelID == null || channelID == undefined) {
    $("#channelID").val("00100");
  } else {
    $("#channelID").val(channelID);
  }
  var type = "01";
  if (isNum($phone)) {
    $.ajax({
      type: "POST",
      url: "/sendRandomCodeActionbj.action",
      timeout: 10000,
      async: false,
      dataType: "json",
      data: {
        userName: et($phone),
        inputCode: et(inputCode),
        type: type,
        channelID: channelID,
      },
      beforeSend: function (request) {
        request.setRequestHeader("Xa-before", token);
      },
      success: function (data) {
        $("#sendImg").attr(
          "src",
          "/sendflag.htm?timestamp=" + new Date().getTime()
        );
        if ("0" == data) {
          showMessage("已将短信随机码发送至手机，请查收!", "loginNameV");
        } else if ("4005" == data) {
          showMessage("手机号码有误，请重新输入!", "loginNameV");
        } else if (data == "1") {
          showMessage(
            "对不起，短信随机码暂时不能发送，请一分钟以后再试！",
            "loginNameV"
          );
        } else if (data == "2") {
          showMessage("对不起，短信随机码获取达到上限！", "loginNameV");
        } else if (data == "3") {
          showMessage("对不起，短信发送次数过于频繁！", "loginNameV");
        } else if (data == "4") {
          showMessage("对不起，渠道code不能为空！", "loginNameV");
        } else if (data == "5") {
          showMessage("对不起，渠道code异常！", "loginNameV");
        } else if (data == "6") {
          showMessage("发送短信验证码失败,请检查!");
        }
      },
      error: function () {
        showMessage("对不起，连接超时，请重新输入！", "loginNameV");
        return;
      },
    });
  }
}
//网站密码登录 展示
function webModeShow() {
  $cm = 2;
  showInput("viewWebLogin", 1);
}
//随机短信登录 展示
function smsModeShow() {
  $cm = 1;
  showInput("viewSMSLogin", 0);
}
function showInput($cmId, $formIndex) {
  if ($cmId == "viewSMSLogin") {
    $("#viewSMSLogin").removeClass("no-current").addClass("active");
    $("#viewWebLogin").addClass("no-current");
  } else {
    $("#viewSMSLogin").addClass("no-current");
    $("#viewWebLogin").removeClass("no-current").addClass("active");
  }
  if ($formIndex == 0) {
    $(".random-pass-login").show();
    $(".web-pass-login").hide();
  } else {
    $(".random-pass-login").hide();
    $(".web-pass-login").show();
  }
}
//init login model
function initModel($cm, $initName) {
  var $v = "";
  if ($initName != "" && $initName != "null" && $initName != null) {
    $v = $initName;
  }
  var $fcode = "";
  var $mm = "loginNameV";
  if ($fcode != null && $fcode != "" && $fcode != "null") {
    if (
      $fcode == "PP_9_0101" ||
      $fcode == "PP_1_2021" ||
      $fcode == "PP_1_1002" ||
      $fcode == "PP_1_0802" ||
      $fcode == "PP_0_1017" ||
      $fcode == "PP_0_1018"
    ) {
      if ($cm == 2) {
        $mm = "loginNameV";
      } else {
        $mm = "mloginNameV";
      }
    }
    if (
      $fcode == "PP_1_2015" ||
      $fcode == "PP_1_2017" ||
      $fcode == "PP_1_2016"
    ) {
      $mm = "rnumV";
      $("#yzm").show();
      if (typeof _tag != "undefined") {
        _tag.dcsMultiTrack(
          "WT.logevent",
          "logonFail",
          "WT.si_x",
          "-99",
          "WT.log_rt",
          "RNUMERR"
        );
      }
    }
    if (
      $fcode == "PP_1_2018" ||
      $fcode == "PP_1_2019" ||
      $fcode == "PP_1_2020"
    ) {
      $mm = "smsNumV";
      if (typeof _tag != "undefined") {
        _tag.dcsMultiTrack(
          "WT.logevent",
          "logonFail",
          "WT.si_x",
          "-99",
          "WT.log_rt",
          "SMSNUMERR"
        );
      }
    }
    if (
      $fcode == "PP_1_0820" ||
      $fcode == "PP_1_0803" ||
      $fcode == "PP_1_0805" ||
      $fcode == "PP_1_0806"
    ) {
      $mm = "passwordV";
    }

    var $m = getMessage($fcode);
    if ($fcode == "PP_1_0807") {
      $m = "您已经登录本网站，请稍后再试！";
    }
    if ($m == "") {
      $m = "";
    }
    //插码
    if ($fcode == "PP_1_1002") {
      if (typeof _tag != "undefined") {
        _tag.dcsMultiTrack(
          "WT.logevent",
          "logonFail",
          "WT.si_x",
          "-99",
          "WT.log_rt",
          "NOTBMCCUSER"
        );
      }
    }
    if ($fcode == "PP_1_0803") {
      if (typeof _tag != "undefined") {
        _tag.dcsMultiTrack(
          "WT.logevent",
          "logonFail",
          "WT.si_x",
          "-99",
          "WT.log_rt",
          "PWDERROR"
        );
      }
    }
    if ($fcode == "PP_1_0820") {
      if (typeof _tag != "undefined") {
        _tag.dcsMultiTrack(
          "WT.logevent",
          "logonFail",
          "WT.si_x",
          "-99",
          "WT.log_rt",
          "PWDERRORLOCK"
        );
      }
    }
    if ($fcode == "PP_1_0802") {
      if (typeof _tag != "undefined") {
        _tag.dcsMultiTrack(
          "WT.logevent",
          "logonFail",
          "WT.si_x",
          "-99",
          "WT.log_rt",
          "NOTREG"
        );
      }
    }
    if ($fcode == "CMSSO_1_0500") {
      if (typeof _tag != "undefined") {
        _tag.dcsMultiTrack(
          "WT.logevent",
          "logonFail",
          "WT.si_x",
          "-99",
          "WT.log_rt",
          "SYSERROR"
        );
      }
    }

    showMessage($m, $mm);
  }
  if ($cm == 2) {
    $("#loginName").val($v);
    webModeShow();
  } else {
    $("#mloginName").val($v);
    smsModeShow();
  }
}
//网站密码登录，判断用户输入的是否为手机号
function isMobileInput($input) {
  if ($input == "" || $input == null || $input == "null") {
    return false;
  } else {
    var $first = $input.substring(0, 1);
    var num6 = /^\d$/; //6位数字;
    if (num6.exec($first)) {
      return true;
    } else {
      return false;
    }
  }
}
function et(_0x32033c) {
  var _0x283d00 =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsgDq4OqxuEisnk2F0EJFmw4xKa5IrcqEYHvqxPs2CHEg2kolhfWA2SjNuGAHxyDDE5MLtOvzuXjBx/5YJtc9zj2xR/0moesS+Vi/xtG1tkVaTCba+TV+Y5C61iyr3FGqr+KOD4/XECu0Xky1W9ZmmaFADmZi7+6gO9wjgVpU9aLcBcw/loHOeJrCqjp7pA98hRJRY+MML8MK15mnC4ebooOva+mJlstW6t/1lghR8WNV8cocxgcHHuXBxgns2MlACQbSdJ8c6Z3RQeRZBzyjfey6JCCfbEKouVrWIUuPphBL3OANfgp0B+QG31bapvePTfXU48TYK0M5kE+8LgbbWQIDAQAB";
  var _0x1defd6 = new JSEncrypt();
  _0x1defd6["setPublicKey"](_0x283d00);
  var _0x4bd6d3 = _0x1defd6["encrypt"](_0x32033c);
  return _0x4bd6d3;
}

//判断该手机号是否需要验证码校验
function isValidateRnum($phone) {
  $.ajax({
    url: "/touchNeedVerifyCode.htm",
    type: "POST",
    data: { account: $phone, pwdType: "01" },
    dataType: "json",
    success: function (outJson) {
      if (outJson.needVerifyCode == "0") {
        $("#yzm").hide();
        $valRnum = false; //提交表单不进行验证码校验
      } else if (outJson.needVerifyCode == "1") {
        $("#yzm").show();
        $valRnum = true;
      } else {
        $("#yzm").hide();
        $valRnum = false; //提交表单不进行验证码校验
      }
    },
    error: function (msg) {
      $("#yzm").show();
    },
  });
}
//记住 手机号 或 用户名
function setRememberCookie() {
  $.cookie("c_loginMode", $cm, { expires: 30, path: "/" });
  if ($cm == 2) {
    //web pwd login
    var num1 = $("#loginCheckBox1").attr("num");
    if (num1 == 1) {
      //remember
      $.cookie("c_loginName", $("#loginName").val(), {
        expires: 30,
        path: "/",
      });
    } else {
      // no remember
      $.cookie("c_loginName", "", { expires: -1, path: "/" }); // delete cookie
    }
  } else {
    //sms pwd login
    var num2 = $("#loginCheckBox2").attr("num");
    if (num2 == 1) {
      $.cookie("c_loginName", $("#mloginName").val(), {
        expires: 30,
        path: "/",
      });
    } else {
      $.cookie("c_loginName", "", { expires: -1, path: "/" }); // delete cookie
    }
  }
}
//存储当前操作用户信息
function setLoginCookie() {
  var $loginName = $("#loginName").val();
  if ($cm == 1) {
    $loginName = $("#mloginName").val();
  } //当前登录方式
  if (checkMobileNo($loginName)) {
    //账号类型 手机号
    $.cookie("input_loginName", $loginName, { path: "/" });
  }
}
//发送短信倒计时
function showMS($xt) {
  var $t = 60;
  var $tx = 61;
  if ($xt != 0) {
    $t = $t - $xt;
    $tx = $t + 1;
  }
  settime($t);
}
//登录框信息展示
function showMessage($message, $id) {
  clearMessage();
  if ($id == "mloginNameV" || $id == "smsNumV" || $id == "smsNum") {
    $("#TipSMS").html($message);
  } else {
    $("#TipWeb").html($message);
  }
}
function clearMessage() {
  $("#TipSMS").html("");
  $("#TipWeb").html("");
}
//校验手机号格式
function checkMobileNo(mobileNo) {
  if (
    /^0{0,1}(13[4-9]|15[7-9]|15[0-2]|18[2-8]|147|178|172|198)[0-9]{8}$/.test(
      mobileNo
    )
  ) {
    return true;
  } else {
    return false;
  }
}
//校验手机号格式是否正确 并显示提示信息
function checkMBPhone(phone) {
  var GSMPhNo =
    /^(13[4-9])|(147)|(159)|(158)|(150)|(151)|(152)|(157)|(178)|(182)|(183)|(184)|(187)|(188)|(198)|(172)/; //以134(5、6、7、8、9)或159,158,151,150开头;
  var num11 = /^\d{11}$/; //11位数字;
  var $mm = "loginNameV";
  if ($cm == 2) {
    $mm = "mloginNameV";
  }
  if ("" != phone) {
    if (num11.exec(phone)) {
      if (GSMPhNo.exec(phone)) {
        return true;
      } else {
        //alert("对不起，请您正确输入中国移动GSM手机号码(以134-139、159、158、157、152、151、150 、182 或188开头)!");
        showMessage("请正确输入11位中国移动手机号码!", $mm);
        return false;
      }
    } else {
      //alert("请正确输入11位手机号码(数字)!");
      showMessage("请正确输入11位中国移动手机号码!", $mm);
      return false;
    }
  } else {
    showMessage("请输入11位中国移动手机号码!", $mm);
    return false;
  }
}
//校验数值类型,该数值类型必须小于等于11位
function isNum($num) {
  var num11 = /^\d{0,11}$/; //数字;
  if (num11.exec($num)) {
    return true;
  } else {
    return false;
  }
}
//校验 密码 和 服务密码
function checkPassword($password, $isCus) {
  if ($password == "" && !$isCus) {
    showMessage("请输入密码!", "passwordV");
    return false;
  } else {
    return true;
  }
}
//校验 随机短信
function checkSmsNum($smsNum) {
  var num6 = /^\d{6}$/; //6位数字;
  if ($smsNum == "" || $smsNum == "请输入随机密码") {
    showMessage("请输入随机短信密码!", "smsNumV");
    return false;
  } else {
    if (!num6.exec($smsNum)) {
      showMessage("请输入正确的随机短信密码!", "smsNumV");
      return false;
    }
  }
  return true;
}
//校验 附加码（验证码）
function checkRnum($rnum) {
  if ($valRnum == false) {
    //如果初始化为不校验附加码
    return true; //不校验
  }
  if ($("#captchaValidity").val() == "1") {
    showMessage("验证码不正确！", "rnumV");
    return false;
  }
  if ($rnum == null || $rnum == "" || $rnum == undefined) {
    showMessage("验证码不能为空！", "rnumV");
    return false;
  }
  return true;
}
//验证是否为北京移动手机号
function goCheckBmcc($mobile) {
  if (!$isBmccCheck || $mobile != $last_check_num) {
    //未做校验 或 两次 校验的手机号不同
    return bmccMobile($mobile);
  } else {
    //已经做校验
    if ($bmcc_check == "OK") {
      return true;
    } else {
      if ($cm == 1) {
        showMessage("手机号码非北京移动号码。", "loginNameV");
      } else {
        showMessage("手机号码非北京移动号码。", "mloginNameV");
      }
      return false;
    }
  }
}
//登录**************************************
function login() {
  // 已有帐号登录情况下，是否使用新帐号
  var value = arguments[0];
  if (value == "Y") {
    $isNew = "1";
  }
  if (value == "N") {
    $isNew = "0";
  }
  if ($isNew == "0") {
    // 使用已有帐号，刷新页面
    location.reload();
    return;
  }
  var $loginMode = $cm; //当前登录方式  1为短信随机码登录；2为密码登录
  var $backUrl = decodeURIComponent(getQueryString("backUrl"));
  var $channelID = decodeURIComponent(getQueryString("channelID"));
  if ($backUrl == null || $backUrl == "" || $backUrl == undefined) {
    $("#backUrl").val("http://service.bj.10086.cn");
  } else {
    $("#backUrl").val($backUrl);
  }
  if ($channelID == "" || $channelID == null || $channelID == undefined) {
    $("#channelID").val("00100");
  } else {
    $("#channelID").val($channelID);
  }
  var $loginName = $("#loginName").val(); //账号
  if ($loginMode == 1) {
    $loginName = $("#mloginName").val();
  }
  //$("#loginMethod").val("1");
  var $password;
  if ($cm == 2) {
    $("#pwdType").val("04"); // 随机码登录 02   密码登录 01  pwdType登录04去北京认证中心去认证
    var num1 = $("#loginCheckBox1").attr("num");
    if (num1 == 1) {
      $("#rememberMe").val("1");
    }
    $password = $("#web_password").val();
    $("#password").val($password);
  } else {
    $("#pwdType").val("02");
    var num2 = $("#loginCheckBox2").attr("num");
    if (num2 == 1) {
      $("#rememberMe").val("1");
    }
    $password = $("#smsNum").val();
    $("#password").val($password);
  }
  var $protocol = document.location.protocol;
  var $rnum = $("#rnum").val(); //验证码
  $("#account").val($loginName); //登录用户名
  $("#inputCode").val($rnum); //验证码
  $("#protocol").val($protocol);
  if ($isNew != "" || $isNew != null || $isNew != undefined) {
    $("#isNew").val($isNew);
  }
  var backUrl = $("#backUrl").val();
  //********************
  if (!isNum($loginName)) {
    //手机号格式不正确
    return false;
  }
  //获取是否是北京移动手机号的信息
  if (!goCheckBmcc($loginName)) {
    return false;
  }
  if ($loginMode == 2) {
    //网站密码登录
    if (!checkPassword($password, false)) {
      //校验密码格式
      return false;
    }
    if (!checkRnum($rnum)) {
      //校验附加码
      return false;
    }
  }
  if ($loginMode == 1) {
    //随机短信密码 登录
    var $smsNum = $("#smsNum").val();
    if (!checkSmsNum($smsNum)) {
      //随机短信密码 格式校验
      return false;
    }
  }
  setRememberCookie(); //设置 手机号 用户名 记住 Cookie

  //modify by wangp at 2018-01-23 密码加密 start
  $password = et($password);
  $("#password").val($password);
  $loginName = et($loginName);
  $("#account").val($loginName);
  //modify by wangp at 2018-01-23 密码加密 end

  $("#smsSubmit").attr("disabled", "true");

  //校验通过 ，提交表单  ajax异步提交
  $.ajax({
    type: "POST", //post提交方式默认是get
    url: "/touchBjLogin.action",
    data: $("#frmLogin").serialize(), //序列化
    success: function (jsonData) {
      if (jsonData.result == "0") {
        //add by wangp at 2017-11-29 增加对backurl的编码处理  start
        backUrl = encodeURIComponent(backUrl);
        //add by wangp at 2017-11-29 增加对backurl的编码处理  end

        if (true == jsonData.islocal) {
          window.location.href = backUrl;
        } else {
          window.location.href =
            jsonData.assertAcceptURL +
            "?backUrl=" +
            backUrl +
            "&artifact=" +
            jsonData.artifact;
        }
        return;
      } else if (jsonData.result == "9") {
        popCenterWindow();
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "3001") {
        // 提示将要登录锁定
        if ($cm == 1) {
          showMessage("手机号格式不正确!", "mloginNameV");
        } else {
          showMessage("手机号格式不正确!", "loginNameV");
          flushCode();
        }
        isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "3003") {
        // 提示将要登录锁定
        if ($cm == 1) {
          showMessage("密码格式不正确!", "mloginNameV");
        } else {
          showMessage("密码格式不正确!", "loginNameV");
          flushCode();
        }
        isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "3007") {
        $("#smsSubmit").removeAttr("disabled");
        // 批量IP和账号登录
        if (acctType == "02") {
          if ($cm == 1) {
            showMessage("系统繁忙，请您稍后再试!", "mloginNameV");
          } else {
            showMessage("系统繁忙，请您稍后再试", "loginNameV");
          }
          return;
        } else {
          if (
            channelInfo.indexOf($("#channelID").val()) > "-1" &&
            $("#channelID").val() != ""
          ) {
            if ($("#pwdType").val() == "02") {
              //短信随机码登录密码校验
              if ($cm == 1) {
                showMessage("系统繁忙，请您稍后再试!", "mloginNameV");
              } else {
                showMessage("系统繁忙，请您稍后再试", "loginNameV");
              }
              return;
            }
          } else {
            if ($cm == 1) {
              showMessage("系统繁忙，请您稍后再试!", "mloginNameV");
            } else {
              showMessage("系统繁忙，请您稍后再试", "loginNameV");
            }
            return;
          }
        }
        flushCode();
      } else if (jsonData.code == "8014") {
        // 提示将要登录锁定
        if ($cm == 1) {
          showMessage("系统繁忙，请您稍后再试!", "mloginNameV");
        } else {
          showMessage("系统繁忙，请您稍后再试", "loginNameV");
        }
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "8012") {
        // 提示将要登录锁定
        if ($cm == 1) {
          showMessage("提示将要登录锁定!", "mloginNameV");
        } else {
          showMessage("提示将要登录锁定", "loginNameV");
          flushCode();
        }
        isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "3014") {
        if ($cm == 1) {
          showMessage("系统繁忙，请您稍后再试!", "mloginNameV");
        } else {
          showMessage("系统繁忙，请您稍后再试", "loginNameV");
        }
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "3103") {
        // 提示将要登录锁定
        showMessage("您输入的密码不正确!", "passwordV");
        flushCode();
        isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "3105") {
        // 提示将要登录锁定
        if ($cm == 1) {
          showMessage("密码错误次数已达三次，已将账号暂时锁定!", "mloginNameV");
        } else {
          showMessage("密码错误次数已达三次，已将账号暂时锁定", "loginNameV");
          flushCode();
        }
        isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "3106") {
        // 提示将要登录锁定
        if ($cm == 1) {
          showMessage("密码错误累计已达上限，已将账号暂时锁定!", "mloginNameV");
        } else {
          showMessage("密码错误累计已达上限，已将账号暂时锁定", "loginNameV");
          flushCode();
        }
        // isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else if (jsonData.code == "2046") {
        if ($cm == 1) {
          showMessage(
            "密码输入超过次数账号已锁定，详情垂询10086!",
            "mloginNameV"
          );
        } else {
          showMessage(
            "密码输入超过次数账号已锁定，详情垂询10086",
            "loginNameV"
          );
          flushCode();
        }
        // isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      } else {
        if ($cm == 1) {
          showMessage(jsonData.desc, "mloginNameV");
        } else {
          showMessage(jsonData.desc, "loginNameV");
          flushCode();
        }
        // isValidateRnum($loginName);
        $("#smsSubmit").removeAttr("disabled");
        return;
      }
    },
    error: function () {
      // 设置表单提交出错
      $("#smsSubmit").removeAttr("disabled");
      showMessage("对不起，连接超时，请重新输入！", "loginNameV");
    },
  });
}
//登录******************************************
//异步校验验证码
function ajaxCheck() {
  var inputCode = $("#rnum").val();
  var checkUrl = "/verifyCaptcha.htm";
  var params = {};
  // 中英文混杂验证码
  if ("12" == jsV) {
    var captchatype = $.cookie("captchatype");
    //如果中文验证码输入大于3位，则直接显示错误
    if (captchatype == "z" && inputCode.length > 3) {
      showMessage("验证码不正确！", "rnumV");
      $("#captchaValidity").val("1");
      return;
    }
    if (
      (captchatype == "z" && inputCode.length >= 3) ||
      (captchatype != "z" && inputCode.length >= 4)
    ) {
      //如果对象里有值，说明之前输入校验成功过且没有刷新验证码，则先和对象里的值进行对比
      if (
        loginCommon.rightVerify != "" &&
        loginCommon.rightVerify != undefined
      ) {
        if (inputCode.toUpperCase() == loginCommon.rightVerify.toUpperCase()) {
          //验证成功，去除错误样式
          showMessage("", "rnumV");
          $("#captchaValidity").val("0");
        } else {
          //验证失败，去成功样式，增错误样式
          showMessage("验证码不正确！", "rnumV");
          $("#captchaValidity").val("1");
          return;
        }
      }
      // 后台校验验证码是否正确  如果是中文验证码，则必须输入为三位中文，才调用后台服务校验
      if (captchatype == "z") {
        if (checkzh(inputCode)) {
          //中文则来个编码
          var inputCodeUnicode = toUnicode(inputCode);
          params.inputCode = inputCodeUnicode;
          ajaxCheckCode(checkUrl, params, inputCode);
        }
      } else {
        params.inputCode = inputCode;
        ajaxCheckCode(checkUrl, params, inputCode);
      }
    } else {
      //验证成功，去除错误样式
      showMessage("", "rnumV");
      $("#captchaValidity").val("0");
    }
  } else {
    checkUrl = "/verifyCaptcha.htm";
    if (inputCode.length == 6) {
      params.inputCode = inputCode;
      ajaxCheckCode(checkUrl, params, inputCode);
    } else {
      //验证成功，去除错误样式
      showMessage("", "rnumV");
      $("#captchaValidity").val("0");
    }
  }
}
//
function ajaxCheckCode(checkUrl, params, inputCode) {
  $.getJSON(checkUrl, params, function (jsonData) {
    if (jsonData.resultCode == 0) {
      //赋予对象正确的值
      loginCommon.rightVerify = inputCode;
      //验证成功，去除错误样式
      showMessage("", "rnumV");
      $("#captchaValidity").val("0");
    } else {
      showMessage("验证码不正确！", "rnumV");
      $("#captchaValidity").val("1");
    }
  });
}
//验证码调整策略
function flushCode() {}
//验证码调整策略
function refreshCode() {}

//获取窗口的高度
var windowHeight;
//获取窗口的宽度
var windowWidth;
//获取弹窗的宽度
var popWidth;
//获取弹窗高度
var popHeight;
function init() {
  windowHeight = $(window).height();
  windowWidth = $(window).width();
  popHeight = $(".window").height();
  popWidth = $(".window").width();
}
//关闭窗口的方法
function closeWindow() {
  $(".title img").click(function () {
    $(this).parent().parent().hide("slow");
  });
}
//定义弹出居中窗口的方法
function popCenterWindow() {
  init();
  //计算弹出窗口的左上角Y的偏移量
  var popY = (windowHeight - popHeight) / 3;
  var popX = (windowWidth - popWidth) / 2;
  //alert('jihua.cnblogs.com');
  //设定窗口的位置
  $("#center").css("top", popY).css("left", popX).slideToggle("slow");
  closeWindow();
}

//字符串转unicode编码
function toUnicode(str) {
  var temp,
    i = 0,
    r = "",
    len = str.length;
  for (; i < len; i++) {
    temp = str.charCodeAt(i).toString(16);
    while (temp.length < 4) temp = "0" + temp;
    r += temp;
  }
  return r;
}
//判断是否全为中文
function checkzh(str) {
  var reg = /^[\u4E00-\u9FA5]{3}$/;
  return reg.test(str);
}

//得到html后面的参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = decodeURI(window.location.search).substr(1).match(reg);
  if (r != null) {
    // return unescape(r[2]);
    return r[2];
  }

  return "";
}

var $tp;
function pclose() {
  $("#TipWeb").hide();
  $tp.close();
}
function cclose() {
  $tp.close();
}
