/**
 * Created by Liuchenling on 5/24/15.
 */
//功能:
//登陆
//检测是否登录
//获取个人信息

define(['jQuery'], function($$$){
    var isLogin = false; //closure
    var uid, name, token;
    var logUrl = "../mock.php?type=login";

    /**
     * 登陆 回调写法
     * @param username 用户名
     * @param password 密码
     */
    function login(username, password, cb){
        if(isLogin) return cb && cb(null, info());
        $.post(logUrl, {username: username, password: password}).success(function(res){
            if(res.status == 200){
                isLogin = true;
                uid = res.uid;
                token = res.token;
                name = res.name;
                cb && cb(null, info());
            }else{
                cb && cb(true);
            }
        });
    }

    /**
     * 登出
     * @returns {{status: number, info: string}}
     */
    function logout(){
        if(!isLogin)return info();
        isLogin = false;
        uid = name = token = undefined;
        return info();
    }

    /**
     * 获取信息
     * @returns {*}
     */
    function info(){
        if(!isLogin){return {state: false}}
        return {
            state: true,
            name: name,
            uid: uid,
            token: token
        }
    }
    return {
        login: login,
        logout: logout,
        info: info
    };
});