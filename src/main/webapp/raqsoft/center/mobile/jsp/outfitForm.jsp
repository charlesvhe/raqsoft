<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.raqsoft.report.view.*"%>
<!DOCTYPE>
<html>
<%
	String src = request.getParameter("inner");
	if(src == null){
		src = "error.jsp";
	}
	String contextPath = request.getContextPath();
	String backTo = request.getParameter("back");
	if(backTo == null){
		backTo = request.getHeader("REFERER");
	}
	String submitFunc = request.getParameter("submitFunction");
%>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<link href="../css/mui.min.css" rel="stylesheet" />
		<link href="../css/style.css" rel="stylesheet" />
		<script src="../js/mui.min.js"></script>
		<script src="../js/mui.enterfocus.js"></script>
		<script src="../js/app.js"></script>
		<script src="<%=contextPath %>/raqsoft/easyui/jquery.min.js"></script>
		<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
		<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
		<script>
			function outSubmit(submitFunc){//调用子窗口的提交方法
				var mf = document.getElementById("mainframe");
				eval("mf.contentWindow."+submitFunc+"()");
			}
		</script>
		<style>
			html,
			body {
				background-color: #efeff4;
			}
		</style>
		<script>
			mui.init();
		</script>
	</head>
<header class="mui-bar mui-bar-nav">
    <a class="mui-icon mui-icon-back mui-pull-left" href="javascript:top.window.location='./outfit.jsp?inner='+encodeURIComponent('<%=backTo %>');"></a>
    <h1 class="mui-title">报表中心</h1>
    <input type="button" value="保存" onclick="outSubmit('<%=submitFunc %>');" id="loginbtn" style="margin-top:6px;" class="layui-btn layui-btn-sm layui-bg-green mui-pull-right"/>
</header>
<body>
<div style="padding-top:10px"><iframe id="mainframe" style="border:none;padding-top:45px;padding-bottom:0px;width:100%;height:100%" src="<%=src%>"></iframe></div>
</body>
</html>