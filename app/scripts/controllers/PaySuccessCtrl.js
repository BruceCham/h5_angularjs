//
// IncomeSuccessCtrl controller, description.
// -----------------------------------------------------------------
app.controller("PaySuccessCtrl", ["$scope", "$log", "appConfig", "$stateParams", "AssetService", "helper", "dialog", "$state",
	function($scope, $log, appConfig, $stateParams, assetService, helper, dialog, $state) {
		$scope.setPageTitle("转出");
		$scope.isModelType1 = true;
		$scope.isModelType2 = true;
		$scope.cma_happy = appConfig.getResourceUrl("content/image/cma_happy.png");
		$scope.pay_status_img = appConfig.getResourceUrl("content/image/success.png");
		$scope.amount = helper.formatAmount($stateParams.amount / 100);

		//获得商户名称和地址
		$scope.merchantInfo = helper.getMerchantInfo();
		$scope.merchantName = $scope.merchantInfo ? "返回" + $scope.merchantInfo.merchantName : '返回商户'
		$scope.returnUrl = $scope.merchantInfo ? $scope.merchantInfo.returnUrl : '';

		if ($scope.merchantInfo.modelType === 1) {
			$scope.isModelType1 = false;
		} else if ($scope.merchantInfo.modelType === 2) {
			$scope.isModelType2 = false;
		}
		// TODO back to 商户
		$scope.goBack = function() {
			$state.go("home");
		};

	}
]);