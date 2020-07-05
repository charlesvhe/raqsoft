<%@ page contentType="text/html;charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isELIgnored="false" %> 
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
<%@ page import="com.raqsoft.report.view.*"%>
<%
	String contextPath = request.getContextPath();
%>
<html>
<head>
<script src="<%=contextPath%>/js/jquery.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/font-awesome-4.7.0/css/font-awesome.min.css">
<script type="text/javascript">
function addSchedule(){
	window.location="<%=contextPath%>/reportCenterServlet?action=681&newsche=yes";
}
function jumpToPage(page){
	var targetPage;
	if(page != null){
		targetPage = page;
	}else{
		targetPage = document.getElementById("page").value;
	}
	window.location = "<%=contextPath%>/reportCenterServlet?action=62&currPage=0&page="+targetPage+"&sizePerPage="+document.getElementById("sizePerPage").value;
}
function changeCompanyMailBox(){
	window.location="<%=contextPath%>/reportCenterServlet?action=72";
}

function modSchedule(jobName){
	var status = jobName+"_status";
	if("1" == $('#'+status).val()){
		alert("请先停止该任务");
		return;
	}
	window.location="<%=contextPath%>/reportCenterServlet?action=68&jobName=" + encodeURIComponent(jobName);
}

function executeSchedule(jobName){
	var status = jobName+"_status";
	if("0" == $('#'+status).val()){
		alert("任务未加载");
		return;
	}
	$.ajax({
		url:"<%=contextPath%>/reportCenterServlet?action=66&jobName=" + encodeURIComponent(jobName),
		type:"post",
		data:[],
		success:function(){
			alert("已执行！");
		}
	})
}

function stopSchedule(jobName){
	$.ajax({
		url:"<%=contextPath%>/reportCenterServlet?action=69&jobName=" + encodeURIComponent(jobName),
		type:"post",
		data:[],
		success:function(){
			alert("已停止！");
			var status = jobName+"_status";
			$('#'+status).val('0');
			$('#'+jobName+'_stopbtn').hide();
			$('#'+jobName+'_startbtn').show();
		}
	})
}

function startSchedule(jobName){
	var status = jobName+"_status";
	if($('#'+status).val() == "-1"){
		alert("单次触发任务已经过期，请重新设置再启动！");
		return;
	}
	$.ajax({
		url:"<%=contextPath%>/reportCenterServlet?action=70&jobName=" + encodeURIComponent(jobName),
		type:"post",
		data:[],
		success:function(msg){
			if(msg.indexOf("fail:") >= 0){
				alert(msg);
				return;
			}
			alert("已启动！");
			$('#'+status).val('1');
			$('#'+jobName+'_stopbtn').show();
			$('#'+jobName+'_startbtn').hide();
		}
	})
}

function deleteSchedule(jobName){
	var status = jobName+"_status";
	if("1" == $('#'+status).val()){
		alert("请先停止该任务");
		return;
	}
	$.ajax({
		url:"<%=contextPath%>/reportCenterServlet?action=67&jobName=" + encodeURIComponent(jobName),
		type:"post",
		data:[],
		success:function(){
			alert("已删除！");
			window.location="<%=contextPath%>/reportCenterServlet?action=62";
		}
	})
}

function selectAllToggle(){
		if($(form3.selectAll).prop("checked") == true){
			selectAll(form3);
		}else{
			clearAll(form3);
		}
}

function selectAll(form3 ){
  for(var i=0;i<form3.elements.length;i++){
     if(form3.elements[i].type=="checkbox"){
				 form3.elements[i].checked = true;
     }
   }
}
	
function clearAll( form3 ){
  for(var i=0;i<form3.elements.length;i++){
     if(form3.elements[i].type=="checkbox"){
				 form3.elements[i].checked = false;
     }
   }
}

function deleteSelect( id ){
	var delReportIds = new Array();
	if(id != null){
		delReportIds[0] = id;
	}else{
	  var subGo=0;
	  delReportIds = new Array();
	  for(var i=0;i<document.forms.form3.elements.length;i++){
        if(document.forms.form3.elements[i].type=="checkbox"){
		  if(document.forms.form3.elements[i].checked){
			  if(document.forms.form3.elements[i].name=='selectAll'){
				  continue;
			  }
			  delReportIds[delReportIds.length] = encodeURIComponent(document.forms.form3.elements[i].value);
			  subGo++;
		   }
	    }
	   }

	    if(subGo<1){
		   alert("您没有选择要删除的任务！");
		   return ;
	    }
	    $.ajax({
			url:"<%=contextPath%>/reportCenterServlet?action=73&jobNames=" + delReportIds,
			type:"post",
			data:[],
			success:function(){
				alert("已删除！");
				window.location="<%=contextPath%>/reportCenterServlet?action=62";
			}
		})
    }
}
</script>
<style>
.thin{
	width:50px;
}
.normal{
	width:150px;
}
.large{
	width:200px;
}
.huge{
	width:250px;
}


