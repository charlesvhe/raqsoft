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
String pageName = request.getParameter("pageName");
String title = request.getParameter("title");
if (title == null) title = "超维报表";
String v = ""+System.currentTimeMillis();
v = v.substring(v.length()-5);
%>
<script>
//lmdStr = "";
</script>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
	<title><%=title %></title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge;" /><!-- 强制以IE8模式运行 -->
	<link rel="stylesheet" href="<%=cp %>/dl/css/style.css" type="text/css">
	<link rel="stylesheet" href="<%=cp %>/dl/js/chosen.css" type="text/css">
	<link rel="stylesheet" href="<%=cp %>/dl/js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
	<link rel="stylesheet" type="text/css" href="<%=cp %>/dl/js/selectBoxIt/src/stylesheets/jquery.selectBoxIt.css">
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
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-1.9.1.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/common.js"></script>
	<script language=javascript>
	//menu/jquery.js
		var contextPath = '<%=cp%>';
		var pageName = "<%=pageName%>";
		var selfUrl = window.location.href;
		if (selfUrl.indexOf('?')>=0) selfUrl = selfUrl.substring(0,selfUrl.indexOf('?'));
<%
if ("report".equals(pageName)) {
	String rid = request.getParameter( "rid" );
	ReportConf rc = (ReportConf)session.getAttribute(rid);
	IReport iReport = rc.getIReport();
	request.setAttribute(rid, iReport);
	String qyx = rc.getQyx();
	String json = ConfigUtil.getMetaDataJson(rc.getDbName());
	%>
		var lmdStr = "<%=json.replaceAll("\r", "<r>").replaceAll("\n", "<n>")%>";
		var domInfosStr = "(<%=qyx.replaceAll("\\\\'","<s_q>").replaceAll("\n"," ")%>)".replaceAll("<s_q>","\\\'");
		//var domInfosStr = "({sql:{sql:'SELECT sum(T_1.订单ID) 订单ID求和 FROM 订单 T_1',arg:[]},on:[],where:'',from:[{table:'订单',alias:'T0',by:[],where:'',join:''}],select:[{field:'订单ID',from:'T0',table:'订单',dim:'订单.订单ID',aggr:'sum',alias:'订单ID求和'}],having:'',order:'',other:''})".replaceAll("<s_q>","\\\'");
		var dbName = "<%=rc.getDbName() %>";
		var currDBName = "<%=rc.getDbName() %>";
		var reportType = "<%=rc.getReportType() %>";
		var rid = "<%=rc.getReportId() %>";
		var currDql = "<%=rc.getDql() %>";
		lmdStr = lmdStr.replaceAll("<r>", "\r").replaceAll("<n>", "\n");
<%
} else if ("showDfxReport".equals(pageName)){
	String reportId = request.getParameter( "reportId" );
	DfxData rc = (DfxData)session.getAttribute(reportId);
	IReport iReport = rc.getIReport();
	request.setAttribute(reportId, iReport);
%>
		var reportId = "<%=reportId %>";
		//lmdStr = lmdStr.replaceAll("<r>", "\r").replaceAll("<n>", "\n");
<%
} else if ("showReport".equals(pageName)){
	String rid = request.getParameter( "rid" );
	ReportConf rc = (ReportConf)session.getAttribute(rid);
	IReport iReport = rc.getIReport();
	request.setAttribute(rid, iReport);
	String qyx = rc.getQyx();
	String json = ConfigUtil.getMetaDataJson(rc.getDbName());
%>
		var lmdStr = "<%=json.replaceAll("\r", "<r>").replaceAll("\n", "<n>")%>";
		var domInfosStr = "(<%=qyx.replaceAll("\\\\'","<s_q>").replaceAll("\n"," ")%>)".replaceAll("<s_q>","\\\'");
		//var domInfosStr = "({sql:{sql:'SELECT sum(T_1.订单ID) 订单ID求和 FROM 订单 T_1',arg:[]},on:[],where:'',from:[{table:'订单',alias:'T0',by:[],where:'',join:''}],select:[{field:'订单ID',from:'T0',table:'订单',dim:'订单.订单ID',aggr:'sum',alias:'订单ID求和'}],having:'',order:'',other:''})".replaceAll("<s_q>","\\\'");
		var dbName = "<%=rc.getDbName() %>";
		var currDBName = "<%=rc.getDbName() %>";
		var reportType = "<%=rc.getReportType() %>";
		var rid = "<%=rc.getReportId() %>";
		var currDql = "<%=rc.getDql() %>";
		lmdStr = lmdStr.replaceAll("<r>", "\r").replaceAll("<n>", "\n");
<%
} else if ("query".equals(pageName)){
%>
	lmdStr = lmdStr.replaceAll("<r>", "\r").replaceAll("<n>", "\n");
<%
} else if ("txtReport".equals(pageName)){
	String rid = request.getParameter( "rid" );
	ReportConf rc = (ReportConf)session.getAttribute(rid);
	IReport iReport = rc.getIReport();
	request.setAttribute(rid, iReport);
%>
		var rid = "<%=rc.getReportId() %>";
<%
}
%>	
	
	</script>
