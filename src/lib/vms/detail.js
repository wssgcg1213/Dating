/**
 * Created by Liuchenling on 5/30/15.
 */

define('vms/detail', ['urls', 'userCenter', 'eventproxy', 'mmState', 'mmHistory', 'dialog', 'avaFilters', 'vms/main'], function(urls, userCenter, EventProxy){
    var av = avalon.vmodels;

    avalon.state('detail', {
        url: '/detail/:id',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            av['nav']['title'] = "约";
            av['main']['state'] = 'loading';

            var id = this.params.id,

                //验证用户登录
                user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            if(!av['detail']){
                avalon.define({
                    $id: "detail",
                    data: {}, //detail的数据
                    isSignedUp: false, //已经报名否
                    isCollected: false, //已经收藏否
                    goUser: function(id){
                        log("叔叔 我们来看看这个人:", id);
                        avalon.router.navigate('userInfoPublic/' + id);
                    },
                    signUp: function(_id){ //报名
                        if(av['detail'].isSignedUp){
                            return $.Dialog.success("已经报名过了.");
                        }

                        _id = parseInt(_id);
                        avalon.vmodels['main']['state'] = 'loading';
                        $.post(urls.report, {uid: user.uid, token: user.token, date_id: _id}).success(function(res){
                            if(res && res.status == 200){
                                $.Dialog.success("报名成功");
                                avalon.vmodels['detail']['isSignedUp'] = true;
                            }else{
                                log("报名 API fail", res);
                                if(res.status == 409){
                                    return $.Dialog.fail(res.info);
                                }
                                $.Dialog.fail("服务器开小差了!");
                            }
                        }).fail(log.bind("报名 API fail"));
                    },
                    collect: function(_id){ //收藏
                        if(av['detail'].isCollected){
                            return $.Dialog.success("已经收藏过了.");
                        }

                        _id = parseInt(_id);
                        avalon.vmodels['main']['state'] = 'loading';
                        $.post(urls.collect, {uid: user.uid, token: user.token, date_id: _id}).success(function(res){
                            if(res && res.status == 200){
                                $.Dialog.success("收藏成功");
                                avalon.vmodels['detail']['isCollected'] = true;
                            }else{
                                log("收藏 API fail", res);
                                if(res.status == 409){
                                    return $.Dialog.fail(res.info);
                                }
                                $.Dialog.fail("服务器开小差了!");
                            }
                        }).fail(log.bind("收藏 API fail"));

                    }
                });
            }

            //置空
            av['detail'].data = {};
            av['detail'].isSignedUp = av['detail'].isCollected = false;

            //获取detail的数据
            $.post(urls.detail, {date_id: id, uid: user.uid, token: user.token}).success(function(res){
                if(res && res.status == 200){
                    av['detail'].data = res.data;
                    av['detail']['isCollected'] = res.data.collection_status;
                    av['detail']['isSignedUp'] = res.data.apply_status;
                    avalon.scan();
                    av['main']['state'] = 'ok';
                }else{
                    log("userInfo API fail", res);
                    if(res.status == 409){
                        return $.Dialog.fail(res.info);
                    }
                    $.Dialog.fail("服务器开小差了!");
                }
            }).fail(log.bind("userInfo fail"));

        }
    });
});