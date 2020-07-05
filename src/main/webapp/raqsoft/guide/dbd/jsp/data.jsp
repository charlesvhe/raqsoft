<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/raqsoftAnalyse.tld" prefix="raqsoft" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<!DOCTYPE html>
<html lang="en">
<head>
<title>仪表板</title>
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
String beta = null;
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
<script>var contextPath = '<%=cp%>';var beta = "<%=beta%>";</script>
<!-- <script src="../js/code.jquery.com.jquery.js"></script> -->
<script src="../../js/j_query_yi_jiu_yi.js"></script>
<script src="../../../easyui/jquery.easyui.min.js"></script>
<script>
var easyuiapi = jQuery.noConflict(true);//与原jquery冲突，重定义$，本页面用easyuiapi代表easyui的$
</script>
<script src="../../js/j_query_yi_jiu_yi.js"></script>
<script src="../../../../js/bootstrap.min.js"></script>
<link href="../css/bootstrap/bootstrap.css" rel="stylesheet" media="screen">
<link href="../css/bootstrap/bootstrap-responsive.css" rel="stylesheet" media="screen">
<link  rel="stylesheet" href="../css/DBD.css"/>
<link  rel="stylesheet" href="../css/style.css"/>
<link rel="stylesheet" type="text/css" href="../../../easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="../../../easyui/themes/icon.css">
<link rel="stylesheet" href="<%=guideDir %>js/jquery-powerFloat/css/powerFloat.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/chosen_v1.5.1/chosen.css" type="text/css">
<raqsoft:dashboard
	olap="<%=olap %>"
	dataSource="<%=dataSource %>"
  	fixedTable="<%=fixedTable %>"
	ql="<%=ql %>"
  	dfxFile="<%=dfxFile %>"
  	dfxScript="<%=dfxScript %>"
  	dfxParams="<%=dfxParams %>"
  	inputFiles="<%=inputFiles %>"
  	dataFileType="<%=dataFileType %>"
