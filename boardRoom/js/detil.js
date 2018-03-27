// sessionStorage.type=1
//type=1,无权限，type=3有权限；
//通过首页验证密令成功进入详情页展示，只有管理员和经理才可以创建
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]);
    return null;
}
var hysidxq=GetQueryString("id");
var userId =GetQueryString("userId");


$(document).ready(function () {
    gethysxq()
});



//获取会议室详情
function gethysxq() {
    $(".userList-title").siblings("li").remove();
    $.ajax({
        type: "GET",
        url: address + "hys/s_all",
        data: {id: hysidxq},
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data, "会议室详情,显示任务号")
            var dataDetil = data.data.list;
            $(".hystitle").html(dataDetil[0].hyName)
            var hysxq=dataDetil[0].tasks;  //每个任务号的评估人信息
            for(var i in hysxq){
                var html = '<li data-rwhid="'+hysxq[i].id+'" data-userid="'+dataDetil[0].userId+'">\n' +
                    '         <span>\n' +
                    '            <span>'+hysxq[i].taskName
                    +'</span> <br>\n' +
                    '            <span>'+hysxq[i].des+'</span>\n' +
                    '        </span>\n';
                console.log(hysxq[i]);
                if(hysxq[i].avgTaskTime) {
                    html+="<span>"+Math.round(hysxq[i].avgTaskTime).toFixed(0)+"</span>\n"
                }else {
                    html+="<span></span>\n"
                }
                $(".userList-title").after(html);
            }
        }
    })
}



//点击创建按钮，需要验证创建人身份，如果还没有登录显示登陆框，
  $("#creattt").click(function () {
      if (sessionStorage.role == undefined) {
          var type = new Array("1","2");
          sessionStorage.type = JSON.stringify(type);
          location.href = "login.html";
      }else {
          var clickType = new Array("1","2");
          var isJump = role(clickType);
          if(isJump) {
              if(sessionStorage.role != "2") {
                  if(sessionStorage.userId == userId) {
                      $(".opcaty").show();
                  }else {
                      toast("请在自己的会议室内创建项目！")
                  }
              }else {
                  $(".opcaty").show();
              }


          }
      }
});

$(".buttonB").on("click",function(){
    $(".opcaty").hide();
});

/**
 * ajax  创建提交按钮操作
 */
$("#opcaVote .buttonS").click(function () {
    var workIdval=$("#workIdval").val()
    var workname=$("#workname").val()
    var hysid=hysidxq;
    if(workIdval=="" || workname == "") {
        toast("请输入任务信息",1000);
        return;
    }
    $.ajax({
        type: "POST",
        url: address + "add_task",
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(
            {
                taskName: workIdval,des:workname,hysId:hysid,

            }
        ),
        headers: {
            token:sessionStorage.token
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if(data.code == 0) {
                toast("任务添加成功！",1000);
                gethysxq()
            }else {
                toast(data.msg,1000);
            }

        }
    });
    $(".opcaty").css("display","none");
});

//点击头部返回箭头，返回上一页
$(".topButton .right").click(function(){
    history.back(-1)
});


//点击每一个任务号，跳至任务号详情页，由项目经理确认工时
$(".userList").on("click",".userList-title~li",function(){
    var rwhid=$(this).data('rwhid');
    var userId = $(this).attr("data-userid");
    console.log($(this).data('rwhid'),"任务号id");
    location.href="vote.html?id="+rwhid+"&&userId="+userId;
});