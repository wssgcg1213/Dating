/**
 * Created at 6/6/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/litterLetter', ['avalon'], function (avalon) {
    return avalon.define({
        $id: "litterLetter",
        list: [],
        goLetters: function(id){
            id = parseInt(id);
            log("去看私信:", id);
            avalon.router.navigate('letters/' + id);
        }
    });
});