/**
 * Created by liuhzz on 2015/5/6.
 */


define(['jQuery','hammer'],function($,Hammer){
    $ = jQuery;
    function bindTouchEvent() {
        var hammer = new Hammer($(".tab-wrapper"));
        //var direction = null;
        //hammer.on('panLeft',function(e) {
        //    //alert('left');
        //    direction = 'left';
        //    console.log(e);
        //});
        //hammer.on('panRight',function() {
        //    direction = 'right';
        //    alert(direction);
        //});
        //hammer.on('panEnd',function() {
        //    alert(direction);
        //});
        //console.log($("#tab-container"));
    }
    bindTouchEvent();

    function slide() {
        var wid = $(window).width();

    }


})