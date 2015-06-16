/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/detail', ['request', 'userCenter', 'jquery', 'eventproxy', 'avalon', 'vms/main'], function (request, userCenter, $, EventProxy, avalon, vmMain) {
    return avalon.define({
        $id: "detail",
        data: {}, //detail的数据
        isSignedUp: false, //已经报名否
        isCollected: false, //已经收藏否
        isSomeoneSignedUp: true, //是否有人报名

        goUser: function(id){
            log("叔叔 我们来看看这个人:", id);
            if(id == userCenter.info().uid){
                avalon.router.navigate('userInfo');
                return;
            }
            avalon.router.navigate('userInfoPublic/' + id);
        },
        signUp: function(_id){ //报名
            if(avalon.vmodels['detail'].isSignedUp){
                return $.Dialog.success("已经报名过了.");
            }

            _id = parseInt(_id);
            vmMain['state'] = 'loading';
            var user = userCenter.info();
            request('report', {uid: user.uid, token: user.token, date_id: _id}).done(function(res){
                $.Dialog.success("报名成功");
                avalon.vmodels['detail']['isSignedUp'] = true;
            });
        },

        collect: function(_id){ //收藏
            if(avalon.vmodels['detail'].isCollected){
                return $.Dialog.success("已经收藏过了.");
            }

            _id = parseInt(_id);
            avalon.vmodels['main']['state'] = 'loading';
            var user = userCenter.info();
            request('collect', {uid: user.uid, token: user.token, date_id: _id}).done(function(res){
                $.Dialog.success("收藏成功");
                avalon.vmodels['detail']['isCollected'] = true;
            });
        }
    });
});