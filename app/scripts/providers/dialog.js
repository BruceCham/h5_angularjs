app.factory("dialog", ["$log", "utility", "ngDialog",
    function($log, utility, ngDialog) {
        return {
            // provider alert box shortcut.
            // config:{
            //      fontSizeClass:"md|sm|xs",
            //      btnText:"关闭",
            //      scope:$scope,
            //      preCloseCallback:"" // defined in $scope["preCloseCallback"]
            // }
            alert: function(bodyHtml, config) {
                config = config || {};
                var bodyFontSize = 'text-' + (config.fontSizeClass || 'md');
                var btnText = config.btnText || "确定";
                var $scope = config.scope;
                var preCloseCallback = config.preCloseCallback;

                // open alert dialog
                ngDialog.open({
                    template: '<div class="body-inner">\
                        <div class="modal-body ngdialog-message ' + bodyFontSize + '">' + bodyHtml + '</div>\
                        <div class="ngdialog-buttons">\
                            <button type="button" class="btn btn-block btn-close" ng-click="closeThisDialog(0)">' + btnText + '</button>\
                        </div>\
                    </div>',
                    plain: true,
                    showClose: false,
                    scope: $scope,
                    preCloseCallback: preCloseCallback,
                    className: "theme-default alert"
                });
            },
            // provider confirm dialog box. 
            // @return promise.
            // config :{
            //    fontSizeClass:"md|sm|xs",
            //    cancelBtnText:"取消", 
            //    confirmBtnText:"确认",
            //    scope:$scope,
            //    preCloseCallback:"" // defined in $scope["preCloseCallback"]
            // }
            confirm: function(bodyHtml, config) {
                config = config || {};
                var bodyFontSize = 'text-' + (config.fontSizeClass || 'md');
                var cancelBtnText = config.cancelBtnText || "关闭";
                var confirmBtnText = config.confirmBtnText || "确认";
                var $scope = config.scope;
                var preCloseCallback = config.preCloseCallback;
                // open alert dialog
                return ngDialog.openConfirm({
                    template: '<div class="body-inner">\
                        <div class="modal-body ngdialog-message ' + bodyFontSize + '">' + bodyHtml + '</div>\
                        <div class="ngdialog-buttons">\
                            <button type="button" class="col-xs-6 btn btn-close" ng-click="closeThisDialog(1)">' + cancelBtnText + '</button>\
                            <button type="button" class="col-xs-6 btn btn-confirm" ng-click="closeThisDialog()">' + confirmBtnText + '</button>\
                        </div>\
                    </div>',
                    plain: true,
                    showClose: false,
                    scope: $scope,
                    preCloseCallback: preCloseCallback,
                    className: "theme-default confirm"
                });
            },
            /**
             * show spinner dialog.
             * @param  {string} bodyHtml you'd better pass normal text here.
             */
            showSpinner: function(tipTxt, config) {
                tipTxt = tipTxt || "加载中...";
                // open alert dialog
                ngDialog.open({
                    template: '<div class="body-inner">\
                        <div class="modal-body ngdialog-message">\
                            <div class="loading-wrapper">\
                                <div class="loading">\
                                    <div class="animator"></div>\
                                    <div class="logo"></div>\
                                </div>\
                                <div class="message">' + tipTxt + '</div>\
                            </div>\
                        </div>\
                    </div>',
                    plain: true,
                    showClose: false,
                    className: "theme-default spinner"
                });
            },
            /**
             * close spinner dialog.
             */
            closeSpinner: function() {
                this.close();
            },
            // provider tip message with auto disappear.
            showTipMessage: function(tipTxt, timeout, callback) {
                tipTxt = tipTxt || "请输入点信息吧～！！";
                // open alert dialog
                ngDialog.open({
                    template: '<div class="body-inner">\
                        <div class="modal-body ngdialog-message">\
                            <div class="loading-wrapper tip-message">\
                                <div class="message">' + tipTxt + '</div>\
                            </div>\
                        </div>\
                    </div>',
                    plain: true,
                    showClose: false,
                    className: "theme-default spinner"
                });
                var _this = this;
                // timeout disapear
                setTimeout(function() {
                    _this.close();
                    if (callback) {
                        callback();
                    }
                }, timeout || 2000);
            },
            // directly close dialog. if id ==null, close all dialog.
            close: function(id, data) {
                ngDialog.close(id, data || 1);
            },
            /**
             * Set dialog body content.
             * @param {object}         $dialog angular dialog object
             * @param {string} html    html string.
             * @return{string} html    get origin attached html string.
             */
            setDialogBodyHtml: function($dialog, html) {
                var $el = angular.element;
                var sOriginHtml = "";
                var domDialog = $el($dialog)[0];
                if (domDialog) {
                    var $dialogBody = $el(domDialog.querySelector(".modal-body"));
                    sOriginHtml = $dialogBody.html();
                    $dialogBody.html(html);
                } else {
                    $log.error("current `dialog` is undefined!");
                }
                return sOriginHtml;
            },
            // provider share box shortcut.
            shareBox: function(opts) {
                $log.debug("passed sharebox parameters : ", opts);
                var url = "ewap://1qianbao/share";
                // var to = 0; 0：微信朋友圈；1：微信好友；2：微博
                var _cfg = {
                    wx_url: "微信分享跳转URL",
                    wx_title: "微信分享标题",
                    wx_desc: "微信分享内容",
                    wx_icon: "COMMONWEAL_ICON",
                    wb_content: "微博分享内容（限140字）",
                    wb_img: "COMMONWEAL_IMG",
                    redirect_url: "分享成功后跳转url"
                };
                // remove undefiend variables.
                for (var prop in opts) {
                    if (opts.hasOwnProperty(prop)) {
                        if (!opts[prop]) {
                            delete opts[prop];
                        }
                    }
                }
                // override default configurations
                angular.extend(_cfg, opts);

                $log.debug("sharebox invoke parameters: ", _cfg);

                // 微信朋友圈
                var wx_pengyou_link = angular.element("<a>").attr("href", utility.getSerializedUrl(url, {
                    to: 0,
                    wx_url: _cfg.wx_url,
                    wx_title: _cfg.wx_title || "微信分享跳转URL",
                    wx_desc: _cfg.wx_desc || "微信分享内容",
                    wx_icon: _cfg.wx_icon || "COMMONWEAL_ICON",
                    redirect_url: _cfg.redirect_url
                })).addClass("col-xs-4 pengyq").append("<span class='icon'></span><span class='text'>朋友圈</span>");
                // 微信好友
                var wx_haoyou_link = angular.element("<a>").attr("href", utility.getSerializedUrl(url, {
                    to: 1,
                    wx_url: _cfg.wx_url,
                    wx_title: _cfg.wx_title || "微信分享跳转URL",
                    wx_desc: _cfg.wx_desc || "微信分享内容",
                    wx_icon: _cfg.wx_icon || "COMMONWEAL_ICON",
                    redirect_url: _cfg.redirect_url
                })).addClass("col-xs-4 weixin").append("<span class='icon'></span><span class='text'>微信好友</span>");
                //微博分享
                var wb_link = angular.element("<a>").attr("href", utility.getSerializedUrl(url, {
                    to: 2,
                    wb_content: _cfg.wb_content || "微博分享内容（限140字）",
                    wb_img: _cfg.wb_img || "COMMONWEAL_IMG",
                    redirect_url: _cfg.redirect_url
                })).addClass("col-xs-4 weibo").append("<span class='icon'></span><span class='text'>新浪微博</span>");

                // share box content.
                var sharebox_content = angular.element("<div>").append(wx_pengyou_link).append(wx_haoyou_link).append(wb_link).html();

                ngDialog.open({
                    template: '<div class="share-items clearfix">' + sharebox_content + '</div>\
                                <div class="ngdialog-buttons">\
                                    <button type="button" class="btn btn-block btn-close" ng-click="closeThisDialog(0)">取消</button>\
                                </div>',
                    plain: true,
                    showClose: false,
                    closeByDocument: false,
                    className: "theme-default sharebox"
                });
            },
            /**
             * Provider full screen dialog with close button.
             * @param  {string|object} controller controller name
             * @param  {object} scope      current scope optional.
             * @param  {object} config     extra configuraions
             */
            showFullScreenDialog: function(controller, scope, config) {
                var newClass = config.newClass || "";
                var cfg = {
                    showClose: true,
                    closeByDocument: false,
                    plain: true,
                    className: "theme-default full-screen " + newClass
                };
                angular.extend(cfg, {
                    controller: controller,
                    scope: scope
                }, config);

                ngDialog.open(cfg);
            },
            /**
             * Provider iframe dialog with close button.
             * @param  {string} src    iframe page src url.
             * @param  {object} config the iframe config objects.
             */
            showIframeDialog: function(src, config) {
                var newClass = config.newClass || "iframe-content";
                var cfg = {
                    showClose: true,
                    closeByDocument: false,
                    plain: true,
                    template: "<div class=\"" + newClass + "\">\
                                <iframe src=\"" + src + "\" frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowtransparency=\"yes\"></iframe>\
                            </div>",
                    className: "theme-default full-screen iframe"
                };
                angular.extend(cfg, config);

                ngDialog.open(cfg);
            }
        };
    }
]);
