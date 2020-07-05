<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
	<title>汇总伸缩表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<!-- 引入样式文件 -->
	<link type="text/css" href="css/style.css" rel="stylesheet"/>
</head>
<%
	String report = "/30交互报表/汇总伸缩表.rpx";
%>

<body class="easyui-layout" onload="try{parent.hideLoading()}catch(e){}">
<div data-options="region:'north',border:false" style="overflow:hidden">
	<jsp:include page="toolbar.jsp" flush="false" />
</div>
<div data-options="region:'center',border:false" style="text-align:center">
	<report:html name="report1" reportFileName="<%=report%>"
		funcBarLocation="no"
		needPageMark="yes"
		generateParamForm="no"
		params=""
		isOlap="yes"
		foldOnBegin="no"
	/>
</div>
<script language="javascript">
	//设置分页显示值
	try {
		document.getElementById( "t_page_span" ).innerHTML = getPageCount( "report1" );
		document.getElementById( "report1_currPage" ).innerHTML = getCurrPage( "report1" );
	}catch(e){}
</script>
</body>
</html>