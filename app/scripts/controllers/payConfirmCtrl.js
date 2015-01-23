app.controller("PayConfirmCtrl", ["$scope", "$log", "$state", 'helper', "dialog", "$stateParams", "AssetService", "EncryptService",
	function($scope, $log, $state, helper, dialog, $stateParams, assetService, encryptService) {
		$scope.setPageTitle("支付密码");

		//转出前加密密码， 加密成功后提交转出操作
		$scope.doPay = function() {
			$scope.submitting = true;
			encryptService.encryptPassword($scope.payPwd).then(function(result) {
				$scope.encryptPasswordText = result.encryptedPwd;
				var payData = JSON.parse(decodeURIComponent($stateParams.payData));
				assetService.doPay({
					amount: payData.amount,
					type: helper.getMerchantInfo("modelType"), //传入交易类型，余额/银行卡
					payPassword: $scope.encryptPasswordText,
					bankCardId: payData.bankCardId
				}).then(function(result) {
					$scope.submitting = false;
					if (result.code != "1000") {
						var msg = result.message;
						if (result.code == "1037") {
							msg = "温馨提示：" + msg;
						}
						dialog.alert(msg, {
							btnText: "确认"
						});
					} else {
						helper.setMerchantInfo({
							amount: "",
							selectedBankIndex: 0
						});
						$state.go('paySuccess', {
							amount: payData.amount
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

		//切换密码输入框类型: text/password
		$scope.switchPwdShow = function() {
			$scope.inputType = $scope.inputType ? "" : "text";
			$scope.switchPwdText = $scope.switchPwdText ? "" : "隐藏";
		};

	}
]);