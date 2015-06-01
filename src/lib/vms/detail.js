/**
 * Created by Liuchenling on 5/30/15.
 */

define(['urls', 'userCenter', 'eventproxy', 'mmState', 'mmHistory', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    var av = avalon.vmodels;

    avalon.state('detail', {
        url: '/detail/:id',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            av['nav']['title'] = "约";
            av['main']['state'] = 'loading';
            var id = this.params.id,
                user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }
            if(!av['detail']){
                avalon.define({
                    $id: "detail",
                    users: [],
                    data: {}
                });
            }
            av['detail'].data = {};

            $.post(urls.detail, {date_id: id, uid: user.uid, token: user.token}).success(function(res){
                av['detail'].data = res.data;
                avalon.scan();
                av['main']['state'] = 'ok';
            });
        }
    });
});