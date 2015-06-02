/**
 * Created by Liuchenling on 5/30/15.
 * 发布约的界面
 */
define("vms/publishDating", ['urls', 'userCenter', 'eventproxy', 'moment', 'mmState', 'dialog', 'avaFilters', 'vms/main'], function(urls, userCenter, EP, moment){
    avalon.state('publishDating', {
        url: "/publishDating",
        templateUrl: "tpl/publishDatingCtrl.html",
        onEnter: function() {
            avalon.vmodels['main']['state'] = 'loading';

            //检测登陆
            var user = userCenter.info();
            if(!user.state){
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            var lunar = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

            var typeHash, academyHash;//category Hash, academyHash

            avalon.vmodels['nav']['title'] = "发布约会";

            if(!avalon.vmodels['publishDating']) {
                avalon.define({
                    $id: "publishDating",
                    /**
                     * 发布约会
                     */
                    publish: function () {
                        function _getGrade(str){
                            switch(str){
                                case '不限': return 0;
                                case '大一': return 1;
                                case '大二': return 2;
                                case '大三': return 3;
                                case '大四': return 4;
                            }
                            return 5;
                        }
                        avalon.vmodels['main']['state'] = 'loading';
                        var _vm = avalon.vmodels['publishDating'];
                        var info = {
                            date_type: _vm.selectedDateTypeId,
                            title: _vm.yTitle,
                            content: "???????!!!!!todo?图里没有content...??",//todo 图里没有content...
                            date_time: +moment(_vm.yTime.toString()) / 1000,
                            date_place: _vm.yLocation,
                            date_people: _vm.yPeople,
                            gender_limit: _vm.ySex == '不限' ? 0 : (_vm.ySex == '男' ? 1 : 2),  //0不限, 1男, 2女
                            grade_limit: _getGrade(_vm.yGrade), //年级限制
                            cost_model: _vm.ySpend == 'AA制' ? 0 : ( _vm.ySpend == '我请客' ? 1 : 2), //AA, 我请客, 求请客
                            uid: user.uid,
                            token: user.token
                        };
                        $.post(urls.publish, info).success(function (res) {
                            if(res && res.status == 200){
                                log('发布成功', res);
                                $.Dialog.success("发布成功!", 1500);
                                setTimeout(avalon.router.navigate.bind(avalon.router, 'detail/1'), 2000);//todo 等接口返回id 跳过去
                            }else{
                                log('发布失败', res);
                                $.Dialog.fail('发布失败, Pls Retry');
                            }
                        });
                    },

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

                var pVm = avalon.vmodels['publishDating'];
                pVm.$watch('yType', function (newStr, oldStr) {
                    var idObj = typeHash.filter(function(o){
                        return o.type == newStr;
                    })[0];
                    if(idObj){
                        pVm['selectedDateTypeId'] = idObj.id || 0;
                        log("选择的typeId:", idObj.id || 0);
                    }else{
                        pVm['selectedDateTypeId'] = 0;
                        log("选择的typeId: 没选!");
                    }
                });
                pVm.$watch('yTitle', function (newStr, oldStr) {
                    pVm['yTitle'] = newStr.trim();
                });
                pVm.$watch('yLocation', function (newStr, oldStr) {
                    pVm['yLocation'] = newStr.trim();
                });
                pVm.$watch('yPeople', function (newStr, oldStr) {
                    pVm['yPeople'] = parseInt(newStr) || 0;
                });
            }else{
                var v = avalon.vmodels['publishDating'];
                v.yType = v.yCollege = v.yGrade = v.ySex =
                    v.yLocation = v.yPeople = v.yTime = v.yTitle = '';
            }

            function _fail(res){
                log('Category Fetch Err', res);
                avalon.scan();
                if(res.status == 409){
                    return $.Dialog.fail(res.info);
                }
                $.Dialog.fail("服务器提了一个问题!");
            }

            var ep = EP.create('category', 'academy', function(cRes, aRes){
                if(cRes && cRes.status == 200 && cRes.data && Array.isArray(cRes.data)){
                    typeHash = avalon.vmodels['publishDating'].datetype = cRes.data;
                }else{
                    return _fail(cRes);
                }

                if(aRes && aRes.status == 200 && aRes.data && Array.isArray(aRes.data)){
                    academyHash = avalon.vmodels['publishDating'].academy = aRes.data;
                }else{
                    return _fail(aRes);
                }

                avalon.scan();
                avalon.vmodels['main']['state'] = 'ok';
            })
            if(!typeHash){
                $.post(urls.category).success(function(res){
                    ep.emit('category', res);
                }).fail(_fail);
            }else{
                ep.emit('category', {status: 200, data: typeHash});
            }

            if(!academyHash){
                $.post(urls.academy).success(function(res){
                    ep.emit('academy', res);
                }).fail(_fail);
            }else{
                ep.emit('academy', {status: 200, data: academyHash});
            }

        }
    });
});