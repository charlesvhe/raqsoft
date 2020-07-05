<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.dm.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ taglib uri="/WEB-INF/raqsoftAnalyse.tld" prefix="raqsoft" %>
<%

//System.out.println(ConfigUtil.parseDql("DataLogic","select * from 雇员"));

request.setCharacterEncoding("UTF-8");
response.setContentType("text/html;charset=utf8");
System.out.println("Env main path : " + Env.getMainPath());  
String cp = request.getContextPath();
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

if (olap.length() == 0 && dfxScript.length() == 0 && dfxFile.length() == 0 && inputFiles.length() == 0 && fixedTable.length() == 0) {
	olap = "WEB-INF/files/olap/客户情况.olap";
}

//inputFiles = "d:/data/workspace/guide/web/WEB-INF/files/inputFile/7.1.3.b";
//olap="";
//dfxFile = "/WEB-INF/files/dfx/fileTest.dfx";
//if (dataSource.length()==0) dataSource = "DataLogic"; 
//fixedTable="订单";
//System.out.println("outerCondition : " + outerCondition);
//outerCondition="[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='2'\"},{\"table\":\"省\",\"exp\":\"${T}.名称='天津'\"}]";
//outerCondition = "[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='2'\"}]";
//outerCondition="[{\"table\":\"省\",\"exp\":\"${T}.名称='辽宁'\"}]";
//dataSource = "HSQL";

String dataFolderOnServer = "/WEB-INF/files/data/";
String resultRpxPrefixOnServer = "/WEB-INF/files/resultRpx/";
%>

<raqsoft:analysev2
	olap="<%=olap %>"
	dataSource="<%=dataSource %>"
  	fixedTable="<%=fixedTable %>"
	ql="<%=ql %>"
  	dfxFile="<%=dfxFile %>"
  	dfxScript="<%=dfxScript %>"
  	dfxParams="<%=dfxParams %>"
  	inputFiles="<%=inputFiles %>"	
/>

<script>
	/*这些参数可以控制页面的初始状态
	guideConf.maxDataSize = '10';//报表数据集最大的条数，因为在全内存，这个不易过大，被分析的原始数据集可以无限大，过多的数据将被弃用
	guideConf.maxReportSize = '50000';//限制报表的行*列，超出这个数量报错，不能生成报表；提示减少分组/弃用交叉报表重新生成报表
	guideConf.outerCondition = "";//对dql表设置隐含的条件
	guideConf.queryPage = "raqsoft/guide/jsp/query.jsp";//设置查询界面，用来跳转回查询界面重新查询，假如未设置，多表查询默认跳转至raqsoft/guide/jsp/groupQuery.jsp，单表查询默认跳转至raqsoft/guide/jsp/detailQuery.jsp
	guideConf.reportPage = "raqsoft/guide/jsp/showReport.jsp";//查询界面，用来跳转回查询结果重新查询
	guideConf.dataFileType = 'text';//binary是二进制文件，会以游标方式读取，能支持超出内存的数据集
	//不同种类报表单元格的显示属性设置
	guideConf.style = [{"name":"标题","backColor":-1641217,"color":-16777216,"hAlign":-47},{"name":"分组","backColor":-1641217,"color":-16777216,"hAlign":-47},{"name":"指标1","backColor":-1,"color":-16777216,"hAlign":-48},{"name":"指标2","backColor":-853778,"color":-16777216,"hAlign":-48}];
	guideConf.canEditDataSet = 'yes';//是否出现编辑数据集的按钮
	guideConf.canEditReport = 'yes';//是否出现报表配置的区域
	guideConf.showHistoryRpx = 'no';//重新进入分析界面时，假如已经存在历史报表，是否直接显示老报表，否则重新计算报表
	guideConf.showToolBar = 'no';//是否显示上部工具条
	guideConf.defaultWidth = 50;//报表单元格的默认宽度
	guideConf.defaultHeight = 20;//报表单元格的默认宽度
	//根据数据类型自动的显示风格
	guideConf.formatExp = 'if(ifnumber(if(value()==null,"",value())),"#.##",if(ifdate(if(value()==null,"",value())),"yyyy/MM/dd",""))';
	guideConf.showZongji = "yes";//报表里是否显示总计
	guideConf.defaultSaveName = "";//保存olap默认的名称
	guideConf.fileDataFolderOnServer = "/WEB-INF/files/fileData/";//服务器上数据文件目录，txt、csv、xls、xlsx
	guideConf.olapFolderOnServer = "WEB-INF/files/olap/";//服务器上olap文件的根目录，默认/WEB-INF/files/olap/
	guideConf.dataFolderOnServer = "WEB-INF/files/data/";//服务器上缓存数据文件的根目录，默认/WEB-INF/files/data/
	guideConf.dfxFolderOnServer = "WEB-INF/files/dfx/";//服务器上dfx文件的根目录，默认/WEB-INF/files/dfx/
	guideConf.inputFileFolderOnServer = "WEB-INF/files/inputFile/";//服务器上填报数据文件的根目录 ，默认/WEB-INF/files/inputFile/
	guideConf.rpxFolderOnServer = "WEB-INF/files/rpx/";//服务器上报表模板的根目录，默认/WEB-INF/files/rpx/
	guideConf.resultRpxPrefixOnServer = "WEB-INF/files/resultRpx/";//服务器上保存结果报表文件的文件前缀，默认/WEB-INF/files/resultRpx/；当设置"/WEB-INF/files/resultRpx/user1_"时，user1_是文件名的一部分，不是目录
	guideConf.dimDataOnServer = "WEB-INF/files/data/temp/dimData.json";//维值数据，多层的维会自动生成树状数据；默认/WEB-INF/files/data/temp/dimData.json，没有这个文件的时候，根据当前dql数据源自动生成，生成后用户可以根据自己的需求自己再修改这些数据
	guideConf.analyseButs = "1,2,3,4,5,6";//工具栏八个按钮的显示隐藏，默认显示前6个
	*/
	
	$(document).ready(function(){
		document.title = "<%=GuideMessage.get(request).getMessage("guide.web1")%>";
	});
	guideConf.showHistoryRpx = 'no';
	guideConf.emptyReport = "yes";
	var d = new Date();
	guideConf.defaultSaveName = (1900+d.getYear())+(d.getMonth()<9?"0":"")+(d.getMonth()+1)+(d.getDate()<10?"0":"")+d.getDate();
	//guideConf.queryPage = 'raqsoft/guide/jsp/groupQuery.jsp';
	//guideConf.maxDataSize = 10;
	//guideConf.dimDataOnServer = "WEB-INF/files/data/dimData.json"
	//guideConf.showZongji = "no";
	//guideConf.showToolBar = 'no';
	guideConf.dataFileType = 'text';
	guideConf.analyseButs = "7,8";
	guideConf.canEditDataSet = 'no';
	guideConf.canEditReport = 'no';
</script>
