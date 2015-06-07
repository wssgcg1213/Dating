/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/login', ['avalon', 'userCenter', 'vms/main', 'jquery', 'dialog', '../mmState'], function (avalon, userCenter, vmMain, $) {
    return avalon.define({
        $id: "login",
        username: "",
        password: "",
        login: function(e){ //点击登陆
            e.preventDefault();
            vmMain['state'] = 'loading';
            userCenter.clear();
            var _username = avalon.vmodels.login.username;
            var _password = avalon.vmodels.login.password;

            if(!_username){return $.Dialog.fail("请输入学号");}
            if(!_password){return $.Dialog.fail("请输入密码");}

            userCenter.login(_username, _password, function(err, user){
                if(err) {
                    $.Dialog.fail("登陆失败! 请检查用户名和密码");
                    return;
                }
                return setTimeout(avalon.router.navigate.bind(avalon.router, ''), 0);
            });
        }
    });
});