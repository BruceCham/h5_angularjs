app.controller("ViewBankCardDetailCtrl", ["$scope", "$log", "$state", "$stateParams", "helper", "cacheKeyConst", "localStorageCache", "BindCardService", "dialog",
    function($scope, $log, $state, $stateParams, helper, cacheKeyConst, localStorageCache, bindCardService, dialog) {
        // set current page title.
        $scope.setPageTitle("添加银行卡");

        //toggle bank card detail
        $scope.showDetail = true;
        //show old or new process
        $scope.showProcess = true;
        $scope.userType = 1; //first send: 1, repeat send: 2

        //get current user info
        var userData = helper.getUserInfo(['idCardNum', 'realName']) || {};
        $scope.idCardNum = userData.idCardNum ? helper.getMaskedString(userData.idCardNum, 3, 2) : '';
        $scope.realName = userData.realName ? ((userData.realName).length < 3 ? helper.getMaskedString(userData.realName, 0, 1) : helper.getMaskedString(userData.realName, 0, 2)) : '';
        //get localstorage cache domain
        var bankCardCacheFactory = localStorageCache(cacheKeyConst.factories["BIND_CARD_FACTORY"]);
        var bankCardNum = bankCardCacheFactory.get("BIND_CARD_NUM");
        var unionpayCount = bankCardCacheFactory.get("REDIRECT_UNIONPAY_COUNT");
        $scope.bankCardNum = bankCardNum;
        //last four of bankcard
        if (bankCardNum && bankCardNum.length > 4) {
            $scope.bankCardTail = bankCardNum.substr(bankCardNum.length - 4);
        }
        //get bank card info
        bindCardService.queryBankInfo(bankCardNum, 5, 'Y').then(function(result) {
            var code = result.code,
                data = result.data,
                message = result.message;
            if (code == "1000") {
                $scope.cardBinList = data.cardBinList;
                if ($scope.cardBinList.length) {
                    if (unionpayCount > 2) {
                        $scope.cardBinList[0].openOnlinePayStatus = "1";
                    }
                    if ($scope.cardBinList[0].openOnlinePayStatus == "0") { // unionpay
                        $scope.unionpayURL = data.unionpayURL;
                        showUnionpay();
                    } else {
                        $scope.bankName = $scope.cardBinList[0].bankName;
                        $scope.bankCardType = $scope.cardBinList[0].bankCardType;
                        $scope.signTransNo = $scope.cardBinList[0].signTransNo;
                        $scope.version = $scope.cardBinList[0].version;
                        if ($scope.version == "1") {
                            //old process
                            $scope.otpExtraData = {
                                useType: 2,
                                versionType: 1
                            };
                        } else if ($scope.version == "2") {
                            //new process
                            $scope.otpExtraData = {
                                bankCardNo: $scope.bankCardNum,
                                bankCardType: $scope.bankCardType,
                                useType: $scope.userType,
                                signTransNo: $scope.signTransNo,
                                versionType: 2
                            };

                            $scope.hasOtpPassed = function(otpResult) {
                                $scope.userType = 2;
                                $scope.otpExtraData.useType = 2;
                            };
                        }
                    }
                }
            } else {
                dialog.alert(message, {
                    btnText: "确认",
                    preCloseCallback: function() {
                        $state.go("addNewbankCard");
                        $log.debug("已经点击了确认按钮", this);
                    }
                });
            }
        }, function(result) {
            dialog.alert(result.message);
        });
        //verify user info
        $scope.verifyUserInfo = function() {
            if ($scope.cardBinList[0].openOnlinePayStatus == "0") { // unionpay
                showUnionpay();
            } else {
                $scope.showDetail = false;
                $scope.otpPhoneNumber = $scope.phone;
            }
        };
        //handle add bank card
        $scope.addBankCardHandler = function() {
            dialog.showSpinner("处理中...");
            if ($scope.version == 1) {
                bindCardService.bindUserBankCardInfoV1($scope.bankCardNum, $scope.otpInput, {
                    bankCardType: $scope.bankCardType
                }).then(function(result) {
                    var code = result.code,
                        data = result.data,
                        message = result.message;
                    if (code == "1000") {
                        dialog.closeSpinner();
                        handleDirection();
                    } else {
                        dialog.closeSpinner();
                        dialog.alert(message);
                    }
                }, function(result) {
                    dialog.closeSpinner();
                    dialog.alert(result.message);
                });
            } else {
                bindCardService.bindUserBankCardInfoV2($scope.signTransNo, $scope.otpInput).then(function(result) {
                    var code = result.code,
                        data = result.data,
                        message = result.message;
                    if (code == "1000") {
                        dialog.closeSpinner();
                        handleDirection();
                    } else {
                        dialog.closeSpinner();
                        dialog.alert(message);
                    }
                }, function(result) {
                    dialog.closeSpinner();
                    dialog.alert(result.message);
                });
            }
        };

        function showUnionpay() {
            var promise = dialog.confirm("<div class=\"unionpay\"><h3 class=\"unionpay-title text-center\">温馨提示<\/h3><p class=\"unionpay-cont\">该银行卡需要开通银联在线支付才能添加哟<\/p></div>", {
                cancelBtnText: "稍后开通",
                confirmBtnText: "去开通",
                fontSizeClass: "unionpay",
                preCloseCallback: function(close) {
                    if (close) {
                        return window.history.back();
                    } else {
                        //add localstorage cache domain : record redirect to unionpay count
                        bankCardCacheFactory.put("REDIRECT_UNIONPAY_COUNT", unionpayCount + 1);
                        window.location.href = $scope.unionpayURL;
                    }
                }
            });
        };

        function handleDirection() {
            dialog.showTipMessage("成功添加银行卡", 1000, function() {
                if ($stateParams.tradeDirection == 1) { //pay
                    $state.go("payToBankCard");
                } else if ($stateParams.tradeDirection == 2) { //income
                    $state.go("incomeFromBankCard");
                }
            });
        };
    }
]);