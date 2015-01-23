var express = require('express');
var router = express.Router();
var base = require("./base");
var logger = require("../helpers/log");
/**
 * MOCK api success sample code.
 * API: http://localhost:30000/h5/cma_check_user_info.json
 */
router.post("/cma_check_user_info.json", function(req, res) {
    logger.debug("核对用户身份信息");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1000", // can customized biz error code.
        "resultMsg": "请求成功",
        "sessionId": "sd5ds5weq432",
        "status": 1,
        "accoutList": ['18312345678', '18656781234', '18999999999']
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_get_user_info.json", function(req, res) {
    logger.debug("根据token获取用户信息");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1000",
        "resultMsg": "请求成功",
        "sessionId": "sadas123df34ad23s",
        "phone": "18312345678",
        "idCardNum": "110110198806062519",
        "realName": "张张",
        "idType": "1",
        "merchantUid": "900000014153",
        "merchantId": "900000014153",
        "bindedUser": "0",
        "isPayPwdNull": "0"
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_old_user_open_account.json", function(req, res) {
    logger.debug("已注册用户登录,如果是第一次登录，开通CMA帐户");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        // 短信过期
        // "resultCode": "1156",
        // "resultMsg": "不在短信校验有效期内，请重新获取短信校验码",
        // // 有支付密码，需要验证支付面膜
        // "resultCode": "1182",
        // "resultMsg": "需要验证支付密码",
        // 没有支付密码的场景
        "resultCode": "1101",
        "resultMsg": "您的支付密码为空，请设置后再继续操作",
        // // 成功绑定
        // "resultCode": "1000",
        // "resultMsg": "绑定成功",
        "sessionId": "sadas123df34ad23s",
        "hasLoginPassword": "1",
        "otpSessionId": "1234",
        "loginId": "1234",
        "hasPayPassword": "1",
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_register_and_open_account.json", function(req, res) {
    logger.debug("已注册用户登录,如果是第一次登录，开通CMA帐户");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1156",
        "resultMsg": "请求成功",
        "sessionId": "sadas123df34ad23s"
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_asset_overview.json", function(req, res) {
    logger.debug("查看CMA用户资产首页");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1000",
        "resultMsg": "返回成功",
        "sessionId": "10sd0fasd023ddas",
        "yesterdayIncome": 150,
        "weekIncome": 10.3123,
        "monthIncome": 50.2344,
        "totalAmount": 1000020,
        "accumIncome": 1000.10,
        "millionIncome": 1.2314,
        "ratePreWeek": 62112,
        "availableAmount": 100000,
        "forzenAmount": 900000,
        "merchantId": "900000001",
        "productName": "彩票宝"
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_transfer_into_acct.json", function(req, res) {
    logger.debug("通过商户余额或银行卡转入yqb帐户");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1184",
        "resultMsg": "转入成功",
        "sessionId": "123456",
        "transId": "111111",
        "amount": "800000",
        "gainsDate": "下周二",
        "arrivalGainsDate": "下周三"
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_query_merchant_balance.json", function(req, res) {
    logger.debug("查询商户余额");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1184",
        "resultMsg": "商户余额",
        "sessionId": "sadas123df34ad23s",
        "balance": "2560000",
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_transfer_out_acct.json", function(req, res) {
    logger.debug("转出到商户余额或银行卡");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1184",
        "resultMsg": "需要进行图片验证码验证",
        "sessionId": "sadas123df34ad23s",
        "transId": "13112345678",
        "amount": 120000
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_query_trans_detail.json", function(req, res) {
    logger.debug("查询交易明细(不分页)");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1000",
        "resultMsg": "交易明细",
        "sessionId": "dfasd2fd324sa",
        "pageNum": "1",
        "nextPageFlag": true,
        "tradeInfos": [{
            "tradeId": "fd324saf345asdf",
            "tradeStatus": 1,
            "tradeDate": "2015,01,15",
            "tradeAmount": 1000,
            "tradeDirection": 1,
            "tradeType": "2",
            "tradeTypeDesc": "XX宝支出",
            "tradeStatusDesc": "交易成功",
            "productCode": "860323"
        }, {
            "tradeId": "fd324saf345asdf12",
            "tradeStatus": 2,
            "tradeDate": "2015,01,01",
            "tradeAmount": 1000,
            "tradeDirection": 2,
            "tradeType": "3",
            "tradeTypeDesc": "转入XX宝",
            "tradeStatusDesc": "等待支付",
            "productCode": "860323"
        }, {
            "tradeId": "fd324saf345asdf123",
            "tradeStatus": 10,
            "tradeDate": "2015,01,01",
            "tradeAmount": 1200000,
            "tradeDirection": 2,
            "tradeType": "3",
            "tradeTypeDesc": "转入XX宝",
            "tradeStatusDesc": "交易失败",
            "productCode": "860323"
        }],
        "merchantId": "90002332",
        "productName": "彩票宝"
    }
    base.apiOkOutput(res, result);
});
router.post("/cma_query_history_gains.json", function(req, res) {
    logger.debug("查询累计收益明细");
    // get user input parameters.
    var reqBody = req.body;
    var result = {
        "resultCode": "1184",
        "resultMsg": "累计收益",
        "sessionId": "wefa234sf234d",
        "totalGains": 6412,
        "pageNum": 1,
        "nextPageFlag": true,
        "gainsDetail": [{
            "userIncome": 1000,
            "currency": "RMB",
            "incomeDate": "01.01"
        }, {
            "userIncome": 1000,
            "currency": "RMB",
            "incomeDate": "01.02"
        }, {
            "userIncome": 900,
            "currency": "RMB",
            "incomeDate": "01.03"
        }, {
            "userIncome": 800,
            "currency": "RMB",
            "incomeDate": "01.04"
        }, {
            "userIncome": 800,
            "currency": "RMB",
            "incomeDate": "01.05"
        }, {
            "userIncome": 900,
            "currency": "RMB",
            "incomeDate": "01.06"
        }, {
            "userIncome": 1000,
            "currency": "RMB",
            "incomeDate": "01.07"
        }]
    }
    base.apiOkOutput(res, result);
});
/**
 * For OTP Services.
 */
