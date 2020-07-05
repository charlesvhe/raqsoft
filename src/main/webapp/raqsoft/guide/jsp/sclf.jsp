<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ taglib uri="/WEB-INF/raqsoftAnalyse.tld" prefix="raqsoft" %>
<%
request.setCharacterEncoding("UTF-8");
response.setContentType("text/html;charset=utf8");  
String cp = request.getContextPath();
String prov = request.getParameter( "prov" );
if (prov == null) prov = "北京";
String view = request.getParameter( "view" );
if (view == null) view = "source";
String olap = request.getParameter( "olap" );
if (olap == null) olap = "";
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
String outerCondition = request.getParameter( "outerCondition" );
if (outerCondition == null) outerCondition = "";
String showSubTable = request.getParameter("showSubTable");
if(showSubTable==null) showSubTable = "yes";
String dataFileType = request.getParameter("dataFileType");
if(dataFileType==null) dataFileType = "text";

if (olap.length() == 0 && dfxFile.length() == 0 && inputFiles.length() == 0 && fixedTable.length() == 0) {
	//olap = "WEB-INF/files/olap/订单明细.olap";
	olap = "WEB-INF/files/olap/sclf.olap";
}

//inputFiles = "d:/data/workspace/guide/web/WEB-INF/files/inputFile/7.1.3.b";
//olap="";
//dfxFile = "/WEB-INF/files/dfx/fileTest.dfx";
//if (dataSource.length()==0) dataSource = "DataLogic"; 
//fixedTable="订单";
//System.out.println("outerCondition : " + outerCondition);
//outerCondition="[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='2'\"},{\"table\":\"省\",\"exp\":\"${T}.名称='天津'\"}]";
//outerCondition = "[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='2'\"}]";
outerCondition = "[{\"table\":\"省\",\"exp\":\"${T}.名称='"+prov+"'\"}]";
//outerCondition="[{\"table\":\"省\",\"exp\":\"${T}.名称='辽宁'\"}]";
//dataSource = "HSQL";

String dataFolderOnServer = "/WEB-INF/files/data/";
String resultRpxPrefixOnServer = "/WEB-INF/files/resultRpx/";
%>

<raqsoft:analyse
	view="olap"
	olap="<%=olap %>"
	dataSource="<%=dataSource %>"
  	fixedTable="<%=fixedTable %>"
	ql="<%=ql %>"
  	dfxFile="<%=dfxFile %>"
  	dfxScript="<%=dfxScript %>"
  	dfxParams="<%=dfxParams %>"
  	inputFiles="<%=inputFiles %>"
	
	fileHome=""
	
	queryPage="/raqsoft/guide/jsp/query.jsp"
	olapPage="/raqsoft/guide/jsp/analyse.jsp"
	reportPage="/raqsoft/guide/jsp/showReport.jsp"
  	maxDataSize="10000"
  	maxReportSize="50000"
  	olapFolderOnServer="/WEB-INF/files/olap/"
  	dataFolderOnServer="<%=dataFolderOnServer%>"
  	dfxFolderOnServer="/WEB-INF/files/dfx/"
  	inputFileFolderOnServer="/WEB-INF/files/inputFile/"
  	rpxFolderOnServer="/WEB-INF/files/rpx/"
  	resultRpxPrefixOnServer="/WEB-INF/files/resultRpx/"
  	
  	outerCondition="<%=outerCondition %>"
  	dimDataOnServer="/WEB-INF/files/data/temp/dimData.json"
	dataFileType="<%=dataFileType %>"
	showSubTable="<%=showSubTable %>"
	
	styleRpx="/WEB-INF/files/style.rpx"
	
	canEditDataSet="yes"
	canEditReport="yes"
	showHistoryRpx="no"
/>

<script>
	/*
	//具体的数据结构定义请参考raqsoft/guide/js/raqsoftApi.js里的analyseApi的定义，里面有详细注释
	analyseApi.event = {
		init : function() {
			//guideConf里的一些属性在tag里已经设置，可以通过下面js代码修改tag里设置的值
			guideConf.maxDataSize = '10000';
			guideConf.maxReportSize = '50000';
			guideConf.outerCondition = "";
			guideConf.dataFileType = 'text';
			guideConf.style = [{"name":"标题","backColor":-1641217,"color":-16777216,"hAlign":-47},{"name":"分组","backColor":-1641217,"color":-16777216,"hAlign":-47},{"name":"指标1","backColor":-1,"color":-16777216,"hAlign":-48},{"name":"指标2","backColor":-853778,"color":-16777216,"hAlign":-48}];
			guideConf.showSubTable = 'no';
			guideConf.canEditDataSet = 'yes';
			guideConf.canEditReport = 'yes';
			guideConf.showHistoryRpx = 'no';
			guideConf.showToolBar = 'no';
			guideConf.defaultWidth = 50;
			guideConf.defaultHeight = 20;
			guideConf.formatExp = 'if(ifnumber(if(value()==null,"",value())),"#.##",if(ifdate(if(value()==null,"",value())),"yyyy-MM-dd",""))';
		}
		//用户自定义条件编辑界面时，可仿照下面的代码实现
		,changeReport : function(){
			return;
			var userWhere = $('#userWhere');
			if (userWhere.length == 0) {
				userWhere = $("<div id='userWhere' style='width:400px;height:200px;top:70px;left:70px;position:absolute;border:1px solid gray;'></div>");
				$('body').append(userWhere);
			}
			userWhere.html('');
			userWhere.append('<input type="text" id="userWhereContent">');
			userWhere.append('<input type="button" id="userWhereBut" value="确定">');
			var report = analyseApi.getReport();
			var dataSet = analyseApi.getDataSet();
			if (report == null || dataSet == null) {
				return;
			}
			userWhere.find('#userWhereContent').val(JSON.stringify(report.where.conf));
			userWhere.find('#userWhereBut').click(function(){
				report.where.conf = JSON.parse(userWhere.find('#userWhereContent').val());				
				analyseApi.refreshRpx();
			});
		}
	}
	analyseApi.event.init();

	guideConf.defaultWidth = 50;
	guideConf.defaultHeight = 20;
	$(document).ready(function(){
		//document.title = "冠名";
		$('.ui-layout-north').css('background-color','red');
	});
	*/
</script>
