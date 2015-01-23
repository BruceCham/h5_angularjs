(function(app) {
    /**
     * define form directive to validate two password if the same.
     * sample code as below show.
     * <input type="password" name="oldPassword" ng-model="password.old" required />
     * <input type="password" name="newPassword" ng-model="password.new"
              validation-check="password.old != password.new"
              ng-minlength="6" required />
     * <input type="password" name="newPasswordConfirm"
       ng-model="password.confirm" ng-minlength="6"
       validation-check="password.new == password.confirm" required />
     */
    app.directive("validationCheck", ["$parse", "$log", function($parse, $log) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ngModel) {
                var check = $parse(attrs.validationCheck);
                // Watch for changes to this input
                scope.$watch(check, function(newValue) {
                    ngModel.$setValidity(attrs.name, newValue);
                });
            }
        };
    }]);
    /**
     * Provider uniform validation allow us pass function from controller,
     * if true validation passed, otherwise  failed.
     */
    app.directive("fnValidation", ["$parse", "$log", function($parse, $log) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var fn = attrs.fnValidation;
                ctrl.$parsers.unshift(function(viewValue) {
                    var $fn = scope[fn];
                    var check = true;
                    if (angular.isFunction($fn)) {
                        check = $fn.call(scope, viewValue);
                    }
                    ctrl.$setValidity(attrs.name, check);
                    return (check ? viewValue : undefined);
                });
            }
        };
    }]);

    /**
     *  <div class="input-group">
            <span class="input-group-addon">手机号</span>
            <input name="mobile" type="tel" max="11" min="11" class="form-control" placeholder="此卡在银行预留手机号" required data-ng-model="phone" mobile />
            <span class="tips" ng-show="verifyUserInfoForm.mobile.$error.mobile">手机号码不正确<span class="caret"></span></span>
        </div>
     */
    app.directive("mobile", ["$parse", "$log", "regexRuleConst", function($parse, $log, regexRuleConst) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var mobileReg = regexRuleConst.mobile;
                ctrl.$parsers.unshift(function(viewValue) {
                    var hasPassed = mobileReg.test(viewValue);
                    ctrl.$setValidity(attrs.name, hasPassed);
                    return (hasPassed ? viewValue : undefined);
                });
            }
        };
    }]);
    /**
     * sample code for validate payment password formatter.
     *  <input ng-model="password" password-validate="payment" required type="password" id="inputPassword" placeholder="Password">
     */
    app.directive("passwordValidate", ["$log", function($log) {
        return {
            require: 'ngModel',
            scope: {
                validateData: "=",
                errorMessage: "="
            },
            link: function(scope, elm, attrs, ctrl) {
                // all results key for payment password.
                var _paymentPwdErrorEnum = {
                    "mustbesixbit": "支付密码格式错误，请输入6位数字",
                    "sixbitorder": "支付密码不能是连续数字，请重新输入",
                    "sixbitsame": "支付密码不能是重复数字，请重新输入",
                    "sixbitbirthday": "支付密码不能与生日日期相同，请重新输入"
                };
                ctrl.$parsers.unshift(function(viewValue) {
                    var passwordType = attrs.passwordValidate || "";
                    var extraData = scope.validateData;
                    //@return result {array} that contains all avalilble message.
                    function validate(type) {
                        var result = [];
                        switch (type) {
                            case "payment":
                                //6位简单数字支付密码
                                //6位数字
                                if (!/^\d{6}$/.test(viewValue)) {
                                    result.push("mustbesixbit");
                                    break;
                                }
                                //6位上升
                                var arr = viewValue.split("");
                                var mark = 1;
                                for (var i = 0; i < arr.length; i++) {
                                    if ((arr[i] - arr[i - 1]) === 1) {
                                        if (++mark >= 6) {
                                            break;
                                        }
                                    } else {
                                        mark = 1;
                                    }
                                }
                                if (mark > 5) {
                                    result.push("sixbitorder");
                                    break;
                                }
                                //6位下降
                                mark = 1;
                                for (var i = 0; i < arr.length; i++) {
                                    if ((arr[i] - arr[i - 1]) === -1) {
                                        if (++mark >= 6) {
                                            break;
                                        }
                                    } else {
                                        mark = 1;
                                    }
                                }
                                if (mark > 5) {
                                    result.push("sixbitorder");
                                    break;
                                }
                                //6位数字完全相同
                                if (/(\d)\1\1\1\1\1/.test(viewValue)) {
                                    result.push("sixbitsame");
                                    break;
                                }
                                //生日判断
                                if (extraData.idCardNo && extraData.idCardNo.length == 18) {
                                    var borthday = extraData.idCardNo.substr(6, 8),
                                        startStr = borthday.substr(0, 6),
                                        endStr = borthday.substr(2, 6),
                                        startParten = new RegExp(startStr),
                                        endParten = new RegExp(endStr);
                                    var isOK = !(startParten.test(viewValue) || endParten.test(viewValue));
                                    if (!isOK) {
                                        result.push("sixbitbirthday");
                                    }
                                    break;
                                }
                                break;
                        }
                        return result;
                    };
                    // validate passed,set validity is true.
                    var validateFailedResult = validate(passwordType);
                    // no validate result failed 
                    if (!validateFailedResult.length) {
                        ctrl.$setValidity(passwordType, true);
                        return viewValue;
                    } else {
                        var _message = _paymentPwdErrorEnum[validateFailedResult[0]];
                        scope.errorMessage = _message;
                        ctrl.$setValidity(passwordType, false);
                        return undefined;
                    }
                });
            }
        };
    }]);
    /**
     * some costomized form field validators.
     */
    app.directive("idcardValidation", ["$log", "regexRuleConst", function($log, regexRuleConst) {
        return {
            require: "ngModel",
            link: function(scope, elm, attrs, ctrl) {
                var bingdingTo = attrs["idcardValidation"];
                ctrl.$parsers.unshift(function(viewValue) {
                    scope.idCardValid = (viewValue && regexRuleConst["idcard"].test(viewValue)) ? 'valid' : undefined;
                    if (scope.idCardValid) {
                        ctrl.$setValidity('idCard', true);
                        scope.loadingIdCardOrg = true;
                        return viewValue;
                    } else {
                        ctrl.$setValidity('idCard', false);
                        return undefined;
                    }
                });
            }
        };
    }]);
})(app);
