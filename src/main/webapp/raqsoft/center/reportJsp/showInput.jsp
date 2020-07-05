<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="org.json.*" %>
<%@ page import="com.raqsoft.dm.Context"%>
<%@ page import="com.raqsoft.common.Types"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.input.tag.*"%>
<%@ taglib uri="/WEB-INF/raqsoftInput.tld" prefix="raqsoft" %>
<%@ page import="com.raqsoft.center.*" %>
<%@ page import="com.raqsoft.center.entity.*" %>
<%@ page import="com.raqsoft.report.util.*"%>
<%@ page import="com.raqsoft.common.*"%>
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
	String report = request.getParameter( "rpx" );
	String scroll = request.getParameter( "scroll" );
	String scale = request.getParameter( "scale" );
	String paged = request.getParameter( "paged" );
	String params =request.getParameter( "params" );
	String form =request.getParameter( "form" );
	if (scroll==null || scroll.length()==0 || "0".equals(scroll)) scroll = "no";
	else scroll="yes";
	paged = "0".equals(paged) ?"no":"yes";
	Object userObj = request.getSession().getAttribute("userObj");
	com.raqsoft.center.entity.User user = (com.raqsoft.center.entity.User) userObj;
	String userParams = user.getReportParams();
	com.raqsoft.dm.Context ctx = new com.raqsoft.dm.Context();
	com.raqsoft.report.usermodel.Context reportctx = new com.raqsoft.report.usermodel.Context();
	com.raqsoft.center.Config config1 = com.raqsoft.center.Center.getConfig(request.getSession().getServletContext());
	Map macro = null;
	if(userParams == null || userParams.trim().length() == 0){
		userParams="[]";
	}
	JSONArray jarr = new JSONArray(userParams);
	for(int i = 0; i < jarr.length(); i++){
		JSONObject jobj = (JSONObject)jarr.get(i);
		String name = (String)jobj.get("name");
		String desc = (String)jobj.get("desc");
		String typestr = String.valueOf(jobj.get("type"));
		Byte type = Byte.valueOf(typestr);
		String value = (String)jobj.get("value");
		Object valueObj = Types.getProperData(type.byteValue(), value);
		ctx.setParamValue(name, valueObj);
		reportctx.setParamValue(name, valueObj);
	}
	request.setAttribute("center_context", reportctx);
	request.setAttribute("center_input_context", ctx);
	String reportFileHome = config1.getInputHome();
	com.raqsoft.input.view.Config.setMainPath(reportFileHome);
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
	param.append(params);
	String noDfx = request.getParameter( "noDfx" );
	String adp = request.getParameter("adp");
	if( noDfx == null ) noDfx = "";
	if( adp == null ) adp = "";
	if( !noDfx.equals("") && adp.equals("") ) adp = noDfx;
	String dataFile = request.getParameter( "dataFile" );
	String fileName = "";
	if(input.lastIndexOf("/") >= 0){
		fileName = input.substring(input.lastIndexOf("/") + 1);
		fileName = fileName.substring(0,fileName.indexOf(".sht"));
	}else{
		fileName = input;
		fileName = fileName.substring(0,fileName.indexOf(".sht"));
	}
	String userName = "";
	if(user != null){
		userName = user.getUserName();
	}else{
		userName = "defaultUser";
	}
	if(dataFile != null) {
		dataFile += "/" + fileName + "/" + userName;
		dataFile = URLEncoder.encode( dataFile, "UTF-8" );
	}
	String fileType = request.getParameter( "fileType" );
	if (fileType == null) fileType = "json";
	String sgid = InputTag.getInputId();
	String resultPage = "queryInput.jsp?sht=" + URLEncoder.encode( input, "UTF-8" ) + "&adp="+adp + "&fileType=" + fileType+"&sgid="+sgid;
	if(dataFile != null) resultPage += "&dataFile="+dataFile;
	//以下代码是检测这个报表是否有相应的参数模板
	String paramFile = "";//input.substring( 0, iTmp ) + "_arg.rpx";
	paramFile = request.getParameter("argRpx");
	InputStream pis = null;
	try {
		pis = new FileInputStream( application.getRealPath( reportFileHome + "/" + paramFile ) );
	}catch( Throwable t ) {}
	if( pis == null ) {
		pis = application.getResourceAsStream( reportFileHome + "/" + paramFile );
	}
	if( pis == null ) {
		try {
			pis = new FileInputStream( reportFileHome + "/" + paramFile );
		}catch( Throwable t ) {}
	}
%>

<html>
  <head>
    <meta name="viewport" content="initial-scale=1" />
    <title>润乾填报表</title>
  </head>
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/locale/easyui-lang-zh_CN.js"></script>

<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0 style="background:#F1F4F7" onload="try{parent.hideLoading()}catch(e){}">
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="./images/loading.gif"><br>正在加载......</td></tr>
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
		if( pis != null ) {
		%>
			<div data-options="region:'north',border:false"><center>
				<table id=param_tbl><tr><td>
					<report:param name="form1" paramFileName="<%=paramFile%>"
						needSubmit="no"
						params="<%=param.toString()%>"
						hiddenParams="<%=param.toString()%>"
						contextName="center_context"
						resultPage="<%=resultPage%>"
						resultContainer="reportContainer"
						needImportEasyui="no"
						mobileMode="no"
					/>
				</td>
				<td style="padding-left:15px"><a href="javascript:_submit( form1 )" class="easyui-linkbutton" style="vertical-align:middle;padding:0px 8px;">查询</a></td>
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
<script language="javascript">
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
</script>
</body>
</html>
