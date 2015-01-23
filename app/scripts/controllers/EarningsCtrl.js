//
// EarningsCtrl controller, description.
// ----------------------------------------------------------------- -----------------------------------------------------------------
app.controller("EarningsCtrl", ["$scope", "$log", "$stateParams", "appConfig", "AssetService", "helper", "dialog",
	function($scope, $log, $stateParams, appConfig, assetService, helper, dialog) {
		$scope.setPageTitle("收益");
		$scope.hideEarnings = true;
		$scope.isNoData = true;
		$scope.head_bg = appConfig.getResourceUrl("content/image/head_bg.png");
		$scope.isNoData_img = appConfig.getResourceUrl("content/image/no_data.png");
		$scope.totalGains = helper.formatAmount(0);
		assetService.getEarningsDetail({
			pageNum: 1,
			pageSize: 7
		}).then(function(result) {
			if (result.code != "1000") {
				dialog.alert(result.message, {
					btnText: "确认"
				});
			} else {
				$scope.gainsDetailOrigin = result.data.gainsDetail;
				$scope.totalGains = helper.formatAmount(result.data.totalGains / 100);
				$scope.timeAxis = 20 + "px";
				if ($scope.gainsDetailOrigin && $scope.gainsDetailOrigin.length > 0) {
					var incomeDate = "",
						getDate = "",
						dat = "",
						month = "",
						day = "";
					$scope.gainsDetail = new Array();
					//过滤掉收益是0的数据
					for (var i = 0; i < $scope.gainsDetailOrigin.length; i++) {
						if ($scope.gainsDetailOrigin[i].userIncome > 0) {
							$scope.gainsDetail.push($scope.gainsDetailOrigin[i]);
							if (i === 0) {
								$scope.gainsDetail[0].incomeDate = "昨日";
							}
						}
					};
					if ($scope.gainsDetail.length === 0) {
						$scope.isNoData = false;
						return;
					} else {
						$scope.hideEarnings = false;
					}
					$scope.timeAxis = $scope.gainsDetail.length * 40 + 20 + "px";
					var maxIncome = $scope.gainsDetail[0].userIncome;
					$scope.gainsDetail[0].isLatestIncome = true;
					for (var i = $scope.gainsDetail.length - 1; i >= 0; i--) {
						//得到7天收益中最大的值
						if (maxIncome < $scope.gainsDetail[i].userIncome) {
							maxIncome = $scope.gainsDetail[i].userIncome;
						}
						$scope.gainsDetail[i].incomeOrigin = $scope.gainsDetail[i].userIncome;
						$scope.gainsDetail[i].inComewidth = ($scope.gainsDetail[i].userIncome / maxIncome) * 0.7 * 100 + '%';
						$scope.gainsDetail[i].userIncome = helper.formatAmount($scope.gainsDetail[i].userIncome / 100);
						if ($scope.gainsDetail[i].incomeDate != "昨日") {
							incomeDate = helper.stringToDate($scope.gainsDetail[i].incomeDate);
							getDate = new Date(incomeDate.getTime());
							month = getDate.getMonth() + 1;
							day = getDate.getDate();
							if (month < 10) {
								month = "0" + month;
							}
							if (day < 10) {
								day = "0" + day;
							}
							dat = month + "." + day;
							$scope.gainsDetail[i].incomeDate = dat;
						}
					};

				} else {
					$scope.isNoData = false;
				}

			}

		}, function(result) {
			dialog.alert(result.message, {
				btnText: "确认"
			});
		});

	}
]);