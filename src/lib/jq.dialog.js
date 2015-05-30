/**
 * Created by Liuchenling on 5/30/15.
 */
define(['jQuery'], function () {
    var elemDialog, elemOverlay, elemContent, elemTitle,
        inited = false,
        body = document.compatMode && document.compatMode !== 'BackCompat' ?
            document.documentElement : document.body,
        cssFixed;

    function init() {
        if (!inited) {
            createOverlay();
            createDialog();
            inited = true;
        }
    }

    function createOverlay() {
        if (!elemOverlay) {
            elemOverlay = $('<div class="box-overlay"></div>');
            $('body').append(elemOverlay);
        }
    }

    function createDialog() {
        if (!elemDialog) {
            if (!elemDialog) {
                elemDialog = $('<div class="dialog">' +
                '<div class="dialog-content"></div>' +
                '</div>');
                elemContent = $('.dialog-content', elemDialog);
                $('body').append(elemDialog);
                elemDialog.fadeIn(300)
            }
        }
    }

    function open() {
        elemDialog.fadeIn();
        elemOverlay.fadeIn(function(){
            $('select').hide();
        });
    }

    function close() {
        elemDialog.fadeOut();
        if (elemOverlay)elemOverlay.fadeOut(function(){
            elemContent.empty();
            $('select').show();
        });

    }

    function setHtml(html) {
        elemContent.html(html);
    }

    var Dialog = {
        loading: function () {
            this.open("<p class='dialog-loading'></p>");
            if(arguments[0]) setTimeout($.Dialog.close.bind($.Dialog), parseInt(arguments[0]) || 2000);
        },
        success: function () {
            var successTips = "操作成功!";
            if (arguments[0] != null)successTips = arguments[0];
            this.open("<p class='dialog-success'>" + successTips + "</p>");
            setTimeout(function () {
                $.Dialog.close();
            }, parseInt(arguments[1]) || 2000)
        },
        fail: function () {
            var failTips = "操作失败!";
            if (arguments[0] != null)failTips = arguments[0];
            this.open("<p class='dialog-fail'>" + failTips + "</p>");
            setTimeout(function () {
                $.Dialog.close();
            }, parseInt(arguments[1]) || 2000)
        },
        open: function (html) {
            init();
            setHtml(html);
            open();
        },
        close: close
    };

    $.extend({Dialog: Dialog});
});