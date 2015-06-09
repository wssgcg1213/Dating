/**
 * Created by liuhzz on 2015/6/3.
 */



define("states/userInfoEdit", ['request', 'userCenter', 'jquery', 'eventproxy',  'dialog', 'vms/main', 'vms/userInfoEdit', 'mmState'], function(request, userCenter, $, EP){
    var av = avalon.vmodels;
    avalon.state('userInfoEdit',{
        url: "/userInfoEdit",
        templateUrl: "tpl/userInfoEditCtrl.html",
        onEnter: function() {
            avalon.vmodels['main']['state'] = 'loading';
            avalon.vmodels['nav']['state'] = 'userInfoEdit';

            //验证用户登录
            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            var ep = EP.create('detail', 'academyHash', 'gradeHash', function(detail, aRes, gRes){
                avalon.vmodels['userInfoEdit']['data'] = detail.data;
                avalon.vmodels['userInfoEdit']['academyHash'] = $$.academyHash = aRes.data;
                avalon.vmodels['userInfoEdit']['gradeHash'] = $$.gradeHash = gRes.data;
                avalon.scan();
                av['main']['state'] = 'ok';
            });

            request('userInfo', {uid: user.uid, token: user.token, get_uid: user.uid})
                .done(function(res){ep.emit('detail', res)});

            if(!$$.academyHash){
                request('academy').done(function(res){ep.emit('academyHash', res)});
            }else{
                ep.emit('academyHash', {status: 200, data: $$.academyHash});
            }

            if(!$$.gradeHash){
                request('gradeHash').done(function(res){ep.emit('gradeHash', res)});
            }else{
                ep.emit('gradeHash', {status: 200, data: $$.gradeHash});
            }
        }
    })
});