</style>
</head>
<body >
<input type="hidden" value id="openLayerIndex"/>
<div align="center">
<div style="width:1200px;top:0px;">
<div class="layui-layout" style="margin-left:20px;margin-top:50px;">
	<div class="layui-bg-white" style="height:40px">
	<div class="layui-row">
    <div class="layui-col-xs1">
    <button style="cursor: pointer;" class="layui-btn layui-bg-green layui-btn-sm" onclick="addSchedule()"><i class="layui-icon">&#xe654;</i>添加</button>
    </div>
    <div class="layui-col-xs1">
    <button style="cursor: pointer;" title="自动停止任务" class="layui-btn layui-bg-red layui-btn-sm" onclick="deleteSelect()"><i class="layui-icon">&#xe640;</i>强制删除</button>
    </div>
    <div class="layui-col-xs1">
    <button style="cursor: pointer;margin-left:8px" class="layui-btn layui-bg-blue layui-btn-sm" onclick="changeCompanyMailBox()"><i class="layui-icon">&#xe614;</i>发件邮箱</button>
    </div>
  </div>
</div>
</div>
</div>
</div>
<div class="layui-container" align="center">
<form action="<%=contextPath %>/" method="post" name="form3" id="form3" style="margin-bottom:40px">
		<table lay-skin="nob" class="layui-table"
			id="table1" title="任务列表" 
			rowsDisplayed="15" style="width:1200px;top:70px;margin:0px;">
			<colgroup>
				<col width="50px">
				<col width="150px">
				<%-- <col width="150px">
				<col width="150px">
				<col width="150px"> --%>
				<col width="200px">
				<col width="200px">
				<col width="200px">
				<col width="250px">
				<col>
			</colgroup>
			<thead>
	     		<tr>
	     			<th class="thin"><input name="selectAll" type="checkbox" onchange="selectAllToggle();"/></th>
	     			<th class="normal">任务名</th>
	     			<!-- <th class="normal">任务组别</th>
	     			<th class="normal">触发器组别</th>
	     			<th class="normal">触发器</th> -->
	     			<th class="large">时间</th>
	     			<th class="large">任务类型</th>
	     			<th class="large">报表文件</th>
	     			<th class="huge">操作</th>
	     		</tr>
     		</thead></table>
     		<div id="mainTableDiv" style="position:relative;width:1200px;height:450px;overflow-y: scroll;overflow-x: hidden">
     		<table id="mainTable" lay-skin="nob" class="layui-table"
			id="table1" title="报表管理" 
			rowsDisplayed="15" style="width:1200px;top:100px;">
			<tbody>
			<c:forEach items="${pageInfo.entity }" var="schedule">
			<tr style="display:none"><td colspan="6"><input type="hidden" id="${schedule.jobName }_status" value="${schedule.status }"/></td></tr>
     		<tr>
     			<td class="col-check thin"><input name="" type="checkbox" value='${schedule.jobName }'></td>
				<td class="normal">${schedule.jobName }</td>
     			<%-- <td class="normal">${schedule.jobGroup }</td>
     			<td class="normal">${schedule.trigGroup }</td>
     			<td class="normal">${schedule.triggerName }</td> --%>
     			<td class="large">${schedule.scheduleTimerTypeCN }</td>
     			<td class="large">导出${schedule.dataMap.export }</td>
     			<td class="large">${schedule.dataMap.relateFile }</td>
     			<td class="huge">
	     			<a href="javascript:executeSchedule('${schedule.jobName }');"><i class="fa fa-hourglass">执行</i></a>
	     			<a href="javascript:stopSchedule('${schedule.jobName }');" id="${schedule.jobName }_stopbtn"><i class="fa fa-pause">停止</i></a>
	     			<a href="javascript:startSchedule('${schedule.jobName }');" id="${schedule.jobName }_startbtn"><i class="fa fa-play">部署</i></a>
	     			<a href="javascript:modSchedule('${schedule.jobName }');"><i class="fa fa-pencil">修改</i></a>
	     			<a href="javascript:deleteSchedule('${schedule.jobName }');"><i class="fa fa-close">删除</i></a>
	     		</td>
     		</tr>
     		<script>
     			if("1" == $('#${schedule.jobName }_status').val()){
     				$('#${schedule.jobName }_startbtn').hide();
     			}else{
     				$('#${schedule.jobName }_stopbtn').hide();
     			}
     		</script>
     		</c:forEach>
     		</tbody>
     		</table>
     		</div>
</form>
</div>
<div style="position:fixed;bottom:0px;background-color: white" align="right" class="layui-table-page">
<jsp:include page="Pager.jsp"></jsp:include>
</div>
<script>
top.window.onresize=function(){
	var mtd = document.getElementById('mainTableDiv');
	var mt = document.getElementById('mainTable');
	var targetHeight = 0;
	var h1 = top.window.innerHeight;
	targetHeight = parseInt(h1) - 100;
	if(targetHeight < 200){
		targetHeight = 200;
	}
	if(450 < targetHeight){
		targetHeight = 450;
	}
	mtd.style.height = targetHeight + "px";
	
}
</script>
</body>
</html>
