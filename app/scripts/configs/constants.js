//
// all regex rules const definition
// --------------------------------------------------------------------------
app.constant("regexRuleConst", {
    "postcode": /^[1-9][0-9]{5}$/, //邮政编码
    "idcard": /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证号码验证表达式
    "chCode": /[^\u4e00-\u9fa5\s+]/ig, //所有字符必须为中文字符
    "enCode": /^[a-zA-Z\s]+$/, // 所有的英文字符
    "mobile": /^1[3-9][0-9]\d{8}$/, //验证手机号码/^1[3|4|5|8][0-9]\d{4,8}$/
    "empty": /^\s+|\s+$/ig, // 移除字符串空字符串
    "url": /^https?:\/\//,
    "captchaInput": /^.{4}$/ //TOP 图片验证码的验证表达式
});
//
// all cache factory keys const definition
// --------------------------------------------------------------------------
app.constant("cacheKeyConst", {
    // factory keyds.
    factories: {
        "COMMON_FACTORY": "common_info", //other common factory key.
        "MERCHANT_INFO_FACTORY": "merchant_info",
        "USER_INFO_FACTORY": "user_info",
        "BIND_CARD_FACTORY": "bind_card"
    },
    // define all cache item key const here.
    items: {
        "MERCHANT_DATA": "merchant_data",
        "USER_DATA": "user_data",
        "BIND_CARD_NUM": "bind_card_num",
        "REDIRECT_UNIONPAY_COUNT": "redirect_unionpay_count"
    }
});
//
// all pv trackingEvents  keys const definition
// --------------------------------------------------------------------------
app.constant("trackingEvents", {});
//
// remote api short cut
// dependancy: infrastructure.js
// --------------------------------------------------------------------------
app.factory("remoteApi", ["$location", "$log",
    function($location, $log) {
        return window.remoteApi;
    }
]);
//
// all assetUris const definition
// out h5 test env host is: http://d.1qianbao.com:2080/cma/{0}.json/
// https://h5.1qianbao.com
// --------------------------------------------------------------------------
app.factory("cmsStatics", ["remoteApi",
    function(remoteApi) {
        // get current environment.
        var env = remoteApi.env || "production";
        // 彩票宝服务协议
        // Stg2环境地址：https://test-ms.stg.1qianbao.com:2443/cma/lotteryticketbaoserviceagreement.html
        // 产线环境地址：https://ms.1qianbao.com/cma/lotteryticketbaoserviceagreement.html
        // 工资宝服务协议
        // Stg2环境地址：https://test-ms.stg.1qianbao.com:2443/cma/salarybaoserviceagreement.html
        // 产线环境地址：https://ms.1qianbao.com/cma/salarybaoserviceagreement.html
        // 
        // 平安大华基金管理有限公司网上直销前置式自助前台服务协议 1.2(彩票宝):
        // Stg2环境地址：https://test-ms.stg.1qianbao.com:2443/cma/lotteryticketbaopingandahuafundagreement.html
        // 产线环境地址：https://ms.1qianbao.com/cma/lotteryticketbaopingandahuafundagreement.html
        // 
        // 平安大华基金管理有限公司网上直销前置式自助前台服务协议 1.2(工资宝):
        // Stg2环境地址：https://test-ms.stg.1qianbao.com:2443/cma/salarybaopingandahuafundagreement.html
        // 产线环境地址：https://ms.1qianbao.com/cma/salarybaopingandahuafundagreement.html

        var _cmsStattics = {
            "production": {
                // provider merchant configs
                // "MERCHANT_CONFIG": "https://ms.1qianbao.com/cma/{0}.json"
                // stg: https://test-ms.1qianbao.com:1443/
                "MERCHANT_CONFIG": "https://ms.1qianbao.com/cma/{0}.json",
                //银行卡列表ICON
                "BANK_CARD_ICON": "https://ms.1qianbao.com/cma/bankcardicon/{0}.png"
            },
            "stg1": {
                "MERCHANT_CONFIG": "https://test-ms.stg.1qianbao.com:2443/cma/{0}.json",
                //银行卡列表ICON,http://test-d.1qianbao.com:2080/cma/900000014153.json
                "BANK_CARD_ICON": "https://test-ms.stg.1qianbao.com:2443/cma/bankcardicon/{0}.png"
            }
        };
        var _static = _cmsStattics["production"];
        // for testing envionment, and localhost, we use stg1 merchant config.
        if (env.indexOf("stg") === 0 || env == "localhost") {
            _static = _cmsStattics["stg1"];
        }
        return _static;
    }
]);
