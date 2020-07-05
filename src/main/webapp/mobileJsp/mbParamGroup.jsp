<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%
	request.setCharacterEncoding( "UTF-8" );
	String arg = request.getParameter( "arg" );
	String match = request.getParameter( "match" );
	String rpg = request.getParameter( "rpg" );
	if( match == null ) match = "1";
	String backUrl = request.getRequestURI() + "?arg=" + URLEncoder.encode( arg, "UTF-8" ) + "&rpg=" + URLEncoder.encode( rpg, "UTF-8" ) +
		"&match=" + match;
	String title = request.getParameter( "title1" );
	if( title == null ) title = "输入报表组查询参数";
	else backUrl += "&title1=" + URLEncoder.encode( title, "UTF-8" );
	String appmap = request.getContextPath();
	String resultPage = appmap + "/mobileJsp/mbReportGroup.jsp?rpg=" + URLEncoder.encode( rpg, "UTF-8" ) + "&isQuery=1&match=" + match;
	String needPaged = request.getParameter( "needPaged" );
	if( needPaged != null ) {
		resultPage += "&needPaged=" + needPaged;
		backUrl += "&needPaged=" + needPaged;
	}
	String title2 = request.getParameter( "title2" );
	if( title2 != null ) {
		resultPage += "&title=" + URLEncoder.encode( title2, "UTF-8" );
		backUrl += "&title2=" + URLEncoder.encode( title2, "UTF-8" );
	}
	resultPage += "&back_url=" + URLEncoder.encode( backUrl, "UTF-8" );
%>

<html>
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
	<title><%=title%></title>
</head>
<body style="padding:0.5em 1em;" >
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<report:param name="param1" paramFileName="<%=arg%>"
	needSubmit="no"
	mobileMode="yes"
	resultPage="<%=resultPage%>"
/>
<a style="margin:1em 0; background:#006CD9; border-radius:4px;color:#FFF;font-size:1em;font-family:微软雅黑; border: #005DBA 1px solid; display:block; text-align:center; line-height:3em;width:100%;"  href="javascript:_submit( document.getElementById('param1') )" group="">
查询</a>

</body>
</html>
