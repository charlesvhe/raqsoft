<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.raqsoft.center.schedule.ScheduleImpl" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%
	boolean newsche = "yes".equals(request.getParameter("newsche"));
	newsche = newsche && request.getAttribute("schedule") == null;
	String userIds = "";
	String text = "";
	if(!newsche){
		ScheduleImpl si = (ScheduleImpl)request.getAttribute("schedule");
		if(si != null){
			java.util.Map map = si.getDataMap();
			userIds = (String)map.get("to_email");
		}
		text = si.getScheduleText();
	}else{
		text = "default text";
	}
	String userParamsJson = (String)request.getAttribute("userParamsJson");
	String userIdNameJson = (String)request.getAttribute("userIdNameJson");
	
%>
</head>
<body>
<div class="layui-tab" lay-filter="demo">
  <ul class="layui-tab-title">
    <li class="layui-this">任务</li>
    <li>报表参数设置</li>
    <li>用户参数设置</li>
  </ul>
  <div class="layui-tab-content">
    <div class="layui-tab-item layui-show"><jsp:include page="newSchedule.jsp"/></div>
    <div class="layui-tab-item"><jsp:include page="paramSet.jsp"/></div>
    <div class="layui-tab-item">
			<div class="layui-tab" style="height:100%" lay-filter="demo">
			 <ul class="layui-tab-title" id="userUl">
			   <li class="layui-this noUser" style="display:none">无</li>
			 </ul>
			 <div class="layui-tab-content" id="userContents">
			   <div class="layui-tab-item layui-show noUser" style="display:none"></div>
			</div>
			 </div>
			</div>
	</div>
  </div>
</div>
<script type="text/javascript">
var requestParamInfos = '<%=userParamsJson%>';
var userIdNameJson = '<%=userIdNameJson%>';
userIdNameJson = eval("("+userIdNameJson+")");
if(requestParamInfos != 'null'){
	requestParamInfos = eval("("+requestParamInfos+")")
}
var contentText = "<%=text%>";
$('#contentTxt').html(contentText);
$(function(){
	var userIds = "<%=userIds%>";
	if(<%=newsche%>) {
		$('.noUser').show();
	}else {
		$('.noUser').hide();
		$($('#userUl').children()[0]).removeClass('layui-this');
		$($('#userUl').children()[1]).addClass('layui-this');
		$($('#userContents').children()[0]).removeClass('layui-show');
		$($('#userContents').children()[1]).addClass('layui-show');
		var userIdArr = userIds.split(',');
		initTabs(userIdArr,requestParamInfos == 'null'? '' : requestParamInfos);
	}
	layui.use('element', function(){
		  var element = layui.element;
		  element.render('tag');
	});
});

function checkHasTab(id){
	return $('#user_params_'+id).length == 1;
}

function createUserParamTab(id , params, show){
	if(checkHasTab(id)) return;
	$('.noUser').hide();
	$($('#userUl').children()).removeClass('layui-this');
	$($('#userContents').children()).removeClass('layui-show');
	$('#userUl').append('<li id="user_params_'+id +'"'+ (show?' class="layui-this"':'') + '>'+userIdNameJson[id]+'</li>');
	
	var contentu = $('<div id="userParamContent_'+id+'" style="height:600px" class="layui-tab-item'+ (show?' layui-show"':'"')+'></div>');
	$('#userContents').append(contentu);
	contentu.append('<iframe src=\'reportCenterServlet?action=79&params='+encodeURIComponent(params)+'&userId='+id+'\' frameborder=0 style="width:100%;height:100%" id="userParamFrame'+id+'"></iframe>');
}

function removeTab(id){
	if(!checkHasTab(id)) return;
	$('#user_params_'+id).remove();
	$('#userParamContent_'+id).remove();
	if($('#userUl').children().length == 1){
		$($('#userUl').children()[0]).addClass('layui-this');
		$($('#userContents').children()[0]).addClass('layui-show');
		$('.noUser').show();
	}
}

function initTabs(users,requestParamInfos){
	for(var u = 0; u < users.length; u++){
		var paramArr = requestParamInfos.params;
		var paramsJsonArr = "[]";
		for(var p = 0; p < paramArr.length; p++){
			var param = paramArr[p];
			if(param.id == users[u]) paramsJsonArr = param.paramsJson;
		}
		createUserParamTab(users[u],JSON.stringify(paramsJsonArr),u == 0);
		/* var div1 = $('<div align="center"></div>');
		contentu.append(div1);
		var div2 = $('<div style="width:1000px"></div>');
		div1.append(div2);
		var div3 = $('<div></div>');
		div2.append(div3);
		var div4 = $('<div align="center"></div>');
		div3.append(div4);
		var table = $('<table lay-skin="nob" style="width:850px" class="layui-table"></table>');
		div4.append(table);
		var thead = $('<thead></thead>');
		var tr = $('<tr></tr>');
		
		tr.append('<td colspan=1></td>');
		tr.append('<td colspan=1>报表参数编辑</td>');
		tr.append('<td colspan=4>'
			+'<input onclick="addUserParam(userParamTrs'+users[u]+');" type=button class="layui-btn layui-btn-sm" value="增加"/>'
			+'<input onclick="delUserParam(userParamTrs'+users[u]+');" type=button class="layui-btn layui-btn-warm layui-btn-sm" value="删除选中"/>'
			+'</td>');

		var tr1 = $('<tr></tr>');
		tr1.append('<th style="width:13px"></th>');
		tr1.append('<th style="width:128px">名称</th>');
		tr1.append('<th>描述</th>');
		tr1.append('<th>数据类型</th>');
		tr1.append('<th>参数值</th>');
		tr1.append('<th>参数类型</th>');
		thead.append(tr).append(tr1);
		table.append(thead);
		table.append('<tbody id="userParamTr'+users[u]+'"></tbody>'); */
	}
}
</script>
</body>
</html>
