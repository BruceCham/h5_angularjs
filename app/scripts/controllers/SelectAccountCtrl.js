//
// SelectAccountCtrl controller, description.
// -----------------------------------------------------------------
app.controller("SelectAccountCtrl", ["$scope", "$log", "$stateParams", "appConfig", "UserService", "helper", "dialog", "$state",
    function($scope, $log, $stateParams, appConfig, userService, helper, dialog, $state) {
        $scope.setPageTitle("开通");
        $scope.accountPic = appConfig.getResourceUrl("content/image/accounthead.png");
        $scope.accoutList = JSON.parse(decodeURIComponent($stateParams.accoutList));

        $scope.getMaskedStr = function(account) {
            return helper.getMaskedString(account, 3, 4, "●");
        };

        $scope.userInfo = helper.getUserInfo(['realName', 'idCardNum']) || {};
        $scope.userInfo.idCardNumY = helper.getMaskedString($scope.userInfo.idCardNum, 3, 2, "*");
        $scope.userInfo.realNameY = helper.getMaskedUserName($scope.userInfo.realName);

        //当前选中的账户
        $scope.selectedAccountItem = $scope.accoutList && $scope.accoutList[0];
        //切换选账户的逻辑
        $scope.selectedAccount = function(account) {
            for (var i = $scope.accoutList.length - 1; i >= 0; i--) {
                var item = $scope.accoutList[i];
                if (account === item) {
                    $scope.selectedAccountItem = item;
                    break;
                }
            };
        };
        $scope.bindAccount = function() {
            helper.setUserInfo({
                "phone": $scope.selectedAccountItem
            });
            $state.go("bindUserInfo.captcha");
        };
        //注册新用户
        $scope.regAccount = function() {
            $state.go("regAccount");
        };
    }
]);