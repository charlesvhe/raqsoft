<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ taglib uri="/WEB-INF/raqsoftQuery.tld" prefix="raqsoft" %>
<%

//ConfigUtil.executeDql("DataLogic","list table");
//ConfigUtil.executeDql("DataLogic","list dim");
//ConfigUtil.executeDql("DataLogic","list field of 订单 depth 3");
//ConfigUtil.executeDql("DataLogic","list field of 订单 dim 市  depth 3");
//ConfigUtil.executeDql("DataLogic","list field of 订单 dim 省  depth 3");

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

if (dataSource.length()==0 && qyx.length() == 0) dataSource = "DataLogic"; 
//fixedTable="订单";
//System.out.println("outerCondition : " + outerCondition);
//outerCondition="[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='${param1}'\"},{\"table\":\"省\",\"exp\":\"${T}.名称='天津'\"}]";
//outerCondition = "[{\"table\":\"雇员\",\"exp\":\"${T}.雇员=${param1}\"}]";
//outerCondition="[{\"table\":\"省\",\"exp\":\"${T}.名称='辽宁'\"}]";
%>

<raqsoft:query
	qyx="<%=qyx %>"
	dataSource="<%=dataSource %>"
	
	analysePage="raqsoft/guide/jsp/analyse.jsp"
 
  	qyxFolderOnServer="WEB-INF/files/qyx/"
  	
  	dqlCategory="国内公司;海外公司"
  	fixedTable="<%=fixedTable %>"
  	outerCondition="<%=outerCondition %>"
  	dimDataOnServer="WEB-INF/files/data/temp/dimData.json"
  	maxDimSize="5000"

	showToolBar="<%=showToolBar %>"
	showSubTable="<%=showSubTable %>"
	showNullGroup="yes"
	detectLevel="6"
	
/>

<script>
	/*
	//具体的数据结构定义请参考raqsoft/guide/js/raqsoftApi.js里的queryApi的定义，里面有详细注释
	queryApi.event.init = function() {
		//guideConf里的一些属性在tag里已经设置，可以通过下面js代码修改tag里设置的值
		guideConf.dqlCategory = ['国内公司','海外公司'];
		guideConf.fixedTable = '';
		guideConf.outerCondition = "";
		guideConf.showSubTable = 'yes';
		guideConf.maxDimSize = '5000';
		guideConf.showNullGroup = 'user';
		guideConf.detectLevel = '0';
		guideConf.showToolBar = 'yes';
		guideConf.showDataSources = 'yes';
		guideConf.dimAreaWidth = 100;
		guideConf.fieldAreaWidth = 350;
		guideConf.emptyReport = 'yes';
		guideConf.treeStatus = "open";
	}
	queryApi.event.init();

	$(document).ready(function(){
		queryApi.setEditStyle("雇员","职务","雇员");
		queryApi.setEditStyleDef({name:'_date',type:3,dateFormat:'yymmdd'});
		queryApi.setEditStyleDef({name:'_time',type:3,timeFormat:'hhmmss'});

		var help = $('<a style="color:#DFDFE3;vertical-align:20px;text-decoration: none;" href="javascript:void(0);"><img style="vertical-align:-7px;margin:0 10px;" src="/guide/raqsoft/guide/img/guide/save.png">保存</a>');
		$('#dqlDataSources').before(help);
		help.click(function(){
			alert('help');
		});
	});

	*/
	//guideConf.outerCondition = "[{\"table\":\"雇员\",\"exp\":\"${T}.雇员='2'\"},{\"table\":\"省\",\"exp\":\"${T}.名称='天津'\"}]";
	guideConf.outerCondition = "[{\"table\":\"bb\",\"exp\":\"${T}.id='1'\"},{\"table\":\"aa\",\"exp\":\"${T}.id='2'\"}]";
	guideConf.treeStatus = "close";
	queryApi.event.init = function() {
		//guideConf.emptyReport = 'yes';
	}
	queryApi.event.init();
	$(document).ready(function(){
		//$('.ui-layout-north').css('background-color','red');
	});
	guideConf.reSort = "yes";
	//guideConf.params = {"param1":2};
	guideConf.dataPage = "raqsoft/guide/jsp/data.jsp";
</script>

