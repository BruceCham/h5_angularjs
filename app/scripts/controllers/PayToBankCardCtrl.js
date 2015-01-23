app.controller("PayToBankCardCtrl", ["$scope", "$log", "$state", 'helper', "dialog", "AssetService", "BindCardService",
    function($scope, $log, $state, helper, dialog, assetService, bindCardService) {
        $scope.setPageTitle("转出");
        //如果跳转添加页面前已经输入了支出金额，则从本地拿出
        $scope.amount = helper.getMerchantInfo("amount") ? helper.getMerchantInfo("amount") : '';

        //判断向后发的请求全部完成后，判断如果有报错统一弹一次框
        $scope.errorMessage = [];
        $scope.$watchCollection("errorMessage", function(newVal, oldVal) {
            if (newVal.length == 2) {
                if ($scope.errorMessage.join("")) {
                    dialog.alert($scope.errorMessage.join("<br>"), {
                        btnText: "确认"
                    });
                }
            }
        });
        // 获取已绑定的银行卡list
        $scope.bankItemWidth = "140px";
        bindCardService.queryUserBoundBankcardInfo().then(function(result) {
            $scope.bankList = result.data.bankCardInfoList;
            $scope.selectedBankIndex = helper.getMerchantInfo("selectedBankIndex");
            if ($scope.selectedBankIndex) {
                $scope.selectedBankItem = $scope.bankList.length && $scope.bankList[$scope.selectedBankIndex];
            } else {
                // 当前选中的银行卡
                $scope.selectedBankItem = $scope.bankList.length && $scope.bankList[0];
                $scope.selectedBankIndex = 0;
            }

            if ($scope.bankList && $scope.bankList.length) {
                //获得选中的绑定银行卡的绑定关系ID
                $scope.bankCardId = $scope.bankList && $scope.bankList[0].bankCardId;
                //计算出绑定银行的container的宽度
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
            $scope.errorMessage.push("");
        }, function(result) {
            $scope.errorMessage.push(result.message);
        });

        //获取转出的限额值
        $scope.maxAmt = 0;
        assetService.getPayLimit().then(function(result) {
            $scope.maxAmt = result.data.quota ? result.data.quota / 100 : 0;
            $scope.errorMessage.push("");
        }, function(result) {
            $scope.errorMessage.push(result.message);
        });


        //选中银行卡的逻辑
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

        //跳转到添加银行卡页面，支出时tradeDirection=1
        $scope.addNewBankCard = function() {
            //如果跳转添加页面前已经输入了支出金额，则保存到本地
            if ($scope.amount) {
                helper.setMerchantInfo({
                    amount: $scope.amount
                });
            }
            $state.go("addNewbankCard", {
                tradeDirection: 1
            });
        };

        //跳转到输入支付密码页面，
        $scope.payPwdConfirm = function() {

            //转换金额到分
            var payAmount = helper.numMulti($scope.amount, 100);
            helper.setMerchantInfo({
                amount: $scope.amount,
                selectedBankIndex: $scope.selectedBankIndex
            });
            $state.go("payConfirm", {
                payData: angular.toJson({
                    amount: payAmount,
                    bankCardId: $scope.bankCardId
                })
            });
        };

        $scope.checkAmoumt = function(amount) {
            var validate = true;
            var regTest = /^[1-9]+[0-9]*(\.{1}[0-9]{1,2})?$|^0{1}(\.{1}[0-9]{1,2}){1}$/;
            if (amount == "") {
                $scope.payAmount_error = "";
            } else if (!regTest.test(amount) || parseFloat(amount) === 0) {
                $scope.payAmount_error = "金额格式错误，请重新输入";
                validate = false;
            } else if (amount > $scope.maxAmt) {
                $scope.payAmount_error = "转出金额不能超过最大可转出金额";
                validate = false;
            } else if (amount > 10000000) {
                $scope.payAmount_error = "转出金额不能超过1000万";
                validate = false;
            }
            return validate;
        };

        //验证表单
        $scope.validate = function() {
            if ($scope.amount && $scope.selectedBankItem) {
                return true;
            } else {
                return false;
            }
        };

    }
]);