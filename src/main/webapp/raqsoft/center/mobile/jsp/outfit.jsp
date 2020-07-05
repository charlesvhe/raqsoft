<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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
    <a class="mui-icon mui-icon-back mui-pull-left" href="./index.jsp"></a>
	<h1 class="mui-title">应用</span>
</header>
<body>
<div style="padding-top:10px"><iframe id="mainframe" style="border:none;padding-bottom:0px;padding-top:45px;width:100%;height:98%" src="<%=src%>"></iframe></div>

</body>
</html>