/**
 * 红岩网校 约.
 * @Author Ling.
 * @Contact 363130901
 * @email i@zeroling.com
 */
require.config({
    baseUrl: "lib",
    paths: {
        avalon: "avalon.mobile.shim",
        jquery: "jquery-2.1.3",
        dialog: "jq.dialog"
    }
});

//Logger
var log = window.console ? console.log.bind(console, "%c DEBUG! Ling: ", "background:#404040;color:#fff;border-radius:5px") : function(){};

require(['userCenter', 'eventproxy', 'noop', 'urls', //注入依赖

    'avalon',
    'mmState',
    'mmRouter',
    'mmHistory',
    'mmPromise',

    'jquery',
    'swiper',
    'dialog',
    'avaFilters', //这个是filter
    'DateTimePicker',

    //下面是vm对象
    'vms/home',
    'vms/userInfo',
    'vms/login',
    'vms/publishDating',
    'vms/history',
    'vms/dateList',
    'vms/letters',
    'vms/detail',
    'vms/userInfoPublic',
    'vms/main',
    'vms/userInfoEdit'
], function(userCenter, EventProxy, noop, urls) {

    avalon.history.start({
        basepath: "/"
    });

    avalon.router.navigate(avalon.history.fragment);
});