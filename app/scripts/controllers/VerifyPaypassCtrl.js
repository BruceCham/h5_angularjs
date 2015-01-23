//
// VerifyPaypassCtrl controller, description.
// -----------------------------------------------------------------
app.controller("VerifyPaypassCtrl", ["$scope", "$log", "helper", "UserService", "EncryptService", "dialog",
    function($scope, $log, helper, userService, encryptService, dialog) {
        $scope.setPageTitle("开通");
        $scope.otpSessionId = helper.getUserInfo('otpSessionId');
        $scope.otpCode = helper.getUserInfo('otpCode');
        $scope.mobilenum = helper.getUserInfo('phone') || '';
        $scope.productName = helper.getMerchantInfo('merchantName') || '产品';
        $scope.identityNum = helper.getUserInfo('idCardNum');
        $scope.realName = helper.getUserInfo('realName');
        $scope.switchPwdBtnText = "显示";
        $scope.switchPwdShow = function() {
            $scope.inputType = $scope.inputType ? "" : "text";
            $scope.switchPwdText = $scope.switchPwdText ? "" : "隐藏";
        };
        $scope.handleVerifyPwd = function() {
            var self = this;
            encryptService.encryptPassword($scope.payPass).then(function(result) {
                var encryptPasswordText = result.encryptedPwd;
                userService.bindCmaByOldUser({
                    token: helper.getUserInfo('token'),
                    payPassword: encryptPasswordText,
                    phone: $scope.mobilenum,
                    otpSessionId: $scope.otpSessionId,
                    identityNum: $scope.identityNum,
                    realName: $scope.realName
                }).then(function(result) {
                    $scope.handleBindOldUserResponse(result);
                }, function(result) {
                    dialog.alert(result.message);
                });
            }, function(result) {
                alert(result.message);
            });
        };
    }
]);