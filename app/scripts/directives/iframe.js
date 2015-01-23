(function() {

    /**
     * 测试环境全局允许我们配置环境类型
     */
    app.directive("scrollerIframe", ["$log", function($log) {
        // var ctrl = ["$log", "$scope", function($log, scope) {

        // }];
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                iframeSrc: "=scrollerIframe"
            },
            templateUrl: "template/iframe.html",
            link: function(scope, element, attrs) {
               
            }
        };
    }]);

    app.run(['$templateCache', function($templateCache) {
        $templateCache.put("template/iframe.html",
            '<div class=\"iframe-content\" style="height:{{scrollerHeight}}px;">\
                <iframe src="{{iframeSrc}}" height="100%" width="100%" id="iframe" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>\
            </div>'
        );
    }]);

})();
