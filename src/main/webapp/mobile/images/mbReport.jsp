<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.usermodel.Context"%>

<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
</head>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
	String reportParamsId = request.getParameter( "reportParamsId" );
	String bkcolor = request.getParameter( "bkcolor" );
	if( bkcolor == null ) bkcolor = "white";
%>
<script language="javascript">
	window.screen.orientation.lock("portrait-primary");
	alert( window.screen.orientation.lock );
	function phoneNoLongpressed( event ) {
		var cell = event.target;
		var pno = cell.innerHTML;
		if( pno != "" ) phoneCall( pno );
	}
	function setReportParamsId() {
		var paramsId = "<%=reportParamsId%>";
		if( paramsId == "null" ) paramsId = "";
		window.reportApp.setReportParamsId( paramsId );
	}
</script>
<link rel="stylesheet" type="text/css" href="<%=appmap%>/raqsoft/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%>/raqsoft/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%>/raqsoft/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/easyui/locale/easyui-lang-zh_CN.js"></script>

<body style="margin:0px;background-color:#<%=bkcolor%>">
<jsp:include page="echartjs.jsp" flush="false" />
<%
	String report = request.getParameter( "rpx" );
	String scroll = request.getParameter( "scroll" );
	if (scroll==null || scroll.length()==0) scroll = "no";
	String matchScreen = request.getParameter( "match" );
	if( matchScreen == null ) matchScreen = "0";
	StringBuffer param=new StringBuffer();
	
	//保证报表名称的完整性
	int iTmp = 0;
	if( (iTmp = report.lastIndexOf(".rpx")) <= 0 ){
		iTmp = report.length();
		report = report + ".rpx";
	}
	
	Enumeration paramNames = request.getParameterNames();
	if(paramNames!=null){
		while(paramNames.hasMoreElements()){
			String paramName = (String) paramNames.nextElement();
			String paramValue=request.getParameter(paramName);
			if(paramValue!=null){
				//把参数拼成name=value;name2=value2;.....的形式
				param.append(paramName).append("=").append(paramValue).append(";");
			}
		}
	}
%>
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="../raqsoft/images/loading.gif"><br>正在加载报表......</td></tr>
	</table>
</div>
<div id=reportArea style="text-align:left;border:0px solid red">
	<report:html name="report1" reportFileName="<%=report%>"
		funcBarLocation="no"
		generateParamForm="no"
		params="<%=param.toString()%>"
		exceptionPage="/reportJsp/myError2.jsp"
		needImportEasyui="no"
		width="-1"
		height="-1"
		matchScreen="<%=matchScreen%>"
	/>
</div>
<script language="javascript">
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
</script>
</body>
</html>
