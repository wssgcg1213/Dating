/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/letters', ['avalon', 'jquery', 'request', 'userCenter', 'dialog'], function (avalon, $, request, userCenter) {
    return avalon.define({
        $id: "letters",
        data: {},
        action: function(type, to_id, date_id){
            type = type == 'accept' ? 1 : 0;
            var user = userCenter.info();
            request('dateaction', {
                uid: user.uid,
                token: user.token,
                to_id: to_id,
                date_id: date_id,
                action: type
            }).done(function(res){
                log(res);
                //todo ??
            }).fail(function(res){
                if(res.status != 409) return;
                $.Dialog.fail(res.info, 2000);
                return setTimeout(function(){
                    location.reload();
                }, 2000);
            });
        }
    });
});