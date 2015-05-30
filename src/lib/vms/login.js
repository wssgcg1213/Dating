/**
 * Created by Liuchenling on 5/30/15.
 */

/**
 * 登陆的VM
 */
define(['urls', 'userCenter', 'mmState', 'dialog'], function(urls, userCenter){
    avalon.state('login',{
        url:"/login",
        templateUrl : "tpl/loginCtrl.html",
        onEnter: function(){
            if(!avalon.vmodels['login']){
                avalon.define({
                    $id: "login",
                    username: "",
                    password: "",
                    btn: function(e){ //点击登陆
                        e.preventDefault();
                        $.Dialog.loading();
                        userCenter.login(this.username, this.password, function(err, user){
                            if(err) {
                                $.Dialog.fail("登陆失败! 请检查用户名和密码.", 1400);
                                return;
                            }
                            $.Dialog.close();
                            return setTimeout(function(){
                                avalon.router.navigate('');
                            }, 0);
                        });
                    }
                });
            }
            var _loginVm = avalon.vmodels['login'];
            _loginVm.password = "";
            avalon.scan();
        }
    });
});