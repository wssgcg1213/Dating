/**
 * Created by Liuchenling on 5/30/15.
 */
define('states/history', ['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters', 'vms/main'], function(urls, userCenter, EventProxy){
    var av = avalon.vmodels;
    avalon.state('history',{
        url:'/history',
        templateUrl:"tpl/historyCtrl.html",
        onEnter: function() {
            av['nav']['title'] = "历史记录";
            av['main']['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            var _ep = EventProxy.create('historyCreate', 'historyJoin', function(createRes, joinRes){
                var data = []; //all in one
                if(Array.isArray(createRes.data)){data = data.concat(createRes.data);}
                if(Array.isArray(joinRes.data)){data = data.concat(joinRes.data);}

                data = data.sort(function(v1, v2){
                    return v2.created_at - v1.created_at;
                });

                data.forEach(function(v){
                    v.date_at = v.date_time;
                });

                log("history", data);
                av["showBox"].dateList = data;
                avalon.scan();
                avalon.vmodels['main']['state'] = 'ok';

            });

            $.post(urls.historyCreate,{uid: user.uid,token: user.token}).success(function(res) {
                _ep.emit('historyCreate', res);
            });
            $.post(urls.historyJoin,{uid:user.uid,token:user.token}).success(function(res) {
                _ep.emit('historyJoin', res);
            });
        }
    });
});