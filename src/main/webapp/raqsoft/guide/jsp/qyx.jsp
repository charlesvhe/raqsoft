<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ page import="com.raqsoft.guide.web.*" %>
<%@ page import="com.raqsoft.guide.util.*" %>
<%@ page import="com.raqsoft.dm.*" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="/WEB-INF/raqsoftQuery.tld" prefix="raqsoft" %>
<%
request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();
String qyx = request.getParameter( "qyx" );
if (qyx == null) qyx = "";
String view = request.getParameter( "view" );
if (view == null) view = "";
String dataSource = request.getParameter( "dataSource" );
if (dataSource == null) dataSource = "";
String fixedTable = request.getParameter( "fixedTable" );
if (fixedTable == null) fixedTable = "";
String filter = request.getParameter( "filter" );
if (filter == null) filter = "default";
String showToolBar = request.getParameter("showToolBar");
if(showToolBar==null) showToolBar = "yes";

if (dataSource.length()==0) dataSource = "DataLogic"; 
String dct = request.getParameter( "dct" );
if (dct == null) dct = "WEB-INF/files/dql/demo.dct";
dct = dct.replaceAll("\\\\", "/");
String vsb = request.getParameter( "vsb" );
if (vsb == null) vsb = ""; //WEB-INF/files/dql/demo.vsb
vsb = vsb.replaceAll("\\\\", "/");
String macro = request.getParameter( "macro" );
if (macro == null) macro = "";
macro = macro.replaceAll("\\\\", "/");

//在session中设置DQL表的权限条件
ArrayList filters = new ArrayList();
session.setAttribute("_raqsoft_filters_",filters);
if (dataSource.length()>0) {
	DQLTableFilter f = new DQLTableFilter("default",dataSource);
	filters.add(f);
	if (vsb.length()>0) f.setVsb(vsb);
	if (macro.length()>0) f.setMacro(macro, null);
//	f.getFilters().put("雇员","${T}.雇员='${登录雇员}'"); //用户可以自己补充表的过滤条件
//	f.getParamValues().put("登录雇员","6");//设置过滤条件里的参数值（宏值）
}

%>
<raqsoft:detailQuery
	qyx="<%=qyx %>"
	dataSource="<%=dataSource %>"
/>

<script>
	/*这些参数可以控制页面的初始状态
	guideConf.queryType = "group";//detail明细查询/group分组查询
	guideConf.analysePage = "raqsoft/guide/jsp/analyse.jsp";//分析界面，用来显示查询结果
	guideConf.fixedTable = '';//只显示某个具体的表
	guideConf.maxDimSize = '5000';//自动生成维显示值时，每个维支持的条数，多于这个的数据会弃用掉
	guideConf.detectLevel = '0';//广义字段自动检测的层数,默认4，0表示让用户在界面上选择
	guideConf.showToolBar = 'yes';//是否显示查询界面上部的工具条
	guideConf.showDataSources = 'yes';//是否显示工具条上的数据源切换
	guideConf.fieldAreaWidth = 350;//树状表字段区域的宽度
	guideConf.emptyReport = "yes";//跳转到分析界面时，是否默认生成明细列表
	guideConf.defaultSaveName = "";//qyx默认的保存名称
	guideConf.dimDataOnServer = "WEB-INF/files/data/temp/dimData.json";//维值数据，多层的维会自动生成树状数据；默认/WEB-INF/files/data/temp/dimData.json，没有这个文件的时候，根据当前dql数据源自动生成，生成后用户可以根据自己的需求自己再修改这些数据
	guideConf.qyxFolderOnServer = "WEB-INF/files/qyx/";
	guideConf.filter="default";
	guideConf.autoReloadDimDataOnServer = 'yes';
	guideConf.scanRow=1000;
	*/
	
	guideConf.queryType = "detail";
	guideConf.dimAreaWidth = 1;//维区域宽度
	guideConf.fixedTable = '<%=fixedTable%>';
	guideConf.analysePage = "raqsoft/guide/jsp/olap.jsp";//分析界面，用来显示查询结果
	guideConf.emptyReport="no";
	guideConf.dct="<%=dct%>";
	guideConf.vsb="<%=vsb%>";
	guideConf.showSubTable="yes";
	/*
	//具体的数据结构定义请参考raqsoft/guide/js/raqsoftApi.js里的queryApi的定义，里面有详细注释

	$(document).ready(function(){
		//queryApi.setEditStyle("雇员","职务","雇员");
		queryApi.setEditStyleDef({name:'_date',type:3,dateFormat:'yy/mm/dd'});
		//queryApi.setEditStyleDef({name:'_time',type:3,timeFormat:'hhmmss'});

		var help = $('<a style="color:#DFDFE3;vertical-align:20px;text-decoration: none;" href="javascript:void(0);"><img style="vertical-align:-7px;margin:0 10px;" src="/guide/raqsoft/guide/img/guide/save.png">保存</a>');
		//$('#dqlDataSources').before(help);
		help.click(function(){
			alert('help');
		});
	});

	*/
	$(document).ready(function(){
		document.title = "<%=GuideMessage.get(request).getMessage("guide.web3")%>";
		//$('.ui-layout-north').css('background-color','red');
	});
	//guideConf.showToolBar = 'no';
	guideConf.dataPage = "raqsoft/guide/jsp/data.jsp";
	guideConf.scanRow=1000;
</script>

