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
        state: "",
        menuState: false,//标识菜单的呼出状态

        go: function(where) {
            avalon.router.navigate(where);
        },
        back: function(){
            history.back();
        },
        toggleMenuState: function(e){
            avalon.vmodels.nav.menuState = !avalon.vmodels.nav.menuState;
        }
    });

    vm.$watch('state', function(newStr, oldStr){
        log(oldStr, newStr); //todo 状态
    });

    vm.$watch('menuState', function(newStr){
        if(newStr){
            $('.menu-overlay').addClass('active');
            $('.menu').addClass('active');

            //$('.wrapper').on('touchend', function(e){
            //    vm.menuState = false;
            //    $('.wrapper').off('touchend', arguments.callee);
            //});

        }else{
            $('.menu-overlay').removeClass('active');
            $('.menu').removeClass('active');
        }
    });

    return vm;
});