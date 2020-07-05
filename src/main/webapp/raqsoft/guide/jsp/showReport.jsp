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
request.setAttribute("exportTips","no");
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
	<script type="text/javascript" src="<%=guideDir %>/js/common.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>/js/analyseReport.js?v=<%=v %>"></script>
	<script language=javascript>
		var _ddboxSelectedItemColor = "red";
		var _ddboxSelectedItemBackColor = "yellow";
		var autoSelectWhileFilter = true;
		var reportConfName = '<%=request.getParameter("confName") %>';
		var isOlap = '<%=isOlap%>';
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
		$(document).ready(function(){
			parent.$('img[confNameLoading="'+reportConfName+'"]').css('visibility','hidden');
			function resize() {
				$('#mainDiv').css({width:$(window).width()-6,height:$(window).height()-31});
			}
			$('body').click(function(){
				parent.aly.focusReport(reportConfName);
			});
			document.getElementById('<%=rid%>_funcbar').style.display='none';
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
		
	</script>
</head>
<body style="overflow:hidden;margin:3px;">
	<div id="toolbarDiv" style="height: 25px; margin: 0; padding: 0; position: absolute; top: 0px; background-color: rgb(255, 255, 255); z-index: 10000;width:100%;">
	<a id="pageFirst" href="javascript:dealPage(1);"></a>
	<a id="pageBefore" href="javascript:dealPage(2);"></a>
	<a id="pageAfter" href="javascript:dealPage(3);"></a>
	<a id="pageEnd" href="javascript:dealPage(4);"></a>
	<a id="excel" href="javascript:<%=rid %>_saveAsExcel();"></a>
	<a id="word" href="javascript:<%=rid %>_saveAsWord();"></a>
	<a id="pdf" href="javascript:<%=rid %>_saveAsPdf();"></a>
	<a id="pdfprint" href="javascript:<%=rid %>_directPdfPrint();"></a>
	<a id="txt" href="javascript:<%=rid %>_saveAsText();" style="visibility:visible;"></a>
	<!-- 
	<a id="serverTxt" href="javascript:<%=rid %>_saveAsTextOnServer();" style="vertical-align:10px;visibility:hidden;">server端txt</a>
	-->
	<a id="download" style="margin:3px;" href="javascript:parent.downloadRpx(reportConfName);"></a>
	<a style="display:none;" id="print" href="javascript:<%=rid %>_print();"></a>
	<%if("0".equals(request.getParameter("finish"))){ %>
	<span style="margin:3px 0 3px 5px;vertical-align:10px;color:red"><%=GuideMessage.get(request).getMessage("guide.web4")%></span>
	<a style="display:none;margin:3px 0;vertical-align:10px;color:#0000FF;" href="javascript:parent.setDataScope();"><%=GuideMessage.get(request).getMessage("guide.web5")%></a>
	<%} %>
	</div>
	
	<div id="mainDiv" style="display:none;margin-top:25px;overflow:auto;border:0px solid red;">
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
	/>
	</div>
</body>
</html>

<%
} catch(Exception e) {
	out.println("Calculate report error!");
	e.printStackTrace();
}

%>