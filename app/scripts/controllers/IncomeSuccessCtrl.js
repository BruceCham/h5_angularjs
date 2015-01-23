//
// IncomeSuccessCtrl controller, description.
// -----------------------------------------------------------------
app.controller("IncomeSuccessCtrl", ["$scope", "$log", "appConfig", "$stateParams", "AssetService", "helper", "dialog", '$state',
    function($scope, $log, appConfig, $stateParams, assetService, helper, dialog, $state) {
        $scope.setPageTitle("转入");
        $scope.cma_happy = appConfig.getResourceUrl("content/image/cma_happy.png");
        $scope.income_status_img = appConfig.getResourceUrl("content/image/success.png");
        var incomeResult = JSON.parse(decodeURIComponent($stateParams.incomeResult));
        $scope.amount = helper.formatAmount(incomeResult.amount / 100);
        var arrivalGainsDate = helper.stringToDate(incomeResult.arrivalGainsDate);
        var gainsDate = helper.stringToDate(incomeResult.gainsDate);
        $scope.arrivalGainsDate = helper.getWeekDay(arrivalGainsDate.getDay());
        $scope.gainsMonAndDay = helper.getMonAndDay(incomeResult.gainsDate);
        $scope.gainsDate = helper.getWeekDay(gainsDate.getDay());
        $scope.arrivalMonAndDay = helper.getMonAndDay(incomeResult.arrivalGainsDate);

        //获得商户名称和地址
        $scope.merchantInfo = helper.getMerchantInfo();
        $scope.merchantName = $scope.merchantInfo ? "返回" + $scope.merchantInfo.merchantName : "返回商户";
        
        // back to XX宝
        $scope.goBack = function() {
            $state.go("home");
        };

        // 继续转入
        $scope.doIncome = function() {
            $scope.modelType = helper.getMerchantInfo("modelType");
            if ($scope.modelType === 1) {
                $state.go("income");
            } else if ($scope.modelType === 2) {
                $state.go("incomeFromBankCard");
            }
        };

    }
]);