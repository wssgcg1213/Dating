/**
 * Created by Liuchenling on 5/30/15.
 */
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    avalon.state('history',{
        url:'/history',
        templateUrl:"tpl/historyCtrl.html",
        onEnter: function() {
            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }
            if(!avalon.vmodels["history"]){
                avalon.define({
                    $id: "history",
                    userInfo: {},
                    data: []
                });
            }
            var _ep = EventProxy.create('historyCreate', 'historyJoin', function(createRes, joinRes){
                var data = []; //all
                if(Array.isArray(createRes.data)){data = data.concat(createRes.data);}
                if(Array.isArray(joinRes.data)){data = data.concat(joinRes.data);}
                data.sort(function(v1, v2){
                    return v1.created_at > v2.created_at;
                });
                console.log(data);

                avalon.vmodels["history"].data = data;
                avalon.vmodels["history"].userInfo = {
                    head: data[0].head,
                    signature: data[0].signature,
                    user_gender: data[0].user_gender,
                    nickname: data[0].nickname
                };
                avalon.scan();
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