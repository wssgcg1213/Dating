/**
 * Created by liuhzz on 2015/5/30.
 */
define(['urls', 'userCenter', 'eventproxy', 'mmState', 'dialog', 'avaFilters'], function(urls, userCenter, EventProxy){
    avalon.state("litterLetter",{
        url:"/litterLetter",
        templateUrl:"tpl/litterLetterCtrl.html",
        onEnter:function() {
            avalon.vmodels['nav']['title'] = "私信";
            $.post(urls.dateList,{})
            avalon.scan();
        }
    })
})