(function() {
    function OtpService($log, BaseHttpRequest) {

        function Child() {

            // inherits base http request infrustrature.
            BaseHttpRequest.call(this);

            // each service must be defined this key used to flag current request belong to.
            this.logAPIUniqueKey = "[OtpService]";

            //
            // --------------------------------------------------
            //  dtos
            //  
            //  
            // 绑卡新流程queryBankInfoDto->version =2,在调用绑卡之前发送短信验证码的老流程
            this.sendSMSCodeForProcessDto = function(result) {
                var data = result.data;
                if (result.code == "1000") {
                    result.code = "000000";
                }
                if (result.code == "000000") {
                    result.data = {
                        sessionId: data.sessionId
                    };
                }
                return result;
            };

            this.trySendOtpBaseDto = function(result) {
                var data = result.data;
                //  For OtpImageSUite.js we use "000000" as success status code.
                if (result.code == "1000") {
                    result.code = "000000";
                }

                if (result.code == "000000") {
                    // send successfully!.
                    result.data = {
                        // maskedMobile: data.phone,
                        sessionId: data.sessionId,
                        // it's optional, otp id number.
                        phone: data.phone
                    };
                } else if (result.code == "1184") {
                    // alwasy use 0000001 to ask captcha code.
                    result.code = "000001";
                    // send failed, return us captcha entity.
                    // return new captcha.
                    result.data = {
                        captcha: {
                            captchaId: data.captchaId,
                            captchaUrl: data.captchaUrl
                        }
                    };
                } else if (result.code == "1185") {
                    // 图片验证结果已失效
                    result.code = "000002";
                }
                return result;
            };

            // refresh captcha DTO.
            this.refreshCaptchaDto = function(result) {
                var data = result.data;
                if (result.code == "1000") {
                    // force converted to "000000"
                    result.code = "000000";
                    // return new captcha.
                    result.data = {
                        captcha: {
                            captchaId: data.captchaId,
                            captchaUrl: data.captchaUrl
                        }
                    };
                }
                return result;
            };

            // verify captcha DTO.
            this.verifyCaptchaDto = function(result) {
                if (result.code == "1000") {
                    // force converted to "000000"
                    result.code = "000000";
                    // return new captchaToken property.
                    result.data = {
                        captchaToken: result.data
                    };
                }
                return result;
            };

        };

        // inherits prototype methods from httpRequest.
        inherit(Child, BaseHttpRequest);

        // Expose service request apis to consumer.
        angular.extend(Child.prototype, {
            /**
             * 绑卡老流程queryBankInfoDto->version =1
             * 在调用绑卡之前发送短信验证码的老流程
             * @param  {number} useType   
             *          1 注册
                        2 绑定银行卡
                        3 重设登录密码
                        4 重发交易二次认证短信码。
                        5 注册绑卡
                        6 预付费卡绑定校验
                        7 恶意注册用户登录校验
                        8 短信登录
                        9 活钱宝自动转出设置 风控短信二次验证
                        10 伪网关支付短信
                        11 OAuth注册
                        12 还款通OTP验证
                        13 申请花漾卡
                        14 激活花样
             * @param  {number} phone     用户输入的手机号码
             * @param  {object} extraData 可选，如果我们有多个需要传递的可选参数，则通过此接口传送
             *                            这里不需要图片验证码
             *                 loginId:注册用户的手机号码,
             *                 tradeId:交易单号(在用途为4和10时才有意义，为4和10时为必填字段)
             *                 bankCardId:绑定银行卡ID(在用途为4时候才有意义。在充值或提现时候是必须的)
             *                 bankCardNo:银行卡号(在用途为4、9、12时候才有意义。在提现时候是必须的; 在用途为9或12时,送卡号尾号4位20140918版修改)
             *                 verToken:身份确认token(在useType为7（恶意注册用户登录校验）时必须输入，用于确定发送人身份后，将生成的校验码备份到缓存中心)
             *                 extParams:扩展信息(格式为json,在useType为9时,传{"amount":"xx","date":"xx"}, 金额单位为分;)
             * @return {promise}
             */
            sendSMSCodeForV1Process: function(phone, captchaToken, deviceId, extraData, cb) {
                //useType, phone, extraData
                var reqData = this.getRequestData({
                    operationType: "/h5/op_apply_sms_code_with_session.json",
                    useType: extraData.useType,
                    phoneNum: phone
                });

                this.postRequest("/h5/op_apply_sms_code_with_session.json", reqData, this.sendSMSCodeForProcessDto).then(cb, cb);
            },
            /**
             * 从BindCardService.js 移植到此处因为OTP 的API地址发生了变化
             * 新的绑卡流程，验证用户身份信息，验证用户身份信息并发送短信验证码
             * 注意此处由于此接口完全不同于 OTPService原有设计,这里除了保持基础参数不变化，在extraData
             * 里面传递具体的业务参数
             * extraData:{
             *     bankCardNo, bankCardType, useType, signTransNo, phone, extraData
             * }
             * @param  {number} bankCardNo   银行卡卡号
             * @param  {string} bankCardType 银行卡类型
             * @param  {number} useType      用途,1-验身并发送短信 2-重发短信
             * @param  {string} signTransNo  签约流水
             * @param  {number} phone        银行预留手机号
             * @return {promise}
             */
            sendSMSCodeForV2Process: function(phone, captchaToken, deviceId, extraData, cb) {
                var reqData = this.getRequestData({
                    operationType: "/h5/op_check_user_info.json",
                    bankCardNo: extraData.bankCardNo,
                    bankCardType: extraData.bankCardType,
                    useType: extraData.useType,
                    signTransNo: extraData.signTransNo,
                    phoneNum: phone
                });

                this.postRequest("/h5/op_check_user_info.json", reqData, this.sendSMSCodeForProcessDto).then(cb, cb);
            },
            /**
             * combine two send SMS perocess.
             */
            sendSMSCodeProcess: function(phone, captchaToken, deviceId, extraData, cb) {
                var versionType = extraData.versionType;
                delete extraData.versionType;
                if (versionType == 1) {
                    // go old service.
                    return this.sendSMSCodeForV1Process(phone, captchaToken, deviceId, extraData, cb);
                } else {
                    return this.sendSMSCodeForV2Process(phone, captchaToken, deviceId, extraData, cb);
                }
            },
            /**
             *
             * 当前为默认的OTP发送服务用来，也是OTP 控件标准服务的接口参数模型，我们如果有自定义的trySendOTP
             * 我们需要保持当前接口的参数和trySendOTP一样，其他的业务参数都需要定义在extraData.
             * Sample业务：发送CMA用户开户短信，
             * otpType:OTP发送类型, 老用户开户：1,新用户开户：2,
             * token: "外部商户用户授权token"
             * 我们需要吧otpType 放到extraData 在Controller里面去传递.
             * @method trySendOTP
             * @param  {number}         phone mobile phone number.
             * @param  {Function} cb    callback
             * callback (result)
             * if result.code=="000000"
             *     {maskedMobile,retrySeconds}
             * else
             *     {captchaId, captchaUrl}
             */
            trySendOTP: function(phone, captchaToken, deviceId, extraData, cb) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_send_otp_msg.json",
                    phone: phone,
                    captchaToken: captchaToken
                }, extraData);

                // callback.
                cb = angular.isFunction(cb) ? cb : angular.noop;
                this.postRequest("/h5/cma_send_otp_msg.json", reqData, this.trySendOtpBaseDto).then(cb, cb);
            },

            /**
             * refresh captcha API
             * @method refreshCaptcha
             * @param  {Function} cb    callback
             */

            /**
             * [refreshCaptcha description]
             * @param  {sdf}   extraData [description]
             * @param  {df} cb        dfgj
             * @return {fdg}             rg
             */
            refreshCaptcha: function(extraData, cb) {
                var reqData = this.getRequestData({
                    operationType: "/h5/refresh_img_code.json"
                }, extraData);

                // callback.
                cb = angular.isFunction(cb) ? cb : angular.noop;

                this.postRequest("/h5/refresh_img_code.json", reqData, this.refreshCaptchaDto).then(cb, cb);
            },
            /**
             * verifyCaptcha API
             * @method verifyCaptcha
             * @param  {object}       captcha, {captchaId:"", captchaInput:""}
             * @param  {object}       extraData: {} anything.
             * @param  {Function} cb  callback (captchaToken)
             */
            verifyCaptcha: function(captcha, extraData, cb) {
                var reqData = this.getRequestData({
                    operationType: "/h5/cma_verify_img_code.json",
                    captchaInput: captcha.captchaInput,
                    captchaId: captcha.captchaId
                }, extraData);

                // callback.
                cb = angular.isFunction(cb) ? cb : angular.noop;

                this.postRequest("/h5/cma_verify_img_code.json", reqData, this.verifyCaptchaDto).then(cb, cb);
            }

        });

        return new Child();
    };

    // expose service contract.
    app.service('OtpService', ['$log', 'CMAHttpRequest', OtpService]);

})(app);
