/**
 * Created by liuhzz on 2015/6/3.
 */



define("vms/userInfoEdit", ['urls', 'userCenter', 'mmState', 'dialog', 'vms/main', 'mmState', 'mmHistory'], function(urls, userCenter, $){

    var av = avalon.vmodels;

    avalon.state('userInfoEdit',{
        url: "/userInfoEdit",
        templateUrl: "tpl/userInfoEditCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = '个人中心';
            avalon.scan();
            av['main']['state'] = 'ok';
        }
    })
});