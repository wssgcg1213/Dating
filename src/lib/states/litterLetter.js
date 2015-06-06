/**
 * Created by liuhzz on 2015/5/30.
 */
/**
 * Created at 2015年06月06日.
 * @Author Ling.
 * @Email i@zeroling.com
 */

define('states/litterLetter', ['urls', 'vms/main', 'vms/nav', 'userCenter', 'vms/litterLetter', 'mmState', 'dialog', 'avaFilters'], function(urls, vmMain, vmNav, userCenter, vmLitterLetter){
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

            $.post(urls.getletter, {
                uid: user.uid,
                token: user.token
            }).success(function(res) {
                if(res.status == 200){
                    vmLitterLetter.list = res.data;
                    avalon.scan();
                    vmMain.state = 'ok';
                }else{
                    log("err", res);
                    return $.Dialog.fail("服务器提了一个问题");
                }
            }).fail(function(res){
                log("err", res);
                return $.Dialog.fail("服务器提了一个问题");
            });

        }
    })
})