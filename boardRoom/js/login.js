/**
 * 匿名用户进入首页  其他入口需要用户登录
 * @type {string}
 */
/**
 * role = 0; 普通人员
 * role = 1; 普通管理员
 * role = 2; 超级管理员
 * @type {string}
 */
/**
 * 判断当前是否是匿名用户 是sessionStorage.role = undefined;
 * @type {string}
 */
function anonymity() {
    if (sessionStorage.role == undefined) {
        location.href = "login.html";
    }
}

/**
 * 判断当前用户属于什么角色
 * @type {string}
 */

function role(arr) {
    if(arr.indexOf(sessionStorage.role)==-1) {
        toast("权限不匹配",1000);
        return false;
    }else {
        return true;
    }
}

/**
 * 绑定登录按钮
 * 调用登录接口 获取用户信息以及角色信息
 * @param callback
 */
$("#login-btn .buttonS").click(function () {
    var workname = $("#usernamew").val();    //用户
    var workId = $("#pass").val();     //密码
    if (workId == "" || workname == "") {
        toast("请填写完整信息!",1000);
    } else {
        login(workname,workId)
    }
});
function login(workname,workId) {
    $.ajax({
        type: "POST",
        url: address + "login",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(
            {
                nickname: workname, password: workId
            }
        ),
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (data.code == 0) {
                sessionStorage.token = data.token;
                sessionStorage.username = data.user.name;
                sessionStorage.role = data.user.role;
                sessionStorage.userId = data.user.id;
                var arr = JSON.parse(sessionStorage.type);
                console.log(arr);
                if(arr.indexOf(sessionStorage.role)==-1) {
                    toast("权限不匹配，为您跳转首页",1000);
                    history.back(-1);
                }else{
                    history.back(-1);
                }
            } else {
                toast(data.msg,1000);
            }
        }
    })
}
/**
 * 修改密码操作
 */
$("#changepass").click(function () {
    $("#creatVote").show();
    $("#loginBox").hide();
});


$("#creatVote .buttonB").click(function(){
    $("#creatVote").css("display","none");
    $("#loginBox").show();
});

$("#creatVote .buttonS").click(function(){
    var username=$("#username").val();
    var boardpass=$("#boardpass").val();
    var datel=$("#datel").val();
    var peonum=$("#peonum").val();
    if(username == "" ||boardpass == "" ||datel == "" ||peonum == ""  ) {
        toast("请输入完整信息",1000);
        return ;
    }
    if(datel != peonum) {
        toast("两次密码不一致",1000);
        return ;
    }

    $.ajax({
        url:address+"/e_pwd",
        type:"post",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(
            {
                nnickname: username,
                pwd: boardpass,
                newpwd:datel
            }
        ),
        xhrFields: {
            withCredentials: true
        },
        success:function(res){
            if(res.code == 0) {
                toast("修改成功",1000);
                $("#creatVote").css("display","none");
                $("#loginBox").show();
                $("#username").val("");
                $("#boardpass").val("");
                $("#datel").val("");
                $("#peonum").val("");
            }else {
                toast(res.msg,1000);
            }
        }
    });

});
/**
 * 登录返回按钮的操作
 */
$("#login-btn .rfloat").click(function () {
    history.back(-1);
});

/**tabBar*/
/**
 * 点击tabBar 人员 按钮  role = 2
 */
$("#person").click(function () {
    if (sessionStorage.role == undefined) {
        var type = new Array("2");
        sessionStorage.type = JSON.stringify(type);
        location.href = "login.html";
    }else {
        var clickType = new Array("2");
        var isJump = role(clickType);
        if(isJump) {
            location.href = "person.html";
        }
    }
});
/**
 * 点击tabBar 项目 按钮  role = 2||1
 */
$("#project").click(function () {
    if (sessionStorage.role == undefined) {
        var type = new Array("1","2");
        sessionStorage.type = JSON.stringify(type);
        location.href = "login.html";
    }else {
        var clickType = new Array("1","2");
        var isJump = role(clickType);
        if(isJump) {
            location.href = "projectList.html";
        }
    }
});
/**
 * 点击tabBar 会议室 按钮  role = 2||1
 */
$("#work").click(function () {
    if (sessionStorage.role == undefined) {
        var type = new Array("1","2");
        sessionStorage.type = JSON.stringify(type);
        location.href = "login.html";
    }else {
        var clickType = new Array("1","2");
        var isJump = role(clickType);
        if(isJump) {
            location.href = "boardList.html";
        }
    }
});
