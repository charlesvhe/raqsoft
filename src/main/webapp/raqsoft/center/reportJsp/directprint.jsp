<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<body>
<%
	//此JSP参数格式为：report={无参数报表名}{报表1(参数1=value1;参数2=value2;...)}{报表2(参数1=value1;参数2=value2;...)}...&prompt=yes&needSelectPrinter=yes
	request.setCharacterEncoding( "UTF-8" );
  	String report = request.getParameter( "report" );
  	if( report == null || report.trim().length() == 0 ) throw new Exception( "请输入报表文件名及参数串report={无参数报表名}{报表1(参数1=value1;参数2=value2;...)}{报表2(参数1=value1;参数2=value2;...)}..." );
	String prompt = request.getParameter( "prompt" );
	String needSelectPrinter = request.getParameter( "needSelectPrinter" );
	String pages = request.getParameter( "pages" );
	String copies = request.getParameter( "copies" );
	if( pages == null ) pages = "";
	if( copies == null ) copies = "1";
	
  	String appmap = request.getContextPath();
  	String serverPort = String.valueOf( request.getServerPort() );
	String serverName = request.getServerName();
	String appRoot = "http://" + serverName + ":" + serverPort + appmap;
%>
	<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93"	codebase="<%=appRoot%>/jre-6u24-windows-i586.exe#Version=1,6,0,0"	width="80" height="32" id="report1_directPrintApplet" style="vertical-align:middle">	
		<param name="name" value="report1_directPrintApplet">	
		<param name="code" value="com.raqsoft.report.view.applet.DirectPrintWithoutShow.class">	
		<param name="archive" value="<%=appmap%>/raqsoftReportApplet.jar">	
		<param name="type" value="application/x-java-applet;version=1.6">	
		<param name="appRoot" value="<%=appRoot%>">	
		<param name="dataServlet" value="/reportServlet;jsessionid=<%=session.getId()%>?action=1">	
		<param name="fileName" value="<%=report%>">	
		<param name="srcType" value="file">	
		<param name="fontFace" value="宋体">	
		<param name="fontSize" value="10pt">	
		<param name="fontColor" value="#808040">	
		<param name="backColor" value="#126356">	
		<param name="label" value="打印">		
		<param name="needPrintPrompt" value="<%=prompt%>">
		<param name="needSelectPrinter" value="<%=needSelectPrinter%>">
		<param name="needSetPageSize" value="no">
		<param name="scriptable" value="true">
		<param name="paramCharset" value="UTF-8">
		<param name="blackWhitePrint" value="no">
		<param name="mirrorPrint" value="no">
		<param name="icon" value="/raqsoft/images/print.gif">
		<param name="copies" value="<%=copies%>">
		<param name="pages" value="<%=pages%>">
		<comment>
		<embed type="application/x-java-applet;version=1.6" width="80" height="32" id="report1_directPrintApplet" 
			code="com.raqsoft.report.view.applet.DirectPrintWithoutShow.class"
			archive="<%=appmap%>/raqsoftReportApplet.jar"
			type="application/x-java-applet;version=1.6"
			appRoot="<%=appRoot%>"
			dataServlet="/reportServlet;jsessionid=<%=session.getId()%>?action=1"
			fileName="<%=report%>"
			srcType="file"
			fontFace="宋体"
			fontSize="10pt"
			fontColor="#808040"
			backColor="#126356"
			label="打印"
			needPrintPrompt="<%=prompt%>"
			needSelectPrinter="<%=needSelectPrinter%>"
			needSetPageSize="no"
			scriptable="true"
			paramCharset="UTF-8"
			blackWhitePrint="no"
			mirrorPrint="no"
			copies="<%=copies%>"
			pages="<%=pages%>"
			icon="/raqsoft/images/print.gif">
		</embed>	
		</comment>
	</object>

<script language=javascript>
	/*
	function raqsoft_printOver() {
		window.close();
	}*/
</script>

</body>
</html>
