<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.report.util.*" %>
<%@ page import="com.raqsoft.report.model.*" %>
<%@ page import="com.raqsoft.report.usermodel.*" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.*" %>
<%@ page import="com.raqsoft.guide.web.*" %>
<%
String cp = request.getContextPath();
String reportId = request.getParameter( "reportId" );
if (session.getAttribute(reportId) == null) {
	out.println("报表已失效");
	return;
}
DfxData rc = (DfxData)session.getAttribute(reportId);
IReport iReport = rc.getIReport();
request.setAttribute(reportId, iReport);
//System.out.println("reportId [ " + reportId);
String isOlap = request.getParameter( "isOlap" );
if (!"yes".equals(isOlap)) isOlap = "no";
isOlap = "no";
String rName = "report1";
String v = ""+System.currentTimeMillis();
v = "4";//v.substring(v.length()-5);
String guideDir = cp + request.getParameter("guideDir");
//System.out.println("--------1111---------" + request.getParameter("finish"));
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
	<title><%="超维报表" %></title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge;" /><!-- 强制以IE8模式运行 -->
	<link rel="stylesheet" href="<%=guideDir %>/css/style.css" type="text/css">
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
	<script type="text/javascript" src="<%=guideDir %>/js/jquery-1.9.1.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>/js/common.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>/js/report.js?v=<%=v %>"></script>
	<script language=javascript>
		var _ddboxSelectedItemColor = "red";
		var _ddboxSelectedItemBackColor = "yellow";
		var autoSelectWhileFilter = true;
		var reportConfName = '<%=request.getParameter("confName") %>';
		function dealPage(t) {
			var curr = <%=rName%>_getCurrPage();
			var total = <%=rName%>_getTotalPage();
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
			<%=rName%>_toPage(curr);
		}
		$(document).ready(function(){
			parent.$('img[confNameLoading="'+reportConfName+'"]').css('visibility','hidden');
			function resize() {
				$('#mainDiv').css({width:$(window).width()-6,height:$(window).height()-31});
			}
			document.getElementById('<%=rName%>_funcbar').style.display='none';
			$('#mainDiv').css('display','block');
			$('td').mouseover(reportCellMouseover).click(reportCellClick);//
			$(window).scroll(function(){
				//$('#toolbarDiv').css('top',$(window).scrollTop()+"px");
			}).resize(function(){
				resize();
			});
			resize();
			
		});
	</script>
</head>
<body style="overflow:hidden;margin:3px;">
	<jsp:include page="echartjs.jsp" flush="false" />
	<div id="toolbarDiv" style="height: 25px; margin: 0; padding: 0; position: absolute; top: 0px; background-color: rgb(255, 255, 255); z-index: 10000;width:100%;">
	<a id="pageFirst" href="javascript:dealPage(1);"></a>
	<a id="pageBefore" href="javascript:dealPage(2);"></a>
	<a id="pageAfter" href="javascript:dealPage(3);"></a>
	<a id="pageEnd" href="javascript:dealPage(4);"></a>
	<a id="excel" href="javascript:<%=rName %>_saveAsExcel();"></a>
	<a id="word" href="javascript:<%=rName %>_saveAsWord();"></a>
	<a id="pdf" href="javascript:<%=rName %>_saveAsPdf();"></a>
	<a id="txt" href="javascript:<%=rName %>_saveAsText();"></a>
	<a style="display:none;" id="print" href="javascript:<%=rName %>_print();"></a>
	<%if("0".equals(request.getParameter("finish"))){ %>
	<span style="margin:3px 0 3px 5px;vertical-align:10px;color:red">未使用全部数据！</span>
	<a style="display:none;margin:3px 0;vertical-align:10px;color:#0000FF;" href="javascript:parent.setDataScope();">调整数据范围</a>
	<%} %>
	</div>
	
	<div id="mainDiv" style="display:none;margin-top:25px;overflow:auto;border:0px solid red;">
	<report:html name="<%=rName %>" srcType="reportBean" beanName="<%=reportId%>" width="-1"
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
