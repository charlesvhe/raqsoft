<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.usermodel.*"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.report.util.*"%>
<%@ page import="com.raqsoft.input.tag.*"%>
<%@ page import="com.raqsoft.input.model.resources.*"%>
<%@ taglib uri="/WEB-INF/raqsoftInput.tld" prefix="raqsoft" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
	String input = request.getParameter( "sht" );
	//保证报表名称的完整性
	int iTmp = 0;
	if( (iTmp = input.lastIndexOf(".sht")) <= 0 ){
		iTmp = input.length();
		input = input + ".sht";
	}

	StringBuffer param=new StringBuffer();
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
	//System.out.println("params : " + param.toString());
	String noDfx = request.getParameter( "noDfx" );
	String adp = request.getParameter( "adp" );
	if( noDfx == null ) noDfx = "";
	if( adp == null) adp = "";
	if( !noDfx.equals("") && adp.equals("")) adp = noDfx;
	String dataFile = request.getParameter( "dataFile" );
	if( dataFile == null || dataFile.length() == 0 ) {
		dataFile = "";
	}
	String fileType = request.getParameter( "fileType" );
	if (fileType == null || fileType.length() == 0) {
		//if (dataFile.indexOf(".json"))
		fileType = "json";
	}
	
	
	String sgid = InputTag.getInputId();
	String resultPage = "queryInput.jsp?sht=" + URLEncoder.encode( input, "UTF-8" ) + "&adp="+adp+"&dataFile=" + URLEncoder.encode( dataFile, "UTF-8" ) + "&fileType=" + fileType+"&sgid="+sgid; 

	//以下代码是检测这个报表是否有相应的参数模板
	String paramFile = input.substring( 0, iTmp ) + "_arg.rpx";
	boolean hasParam = ReportUtils.isReportFileExist( paramFile );
%>

<html>
  <head>
    <meta name="viewport" content="initial-scale=1" />
    <title><%=InputMessage.get(request).getMessage("input.web10")%></title>
  </head>
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/<%=ReportConfig.theme%>/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/locale/easyui-lang-<%=ReportUtils2.getEasyuiLanguage(request)%>.js"></script>
<script type="text/javascript"> $.parser.auto = false; </script>

<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0 style="background:#F1F4F7" onload="try{parent.hideLoading()}catch(e){}">
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="../raqsoft/images/loading.gif"><br><%=InputMessage.get(request).getMessage("input.web8")%>......</td></tr>
	</table>
</div>
<div id=reportArea class="easyui-layout" data-options="fit:true" style="display:none;width:100%;height:100%">
	<div data-options="region:'north',border:false" style="height:30px;overflow:hidden">
		<jsp:include page="inputtoolbar.jsp" flush="false" >
			<jsp:param name="sgid" value="<%=sgid %>"></jsp:param>
		</jsp:include>
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
						resultPage="<%=resultPage%>"
						resultContainer="reportContainer"
						needImportEasyui="no"
					/>
				</td>
				<td style="padding-left:15px"><a href="javascript:_submit( form1 )" class="easyui-linkbutton" style="vertical-align:middle;padding:0px 8px;"><%=InputMessage.get(request).getMessage("input.web9")%></a></td>
				</tr></table>
			</center></div>
		<% }%>
		<div id=reportContainer data-options="region:'center',border:false" style="text-align:center">
			<raqsoft:input id="<%=sgid %>"
				src="<%=input%>" 
				paramMode="i"
				params="<%=param.toString()%>"
				excel="io"
				needImportEasyui="no"
				width="100%"
				height="100%"
				tabLocation="bottom"
				adp="<%=adp%>"
				file="<%=dataFile%>"
				fileType="<%=fileType%>"
				outerDim="id"
				exceptionPage="myError.jsp"
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
			$("<div id='div_" + sheetId + "'></div>").appendTo( $("#sheetsFrame").contents().find( "body" ) );
			$(div).children().appendTo( $("#sheetsFrame").contents().find( "#div_" + sheetId ) );
		}
		$.parser.parse();
		for( var i = 0; i < sheets.length; i++ ) {
			var sheetId = sheets[i];
			var div = document.getElementById( sheetId + "_reportDiv" );
			var tmpdiv = $("#sheetsFrame").contents().find( "#div_" + sheetId );
			tmpdiv.children().appendTo( $(div) );
			tmpdiv.remove();
		}
		$(".easyui-menubutton").each( function() {
			$.parser.parse( $(this).parent() );
		});
	});
</script>
</body>
</html>
