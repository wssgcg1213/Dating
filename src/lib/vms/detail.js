/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/detail', ['urls', 'userCenter', 'jquery', 'eventproxy', 'avalon', 'vms/main'], function (urls, userCenter, $, EventProxy, avalon, vmMain) {
    var user = userCenter.info();
    var vm = avalon.define({
        $id: "detail",
        data: {}, //detail的数据
        isSignedUp: false, //已经报名否
        isCollected: false, //已经收藏否

        goUser: function(id){
            log("叔叔 我们来看看这个人:", id);
            if(id == user.uid){
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

            $.post(urls.report, {uid: user.uid, token: user.token, date_id: _id}).success(function(res){
                if(res && res.status == 200){
                    $.Dialog.success("报名成功");
                    avalon.vmodels['detail']['isSignedUp'] = true;
                }else{
                    log("报名 API fail", res);
                    if(res.status == 409){
                        return $.Dialog.fail(res.info);
                    }
                    $.Dialog.fail("服务器开小差了!");
                }
            }).fail(log.bind(this, "报名 API fail"));
        },

        collect: function(_id){ //收藏
            if(vm.isCollected){
                return $.Dialog.success("已经收藏过了.");
            }

            _id = parseInt(_id);
            avalon.vmodels['main']['state'] = 'loading';
            $.post(urls.collect, {uid: user.uid, token: user.token, date_id: _id}).success(function(res){
                if(res && res.status == 200){
                    $.Dialog.success("收藏成功");
                    avalon.vmodels['detail']['isCollected'] = true;
                }else{
                    log("收藏 API fail", res);
                    if(res.status == 409){
                        return $.Dialog.fail(res.info);
                    }
                    $.Dialog.fail("服务器开小差了!");
                }
            }).fail(log.bind(this, "收藏 API fail"));

        }
    });
    
    return vm;
});