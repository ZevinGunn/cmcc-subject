/**
 * @author
 * @email
 * @create date 2025-04-18 17:09:21
 * @modify date 2025-04-18 17:09:21
 * @desc 星愿值页面
 */
var province = ''; //用户号码归属地区
var isautologin = false; //是否点击或者自动取号
var loginType = '';
var LOGIN_STATUS = false;
var userLevel = '';// -1 9999 非移动用户
var phone = '';
var activeTab = 0; //默认选中第一个tab
var LOGIN_LEVEL = '0';
var userNetAge = 0;//网龄
var isIop = false; //iop用户显示底部网龄banner
// 星动日
var isSelectioned = false; //是否同意协议
var initQyState = false //领取权益按钮禁用标识
var MAIL_CHECK = 1; //判断是否勾选139邮箱(默认勾选)
var jggreceivenum = 0; //6个尊享权益里面已领取的权益数量
var presentPhone = '';  //是否邀请链接
var PRODUCT_ID; //领取权益ID
var QY_ITEM = {}
//登录等级，0未登录，1全球通，2非全，3非移动
var SOURECE = 0; //来源
var pageData = {
    tabData: [],
    currentDate: new Date(),
    topTab: 'left',
    swiperInit: false,
    noStartSwiper: null,
    localChange: false,
    jdConfirmModule:null
}
var USER = createUser()
var sdurl = 'https://h.app.coc.10086.cn/cmcc-app/packageArea/packageArea.html?pageId=1538797930025873408&channelId=P00000055370&yx=1066923070'; //升档套餐链接

function createUser() {
    // 1. 在函数内部定义并“保存”初始状态，它在这里是私有的
    const defaultState = {
        enjoycollectabletimes: 0,
        prodList: [],
        newFlag: 0, //是否新用户 0是
    };

    // 2. 创建一个 user 对象，它是初始状态的一个“深拷贝”
    let user = JSON.parse(JSON.stringify(defaultState));

    // 3. 在 user 对象上定义 reset 函数
    user.reset = function () {
        // 使用 Object.assign 逐个字段重置
        // 注意：这里我们不能直接 user = defaultState;
        Object.assign(this, JSON.parse(JSON.stringify(defaultState)));
        console.log("User object has been reset.");
    };

    return user;
}
// utils/common.js 或 index.js 中
if (typeof window.PopupFlow === 'undefined') {
    class PopupFlow {
        constructor() {
            this.nodes = new Map(); // 存储节点配置
            this.chain = [];        // 执行链
            this.context = {};      // 上下文数据
        }

        /**
         * 注册弹窗节点
         */
        register(name, config) {
            this.nodes.set(name, {
                execute: config.execute,      // 执行函数
                waitFor: config.waitFor,      // 等待的事件
                dataProcessor: config.dataProcessor || ((data) => data) // 数据处理器
            });
            return this;
        }

        /**
         * 开始执行流程
         */
        start(nodeName, initialData = {}) {
            this.context = {...initialData};
            this.executeNode(nodeName);
            return this;
        }

        /**
         * 添加后续节点
         */
        then(nodeName) {
            this.chain.push(nodeName);
            return this;
        }

        /**
         * 执行单个节点
         */
        executeNode(nodeName) {
            const node = this.nodes.get(nodeName);
            if (!node) {
                console.error(`节点未注册: ${nodeName}`);
                this.processNext();
                return;
            }

            // 执行节点，可能返回Promise
            const result = node.execute(this.context);

            // 如果是Promise，等待完成
            if (result && result.then) {
                result.then((newData) => {
                    this.updateContext(newData, node.dataProcessor);
                    this.waitForEventAndProcessNext(node);
                }).catch((error) => {
                    console.error(`节点 ${nodeName} 执行失败:`, error);
                    this.processNext();
                });
            } else {
                // 立即执行
                this.updateContext(result, node.dataProcessor);
                this.waitForEventAndProcessNext(node);
            }
        }

        /**
         * 更新上下文数据
         */
        updateContext(newData, processor) {
            if (newData) {
                this.context = {
                    ...this.context,
                    ...processor(newData)
                };
            }
        }

        /**
         * 等待事件并处理下一个节点
         */
        waitForEventAndProcessNext(node) {
            if (!node.waitFor) {
                // 如果没有等待事件，立即执行下一个
                this.processNext();
                return;
            }

            // 监听等待的事件
            $(document).one(node.waitFor, (event, eventData) => {
                if (eventData) {
                    this.context = {...this.context, ...eventData};
                }
                this.processNext();
            });
        }

        /**
         * 处理下一个节点
         */
        processNext() {
            if (this.chain.length > 0) {
                const nextNode = this.chain.shift();
                this.executeNode(nextNode);
            }
        }
    }
    // 将类挂载到全局
    window.PopupFlow = PopupFlow;
}

function setPageData(key, value) {
    if (value) {
        pageData[key] = value;
        // console.log('设置页面数据', key, value)
    }
}

$('.no-login-btn').click(function (e) {
    utils.addOpeartionsClickLog({button: "点击登录按钮"});
    $("#popLoginSelect").show(); // 登陆弹窗

    e.stopPropagation();
});
$('.top-content').click(function (e) {
    if (LOGIN_LEVEL == 0) {
        $("#popLoginSelect").show(); // 登陆弹窗
        utils.addOpeartionsClickLog({button: "未登录点击"});
        return;
    }
});
//返回全球通首页
$(".back").bind('click', function () {
    utils.addOpeartionsClickLog({button: "全球通短信特权返回按钮"});
    window.history.go(-1);
});
//登录关闭按钮
$(".pop-close,.pop-hide").click(function () {
    utils.addOpeartionsClickLog({
        button: "常态化首页-登录-关闭"
    });
    $(".pop-mask").hide();
    $("body").css("overflow", "auto");
    tcclose();
});
//返回按钮
$(".pop-back").click(function () {
    utils.addOpeartionsClickLog({
        button: "常态化首页-一键认证失败-返回"
    });
    $(this).parent().parent().hide();
    $("#createDiv").hide();
    $("#popLoginSelect").show();
    $("body").css("overflow", "hidden");
    tcopen();
});
//短信验证
$(".smsLogin").click(function () {
    utils.addOpeartionsClickLog({
        button: "常态化首页-短信验证登录"
    });
    $("#popLoginSelect").hide();
    $("#popLoginVerify").show();
    $("body").css("overflow", "hidden");
    tcopen();
});
//前往短信认证
$(".toSmsLogin").click(function () {
    $(this).parent().parent().parent().hide();
    $("#popLoginVerify").show();
    $("body").css("overflow", "hidden");
    tcopen();
});
//退出弹窗
$(".btn-logout").click(function () {
    utils.addOpeartionsClickLog({
        button: "常态化首页-点击退出登录"
    });
    console.log("常态化首页-点击退出登录");
    $('#popLogout_dia').show();
    $("body").css("overflow", "hidden");
    tcopen();
});
//登陆按钮
$(".btn-login").click(function () {
    utils.addOpeartionsClickLog({
        button: "常态化首页-点击登录"
    });
    unLogin();
});
//确认退出
$(".exitLogBtn").click(function () {
    $("body").css("overflow", "auto");
    tcclose();
    logout();
    $(".exitPop").hide();
    utils.addOpeartionsClickLog({
        button: "exitLogBtn"
    });
});
// 关闭弹窗
$('#declare1').click(function () {
    if ($(".load_phone").html() == "本机号码加载中...") {
        $('#declare1').prop('checked', true);
    }
});

/**
 * 一键认证失败处理
 */
function failDeal() {
    $("#dialogBtn").html("本机号码一键登录");
    $(".loadingicon").hide();
    $("#popLoginSelect").show();
    $("body").css("overflow", "hidden");
    tcopen();
    $(".load_phone").html("");
    clearInterval(my_time);
    my_time = null;
    $("#createDiv").hide();
    utils.toast("本机号码获取失败,将为您自动跳转至短信验证码登录");
    setTimeout(function () {
        $("#popLoginSelect").hide();
        $("#popLoginVerify").show();
    }, 2000);
}

/**
 * 未登录点击显示登陆、隐藏视频
 */
function unLogin() {
    // $("#popLoginVerify").show();
    $("#popLoginSelect").show();
    $("body").css("overflow", "hidden");
    tcopen();
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return '';
}

$(function () {
    // loadXdrSign(function () {
    //     initXdrSignData(LOGIN_STATUS);
    // }, handleXdrSignLogin, '-2.4rem');
    onMounted()
    //检查登录状态
    if (getUrlParam("ssoToken")) {
        queryLoginInfo();
    } else {
        checkLoginStatus({
            isLoginCallback: isloginCallback,
            unLoginCallback: unLoginCallback,
        });
    }
    //登录初始化
    Richinfo.Login.init({
        loginVcode: '.btn-verify', // 验证码按钮选择器
        loginLbutton: '.btn-login-verify', // 登录按钮选择器
        phone: '#mobile', // 登录填写手机号的输入框的选择器
        vcode: '#vcode', // 登录填写验证码的选择器
        callback: queryLoginInfo // 登录函数
    });
    //一键认证
    $(".verifyLink").click(function () {
        var declare = $('#declare1');
        if (!declare.get(0).checked) {
            // utils.toast("请阅读并勾选用户协议");
            return;
        }
        let html1 = '<i class="loadingicon"></i>本机号码获取中...';
        $("#dialogBtn").html(html1);
        $(".loadingicon").show();
        logintype = "acquire";
        Richinfo.Acquire.init({
            failCallback: function () {
                failDeal();
            }
        });


        utils.addOpeartionsClickLog({
            button: "常态化首页-一键认证"
        });
    });
    //解决使用输入框软键盘，页面不归位
    $("input,select").blur(function () {
        setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
    });

    initPage(true);
});

function handleXdrSignLogin(result) {
    console.log('handleXdrSignLogin', result);
    if (!LOGIN_STATUS) {
        $("#popLoginSelect").show();
        $("body").css("overflow", "hidden");
        tcopen();
    }
}

function onMounted() {

    const obj = {from:'normal'}
    $(document).trigger('app:init',[obj])

    let currentDate = new Date();
    if(getUrlParam('normalDate')) {
        let currentDateStr = getUrlParam('normalDate')
        currentDate = new Date(currentDateStr);
    }

    setPageData('currentDate', currentDate)

    updateMonthlyBackground()

    bindEvent()

    showQuickWay()

    clickableDrive()

    levelPhone()

    levelXhs()

    levelAi()

    setPageData('cloudPhoneModule', cloudPhoneModule())

    setPageData('cloudDriveModule', cloudDriveModule())

    setPageData('jdConfirmModule', jdConfirmModule())


    setRule()
    // 动态设置规则高，规则图片改来改去，所以自动设置
    window.setElementHeightFromBgImage('.rulePop .txtConimg');

}


// 金蛋二次确认
function jdConfirmModule() {

    $('.jdConfirm-btn').click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-金蛋二次确认-确认"
        });
        checkJdDailyLimit({isUpdate:true})
        hideModal($('.jdConfirm'))
        getRandomQy(QY_ITEM)
    })
    $('.jdConfirm-close').click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-金蛋二次确认-关闭"
        });
        hideModal($('.jdConfirm'))
    })

    function checkJdDailyLimit(options={}) {
        const storageStr = localStorage.getItem('xdr_jdConfirm');
        const now = dayjs();

        if (storageStr) {
            try {
                const data = JSON.parse(storageStr);
                const expireTime = dayjs(data.expireTime);

                // 如果当前时间还在过期时间(即7天内)之前，说明还在限制期内
                if (now.isBefore(expireTime)) {
                    console.log('7天内已弹出过，不自动弹出');
                    return false;
                }
            } catch (e) {
                console.error('解析localStorage失败', e);
            }
        }

        // 【修改点】设置新的过期时间：当前时间往后推 7 天
        // 这样一旦过了7天，now 就会大于 expireTime
        const expireTime = now.add(7, 'day').format('YYYY-MM-DD HH:mm:ss');

        const storageData = {
            expireTime: expireTime
        };
        if(options.isUpdate){
            localStorage.setItem('xdr_jdConfirm', JSON.stringify(storageData));
        }
        return true; // 允许弹出
    }

    return {
        checkJdDailyLimit
    }
}


function clickableDrive() {
    const state = new Proxy({
        hitIop:false,
    }, {
        set(target, key, value) {
            target[key] = value;
            render()
            return true;
        }
    })
    const render = ()=>{
        state.hitIop ? $('.area-cloud-disk').addClass('watch') : $('.area-cloud-disk').removeClass('watch')
    }
    $(document).on('app:login', async function (event, data) {
        if (isFeiQuan()) {
            return
        }
      const hitIop =   await getUserIop('C10000018106')
        console.log('hitIop',hitIop)
       state.hitIop = hitIop
    });
    $(document).on('app:logout', function (event, data) {
        state.hitIop = false
    });
    const url ={
        get:'https://m.mcloud.139.com/portal/cloudCircle/index.html?path=caiyunviporder&sourceid=1044&enableShare=1'
    }

    $('.area-cloud-disk').click(function () {
        assertValid()
        const dynamicButton = state.hitIop ? '去查看' :'去领取'
            utils.addOpeartionsClickLog({
                button:"移动云盘钻石会员",
                dynamicButton
            })

        utils.getSSOToken('', '', url.get, false);
    })

}

function setRule() {
  const txtConimg = $('.rulePop .txtConimg');
    if (!isLeadeon()) {
        txtConimg.addClass('wechat');
    }else {
        txtConimg.removeClass('wechat');
    }
}

function assertValid() {
    if (!getLoginStatus()) {
        throw new Error("未登录");
    } else if (isFeiQuan()) {
        notCMCC2Jump();
        throw new Error("非全用户");
    }
}

function levelAi() {
    // 常态化活动页针对渠道号：66667，76229需要屏蔽：星享ai 星选生活、底部轮播图这几个板块
    const sspid = getSspId()
    const arr =['66667','76229']
    if (arr.includes(sspid)) {
        $('#level-ai').remove()
        $('.level-life').remove()
        $('.swiper-bottom').remove()
    }



}

function levelXhs() {
    $('.level-invite .xhs').click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化-小红书-立即前往",
        });
        assertValid()
        window.location.href = './xhs.html';

    });
}

function levelPhone() {
    const $levelPhone = $('.level-phone')
    // 北京，上海，甘肃、内蒙古、宁夏、陕西、山西、新疆、西藏
return
    // app:login
    $(document).on('app:login', function (event, data) {
        // const specialProvinces = ['北京', '上海', '甘肃', '内蒙古', '宁夏', '陕西', '山西', '新疆', '西藏'];
        // const province = USER.province || '';
        if (isFeiQuan()) {
            $levelPhone.hide()
        }else {
            $levelPhone.show()
        }
    });
    $(document).on('app:logout', function (event, data) {

    });

    $levelPhone.on('click', '.btn', function () {
        const name = $(this).data('name')

        utils.addOpeartionsClickLog({
            button: "常态化-星机首发-立即抢购",
            dynamicButton: name
        });
        assertValid()
        const side = $(this).data('side')

        let url = getJumpUrl(side)

        const cb = (params) => {
            const token = params.token || ''
            url = `${url}&net_token=${token}`;
            console.log('跳转到', url)
            window.location.href = url;
        }
        utils.getSSOToken('', '', url, false, cb);

    });

    function getJumpUrl(side) {
        // https://wx.10086.cn/website/sso/netUni?netUniBackUrl=https%3A%2F%2Fwx.10086.cn%2Fwebsite%2FbusinessOnline%2FshopDetail%3FproductCode%3D2025112514095783301403772&net_token=移动认证
        const magic = `https://wx.10086.cn/website/sso/netUni?netUniBackUrl=https%3A%2F%2Fwx.10086.cn%2Fwebsite%2FbusinessOnline%2FshopDetail%3FproductCode%3D2025112514095783301403772`
        // https://wx.10086.cn/website/sso/netUni?netUniBackUrl=https%3A%2F%2Fwx.10086.cn%2Fwebsite%2FbusinessOnlqine%2FshopDetail%3FproductCode%3D2025112514491590801403835&net_token=移动认证


        const magicPro = 'https://wx.10086.cn/website/sso/netUni?netUniBackUrl=https%3A%2F%2Fwx.10086.cn%2Fwebsite%2FbusinessOnline%2FshopDetail%3FproductCode%3D2025112514491590801403835'

        const isPro = side === 'right';
        return isPro ? magicPro : magic

    }
}

function cloudDriveModule() {
    const equitySlides = [
        {bg: 'first',btn:'常态化首页-云盘权益弹窗前往查看', join:'', url:'https://m.mcloud.139.com/portal/cloudCircle/index.html?path=caiyunviporder&sourceid=1034&enableShare=1'},
        {bg: 'third',btn:'常态化首页-点击33速记', join:'code' ,url:'https://dlpm.5gnewcall.cn:8606/dlpm/#/redirect?dlpmChannel=300415'},
        // {bg: 'second',btn:'常态化首页-点击灵犀智享跳转', join:'' ,url:'https://5gvas01.cmicmaap.com/ai-h5/#/cnmember?channel=qqt'},
    ];

    let swiperInstance = null;

    function showEquityModal(slides) {
        const $wrapper = $('#equitySwiper .cloud-drive-swiper-wrapper');
        $wrapper.empty();

        slides.forEach(function (item) {
            $wrapper.append(`
                    <div class="cloud-drive-swiper-slide swiper-slide">
                        <div  class="cloud-drive-afterGetEquity-bg ${item.bg}" >
                            <div data-btn="${item.btn}" data-url=${item.url} data-join="${item.join}" class="cloud-drive-afterGetEquity-btn"></div>
                        </div>
                    </div>
                `);
        });

        showModal($('#equityModal'));

        bindEvent()

        if (swiperInstance) {
            swiperInstance.destroy(true, true);
            swiperInstance = null;
        }

        if (equitySlides.length > 1) {
            setTimeout(function () {
                swiperInstance = new Swiper('#equitySwiper', {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    centeredSlides: true,
                    loop: false,
                    rewind: true,
                    pagination: {
                        el: '.cloud-drive-custom-pagination',
                        clickable: true,
                        dynamicBullets: false,
                        bulletClass: 'cloud-drive-swiper-pagination-bullet',
                        bulletActiveClass: 'cloud-drive-swiper-pagination-bullet-active'
                    },
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    },
                    speed: 500,
                    effect: 'slide',
                    on: {
                        slideChange: function () {
                            console.log('当前slide索引:', this.activeIndex + 1);
                        }
                    }
                });
                console.log('✅ Swiper初始化成功，rewind模式已启用');
            }, 50);
        } else {
            $('.cloud-drive-custom-pagination').hide();
        }
    }

    function bindEvent() {
        // 领取权益弹窗事件
        $('.cloud-drive-afterGetEquity-btn').off().click(function () {

            let url = $(this).data('url')
            let join = $(this).data('join')
            const button = $(this).data('btn')

            const cb = (params) => {
                const token = params.token || ''
                let newUrl = ''
                let key =  join ? join :'token'
                    newUrl = `${url}&${key}=${token}`;
                console.log('单点跳转', newUrl)
                utils.addButtonClickLogAndRedirect(button,newUrl)
            }

             utils.getSSOToken('', '', url, false,cb)
        })
        $('.cloud-drive-afterGetEquity-close').off().click(function () {
            utils.addOpeartionsClickLog({
                button: "常态化首页-云盘权益弹窗关闭按钮"
            });
            hideEquityModal()
        })

    }

    function hideEquityModal() {
        hideModal($('#equityModal'));
        if (swiperInstance) {
            swiperInstance.destroy(true, true);
            swiperInstance = null;
        }
        $('.cloud-drive-custom-pagination').show();
    }

    function init() {
        showEquityModal(equitySlides)
    }

    return {
        init,
        showEquityModal,
        hideEquityModal
    }

}

