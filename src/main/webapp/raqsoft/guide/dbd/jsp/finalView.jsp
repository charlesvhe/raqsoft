<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/raqsoftAnalyse.tld" prefix="raqsoft" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<!DOCTYPE html>
<html lang="en">
<head>
<title>仪表盘浏览</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
String dbd = (String) request.getSession().getAttribute( "dbd" );
if (dbd == null) dbd = "";
boolean isOpenDOlap = true;
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
String currFolderId = request.getParameter( "currFolderId" );
String currLevel = request.getParameter( "currLevel" );
%>
</head>
<body>
<script>
var contextPath = '<%=cp%>';
var currFolderId = '<%=currFolderId%>';
var currLevel = '<%=currLevel%>';
</script>
<script src="<%=guideDir %>dbd/js/code.jquery.com.jquery.js"></script>
<script src="<%=cp%>/js/bootstrap.min.js"></script>
<link href="<%=guideDir %>dbd/css/bootstrap/bootstrap.css" rel="stylesheet" media="screen">
<link href="<%=guideDir %>dbd/css/bootstrap/bootstrap-responsive.css" rel="stylesheet" media="screen">
<link  rel="stylesheet" href="<%=guideDir %>dbd/css/DBD.css"/>
<link  rel="stylesheet" href="<%=guideDir %>dbd/css/style.css"/>
<link rel="stylesheet" href="<%=guideDir %>js/jquery-powerFloat/css/powerFloat.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/chosen_v1.5.1/chosen.css" type="text/css">
<script type="text/javascript">
	var previewDbd = true;
	var finalView = true;
	var mobileFinal = false;
	if(navigator.userAgent.toLocaleLowerCase().indexOf('mobile') >= 0) {
		var mobileView = true;
	}
</script>
<nav class="navbar navbar-default" role="navigation">
	<ul class="nav navbar-nav">
		<li><a class="navFont-default" href="javascript:goback();">
		<svg t="1579754746243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13997" id="mx_n_1579754746244" width="15" height="15"><path d="M425.856 886.263467a29.499733 29.499733 0 0 1-19.669333-7.466667L18.4832 534.135467a29.636267 29.636267 0 0 1 0-44.305067L406.186667 145.186133a29.5936 29.5936 0 0 1 31.761066-4.855466 29.636267 29.636267 0 0 1 17.527467 27.016533v215.415467a29.602133 29.602133 0 0 1-29.610667 29.6192 29.610667 29.610667 0 0 1-29.6192-29.6192V233.284267L82.7136 511.982933 396.245333 790.698667V641.237333a29.610667 29.610667 0 0 1 29.6192-29.6192 29.602133 29.602133 0 0 1 29.610667 29.6192v215.415467a29.6448 29.6448 0 0 1-29.6192 29.610667z" fill="#1296db" p-id="13998"></path><path d="M985.856 886.263467a29.627733 29.627733 0 0 1-27.477333-18.628267c-0.759467-1.672533-88.507733-196.795733-532.522667-196.795733-16.366933 0-29.6192-13.252267-29.6192-29.6192s13.243733-29.6192 29.6192-29.6192c295.185067 0 446.788267 82.0224 521.361067 149.0176-68.317867-343.287467-501.461333-348.2112-521.4208-348.2624a29.6192 29.6192 0 0 1 0.059733-59.2384c5.896533 0 589.610667 5.7856 589.610667 503.509333a29.678933 29.678933 0 0 1-29.610667 29.636267z" fill="#1296db" p-id="13999"></path></svg>
		返回目录
		</a></li>
	</ul>
</nav>
<raqsoft:dashboard
	dbd="<%=dbd %>"
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
<script src="../js/mobile.js"></script>
<!-- <div class="container-fluid" style="background-color:rgb(26, 113, 189)">
	<nav class="navbar navbar-default" role="navigation">
			<ul class="nav navbar-nav">
				<li><a id="logopic" href="">Dashboard</a></li>
			</ul>
		</div>
		</div>
	</nav>
</div> -->
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
<div id="mobileViewMain">
	
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

$("#logopic").css("width",(parseInt($('.side').css("width"))+30)+"px")
	.css("background-color","rgb(80, 164, 237)");
$($("#logopic").parents("div")[0]).css("padding-left","0px");
$('#contents').css('width',$(".main").css("width")).css('height',$(".main").css("height"));
$('#contentDiv').css('height',parseInt($('.side').css('height'))/3+"px");

function goback(){
	window.location = "./folder.jsp?currFolderId="+currFolderId+"&currLevel="+currLevel;
}
</script>
</html>