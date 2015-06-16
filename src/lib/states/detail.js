/**
 * Created by Liuchenling on 5/30/15.
 */

define('states/detail', ['request', 'userCenter', 'eventproxy', 'vms/detail', 'vms/nav', 'vms/main', 'mmState', 'dialog', 'avaFilters', 'score'], function(request, userCenter, EventProxy, vmDetail, vmNav, vmMain){
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

            //获取detail的数据
            request('detail', {date_id: id, uid: user.uid, token: user.token})
                .done(function(res){
                    vmDetail.data = res.data;
                    if(res.data.joined.length == 0){
                        vmDetail['isSomeoneSignedUp'] = false;
                    }
                    console.log('现在是否有人报名：'+ vmDetail['isSomeoneSignedUp']);
                    vmDetail['isCollected'] = res.data.collection_status;
                    vmDetail['isSignedUp'] = res.data.apply_status;
                    avalon.scan();
                    vmMain['state'] = 'ok';
                });

        }
    });
});