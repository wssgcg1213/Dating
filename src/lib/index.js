/**
 * Created by Liuchenling on 4/18/15.
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
    'swiper',
    'domReady!',

    'avalon',
    'mmState', //三柱臣 avalon在这里
    'mmRouter',
    'mmHistory',
    'mmPromise',

    'dialog',
    'avaFilters', //这个是filter

    //下面是vm对象
    'vms/home',
    'vms/userInfo',
    'vms/login',
    'vms/publishDating',
    'vms/history',
    'vms/dateList'
];

require(deps, function(userCenter, EventProxy, noop, urls) {
    /**
     * 主VM
     */
    avalon.define({
        $id: "main",
        sliderCb: function(){
            new Swiper('.swiper-container',{
                pagination: '.pagination',
                loop: true,
                grabCursor: true,
                paginationClickable: true
            });
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
     * 收藏页面 //todo ??
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

    avalon.state('detail', {
        url: '/detail/:id',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            var id = this.params.id,
                user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }
            if(!avalon.vmodels['detail']){
                avalon.define({
                    $id: "detail",
                    users: [],
                    data: {}
                });
            }

            var timer = setTimeout(function(){
                alert("network slow");
                location.reload();
            }, 2000);

            $.post(urls.detail, {date_id: id, uid: user.uid, token: user.token}).success(function(res){
                avalon.vmodels['detail'].data = res.data;
                clearTimeout(timer);
                avalon.scan();
            });
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



    avalon.history.start({
        basepath: "/"
    });

    avalon.router.navigate(avalon.history.fragment);
});