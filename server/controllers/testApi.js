var express = require('express');
var router = express.Router();
var base = require("./base");
var logger = require("../helpers/log");

/**
 * MOCK api success sample code.
 * API: http://localhost:30000/testApi/testSuccess
 */
router.post("/testSuccess.json", function(req, res) {
    logger.debug("sample api testSuccess....");

    // get user input parameters.
    var reqBody = req.body;

    var result = {
        code: '10000', // success code. othersize biz code.
        message: '加载失败，请稍后重试！', // return message to client.
        user: {
            name: "tianyingchun",
            password: "passport"
        },
        anotherString: "another data",
        anotherBoolean: true,
        inputParams: reqBody // capture input paramsters.
    };

    base.apiOkOutput(res, result);
});

router.post("/testConfirmRequest", function(req, res) {
    logger.debug("sample api testConfirmRequest....");

    // get user input parameters.
    var reqBody = req.body;

    var mockResultCode = reqBody.mockResultCode;
    var sleepSecond = reqBody.sleepSecond;
    var result = {
        code: mockResultCode || '10000', // success code. othersize biz code.
        message: '加载成功！' // return message to client.
    };
    // mock server sleep second.
    if (sleepSecond) {
        setTimeout(function() {
            base.apiOkOutput(res, result);
        }, sleepSecond);
    } else {
        base.apiOkOutput(res, result);
    }
});

/**
 * MOCK api failed smaple code.
 * API: http://localhost:30000/testApi/testFailed
 */
router.post("/testFailed", function(req, res) {

    logger.debug("sample api testFailed....");

    // get user input parameters.
    var reqBody = req.body;

    var errorResult = {
        code: "11111", // can customized biz error code.
        message: "server error message!"
    };

    base.apiErrorOutput(res, errorResult);
});

router.post("/h5/cma_check_user_info.json", function(req, res) {

    logger.debug("验证用户信息");

    // get user input parameters.
    var reqBody = req.body;

    var result = {
        "resultCode": "10000", // can customized biz error code.
        "resultMsg": "请求成功",
        "sessionId": "sd5ds5weq432",
        "status": 2,
        "accoutList": ['18312345678', '18656781234', '18999999999']
    }

    base.apiErrorOutput(res, result);
});


module.exports = router;
