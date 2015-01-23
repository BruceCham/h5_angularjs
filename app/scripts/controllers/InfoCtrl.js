//
// InfoCtrl controller, description.
// -----------------------------------------------------------------
app.controller("InfoCtrl", ["$scope", "$log", "helper", "UserService", "$state", "dialog",
    function($scope, $log, helper, userService, $state, dialog) {
        $scope.setPageTitle("个人信息");
        var userData = helper.getUserInfo(['origin_idCardNum', 'origin_phone', 'origin_realName', 'token']) || {};
        var merchantData = helper.getMerchantInfo();
        var returnUrl = merchantData.returnUrl;
        var merchantName = merchantData.merchantName;
        var merchantAppName = merchantData.merchantAppName;

        $scope.idCardNum = userData.origin_idCardNum ? userData.origin_idCardNum : '';
        $scope.phone = userData.origin_phone ? userData.origin_phone : '';
        $scope.realName = userData.origin_realName ? userData.origin_realName : '';
        $scope.returnUrl = returnUrl ? returnUrl : '#error';
        $scope.merchantName = merchantName ? merchantName : '上一步';
        $scope.merchantAppName = merchantAppName ? merchantAppName : '上一步';
        $scope.token = userData.token;
        if (userData.origin_idCardNum) {
            $scope.isIdCardNumExist = true;
        };
        if (userData.origin_phone) {
            $scope.isPhoneExist = true;
        };
        if (userData.origin_realName) {
            $scope.isRealNameExist = true;
        };

        function handleUserInfo(data) {
            switch (data.status) {
                case 0:
                    handleNoRegUser();
                    break;
                case 1:
                    $state.go("bindUserInfo.captcha");
                    break;
                case 2:
                    $state.go("selectAccount", {
                        accoutList: encodeURIComponent(JSON.stringify(data.accoutList))
                    });
                    break;
                case 3:
                    $state.go("bindUserInfo.captcha");
                    break;
                case 4:
                    phoneConflictDialog();
                    break;
                default:
                    $state.go("regAccount");
            }
        }

        function handleNoRegUser() {
            dialog.confirm("请开通壹钱包账户后使用" + $scope.merchantName, {
                cancelBtnText: "取消",
                confirmBtnText: "开通",
                scope: $scope,
                preCloseCallback: function(close) {
                    if (!close) {
                        $state.go("regAccount");
                    }
                }
            })
        }

        function phoneConflictDialog() {
            dialog.alert("该手机号已被占，请重新开通", {
                btnText: "开通",
                preCloseCallback: function() {
                    helper.setUserInfo({
                        'phone': ''
                    });
                    $state.go("regAccount");
                }
            });
        }

        $scope.checkUserInfo = function() {
            userService.checkUserInfo({
                identityNum: $scope.idCardNum,
                phone: $scope.phone,
                realName: $scope.realName,
                token: $scope.token
            }).then(function(result) {
                if (result.code != "1000") {
                    dialog.alert(result.message);
                    return false;
                } else {
                    helper.setUserInfo({
                        status: result.data.status,
                        idCardNum: $scope.idCardNum,
                        phone: $scope.phone,
                        realName: $scope.realName
                    });
                    handleUserInfo(result.data);
                }
            }, function(result) {
                dialog.alert("系统繁忙，请稍后再试！");
            })
        }
    }
]);