/**
 * OTP短信+图片验证码控件
 *
 * @class OtpImageSuite
 * @constructor
 */
(function(ns) {

    var DEBUG = true;

    // 定义正则表达式验证规则列表常量
    var REG_EXP_RULES = {
        "phone": /^1[3-9][0-9]\d{8}$/, //验证手机号码/^1[3|4|5|8][0-9]\d{4,8}$/
        "mobile": /^1[3-9][0-9]\d{8}$/, //验证手机号码/^1[3|4|5|8][0-9]\d{4,8}$/
        "trim": /^\s+|\s+$/g
    };

    // 定义组建内部错误消息列表常量
    var INNER_MESSAGES = {
        "common": "系统内部错误",
        "phone": "手机号码格式错误",
        "mobile": "手机号码格式错误"
    };

    var toString = Object.prototype.toString;

    function isObject(dest) {
        return dest && toString.call(dest) === "[object Object]";
    };

    function isFunction(dest) {
        return dest && toString.call(dest) === "[object Function]";
    };

    /**
     * Clone object.
     * @param  {object} source source
     * @return {object} new object.
     */
    function clone(source) {
        var F = function() {};
        F.prototype = source;
        return new F();
    };
    /**
     * 移除字符串前后空格
     * @method trim
     * @param  {String} s 给定的字符串
     * @return {String}   返回移除前后空格的字符串
     */
    function trim(s) {
        return s ? s.replace(REG_EXP_RULES["trim"], "") : "";
    };
    /**
     * 验证表单输入格式
     * @param  {String} type  表单输入的类型，如果mobileInputBox, otpInputBox,captchaInputBox
     * @param  {String} input 表单输入类型对应的待验证的值
     * @return {Boolean/String} true: 验证通过 otherwise 返回对应的错误消息string
     */
    function fieldValidator(type, input) {
        var regExp = REG_EXP_RULES[type];
        if (regExp && regExp.test(input)) {
            return true;
        } else {
            return INNER_MESSAGES[type];
        }
    };

    /**
     * 格式化字符串 e.g  stringFormat("my name is {0}, sex is: {1}","tian","male")
     * @param  {Array Like}
     * @return {String} 返回格式化后的新字符串
     */
    function stringFormat() {
        for (var fmt = arguments[0], ndx = 1; ndx < arguments.length; ++ndx) {
            fmt = fmt.replace(new RegExp('\\{' + (ndx - 1) + '\\}', "g"), arguments[ndx]);
        }
        return fmt;
    };
    /**
     * Log 调试信息到日志窗口，log("string ssss{0},{1}", "params1", "params2");
     */
    function log() {
        if (DEBUG && console && toString.call(console) == "[object Console]") {
            console.log.apply(console, arguments);
        }
    };

    // default configurations for OtpImageSuite.
    var cfg = {
        timeout: 1000,
        // provider default biz send otp service name.
        trySendOTPServiceName: "trySendOTP",
        // default we use mobile numnber to send otp, we can set as true, use token,.. to send otp.
        ignoreMobileValidation: false,
        // ticker second default
        tickerSecond: 60
    };
    /**
     * @class OtpImageSuite
     * @constructor
     * @param {object} otpImageService service contract.
     *  +trySendOTP(phone, captchaToken, deviceId)
     *  +refreshCaptcha()
     *  +verifyCaptcha(captchaVal, captchaId)
     * @return {code:"", message:"", data:""}
     */
    function OtpImageSuite(otpImageService, options) {
        this.cfg = clone(cfg);
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                this.cfg[prop] = options[prop];
            }
        }

        if (!otpImageService) {
            throw new Error("我们必须提供Otp ImageCode 的服务实例！");
        }

        this.handlers = {};

        // receiver,如果存在则调用接收器传递所有的广播事件.
        // 只允许一个接收器
        this.receiver = null;

        //为了复用存在框架的Service机制，这里我们注入外部的service API contract
        this.service = otpImageService;

        // ----------------------------------------------------
        // 辅助方法！
        // ----------------------------------------------------
        /**
         * @events showTicker (tickerLeft)
         *         closeTicker(tickerLeft)
         * @param  {object} scope
         * @param  {number} tickerLeft how many ticker second left.
         */
        var tickerId;

        var startTicker = function(scope, tickerLeft) {

            tickerLeft = tickerLeft || cfg.tickerSecond;

            tearDownTicker();

            tickerId = setTimeout(function() {
                log("ticker `%s` ", tickerLeft);
                scope.fireEvent("showTicker", tickerLeft);
                tickerLeft = tickerLeft - 1;
                if (tickerLeft > 0) {
                    startTicker(scope, tickerLeft);
                } else {
                    tickerLeft = 0;
                    scope.fireEvent("closeTicker", tickerLeft);
                }

            }, cfg.timeout);
        };

        var tearDownTicker = function() {
            if (tickerId) {
                clearTimeout(tickerId);
                tickerId = 0;
            }
        };

        this._startTicker = function(scope, tickerSecond) {
            // make sure provider  
            startTicker(scope, tickerSecond);
        };

    };
    OtpImageSuite.prototype = {
        constructor: OtpImageSuite,
        /**
         * 提供注册组件自定义事件API
         * @method addHandler
         * @param {string} type    自定义事件类型
         * @param {function} handler 自定义事件回调处理器
         */
        addHandler: function(type, handler) {
            if (typeof this.handlers[type] == "undefined") {
                this.handlers[type] = [];
            }
            // make sure it's function.
            if (isFunction(handler)) {
                this.handlers[type].push(handler);
            }
        },
        /**
         * 提供注册一个接受器，可以接受当前组建广播的所有消息
         * @param {function} handler 客户端接收器
         */
        addReceiver: function(handler) {
            this.receiver = handler;
        },
        /**
         * 提供移除组件自定义事件API
         * @method removeHandler
         * @param {string} type    自定义事件类型
         * @param {function} handler 自定义事件回调处理器
         */
        removeHandler: function(type, handler) {
            if (this.handlers[type] instanceof Array) {
                var handlers = this.handlers[type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    if (handlers[i] === handler) {
                        break;
                    }
                }
                handlers.splice(i, 1);
            }
        },
        /**
         * 提供触发组件自定义事件API
         * @method fire
         * @param {string} event 自定义事件类型
         */
        fire: function(event) {
            if (!event.target) {
                event.target = this;
            }
            // 如果定义了接收器，则不在单独广播单独的事件消息.
            if (this.receiver) {
                if (isFunction(this.receiver)) {
                    this.receiver(event);
                } else {
                    throw new Error("`receiver`接收器必须是一个函数！")
                }
            } else {
                if (this.handlers[event.type] instanceof Array) {
                    var handlers = this.handlers[event.type];
                    for (var i = 0, len = handlers.length; i < len; i++) {
                        handlers[i](event);
                    };
                }
            }
        },

        fireEvent: function(eventType, data) {
            log("fireEvent eventType: ", eventType, " data:", data);
            var event = {
                type: eventType,
                data: data || null
            };
            this.fire(event);
        },

        fireError: function(code, message) {
            this.fireEvent("error", {
                code: code,
                message: message
            });
        },

        /**
         * API: Provider short methods to validate mobile number.
         * @param  {string}  mobile mobile number.
         * @return {Boolean}        [description]
         */
        isMobile: function(mobile) {
            return fieldValidator("mobile", mobile);
        },
        /**
         * API: 尝试发送OTP到指定的手机客户端，如果成功fire事件通知UI显示timeout second.(60s)
         * @events OTPSending    () 将会在OTP发送短信之前被调用.
         *         OTPSentSuccess({data})
         *         captchaShow   ({captchaId:'', captchaUrl:''})
         * @param  {string}  phone string
         * @param  {string}  captchaToken string (optional)
         * @param  {string}  deviceId string (optional)
         */
        trySendOTP: function(phone, captchaToken, deviceId, extraData) {

            // check phone number.
            if (!this.cfg.ignoreMobileValidation) {
                var vlResult = fieldValidator("phone", phone);
                if (vlResult !== true) {
                    this.fireError("mobile_invalid", vlResult);
                    return;
                }
            }
            // otp sending event.
            this.fireEvent("OTPSending");

            var _this = this;
            // ------------------------------------------------
            // 外部注入SERVICE的API:trySendOTP(phone);
            var trySendOTPServiceAPI = this.service[this.cfg.trySendOTPServiceName];
            if (!isFunction(trySendOTPServiceAPI)) {
                this.fireError("try_send_otp_service_undefined", "自定义业务trySendOTP()不是一个函数");
                return;
            }
            // invoke biz service to send otp.
            trySendOTPServiceAPI.call(this.service, phone, captchaToken, deviceId, extraData, function(result) {
                var data = result.data;
                var code = result.code;

                switch (code) {
                    case "000000":
                        _this.fireEvent("OTPSentSuccess", data);

                        var tickerSecond = 0;

                        if (!isNaN(data.retrySeconds)) {
                            tickerSecond = parseInt(data.retrySeconds);
                        }
                        _this._startTicker(_this, tickerSecond);

                        break;
                    case "000001":
                        var captcha = data.captcha;
                        if (captcha) {
                            _this.fireEvent("captchaShow", captcha);
                        } else {
                            throw Error("当前服务器端未传回Captha对象");
                        }
                        break;
                    default:
                        log("nothing to do...., code: %s in `trySendOTP`", code);
                        _this.fireError(code, result.message);
                }
            });
        },
        /**
         * API: 手动刷新图片验证码,如果刷新成功则触发 `captchaRefreshed` 事件
         * @events captchaRefreshed       ({captchaId:'', captchaUrl:''})
         *         captchaRefreshedFailed (message)
         * @param  {object} extraData (optional)
         * @return {void}
         */
        refreshCaptcha: function(extraData) {
            // ------------------------------------------------
            // 外部注入SERVICE的API:refreshCaptcha();
            // 
            var _this = this;
            this.service.refreshCaptcha(extraData, function(result) {
                var code = result.code;
                var data = result.data;
                switch (code) {
                    case "000000":
                        //验证码刷新成功！
                        _this.fireEvent("captchaRefreshed", data.captcha);
                        break;
                    default:
                        //验证码输入错误.
                        _this.fireError("captcha_refreshed_failed", result.message);
                        break;
                }
            });
        },
        /**
         * API: 验证用户输入的图片验证码，如果验证通过则返回captchaToken,
         * 发送短信的是需要带上captchaToken
         * @events tokenFlushed       (captchaTokenValue string)
         *         tokenFlushedFailed (message)
         * @param  {object} captcha   {captchaId, captchaInput}
         * @param  {object} extraData attach extra data to servier api.
         * @return {void}
         */
        verifyCaptcha: function(captcha, extraData) {
            // ------------------------------------------------
            // 外部注入SERVICE的API:validateCaptcha(captcha);
            // captcha:{captchaId:"", captchaInput:""}
            // 
            var _this = this;
            this.service.verifyCaptcha(captcha, extraData, function(result) {
                var code = result.code;
                var data = result.data;
                switch (code) {
                    case "000000":
                        _this.fireEvent("tokenFlushed", data.captchaToken);
                        break;
                    default:
                        //验证码输入错误.
                        _this.fireError("token_flushed_failed", result.message);
                        break;
                }
            });
        }

    };
    //
    ns["OtpImageSuite"] = OtpImageSuite;

})(window);
