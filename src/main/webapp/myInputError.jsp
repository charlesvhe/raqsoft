<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<title>填报数据保存异常信息</title>
<body>

<%
	Exception e = ( Exception ) request.getAttribute( "exception" );
	out.println( "<div style='color:blue'>" + e.getMessage() + "</div>" );
%>

</body>
</html>