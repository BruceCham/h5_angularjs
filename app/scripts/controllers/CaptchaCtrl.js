app.controller("CaptchaCtrl", ["$scope", "$log", "$state", 'helper', "UserService", "dialog",
    function($scope, $log, $state, helper, userService, dialog) {
        $scope.mobilenum = helper.getUserInfo('phone') || '';
        $scope.token = helper.getUserInfo('token') || '';
        $scope.merchantInfo = helper.getMerchantInfo();
        // TODO logic review, this channel must old user, so set otpType = 1
        $scope.otpType = 1;
        $scope.triggerSend = true;
        //assign otp phone number to otp directive.
        $scope.otpPhoneNumber = $scope.mobilenum;
        $scope.hasOtpPassed = function(result) {
            // TODO get phonenumber
            // console.log($scope.otpResult);
            //$scope.mobilenum = $scope.otpResult.;
            $scope.hasSent = true;
        };
        $scope.otpExtraData = {
            otpType: $scope.otpType, //1: 老用户开户,2: 新用户开户
            token: $scope.token,
            productName: helper.getMerchantInfo('merchantName')
        };
        $scope.handleCaptcha = function() {
            userService.bindCmaByOldUser({
                token: helper.getUserInfo('token'),
                phone: $scope.mobilenum,
                smsCode: $scope.smsCode,
                identityNum: helper.getUserInfo('idCardNum'),
                realName: helper.getUserInfo('realName')
            }).then(function(result) {
                $scope.handleBindOldUserResponse(result);
            }, function(result) {
                dialog.alert(result.message);
            });
        };
    }
]);