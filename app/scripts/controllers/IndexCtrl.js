//
// HomeCtrl controller, description.
// -----------------------------------------------------------------
app.controller("IndexCtrl", ["$scope", "$log", "$state", "$stateParams", "$timeout", "localStorageCache", "cacheKeyConst", "helper", "UserService", "ConfigService", "dialog",
    function($scope, $log, $state, $stateParams, $timeout, localStorageCache, cacheKeyConst, helper, userService, configService, dialog) {
        $scope.setPageTitle("开通");
        var token = $stateParams.token;
        var handleQueryError = function() {
            $timeout(function() {
                dialog.closeSpinner();
            }, 200);
        }
        userService.getUserInfo({
            token: token
        }).then(function(result) {
            var userResult = result;
            if (result.code != "1000") {
                dialog.alert(result.message, {
                    preCloseCallback: handleQueryError
                });
                return false;
            }
            configService.getMerchantInfo(result.data.merchantId).then(function(result) {
                // save user data
                helper.setUserInfo({
                    token: token,
                    idCardNum: userResult.data.idCardNum,
                    phone: userResult.data.phone,
                    realName: userResult.data.realName,
                    origin_idCardNum: userResult.data.idCardNum,
                    origin_phone: userResult.data.phone,
                    origin_realName: userResult.data.realName,
                    merchantUid: userResult.data.merchantUid,
                    merchantId: userResult.data.merchantId
                });
                // save merchant config
                helper.setMerchantInfo(result.data);
                if (userResult.data.bindedUser == 1) {
                    if (userResult.data.isPayPwdNull == 0) {
                        $state.go("setpaypass", null, {
                            location: "replace"
                        });
                    } else {
                        $state.go("home", null, {
                            location: "replace"
                        });
                    }
                } else {
                    $state.go("info", null, {
                        location: "replace"
                    });
                }
            }, function(result) {
                dialog.alert("商户信息获取失败", {
                    preCloseCallback: handleQueryError
                });
                return false;
            });
            //dialog.alert(result.message);
        }, function(result) {
            $log.error("fetch data from server api error: ", result);
            dialog.alert(result.message, {
                preCloseCallback: handleQueryError
            });
        });
    }
]);