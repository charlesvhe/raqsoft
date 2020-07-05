<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.usermodel.Context"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.report.util.*"%>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
	String title = request.getParameter( "title" );
	if( title == null ) title = "手机版报表";
%>

<html>
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1" />
	<title><%=title%></title>
</head>
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/locale/easyui-lang-<%=ReportUtils2.getEasyuiLanguage(request)%>.js"></script>

<body style="margin:0px 3px">
<jsp:include page="echartjs.jsp" flush="false" />
<%
	String report = request.getParameter( "rpx" );
	if( report.lastIndexOf(".rpx") <= 0 ){
		report = report + ".rpx";
	}
	String match = request.getParameter( "match" );
	if (match==null || match.length()==0) match = "1";
	String isQuery = request.getParameter( "isQuery" );
	if( isQuery == null ) isQuery = "0";
	String backUrl = request.getParameter( "back_url" );
	if( "1".equals( isQuery ) ) {
		backUrl += "&reportParamsId=" + request.getParameter( "reportParamsId" );
	}
	StringBuffer param = new StringBuffer();
	
	Enumeration paramNames = request.getParameterNames();
	if( paramNames != null ) {
		while( paramNames.hasMoreElements() ){
			String paramName = (String) paramNames.nextElement();
			if( "rpx".equals( paramName ) || "match".equals( paramName ) || "title".equals( paramName ) || "isQuery".equals( paramName ) ) continue;
			String paramValue = request.getParameter( paramName );
			if( paramValue != null ){
				param.append( paramName ).append( "=" ).append( paramValue ).append( ";" );
			}
		}
	}
%>
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="<%=appmap%><%=ReportConfig.raqsoftDir%>/images/loading.gif"><br><%=ServerMsg.getMessage(request,"jsp.loading")%></td></tr>
	</table>
</div>
<div id=reportArea class="easyui-layout" data-options="fit:true" style="display:none;width:100%;height:100%">
	<div id=reportContainer data-options="region:'center',border:false" style="text-align:center">
		<report:html name="report1" reportFileName="<%=report%>"
			funcBarLocation="no"
			generateParamForm="no"
			params="<%=param.toString()%>"
			needImportEasyui="no"
		/>
	</div>
	<div id=tooldiv data-options="region:'south',border:false" style="width:100%;height:41px;">
		<table width=100% cellspacing=0 cellpadding=0><tr>
			<td id=filterTd width=70 align=center><img src="filter.png" width=40 onclick="document.location='<%=backUrl%>'"></td>
			<td class=fanye align=right><img src="previous.png" width=40 onclick="prevPage('report1')"></td>
			<td class=fanye align=center width=70><span id="report1_currPage"></span>/<span id=totalPage></span></td>
			<td class=fanye align=left><img src="next.png" width=40 onclick="nextPage('report1')"></td>
		</tr></table>
	</div>
</div>
<script language="javascript">
	try {
		document.getElementById( "totalPage" ).innerHTML = getPageCount( "report1" );
		document.getElementById( "report1_currPage" ).innerHTML = getCurrPage( "report1" );
		if( "<%=isQuery%>" != "1" ) document.getElementById( "filterTd" ).style.display = "none";
		if( getPageCount( "report1" ) == 1 ) $(".fanye").css( "display", "none" );
		if( getPageCount( "report1" ) == 1 && "<%=isQuery%>" != "1" ) $("#tooldiv").css("height","0px");
	}catch(e){}
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
	function matchReport() {
		reportMatchSize( document.getElementById( "reportContainer" ), document.getElementById( "report1_reportDiv" ), <%=match%> );
	}
	$(document).ready( function(){
		matchReport();
	});
</script>

</body>
</html>
