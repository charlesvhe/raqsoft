<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.view.*" %>
<html>
<head>
<%
	//request.setCharacterEncoding( "UTF-8" );
	String src = request.getParameter( "src" );
	String url = URLEncoder.encode( src, "UTF-8" );
	String domain = ReportServlet.jsDomain.trim();
	if( domain.length() > 0 ) { %>
		<script type="text/javascript">
			document.domain = "<%=domain%>";
		</script>
	<%}
%>
</head>
<body>
<script type="text/javascript" src="../easyui/jquery.min.js"></script>
<script type="text/javascript" src="print.min.js"></script>
<script language=javascript>
	var ua = window.navigator.userAgent.toLowerCase();
	if( ua.indexOf( "msie" ) >= 0 || ua.indexOf( "edge" ) >= 0 || ua.indexOf( "trident" ) >= 0 ) {
		if( document.documentMode < 9 || "<%=ReportConfig.pdfPrintUseJSInIE%>" != "yes" ) {   //°æ±¾µÍÓÚIE9
			document.writeln( '<object classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" id=pdfobj width="100%" height="100%" border="0">' );
			document.writeln( '<param name="SRC" value="<%=src%>">' );
			document.writeln( '</object>' );
			$( document ).ready( function(){ myprint(); } );
		}
		else {
			var url = "<%=url%>";
			window.open( "in_ie/web/viewer_ie.html?file=" + url, "raq_pdf_print_win", "width=100,height=100,top=2000,left=2000" );
		}
	}
	else if( ua.indexOf( "chrome" ) >= 0 ) {
		printJS({
			printable: '<%=src%>',
			type: 'pdf',
			onLoadingEnd: function(){ parent.closeToast();}
		});
	}
	else {
		var url = "<%=url%>";
		document.writeln( '<iframe src="web/viewer.html?file=' + url + '" style="width:600px;height:500px"></iframe>' );
	}
	
	function myprint() {
		document.getElementById( "pdfobj" ).PrintAll();
		parent.closeToast();
		try{ parent.raqsoft_printOver();}catch(ex){}
	}
	
</script>
</body>
</html>
