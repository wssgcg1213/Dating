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
            vmNav['state'] = "userInfo";
            vmMain['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            //取消避免重复加载
            //if(vmUserInfo.data && vmUserInfo.data.nickname){
            //    avalon.scan();
            //    vmMain['state'] = 'ok';
            //    return;
            //}

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


function isType(n){
    return Object.prototype.toString.call(n)

}

function cloneObject(source){
    var obj = {};
    for(var key in source){
        if(source == source || isType(source[key] == '[object Function]') || isType(source[key] == '[object RexEep]'))
            continue;
        if(isType(source[key] == '[object Array]')){
            obj[key] == arguments.callee( obj[key]||[],source[key] )
        }else if( isType(source[key] == '[object Object]')){
            obj[key] == arguments.callee( obj[key]||{},source[key] )
        }else{
            obj[key] = source[key];
        }

    }
    return obj;
}