router.post("/cma_send_otp_msg.json", function(req, res) {
    logger.debug("generateCaptcha....");
    var reqBody = req.body;
    var otpInput = reqBody.otpIput;
    var captchaToken = reqBody.captchaToken;
    var phone = reqBody.phone;
    if (captchaToken == "captcha_validated_token") {
        base.apiOkOutput(res, {
            resultCode: "1000",
            resultMsg: "发送成功!",
            otpSessionId: "otp_session_id",
            retrySeconds: 60
        });
    } else {
        base.apiOkOutput(res, {
            resultCode: "1184",
            resultMsg: "需要验证码!",
            captchaId: "zxcvbnm",
            captchaUrl: "https://cashier.1qianbao.com/gtproxy/captchacode/code/9/3f5d1468-06f9-46c4-bf03-c1d7ef5038bd"
        });
    }
});
// refresh captcha code.
router.post("/refresh_img_code.json", function(req, res) {
    logger.debug("refreshCaptcha....");
    var reqBody = req.body;
    base.apiOkOutput(res, {
        resultCode: "1000",
        resultMsg: "生成成功!",
        captchaId: "zxcvbnm",
        captchaUrl: "https://cashier.1qianbao.com/gtproxy/captchacode/code/9/3f5d1468-06f9-46c4-bf03-c1d7ef5038bd"
    });
});
// validate captcha input return token.
// {captchaId:"",captchaInput:""}
router.post("/cma_verify_img_code.json", function(req, res) {
    logger.debug("verifyCaptcha....");
    var reqBody = req.body;
    var captchaId = reqBody.captchaId;
    var captchaInput = reqBody.captchaInput;
    var result = {
        resultCode: '1000',
        resultMsg: '验证成功'
    };
    if (captchaId == "zxcvbnm" && captchaInput == "1111") {
        result.captchaToken = "captcha_validated_token";
    } else {
        result.resultMsg = "图片验证码错误，请重新输入！";
        result.resultCode = "GOUTONG_CAPTCHA_CAPTCHAVALUE_ERROR";
    }
    base.apiOkOutput(res, result);
});
router.get("/get_merchange_config.json", function(req, res) {
    logger.debug("getMerchangeConfig……");
    var reqBody = req.body;
    var merchantId = reqBody.merchantId;
    var result = {
        merchantName: "彩票宝", // 产品名称
        merchantAppName: "平安彩票",
        returnUrl: "http://www.baidu.com", // 返回商户app地址
        protocolUrl: "http://www.google.com", // 产品协议
    }
    base.apiOkOutput(res, result);
});

router.get("/cma_query_trans_model.json", function(req, res){
    logger.debug("get model type");
    var reqBody = req.body;
    var result = {
        resultCode: "1000",
        resultMsg: "生成成功!",
        sessionId: "zxcvbnm",
        modelType: 1   
    };
    base.apiOkOutput(res, result);
});

module.exports = router;