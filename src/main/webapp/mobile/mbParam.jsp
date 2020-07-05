<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.net.*" %>

<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
	<title>手机版报表参数表单</title>
</head>
<body style="padding:0.5em 1em;" >
<%
	String arg = request.getParameter( "arg" );
	String match = request.getParameter( "match" );
	String rpx = request.getParameter( "rpx" );
	if( match == null ) match = "0";
	String resultPage = "/mobile/mbReport.jsp?rpx=" + URLEncoder.encode( rpx, "UTF-8" ) + "&match=" + match;
%>
<report:param name="param1" paramFileName="<%=arg%>"
	needSubmit="no"
	resultPage="<%=resultPage%>"
/>
<a style="margin:1em 0; background:#006CD9; border-radius:4px;color:#FFF;font-size:1em;font-family:微软雅黑; border: #005DBA 1px solid; display:block; text-align:center; line-height:3em;width:100%;"  href="javascript:_submit( document.getElementById('param1') )" group="">
查询</a>

</body>
</html>
