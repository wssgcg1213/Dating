/**
 * 红岩网校 约.
 * @Author Ling.
 * @Contact 363130901
 * @email i@zeroling.com
 */
require.config({
    baseUrl: "lib",
    paths: {
        avalon: "avalon.shim",
        jquery: "jquery-2.1.3",
        dialog: "jq.dialog"
    },
    shims: {
        jquery: {
            exports: "$"
        }
    }
});

var deps = ['userCenter', 'eventproxy', 'noop', 'urls', //注入依赖

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
    'vms/detail'
];

require(deps, function(userCenter, EventProxy, noop, urls) {
    var av = avalon.vmodels;
    /**
     * 主VM
     */
    avalon.define({
        $id: "main",
        state: "",
        sliderCb: function(){
            /**
             * 这个函数是slider的template载入之后的回调, 生成首页banner-slider
             *
             * 这里这样处理是因为
             * 如果从别的页面进入主页
             * 虽然slider的模板已经载入了, 但是数据还在ajax传输中
             * 所以要等slider的VM里面有了数据才能生成slider
             * @author Ling.
             */
            (function(){
                if(avalon.vmodels['showBox'] && avalon.vmodels['showBox']['dateList'].length > 0){
                    avalon.vmodels['main']['state'] = 'ok';
                    return new Swiper('.swiper-container',{
                        pagination: '.pagination',
                        loop: true,
                        grabCursor: true,
                        paginationClickable: true
                    });
                }
                setTimeout(arguments.callee, 50);
            })();
        },
        userInfoSlider: function(){ //初始化userInfo模板里面的左右Slider
            var tabsSwiper = new Swiper('#tab-container',{
                speed:500,
                onSlideChangeStart: function(){
                    $(".tab .selected").removeClass('selected');
                    $(".tab li").eq(tabsSwiper.activeIndex).addClass('selected');
                }
            });
            $(".tab li").on('touchstart mousedown',function(e){
                e.preventDefault()
                $(".tab .selected").removeClass('selected');
                $(this).addClass('selected');
                tabsSwiper.swipeTo( $(this).index() );
            });
            $(".tab li").click(function(e){
                e.preventDefault();
            });
        }
    });
    av['main'].$watch('state', function(s){
        s == 'loading' ? $.Dialog.loading() : $.Dialog.close();
    });
    av['main']['state'] = 'loading';
    /**
     * 顶部navBar的VM
     */
    avalon.define({
        $id: "nav",
        title: "约",
        gotoCenter: function() {
            avalon.router.navigate('userInfo');
        }
    });

    /**
     * 收藏页面 //todo 这个页面怎么处理
     */
    avalon.state('collect', {
        url: "/collect",
        templateUrl: "tpl/collectCtrl.html",
        onEnter: function(state) {
            avalon.vmodels['nav']['title'] = "收藏";
            avalon.scan();
        }
    });

    avalon.state('userInfoPublic', {
        url: "/userInfoPublic",
        templateUrl: "tpl/userInfoPublicCtrl.html",
        onEnter: function(state) {
            avalon.vmodels['nav']['title'] = "收藏";
            avalon.scan();
        }
    });

    avalon.state('letters',{
        url:'/letters',
        templateUrl:"tpl/lettersCtrl.html",
        onEnter: function() {
            var user =
            avalon.scan();
        }
    });

    avalon.state('center', {
        url: "/center",
        templateUrl: "tpl/centerCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "个人中心";
            avalon.scan();
        }
    });

    avalon.state("litterLetter",{
        url:"/litterLetter",
        templateUrl:"tpl/litterLetterCtrl.html",
        onEnter:function() {
            avalon.vmodels['nav']['title'] = "私信";
            avalon.scan();
        }
    })

    avalon.history.start({
        basepath: "/"
    });

    avalon.router.navigate(avalon.history.fragment);
});