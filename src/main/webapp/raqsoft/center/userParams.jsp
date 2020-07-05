<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.raqsoft.center.*"%>
<%@page import="com.raqsoft.center.entity.*"%>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<%
	String contextPath = request.getContextPath();
	String userId = request.getParameter("userId");
	com.raqsoft.center.Config config1 = com.raqsoft.center.Center.getConfig(application);
	UserManager userManager = new UserManager(config1);
	com.raqsoft.center.entity.User user = userManager.getUser(userId);
	String params = user.getReportParams();
%>
<script type="text/javascript" src="<%=contextPath%>/js/jquery.js"></script>
<script type="text/javascript" src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/userPersonal.js"></script>
<script type="text/javascript" src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script>
var params = '<%=params%>';
var userId = '<%=userId%>';
function form_submit(){
	var submiturl = form.action;
	submiturl += "&userId="+userId;
	var paramsJson = inputToJson();
	submiturl += "&reportParams="+encodeURIComponent(paramsJson);
	$.ajax({
		type:'post',
		data:[],
		url:submiturl,
		success:function(){
			alert("保存成功");
			window.location="<%=contextPath%>/raqsoft/center/userParams.jsp?userId="+userId;
		}
	});
}

</script>
<style type="text/css">
.layui-input, .layui-select{
	width:130px
}
</style>
</head>
<body>
	<div align="center" class="layui" style="margin-top:20px"><%=user.getUserName() %>用户参数修改</div>
	<br>
	<div align="center">
	<div style="width:1000px">
		   <form id=form method=post
				action="<%=contextPath%>/reportCenterServlet?action=63">
			</form>
			<div>
			<div align="center">
				<table lay-skin="nob" style="width:820px" class="layui-table">
		    		<thead>
		    			<tr>
		    				<td colspan=1></td>
		    				<td colspan=1>报表参数编辑</td>
		    				<td colspan=4>
								<input onclick="addReportParam();" type=button class='layui-btn layui-btn-sm' value="增加"/>
								<input onclick="delReportParam();" type=button class='layui-btn layui-btn-warm layui-btn-sm' value="删除选中"/>
			    				<input type="button" style="float: right" class="layui-btn layui-btn-sm layui-btn-green" onclick="form_submit();" value="保存"/>
							</td>
		    			</tr>
		    			<tr>
		    				<th style="width:13px"></th>
		    				<th style="width:128px">名称</th>
		    				<th>描述</th>
		    				<th>数据类型</th>
		    				<th>参数值</th>
		    				<th>参数类型</th>
		    		</thead>
		    		<tbody id="reportParamTrs">
		    		</tbody>
		    	</table>
			</div>
			</div>
			</div>
			</div>
</body>
</html>