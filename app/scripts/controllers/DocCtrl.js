app.controller("DocCtrl", ["$scope", "$log", "$q", "$timeout", "$state", "localStorageCache", "cacheKeyConst", "dialog", "DocService", "UserService", "OtpService", "AssetService", "EncryptService",
    function($scope, $log, $q, $timeout, $state, localStorageCache, cacheKeyConst, dialog, docService, userService, otpService, assetService, encryptService) {
        $scope.welcome = "hello main！";
        // for test purpose, provider pre setting otp phone number.
        $scope.otpPhoneNumber = "13764826688";
        $scope.otpFormSubmit = function(formValid) {
            // extra parameters will passed in otp directive as extraData for trySendOTP().
            // we can auto send otp verify code.
            $scope.triggerSend =true;

            $scope.otpExtraData = {
                username: "username",
                password: "password"
            };
            if (formValid) {
                var phoneNumber = $scope.otpPhoneNumber;
                var otpInput = $scope.otpInput;
                var otpResult = $scope.otpResult;
                $log.debug("OTP Form submiting..", phoneNumber, otpInput, otpResult);
            } else {
                dialog.alert("OTP Form container invalid data!");
            }
        };
        // For OTP.
        $scope.hasOtpPassed = function(otpPassResult) {
            $log.debug("OTP has passed: ", otpPassResult);
        };
        // test click.
        $scope.formSubmit = function() {
            // promise.
            var promise = docService.testSuccess("tianyingchun").then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message, {
                    btnText: "确认"
                });
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message, {
                    btnText: "确认"
                });
            });
        };
        //
        // Dialog box groups
        // ----------------------------------------------------------------
        // open alert box
        $scope.openAlertBox = function() {
            // redirect to error page.
            // $state.go("error");
            // dialog.showTipMessage("测试。。",3000, function() {
            //     $log.debug("tesitng.....");
            // })
            dialog.alert("hello alert dialog!", {
                btnText: "确认",
                preCloseCallback: function() {
                    $log.debug("已经点击了确认按钮", this);
                }
            });
        };
        // open share box
        $scope.openShareBox = function() {
            dialog.shareBox();
        };
        $scope.showSpinner = function() {
            dialog.showSpinner("处理中...");
            $timeout(function() {
                dialog.closeSpinner();
            }, 5000);
        };
        // open confirm box.
        $scope.openConfirmBox = function() {
            var promise = dialog.confirm("hello confirm dialog box!", {
                cancelBtnText: "取消",
                confirmBtnText: "确认",
                scope: $scope,
                preCloseCallback: "confirmPreCloseCallback"
            });
        };
        $scope.closeConfirmBox = function() {
            // directly close
            dialog.close();
        };
        // confirm box pre close callback
        // Note. the `this` in preCloseCallback is $dialog.
        $scope.confirmPreCloseCallback = function(close) {
            $log.debug("confirmPreCloseCallback: ", this, close);
            if (close) {
                $log.debug("已经点击了取消按钮");
                // directly close.
                return true;
            } else {
                // don't close dialog.
                var q = $q.defer();
                var originHtml = dialog.setDialogBodyHtml(this, "please wait...");
                var _this = this;
                // may be we need to exec remote api requesting.
                docService.testConfirmRequest("000001", 5000).then(function(result) {
                    // recovery dialog body html.
                    dialog.setDialogBodyHtml(_this, originHtml);
                    if (result.code == "000000") {
                        q.resolve();
                    } else {
                        dialog.setDialogBodyHtml(_this, "test...");
                        q.reject(result.code);
                    }
                }, function(result) {
                    dialog.setDialogBodyHtml(_this, "test...1");
                    q.reject(result.code);
                });
                return q.promise;
            }
        };
        $scope.fullSreenControl = function() {
            dialog.showFullScreenDialog("DocCtrl", $scope, {
                template: "<div> test</div>"
            });
        };
        $scope.setNewPageTitle = function() {
            $scope.setPageTitle("Test CMA TITLE~");
        };
        $scope.showIframeDialog = function() {
            dialog.showIframeDialog("https://test-ms.stg.1qianbao.com:2443/cma/900000014153.json", {});
        };
        //
        // helper utilities api groups
        // ----------------------------------------------------------------
        //localStorageCache
        //
        //cacheKeyConst.factories["DOC_SAMPLE_CODE_FACTORY"]
        var testCacheFactory = localStorageCache("DOC_SAMPLE_CODE_FACTORY");
        $scope.recoveryLocalStorage = function() {
            var cachedVal = testCacheFactory.get("DOC_SAMPLE_CODE");
            if (!$scope.helper) {
                $scope.helper = {
                    cacheValue: cachedVal
                };
            }
        };
        $scope.setLocalStorage = function() {
            var val = $scope.helper.cacheValue;
            testCacheFactory.put("DOC_SAMPLE_CODE", val);
            // add another localstorage cache domain.
            testCacheFactory.put("DOC_SAMPLE_CODE1", val);
        };
        $scope.getLocalStorageVal = function() {
            var cachedVal = testCacheFactory.get("DOC_SAMPLE_CODE");
            dialog.alert(angular.toJson(cachedVal));
        };
        $scope.clearLocalStorage = function() {
            // destroy all.
            testCacheFactory.remove("DOC_SAMPLE_CODE");
        };
        $scope.passwordEncrypt = function() {
            encryptService.encryptPassword("12345").then(function(result) {
                $log.debug(result);
            }, function(result) {
                $log.error(result);
            });
        };
        //https://tes5-www.stg.1qianbao.com:18443/auth/generatekey
        //{"merchantNo":"900000014153","id":"310110190001011235","idType":"I","uid":"AE841DFD29664F328343865B25A9352C","realName":"\u6d4b\u8bd5","mp":"15202115567"}
        $scope.generateH5Session = function() {
            token = $scope.tokenKey;
            $log.debug("current token: ", token);
            userService.getUserInfo({
                token: token
            }).then(function(result) {
                alert("success!");
            });
        };
        //
        // user service api groups
        // ----------------------------------------------------------------
        $scope.getUserInfo = function() {
            var promise = userService.getUserInfo({
                token: '23412'
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.checkUserInfo = function() {
            var promise = userService.checkUserInfo({
                phone: '23234',
                identityNum: '41234',
                realName: 'r24132',
                token: '23412'
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.bindCmaByOldUser = function() {
            var promise = userService.bindCmaByOldUser({
                phone: '23234',
                token: '23412'
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.bindCmaByNewUser = function() {
            var promise = userService.bindCmaByNewUser({
                phone: '23234',
                identityNum: '41234',
                realName: 'r24132',
                token: '23412',
                smsCode: '235324'
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        //
        // asset service api groups
        // ----------------------------------------------------------------
        $scope.getHomeData = function() {
            var promise = assetService.getHomeData().then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.doIncome = function() {
            var promise = assetService.doIncome({
                amout: 100,
                type: 1,
                setpaypassword: 'dsfadsfad324365vdvsvvds'
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.getBalance = function() {
            var promise = assetService.getBalance().then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.doPay = function() {
            var promise = assetService.doPay({
                amout: 100,
                type: 1,
                setpaypassword: 'dsfadsfad324365vdvsvvds'
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.getTransDetail = function() {
            var promise = assetService.getTransDetail({
                pageNum: 1,
                pageSize: 30
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        $scope.getEarningsDetail = function() {
            var promise = assetService.getEarningsDetail({
                pageNum: 1,
                pageSize: 30
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message);
            }, function(result) {
                $log.error("fetch data from server api error: ", result);
                dialog.alert(result.message);
            });
        };
        //
        // OTP service api groups
        // ----------------------------------------------------------------
        // 
        $scope.hasOtpPassed = function(hasPassed) {
            $log.debug("has OTP passed!", hasPassed);
        };
    }
]);