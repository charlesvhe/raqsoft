<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.report.util.*" %>
<%@ page import="com.raqsoft.report.model.*" %>
<%@ page import="com.raqsoft.report.usermodel.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.*" %>
<%@ page import="com.raqsoft.common.*" %>
<%@ page import="java.io.*" %>
<%@ page import="com.raqsoft.guide.web.*" %>
<%
try {

String cp = request.getContextPath();
String reportId = request.getParameter( "reportId" );
String rid = reportId;
IReport iReport = null;
if (request.getParameter("rpxFile") != null) {
	File f = new File(DataSphereServlet.getFilePath(request.getParameter("rpxFile")));
	Logger.debug("f : " + f.getAbsolutePath());
	IReport rd = ReportUtils.read(f.getAbsolutePath());
	Context cxt = new Context();
	Engine engine = new Engine(rd, cxt); //构造报表引擎
	iReport = engine.calc(); //运算报表
} else if (session.getAttribute(reportId) != null) {
	iReport = (IReport)session.getAttribute(reportId+"_REPORT");
} else {
	out.println(GuideMessage.get(request).getMessage("guide.web6"));
	return;
}
request.setAttribute(rid, iReport);
String isOlap = request.getParameter( "isOlap" );
if (!"yes".equals(isOlap)) isOlap = "no";
//isOlap = "yes";
String rName = "report1";
String v = ""+System.currentTimeMillis();
v = "10";//v.substring(v.length()-5);
String guideDir = cp + request.getParameter("guideDir");
//System.out.println("--------1111---------" + request.getParameter("finish"));
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
	<title></title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge;" /><!-- 强制以IE8模式运行 -->
	<link rel="stylesheet" href="<%=guideDir %>/css/style.css" type="text/css">
	<!--
	<link rel="stylesheet" href="<%=guideDir %>/js/chosen.css" type="text/css">
	<link rel="stylesheet" href="<%=guideDir %>/js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="<%=guideDir %>/js/selectBoxIt/src/stylesheets/jquery.selectBoxIt.css">
	<style>
		.filter{/*padding-right:20px;*/border:1px solid #CCCDCF;height:19px;}
		#feedback { font-size: 1.4em; }
		#dimItemsDiv .ui-selecting { background: #FECA40; }
		.selectedfilter {background: #F39814;}
		#dimItemsDiv { list-style-type: none; margin: 0; padding: 0; }
		#dimItemsDiv li { margin: 1px; padding: 3px 10px 3px 10px; float: left; height: 22px; font-size: 12pt; text-align: center; }

		.dom_line {margin:2px;border-bottom:1px gray dotted;height:1px}
		.domBtnDiv {display:block;padding:2px;border:1px gray dotted;background-color:powderblue}
		.categoryDiv {display:block; width:335px}
		.domBtn {display:block;cursor:pointer;padding:2px;margin:2px 10px;border:1px gray solid;background-color:#FFE6B0}
		.domBtn_Disabled {display:block;cursor:default;padding:2px;margin:2px 10px;border:1px gray solid;background-color:#DFDFDF;color:#999999}
		.dom_tmp {position:absolute;font-size:12px;}
		#table {table-layout:fixed;}
		#td {white-space:nowrap;overflow:hidden;word-break:keep-all;}
	</style>
	-->
	<script type="text/javascript" src="<%=guideDir %>/js/j_query_yi_jiu_yi.js?v=<%=v %>"></script>
	<script type="text/javascript" src="../js/common_d2.js?v=<%=v %>"></script>
	<script type="text/javascript" src="../js/analyseReport_d2.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/artDialog/jquery.artDialog.source.js?skin=twitter"></script>
	<script language=javascript>
		var _ddboxSelectedItemColor = "red";
		var _ddboxSelectedItemBackColor = "yellow";
		var autoSelectWhileFilter = true;
		var reportConfName = '<%=request.getParameter("confName") %>';
		var isOlap = '<%=isOlap%>';
		var isfolded = false;
		function dealPage(t) {
			var curr = <%=rid%>_getCurrPage();
			var total = <%=rid%>_getTotalPage();
			if (t == 1) {
				if (curr == 1) return;
				curr = 1;
			} else if (t == 2) {
				if (curr == 1) return;
				else curr--;
			} else if (t == 3) {
				if (curr == total) return;
				else curr++;
			} else if (t == 4) {
				if (curr == total) return;
				else curr = total;
			}
			console.log(curr+"-------------"+total);
			<%=rid%>_toPage(curr);
		}
		function openMenu1(){
			var defaultOption = {
			title:"导出工具",
			fixed:true,
			max: false,
			min: false,
			lock: true,
			resize:false,
			cache:false,
			zIndex:40001,
			esc:true,
			content:'<link href="<%=guideDir %>/css/style.css" />'
					+'<a id="excel" href="javascript:<%=rid %>_saveAsExcel();"></a>'
					+'<a id="word" href="javascript:<%=rid %>_saveAsWord();"></a>'
					+'<a title="保存为pdf文件" id="pdf" href="javascript:<%=rid %>_saveAsPdf();"></a>'
					+'<a title="直接打印pdf" id="pdfprint" href="javascript:<%=rid %>_directPdfPrint();"></a>'
					+'<a id="txt" href="javascript:<%=rid %>_saveAsText();" style="visibility:visible;"></a>'
			};
			var options = $.extend(defaultOption,options);
			art.dialog(options);
		}
		
		function deleteReport(reportName){
			if(!reportName) reportName = reportConfName;
			if(!reportName) {
				return;
			}
			var success = window.top.removeReport(reportName);
		}
		
		$(document).ready(function(){
			parent.$('img[confNameLoading="'+reportConfName+'"]').css('visibility','hidden');
			function resize() {
				$('#mainDiv').css({width:$(window).width(),height:$(window).height()-6});
			}
			if(document.getElementById('<%=rid%>_funcbar')) document.getElementById('<%=rid%>_funcbar').style.display='none';
			$('#mainDiv').css('display','block');
			$('td').mouseover(reportCellMouseover).click(reportCellClick);//
			$(window).scroll(function(){
				//$('#toolbarDiv').css('top',$(window).scrollTop()+"px");
			}).resize(function(){
				resize();
			});
			resize();
			if (parent.analyseApi.isDetailListRpx(reportConfName)) {
				//$('#serverTxt').css('visibility','visible');
				$('#txt').css('visibility','visible');
			}
		});
		function move(e){
			var hideRpx = $(e).parent().parent();
			var isPinned = hideRpx.find("div#mainDiv").css("display") == "none";
			if(isPinned || isfolded){
				$(e).css("background","url(../img/dl/ViewReport-ICO.gif) -521px -84px no-repeat ")
				hideRpx.find("div#mainDiv").show();
				var area = $(window.parent.document).find('div.singleArea[confName='+reportConfName+']');
				area.find('img').remove();
				area.find('iframe').css('height','100%');
				if(isfolded)  isfolded = false;
				window.top.controlUtil.areas[area.attr('count')].folded = 0;
			}else{
				$(e).css("background","url(../img/dl/ViewReport-ICO.gif) -502px -84px no-repeat ")
				hideRpx.find("div#mainDiv").hide();
				var area = $(window.parent.document).find('div.singleArea[confName='+reportConfName+']');
				var img_move = $("<img src='<%=guideDir %>/img/move-alt2.png' style='height:100px;width:100px'/>");
				area.append(img_move);
				area.find('iframe').css('height','25px');
				window.top.controlUtil.areas[area.attr('count')].folded = 1;
			}
		}
		$(document).click(function(event){
			var view = document.defaultView;
			view.parent.rqAnalyse.currRpx = $(view.frameElement).attr('confName')?$(view.frameElement).attr('confName'):view.parent.rqAnalyse.currRpx;
			//view.parent.aly.refresh(true,true);
		});
	</script>
</head>
<body style="overflow:hidden;margin:0px;">
	<div id="toolbarDiv" style="display:none;height: 25px; margin: 0; padding: 0; position: absolute; top: 0px; background-color: rgb(255, 255, 255); z-index: 10000;width:100%;">
	<!-- <a id="move" class="button" onclick="javascript:move(this);" href="#" style="visibility:visible;"></a> -->
	<a id="pageFirst" href="javascript:dealPage(1);"></a>
	<a id="pageBefore" href="javascript:dealPage(2);"></a>
	<a id="pageAfter" href="javascript:dealPage(3);"></a>
	<a id="pageEnd" href="javascript:dealPage(4);"></a>
	<!-- <a id="setting" href="javascript:openMenu1();"></a><!-- menu1 -->
	<!-- <a id="del" href="javascript:deleteReport();"></a>  -->
	<!-- 以下按钮放到menu1 -->
	<%-- <a id="excel" href="javascript:<%=rid %>_saveAsExcel();"></a>
	<a id="word" href="javascript:<%=rid %>_saveAsWord();"></a>
	<a id="pdf" href="javascript:<%=rid %>_saveAsPdf();"></a>
	<a id="pdf" href="javascript:<%=rid %>_directPdfPrint();"></a>
	<a id="txt" href="javascript:<%=rid %>_saveAsText();" style="visibility:visible;"></a> --%>
	<!-- <a id="download" style="margin:3px;" href="javascript:parent.downloadRpx(reportConfName);"></a> -->
	<a style="display:none;" id="print" href="javascript:<%=rid %>_print();"></a>
	<%if("0".equals(request.getParameter("finish"))){ %>
	<span style="margin:3px 0 3px 5px;vertical-align:10px;color:red"><%=GuideMessage.get(request).getMessage("guide.web4")%></span>
	<a style="display:none;margin:3px 0;vertical-align:10px;color:#0000FF;" href="javascript:parent.setDataScope();"><%=GuideMessage.get(request).getMessage("guide.web5")%></a>
	<%} %>
	</div>
	
	<div id="mainDiv" style="display:none;overflow:auto;border:0px solid red;">
	<report:html name="<%=rid %>" srcType="reportBean" beanName="<%=rid%>" width="-1"
		funcBarLocation="top"
		needPageMark="yes"
		firstPageLabel=""
		prevPageLabel=""
		nextPageLabel=""
		lastPageLabel=""
		functionBarColor="#fff5ee"
		funcBarFontFace="隶书"
		funcBarFontSize="16px"
		funcBarFontColor="blue"
		separator="|"
		needSaveAsExcel="yes"
		needSaveAsPdf="no"
		needSaveAsText="no"
		needSaveAsWord="no"
		needPrint="no"
		printLabel="打印"
		generateParamForm="no"
		displayNoLinkPageMark="no"
		needDirectPrint="no"
		needPrintPrompt="no"
		useCache="yes"
		needScroll="no"
		needSelectPrinter="no"
		exceptionPage="raqsoft/guide/jsp/myError.jsp"
		needLinkStyle="no"
		savePrintSetup="no"
		serverPagedPrint="no"
		textDataSeparator="\t"
		textDataLineBreak="\r\n"
		excelFormat="2007"
		isOlap="<%=isOlap %>"
		exportDisp4text="yes"
	/>
	</div>
</body>
</html>

<%
} catch(Exception e) {
	out.println("Calculate report error!");
	e.printStackTrace();
}

String folded = request.getParameter( "folded" );
if(folded != null && folded.equals("1")){
%>
<script>
	$('#move').css('background', 'rgba(0, 0, 0, 0) url("../img/dl/ViewReport-ICO.gif") no-repeat scroll -502px -84px / auto padding-box border-box');
	isfolded = true;
	function matchReport() {
		reportMatchSize( document.getElementById( "reportContainer" ), document.getElementById( "report1_reportDiv" ), 1 );
	}
	
	/* $(document).ready( function(){
		matchReport();
	});
	$(window).resize( function(){
		setTimeout( matchReport, 500 );
	}); */
</script>
<%
}
%>