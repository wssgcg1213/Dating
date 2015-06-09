/**
 * Created by Liuchenling on 5/30/15.
 * 发布约的界面
 */
define("states/publishDating", ['request', 'userCenter', 'vms/publishDating', 'vms/nav', 'vms/main', 'eventproxy', 'mmState'], function(request, userCenter, vmPublishDating, vmNav, vmMain, EP){
    avalon.state('publishDating', {
        url: "/publishDating",
        templateUrl: "tpl/publishDatingCtrl.html",
        onEnter: function() {
            vmMain['state'] = 'loading';
            vmNav['state'] = "publishDating";

            //检测登陆
            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            //重置默认值
            var v = avalon.vmodels.publishDating;
            v.yType = v.yCollege = v.yGrade = v.ySex = v.yContent =
            v.yLocation = v.yPeople = v.yTime = v.yTitle = '';

            //失败统一出口
            function _fail(res){
                log('Category Fetch Err', res);
                avalon.scan();
                if(res.status == 409){
                    return $.Dialog.fail(res.info);
                }
                $.Dialog.fail("服务器提了一个问题!");
            }

            var ep = EP.create('category', 'academy', 'grade', function(cRes, aRes, gRes){
                vmPublishDating.datetype = $$.typeHash = cRes.data;
                vmPublishDating.academy = $$.academyHash = aRes.data;
                vmPublishDating['gradeHash'] = $$.gradeHash = gRes.data;

                avalon.scan();
                vmMain['state'] = 'ok';
            });

            if(!$$.typeHash){
                request('category').done(function(res){
                    ep.emit('category', res);
                });
            }else{
                ep.emit('category', {status: 200, data: $$.typeHash});
            }

            if(!$$.academyHash){
                request('academy').done(function(res){
                    ep.emit('academy', res);
                });
            }else{
                ep.emit('academy', {status: 200, data: $$.academyHash});
            }

            if(!$$.gradeHash){
                request('gradeHash').done(function(res){
                    ep.emit('grade', res);
                });
            }else{
                ep.emit('grade', {status: 200, data: $$.gradeHash});
            }

        }
    });
});