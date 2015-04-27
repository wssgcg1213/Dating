/**
 * Created by Liuchenling on 4/18/15.
 */
define(['jQuery', 'hammer'], function($, Hammer){
    $ = jQuery;

    jQuery.fn.lingSlider = jQuery.fn.slider = function(settings){
        var defaultSettings = {
            width: 600,
            height: 480,
            during: 3000, //滑动间隔
            speed: 30 //滑动速度
        };

        settings = $.extend(true, {}, defaultSettings, settings);

        return this.each(function(){
            var _this = $(this), s = settings;
            var _ul = _this.find('ul');
            var _li = _this.find('li');
            var num = _li.length;

            _this.height(s.height);
            _ul.width(s.width * num).height(s.height); //ul宽高
            _li.width(s.width).height(s.height);
            var _span = "";
            for(var i = 0; i < num; i++){
                _span += "<span></span>";
            }
            $('.focus', _this).append(_span);
            var spans = $('span', _this);
            spans.first().addClass('current');

            var ratio = s.width / s.height;
            function initImg(){
                _ul.find('img').each(function(n, img){
                    img.onload = function() {
                        var _ratio = img.width / img.height;
                        if(_ratio > ratio){ //超宽
                            $(img).css({
                                height: "100%",
                                left: (img.width * s.height / img.height - s.width) / 2
                            });
                        }else{ //超高
                            $(img).css({
                                width: "100%",
                                top: - (img.height * s.width / img.width - s.height) / 2
                            });
                        }
                    };
                });
            }
            initImg();

            var pos = 0; //init pos
            function doScroll(_pos) {
                pos = _pos < 0 ? 0 : _pos; //min to 0
                pos = _pos >= num ? num - 1 : _pos; //max to num-1
                spans.removeClass('current');
                $(spans[pos]).addClass('current');
                _ul.css({
                    transform: 'translate3d(-' + pos * s.width + 'px, 0, 0)',
                    "-webkit-transform": 'translate3d(-' + pos * s.width + 'px, 0, 0)'
                });
            }

            var intervalTimer;
            function autoScroll() {
                intervalTimer = setInterval(function(){
                    if(pos >= num -1) pos = -1;
                    doScroll(++pos);
                }, s.during);
            }
            autoScroll(); //自动滚

            function bindTouchEvent(){
                var hammer = new Hammer(_ul.get(0));
                var direction = null;
                hammer.on('panstart', function(e){
                    clearInterval(intervalTimer);
                    //console.log('panstart', e);
                });
                hammer.on('panleft', function(e){
                    direction = 'left';
                });
                hammer.on('panright', function(e){
                    direction = 'right';
                });
                hammer.on('panend', function(e){
                    autoScroll();
                    var _pos = direction === 'right' ?
                        (pos > 0 ? pos - 1 : pos) :
                        (pos < num - 1 ? pos + 1 : pos);
                    if(_pos !== pos) doScroll(_pos);
                    direction = null;
                    //console.log('panend', e);
                });

            }
            bindTouchEvent();

            function resize() {
                var _w = $(window),
                    wid = _w.width();
                s.height = wid * s.height / s.width;
                s.width = wid;
                _this.height(s.height);
                _ul.width(s.width * num).height(s.height); //ul宽高
                _li.width(s.width).height(s.height);
                doScroll(pos);
            }
            $(window).on('resize', resize);
        });
    };
});