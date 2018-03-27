/**
 * 获取项目列表
 */
list();
function list(){
    $(".content").html("");
    var json = {};
    json.pageSize = 0;
    if(sessionStorage.role != "2") {
        json.userId = sessionStorage.userId
    }
    $.ajax({
        url:address + "hys/s_all",
        type:"get",
        headers:{
            token:sessionStorage.token
        },
        data:json,
        success:function(res){
            var d = res.data.list;
            var html;
            for(var i=0;i<d.length;i++) {
                    html ='<div class="table">' +
                    '<p class="table-title">' +
                    '<span>'+d[i].hyName+'</span>' +
                    '<span class="rfloat">' +
                    '<span>'+d[i].cDate+'</span>' +
                    '<span>'+status(d[i].status)+'</span>' +
                    '</span>' +
                    '</p>' +
                    '<div class="tableList">';
                var dd = d[i].tasks;
                for(var j=0;j<dd.length;j++) {
                    html+= '<table cellspacing="0" cellpadding="0">' +
                        '<thead>' +
                        '<tr>' +
                        '<th align="left">'+dd[j].taskName+'</th>' +
                        '<th>'+dd[j].des+'</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                    var ddd = dd[j].assesses;
                        for(var k=0;k<ddd.length;k++) {
                            html+='<tr>' +
                            '<td>'+ddd[k].user.nickname+'</td>' +
                            '<td>'+ddd[k].assessTime+'</td>' +
                            '</tr>'
                        }
                        html+='<tr class="lastColor">' +
                        '<td>平均分</td>' +
                        '<td>'+(dd[j].avgTaskTime==undefined?"":dd[j].avgTaskTime)+'</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>';
                }
                html+= '</div></div>';

                $(".content").append(html);
            }
        }
    })
}

function status(val) {
    if(val == 0 ) {
        return "开放"
    }else if(val == 1) {
        return "关闭"
    }
}

href();
function href(){
    $(".topButton").find(".rfloat").attr("href",address+'hys/exportHysExcels?token='+sessionStorage.token);
};