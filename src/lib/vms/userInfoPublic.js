/**
 * Created by Liuchenling on 6/1/15.
 * //todo 公共的用户中心页面
 */

define('vms/userInfoPublic', ['urls', 'userCenter', 'jquery', 'mmState', 'mmHistory', 'vms/main'], function(urls, userCenter, $){
    var av = avalon.vmodels;
    avalon.state('userInfoPublic', {
        url: "/userInfoPublic/:id",
        templateUrl: "tpl/userInfoPublicCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "用户中心";
            av['main']['state'] = 'loading';
            var id = this.params.id;
            var user = userCenter.info();

            if(!avalon.vmodels['userInfoPublic']){
                avalon.define({
                    $id: "userInfoPublic",
                    data: {}
                })
            }
            $.post(urls.userInfo, {
                uid: user.uid,
                token: user.token,
                get_uid: id
            }).success(function(res){
                if(res && res.status == 200 && res.data){
                    av['userInfoPublic'].data = res.data;
                    console.log(res.data);
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