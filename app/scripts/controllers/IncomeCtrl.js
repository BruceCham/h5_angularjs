//
// IncomeCtrl controller, description.
// -----------------------------------------------------------------
app.controller("IncomeCtrl", ["$scope", "$log", "$stateParams", "AssetService", "helper", "dialog", "$state",
    function($scope, $log, $stateParams, assetService, helper, dialog, $state) {
        $scope.setPageTitle("转入");
        var merchantInfo = helper.getMerchantInfo();
        $scope.merchantAccountName = merchantInfo.merchantAccountName;
        //如果跳转添加页面前已经输入了支出金额，则从本地拿出
        $scope.amount = merchantInfo.amount ? merchantInfo.amount : '';
        //获得余额
        assetService.getBalance().then(function(result) {
            $scope.maxAmt = result.data.balance / 100;
            $scope.balance = helper.formatAmount(result.data.balance / 100);
        }, function(result) {
            dialog.alert(result.message, {
                btnText: "确认"
            });
        });

        $scope.checkAmoumt = function(amount) {
            var validate = true;
            var regTest = /^[1-9]+[0-9]*(\.{1}[0-9]{1,2})?$|^0{1}(\.{1}[0-9]{1,2}){1}$/;
            if (amount == "") {
                $scope.incomeAmount_error = "";
            } else if (!regTest.test(amount) || parseFloat(amount) === 0) {
                $scope.incomeAmount_error = "金额格式错误，请重新输入";
                validate = false;
            } else if (amount > $scope.maxAmt) {
                $scope.merchantInfo = helper.getMerchantInfo();
                $scope.incomeAmount_error = "转入金额不能超过" + $scope.merchantInfo.merchantAccountName + "余额";
                validate = false;
            } else if (amount > 10000000) {
                $scope.incomeAmount_error = "转入金额不能超过1000万";
                validate = false;
            }
            return validate;
        };

        //输入转入金额后，跳至输入支付密码页面
        $scope.incomeConfirm = function() {
            if ($scope.amount) {
                helper.setMerchantInfo({
                    amount: $scope.amount
                });
            }
            var incomeAmount = helper.numMulti($scope.amount, 100);
            $state.go("incomeConfirm", {
                incomeData: angular.toJson({
                    amount: incomeAmount,
                    bankCardId: ""
                })
            });
        };

        $scope.earningsRule = function() {
            if ($scope.amount) {
                helper.setMerchantInfo({
                    amount: $scope.amount
                });
            }
            window.location.href = helper.getMerchantInfo("earningsRuleUrl");
        };

    }
]);