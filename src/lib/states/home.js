/**
 * Created by Liuchenling on 5/30/15.
 * 主页state
 */
define("states/home", ['urls', 'userCenter', 'eventproxy', 'vms/main', 'vms/nav', 'vms/showBox', 'vms/category', 'vms/slider', 'mmState'], function(urls, userCenter, EventProxy, vmMain, vmNav, vmShowBox, vmCategory, vmSlider){
    var av = avalon.vmodels;
    /**
     * 主页 VM定义
     */
    avalon.state('home', {
        controller: "main",
        url: "/",
        templateUrl: "tpl/indexCtrl.html",
        onEnter: function(){
            vmNav['state'] = 'home';
            vmMain['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(function(){avalon.router.navigate('login')}, 0);
                return;
            }//认证处理

            var ep = EventProxy.create('slider', 'category', 'showBox', function(slider, category, showBox) {
                /**
                 * 检测response对象是否合法的工具 私有
                 * @param resObj
                 * @returns {*|boolean}
                 * @private
                 */
                function _check(resObj){
                    return resObj && resObj.status == 200 && resObj.data && Array.isArray(resObj.data);
                }

                //slider 轮播图
                if(_check(slider)){
                    var sliderData = slider.data.map(function(val){
                        return {href: val.url, img: val.src};
                    });
                    vmSlider['items'] = sliderData;
                }else{
                    log('err slider:', slider);
                    return $.Dialog.fail('服务器提了一个问题');
                }

                //category == datetype约会类型表
                if(_check(category)){
                    vmCategory['categories'] = category.data;
                    if(!$$.typeHash) $$.typeHash = category.data;
                }else{
                    log('err category:', category);
                    return $.Dialog.fail('服务器提了一个问题');
                }

                //showBox 主显示区域
                if(_check(showBox)){
                    vmShowBox.dateList = showBox.data;
                }else{
                    log("err", showBox);
                    return $.Dialog.fail('服务器提了一个问题');
                }

                avalon.scan();
                //以下是scan完了之后才能操作的
                vmMain['state'] = 'ok';
            });

            //加载过了就不再请求了
            //if(vmSlider['items'].length && vmCategory['categories'].length && vmShowBox['dateList'].length){
            //    avalon.scan();
            //    vmMain['state'] = 'ok';
            //    return;
            //}
            //取消这个逻辑

            /**
             * AJAX错误处理函数
             * @param res
             * @private
             */
            function _failHandler(res){
                log("请求失败:", res);
                $.Dialog.fail("服务器提了一个问题");
            }
            //请求
            $.post(urls.slider).success(function(res) {ep.emit('slider', res)}).fail(_failHandler);
            $.post(urls.category).success(function(res) {ep.emit('category', res);}).fail(_failHandler);
            $.post(urls.showBox, {
                uid: user.uid,
                token: user.token,
                date_type: 0,
                page: 0,
                size: 10,
                order: 1
            }).success(function(res){ep.emit('showBox', res);}).fail(_failHandler);

        }
    });
});