//
// PayCtrl controller, description.
// -----------------------------------------------------------------
app.controller("PayCtrl", ["$scope", "$log", "$stateParams", "AssetService", "helper", "dialog", "$state",
    function($scope, $log, $stateParams, assetService, helper, dialog, $state) {
        $scope.setPageTitle("转出");
        //获取转出的限额值
        $scope.maxAmt = 0;
        var merchantInfo = helper.getMerchantInfo();
        $scope.merchantAccountName = merchantInfo.merchantAccountName;
        //如果跳转添加页面前已经输入了支出金额，则从本地拿出
        $scope.amount = merchantInfo.amount ? merchantInfo.amount : '';

        assetService.getPayLimit().then(function(result) {
            $scope.maxAmt = result.data.quota ? result.data.quota / 100 : 0;
            $scope.maxAmtFormat = helper.formatAmount($scope.maxAmt);
        }, function(result) {
            dialog.alert(result.message, {
                btnText: "确认"
            });
        });
        $scope.checkAmoumt = function(amount) {
            var validate = false;
            var regTest = /^[1-9]+[0-9]*(\.{1}[0-9]{1,2})?$|^0{1}(\.{1}[0-9]{1,2}){1}$/;
            if (amount == "") {
                $scope.payAmount_error = "";
                validate = true;
            } else if (!regTest.test(amount) || parseFloat(amount) === 0) {
                $scope.payAmount_error = "金额格式错误，请重新输入";
            } else if (amount > $scope.maxAmt) {
                $scope.merchantInfo = helper.getMerchantInfo();
                $scope.payAmount_error = "转出金额不能超过最大可转出金额";

            } else if (amount > 10000000) {
                $scope.payAmount_error = "转出金额不能超过1000万";
            } else {
                validate = true;
            }
            return validate
        };

        $scope.payConfirm = function() {
            if ($scope.amount) {
                helper.setMerchantInfo({
                    amount: $scope.amount
                });
            }
            //转换金额到分, 并处理小数相乘产生的精度问题
            var payAmount = helper.numMulti($scope.amount, 100);
            $state.go("payConfirm", {
                payData: angular.toJson({
                    amount: payAmount,
                    bankCardId: ""
                })
            });
        };

    }
]);