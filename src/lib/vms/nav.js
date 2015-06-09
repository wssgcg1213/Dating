/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define("vms/nav", ['jquery', 'navState', 'noop', 'mmState'], function($, navState, noop){
    /**
     * 顶部navBar的VM
     */
    var vm = avalon.define({
        $id: "nav",
        title: "约",
        iconmenu: false,
        iconback: false,
        iconplus: false,
        rightMenu: "",
        rightMenuCallback: noop,

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

    vm.$watch('state', function(state){
        log('现在的状态是:', state);
        var config = navState[state];
        for(var conf in config){
            if(conf !== 'rightMenuCallback')vm[conf] = config[conf];
        }
        var confRightMenuCallback = navState[state]['rightMenuCallback'];
        if(avalon.isFunction(confRightMenuCallback)){
            vm.rightMenuCallback = confRightMenuCallback;
        }else if(typeof confRightMenuCallback === 'string'){
            vm.rightMenuCallback = avalon.vmodels[state][confRightMenuCallback];
        }
    });

    vm.$watch('menuState', function(newStr){
        if(newStr){//打开
            $('.menu-overlay').addClass('active');
            $('.menu').addClass('active');
            $('.wrapper').on('touchend', function _handler(e){
                var target = e.target,
                    $menu = $('.menu-overlay');
                if(e.target == $menu.get(0) || $menu.find(target).length || e.target == $('.menu').get(0)){
                    //在里面 do nothing
                    //log(e);
                }else{
                    avalon.vmodels.nav.menuState = false;
                    $('.wrapper').off('touchend', _handler);
                }
            });
        }else{//关闭
            $('.menu-overlay').removeClass('active');
            $('.menu').removeClass('active');
        }
    });

    return vm;
});