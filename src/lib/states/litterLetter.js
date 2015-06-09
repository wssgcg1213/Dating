/**
 * Created by liuhzz on 2015/5/30.
 */
/**
 * Created at 2015年06月06日.
 * @Author Ling.
 * @Email i@zeroling.com
 */

define('states/litterLetter', ['request', 'vms/main', 'vms/nav', 'userCenter', 'vms/litterLetter', 'mmState', 'dialog', 'avaFilters'], function(request, vmMain, vmNav, userCenter, vmLitterLetter){
    avalon.state("litterLetter",{
        url:"/litterLetter",
        templateUrl:"tpl/litterLetterCtrl.html",
        onEnter:function() {
            vmNav.state = "litterLetter";
            vmMain.state = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(function(){avalon.router.navigate('login')}, 0);
                return;
            }//认证处理

            request('getletter', {
                uid: user.uid,
                token: user.token
            }).done(function(res){
                vmLitterLetter.list = res.data;
                avalon.scan();
                vmMain.state = 'ok';
            });

        }
    })
})