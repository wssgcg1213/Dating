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
                height = width * 0.5625;
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
        showDropDown: false,
        toggleDropDown: function(show){
            var _flag = avalon.vmodels.nav.showDropDown;
            if(typeof show !== 'object'){//默认传event对象
                return avalon.vmodels.nav.showDropDown = show;
            }
            avalon.vmodels.nav.showDropDown = !_flag;
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
                avalon.vmodels['slider']['items'] = slider;
                console.log('cats:', fliter); //todo with categories
                console.log('before scan');
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
                    ep.emit('slider', res.map(function(val){
                        return {
                            href: val.url,
                            img: val.src
                        };
                    }));
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

            console.log('onenter home');



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

        }
    });

    avalon.history.start({
        basepath: "/"
    });
    avalon.router.navigate(avalon.history.fragment);
});