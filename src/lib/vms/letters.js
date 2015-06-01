/**
 * Created by liuhzz on 2015/5/30.
 */
define(['urls', 'userCenter', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter){
    avalon.state('letters',{
        url:'/letters',
        templateUrl:"tpl/lettersCtrl.html",
        onEnter: function() {
            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }
            if(!avalon.vmodels['letters']){
                avalon.define({
                    $id: "letters",
                    data: {}

                });
                $.post(urls.detaildate,{date_id: 1,uid: user.uid, token: user.token}).success(function(res) {
                    if(res.status == 200){
                        log(res.data);
                        avalon.vmodels['letters'].data = res.data;
                    }
                })
            }
            avalon.scan();
        }
    });
})