function cloudPhoneModule() {
    const state = new Proxy({
        isReceived: false,
        isNoStock: false,
        isNoJoin: false
    }, {
        set(target, key, value) {
            target[key] = value;
            render()
            return true;
        }
    })

    function render() {
        state.isNoStock ? $('.area-cloud-phone').addClass('no-stock') : $('.area-cloud-phone').removeClass('no-stock')
        state.isReceived ? $('.area-cloud-phone').addClass('received') : $('.area-cloud-phone').removeClass('received')
    }

    function isMobileCloudCard(name) {
        return name && name.includes('中国移动云手机专业版日卡')
    }

    function init() {
        console.log('调用接口，获取已领取装填')
        queryMobileCloudCard().then(data => {
            // 1：可领取
            // 2：已领取
            // 3：无法参与
            // 4：无库存
            if (data == 4) {
                state.isNoStock = true
            } else if (data == 2) {
                state.isReceived = true
            } else if (data == 3) {
                state.isNoJoin = true
            }


        }).catch(e => {
            utils.toast('活动火爆，请稍后再试！')
        })
    }

    function submitReceive() {
        console.log('submitReceive', QY_ITEM)
        utils.addOpeartionsClickLog({
            button: "常态化首页-云手机日卡-确认领取",
            dynamicButton: QY_ITEM.id
        })
        queryReceiveMobileCloudCard().then(res => {
            state.isReceived = true
            utils.toast("已领取，权益将在24小时内下发");
            hideModal($('#tk_xq'))
        }).catch(() => {
            utils.toast('活动火爆，请稍后再试！')
        })

    }

    $(document).on('app:login', function (event, data) {
        init()
    });
    $(document).on('app:logout', function () {
        state.isReceived = false
    });

    // 领取接口
    function queryReceiveMobileCloudCard() {
        // 3.3.18云手机日卡权益领取
        // 访问协议：POST
        // 接口名称：/member/func/getCloudPhoneQy.do
//         举例如下：
// {
//     "channelCode ": 66013
// }

        return new Promise((resolve, reject) => {
            $.ajax({
                url: ctx + '/member/func/getCloudPhoneQy.do',
                type: 'post',
                data: {
                    channelCode: getSspId()
                },
                success: function (res) {
                    if (res.status === '1') {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });

        });
    }

    function queryMobileCloudCard() {
        // 3.3.17云手机日卡权益领取状态
        // 访问协议：GET
        // 接口名称：/member/func/cloudPhoneQyStatus.do
        // msg	返回信息	String
        // data	权益领取状态	Number	1：可领取
        // 2：已领取
        // 3：无法参与
        // 4：无库存
        return new Promise((resolve, reject) => {
            $.ajax({
                url: ctx + '/member/func/cloudPhoneQyStatus.do',
                type: 'get',
                dataType: "json",
                success: function (res) {
                    if (res.status === '1') {
                        resolve(res.data);
                    } else {
                        reject(res);
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });

        });
    }

    return {
        isMobileCloudCard,
        state,
        submitReceive
    }

}

// 通过助力链接进入页面
function isInviteLink() {
    const presentPhone = Richinfo.Utils.getUrlParam("tokenSecret") == null ? "" : Richinfo.Utils.getUrlParam("tokenSecret");
    return presentPhone !== ''
}

/**
 * 根据当前月份动态更新所有指定元素的背景图片
 */
function updateMonthlyBackground() {
    // 1. 获取要操作的元素
    const $container = $('.level-award-center');
    if ($container.length === 0) {
        return;
    }

    // 2. 获取当前日期
    const now = pageData.currentDate;
    let year = now.getFullYear();
    const month = now.getMonth() + 1;
    const formattedMonth = String(month).padStart(2, '0');
    const globalData = window.globalData || {};XdrNotStartList
    let baseURL = globalData.baseUrl ? globalData.baseUrl : '../';
    // $container.
    // 4. 【核心修正】严格按照您提供的路径规则构建图片路径
    $container.addClass(`m${month}`);
    const $banner = $('#XdrNotStartList .top')
    $banner.addClass(`m${month}`);

    // if(year ==2026){
    //     year = ''
    // }
    // const leftImagePath = `${baseURL}images/xdrNormal/202505/left_tab_active_${year}${formattedMonth}.png`;
    // const rightImagePath = `${baseURL}images/xdrNormal/202505/right_tab_active_${year}${formattedMonth}.png`;
    // const rightNotStartImagePath = `${baseURL}images/xdrNormal/202505/right_tab_not_start_active_${year}${formattedMonth}.png`;
    //
    // let noStart = `${baseURL}images/xdrNormal/202505/no_start_banner${formattedMonth}.png`
    // if(formattedMonth == 12 ){
    //      noStart = `${baseURL}images/xdrNormal/202505/no_start_banner.png`
    // }
    //
    // // 5. 更新CSS变量的值
    // $container.css({
    //     '--left-tab-bg': `url('${leftImagePath}')`,
    //     '--left-tab-bg-not-start': `url('${leftImagePath}')`,
    //     '--right-tab-bg': `url('${rightImagePath}')`,
    //     '--right-tab-bg-not-start': `url('${rightNotStartImagePath}')`,
    //     '--not-start': `url('${noStart}')`
    // });

    // console.log(`更新左侧Tab背景路径为: ${leftImagePath}`);
    // console.log(`更新右侧Tab背景路径为: ${rightImagePath}`);
}


function showQuickWay() {
    const isShowQuickWay = isLeadeon()
    //不展示快捷方式
    return;
    if (!isShowQuickWay) return
    $('.quick-way').show();

}


//检查登录状态未登录时回调函数
function loginFail() {
    // load_phone = '本机号码获取失败';
    // $(".load_phone").html(load_phone);
    utils.toast("本机号码获取失败,将为您自动跳至短信验证码登录");
    setTimeout(function () {
        $("#popLoginSelect").hide();
        $("#popLoginVerify").show();
    }, 2000);
    utils.addOpeartionsClickLog({button: "loginFail2Index"});
}

var queryInfoPolling = 0; // 轮询次数
var queryInfoInterval; // 轮询定时器
var queryInfoShade; // 轮询遮罩层
var queryDetailShade; // 详情+插件遮罩层
var queryDetailNum = 0;

//登录操作后回调函数
function queryLoginInfo() {
    $(".layout").hide();
    queryInfoShade = showShadeLayer("正在为您登录中...");
    checkLoginStatus({
        isLoginCallback: isloginCallback,
        unLoginCallback: unLoginCallback,
    });
}

//登录成功回调
function isloginCallback(data) {
    $("#dialogBtn").html("本机号码一键登录");
    $(".loadingicon").hide();
    $("#popLoginSelect").hide();
    $("body").css("overflow", "auto");
    tcclose();
    $(".load_phone").html('');
    clearInterval(my_time);
    my_time = null;
    $("#createDiv").hide();
    $("#loginDiv").hide();
    $("#smslogin").hide();
    $("#verifyfailtips").hide();
    $(".pop-mask").hide();
    $(".no-login-btn").hide();
    // 查询号码所属区域
    queryVipLevel({
        callback: queryBrand,
        tag: "qqtindex"
    });
}

// 检查登录状态未登录回调
function unLoginCallback() {
    //电渠单点
    if (isLeadeon()) {
        leadeonLogin({
            callback: isloginCallback
        });
    } else {
        autoAcquire();
    }
}

//一键取号登录
function autoAcquire() {
    if (!window.sessionStorage.getItem("isLogout")) {
        // sspId=66416，用户访问页面要先不弹登录框
        const sspid = getSspId()
        if (sspid && sspid.includes('66416')) {
            return
        }
        $(".load_phone").html('');
        $("#popLoginSelect").show(); // 登陆弹窗
        $("body").css("overflow", "hidden");
        tcopen();
    }
}

// 查询号码所属区域
async function queryBrand(res) {
    province = res.province;
    userLevel = res.userLevel;
    userNetAge = res.netAge;
    phone = res.phone;
    USER.userLevel = userLevel
    USER.province = province
    USER.phone = phone
    USER.newFlag = res.newFlag
    LOGIN_STATUS = true;
    $(document).trigger('app:login', [res]);
    presentPhone = Richinfo.Utils.getUrlParam("tokenSecret") == null ? "" : Richinfo.Utils.getUrlParam("tokenSecret");
    if (USER.userLevel == -1 || USER.userLevel == 0 || USER.userLevel == 7) {
        getsdlj();
    }
    if (res.userLevel >= 0 && res.userLevel <= 5 || res.userLevel == 8) {
        // 全球通
        LOGIN_LEVEL = '1'
        LOGIN_STATUS = true;
    } else if (res.userLevel === '-1') {
        // 非移动
        LOGIN_LEVEL = '3'
        LOGIN_STATUS = true;
    } else if (res.userLevel === '-2') {
        // 未登录
        LOGIN_LEVEL = '0';
    } else {
        // 非全
        LOGIN_LEVEL = '2';
        LOGIN_STATUS = true;
    }
    initUserInfo(res)
    //登录成功后页面初始化
    // initXdrSignData(LOGIN_STATUS)

    $('.login').hide();
    $('.logout').css('display', 'flex');
    $('.user-info').css('display', 'flex');
    // 分省专区渲染
    initProvinceBanner(province, true);
    // 银卡金卡白金卡&&iop年评用户&&网龄大于等于20显示网龄banner
    console.log("userNetAge--", userNetAge)
    if ((USER.userLevel == 1 || USER.userLevel == 2 || USER.userLevel == 3) && userNetAge >= 20) {
        isIop = await getUserIop('C10000018085');
        initSwiper(true, isIop, province);
        console.log(isIop, "--isIop")
    } else {
        console.log(isIop, "++isIop")
        // 底部轮播渲染
        initSwiper(true, false, province);
    }
}

// 是否星动日期间同意了活动规则
function getisCompleted13() {
    $.ajax({
        async: true,
        url: ctx + "/prompt/isCompleted",
        type: 'post',
        data: {
            type: 13
        },
        success: function (data) {
            if (data.status == '1') {
                if (data.data.type13 == '1') {
                    isRecord13 = 1;
                    isSelectioned = true;
                    $(".checkInfo i,.checkInfo_new i").removeClass("disCheck").addClass("checked");
                } else {
                    isRecord13 = 0
                }
            }
        },
        error: function () {
        }
    });
}

function initUserInfo(res) {
    $(".user-info .phone").html(res.phone);
//     levelName
//     如果 levelName 是非全球通用户 则改成移动用户
    let levelName = res.levelName
    if (levelName === '非全球通用户') {
        levelName = '移动用户'
    }
// 获取图片文件名
    const cardImageName = getCardImageName(res.userLevel);
    console.log('cardImageName', cardImageName);

// 拼接完整的图片路径
    const imagePath = `https://qqt-res.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/images/xdrNormal/202505/${cardImageName}`;

// 找到容器元素
    const $cardContainer = $(".user-info .card");

// 将新的 img 元素添加到容器中
    if (cardImageName) {
        $cardContainer.show()
        // 清空容器，防止重复添加
        $cardContainer.empty();

// 创建一个新的 img 元素，设置 src 和 class height .32rem
        const $newImage = $("<img>").attr({
            "src": imagePath,
            "class": "card-image"
        })
        $newImage.hide()

        $newImage.on('load', function () {
            // 在这个函数内部, 'this' 指向的是加载完成的图片DOM元素
            // 现在可以安全地获取宽高了
            const width = this.width;
            const height = this.height;

            console.log(`图片加载完成! 原始尺寸: ${width} x ${height}`);
            const imageHeightInPx = this.naturalHeight;
            const imageWidthInPx = this.naturalWidth;

            const rootFontSize = 100

            // 计算高度的rem值
            const heightInRem = imageHeightInPx / rootFontSize;
            const widthInRem = imageWidthInPx / rootFontSize;
            const $this = $(this);
            $this.css({
                'height': `${heightInRem}rem`,
                'width': `${widthInRem}rem`
            });
            $this.show()
        });

        $cardContainer.append($newImage);
    } else {
        $cardContainer.hide()
    }

    // 设置勾选
    getisCompleted13()
    renderCollectTimes()
}

/**
 * 根据用户等级获取卡片图片信息。
 * @param {number} userLevel - 用户等级。
 * @returns {string} 对应的图片文件名。
 */
function getCardImageName(userLevel) {
    switch (userLevel) {
        case "0":
            return 'card_puka.png';
        case "1":
            return 'card_yinka.png';
        case "2":
            return 'card_jinka.png';
        case "3":
            return 'card_baijin.png';
        case "4":
            return 'card_zuanka.png';
        case "7":
            return 'card_feiquanka.png';
        case "8":
            return 'card_zhuoyueka.png';
        case "11":
            return 'card_tiyan.png';
        default:
            return ''; // 或一个默认图片
    }
}

//  渲染页面的领取次数
function renderCollectTimes() {
    queryIndexReceive().then(function (res) {
        USER.enjoycollectabletimes = res.data.enjoycollectabletimes || 0;
        USER.prodList = res.data.prodList ? res.data.prodList : [];

        if (isDev) {
        }
        const text = `${USER.enjoycollectabletimes}`;
        $('.level-award-get .get-count-num').html(text);
        if (isFeiQuan()) {
            $('#XdrPrizeList .xdr-bg').removeClass('active');
        } else if (isCollectableTimesZero()) {
            $('#XdrPrizeList .xdr-bg').addClass('active');
        }
        showDifferentPage();
    })
}

// member/func/queryIndexReceive.do
function queryIndexReceive() {

    return new Promise((resolve, reject) => {
        $.ajax({
            url: ctx + '/member/func/queryIndexReceive.do',
            type: 'get',
            dataType: "json",
            success: function (res) {
                if (res.status === '1') {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

// 退出登录
function logout() {
    $.ajax({
        url: ctx + '/logout.action',
        type: 'POST',
        data: {},
        success: function (data) {
            if (data.status === '1') {
                LOGIN_STATUS = false;
                loginType = '';
                LOGIN_LEVEL = '0'
                $(document).trigger('app:logout')
                $('.logout').hide();
                $('.user-info').hide();
                $('.login').show();
                $('.no-login-btn').show();
                $(".sub_province").hide();
                window.sessionStorage.clear();
                isautologin = false;
                $(".load_phone").html("");
                const text = `0`;
                $('.level-award-get .get-count-num').html(text);
                USER.reset()
                setPageData('localChange', false)
                renderTabData = JSON.parse(JSON.stringify(newTabData))
                $('#XdrPrizeList .xdr-bg').removeClass('active');
                $('#mobile').val("");
                $('#vcode').val("");
                $('#declare1').prop('checked', false);
                $('#declare2').prop('checked', false);
                $('.wraphref1 .gou').addClass('bg-none');
                $('.wraphref2 .gou').addClass('bg-none');
                if (getCheckInfo()) {
                    // 如果有勾选协议 退出登录就取消勾选1
                    $('.checkInfo i,.checkInfo_new i').removeClass('checked').addClass('disCheck');
                }
                showDifferentPage()
                // initXdrSignData(LOGIN_STATUS)
            }
        },
        error: function () {
            console.log("exec logout error");
        }
    });
}

function resetUSER() {

}

function showDifferentPage() {
    console.log('showDifferentPage')
    //  普卡
    const normalCard = USER.userLevel == 0

    if (!LOGIN_STATUS) {
        if (pageData.topTab == 'right') {
            $('.level-module .float-btn.left').show();
            $('.level-module .float-btn.right').hide();
        } else {
            $('.level-module .float-btn.right').show();
            $('.level-module .float-btn.left').hide();
        }
        // 退出登录
        $('.show-box').hide()
        $('.level-award-get').show()
        $('.level-award-center.tab-box').show()
        xdrTabData = JSON.parse(JSON.stringify(originXdrTabData))
        initPage()
        return
    }
    // 登录了
    if (normalCard) {
        console.log('普卡，展示普卡页面');
        // 弹非全弹窗
        // getTipsPop
        $('.level-module .float-btn').hide()
        renderNoVip()
    } else if (isInviteLink()) {
        // 助力链接进入
        if( isFeiQuan()){
            console.log('助力链接进入 非全');
            utils.addOpeartionsClickLog({
                button: "常态化首页-非全助力链接进入"
            })
            // 弹窗内容：非全无法助力
            $('#support-modal').css('display', 'flex')
            $('body').css('overflow', 'hidden')
            tcopen()
            return;
        }
        console.log('助力链接进入 全球通');
        // 暂时走自动弹窗逻辑
        return
        const handler =  globalVmInvite.showWhichPop()
        const isExpired = globalVmProtocol.pageData.isExpired

        if(!isExpired){
            handler()
            return;
        }
        const PopupNodes = {
            protocol: {
                execute: (data) => $(document).trigger('xdrProtocol:open', data),
                waitFor: 'xdrProtocol:close'
            },
            supportModal: {
                execute: (data) => {
                    handler()
                },
                waitFor: 'supportModal:closed'
            },
        };
        // 使用工厂模式注册
        const popupFlow = new PopupFlow();
        Object.entries(PopupNodes).forEach(([name, config]) => {
            popupFlow.register(name, config);
        });
        // 使用
        popupFlow
            .start('protocol', USER)
            .then('supportModal');

    } else if (isFeiQuan()) {
        // 非全2
        $('.getTipsPop').show()
        $('body').css('overflow', 'hidden')
        tcopen()
        // notCMCC2Jump()
    } else {
        initPage(false)

        // 暂时走自动弹窗逻辑
        let isExpired = window.globalVmProtocol &&  globalVmProtocol.pageData && globalVmProtocol.pageData.isExpired
        isExpired = false

        if(!isExpired){
            unReceivePop()
            return;
        }
        // 工厂函数，创建弹窗节点配置
        const PopupNodes = {
            protocol: {
                execute: (data) => $(document).trigger('xdrProtocol:open', data),
                waitFor: 'xdrProtocol:close'
            },
            unReceive: {
                execute: (data) => {
                    if (isInviteLink()) return;
                    unReceivePop();
                },
                waitFor: 'unReceive:closed'
            },
        };
        // 使用工厂模式注册
        const popupFlow = new PopupFlow();
        Object.entries(PopupNodes).forEach(([name, config]) => {
            popupFlow.register(name, config);
        });
        // 使用
        popupFlow
            .start('protocol', USER)
            .then('unReceive');



    }


    // check一下获取次数
    // 有次数		没次数		普卡
    //
    // initpage		initGetPage		initpkPage
}

function unReceivePop() {
    // 保存：/prompt/saveRecord  type=31
    // 查领取次数
    if (USER.enjoycollectabletimes == 0) {
        // 没次数了就不走弹窗逻辑了
        console.log('没次数了就不走弹窗逻辑了')
        return
    }
    // 查询谈过弹窗没有：/prompt/isCompleted
    queryReceive().then(function (res) {
        console.log('查询是否领取过权益', res);
        const data = res.data || {}
        if (data.type31 === '0') {
            //   没展示过
            console.log('没展示过弹窗，展示12')
            $('.getPrizePop,.layout').show()
            $('body').css('overflow', 'hidden')
            tcopen()
        }
    })

    $('.getPrize').click(function (event) {
        const $target = $(event.target);
        console.log('点击了领取权益按钮', $target);
        const text = $target.hasClass('getPrize-btn') ? '点击领取权益按钮' : '点击关闭按钮';
        if ($target.hasClass('getPrize-btn')) {
            console.log('点击了领取权益按钮');
            closeAction()
            if ($(window).scrollTop() > 0) {
                console.log('如果页面有滚动')
                $('html, body').animate({scrollTop: 0}, {
                    duration: 0,
                });
            }

        } else if ($target.hasClass('getPrize-close')) {
            console.log('点击了关闭按钮');
            closeAction()
        }

        function closeAction() {
            utils.addOpeartionsClickLog({
                button: text
            })
            getsaveRecord(31)
            $('.getPrizePop,.layout').hide()
            $('body').css('overflow', 'auto')
            tcclose()
        }

    })
}

//  查询是否展示了领取过权益
function queryReceive() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: ctx + '/prompt/isCompleted',
            type: 'post',
            data: {
                type: 31
            },
            success: function (res) {
                if (res.status === '1') {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function renderNoVip() {
    $('.show-box').hide()
    $('.level-award-get').hide()
    $('.no-vip-box').show()

    $('.no-vip-box').click(function () {
        console.log('点击了非全页面')
        utils.addOpeartionsClickLog({
            button: "常态化首页-普卡-立即升档"
        })
        $('.sdPop').show()
    })
}


let tabData = [
    {
        id: 1,
        title: "喝出好“星”情", // 对应 美食TAB1
        code: 'hchxq',
        phase: '1',
        startDate: "20250901",
        endDate: "20250930",
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3559,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "书亦烧仙草20元立减券",
                    isRandom: false,
                },
                {
                    id: 3560,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "奈雪的茶20元满减券",
                    isRandom: false,
                },
                {
                    id: 3561,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "霸王茶姬20元满减券",
                    isRandom: false,
                },
                {
                    id: 3562,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "库迪咖啡20元抵扣券",
                    isRandom: false,
                },
                {
                    id: 3563,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "淘宝闪购超级吃货卡月卡",
                    isRandom: false,
                }
            ]
        },
        active: true // 默认激活第一个Tab
    },
    {
        id: 2,
        title: "生活“星”能量", // 对应 生活TAB2
        code: 'shxnl',
        phase: '2',
        startDate: "20250901",
        endDate: "20250930",
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3564,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "美团外卖10元通用红包",
                    isRandom: false,
                },
                {
                    id: 3565,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "汽车之家洗车服务会员月卡",
                    isRandom: false,
                },
                {
                    id: 3566,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "名创优品满50.01减50元优惠券",
                    isRandom: false,
                },
                {
                    id: 3567,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "滴滴出行快车10元立减券",
                    isRandom: false,
                },
                {
                    id: 3568,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "哈啰单车30天月卡",
                    isRandom: false,
                }
            ]
        },
        active: false
    },
    {
        id: 3,
        title: "玩出“星”花样", // 对应 娱乐TAB3
        code: 'wcxhy',
        phase: '3',
        startDate: "20250901",
        endDate: "20250930",
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3569,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "QQ音乐豪华绿钻月卡",
                    isRandom: false,
                },
                {
                    id: 3570,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "酷狗豪华VIP月卡",
                    isRandom: false,
                },
                {
                    id: 3571,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "网易云音乐黑胶VIP月卡",
                    isRandom: false,
                },
                {
                    id: 3572,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "酷我豪华VIP月卡",
                    isRandom: false,
                },
                {
                    id: 3573,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "Keep会员月卡",
                    isRandom: false,
                }
            ]

        },
        active: false

    },
    {
        id: 4,
        title: "学出“星”高度", // 对应 知识TAB4
        code: 'xcxgd',
        phase: '4',
        startDate: "20250901",
        endDate: "20250930",
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3574,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "WPS超级会员月卡",
                    isRandom: false,
                },
                {
                    id: 3575,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "QQ阅读会员月卡",
                    isRandom: false,
                },
                {
                    id: 3576,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "喜马拉雅会员月卡",
                    isRandom: false,
                },
                {
                    id: 3577,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "七猫免费小说会员月卡",
                    isRandom: false,
                },
                {
                    id: 3578,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "知乎盐选会员月卡",
                    isRandom: false,
                }
            ]
        },
        active: false
    },
];
// 新的9月份权益
let newTabData = [
    {
        id: 1,
        title: "喝出好“星”情", // TAB1 美食
        code: 'hchxq',
        phase: '1',
        startDate: "20241201", // Updated to December
        endDate: "20241231",   // Updated to December
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3433,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "星巴克30元立减券",
                    isRandom: false,
                    // code: 'xdrxbklb'
                },
                {
                    id: 3698,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "爷爷不泡茶15元满减券",
                    isRandom: false,
                    // code: 'cthyybpc'
                },
                {
                    id: 3436,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "霸王茶姬20元满减券",
                    isRandom: false,
                    // code: 'xdrbwcjq'
                },
                {
                    id: 3437,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "库迪咖啡29元抵扣券",
                    isRandom: false,
                    // code: 'xdrkdkkq'
                },
                {
                    id: 3699,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "淘宝闪购96元券包",
                    isRandom: false,
                    // code: 'xdrelm63'
                }
            ]
        },
        active: true
    },
    {
        id: 2,
        title: "生活“星”能量", // TAB2 生活
        code: 'shxnl',
        phase: '2',
        startDate: "20241201",
        endDate: "20241231",
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3700,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "美团神会员60元省钱包",
                    isRandom: false,
                    // code: 'cthmtshy'
                },
                {
                    id: 3440,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "Keep会员月卡",
                    isRandom: false,
                    // code: 'xdrkeepyk'
                },
                {
                    id: 3442,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "名创优品满50.01元减50元券",
                    isRandom: false,
                    // code: 'xdrmcyp50q'
                },
                {
                    id: 3701,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "迅雷白金会员月卡",
                    isRandom: false,
                    // code: 'xdrxlknyk'
                },
                {
                    id: 3441,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "QQ超级会员月卡",
                    isRandom: false,
                    // code: 'xdrqqcjhyyk'
                }
            ]
        },
        active: false
    },
    {
        id: 3,
        title: "玩出“星”花样", // TAB3 娱乐
        code: 'wcxhy',
        phase: '3',
        startDate: "20241201",
        endDate: "20241231",
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3453,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "QQ音乐豪华绿钻月卡",
                    isRandom: false,
                    // code: 'xdrqqyylzyk'
                },
                {
                    id: 3454,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "酷狗豪华VIP月卡",
                    isRandom: false,
                    // code: 'xdrkgyk'
                },
                {
                    id: 3455,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "网易云音乐黑胶VIP月卡",
                    isRandom: false,
                    // code: 'xdrwyyyk'
                },
                {
                    id: 3456,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "酷我音乐豪华VIP月卡",
                    isRandom: false,
                    // code: 'xdrkwyk'
                },
                {
                    id: 3702,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "抖音汽水音乐SVIP月卡",
                    isRandom: false,
                    // code: 'cthdyyk'
                }
            ]
        },
        active: false
    },
    {
        id: 4,
        title: "学出“星”高度", // TAB4 知识
        code: 'xcxgd',
        phase: '4',
        startDate: "20241201",
        endDate: "20241231",
        isProcessing: false,
        isNoStart: false,
        isEnd: false,
        isLeft: true,
        isRight: false,
        panel: {
            items: [
                {
                    id: 3458,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "WPS超级会员月卡",
                    isRandom: false,
                    // code: 'xdrwpscjhy'
                },
                {
                    id: 3703,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "QQ阅读会员月卡",
                    isRandom: false,
                    // code: 'cthqqydyk'
                },
                {
                    id: 3460,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "喜马拉雅会员月卡",
                    isRandom: false,
                    // code: 'xdrxmlyyk'
                },
                {
                    id: 3461,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "七猫免费小说会员月卡",
                    isRandom: false,
                    // code: 'xdrqmxsyk'
                },
                {
                    id: 3462,
                    transferable: 1,
                    levelable: "1,2,3,4,8",
                    stock: 0,
                    status: 0,
                    qyName: "知乎盐选会员月卡",
                    isRandom: false,
                    // code: 'xdrzhyxhyyk'
                }
            ]
        },
        active: false
    },
];


