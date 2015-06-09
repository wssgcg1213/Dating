/**
 * Created at 6/3/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('states/collect', ['request', 'userCenter', 'avalon', 'mmState', 'dialog', 'avaFilters', 'vms/main', 'vms/showBox', 'vms/nav'], function(request, userCenter, avalon){
    var av = avalon.vmodels;
    avalon.state('collect', {
        url: "/collect",
        templateUrl: "tpl/collectCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['state'] = "collect";
            av['main']['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            request('collection', {uid: user.uid, token: user.token})
                .done(function(res){
                    av['showBox']['dateList'] = res.data;
                    avalon.scan();
                    av['main']['state'] = 'ok';
                });
        }
    });
});