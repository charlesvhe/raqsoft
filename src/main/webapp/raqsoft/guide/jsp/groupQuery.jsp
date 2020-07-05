<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ taglib uri="/WEB-INF/raqsoftQuery.tld" prefix="raqsoft" %>
<%
request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();
String qyx = request.getParameter( "qyx" );
if (qyx == null) qyx = "";
String dataSource = request.getParameter( "dataSource" );
if (dataSource == null) dataSource = "";
String fixedTable = request.getParameter( "fixedTable" );
if (fixedTable == null) fixedTable = "";
String outerCondition = request.getParameter( "outerCondition" );
if (outerCondition == null) outerCondition = "";
String showToolBar = request.getParameter("showToolBar");
if(showToolBar==null) showToolBar = "yes";
String showSubTable = request.getParameter("showSubTable");
if(showSubTable==null) showSubTable = "yes";


if (dataSource.length()==0) dataSource = "DataLogic"; 
//fixedTable="订单";
//System.out.println("outerCondition : " + outerCondition);
//outerCondition="[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='${param1}'\"},{\"table\":\"省\",\"exp\":\"${T}.名称='天津'\"}]";
//outerCondition = "[{\"table\":\"雇员\",\"exp\":\"${T}.雇员=${param1}\"}]";
//outerCondition="[{\"table\":\"省\",\"exp\":\"${T}.名称='辽宁'\"}]";
%>

<raqsoft:groupQuery
	qyx="<%=qyx %>"
	dataSource="<%=dataSource %>"
	dictionary="WEB-INF/files/dql/demo.dct"
	visibility="WEB-INF/files/dql/demo.vsb"
/>

<script>

	/*
		
	
	//查询共用参数
	guideConf.queryType = "group";//detail明细查询/group分组查询
	guideConf.analysePage = "raqsoft/guide/jsp/analyse.jsp";//分析界面，用来显示查询结果
	guideConf.fixedTable = '';//只显示某个具体的表

	针对元数据里每个表设置的外部条件json，
		形如：[{"table":"雇员","exp":"${T}.雇员='${param1}'"},{"table":"省","exp":"${T}.名称='天津'"}] 
		${T}是固定写法，表示本表
		其它${}里是一些宏，js里定义的宏值会自动替换(guideConf.params={"param1":2})
	guideConf.outerCondition = "";
	guideConf.params = {param1:2};//给outerCondition里的宏设置宏值

	guideConf.showToolBar = 'yes';//是否显示查询界面上部的工具条
	guideConf.showDataSources = 'yes';//是否显示工具条上的数据源切换
	guideConf.emptyReport = "yes";//跳转到分析界面时，是否默认生成明细列表
	guideConf.defaultSaveName = "";//qyx默认的保存名称
	guideConf.dimDataOnServer = "WEB-INF/files/data/temp/dimData.json";//维值数据，多层的维会自动生成树状数据；默认/WEB-INF/files/data/temp/dimData.json，用户可以根据自己的需求按照相同格式再修改这些数据
	guideConf.qyxFolderOnServer = "WEB-INF/files/qyx/";	
	guideConf.showSubTable = 'yes';//是否显示子表
	guideConf.fieldAreaWidth = 350;//树状表字段区域的宽度
	guideConf.detectLevel = '0';//广义字段自动检测的层数,默认4，0表示让用户在界面上选择
	guideConf.maxDimSize = 5000;//自动加载维数据到guideConf.dimDataOnServer文件时，限制每个维得值个数，多出的丢弃

	//分组查询专用
	guideConf.dimAreaWidth = 100;//维区域宽度
	guideConf.dqlCategory = ['国内公司','海外公司'];//字典里设置的分类项，多个以分号隔开。不设置表示显示全部分类项；否则默认第一个，后面的是可选的
	guideConf.showNullGroup = 'user'; //是否显示空分组，yes/no/user，默认yes，user表示让用户在界面上自己选
	guideConf.reSort = "yes";// 默认yes，按照拼音重新排序，否则按照lmd里的顺序显示
	guideConf.treeStatus = "open";//树上的表是否处于展开状态，默认open，close


	//具体的数据结构定义请参考raqsoft/guide/js/raqsoftApi.js里的queryApi的定义，里面有详细注释
	$(document).ready(function(){
		//queryApi.setEditStyle("雇员","职务","雇员");
		//queryApi.setEditStyleDef({name:'_time',type:3,timeFormat:'hhmmss'});

		var help = $('<a style="color:#DFDFE3;vertical-align:20px;text-decoration: none;" href="javascript:void(0);"><img style="vertical-align:-7px;margin:0 10px;" src="/guide/raqsoft/guide/img/guide/save.png">保存</a>');
		//$('#dqlDataSources').before(help);
		help.click(function(){
			alert('help');
		});
		//$('.ui-layout-north').css('background-color','red');
	});

	*/
	$(document).ready(function(){
		//queryApi.setEditStyleDef({name:'_date',type:3,dateFormat:'yy/mm/dd'});
	});
	guideConf.queryType = "group";
	guideConf.treeStatus = "close";
	guideConf.reSort = "yes";
	guideConf.dimAreaWidth = 100;
	
	guideConf.analysePage = "raqsoft/guide/jsp/analyse.jsp";//分析界面，用来显示查询结果
	
	//guideConf.detectLevel = 0;
	//guideConf.dimDataOnServer = "WEB-INF/files/data/dimData10.json";
	//guideConf.maxDimSize = 10;
	//guideConf.fixedTable = "订单,订单明细";
	//guideConf.dqlCategory = ['海外公司','国内公司'];
	//guideConf.showNullGroup = 'user'; 
	//guideConf.showToolBar = 'no';
	guideConf.dataPage = "raqsoft/guide/jsp/data.jsp";
</script>