let renderTabData = JSON.parse(JSON.stringify(newTabData)) // 深拷贝原始数据

let xdrTabData = [
    {
        "id": 5,
        "title": "星动日嘉年华",
        "code": "xdrjnh",
        "phase": "6",
        "startDate": "20251026",
        "endDate": "20251028",
        "isProcessing": false,
        "isNoStart": true,
        "isEnd": false,
        "panel": {
            "items": [
                {
                    "id": 3175,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "腾讯视频VIP月卡",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3255,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "哔哩哔哩月度大会员",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3279,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "喜马拉雅会员月卡",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3237,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "QQ音乐豪华绿钻月卡",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3278,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "酷狗豪华VIP月卡",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3362,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "酷我音乐豪华VIP月卡",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3276,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "知乎盐选会员月卡",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3469,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "WPS超级会员月卡",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3776,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "美团60元神券包",
                    "isRandom": false,
                    "phase": "4"
                },
                {
                    "id": 3802,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 0,
                    "status": 0,
                    "qyName": "爷爷不泡茶15元满减券",
                    "isRandom": false,
                    "phase": "4"
                }
            ]
        }
    }
]


const originXdrTabData = JSON.parse(JSON.stringify(xdrTabData)) // 深拷贝原始数据

function initXdrPanels(tabData) {
    let currenDate = pageData.currentDate
    // 自动计算星动日活动时间
    const currentTimes = calculateXdrTime(currenDate);
    console.log('当前日期下的活动时间：');
    console.log(`活动开始时间：${currentTimes.beginTime}`);
    console.log(`活动结束时间：${currentTimes.endTime}`);
    const xdrTab = xdrTabData.find(item => item.id === 5);

    const xdrTime = currentTimes

    xdrTab.startDate = xdrTime.beginTime;
    xdrTab.endDate = xdrTime.endTime;
    xdrTab.isLeft = false
    xdrTab.isRight = true
    xdrTab.panel.items.map((item) => {
        // 是星动日权益
        item.isXdrqy = true;
    })
    processTabsData(tabData, currenDate)


    const tabContainer = xdrTab.isEnd ? $('#XdrPrizeList') : $('#XdrNotStartList');
    const prizeContainer = tabContainer.find('.level-award-prize');
    const text = tabContainer.find('.mask .text');
    // 已结束
    if (xdrTab.isEnd) {
        const icon = tabContainer.find('.mask .icon');
        //     icon 类名去掉clock 改成 end
        icon.removeClass('clock').addClass('end');
        //     已结束
        text.text('已结束');
    } else if (xdrTab.isNoStart) {
        //  给level-award-center加上 no-start 类名 level-award-center

        $('.level-award-center').addClass('no-start');
        $('.level-award-center').data('isNoStart', true);
        // 锁定10月26日10点！神秘大奖重磅登场

        const dateText = `${dayjs(xdrTab.startDate).format('MM月DD日')}10点`;
        const whoText = `锁定${dateText}！神秘大奖重磅登场`;
        text.text(whoText);

    }

    prizeContainer.empty();

    xdrTab.panel.items.map(item => {

        if (isCollectableTimesZero() && LOGIN_STATUS) {
            // 已领了 就都设置100%库存
            item.stock = 100
            // 非全设置0
            if (isFeiQuan()) {
                item.stock = 0
            }
        }
        item.isReceived = USER.prodList.some(id => id == item.id);

        const productClassName = getProductClassNameById(item.id)
        if (item.id !== 9999) {
            item.class = productClassName;
        }
    })

    const groupItems = createGroupHtml(xdrTab.panel);
    prizeContainer.append(groupItems);


}

function createNotStartHtml(items) {
    return items.map((item) => {
        const productClassName = getProductClassNameById(item.id)
        return (`<div class="swiper-slide ${productClassName}"></div>`)
    })
}

function initNotStartSlide() {
    const wrapper = $('#not-start-swiper .swiper-wrapper');
    wrapper.empty();
    const xdrItem = xdrTabData.flatMap(item => {
        console.log('item.panel.items', item.panel.items)
        return item.panel.items
    }).filter(item => item.id !== 9999).map(item => {
        item.class = getProductClassNameById(item.id)
        return item
    })

    // 爱奇艺，优酷，腾讯，b站
    const nameArr = ['爱奇艺', '优酷', '腾讯视频', '哔哩哔哩']
    const otherItem = nameArr.map(name => {
        const item = {
            "id": "",
            "transferable": 1,
            "levelable": "1,2,3,4,8",
            "stock": 0,
            "status": 0,
            "qyName": "星巴克30元会员礼包",
            "isRandom": false,
            "phase": "4"
        }
        const product = getItemByCommentName(name).pop()
        if (product) {
            item.id = product.id
            item.class = getProductClassNameById(product.id)
            item.qyName = product.comment
        }
        return item

    })
    const items = [...xdrItem]
    console.log('待开始轮播权益', items.map(i => i.qyName));
    wrapper.append(createNotStartHtml(items))
}

function renderNotStartSwiper() {

    initNotStartSlide()
    const oneRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var mySwiper = new Swiper('#not-start-swiper', {
        // 这是一个最基础的配置
        slidesPerView: 'auto',
        spaceBetween: .07 * oneRem,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 3000, // 自动切换的时间间隔
            disableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay。默认为true：停止。设置为false则继续。
        },

    });
    setPageData('noStartSwiper', mySwiper)


}

function isWeChatBrowser() {
    return Richinfo.Utils.isWeChatBrowser()
}

/**
 * 根据 itemId 查找对应的 tab 对象
 * @param {number} searchId - 需要查找的 item 的 id
 * @param {Array} dataArr - 主要的 tab 数据数组
 * @returns {Object|null} 匹配到的 tab 对象，如果未找到则返回 null
 */
function findTabByItemId(searchId, dataArr) {
    // 1. 确保传入的数组有效
    if (!dataArr || dataArr.length === 0) {
        return null;
    }

    // 2. 遍历所有 tab
    for (const tab of dataArr) {
        // 确保 panel 和 items 存在
        if (tab.panel && tab.panel.items) {
            // 3. 在当前 tab 的 items 中查找
            const foundItem = tab.panel.items.find(item => item.id == searchId);

            // 4. 如果在当前 tab 中找到了 item
            if (foundItem) {
                return tab; // 立即返回其父级 tab 对象
            }
        }
    }

    // 5. 如果所有循环结束仍未找到，明确返回 null
    return null;
}

function getDefaultTabId() {
    // 按每月1号开始默认展示第一个tab、7号开始展示第2个tab、14号开始展示第3个tab、21号开始展示第4个tab
    const currentDate = pageData.currentDate;
    const day = dayjs(currentDate).date(); // 获取当前日期的天数

    let result = 1
    if (!day) {
        console.log('当前日期不合法，无法获取默认tabId');
    } else if (day >= 1 && day <= 6) {
        result = 1; // 1号到6号展示第一个tab
    } else if (day >= 7 && day <= 13) {
        result = 2; // 7号到13号展示第二个tab
    } else if (day >= 14 && day <= 20) {
        result = 3; // 14号到20号展示第三个tab
    } else {
        result = 4; // 21号到月底展示第四个tab
    }
    console.log('当前日期：', currentDate, '，默认展示的tabId：', result);
    return result
}

function initPage(localChange) {
    const receivedId = USER.prodList.slice().pop()

    if (receivedId && LOGIN_STATUS) {
        console.log('已领权益，需要转换成旧的权益');
        const oldQyTab = findTabByItemId(receivedId, [...tabData])
        // 如果已领权益是在旧的tab数据中，说明是旧权益,用旧数据
        if (oldQyTab) {
            renderTabData = JSON.parse(JSON.stringify(tabData))
            renderTabData.flatMap(item => item.panel.items).map(item=>{
                item.stock = 100
                return item
            })
            localChange = true
            setPageData('localChange', true)
        }
    }

    let tab = findTabByItemId(receivedId, [...renderTabData, ...xdrTabData]) || renderTabData[0]

    let switchId = getDefaultTabId()

    // 已领面板回显
    const tabIsReceived = isTabReceived(tab)
    const $btn = $('.level-award-center .right-btn')
    // $btn.trigger('click');
    if (tab.isRight && tabIsReceived) {
        const $btn = $('.level-award-center .right-btn')
        $btn.trigger('click');

    } else if (tab.isLeft && tabIsReceived) {
        switchId = tab.id
    }

    activeTab = switchId

    initTabs(renderTabData);

    initXdrPanels(xdrTabData);

    renderPanels(switchId, localChange)


    bindTabClick()

}

/**
 * 根据特定规则计算活动的开始和结束日期。
 * @param {string | Date | dayjs} a - 代表当前时间的有效日期参数
 * @returns {{beginTime: string, endTime: string}} - 返回格式化后的开始和结束日期
 */
function calculateXdrNormalTime() {
    // 1. 将输入转换为 dayjs 对象
    const now = dayjs(pageData.currentDate);

    // 2. 直接计算当月的第一天和最后一天
    const beginTime = now.startOf('month').format('YYYYMMDD');
    const endTime = now.endOf('month').format('YYYYMMDD');

    // 3. 返回结果
    return {
        beginTime,
        endTime
    };

}

/**
 * 自动计算星动日活动时间
 * 规则：
 * 1. 如果当前日期小于本月29日，活动时间为当前月26-28日
 * 2. 如果当前日期大于等于本月29日，活动时间为下个月26-28日
 * 3. 自动处理跨年情况
 * @returns {Object} 包含开始和结束时间的对象
 */
function calculateXdrTime(currenDate) {
    const now = currenDate; // pageData.currentDate 假定是一个 Date 对象
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    // 1. 获取当前月的最后一天
    // 创建一个Date对象，月份设置为下一个月，日期设置为0，这样就能得到当前月的最后一天
    const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);

    // 2. 构造当前月最后一天的23:59:59时间点
    const endOfCurrentMonth = new Date(
        lastDayOfCurrentMonth.getFullYear(),
        lastDayOfCurrentMonth.getMonth(),
        lastDayOfCurrentMonth.getDate(),
        23, 59, 59 // 设置为23时59分59秒
    );

    // 决定活动月份和年份
    let activityMonth, activityYear;

    // 比较当前时间与当前月最后一天的23:59:59
    if (now <= endOfCurrentMonth) {
        // 如果当前日期和时间在当前月最后一天的23:59:59或之前，活动在当月
        activityMonth = currentMonth;
        activityYear = currentYear;
    } else {
        // 如果当前日期和时间在当前月最后一天的23:59:59之后，活动在下月
        activityMonth = currentMonth + 1;
        activityYear = currentYear;

        // 处理跨年情况
        if (activityMonth > 11) { // 如果月份超过11 (即12月), 需要进到下一年
            activityMonth = 0; // 变为1月 (索引0)
            activityYear++; // 年份加1
        }
    }

    // 格式化月份为两位数 (1 -> 01, 12 -> 12)
    // 注意：activityMonth 是0-11，所以需要 +1 才是实际月份
    const monthStr = String(activityMonth + 1).padStart(2, '0');

    // 构建日期字符串
    // 日期固定为26-28日
    const beginTime = `${activityYear}-${monthStr}-26 09:30:00`;
    const endTime = `${activityYear}-${monthStr}-28 23:59:59`;

    return {
        beginTime,
        endTime
    };
}

function getTabById(tabId) {
    return renderTabData.find(function (tab) {
        return tab.id === tabId;
    });
}

function switchToTab(tabId, localChange) {

    $('.level-award-tab').removeClass('active');

    // 激活指定Tab
    $(`.level-award-tab[data-tab-id="${tabId}"]`).addClass('active');

    if (activeTab === tabId) {
        console.log('已是当前Tab，跳过切换:', tabId);
        return false;
    }
    activeTab = tabId
    // 3. 渲染Tab内容
    renderPanels(tabId, localChange)


}

function isCollectable() {
    // 检查用户是否有可领取的权益
    return USER.prodList && USER.prodList.length === 0
}

function createdPanelMaskHtml(tab) {
    const startDate = tab.startDate;
    const endDate = tab.endDate;
    // 5月29日10点开始
    let mask = null;
    const startStr = dayjs(startDate).format('MM月DD日');
    const bigMaskPhase = ['0', '5'].includes(tab.phase)

    const bigMask = bigMaskPhase ? 'big' : ''
    const startDateText = `${startStr}10点 待开始`
    const noStartMask = $(`<div class="mask ${bigMask}">
        <div class="lock"></div>
        <div class="text">${startDateText}</div>
            </div>`);


    const endMask = $(`<div class="mask ${bigMask}">
        <div class="text end"></div>
        <div class="text text2">已结束</div>
            </div>`);

    mask = tab.isNoStart ? noStartMask : endMask;
    return mask
}

function renderPanels(tabId, localChange) {

    const tab = getTabById(tabId);

    const container = $('#NormalPrizeList .level-award-prize');

    const addMask = () => {
        const mask = createdPanelMaskHtml(tab);

        container.append(mask);
    }
    if ((tab.isNoStart || tab.isEnd)) {

        // addMask()

    } else if (tab.phase == 0) {

        // addMask()
    }

    if (localChange) {
        tab.panel.items.map(item => {
            const productClassName = getProductClassNameById(item.id)
            if (item.id !== 9999) {
                item.class = productClassName;
            }

        })
        addEggIfNeeded(tab);

        container.empty();

        const groupHtml = createGroupHtml(tab.panel);

        container.append(groupHtml);


        return
    }

    const reqData = {
        phase: tab.phase,
    }
    p = queryNormalProdList(reqData)
    p.then(function (res) {
        // 如果不可领则无需继续渲染渲染
        let phase = res.data.phase;
        const tabPhase = tab.phase
        const prodList = res.data.prodList || []
        // 映射图标
        prodList.map(item => {
            const productClassName = getProductClassNameById(item.id)
            if (item.id !== 9999) {
                item.class = productClassName;
            }

        })
        const PHASE_MAPPING = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            6: 1  // 特殊：phase6按phase1处理
        };


        function getTargetTabPhase(apiPhase) {
            const targetPhase = PHASE_MAPPING[parseInt(apiPhase)];
            return targetPhase ? targetPhase.toString() : null;
        }

        let targetTabPhase = getTargetTabPhase(phase);


        tab.panel.items = prodList.slice()

        tab.panel.tabId = tab.id
        tab.panel.items.forEach((item, index) => {
            item.isLastDay = tab.isLastDay || false; // 是否是最后一天
            item.isFirstDay = tab.isFirstDay || false; // 是否是第一天
            item.isProcessing = tab.isProcessing || false; // 是否正在进行中
            item.isEnd = tab.isEnd || false
            item.isNoStart = tab.isNoStart || false
            // 已领取
            if (isCollectableTimesZero()) {
                item.isReceived = USER.prodList.some(id => id == item.id);

                const isFakeRandom = item.id == 9999

                // 非全设置0
                if (isFeiQuan()) {
                    item.stock = 0;
                }
                if (isFakeRandom && LOGIN_STATUS) {
                    item.class = 'jd_click_r';
                    if (isFeiQuan()) {
                        item.class = 'jd_click'
                    }
                }
            }
            item.tabId = tab.id; // 所属tab的id
        });
        tab.panel.items.forEach((item, index) => {
            //  第一天未开始，设置库存为0
            const isRandom = item.isRandom
            if (isRandom) {
                return
            }
            if (item.isFirstDay && !isCanReceive(new Date())) {
                item.stock = 0
            }

        })

        // 如果没有彩蛋
        addEggIfNeeded(tab);

        container.empty();

        const groupHtml = createGroupHtml(tab.panel);
        container.append(groupHtml);

        // renderTips()


    });


}

