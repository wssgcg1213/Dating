/**
 * Created by Liuchenling on 4/18/15.
 */
require.config({
    baseUrl: "lib",
    paths: {
        avalon: "avalon.shim",
        jQuery: "jquery-2.1.3"
    },
    shims: {
        jQuery: {
            exports: "$"
        }
    }
});

require(['slider', 'domReady!', 'mmState'], function() {
    var dating = avalon.define({
        $id: "dating",
        title: "约吧",
        sliderCb: function() {
            var width = $(document).width(),
                height = width * 0.5625;
            $('.slider').slider({
                width: width,
                height: height,
                during: 3000
            });
        }
    });
    avalon.scan();
});