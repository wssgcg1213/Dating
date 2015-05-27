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
    "slider": "http://106.184.7.12:8002/index.php/api/public/banner",
    "showBox": "http://106.184.7.12:8002/index.php/api/date/datelist",
    "category": "http://106.184.7.12:8002/index.php/api/date/datetype"
};

require(['eventproxy', 'swiper', 'DateTimePicker', 'domReady!', 'mmState'], function(EventProxy) {
    //debugger;
    var ep; //用来装载EventProxy的实例对象
    avalon.filters.createdTime = function(ts){ //创建时间的fliter
        var _now = parseInt(new Date / 1000),
            interval = _now - ts;
        if(interval < 60){
            return '刚刚';
        }else if(interval < 60 * 60){
            return parseInt(interval / 60) + "分钟前";
        }else if(interval < 24 * 60 * 60){
            return parseInt(interval / (60 * 60)) + "小时前";
        }else if(interval < 48 * 60 * 60){
            return "昨天";
        }
        return parseInt(interval / (24 * 60 * 60)) + "天前";
    };

    function initSlider(){
        var _slider = new Swiper('.swiper-container',{
            pagination: '.pagination',
            loop: true,
            grabCursor: true,
            paginationClickable: true
        });
    }

    avalon.define({
        $id: "main", //主vm
        sliderCb: function() { //初始化slider
            if(avalon.vmodels['slider'] && avalon.vmodels['slider']['items'].length > 1){
                initSlider();
            }else{
                ep.once('slider', function(){
                    initSlider();
                });
            }
        },
        userInfoSlider: function(){ //初始化userInfo模板里面的左右Slider
            var tabsSwiper = new Swiper('#tab-container',{
                speed:500,
                onSlideChangeStart: function(){
                    $(".tab .selected").removeClass('selected');
                    $(".tab li").eq(tabsSwiper.activeIndex).addClass('selected');
                }
            });
            $(".tab li").on('touchstart mousedown',function(e){
                e.preventDefault()
                $(".tab .selected").removeClass('selected');
                $(this).addClass('selected');
                tabsSwiper.swipeTo( $(this).index() );
            });
            $(".tab li").click(function(e){
                e.preventDefault();
            });
        }
    });

    avalon.define({
        $id: "nav",
        title: "约",
        gotoCenter: function() {
            avalon.router.navigate('userInfo');
        }
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

                $.post(urls.slider).success(function(res) {
                    var sliderData = res.data.map(function(val){
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

            if(!avalon.vmodels['showBox']){
                avalon.define({
                    $id: "showBox",
                    dateList: [{}]
                });
            }
            $.post(urls.showBox).success(function(res){
                if(res.status == 200){
                    avalon.vmodels['showBox'].dateList = res.data;
                }else{
                    console.log(res, "err");
                }
            });

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

    avalon.state('userInfoPublic', {
        url: "/userInfoPublic",
        templateUrl: "tpl/userInfoPublicCtrl.html",
        onEnter: function(state) {
            avalon.vmodels['nav']['title'] = "收藏";
            avalon.scan();
        }
    });


    avalon.state('login',{
        url:"/login",
        templateUrl : "tpl/loginCtrl.html",
        onEnter: function(){
            avalon.scan();
        }
    });

    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            avalon.vmodels['nav']['title'] = "个人中心";
            avalon.define({
                $id : "userInfo"

                //data :{
                //    userLogo : 'imgs/1.jpg',
                //    userName : '村里没有巧克力',
                //    motto : '日日code',
                //    college : '传媒学院',
                //
                //},

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

    avalon.state('history',{
        url:'/history',
        templateUrl:"tpl/historyCtrl.html",
        onEnter: function() {
            //todo
            avalon.vmodels['nav']['title'] = "约会记录";
            avalon.scan();
        }
    })

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
                    yType: "",
                    yTypeStatus: false,
                    yTypeValid: false,//标明数据有效状态
                    yTypeBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            v = _vm['yType'];
                        _vm['yTypeStatus'] = false;
                        _vm['yType'] = v;
                        _vm['yTypeValid'] = true;
                    },

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

                    yLocation: "",
                    yLocationStatus: false,//标明激活状态
                    yLocationValid: false,//标明数据有效状态
                    yLocationBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],d
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
                    ySexStatus: false,//标明激活状态
                    ySexValid: false,//标明数据有效状态
                    ySexBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            v = _vm['ySex'];
                        _vm['ySexStatus'] = false;
                        _vm['ySex'] = v;
                        _vm['ySexValid'] = true;

                    },

                    yGrade: "",
                    yGradeStatus: false,//标明激活状态
                    yGradeValid: false,//标明数据有效状态
                    yGradeBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            v = _vm['yGrade'];
                        _vm['yGradeStatus'] = false;
                        _vm['yGrade'] = v;
                        _vm['yGradeValid'] = true;
                    },

                    yCollege: "",
                    yCollegeStatus: false,//标明激活状态
                    yCollegeValid: false,//标明数据有效状态
                    yCollegeBlur: function(ev) {
                        ev.stopPropagation();
                        var _vm = avalon.vmodels['publishDating'],
                            v = _vm['yCollege'];
                        _vm['yCollegeStatus'] = false;
                        _vm['yCollege'] = v;
                        _vm['yCollegeValid'] = true;
                    },

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

                            case 'yLocation':case 'yPeople':case 'ySpend':
                            case 'ySex': case 'yGrade':case 'yCollege':case 'yType':
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