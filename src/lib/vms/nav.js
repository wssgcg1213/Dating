/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define("vms/nav", ['jquery', 'mmState'], function($){

    /**
     * 顶部navBar的VM
     */
    var vm = avalon.define({
        $id: "nav",
        title: "约",
        state: "home",
        go: function(where) {
            avalon.router.navigate(where);
        },
        toggleMenu: function(){
            var $w = $('.wrapper'),
                $m = $('.menu-overlay');
            if(parseInt($w.css('left'))){
                $w.css({left: "0"})
                $m.css({left: "-4rem"})
            }else{
                $w.css({left: "4rem"})
                $m.css({left: "0"})
            }

        }
    });

    vm.$watch('state', function(oldStr, newStr){
        log(oldStr, newStr); //todo 状态
    });

    return vm;
});