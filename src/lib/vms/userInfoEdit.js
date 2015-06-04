/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/userInfoEdit', ['avalon', 'jquery'], function (avalon, $) {
    return avalon.define({
        $id: "userInfoEdit",
        data: {},
        academyHash: [],
        gradeHash: [],
        active: function(e){
            $(e.target).parents('.row').addClass('active');
        },
        blur: function(e){
            $(e.target).parents('.row').removeClass('active');
        }
    });
});