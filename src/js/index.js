/**
 * Created by Liuchenling on 4/18/15.
 */
require.config({
    baseUrl: "lib",
    paths: {
        avalon: "avalon.shim",
        jQuery: "jquery-2.1.3"
    },
    shims: {
        jQuery: {
            exports: "$"
        }
    }
});

var urls = {
    "slider": "../mock.php",
    "scrollBox": "http://106.184.7.12:8002/index.php/home/index/showBox",
    "category": "http://106.184.7.12:8002/index.php/home/index/category"
};
require(['eventproxy', 'slider', 'DateTimePicker', 'domReady!', 'mmState'], function(EventProxy) {
    //debugger;
    var ep; //用来装载EventProxy的实例对象
    avalon.define({
        $id: "main", //主vm
        sliderCb: function() { //初始化slider
            var width = $(window).width(),
                height = width * 0.46;
            $('.slider').slider({
                width: width,
                height: height,
                during: 3000
            });
        }
    });

    avalon.define({
        $id: "nav",
        title: "约",
        gotoCenter: function() {
            avalon.router.navigate('center');
        },
        menus: [{
            link: "#!/",
            text: "首页"
        },{
            link: "#!/login",
            text: "登陆todo"
        },{
            link: "#!/collect",
            text: "收藏"
        },{
            link: "#/detail",
            text: "约会详情"
        },{
            link:"#/userInfo",
            text:"个人中心"
        },{
            link:"#/letter",
            text:"私信"
        }]
    });

    avalon.state('home', {
        controller: "main",
        url: "/",
        templateUrl: "tpl/indexCtrl.html",
        onEnter: function(){
            setTimeout(avalon.scan, 1000); //timeout
            //异步处理, getdata
            ep = EventProxy.create('user', 'slider', 'fliter', function(user, slider, fliter) {
                avalon.scan();
            });

            //define vms
            avalon.vmodels['nav']['title'] = '约';

            if(!avalon.vmodels['slider']){
                avalon.define({
                    $id: "slider",
                    items: [{}]
                });

                $.post(urls.slider, {}).success(function(res) {
                    console.log('slider', res);
                    var sliderData = res.map(function(val){
                        return {
                            href: val.url,
                            img: val.src
                        };
                    });
                    avalon.vmodels['slider']['items'] = sliderData;
                    ep.emit('slider', sliderData);
                });
                $.post(urls.category).success(function(res) {
                    ep.emit('fliter', res);
                });

                ep.emit('user');//todo user data
            }

            if(!avalon.vmodels['fliterBtns']){
                avalon.define({
                    $id: "fliterBtns"
                });
            }

        }
    });

    avalon.state('collect', {
        url: "/collect",
        templateUrl: "tpl/collectCtrl.html",
        onEnter: function(state) {
            avalon.vmodels['nav']['title'] = "收藏";
            avalon.scan();
        }
    });

    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            //avalon.vmodels['nav']['title'] = "个人中心";
            avalon.define({
                $id : "userInfo",
                //data :{
                //    userLogo : 'imgs/1.jpg',
                //    userName : '村里没有巧克力',
                //    motto : '日日code',
                //    college : '传媒学院',
                //
                //}
            });
            avalon.scan();
        }
    });

    avalon.state('detail', {
        url: '/detail',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            //avalon.vmodels['nav']['title'] = "详情";
            //todo
            if(!avalon.vmodels['userInfo']){
                avalon.define({
                    $id: "userInfo",
                    users: [{}]
                });
            }
            avalon.scan();
        }
    });

    avalon.state('letters',{
        url:'/letters',
        templateUrl:"tpl/lettersCtrl.html",
        onEnter: function() {
            //todo
            avalon.vmodels['nav']['title'] = "私信";
            avalon.scan();
        }
    });
    //avalon.state('typeSelect', {
    //    url: "/typeSelect",
    //    templateUrl: "tpl/typeSelectCtrl.html",
    //    onEnter: function() {
    //        avalon.vmodels['nav']['title'] = "请选择";
    //    }
    //});

    avalon.state('center', {
        url: "/center",
        templateUrl: "tpl/centerCtrl.html",
        onEnter: function() {
            avalon.vmodels['nav']['title'] = "个人中心";

            avalon.scan();
        }
    });

    avalon.state('publishDating', {
        url: "/publishDating",
        templateUrl: "tpl/publishDatingCtrl.html",
        onEnter: function() {
            var lunar = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                datePickerFlag = false;

            avalon.vmodels['nav']['title'] = "发布约会";
            if(!avalon.vmodels['publishDating'])
                avalon.define({
                    $id: "publishDating",
                    yType: "约什么",
                    yTypeStatus: false,

                    yTitle: "",
                    yTitleStatus: false,//标明激活状态
                    yTitleValid: false,//标明数据有效状态
                    yTitleBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            str = check();
                        _vm['yTitleStatus'] = false;

                        if(str){
                            _vm['yTitle'] = str;
                            _vm['yTitleValid'] = true;
                        }

                        function check() {
                            var $input = $("#yTitle"),
                                _str = $input.val().trim();
                            return (_str && _str.length) > 0 ? _str : false;
                        }
                    },

                    yTime: "",
                    yTimeStatus: false,
                    yTimeValid: false,//标明数据有效状态
                    yTimeBlur: function(ev) {
                        var _vm = avalon.vmodels['publishDating'];
                        _vm['yTimeStatus'] = false;
                        var str;
                        if(str = check()){
                            _vm['yTime'] = str;
                            _vm['yTimeValid'] = true;
                        }

                        function check() {
                            var $input = $("#yTime"),
                                _str = $input.val().trim();
                            return (_str && _str.length) > 0 ? _str : false;
                        }
                    },
                    //chooseTime: function(ev){
                    //   ev.stopPropagation();
                    //
                    //},

                    yLocation: "",
                    yLocationStatus: false,//标明激活状态
                    yLocationValid: false,//标明数据有效状态
                    yLocationBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            str = _vm['yLocation'];

                        _vm['yLocationStatus'] = false;
                        _vm['yLocation'] = str;
                        _vm['yLocationValid'] = true;
                    },

                    yPeople: 0,
                    yPeopleStatus: false,//标明激活状态
                    yPeopleValid: false,//标明数据有效状态
                    yPeopleBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            str = check();
                        _vm['yPeopleStatus'] = false;

                        if(str){
                            _vm['yPeople'] = str;
                            _vm['yPeopleValid'] = true;
                        }

                        function check() {
                            var $input = $("#yPeople"),
                                _str = $input.val().trim();
                            return parseInt(_str) || 0;
                        }
                    },

                    ySpend: "",
                    ySpendStatus: false,//标明激活状态
                    ySpendValid: false,//标明数据有效状态
                    ySpendBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            v = _vm['ySpend'];

                        _vm['ySpendStatus'] = false;
                        _vm['ySpend'] = v;
                        _vm['ySpendValid'] = true;

                    },

                    ySex: "",
                    yGrade: "",
                    yCollege: "",

                    active: function(type, $ev){
                        var _vm = avalon.vmodels['publishDating'];
                        switch(type){
                            case 'yTitle':
                                _vm[type + 'Status'] = true;
                                $('#' + type).focus();
                                break;

                            case 'yTime':
                                if(!datePickerFlag){
                                    datePickerFlag = true;
                                    $('.widget').DateTimePicker({
                                        titleContentDateTime: "请选择准备约会的时间",
                                        setButtonContent: "就你了",
                                        clearButtonContent: "算了吧",
                                        dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
                                        shortDayNames: weeks,
                                        fullDayNames: weeks,
                                        shortMonthNames: lunar,
                                        fullMonthNames:	lunar
                                    });
                                }
                                _vm[type + 'Status'] = true;
                                $('#yTime').focus();
                                $ev.stopPropagation();
                                break;

                            case 'yLocation':
                                _vm[type + 'Status'] = true;
                                $('#' + type).focus();
                                break;

                            case 'yPeople':
                                _vm[type + 'Status'] = true;
                                $('#' + type).focus();
                                break;

                            case 'ySpend':
                                _vm[type + 'Status'] = true;
                                $('#' + type).focus();
                                break;
                        }
                    }

                });
            avalon.vmodels['publishDating'].$watch('yTitle', function(newStr, oldStr){
                avalon.vmodels['publishDating']['yTitle'] = newStr.trim();
            });
            avalon.vmodels['publishDating'].$watch('yLocation', function(newStr, oldStr){
                avalon.vmodels['publishDating']['yLocation'] = newStr.trim();
            });
            avalon.vmodels['publishDating'].$watch('yPeople', function(newStr, oldStr){
                avalon.vmodels['publishDating']['yPeople'] = parseInt(newStr) || 0;
            });
            avalon.scan();
        }
    });

    avalon.state("litterLetter",{
        url:"/litterLetter",
        templateUrl:"tpl/litterLetterCtrl.html",
        onEnter:function() {
            avalon.vmodels['nav']['title'] = "私信";
            avalon.scan();
        }
    })

    avalon.history.start({
        basepath: "/"
    });

    avalon.router.navigate(avalon.history.fragment);
});