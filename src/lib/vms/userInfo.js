/**
 * Created by Liuchenling on 5/30/15.
 * 用户中心
 */
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    var av = avalon.vmodels;

    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            av['nav']['title'] = "个人中心";
            av['main']['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            if(!avalon.vmodels['userInfo'])avalon.define({$id : "userInfo", data: {},
                goDetail: function(id){
                    avalon.router.navigate('detail/' + id);
                }
            });

            if(av['userInfo'].data){
                return;
            }
            $.post(urls.userInfo, {uid: user.uid, get_uid: user.uid, token: user.token}).success(function(res){
                if(res && res.status == 200 && res.data){
                    av['userInfo'].data = res.data;
                }else{
                    log("Err", res);
                }

                avalon.scan();
                av['main']['state'] = 'ok';
            });
        }
    });
});