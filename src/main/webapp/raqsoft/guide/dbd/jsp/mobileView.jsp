<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/raqsoftAnalyse.tld" prefix="raqsoft" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<!DOCTYPE html>
<html lang="en">
<head>
<title>仪表盘预览</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="../css/bootstrap/bootstrap.css" rel="stylesheet" media="screen">
<link href="../css/bootstrap/bootstrap-responsive.css" rel="stylesheet" media="screen">
<%
String cp = request.getContextPath();
String title = request.getParameter("title");
if (title == null) title = "Raqsoft Query/Analyse";
String guideDir = cp + "/raqsoft/guide/";//request.getParameter("guideDir");
String v = ""+System.currentTimeMillis();

request.setCharacterEncoding("UTF-8");
response.setContentType("text/html;charset=utf8");
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
String dct = request.getParameter("dct");
if(dct==null) dct="";
dct = dct.replaceAll("\\\\", "/");
String vsb = request.getParameter("vsb");
if(vsb==null) vsb = "";
vsb = vsb.replaceAll("\\\\", "/");
String filter = request.getParameter( "filter" );
if (filter == null) filter = "default";
String sqlId = request.getParameter( "sqlId" );
if (sqlId == null) sqlId = "";
String macro = request.getParameter( "macro" );
if (macro == null) macro = "";
macro = macro.replaceAll("\\\\", "/");
String dataFolderOnServer = "/WEB-INF/files/data/";
String resultRpxPrefixOnServer = "/WEB-INF/files/resultRpx/";
if (dataSource.length() == 0) {
//olap = "WEB-INF/files/olap/客户情况.olap";
	dataSource="DataLogic";
//fixedTable="ALL";
}
%>
</head>
<body>
<script>var contextPath = '<%=cp%>';</script>
<script src="../js/code.jquery.com.jquery.js"></script>
<script src="../../../../js/bootstrap.min.js"></script>
<link  rel="stylesheet" href="../css/DBD.css"/>
<link  rel="stylesheet" href="../css/style.css"/>
<link rel="stylesheet" href="<%=guideDir %>js/jquery-powerFloat/css/powerFloat.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/chosen_v1.5.1/chosen.css" type="text/css">
<script type="text/javascript">
	var previewDbd = true;
	var finalView = false;
	var olapName = '<%=olap%>';
	var mobileView = true;
	var mobileFinal = false;
</script>
<raqsoft:dashboard
	olap="<%=olap %>"
	dataSource="<%=dataSource %>"
  	fixedTable="<%=fixedTable %>"
	ql="<%=ql %>"
  	dfxFile="<%=dfxFile %>"
  	dfxScript="<%=dfxScript %>"
  	dfxParams="<%=dfxParams %>"
  	inputFiles="<%=inputFiles %>"	
></raqsoft:dashboard>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/dashboard.js?v=<%=v %>"></script> 
<script type="text/javascript" src="<%=guideDir %>/dbd/js/common_d2.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/dqlApi_d2.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/where_d2.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/query_d2.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/dqlreport_d2.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/raqsoftApi_d2.js?v=<%=v %>"></script> 
<script type="text/javascript" src="<%=guideDir %>js/jquery-ui-1.10.1.custom.min.js"></script>
<script type="text/javascript" src="<%=guideDir %>js/jquery-powerFloat/js/jquery-powerFloat.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>js/artDialog/jquery.artDialog.source.js?skin=blue"></script>
<script type="text/javascript" src="<%=guideDir %>js/ztree/js/jquery.ztree.all-3.5.min.js"></script>
<script type="text/javascript" src="<%=guideDir %>js/ztree/js/jquery.ztree.exhide-3.5.min.js"></script>
<script type="text/javascript" src="<%=guideDir %>js/chosen_v1.5.1/chosen.jquery.min.js"></script>
<div class="container-fluid">
 <div class="row-fluid">
	<!-- <div class="span2 dbd-west">
      <div class="side">
      </div>
    </div> -->
    <div class="span12 dbd-center">
      <!--Body content-->
      <div class="main">
      	<div id="contents" class="dtable" style="position:absolute;font-size:14px;height:100%;width:100%;">
	
      	</div>
      </div>
    </div>
</div>
</div>

<div style="display:none;">
	<iframe id='hiddenFrame' name='hiddenFrame' height="100px" width="100px"></iframe>
	<form id=downloadForm method=post ACTION="<%=cp%>/servlet/dataSphereServlet?action=11" target=hiddenFrame>
		<input type=hidden name=path id=path value="">
		<input type=hidden name=content id=content value="">
		<input type=hidden name=mode id=mode value="">
	</form>
