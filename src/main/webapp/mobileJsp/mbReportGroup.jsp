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
	if( title == null ) title = "手机版报表组";
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
	String report = request.getParameter( "rpg" );
	if( report.lastIndexOf(".rpg") <= 0 ){
		report = report + ".rpg";
	}
	String match = request.getParameter( "match" );
	if (match==null || match.length()==0) match = "1";
	String isQuery = request.getParameter( "isQuery" );
	if( isQuery == null ) isQuery = "0";
	String backUrl = request.getParameter( "back_url" );
	if( "1".equals( isQuery ) ) {
		backUrl += "&reportParamsId=" + request.getParameter( "reportParamsId" );
	}
	String needPaged = request.getParameter( "needPaged" );
	if( needPaged == null ) needPaged = "no";
	StringBuffer param = new StringBuffer();
	
	Enumeration paramNames = request.getParameterNames();
	if( paramNames != null ) {
		while( paramNames.hasMoreElements() ){
			String paramName = (String) paramNames.nextElement();
			if( "rpg".equals( paramName ) || "match".equals( paramName ) || "title".equals( paramName ) || "isQuery".equals( paramName ) ) continue;
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
		<report:group groupId="group1" groupFileName="<%=report%>"
			funcBarLocation="no"
			width="100%"
			height="100%"
			exceptionPage="/reportJsp/myError2.jsp"
			params="<%=param.toString()%>"
			needImportEasyui="no"
			needPaged="<%=needPaged%>"
			sheetAlign="center"
			matchScreen="<%=match%>"
		/>
	</div>
	<div data-options="region:'south',border:false" style="width:100%;height:41px;">
		<table id=toolbar width=100% cellspacing=0 cellpadding=0><tr>
			<td id=filterTd width=70 align=center><img src="filter.png" width=40 onclick="document.location='<%=backUrl%>'"></td>
			<td align=right><img src="previous.png" width=40 onclick="group_prevPage('group1')"></td>
			<td align=center width=70><span id="group1_currPage"></span>/<span id=group1_totalPage></span></td>
			<td align=left><img src="next.png" width=40 onclick="group_nextPage('group1')"></td>
		</tr></table>
	</div>
</div>
<script language="javascript">
	try {
		if( "<%=isQuery%>" != "1" ) document.getElementById( "filterTd" ).style.display = "none";
		if( $("#group1").attr("paged") == null ) {
			var toolTbl = document.getElementById( "toolbar" );
			toolTbl.rows[0].cells[1].style.display = "none";
			toolTbl.rows[0].cells[2].style.display = "none";
			toolTbl.rows[0].cells[3].style.display = "none";
		}
	}catch(e){}
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
</script>

</body>
</html>
