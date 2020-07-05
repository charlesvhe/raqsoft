<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.input.view.*" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.*" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.center.entity.*" %>
<%@ page import="com.raqsoft.dm.Context"%>
<%@ page import="com.raqsoft.common.Types"%>
<%@ taglib uri="/WEB-INF/raqsoftInput.tld" prefix="raqsoft" %>
<%
//ArrayList<String> fs = new ArrayList<String>();
//fs.add("/userData/noDfx2.json");
//request.setAttribute("_dataFiles_", fs);
String sht = request.getParameter("sht");
String dataFiles = request.getParameter("dataFiles");
Object userObj = request.getSession().getAttribute("userObj");
com.raqsoft.center.entity.User user = (com.raqsoft.center.entity.User) userObj;
String userParams = user.getReportParams();
com.raqsoft.dm.Context ctx = new Context();
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
	System.out.println("param from center: "+desc);
	String typestr = String.valueOf(jobj.get("type"));
	Byte type = Byte.valueOf(typestr);
	String value = (String)jobj.get("value");
	Object valueObj = Types.getProperData(type.byteValue(), value);
	ctx.setParamValue(name, valueObj);
}
request.setAttribute("center_context", ctx);
String aggrId = "aggrSg" + System.currentTimeMillis();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <meta name="viewport" content="initial-scale=1" />
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
%>
    <title>润乾统计表</title>
    <meta charset="UTF-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  </head>
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/themes/icon.css">
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/easyui/locale/easyui-lang-zh_CN.js"></script>
  
<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0 style="background:#F1F4F7">
<div id=mengban style="background-color:white;position:absolute;z-index:999;width:100%;height:100%">
	<table width=100% height=100%>
		<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="../raqsoft/images/loading.gif"><br>正在加载......</td></tr>
	</table>
</div>
<div id=reportArea class="easyui-layout" data-options="fit:true" style="display:none;width:100%;height:100%">
	<div data-options="region:'north',border:false" style="height:30px;overflow:hidden">
		<jsp:include page="inputtoolbar.jsp" flush="false" >
			<jsp:param name="sgid" value="<%=aggrId %>"></jsp:param>
			<jsp:param name="isAggr" value="1"></jsp:param>
		</jsp:include>
	</div>
	<div data-options="region:'center',border:false">
	<div class="easyui-layout" data-options="fit:true">
		<div id=reportContainer data-options="region:'center',border:false" style="text-align:center">
			<raqsoft:aggr
				id="<%=aggrId %>"
				src="<%=sht %>" 
				mode="i"
				dataFiles="<%=dataFiles %>"
				fileType="json"
				exceptionPage="myError.jsp"
				theme="bootstrap"
				needImportEasyui="no"
				width="100%"
				height="100%"
				tabLocation="bottom"
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
