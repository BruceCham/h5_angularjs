//
// TransDetailCtrl controller, 
// 显示交易明细
// author: peipei
// -----------------------------------------------------------------
app.controller("TransDetailCtrl", ["$scope", "$log", "$stateParams", "appConfig", "AssetService", "helper", "dialog",
    function($scope, $log, $stateParams, appConfig, assetService, helper, dialog) {
        $scope.isNoData = true;
        $scope.isNoData_img = appConfig.getResourceUrl("content/image/no_data.png");

        //获得收支明细列表
        assetService.getTransDetail({
            pageNum: 1,
            pageSize: 100
        }).then(function(result) {
            if (result.code != "1000") {
                dialog.alert(result.message, {
                    btnText: "确认"
                });
            } else {
                $scope.tradeInfos = result.data.tradeInfos;
                if ($scope.tradeInfos && $scope.tradeInfos.length > 0) {
                    for (var i = $scope.tradeInfos.length - 1; i >= 0; i--) {
                        $scope.tradeInfos[i].tradeAmount = helper.formatAmount($scope.tradeInfos[i].tradeAmount / 100);
                        if ($scope.tradeInfos[i].tradeDirection === 1) {
                            $scope.tradeInfos[i].tradeAmount[0] = "-" + $scope.tradeInfos[i].tradeAmount[0];
                        } else if ($scope.tradeInfos[i].tradeDirection === 2) {
                            $scope.tradeInfos[i].tradeAmount[0] = "+" + $scope.tradeInfos[i].tradeAmount[0];
                        }
                    };

                } else {
                    $scope.isNoData = false;
                    $scope.hideTransContainer = true;

                }
            }

        }, function(result) {
            dialog.alert(result.message);
        });

        $scope.dateFormat = function(dateStr1, dateStr2) {
            return helper.dateFormat(dateStr1, dateStr2);
        };
    }
]);