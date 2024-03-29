<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ taglib uri="/WEB-INF/raqsoftInput.tld" prefix="raqsoft" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.usermodel.*"%>
<%@ page import="com.raqsoft.dm.Env"%>
<%@ page import="com.raqsoft.input.view.*"%>
<%@ page import="com.raqsoft.input.model.resources.*"%>
<%@ page import="com.raqsoft.input.tag.*"%>
<%@ page import="com.raqsoft.report.util.*"%>
<%@ page import="com.raqsoft.report.view.*"%>
<html>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title><%=InputMessage.get(request).getMessage("input.web7")%></title>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
%>
<link rel="stylesheet" type="text/css" href="<%=appmap%>/raqsoft/easyui/themes/<%=ReportConfig.theme%>/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%>/raqsoft/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%>/raqsoft/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/easyui/locale/easyui-lang-<%=ReportUtils2.getEasyuiLanguage(request)%>.js"></script>

<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0 style="background:#F1F4F7">
<%
	String oldRpxHome = Context.getInitCtx().getMainDir();
	String oldDfxHome = Env.getMainPath();
	String oldInputHome = Config.getMainPath();
	String input = request.getParameter( "sht" );
	String rpxHome = request.getParameter( "rpxHome" );
	String dfxHome = request.getParameter( "dfxHome" );
	Context.getInitCtx().setMainDir( rpxHome );
	Env.setMainPath( dfxHome );
	Config.setMainPath( rpxHome );
	try{
		String dataFile = request.getParameter( "dataFile" );
		String fileType = request.getParameter( "fileType" );
		if (fileType == null) fileType = "json";
		String argRpx = request.getParameter( "arg" );
		String sgid = InputTag.getInputId();
%>
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="../raqsoft/images/loading.gif"><br><%=InputMessage.get(request).getMessage("input.web8")%>......</td></tr>
	</table>
</div>
<div id=reportArea class="easyui-layout" data-options="fit:true" style="display:none;width:100%;height:100%">
	<div data-options="region:'north',border:false" style="height:30px;overflow:hidden">
		<jsp:include page="mb-inputtoolbar.jsp" flush="false" >
			<jsp:param name="sgid" value="<%=sgid %>"></jsp:param>
		</jsp:include>
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
						needImportEasyui="no"
					/>
				</td>
				<td style="padding-left:15px"><a href="javascript:_submit( form1 )" class="easyui-linkbutton" style="vertical-align:middle;padding:0px 8px;"><%=InputMessage.get(request).getMessage("input.web9")%></a></td>
				</tr></table>	
			</center></div>
		<% }%>
		<div id=reportContainer data-options="region:'center',border:false" style="text-align:center">
			<raqsoft:input id="<%=sgid%>"
				src="<%=input%>" 
				paramMode="i"
				excel="io"
				needImportEasyui="no"
				width="100%"
				height="100%"
				tabLocation="bottom"
				file="<%=dataFile%>"
				fileType="<%=fileType%>"
				outerDim="id"
				exceptionPage="myError.jsp"
			/>
		</div>
	</div>
</div>
<%
	} finally {
		Context.getInitCtx().setMainDir( oldRpxHome );
		Env.setMainPath( oldDfxHome );
		Config.setMainPath( oldInputHome );
	}
%>
<script language="javascript">
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
</script>

</body>
</html>
