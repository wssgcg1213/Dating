/**
 * Created by liuhzz on 2015/5/30.
 */
/**
 * Created at 2015年06月06日.
 * @Author Ling.
 * @Email i@zeroling.com
 */

define("states/letters", ['urls', 'userCenter', 'vms/letters', 'vms/main', 'vms/nav', 'mmState', 'dialog', 'avaFilters'], function (urls, userCenter, vmLetters, vmMain, vmNav) {
    avalon.state('letters', {
        url: '/letters/:id',
        templateUrl: "tpl/lettersCtrl.html",
        onEnter: function () {
            vmMain.state = 'loading';
            vmNav.state = "letters";

            var id = parseInt(this.params.id);
            var user = userCenter.info();
            if (!user.state) {
                setTimeout(avalon.router.navigate.bind(avalon.router, "login"), 0);
                return;
            }

            $.post(urls.letters, {
                letter_id: id,
                uid: user.uid,
                token: user.token
            }).success(function (res) {
                if (res.status == 200) {
                    vmLetters.data = res.data;
                    avalon.scan();
                    vmMain.state = 'ok';
                } else {
                    log("err", res);
                    return $.Dialog.fail("服务器提了一个问题");
                }
            }).fail(function(res){
                log("err", res);
                return $.Dialog.fail("服务器提了一个问题");
            });


        }
    });
})