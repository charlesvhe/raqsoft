/*-----------查询模块api-------------------------------------------*/
/*这些参数可以控制页面的初始状态

//查询共用参数
guideConf.queryType = "group";//detail明细查询/group分组查询/mix混合模式
guideConf.analysePage = "raqsoft/guide/jsp/olap_c.jsp";//组表DQL分析界面，用来显示查询结果
guideConf.dataPage = "raqsoft/guide/jsp/data._c.jsp";//组表DQ查询结果界面，用来显示查询结果，主要用来显示大结果集
guideConf.fixedTable = '';//设置界面上要显示的表，可以多个，用逗号隔开

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
guideConf.qyxFolderOnServer = "WEB-INF/files/qyx/";	////服务器上qyx文件的根目录，默认/WEB-INF/files/qyx/
guideConf.showSubTable = 'yes';//是否显示子表
guideConf.fieldAreaWidth = 350;//树状表字段区域的宽度
guideConf.detectLevel = '0';//广义字段自动检测的层数,默认4，0表示让用户在界面上选择
guideConf.maxDimSize = 5000;//自动加载维数据到guideConf.dimDataOnServer文件时，限制每个维得值个数，多出的丢弃
guideConf.filter="default";//设置缺省需要使用的权限条件
guideConf.autoReloadDimDataOnServer = 'yes';//每次进入jsp，是否重新生成dimData.json


//明细查询专用

//分组查询专用
guideConf.dimAreaWidth = 100;//维区域宽度
guideConf.dqlCategory = ['国内公司','海外公司'];//字典里设置的分类项，多个以分号隔开。不设置表示显示全部分类项；否则默认第一个，后面的是可选的
guideConf.showNullGroup = 'user'; //是否显示空分组，yes/no/user，默认yes，user表示让用户在界面上自己选
guideConf.reSort = "yes";// 默认yes，按照拼音重新排序，否则按照lmd里的顺序显示
guideConf.treeStatus = "open";//树上的表是否处于展开状态，默认open，close

*/

var queryApi = {
	//界面上发生一些事件后，用户还想自己做点事情，event里的这些方法是需要用户自定义实现的
	event : {
	}
	//查询
	,submitQuery : function() {
		submitQuery();
	}
	//撤销界面操作
	,undo : function() {
		operations.undo();
	}
	//重做界面操作
	,redo : function() {
		operations.redo();
	}
	//保存qyx
	,saveQyx : function() {
		saveQyx();
	}
	//打开qyx
	,openQyx : function() {
		openQyx();
	}
	//设置字段的编辑风格，tableName，fieldName是lmd里的名称，不是dct里的；editStyle是dimData.json里下拉树数据的名称
	,setEditStyle : function(tabelName,fieldName,editStyle) {
		var f = mdUtils.getField(tabelName,fieldName,true);
		if (f != null) {
			f.edit = editStyle;
		} else {
			alert(resources.guide.js192.replaceAll("{0}",tableName).replaceAll("{1}",fieldName));	
		}
	}
	//设置编辑风格，相同name的编辑风格会被覆盖，def格式如下：{name:'名称',type:1文本编辑框/3日期编辑空间,dateFormat:'yy-mm-dd',timeFormat:'hh:mm:ss'}
	,setEditStyleDef : function(def) {
		var es = defaultEdit.getEditStyle(def.name);
		if (es) editStyles.remove(es);
		editStyles.push(def);
	}
}

/*-----------分析模块api-------------------------------------------*/

/*这些参数可以控制页面的初始状态
guideConf.maxDataSize = '10000';//报表数据集最大的条数，因为在全内存，这个不易过大，被分析的原始数据集可以无限大，过多的数据将被弃用
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
guideConf.formatExp = 'if(ifnumber(if(value()==null,"",value())),"#.##",if(ifdate(if(value()==null,"",value())),"yyyy-MM-dd HH:mm:ss",""))';
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
guideConf.filter="default";//设置缺省需要使用的权限条件
guideConf.autoReloadDimDataOnServer = 'yes';//每次进入jsp，是否重新生成dimData.json
*/

