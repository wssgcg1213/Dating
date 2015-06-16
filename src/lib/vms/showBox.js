/**
 * Created by Liuchenling on 6/2/15.
 * showBox 组件
 */
define('vms/showBox', ['avalon', 'userCenter', 'request', 'mmState', 'avaFilters', 'vms/main'], function(avalon, userCenter, request){
    var vmShowBox = avalon.define({
        $id: "showBox",
        dateList: [],
        page: 0,
        goDetail: function(id){
            log("we are ready to go detail no.", id);
            avalon.router.navigate('detail/' + id);
        },
        loadMore: scrollHandler
    });

    var loadingFlag = false,
        noMoreCount = 0,
        vmMain = avalon.vmodels.main;

    function scrollHandler(ev){
        if(loadingFlag) return;
        loadingFlag = true;
        vmMain = 'loading';

        var typeName = avalon.vmodels['category']['active']['category'], typeId = 0;
        if(typeName){
            typeId = $$.typeHash.filter(function(o){if(o.type == typeName) return o});
            if(typeId && typeId.length >= 1){
                typeId = typeId[0]['id'];
            }else{
                typeId = 0;
            }
        }
        var user = userCenter.info();
        var page = vmShowBox.page;
        if(!page) page = 1;
        request('showBox', {
            uid: user.uid,
            token: user.token,
            date_type: typeId,
            page: page + 1,
            size: 10,
            order: 1 //todo order
        }).done(function(res){
            if(!res.data.length){
                !noMoreCount ? $.Dialog.success("木有更多啦") : $.Dialog.success("真的木有了!");
                $('.load-more').text('木有更多了');
                noMoreCount++;
                return setTimeout(function(){loadingFlag = false}, 2500);
            }
            vmShowBox.dateList.pushArray(res.data);
            vmMain.state = 'ok';
            vmShowBox.page = page + 1;
            setTimeout(function(){
                loadingFlag = false;
            }, 2500);//反正延迟到nextLoop
        });
    }

    return vmShowBox;
});