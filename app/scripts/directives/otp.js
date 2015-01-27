/**
 * Dependancy OtpImageSuite.js
 * angular js version: full: "1.3.8", major: 1, minor: 3, dot: 8, codeName: "prophetic-narwhal"
 *
 */
app.directive("otpSuites", ["$log", function($log) {
    var cfg = {
        timeout: 60, // second.
        leftSecondFormatter: "{0}s",

        // otpTimerStartTimeCacheKey: "OTP_TIMER_START_TIME",
        // otpPhoneNumberCacheKey: "OTP_PHONE_NUMBER"
        // 
        // 

    };
    var ctrl = ["$log", "$scope", "utility", "dialog", "OtpService", function($log, scope, utility, dialog, otpService) {

        //
        // initialization. 
        // ---------------------------------------------------------------------- 

        // customized try Send OTP service api name.
        var trySendOtpServiceName = scope.trySendOtpServiceName || "trySendOTP";

        // indicates if we will use other information to instead mobile to send otp.
        var ignoreMobileValidation = false;
        if (scope.ignoreMobile == "true") {
            ignoreMobileValidation = true;
            scope.ignoreMobile = true;
        }

        //
        // initialization end.
        // ----------------------------------------------------------------------

        var otpImgSuite = new OtpImageSuite(otpService, {
            trySendOTPServiceName: trySendOtpServiceName,
            ignoreMobileValidation: ignoreMobileValidation
        });
        // add event listeners.
        otpImgSuite.addReceiver(function(event) {
            var type = event.type;
            var data = event.data;
            // console.log("receiver-> type:", type, "data:", data);
            switch (type) {
                case "OTPSending":
                    OTPSendingHandler(event);
                    break;
                case "OTPSentSuccess":
                    OTPSentSuccessHandler(data);
                    break;
                case "error":
                    OTPErrorHandler(event);
                    break;
                case "showTicker":
                    showTickerHandler(data);
                    break;
                case "closeTicker":
                    closeTickerHandler(data);
                    break;
                case "captchaShow":
                    showCaptchaHandler(data);
                    break;
                case "captchaRefreshed":
                    refreshCaptchaUI(data);
                    break;
                case "tokenFlushed":
                    flushTokenHandler(data);
                    break;
                default:
                    break;
            }
        });

        // otp sending pre handler.
        function OTPSendingHandler(event) {
            // do nothing... may be we can show loading spinner here.
        };
        // otp sent success handler.
        function OTPSentSuccessHandler(data) {
            // save otp Session id.
            scope.otpResult = data;
            // disabled mobile input button, 
            scope.mobileInputDisabled = true;
            // disabled image captcha token if captcha control is visible.
            scope.captchaInputDisabled = true;

            // use isolate scope & to invoke outer controller'method.
            // has-otp-passed="hasOtpPassed(data)" in view html.
            if (scope.hasOtpPassed) {
                scope.hasOtpPassed({
                    data: data
                });
            }
        };
        // OTP Error handler.
        function OTPErrorHandler(event) {
            var error = event.data;
            var code = error.code;
            var message = error.message;
            switch (code) {
                case "mobile_invalid":
                    // we can use "errors.phone" passed from `mobileValidation` in formValidation.js
                    // if errors.phone=="" mobile is valid otherwise mobile is invalid.
                    scope.errors.phone = message;
                    break;
                case "captcha_refreshed_failed":
                    scope.errors.captcha = message;
                    break;
                case "token_flushed_failed":
                    // captcha token flush failed, clear existed token.
                    scope.captcha.captchaToken = "";
                    scope.errors.captcha = message;
                    break;
                default:
                    // for other unhandled exceptions.
                    dialog.alert(message);
                    break;
            }
        };
        // show ticker handler.
        function showTickerHandler(data) {
            scope.safeApply(function() {
                scope.running = true;
                scope.tickerText = utility.stringFormat(cfg.leftSecondFormatter, data);
            });
        };
        // close ticker handler.
        function closeTickerHandler(data) {
            scope.safeApply(function() {
                scope.running = false;
                scope.tickerText = "";

                // enabled mobile input control.
                scope.mobileInputDisabled = false;
                // enabled captcha input control.
                scope.captchaInputDisabled = false;
            });
        };

        // capcha show handler
        function showCaptchaHandler(data) {
            var captcha = data;
            // show captcha control.
            scope.showCaptchaControl = true;
            refreshCaptchaUI(captcha);
        };

        /**
         * While we re-input mobile number, we need to restore OTP Initialize states,
         * and make user has chance to send otp without captcha.
         */
        function restoreOTPInitState() {

        };
        // refresh captcha
        function refreshCaptchaUI(captcha) {
            // make sure that each url have not cache.
            scope.captcha.captchaUrl = captcha.captchaUrl ? captcha.captchaUrl + "?r=" + Math.random() : "";
            scope.captcha.captchaId = captcha.captchaId;
            // disable otp get button.
            // $this.find(options.otpGetSelector).prop("disabled", true);
        };

        // flush token handler.
        function flushTokenHandler(data) {
            var token = data.captchaToken;
            // clear captcha error message.
            scope.errors.captcha = "";
            scope.captcha.captchaToken = token;
            // $this.find(options.otpGetSelector).prop("disabled", false);
            if (scope.autoSendOtp) {
                // try to resend otp request.
                scope.trySendOtp();
            }
        };
        scope.trySendOtp = function() {
            $log.debug("try send otp....");
            // re send trigger Send to false, then
            scope.triggerSend = false;

            var phone = scope.phone;
            var token = scope.captcha.captchaToken;
            var deviceId = scope.deviceId || "";
            // we can provider extraData in outer scope.
            var extraData = angular.isObject(scope.extraData) ? scope.extraData : {};

            // try send OTP. need to clone new object, and pass into otpImageSuite. it is security.
            otpImgSuite.trySendOTP(phone, token, deviceId, angular.copy(extraData));
        };
        // refresh captch image 
        scope.refreshCaptcha = function() {
            // if captcha input disabled ignore refresh captcha
            if (!scope.captchaInputDisabled) {
                // refresh
                otpImgSuite.refreshCaptcha();
            }
        };
        // listner captcha input value has changed event.
        scope.captchaInputValueChanged = function(val) {
            var captchaInput = scope.captchaInput;
            var captchaId = scope.captcha.captchaId;
            // 4 characters supports
            if (scope.errors.captcha == "") {
                // invoke service to verify captcha input.
                otpImgSuite.verifyCaptcha({
                    captchaInput: captchaInput,
                    captchaId: captchaId
                });
            }
        };
        // listner mobile input value has changed event.
        scope.mobileInputValueChanged = function(val) {
            // if mobileValidation is not passed the phone alwasy undefined.
            var phone = scope.phone;
            if (phone) {
                if (scope.__lastCorrectPhoneNumber) {
                    // if current captcah control has shown.
                    if (scope.showCaptchaControl) {
                        // refresh captcha image. and clear captchaInput;
                        scope.captchaInput = "";
                        // clea captcha error message.
                        scope.errors.captcha = "";
                        scope.refreshCaptcha();
                    }
                }
                // saved last corrected phone number.
                scope.__lastCorrectPhoneNumber = phone;
            }
        };
    }];
    return {
        restrict: 'AC',
        transclude: true,
        replace: true,
        controller: ctrl,
        templateUrl: "template/otp.html",
        scope: {
            // initialized phone if provider this value hidden this control
            // we make sure that this telphone number is alwasy valid.
            phone: "=",
            otpResult: "=",
            otpInput: "=",
            // we can provider customized trySendOTP service instead trySendOTP api of OptService.js
            trySendOtpServiceName: "@",
            // if we use token instead mobile, we need to set ignoreMobile =true.
            // if ignoreMobile ="true", we will hide mobile input control, and then skip phone number validation.
            ignoreMobile: "@",

            // we can provider deviceId in trySendOTP api in outer controller.
            deviceId: "=",
            // we can provider extraData in trySendOTP api in outer controller.
            extraData: "=",
            // provider outer interface to allow controller manully trigger send otp button.
            // true: trigger send.
            triggerSend: "=",

            hasOtpPassed: "&"
        },
        link: function(scope, element, attrs) {
            // 
            // initializations here 
            // -----------------------------------------------------------------

            // all errors definitions.
            scope.errors = {
                phone: "", // the error message related phone.
                captcha: "", // the error message related captcha.
                otp: "" // the error message related otp.
            };
            // captcha information.
            scope.captcha = {
                // default is empty
                captchaId: "",
                // default is empty
                captchaUrl: "",
                // default is empty
                captchaToken: ""
            };

            // module status definitions.
            scope.running = false;
            scope.tickerText = "";
            // default we don't need to show captcha control.
            scope.showCaptchaControl = false;
            // the flag indicates if mobile input disabled 
            scope.mobileInputDisabled = false;
            // the flag indicates if captcha input disabled 
            scope.captchaInputDisabled = false;
            // 
            // initializations attrs here. 
            // -----------------------------------------------------------------
            // 
            // while captcha validation success we get captchaToken, and then auto invoke send Otp
            scope.autoSendOtp = (attrs.autoSendOtp == 'false' ? false : true);

            // if we set ignore mobile validation we need to set hideMobileControl = true also. 
            // set mobile input outer control hidden,default is shown
            scope.hideMobileControl = (scope.ignoreMobile == true) || (attrs.hideMobileControl == 'true' ? true : false);

            // watch triggerSend value change
            scope.$watch('triggerSend', function(newVal, oldVal) {
                if (newVal === true) {
                    // try to send otp, we don't care if successfull or failed.
                    scope.trySendOtp();
                }
            });

            // safe apply callback.
            scope.safeApply = function(fn, params) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn({
                            result: params
                        });
                    }
                } else {
                    this.$apply(fn);
                }
            };
        }
    };
}]);

