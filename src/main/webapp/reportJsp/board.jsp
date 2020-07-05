<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.util.*"%>
<%@ page import="com.raqsoft.report.usermodel.*"%>
<%@ page import="com.raqsoft.report.cache.*"%>
<%@ page import="com.raqsoft.report.util.*"%>
<%@ page import="com.raqsoft.report.view.html.*"%>

<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String report = request.getParameter( "board" );
	String boardId = request.getParameter( "boardId" );
	if( boardId == null ) boardId = "b" + System.currentTimeMillis();
	String groupId = request.getParameter( "groupId" );
	Context context = new Context();
	ReportEntry entry = ReportUtils2.getReportEntry( report, "file", request, context );
	IReport define = entry.getReportDefine();
	String paramId = null;
	ReportUtils2.putParamMacro2Context( define, paramId, context, request );
	ReportCache cache = entry.getReportCache( context, -1 );
	IReport ireport = cache.getReport();
	HtmlReport htmlreport = new HtmlReport( ireport, boardId, request.getContextPath(), request );
	htmlreport.setContext( context );
	out.println( htmlreport.generateHtml() );
%>
<script language=javascript>
	try{ _resizeBoard( "<%=groupId%>" );}catch(e){}
</script>