const  PRODUCTS_MAP = [

    // ========================================================
    // 一月尊享权益配置
    // ========================================================
    {id: 3175, code: 'xdrtxspyk', comment: '腾讯视频VIP会员月卡'},
    {id: 3201, code: 'xdraqyyk', comment: '爱奇艺黄金VIP月卡'},
    {id: 3257, code: 'xdrykyk', comment: '优酷VIP会员月卡'},
    {id: 3255, code: 'xdrblblyk', comment: '哔哩哔哩月度大会员'},
    {id: 3277, code: 'xdrwyyyk', comment: '网易云音乐黑胶VIP月卡'},
    {id: 3279, code: 'xdrxmlyyk', comment: '喜马拉雅会员月卡'},
    {id: 3237, code: 'xdrqqyylzyk', comment: 'QQ音乐豪华绿钻月卡'},
    {id: 3278, code: 'xdrkgyk', comment: '酷狗豪华VIP月卡'},
    {id: 3362, code: 'xdrkwyk', comment: '酷我音乐豪华VIP月卡'},
    {id: 3276, code: 'xdrzhyxhyyk', comment: '知乎盐选会员月卡'},
    {id: 3469, code: 'xdrwpscjhy', comment: 'WPS超级会员月卡'},
    {id: 3776, code: 'xdrmtsqb60', comment: '美团60元神券包'},
    {id: 3802, code: 'xdryybpc', comment: '爷爷不泡茶15元满减券'},


// --- 彩蛋权益 ---
    {id: 3432, code: 'xdrblblyk', comment: '哔哩哔哩月度大会员'},
    {id: 3463, code: 'xdrykyk', comment: '优酷VIP会员月卡'},
    {id: 3439, code: 'xdraqyyk', comment: '爱奇艺黄金VIP月卡'},
    {id: 3464, code: 'xdrtxspyk', comment: '腾讯视频VIP会员月卡'},
    {id: 3690, code: 'xdrxlknyk', comment: '迅雷白金会员月卡'},
    {id: 3691, code: 'xdrdyqsyk', comment: '抖音汽水音乐SVIP月卡'},
    {id: 3692, code: 'xdrelm63', comment: '淘宝闪购96元券包'},
    {id: 3693, code: 'xdrqqyylzyk', comment: 'QQ音乐豪华绿钻月卡'},
    {id: 3694, code: 'xdrxmlyyk', comment: '喜马拉雅会员月卡'},
    {id: 3695, code: 'xdrkgyk', comment: '酷狗豪华VIP月卡'},
    {id: 3696, code: 'xdrbwcjq', comment: '霸王茶姬20元满减券'},
    {id: 3697, code: 'xdrdylb', comment: '斗鱼1.8万鱼丸大礼包'},
    {id: 3481, code: 'xdrkd29', comment: '库迪咖啡29元饮品抵扣券'}, // 注：复用原库迪code，根据描述更新文案
    {id: 3449, code: 'xdrydyppyk', comment: '移动云盘钻石会员月卡'},

    {id: 3799, code: 'xdrwyyyk', comment: '网易云音乐黑胶VIP月卡'},
    {id: 3595, code: 'xdrwpscjhy', comment: 'WPS超级会员月卡'},
    {id: 3800, code: 'xdrxbklb', comment: '星巴克30元立减券'},
    {id: 3801, code: 'xdrmtsqb60', comment: '美团60元神券包'},
    {id: 3550, code: 'xdrnxdcq', comment: '奈雪的茶20元优惠满减券'},
    {id: 3820, code: 'xdrmtsqb60', comment: '美团60元神券包'},
    {id: 3821, code: 'xdryybpc', comment: '爷爷不泡茶15元满减券'},
    // --- 固定权益 TAB1 美食 ---
    {id: 3433, code: 'xdrxbklb', comment: '星巴克30元立减券'}, // 复用原星巴克code xdrxbklb
    {id: 3698, code: 'xdryybpc', comment: '爷爷不泡茶15元满减券'},
    {id: 3436, code: 'xdrbwcjq', comment: '霸王茶姬20元满减券'}, // 复用原霸王茶姬code xdrbwcjq
    {id: 3437, code: 'xdrkd29', comment: '库迪咖啡29元抵扣券'},
    {id: 3699, code: 'xdrelm63', comment: '淘宝闪购96元券包'},

    // --- 固定权益 TAB2 生活 ---
    {id: 3700, code: 'xdrmtsh60', comment: '美团神会员60元省钱包'},
    {id: 3440, code: 'xdrkeepyk', comment: 'Keep会员月卡'},
    {id: 3442, code: 'xdrmcyp50q', comment: '名创优品满50.01元减50元券'},
    {id: 3701, code: 'xdrxlknyk', comment: '迅雷白金会员月卡'},
    {id: 3441, code: 'xdrqqcjhyyk', comment: 'QQ超级会员月卡'}, // 复用原QQ超会code xdrqqcjhyyk

    // --- 固定权益 TAB3 娱乐 ---
    {id: 3453, code: 'xdrqqyylzyk', comment: 'QQ音乐豪华绿钻月卡'},
    {id: 3454, code: 'xdrkgyk', comment: '酷狗豪华VIP月卡'},
    {id: 3455, code: 'xdrwyyyk', comment: '网易云音乐黑胶VIP月卡'},
    {id: 3456, code: 'xdrkwyk', comment: '酷我音乐豪华VIP月卡'},
    {id: 3702, code: 'xdrdyqsyk', comment: '抖音汽水音乐SVIP月卡'},

    // --- 固定权益 TAB4 知识 ---
    {id: 3458, code: 'xdrwpscjhy', comment: 'WPS超级会员月卡'},
    {id: 3703, code: 'xdrqqydyk', comment: 'QQ阅读会员月卡'},
    {id: 3460, code: 'xdrxmlyyk', comment: '喜马拉雅会员月卡'},
    {id: 3461, code: 'xdrqmxsyk', comment: '七猫免费小说会员月卡'},
    {id: 3462, code: 'xdrzhyxhyyk', comment: '知乎盐选会员月卡'},


    // ========================================================
    // 历史权益 (保留用于旧数据兼容)
    // ========================================================
    // 十二月尊享权益配置 (12月新增及更新)

    {id: 3201, code: 'xdraqyyk', comment: '爱奇艺黄金VIP月卡'},
    {id: 3257, code: 'xdrykyk', comment: '优酷VIP会员月卡'},
    {id: 3279, code: 'xdrxmlyyk', comment: '喜马拉雅会员月卡'},
    {id: 3237, code: 'xdrqqyylzyk', comment: 'QQ音乐豪华绿钻月卡'},
    {id: 3277, code: 'xdrwyyyk', comment: '网易云音乐黑胶VIP月卡'},
    {id: 3469, code: 'xdrwpscjhy', comment: 'WPS超级会员月卡'},
    {id: 3537, code: 'xdrmcyp50q', comment: '名创优品满50.01元减50元券'},
    {id: 3470, code: 'xdrxbklb', comment: '星巴克30元立减券'},
    {id: 3776, code: 'xdrmtsqb60', comment: '美团60元神券包'},
    {id: 3536, code: 'xdrnxdcq', comment: '奈雪的茶20元优惠满减券'},

    // 十月/十一月彩蛋及固定权益遗留
    {id: 3482, code: 'xdrelmechk', comment: '淘宝闪购超级吃货卡月卡'},
    {id: 3487, code: 'xdrgm10', comment: '古茗10元立减券'},
    {id: 3484, code: 'xdrqmxsyk', comment: '七猫免费小说会员月卡'},
    {id: 3595, code: 'xdrwpscjhy', comment: 'WPS超级会员月卡'},
    {id: 3619, code: 'xdrzhyxhyyk', comment: '知乎盐选会员月卡'},
    {id: 3620, code: 'xdrkwyk', comment: '酷我豪华VIP月卡'},
    {id: 3621, code: 'xdrqqydyk', comment: 'QQ阅读会员月卡'},
    {id: 3642, code: 'xdrkeepyk', comment: 'Keep会员月卡'},
    {id: 3643, code: 'xdrdd10q', comment: '滴滴出行快车10元立减券'},
    {id: 3644, code: 'xdrxbk24', comment: '星巴克会员优享礼包'},
    {id: 3559, code: 'xdrsysxc20', comment: '书亦烧仙草20元立减券'},
    {id: 3560, code: 'xdrnxdcq', comment: '奈雪的茶20元满减券'},
    {id: 3561, code: 'xdrbwcjq', comment: '霸王茶姬20元满减券'},
    {id: 3562, code: 'xdrkdkkq', comment: '库迪咖啡20元抵扣券'},
    {id: 3563, code: 'xdrelmechk', comment: '淘宝闪购超级吃货卡月卡'},
    {id: 3564, code: 'xdrmtwm10', comment: '美团外卖10元通用红包'},
    {id: 3565, code: 'xdrxczjyk', comment: '汽车之家洗车服务会员月卡'},
    {id: 3566, code: 'xdrmcyp50q', comment: '名创优品满50.01减50元优惠券'},
    {id: 3567, code: 'xdrdd10q', comment: '滴滴出行快车10元立减券'},
    {id: 3568, code: 'xdrhldcyk', comment: '哈啰单车30天月卡'},
    {id: 3569, code: 'xdrqqyylzyk', comment: 'QQ音乐豪华绿钻月卡'},
    {id: 3570, code: 'xdrkgyk', comment: '酷狗豪华VIP月卡'},
    {id: 3571, code: 'xdrwyyyk', comment: '网易云音乐黑胶VIP月卡'},
    {id: 3572, code: 'xdrkwyk', comment: '酷我豪华VIP月卡'},
    {id: 3573, code: 'xdrkeepyk', comment: 'Keep会员月卡'},
    {id: 3574, code: 'xdrwpscjhy', comment: 'WPS超级会员月卡'},
    {id: 3575, code: 'xdrqqydyk', comment: 'QQ阅读会员月卡'},
    {id: 3576, code: 'xdrxmlyyk', comment: '喜马拉雅会员月卡'},
    {id: 3577, code: 'xdrqmxsyk', comment: '七猫免费小说会员月卡'},
    {id: 3578, code: 'xdrzhyxhyyk', comment: '知乎盐选会员月卡'},

    // 特殊用途或通用ID，保留
    {id: 9999, code: 'jd_click', comment: '特殊用途'},

    // 其他历史权益
    {id: 3445, code: 'xdrmt88q', comment: '美团团购88元券包'},
    {id: 3446, code: 'xdrddcx118', comment: '滴滴出行118元券包'},
    {id: 3447, code: 'xdrmt188', comment: '美团188元券包'},
    {id: 3450, code: 'xdrmgsyk', comment: '咪咕视频钻石会员月卡'},
    {id: 3175, code: 'xdrtxspyk', comment: '腾讯视频VIP月卡'},
    {id: 3255, code: 'xdrblblyk', comment: '哔哩哔哩月度大会员'},
    {id: 3469, code: 'xdrwpscjhy', comment: 'WPS超级会员月卡'},
    {id: 3276, code: 'xdrzhyxhyyk', comment: '知乎盐选会员月卡'},
    {id: 3362, code: 'xdrkwyk', comment: '酷我豪华VIP月卡'},
    {id: 3347, code: 'xdrqqydyk', comment: 'QQ阅读会员月卡'},
    {id: 3537, code: 'xdrmcyp50q', comment: '名创优品满50.01元减50元券'},
    {id: 3452, code: 'xdrassjyk', comment: 'AI速记50分钟月卡会员'},
    {id: 3448, code: 'xdrysjyk', comment: '中国移动云手机专业版月卡'},
    {id: 3451, code: 'xdrshbyk', comment: '中国移动守护宝AI升级版30天会员'},
    {id: 3479, code: 'xdrsmlhy', comment: '中免日上美力+会员卡'},
    {id: 3483, code: 'xdrdd10q', comment: '滴滴出行10元快车立减券'},
    {id: 3485, code: 'xdrkwyk', comment: '酷我音乐豪华VIP月卡'},
    {id: 3486, code: 'xdrkeepyk', comment: 'Keep会员月卡'},
    {id: 3546, code: 'xdrdylb', comment: '斗鱼1.8万鱼丸大礼包'},
    {id: 3549, code: 'xdrzhyxhyyk', comment: '知乎盐选会员月卡'},
    {id: 3550, code: 'xdrnxdcq', comment: '奈雪的茶20元优惠满减券'},
    {id: 3435, code: 'xdrnxdcq', comment: '奈雪的茶20元优惠满减券'},
    {id: 3438, code: 'xdrelmechk', comment: '淘宝闪购超级吃货卡月卡'},
    {id: 3443, code: 'xdrdd10q', comment: '滴滴出行10元快车立减券'},
    {id: 3444, code: 'xdrxczjyk', comment: '汽车之家洗车服务会员月卡'},
    {id: 3457, code: 'xdrdylb', comment: '斗鱼1.8万鱼丸大礼包'},
    {id: 3459, code: 'xdrydciyk', comment: '有道词典会员月卡'},
]


function getItemByCommentName(comment) {
    const products = PRODUCTS_MAP.filter(item => item.comment.includes(comment));
    return products ? products : null;
}

function getProductClassNameById(id) {
    const product = PRODUCTS_MAP.find(item => item.id === id);
    return product ? product.code : '';
}

const isDev = window.location.href.includes('_dev')


function initTabs(tabData) {

    let currenDate = pageData.currentDate
    const xdrNormalTime = calculateXdrNormalTime()
    console.log('xdrNormalTime', xdrNormalTime)

    tabData.map((tab => {
        tab.isLeft = true
        tab.isRight = false
        tab.startDate = xdrNormalTime.beginTime;
        tab.endDate = xdrNormalTime.endTime;
        tab.panel.items.map((item) => {
            // 是星动日权益
            item.isXdrqy = false;
        })
    }));
    // 副作用
    processTabsData(tabData, currenDate)


    const currentDateStr = dayjs(currenDate).format('YYYYMMDD');

    console.log('currentDate', dayjs(currenDate).format('YYYYMMDD HH:mm:ss'))

    renderTabs(tabData, currentDateStr);

    // renderGetModule()
}

function renderGetModule() {
    const $container = $('.level-award-center.tab-box');
    if ($('.level-award-get').length > 0) {
        return
    }
    const getModule = $(`<div class="level-award-get rowBC">
                <div class="get-count rowSC">
                    <div class="board-cast"></div>
                    以下权益本月可领次数：<span class="get-count-num">0次</span></div>
                <a class="watch-record">查看领取记录</a>
            </div>`)
    $container.append(getModule);
}

function renderTips() {
    const $container = $('.level-award-center.tab-box');
    // 避免重复渲染
    if ($('.level-award-tips').length > 0) {
        return;
    }
    const tips = $(`<div class="level-award-tips">
                *活动期间每日10点补库存，权益仅限全球通银卡及以上客户领取
            </div>`)
    $container.append(tips);

}

// 处理tab数据方便后续展示用
function processTabsData(tabData, currentDate) {
    // 使用 dayjs 格式化当前日期为 YYYYMMDD 格式
    const currentDateStr = dayjs(currentDate).format('YYYYMMDD');

    const currentDateObj = dayjs(currentDate)
    // 为每个item添加isFirstDay属性
    tabData.forEach(item => {
        item.isFirstDay = item.startDate === currentDateStr;
        item.isLastDay = item.endDate === currentDateStr;
    });

    // 设置进行中
    tabData.forEach(item => {
        const startDate = item.startDate;
        const endDate = item.endDate;
        const startDay = dayjs(startDate, 'YYYYMMDD');
        const endDay = dayjs(endDate, 'YYYYMMDD');
        const panelItems = item.panel.items || []


        if (currentDateObj.isBefore(startDay, 'day')) {
            item.isNoStart = true; // 待开始
        } else if (currentDateObj.isAfter(endDay, 'day')) {
            item.isEnd = true;
        } else {
            item.isProcessing = true
        }

        panelItems.map(panelItem => {
            panelItem.isReceived = USER.prodList.some(id => id == panelItem.id);

            panelItem.isEnd = item.isEnd
            panelItem.isNoStart = item.isNoStart
            if (panelItem && panelItem.isXdrqy) {
                panelItem.stock = panelItem.isEnd ? 100 : panelItem.stock
            }
            if (panelItem.isRandom && LOGIN_STATUS) {
                if (isCollectableTimesZero()) {
                    panelItem.class = 'jd_click_r'
                    panelItem.clickType = CLICK_TYPE.ylq
                } else {
                    panelItem.class = 'jd_click'
                    panelItem.clickType = CLICK_TYPE.ljlq

                }
            }
        })


    })


}


// 能够获取的时间
function isCanReceive(date) {
    if (!date) {
        return false;
    }
    // return  true
    const currentDate = dayjs(date);
    const currentHour = currentDate.hour();
    // 如果当前时间在0点到10点之间，则不能领取
    if (currentHour >= 0 && currentHour < 10) {
        return false;
    }
    // 如果当前时间在10点之后，则可以领取
    if (currentHour >= 10) {
        return true;
    }


}

// 领取次数为0
function isCollectableTimesZero() {
    // 检查用户是否有可领取的权益
    return USER.enjoycollectabletimes == 0
}

// 1 禁用 2 立即领取 3 更多好礼
const CLICK_TYPE = {
    'yqw': '1',
    'ljlq': '2',
    'gdhl': 3,
    'sdkq': '4', // 10点开抢
    'ylq': '5' //已领取
}

// 创建奖励组HTML
function createGroupHtml(panel) {
    let items = [];

    if (panel.type === 'picture') {
        let $itemHtml = createPictureHtml(panel);
        items.push($itemHtml);
    } else if (panel.items && panel.items.length > 0) {
        panel.items.forEach((item, itemIndex) => {
            let $itemHtml = createItemHtml(item, itemIndex);
            items.push($itemHtml);
        });
    }

    return items; // 只返回内容项
}

function createPictureHtml(panel) {
    const pictureClass = panel.picture
    let $html = $(`<div class="picture-item ${pictureClass}"></div>`);


    $html.data('item', panel)
    return $html;
}


function addEggIfNeeded(tab) {
    const haveRandom = tab.panel.items.some(item => item.isRandom);

    if (haveRandom) return
    // 如果没有彩蛋 手动添加彩蛋
    const eggItem = {
        id: 9999,
        transferable: 1,
        levelable: "1,2,3,4,8",
        stock: 0,
        status: 0,
        qyName: "彩蛋",
        isRandom: true,
        class: 'jd_click',
        showPercent: false,
        showButton: false,
        tabId: tab.id
    };


    if (isCollectableTimesZero() && LOGIN_STATUS) {
        eggItem.class = 'jd_click_r';
        if (isFeiQuan()) {
            eggItem.class = 'jd_click'
        }
    }
    tab.panel.items.unshift(eggItem); // 将彩蛋放在第一位
}

// 创建单个item的HTML
function createItemHtml(item, groupIndex, itemIndex) {
    let received = item.isReceived ? 'received' : '';

    let $html = $(`<div class="item ${item.class} ${received}" data-group="${groupIndex}" data-tab-id="${item.tabId}" data-product-id=${item.id}">`);

    const isZero = item.stock == 0;
    const isOneHundred = item.stock == 100;
    const haveStock = item.stock < 100
    if (item.showPercent !== false) {
        const isHighlight = isZero || isOneHundred

        let highlightClass = isHighlight ? ' high-light' : '';
        // 百分比显示
        const $percent = $(`<div class="rowCC percent-base${highlightClass}">已领:${item.stock}%</div>`);
        $html.append($percent);
        const isNoOpenRandom = item.id == 9999

        if (!isNoOpenRandom && item.isRandom) {
            const $jdPrefix = $(`<div class="jd_prefix"></div>`);
            $html.append($jdPrefix);

            if (!isCollectableTimesZero()) {
                const $jdLimitTxt = $(`<div class="jd_limit_txt"></div>`);
                $html.append($jdLimitTxt);
            }
        }


    }
    const isNoOpenRandom = item.id == 9999
    const isReceived = item.isReceived

    // 按钮显示
    if (item.showButton !== false) {

        // 其次的 本日抢完、10点再抢、10点开抢、立即领取、
        // 更多好礼按钮待定，如果领取次数为0则是更多好礼
        const currenDate = pageData.currentDate

        const isCanReceiveFlag = isCanReceive(currenDate);

        let buttonClass = ""
        // 本日抢完
        const todayDone = isOneHundred
        //  已抢完
        const allDone = item.isLastDay && isOneHundred
        // 10点开抢
        const tenStart = item.isFirstDay && isCanReceiveFlag
        // 10点再抢
        const tenAgainStart = !item.isFirstDay && !isCanReceiveFlag
        // 更多好礼
        const morePrize = USER.enjoycollectabletimes == 0
        //  立即领取
        const immediateReceive = isCanReceiveFlag && !isOneHundred
        // 1 禁用 2 立即领取 3 更多好礼1
        //  betweenZeroAndTen = true
        const isRandom = item.isRandom
        const isEnd = item.isEnd

        if (isRandom) {
            if (isCollectableTimesZero()) {
                // 如果没次数了 下月再领
                if (isFeiQuan()) {
                    buttonClass = 'ljlq'
                    item.clickType = CLICK_TYPE.ljlq
                } else if (item.isReceived) {
                    buttonClass = 'ylq'
                    item.clickType = CLICK_TYPE.ylq
                } else {
                    buttonClass = 'xyzl'
                    item.clickType = CLICK_TYPE.ylq
                }

            } else if (item.stock < 100) {
                buttonClass = 'ljlq'
                item.clickType = CLICK_TYPE.ljlq
            } else if (allDone) {
                buttonClass = 'yqg'
                item.clickType = '1'
            } else if (todayDone) {
                buttonClass = 'brqw'
                item.clickType = '1'
            } else if (tenStart) {
                buttonClass = "sdkq"
                item.clickType = '1'
            } else if (tenAgainStart) {
                buttonClass = 'sdzq'
                item.clickType = '1'
            }
        } else {

            const isProcessing = item.isProcessing
            const isNoStart = item.isNoStart
            if (isCollectableTimesZero()) {
                if (isFeiQuan()) {
                    buttonClass = 'ljlq'
                    item.clickType = CLICK_TYPE.ljlq
                } else if (item.isReceived) {
                    buttonClass = 'ylq'
                    item.clickType = CLICK_TYPE.ylq
                } else if (item.isXdrqy) {
                    //        无次数 是心动日权益 下月再领
                    buttonClass = 'xyzl'
                    item.clickType = CLICK_TYPE.ylq
                } else {
                    buttonClass = 'xyzl'
                    item.clickType = CLICK_TYPE.ylq
                }

            } else if (item.isXdrqy) {
                //        有次数 是心动日权益 立即领取
                buttonClass = 'ljlq'
                item.clickType = CLICK_TYPE.ljlq
            } else if (item.isFirstDay && !isCanReceiveFlag) {
                buttonClass = 'sdkq'
                item.clickType = '4'
            } else if (!item.isFirstDay && !isCanReceiveFlag) {
                if (haveStock) {
                    buttonClass = 'ljlq'
                    item.clickType = '2'
                } else {
                    buttonClass = 'sdzq'
                    item.clickType = '1'
                }
            } else if (immediateReceive) {
                buttonClass = 'ljlq'
                item.clickType = '2'
            } else if (allDone) {
                buttonClass = 'yqg'
                item.clickType = '1'
            } else if (todayDone) {
                buttonClass = 'brqw'
                item.clickType = '1'
            } else if (tenStart) {
                buttonClass = "sdkq"
                item.clickType = '1'
            } else if (tenAgainStart) {
                buttonClass = 'sdzq'
                item.clickType = '1'
            }
        }
        if (!LOGIN_STATUS) {
            buttonClass = 'ljlq'
            item.clickType = '1'
        }

        item.buttonClass = buttonClass
        const $btnBase = $(`<div class="btn-base ${buttonClass}"></div>`);
        $html.append($btnBase);
    }


    $html.data('item', item)
    return $html;
}

// 是非全
function isFeiQuan() {
    // -1非移动，0普卡，1银卡，2黄金，3白金，4钻石，7非全，8卓越钻，11体验
    // 0普卡
    const arr = ['0', '1', '2', '3', '4', '8']
    let result = true
    if (arr.includes(USER.userLevel)) {
        result = false
    }
    return result
}

function isTabReceived(tab) {
    return tab.panel.items.some(panelItem => {
        return USER.prodList.some(id => id == panelItem.id);
    })
}

function renderTabs(tabs, currentDateStr) {
    const $container = ensureContainer('.level-award-tabs', '.level-award-center');

    $container.empty(); // 清空现有选项卡

    if (!currentDateStr || currentDateStr.length !== 8 || isNaN(parseInt(currentDateStr))) {
        $container.html('<p style="color:red; text-align:center;">输入的日期格式无效，请输入YYYYMMDD格式。</p>');
        return;
    }

    const currentDateObj = dayjs(currentDateStr);
    tabs.forEach(tabInfo => {
        const startDate = tabInfo.startDate;
        const endDate = tabInfo.endDate;

        const startDay = dayjs(startDate, 'YYYYMMDD');
        const endDay = dayjs(endDate, 'YYYYMMDD');

        let statusClass = 'yjs'; // 默认为待开始/已结束

        let tabActiveClass = tabInfo.id == activeTab ? 'active' : '';

        let isNoStart = false;

        // 使用 dayjs 的比较方法

        if (currentDateObj.isBefore(startDay, 'day')) {
            statusClass = 'dks'; // 待开始
            isNoStart = true; // 待开始
        } else if (currentDateObj.isAfter(endDay, 'day')) {
            // 版本改动没有已结束，都改成一样的
            statusClass = 'dks'; // 已结束
        } else {
            // 版本改动没有已结束，都改成一样的
            statusClass = 'dks'; // 进行中
        }


        // 如果需要为已结束的活动显示不同文本，可以在这里调整
        const tabStatusClass = `${tabInfo.code}_${statusClass}`;

        const tabHtml = `
                        <div class="level-award-tab colCC ${tabStatusClass} ${tabActiveClass}">
                        </div>
                    `;
        const $tabHtml = $(tabHtml);

        $tabHtml.attr('data-tab-id', tabInfo.id);
        $container.append($tabHtml);
        // 设置tab居中
        if (tabInfo.isProcessing) {
            // no smooth
            setTimeout(() => {
                // $tabHtml[0].scrollIntoView({
                //     behavior: 'auto',
                //     block: 'center',
                //     inline: 'center'
                // })

            }, 50)

        }

    });


}

function centerActiveTab() {
    const tabsContainer = document.querySelector('.level-award-tabs');
    const activeTab = document.querySelector('.level-award-tab.active');

    if (!tabsContainer || !activeTab) return;

    // 方法1：现代浏览器
    if (CSS.supports('scroll-behavior', 'smooth')) {
        try {
            activeTab.scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'center'
            });
            return;
        } catch (e) {
            console.log('scrollIntoView center not supported');
        }
    }

    // 方法2：手动计算（兼容性方案）
    const containerRect = tabsContainer.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const targetScrollLeft = tabsContainer.scrollLeft +
        (tabRect.left - containerRect.left) -
        (containerRect.width - tabRect.width) / 2;

    tabsContainer.scrollTo({
        left: targetScrollLeft,
        behavior: 'auto'
    });
}

/**
 * 确保容器存在，不存在则创建
 * @param {string} containerSelector - 容器选择器
 * @param {string} parentSelector - 父容器选择器
 * @returns {jQuery} 容器jQuery对象
 */
