/**
 * Created by liuhzz on 2015/6/9.
 */
define('states/about',['avalon', 'dialog', 'mmState', 'vms/main', 'vms/nav'],function (avalon) {
    avalon.state('about',{
        url: '/about',
        templateUrl: 'tpl/aboutCtrl.html',
        onEnter: function(){
            avalon.vmodels['nav']['state'] = "about";
            avalon.scan();
            avalon.vmodels['main']['state'] = 'ok';
        }
    })
})

