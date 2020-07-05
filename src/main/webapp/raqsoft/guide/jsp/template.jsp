<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.report.util.*" %>
<%@ page import="com.raqsoft.report.model.*" %>
<%@ page import="com.raqsoft.report.usermodel.*" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ page import="com.raqsoft.guide.*" %>
<%@ page import="com.raqsoft.guide.web.*" %>
<%@ page import="com.raqsoft.common.*" %>
<%@ page import="java.sql.*" %>
<%
String jsv = request.getParameter("jsv");
String cp = request.getContextPath();
String title = request.getParameter("title");
if (title == null) title = "Raqsoft Query/Analyse";
String guideDir = cp + request.getParameter("guideDir");
String v = ""+System.currentTimeMillis();
/*
		DBSession dbs = null;
		Connection con = null;
		try {
			ISessionFactory isf = (ISessionFactory)com.raqsoft.dm.Env.getDBSessionFactory("DataLogic");
			Logger.debug(new String("query metadata!"));
			dbs = isf.getSession();
			con = (Connection)dbs.getSession();
			ResultSet rs = con.createStatement().executeQuery("SELECT T0.姓名 姓名 FROM 雇员 T0");
			while (rs.next()) {
				System.out.println("--------");
				System.out.println(rs.getString(1));
				//System.out.println(rs.getString(1));
			}
		} catch (Exception e) {
			//return "";
		} finally {
			try {
				con.close();
			} catch (Exception e) {
				Logger.warn(e);
			}
			try {
				dbs.close();
			} catch (Exception e) {
				Logger.warn(e);
			}
		}
*/

%>
<script>
</script>
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
	<script type="text/javascript" src="<%=guideDir %>js/j_query_yi_jiu_yi.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/common.js?v=<%=v %>"></script>
	<script language=javascript>
		//menu/jquery.js
		var contextPath = '<%=cp%>';
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
		guideConf.analyseButs = "1,2,3,4,5,6";
		guideConf.dataPage = "raqsoft/guide/jsp/data.jsp";
		guideConf.filter="default";
		guideConf.scanRow=100;//自动判断序表字段的数据类型时，扫描多少行数据
		guideConf.autoReloadDimDataOnServer = 'yes';
		var existFileDatas = [];
		
	</script>
	<script type="text/javascript" src="<%=guideDir %>js/json2.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.cookie.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.layout.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/chosen_v1.5.1/chosen.jquery.min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/dqlApi.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/vue.min.js?v=<%=v %>"></script>
	<!-- 
	<link rel="stylesheet" type="text/css" href="<%=guideDir %>js/selectBoxIt/src/stylesheets/jquery.selectBoxIt.css">
	<script type="text/javascript" src="<%=guideDir %>js/jquery-ui.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/selectBoxIt/src/javascripts/jquery.selectBoxIt.min.js"></script>  
	<script type="text/javascript" src="<%=guideDir %>js/raphael-min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.tooltip.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/jquery.qtip-1.0.0-rc3.min.js"></script>
	<script type="text/javascript" src="<%=guideDir %>js/report_v1.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/report.js?v=<%=v %>"></script>
	-->
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
	<%if("v1".equals(jsv)){%>
	<script type="text/javascript" src="<%=guideDir %>js/query_v1.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/dqlreport_v1.js?v=<%=v %>"></script>
	<%}else{%>
	<script type="text/javascript" src="<%=guideDir %>js/query.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>js/dqlreport.js?v=<%=v %>"></script>
	<%}%>
	<script type="text/javascript" src="<%=guideDir %>js/raqsoftApi.js?v=<%=v %>"></script>
