// the simple diretive for share box page short cut
app.directive("shareBox", ["$log", "dialog", "utility",
    function($log, dialog, utility) {
        return {
            scope: {},
            restrict: 'AC',
            replace: false,
            link: function(scope, ele, attrs) {
                ele.on("click", function(e) {
                    e.preventDefault();
                    // add support tracking event id.
                    var trackingEvtId = attrs.shareTrackingId || "";
                    if (trackingEvtId) {
                        $log.info("sharebox: tracking id: ", trackingEvtId);
                        utility.tracking(trackingEvtId);
                    }
                    var cfg = {
                        wx_url: attrs.shareBoxWxUrl,
                        wx_title: attrs.shareBoxWxTitle,
                        wx_desc: attrs.shareBoxWxDesc,
                        wx_icon: attrs.shareBoxWxIcon,
                        wb_content: attrs.shareBoxWbContent,
                        wb_img: attrs.shareBoxWbImg,
                        redirect_url: attrs.shareBoxRedirectUrl
                    };
                    dialog.shareBox(cfg);
                });
            }
        };
    }
]);