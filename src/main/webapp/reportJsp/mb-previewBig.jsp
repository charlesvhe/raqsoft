<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.raqsoft.report.usermodel.Context"%>
<%@ page import="com.raqsoft.dm.*"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.report.util.*"%>

<html>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link type="text/css" href="css/style.css" rel="stylesheet"/>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
%>
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/<%=ReportConfig.theme%>/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/locale/easyui-lang-<%=ReportUtils2.getEasyuiLanguage(request)%>.js"></script>

<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0 style="background:#F1F4F7">
<%
	String oldRpxHome = Context.getInitCtx().getMainDir();
	String oldDfxHome = Env.getMainPath();
	String report = request.getParameter( "rpx" );
	String rpxHome = request.getParameter( "rpxHome" );
	String dfxHome = request.getParameter( "dfxHome" );
	Context.getInitCtx().setMainDir( rpxHome );
	Env.setMainPath( dfxHome );
	try {
		String argRpx = request.getParameter( "arg" );
%>
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="../raqsoft/images/loading.gif"><br><%=ServerMsg.getMessage(request,"jsp.loading")%></td></tr>
	</table>
</div>
<div id=reportArea class="easyui-layout" data-options="fit:true" style="display:none;width:100%;height:100%">
<div data-options="region:'north',border:false" style="height:30px;overflow:hidden">
<jsp:include page="mb-bigtoolbar.jsp" flush="false" />
</div>
<div data-options="region:'center',border:false">
<div class="easyui-layout" data-options="fit:true">
	<%	//如果参数模板存在，则显示参数模板
	if( argRpx != null ) {
	%>
		<div data-options="region:'north',border:false"><center>
			<table id="param_tbl"><tr><td>
				<report:param name="form1" paramFileName="<%=argRpx%>"
					needSubmit="no"
					exceptionPage="/reportJsp/myError2.jsp"
					needImportEasyui="no"
					mobileMode="no"
				/>
			</td>
			<td style="padding-left:15px"><a href="javascript:_submit( form1 )" class="easyui-linkbutton" style="vertical-align:middle;padding:0px 8px;"><%=ServerMsg.getMessage(request,"jsp.query")%></a></td>
			</tr></table>
		</center></div>
	<% }%>
	<div id=reportContainer data-options="region:'center',border:false" style="text-align:center">
		<report:big name="report1" reportFileName="<%=report%>"
			exceptionPage="/reportJsp/myError2.jsp"
			rowNumPerPage="20"
			fetchSize="1000"
			needImportEasyui="no"
		/>
	</div>
</div>
</div>
<%
	} finally {
		Context.getInitCtx().setMainDir( oldRpxHome );
		Env.setMainPath( oldDfxHome );
	}
%>
<script language="javascript">
	//设置分页显示值
	try {
		document.getElementById( "report1_totalPage" ).innerHTML = getPageCount( "report1" );
		document.getElementById( "report1_currPage" ).innerHTML = getCurrPage( "report1" );
	}catch(e){}
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
</script>

</body>
</html>
