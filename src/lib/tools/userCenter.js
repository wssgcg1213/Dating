/**
 * Created by Liuchenling on 5/24/15.
 */
//功能:
//登陆
//检测是否登录
//获取个人信息

define('userCenter', ['urls', 'jquery'], function(urls, $){
    /*!
     * jQuery Cookie Plugin v1.4.1
     * https://github.com/carhartl/jquery-cookie
     *
     * Copyright 2006, 2014 Klaus Hartl
     * Released under the MIT license
     * 这是一个JQ的cookie插件 preload by ling
     */
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD (Register as an anonymous module)
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            // Node/CommonJS
            module.exports = factory(require('jquery'));
        } else {
            // Browser globals
            factory(jQuery);
        }
    }(function ($) {

        var pluses = /\+/g;

        function encode(s) {
            return config.raw ? s : encodeURIComponent(s);
        }

        function decode(s) {
            return config.raw ? s : decodeURIComponent(s);
        }

        function stringifyCookieValue(value) {
            return encode(config.json ? JSON.stringify(value) : String(value));
        }

        function parseCookieValue(s) {
            if (s.indexOf('"') === 0) {
                // This is a quoted cookie as according to RFC2068, unescape...
                s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }

            try {
                // Replace server-side written pluses with spaces.
                // If we can't decode the cookie, ignore it, it's unusable.
                // If we can't parse the cookie, ignore it, it's unusable.
                s = decodeURIComponent(s.replace(pluses, ' '));
                return config.json ? JSON.parse(s) : s;
            } catch(e) {}
        }

        function read(s, converter) {
            var value = config.raw ? s : parseCookieValue(s);
            return $.isFunction(converter) ? converter(value) : value;
        }

        var config = $.cookie = function (key, value, options) {

            // Write

            if (arguments.length > 1 && !$.isFunction(value)) {
                options = $.extend({}, config.defaults, options);

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
                }

                return (document.cookie = [
                    encode(key), '=', stringifyCookieValue(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path    ? '; path=' + options.path : '',
                    options.domain  ? '; domain=' + options.domain : '',
                    options.secure  ? '; secure' : ''
                ].join(''));
            }

            // Read

            var result = key ? undefined : {},
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling $.cookie().
                cookies = document.cookie ? document.cookie.split('; ') : [],
                i = 0,
                l = cookies.length;

            for (; i < l; i++) {
                var parts = cookies[i].split('='),
                    name = decode(parts.shift()),
                    cookie = parts.join('=');

                if (key === name) {
                    // If second argument (value) is a function it's a converter...
                    result = read(cookie, value);
                    break;
                }

                // Prevent storing a cookie that we couldn't decode.
                if (!key && (cookie = read(cookie)) !== undefined) {
                    result[name] = cookie;
                }
            }

            return result;
        };

        config.defaults = {};

        $.removeCookie = function (key, options) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return !$.cookie(key);
        };

    }));//end jQ.cookie

    /**
     * userCenter
     */
    var isLogin = false; //closure
    var uid, name, token;
    var logUrl = urls.login;

    /**
     * 登陆 回调写法
     * @param username 用户名
     * @param password 密码
     */
    function login(username, password, cb){
        if(isLogin) return cb && cb(null, info());
        debugger;
        $.post(logUrl, {username: username, password: password}).success(function(res){
            if(res.status == 200){
                isLogin = true;
                uid = res.uid;
                token = res.token;
                name = res.name;

                _storage.set({
                    uid: uid,
                    token: token,
                    name: name
                });
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

    /**
     * 本地存储模块
     * @type {boolean}
     */
    var supportLocalStorage = !!window.localStorage;
    var _storage = {
        get: function(){
            var _local;
            if(supportLocalStorage){
                var exp = localStorage.getItem('datingExpires');
                if(exp && exp > +new Date){
                    _local = localStorage.getItem('dating');
                }else{
                    _local = "";
                }
            }else{
                _local = $.cookie('dating');
            }

            var userObj;
            try{
                userObj = JSON.parse(_local);
            }catch(e){
                return false;
            }

            return userObj;
        },
        set: function(obj, expires){
            var str = JSON.stringify(obj);
            expires = expires || 7; //默认存七天
            if(supportLocalStorage){
                localStorage.setItem("dating", str);
                localStorage.setItem("datingExpires", +new Date + expires * 24 * 3600 * 1000);
            }else{
                $.cookie('dating', str, {expires: expires});
            }
        }
    };

    /**
     * 如果登陆过 就认为已经登录
     */
    (function(sto){
        var user = sto.get();
        if(user){
            uid = user.uid;
            name = user.name;
            token = user.token;
            isLogin = true;
        }
    })(_storage);

    return {
        login: login,
        logout: logout,
        info: info,
        clear: logout
    };
});