function ensureContainer(containerSelector, parentSelector = 'body') {
    let $container = $(containerSelector);

    if ($container.length === 0) {
        console.log('📦 容器不存在，正在创建:', containerSelector);

        // 从选择器提取class名
        const className = containerSelector.replace('.', '');

        // 创建容器
        $container = $(`<div class="${className}"></div>`);

        // 添加到父容器
        const $parent = $(parentSelector);
        if ($parent.length > 0) {
            $parent.append($container);
            console.log('✅ 容器已创建并添加到:', parentSelector);
        } else {
            console.error('❌ 父容器不存在:', parentSelector);
            $('body').append($container); // 降级到body
        }
    }

    return $container;
}

// 跳转组队活动页面
function jumpGroup(button) {
    // https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/inviteActive.html
    if (LOGIN_LEVEL == 0) {
        utils.addOpeartionsClickLog({
            button: "未登录_" + button
        });
        $("#popLoginSelect").show(); // 登陆弹窗
        return;
    }
    if (window.location.host === "qqt.cmicrwx.cn") {//正式
        var host = window.location.href
        console.log("hosthosthost" + host)
        if (host.match(/huido/i) == 'huido') {
            var url = "https://qqt.cmicrwx.cn/2016tyjf_huido/xhmqqthy/res/wap/inviteActive.html?num=" + Math.random() + "&sspId=" + getSspId();
        } else {
            var url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/inviteActive.html?num=" + Math.random() + "&sspId=" + getSspId();
        }
    } else {//测试
        var url = "https://qyzx.zone139.com/2016tyjf_dev/xhmqqthy/res/wap/inviteActive.html?num=" + Math.random() + "&sspId=" + getSspId();
    }
    utils.addButtonClickLogAndRedirect(button, url);

}

function addItemEvent() {
    // 领取权益按钮
    // 事件委托 #NormalPrizeList
    $('#NormalPrizeList').off()

    $('#NormalPrizeList').on('click', '.btn-base', function (e) {
        e.stopPropagation(); // 阻止事件冒泡到父元素
        const item = $(this).closest('.item').data('item') || {}
        console.log('常态化首页-领取权益按钮', item)
        const clickType = item && item.clickType;
        if (!getLoginStatus()) {
            utils.addOpeartionsClickLog({
                button: "未登录_" + '点击立即领取',
                dynamicButton: item.id
            });
        } else if (clickType == CLICK_TYPE.ljlq) {
            // 立即领取点击1
            QY_ITEM = item
            getEquities(item.id, item.transferable, item.levelable, item)
        } else if (clickType == CLICK_TYPE.gdhl) {
            jumpGroup()
        } else if (item.isRandom) {
            // 不是彩蛋
            const noRandom = item.id !== 9999
            if (noRandom) {
                // getEquitiesDetails(item.id, item.transferable, item.levelable, false, false, item.stock)
            }
        } else if (isFeiQuan()) {
            sdtc_tz()
        }


    })

    $('.area-cloud-phone').click(function () {
        const item = {
            id: 3596,
            transferable: 0,
            levelable: '1,2,3,4,8',
            stock: 10,
            status: 0,
            qyName: '中国移动云手机专业版日卡',
            isRandom: false,
            hideRefill: true,
            class: 'cloud-phone'
        }
        let click = 1
        const cloudPhone = safeGet(pageData, 'cloudPhoneModule', null);
        if (cloudPhone) {
            const state = cloudPhone.state;
            // 2：已领取
            // 3：无法参与
            // 4：无库存
            item.isCouldReceived = false
            if (state.isNoStock) {
                item.stock = 100
                click = 0
            } else if (state.isReceived) {
                click = 0
                item.isCouldReceived = true
            } else if (state.isNoJoin) {
                click = 0
            }
        }

        QY_ITEM = item

        if (!getLoginStatus()) {
            utils.addOpeartionsClickLog({
                button: "未登录_" + '点击权益详情',
                dynamicButton: item.id
            });
        } else if (isFeiQuan()) {
            notCMCC2Jump()
        } else {
            getEquitiesDetails(item.id, item.transferable, item.levelable, false, false, item.stock, click, item)
        }

    });
    // 领取权益详情
    $('#NormalPrizeList').on('click', '.item', function (e) {
        const item = $(this).data('item') || {}
        QY_ITEM = item
        popDetail(item)
    });

    function popDetail(item) {
        console.log("常态化首页-领取权益详情1");
        console.log('itemDetailCLick', item)
        const clickType = item.clickType;
        const text = isCollectableTimesZero() ? '无领取次数' : '有领取次数'
        utils.addOpeartionsClickLog({
            button: `常态化首页-${text}点击权益详情`,
            dynamicButton: item.id
        })
        if (!getLoginStatus()) {
            utils.addOpeartionsClickLog({
                button: "未登录_" + '点击权益详情',
                dynamicButton: item.id
            });
        } else if (isFeiQuan()) {
            notCMCC2Jump()
        } else if (clickType == CLICK_TYPE.ljlq) {
            QY_ITEM = item
            // 立即领取点击
            // 0 未领 1 自己领了 2 转增了
            const isReceived = item.status == 1
            const isTransferreceive = item.status == 2
            const isCanReceiveFlag = isCanReceive(new Date());

            getEquitiesDetails(item.id, item.transferable, item.levelable, false, false, item.stock, true, item)
        } else if (clickType == CLICK_TYPE.gdhl) {
            jumpGroup()
        } else if (item.isRandom) {

            // 是真的的权益彩蛋 2
            const isRealRandom = item.id !== 9999
            if (isRealRandom) {
                const click = isCollectableTimesZero() ? 0 : undefined

                getEquitiesDetails(item.id, item.transferable, item.levelable, false, false, item.stock, click, item)

            } else if (isCollectableTimesZero()) {
                console.log('没有彩蛋领取次数了')
                utils.addOpeartionsClickLog({
                    button: '常态化首页-无领取次数点击彩蛋详情',
                })
            } else {
                let isExpire = pageData.jdConfirmModule.checkJdDailyLimit()

                if(isExpire){
                    showModal($('.jdConfirm'))
                }else{
                    getRandomQy(item)
                }

            }
            // throttleTimer(getRandomQy, 2000)(item)
        } else if (clickType == CLICK_TYPE.yqw) {
            // 已抢完
            getEquitiesDetails(item.id, item.transferable, item.levelable, false, false, item.stock, undefined, item)

        } else if (clickType == CLICK_TYPE.sdkq) {
            // 10点开抢
            getEquitiesDetails(item.id, item.transferable, item.levelable, false, false, 100, false, item)

        } else if (clickType == CLICK_TYPE.ylq) {
            getEquitiesDetails(item.id, item.transferable, item.levelable, false, false, item.stock, 0, item)
        }

    }


}


/**
 * 定时器版本节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 时间间隔(毫秒)
 * @returns {Function} 节流后的函数
 */
function throttleTimer(func, delay) {
    let timeoutId = null;

    return function (...args) {
        if (!timeoutId) {
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                timeoutId = null;
            }, delay);
        }
    };
}

let isClick = false

function getRandomQy(item) {

    // 1、把页面渲染的菜单item找出


    // 2、把调用接口的数据设置到这个item中
    // 假设调用接口了
    const mockData = {
        "msg": "成功",
        "data": {
            "id": 3433,
            "transferable": 1,
            "levelable": "1,2,3,4,8",
            "stock": 0,
            "status": 0,
            "qyName": "哔哩哔哩月度大会员",
            "isRandom": true,
            "phase": "4"
        },
        "status": "1"
    }
    let p = new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve(mockData);
        }, 2000)
    })

    if (isClick) return
    isClick = true
    $('.jd_anime').show()
    // 1、获取到item对应的dom，给dom修改类名
    const $item = $(`.item.jd_click`);
    $item.removeClass('jd_click').addClass('jd_anime');

    p = queryGetRandomQy()
    p.then(function (res) {
        console.log('getRandomQy res', res)
        setTimeout(() => {
            if (res.status === '1') {
                // 更新页面数据
                // 播放动画
                const resData = res.data;
                Object.assign(item, resData)
                const tab = getTabById(item.tabId);
                console.log('tab1====>', tab)
                utils.addOpeartionsClickLog({
                    button: '常态化首页-点击敲彩蛋',
                    dynamicButton: item.id
                })
                item.class = getProductClassNameById(resData.id) || 'jd_click', // 设置图标
                    item.showButton = true
                item.showPercent = true
                isClick = false
                // 重新渲染列表
                renderPanels(item.tabId, true);
                $('.jd_anime').hide()
                //     恢复
                // const $item = $(`.item[data-product-id="${item.id}"]`);

                // $item.removeClass('jd_anime').addClass(item.class);

            } else {
                utils.toast("活动火爆，请刷新后再试");
                item.class = 'jd_click'// 设置图标
                isClick = false
                item.showButton = false
                item.showPercent = false
                $item.removeClass('jd_anime').addClass('jd_click')

            }
        }, 2000)

    }).catch(function (err) {
        console.error('获取彩蛋权益失败:', err);
        utils.toast("活动火爆，请刷新后再试");
        setTimeout(() => {
            isClick = false
            $("body").css("overflow", "auto");
            item.class = 'jd_click'// 设置图标
            item.showButton = false
            item.showPercent = false
            $item.removeClass('jd_anime').addClass('jd_click');

        }, 2000)

    });

    // 3、重新渲染列表
}

// 访问协议：post
// 接口名称：/normal/initNormalQy
// 请求参数（url参数）
// 参数名称	描述	类型	备注
// productId	权益id	Integer	必要
// isRandom	是否彩蛋	Integer	必要
// receivePhone	赠送权益号码	String	非必要
// channelCode	渠道号	Integer	必要
// sourece	来源	String	非必要

function queryInitNormalQy(reqData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: ctx + '/normal/initNormalNewQy',
            type: 'post',
            dataType: "json",
            data: reqData,
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function queryNormalProdList(reqData) {
    const random = {
        "id": 3445,
        "transferable": 1,
        "levelable": "1,2,3,4,8",
        "stock": 5,
        "status": 0,
        "qyName": "美团团购88元券包",
        "isRandom": true,
        "phase": 2
    }
    const random2 = {
        ...random,
        phase: '1',
    }
    const data = {
        "msg": "成功",
        "data": {
            "phase": "2",
            "prodList": [
                random,
                random2,
                {
                    "id": 3440,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 100,
                    "status": 0,
                    "qyName": "Keep会员月卡",
                    "isRandom": false,
                    "phase": "2"
                },
                {
                    "id": 3441,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 4,
                    "status": 0,
                    "qyName": "QQ超级会员月卡",
                    "isRandom": false,
                    "phase": "2"
                },
                {
                    "id": 3442,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 10,
                    "status": 0,
                    "qyName": "名创优品满50.01元减50元券",
                    "isRandom": false,
                    "phase": "2"
                },
                {
                    "id": 3443,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 11,
                    "status": 0,
                    "qyName": "滴滴出行快车10元满减券",
                    "isRandom": false,
                    "phase": "2"
                },
                {
                    "id": 3444,
                    "transferable": 1,
                    "levelable": "1,2,3,4,8",
                    "stock": 4,
                    "status": 0,
                    "qyName": "汽车之家洗车服务会员月卡",
                    "isRandom": false,
                    "phase": "2"
                }
            ]
        },
        "status": "1"
    }
    const p = new Promise((resolve) => {
        resolve(data);
    })
    // return  p
    return new Promise((resolve, reject) => {
        $.ajax({
            url: ctx + '/normal/normalNewProdList',
            type: 'get',
            data: reqData,
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

function queryGetRandomQy() {
    console.log('queryGetRandomQy',)
    return new Promise((resolve, reject) => {
        $.ajax({
            url: ctx + '/normal/getNewRandomQy',
            type: 'post',
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject(err);
            }
        });

    });

}

function isTestPage() {
    return window.location.href.includes('aXdrNormalTest.html');
}

function bindEvent() {
    $(document).on('xdrProtocol:logout', function () {
        logout()
    });
    $(document).on('xdrSign:refresh', function () {
        console.log('xdrSign:refresh event triggered1');
            assertValid()
        if (pageData.topTab === 'right') {
            console.log('当前为心动日刷新不渲染');
            return
        } else if (pageData.localChange) {
            console.log('本地切换不渲染');
            return;
        }
        //     activeId 根据对应的id trriger 对应的data-tab-id的tab

        //    根据实时时间调整数据
        processTabsData(tabData, pageData.currentDate);
        // 重新渲染对应的tab
        renderPanels(activeTab);
    });

    $('.level-module').off().on('click', '.float-btn', function () {
        const $this = $(this);
        const type = $this.data('type');
        utils.addOpeartionsClickLog({
            button: "常态化首页-点击悬浮按钮",
            dynamicButton: type
        });
        const $btn = $(`.level-award-center .${type}-btn`)
        $btn.trigger('click');

    })
    // const $btn  =   $(`.level-award-center .right-btn`)
    // $btn.trigger('click');
    $('.level-award-center').off().on('click', '.center-btn', function () {
        const $this = $(this);
        const type = $this.data('type');
        // if is right add right classname to parent
        setPageData('topTab', type)
        $('.level-award-list').hide();
        $('.float-btn').hide()
        if (type == 'right') {
            $('.float-btn.left').show()
            $this.parent().addClass('right');

            let noStart = $('.level-award-center').data('isNoStart');
            if (isTestPage()) {
                noStart = false
            }
            const elementToShow = noStart ? '#XdrNotStartList' : '#XdrPrizeList';
            $(elementToShow).show();

            if (noStart) {
                pageData.noStartSwiper && pageData.noStartSwiper.destroy(true, true);
                renderNotStartSwiper()
            } else {
            }

        } else {
            $('.float-btn.right').show()
            $this.parent().removeClass('right');
            $('#NormalPrizeList').show();
        }
        utils.addOpeartionsClickLog({
            button: "常态化首页-点击tab",
            dynamicButton: type
        });
        console.log('$this', type)
    })
    // 活动规则
    $(".normal-rule").off().click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-点击活动规则"
        });
        $('#activityRulePop').show();
        $("body").css("overflow", "hidden");
        tcopen()
    })
    $('#activityRulePop .closeBtn').click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-关闭活动规则"
        });
        const haveLength = Object.keys($('#activityRulePop').data()).length > 0;
        if (haveLength) {
            return
        }
        hideModal($('#activityRulePop'))
    });
//     星邀好友
    $(".level-invite").find('.friend').click(function () {
        console.log("常态化首页-点击星邀好友");

        if (!getLoginStatus()) {
            return;
        }
        if (isFeiQuan()) {
            utils.addOpeartionsClickLog({
                button: "常态化首页-非全点击星邀好友"
            });
            notCMCC2Jump()
            return
        }

        // https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/inviteActive.html
        jumpGroup("常态化首页-点击星邀好友")
    });
    // .watch-record
    $('.watch-record').off().click(function () {
        if (LOGIN_LEVEL == 0) {
            utils.addOpeartionsClickLog({
                button: "未登录_" + "常态化首页-查看领取记录"
            });
            unLogin()
            return;
        }
        const goPage = 'zx'
        if (window.location.host === "qqt.cmicrwx.cn") {//正式
            var host = window.location.href
            console.log("hosthosthost" + host)
            if (host.match(/huido/i) == 'huido') {
                var url = "https://qqt.cmicrwx.cn/2016tyjf_huido/xhmqqthy/res/wap/html/index2Myqy.html?num=" + Math.random() + "&sspId=" + getSspId() + '&goPage=' + goPage;
            } else {
                var url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/html/index2Myqy.html?num=" + Math.random() + "&sspId=" + getSspId() + '&goPage=' + goPage;
            }
        } else {//测试
            var url = "https://qyzx.zone139.com/2016tyjf_dev/xhmqqthy/res/wap/html/index2Myqy.html?num=" + Math.random() + "&sspId=" + getSspId() + '&goPage=' + goPage;
        }
        utils.addButtonClickLogAndRedirect("常态化首页-查看领取记录", url);
    });

    addItemEvent()
    // 关闭弹窗按钮
    $('.qxcloseBtn').bind('click', function () {
        // utils.addOpeartionsClickLog({
        //     button: "关闭"
        // });
        //滑动条回到顶部
        console.log('$(\'#activityRulePop\').data()', $('#activityRulePop').data())

        const haveLength = Object.keys($('#activityRulePop').data()).length > 0;
        if (haveLength) {
            return
        }
        $('#tk_cont_id').scrollTop(0);
        // $('.layout').hide();
        // #tk_xq
        $('#tk_xq').hide();
        // $('#mask').hide();
        $("body").css("overflow", "auto");
        tcclose();
    });

    $('.togoQqt').click(function (event) {
        utils.addOpeartionsClickLog({
            button: "常态页-非全球通弹窗：了解全球通按钮"
        });
        gosdUrl();
    });

    $(".getTips-close").bind('click', function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-非全弹窗关闭:关闭按钮"
        });
        $(".getTipsPop,.layout").hide();
        $("body").css("overflow", "auto");
        tcclose();
    });
    $(".sdTips-close").bind('click', function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-普卡弹窗关闭:关闭按钮"
        });
        $(".sdPop,.layout").hide();
        $("body").css("overflow", "auto");
        tcclose();
    });

    $('#activityRuleClose').bind('click', function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-已阅读并同意:活动规则"
        });
        console.log('$(\'#activityRulePop\').data()', $('#activityRulePop').data())
        const haveLength = Object.keys($('#activityRulePop').data()).length > 0;
        if (haveLength) {
            return
        }
        // $('.tc_20').hide();
        hideModal($('#activityRulePop'))
        const $gzAgreeBtn = $('.gz-mask .zltc20-btn1')
        $gzAgreeBtn.trigger('click')
        isSelectioned = true;
        $(".checkInfo i,.checkInfo_new i").removeClass("disCheck").addClass("checked");
        getsaveRecord(13);
    });
    // .ljlq-closeBtn
    $('.ljlq-closeBtn').bind('click', function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-立即领取弹窗关闭:关闭按钮"
        });
        hideModal($('#dv_lqzz'))
    })

    //规则弹框，选择同意或XXX
    $(".sec_but").bind("click", function () {
        isrule = true;
        isjfrule = false;
        $("#activityRulePop").show();
        $('#activityRulePop .txtCon').scrollTop(0);
    });
    //规则弹框，选择同意或XXX
    $(".sec_but_jf").bind("click", function () {
        isrule = true;
        isjfrule = true;
        $("#activityRulePop").show();
        $('#activityRulePop .txtCon').scrollTop(0);
    });
    //规则弹框，选择同意或XXX
    $(".sec_butxq").bind("click", function () {
        console.info("打印打印权益id", PRODUCT_ID)
        isrule = true;
        $(".h870 ").hide();
        $(".rulePop_xq").show();
        $('.rulePop_xq .txtCon').scrollTop(0);
        utils.addOpeartionsClickLog({
            button: "已阅读并同意"
        });
    });
    $(".closeBtn_xq").bind("click", function () {
        utils.addOpeartionsClickLog({
            button: "阅读规则:详情弹窗关闭按钮"
        });
        $(".rulePop_xq").hide();
        $(".h870").show();
    });
    //阅读并同意规则:详情弹窗
    $("#yydtyxq").bind("click", function () {
        utils.addOpeartionsClickLog({
            button: "阅读并同意规则:详情弹窗"
        });
        $(".rulePop_xq").hide();
        $(".h870").show();
        $(".checkInfo_new i").removeClass("disCheck").addClass("checked");
        isSelectioned = true;
        // luckDrawAgreement.addClass('selected');
        getsaveRecord(13);
    });
    //阅读并同意规则:活动规则弹窗
    $(".closeBtn_rulePop_2").bind('click', function () {
        $(".rulePop_2").hide();
        $(".layout").show();
        utils.addOpeartionsClickLog({button: "九宫格权益规则关闭按钮"});
    });
    //阅读并同意规则:活动规则弹窗
    $("#yydty").bind('click', function () {
        $(".checkInfo_new i").removeClass("checked").removeClass("disCheck").addClass("checked");
        $(".rulePop_2").hide();
        if (isjfrule) {
            if (jfShowType == 1) {
                $('#jfConfirmPop').show();
            } else {
                $('#jfxqPop').show();
            }
            utils.addOpeartionsClickLog({button: "积分权益规则阅读与同意"});
        } else {
            $(".layout").show();
            utils.addOpeartionsClickLog({button: "九宫格权益规则阅读与同意"});
        }
        isSelectioned = true;
        // luckDrawAgreement.addClass('selected');
        getsaveRecord(13);
        isjfrule = false;
    });
    //选择 阅读并同意本次星动日, 要两个地方同时更新
    $(".checkInfo i,.checkInfo_new i").off().bind("click", function () {
        if ($(this).hasClass("disCheck")) {
            $(".checkInfo i,.checkInfo_new i").removeClass("disCheck").addClass("checked");
            utils.addOpeartionsClickLog({
                button: "同意规则协议"
            });
            isSelectioned = true;
            // luckDrawAgreement.addClass('selected');
            getsaveRecord(13);
        } else {
            $(".checkInfo i,.checkInfo_new i").removeClass("checked").addClass("disCheck");
            utils.addOpeartionsClickLog({
                button: "不同意规则协议"
            });
            isSelectioned = false;
            // luckDrawAgreement.removeClass('selected');
        }
    });

    $('.qqtzq').click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-点击全球通专区"
        });

        goQqtzq()

    })


    $('.user-info .card').click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-点击等级卡标签"
        });

        goQqtzq()
    })

    $('#level-ai').off().on('click', '.clickable-area', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // 获取区域名称
        const areaName = $(this).data('area');
        const noProcess =['中国移动云手机会员','移动云盘钻石会员']

        if (noProcess.includes(areaName)) return
        // 在控制台打印点击的区域信息
        console.log(`🎯 点击区域: ${areaName}`);
        const map = {
            '移动云盘钻石会员': {
                url: 'https://m.mcloud.139.com/portal/cloudCircle/index.html?path=caiyunviporder&sourceid=1044&enableShare=1',
            },
            'AI精转换': {
                url: 'https://yun.139.com/ai-helper-h5/?channel=1040016&storeId=410005&adVt=21427&token=#ssoToken#&source=410005 ',
                cb: (params) => {
                    const token = params.token || ''
                    const url = `https://yun.139.com/ai-helper-h5/?channel=1040016&storeId=410005&adVt=21427&token=${token}&source=410005 `
                    utils.addButtonClickLogAndRedirect('AI精转换', url);
                }
            },
            'AI图片': {
                url: 'https://yun.139.com/ai-store/#/aggpage?enableShare=1&sourceId=470430',
                cb: (params) => {
                    const token = params.token || ''
                    const url = `https://yun.139.com/ai-store/#/aggpage?enableShare=1&sourceId=470430&token=${token}`
                    utils.addButtonClickLogAndRedirect('AI图片', url);
                }
            },
            'AI帮你写': {
                url: 'https://yun.139.com/ai-helper-h5/?channel=1040016&storeId=410006&tab=aiChat&token=#ssoToken#&source=410006',
                cb: (params) => {
                    const token = params.token || ''
                    const url = `https://yun.139.com/ai-helper-h5/?channel=1040016&storeId=410006&tab=aiChat&token=${token}&source=410006`
                    utils.addButtonClickLogAndRedirect('AI帮你写', url);
                },
            },
            '朋友圈9图': {
                url: 'https://yun.139.com/aiTools/#/wechat9picOffice?enableShare=1&sourceId=470431',
                cb: (params) => {
                    const token = params.token || ''
                    const url = `https://yun.139.com/aiTools/#/wechat9picOffice?enableShare=1&sourceId=470431&token=${token}`
                    utils.addButtonClickLogAndRedirect('朋友圈9图', url);
                }
            },
            '中国移动安全管家': {
                url: 'https://act.cmccsim.com/superSIM/sim-activity-h5-ui/shbGuardXGoTone/home',
                button: 'shb'
            },
            '中国移动云手机会员体验': {
                url: 'https://cloud.139.com/#?loginType=0&channelSrc=02166    ',
                cb: (params) => {
                    const token = params.token || ''
                    const url = `https://cloud.139.com/#/cloudphone?loginType=0&channelSrc=02166&token=${token}`
                    console.log('中国移动云手机会员体验url', url)
                    utils.addButtonClickLogAndRedirect('中国移动云手机会员体验', url);
                }
            },
            'AI灵犀': {
                url: 'https://5gvas01.cmicmaap.com/ai-h5/#/cnmember?channel=qqt&token=移动认证',
                cb: (params) => {
                    const token = params.token || ''
                    const url = `https://5gvas01.cmicmaap.com/ai-h5/#/cnmember?channel=qqt&token=${token}`

                    utils.addButtonClickLogAndRedirect('AI灵犀', url);
                }
            }
        }

        console.log(`⏰ 点击时间: ${new Date().toLocaleString()}`);
        // console.log('📊 区域元素:', this);2
        console.log('---');
        if (!getLoginStatus()) {
            utils.addOpeartionsClickLog({
                button: `常态化首页-未登录点击星享ai: ${areaName}`,
            });
            return;
        } else if (isFeiQuan()) {
            utils.addOpeartionsClickLog({
                button: `常态化首页-非全点击星享ai: ${areaName}`,
            });
            sdtc_tz()
            return
        }
        utils.addOpeartionsClickLog({
            button: `常态化首页-点击星享ai: ${areaName}`,
        });
        const jumpItem = map[areaName] || '';
        if (jumpItem) {
            const url = jumpItem.url

            let button = ''
            if (jumpItem.button) {
                button = jumpItem.button
            }

            const callback = jumpItem.cb && (jumpItem.cb || undefined)
            // window.location.href =url12

            utils.getSSOToken('', button, url, false, callback);

        }


    });


    // .goYunpan-close
