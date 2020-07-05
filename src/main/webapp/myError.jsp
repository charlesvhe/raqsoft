<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<title>报表异常信息</title>
<body>

<%
	Exception e = ( Exception ) request.getAttribute( "exception" );
	out.println( "<div style='color:red'>" + e.getMessage() + "</div>" );
%>

</body>
</html>