/**
 * Created by Liuchenling on 5/30/15.
 * 用户中心
 */
define('states/userInfo', ['urls', 'userCenter', 'vms/nav', 'vms/main', 'vms/userInfo', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, vmNav, vmMain, vmUserInfo){
    var av = avalon.vmodels;

    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            vmNav['title'] = "个人中心";
            vmMain['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            //避免重复加载
            if(vmUserInfo.data && vmUserInfo.data.nickname){
                avalon.scan();
                vmMain['state'] = 'ok';
                return;
            }

            //AJAX
            $.post(urls.userInfo, {uid: user.uid, get_uid: user.uid, token: user.token}).success(function(res){
                if(res && res.status == 200 && res.data){
                    vmUserInfo.data = res.data;
                    avalon.scan();
                    vmMain['state'] = 'ok';
                }else {
                    log("Err", res);
                    $.Dialog.fail("服务器出了点问题!", 999999);
                }
            });
        }
    });
});