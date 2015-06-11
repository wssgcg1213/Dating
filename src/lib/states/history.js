/**
 * Created by Liuchenling on 5/30/15.
 */
define('states/history', ['request', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters', 'vms/main'], function(request, userCenter, EventProxy){
    var av = avalon.vmodels;
    avalon.state('history',{
        url:'/history',
        templateUrl:"tpl/historyCtrl.html",
        onEnter: function() {
            av['nav']['state'] = "history";
            av['main']['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            $.when(
                request('historyCreate', {uid: user.uid,token: user.token}),
                request('historyJoin', {uid:user.uid,token:user.token})
            ).done(function(createRes, joinRes){
                    //all in one
                    var data = [].concat(createRes.data).concat(joinRes.data).sort(function(v1, v2){
                        return v2.created_at - v1.created_at;
                    });
                    data.forEach(function(v){
                        v.date_at = v.date_time;
                    });
                    av["showBox"].dateList = data;

                    avalon.scan();
                    avalon.vmodels['main']['state'] = 'ok';
                });

        }
    });
});