<%
if ("dfxReport".equals(pageName)) {
%>	
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-ui-1.10.1.custom.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-ui-timepicker-addon.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.bgiframe.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.tools.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.blockUI.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/artDialog/jquery.artDialog.source.js?skin=opera"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/ztree/js/jquery.ztree.all-3.5.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/ztree/js/jquery.ztree.exhide-3.5.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/where.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/report2.js?v=<%=v %>"></script>
<%
} else if ("showDfxReport".equals(pageName)) {
%>	
<%
} else if ("data".equals(pageName)) {
%>	
	<script type="text/javascript" src="<%=cp %>/dl/js/chosen.jquery.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-ui-1.10.1.custom.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-ui-timepicker-addon.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/artDialog/jquery.artDialog.source.js?skin=twitter"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/selectBoxIt/src/javascripts/jquery.selectBoxIt.min.js"></script>  
	<script type="text/javascript" src="<%=cp %>/dl/js/where.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/report2.js?v=<%=v %>"></script>
</head>
<body style="margin:0;padding:0;">
	<div class='ui-layout-toolbar' style="font-size:14px;position:absolute;top:0;border:0px;height:50px;z-index:30001;background-color:#41455A;width:100%;">
		<img src="<%=cp %>/dl/img/guide/logo.png" style=""/><img style="" src="<%=cp %>/dl/img/guide/title-2.png"/>
		<a href="javascript:doReport()" style="color:#DFDFE3;vertical-align:18px;text-decoration: none;"><img src="<%=cp %>/dl/img/guide/15.png" style="vertical-align:-7px;margin:0 10px;"/>生成报表</a>&nbsp;&nbsp;
		<a href="javascript:dfxDownloadTxt()" style="display:none;color:#DFDFE3;vertical-align:18px;text-decoration: none;"><img src="<%=cp %>/dl/img/guide/txt.png" style="vertical-align:-7px;margin:0 10px;"/>下载TXT</a>&nbsp;&nbsp;
	
		<img src='<%=cp %>/dl/img/guide/35.png' id='prevBut' onclick='getPageRows(-1)' type='button' title='上一页' style='border:0px;cursor:pointer;vertical-align:11px;'>
		<input type="text" id="currPage" style="vertical-align:18px;width:40px;text-align:center" value="0"/><span style="vertical-align:18px;color:#DFDFE3;" id="totalPage"></span>
		<img src='<%=cp %>/dl/img/guide/28.png' id='nextBut' onclick='getPageRows(1)' type='button' title='下一页' style='border:0px;cursor:pointer;vertical-align:11px;'>
	
		<div id="viewStatus" style="float:right;padding-right:5px;margin:15px;color:#DFDFE3;"></div>
		<div style="clear:both;"></div>
	</div>
	<div style="margin:60px 25px 0;" id="whereDiv"></div>
	<div style="margin:10px 25px;">
		<div style="float:left" id="resultDiv"></div>
		<div style="float:left;display:none;" id="addCalcFieldDiv"><img src="<%=cp %>/dl/img/guide/9.png" style="cursor:pointer;margin:1px 2px;" title="添加计算字段" onclick="rpx.editCalcField()"/></div>
		<div style="clear:both"></div>
	</div>
<%
return;
} else {
%>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.cookie.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/chosen.jquery.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.layout.js"></script>
	<!-- 
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-ui.js"></script>
	-->
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-ui-1.10.1.custom.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery-ui-timepicker-addon.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/lgl_es_4.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.tooltip.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.bgiframe.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.qtip-1.0.0-rc3.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/raphael-min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.tools.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/jquery.blockUI.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/artDialog/jquery.artDialog.source.js?skin=twitter"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/ztree/js/jquery.ztree.all-3.5.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/selectBoxIt/src/javascripts/jquery.selectBoxIt.min.js"></script>  
	<script type="text/javascript" src="<%=cp %>/dl/js/ztree/js/jquery.ztree.exhide-3.5.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/where.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=cp %>/dl/js/dlnew.js?v=<%=v %>"></script>
<%
}
%>	
	
	</head>
	<body style="margin:0;padding:0;">
	