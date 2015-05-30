/**
 * Created by Liuchenling on 5/30/15.
 */

define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    avalon.state('detail', {
        url: '/detail/:id',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "约";
            $.Dialog.loading();

            var id = this.params.id,
                user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }
            if(!avalon.vmodels['detail']){
                avalon.define({
                    $id: "detail",
                    users: [],
                    data: {}
                });
            }

            $.post(urls.detail, {date_id: id, uid: user.uid, token: user.token}).success(function(res){
                avalon.vmodels['detail'].data = res.data;
                avalon.scan();
                $.Dialog.close();
            });
        }
    });
});