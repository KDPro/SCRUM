/**
 * Created by kdkjPC on 2018/3/22.
 */

var address="http://192.168.20.136:8086/";
// var address="http://192.168.20.100:8086/";

function toast(msg,d) {
    if(msg) {
        var html = '<div class="tips" style="display:none;position:absolute;top:0;bottom:20px;left:0;right:0;background-color:rgba(0,0,0,0);z-index:100;"> ' +
            '<div class="tipsT" style="position:absolute;left:10%;right:10%;padding:5px 0;border-radius:5px;bottom:20px;background-color:rgba(0,0,0,.7);text-align: center;font-size:14px;color:white;">' +
            msg+
            '</div> ' +
            '</div>';
        $("body").append(html);
        $(".tips").fadeIn();
        setTimeout(function(){
            $(".tips").fadeOut();
            setTimeout(function(){
                $(".tips").remove();
            },1000)
        },1000);
    }

};