(function(app) {
    // While preparing the build please make sure you hanve done below steps.
    // 1. change debugModel = false,
    // 2. change version to your project release version number.
    // 3. goto project root directory,then run compile.bat/compile.sh
    // 4. check the deployed @directory and run localhost:port/index.html#/xxx to test your pages.
    var debugModel = window.PafH5.debugModel;
    var version = window.PafH5.version;
    var appName = window.PafH5.appName;
    // defined app configurations in factory.
    app.factory("appConfig", ["$log", "remoteApi",
        function($log, remoteApi) {
            return {
                "debugModel": debugModel,
                "version": version,
                getAppName: function() {
                    return appName;
                },
                getResourceUrl: function(resourceUrl) {
                    // if release model && version has defined.
                    if (!debugModel && version) {
                        if (remoteApi.cdnRoot) {
                            resourceUrl = remoteApi.cdnRoot + "/" + version + "/" + resourceUrl;
                        } else {
                            resourceUrl = version + "/" + resourceUrl;
                        }
                    }
                    $log.info("getResourceUrl():", resourceUrl);
                    return resourceUrl;
                },
                getTemplateUrl: function(templateUrl) {
                    // if release model && version has defined.
                    return this.getResourceUrl(templateUrl);
                },
                /**
                 * Provider short cut to get mtp api request data.
                 * @param  {object}  data       it will override common data.
                 * @param  {object}  extraData  it will merge into baseData.
                 * @param  {object}  extraData1  it will merge into baseData1.
                 * @return {object}  return new request data.
                 */
                getRequestData: function(data, extraData, extraData1) {
                    var baseData = {
                        appId: "T-100019",
                        clientId: "CMA_CLIENT_ID" //H5_INT_SESSION
                    };
                    angular.extend(baseData, data, extraData, extraData1);
                    return baseData;
                }
            };
        }
    ]);
    /**
     * Fot state url router provider.
     * @param  {string} templatePath template path
     * @return {string} new templatePath of current environment.
     */
    function getRouteTemplateUrl(templatePath) {
        if (!debugModel && version) {
            if (window.remoteApi.cdnRoot) {
                templatePath = window.remoteApi.cdnRoot + "/" + version + "/" + templatePath;
            } else {
                templatePath = version + "/" + templatePath;
            }
        }
        return templatePath;
    };
    // 
    // configuring our routes 
    // ----------------------------------------------------------------------------------------------------
    app.config(['$httpProvider', "$stateProvider", "$urlRouterProvider", "$logProvider", "$sceDelegateProvider",
        function($httpProvider, $stateProvider, $urlRouterProvider, $logProvider, $sceDelegateProvider) {

            // allow cross cookie, it seems that we need to set withCredentials in global for all $http request.
            // we can't use $http(config) pass parameter "withCredentials", maybe there is bug existed in angularjs 1.3.8
            $httpProvider.defaults.withCredentials = true;
            // sce resource white list.
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'http*://**']);
            // default is true
            $logProvider.debugEnabled(debugModel);
            // error page
            // author: litao
            $stateProvider.state('error', {
                    url: '/error',
                    templateUrl: getRouteTemplateUrl('app/views/error.html')
                })
                // 信息确认页，如果不完整，补填完整
                // author: litao
                .state('info', {
                    url: '/info',
                    templateUrl: getRouteTemplateUrl('app/views/binduser/info.html')
                })
                // 增加嵌套View，让多个子View可以共享父View的方法和属性
                .state('bindUserInfo', {
                    abstract: true,
                    url: '/bindUser',
                    controller: "BindUserInfoCtrl",
                    template: "<div ui-view></div>"
                })
                // 短信验证页
                // author: litao
                .state('bindUserInfo.captcha', {
                    url: '/captcha',
                    templateUrl: getRouteTemplateUrl('app/views/binduser/captcha.html')
                })
                // 登陆密码验证页
                // author: litao
                .state('bindUserInfo.verifypaypass', {
                    url: '/verifypaypass',
                    templateUrl: getRouteTemplateUrl('app/views/binduser/verifypaypass.html')
                })
                // 支付密码设置页
                // author: litao
                .state('setpaypass', {
                    url: '/setpaypass',
                    templateUrl: getRouteTemplateUrl('app/views/binduser/setpaypass.html')
                })
                // 选择绑定的壹钱包账户
                // author: peipei
                .state('selectAccount', {
                    url: '/selectAccount/:accoutList',
                    templateUrl: getRouteTemplateUrl('app/views/binduser/selectAccount.html')
                })
                // 重新注册壹钱包账户（包括手机匹配成功，身份匹配不成功 和 手机身份匹配都不成功的情况）
                // author: litao
                .state('regAccount', {
                    url: '/regAccount',
                    templateUrl: getRouteTemplateUrl('app/views/binduser/regAccount.html')
                })

                // xx宝首页
                // author: peipei
                .state('home', {
                    url: '/home',
                    templateUrl: getRouteTemplateUrl('app/views/home.html')
                })
                // 转入页
                // author: litao
                .state('income', {
                    url: '/income',
                    templateUrl: getRouteTemplateUrl('app/views/income/income.html')
                })
                // 转入到指定的银行卡选择列表页面。
                //author: peipei
                .state('incomeFromBankCard', {
                    url: '/incomeFromBankCard',
                    templateUrl: getRouteTemplateUrl('app/views/income/incomeFromBankCard.html')
                })
                //转入，输入支付密码确认页面
                //author: peipei
                .state('incomeConfirm', {
                    url: '/incomeConfirm/:incomeData',
                    templateUrl: getRouteTemplateUrl('app/views/income/incomeConfirm.html')
                })
                // 转入成功页
                // author: peipei
                .state('incomeSuccess', {
                    url: '/incomeSuccess/:incomeResult',
                    templateUrl: getRouteTemplateUrl('app/views/income/incomeSuccess.html')
                })
                // 转出页
                // author: litao
                .state('pay', {
                    url: '/pay',
                    templateUrl: getRouteTemplateUrl('app/views/pay/pay.html')
                })
                //转入，出支付密码确认页面
                //author: peipei
                .state('payConfirm', {
                    url: '/payConfirm/:payData',
                    templateUrl: getRouteTemplateUrl('app/views/pay/payConfirm.html')
                })
                // 转出自指定的银行卡选择卡列表页面
                //author: peipei
                .state('payToBankCard', {
                    url: '/payToBankCard',
                    templateUrl: getRouteTemplateUrl('app/views/pay/payToBankCard.html')
                })
                // 转出页
                // author: peipei
                .state('paySuccess', {
                    url: '/paySuccess/:amount',
                    templateUrl: getRouteTemplateUrl('app/views/pay/paySuccess.html')
                })
                // 累计收益
                // author: peipei
                .state('earnings', {
                    url: '/earnings',
                    templateUrl: getRouteTemplateUrl('app/views/earnings.html')
                })
                // 收支详情
                // author: peipei
                .state('transDetail', {
                    url: '/transDetail',
                    templateUrl: getRouteTemplateUrl('app/views/transDetail.html')
                })
                // test purpose
                // /home/{child}?from&to ->"$stateParams"
                .state('docPage', {
                    url: '/doc',
                    templateUrl: getRouteTemplateUrl('app/views/docs.html')
                }).state('index', {
                    url: '/?token',
                    templateUrl: getRouteTemplateUrl('app/views/index.html')
                })
                // 添加银行卡
                .state('addNewbankCard', {
                    url: '/addNewBankCard/:tradeDirection',
                    templateUrl: getRouteTemplateUrl('app/views/bindcard/addNewBankCard.html')
                })

                // 添加银行卡
                .state('viewSupportedBankList', {
                    url: '/viewSupportedBankList',
                    templateUrl: getRouteTemplateUrl('app/views/bindcard/viewSupportedBankList.html')
                })

                // 查看选定的帮卡详细页面，并包含OTP
                .state('viewBankCardDetail', {
                    url: '/viewBankCardDetail/:tradeDirection',
                    templateUrl: getRouteTemplateUrl('app/views/bindcard/viewBankCardDetail.html')
                });
            // $urlRouterProvider.rule(function($injector, $location) {
            //     return '/index';
            // });
            // catch all route
            // send users to the form page 
            $urlRouterProvider.otherwise('/error');
        }
    ]);
})(app);