</div>
<div id="confFieldFloat" style="display:none;background-color:#F3F3F3;border: 1px solid #CCC;">
	<div seq="17" style="margin:2px 5px;" onclick="aly.confField.aggr('')"><img src="<%=guideDir %>img/guide/42.png" aggr='' style="vertical-align:-4px;visibility:hidden;"/><%=GuideMessage.get(request).getMessage("guide.web18")%></div>
	<div seq="15" style="margin:2px 5px;" onclick="aly.confField.aggr('sum')"><img src="<%=guideDir %>img/guide/42.png" aggr='sum' style="vertical-align:-4px;visibility:hidden;"/><%=GuideMessage.get(request).getMessage("guide.web19")%></div>
	<div seq="14" style="margin:2px 5px" onclick="aly.confField.aggr('count')"><img src="<%=guideDir %>img/guide/42.png" aggr='count' style="vertical-align:-4px;visibility:hidden;" /><%=GuideMessage.get(request).getMessage("guide.web20")%></div>
	<div seq="13" style="margin:2px 5px;" onclick="aly.confField.aggr('max')"><img src="<%=guideDir %>img/guide/42.png" aggr='max' style="vertical-align:-4px;visibility:hidden;" /><%=GuideMessage.get(request).getMessage("guide.web21")%></div>
	<div seq="12" style="margin:2px 5px;" onclick="aly.confField.aggr('min')"><img src="<%=guideDir %>img/guide/42.png" aggr='min' style="vertical-align:-4px;visibility:hidden;" /><%=GuideMessage.get(request).getMessage("guide.web22")%></div>
	<div seq="11" style="margin:2px 5px;" onclick="aly.confField.aggr('avg')"><img src="<%=guideDir %>img/guide/42.png" aggr='avg' style="vertical-align:-4px;visibility:hidden;" /><%=GuideMessage.get(request).getMessage("guide.web23")%></div>
	<div seq="10" style="margin:2px 5px;" onclick="aly.confField.aggr('countd')"><img src="<%=guideDir %>img/guide/42.png" aggr='countd' style="vertical-align:-4px;visibility:hidden;" /><%=GuideMessage.get(request).getMessage("guide.web24")%></div>
	<span seq="9" style="font-size:1px;display:block;width:100%;border-top:1px solid #AAA;margin:3px 0;"></span>
	<div seq="1" style="margin:2px 5px;" onclick="aly.confField.order(1)"><img src="<%=guideDir %>img/guide/42.png"  order="1" style="vertical-align:-4px;visibility:hidden;"/><%=GuideMessage.get(request).getMessage("guide.web25")%></div>
	<div seq="2" style="margin:2px 5px" onclick="aly.confField.order(2)"><img src="<%=guideDir %>img/guide/42.png"  order="2" style="vertical-align:-4px;visibility:hidden;" /><%=GuideMessage.get(request).getMessage("guide.web26")%></div>
	<div seq="3" style="margin:2px 5px;" onclick="aly.confField.order(0)"><img src="<%=guideDir %>img/guide/42.png" style="vertical-align:-4px;visibility:hidden;" order="0"/><%=GuideMessage.get(request).getMessage("guide.web27")%></div>
	<span seq="4" style="font-size:1px;display:block;width:100%;border-top:1px solid #AAA;margin:3px 0;"></span>
	<div seq="5" style="margin:2px 5px;" onclick="aly.confField.edit()"><img src="<%=guideDir %>img/guide/48.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web28")%></div>
	<div seq="16" style="margin:2px 5px;" onclick="aly.confField.where(1)"><img src="<%=guideDir %>img/guide/7.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web29")%></div>
	<div seq="19" style="margin:2px 5px;" onclick="aly.confField.where(2)"><img src="<%=guideDir %>img/guide/49.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web30")%></div>
	<div seq="20" style="margin:2px 5px;" onclick="aly.confField.rela()"><img src="<%=guideDir %>img/guide/16.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web31")%></div>
	<div seq="6" style="margin:2px 5px;" onclick="aly.confField.format()"><img src="<%=guideDir %>img/guide/50.png" style="vertical-align:-3px;padding-right:1px;width:15px;height:16px;" /><%=GuideMessage.get(request).getMessage("guide.web32")%></div>
	<div seq="18" style="margin:2px 5px;" onclick="aly.confField.editStyle()"><img src="<%=guideDir %>img/guide/51.png" style="vertical-align:-3px;padding-right:1px;width:15px;height:16px;" /><%=GuideMessage.get(request).getMessage("guide.web33")%></div>
	<span seq="7" style="font-size:1px;display:block;width:100%;border-top:1px solid #AAA;margin:3px 0;"></span>
	<div seq="8" style="color:red;margin:2px 5px;" onclick="aly.confField.del()"><img src="<%=guideDir %>img/guide/13.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web34")%></div>
	<div seq="21" style="color:red;margin:2px 5px;" onclick="aly.paramDel()"><img src="<%=guideDir %>img/guide/13.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web34")%></div>
	<div seq="22" style="margin:2px 5px;" onclick="aly.confField.params_where(1)"><img src="<%=guideDir %>img/guide/7.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web29")%></div>
