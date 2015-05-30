/**
 * Created by Liuchenling on 5/30/15.
 * 主页vm
 */
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    avalon.state('home', {
        controller: "main",
        url: "/",
        templateUrl: "tpl/indexCtrl.html",
        onEnter: function(){
            avalon.vmodels['nav']['title'] = '约';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(function(){avalon.router.navigate('login')}, 0);
                return;
            }//认证处理

            $.Dialog.loading();

            if(!avalon.vmodels['slider']){
                avalon.define({$id: "slider", items: [{}]});
            }

            if(!avalon.vmodels['fliterBtns']){
                avalon.define({
                    $id: "fliterBtns"
                });
            }

            if(!avalon.vmodels['showBox']){
                avalon.define({
                    $id: "showBox",
                    dateList: [{}],
                    goDetail: function(did){
                        avalon.router.navigate('detail/'+did);
                    }
                });
            }

            var ep = EventProxy.create('slider', 'category', 'showBox', function(slider, category, showBox) {
                //slider 轮播图
                var sliderData = slider.data.map(function(val){
                    return {href: val.url, img: val.src};
                });
                avalon.vmodels['slider']['items'] = sliderData;

                //category == datetype约会类型表
                //todo 跟首页过滤按钮有关

                //showBox 主显示区域
                if(showBox.status == 200){
                    avalon.vmodels['showBox'].dateList = showBox.data;
                }else{
                    console.log("err", showBox);
                }

                avalon.scan();
                //以下是scan完了之后才能操作的
                $.Dialog.close();
            });

            $.post(urls.slider).success(function(res) {ep.emit('slider', res)});
            $.post(urls.category).success(function(res) {ep.emit('category', res);});
            $.post(urls.showBox, {//todo 这些参数能默认么 @隆胸
                uid: user.uid,
                token: user.token,
                date_type: 0,
                page: 0,
                size: 10,
                order: 1
            }).success(function(res){ep.emit('showBox', res);});

        }
    });
});