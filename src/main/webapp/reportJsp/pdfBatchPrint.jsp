<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.view.*"%>
<html>
<head>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	String appmap = request.getContextPath();
%>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/pdfjs/toast/javascript/jquery.toastmessage.js"></script>
<link href="<%=appmap%><%=ReportConfig.raqsoftDir%>/pdfjs/toast/resources/css/jquery.toastmessage.css" type="text/css" rel="stylesheet" />
<title>PDF打印报表</title>
<script language=javascript>
	var myToast;
	function showToast() {
		myToast = $().toastmessage('showToast', {
		    text     : '<%=ServerMsg.getMessage(request,"jsp.loadingPrint")%>',
		    sticky   : true,
		    position : 'middle-center',
		    type:         'notice'
		});		
	}
	function closeToast() {
		$().toastmessage('removeToast', myToast);
	}
</script>
</head>
<body>
<%
	//此JSP参数格式为：report={无参数报表名}{报表1(参数1=value1;参数2=value2;...)}{报表2(参数1=value1;参数2=value2;...)}
	request.setCharacterEncoding( "UTF-8" );
  	String report = request.getParameter( "report" );
  	if( report == null || report.trim().length() == 0 ) throw new Exception( "请输入报表文件名及参数串report={无参数报表名}{报表1(参数1=value1;参数2=value2;...)}{报表2(参数1=value1;参数2=value2;...)}..." );
  	String src = request.getContextPath() + ServletMappings.getMapping( "com.raqsoft.report.view.ReportServlet" ) + "?action=45&report=" + URLEncoder.encode( report, "UTF-8" );
  	String preview = request.getParameter( "preview" );
  	if( "no".equalsIgnoreCase( preview ) ) {
  		String url = appmap + ReportConfig.raqsoftDir + "/pdfjs/pdfDirectPrint.jsp?src=" + URLEncoder.encode( src, "UTF-8" );
  	%>
  		<iframe src="<%=url%>" style="position:absolute;left:-100px;top:-100px" width=50 height=50></iframe>
		<script language=javascript>
			showToast();
		</script>
  	<%
  	}
	else {
%>
<object classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" id=pdfobj width="100%" height="100%" border="0">
	<param name="_Version" value="65539"> 
	<param name="_ExtentX" value="20108"> 
	<param name="_ExtentY" value="10866"> 
	<param name="_StockProps" value="0"> 
	<param name="SRC" value="<%=src%>"> 
	<comment>
		<embed id=pdfobj1 type="application/pdf" src="<%=src%>" width="100%" height="95%"></embed>
	</comment>
</object>
<% } %>

</body>
</html>
