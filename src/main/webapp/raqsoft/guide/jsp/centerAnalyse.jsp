<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.dm.*" %>
<%@ taglib uri="/WEB-INF/raqsoftAnalyse.tld" prefix="raqsoft" %>
<%
request.setCharacterEncoding("UTF-8");
response.setContentType("text/html;charset=utf8");

String cp = request.getContextPath();

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

String dataFile = request.getParameter( "dataFile" );
if (dataFile == null) dataFile = "";
String noFile = "";
if (dataFile.length()>0) {
	if ("noFile".equalsIgnoreCase(dataFile)) {
		noFile = "noFile";
	} else {
	String fn = dataFile.toLowerCase();
	if (fn.endsWith(".txt")) {
		dfxScript = "return file(\""+dataFile+"\").import@t()";
	} else if (fn.endsWith(".csv")) {
		dfxScript = "return file(\""+dataFile+"\").import@t(;,\",\")";
	} else if (fn.endsWith(".xls")) {
		dfxScript = "return file(\""+dataFile+"\").importxls@t()";
	} else if (fn.endsWith(".xlsx")) {
		dfxScript = "return file(\""+dataFile+"\").importxls@tx()";
	}
	}
}

String inputFiles = request.getParameter( "inputFiles" );
if (inputFiles == null) inputFiles = "";


%>

<raqsoft:analysev2
	olap=""
	dataSource="<%=dataSource %>"
  	fixedTable=""
	ql="<%=ql %>"
  	dfxFile="<%=dfxFile %>"
  	dfxScript="<%=dfxScript %>"
  	dfxParams="<%=dfxParams %>"
  	inputFiles="<%=inputFiles %>"	
/>

<script>
	/*这些参数可以控制页面的初始状态
	guideConf.maxDataSize = '10000';//报表数据集最大的条数，因为在全内存，这个不易过大，被分析的原始数据集可以无限大，过多的数据将被弃用
	guideConf.maxReportSize = '50000';//限制报表的行*列，超出这个数量报错，不能生成报表；提示减少分组/弃用交叉报表重新生成报表
	guideConf.outerCondition = "";//对dql表设置隐含的条件
	guideConf.queryPage = "raqsoft/guide/jsp/query.jsp";//查询界面，用来跳转回查询结果重新查询
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
	*/
	
	$(document).ready(function(){
		if ("<%=noFile%>" == "noFile") {
			openDataFile();
		}
	});
	guideConf.showHistoryRpx = 'no';
	guideConf.emptyReport = "no";
	var d = new Date();
	guideConf.dimDataOnServer = "WEB-INF/files/data/dimData.json"
	guideConf.defaultSaveName = (1900+d.getYear())+(d.getMonth()<9?"0":"")+(d.getMonth()+1)+(d.getDate()<10?"0":"")+d.getDate();
	guideConf.queryPage = 'raqsoft/guide/jsp/groupQuery.jsp';
	//guideConf.showZongji = "no";
	//guideConf.showToolBar = 'no';
</script>
