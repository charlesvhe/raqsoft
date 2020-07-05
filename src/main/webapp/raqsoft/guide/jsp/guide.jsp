<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ taglib uri="/WEB-INF/raqsoftGuide.tld" prefix="guide" %>
<%
request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();
String view = request.getParameter( "view" );
if (view == null) view = "source";
String grpx = request.getParameter( "grpx" );
if (grpx == null) grpx = "";
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
String outerCondition = request.getParameter( "outerCondition" );
if (outerCondition == null) outerCondition = "";
String showToolBar = request.getParameter("showToolBar");
if(showToolBar==null) showToolBar = "yes";
String showSubTable = request.getParameter("showSubTable");
if(showSubTable==null) showSubTable = "yes";
String dataFileType = request.getParameter("dataFileType");
if(dataFileType==null) dataFileType = "text";


if ("source".equals(view) && dataSource.length()==0) dataSource = "DataLogic"; 
//fixedTable="订单";
//System.out.println("outerCondition : " + outerCondition);
//outerCondition="[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='2'\"},{\"table\":\"省\",\"exp\":\"${T}.名称='天津'\"}]";
//outerCondition = "[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='2'\"}]";
%>

<guide:guide
	view="<%=view %>"
	grpx="<%=grpx %>"
	dataSource="<%=dataSource %>"
	ql="<%=ql %>"
  	dfxFile="<%=dfxFile %>"
  	dfxScript="<%=dfxScript %>"
  	dfxParams="<%=dfxParams %>"
  	inputFiles="<%=inputFiles %>"
	
	grpxSourcePage="/raqsoft/guide/jsp/guide.jsp"
	grpxDataPage="/raqsoft/guide/jsp/guide.jsp"
	grpxReportPage="/raqsoft/guide/jsp/guide.jsp"
	reportPage="/raqsoft/guide/jsp/showReport.jsp"
  	showColMax="30"
  	maxDataSize="10000"
  	maxReportSize="50000"
  	grpxFolderOnServer="/WEB-INF/files/grpx/"
  	dataFolderOnServer="/WEB-INF/files/data/"
  	dfxFolderOnServer="/WEB-INF/files/dfx/"
  	inputFileFolderOnServer="/WEB-INF/files/inputFile/"
  	rpxFolderOnServer="/WEB-INF/files/rpx/"
  	uploadFolderOnServer="/WEB-INF/files/"
  	
  	dqlCategory="国内公司;海外公司"
  	fixedTable="<%=fixedTable %>"
  	outerCondition="<%=outerCondition %>"
  	dimDataOnServer="/WEB-INF/files/data/temp/dimData.json"
  	useDataPage="yes"

	showToolBar="<%=showToolBar %>"
	showSubTable="<%=showSubTable %>"
	
	dataFileType="<%=dataFileType %>"
/>