// 快捷方式 点击事件
    $('.quick-way').off('click').on('click', function (e) {
        // e.target 代表用户实际点击的那个最精确的元素

        // 判断被点击的元素是不是 .close 按钮，或者在 .close 按钮内部
        // 使用 .closest() 是为了确保即使用户点击了 .close 内部的图标等也能正确判断
        if ($(e.target).closest('.close').length) {

            // --- 这是原来 .close 按钮的逻辑 ---
            utils.addOpeartionsClickLog({
                button: "常态化首页-点击关闭按钮快捷方式弹窗"
            });
            // 这里可以直接用 this，因为它指向被绑定事件的 .quick-way
            $(this).hide();

        } else {

            // --- 这是原来 .quick-way 父元素的逻辑 ---
            utils.addOpeartionsClickLog({
                button: "常态化首页-点击创建桌面快捷方式"
            });
            if (!getLoginStatus()) {
                return;
            }
            if (isFeiQuan()) {
                notCMCC2Jump();
                return;
            }
            addQuickWay();
        }
    });

    $('.zxClose').click(function (e) {
        e.stopPropagation();
        utils.addOpeartionsClickLog({button: "常态化首页-摘星浮标关闭按钮"});
        $('.zxGifBox').hide();
    })
    $('.zxGifBox').click(function () {
        //是否登录
        if (!getLoginStatus()) {
            return;
        }
        if (LOGIN_LEVEL === '2') {
            utils.addOpeartionsClickLog({
                button: "常态化首页-非全_" + "摘星浮标"
            });
            $(".getTipsPop").show();
            return;
        }
        if (LOGIN_LEVEL === '3') {
            utils.addOpeartionsClickLog({
                button: "常态化首页-非移动_" + "摘星浮标"
            });
            $(".getTipsPop,.layout").show();
            return;
        }
        utils.addOpeartionsClickLog({
            button: "常态化首页-点击摘星浮标",
        })
        const weChatUrl = 'https://h.app.coc.10086.cn/activity/zx/transit/transferDownload.html?targetURL=https%3A%2F%2Fqqt.cmicrwx.cn%2F2016tyjf%2Fxhmqqthy%2Fres%2Fwap%2FinviteActive.html%3FsspId%3D75847&pageId=99992509021445423'
        let url = isWeChatBrowser() ? weChatUrl : './inviteActive.html?sspId=75847'
        window.location.href = url
    })

    // 同意规则弹窗
    $(".ruleBtn").click(function () {
        utils.addOpeartionsClickLog({
            button: "活动规则"
        });
        $("#activityRulePop").show();
        $('#activityRulePop .txtCon').scrollTop(0);

        $("body").css("overflow", "hidden");
        tcopen();
    });

    $(".zltc20-close").bind('click', function () {
        utils.addOpeartionsClickLog({
            button: "抽奖提醒同意活动规则弹窗:关闭按钮",
            dynamicButton: "常态化首页"
        });
        hideModal($('.tc_20'))

    });
    $(".zltc20-close1").bind('click', function () {
        utils.addOpeartionsClickLog({
            button: "抽奖提醒同意活动规则弹窗:关闭按钮",
            dynamicButton: "常态化首页"
        });
        hideModal($('.tc_20'))
    });
    $(".zltc20-btn1").bind('click', function () {
        utils.addOpeartionsClickLog({
            button: "抽奖提醒同意活动规则弹窗:已阅读并同意",
            dynamicButton: "常态化首页"
        });
        hideModal($('.tc_20'))
        $(".checkInfo i,.checkInfo_new i").removeClass("disCheck").addClass("checked");
    });

//     助力弹窗
    $('.support-btn').click(function () {
        utils.addOpeartionsClickLog({
            button: "常态化首页-助力了解全球通"
        })
        gosdUrl();


    });
    $('.support-close').click(function () {
        $('#support-modal').hide()
        $('body').css('overflow', 'auto')
        tcclose()

    });
}



/**
 * 防抖函数。
 * @param {Function} func - 需要防抖的函数。
 * @param {number} wait - 等待时间（毫秒）。
 * @returns {Function} - 经过防抖处理的新函数。
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}


function showModal($modal, options = {}) {
    $modal.css('display', 'flex');
    // body  overflow
    $("body").css("overflow", "hidden");
    tcopen();

}

function hideModal($modal) {
    $modal.css('display', 'none');
    // body  overflow
    const havePopUnder = $('.is-pop').filter(':visible').length > 0
    if (havePopUnder) {
        return
    }
    $("body").css("overflow", "auto");
    tcclose();
}

function evaluateModule(options) {


    // 评价数据配置（移除图片路径配置）
    const evaluateConfig = {
        // 1-3星对应的词条内容
        tags: {
            1: ["品牌宣传不明显", "等级规则看不懂", "权益领取流程复杂", "流程体验不顺畅", "系统加载不稳定", "文案展示不直观"],
            2: ["品牌宣传不明显", "等级规则看不懂", "权益领取流程复杂", "流程体验不顺畅", "系统加载不稳定", "文案展示不直观"],
            3: ["品牌宣传不明显", "等级规则看不懂", "权益领取流程复杂", "流程体验不顺畅", "系统加载不稳定", "文案展示不直观"],
        }
    };

    // 状态管理
    let currentStar = 5; // 默认5星
    let selectedTags = [];
    let inputText = '';
    const state = {
        isEvaluated: false, // 是否已评价
    }

    queryEvaluateStatus().then((res) => {
        if (res.data) {
            state.isEvaluated = true;
        } else {
            init()
        }
        options.onQueryStatusDone && options.onQueryStatusDone(state.isEvaluated);

    });

    // 初始化
    function init() {
        utils.addOpeartionsClickLog({
            button: "常态化首页-服务评价-弹窗显示"
        });
        updateStarDisplay(currentStar);
        updateLevelDisplay(currentStar);
        updateContentVisibility(currentStar);
        updateSubmitButtonState(); // 添加按钮状态更新
        bindEvents();
    }

    function queryEvaluateStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: ctx + '/floorEvaluate/queryYear',
                type: 'get',
                dataType: "json",
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    // 显示评价弹窗
    function showEvaluateModal() {
        $('.evaluate-modal').css('display', 'flex');
        tcopen()
        // body  overflow
        $("body").css("overflow", "hidden");
    }

    // 隐藏评价弹窗
    function hideEvaluateModal() {
        $('.evaluate-modal').hide();
        // tcclose()
        // body  overflow
        // $("body").css("overflow", "auto");
        popCloud()
    }

    function popCloud() {
        setTimeout(function () {
            //  展示云盘弹窗
            // 常态化首页-云盘权益弹窗弹出
            utils.addOpeartionsClickLog({
                button: "常态化首页-云盘权益弹窗弹出",
                dynamicButton: "服务评价后"
            });
            const cloudDrive = safeGet(pageData, 'cloudDriveModule', null);
            cloudDrive && cloudDrive.init()

        }, 2000)
    }


    // 绑定事件
    function bindEvents() {
        // evaluate-no-show
        console.log('evaluate bindEvent')
        $('.evaluate-no-show').on('click', function () {
            utils.addOpeartionsClickLog({
                button: "常态化首页-服务评价-不再提示按钮"
            });
            // 调用不再提示接口
            // 构造提交数据
            const data = {
                star: '',
                subOption: '',
                custom: '',
                activityName: '全球通星动日评价问卷',
                expandField1: "1"
            };
            queryEvaluateSubmit(data)
            hideEvaluateModal();
        });
        // 关闭按钮事件
        $('.evaluate-close').on('click', function () {
            utils.addOpeartionsClickLog({
                button: "常态化首页-服务评价-关闭按钮"
            });
            hideEvaluateModal();
        });
        // 星级点击事件
        $('.evaluate-click-icon').on('click', function () {
            handleEvaluationUpdate(this, "常态化首页-服务评价-点击星级评价");
        });

        // 表情点击事件
        $('.evaluate-lv-list').on('click', function () {
            handleEvaluationUpdate(this, "常态化首页-服务评价-点击表情评价");
        });

        function handleEvaluationUpdate(element, logMessage) {
            // 假设 currentStar 和 selectedTags 是在更高作用域中定义的变量
            currentStar = $(element).index() + 1;
            selectedTags = []; // 重置已选词条

            // 使用传入的参数记录日志
            utils.addOpeartionsClickLog({
                button: logMessage,
                dynamicButton: currentStar + '星'
            });

            // 重置并更新所有UI显示
            resetInputBox();
            updateStarDisplay(currentStar);
            updateLevelDisplay(currentStar);
            updateContentVisibility(currentStar);
            updateTagDisplay(currentStar);
            updateSubmitButtonState(); // 更新按钮状态
        }

        // 输入框事件
        $('#evaluateInp').on('input', handleTextInput);
        $('#evaluateInp').on('keydown', handleTextKeydown);

        // 输入框高度自适应
        $('#evaluateInp').on('input', autoResizeTextarea)

        // 提交按钮事件
        $('.evaluate-sumbtn').off().on('click', handleSubmit);

        const handleKeyboardChange = ({isUp, isDown}) => {
            if (isUp) {
                // 如果 isUp 是 true，说明键盘弹起了
                hideElement();
            }

            if (isDown) {
                // 如果 isDown 是 true，说明键盘收起了
                showElement();
            }
        };
        monitorSoftKeyboard(handleKeyboardChange, 20);
    }

    /**
     * 监听H5软键盘弹起
     * @param callback
     * @param differenceRange
     * @returns
     */
    function monitorSoftKeyboard(
        callback, // 监听软键盘弹起或降落的回调
        differenceRange = 20 // 默认差值范围 20
    ) {
        const originalHeight =
            document.documentElement.clientHeight || document.body.clientHeight;

        const onResize = () => {
            // 键盘弹起与隐藏都会引起窗口的高度发生变化，这是主要的监听依据；
            const resizeHeight =
                document.documentElement.clientHeight || document.body.clientHeight;

            // 兼容IOS系统的某些大屏手机【从未弹起的软键盘clientHeight】和【弹起再收起后的clientHeight】不完全相同，存在差值；
            // 如果差值小于默认差值范围，即20，则认为软键盘已收起。
            if (Math.abs(originalHeight - resizeHeight) <= differenceRange) {
                // 软键盘收起
                callback({isUp: false, isDown: true});
            } else {
                // 软键盘弹起
                callback({isUp: true, isDown: false});
            }
        };

        window.addEventListener("resize", onResize);

        // 返回一个函数，用于停止监听
        return () => window.removeEventListener("resize", onResize);
    }


    function hideElement() {
        // 隐藏元素的逻辑
        $('.service-correct').hide()
        // .module-evaluate .title-top
        $('.module-evaluate .title-top').hide();
        // module-evaluate padding top
        $('.module-evaluate').css('padding-top', '0');
    }

    function showElement() {
        // 显示元素的逻辑
        $('.service-correct').show()
        // .module-evaluate .title-top
        $('.module-evaluate .title-top').show();

        $('.module-evaluate').css('padding-top', '');

    }

    // 更新星级显示
    function updateStarDisplay(star) {
        $('.evaluate-click-icon').each(function (index) {
            if (index < star) {
                $(this).addClass('evaluate-click-icon-active');
            } else {
                $(this).removeClass('evaluate-click-icon-active');
            }
        });
    }

    // 更新提交按钮状态
    function updateSubmitButtonState() {
        const $submitBtn = $('.evaluate-sumbtn');

        if (currentStar >= 4) {
            // 4-5星直接可以提交
            $submitBtn.removeClass('disabled');
        } else {
            // 1-3星需要选择词条或填写文字
            const hasSelectedTags = selectedTags.length > 0;
            const hasInputText = inputText.trim().length > 0;

            if (hasSelectedTags) {
                $submitBtn.removeClass('disabled');
            } else {
                $submitBtn.addClass('disabled');
            }
        }
    }

    // 更新表情显示
    function updateLevelDisplay(star) {
        $('.evaluate-lv-list').each(function (index) {
            const $element = $(this);
            const $img = $element.find('.evaluate-lv-list-icon');
            const $desc = $element.find('.evaluate-lv-list-desc');
            if (index === star - 1) {
                // 当前选中星级高亮
                const activeIcon = $element.data('icon-active');
                $img.attr('src', activeIcon);
                $img.addClass('evaluate-lv-list-icon-active');
                $desc.css('color', '#B47035');

            } else {
                // 其他星级半透明
                const normalIcon = $element.data('icon');
                $img.attr('src', normalIcon);
                $img.removeClass('evaluate-lv-list-icon-active');
                // #999999
                $desc.css('color', '#999999');
            }
        });
    }

    // 控制内容区域显示
    function updateContentVisibility(star) {
        if (star >= 4) {
            // 4-5星隐藏词条和输入框
            $('.evaluate-desc-list').hide();
            $('.evaluate-inp-box').hide();
        } else {
            // 1-3星显示词条和输入框
            $('.evaluate-desc-list').show();
            $('.evaluate-inp-box').show();
        }
    }

    // 更新词条显示
    function updateTagDisplay(star) {
        if (star >= 4) return;

        const tags = evaluateConfig.tags[star] || [];
        const $tagContainer = $('.evaluate-desc-list');
        $tagContainer.empty();

        tags.forEach(tag => {
            const $tagElement = $('<div></div>')
                .addClass('evaluate-desc-list-item')
                .text(tag)
                .on('click', function () {
                    toggleTag($(this), tag);
                });
            $tagContainer.append($tagElement);
        });
    }

    // 词条选择切换
    function toggleTag($element, tag) {
        const isSelected = $element.hasClass('evaluate-desc-list-item-active');

        if (isSelected) {
            utils.addOpeartionsClickLog({
                button: "常态化首页-服务评价-取消选择词条",
                dynamicButton: tag
            })
            $element.removeClass('evaluate-desc-list-item-active');
            selectedTags = selectedTags.filter(t => t !== tag);
        } else {
            utils.addOpeartionsClickLog({
                button: "常态化首页-服务评价-选择词条",
                dynamicButton: tag
            });
            // 最多选择9个词条
            if (selectedTags.length < 9) {
                $element.addClass('evaluate-desc-list-item-active');
                selectedTags.push(tag);
            } else {
                utils.toast('最多选择9个词条');
            }
        }
        updateSubmitButtonState(); // 更新按钮状态

    }

    // 处理文本输入
    function handleTextInput(e) {
        let value = $(e.target).val();

        // 字数限制
        if (value.length > 150) {
            value = value.substring(0, 150);
            $(e.target).val(value);
        }

        inputText = value;
        updateCharCount(value.length);
    }

    // 处理键盘输入（防止超出字数）
    function handleTextKeydown(e) {
        const value = $(e.target).val();
        if (value.length >= 150 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    }

    // 更新字数显示
    function updateCharCount(count) {
        $('.evaluate-inp-num-length').text(`${count}/150`);
    }

    // 重置输入框
    function resetInputBox() {
        const $textarea = $('#evaluateInp');
        const $container = $('.evaluate-inp-box');

        // 清空内容
        $textarea.val('');
        inputText = '';
        // const rootRem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 50; // 根元素字体大小
        // 动态获取textara 在css上的 rem高度
        // const height =   parseFloat($container.css('height')) / rootRem
        // 重置高度
        $textarea.css('height', '.62rem');
        $container.css('height', '.62rem');

        // 重置字数显示
        updateCharCount(0);
    }

    // 输入框高度自适应
    function autoResizeTextarea() {
        const $textarea = $('#evaluateInp');
        const $container = $('.evaluate-inp-box');

        // --- 1. 定义常量 ---
        // 将基础高度和最大高度定义为常量，方便管理
        const baseHeightRem = 0.62;
        const maxHeightRem = 2.12;

        // --- 2. 重置高度 (关键步骤) ---
        // 先将 textarea 的高度强制设置为基础高度。
        // 这是让 textarea 能够“缩小”的关键。
        $textarea.css('height', baseHeightRem + 'rem');

        // --- 3. 获取内容的实际高度 ---
        // 此时的 scrollHeight 能准确反映当前文字内容所需的高度（单位是 px）
        const scrollHeight = $textarea[0].scrollHeight;

        // 获取根元素的字体大小，用于将 px 转换为 rem
        const rootRem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 50;

        // 计算内容实际需要的 rem 高度
        const contentHeightRem = scrollHeight / rootRem;

        // --- 4. 计算并应用新高度 ---
        let newHeightRem;

        // 如果内容所需高度大于我们设定的基础高度，说明是多行
        if (contentHeightRem > baseHeightRem) {
            // 使用内容高度，但不能超过最大高度限制
            newHeightRem = Math.min(contentHeightRem, maxHeightRem);
        } else {
            // 如果内容所需高度小于或等于基础高度（即单行或无内容），则使用基础高度
            newHeightRem = baseHeightRem;
        }

        // 将最终计算出的高度应用到 textarea 和它的容器上
        $textarea.css('height', newHeightRem + 'rem');
        $container.css('height', newHeightRem + 'rem');
    }

    function queryEvaluateSubmit(data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: ctx + '/floorEvaluate/insert',
                type: 'post',
                dataType: 'JSON',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (res) {
                    resolve(res);
                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            })
        })
    }

    // 提交评价
    function handleSubmit() {
        // 验证是否可以提交
        if (currentStar <= 3) {
            const hasSelectedTags = selectedTags.length > 0;

            if (!hasSelectedTags) {
                return;
            }
        }

        // 添加操作日志
        utils.addOpeartionsClickLog({button: "常态化首页-点击服务评价提交按钮"});
        let subOption = ''
        if (selectedTags.length > 0) {
            subOption = selectedTags.join(',');
        }
        // 构造提交数据
        const data = {
            star: currentStar,
            subOption,
            custom: inputText,
            activityName: '全球通星动日评价问卷'
        };
        // 提交到服务器
        queryEvaluateSubmit(data).then((res) => {
            utils.addOpeartionsClickLog({button: "评价成功"});
            hideEvaluateModal()
            utils.toast("评价成功");
        }).catch((error) => {
            console.error('提交失败:', error);
            utils.toast('网络错误，请稍后重试');
        })
    }


    return {
        state,
        init,
        showEvaluateModal,
    }

}

function addQuickWay() {
    if (!window.leadeon || !window.leadeon.addQuickWay) {
        console.error('leadeon SDK not loaded or addQuickWay not available');
        return;
    }
    const iconUrl = window.globalData.quickIcon || ''
    const arr = ['dev', 'huido']
    const notProd = arr.some((item) => {
        return window.location.href.includes(item)
    })
    console.log('addQuickWay notProd', iconUrl, notProd)

    window.leadeon.addQuickWay({
        debug: false,
        shortCutId: '2',// 1 获取数据,2刷新数据或着说强更新 必传
        shortLabel: '全球通星动日',//设置快捷方式的短标题 必传
        longLabel: '全球通星动日',//设置快捷方式的长标题
        htmlUrl: 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdractivity.html?sspId=76036',
        iconUrl,//设置快捷方式的Icon 地址   必传
        // 成功回调,数据原封不动返回给H5
        success: function (res) {
            console.log(res, '成功回调')
        },
        // 失败回调
        error: function (res) {
            var error = res.error;// -1：错误信息
            var errorMsg = res.errorMsg; //  // 错误信息
            console.log(error, errorMsg, 'err')
        }
    });
}

function goQqtzq() {
    if (!getLoginStatus()) {
        return
    }
    const url = 'https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/index2.html?sspId=66013'
    utils.getSSOToken('', '', url, false)
}

function itemDetailCLick() {
}

//弹窗提示后以后调用,保存已完成记录
function getsaveRecord(lxtype) {
    $.ajax({
        async: true,
        url: ctx + "/prompt/saveRecord",
        type: 'post',
        data: {
            "type": lxtype
        },
        success: function (data) {
            if (data.status == '1') {
                //查询弹窗提示状态
                // getisCompleted();
            }
        },
        error: function () {
        }
    });
}

