/**
 * Created by Liuchenling on 6/2/15.
 * showBox 组件
 */
define('vms/showBox', ['avalon', 'mmState', 'mmHistory'], function(avalon){
    avalon.define({
        $id: "showBox",
        dateList: [],
        goDetail: function(id){
            log("we are ready to go detail no.", id);
            avalon.router.navigate('detail/' + id);
        }
    });
});