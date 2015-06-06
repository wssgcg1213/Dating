/**
 * Created by Liuchenling on 5/30/15.
 */

define('states/detail', ['urls', 'userCenter', 'eventproxy', 'vms/detail', 'vms/nav', 'vms/main', 'mmState', 'dialog', 'avaFilters', 'score'], function(urls, userCenter, EventProxy, vmDetail, vmNav, vmMain){
    avalon.state('detail', {
        url: '/detail/:id',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            vmNav['state'] = "detail";
            vmMain['state'] = 'loading';

            var id = this.params.id,
                //验证用户登录
                user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            //置空
            vmDetail.data = {};
            vmDetail.isSignedUp = vmDetail.isCollected = false;

            var ep = EventProxy.create('detail', function(detailRes){
                if(detailRes && detailRes.status == 200){
                    vmDetail.data = detailRes.data;
                    vmDetail['isCollected'] = detailRes.data.collection_status;
                    vmDetail['isSignedUp'] = detailRes.data.apply_status;
                }else{
                    return _fail(detailRes);
                }

                avalon.scan();
                vmMain['state'] = 'ok';
            })

            function _fail(res){
                log("api fail", res);
                if(res.status == 409){
                    return $.Dialog.fail(res.info);
                }
                $.Dialog.fail("服务器开小差了");
            }

            //获取detail的数据
            $.post(urls.detail, {date_id: id, uid: user.uid, token: user.token}).success(function(res){
                ep.emit('detail', res);
            }).fail(_fail);

        }
    });
});