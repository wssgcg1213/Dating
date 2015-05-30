/**
 * Created by Liuchenling on 5/30/15.
 * 用户中心
 */
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            avalon.vmodels['nav']['title'] = "个人中心";
            $.Dialog.loading();

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

            $.post(urls.userInfo, {uid: user.uid, get_uid: user.uid, token: user.token}).success(function(res){
                if(res.status == 200){
                    avalon.vmodels['userInfo'].data = res.data;
                }else{
                    console.log("Err", res);
                }

                avalon.scan();
                $.Dialog.close();
            });
        }
    });
});