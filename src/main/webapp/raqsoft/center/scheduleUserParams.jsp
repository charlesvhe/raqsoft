<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.center.*"%>
<%@ page import="com.raqsoft.center.entity.*"%>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.center.schedule.ScheduleImpl" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<%
	String contextPath = request.getContextPath();
	com.raqsoft.center.Config config1 = com.raqsoft.center.Center.getConfig(application);
	boolean newsche = "yes".equals(request.getParameter("newsche"));
	newsche = newsche && request.getAttribute("schedule") == null;
	String params = request.getParameter("params");
	String userId = request.getParameter("userId");
	if(params == null) {
		params = (String)request.getAttribute("params");
	}
	if(userId == null){
		userId = (String)request.getAttribute("userId");
	}
	
	params = params == null ? "":params;
	
%>
<script type="text/javascript" src="<%=contextPath%>/js/jquery.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/userPersonal.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
</head>
<body>
<script type="text/javascript">
var params = '<%=params%>';
var userid = '<%=userId%>';
</script>
<div align="center">
	<div style="width:1000px">
			<div>
			<div align="center">
				<table lay-skin="nob" style="width:850px" class="layui-table">
		    		<thead>
		    			<tr>
		    				<td colspan=1></td>
		    				<td colspan=1>报表参数编辑</td>
		    				<td colspan=4>
								<input onclick="addReportParam();" type=button class='layui-btn layui-btn-sm' value="增加"/>
								<input onclick="delReportParam();" type=button class='layui-btn layui-btn-warm layui-btn-sm' value="删除选中"/>
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