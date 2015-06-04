/**
 * Created at 6/4/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */
define('vms/category', ['jquery', 'userCenter', 'urls', 'avalon', 'dialog'], function ($, userCenter, urls) {
    var user = userCenter.info();
    return avalon.define({
        $id: "category",
        orderList: [{
            id: 0,
            type: "时间排序"
        }], //排序方式
        categories: [], //分类列表

        order: function(id){
            id = parseInt(id);
            switch(id){
                case 0:
                    //todo 排序
                    break;
            }
        },

        hide: function(id){
            $('#' + id).removeClass('show');
            setTimeout(function () {$('#' + id).hide()}, 400);
        },

        show: function (id) {
            $('#' + id).show();
            setTimeout(function () {$('#' + id).addClass('show')}, 0);
        },

        stopBubble: function (e) {
            e.stopPropagation();
        },

        selectType: function(typeId){
            typeId = parseInt(typeId);
            avalon.vmodels['main']['state'] = 'loading';
            $.post(urls.dateList, {date_type: typeId, uid: user.uid, token: user.token}).success(function(res){
                if(res && res.status == 200){
                    avalon.vmodels['showBox']['dateList'] = res.data;
                    avalon.vmodels['main']['state'] = 'ok';
                }else if(res && res.status == 409){
                    $.Dialog.fail(res.info);
                }else{
                    log("err", res);
                    $.Dialog.fail("服务器提了一个问题");
                }
            }).fail(function(res){
                log("err", res);
                $.Dialog.fail("服务器提了一个问题");
            });
        }
    });
});