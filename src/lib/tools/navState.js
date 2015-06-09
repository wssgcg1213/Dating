/**
 * Created at 6/6/15.
 * @Author Ling.
 * @Email i@zeroling.com
 * 导航栏的状态
 */
define('navState', ['noop', 'avalon'], function (noop, avalon) {
    var defaultState = {
        title: "",
        iconmenu: false,
        iconback: true,
        iconplus: false,
        rightMenu: '',
        rightMenuCallback: noop
    };
    var getDefaultState = function(title){
        var ret = avalon.mix({}, defaultState);
        ret.title = title;
        return ret;
    };

    return {
        home: {
            title: "约",
            iconmenu: true,
            iconback: false,
            iconplus: true,
            rightMenu: '',
            rightMenuCallback: noop
        },

        detail: getDefaultState('详情'),
        collect: getDefaultState('收藏'),
        history: getDefaultState('我约过的'),
        userInfoPublic: getDefaultState('用户中心'),
        litterLetter: getDefaultState('私信'),
        letters: getDefaultState('私信'),
        about: getDefaultState('关于'),

        userInfoEdit: {
            title: "个人中心",
            iconmenu: false,
            iconback: true,
            iconplus: false,
            rightMenu: '完成',
            rightMenuCallback: 'finish'
        },

        userInfo: {
            title: "个人中心",
            iconmenu: false,
            iconback: true,
            iconplus: false,
            rightMenu: '编辑',
            rightMenuCallback: function(){
                avalon.router.navigate('userInfoEdit')
            }
        },

        publishDating: {
            title: "发布约",
            iconmenu: false,
            iconback: true,
            iconplus: false,
            rightMenu: '发布',
            rightMenuCallback: 'publish'
        }
    };
});