/**
 * Created by liuhzz on 2015/6/9.
 */
define('states/about',['avalon', 'dialog', 'mmState', 'vms/main'],function (avalon) {
    avalon.state('about',{
        url: '/about',
        templateUrl: 'tpl/aboutCtrl.html',
        onEnter: function(){
            avalon.scan();
            avalon.vmodels['main']['state'] = 'ok';
        }
    })
})

