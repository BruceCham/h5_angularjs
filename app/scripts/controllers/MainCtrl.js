//
// The outer root controller for capturing all events,databindings for other child controller.
// ------------------------------------------------------------------------------------------
app.controller("MainCtrl", ["$scope", "$log",
    function($scope, $log) {

        $scope.pageTitle = "CMA";

        // provider api for all child page, set individuation document title.
        $scope.setPageTitle = function(newTitle) {
            $scope.pageTitle = newTitle;
        };

        $scope.$watch("pageTitle", function(newVal, oldVal) {
            document.title = newVal;
        });
    }
]);
