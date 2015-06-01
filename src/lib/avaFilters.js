/**
 * Created by Liuchenling on 5/30/15.
 */
define(['avalon'], function(){
    /**
     * 创建时间的fliter
     * @param ts
     * @returns {string}
     */
    avalon.filters.createdTime = function(ts){
        var _now = parseInt(new Date / 1000),
            interval = _now - ts;
        if(interval < 60){
            return '刚刚';
        }else if(interval < 60 * 60){
            return parseInt(interval / 60) + "分钟前";
        }else if(interval < 24 * 60 * 60){
            return parseInt(interval / (60 * 60)) + "小时前";
        }else if(interval < 48 * 60 * 60){
            return "昨天";
        }
        return parseInt(interval / (24 * 60 * 60)) + "天前";
    };

    /**
     * 花费模式过滤器
     * @param model
     * @returns {string}
     */
    avalon.filters.costModel = function(model) {
        var model = parseInt(model);
        switch(model){
            case 1: return "AA制";
            case 2: return "我请客";
            case 3: return "求请客";
        }
        return "未知";
    }

    /**
     * 性别限制过滤器
     * @param g
     * @returns {string}
     */
    avalon.filters.genderLimit = function(g){
        var g = parseInt(g);
        switch(g){
            case 0: return "不限";
            case 1: return "仅限男";
            case 2: return "仅限女";
        }
        return "未知";
    }

    avalon.filters.peopleLimit = function(n){
        n = parseInt(n);
        return !n ? "无限制" : "不多于" + n + '人';
    }

    avalon.filters.gradeFilter = function(n){
        if(typeof n == 'number' || typeof n == 'string'){
            n = parseInt(n);
            switch(n){
                case 1: return "大一";
                case 2: return "大二";
                case 3: return "大三";
                case 4: return "大四";
            }
            return "未知";
        } else if (Array.isArray(n)) {
            if(n.length === 0)return "无限制";
            n = n.sort();
            return n.join("级, ") + "级";
        }
    }
    /**
     * 状态限制过滤器
     * @param n
     * @returns {string}
     */
    avalon.filters.status = function(n){
        n = parseInt(n);
        switch (n){
            case 0: return "已结束";
            case 1: return "成功";
            case 2: return "受理中";
        }
        return "未知";
    }

    /**
     * 约会记录状态
     * @param n
     * @returns {string}
     */
    avalon.filters.statusFilter = function(n){
        n = parseInt(n);
        switch(n){
            case 0: return "已结束";
            case 1: return "成功";
            case 2: return "受理中";
        }
        return "未知";
    }
});