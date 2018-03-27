
//获取任务号详情传过来的任务号详情id；
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]);
    return null;
}
// var hysidxq=GetQueryString("rwhid");
// var hysidxq=GetQueryString("hysId");
var rwhid=GetQueryString("id");
var userId=GetQueryString("userId");
var status;


$(document).ready(function () {
    addpeo()
});

//加载该任务号的所有评论人；
function addpeo() {
    var sum = 0;
    $(".pgtitle").siblings("li").remove();
    $.ajax({
        type:"GET",
        url:address +"task/s_all",
        data:{id:rwhid},
        dataType:"json",
        success:function (data) {
            status = data.data.list[0].status;
            console.log(data,"任务号详情")
            var datalist=data.data.list[0].assesses;
            console.log(datalist);
            for(var i in datalist){
                $(".pgtitle").after(' <li>\n' +
                    '        <span>'+datalist[i].user.name+'</span>\n' +
                    '        <span>'+datalist[i].assessTime+'</span>\n' +
                    '    </li>');
                sum+=datalist[i].assessTime;
            }
            $(".topTitle").find(".right").find("span").text(Math.round(sum/(datalist.length)).toFixed(0));
            $(".topTitle").find(".lfloat").find("p").eq(0).text((data.data.list[0].taskName)+"/任务列表");
            $(".topTitle").find(".lfloat").find("p").eq(1).text((data.data.list[0].des));

        }
    })

}

//点击评估投票，弹出模态框，和遮罩层  只有项目经理有权限确认工时
$(".topButton-btn button:nth-of-type(1)").click(function () {
    if(status == 1) {
        toast("该任务已确认",1000);
        return;
    }
    if (sessionStorage.role == undefined) {
        var type = new Array("0","1","2");
        sessionStorage.type = JSON.stringify(type);
        location.href = "login.html";
    }else {
        var clickType = new Array("0","1","2");
        var isJump = role(clickType);
        if(isJump) {
            $(".opcaty").show();
        }
    }
})

//点击评估的确定；
$(".vote .buttonS").click(function () {
    // var a=  $(".topTitle .right span").text();
    var b= $("#worktime").val();  //确认的工时
    if(b=="") {
        toast("请输入评估时间",1000);
        return;
    }
    var reg = /^[1-9]\d*$/;
    if(!reg.test(b)) {
        toast("请输入正整数",1000);
        return;
    }
    $.ajax({
        type:"post",
        url:address +"add_assess",
        headers: {
            token:sessionStorage.token
        },
        data:JSON.stringify(
            {
                taskId:rwhid,assessTime:b
            }
        ),
        xhrFields: {
            withCredentials: true
        },
        contentType:"application/json;charset=utf-8",
        success:function (data) {
            if(data.code == 0) {
                $(".vote .buttonB").trigger("click");
                toast("评估成功",1000);
                addpeo()
            }else {
                toast(data.msg,1000);
            }

        }
    })
});


//点击工时确认，弹出提示；
$(".topButton-btn button:nth-of-type(2)").click(function () {
    if(status == 1) {
        toast("该任务已确认",1000);
        return;
    }
    if (sessionStorage.role == undefined) {
        var type = new Array("1","2");
        sessionStorage.type = JSON.stringify(type);
        location.href = "login.html";
    }else {
        var clickType = new Array("1","2");
        var isJump = role(clickType);
        if(isJump) {
            if(sessionStorage.role != "2") {
                if(sessionStorage.userId != userId) {
                    toast("请在自己的会议室内确认工时！");
                    return ;
                }
            }
            $.ajax({
                type:"post",
                url:address +"task_affirm",
                headers: {
                    token:sessionStorage.token
                },
                data:JSON.stringify(
                    {
                        id:rwhid
                    }
                ),
                xhrFields: {
                    withCredentials: true
                },
                contentType:"application/json;charset=utf-8",
                success:function (res) {
                    if(res.code == 0) {
                        addpeo();
                        toast("确认成功",1000);
                    }else {
                        toast(res.msg,1000);
                    }
                }
            })

        }
    }
});


//点击取消影藏模态框和遮罩层
$(".vote .buttonB").click(function () {
    $(".opcaty").css("display","none");
})

//点击确定，取消显示的；
$(".vote .buttonS").click(function () {
    var text=$(this).parent().prev().children().val()
    console.log(text)
});

//点击返回按钮，返回上一页
$(".topButton .right").click(function(){
    history.back(-1)
})