/**
 * Created by Liuchenling on 6/1/15.
 * 主VM
 * Nav vm
 */
define(['jquery', 'dialog', 'swiper', 'avalon', 'mmState', 'mmHistory', 'mmState'], function($){
    var av = avalon.vmodels;
    avalon.define({
        $id: "main",
        state: "",
        sliderCb: function(){
            /**
             * 这个函数是slider的template载入之后的回调, 生成首页banner-slider
             *
             * 这里这样处理是因为
             * 如果从别的页面进入主页
             * 虽然slider的模板已经载入了, 但是数据还在ajax传输中
             * 所以要等slider的VM里面有了数据才能生成slider
             * @author Ling.
             */
            (function(){
                if(avalon.vmodels['showBox'] && avalon.vmodels['showBox']['dateList'].length > 0){
                    avalon.vmodels['main']['state'] = 'ok';
                    return new Swiper('.swiper-container',{
                        pagination: '.pagination',
                        loop: true,
                        grabCursor: true,
                        paginationClickable: true
                    });
                }
                setTimeout(arguments.callee, 50); //扫描 50ms
            })();
        },
        userInfoSlider: function(){ //初始化userInfo模板里面的左右Slider
            var tabsSwiper = new Swiper('#tab-container',{
                speed:500,
                onSlideChangeStart: function(){
                    $(".tab .selected").removeClass('selected');
                    $(".tab li").eq(tabsSwiper.activeIndex).addClass('selected');
                }
            });
            $(".tab li").on('touchstart mousedown',function(e){
                e.preventDefault()
                $(".tab .selected").removeClass('selected');
                $(this).addClass('selected');
                tabsSwiper.swipeTo( $(this).index() );
            });
            $(".tab li").click(function(e){
                e.preventDefault();
            });
        }
    });

    /**
     * 页面全局菊花 + overlay控制
     */
    av['main'].$watch('state', function(s){
        s == 'loading' ? $.Dialog.loading() : $.Dialog.close();
    });
    av['main']['state'] = 'loading';

    /**
     * 顶部navBar的VM
     */
    avalon.define({
        $id: "nav",
        title: "约",
        gotoCenter: function() {
            avalon.router.navigate('userInfo');
        }
    });
});