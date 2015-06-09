/**
 * Created by liuhzz on 2015/6/3.
 */



define("states/userInfoEdit", ['urls', 'userCenter', 'jquery', 'eventproxy', '../mmState', 'dialog', 'vms/main', 'vms/userInfoEdit', '../mmState', '../mmHistory'], function(urls, userCenter, $, EP){
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

            function _fail(res){
                log("api fail", res);
                if(res.status == 409){
                    return $.Dialog.fail(res.info);
                }
                $.Dialog.fail("服务器提了一个问题");
            }
            function _check(res){
                if(res && res.status == 200 && res.data){
                    return true;
                }
                _fail(res);
                return false;
            }
            var ep = EP.create('detail', 'academyHash', 'gradeHash', function(detail, aRes, gRes){
                if(_check(detail)){
                    avalon.vmodels['userInfoEdit']['data'] = detail.data;
                }else{
                    return;
                }
                if(_check(aRes)){
                    avalon.vmodels['userInfoEdit']['academyHash'] = $$.academyHash = aRes.data;
                }else{
                    return;
                }
                if(_check(gRes)){
                    avalon.vmodels['userInfoEdit']['gradeHash'] = $$.gradeHash = gRes.data;
                }else{
                    return;
                }

                avalon.scan();
                av['main']['state'] = 'ok';
            });

            $.post(urls.userInfo, {uid: user.uid, token: user.token, get_uid: user.uid}).success(function(res){ep.emit('detail', res)}).fail(_fail);

            if(!$$.academyHash){
                $.post(urls.academy).success(function(res){ep.emit('academyHash', res)}).fail(_fail);
            }else{
                ep.emit('academyHash', {status: 200, data: $$.academyHash});
            }


            if(!$$.gradeHash){
                $.post(urls.gradeHash).success(function(res){ep.emit('gradeHash', res)}).fail(_fail);
            }else{
                ep.emit('gradeHash', {status: 200, data: $$.gradeHash});
            }

        }
    })
});