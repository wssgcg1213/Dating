/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/publishDating', ['avalon', 'jquery', 'moment', 'eventproxy', 'urls', 'vms/main', 'userCenter', 'mmState', 'dialog', 'DateTimePicker'], function (avalon, $, moment, EP, urls, vmMain, userCenter) {
    var lunar = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

    var user = userCenter.info();

    var vm = avalon.define({
        $id: "publishDating",
        /**
         * 发布约会
         */
        publish: function () {
            vmMain['state'] = 'loading';
            var _vm = avalon.vmodels['publishDating'];

            function _getGrade(str) {
                for (var i = 0, len = $$.gradeHash.length; i < len; i++) {
                    if ($$.gradeHash[i].name == str) return $$.gradeHash[i].id;
                }
                return 0;
            }

            var info = {
                date_type: _vm.selectedDateTypeId,
                title: _vm.yTitle.trim(),
                content: avalon.vmodels.publishDating.yContent,
                date_time: +moment(_vm.yTime.toString()) / 1000,
                date_place: _vm.yLocation.trim(),
                date_people: _vm.yPeople,
                gender_limit: _vm.ySex == '不限' ? 0 : (_vm.ySex == '男' ? 1 : 2),  //0不限, 1男, 2女
                grade_limit: _getGrade(_vm.yGrade), //年级限制
                grade_select_model: 1, //正选
                cost_model: _vm.ySpend == 'AA制' ? 1 : ( _vm.ySpend == '我请客' ? 2 : 3), //AA, 我请客, 求请客
                uid: user.uid,
                token: user.token
            };

            /**
             * 前端表单check
             */
            if (info.date_type === '') {
                return $.Dialog.fail("请选择类型");
            }

            if (info.title === '') {
                return $.Dialog.fail("请输入标题");
            } else if (info.title.length > 10) {
                return $.Dialog.fail("标题请少于10个字符");
            }

            if (info.content.length > 150) {
                return $.Dialog.fail("内容请少于150个字符");
            }

            if (!info.date_time) {//invalid equal to NaN
                return $.Dialog.fail("请选择时间");
            }

            if (!info.date_place) {
                return $.Dialog.fail("请输入地址");
            }

            if (!info.date_place) {
                return $.Dialog.fail("请输入地址");
            }

            $.post(urls.publish, info).success(function (res) {
                if (res && res.status == 200) {
                    log('发布成功', res);
                    $.Dialog.success("发布成功!", 1500);
                    setTimeout(avalon.router.navigate.bind(avalon.router, 'detail/' + res.date_id), 2200);
                } else if (res.status == 409) {
                    log('发布失败', res);
                    $.Dialog.fail(res.info, 2000);
                    if(res.info == '请先完善个人信息'){
                        return setTimeout(avalon.router.navigate.bind(avalon.router, 'userInfoEdit'), 2000);
                    }
                } else {
                    log('发布失败', res);
                    $.Dialog.fail('发布失败请重试');
                }
            });
        },


        gradeHash: [],

        //类型
        datetype: [],
        selectedDateTypeId: '',
        yType: "",
        yTypeStatus: false,
        yTypeValid: false,//标明数据有效状态
        yTypeBlur: function (ev) {
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
        yTitleBlur: function (ev) {
            ev.stopPropagation();
            var _vm = avalon.vmodels['publishDating'],
                str = check();
            _vm['yTitleStatus'] = false;

            if (str) {
                _vm['yTitle'] = str;
                _vm['yTitleValid'] = true;
            }

            function check() {
                var $input = $("#yTitle"),
                    _str = $input.val().trim();
                return (_str && _str.length) > 0 ? _str : false;
            }
        },

        yContent: "",

        yTime: "",
        yTimeStatus: false,
        yTimeValid: false,//标明数据有效状态
        yTimeBlur: function (ev) {
            var _vm = avalon.vmodels['publishDating'];
            _vm['yTimeStatus'] = false;
            var str;
            if (str = check()) {
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
        yLocationBlur: function (ev) {
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
        yPeopleBlur: function (ev) {
            ev.stopPropagation();
            var _vm = avalon.vmodels['publishDating'],
                str = check();
            _vm['yPeopleStatus'] = false;

            if (str) {
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
        ySpendBlur: function (ev) {
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
        ySexBlur: function (ev) {
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
        yGradeBlur: function (ev) {
            ev.stopPropagation();
            var _vm = avalon.vmodels['publishDating'],
                v = _vm['yGrade'];
            _vm['yGradeStatus'] = false;
            _vm['yGrade'] = v;
            _vm['yGradeValid'] = true;
        },

        academy: [], //hash
        yCollege: "",
        yCollegeStatus: false,//标明激活状态
        yCollegeValid: false,//标明数据有效状态
        yCollegeBlur: function (ev) {
            ev.stopPropagation();
            var _vm = avalon.vmodels['publishDating'],
                v = _vm['yCollege'];
            _vm['yCollegeStatus'] = false;
            _vm['yCollege'] = v;
            _vm['yCollegeValid'] = true;
        },

        active: function (type, $ev) {

            var _vm = avalon.vmodels['publishDating'];
            switch (type) {
                case 'yTitle':
                    _vm[type + 'Status'] = true;
                    $('#' + type).focus();
                    break;

                case 'yTime':
                    $('.widget').DateTimePicker({
                        titleContentDateTime: "请选择准备约会的时间",
                        setButtonContent: "就你了",
                        clearButtonContent: "算了吧",
                        dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
                        shortDayNames: weeks,
                        fullDayNames: weeks,
                        shortMonthNames: lunar,
                        fullMonthNames: lunar
                    });
                    _vm[type + 'Status'] = true;
                    $('#yTime').focus();
                    $ev.stopPropagation();
                    break;

                case 'yLocation':
                case 'yPeople':
                case 'ySpend':
                case 'ySex':
                case 'yGrade':
                case 'yCollege':
                case 'yType':
                    _vm[type + 'Status'] = true;
                    $('#' + type).focus();
                    break;


            }
        }
    });

    vm.$watch('yType', function (newStr, oldStr) {
        var idObj = $$.typeHash.filter(function (o) {
            return o.type == newStr;
        })[0];
        if (idObj) {
            vm['selectedDateTypeId'] = idObj.id || 0;
            log("选择的typeId:", idObj.id || 0);
        } else {
            vm['selectedDateTypeId'] = 0;
            log("选择的typeId: 没选!");
        }
    });
    vm.$watch('yTitle', function (newStr, oldStr) {
        vm['yTitle'] = newStr.trim();
    });
    vm.$watch('yLocation', function (newStr, oldStr) {
        vm['yLocation'] = newStr.trim();
    });
    vm.$watch('yPeople', function (newStr, oldStr) {
        vm['yPeople'] = parseInt(newStr) || 0;
    });


    return vm;
});