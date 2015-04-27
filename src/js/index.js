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

var urls = {
    "slider": "../mock.php",
    "scrollBox": "http://106.184.7.12:8002/index.php/home/index/showBox",
    "category": "http://106.184.7.12:8002/index.php/home/index/category"
};
require(['eventproxy', 'slider', 'domReady!', 'mmState'], function(EventProxy) {
    //debugger;
    var ep; //用来装载EventProxy的实例对象
    avalon.define({
        $id: "main", //主vm
        sliderCb: function() { //初始化slider
            var width = $(window).width(),
                height = width * 0.46;
            $('.slider').slider({
                width: width,
                height: height,
                during: 3000
            });
        }
    });

    avalon.define({
        $id: "nav",
        title: "约",
        gotoCenter: function() {
            avalon.router.navigate('center');
        },
        menus: [{
            link: "#!/",
            text: "首页"
        },{
            link: "#!/login",
            text: "登陆todo"
        },{
            link: "#!/collect",
            text: "收藏"
        },{
            link: "#/detail",
            text: "详情"
        }]
    });

    avalon.state('home', {
        controller: "main",
        url: "/",
        templateUrl: "tpl/indexCtrl.html",
        onEnter: function(){
            setTimeout(avalon.scan, 1000); //timeout
            //异步处理, getdata
            ep = EventProxy.create('user', 'slider', 'fliter', function(user, slider, fliter) {
                avalon.scan();
            });

            //define vms
            avalon.vmodels['nav']['title'] = '约';

            if(!avalon.vmodels['slider']){
                avalon.define({
                    $id: "slider",
                    items: [{}]
                });

                $.post(urls.slider, {}).success(function(res) {
                    console.log('slider', res);
                    var sliderData = res.map(function(val){
                        return {
                            href: val.url,
                            img: val.src
                        };
                    });
                    avalon.vmodels['slider']['items'] = sliderData;
                    ep.emit('slider', sliderData);
                });
                $.post(urls.category).success(function(res) {
                    ep.emit('fliter', res);
                });

                ep.emit('user');//todo user data
            }

            if(!avalon.vmodels['fliterBtns']){
                avalon.define({
                    $id: "fliterBtns"
                });
            }

        }
    });

    avalon.state('collect', {
        url: "/collect",
        templateUrl: "tpl/collectCtrl.html",
        onEnter: function(state) {
            avalon.vmodels['nav']['title'] = "收藏";
            avalon.scan();
        }
    });

    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            avalon.vmodels['nav']['title'] = "个人中心";
            avalon.define({
                $id : "userInfo",
                //data :{
                //    userLogo : 'imgs/1.jpg',
                //    userName : '村里没有巧克力',
                //    motto : '日日code',
                //    college : '传媒学院',
                //
                //}
            });
            avalon.scan();
        }
    });

    avalon.state('detail', {
        url: '/detail',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "详情";
            //todo
            if(!avalon.vmodels['userInfo']){
                avalon.define({
                    $id: "userInfo",
                    users: [{}]
                });
            }
            avalon.scan();
        }
    });

    avalon.state('typeSelect', {
        url: "/typeSelect",
        templateUrl: "tpl/typeSelectCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "请选择";
        }
    });

    avalon.state('center', {
        url: "/center",
        templateUrl: "tpl/centerCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "个人中心";
        }
    });

    avalon.history.start({
        basepath: "/"
    });

    avalon.router.navigate(avalon.history.fragment);
});