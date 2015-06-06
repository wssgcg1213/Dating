/**
 * Created at 6/6/15.
 * @Author Ling.
 * @Email i@zeroling.com
 * 评分插件
 */
define(['jquery'], function($){

    $.fn.score = function(grade){
        grade = grade > 5 ? 5 : grade;
        grade = grade < 0 ? 0 : grade;
        grade = parseFloat(grade);
        var integer = parseInt(grade);
        var arr = [];
        for(var i = 0; i < integer; i++){
            arr.push('full');
        }
        if(arr.length < 5)
            arr.push(Math.ceil(grade - integer) ? "half" : "empty");
        while(arr.length < 5){
            arr.push("empty");
        }

        var tpl = arr.map(function(str){
            return '<i class="iconfont star-' + str + '"></i>';
        });

        this.each(function(){
            $(this).addClass('score-overlay').html(tpl);
        });
        return this;
    };

    return $;
});