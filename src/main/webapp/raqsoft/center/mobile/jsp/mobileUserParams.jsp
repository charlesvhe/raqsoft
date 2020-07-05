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
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/userPersonal.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script>
var params = '<%=params%>';
var userId = '<%=userId%>';
function form_submit(){
	var submiturl = form.action;
	submiturl += "&userId="+userId;
	var paramsJson = inputToJson2();
	submiturl += "&reportParams="+encodeURIComponent(paramsJson);
	$.ajax({
		type:'post',
		data:[],
		url:submiturl,
		success:function(){
			alert("保存成功");
			window.location="<%=contextPath%>/raqsoft/center/mobile/jsp/mobileUserParams.jsp?userId="+userId;
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
	<div align="center" class="layui" style="margin-top:20px"><%=user.getUserName() %>用户参数修改(<font id="count"></font>)</div>
	<br>
	<div align="center">
	<div style="width:100%">
		   <form id=form method=post
				action="<%=contextPath%>/reportCenterServlet?action=63">
			</form>
			<div>
			<div align="center">
				<table lay-skin="nob" style="width:100%" class="layui-table">
		    		<thead>
		    			<tr>
		    				<td colspan=4 align="center">
		    				<span onclick="former();" style="float:left">left</span>
		    				<span id="btn_td" style="margin-top:2px"><input onclick="addReportParam2();" type=button class='layui-btn layui-btn-sm' value="增加参数"/><input onclick="delReportParam2();" type=button class="layui-btn layui-btn-warm layui-btn-sm" value="删除参数"/></span>
		    				<span onclick="next();" style="float:right">right</span>
							</td>
		    			</tr>
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