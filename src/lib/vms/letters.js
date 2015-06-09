/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/letters', ['avalon', 'jquery', 'urls', 'userCenter', 'dialog'], function (avalon, $, urls, userCenter) {
    return avalon.define({
        $id: "letters",
        data: {},
        action: function(type, to_id, date_id){
            type = type == 'accept' ? 1 : 0;
            var user = userCenter.info();
            $.post(urls.dateaction, {
                uid: user.uid,
                token: user.token,
                to_id: to_id,
                date_id: date_id,
                action: type
            }).success(function(res){
                if(res && res.status == 200){
                    log(res);
                    //todo ??
                }else{
                    log('err', res);
                    if(res.status == 409){
                        $.Dialog.fail(res.info, 2000);
                        return setTimeout(function(){
                            location.reload();
                        }, 2000);
                    }
                    return $.Dialog.fail('服务器的毛病');
                }
            }).fail(function(res){
                log('err', res);
                $.Dialog.fail('服务器的毛病');
            });
        }
    });
});