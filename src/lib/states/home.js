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
        onExit:function(){
            $(window).off('scroll', scrollHandler)
        },
        onEnter: function(){
            vmNav['state'] = 'home';
            vmMain['state'] = 'loading';

            //add bang ding
            $(window).on('scroll', scrollHandler);

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

                //showbox下拉加载
                $(window).bind('scroll',scrollHandle);


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

            function scrollHandle(e){
                var page = 0;
                var tHeight = $(document).height();
                if($(window).scrollTop()+$(window).height() >= tHeight){
                    ajaxer(avalon.vmodels['category'].active.category,page);
                    page++;
                    console.log(page);
                }
            }

            function ajaxer(typeId,page){
                $.post(urls.dateList,{
                    date_type: typeId,
                    uid: user.uid,
                    token: user.token,
                    page: page
                }).success(function(res){
                    if(res && res.state == 200){
                        console.log(res.data);
                        avalon.vmodels['showBox']['dateList'].concat(res.data);
                        avalon.vmodels['main']['state'] = 'ok';
                    }else if(res && res.state == 409){
                        log("err", res);
                        $.Dialog.fail("服务器提了一个问题");
                    }else{
                        log("err", res);
                        $.Dialog.fail("服务器提了一个问题");
                    }
                }).fail(function(res){
                    log("err", res);
                    $.Dialog.fail("服务器提了一个问题");
                });
            }
        }
    });

    var loadingFlag = false;
    function scrollHandler(ev){
        if(loadingFlag || $(this).height() + $(this).scrollTop() < $(document).height())return false;

        loadingFlag = true;
        vmMain.state = 'loading';

        var typeName = avalon.vmodels['category']['active']['category'], typeId = 0;
        if(typeName){
            typeId = $$.typeHash.filter(function(o){if(o.type == typeName) return o});
            if(typeId && typeId.length >= 1){
                typeId = typeId[0]['id'];
            }else{
                typeId = 0;
            }
        }
        var user = userCenter.info();
        var page = vmShowBox.page++;

        $.post(urls.showBox, {
            uid: user.uid,
            token: user.token,
            date_type: typeId,
            page: page,
            size: 10,
            order: 1 //todo order
        }).success(function(res){
            if(res && res.status == 200 && res.data && Array.isArray(res.data)){
                vmShowBox.dateList.pushArray(res.data);
                vmMain.state = 'ok';
            }else{
                log('err', res);
                $.Dialog.fail("服务器出错");
            }
            loadingFlag = false;
        });
    }
});