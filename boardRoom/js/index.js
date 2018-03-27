//首页只需要验证会议室密令，看是否有权限进入该会议室！
// 需要的参数是  用户名，会议室密令， 还有进入会议室人数

$(document).ready(function () {
    hysstart()
});
//请求会议室列表
function hysstart() {
    $(".userList").html("");
    $.ajax({
        type:"GET",
        url:address+"/hys/s_bean",
        data:{status:"0"},
        xhrFields:{
            withCredentials: true
        },
        success: function(data) {
            var datalist=data.data.list;
            for(var i in datalist){
                  $(".userList").append(' <li data-id="'+datalist[i].id+'" data-userid="'+datalist[i].userId+'">\n' +
                      '            <span>'+datalist[i].hyName+'</span>\n' +
                      '            <span>\n' +
                      '            <span>'+datalist[i].cDate+'</span>\n' +
                      '            <span>开放</span>\n' +
                      '        </span>\n' +
                      '    </li>');
            }
        }
    });


//点击每个li弹出验证会议室密令

    $(".userList").on("click","li",function () {
        var hysid=$(this).data('id');
        var userId=$(this).attr('data-userid');
        $(".opcaty").css("display","block");
        $("#opcaVotep").css("display","block");
        var text=$(this).find("span").first().text();
        $("#home").find('span').text(text);
        $("#opcaVotep .buttonS").attr("data-id",hysid);
        $("#opcaVotep .buttonS").attr("data-userid",userId);
        $("#opcaVotep input").val("");
    })
}
//点击登录确定，取消显示的；
$("#opcaVotep .buttonS").click(function () {
    var password=$(this).parent().prev().children().val();
    var hysId = $("#opcaVotep .buttonS").attr("data-id");
    var userId =$("#opcaVotep .buttonS").attr("data-userid");
    if(password==""){
        toast("请输入正确的密码",1000);
    }else {
        $.ajax({
            type:"POST",
            url:address+"hys/hys_login",
            data:{hyPwd:password,id:hysId},
            xhrFields:{
                withCredentials: true
            },
            success: function(data) {
                $(this).parent().prev().children().val("");
                if(data.code==0){
                    //会议室密码
                    $(".opcaty").css("display","none");
                    location.href="detil.html?id="+hysId+"&&userId="+userId;
                }else {
                    toast(data.msg,1000);
                }
            }
        })
    }
});
//点击返回影藏模态框和遮罩层
$(".vote .buttonB").click(function () {
    $(".opcaty").css("display","none");
});


