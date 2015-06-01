/**
 * Created by Liuchenling on 5/30/15.
 * 发布约的界面
 */
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'DateTimePicker', 'avaFilters'], function(urls, userCenter, EventProxy){
    avalon.state('publishDating', {
        url: "/publishDating",
        templateUrl: "tpl/publishDatingCtrl.html",
        onEnter: function() {
            avalon.vmodels['main']['state'] = 'loading';

            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            var lunar = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                datePickerFlag = false;

            avalon.vmodels['nav']['title'] = "发布约会";

            if(!avalon.vmodels['publishDating'])
                avalon.define({
                    $id: "publishDating",

                    /**
                     * 发布约会
                     */
                    publish: function(){
                        avalon.vmodels['main']['state'] = 'loading';
                        $.ajax(urls.publish, {}).success(function(res){
                           //todo 发布约
                            $.Dialog.success("发布成功!", 1500);
                            setTimeout(avalon.router.navigate.bind(avalon.router, 'detail/1'), 1500);
                        });
                    },

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
            avalon.vmodels['main']['state'] = 'ok';
        }
    });
});