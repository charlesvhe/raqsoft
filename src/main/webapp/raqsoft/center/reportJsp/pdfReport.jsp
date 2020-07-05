<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.net.*" %>
<%@ page import="java.util.*" %>

<html>
<title>PDF展现报表</title>
<head>
</head>
<body>
<%
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
	String rpx = request.getParameter( "rpx" );
	if( !rpx.endsWith( ".rpx" ) ) rpx += ".rpx";
	String url = appmap + "/reportServlet?action=6&file=" + URLEncoder.encode( rpx, "UTF-8" ) + "&srcType=file&paged=1&print=1";
	StringBuffer param = new StringBuffer();
	Enumeration paramNames = request.getParameterNames();
	if( paramNames != null ){
		while( paramNames.hasMoreElements() ){
			String paramName = (String) paramNames.nextElement();
			String paramValue = request.getParameter(paramName);
			if( paramValue != null ){
				//把参数拼成name=value;name2=value2;.....的形式
				param.append(paramName).append("=").append(paramValue).append(";");
			}
		}
	}
	if( param.length() > 0 ) {
		url += "&paramString=" + URLEncoder.encode( param.toString(), "UTF-8" );
	}
%>
<object classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" id=pdfobj width="100%" height="100%" border="1">
	<param name="_Version" value="65539"> 
	<param name="_ExtentX" value="20108"> 
	<param name="_ExtentY" value="10866"> 
	<param name="_StockProps" value="0"> 
	<param name="SRC" value="<%=url%>"> 
	<comment>
		<embed id=pdfobj src="<%=url%>" width="100%" height="95%"></embed>
	</comment>
</object>

</body>
</html>
