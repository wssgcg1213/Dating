/**
* Created by Liuchenling on 5/30/15.
* 主页vm //todo 移除一些页面的vm出去
*/
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters', 'vms/main', 'mmState', 'mmHistory'], function(urls, userCenter, EventProxy){
    var av = avalon.vmodels;
    /**
     * //todo  收藏页这个页面怎么处理
     */
    avalon.state('collect', {
        url: "/collect",
        templateUrl: "tpl/collectCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "收藏";
            avalon.scan();
            av['main']['state'] = 'ok';
        }
    });

    /**
     * 主页 VM定义
     */
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
                avalon.define({$id: "slider", items: []});
            }

            if(!avalon.vmodels['category']){
                avalon.define({
                    $id: "category",
                    items: [],
                    func: function(){
                        $("#select").show(300);
                        $(".options-content").eq(0).show(300);
                    },
                    hiden: function(e){
                        $("#select").hide(300);
                        $(".options-content").eq(0).hide(300);
                        if(e.target == $(".option-content").eq[0]){
                            Array.prototype.slice.call($(".gray")).forEach(function(i){
                                if($(this).css("background") === "#dddddd"){
                                    console.log(1);
                                }

                            })
                            $(".left").innerText = ""//todo
                        }
                    },
                    order: function(n){
                        $(this).css("background","#dddddd");
                        switch (n){
                            case 1:
                                return;
                            case 2:
                                return;
                            case 3:
                                avalon.vmodels['main']['state'] = 'loading';
                                var list = avalon.vmodels['showBox'].dateList;
                                //console.log(list);
                                list = list.sort(function(v1, v2){
                                    return list.created_at < list.created_at;
                                });//todo 排序
                                avalon.vmodels['showBox'].dateList = list;
                                avalon.vmodels['main']['state'] = 'ok';

                        }
                    }

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
                    av['slider']['items'] = sliderData;
                }else{
                    log('err slider:', slider);
                    return $.Dialog.fail('服务器开小差呢!', 999999);
                }

                //category == datetype约会类型表
                if(_check(category)){
                    av['category']['items'] = category.data;
                }else{
                    log('err category:', category);
                    return $.Dialog.fail('服务器开小差呢!', 999999);
                }

                //showBox 主显示区域
                if(_check(showBox)){
                    av['showBox'].dateList = showBox.data;
                }else{
                    log("err", showBox);
                    return $.Dialog.fail('服务器开小差呢!', 999999);
                }

                avalon.scan();
                //以下是scan完了之后才能操作的
                av['main']['state'] = 'ok';
            });

            //加载过了就不再请求了
            if(av['slider']['items'].length
                && av['category']['items'].length
                && av['showBox']['dateList'].length){
                avalon.scan();
                av['main']['state'] = 'ok';
                return;
            }

            /**
             * AJAX错误处理函数
             * @param res
             * @private
             */
            function _failHandler(res){
                log("请求失败:", res);
                $.Dialog.fail("服务器提了一个问题T.T 请稍后再试!", 999999);
            }
            //请求
            $.post(urls.slider).success(function(res) {ep.emit('slider', res)}).fail(_failHandler);
            $.post(urls.category).success(function(res) {ep.emit('category', res);}).fail(_failHandler);
            $.post(urls.showBox, {//todo 这些参数能默认么 @隆胸
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