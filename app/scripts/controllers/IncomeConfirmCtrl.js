app.controller("IncomeConfirmCtrl", ["$scope", "$log", "$state", 'helper', "dialog", "$stateParams", "AssetService", "EncryptService",
	function($scope, $log, $state, helper, dialog, $stateParams, assetService, encryptService) {
		$scope.setPageTitle("支付密码");
		$scope.showConfirmDialog = function(msg) {
			$scope.modelType = helper.getMerchantInfo("modelType");
			$scope.merchantName = "返回" + helper.getMerchantInfo("merchantName");
			dialog.confirm(msg, {
				cancelBtnText: "继续转入",
				confirmBtnText: $scope.merchantName,
				scope: $scope,
				preCloseCallback: function(close) {
					if (close) {
						helper.setMerchantInfo({
							amount: "",
							selectedBankIndex: 0
						});
						if ($scope.modelType === 1) {
							$state.go("income");
						} else if ($scope.modelType === 2) {
							$state.go("incomeFromBankCard");
						}
					} else {
						$state.go("home");
					}
				}
			});
		};
		//转入成功，跳至转入成功页面
		$scope.doIncome = function() {
			$scope.submitting = true;
			encryptService.encryptPassword($scope.payPwd).then(function(result) {
				$scope.encryptPasswordText = result.encryptedPwd;
				var incomeData = JSON.parse(decodeURIComponent($stateParams.incomeData));
				assetService.doIncome({
					amount: incomeData.amount,
					type: helper.getMerchantInfo("modelType"), //TODO 传入交易类型，余额还是银行卡
					payPassword: $scope.encryptPasswordText,
					bankCardId: incomeData.bankCardId
				}).then(function(result) {
					$scope.submitting = false;
					if (result.code != "1000") {
						var msg = result.message;
						if (result.code == "1101") {
							msg = "温馨提示：" + msg;
							dialog.alert(msg, {
								btnText: "确认"
							});
						} else {
							$scope.showConfirmDialog(msg);
						}
					} else {
						helper.setMerchantInfo({
							amount: "",
							selectedBankIndex: 0
						});
						$state.go('incomeSuccess', {
							incomeResult: angular.toJson({
								amount: incomeData.amount,
								arrivalGainsDate: result.data.arrivalGainsDate,
								gainsDate: result.data.gainsDate
							})
						});
					}

				}, function(result) {
					$scope.submitting = false;
					dialog.alert(result.message, {
						btnText: "确认"
					});
				});

			}, function(result) {
				alert(result.message);
			});
		};

		//切换支付密码的type: text/password
		$scope.switchPwdShow = function() {
			$scope.inputType = $scope.inputType ? "" : "text";
			$scope.switchPwdText = $scope.switchPwdText ? "" : "隐藏";
		};

	}
]);