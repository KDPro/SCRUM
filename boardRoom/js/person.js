/**
 * 获取人员列表
 */
list();
function list(){
    $(".list").html("");
    $.ajax({
        url:address+"user/s_bean",
        type:"get",
        headers:{
            token:sessionStorage.token
        },
        data:{
            pageSize:0
        },
        success:function(res){
            var d = res.data.list;
            for(var i=0;i<d.length;i++) {
                var html = '<tr> ' +
                    '<td>'+d[i].nickname+'</td> ' +
                    '<td>'+d[i].telephone+'</td> ' +
                    '<td>'+d[i].email+'</td> ' +
                    '</tr>';
                $(".list").append(html);
            }
        }
    })
}

//从首页验证了身份，进来人员页面，点击创建；
$(".topButton .topbutton").click(function () {
    $(".opcaty").css("display","block");
});

//点击返回取消影藏模态框和遮罩层
$(".vote .buttonB").click(function () {
    $(".opcaty").css("display","none");
});
//
// //点击登录确定，取消显示的；
$(".vote .buttonS").click(function () {
   var usernamew=$("#usernamew").val()
   var name=$("#name").val()
   var telephone=$("#telephone").val()
   var email=$("#email").val()
   var post=$("#post option:selected").val()
    if(usernamew == "") {
       toast("用户名必填",1000);
        return ;
    }

    $.ajax({
        url:address + "user/save",
        type:"post",
        headers:{
            token:sessionStorage.token
        },
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify({
            nnickname:usernamew,
            nname:name,
            ntelephone:telephone,
            nemail:email,
            nrole:post,
        }),
        success:function(res){
            $("#addPerson input").val("")
            if(res.code == 0) {
                list();
                $(".vote .buttonB").trigger("click");
            }else {
                toast(res.msg,1000);
            }

        }
    });
});
