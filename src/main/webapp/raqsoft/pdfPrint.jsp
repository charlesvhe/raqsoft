<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.view.*" %>
<html>
<title>PDF打印报表</title>
<head>
</head>
<body>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	//request.setCharacterEncoding( "GBK" );
	String src = request.getParameter( "src" );
	String url = URLEncoder.encode( src, "UTF-8" );
%>
<script language=javascript>
	var ua = window.navigator.userAgent.toLowerCase();
	if( ua.indexOf( "msie" ) >= 0 || ua.indexOf( "edge" ) >= 0 || ua.indexOf( "trident" ) >= 0 ) {
		if( document.documentMode < 9 || "<%=ReportConfig.pdfPrintUseJSInIE%>" != "yes" ) {   //版本低于IE9
			document.writeln( '<object classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" id=pdfobj width="100%" height="100%" border="0">' );
			document.writeln( '<param name="SRC" value="<%=src%>">' );
			document.writeln( '</object>' );
			$( document ).ready( function(){ myprint(); } );
		}
		else {
			var url = "<%=url%>";
			document.location = "pdfjs/in_ie/web/viewpdf.html?file=" + url;
		}
	}
	else {
		document.writeln( '<embed id=pdfobj1 type="application/pdf" src="<%=src%>" width="100%" height="95%"></embed>' );
	}
</script>
</body>
</html>
