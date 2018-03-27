
$(document).ready(function () {
    allhys()
});

//加载每一项
function allhys() {
    var json = {};
    if(sessionStorage.role != "2") {
        json.userId = sessionStorage.userId
    }
    $(".userList").html("");
    $.ajax({
        type: "GET",
        url: address + "hys/s_bean",
        data: json,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            var datalist = data.data.list;
            for (var i in datalist) {
                var stadu;
                if (datalist[i].status == 0) {
                    stadu = "开放"
                } else if (datalist[i].status == 1) {
                    stadu = "关闭"
                }
                $(".userList").append(' <li data-id="' + datalist[i].id + '" data-content = "'+datalist[i].content+'" data-hypwd = "'+datalist[i].hyPwd+'">\n' +
                    '            <span>' + datalist[i].hyName + '</span>\n' +
                    '            <span>\n' +
                    '            <span>' + datalist[i].cDate + '</span>\n' +
                    '            <span>' + stadu + '</span>\n' +
                    '        </span>\n' +
                    '    </li>')
            }
        }
    })
}


//点击每一项，验证登录密码
$(".userList").on("click", "li", function () {
    if (sessionStorage.role == undefined) {
        var type = new Array("1","2");
        sessionStorage.type = JSON.stringify(type);
        location.href = "login.html";
    }else {
        var clickType = new Array("1","2");
        var isJump = role(clickType);
        if(isJump) {
            $(".hidenVote").css("display", "block");
            var hysid = $(this).data('id');
            var name = $(this).find("span").eq(0).text();
            var content = $(this).attr("data-content");
            var hyPwd = $(this).attr("data-hypwd");
            $("#home").find("span").text(name);
            $("#username").find("span").text(content);
            $("#inpP").find("input").val(hyPwd);
            $("#vote-button").find(".buttonS").attr("data-id",hysid);
            $("#vote-button").find(".vote-save").attr("data-id",hysid);
        }
    }
});
/**
 * 会议室释放
 */
    $("#vote-button .buttonS").click(function () {
        console.log($(this).attr("data-id"));
        $.ajax({
            type: "POST",
            url: address + "hys/update",
            headers:{
                token:sessionStorage.token
            },
            contentType:"application/json;charset=utf-8",
            data: JSON.stringify({
                id:$(this).attr("data-id"),
                status: 1
            }),
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.code == 0) {
                    toast("会议室释放成功！",1000);
                    $(".hidenVote").css("display", "none");
                    $("#username").next().find('input').val("");
                    allhys();
                }else {
                    toast(data.msg,1000);
                }
            }
        })
    });

/**
 * 点击返回弹出层隐藏
 */
$(".vote .backBtn").click(function () {
    $(".hidenVote").css("display", "none");
    $(".creatVote").css("display", "none");

});
// //点击验证登陆保存，取消显示的；
$(".vote .vote-save").click(function () {
    var pass = $("#username").next().find('input').val();
    if(pass == "") {
        toast("请输入新口令",1000);
        return ;
    }
    $.ajax({
        url:address +"hys/update",
        type:"post",
        headers:{
            token:sessionStorage.token
        },
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify({
            id:$(this).attr("data-id"),
            hyPwd:pass,
        }),
        success:function(res){
            if(res.code == 0) {
                toast("修改口令成功！",1000);
                $(".vote .backBtn").trigger("click");
                $("#username").next().find('input').val("");
            }else {
                toast(res.msg,1000);
            }
        }
    })


});

// //点击释放
//
// $(".buttonS").click(function(){
//     //修改会议室状态；
//     $(".vote .buttonB").trigger("click");
//
// });
//
//
//
// // //取消值显示
// $(".vote .buttonS,.vote .buttonB").click(function () {
//     $("#username").next().find('input').val('')
// })


//点击创建确定，记录数据传回后台
$(".creatVote .buttonS").click(function () {
    var boardnamew = $("#boardnamew").val()
    var say = $("#say").val()
    var boardpass = $("#boardpass").val()
    var datel = $("#datel").val()
    var peonum = $("#peonum").val()
    var votenum = $("#votenum").val()

    $.ajax({
        type: "POST",
        url: address + "/hys/save",
        headers:{
            token:sessionStorage.token,
        },
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify({
            hyName: boardnamew,
            content: say,
            hyPwd: boardpass,
            deadline: datel+" 00:00:00",
            num: peonum,
            assessCount: votenum
        }),
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if(data.code == 0) {
                toast("新增会议室成功!",1000);
                $(".creatVote").hide();
                allhys();
                console.log(data)
            }else {
                toast(data.msg,1000);
            }
        }
    })


})

//点击创建取消后
$(".creatVote .buttonB").click(function () {
    $(".creatVote").css("display", "none");
});


//创建取消值显示
$(".creatVote .buttonB,.creatVote .buttonS").click(function () {
    $(".creatVote input").val('')
});


//点击创建，弹出创建框,只有管理员有权限！
$('.topButton .creatBoard').click(function () {
    if (sessionStorage.role == undefined) {
        var type = new Array("1","2");
        sessionStorage.type = JSON.stringify(type);
        location.href = "login.html";
    }else {
        var clickType = new Array("1","2");
        var isJump = role(clickType);
        if(isJump) {
            $(".creatVote").show();
        }
    }

});


href();
function href(){
    $(".topButton").find(".rfloat").attr("href",address+'hys/eHysExcels?token='+sessionStorage.token);
};

