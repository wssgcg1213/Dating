/**
 * Created by Liuchenling on 5/30/15.
 */

/**
 * 登陆的VM
 */
define(['urls', 'userCenter', 'mmState', 'dialog', 'mmHistory', 'mmState'], function(urls, userCenter){
    var av = avalon.vmodels;

    avalon.state('login',{
        url:"/login",
        templateUrl : "tpl/loginCtrl.html",
        onEnter: function(){
            if(!av['login']){
                avalon.define({
                    $id: "login",
                    username: "",
                    password: "",
                    login: function(e){ //点击登陆
                        e.preventDefault();
                        av['main']['state'] = 'loading';
                        userCenter.clear();
                        userCenter.login(this.username, this.password, function(err, user){
                            if(err) {
                                $.Dialog.fail("登陆失败! 请检查用户名和密码.", 1400);
                                return;
                            }
                            return setTimeout(avalon.router.navigate.bind(avalon.router, ''), 0);
                        });
                    }
                });
            }
            av['login']['password'] = "";
            avalon.scan();
            av['main']['state'] = 'ok';
        }
    });
});