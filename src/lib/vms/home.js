/**
 * Created by Liuchenling on 5/30/15.
 * 主页vm
 */
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    var av = avalon.vmodels;

    avalon.state('home', {
        controller: "main",
        url: "/",
        templateUrl: "tpl/indexCtrl.html",
        onEnter: function(){
            av['nav']['title'] = '约';
            av['main']['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(function(){avalon.router.navigate('login')}, 0);
                return;
            }//认证处理

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
                    dateList: [],
                    goDetail: function(id){
                        log("we are ready to go detail no.", id);
                        avalon.router.navigate('detail/' + id);
                    }
                });
            }

            var ep = EventProxy.create('slider', 'category', 'showBox', function(slider, category, showBox) {
                //slider 轮播图
                var sliderData = slider.data.map(function(val){
                    return {href: val.url, img: val.src};
                });
                av['slider']['items'] = sliderData;

                //category == datetype约会类型表
                //todo 跟首页过滤按钮有关

                //showBox 主显示区域
                if(showBox.status == 200){
                    av['showBox'].dateList = showBox.data;
                }else{
                    log("err", showBox);
                }

                avalon.scan();
                //以下是scan完了之后才能操作的
                av['main']['state'] = 'ok';
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