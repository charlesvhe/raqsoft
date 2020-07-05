<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.common.*" %>
<html>
<body>
<%
	Throwable e = ( Throwable ) request.getAttribute( "exception" );
	out.println( "<script language=\"javascript\">" );
	out.println( "alert(\"" + Escape.add( e.getMessage() ) + "\");" );
	out.println( "</script>" );
%>
</body>
</html>
