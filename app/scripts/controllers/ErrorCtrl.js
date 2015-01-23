//
// error controller, description.
// author: tianyingchun
// -----------------------------------------------------------------
app.controller("ErrorCtrl", ["$scope", "$state", "$log", "appConfig",
    function($scope, $state, $log, appConfig) {
        $log.debug("state params: ", $state.params);
        $scope.banner = appConfig.getResourceUrl("content/image/error.png");
    }
]);