</div>
<div id="calcFieldFloat" style="display:none;background-color:#F3F3F3;border: 1px solid #CCC;">
	<div seq="1" style="margin:2px 5px;" onclick="aly.calcField.edit()"><img src="<%=guideDir %>img/guide/31.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web28")%></div>
	<div seq="2" style="color:red;margin:2px 5px;" onclick="aly.calcField.del()"><img src="<%=guideDir %>img/guide/13.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web34")%></div>
</div>
</body>
<script>
guideConf.openDOlap = <%=isOpenDOlap%>;
guideConf.saveDisp = '0111';
if (guideConf.guideDir == '') guideConf.guideDir = "/raqsoft/guide/";
if (guideConf.guideDir.substring(guideConf.guideDir.length-1) != '/') guideConf.guideDir = guideConf.guideDir+"/";
var selfUrl = window.location.href;
if (selfUrl.indexOf('?')>=0) selfUrl = selfUrl.substring(0,selfUrl.indexOf('?'));

if (guideConf.grpxSourcePage=='') guideConf.grpxSourcePage = selfUrl;
else guideConf.grpxSourcePage = "<%=cp%>/"+guideConf.grpxSourcePage;
guideConf.grpxSourcePage = guideConf.grpxSourcePage.replaceAll("//","/");

if (guideConf.grpxDataPage=='') guideConf.grpxDataPage = selfUrl;
else guideConf.grpxDataPage = "<%=cp%>/"+guideConf.grpxDataPage;
guideConf.grpxDataPage = guideConf.grpxDataPage.replaceAll("//","/");

if (guideConf.grpxReportPage=='') guideConf.grpxReportPage = selfUrl;
else guideConf.grpxReportPage = "<%=cp%>/"+guideConf.grpxReportPage;
guideConf.grpxReportPage = guideConf.grpxReportPage.replaceAll("//","/");

//if (guideConf.queryPage=='') guideConf.queryPage = selfUrl;
//else guideConf.queryPage = "<%=cp%>/"+guideConf.queryPage;
//guideConf.queryPage = guideConf.queryPage.replaceAll("//","/");

if (guideConf.simplePage=='') guideConf.simplePage = selfUrl;
else guideConf.simplePage = "<%=cp%>/"+guideConf.simplePage;
guideConf.simplePage = guideConf.simplePage.replaceAll("//","/");

if (guideConf.olapPage=='') guideConf.olapPage = selfUrl;
else guideConf.olapPage = "<%=cp%>/"+guideConf.olapPage;
guideConf.olapPage = guideConf.olapPage.replaceAll("//","/");

if (guideConf.reportPage=='') guideConf.reportPage = selfUrl;
else guideConf.reportPage = "<%=cp%>/"+guideConf.reportPage;
guideConf.reportPage = guideConf.reportPage.replaceAll("//","/");

guideConf.defaultWidth = 25;
guideConf.defaultHeight = 8;
guideConf.reSort = "yes";
guideConf.params = {};
guideConf.fileDataFolderOnServer = "WEB-INF/files/fileData/";
guideConf.queryType = "all";
guideConf.dataPage = "raqsoft/guide/jsp/data.jsp";
guideConf.filter="default";
guideConf.scanRow=100;//自动判断序表字段的数据类型时，扫描多少行数据
guideConf.autoReloadDimDataOnServer = 'yes';
var existFileDatas = [];

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
guideConf.showHistoryRpx = 'no';
guideConf.sqlId="<%=sqlId%>";

$('#contents').css('width',$(".main").css("width")).css('height',$(".main").css("height")).css('background-color','white');
$('#contentDiv').css('height',parseInt($('.side').css('height'))/3+"px");
$('#confFieldFloat').find('div').css('cursor','pointer');
$('.outerSelection').mouseover(function(e){$(e.target).css('background-color','opera');});
$('.outerSelection').mouseout(function(e){$(e.target).css('background-color','');});
$('#analyseConf4').css('height',parseInt($('.side').css('height'))/3+"px");
</script>
</html>