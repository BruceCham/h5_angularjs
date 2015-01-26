app.directive('swipe', function() {
    /**
     * Usage
     * <div class="swipe-wrapper">
        <swipe swipe-index="swipeIndex" callback="swapeCallBack(data)" next="nextSlide" prev="prevSlide">
            <div class="swipe-item">
                <h1>Slide 1</h1>
            </div>
            <div class="swipe-item">
                <h1>Slide 2</h1>
            </div>
            <div class="swipe-item">
                <h1>Slide 3</h1>
            </div>
        </swipe>
    </div>
     */
    var linker = function(scope, element, attrs) {
        var startSlide = 0;
        scope.swipeIndex = startSlide;
        window.mySwipe = new Swipe(document.getElementById('slider'), {
            startSlide: startSlide,
            speed: 400,
            auto: false,
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
            callback: function(index, elem) {
                // make sure that the parameter `data` must be the same with ui callback="swapeCallBack(data)"
                scope.safeApply({
                    data: {
                        index: index,
                        item: elem
                    }
                });
            },
            transitionEnd: function(index, elem) {}
        });
    };

    var controller = function($scope, $element) {
        $scope.next = function() {
            mySwipe.next();
        }
        $scope.prev = function() {
            mySwipe.prev();
        }
        $scope.safeApply = function(data) {
            if (!$scope.$$phase) {
                $scope.$apply(function() {
                    $scope.callback(data);
                });
            } else {
                $scope.callback(data);
            }
        };
    };
    return {
        restrict: 'E',
        link: linker,
        controller: controller,
        // templateUrl: '../src/swipe.html'
        template: "<div id='slider' class='swipe'><div class='swipe-wrap' ng-transclude></div></div>",
        transclude: true,
        scope: {
            callback: '&',
            swipeIndex: '=',
            next: '=',
            prev: '='
        }
    };
});
