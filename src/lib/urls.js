/**
 * Created by Liuchenling on 5/30/15.
 */
define('urls', function(){
    var urls = {
        "login": "../mock.php?type=login",
        "slider": "../mock.php?type=pics",
        "publish": "http://106.184.7.12:8002/index.php/api/date/createdate",
        "showBox": "http://106.184.7.12:8002/index.php/api/date/datelist",
        "category": "http://106.184.7.12:8002/index.php/api/date/datetype",
        "detail": "http://106.184.7.12:8002/index.php/api/date/detaildate",
        "userInfo": "http://106.184.7.12:8002/index.php/api/person/userinfo",
        "historyCreate": "http://106.184.7.12:8002/index.php/api/person/create",
        "historyJoin": "http://106.184.7.12:8002/index.php/api/person/join",
        "dateList": "http://106.184.7.12:8002/index.php/api/date/datelist",
        "detaildate": "http://106.184.7.12:8002/index.php/api/date/detaildate"
    };

    return urls;
})