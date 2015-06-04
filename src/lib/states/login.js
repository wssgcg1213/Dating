/**
 * Created by Liuchenling on 5/30/15.
 * 登陆的VM
 */
define("states/login", ['urls', 'userCenter', 'vms/login', '../mmState', 'dialog', '../mmHistory', '../mmState', 'vms/main'], function(urls, userCenter, vmLogin){
    var av = avalon.vmodels;

    avalon.state('login',{
        url:"/login",
        templateUrl : "tpl/loginCtrl.html",
        onEnter: function(){
            av['login']['password'] = "";
            avalon.scan();
            av['main']['state'] = 'ok';
        }
    });
});