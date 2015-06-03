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

            var gradeHash, gradeTrans = function(str){
                if(Array.isArray(str)){
                    return str.map(function(s){
                        return gradeTrans(s);
                    })
                }

                return gradeHash[str];
            }

            if(!av['detail']){
                avalon.define({
                    $id: "detail",
                    data: {}, //detail的数据
                    isSignedUp: false, //已经报名否
                    isCollected: false, //已经收藏否
                    gradeHash: {},
                    gradeTrans: gradeTrans,
                    goUser: function(id){
                        log("叔叔 我们来看看这个人:", id);
                        if(id == user.uid){
                            avalon.router.navigate('userInfo');
                            return;
                        }
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
                        }).fail(log.bind(this, "报名 API fail"));
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
                        }).fail(log.bind(this, "收藏 API fail"));

                    }
                });
            }

            //置空
            av['detail'].data = {};
            av['detail'].isSignedUp = av['detail'].isCollected = false;

            var ep = EventProxy.create('detail', 'gradeHash', function(detailRes, gradeRes){
                if(detailRes && detailRes.status == 200){
                    av['detail'].data = detailRes.data;
                    av['detail']['isCollected'] = detailRes.data.collection_status;
                    av['detail']['isSignedUp'] = detailRes.data.apply_status;

                }else{
                    return _fail(detailRes);
                }

                if(gradeRes && gradeRes.status == 200){
                    var gsh = {};
                    gradeRes.data.map(function(d){
                        gsh[d.id] = d.name;
                    })
                    av['detail'].gradeHash = gradeHash = gsh;
                }else{
                    return _fail(detailRes);
                }

                avalon.scan();
                av['main']['state'] = 'ok';
            })

            function _fail(res){
                log("api fail", res);
                if(res.status == 409){
                    return $.Dialog.fail(res.info);
                }
                $.Dialog.fail("服务器开小差了");
            }
            //获取detail的数据
            $.post(urls.detail, {date_id: id, uid: user.uid, token: user.token}).success(function(res){
                ep.emit('detail', res);
            }).fail(_fail);

            $.post(urls.gradeHash).success(function(res){
                ep.emit('gradeHash', res);
            }).fail(_fail);
        }
    });
});