/**
 * Created by Liuchenling on 5/30/15.
 * 发布约的界面
 */
define("states/publishDating", ['urls', 'userCenter', 'vms/publishDating', 'vms/nav', 'vms/main', 'eventproxy', 'mmState'], function(urls, userCenter, vmPublishDating, vmNav, vmMain, EP){
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
                if(cRes && cRes.status == 200 && cRes.data && Array.isArray(cRes.data)){
                    $$.typeHash = vmPublishDating.datetype = cRes.data;
                }else{
                    return _fail(cRes);
                }

                if(aRes && aRes.status == 200 && aRes.data && Array.isArray(aRes.data)){
                    $$.academyHash = vmPublishDating.academy = aRes.data;
                }else{
                    return _fail(aRes);
                }

                if(gRes && gRes.status == 200 && gRes.data && Array.isArray(gRes.data)){
                    $$.gradeHash = vmPublishDating['gradeHash'] = gRes.data;
                }else{
                    return _fail(gRes);
                }

                avalon.scan();
                vmMain['state'] = 'ok';
            })

            if(!$$.typeHash){
                $.post(urls.category).success(function(res){
                    ep.emit('category', res);
                }).fail(_fail);
            }else{
                ep.emit('category', {status: 200, data: $$.typeHash});
            }

            if(!$$.academyHash){
                $.post(urls.academy).success(function(res){
                    ep.emit('academy', res);
                }).fail(_fail);
            }else{
                ep.emit('academy', {status: 200, data: $$.academyHash});
            }

            if(!$$.gradeHash){
                $.post(urls.gradeHash).success(function(res){
                    ep.emit('grade', res);
                }).fail(_fail);
            }else{
                ep.emit('grade', {status: 200, data: $$.gradeHash});
            }

        }
    });
});