// 获取权益详情banner图 本地缓存
function getQyxqBannersession(productId) {
    $('.h870 .tk_tu').html('');
    let data = $.parseJSON(window.sessionStorage.getItem(`getQyxqBanner_${productId}`));
    // console.log("getQyxqBannersession", data)
    if (data && data.imageList) {
        var imageList = data.imageList;
        var swiperImages = '<div class="swiper-container" id="tk_swiper"><div class="swiper-wrapper">';
        for (var i = 0; i < imageList.length; i++) {
            var banner = imageList[i];
            swiperImages += '<div class="swiper-slide"><img src="' + banner + '"></div>';
        }
        swiperImages = swiperImages + '</div></div><div class="swiper-pagination" id="tk_dian"></div>'
        if (imageList.length > 0) {
            $('.h870 .tk_tu').html(swiperImages);
            setTimeout(function () {
                if ($("#tk_swiper .swiper-slide").length > 1) {
                    var swiper = new Swiper('#tk_swiper', {
                        slidesPerView: 'auto',
                        spaceBetween: 6,
                        observer: true,
                        observeParents: true,
                        // autoplay:true,//可选选项，自动滑动
                        loop: true, //可选选项，开启循环
                        autoplay: {
                            disableOnInteraction: false, //手动滑动之后不打断播放
                            delay: 3000
                        },
                        pagination: {
                            el: '#tk_dian',
                            clickable: true,
                        },
                    });
                }
            }, 100)
        }
    }
}

//获取权益详情内容
function queryQyxq(qxproductId) {
    if (qxproductId != 3395 || qxproductId != 3319 || qxproductId != 3320 || qxproductId != 3321 || qxproductId != 3322 || qxproductId != 3351 || qxproductId != 3387 || qxproductId != 3392 || qxproductId != 3397 || qxproductId != 3364) {
        if (window.sessionStorage.getItem(`getQyxq_${qxproductId}`)) {
            getQyxqSession(qxproductId);
            return;
        }
    }
    $.ajax({
        url: ctx + '/qyxq/getQyxq.do',
        type: "post",
        data: {
            id: qxproductId,
            xqtype: 'free'
        },
        success: function (data) {
            if (data.status == 1) {
                var data = data.data;
                window.sessionStorage.setItem(`getQyxq_${qxproductId}`, JSON.stringify(data));
                getQyxqSession(qxproductId)
            }
        },
        error: function () {
            console.log('查询异常');
        }
    });
}

function agreeRulePop() {
    $('.gz-mask').show()
}

//权益领取弹窗确认领取按钮
function xqqrlq() {
    SOURECE = 1;
    if (!getLoginStatus()) {
        $(".h870").hide();
        return;
    }
    if (!getCheckInfo()) {
        agreeRulePop()
        return;
    }
    if (!PRODUCT_ID) {
        utils.toast("权益未选择");
        return;
    }
    utils.addOpeartionsClickLog({button: "点击权益确认领取按钮:" + SOURECE, dynamicButton: PRODUCT_ID});
    //点击领取直接获取
    initQyStatus('', 1, 0);
}

// 是新客
function isNewUser(userData) {
    // newFlag
    return userData.newFlag == 0
}

/**
 * 领取权益 确定领取按钮
 * @param receivePhone 被转赠号码，为空时为当前用户
 * @param notice 是否提示结果 1/0
 * reconfirm  是否有二次确认弹窗  1/0
 */
function initQyStatus(receivePhone, notice, reconfirm) {
    //是否登录
    if (!getLoginStatus()) {
        return;
    }
    if (USER.userLevel == 7 || USER.userLevel == 6) {
        utils.addOpeartionsClickLog({
            button: "非全_" + "常态化-面确定领取按钮"
        });
        sdtc_tz();
        return;
    }
    if (USER.userLevel == -1) {
        utils.addOpeartionsClickLog({
            button: "非移动_" + "常态化首页-确定领取按钮"
        });
        notCMCC2Jump();
        return;
    }
    if (reconfirm == null) {
        utils.addOpeartionsClickLog({
            button: "常态化首页-领取权益:二次确定领取:" + SOURECE,
            dynamicButton: PRODUCT_ID
        });
    }
    console.info("*** initQyStatus ****")
    console.info("SOURECE=", SOURECE);
    console.info("PRODUCT_ID=", PRODUCT_ID);
    console.info("receivePhone=", receivePhone);
    if (!PRODUCT_ID) {
        utils.toast("权益未选择");
        return;
    }
    if (!getCheckInfo()) {
        utils.toast("参与活动前，请先阅读并同意活动规则");
        return;
    }
    //防止用户多次点击
    $(".i_cont_but").attr('disabled', true);
    if (!getLoginStatus()) {
        $("#dv_lqnew").hide();
        return;
    }

    if (initQyState) return;
    initQyState = true;
    var shade;
    if (notice == 1) {
        shade = showShadeLayerqy("权益领取中");
    }
    $("#createDiv").show();
    console.log('QY_ITEM', QY_ITEM)
    const isRandom = QY_ITEM.isRandom ? '1' : '0'
    const reqData = {
        productId: PRODUCT_ID,
        receivePhone: receivePhone,
        channelCode: getSspId(),
        isRandom,
        sourece: SOURECE
    }
    queryInitNormalQy(reqData).then(function (data) {
        $("#createDiv").hide();
        layer.close(shade);
        initQyState = false;
        $("#dv_lqzz").hide();
        //滑动条回到顶部
        $('#tk_cont_id').scrollTop(0);
        $("#tk_xq").hide();
        $(".tc_22").hide();
        $(".tc_23").hide();
        if (notice == 1) {
            layer.close(shade);
        }
        if (data.status == 1) {
            console.info("USER.receive=", USER.receive);
            if (receivePhone) {
                $(".inputPhoneNumPop,.layout").hide();
                $("#phone_qr").hide();
                $("#receivePhone2").val("");
                utils.addOpeartionsClickLog({
                    button: "常态化-确定转赠权益按钮:成功:" + SOURECE,
                    dynamicButton: PRODUCT_ID
                });
                utils.toast("转赠成功，权益将在24小时内下发");
                // if (cardShow1) {
                //     cardShow1(framilyPhone, PRODUCT_ID);
                // }
                // $(".zscg_tc").fadeIn();
                // $("body").css("overflow", "hidden");
                // tcopen();
                $("body").css("overflow", "auto");
                tcclose();
                $(".phone_qrLayout").hide();//确认转赠二次弹窗
                $(".phone_zyLayout").hide();//确认转赠二次弹窗
            } else {
                $(".inputPhoneNumPop,.layout").hide();
                $("#phone_qr").hide();
                $("#dv_lqnew,.layout").hide();
                if (isNewUser(USER)) {
                    console.log('是新客，初始化评价模块。');

                    const evaluate = evaluateModule({
                        onQueryStatusDone: function (evaluated) {
                            if (!evaluated) {
                                evaluate.showEvaluateModal()
                                return
                            }

                            showCloudDrivePopup()
                        }
                    })
                } else {
                    console.log('不是新客，跳过评价模块，直接显示云盘弹窗。');
                    showCloudDrivePopup()
                }

                function showCloudDrivePopup() {
                    utils.toast("已领取，权益将在24小时内下发");
                    setTimeout(function () {
                        //  展示云盘弹窗
                        // 常态化首页-云盘权益弹窗弹出
                        utils.addOpeartionsClickLog({button: "常态化首页-云盘权益弹窗弹出"});
                        const cloudDrive = safeGet(pageData, 'cloudDriveModule', null);
                        cloudDrive && cloudDrive.init()
                    }, 2100)
                }

                // 2100ms

                utils.addOpeartionsClickLog({
                    button: "确定领取权益按钮:成功:" + SOURECE,
                    dynamicButton: PRODUCT_ID
                });
                $(".phone_qrLayout").hide();//确认转赠二次弹窗
                $(".phone_zyLayout").hide();//确认转赠二次弹窗

            }
            renderCollectTimes()
            utils.addOpeartionsClickLog({button: "确定权益按钮:领取成功", dynamicButton: PRODUCT_ID});

        } else if (data.status == '6') {
            if (receivePhone) {
                $("#createDiv").hide();
                if (notice == 1) {
                    layer.close(shade);
                }
                initQyState = false;
                $("#dv_lqnew").hide();//无转赠二次确认弹窗
                $(".phone_qrLayout").hide();//确认转赠二次弹窗
                $(".phone_zyLayout").hide();//确认转赠二次弹窗
                $(".h870Layout").hide();
                $("body").css("overflow", "auto");
                utils.toast("您转赠的号码已达转赠权益次数上限，不可转赠了");
                utils.addOpeartionsClickLog({
                    button: "常态化页-确定转赠权益按钮:失败" + SOURECE,
                    dynamicButton: PRODUCT_ID
                });
            }
        } else {
            const msg = data.msg || "活动太火爆，请稍后重试";

            utils.toast(msg);
            $("#tk_xq").hide();
            $("#dv_lqzz").hide();
            $("#dv_lqnew,.layout").hide();
            $(".inputPhoneNumPop").hide();
            $("#phone_qr").hide();
            $("body").css("overflow", "auto");
            tcclose();
        }
    }).catch(function (err) {
        $("#createDiv").hide();
        $("body").css("overflow", "auto");
        tcclose();
        layer.close(shade);
        initQyState = false;
        $(".pop_over").hide();
        $(".layout").hide();
        utils.toast("活动太火爆，请稍后重试");
    });
}

function getsdlj() {
    $.ajax({
        async: true,
        url: ctx + "/customer/sdlj",
        type: 'get',
        data: {
            province: province
        },
        success: function (data) {
            if (data.status == '1') {
                sdurl = data.data.sdlj?.[0]?.elementMap?.vLinkUrl;
                console.log(sdurl);
            }
        },
        error: function () {
        }
    });
}

function gosdUrl() {
    let url;
    url = sdurl;
    let tokenName = '点击去升级按钮'
    if (url.indexOf('service.bj.10086.cn') != -1) {
        tokenName = 'BJJTNToken'
        if (!isLeadeon()) {
            url = 'https://service.bj.10086.cn/m/jztj/cnxfdqqtqy.action?channelId=P00000113885&yx=1269761019'
        }
    }
    if (province == '北京' && !isLeadeon()) {
        window.location.href = 'https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetUrl=https%3A%2F%2Fh.app.coc.10086.cn%2Factivity%2FtransferXcx%2Findex.html%3Fplatform%3Dcmcc%26appId%3D6413852282228128%26path%3Dpages%252Findex%252Findex%26pageId%3D1879370128044171264%26channelId%3DP00000004876'
        return;
    }
    if (province == '重庆' && isLeadeon()) {
        window.location.href = sdurl;
        return;
    }
    if (province == '山东') {
        window.location.href = sdurl;
        return;
    }
    if (province == '江苏') {
        utils.getSSOTokenNew("", 'jsrw', url, false);
    } else {
        utils.getSSOToken("", tokenName, url, false);
    }
}

/**
 * 非全点击升档
 */
/**
 * 非全点击升档
 */
function sdtc_tz(type) {
    // if (window.location.host === "qqt.cmicrwx.cn") {//正式
    //     var url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/qqtsd.html?province=" + encodeURI(encodeURI(province)) + "&loginlevel=" + LOGIN_LEVEL + "&sspId=" + getSspId();
    //     utils.addButtonClickLogAndRedirect("qqtsd", url);
    // } else {//测试
    //     var url = "qqtsd.html?province=" + encodeURI(encodeURI(province)) + "&loginlevel=" + LOGIN_LEVEL + "&sspId=" + getSspId();
    //     utils.addButtonClickLogAndRedirect("qqtsd", url);
    // }
    $(".getTipsPop").show();
    tcopen()
}

/**
 * 点击领取按钮
 * @param productId 权益ID
 * @param transferable 是否转赠 1是，0否
 * @param levelable 可领取等级
 * @param bhtz 是否补货通知 1是，0否
 *
 */
function getEquities(productId, transferable, levelable, item) {
    console.info("点击领取按钮入参:productId=", productId, "transferable=", transferable, "levelable=", levelable, 'item', item);
    PRODUCT_ID = productId;
    var levelableArr = levelable.split(',');
    //是否登录
    if (!getLoginStatus()) {
        return;
    }
    if (USER.userLevel == 7 || USER.userLevel == 6) {
        utils.addOpeartionsClickLog({
            button: "非全_" + "常态化首页-点击领取按钮"
        });
        gosdUrl()
        return;
    }
    if (USER.userLevel == -1) {
        utils.addOpeartionsClickLog({
            button: "非移动_" + "常态化首页-点击领取按钮"
        });
        notCMCC2Jump();
        return;
    }

    if (!isInArray(levelableArr, USER.userLevel)) {
        console.info("等级不够");
        // getEquitiesDetails(productId);
        sdtc_tz();
        return;
    }

    utils.addOpeartionsClickLog({button: "常态化首页-点击权益领取按钮:" + SOURECE, dynamicButton: PRODUCT_ID});
    // height: 2.5rem;
    // 0.3rem auto 0.3rem
    $(".confirmNumPop .czbar").css("margin-top", "0.3rem");

    $(".confirmNumPop .tk_cont").css("height", "2.5rem");
    //是否可转赠 0否， 1是
    if (transferable == '0') {
        $("#dv_lqnew,.layout").show();
        $("body").css("overflow", "hidden");
        tcopen();
    } else if (transferable == '1') {
        $("#dv_lqzz").show();
        $("body").css("overflow", "hidden");
        tcopen();
    }

    $(".tit_sma2 .phone").text(USER.phone);
    $(".tit_sma2 .prize").text(item.qyName);
}


/**
 * 弹窗显示权益详情
 * @param productId 权益ID
 * @param transferable 是否显示转赠按钮 1/0
 * @param levelable 可领取级别
 * @param btnName 按钮文本
 * @param bhtz 是否补货通知 1/0
 * @param click 按钮是否可点 1/0
 * @param receive 当前用户是否已领取 true/false
 * @param transferreceive 当前用户赠送权益领取状态 0:否1:是
 * @param stock 剩余库存 100:已抢光
 * @param isgy  公益的那个权益是否可领取 1可 2无库存
 */
function getEquitiesDetails(productId, transferable, levelable, receive, transferreceive, stock, click, item) {
    //是否登录
    if (!getLoginStatus()) {
        return;
    }
    if (USER.userLevel == 7 || USER.userLevel == 6) {
        utils.addOpeartionsClickLog({
            button: "非全_" + "常态化首页-弹窗显示权益详情"
        });
        sdtc_tz();
        return;
    }
    if (USER.userLevel == -1) {
        utils.addOpeartionsClickLog({
            button: "非移动_" + "常态化首页-弹窗显示权益详情"
        });
        notCMCC2Jump();
        return;
    }

    PRODUCT_ID = productId;
    SOURECE = 2; //详情
    queryQyxqBanner(PRODUCT_ID) // 获取权益banner图
    queryQyxq(PRODUCT_ID) // 获取权益详情
    utils.addOpeartionsClickLog({button: "常态化首页-权益详情弹窗", dynamicButton: PRODUCT_ID});
    //奖品详情

    $(".confirmNumPop .tk_cont").css("height", "4.54rem");

    item.hideRefill ? $(".tit_2").hide() : $(".tit_2").show();
    $(".tit_3").hide();
    $(".tit_5").hide();
    //下方电话号码显示
    if (USER.phone) {
        $('#issue_box').html(`<div class="issue_box2">将为<span>${USER.phone}</span>申领权益，领取成功后将在24小时内下发！</div>`);
        $('#issue_box').show();
    }
    $(".xq_close_pop").hide();
    $(".jpxq_main").hide();
    $(".ppgqy").hide();
    $(".confirmNumPop .tk_cont .shu").removeClass('shu_jpxq');

    $("#tk_xq .czbar").show();
    $("#tk_xq .checkInfo_new").show();
    $("#tk_xq .checkInfo_new_sms").hide(); //5月预约下期按钮入口隐藏

    $("#issue_box").show();
    let htmla = '';
    htmla += '<div class="btn btn1 xqbtn1" style="display:none;">转赠权益</div>';
    htmla += '<div class="btn btn2 xqbtn2" id="qdlq_but" onclick="xqshowlq()">确定领取</div>';
    $(".btnItem").html(htmla);
    //是否已领取1

    $(".confirmNumPop .czbar").css("margin-top", "0rem");
    if (receive) {
        if (transferreceive == '1') {
            $(".xqbtn1").addClass("done noclick").text('已转赠');
            $(".xqbtn2").addClass("done noclick").text('确定领取');
            $("#issue_box").hide();
            $(".confirmNumPop .tk_cont").css("height", "5rem");
            $(".confirmNumPop .czbar").css("margin-top", "0.16rem");
        } else {
            $(".xqbtn1").addClass("done noclick").text('转赠权益');
            $(".xqbtn2").addClass("done noclick").text('已领取');
        }
    } else if (!isCanReceive(new Date()) && !item.isRandom) {
        if (item.isFirstDay) {
            $(".xqbtn1").addClass("done noclick").text('转赠权益');
            $(".xqbtn2").addClass("done noclick").text('确定领取');

        } else {

            if (item.stock < 100) {
                $(".xqbtn1").removeClass('done noclick').text('转赠权益');
                $(".xqbtn2").removeClass('done noclick');
                $(".xqbtn2").text('确定领取');
            } else {
                $(".xqbtn1").addClass("done noclick").text('转赠权益');
                $(".xqbtn2").addClass("done noclick").text('已抢光');
            }

        }


    } else {
        if (stock == '100') {
            $(".xqbtn1").addClass("done noclick").text('转赠权益');
            $(".xqbtn2").addClass("done noclick").text('已抢光');
        } else {

            $(".xqbtn1").removeClass('done noclick').text('转赠权益');
            $(".xqbtn2").removeClass('done noclick');
            $(".xqbtn2").text('确定领取');

        }
    }
    if (item.isCouldReceived) {
        $(".xqbtn2").addClass("done noclick").text('已领取');
    }
    //详情页领取权益之转赠按钮
    $('.xqbtn1').bind('click', function () {
        if (!getLoginStatus()) {
            $(".h870 ").hide();
            return;
        }
        if (!getCheckInfo()) {
            agreeRulePop()
            return;
        }
        if (!PRODUCT_ID) {
            utils.toast("权益未选择");
            return;
        }
        $("#tk_xq").hide();
        $(".layout").hide();
        $("body").css("overflow", "auto");
        tcclose();
        // 查询有无家庭圈
        checkFamilyCircle();
        // $("#dv_lqzzhm,.layout").show();
        // $("#dv_lqzzhm").addClass("lock"); //加个标识 多层次关闭layout时用
        utils.addOpeartionsClickLog({button: "领取权益之转赠按钮:详情:" + SOURECE, dynamicButton: PRODUCT_ID});
    });
    //是否显示可转赠按钮 0否， 1是
    if (transferable == '0') {
        $(".btnItem .btn1").hide();
    } else if (transferable == '1') {
        $(".btnItem .btn1").show();
    }
    //按钮不可点
    if (click == '0') {
        $(".xqbtn1").addClass('noclick done');
        $(".xqbtn2").addClass('noclick done');
    }

    $("#tk_xq").show();
    //滑动条回到顶部
    $('#tk_cont_id').scrollTop(0);
    $("body").css("overflow", "hidden");
    tcopen();
}


//领取权益详情页按钮
function xqshowlq() {
    SOURECE = 2; //详情
    console.log('qy_item', QY_ITEM)

    if (!getLoginStatus()) {
        $(".h870").hide();
        return;
    }

    if (!getCheckInfo()) {
        agreeRulePop()
        return;
    }

    if (!PRODUCT_ID) {
        utils.toast("权益未选择");
        return;
    }

    utils.addOpeartionsClickLog({button: "点击权益领取按钮:" + SOURECE, dynamicButton: PRODUCT_ID});
    const isMobileCloudCard = safeGet(pageData, 'cloudPhoneModule.isMobileCloudCard', () => {
    });

    if (isMobileCloudCard(QY_ITEM.qyName)) {
        const submitReceive = safeGet(pageData, 'cloudPhoneModule.submitReceive', () => {
        });
        submitReceive();
        return;
    }
    //点击领取直接获取
    initQyStatus('', 1, 0);
}

/**
 * 安全地获取一个嵌套在对象深处的属性值。
 * @param {object} obj - 要查询的对象。
 * @param {string} path - 属性的访问路径。
 * @param {*} defaultValue - 如果获取不到，返回的默认值。
 * @returns {*} - 获取到的属性值或默认值。
 */
function safeGet(obj, path, defaultValue) {
    var keys = path.split('.');
    var result = obj;
    for (var i = 0; i < keys.length; i++) {
        if (result === null || result === undefined) {
            return defaultValue;
        }
        result = result[keys[i]];
    }
    return result === undefined ? defaultValue : result;
}

// 获取权益详情banner图
function queryQyxqBanner(productId) {
    $('.h870 .tk_tu').html('');
    if (window.sessionStorage.getItem(`getQyxqBanner_${productId}`)) {
        getQyxqBannersession(productId);
        return;
    }
    $.ajax({
        url: ctx + '/qyxq/getQyxqBanner.do',
        type: "post",
        data: {
            id: productId,
        },
        success: function (data) {
            console.info("getQyxqBanner", data)
            $('.h870 .tk_tu').html('');
            if (data.status == 1) {
                var data = data.data;
                console.log('bannerbannerbanner', typeof data, data)
                window.sessionStorage.setItem(`getQyxqBanner_${productId}`, JSON.stringify(data));
                getQyxqBannersession(productId);
            }
        },
        error: function () {
            console.log('权益详情查询异常');
        }
    });
}

