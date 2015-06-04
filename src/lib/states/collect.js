/**
 * Created at 6/3/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('states/collect', ['urls', 'userCenter', 'avalon', '../mmState', 'dialog', 'avaFilters', 'vms/main', 'vms/showBox'], function(urls, userCenter, avalon){
    var av = avalon.vmodels;
    avalon.state('collect', {
        url: "/collect",
        templateUrl: "tpl/collectCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "收藏";
            av['main']['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            $.post(urls.collection, {uid: user.uid, token: user.token}).success(function(res){
                if(res && res.status == 200){
                    av['showBox']['dateList'] = res.data;
                    avalon.scan();
                    av['main']['state'] = 'ok';
                }else{
                    log("err", res);
                    return $.Dialog.fail("服务器提了一个问题");
                }
            }).fail(function(res){
                log('net err', res);
                return $.Dialog.fail("网络超时");
            });


        }
    });
});