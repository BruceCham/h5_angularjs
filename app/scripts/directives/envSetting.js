(function() {

    /**
     * 测试环境全局允许我们配置环境类型
     */
    app.directive("envSetting", ["$log", "$compile", function($log, $compile) {

        var CONTROL_VISIBILITY = "pafh5_envSetting_visibility";

        function setControlVisibility(isDisplay) {
            if (isDisplay) {
                localStorage.setItem(CONTROL_VISIBILITY, "1");
            } else {
                localStorage.setItem(CONTROL_VISIBILITY, "0");
            }
        };

        function getControlVisibility() {
            var isVisible = localStorage.getItem(CONTROL_VISIBILITY);
            if (isVisible === null || typeof isVisible === "undefined") {
                isVisible = "1";
            }
            return (isVisible == "1");
        };
        var getTemplate = function(envType) {
            var template = '<div class=\"envsetting\">\
                        <span>当前环境:<span>{{currentEnv.env}}</span></span>\
                        <span ng-click="doEnvSetting()" class=\"gosetting\">去设置</span>\
                        <span ng-click="doClose()" class=\"close\">关闭</span>\
                    </div>';
            var isVisibile = getControlVisibility();
            switch (envType) {
                case 'production':
                    template = "";
                    break;
            }
            if (!isVisibile && envType != "production") {
                template = "";
            }
            return template;
        }

        var linker = function(scope, element, attrs) {

            // current env.
            var _currEnv = scope.currentEnv;

            var envType = _currEnv && _currEnv.env && _currEnv.env.toLowerCase();

            element.html(getTemplate(envType));

            // close setting. if we need to recovery
            scope.doClose = function() {
                element.remove();
                setControlVisibility(false);
            };

            $compile(element.contents())(scope);
        };


        var ctrl = ["$log", "$scope", "dialog", function($log, scope, dialog) {
            // current env.
            var _currEnv = window.getCurrentEnv();

            scope.currentEnv = _currEnv;
            // if is production environment.
            if (_currEnv && _currEnv.env && _currEnv.env.toLowerCase() == "production") {
                return;
            }
            var _envs = window.getAllEnvs();
            var envs = [];
            for (var item in _envs) {
                if (_envs.hasOwnProperty(item)) {
                    envs.push(_envs[item]);
                }
            }
            // all envs.
            scope.envs = envs;

            scope.selectedItem = function(env) {
                $log.debug("selectedItem()", env);
                // set current env.
                window.setCurrentEnv(env);

                dialog.close();

                // delay 1 second.
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            };
            scope.doEnvSetting = function() {
                dialog.showFullScreenDialog(ctrl, scope, {
                    template: "<div class=\"envsetting-list\"><ul class=\"list-unstyled\">\
                            <li ng-click=\"selectedItem(env.env)\" ng-repeat=\"env in envs\">\
                                <span>{{env.env}}</span>\
                            </li>\
                        </ul>\
                    </div>",
                    newClass: "dialog-envsetting"
                });
            };
        }];
        return {
            restrict: 'AE',
            controller: ctrl,
            link: linker
        };
    }]);

    app.run(['$templateCache', function($templateCache) {
        $templateCache.put("template/envSetting.html",
            '<div class=\"envsetting\">\
                <span>当前环境:<span>{{currentEnv.env}}</span></span>\
                <span ng-click="doEnvSetting()" class=\"gosetting\">去设置</span>\
            </div>'
        );
    }]);

})();
