app.controller("ViewSupportedBankListCtrl", ["$scope", "$log", "$state", "BindCardService", "dialog",
    function($scope, $log, $state, bindCardService, dialog) {
        // set current page title.
        $scope.setPageTitle("支持银行卡列表");

        $scope.hasLoadedBankList = false;
        // show all supported bank card list.
        bindCardService.querySupportedBandListInfo("1").then(function(result) {
            var code = result.code,
                data = result.data,
                message = result.message;
            if (code == "1000") {
                var debitSupportBankList = data.debitSupportBankList;
                if (debitSupportBankList.length) {
                    $scope.bankList = debitSupportBankList;
                    $scope.hasLoadedBankList = true;
                }
            } else {
                dialog.alert(message, {
                    btnText: "确认",
                    preCloseCallback: function() {
                        $state.go("addNewbankCard/" + $stateParams.tradeDirection);
                        $log.debug("已经点击了确认按钮", this);
                    }
                });
            }
        }, function(result) {
            dialog.alert(result.message);
        });
    }
]);