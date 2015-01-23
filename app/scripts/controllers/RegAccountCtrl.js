//
// RegAccountCtrl controller, description.
// -----------------------------------------------------------------
app.controller("RegAccountCtrl", ["$scope", "$log", "$state", "helper", "UserService", "dialog",
    function($scope, $log, $state, helper, userService, dialog) {
        $scope.setPageTitle("开通");
        $scope.userData = helper.getUserInfo(['idCardNum', 'realName', 'token']) || {};
        var mobilenum = helper.getUserInfo('phone', true) || '';
        $scope.userData.idCardNumY = helper.getMaskedString($scope.userData.idCardNum, 3, 2, "*");
        $scope.userData.realNameY = helper.getMaskedUserName($scope.userData.realName);
        // TODO logic review, this channel must new user, so set otpType = 2
        $scope.otpType = 2;
        $scope.otpPhoneNumber = mobilenum;
        $scope.merchantInfo = helper.getMerchantInfo();
        $scope.otpExtraData = {
            otpType: $scope.otpType, //1: 老用户开户,2: 新用户开户
            token: $scope.userData.token,
            productName: helper.getMerchantInfo('merchantName')
        };
        $scope.checkUserInfo = function() {
            userService.bindCmaByNewUser({
                token: $scope.userData.token,
                smsCode: $scope.smsCode,
                phone: $scope.otpPhoneNumber,
                identityNum: $scope.userData.idCardNum,
                realName: $scope.userData.realName
            }).then(function(result) {
                $log.debug("fetch data from server api: ", result);
                if (result.code == "1026") {
                    // TODO 待产品确认流程及文案
                    dialog.alert("你填写的手机号被占用，请重新输入", {
                        btnText: "确认"
                    });
                    return false;
                };
                if (result.code == "1000") {
                    helper.setUserInfo({
                        "phone": $scope.otpPhoneNumber
                    });
                    $state.go("setpaypass");
                } else {
                    dialog.alert(result.message, {
                        btnText: "确认"
                    });
                }
            }, function(result) {
                $log.debug("fetch data from server api: ", result);
                dialog.alert(result.message, {
                    btnText: "确认"
                });
            });
        }
    }
]);