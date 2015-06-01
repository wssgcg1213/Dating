/**
 * Created by Liuchenling on 6/1/15.
 * //todo 公共的用户中心页面
 */
define(['jquery', 'mmState', 'mmHistory', 'vms/main'], function($){
    var av = avalon.vmodels;
    avalon.state('userInfoPublic', {
        url: "/userInfoPublic/:id",
        templateUrl: "tpl/userInfoPublicCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "用户中心";
            var id = this.params.id;

            log(id);




            avalon.scan();
            av['main']['state'] = 'ok';
        }
    });
});