/**
 * Customized mobile validation <input mobile-regexp="errorMessage">
 * note: below mobileValidation only used to OTP. contorl.
 * Note: you must place ng-model within this input box also.
 */
app.directive("mobileValidation", ["$log", "utility", "regexRuleConst", function($log, utility, regexRuleConst) {
    return {
        require: "ngModel",
        link: function(scope, elm, attrs, ctrl) {
            var bingdingTo = attrs["mobileValidation"];
            // an variable indicates if we don't need to check mobile validation.
            var ignoreMobileAttr = attrs["ignoreMobile"];
            var ignoreMobile = ignoreMobileAttr == "true" ? true : false;
            if (ignoreMobile) {
                // remove required attribute.
                scope.mobileValid = true;
                ctrl.$setValidity('mobileValid', true);

            } else {
                // ctrl.$setValidity('mobileValid', false);
                // utility.ns(scope, bingdingTo, "手机号码格式错误");

                ctrl.$parsers.unshift(function(viewValue) {
                    // if ignoreMobile has value, set mobileValid true.
                    if (ignoreMobile) {
                        scope.mobileValid = true;
                    } else {
                        scope.mobileValid = (viewValue && regexRuleConst["mobile"].test(viewValue)) ? 'valid' : undefined;
                    }
                    if (scope.mobileValid) {
                        ctrl.$setValidity('mobileValid', true);
                        // if true the message must be "". 
                        utility.ns(scope, bingdingTo, "");
                        return viewValue;
                    } else {
                        ctrl.$setValidity('mobileValid', false);
                        utility.ns(scope, bingdingTo, "手机号码格式错误");
                        return undefined;
                    }
                });
            }
        }
    };
}]);
// for OTP captha validation.
app.directive("captchaValidation", ["$log", "utility", "regexRuleConst", function($log, utility, regexRuleConst) {
    return {
        require: "ngModel",
        link: function(scope, elm, attrs, ctrl) {
            var bingdingTo = attrs["captchaValidation"];

            // get the captchaValidation value.
            // var val = elm.val();
            // if (!val) {
            //     scope.captchaValid = true;
            //     ctrl.$setValidity('captchaValid', false);
            // }
            // 
            ctrl.$parsers.unshift(function(viewValue) {
                scope.captchaValid = (viewValue && regexRuleConst["captchaInput"].test(viewValue)) ? 'valid' : undefined;
                if (scope.captchaValid) {
                    ctrl.$setValidity('captchaValid', true);
                    // if true the message must be "". 
                    utility.ns(scope, bingdingTo, "");
                    return viewValue;
                } else {
                    ctrl.$setValidity('captchaValid', false);
                    utility.ns(scope, bingdingTo, "请输入正确的验证码");
                    return undefined;
                }
            });
        }
    };
}]);
app.run(['$templateCache', function($templateCache) {
    $templateCache.put("template/otp.html",
        '<div class="otp">\
            <div ng-class="{\'input-group otp-mobile-wrapper\':true,\'disabled\':mobileInputDisabled,\'hide\':hideMobileControl}">\
                <span class="input-group-addon">手机号</span>\
                <input type="text" required="{{!hideMobileControl}}" ng-readonly="mobileInputDisabled" data-ignore-mobile="{{ignoreMobile || hideMobileControl}}" mobile-validation="errors.phone" ng-change="mobileInputValueChanged()" class="form-control" ng-model="phone" placeholder="请输入您的手机号码">\
                <span ng-class="{\'show\':errors.phone,\'tips\':true}">{{errors.phone}}<span class="caret"></span></span>\
            </div>\
            <div ng-class="{\'input-group otp-captcha-wrapper\':true,\'disabled\':captchaInputDisabled, \'show\':showCaptchaControl}">\
                <span class="input-group-addon">图片码</span>\
                <input type="text" ng-readonly="captchaInputDisabled" captcha-validation="errors.captcha" class="form-control" ng-model="captchaInput" ng-change="captchaInputValueChanged()" placeholder="请输入图片验证码">\
                <span class="input-group-btn"><img class="captcha-image input-group-btn" ng-src="{{captcha.captchaUrl}}" ng-click="refreshCaptcha()"></span>\
                <span ng-class="{\'show\':errors.captcha,\'tips\':true}">{{errors.captcha}}<span class="caret"></span></span>\
            </div>\
            <div class="input-group otp-input-wrapper">\
                <span class="input-group-addon">验证码</span>\
                <input type="text" required ng-model="otpInput" class="form-control" placeholder="请输入短信验证码">\
                <span class="input-group-btn otp-btn-ticker" ng-class="{\'show\':running,\'otp-ticker\':true}">{{tickerText}}</span>\
                <span class="input-group-btn otp-btn-send" ng-class="{\'show\':!running,\'otp-btn-send\':true,\'disabled\':errors.phone}" ng-click="trySendOtp()">发送</span>\
                <span ng-class="{\'show\':errors.otp,\'tips\':true}">{{errors.otp}}<span class="caret"></span></span>\
            </div>\
            <div ng-transclude></div>\
        </div>'
    );
}])
