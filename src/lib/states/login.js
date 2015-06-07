/**
 * Created by Liuchenling on 5/30/15.
 * 登陆的VM
 */
define("states/login", ['urls', 'userCenter', 'vms/login', 'dialog', 'mmState', 'vms/main'], function(urls, userCenter, vmLogin){
    var av = avalon.vmodels;

    avalon.state('login',{
        url:"/login",
        templateUrl : "tpl/loginCtrl.html",
        onEnter: function(){
            vmLogin['password'] = "";
            userCenter.logout();

            avalon.scan();
            av['main']['state'] = 'ok';
        }
    });
});