/**
 * Created by liuhzz on 2015/5/30.
 */
/**
 * Created at 2015年06月06日.
 * @Author Ling.
 * @Email i@zeroling.com
 */

define("states/letters", ['urls', 'userCenter', 'request', 'vms/letters', 'vms/main', 'vms/nav', 'mmState', 'dialog', 'avaFilters'], function (urls, userCenter, request, vmLetters, vmMain, vmNav) {
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

            request('letters', {letter_id: id, uid: user.uid, token: user.token})
                .done(function (res) {
                    vmLetters.data = res.data;
                    avalon.scan();
                    vmMain.state = 'ok';
                });
        }
    });
})