/**
 * Created by Liuchenling on 5/24/15.
 */
//功能:
//登陆
//检测是否登录
//获取个人信息

define(['jQuery'], function($$$){
    var isLogin = false;
    console.log($);
    function login(username, password){

    }
    function info(){
        if(!isLogin){
            return {state: false}
        }
        return {
            state: true,
            username: ""
            //balabala
        }
    }
    return {
        login: login,
        info: info
    };
});