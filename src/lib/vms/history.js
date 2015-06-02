/**
 * Created by Liuchenling on 5/30/15.
 */
define('vms/history', ['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters', 'vms/main'], function(urls, userCenter, EventProxy){
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
            if(!av["history"]){
                avalon.define({
                    $id: "history",
                    userInfo: {},
                    data: [],
                    goDetail: function(id){
                        avalon.router.navigate('detail/' + id);
                    }
                });
            }
            var _ep = EventProxy.create('historyCreate', 'historyJoin', function(createRes, joinRes){
                var data = []; //all in one
                if(Array.isArray(createRes.data)){data = data.concat(createRes.data);}
                if(Array.isArray(joinRes.data)){data = data.concat(joinRes.data);}
                data.sort(function(v1, v2){
                    return v1.created_at > v2.created_at;
                });//todo 是否在view显示created/joined

                av["history"].data = data;
                av["history"].userInfo = {
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