_dsEs = [];
var analyseApi = {
	//界面上发生一些事件后，用户还想自己做点事情，event里的这些方法是需要用户自定义实现的
	event : {
		//初始化一些界面参数
		init : function(){
		}
		//切换报表
		,changeReport : function(){}
	}
	//给数据集字段设置编辑风格，这些编辑风格会自动传递给新建的，基于该数据集的报表
	,setEditStyle4DataSet : function(dataSetName,fieldName,editStyle) {
		_dsEs.push([dataSetName,fieldName,editStyle]);
		var ds = aly.getDataSet(dataSetName);
		if (!ds) {
			console.warn(dataSetName+" dataset not exist！");
			return;
		}
		var f = aly.getDataSetField(ds,fieldName);
		if (!f) {
			console.warn(dataSetName+" dataset ."+fieldName+"  not exist！");
			return;
		}
		var es = defaultEdit.getEditStyle(editStyle);
		if (es == null) console.warn("edit style "+editStyle+"  not exist！");
		f.edit = editStyle;
	}
	//给报表字段设置编辑风格
	,setEditStyle4Report : function(reportName,fieldName,editStyle) {
		var rpx = aly.getRpx(reportName);
		if (rpx ) {
			var f = aly.getRpxFieldByName(rpx,fieldName);
			if (f) {
				f.srcEdit = editStyle;
				return;
			}
		}
		var es = defaultEdit.getEditStyle(editStyle);
		if (es == null) console.warn("edit style "+editStyle+"  not exist！");
		console.warn(dataSetName+" report ."+fieldName+" not exist！");
	}
	//设置编辑风格，相同name的编辑风格会被覆盖，def格式如下：{name:'名称',type:1文本编辑框/3日期编辑空间,dateFormat:'yy-mm-dd',timeFormat:'hh:mm:ss'}
	,setEditStyleDef : function(def) {
		var es = defaultEdit.getEditStyle(def.name);
		if (es) editStyles.remove(es);
		editStyles.push(def);
	}
	//刷新报表，包括配置区域和报表本身
	,refreshRpx : function() {
		aly.refresh();
	}
	/*
	return	
		null:当前没有报表
		report：报表对象
			report.name ：报表名称
			report.where:{
				conf:[] ：	条件的详细配置
			}
	其中条件的详细配置json如下：
	[
		{//字段条件
			"level":1	//层级，高级数要加括号
			,"fieldInfo":{
				"disp":"客户"
				,"dataType":2
				,"edit":"客户"
				,"exp":"客户"
			}
			,"oper":"包含"
			,"values":"VI"
			,"disp":""
		}
		,{//连接
			join:'AND/OR'
			,level:1
		}
	]
	*/
	,getReport : function(){
		var rpx = aly.getCurrRpx();
		if (rpx == null) return null;
		return rpx;
	}
	//是否是明细列表报表	
	,isDetailListRpx : function(name){
		var rpx = aly.getRpx(name);
		if (rpx == null || rpx.type == 2) return false;
		return rpx.fields.length>0&&rpx.lefts.length==0&&rpx.tops.length==0;
	}
	/*
	return 
		null	没有数据集
		dataSet	当前数据集
			dataSet.fields : [
				{
					name:''		字段名称
					,dataType:2	字段类型，1数值、2字符、3日期、4时间、5日期时间
					,edit:''	编辑风格，通过编辑风格可以获得显示值列表
				}
			]
	*/
	,getDataSet : function(){
		var rpx = aly.getCurrRpx();
		if (rpx == null) return null;
		return aly.getDataSet(rpx.dataSet);
	}
	/*
		编辑风格的json如下，假如有data属性，则有显示值，显示值数据还可能是树状结构的
		{name:'编辑风格名称',type:6,data:[
				{ id:1, pId:0, name:"雇员", halfCheck:false, open:true}
				,{ id:2, pId:1, name:"张颖",real:"1",dim:'雇员'}
				,{ id:3, pId:1, name:"王伟",real:"2",dim:'雇员'}
				,{ id:4, pId:1, name:"李芳",real:"3",dim:'雇员'}
			]
		}
	*/
	,getEdit : function(editName) {
		return defaultEdit.getEditStyle(editName);
	}
	/*
	判断服务器上是否存在某个文件，根路径是tag属性里的fileHome（fileHome为空时默认为应用根路径）
	*/
	,fileExist : function (serverFile) {
		var ex = false;
		$.ajax({
			type: 'POST',
			async : false,
			url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
			data: {action:2,oper:'fileExist',file:serverFile},
			success: function(data){
				if (data.indexOf('error:')==0) {
					alert(data.substring(6));
					return;
				}
				ex = data==1;
				
			}
		});
		return ex;
	}
	//保存olap
	,saveOlap : function() {
		saveOlap();
	}
	//打开olap
	,openOlap : function() {
		openOlap();
	}
	//type ：１横向平铺；2纵向平铺；3重叠显示
	,resetReportWindow : function(type) {
		relocalReports(type);
	}
	//管理数据集
	,manageDataSet : function() {
		manageDataSet();
	}
	,complexWhereFunc : function(func) {
		func();
	}
	,udf : {
		modifyOlap : function() {
			
		}
	}

}
