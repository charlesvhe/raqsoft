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
String beta = "1";
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
<script src="../../../../js/bootstrap.min.js"></script>
<script src="../../../easyui/jquery.easyui.min.js"></script>
<link href="../css/bootstrap/bootstrap.css" rel="stylesheet" media="screen">
<link href="../css/bootstrap/bootstrap-responsive.css" rel="stylesheet" media="screen">
<link  rel="stylesheet" href="../css/DBD.css"/>
<link  rel="stylesheet" href="../css/style.css"/>
<link rel="stylesheet" type="text/css" href="../../../easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="../../../easyui/themes/icon.css">
<link rel="stylesheet" href="<%=guideDir %>js/jquery-powerFloat/css/powerFloat.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
<link rel="stylesheet" href="<%=guideDir %>js/chosen_v1.5.1/chosen.css" type="text/css">
<input class="easyui-slider" value="12" style="width:300px;"
    data-options="showTip:true,rule:[0, '|', 25,'|',50,'|',75,'|',100]">
<script type="text/javascript" src="<%=guideDir %>/dbd/js/dashboard.js?v=<%=v %>"></script>
<%
if(beta != null){
%>
<script type="text/javascript" src="<%=guideDir %>/dbd/js/editors.js?v=<%=v %>"></script> 
<%} %>
<script type="text/javascript" src="<%=guideDir %>js/jquery-powerFloat/js/jquery-powerFloat.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>js/artDialog/jquery.artDialog.source.js?skin=blue"></script>
<script type="text/javascript" src="<%=guideDir %>js/ztree/js/jquery.ztree.all-3.5.min.js"></script>
<script type="text/javascript" src="<%=guideDir %>js/ztree/js/jquery.ztree.exhide-3.5.min.js"></script>
<script type="text/javascript" src="<%=guideDir %>js/chosen_v1.5.1/chosen.jquery.min.js"></script>
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
				<p>
					<a class="addEditorButton" type="input">编辑器</a>
				</p>
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

</body>
</html>