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
    "slider": "../mock.php?type=pics",
    "showBox": "http://106.184.7.12:8002/index.php/api/date/datelist",
    "category": "http://106.184.7.12:8002/index.php/api/date/datetype",
    "detail": "http://106.184.7.12:8002/index.php/api/date/detaildate",
    "userInfo": "http://106.184.7.12:8002/index.php/api/person/userinfo"
};

require(['userCenter', 'eventproxy', 'swiper', 'DateTimePicker', 'domReady!', 'mmState'], function(userCenter, EventProxy) {
    var ep; //用来装载EventProxy的实例对象

    /**
     * 创建时间的fliter
     * @param ts
     * @returns {string}
     */
    avalon.filters.createdTime = function(ts){
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

    /**
     * 花费模式过滤器
     * @param model
     * @returns {string}
     */
    avalon.filters.costModel = function(model) {
        var model = parseInt(model);
        switch(model){
            case 1: return "AA制";
            case 2: return "我请客";
            case 3: return "求请客";
        }
        return "未知";
    }

    /**
     * 性别限制过滤器
     * @param g
     * @returns {string}
     */
    avalon.filters.genderLimit = function(g){
        var g = parseInt(g);
        switch(g){
            case 0: return "不限";
            case 1: return "仅限男";
            case 2: return "仅限女";
        }
        return "未知";
    }


    avalon.filters.peopleLimit = function(n){
        n = parseInt(n);
        return !n ? "无限制" : "少于" + n + '人';
    }

    avalon.filters.gradeFilter = function(n){
        n = parseInt(n);
        switch(n){
            case 1: return "大一";
            case 2: return "大二";
            case 3: return "大三";
            case 4: return "大四";
        }
        return "未知";
    }

    /**
     * 约会记录状态
     * @param n
     * @returns {string}
     */
    avalon.filters.statusFilter = function(n){
        n = parseInt(n);
        switch(n){
            case 0: return "已结束";
            case 1: return "成功";
            case 2: return "受理中";
        }
        return "未知";
    }

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
            var user = userCenter.info();
            if(!user.state){
                setTimeout(function(){avalon.router.navigate('login')}, 0);
                return;
            }
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
                    dateList: [{}],
                    goDetail: function(did){
                        avalon.router.navigate('detail/'+did);
                    }
                });
            }
            var user = userCenter.info();
            $.post(urls.showBox, {
                uid: user.uid,
                token: user.token,
                date_type: 0,
                page: 0,
                size: 10,
                order: 1
            }).success(function(res){
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
            if(!avalon.vmodels['login']){
                avalon.define({
                    $id: "login",
                    username: "",
                    password: "",
                    btn: function(e){ //点击登陆
                        e.preventDefault();
                        userCenter.login(this.username, this.password, function(err, user){
                            if(err) {
                                alert("登陆失败! 请检查用户名和密码.");
                                return;
                            } //todo 修改成软提示
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

    avalon.state('userInfo', {
        url: '/userInfo',
        templateUrl: "tpl/userInfoCtrl.html",
        onEnter: function(){
            avalon.vmodels['nav']['title'] = "个人中心";
            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }
            if(!avalon.vmodels['userInfo'])avalon.define({$id : "userInfo", data: {},
                goDetail: function(id){avalon.router.navigate('detail/' + id);}
            });
            $.post(urls.userInfo, {uid: user.uid, get_uid: user.uid, token: user.token}).success(function(res){
                if(res.status == 200){
                    avalon.vmodels['userInfo'].data = res.data;
                }else{
                    console.log("Err", res);
                }
            });

            avalon.scan();
        }
    });

    avalon.state('detail', {
        url: '/detail/:id',
        templateUrl: "tpl/detailCtrl.html",
        onEnter: function() {
            var id = this.params.id,
                user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }
            if(!avalon.vmodels['detail']){
                avalon.define({
                    $id: "detail",
                    users: [],
                    data: {}
                });
            }

            var timer = setTimeout(function(){
                alert("network slow");
                location.reload();
            }, 2000);

            $.post(urls.detail, {date_id: id, uid: user.uid, token: user.token}).success(function(res){
                avalon.vmodels['detail'].data = res.data;
                clearTimeout(timer);
                avalon.scan();
            });
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