<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.raqsoft.report.usermodel.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.report.util.*"%>
<html>
<head>
    <meta name="viewport" content="initial-scale=1" />
</head>
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
<script type="text/javascript"> $.parser.auto = false; </script>

<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0 style="background:#F1F4F7" onload="try{parent.hideLoading()}catch(e){}">
<jsp:include page="echartjs.jsp" flush="false" />
<%
	String report = request.getParameter( "rpg" );
	StringBuffer param=new StringBuffer();
	
	//保证报表名称的完整性
	int iTmp = 0;
	if( (iTmp = report.lastIndexOf(".rpg")) <= 0 ){
		iTmp = report.length();
		report = report + ".rpg";
	}
	Enumeration paramNames = request.getParameterNames();
	if(paramNames!=null){
		while(paramNames.hasMoreElements()){
			String paramName = (String) paramNames.nextElement();
			String paramValue=request.getParameter(paramName);
			if(paramValue!=null){
				//把参数拼成name=value;name2=value2;.....的形式
				param.append(paramName).append("=").append(paramValue).append(";");
			}
		}
	}
	String needPaged = request.getParameter( "needPaged" );
	if( needPaged == null ) needPaged = "no";
	String resultPage = "queryGroup.jsp?rpg=" + URLEncoder.encode( report, "UTF-8" ) + "&needPaged=" + needPaged;

	//以下代码是检测这个报表是否有相应的参数模板
	String paramFile = report.substring( 0, iTmp ) + "_arg.rpx";
	boolean hasParam = ReportUtils.isReportFileExist( paramFile );
%>
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="../raqsoft/images/loading.gif"><br><%=ServerMsg.getMessage(request,"jsp.loading")%></td></tr>
	</table>
</div>
<div id=reportArea class="easyui-layout" data-options="fit:true" style="display:none;width:100%;height:100%">
<div data-options="region:'north',border:false" style="height:30px;overflow:hidden">
	<jsp:include page="grouptoolbar.jsp" flush="false" />
</div>
<div data-options="region:'center',border:false">
<div class="easyui-layout" data-options="fit:true">
	<%	//如果参数模板存在，则显示参数模板
	if( hasParam ) {
	%>
		<div data-options="region:'north',border:false"><center>
			<table id=param_tbl><tr><td>
				<report:param name="form1" paramFileName="<%=paramFile%>"
					needSubmit="no"
					params="<%=param.toString()%>"
					hiddenParams="<%=param.toString()%>"
					needImportEasyui="no"
					resultContainer="reportContainer"
					resultPage="<%=resultPage%>"
				/>
			</td>
			<td style="padding-left:15px"><a href="javascript:_submit( form1 )" class="easyui-linkbutton" style="vertical-align:middle;padding:0px 8px;"><%=ServerMsg.getMessage(request,"jsp.query")%></a></td>
			</tr></table>
		</center></div>
	<% }%>
	<div id=reportContainer data-options="region:'center',border:false" style="text-align:center">
		<report:group groupId="group1" groupFileName="<%=report%>"
			funcBarLocation="no"
			width="100%"
			height="100%"
			exceptionPage="/reportJsp/myError2.jsp"
			params="<%=param.toString()%>"
			appletJarName="raqsoftReportApplet.jar"
			needImportEasyui="no"
			needPaged="<%=needPaged%>"
			sheetAlign="center"
			needScroll="yes"
			lazyload="yes"
		/>
	</div>
</div>
</div>
<iframe id=sheetsFrame src="" style="display:none"></iframe>

<script language="javascript">
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
	$(document).ready( function() {
		//因为页面内容很多时，easyui的parser解析渲染页面非常慢
		//先将填报表内容移动到隐藏的iframe中去，然后再调用easyui的parser来解析渲染页面，解析完后再将填报表内容移回来
		var sheets = _sheetIds.split( "," );
		for( var i = 0; i < sheets.length; i++ ) {
			var sheetId = sheets[i];
			var div = document.getElementById( sheetId + "_reportDiv" );
			if( $(div).children().length > 0 ) {
				$("<div id='div_" + sheetId + "'></div>").appendTo( $("#sheetsFrame").contents().find( "body" ) );
				$(div).children().appendTo( $("#sheetsFrame").contents().find( "#div_" + sheetId ) );
			}
		}
		$.parser.parse();
		for( var i = 0; i < sheets.length; i++ ) {
			var sheetId = sheets[i];
			var div = document.getElementById( sheetId + "_reportDiv" );
			var tmpdiv = $("#sheetsFrame").contents().find( "#div_" + sheetId );
			if( tmpdiv.length > 0 ) {
				tmpdiv.children().appendTo( $(div) );
				tmpdiv.remove();
			}
		}
	});
</script>

</body>
</html>
