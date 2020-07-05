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
<script type="text/javascript" src="<%=guideDir %>/dbd/js/preview.js"></script>
<div class="container-fluid"">
	<nav class="navbar navbar-default" role="navigation">
		<ul class="nav navbar-nav">
			<li><a class="navFont-default" href="javascript:toData();">
			<svg t="1579754746243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13997" id="mx_n_1579754746244" width="15" height="15"><path d="M425.856 886.263467a29.499733 29.499733 0 0 1-19.669333-7.466667L18.4832 534.135467a29.636267 29.636267 0 0 1 0-44.305067L406.186667 145.186133a29.5936 29.5936 0 0 1 31.761066-4.855466 29.636267 29.636267 0 0 1 17.527467 27.016533v215.415467a29.602133 29.602133 0 0 1-29.610667 29.6192 29.610667 29.610667 0 0 1-29.6192-29.6192V233.284267L82.7136 511.982933 396.245333 790.698667V641.237333a29.610667 29.610667 0 0 1 29.6192-29.6192 29.602133 29.602133 0 0 1 29.610667 29.6192v215.415467a29.6448 29.6448 0 0 1-29.6192 29.610667z" fill="#1296db" p-id="13998"></path><path d="M985.856 886.263467a29.627733 29.627733 0 0 1-27.477333-18.628267c-0.759467-1.672533-88.507733-196.795733-532.522667-196.795733-16.366933 0-29.6192-13.252267-29.6192-29.6192s13.243733-29.6192 29.6192-29.6192c295.185067 0 446.788267 82.0224 521.361067 149.0176-68.317867-343.287467-501.461333-348.2112-521.4208-348.2624a29.6192 29.6192 0 0 1 0.059733-59.2384c5.896533 0 589.610667 5.7856 589.610667 503.509333a29.678933 29.678933 0 0 1-29.610667 29.636267z" fill="#1296db" p-id="13999"></path></svg>
			返回数据
			</a></li>
			<li><a class="navFont-default" href="javascript:saveDBD();">
			<svg t="1579757010982" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22643" width="15" height="15"><path d="M682.666667 955.733333H170.666667c-66.030933 0-102.4-36.369067-102.4-102.4V341.333333v-0.0512a16.861867 16.861867 0 0 1 5.000533-12.014933l256-256A17.220267 17.220267 0 0 1 341.282133 68.266667H682.666667c66.030933 0 102.4 36.369067 102.4 102.4v256a17.066667 17.066667 0 1 1-34.133334 0V170.666667c0-47.223467-21.0432-68.266667-68.266666-68.266667H358.4v238.933333a17.066667 17.066667 0 0 1-17.066667 17.066667H102.4v494.933333c0 47.223467 21.0432 68.266667 68.266667 68.266667h512a17.066667 17.066667 0 1 1 0 34.133333zM126.532267 324.266667H324.266667V126.532267L126.532267 324.266667z" p-id="22644"></path><path d="M768 964.266667a34.133333 34.133333 0 0 1-34.133333-34.133334V594.397867l-112.401067 112.401066a34.133333 34.133333 0 1 1-48.264533-48.264533l170.666666-170.666667 0.034134-0.034133a34.013867 34.013867 0 0 1 28.535466-9.6768 33.9968 33.9968 0 0 1 19.882667 9.898667l170.461867 170.478933a34.133333 34.133333 0 1 1-48.264534 48.264533L802.133333 594.397867V930.133333a34.133333 34.133333 0 0 1-34.133333 34.133334z" p-id="22645"></path></svg>
			上传到服务器</a></li>
			<li><div class="seperater"></div></li>
			<li class="dropdown">
				<a class="navFont-default" href="#" class="dropdown-toggle" data-toggle="dropdown">
					视图
					<b class="caret"></b>
				</a>
				<ul class="dropdown-menu">
					<li><a href="javascript:setViewMode(1);" style="">pc</a></li>
					<li><a href="javascript:setViewMode(2);" style="">mobile</a></li>
				</ul>
			</li>
		</ul>
	</nav>
</div>
<div class="container-fluid">
 <div class="row-fluid">
	<!-- <div class="span2 dbd-west">
      <div class="side">
      </div>
    </div> -->
    <div class="span12 dbd-center">
      <!--Body content-->
      <div class="main">
      	<div id="contents" class="dtable" style="position:absolute;font-size:14px;top:50px;height:100%;width:100%;">
	
      	</div>
      </div>
      <div class="main2" id="mobileViewMain" style="display:none">
      	<div id=mimg style="height: 100%;width: 400px;padding-top: 40px;padding-left: 45px;margin: auto;">
			<iframe height="615px" width="345px" id="mframe" style="">
			</iframe>
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

$("#logopic").css("width",(parseInt($('.side').css("width"))+30)+"px")
	.css("background-color","rgb(80, 164, 237)");
$($("#logopic").parents("div")[0]).css("padding-left","0px");
$('#contents').css('width',$(".main").css("width")).css('height',$(".main").css("height"));
$('#contentDiv').css('height',parseInt($('.side').css('height'))/3+"px");
$('#confFieldFloat').find('div').css('cursor','pointer');
$('.outerSelection').mouseover(function(e){$(e.target).css('background-color','opera');});
$('.outerSelection').mouseout(function(e){$(e.target).css('background-color','');});
$('#analyseConf4').css('height',parseInt($('.side').css('height'))/3+"px");
//$('#mframe').attr('src','./mobileView.jsp?olap='+encodeURIComponent(olapName));


function saveDBD(){
	setViewMode(1)
	saveOlap();
	setViewMode(viewMode)
}
</script>
</html>