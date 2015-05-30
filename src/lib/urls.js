/**
 * Created by Liuchenling on 5/30/15.
 */
define(function(){
    var urls = {
        "login": "../mock.php?type=login",
        "slider": "../mock.php?type=pics",
        "publish": "../mock.php?type=publish",
        "showBox": "http://106.184.7.12:8002/index.php/api/date/datelist",
        "category": "http://106.184.7.12:8002/index.php/api/date/datetype",
        "detail": "http://106.184.7.12:8002/index.php/api/date/detaildate",
        "userInfo": "http://106.184.7.12:8002/index.php/api/person/userinfo",
        "historyCreate": "http://106.184.7.12:8002/index.php/api/person/create",
        "historyJoin": "http://106.184.7.12:8002/index.php/api/person/join"
    };

    return urls;
})