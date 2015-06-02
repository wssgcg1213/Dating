/**
 * Created by Liuchenling on 5/30/15.
 */
define('dialog', ['jquery'], function ($) {
    var elemDialog, elemOverlay, elemContent, elemTitle,
        inited = false,
        body = document.compatMode && document.compatMode !== 'BackCompat' ?
            document.documentElement : document.body,
        cssFixed;

    function init() {
        if ($('.box-overlay').length == 0) {
            createOverlay();
            createDialog();
        }
    }

    function createOverlay() {
        if (!elemOverlay) {
            elemOverlay = $('<div class="box-overlay"></div>');
        }
        $('.dialog-cont').append(elemOverlay);
    }

    function createDialog() {
        if (!elemDialog) {
            elemDialog = $('<div class="dialog">' +
            '<div class="dialog-content"></div>' +
            '</div>');
        }

        elemContent = $('.dialog-content', elemDialog);
        $('.dialog-cont').append(elemDialog);
        elemDialog.fadeIn(300)
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
        },
        success: function (tip) {
            var successTips = tip || "操作成功!";
            this.open("<p class='dialog-success'>" + successTips + "</p>");
            setTimeout(function () {
                $.Dialog.close();
            }, parseInt(arguments[1]) || 2000)
        },
        fail: function (tip) {
            var failTips = tip || "操作失败!";
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