//
// SetPaypassCtrl controller, description.
// -----------------------------------------------------------------
app.controller("SetPaypassCtrl", ["$scope", "$log", "$state", "helper", "dialog", "UserService", "EncryptService",
    function($scope, $log, $state, helper, dialog, userService, encryptService) {
        $scope.setPageTitle("设置支付密码");
        $scope.extraData = {
            idCardNo: helper.getUserInfo('idCardNum')
        };
        $scope.pwdCtrl = {
            isShow: false,
            pwdType: "password",
            btnWords: "显示",
            clickPwdFn: function() {
                this.isShow = !this.isShow;
                if (this.isShow) {
                    this.pwdType = "text";
                    this.btnWords = "隐藏";
                } else {
                    this.pwdType = "password";
                    this.btnWords = "显示";
                }
            },
            handleSetPaypass: function() {
                var self = this;
                encryptService.encryptPassword(this.pwdText).then(function(result) {
                    var encryptPasswordText = result.encryptedPwd;
                    userService.createPaypass({
                        payPassword: encryptPasswordText,
                        idCardNo: helper.getUserInfo('idCardNum')
                    }).then(function(result) {
                        if (result.code == "1000") {
                            dialog.showTipMessage('开通成功', 1000, function() {
                                $state.go('home');
                            });
                        } else {
                            dialog.alert(result.message);
                        }
                    }, function(result) {
                        dialog.alert(result.message);
                    });
                }, function(result) {
                    alert(result.message);
                });
            }
        }
    }
]);