</head>
<body style="margin:0;padding:0;overflow:hidden;">
<div id="queryView" style="display:none;">
<div>
</div>
	<div id='bodyDiv' style='width:100%;height:100%;display:none;'>
		<div style="display:none;">
			<iframe id='hiddenFrame' name='hiddenFrame' height="100px" width="100px"></iframe>
			<form id=downloadForm method=post ACTION="<%=cp%>/servlet/dataSphereServlet?action=11" target=hiddenFrame>
				<input type=hidden name=path id=path value="">
				<input type=hidden name=content id=content value="">
				<input type=hidden name=mode id=mode value="">
			</form>
		</div>

		<div style='display:none;position:absolute;z-index:501;top:50px;left:467px;padding:1px 10px;margin-top:1px;' id="exceptNullGroup" title=''></div>
		<div style='display:none;position:absolute;z-index:502;top:50px;left:580px;padding:1px 10px;margin-top:1px;' id="autoFindLevel" title='<%=GuideMessage.get(request).getMessage("guide.web7")%>'></div>

		<div class='mainPanel' style="border:0px;width:100%;height:100%;overflow:hidden;position:;">
			<div class='ui-layout-toolbar' style="overflow:hidden;font-size:14px;position:absolute;top:0;border:0px;height:50px;z-index:30001;background-color:#41455A;width:100%;">
				<img src="<%=guideDir %>img/guide/46.png" style=""/>
				<a title="<%=GuideMessage.get(request).getMessage("guide.web8")%>" href="javascript:submitAnalyse()" style="color:#DFDFE3;vertical-align:20px;text-decoration: none;"><img src="<%=guideDir %>img/guide/15.png" style="vertical-align:-7px;margin:0 10px;"/></a>
				<a title="<%=GuideMessage.get(request).getMessage("guide.web9")%>" href="javascript:submitQuery()" style="color:#DFDFE3;vertical-align:20px;text-decoration: none;"><img src="<%=guideDir %>img/guide/3.png" style="vertical-align:-7px;margin:0 10px;"/></a>
				<a title="<%=GuideMessage.get(request).getMessage("guide.web10")%>" href="javascript:operations.undo()" style="color:#DFDFE3;vertical-align:20px;text-decoration: none;"><img src="<%=guideDir %>img/guide/4.png" style="vertical-align:-7px;margin:0 10px;"/></a>
				<a title="<%=GuideMessage.get(request).getMessage("guide.web11")%>" href="javascript:operations.redo()" style="color:#DFDFE3;vertical-align:20px;text-decoration: none;"><img src="<%=guideDir %>img/guide/32.png" style="vertical-align:-7px;margin:0 10px;"/></a>

				<a href="javascript:saveQyx()" style="color:#DFDFE3;vertical-align:20px;text-decoration: none;"><img src="<%=guideDir %>img/guide/save.png" style="vertical-align:-7px;margin:0 10px;"/><%=GuideMessage.get(request).getMessage("guide.web12")%></a>&nbsp;&nbsp;
				<a href="javascript:openQyx()" style="color:#DFDFE3;vertical-align:20px;text-decoration: none;"><img src="<%=guideDir %>img/guide/2.png" style="vertical-align:-7px;margin:0 10px;"/><%=GuideMessage.get(request).getMessage("guide.web13")%></a>&nbsp;&nbsp;

				<div style='float:right;padding:1px 10px;margin-top:1px;visibility:hidden;' id="dqlDataSources" title='<%=GuideMessage.get(request).getMessage("guide.web14")%>'></div>
				<a href="javascript:moreQuery()" style="display:none;float:right;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin: 15px;" title='<%=GuideMessage.get(request).getMessage("guide.web15")%>'><%=GuideMessage.get(request).getMessage("guide.web16")%></a>
				<div style="clear:both;"></div>
			</div>
			<div id='innerLayout' style="border:0px;">
				<div id='dqlDiv' style="border: 0;position: absolute; margin: 0px; z-index: 2; left: 367px;">
				</div>
				<div class='inner-north' style="border:1px solid #A5ACB5;" id='tableDiv'>
		 		</div>

				<div id="sourceArea">
					<div id="mytabs" style='border:1px solid #A5ACB5;overflow-y:hidden;background-color:#F8F8F8;padding:0;margin:0;'>
						<div class="top_nav" style='display:none;'>
							<ul style='list-style-type:none;margin:0px;padding: 0 0 0 15px;'>
								<li title='拖拽维到左边维区域'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-1' onclick='selectTab(1)' class='selected' href="#"><img src="<%=guideDir %>img/dl/tab-1.png" class='dl_img6' style='vertical-align:middle;border:0px;' src=''>维</a></li>
								<li style='display:none;' title='双击表，打开附表组'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-4' onclick='selectTab(4)' href="#"><img src="<%=guideDir %>img/dl/tab-4.png" style='vertical-align:middle;border:0px;' src=''>表</a></li>
								<li title='双击字段，打开该字段的所在附表'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-2' onclick='selectTab(2)' href="#"><img src="<%=guideDir %>img/dl/tab-2.png" style='vertical-align:middle;border:0px;' src=''>数据项</a></li>
								<li title='拖拽字段到左边字段区域、维表关系列'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-3' onclick='selectTab(3)' href="#"><img src="<%=guideDir %>img/dl/tab-3.png" style='vertical-align:middle;border:0px;' src=''>字段</a></li>
							</ul>
						</div>
						<div id="tabs-2" style='overflow:hidden;'>
							<div id="tabs-2-top" style='clear:both;border:0px;width:98%;padding:5px;margin-bottom:0px;background-color:#F0F0F0;'>
								<div style='padding-top:0px;float:left;'><input type="button" id="fieldShowStyle" onclick='changeShowStyle(this.value);' value="<%=GuideMessage.get(request).getMessage("guide.web35")%>" style="width:100%;height:27px;border: 0;margin: 2px 1px; background-repeat:no-repeat;background-image:url('<%=guideDir %>img/guide/12.png');background-position:6% 6px;color:#333333;border:1px solid #E4E4E4;padding-left:19px;background-color:#F8F8F8;"></div>
								<div style='float:left;padding:0 0 0 10px;margin-top:1px;' id="hideNoRela" title=''></div>
								<div style="display:none;float:left;padding:0 0 0 10px;margin-top:1px;" id="classTableDiv"></div>
								<input type="text" bak="" idx="0" value="<%=GuideMessage.get(request).getMessage("guide.web17")%>" id="filter" filterbak="" class="filter" style="height: 26px; width: 280px; margin: 2px 0 2px 1px;"><img id="filterUp" style="cursor:pointer;border-top:1px solid #E4E4E4;border-bottom:1px solid #E4E4E4;padding:4px 6px;vertical-align:-9px;" src="<%=guideDir %>img/guide/41.png"><img id="filterDown" style="cursor:pointer;border:1px solid #E4E4E4;padding:4px 6px;vertical-align:-9px;" src="<%=guideDir %>img/guide/42.png">
								<div class='filterButton' id="icon_filter" style='border:0px;float:right;height:21px;display:none;'>&nbsp;&nbsp;&nbsp;&nbsp;</div>
							</div>
							<div class="east-west" style='border:0px;overflow-y:auto;margin:0px;padding:0px 2px;'>
								<div id='contentDiv' style='border:0;padding:0px;' class="ztree"></div>
							</div>
						</div>
					</div>
					<div class='' style="background-color:#F8F8F8;" id='dimDiv'>
					</div>
				</div>

			</div>

			<div class="inner-center" id='resultSetDiv' style='border:1px solid #A5ACB5;overflow:hidden;display:none;'>
				<div id='designResultSet' style='padding:5px;'>
					<table style='border:1px solid #BFC2C6';table-layout:fixed;border-collapse:collapse;' border=0 cellspacing=0 cellpadding=0>
						<tr id="resultSetHeader" style='height:26px;text-align:center;'></tr>
						<tbody id="resultSetBody"></tbody>
					</table>
				</div>
				<div id='rsDiv' style='display:none;width:100%;height:100%;overflow:hidden;'>
					<iframe name="rsFrame" id="rsFrame" height="100%" width="100%" style='border:0;'></iframe>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="analyseView" style="display:none;">
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
		<div seq="21" style="margin:2px 5px;" onclick="aly.confField.editStyle(true)"><img src="<%=guideDir %>img/guide/51.png" style="vertical-align:-3px;padding-right:1px;width:15px;height:16px;" /><%=GuideMessage.get(request).getMessage("guide.web52")%></div>
		<span seq="7" style="font-size:1px;display:block;width:100%;border-top:1px solid #AAA;margin:3px 0;"></span>
		<div seq="8" style="color:red;margin:2px 5px;" onclick="aly.confField.del()"><img src="<%=guideDir %>img/guide/13.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web34")%></div>
	</div>
	<div id="calcFieldFloat" style="display:none;background-color:#F3F3F3;border: 1px solid #CCC;">
		<div seq="1" style="margin:2px 5px;" onclick="aly.calcField.edit()"><img src="<%=guideDir %>img/guide/31.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web28")%></div>
		<div seq="2" style="color:red;margin:2px 5px;" onclick="aly.calcField.del()"><img src="<%=guideDir %>img/guide/13.png" style="vertical-align:-3px;" /><%=GuideMessage.get(request).getMessage("guide.web34")%></div>
	</div>

	<div class='ui-layout-north' style="font-size:14px;position:absolute;top:0;border:0px;height:50px;z-index:30001;background-color:#41455A;width:100%;">
		<img src="<%=guideDir %>img/guide/47.png"/>

		<a id="analyseBut1" href="javascript:saveOlap()" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/save.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web12")%></a>
		<a id="analyseBut2" href="javascript:openOlap()" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/2.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web13")%></a>
		<a id="analyseBut3" href="javascript:openDataFile()" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/2.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web37")%></a>
		<a id="analyseBut4" href="javascript:relocalReports(1)" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/8.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web38")%></a>
		<a id="analyseBut5" href="javascript:relocalReports(2)" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/34.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web39")%></a>
		<a id="analyseBut6" href="javascript:relocalReports(3)" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/5.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web40")%></a>
		<a id="analyseBut7" href="javascript:downloadData('txt')" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/txt.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web41")%></a>
		<a id="analyseBut8" href="javascript:downloadData('csv')" style="visibility:hidden;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin-right:10px;"><img src="<%=guideDir %>img/guide/txt.png" style="vertical-align:-7px;margin:0 5px;"/><%=GuideMessage.get(request).getMessage("guide.web42")%></a>

		<div id="queryStatus" style="float:right;padding-right:5px;margin:16px;color:#DFDFE3;"></div>
		<a href="javascript:refreshData()" style="display:none;float:right;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin: 15px;" title=''><%=GuideMessage.get(request).getMessage("guide.web43")%></a>
		<a href="javascript:manageDataSet()" id="dataSetBut" style="display:none;float:right;color:#DFDFE3;vertical-align:20px;text-decoration: none;margin: 15px;" title=''><%=GuideMessage.get(request).getMessage("guide.web44")%></a>
		<div style="clear:both;"></div>
	</div>
	<div class='ui-layout-center' style="border:0px;"></div>
	<div id="analyseConf1" style="width: 762px;display:none;top: 60px; position: absolute; z-index: 20000; right: 20px;">
		<div id="analyseConf2" style="width:752px;height:22px;background-color:#FCA323;padding:4px 0 0 8px;"><%=GuideMessage.get(request).getMessage("guide.web45")%><img src="<%=guideDir %>img/guide/45.png" style="cursor:pointer;padding:0 4px;vertical-align:-2px;"/><img src="<%=guideDir %>img/guide/20.png" style="cursor:pointer;padding:0 4px 4px;float:right;"/><div style="clear:both;"></div></div>
		<div id="analyseConf" style="width:760px;background-color:#EDF5FC;overflow:hidden;"></div>
	</div>
</div>
</body>
</html>

	