<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.web.*" %>
<%@ page import="com.raqsoft.guide.util.*" %>
<%@ page import="com.raqsoft.dm.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ taglib uri="/WEB-INF/raqsoftAnalyse.tld" prefix="raqsoft" %>
<%
request.setCharacterEncoding("UTF-8");
response.setContentType("text/html;charset=utf8");
System.out.println("Env main path : " + Env.getMainPath());  
String cp = request.getContextPath();
String view = request.getParameter( "view" );
if (view == null) view = "source";
String olap = request.getParameter( "olap" );
if (olap == null) olap = "";
boolean isOpenDOlap = false;
if(olap.length()>0) isOpenDOlap = true;
String dataSource = request.getParameter( "dataSource" );
if (dataSource == null) dataSource = "";
String ql = request.getParameter( "ql" );
if (ql == null) ql = "";
String dfxFile = request.getParameter( "dfxFile" );
if (dfxFile == null) dfxFile = "";
String dfxScript = request.getParameter( "dfxScript" );
if (dfxScript == null) dfxScript = "";
String dfxParams = request.getParameter( "dfxParams" );
if (dfxParams == null) dfxParams = "";
String inputFiles = request.getParameter( "inputFiles" );
if (inputFiles == null) inputFiles = "";
String fixedTable = request.getParameter( "fixedTable" );
if (fixedTable == null) fixedTable = "";
String dataFileType = request.getParameter("dataFileType");
if(dataFileType==null) dataFileType = "text";
String dct = request.getParameter("gdct");
if(dct==null) dct = "";
dct = dct.replaceAll("\\\\", "/");
String vsb = request.getParameter("gvsb");
if(vsb==null) vsb = "";
vsb = vsb.replaceAll("\\\\", "/");
String filter = request.getParameter( "filter" );
if (filter == null) filter = "default";
String sqlId = request.getParameter( "sqlId" );
if (sqlId == null) sqlId = "";
String tempDBName = request.getParameter( "tempDBName" );
if(tempDBName == null) tempDBName="glmd_analyse";
String macro = request.getParameter( "macro" );
if (macro == null) macro = "";
macro = macro.replaceAll("\\\\", "/");
String resetLmd = request.getParameter( "resetLmd" );
if(resetLmd == null) resetLmd="yes";
String dataFolderOnServer = "/WEB-INF/files/data/";
String resultRpxPrefixOnServer = "/WEB-INF/files/resultRpx/";

System.out.println("dashboard_c.jsp dataSource : " + dataSource);
%>
<raqsoft:dashboard_c
	olap="<%=olap %>"
	dataSource="<%=dataSource %>"
  	fixedTable="<%=fixedTable %>"
	ql="<%=ql %>"
  	dfxFile="<%=dfxFile %>"
  	dfxScript="<%=dfxScript %>"
  	dfxParams="<%=dfxParams %>"
  	inputFiles="<%=inputFiles %>"	
  	tempDBName="<%=tempDBName %>"
  	resetLmd="<%=resetLmd %>"
/>

<script>
	guideConf.sqlId="<%=sqlId%>";
	guideConf.openDOlap = <%=isOpenDOlap%>;
	guideConf.dashboardCtx = true;
	guideConf.reportPage = "showReport_d.jsp";
	var sqlDatasets = [
		{
			sqlId:"sqlId1"
			,dataSource:"DataLogic" //如果服务器管理这些，js里就不用定义
			,sql:"" //如果服务器管理这些，js里就不用定义
			,fields:null
		}
	]
	/* 这些参数可以控制页面的初始状态 */
	guideConf.analyseButs = "1,2,9,10,11,12,13,14";
	
</script>
