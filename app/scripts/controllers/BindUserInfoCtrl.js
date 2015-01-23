app.controller("BindUserInfoCtrl", ["$scope", "$log", "$state", 'helper', "dialog",
    function($scope, $log, $state, helper, dialog) {
        $scope.mobilenum = helper.getUserInfo('phone');
        $scope.handleBindOldUserResponse = function(result) {
            if (result.code != '1000') {
                switch (result.code) {
                    // 如果支付密码存在，需要验证支付密码
                    case "1182":
                        helper.setUserInfo({
                            smsCode: $scope.smsCode,
                            otpSessionId: result.data.otpSessionId
                        });
                        $state.go('bindUserInfo.verifypaypass');
                        break;
                        // 如果支付密码不存在，绑定成功，但需要去设置支付密码
                    case "1153":
                        dialog.alert("已绑定壹钱包账户：</br>" + $scope.mobilenum, {
                            btnText: '确定',
                            preCloseCallback: function() {
                                $state.go('setpaypass');
                            }
                        });
                        break;
                        // 短信验证码过期
                    case "1156":
                        dialog.alert(result.message, {
                            btnText: '确定',
                            preCloseCallback: function() {
                                $state.go('bindUserInfo.captcha');
                            }
                        });
                        break;
                        // 短信输入错误
                    case "1022":
                        dialog.alert(result.message, {
                            btnText: '确定',
                            preCloseCallback: function() {
                                $state.go('bindUserInfo.captcha');
                            }
                        });
                        break;
                        // 密码验证错误
                    case "1101":
                        dialog.alert(result.message, {
                            btnText: '确定'
                        });
                        break;
                        // 默认只是报错，不返回app
                    default:
                        dialog.alert(result.message, {
                            btnText: '确定'
                        });
                }
            } else {
                dialog.alert("已绑定壹钱包账户：</br>" + $scope.mobilenum, {
                    btnText: '确定',
                    preCloseCallback: function() {
                        $state.go('home');
                    }
                });
            }
            return false;
        }
    }
]);