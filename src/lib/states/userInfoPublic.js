/**
 * Created by Liuchenling on 6/1/15.
 *
 */

define('states/userInfoPublic', ['request', 'userCenter', 'jquery', 'vms/userInfoPublic', 'mmState', 'vms/main'], function(request, userCenter, $, vmUserInfoPublic){
    var av = avalon.vmodels;
    avalon.state('userInfoPublic', {
        url: "/userInfoPublic/:id",
        templateUrl: "tpl/userInfoPublicCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['state'] = 'userInfoPublic';
            av['main']['state'] = 'loading';

            var id = this.params.id;
            var user = userCenter.info();

            request('userInfo', {
                uid: user.uid,
                token: user.token,
                get_uid: id
            }).done(function(res){
                vmUserInfoPublic.data = res.data;
                avalon.scan();
                av['main']['state'] = 'ok';
            });
        }
    });
});