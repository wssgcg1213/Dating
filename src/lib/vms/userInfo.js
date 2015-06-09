/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/userInfo', ['avalon', 'userCenter', '../mmState'], function (avalon, userCenter) {
    return avalon.define({
        $id : "userInfo",
        data: {},
        goDetail: function(id){
            log("We R going TO detail:", id);
            avalon.router.navigate('detail/' + id);
        },
        goUser: function(id){
            log("叔叔 我们来看看这个人:", id);
            if(id == userCenter.info().uid){
                avalon.router.navigate('userInfo');
                return;
            }
            avalon.router.navigate('userInfoPublic/' + id);
        }
    });
});