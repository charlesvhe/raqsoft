<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.report.util.*" %>
<%@ page import="com.raqsoft.report.model.*" %>
<%@ page import="com.raqsoft.report.usermodel.*" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.*" %>
<%@ page import="com.raqsoft.guide.web.*" %>
<%@ page import="com.raqsoft.common.*" %>
<%@ page import="java.sql.*" %>
<%
String cp = request.getContextPath();
String title = "超维报表";
String guideDir = cp + ReportConfig.raqsoftDir + "/guide/";
String v = "13";//修改这个值更新浏览器端的旧js文件缓存
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
	<title><%=title %></title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge;" /><!-- 强制以IE8模式运行 -->
	<link rel="stylesheet" href="<%=guideDir %>css/style.css" type="text/css">
	<link rel="stylesheet" href="<%=guideDir %>js/chosen_v1.5.1/chosen.css" type="text/css">
	<link rel="stylesheet" href="<%=guideDir %>js/jquery-powerFloat/css/powerFloat.css" type="text/css">
	<link rel="stylesheet" href="<%=guideDir %>js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
	<style>
		#feedback { font-size: 1.4em; }
		#dimItemsDiv .ui-selecting { background: #FECA40; }
		#dimItemsDiv { list-style-type: none; margin: 0; padding: 0; }
		#dimItemsDiv li { margin: 1px; padding: 3px 10px 3px 10px; float: left; height: 22px; font-size: 12pt; text-align: center; }
		#table {table-layout:fixed;}
		#td {white-space:nowrap;overflow:hidden;word-break:keep-all;}
	</style>
	<script type="text/javascript" src="<%=guideDir %>/js/j_query_yi_jiu_yi.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/common.js?v=<%=v %>"></script>
	<script language=javascript>
		//menu/jquery.js
		var contextPath = '<%=cp%>';
		var guideConf = {};
	</script>
	<script type="text/javascript" src="<%=guideDir %>js/json2.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.cookie.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.layout.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/chosen_v1.5.1/chosen.jquery.min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery-ui-1.10.1.custom.min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery-ui-timepicker-addon.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.bgiframe.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.tools.min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.blockUI.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/artDialog/jquery.artDialog.source.js?skin=twitter"></script>
	<script type="text/javascript" src="<%=guideDir %>js/ztree/js/jquery.ztree.all-3.5.min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/ztree/js/jquery.ztree.exhide-3.5.min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/where.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery-powerFloat/js/mini/jquery-powerFloat-min.js"></script>	
	<script language=javascript>
	</script>
</head>
<body style="margin:0;padding:0;">
	<!--
	<input type="button" value="设置外部条件" onclick='top.frames["frame2"].guideConf.outerCondition=[{"table":"市","exp":"${T}.市=10102"}];alert("设置成功");'/>
	<br/>
	top.frames["frame2"].guideConf.outerCondition=[{"table":"市","exp":"${T}.市=10102"}];
	<br/><br/>
	-->
	<form id="form1" action="<%=cp %>/raqsoft/guide/jsp/sample/olap.jsp" target="frame2" method="post" accept-charset="UTF-8">
		<input type='text' name='olap' value='WEB-INF/files/olap/sample.olap'/><br/>
		<input type='text' name='dataSource' value='DataLogic'/><br/>
		<input type='text' name='guyuan' value='3'/><br/>
		<script language=javascript>
			$(document).ready(function(){
				//$('#outerCondition').val('[{"table":"市","exp":"${T}.市=10102"}]');
			});
		</script>
		<input type="button" value="提交" onclick='$("#form1")[0].submit();'/>
	</form>
</body>
</html>

