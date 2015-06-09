/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/userInfoEdit', ['avalon', 'jquery', 'request', 'userCenter', 'dialog'], function (avalon, $, request, userCenter) {
    return avalon.define({
        $id: "userInfoEdit",
        data: {},
        academyHash: [],
        gradeHash: [],
        genderHash: {
            "1": "男",
            "2": "女"
        },

        active: function(e){
            $(e.target).parents('.row').addClass('active');
        },
        blur: function(e){
            $(e.target).parents('.row').removeClass('active');
        },

        finish: function(){
            var data = avalon.vmodels['userInfoEdit']['data'];
            if(!data.nickname){
                return $.Dialog.fail('请填写正确的昵称');
            }

            if(data.nickname.length > 15){
                return $.Dialog.fail('昵称请少于15个字符');
            }

            if(data.signature && data.signature.length > 50){
                return $.Dialog.fail("签名请少于50个字符");
            }

            if(data.telephone && !/^\d{7,11}/.test(data.telephone)){
                return $.Dialog.fail("请检查电话");
            }

            var  _academy = $$.academyHash.filter(function(o){if(o.name == data.academy) return o})[0],
                academyId = _academy ? _academy.id : 0,
                   _grade = $$.gradeHash.filter(function(o){if(o.name == data.grade) return o})[0],
                  gradeId = _grade ? _grade.id : 0,
                     user = userCenter.info();

            request('editdata', {
                uid: user.uid,
                token: user.token,
                nickname: data.nickname,
                signature: data.signature,
                academy: academyId,
                grade: gradeId,
                gender: data.gender == '男' ? 1 : (data.gender == '女' ? 2 : 0), //1男, 2女, 0未修改
                telephone: data.telephone,
                qq: data.qq,
                weixin: data.weixin
            }).done(function(res){
                $.Dialog.success("修改成功", 2000);
                setTimeout(function(){avalon.router.navigate('userInfo')}, 2000);
            });
        }
    });
});