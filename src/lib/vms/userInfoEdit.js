/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/userInfoEdit', ['avalon', 'jquery', 'urls', 'userCenter', 'dialog'], function (avalon, $, urls, userCenter) {
    var user = userCenter.info();
    var vm = avalon.define({
        $id: "userInfoEdit",
        data: {},
        academyHash: [],
        gradeHash: [],
        genderHash: {
            "男": "1",
            "女": "2"
        },

        active: function(e){
            $(e.target).parents('.row').addClass('active');
        },
        blur: function(e){
            $(e.target).parents('.row').removeClass('active');
        },

        finish: function(){
            var data = avalon.vmodels['userInfoEdit']['data'];
            function _fail(res){
                log('err', res);
                if(res.status == 409){
                    return $.Dialog.fail(res.info);
                }
                $.Dialog.fail("服务器出了问题");
            }

            $.post(urls.editdata, {
                uid: user.uid,
                token: user.token,

                nickname: data.nickname,
                signature: data.signature,
                gender: "1", //1男, 2女
                //telephone": "",
                //qq": "",
                //weixin": ""
            }).success(function(res){
                if(res && res.status == 200){
                    $.Dialog.success("修改成功", 2000);
                    setTimeout(function(){
                        avalon.router.navigate('userInfo');
                    }, 2000);
                }else{_fail(res);}
            }).fail(_fail);
        }
    });

    return vm;
});