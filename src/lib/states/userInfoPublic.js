/**
 * Created by Liuchenling on 6/1/15.
 *
 */

define('states/userInfoPublic', ['urls', 'userCenter', 'jquery', 'vms/userInfoPublic', '../mmState', '../mmHistory', 'vms/main'], function(urls, userCenter, $, vmUserInfoPublic){
    var av = avalon.vmodels;
    avalon.state('userInfoPublic', {
        url: "/userInfoPublic/:id",
        templateUrl: "tpl/userInfoPublicCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['state'] = 'userInfoPublic';
            av['main']['state'] = 'loading';

            var id = this.params.id;
            var user = userCenter.info();

            $.post(urls.userInfo, {
                uid: user.uid,
                token: user.token,
                get_uid: id
            }).success(function(res){
                if(res && res.status == 200 && res.data){
                    vmUserInfoPublic.data = res.data;
                    avalon.scan();
                    av['main']['state'] = 'ok';
                }else{
                    log("Err", res);
                    $.Dialog.fail("服务器提了一个问题");
                }
            }).fail(log.bind("超时"));

        }
    });
});