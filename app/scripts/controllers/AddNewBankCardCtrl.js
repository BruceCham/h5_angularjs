app.controller("AddNewBankCardCtrl", ["$scope", "$log", "$state", "$stateParams", "cacheKeyConst", "localStorageCache", "BindCardService", 'cmsStatics', 'helper', "dialog",
    function($scope, $log, $state, $stateParams, cacheKeyConst, localStorageCache, bindCardService, cmsStatics, helper, dialog) {
        // set current page title.
        $scope.setPageTitle("添加银行卡");

        // show all supported bank card list.
        $scope.viewSupportedBankCard = function() {
            $state.go("viewSupportedBankList");
        };

        //handle bind card
        $scope.addNewBankCard = function() {
            //add localstorage cache domain
            var bankCardCacheFactory = localStorageCache(cacheKeyConst.factories["BIND_CARD_FACTORY"]);
            bankCardCacheFactory.put("BIND_CARD_NUM", $scope.bankCardNum);
            bankCardCacheFactory.put("REDIRECT_UNIONPAY_COUNT", 0);

            $state.go('viewBankCardDetail', {
                tradeDirection: $stateParams.tradeDirection
            });
        }
    }
]);