></raqsoft:dashboard>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/dashboard.js?v=<%=v %>"></script>
<%
if(beta != null){
%>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/editors.js?v=<%=v %>"></script> 
<%} %>
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
<div class="container-fluid" id="dataHeader">
	<nav class="navbar" role="navigation">
		<ul class="nav navbar-nav">
			<li><a class="navFont-default" href="javascript:saveOlap();">
				<svg t="1579756463611" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15433" width="15" height="15"><path d="M608 320C625.664 320 640 305.696 640 288L640 160C640 142.304 625.664 128 608 128 590.336 128 576 142.304 576 160L576 288C576 305.696 590.336 320 608 320L608 320ZM960 896C960 931.328 931.328 960 896 960L128 960C92.672 960 64 931.328 64 896L64 128C64 92.672 92.672 64 128 64L192 64 192 384C192 419.328 220.672 448 256 448L768 448C803.328 448 832 419.328 832 384L832 64 896 64C931.328 64 960 92.672 960 128L960 896 960 896ZM256 64 768 64 768 352C768 369.696 753.664 384 736 384L288 384C270.336 384 256 369.696 256 352L256 64 256 64ZM896 0 128 0C57.312 0 0 57.312 0 128L0 896C0 966.688 57.312 1024 128 1024L896 1024C966.688 1024 1024 966.688 1024 896L1024 128C1024 57.312 966.688 0 896 0L896 0Z" p-id="15434"></path></svg>
				保存</a></li>
			<li><a class="navFont-default" href="javascript:openOlap();">
			<svg t="1579756551115" class="icon" viewBox="0 0 1260 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18622" width="15" height="15"><path d="M1058.848012 935.688021H88.993243l113.018307-453.124559h969.854769zM88.993243 88.839223h397.403905l52.566655 157.699962h554.052534v147.186632h-893.63312A88.837646 88.837646 0 0 0 115.802237 461.011134l-27.33466 109.338641zM1181.853983 394.251483V246.013518A88.311979 88.311979 0 0 0 1093.016337 157.701539h-490.972549l-31.014326-95.67131A88.311979 88.311979 0 0 0 486.922815 0.001577H88.993243A88.311979 88.311979 0 0 0 0.155598 88.839223V935.688021a88.837646 88.837646 0 0 0 0 10.513331v14.718663a87.260646 87.260646 0 0 0 26.808993 37.847991h5.782332a87.260646 87.260646 0 0 0 39.950657 14.718663h986.150432A88.837646 88.837646 0 0 0 1145.057325 946.201352l113.018307-453.124559a88.837646 88.837646 0 0 0-76.221649-98.82531z" fill="#5E5C5C" p-id="18623"></path></svg>
				打开</a></li>
			<li><a id="preview" class="navFont-default" href="javascript:preview();">预览</a></li>
			<li><div class="seperater"></div></li>
			<li class="dropdown">
				<a class="navFont-default" class="dropdown-toggle" data-toggle="dropdown">选择布局<b class="caret"></b></a>
				<ul class="dropdown-menu">
					<li class="ddmenu">三组件</li>
					<li><div class="layoutSelector">
						<div class="outerSelection"><div id="i1" class="layoutsImg layout_1_1"></div></div>
						<div class="outerSelection"><div id="i2" class="layoutsImg layout_1_2"></div></div>
						<div class="outerSelection"><div id="i3" class="layoutsImg layout_1_3"></div></div>
					</div></li>
					<li class="divider"></li>
					<li class="ddmenu">四组件</li>
					<li><div class="layoutSelector">
						<div class="outerSelection"><div id="i4" class="layoutsImg layout_2_1"></div></div>
						<div class="outerSelection"><div id="i5" class="layoutsImg layout_2_2"></div></div>
						<div class="outerSelection"><div id="i6" class="layoutsImg layout_2_3"></div></div>
					</div></li>
					<li class="divider"></li>
					<li class="ddmenu">五组件</li>
					<li><div class="layoutSelector">
						<div class="outerSelection"><div id="i7" class="layoutsImg layout_3_1"></div></div>
						<div class="outerSelection"><div id="i8" class="layoutsImg layout_3_2"></div></div>
						<div class="outerSelection"><div id="i9" class="layoutsImg layout_3_3"></div></div>
					</div></li>
					<li class="divider"></li>
					<li><a href="javascript:diyLayout();">自定义</a></li>
					<li><a href="javascript:openMergeDialog();">合并格</a></li>
					<li><a href="javascript:diyLayout();">拆分格</a></li>
				</ul>
			</li>
			<li><a id="sysparams" class="navFont-default" href="javascript:showSysparams();">共享参数</a></li>
		</ul>
		</div>
		</div>
	</nav>
</div>
<div class="container-fluid">
 <div class="row-fluid">
	<div class="span2 dbd-west">
<%
if(beta != null){
%>
		<div class="" id="dbd-west-editor" style="display:none">
			<p>
				<div class="title">
					编辑器组件
				</div>
			</p>
			<div id='editorDiv' class="">
				<ul>
					<li>
						<a class="addEditorButton" type="input">编辑器</a>
					</li>
					<li>
						<a class="addEditorButton" type="slider">整数滑块</a>
					</li>
				</ul>
			</div>
		</div>
<%} %>
    	<div class="side" id="dbd-west-report">
		    <ul id="myTab" class="nav nav-tabs">
			    <li class="active" style="width:50%">
			        <a id="tab_d" href="#define" data-toggle="tab">网格报表</a>
			    </li>
			    <li style="width:50%"><a id="tab_c" href="#choose" data-toggle="tab">统计图</a></li>
			</ul>
			<div id="myTabContent" class="tab-content">
			    <div class="tab-pane fade in active" id="define">
			    <!-- content -->
			    	<div id="util">
			    	<button type="button" onclick="manageDataSet();" class="btn btn-default">数据集</button>
			    	<select id="selectDs" style="width:40%;padding:4px;margin-bottom:0px">
						<option value="">未选择数据集</option>
					</select>
					<a href="javascript:dsParameterButtonEvent();" style="margin:1px"><img style="transform:scale(1.2)" title="数据集参数" src="../img/guide/7.png" /></a>
					<p style="margin-top:10px">
						<span id='' style='font-weight: bolder;font-size:15px' >拖拽字段</span>
						<a id='acfBut' style='font-weight: bolder;font-size:15px;float:right;cursor: no-drop'>
						<img src="../img/guide/9.png" title="添加计算字段">
						</a>
					</p>
					<div id='contentDiv' class="ztree">
						<p>1，请选择编辑区域</p>
						<p>2，请选择数据集</p>
					</div>
					
					<div id="items" style="width:220px;overflow: auto;max-height: 400px;display:none">
						<p>1，请选择编辑区域</p>
						<p>2，请选择数据集</p>
					</div>
					</div>
					<div id='gridTable'>
					</div>
			    </div>
			    <div class="tab-pane fade" id="choose">
			       <!-- <div id="aggrModels" style="top: 60px; z-index: 10000;">
						<div id="analyseConf3" style="width:100%;height:22px;">
							<div id='dsSelectDiv' style="width:100%">
							</div>
						</div>
					</div> -->
					<!-- <div id="analyseConf4" style="width:200px;height:500px;margin-top:10px;overflow:auto;"></div> -->
					<div style="cursor:pointer;" id="allReportStyles">
					
					</div>
					<div style="" id="modelReportFields">
					
					</div>
					
			    </div>
			</div>
      </div>
    </div>
    <div class="span10 dbd-center">
      <!--Body content-->
      <div class="main">
      	<div id="contents" class="dtable" style="position:absolute;font-size:14px;top:50px;height:100%;width:100%;z-index:0">
	
      	</div>
      </div>
    </div>
