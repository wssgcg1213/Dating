/**
 * Created by Liuchenling on 5/30/15.
 * 用户中心
 */
define('states/userInfo', ['request', 'userCenter', 'vms/nav', 'vms/main', 'vms/userInfo', 'mmState', 'dialog', 'avaFilters'], function(request, userCenter, vmNav, vmMain, vmUserInfo){
    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            vmNav['state'] = "userInfo";
            vmMain['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            request('userInfo', {uid: user.uid, get_uid: user.uid, token: user.token}).done(function(res){
                vmUserInfo.data = res.data;
                avalon.scan();
                vmMain['state'] = 'ok';
            });
        }
    });
});