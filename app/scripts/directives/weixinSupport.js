
/**
 * <div data-weixin-support 
 *    data-title="给你幸运伴你飞，让我送你500万元飞行保障，我们永远是好朋友！" 
 *    data-desc="给你幸运伴你飞，让我送你500万元飞行保障，我们永远是好朋友！"
 *    data-link="${sharedUrl!}"
 *    data-img-url="/static/mobile/baozhang/images/share/system-share/free-share-icon.png"
 *  ></div>
 */
app.directive("weixinSupport", function() {

    function detectWeixinApi(cb) {
        if (typeof window.WeixinJSBridge == "undefined" || typeof window.WeixinJSBridge.invoke == "undefined") {
            setTimeout(function() {
                detectWeixinApi(cb);
            }, 200)
        } else {
            cb();
        }
    }
    var WeixinApi = {
        version: 2.9
    };

    detectWeixinApi(function() {


        /**
         * 内部私有方法，分享用
         * @private
         */
        var _share = function(cmd, data, callbacks) {
            callbacks = callbacks || {};

            // 分享过程中的一些回调
            var progress = function(resp) {
                switch (true) {
                    // 用户取消
                    case /\:cancel$/i.test(resp.err_msg):
                        callbacks.cancel && callbacks.cancel(resp);
                        break;
                        // 发送成功
                    case /\:(confirm|ok)$/i.test(resp.err_msg):
                        callbacks.confirm && callbacks.confirm(resp);
                        break;
                        // fail　发送失败
                    case /\:fail$/i.test(resp.err_msg):
                    default:
                        callbacks.fail && callbacks.fail(resp);
                        break;
                }
                // 无论成功失败都会执行的回调
                callbacks.all && callbacks.all(resp);
            };

            // 执行分享，并处理结果
            var handler = function(theData, argv) {
                // 新的分享接口，单独处理
                if (cmd.menu === 'menu:general:share') {
                    // 如果是收藏操作，并且在wxCallbacks中配置了favorite为false，则不执行回调
                    if (argv.shareTo == 'favorite') {
                        if (callbacks.favorite === false) {
                            return argv.generalShare(theData, function() {});
                        }
                    }

                    argv.generalShare(theData, progress);
                } else {
                    WeixinJSBridge.invoke(cmd.action, theData, progress);
                }
            };
            // 监听分享操作
            WeixinJSBridge.on(cmd.menu, function(argv) {

                if (callbacks.async && callbacks.ready) {
                    var _callbackKey = "_wx_loadedCb_";
                    WeixinApi[_callbackKey] = callbacks.dataLoaded || new Function();
                    if (WeixinApi[_callbackKey].toString().indexOf(_callbackKey) > 0) {
                        WeixinApi[_callbackKey] = new Function();
                    }
                    callbacks.dataLoaded = function(newData) {
                        WeixinApi[_callbackKey](newData);
                        handler(newData, argv);
                    };
                    // 然后就绪
                    if (!(argv && argv.shareTo == 'favorite' && callbacks.favorite === false)) {
                        callbacks.ready && callbacks.ready(argv);
                    }
                } else {
                    // 就绪状态
                    if (!(argv && argv.shareTo == 'favorite' && callbacks.favorite === false)) {
                        callbacks.ready && callbacks.ready(argv);
                    }
                    handler(data, argv);
                }
            });
        };

        /**
         * 发送给微信上的好友
         * @param       {Object}    data       待分享的信息
         * @p-config    {String}    appId      公众平台的appId（服务号可用）
         * @p-config    {String}    imgUrl     图片地址
         * @p-config    {String}    link       链接地址
         * @p-config    {String}    desc       描述
         * @p-config    {String}    title      分享的标题
         */
        var shareToFriend = function(data, callbacks) {
            _share({
                menu: 'menu:share:appmessage',
                action: 'sendAppMessage'
            }, {
                "appid": data.appId ? data.appId : '',
                "img_url": data.imgUrl,
                "link": data.link,
                "desc": data.desc,
                "title": data.title,
                "img_width": "640",
                "img_height": "640"
            }, callbacks);
        };
        /**
         * 分享到微信朋友圈
         * @param       {Object}    data       待分享的信息
         * @p-config    {String}    appId      公众平台的appId（服务号可用）
         * @p-config    {String}    imgUrl     图片地址
         * @p-config    {String}    link       链接地址
         * @p-config    {String}    desc       描述
         * @p-config    {String}    title      分享的标题
         */
        var shareToTimeline = function(data, callbacks) {
            _share({
                menu: 'menu:share:timeline',
                action: 'shareTimeline'
            }, {
                "appid": data.appId ? data.appId : '',
                "img_url": data.imgUrl,
                "link": data.link,
                "desc": data.title,
                "title": data.desc,
                "img_width": "640",
                "img_height": "640"
            }, callbacks);
        };
        /**
         * 分享到腾讯微博
         * @param       {Object}    data       待分享的信息
         * @p-config    {String}    link       链接地址
         * @p-config    {String}    desc       描述
         */
        var shareToWeibo = function(data, callbacks) {
            _share({
                menu: 'menu:share:weibo',
                action: 'shareWeibo'
            }, {
                "content": data.desc,
                "url": data.link
            }, callbacks);
        };
        /**
         * 新的分享接口
         * @param       {Object}    data       待分享的信息
         * @p-config    {String}    appId      公众平台的appId（服务号可用）
         * @p-config    {String}    imgUrl     图片地址
         * @p-config    {String}    link       链接地址
         * @p-config    {String}    desc       描述
         * @p-config    {String}    title      分享的标题
         */
        var generalShare = function(data, callbacks) {
            _share({
                menu: 'menu:general:share'
            }, {
                "appid": data.appId ? data.appId : '',
                "img_url": data.imgUrl,
                "link": data.link,
                "desc": data.title,
                "title": data.desc,
                "img_width": "640",
                "img_height": "640"
            }, callbacks);
        };
        // export wei xin api.
        angular.extend(WeixinApi, {
            shareToFriend: shareToFriend,
            shareToWeibo: shareToWeibo,
            generalShare: generalShare,
            shareToTimeline: shareToTimeline
        });
    });

    WeixinApi.ready = function(readyCallback) {
        if (readyCallback && typeof readyCallback == 'function') {
            var Api = this;
            var wxReadyFunc = function() {
                readyCallback(Api);
            };
            if (typeof window.WeixinJSBridge == "undefined") {

                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', wxReadyFunc, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', wxReadyFunc);
                    document.attachEvent('onWeixinJSBridgeReady', wxReadyFunc);
                }
            } else {
                wxReadyFunc();
            }
        }
    };

    // 分享的回调
    var wxCallbacks = {
        // 收藏操作不执行回调，默认是开启(true)的
        favorite: false,

        // 分享操作开始之前
        ready: function() {
            // 你可以在这里对分享的数据进行重组
            // alert("准备分享");
        },
        // 分享被用户自动取消
        cancel: function(resp) {
            // 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
            // alert("分享被取消，msg=" + resp.err_msg);
        },
        // 分享失败了
        fail: function(resp) {
            // 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
            // alert("分享失败，msg=" + resp.err_msg);
        },
        // 分享成功
        confirm: function(resp) {
            // 分享成功了，我们是不是可以做一些分享统计呢？
            // alert("分享成功，msg=" + resp.err_msg);
        },
        // 整个分享过程结束
        all: function(resp, shareTo) {
            // 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
            // alert("分享" + (shareTo ? "到" + shareTo : "") + "结束，msg=" + resp.err_msg);
        }
    };
    return {
        restrict: 'AC',
        replace: false,
        scope: {
            appId: '@',
            link: '@',
            title: '@',
            imgUrl: '@',
            desc: '@'
        },
        link: function(scope, elements, attrs) {

            // while Weixinapi webview loaded, invoke callback to run
            detectWeixinApi(function() {
                // alert("ready!");
                WeixinApi.ready(function(Api) {
                    // alert("ready go!");

                    // 微信分享的数据
                    var wxData = {
                        "appId": "", // 服务号可以填写appId
                        "imgUrl": scope.imgUrl || '',
                        "link": scope.link || window.location.href,
                        "desc": scope.desc || '',
                        "title": scope.title || document.title
                    };
                    // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
                    Api.shareToFriend(wxData, wxCallbacks);

                    // 点击分享到朋友圈，会执行下面这个代码
                    Api.shareToTimeline(wxData, wxCallbacks);

                    // 点击分享到腾讯微博，会执行下面这个代码
                    Api.shareToWeibo(wxData, wxCallbacks);

                });
            });
        }
    };
});
