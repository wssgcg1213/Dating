/**
 * Created by liuhzz on 2015/5/30.
 */
define("states/letters", ['urls', 'userCenter', 'vms/letters', '../mmState', 'dialog', 'avaFilters', 'vms/main', 'vms/letters'], function(urls, userCenter, vmLetters){
    avalon.state('letters',{
        url:'/letters',
        templateUrl:"tpl/lettersCtrl.html",
        onEnter: function() {
            avalon.vmodels['main']['state'] = 'loading';
            avalon.vmodels['nav']['title'] = "私信";

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            $.post(urls.detaildate,{date_id: 1,uid: user.uid, token: user.token}).success(function(res) {
                if(res.status == 200){
                    log(res.data);
                    vmLetters.data = res.data;
                    avalon.scan();
                    avalon.vmodels['main']['state'] = 'ok';
                }else{
                    //todo
                }
            })


        }
    });
})