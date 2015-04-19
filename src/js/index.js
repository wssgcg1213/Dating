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

require(['eventproxy', 'slider', 'domReady!', 'mmState'], function(EventProxy) {
    //debugger;
    var ep; //用来装载EventProxy的实例对象
    avalon.define({
        $id: "main", //主vm
        sliderCb: function() { //初始化slider
            var width = $(document).width(),
                height = width * 0.5625;
            $('.slider').slider({
                width: width,
                height: height,
                during: 3000
            });
        }
    });

    avalon.state('home', {
        controller: "main",
        url: "/",
        templateUrl: "tpl/indexCtrl.html",
        onEnter: function(){
            //define vms
            if(!avalon.vmodels['nav']){
                avalon.define({
                    $id: "nav",
                    title: "约"
                });
            }

            if(!avalon.vmodels['slider']){
                avalon.define({
                    $id: "slider",
                    items: [{}]
                });
            }

            if(!avalon.vmodels['fliterBtns']){
                avalon.define({
                    $id: "fliterBtns"
                });
            }

            console.log('onenter home');
            //异步处理, getdata
            ep = EventProxy.create('user', 'slider', 'fliter', function(user, slider, fliter) {
                avalon.vmodels['slider']['items'] = slider;
                console.log('before scan');
                avalon.scan();
            });

            ep.emit('user');//todo user data
            //$.post('') //todo 获取slider的数据
            ep.emit('slider', [{
                href: "#!/collect",
                img: "imgs/test.png"
            },{
                href: "#!/collect",
                img: "imgs/test.png"
            }]);
            ep.emit('fliter'); //todo 获取fliter的分类数据
        }
    });
    avalon.state('collect', {
        url: "/collect",
        templateUrl: "tpl/collectCtrl.html",
        onEnter: function(state) {
            var nav = avalon.vmodels['nav'];
            if(nav){
                nav['title'] = "收藏";
            }else{
                avalon.define({
                    $id: "nav",
                    title: "收藏"
                });
            }
        }
    });
    avalon.history.start({
        basepath: "/"
    });
    avalon.router.navigate(avalon.history.fragment);
    //avalon.scan();
});