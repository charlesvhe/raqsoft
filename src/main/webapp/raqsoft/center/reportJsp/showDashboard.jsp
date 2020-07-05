<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="org.json.*" %>
<%@ page import="com.raqsoft.report.usermodel.Context"%>
<%@ page import="com.raqsoft.common.Types"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.report.util.*"%>
<%@ page import="com.raqsoft.center.entity.*" %>

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
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/locale/easyui-lang-zh_CN.js"></script>

<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0 style="background:#F1F4F7" onload="try{parent.hideLoading()}catch(e){}">
<jsp:include page="echartjs.jsp" flush="false" />
<%
	String report = request.getParameter( "rpg" );
	StringBuffer param=new StringBuffer();
	String params =request.getParameter( "params" );
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
			//System.out.println("paramValue="+paramValue);
			if(paramValue!=null){
				//把参数拼成name=value;name2=value2;.....的形式
				param.append(paramName).append("=").append(paramValue).append(";");
			}
		}
	}
	param.append(params);
	Object userObj = request.getSession().getAttribute("userObj");
	com.raqsoft.center.entity.User user = (com.raqsoft.center.entity.User) userObj;
	String userMacro = user.getReportMacro();
	String userParams = user.getReportParams();
	Context ctx = new Context();
	Context ctx_param = new Context();
	com.raqsoft.center.Config config1 = com.raqsoft.center.Center.getConfig(request.getSession().getServletContext());
	Map macro = null;
	if(userMacro!=null && userMacro.length() >0){
		macro = config1.getUserReportMacros(user.getUserId()).get(0);
	}else{
		macro = new HashMap();
	}
	ctx.setMacroMap(macro);
	ctx_param.setMacroMap(macro);
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
		ctx_param.setParamValue(name, valueObj);
	}
	request.setAttribute("center_context", ctx);
	request.setAttribute("center_context_param", ctx_param);
	String resultPage = "queryDashboard.jsp?rpg=" + URLEncoder.encode( report, "UTF-8" );

	//以下代码是检测这个报表是否有相应的参数模板
	String paramFile = report.substring(0,iTmp)+"_arg.rpx";
	paramFile = request.getParameter("argRpx");
	boolean hasParam = ReportUtils.isReportFileExist( paramFile );
%>
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/raqsoft/images/loading.gif"><br>正在加载报表......</td></tr>
	</table>
</div>
<div id=reportArea class="easyui-layout" data-options="fit:true" style="display:none;width:100%;height:100%">
	<%	//如果参数模板存在，则显示参数模板
	if( hasParam ) {
	%>
		<div data-options="region:'north',border:false"><center>
			<table id="param_tbl" align=center><tr><td>
				<report:param name="form1" paramFileName="<%=paramFile%>"
					needSubmit="no"
					params="<%=param.toString()%>"
					hiddenParams="<%=param.toString()%>"
					contextName="center_context_param"
					needImportEasyui="no"
					resultContainer="reportContainer"
					resultPage="<%=resultPage%>"
					mobileMode="no"
				/>
			</td>
			<td style="padding-left:15px"><a href="javascript:_submit( form1 )" class="easyui-linkbutton" style="vertical-align:middle;padding:0px 8px;">查询</a></td>
			</tr></table>
		</center></div>
	<% }%>
	<div id=reportContainer data-options="region:'center',border:false" style="text-align:center">
		<report:dashboard groupFileName="<%=report%>"
			params="<%=param.toString()%>"
			exceptionPage="/reportJsp/myError2.jsp"
			width="100%" 
			height="100%"
			needTitle="yes"
			needBorder="yes"
			contextName="center_context"
			needImportEasyui="no"
		/>
	</div>
</div>
<script language="javascript">
	document.getElementById( "mengban" ).style.display = "none";
	document.getElementById( "reportArea" ).style.display = "";
</script>

</body>
</html>