// 获取权益详情内容 本地缓存
function getQyxqSession(qxproductId) {
    $(".tk_cont .textCon .chapter").html('');
    // $(".jfxqPop .content").html('');
    $(".mhtc .content").html('');
    $(".gdtc .content").html('');
    $(".la1 .content").html('');
    $(".la2 .content").html('');
    $(".la3 .content").html('');
    $(".confirmNumPop .title").html('');
    let json = window.sessionStorage.getItem(`getQyxq_${qxproductId}`);
    let data = $.parseJSON(json);
    var content = "<p class=\"tits\">权益亮点</p>";

    if (data) {
        // $(".jfxqPop .content .jftitle").html(data.front);
        $(".confirmNumPop .title").html(data.title);
        // $("#xqtitle").html(data.front);
        $("#mhtitle").html(data.front);
        $("#gdtitle").html(data.front);
        $("#qyztitle1").html(data.front);
        $("#qyztitle2").html(data.front);
        $("#qyztitle3").html(data.front);
        $("#xqtitle").html(data.front);

        if (data.qynr) { //qynr
            if (data.qynr.indexOf("|") != -1) {
                var arr = data.qynr.split("|");
                for (var i = 0; i < arr.length; i++) {
                    content += "<p class=\"txt\">" + arr[i] + "</p>";
                }
            } else {
                content += "<p class=\"txt\">" + data.qynr + "</p>";
            }
            if (qxproductId == 3395 || qxproductId == 3319 || qxproductId == 3320 || qxproductId == 3321 || qxproductId == 3322) {
                content += "<div class=\"titimg3322\"></div>";
            }
        }
        if (qxproductId == 3397) {
            content += "<p class=\"tits\">权益内容</p>";
            content += "<div class=\"titimg3397\"></div>";
        }
        if (qxproductId == 3364) {
            content += "<p class=\"tits\">权益内容</p>";
            content += "<div class=\"titimg3364\"></div>";
        }
        if (qxproductId == 3351) {
            content += "<p class=\"tits\">权益内容</p>";
            content += "<div class=\"titimg3351\"></div>";
        }
        if (qxproductId == 3387) {
            content += "<p class=\"tits\">权益内容</p>";
            content += "<div class=\"titimg3387\"></div>";
        }
        if (qxproductId == 3392) {
            content += "<p class=\"tits\">权益内容</p>";
            content += "<div class=\"titimg3392\"></div>";
        }
        if (data.qyyxq) { //qyyxq
            content += "<p class=\"tits\">领取流程</p>";
            if (data.qyyxq.indexOf("|") != -1) {
                var arr = data.qyyxq.split("|");
                for (var i = 0; i < arr.length; i++) {
                    content += "<p class=\"txt\">" + arr[i] + "</p>";
                }
            } else {
                content += "<p class=\"txt\">" + data.qyyxq + "</p>";
            }
        }
        if (data.syzy) { //syzy
            content += "<p class=\"tits\">使用规则</p>";
            if (data.syzy.indexOf("|") != -1) {
                var arr = data.syzy.split("|");
                for (var i = 0; i < arr.length; i++) {
                    content += "<p class=\"txt\">" + arr[i] + "</p>";
                }
            } else {
                content += "<p class=\"txt\">" + data.syzy + "</p>";
            }
        }
        if (data.wxts) { //wxts
            content += "<p class=\"tits\">温馨提示</p>";
            if (data.wxts.indexOf("|") != -1) {
                var arr = data.wxts.split("|");
                for (var i = 0; i < arr.length; i++) {
                    content += "<p class=\"txt\">" + arr[i] + "</p>";
                }
            } else {
                content += "<p class=\"txt\">" + data.wxts + "</p>";
            }
        }
        if (data.kflxfs) { //kflxfs
            content += "<p class=\"tits\">客服联系方式</p>";
            if (data.kflxfs.indexOf("|") != -1) {
                var arr = data.kflxfs.split("|");
                for (var i = 0; i < arr.length; i++) {
                    content += "<p class=\"txt\">" + arr[i] + "</p>";
                }
            } else {
                content += "<p class=\"txt\">" + data.kflxfs + "</p>";
            }
        }
        $(".tk_cont .textCon .chapter").html(content);
        // $(".jfxqPop .content").append(content);
        $(".mhtc .content").html(content);
        $(".gdtc .content").html(content);
        $(".la1 .content").html(content);
        $(".la2 .content").html(content);
        $(".la3 .content").html(content);
    }
}

/**
 * 非中国移动处理方法
 */
function notCMCC2Jump() {
    // if (window.location.host === "qqt.cmicrwx.cn") {//正式
    //     var url = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/qqtsd.html?province=" + encodeURI(encodeURI(province)) + "&loginlevel=" + LOGIN_LEVEL + "&sspId=" + getSspId();
    //     utils.addButtonClickLogAndRedirect("qqtsd", url);
    // } else {//测试
    //     var url = "qqtsd.html?province=" + encodeURI(encodeURI(province)) + "&loginlevel=" + LOGIN_LEVEL + "&sspId=" + getSspId();
    //     utils.addButtonClickLogAndRedirect("qqtsd", url);
    // }
    $(".getTipsPop").show();
}

function getLoginStatus() {

    if (LOGIN_STATUS) {
        return true;
    } else {
        $("#popLoginSelect").show();
        $("body").css("overflow", "hidden");
        tcopen();
    }
    return false;
}

function tcopen() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
    }

}

function tcclose() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        var body = document.body
        body.style.position = ''
        var top = body.style.top
        document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
        body.style.top = ''
    }
}

function bindTabClick() {
    // 隐藏所有的奖品
    const $tabs = $('.level-award-tab')
    $tabs.off().click(function () {
        let tabData = $(this).data()
        let content = ''
        if (tabData) {
            const tab = getTabById(tabData.tabId)
            if (tab) {
                content = `${tab.title}`
            }
        }

        console.log("常态化首页-点击奖品tab", content);
        utils.addOpeartionsClickLog({
            button: "常态化首页-点击奖品tab",
            dynamicButton: content
        });

        const tabId = $(this).data('tab-id');

        console.log('tabID==>', tabId)

        const tab = getTabById(tabId);
        console.log('当前tab', tab)

        switchToTab(tabId, pageData.localChange);

        // scrollIntoView(tabId);
        const $tab = $(this)[0]
        $tab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        })

    })

}


// 亲情圈逻辑
var framilyPhone = '';//亲友号码
var framilyPhoneMi = '';//亲友号码加密
var familyListArr = [];//家庭圈数组
//领取权益之转赠按钮
//领取权益之转赠按钮
$('#wyaozy').bind('click', function () {
    if (!getLoginStatus()) {
        return;
    }
    if (!getCheckInfo()) {
        agreeRulePop()
        return;
    }
    if (!PRODUCT_ID) {
        utils.toast("权益未选择");
        return;
    }
    $("#tk_xq").hide();
    $(".layout").hide();
    $("#dv_lqzz").hide();
    $("body").css("overflow", "auto");
    tcclose();
    // 查询有无家庭圈
    checkFamilyCircle()
    utils.addOpeartionsClickLog({button: "领取权益之转赠按钮:小弹窗" + SOURECE, dynamicButton: PRODUCT_ID});
});

/**
 * 获取用户是否同意了协议
 * true 同意，false 不同意
 */
function getCheckInfo() {

    if ($(".checkInfo_new .checkSw").hasClass('checked')) {
        return true;
    } else {
        return false;
    }
}

// 查询家庭圈
function checkFamilyCircle() {
    framilyPhone = '';//被转赠人号码
    framilyPhoneMi = '';//被转赠人号码加密
    familyListArr = [];//亲情圈数据复原
    $.ajax({
        url: ctx + "/paidpurchase/familyCircle.action",
        type: "post",
        data: {
            sspId: getSspId()
        },
        dataType: "json",
        async: false,
        success: function (res) {
            // res={
            //     "msg": "成功",
            //     "data":{
            //     "familyList": [
            //         {
            //             "familyMemNum": "DAQsPX8/89Mfju22OHQPyQ==",
            //             "showFamilyMemNum": "158****8930",
            //             "familyMemName": "父亲",
            //             'num':'123'
            //         },
            //         {
            //             "familyMemNum": "wj3vAWnIofJgWCpI/w5e1w==",
            //             "showFamilyMemNum": "182****7818",
            //             "familyMemName": "母亲",
            //             'num':'123'
            //         },
            //         {
            //             "familyMemNum": "1yDLKJSA3QE701EKIq63fw==",
            //             "showFamilyMemNum": "159****1042",
            //             "familyMemName": "老婆",
            //             'num':'123'
            //         },
            //         {
            //             "familyMemNum": "1yDLKJSA3QE701EKIq63fw==",
            //             "showFamilyMemNum": "159****1042",
            //             "familyMemName": "老婆",
            //             'num':'123'
            //         },
            //         {
            //             "familyMemNum": "1yDLKJSA3QE701EKIq63fw==",
            //             "showFamilyMemNum": "159****1042",
            //             "familyMemName": "老婆",
            //             'num':'123'
            //         }
            //     ],
            // },
            //     "status": "1"
            // }
            if (res.status == '1') {
                // 非卓越等级的选择亲友时也是要有新增亲情圈成员展示
                $(".xzqq").removeClass('family-not-lv8');//无家庭圈
                if (res.data.familyList && res.data.familyList.length > 0) {
                    familyListArr = res.data.familyList;
                    // 有家庭圈
                    let framilyList = '';
                    $.each(res.data.familyList, function (index, obj) {
                        framilyList += `<div class="framilyList" onclick="clickFramilyNum('${obj.showFamilyMemNum}','${obj.familyMemNum}','${obj.familyMemName}')"><span class="framily_left">${obj.showFamilyMemNum}</span><span class="framily_right">${obj.familyMemName}</span></div>`;
                    });
                    $(".framily_num").html(framilyList);
                    $('.framily_tips').html('请选择亲友号码')
                    $('.framily_num').removeClass('framily_num_show')
                    $('.framily').removeClass('framily_radius')
                    $('.framily_img').attr('src', './supplier/img/down.png');
                    if (USER.userLevel == '8') {
                        // 卓越卡
                        clickZzqy()
                        $(".zy_jtqzzLayout").attr('data-family', '1');//有家庭圈
                        $(".xzqq").removeClass('not-family');//无家庭圈
                        $(".zy_jtqzzLayout").show();//显示家庭圈数据弹窗
                        $("body").css("overflow", "hidden");
                        utils.addOpeartionsClickLog({button: "显示选择家庭圈的弹窗_卓越卡"});
                    } else {
                        $(".dv_jtqzzLayout").show();//显示家庭圈数据弹窗
                        $(".xzqq").addClass('family-not-lv8');
                        $("body").css("overflow", "hidden");
                        utils.addOpeartionsClickLog({button: "显示选择家庭圈的弹窗"});
                    }
                } else {
                    // 无家庭圈
                    if (USER.userLevel == '8') {
                        clickZzqy()
                        $(".xzqq").addClass('not-family');//无家庭圈
                        $(".zy_jtqzzLayout").attr('data-family', '0');//有家庭圈
                        $(".zy_jtqzzLayout").show();//显示家庭圈数据弹窗
                        $("body").css("overflow", "hidden");
                        utils.addOpeartionsClickLog({button: "显示创建家庭圈弹窗_卓越卡"});
                    } else {
                        $(".no_jtqzzLayout").show();//显示创建家庭圈弹窗
                        $("body").css("overflow", "hidden");
                        utils.addOpeartionsClickLog({button: "显示创建家庭圈的弹窗"});
                    }
                }
            } else {
                utils.toast('活动火爆，请稍后再试！');
                $("body").css("overflow", "auto");
                utils.addOpeartionsClickLog({button: "家庭圈数据异常"});
            }
        },
        error: function (data) {
            utils.toast('活动火爆，请稍后再试！');
            $("body").css("overflow", "auto");
            console.info("familyCircle.action出错了！");
            utils.addOpeartionsClickLog({button: "家庭圈数据查询失败"});
        }
    });
}

// 点击转赠给亲友
$(".zzqy").click(function () {
    utils.addOpeartionsClickLog({button: "转赠给亲友"});
    $(".xzqq").addClass('jtq_tapTop')
    clickZzqy()
});
// 点击转赠其他用户
$(".zzqt").click(function () {
    utils.addOpeartionsClickLog({button: "转赠其他用户"});
    $(".xzqq").removeClass('jtq_tapTop')
    addTcLong(false)
    resetFramilyNum()
    clickZzqt()

});

$('.qrPop_lqzzClose').bind('click', function () {
    utils.addOpeartionsClickLog({button: "关闭二次确认转赠弹窗"});
    $(".phone_qrLayout").hide();//转赠手机号码确认弹窗
    $("body").css("overflow", "auto");
    tcclose();

});

function clickZzqy() {
    $(".zzqt").removeClass('zzqyActive');
    $(".zzqy").addClass('zzqyActive');
    if (familyListArr.length > 0) {
        $(".zy_jtqzzLayout .tit_sma").html('请选择您需要转赠的亲友<br>转赠成功后权益将在24小时下发！')
        // $(".zy_jtqzzLayout .tit_sma").hide()

        $(".zy_jtqzz .tit_sma").removeClass('tit_sma_other')
        $(".jtq_tap").removeClass('jtq_tapTop')
        $(".friendstap").show()//展示亲友列表
        $(".othertap").hide()//输入号码隐藏
        $(".confirmBtn_zphone").hide();
        $(".confirmBtn_cj").hide();
        $(".confirmBtn_zz").show();
    } else {
        // 无家庭圈的卓越卡
        $(".zy_jtqzzLayout .tit_sma").html('您还没有爱家亲情圈成员')
        $(".zy_jtqzz .tit_sma").addClass('tit_sma_other')
        $(".jtq_tap").addClass('jtq_tapTop')

        $(".friendstap").hide()//亲友列表隐藏
        $(".othertap").hide()//输入号码隐藏
        $(".confirmBtn_zz").hide();
        $(".confirmBtn_zphone").hide();
        $(".confirmBtn_cj").show();
        // $(".zy_jtqzz .xzqq").hide()

    }
}

function clickZzqt() {
    $(".zy_jtqzz .tit_sma").removeClass('tit_sma_other')
    $(".zy_jtqzzLayout .tit_sma").html('请输入您要转赠的号码<br>转赠成功后权益将在24小时下发！')
    $(".zzqy").removeClass('zzqyActive');
    $(".zzqt").addClass('zzqyActive');
    $("#receivePhone2").val("");
    $(".jtq_tap").removeClass('jtq_tapTop')
    $(".friendstap").hide()//亲友列表隐藏
    $(".othertap").show()//展示输入号码
    $(".confirmBtn_cj").hide();
    $(".confirmBtn_zz").hide();
    $(".confirmBtn_zphone").show();

}

//领取权益之转赠二次确认手机号码弹窗
$('.cx_phone_qr').bind('click', function () {
    if (!getLoginStatus()) {
        return;
    }
    framilyPhone = '';//被转赠人号码
    framilyPhoneMi = '';//被转赠人号码加密1
    $("#receivePhone2").val("");
    $('.framily_tips').html('请选择亲友号码')
    $('.framily_num').removeClass('framily_num_show')
    $('.framily').removeClass('framily_radius')
    $('.framily_img').attr('src', ' ./supplier/img/down.png');

    if (USER.userLevel == '8') {
        $(".phone_zyLayout").hide();//转赠手机号码确认弹窗
        clickZzqy()
        $(".zy_jtqzzLayout").show();//卓越卡转赠弹窗
    } else {
        $(".phone_qrLayout").hide();//转赠手机号码确认弹窗
        $(".dv_jtqzzLayout").show();//输入手机号转赠弹窗
    }
    $("body").css("overflow", "hidden");
    utils.addOpeartionsClickLog({button: "转赠二次确认手机号码弹窗：重新选择号码按钮"});
});
$('.dv_lqzzClose').bind('click', function () {
    utils.addOpeartionsClickLog({
        button: "关闭"
    });
    $('.dv_lqzzlqLayout').hide();//确认领取二次弹窗
    $("body").css("overflow", "auto");
});
$('.dv_jtqzzClose').bind('click', function () {
    utils.addOpeartionsClickLog({button: "关闭家庭圈信息弹窗"});
    framilyPhone = '';//被转赠人号码
    framilyPhoneMi = '';//被转赠人号码加密
    $('.framily_tips').html('请选择亲友号码')
    $('.framily').removeClass('framily_radius')
    $('.framily_img').attr('src', './supplier/img/down.png');
    $('.dv_jtqzzLayout').hide();//关闭家庭圈数据弹窗
    $("body").css("overflow", "auto");
    addTcLong(false)
});
$('.no_jtqzzClose').bind('click', function () {
    utils.addOpeartionsClickLog({button: "关闭创建家庭圈的弹窗"});
    $(".no_jtqzzLayout").hide();//显示创建家庭圈弹窗
    $("body").css("overflow", "auto");
});
$('.zy_jtqzzClose').bind('click', function () {
    utils.addOpeartionsClickLog({button: "关闭家庭圈信息弹窗_卓越卡"});
    framilyPhone = '';//被转赠人号码
    framilyPhoneMi = '';//被转赠人号码加密
    $('.framily_tips').html('请选择亲友号码')
    $('.framily').removeClass('framily_radius')
    $('.framily_img').attr('src', './supplier/img/down.png');
    $('.zy_jtqzzLayout').hide();//关闭家庭圈数据弹窗
    $("body").css("overflow", "auto");
    addTcLong(false)
});

function showFramilyNum() {
    utils.addOpeartionsClickLog({button: "点击'请选择亲友号码'"});
    if ($('.framily_num').hasClass("framily_num_show")) {
        resetFramilyNum()
    } else {
        $('.framily_tips').html('请选择亲友号码')
        $('.framily_num').addClass('framily_num_show')
        $('.framily').addClass('framily_radius')
        $('.framily_img').attr('src', './supplier/img/up.png');
        addTcLong(true)
    }

}

function resetFramilyNum() {
    framilyPhone = '';//被转赠人号码
    framilyPhoneMi = '';//被转赠人号码加密
    $('.framily_tips').html('请选择亲友号码')
    $('.framily_num').removeClass('framily_num_show')
    $('.framily').removeClass('framily_radius')
    $('.framily_img').attr('src', './supplier/img/down.png');
    addTcLong(false)
}

function addTcLong(flag = false) {
    if (flag) {
        $('.dv_jtqzz').addClass('long');
        $('.dv_jtqzz .btn-gap').addClass('long');
        $('.dv_jtqzz .dv_jtqzzClose').addClass('long');

        // .zy_jtqzz
        $('.zy_jtqzz').addClass('long');
        $('.zy_jtqzz .btn-gap').addClass('long');
    } else {
        $('.dv_jtqzz').removeClass('long');
        $('.dv_jtqzz .btn-gap').removeClass('long');
        $('.dv_jtqzz .dv_jtqzzClose').removeClass('long');
        // .zy_jtqzz
        $('.zy_jtqzz').removeClass('long');
        $('.zy_jtqzz .btn-gap').removeClass('long');
    }


}

// 卓越卡转赠弹窗关闭按钮
$('.zyPop_lqzzClose').bind('click', function () {
    utils.addOpeartionsClickLog({button: "关闭二次确认转赠弹窗"});
    $(".phone_zyLayout").hide();//转赠手机号码确认弹窗
    $("body").css("overflow", "auto");
});


//转赠手机号码确认弹窗
function changeQyPhoneqr() {
    utils.addOpeartionsClickLog({button: "转赠手机号码确认弹窗确认转赠按钮:" + SOURECE, dynamicButton: PRODUCT_ID});
    var receivePhone = framilyPhoneMi;
    SOURECE = 1;
    btnType = 1;
    // 以下是进行转赠领取逻辑
    initQyStatus(receivePhone, 1);


}

// 首次确认转赠
function sureFramilyNum() {
    utils.addOpeartionsClickLog({button: "点击首次确认转赠"});
    if (framilyPhone == '') {
        utils.toast('请选择亲友号码');
        return;
    }
    if (USER.userLevel == '8') {
        // 卓越卡
        $(".zy_jtqzzLayout").hide();//显示家庭圈数据弹窗
        $(".num_phone_qr").text(framilyPhone);
        $(".phone_zyLayout").show();//转赠手机号码确认弹窗
    } else {
        $(".dv_jtqzzLayout").hide();//显示家庭圈数据弹窗
        $(".num_phone_qr").text(framilyPhone);
        $(".phone_qrLayout").show();//转赠手机号码确认弹窗
    }

    $("body").css("overflow", "hidden");
}

function creatFramily() {
    utils.addOpeartionsClickLog({button: "点击创建您的家庭圈按钮"});
    console.log('家庭圈链接:https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetUrl=https%3A%2F%2Fh.app.coc.10086.cn%2Factivity%2FtransferXcx%2Findex.html%3Fplatform%3Dcmcc%26appId%3D9255735455075303%26path%3Dpages%252Findex%252Findex');
    window.location.href = 'https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetUrl=https%3A%2F%2Fh.app.coc.10086.cn%2Factivity%2FtransferXcx%2Findex.html%3Fplatform%3Dcmcc%26appId%3D9255735455075303%26path%3Dpages%252Findex%252Findex'

}

//领取权益转赠输入号码确认领取
function changeQyPhone() {
    utils.addOpeartionsClickLog({button: "点击首次确定转赠"});
    var zzPhone = $("#receivePhone2").val(); //被转赠人号码
    framilyPhoneMi = $("#receivePhone2").val();
    if (zzPhone != undefined && zzPhone.length == 11) {
        $(".num_phone_qr").text(zzPhone);
        if (USER.userLevel == '8') {
            $(".zy_jtqzzLayout").hide();//输入手机号转赠弹窗
            $(".phone_zyLayout").show();//转赠手机号码确认弹窗
        } else {
            $(".phone_qrLayout").show();//转赠手机号码确认弹窗
        }

        $("body").css("overflow", "hidden");

    } else {
        utils.toast("请输入正确的手机号码");
        return;
    }
}

// 点击选择家庭圈号码
function clickFramilyNum(num, phonemi, name) {
    utils.addOpeartionsClickLog({button: "选择家庭圈的号码项"});
    addTcLong(false)
    console.log(num, phonemi, name)
    framilyPhone = num;//被转赠人号码
    framilyPhoneMi = phonemi;//被转赠人号码加密
    $('.framily_tips').html(num + '<span class="pl2">' + name + '</span>')
    $('.framily_num').removeClass('framily_num_show')
    $('.framily').removeClass('framily_radius')
    $('.framily_img').attr('src', 'https://qqt-res.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/supplier/img/down.png');
}

// $(document).ready(function () {
//     // 阻止 pop-mask 上的滑动事件，防止页面滚动
//     $('.pop-mask').on('touchmove', function (event) {
//         // 检查触摸事件是否发生在可滚动内容区域内
//         if (!$(event.target).closest('.content, .mh_main').length) {
//             event.preventDefault();
//         }
//     });
// });
function getUserIop(rappId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: ctx + '/iop/hit',
            type: 'GET',
            data: {
                rappId,
            },
            dataType: 'json',
            success: function (res) {
                if (res.status == 1) {
                    resolve(res.data)
                    utils.addOpeartionsClickLog({
                        button: "iop调用成功",
                        dynamicButton: rappId,
                    });
                } else {
                    resolve('');
                }
            },
            error: function () {
                console.log("error iop");
                resolve('');
            }
        });
    })
}
