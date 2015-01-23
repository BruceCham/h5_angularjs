app.controller("IncomeFromBankCardCtrl", ["$scope", "$log", "$state", 'helper', "dialog", "AssetService", "BindCardService",
    function($scope, $log, $state, helper, dialog, assetService, bindCardService) {
        $scope.setPageTitle("转入");
        //如果跳转添加页面前已经输入了支出金额，则从本地拿出
        $scope.amount = helper.getMerchantInfo("amount") ? helper.getMerchantInfo("amount") : '';

        //计算出绑定银行的container的宽度
        $scope.bankItemWidth = "140px";
        //获取已绑定的银行卡list
        bindCardService.queryUserBoundBankcardInfo().then(function(result) {
            if (result.code != "1000") {
                dialog.alert(result.message, {
                    btnText: "确认"
                });
            } else {
                $scope.bankList = result.data.bankCardInfoList;
                $scope.selectedBankIndex = helper.getMerchantInfo("selectedBankIndex");
                if ($scope.selectedBankIndex) {
                    $scope.selectedBankItem = $scope.bankList && $scope.bankList[$scope.selectedBankIndex];
                } else {
                    // 当前选中的银行卡
                    $scope.selectedBankItem = $scope.bankList && $scope.bankList[0];
                    $scope.selectedBankIndex = 0;
                }
                
                if ($scope.bankList && $scope.bankList.length) {
                    //获得选中的绑定银行卡的绑定关系ID
                    $scope.bankCardId = $scope.bankList && $scope.bankList[0].bankCardId;
                    $scope.bankItemWidth = ($scope.bankList.length + 1) * 140 + "px";
                    //截取后四位银行卡号和拿到银行卡类型
                    for (var i = $scope.bankList.length - 1; i >= 0; i--) {
                        var bankCardNum = $scope.bankList[i].bankCardNum;
                        var bankCardType = $scope.bankList[i].bankCardType;
                        $scope.bankList[i].bankCardNum = "尾号" + bankCardNum.substr(bankCardNum.length - 4, bankCardNum.length);
                        if (bankCardType === "C") {
                            $scope.bankList[i].bankCardType = "(信用卡)";
                        } else if (bankCardType === "D") {
                            $scope.bankList[i].bankCardType = "(储蓄卡)";
                        } else if (bankCardType === "P") {
                            $scope.bankList[i].bankCardType = "(存折)";
                        }
                    };
                }
            }

        }, function(result) {
            dialog.alert(result.message, {
                btnText: "确认"
            });
        });


        //选择出入银行卡的逻辑
        $scope.selectedBank = function(account) {
            for (var i = $scope.bankList.length - 1; i >= 0; i--) {
                var item = $scope.bankList[i];
                if (account === item) {
                    $scope.selectedBankIndex = i;
                    $scope.selectedBankItem = item;
                    $scope.bankCardId = item.bankCardId;
                    break;
                }
            };
        };
        //跳转到添加银行卡页面，转入时tradeDirection=2
        $scope.addNewBankCard = function() {
            //如果跳转添加页面前已经输入了支入金额，则保存到本地
            if ($scope.amount) {
                helper.setMerchantInfo({
                    amount: $scope.amount
                });
            }
            $state.go("addNewbankCard", {
                tradeDirection: 2
            });
        };

        $scope.checkAmoumt = function(amount) {
            var validate = false;
            var regTest = /^[1-9]+[0-9]*(\.{1}[0-9]{1,2})?$|^0{1}(\.{1}[0-9]{1,2}){1}$/;
            if (amount == "") {
                $scope.incomeAmount_error = "";
                validate = true;
            } else if (!regTest.test(amount) || parseFloat(amount) === 0) {
                $scope.incomeAmount_error = "金额格式错误，请重新输入";
            } else if (amount > 10000000) {
                $scope.incomeAmount_error = "转入金额不能超过1000万";
            } else {
                validate = true;
            }
            return validate;
        };

        //输入转入金额后，跳至输入支付密码页面
        $scope.incomeConfirm = function() {
            //转换金额到分
            var incomeAmount = helper.numMulti($scope.amount, 100);
            $state.go("incomeConfirm", {
                incomeData: angular.toJson({
                    amount: incomeAmount,
                    bankCardId: $scope.bankCardId
                })
            });
        };

        $scope.validate = function() {
            if ($scope.amount && $scope.selectedBankItem) {
                return true;
            } else {
                return false;
            }
        };

        $scope.transLimit = function() {
            //如果跳转添加页面前已经输入了支入金额，则保存到本地

            helper.setMerchantInfo({
                amount: $scope.amount,
                selectedBankIndex: $scope.selectedBankIndex
            });

            window.location.href = helper.getMerchantInfo("transferLimitsUrl");
        };

        $scope.earningsRule = function() {
            //如果跳转添加页面前已经输入了支入金额，则保存到本地

            helper.setMerchantInfo({
                amount: $scope.amount,
                selectedBankIndex: $scope.selectedBankIndex
            });
            window.location.href = helper.getMerchantInfo("earningsRuleUrl");
        };

    }
]);