</div>
</div>

<!-- buttons -->
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
var previewDbd = false;
var finalView = false;
guideConf.openDOlap = "<%=isOpenDOlap%>";
var olapFile = "<%=olap.replaceAll("\\r", "").replaceAll("\\n", "")%>";
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

if (guideConf.simplePage=='') guideConf.simplePage = selfUrl;
else guideConf.simplePage = "<%=cp%>/"+guideConf.simplePage;
guideConf.simplePage = guideConf.simplePage.replaceAll("//","/");

if (guideConf.reportPage=='') guideConf.reportPage = selfUrl;
else guideConf.reportPage = "<%=cp%>/"+guideConf.reportPage;
guideConf.reportPage = guideConf.reportPage.replaceAll("//","/");

guideConf.dct="<%=dct%>";
guideConf.vsb="<%=vsb%>";
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
guideConf.sqlId="<%=sqlId%>";

function selectTab(id){
	if(id == '#choose') {
		createRpxType = 2;
		$('#allReportStyles').before($('#util'));
	} else {
		createRpxType = 1;
		$('#gridTable').before($('#util'));
	}
	var id1 = '#tab_d';
	if(id == '#choose') id1 = '#tab_c';
	else id1 = '#tab_d';
	if($(id1).parent('li')[0].className.indexOf('active') >= 0) return;
	$('a[data-toggle="tab"]').parent('li').removeClass('active');
	$(id1).parent('li').addClass('active');
	$('.tab-pane').removeClass('in active');
	$(id).addClass('in active');
	flash($(id1),2,'azure');
}
$('#contents').css('width',$(".main").css("width")).css('height',$(".main").css("height"));
$('#contentDiv').css('height',parseInt($('.side').css('height'))/3+"px");
$('#confFieldFloat').find('div').css('cursor','pointer');
$('.outerSelection').mouseover(function(e){$(e.target).css('background-color','opera');});
$('.outerSelection').mouseout(function(e){$(e.target).css('background-color','');});
$('#analyseConf4').css('height',parseInt($('.side').css('height'))/3+"px");
$('.tab-pane.in').append($('#util'));
$('a[data-toggle="tab"]').on('shown.bs.tab',function(e){
	var tabContentId = $(e.target).attr('href');
	if(tabContentId == '#choose') {
		createRpxType = 2;
		$('#allReportStyles').before($('#util'));
	} else {
		createRpxType = 1;
		$('#gridTable').before($('#util'));
	}
	if(currDiv) {
		if(checkHasReport(currDiv)) divTableControl.changeChoosedDiv(currDiv);
	}
});
selectTab('#define');
<%
if(beta != null){
%>
initAddEditorButtons();
<%} %>
</script>
</html>