//
// HomeCtrl controller, description.
// -----------------------------------------------------------------
app.controller("HomeCtrl", ["$scope", "$log", "$stateParams", "appConfig", "AssetService", "helper", "dialog", "$state",
    function($scope, $log, $stateParams, appConfig, assetService, helper, dialog, $state) {
        if (helper.getMerchantInfo("modelType")) {
            helper.setMerchantInfo({
                "modelType": ""
            });
        };
        $scope.setPageTitle(helper.getMerchantInfo("merchantAppName"));
        $scope.head_bg = appConfig.getResourceUrl("content/image/head_bg.png");

        //调后台接口拿到home页数据，渲染到页面
        assetService.getHomeData().then(function(result) {
            if (result.code != "1000") {
                dialog.alert(result.message, {
                    btnText: "确认"
                });
            }
            $scope.yesterdayIncome = helper.amtToArr(result.data.yesterdayIncome / 100, 2);
            var ratePreWeek = result.data.ratePreWeek ? result.data.ratePreWeek : 0;
            $scope.ratePreWeek = helper.numDiv(ratePreWeek, 10000).toFixed(4);
            $scope.totalAmount = helper.formatAmount(result.data.totalAmount / 100);
            var millionIncome = helper.numDiv(result.data.millionIncome, 10000);
            $scope.millionIncome = helper.amtToArr(millionIncome, 4);
            $scope.accumIncome = helper.formatAmount(result.data.accumIncome / 100);
        }, function(result) {
            dialog.alert(result.message, {
                btnText: "确认"
            });
        });

        // 跳转到转出页面，根据类型1：跳转到余额转出页面， 类型2：跳转到转出到银行卡页面
        $scope.doPay = function() {
            //清空因为上次放弃的操作输入的金额和选中的银行卡
            helper.setMerchantInfo({
                amount: "",
                selectedBankIndex: 0
            });
            getModelType(function() {
                if ($scope.modelType === 1) {
                    $state.go("pay");
                } else if ($scope.modelType === 2) {
                    $state.go("payToBankCard");
                }
            });
        };

        // 跳转到转入页面，根据类型1：跳转到余额转入页面， 类型2：跳转到转入到银行卡页面
        $scope.doIncome = function() {
            //清空因为上次放弃的操作输入的金额和选中的银行卡
            helper.setMerchantInfo({
                amount: "",
                selectedBankIndex: 0
            });
            getModelType(function() {
                if ($scope.modelType === 1) {
                    $state.go("income");
                } else if ($scope.modelType === 2) {
                    $state.go("incomeFromBankCard");
                }
            });

        };

        //跳转到交易明细页面
        $scope.goTransDetail = function() {
            $state.go("transDetail");
        };

        //跳转到累计收益页面
        $scope.goEarnings = function() {
            $state.go("earnings");
        };

        //modelType:0:都不支持 1:余额模式,2：银行卡模式,3：两种都支持
        function getModelType(callback) {
            $scope.modelType = helper.getMerchantInfo("modelType");
            if (!$scope.modelType) {
                assetService.getModelType().then(function(result) {
                    if (result.code != "1000") {
                        dialog.alert(result.message, {
                            btnText: "确认"
                        });
                    } else {
                        $scope.modelType = result.data.modelType;
                        helper.setMerchantInfo({
                            "modelType": $scope.modelType
                        });
                        callback();
                    }
                }, function(result) {
                    dialog.alert(result.message, {
                        btnText: "确认"
                    });
                });
            }
        };

    }
]);