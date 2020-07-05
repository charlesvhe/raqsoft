//"use strict"
var dialogCount = 1;
var oldConfig = "";


/*

var sqlDatasets = [
	{
		sqlId:"sqlId1"
		,dataSource:"" //如果服务器管理这些，js里就不用定义
		,sql:"" //如果服务器管理这些，js里就不用定义
		,fields:[为null时，会从服务器尝试查询获得结构
				{
					name:''//字段名称
					,dataType:2//数据类型，1数值、2字符、3日期、4时间、5日期时间
					,edit:''//编辑风格名称
					,exp:'' //计算字段，为空则是原始字段
				}
			]
	}
]

//editStyles:[{name:'ed1',type:1inputbox/2passwordbox/3checkbox/4calendar/5radio/6whereedit/7select/8tree,content:{}}]
rqAnalyse = { //当前分析界面数据对象，主要包含多个待分析的数据集以及基于它们的多个分析报表；该分析界面只对单结果集做分析，没有数据集之间的连接操作。
	currRpx:''//当前选中的报表名称，只有一个报表处于被选中状态	
	,dataSets:[//数据集数组
		{
			name:''//数据集名称
			,type:2//数据集类型，每种类型需要不同的参数，2（dataSource及ql）/3（dfxFile及dfxParams）/4（dfxScript及dfxParams）/5（inputFiles|currTable|tableNames）/6（dql类型dataSource、tableName）/7 (sqlId)
			,fields:[//数据集字段数组，type!=6时才有意义
				{
					name:''//字段名称
					,dataType:2//数据类型，1数值、2字符、3日期、4时间、5日期时间
					,edit:''//编辑风格名称
					,exp:'' //计算字段，为空则是原始字段
				}
			]
			,dataSource:''//数据源名称，数据集type=2或6时才有效
			,ql:''//查询语句，可以是sql，也可以是dql，取决于dataSource的类型
			,dfxFile:''//提供数据集的集算器文件
			,dfxScript:''//提供数据集的集算器脚本
			,dfxParams:''//集算器文件或脚本的参数
			,inputFiles:''//润乾V5填报文件
			,currTable:''//润乾V5填报文件存在多个序表，指定一个序表作为结果集
			,tableNames:''//润乾V5填报文件多个序表的名称
			,tableName:''//type=6时，选择的DQL的表
			,dqlConf:{}//查询界面的配置，对应qyx文件，方便回到查询界面再编辑查询
			,dataId:''//在服务器上缓存数据文件，包含目录
			,rowCount:0//记录该数据集的行数
			,over:0//是否加载完毕，1完毕
			,_status:''//记录当前数据集的配置状态，不为空时，为具体的配置错误信息
			,sqlId:''
			
		}
	],rpxs:[//分析报表数据
		{
			name:'报表名称'//报表名称
			,colWidths:'3:50;4:80'//第三列宽度50，第四列宽度80，用于定义报表每列的宽度
			,rowHeights:'3:50;4:80'//第三行高度50，第四行高度80，用于定义报表每行的高度
			,dataSet:''//数据集名称
			,_hasAggr:'0/1'//当前报表是否有聚合字段，
			,_status:'为空表示报表配置正确，否则为具体的配置错误信息'
			,type:1 //1自动报表、2模板报表
			,dialog:{ //报表窗口在界面上的位置、大小
				open:0/1 //报表是否显示
				,top:100 
				,left:100
				,width:500
				,height:400
			}
			,reportId:''//报表ID
			,structType:1//1:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表
			,template:''//报表模板
			,autoCalc:0/1//是否每次配置变动都重新生成报表
			,isRowData:0/1 //横向/纵向显示数据
			,lefts:[//左表头分组定义，以下的tops是上表头、fields是数据区字段
				name:''//在报表里的字段名称，假如有聚合方式，会在原始字段的基础上自动拼加上聚合名称
				
				//以下是针对type=6的一些属性
				,src:'字段信息'//针对type6的数据集，广义字段的信息，广义字段定义方式参考查询页面对象
				,autoSrc:''//自动变换字段来源，优先通过外键把已选出的字段关联起来。
				,tAlias:''//手动设置的表别名
				,autoTAlias:''//自动的表别名
				,relas:[
					"回款单;;;;回款单,,,,回款日期;;;;年,,,,年,,,,年"
					//,...
				] //针对type6的数据集,记录维与表的关系
				,dim:''//针对type6的数据集,维
				
				,dataType:''//原始字段数据类型
				,srcName:''//原始字段名称
				,srcEdit:''//原始字段编辑风格
				,aggr:'' //聚合方式 sum/count/avg/max/min
				,order:0无序/1升序/2降序
				,groups:[]//lefts,tops里的分组，空分组表示整体聚合,null表示随分组自动聚合
				,analyse:{//兼容以前的分析指标字段，已弃用
					analyseName:'占比/排名/比上期/比同期'
					,field:'被分析的测度字段'
					,scopeGroups:[空则表示针对全部]
				}
				,newAnalyse : {
					leftLevel : ''//值是root/维字段，表示该分析指标的左主格，主格概念参考润乾报表高级教程
					,topLevel : ''//值是root/维字段，表示该分析指标的上主格
					,exp : ''// 类似?1/?2表达式，?1代表下面第一个子项,比如计算比上季度同期，?1代表当前月的值、?2代表往上第三个月的值
					,items : [//
						{
							field:'数据来源字段，可以是维或测度或其它分析字段，但分析字段不能互相引用'
							,value:'curr/find' //当前值、查找值
							//以下属性只针对find
							,aggr:'count/avg/sum/max/min/first'
							,exp:'fieldCurrValue/fieldFindValue/fieldCurrSeq/fieldFindSeq' //'上层维度字段或本测度字段'
						}
					]
				}
				,analysis : {//分析2017/12/29新版
					exp : '?1+1'// ?1/?2，?1代表下面第一个子项
					,name : '排名'
					,items : [
							{
								field:'数据来源字段，可以是维或测度或其它分析字段，但分析字段不能互相引用'
								,pos:[
									{
										dim : ''
										,type : 1// 1当前； 2全部； 3第几个； 4当前往前第几个； 5当前往后第几个
										,value : ''
									}
								]
								,exp:'fieldCurrValue/fieldFindValue/fieldCurrSeq/fieldFindSeq' //'上层维度字段或本测度字段'
								,aggr:'count/avg/sum/max/min/first'
							}
					]
				}

				,exp:''//暂未用到；聚合后的计算字段，要求聚合指标在同一个层次上，否则计算出来的数据没意义。
				,where:{conf:[]} //条件配置
				,having:{conf:[]} //分组后条件配置，暂未用到
				,format:'' //显示格式
				,macroName:'' //模板报表时，该字段对应模板里的参数或宏名称
				,_finalType:''//加上聚合后的最终数据类型
  			,_parentType:'top/left/field' //该字段定义所在区域
				,_fieldType:'group/detail/aggr/analyse' //该字段类型。自动报表时在top、left区域是group；没有top，left时，数据区域里的字段是detail，否则是聚合指标，用户追加的是分析指标
				,_status:'为空表示该字段配置正确，否则为具体错误信息'
			]
			,tops:[]
			,fields:[]
			,where:{conf:[]}//不从属于任何字段的复杂条件
			,calcs:[]
		}
	]
}

*/

var olapObj = new Olap();
var dsu = olapObj.dataSetUtils;
var rpxu = olapObj.rpxUtils;
var rqAnalyse = null;
	
function refreshStatus(dataSet,finishFunc,container) {
	if (!container) container = $('#queryStatus');
	var callback = function(data) {
		if (data.indexOf('error:')==0) {
			alert(data.substring(6));
			return;
		}
		data = eval("("+data+")");
		if (data.error) {
			alert(data.error);
			return;
		}
		dataSet.fields = data.fields;
		dataSet.rowCount = data.loadedRow;
		//viewPage.over = data.over;
		//viewPage.loadedRow = data.loadedRow;
		if (finishFunc && dataSet.rowCount>10) {
			finishFunc();
			finishFunc = null;
		}
		if (data.over == 1) {
			dataSet.over=1;
			if (data.loadedRow == 0) {
				container.html(resources.guide.js104.replaceAll("{0}",dataSet.name));
				return;
			}
			if (finishFunc) finishFunc();
			container.html(resources.guide.js105.replaceAll("{0}",dataSet.name).replaceAll("{1}",data.loadedRow));
		} else {
			if (data.loadedRow == 0) {
				container.html(resources.guide.js104.replaceAll("{0}",dataSet.name));
			} else {
				container.html(resources.guide.js107.replaceAll("{0}",dataSet.name).replaceAll("{1}",data.loadedRow));
			}
			setTimeout(function(){refreshStatus(dataSet,finishFunc,container);},1000);
		}
	}
	olapObj.server({action:2,oper:'getLoadedStatus',dataId:dataSet.dataId},callback);
}

var aly = {
	cache : {
		reports : []
	}
	,set : function(str) {
		olapObj.setConfStr(str);
		rqAnalyse = olapObj.conf;
	}
	,toString : function(rqa) {
		if (rqa) {
			var o1 = new Olap();
			o1.setConf(rqa);
			return o1.getConfStr();
		} else return olapObj.getConfStr();
	}
	,checkDataSet : function(dataSet) {
		dsu.checkDataSet(dataSet);
	}
	,queryDataSet : function(reQuery,dataSet,callback) {
		var ds = aly.getDataSet(dataSet);
		olapObj.server({dqlTableFilterName:guideConf.filter,action:2,oper:'query',reQuery:reQuery,dataId:ds.dataId,type:ds.type,dataSource:ds.dataSource,ql:ds.ql,dfxFile:ds.dfxFile,dfxScript:ds.dfxScript,dfxParams:ds.dfxParams,inputFiles:ds.inputFiles,filter:'',currTable:ds.currTable,dataFileType:guideConf.dataFileType},function(data){
			if (data.indexOf('error:')==0) {
				ds._status = data.substring(6);
				return;
			}
			callback(data);
		});
	}
	//清除排序 
	,removeOrders: function(rpx){
		for (var i=0; i<rpx.fields.length; i++) {
			if (rpx.fields[i] != null) rpx.fields[i].order=0;
		}
		for (var i=0; i<rpx.lefts.length; i++) {
			if (rpx.lefts[i] != null) rpx.lefts[i].order=0;
		}
	}
	,showDataSetRpxs : function(dataSet,lastRpxFunc) {
		var ds = aly.getDataSet(dataSet);
		if (guideConf.showHistoryRpx != 'yes'){
			aly.checkDataSet(dataSet);
			if (ds._status != '') {
				alert(ds._status);
				return;
			}

			if (ds.type!=6 && ds.fields == null) {
				olapObj.server({dqlTableFilterName:guideConf.filter,action:2,oper:'getTableInfo',dataId:ds.dataId,dataFileType:guideConf.dataFileType,scanRow:guideConf.scanRow,isCursor:guideConf.dataFileType=='text'?2:1},function(data){
						if (data.indexOf('error:')==0) {
							ds._status = data.substring(6);
							return;
						}
						if(data.length != 0){
							data = data.replaceAll('<d_q>','"');
							data = JSON.parse(data);
							ds.fields = data.fields;
						}else{
							ds.fields = [];
						}
						for (var i=0; i<ds.fields.length; i++) {
							ds.fields[i].edit = defaultEdit.autoEditStyle(ds.fields[i].dataType,'',ds.fields[i].name);
						}
				});
			}			
			if (ds._status != '') {
				alert(ds._status);
				return;
			}
		}
		/*
		if (!aly.getDataSetField(ds,"静态的")) {
			ds.fields.push({
				name:'静态的'
				,dataType:2
				,edit:''
				,exp:'"aa"'
			});
		}
		*/
		for (var i=0; i<rqAnalyse.rpxs.length; i++) {
			var rpx = rqAnalyse.rpxs[i];
			if (rpx.dataSet != dataSet) continue;
			var cnt = rpx.tops.length+rpx.lefts.length+rpx.fields.length;
			//alert(rpx.fields.length);
			if (ds.fields != null && cnt == 0 && guideConf.emptyReport == 'no') rpx.fields = rpxu.initRpxFields(ds.fields);
			if (!rpx.dialog){
				rpx[i].dialog = {open:1,top:100,left:100+100*i,width:500,height:300};
			}
			if (rpx.autoCalc != 0) rpx.autoCalc = 1;
			//console.log(rqAnalyse.currRpx + "--------" + dataSet);
			if (rqAnalyse.currRpx == rpx.name) {
				//aly.refresh();
			} else if (rpx.dialog.open == 1) aly.refreshReport(rpx.name, false, false);
			initRpxCount++;
			lastRpxFunc();
		}
	}
	,getRpx : function(name, rd) {
		return rpxu.getRpx(name);
	}
	,getDataSet : function(name) {
		return dsu.getDataSet(name);
	}
	,getDataSetField : function(dataSet, field) {		
		return dsu.getDataSetField(dataSet,field);
	}
	,getCurrRpx : function(rd) {
		return rpxu.getCurrRpx()
	}
	,getRpxFieldByName : function(conf, name) {
		return rpxu.getRpxFieldByName(conf,name);
	}
	,modifyRpxFieldName : function(conf, field, name) {
		rpxu.modifyRpxFieldName(conf,field,name);
	}
	,checkConf : function(conf) {
		rpxu.checkConf(conf);
	}
	,refresh : function(noCalc, noRefreshDialog, drillRpx, noAggr, zongji) {
		//alert(rqAnalyse.rpxs[0].fields.length);
		console.debug("aly refresh in ：" + rqAnalyse.currRpx);
		var reportConf = $("#analyseConf");
		var contentDiv = $("#contentDiv");
		var contentDivPos = contentDiv.scrollTop();
		if (contentDivPos==null) contentDivPos = 0;
		//alert(contentDivPos);
		//reportConf.css("visibility","hidden").css("opacity",0);
		var t2 = $('<table border=0 style="border:0;border-collapse:collapse;border:0px;margin:0px 0 10px 10px;" cellspacing=0 cellpadding=0></table>');
		var t3 = $('<table id="reportConfTable" border=0 style="border:0;border-collapse:collapse;border:0px;" cellspacing=0 cellpadding=0></table>');
		reportConf.html("").append(t3);
		t3.append('<tr style="border:1px solid lightgray;"><td style="width:239px;"></td><td style=""></td><td style="width:520px;"></td></tr>');
		var t3tds = t3.find('td');
		t3tds.css({"vertical-align":"top",'background-color':'#FFFFFF'});
		var confsDiv = $("<div style='margin-left: 10px;'></div>");
		var confsTitle = $("<div style='border-right:1px solid #E4E4E4;padding:5px;'><div style='font-weight:bold;color:#333333;float:left;padding:5px 20px 5px 0;'>"+resources.guide.js108+"</div></div>");
		confsDiv.append(confsTitle);
		for (var i=rqAnalyse.rpxs.length-1; i>=0; i--) {
			var confi = rqAnalyse.rpxs[i];
			if(confi.name == drillRpx) continue;
			if (confi.autoCalc != 0) confi.autoCalc = 1;
			var sty = "border-right:1px solid #E4E4E4;";
			if (rqAnalyse.currRpx == confi.name) sty = "border-top:1px solid #E4E4E4;border-bottom:1px solid #E4E4E4;border-left:1px solid #E4E4E4;";
			confsDiv.append("<div style='padding:5px;cursor:pointer;"+sty+"' confName='"+confi.name+"'><img style='vertical-align:-2px;cursor: pointer;' lock=1 src='"+contextPath+(guideConf.guideDir+(confi.autoCalc==1?"/img/guide/17.png":"/img/guide/18.png"))+"'><span style='padding:0 20px 0 5px;vertical-align:1px;'>"+confi.name+"</span><img style='float:right;vertical-align:-2px;cursor:pointer;margin:0 5px;' del=1 src='"+contextPath+guideConf.guideDir+"/img/guide/13.png'><img modify=1 style='vertical-align:-2px;cursor:pointer;margin:0 5px;float:right;' src='"+contextPath+guideConf.guideDir+"/img/guide/31.png'></div>")
		}
		if (rqAnalyse.rpxs.length == 0) {
			confsDiv.append("<div style='font-size:14px;padding:5px;border-right:1px solid #E4E4E4;'>请添加报表</div>");
		}
		confsDiv.find('img[lock=1]').click(function(){
			var cn = $(this).parent().attr('confName');
			var thisConf = aly.getRpx(cn);
			thisConf.autoCalc = thisConf.autoCalc==1?0:1;
			//$(this).attr('src',contextPath+(thisConf.autoCalc==1?"/dl/img/guide/17.png":"/dl/img/guide/18.png"));
			//if (thisConf.autoCalc == 1) {
		    	rqAnalyse.currRpx = cn;
				aly.refresh();
			//}
		});
		confsDiv.find('span').click(function(){
			var cn = $(this).parent().attr('confName');
			//var conf = aly.getRpx(cn);
	    	rqAnalyse.currRpx = cn;
			aly.refresh(true);
		});
		confsDiv.find('img[del=1]').click(function(){
			var cn = $(this).parent().attr('confName');
			rqAnalyse.rpxs.remove(aly.getRpx(cn));
			if (rqAnalyse.currRpx == cn) {
				rqAnalyse.currRpx = '';
			}		
			var reports = aly.cache.reports;
			for (var i=0; i<reports.length; i++) {
				if (reports[i].name == cn) {
					reports[i].dlg.close();
					reports[i].dlg.DOM.wrap.remove();
					reports.remove(reports[i]);
					break;
				}
			}
			aly.refresh();
		});
		confsDiv.find('img[modify=1]').click(function(){
			var cn = $(this).parent().attr('confName');
			var rpx = aly.getRpx(cn);
			if (!rpx.colWidths) rpx.colWidths = '';
			if (!rpx.rowHeights) rpx.rowHeights = '';
			zIndexBak = artDialog.defaults.zIndex;
			var dlg = art.dialog({
				id : dialogCount++,
				title : resources.guide.js109,
		    content: '<div style="margin:'+(rpx.type==1?'20px':'40px 20px')+';"><input type="text" style="width:350px;" id="modifyNameTxt" value="'+cn+'"></div>'
		    	+'<div style="margin:20px;margin-top:0;"><input style="width:350px;'+(rpx.type==1?'':'display:none;')+'" type="text" id="modifyColWidthTxt" placeholder="'+resources.guide.js190.replaceAll('{0}',guideConf.defaultWidth)+'" value="'+(rpx.colWidths?rpx.colWidths:"")+'"></div>'
		    	+'<div style="margin:20px;margin-top:0;"><input style="width:350px;'+(rpx.type==1?'':'display:none;')+'" type="text" id="modifyRowHeightTxt" placeholder="'+resources.guide.js110.replaceAll('{0}',guideConf.defaultHeight)+'" value="'+(rpx.rowHeights?rpx.rowHeights:"")+'"></div>'
		    	+'<div style="margin:20px;margin-top:0;'+(rpx.type==1?'':'display:none;')+'">'+resources.guide.js111+'</div>'
		    ,ok : function() {
					var n = $.trim($('#modifyNameTxt').val());
		    	if (n == '') {
		    		alert(resources.guide.js112);
		    		return false;
		    	}
		    	//$(t2tds[0]).find('div[confName="'+cn+'"]').html(n);
		    	if (aly.getRpx(n) && aly.getRpx(n) != rpx) {
		    		alert(resources.guide.js113);
		    		return false;
		    	}
					var cw = $.trim($('#modifyColWidthTxt').val()).replaceAll("；",";").replaceAll("：",":");
					var rh = $.trim($('#modifyRowHeightTxt').val()).replaceAll("；",";").replaceAll("：",":");
		    	if (cn == n && cw == rpx.colWidths && rh == rpx.rowHeights) return true;
		    	rpx.name = n;
		    	rpx.colWidths = cw;
		    	rpx.rowHeights = rh;
					var reports = aly.cache.reports;
					for (var i=0; i<reports.length; i++) {
						if (reports[i].name == cn) {
							//console.debug();
							//reports[i].dlg.title(n);
							//reports[i].name = n;
							reports[i].dlg.close();
							reports[i].dlg.DOM.wrap.remove();
							reports.remove(reports[i]);
							break;
						}
					}
					artDialog.defaults.zIndex = zIndexBak;
		    	setTimeout(function(){
			    	rqAnalyse.currRpx = n;
						aly.refreshReport(n, false, false);
						aly.refresh();
		    	},1);
		    	return true;
		    }
 		    ,cancel : function() {
		    	artDialog.defaults.zIndex = zIndexBak;
		    	return true;
		    }
		    ,okVal : resources.guide.js20
		    ,cancelVal : resources.guide.js21
		    ,lock : true
		    ,duration : 0
		    ,width : '400px'
				,height : (rpx.type==1?'170px':'80px')
				,opacity : 0.1
				,padding : '2px 2px'
				,zIndex : 41000
			});
		});
		if (guideConf.showOlapList == "no") $(t3tds[0]).css('display','none');
		$(t3tds[0]).append(confsDiv);
		var addReport = $('<div style="margin-right:10px;color:#FFFFFF;background-color:#64CE67;padding:5px;float:right;cursor:pointer;">添加报表</div>');
		addReport.click(function(){
			var cn = resources.guide.js75;
			var count = 1;
			while (aly.getRpx(cn) != null) {
				cn = resources.guide.js75+count;
				count++;
			}
			cn = '';
			zIndexBak = artDialog.defaults.zIndex;
			var dlg = art.dialog({
				id : dialogCount++,
				title : resources.guide.js114,
			    content: '<div style="margin:0 0 0 30px;"><span id="addReportDs"></span></div>'
					+'<div style="margin:10px;"><input type="text" id="addConfName" placeholder="'+resources.guide.js75+'" style="width:260px;margin:10px 0 0 20px;height:30px;" value="'+cn+'"></div>'
			    	+'<div style="margin:0 10px;"><input type="checkbox" id="addReportChk" style="vertical-align:-2px;">'+resources.guide.js115+'</div>'
			    	+'<div style="margin:0 0 0 30px;"><span id="addReportSpan"></span></div>'
			    	
			    ,ok : function() {
					var dataSet = selDom2.val();
					if (dataSet == '') {
			    		alert(resources.guide.js116);
			    		return false;
					}
					var ds = aly.getDataSet(dataSet);
					aly.checkDataSet(dataSet);
					if (ds._status != '')
					{
						alert(ds._status);
						return false;
					}
					if (ds.fields == null && ds.type != 6)
					{
						alert(resources.guide.js117);
						return false;
					}


					var n = $.trim($('#addConfName').val());
			    	if (n == '') {
			    		alert(resources.guide.js112);
			    		return false;
			    	}
			    	
			    	if (aly.getRpx(n)) {
			    		alert(resources.guide.js119);
			    		return false;
			    	}
			    	
			    	var type = 1;
			    	
			    	if ($('#addReportChk')[0].checked && getSelDom1Value(selDom1) != '') {
			    		type = 2;
			    	} 
			    	//var conff = {type:type,name:n,reportId:'r'+new Date().getTime(),show:1,template:getSelDom1Value(selDom1),lefts:[],tops:[],fields:[],wheres:[],isRowData:1};
					var conff = 		{
						name:n
						,dataSet:dataSet
						//,dataSetLevel:'none/calc/where/group/having/order'
						,_hasAggr:0//'0/1'
						,_status:''//'为空表示正确，不为空是失效的具体信息'
						,type:type//1自定义分析报表/2模板报表
						,dialog:{
							open:1//0/1
							,top:100+Math.random()*100
							,left:100+Math.random()*200
							,width:500
							,height:400
						}
						,reportId:"rid"+new Date().getTime()
						,structType:1//:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表
						,template:getSelDom1Value(selDom1)
						,autoCalc:1//0/1
						,isRowData:1//0/1
						,lefts:[
							/*
							name:''
							,src:'字段信息'
							,srcName:''//原始字段名称
							,dataType:''
							,aggr:''
							,use:1
							,order:0无序/1升序/2降序
							,groups:[lefts,tops里的分组，空分组表示整体聚合]/null表示随分组自动聚合
							,analyse:{//指标字段
								analyseName:'占比/排名/比上期/比同期'
								,field:'被分析的测度字段'
								,scopeGroups:[空则表示针对全部]
							}
							,where:{conf:{}}
							,having:{conf:{}}
							,format:''
							,_finalType:''
							,_parentType:'top/left/field'
							,_fieldType:'group/detail/aggr/analyse'
							,_status:'为空表示正确，不为空是失效的具体信息'
							*/
						]
						,tops:[]
						,fields:[]
						,where:{conf:[]}
						,calcs:[]
					};

					if (type == 2) {
						var desc = existRpxDisc[existRpx.indexOf(getSelDom1Value(selDom1))];
						for (var z=0; z<desc.split(";").length; z++) conff.fields[z] = null;
					}
					rqAnalyse.rpxs.push(conff);
					rqAnalyse.currRpx = n;
			    	artDialog.defaults.zIndex = zIndexBak;
			    	aly.refresh();
			    }
			    ,cancel : function() {
			    	artDialog.defaults.zIndex = zIndexBak;
			    	return true;
			    }
			    ,okVal : resources.guide.js20
			    ,cancelVal : resources.guide.js21
			    ,lock : true
			    ,duration : 0
			    ,width : '330px'
				,height : '150px'
				,opacity : 0.1
				,padding : '2px 2px'
				,zIndex : 41000
			});
			var params = {"enableAtLoad":false};
			var selDom1 = getDIYSelectDom(existRpx.length==0?[""]:existRpx, existRpx.length==0?[resources.guide.js120]:existRpx,"", params );
			selDom1.attr('disabled',true).css({'background-color':'#FFFFFF','border':'1px solid lightgray','color':'#333333','padding':'4px','margin-top':'4px','width':'260px','height':'28px'}).attr('title','').change(function(){
			});
			$('#addReportSpan').append(selDom1);
			$('#addReportChk').change(function(){
				selDom1.attr('disabled',(this.checked?false:true));
				$('#select_box_disp').attr('disabled',(this.checked?false:true));
			});

			var ds = [];
			for (var i=0; i<rqAnalyse.dataSets.length; i++)
			{
				ds[i] = rqAnalyse.dataSets[i].name;
			}
			var selDom2 = getSelectDom(ds.length==0?[""]:ds, ds.length==0?[resources.guide.js121]:ds,"");
			selDom2.css({'background-color':'#FFFFFF','border':'1px solid lightgray','color':'#333333','padding':'4px','margin-top':'4px','width':'260px','height':'28px'}).attr('title','').change(function(){
			});
			$('#addReportDs').append(selDom2);
			
		});
			
		$(confsTitle).append(addReport).append('<div style="clear:both;"></div>');
		$(t3tds[2]).css('border-right','1px solid #E4E4E4').append(t2);
		
		var conf = aly.getCurrRpx();
		if (conf == null) return; 
		analyseApi.event.changeReport();
		aly.checkConf(conf);
		var dataSet = aly.getDataSet(conf.dataSet);
		if (dataSet.type == 6) {
			for (var i=0; i<lmds.length; i++)
			{
				if (lmds[i].dsName == dataSet.dataSource)
				{
					lmd = lmds[i].lmd;
					break;
				}
			}
		}
		
		//t2.append('<tr><td style="padding:5px 10px 0;"></td></tr><tr><td style="padding-top:5px;"></td></tr><tr><td></td></tr>');
		t2.append('<tr><td style="padding:5px 10px 0;" rowspan=2></td><td style="padding-top:5px;height:30px;"></td></tr><tr><td></td></tr>');
		var t2tds = t2.find('td');
		t2tds.css({"vertical-align":"top"});
		
		var aggrs = $("<div id='aggrs' style='padding: 2px 0 2px 5px;background-color:#F8F8F8;border:1px solid #E4E4E4;'></div>");
		var items = $("<div id='items' style='width:220px;overflow: auto;max-height: 400px;'></div>");
		//if (contentDiv.length == 0) 
			contentDiv = $("<div id='contentDiv' style='border:0;padding:0px;width:220px;height:400px;overflow:auto;' class='ztree'></div>");
		//$(t2tds[0]).append(aggrs);
			//t2tds[0]是数据集字段列表，可能是树状也可能是字段
		if (dataSet.type == 6) $(t2tds[0]).append(contentDiv);//树状
		var aggrsDef = [{name:'',title:resources.guide.js122},{name:'sum',title:resources.guide.js6},{name:'count',title:resources.guide.js7},{name:'avg',title:resources.guide.js11},{name:'max',title:resources.guide.js10},{name:'min',title:resources.guide.js9},{name:'countd',title:resources.guide.js8}];
		if (!rqAnalyse.currAggr) rqAnalyse.currAggr = '';
		for (var i=0; i<aggrsDef.length; i++) {
			var uis = rqAnalyse.currAggr==aggrsDef[i].name?" class='ui-selected'":"";
			aggrs.append("<div"+uis+" style='float:left;cursor:pointer;' aggr='"+aggrsDef[i].name+"'>"+aggrsDef[i].title+"</div>");
		}
		aggrs.find('div').css({"margin":"2px","padding":"3px"}).click(function(){
			aggrs.find('div').each(function(){
				$(this).removeClass('ui-selected');
			});
			
			var ts = $(this);
			ts.addClass('ui-selected');
			rqAnalyse.currAggr = $(this).attr('aggr');
		}).hover(function(){
			$(this).addClass('ui-selected');
		},function(){
			if (rqAnalyse.currAggr != $(this).attr('aggr'))
			{
				$(this).removeClass('ui-selected');
			}
		});
		
		aggrs.append('<div style="clear:both;"></div>');
		//aggrs.selectable();
		
		$(t2tds[0]).append(items);
		items.css('height','');
		if (items.height()>200) items.css('height','200px');

		var whereDisp = whereUtils.getDisp(conf.where.conf);
		if (whereDisp == '') whereDisp = resources.guide.js123;
		if (whereDisp.length>20) whereDisp = whereDisp.substring(0,20)+"...";
		var whereBut = $("<div style='width:243px;cursor:pointer;padding:5px;border:1px solid #E4E4E4;margin:0 10px 0 0px;border-bottom:0;'>"+whereDisp+"</div>");
		$(t2tds[1]).append(whereBut);
		if (dataSet.type == 6) whereBut.css('visibility','hidden');
		whereBut.click(function(){
			var inFunc = function() {
				var filter1 = "";
				if (dataSet.type == 6 || dataSet.type == 7) filter1 = whereUtils.getExp(conf.where.conf, "T1.", 1);
				else filter1 = whereUtils.getExp(conf.where.conf, "", 1, 2);
				var saveFunc = function () {
					var disp = whereUtils.getDisp(cache.where.wheres);
					if (disp == '') return false;
					conf.where.conf = cache.where.wheres;
					var exp = '';
					if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(conf.where.conf, "T1.", 1);
					else exp = whereUtils.getExp(conf.where.conf, "", 1, 2);
					if (exp != filter1) {
						setTimeout("aly.refresh();",1);
					}
					artDialog.defaults.zIndex = zIndexBak;
					return true;
				 };
				 var clearFunc = function () {
					conf.where.conf = [];
					var exp = '';
					if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(conf.where.conf, "T1.", 1);
					else exp = whereUtils.getExp(conf.where.conf, "", 1, 2);
					if (exp != filter1) {
						setTimeout("aly.refresh();",1);
					}
					artDialog.defaults.zIndex = zIndexBak;
					return true;
				}

				var fields = [];
				if (dataSet.type == 6){
					var ts = aly.getDataSet(conf.dataSet).tableName.split(",");
					for (var i=0; i<ts.length; i++) cus.getFieldInfos(ts[i], fields, 0, null, null,false);
					for (var i=0; i<fields.length; i++) fields[i] = transWhereInfo(fields[i],null,false);
				} else {
					for (var n=0; n<dataSet.fields.length; n++) {
						var itemn = dataSet.fields[n];
						if (itemn.exp && itemn.exp != '') continue;
						fields[fields.length] = {disp:itemn.name,dataType:itemn.dataType,edit:itemn.edit,exp:itemn.name,valueType:1,values:""};
					}
				}
				var initField = fields[0];

				whereUtils.openWhereDialog(saveFunc,clearFunc);
				whereUtils.refresh(fields, initField, JSON.parse(JSON.stringify(conf.where.conf)));
			}
			analyseApi.complexWhereFunc(inFunc);
		});

		
		var div0 = null;
		var div1 = null;
		var div2 = null;
		var div3 = null;
		var divs = [];
		var table = null;
		if (conf.type == 1) { //自定义报表
			table = $('<table border=0 style="border:0;border-collapse:collapse;border:0px;width:100%;" cellspacing=0 cellpadding=0></table>');
			var tbody = $('<tbody>'
							+'<tr>'
								+'<td style="border:1px solid #E4E4E4;width:40%;" colspan=2 rowspan=2><div cType=1>&nbsp;</div></td>'
								+'<td style="border:1px solid #E4E4E4;border-bottom:0;"><div cType=2 style="width:100%;"></div></td>'
							+'</tr>'
							+'<tr>'
								+'<td style="border:1px solid #E4E4E4;border-top:0;height:20px;text-align: center;"></td>'
							+'</tr>'
							+'<tr>'
								+'<td style="border:1px solid #E4E4E4;border-right:0;"><div cType=3 style="width:100%;height:200px;"></div></td>'
								+'<td style="border:1px solid #E4E4E4;width:12px;border-left:0;text-align: center;vertical-align: middle;"></td>'
								+'<td style="border:1px solid #E4E4E4;"><div cType=4></div></td>'
							+'</tr>'
						+'</tbody>');
			table.append(tbody);
			$(t2tds[2]).css('padding','0px 10px 10px 0').append(table);
			
			var tds = tbody.find('td');
			div0 = $(tds[0]).find('div');
			div1 = $(tds[1]).find('div[cType]');
			$(tds[3]).css('height','200px');
			div2 = $(tds[3]).find('div[cType]');
			div3 = $(tds[5]).find('div[cType]');
			var changeRowData = function() {
				//$(t2tds[1]).find('div[isRowData]').html(conf.isRowData==0?"纵向显示数据":"横向显示数据");
			}
			if (conf.fields.length>1){
				var rowDataBut = conf.isRowData==0?$(tds[4]):$(tds[2]);
				rowDataBut.css('background-color','#E0E0E0').css('cursor','pointer').html(resources.guide.js124).click(function(){
					conf.isRowData = conf.isRowData==0?1:0;
					aly.refresh();
				});
			}
			
			
			tbody.find("div").css({width:'100%',height:'100%'});
			for (var i=0; i<conf.tops.length; i++) {
				var topi = conf.tops[i];
				var color = topi._status == ''?'':'gray';
				var divi = $("<div title='"+topi._status+"' style='color:"+color+";' cfName='"+topi.name+"' iType=5 idx='"+i+"'>"+topi.name+"</div>");
				div1.append(divi);
				var orderImg = $('<img confItemName="'+topi.name+'" style="vertical-align:-3px;cursor:pointer;margin:0px;" src="'+contextPath+guideConf.guideDir+'/img/guide/21.png">');
				divi.append(orderImg);
			}
			//if (conf.tops.length == 0) 
				div1.append("<div id='confHints' style='height:18px;width:100%;margin:3px;padding:3px;color:lightgray'>"+resources.guide.js125+"</div>");
				div1.append("<div id='placeHolders' style='height:18px;width:40px;margin:3px;padding:3px;border:1px solid lightgray;display:none;'></div>");
			div1.css({'min-height':'20px', 'min-width':'40px'}).find('#confHints').css('display',conf.tops.length == 0?'block':'none');
			for (var i=0; i<conf.lefts.length; i++) {
				var lefti = conf.lefts[i];
				var color = lefti._status == ''?'':'gray';
				var divi = $("<div title='"+lefti._status+"' style='color:"+color+";' cfName='"+lefti.name+"' iType=6 idx='"+i+"'>"+lefti.name+"</div>");
				div2.append(divi);
				var orderImg = $('<img confItemName="'+lefti.name+'" style="color:'+color+';vertical-align:-3px;cursor:pointer;margin:0px;" src="'+contextPath+guideConf.guideDir+'/img/guide/21.png">');
				divi.append(orderImg);
			}
			//if (conf.lefts.length == 0) 
				div2.append("<div id='confHints' style='height:200px;text-align: center; margin:3px;padding:3px;color:lightgray;'>"+resources.guide.js126+"</div>");
				div2.append("<div id='placeHolders' style='height:18px;width:40px;margin:3px;padding:3px;margin-left:25px;border:1px solid lightgray;display:none;'></div>");
			div2.css({'min-height':'20px', 'min-width':'40px'}).find('#confHints').css('display',conf.lefts.length == 0?'block':'none');
			for (var i=0; i<conf.fields.length; i++) {
				var fieldi = conf.fields[i];
				if (!fieldi._status) fieldi._status = '';
				var bc = fieldi._fieldType=='aggr'?'#DDEBF8':(fieldi._fieldType=='analyse'||fieldi._fieldType=='newAnalyse'?'#FFECB8':'');
				var color = fieldi._status == ''?'':'gray';
				var divi = $("<div title='"+fieldi._status+"' style='color:"+color+";background-color:"+bc+";' cfName='"+fieldi.name+"' iType=7 idx='"+i+"'>"+fieldi.name+"</div>");
				div3.append(divi);
				var orderImg = $('<img confItemName="'+fieldi.name+'" style="vertical-align:-3px;cursor:pointer;margin:0px;" src="'+contextPath+guideConf.guideDir+'/img/guide/21.png">');
				divi.append(orderImg);
			}
			table.find('img[confItemName]').click(function(){
				aly.confField.init($(this).attr('confItemName'));
			}).powerFloat({
				target : $("#confFieldFloat")
				,eventType:'click'
				,zIndex:50000
			});
			//if (conf.fields.length == 0) 
				div3.append("<div id='confHints' style='margin:3px;padding:3px;color:lightgray'>"+resources.guide.js127+"</div>");
				div3.append("<div id='placeHolders' style='height:18px;width:40px;margin:3px;padding:3px;border:1px solid lightgray;display:none;'></div>");
			div3.find('#confHints').css('display',conf.fields.length == 0?'block':'none');
			if (conf.isRowData === undefined) conf.isRowData = 1;
			var div567s = table.find('div[iType=5],div[iType=6],div[iType=7]');
			div567s.css({margin:"3px",padding:"3px",cursor:"move"}).click(function(){
				//var h = $(this).attr("cfName");
				//aly.editConfItem(h);
			});
			var div5s = table.find('div[iType=5]');
			var div6s = table.find('div[iType=6]');
			//div6s.css({float:'left'});
			//div2.css("clear","both");
			div2.append('<div style="clear:left;"></div>');
			var div7s = table.find('div[iType=7]');
			var addCalcBut = $('<img src="'+contextPath+guideConf.guideDir+'/img/guide/9.png" style="cursor:pointer;margin:4px 2px;" title="'+resources.guide.js128+'">');
			div3.append(addCalcBut);
			if (conf.isRowData == 1) {
				//div7s.css({float:'left'});
				//addCalcBut.css({float:'left'});
				//div3.find("#confHints").css({float:'left'});
				//div3.find("#placeHolders").css({float:'left'});
				//div3.append('<div style="clear:left;"></div>');
			}
			div3.css('width','100%').css('height','250px').css('overflow','auto');
			//if (div3.height()>80) div3.css('height','80px');
			if (div3.width()>400) div3.css('width','400px');

			addCalcBut.click(function(){
				aly.editConfItem();
			});
		} else { // conf type is 2
			$(t2tds[1])
				//.append("<div style='float:left;font-weight:bold;padding:5px 20px 5px 0;'>关联数据</div>")
				.append("<div style='margin:0 9px 0 0;cursor:pointer;' id='allReportStyles'></div>")
				//.append('<div style="clear:both;"></div>');
			var existRpxNames = [];
			for (var z=0; z<existRpx.length; z++) existRpxNames[z] = existRpx[z].substring(guideConf.rpxFolderOnServer.length);
			var params = {"enableAtLoad":true,"existRpxDisc":existRpxDisc,"existRpx":existRpx,"conf":conf,"aly":aly};
			var styles = getDIYSelectDom(existRpx.length==0?[""]:existRpx, existRpx.length==0?[resources.guide.js129]:existRpxNames,"",params);
			styles.css({'width':'100%','background-color':'#FFFFFF','border':'1px solid lightgray','color':'#333333','padding':'1px','margin-top':'0','height':'22px'}).attr('title','');
			styles.change(function(){
				var ni = $(this).val();
				var desc1 = existRpxDisc[existRpx.indexOf(ni)];;
				conf.template = ni;
				conf.fields = [];
				for (var i=0; i<desc1.split(";").length; i++) conf.fields[i] = null;
				aly.refresh();
				
			});
			//styles.val(conf.template);
			$('#allReportStyles').append(styles);
			if(params.enableAtLoad){
			var dispDiv = $(styles).find('div')[0];
			dispDiv.className = "select_box_disp_true";
			while(dispDiv.hasChildNodes()) //当div下还存在子节点时 循环继续
	    {
	        dispDiv.removeChild(dispDiv.firstChild);
	    }
			dispDiv = $(dispDiv);
			var selectLis = $(styles).find('ul').children('li');
			for(var l = 0; l < selectLis.length; l++){
				var val = $(selectLis[l]).find('div').attr('value');
				if(val == conf.template){
					var modelOption = $(selectLis[l]).find('div');
					var newNode = modelOption[0].cloneNode();
					var cloneImg = modelOption.children()[0];
					//$(newNode).css("background","url("+cloneImg.src+") no-repeat left center");
					//$(newNode).css("padding-left","28px");
					$(newNode).css("height","20px");
					$(newNode).css("float","left");
					var img = "<img style='heigth:28px;width:20px;float:left' src='"+cloneImg.src+"'/>";
					var cloneText = modelOption.text();
					$(newNode).append(cloneText);
					dispDiv.append(img);
					dispDiv.append(newNode);
				}
			}
			
				dispDiv.css('height','20px');
				dispDiv.attr('value',conf.template);
				dispDiv.parent().attr('value',conf.template);
				dispDiv.parent().find('select').val(conf.template);
			}
			
			
			
			if (conf.template.indexOf("/")==0) conf.template = conf.template.substring(1);//兼容以前的配置，去掉路径前面的/
			var desc = existRpxDisc[existRpx.indexOf(conf.template)];
			currDesc = desc.split(";");	

			table = $('<table border=0 style="width:100%;border:0;border-collapse:collapse;border:0px;" cellspacing=0 cellpadding=0></table>');
			var tbody = $('<tbody></tbody>');
			table.append(tbody);
			$(t2tds[2]).css('padding','5px 10px 0 0').append(table);
			for (var i=0; i<currDesc.length; i++) {
				var fieldi = conf.fields[i];
				var macroName = currDesc[i];
				if (macroName.indexOf("(")>=0) macroName = macroName.substring(0,macroName.indexOf("("));
				else if (macroName.indexOf(":")>=0) macroName = macroName.substring(0,macroName.indexOf(":"));

				var tri = $('<tr><td style="width:100px;">'+macroName+'</td><td><div style="width:100%;height:100%;" cType=6 macroName="'+macroName+'" idx='+i+'></div></td></tr>');
				if (fieldi) {
					var bc = '';//fieldi._fieldType=='aggr'?'#DDEBF9':(fieldi._fieldType=='analyse'?'#42B06A':'');
					var color = fieldi._status == ''?'':'gray';
					var divi = $("<div style='color:"+color+";background-color:"+bc+";' cfName='"+fieldi.name+"' idx='"+i+"'>"+fieldi.name+"</div>");
					var orderImg = $('<img confItemName="'+fieldi.name+'" style="vertical-align:-3px;cursor:pointer;margin:0px;" src="'+contextPath+guideConf.guideDir+'/img/guide/21.png">');
					divi.append(orderImg);
					tri.find('div[macroName]').append(divi);
				} else {
					tri.find('div[macroName]').append('&nbsp;');
				}

				tbody.append(tri);
				divs[i] = tri.find('div');
			}
			tbody.find("td").css('padding','3px').css('border','1px solid #E4E4E4');
			table.find('img[confItemName]').click(function(){
				aly.confField.init($(this).attr('confItemName'));
			}).powerFloat({
				target : $("#confFieldFloat")
				,eventType:'click'
				,zIndex:50000
			});
		}

		var changeFunc = function( event, ui ) {
			//alert(1);
			var container = ui.placeholder.parent();
			var cType = container.attr('cType');
			div1.find('#confHints').css("display",div1.find("div[iType=5]").length-div1.find('.ui-sortable-helper').length>0?"none":"block");
			div2.find('#confHints').css("display",div2.find("div[iType=6]").length-div2.find('.ui-sortable-helper').length>0?"none":"block");
			div3.find('#confHints').css("display",div3.find("div[iType=7]").length-div3.find('.ui-sortable-helper').length>0?"none":"block");

			if (ui.item.attr("iType") == 7) {
				var fieldi = conf.fields[ui.item.attr("idx")];
				if (fieldi._fieldType == 'analyse' && cType != 4) {
					ui.placeholder.css('display',"none");
					return;
				}
			}
			if (conf.type == 1) {
				ui.helper.css('width','').css('height','17px');
				div1.parent().attr('sel',0).css("background-color","");
				div2.parent().attr('sel',0).css("background-color","");
				div3.parent().attr('sel',0).css("background-color","");
				//console.log("----1");
				
				ui.placeholder.html('&nbsp;').css("visibility","visible").css({'display':"block",height:'',padding:"2px",margin:"3px","background-color":"",border:'1px solid gray'});
				//alert (ui.helper.css('width'));
				//ui.placeholder.css('width',ui.helper.width()+"px");
				//if ((cType == 4 && conf.isRowData == 1) || cType == 3) ui.placeholder.css("float","left");
				ui.placeholder.css("float","");
				container.find('#confHints').css('display','none');//.css("visibility","hidden");
				container.parent().attr('sel',1).css("background-color","#FFFF88");
			} else {
				for (var i=0; i<divs.length; i++) {
					divs[i].parent().attr('sel',0).css("background-color","");
				}
				
				ui.placeholder.html('&nbsp;').css("visibility","visible").css({'display':"block",height:'',padding:"2px",float:"",margin:"3px","background-color":"",border:'1px solid gray'});
				//alert (ui.helper.css('width'));
				//ui.placeholder.css('width',ui.helper.width()+"px");
				//if ((cType == 4 && conf.isRowData == 1) || cType == 3) ui.placeholder.css("float","left");
				//ui.placeholder.css("float","");
				//div1.find('#confHints').css("visibility","visible");
				//div2.find('#confHints').css("visibility","visible");
				//div3.find('#confHints').css("visibility","visible");
				//container.find('#confHints').css("visibility","hidden");
				container.parent().attr('sel',1).css("background-color","#FFFF88");
			}
		}
		
		var confOverFunc = function(event, ui) {
			//alert(1);
			if (ui.placeholder.css('display') == 'none') {
				//alert(1);
				aly.refresh(true,true);
				return;
			}
			if (table == null) return;
			var confItems = table.find('div[iType]');
			var newTops = [];
			var newLefts = [];
			var newFields = [];
			//console.log("confOverFunc");
			for (var i=0; i<confItems.length; i++) {
				var ii = $(confItems[i]);
				var iType = ii.attr("iType");
				var idx = ii.attr("idx");
				var parentId = ii.attr("parentId");
				var aggr = ii.attr("aggr");
				var obj = null;
				if (iType == 5) obj = conf.tops[idx];
				else if (iType == 6) obj = conf.lefts[idx];
				else if (iType == 7) obj = conf.fields[idx];
				else if (iType == 1) {
					obj = rpxu.newRpxField(aly.getDataSetField(dataSet,ii.attr("itemId")));
				}
				
				var p = null;
				if (ii.parent()[0] == div1[0]) {
					if (iType==1 || iType==5 || iType==6 || iType==7) p = newTops;
					else p = newFields;
				}
				if (ii.parent()[0] == div2[0]) {
					if (iType==1 || iType==5 || iType==6 || iType==7) p = newLefts;
					else p = newFields;
				}
				if (ii.parent()[0] == div3[0]) {
					p = newFields;
				}
				if (p != null) p.push(obj);
			}
			var leftsClean = conf.lefts.length > 0 && newLefts.length == 0;
			var topsClean = conf.tops.legnth > 0 && newTops.length == 0;
			var removeFieldFilters = leftsClean || topsClean;
			conf.tops = newTops;
			conf.lefts = newLefts;
			conf.fields = newFields;
			if(removeFieldFilters){
				for(var confIndex = 0; confIndex < conf.fields.length; confIndex++){
					var f = conf.fields[confIndex];
					f.where.conf = [];
				}
			}
			setTimeout("aly.refresh()",1);
		}

		//console.log("dataSet.tableName = "+dataSet.tableName);
		if (dataSet.type == 6) {
			if (generateFieldsCounter>=0) {
				guideConf.fixedTable = dataSet.tableName.split(",");
				generateFields(guideConf.fixedTable,[]);
				setTimeout(function(){contentDiv.scrollTop(contentDivPos);},100);
			}
		} else {
			for (var i=0; i<dataSet.fields.length; i++) {
				var item = dataSet.fields[i];
				var itemDiv = $("<div style='padding:3px 5px;border:0px solid #E4E4E4;border-top:0;' name='"+item.name+"'></div>");
				items.append(itemDiv);
				var item0 = $("<div iType=1 itemId='"+item.name+"' style='margin:0 5px;width:80px;'>"+item.name+"</div>");
				itemDiv.append('<img src="'+contextPath+guideConf.guideDir+'/img/guide/27.png" style="float:left;">');
				itemDiv.append(item0);
				if (item.exp && item.exp != '') {
					item0.css('width','64px');
					var orderImg = $('<img confItemId="'+item.name+'" style="float:left;vertical-align:-3px;cursor:pointer;margin:0px;" src="'+contextPath+guideConf.guideDir+'/img/guide/21.png">');
					itemDiv.append(orderImg);
					orderImg.click(function(){
						aly.calcField.init($(this).attr('confItemId'));
					}).powerFloat({
						target : $("#calcFieldFloat")
						,eventType:'click'
						,zIndex:50000
					});
				}
				item0.css({"float":"left"});
				/*
				var item5 = null;
				for (var j=0; j<conf.wheres.length; j++) {
					var itemj = aly.getItem(conf.wheres[j].item);
					if (itemj.type == 5 && itemj.parentId == item.id) {
						item5 = itemj;
						break;
					}
				}
				if (item5 == null) {
					var str = "筛选数据";//JSON.stringify(item.datas);
					if (str) {
						if (str.length>20) str = str.substring(0,20)+"...";
						var itemiDiv = $("<div iType=4 parentId='"+item.id+"' style='margin:0px 5px;float:left;color:#666666;'>&nbsp;<span>"+str+"</span></div>");
						itemDiv.append(itemiDiv);
					}
				} else {
					if (itemj.parentId != item.id) continue;
					var str = JSON.stringify(itemj.content.disp);
					if (str.length>20) str = str.substring(0,20)+"...";
					var itemjDiv = $("<div iType=3 itemId='"+itemj.id+"' parentId='"+item.id+"' style='margin:2px 10px;float:left;'><span>数据范围&nbsp;:&nbsp;"+str+"</span></div>");
					itemDiv.append(itemjDiv);
				}
				*/
				itemDiv.append("<div style='clear:both;'></div>");
			}

			if (dataSet.fields.length>0){
				var addBut = $('<img src="'+contextPath+guideConf.guideDir+'/img/guide/9.png" style="cursor:pointer;margin:4px 2px;" title="'+resources.guide.js130+'">');
				items.append(addBut);
				addBut.click(function(){
					aly.editCalcField(null,function(){
						aly.refresh(true,true);
					});
				});
			}

			items.find('div[iType=1]').css({"cursor":"move"}).draggable({
				//revert:true
				//items: '> tr',
				//forcePlaceholderSize: true,
				connectToSortable: "div[cType]",
				appendTo:'body',
				helper: function(e) {
					var div = $(this);
					//var originals = tr.children();
					//alert(div.attr("iType"));
					/*
					var iType = div.attr("iType");
					var item = null;
					var str = "";
					if (iType == 1) {
						var item = aly.getItem(div.attr('itemId'));
						var aggr = '';
						$('#aggrs').find('div').each(function(){
							if($(this).hasClass('ui-selected')) aggr = $(this).attr('aggr');
						});
						var ts = $('#aggrs').find('.ui-selected');
						//alert(ts.length);
						ts.css({'background-color':'#64CE67'}).animate({'background-color':'#50A171'},300).animate({'background-color':'#64CE67'},300).animate({'background-color':'#50A171'},300).animate({'background-color':'#64CE67'},300,'',function(){
							ts.css({'background-color':''})
						});
						if (aggr != '') {
							str = raqDt.getAggrName(aggr);
							if (["sum","count","countd"].indexOf(aggr)>=0) str = item.name+str;
							else str = str + item.name;
						} else str = item.name;
					}
					var helper = $("<div style='margin:3px;padding:3px;background-color:#F8F8F8;'>"+str+"</div>");
					*/
					var helper = $(this).clone();
					helper.css("z-index",55555).css("opacity","0.8");
					
					//$('body').append(helper);
					//helper.css("width",helper.width());
					return helper;
				}
				//,axis:"y"  
				,drag:function(e, ui){
					var iType = $(this).attr("iType");
					ui.helper.css("z-index",55555);
					if (iType == 1 || iType == 2) {
						ui.helper.css("width",ui.helper.width()+"px");
						if (conf.type == 1) {
							if ((div1 != null && div1.parent().attr("sel")==1) || (div2 != null && div2.parent().attr("sel")==1)) return;
							div3.attr("sel",1).parent().css("background-color","#FFFF88");
						} else {
							
						}
					} else if (iType == 3) {
						//divWhere.attr("sel",1).parent().css("background-color","#FFFF88");
					}
				}
				,stop : function(event, ui) {
					var iType = $(this).attr("iType");
					if (div1 != null) div1.attr("sel",0).parent().css("background-color","");
					if (div2 != null) div2.attr("sel",0).parent().css("background-color","");
					if (div3 != null) div3.attr("sel",0).parent().css("background-color","");
					for (var i=0; i<divs.length; i++) {
						divs[i].attr("sel",0).parent().css("background-color","");
					}
					//confOverFunc(event, ui);
				}
				//,stop:confOverFunc
			});
			
		}

		$( "div[cType=2],div[cType=3],div[cType=4]" ).sortable({
			connectWith : "div[cType=2],div[cType=3],div[cType=4]"
			,tolerance : "pointer"
			,items : "ul,div[iType]"
		    ,change:changeFunc
		    ,start:changeFunc
		    ,stop:confOverFunc
		});
		
		
		try {
	    $( "div[cType=5]" ).droppable({
	        accept: "div[iType=3]",
	        //activeClass: "ui-state-hover",
	        //hoverClass: "ui-state-active",
	        drop: function( event, ui ) {
	    		divWhere.attr("sel",0).parent().css("background-color","");
	    		var iType = ui.draggable.attr('iType');
	    		if (iType == 3) {
	    			var item = aly.getItem(ui.draggable.attr('itemId'));
	    			var p = aly.getItem(ui.draggable.attr('parentId'));
	    			for (var i=0; i<conf.wheres.length; i++) {
	    				var item2 = aly.getItem(conf.wheres[i].item);
	    				if (item2.type == 5) {
			    			var p2 = aly.getItem(item2.parentId);
			    			if (p2.id == p.id) conf.wheres.remove(conf.wheres[i]);
	    				}
	    			}
	    			conf.wheres[conf.wheres.length] = {item:item.id};
	    			setTimeout("aly.refresh()",1);
	    		}
	        }
	    });
		} catch(e) {
			alert(e);
		}

	    if (conf.type == 2) {
		    table.find('div[cType=6]').droppable({
		        accept: "div[iType=1]",
				//accept: ".zTreeDragUL",
		        //activeClass: "ui-state-hover",
		        //hoverClass: "ui-state-active",
		        drop: function(event,ui) {
		    		var itemId = ui.draggable.attr("itemId");
		    		var idx = $(this).attr("idx");
		    		var macroName = $(this).attr("macroName");
		    		//console.log(111);
		    		//console.log(idx);
		    		//console.log(333);
					//var aggr = ui.draggable.attr("aggr");
					var obj = rpxu.newRpxField(aly.getDataSetField(dataSet,itemId));
					obj.aggr = '';
		    		obj.macroName = macroName;
		    		conf.fields[idx] = obj;
		    		setTimeout("aly.refresh();",1);
		    	}
		    	,over: function(event, ui) {
					//console.log("111111111111111111111111");
		    		$( this ).css("background-color","#FFFF88");
		    		//console.log("1" + ui.droppable);
					//console.log("2" + ui.draggable);
		    		
		    	}	
		    	,out: function(event, ui) {
		    		$( this ).css("background-color","");
		    		//console.log("3" + ui.droppable);
					//console.log("4" + ui.draggable);
		        }
		    });

	    }
		
		aly.cache.doms = {div1:div1,div2:div2,div3:div3,divs:divs};
		//if (div1 != null) div1.droppable(bigDrop);

		confsDiv.append('<div id="olapsBottomDiv" style="border-right:1px solid #E4E4E4;height:'+(confsDiv.parent().height()-confsDiv.height())+'px;"></div>');
	    
	    //var ht = $(window).height()-reportConf.height();
	    //if (ht<80) ht = 80;
	    //reportConf.css("top",ht+"px");

		if ($.cookie('reportConfShow') == '0') {
			//reportConf.css({left:0-reportConf.width()+"px"});
		}

		aly.refreshReport(aly.getCurrRpx().name, noCalc, noRefreshDialog, drillRpx, zongji);
	    
	}
	,calcField : {
		currItem : null
		,currTable : null
		,init : function(f,t) {
			aly.calcField.currItem = f;
			aly.calcField.currTable = t;
		}
		,edit : function() {//
			$.powerFloat.hide();
			aly.editCalcField(aly.calcField.currItem,function(itemId){
				/*
				for (var i=0; i<rqAnalyse.rpxs.length; i++) {
					if (!rqAnalyse.rpxs[i].dialog){
						rqAnalyse.rpxs[i].dialog = {open:1,top:100,left:100+100*i,width:500,height:300};
					}
					if (rqAnalyse.rpxs[i].dialog.open == 1) aly.refreshReport(rqAnalyse.rpxs[i].name, false, false);
				}
				*/
				aly.refresh();
			});
		}
		,del : function() {//
			$.powerFloat.hide();
			var conf = aly.getCurrRpx();
			var dataSet = aly.getDataSet(conf.dataSet);
			try{
				var field = aly.getDataSetField(dataSet,aly.calcField.currItem);
				dataSet.fields.remove(field);
			}catch(E){
				var lmdTableObj = mdUtils.getTable(aly.calcField.currTable);
				for(var i = 0; i < lmdTableObj.fields.length; i++){
					if(lmdTableObj.fields[i].name == aly.calcField.currItem){
						lmdTableObj.fields = lmdTableObj.fields.slice(0, i).concat(lmdTableObj.fields.slice(parseInt(i, 10) + 1));
					}
				}
			}
			aly.refresh(true,true);
		}
	}
	,confField : {
		currField : null
		,init : function(f) {
			//alert($('#confFieldFloat').find('[seq='+4+']').length);
			aly.confField.currField = f;
			var conf = aly.getCurrRpx();
			var dataSet = aly.getDataSet(conf.dataSet);
			var field = aly.getRpxFieldByName(conf,f);
			var buts = $('#confFieldFloat');
			var sets = [[1,2,3,4,5,16,6,7,8,18]
				,[9,10,11,12,13,14,15,5,16,6,7,8,18]
				,[5,6,7,8]
				,[5,16,6,7,8,9,10,11,12,13,14,15,17,18]//9,10,11,12,13,14,15,17,
				,[9,10,12,13,14,5,16,6,7,8,18]
				,[5,16,6,7,8,9,10,11,12,13,14,15,17,18]//9,10,12,13,14,17,
			];
			var set = null;
			if (conf.type == 1) {
				set = field._fieldType == 'aggr'?(field.dataType==1?sets[1]:sets[4]):(field._fieldType.indexOf('nalyse')>=0?sets[2]:sets[0]);
				if(field._fieldType == 'aggr' && conf.tops.length == 0 && conf.lefts.length != 0){
					set.push(1);
					set.push(2);
					set.push(3);
				}
				if (dataSet.type == 6) {
					if (field._fieldType == 'aggr') set.push(19);
					if (field._fieldType == 'group') set.push(20);
					
				}
				set.push(21);//自定义显示值表达式
			} else {
				set = field.dataType==1?sets[3]:sets[5];
			}
			var eds = defaultEdit.getTreeEditStyles();
			if (eds.length==0) set.remove(18); 
			for (var i=1; i<=20; i++)
			{
				buts.find('[seq='+i+']').css('display',set.indexOf(i)==-1?'none':'block');
			}
			buts.find('[aggr]').css('visibility','hidden');
			buts.find('[aggr="'+field.aggr+'"]').css('visibility','visible');
			buts.find('[order]').css('visibility','hidden');
			buts.find('[order="'+field.order+'"]').css('visibility','visible');
		}
		,order : function(o){
			var conf = aly.getCurrRpx();
			aly.removeOrders(conf);
			var field = aly.getRpxFieldByName(conf,aly.confField.currField);
			field.order = o;
			$.powerFloat.hide();
			aly.refresh();
		}
		,edit : function() {//
			$.powerFloat.hide();
			aly.editConfItem(aly.confField.currField);
		}
		,editStyle : function(diy) {//
			$.powerFloat.hide();
			var conf = aly.getCurrRpx();
			var field = aly.getRpxFieldByName(conf,aly.confField.currField)
			zIndexBak = artDialog.defaults.zIndex;
			var dlg = art.dialog({
				id : dialogCount++,
				title : (diy == null ? resources.guide.js131 : resources.guide.js131+"表达式"),
				content: 
					'<div id="editStyleDiv" style="margin:20px 10px;"></div>'
				,ok : function() {
					artDialog.defaults.zIndex = zIndexBak;
					if(diy){
						field.diyEdit = $('#diyDisplay').val();
						if(field.diyEdit == "") field.diyEdit = null;
					}else{
						field.srcEdit = selDom4.val();
					}
					aly.refresh();
					return true;
				}
				,cancel : function() {
					artDialog.defaults.zIndex = zIndexBak;
					return true;
				}
				,okVal : resources.guide.js20
				,cancelVal : resources.guide.js21
				,lock : true
				,duration : 0
				,width : '250px'
				,height : '80px'
				,opacity : 0.1
				,padding : '2px 2px'
				,zIndex : 41000
			});
			if(diy){
				var de = '';
				if(field.diyEdit) de = field.diyEdit.replace("\'","\\\'");
				$('#editStyleDiv').append("<input type='text' id='diyDisplay' value='"+de +"'/>").append('<p><span>*与显示值选项冲突,此选项优先</span></p>');
			}else{
				var eds1 = defaultEdit.getTreeEditStyles();
				eds1.splice(0,0,"");
				var eds2 = defaultEdit.getTreeEditStyles();
				eds2.splice(0,0,resources.guide.js132);
				var selDom4 = getSelectDom(eds1, eds2, field.srcEdit);
				selDom4.css({'color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','margin-top':'9px'}).attr('title','').change(function(){
				});
				$('#editStyleDiv').append(selDom4);
			}
		}
		,format : function() {
			$.powerFloat.hide();
			var conf = aly.getCurrRpx();
			var field = aly.getRpxFieldByName(conf,aly.confField.currField)
			setFormat(field.format,field.dataType,function(fmt){
				field.format = fmt;
				aly.refresh();
			})
		}
		,del : function() {//
			var confItemName = aly.confField.currField;
			var conf = aly.getCurrRpx();
			for (var i=0; i<conf.tops.length; i++) {
				if (conf.tops[i].name == confItemName) {
					if (conf.type == 1) conf.tops.remove(conf.tops[i]);
					else conf.tops[i] = null;
					$.powerFloat.hide();
					aly.refresh();
					return;
				}
			}
			for (var i=0; i<conf.lefts.length; i++) {
				if (conf.lefts[i].name == confItemName) {
					if (conf.type == 1) conf.lefts.remove(conf.lefts[i]);
					else conf.lefts[i] = null;
					$.powerFloat.hide();
					aly.refresh();
					return;
				}
			}
			for (var i=0; i<conf.fields.length; i++) {
				if (conf.fields[i] != null && conf.fields[i].name == confItemName) {
					if (conf.type == 1) conf.fields.remove(conf.fields[i]);
					else conf.fields[i] = null;
					$.powerFloat.hide();
					aly.refresh();
					return;
				}
			}
		}
		,where : function(having){
			$.powerFloat.hide();

			var conf = aly.getCurrRpx();
			//alert(aly.confField.currField);
			var field = aly.getRpxFieldByName(conf,aly.confField.currField);
			var dataSet = aly.getDataSet(conf.dataSet);

			if (dataSet.type < 6)
			{
				var dataScope = null;
				var func = function(data) {
					if (data == 'empty') {
						return;
					}				
					if (data.indexOf('info:')==0) {
						alert(data.substring(5));
						return;
					}
					try {
						dataScope = JSON.parse(data);
					} catch(e) {
						console.error(data);
					}
				}
				aly.calcDfxData(aly.getDataSetField(dataSet, field.srcName), conf, func);
				if (dataScope == null) return;
				//alert(dataScope+"111");
				var ed = defaultEdit.getEditStyle(field.srcEdit);
				if (ed != null) ed.dataScope = dataScope;
			}
			//alert(dataScope+"222");
			var filter1 = '';
			if (dataSet.type == 6 || dataSet.type == 7) filter1 = whereUtils.getExp(having==2?field.having.conf:field.where.conf, "T1.", 1);
			else filter1 = whereUtils.getExp(field.where.conf, "", 1, 2);
			var saveFunc = function () {
				var disp = whereUtils.getDisp(cache.where.wheres);
				if (disp == '') return false;
				if (having==2) field.having.conf = cache.where.wheres;
				else field.where.conf = cache.where.wheres;
				if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(having==2?field.having.conf:field.where.conf, "T1.", 1);
				else exp = whereUtils.getExp(field.where.conf, "", 1, 2);
				if (exp != filter1) {
					setTimeout("aly.refresh();",1);
				}
				artDialog.defaults.zIndex = zIndexBak;
				return true;
			 };
			 var clearFunc = function () {
				if (having==2) field.having.conf = [];
				else field.where.conf = [];
				var exp = '';
				if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(having==2?field.having.conf:field.where.conf, "T1.", 1);
				else exp = whereUtils.getExp(field.where.conf, "", 1, 2);
				if (exp != filter1) {
					setTimeout("aly.refresh();",1);
				}
				artDialog.defaults.zIndex = zIndexBak;
				var edit = defaultEdit.getEditStyle(field.srcEdit);
				if (edit) edit.dataScope = null;
				return true;
			}
			var fields = [];
			var initField = null;
			if (dataSet.type == 6){
				var iObj = cus.getInfosObj(field.src);
				if (having == 2) {
					var fd = field.src;
					fd +=  split_2 + iObj.lastTable + split_1 + iObj.lastField + split_1 + split_1 + field.aggr;
					fields = [transWhereInfo(fd,null,true,null,field.calc)];
				} else {
					if (field._fieldType == 'aggr'||field._fieldType == 'detail') {
						cus.getFieldInfos(iObj.firstTable, fields, 0, null, null,true);
						for (var i=0; i<fields.length; i++){
							if(fields[i].split(";;;;").length != 2) {//目前计算字段只存在于第一层
								fields[i] = transWhereInfo(fields[i],null,false,null,null);
								continue;
							}
							var t = fields[i].split(";;;;")[0];
							var f = fields[i].split(";;;;")[1].split(",,,,")[1];
							var fi_ = mdUtils.getField(t,f,true);
							fields[i] = transWhereInfo(fields[i],null,false,null,fi_.exp);
						}
						initField = transWhereInfo(field.src,null,false,null,field.calc);
					} else fields = [transWhereInfo(field.src,field.name,false,null,field.calc)];
					
				}
			} else {
				//2019.4.24
				fields[0] = {disp:field.name,dataType:field.dataType,edit:field.aggr==""?field.srcEdit:"",exp:field.src,valueType:1,values:""};
			}
			if (initField == null) initField = fields[0];

			whereUtils.openWhereDialog(saveFunc,clearFunc);
			whereUtils.refresh(fields, initField, JSON.parse(JSON.stringify(having==2?field.having.conf:field.where.conf)),having==2);

		}
		,rela : function() {
			$.powerFloat.hide();
			var conf = aly.getCurrRpx();
			var field = aly.getRpxFieldByName(conf,aly.confField.currField);
			var dlg = art.dialog({
				id : dialogCount++,
				title : resources.guide.js133,
				content: 
					'<div id="editRelaDiv" style="margin:20px 10px;"></div>'
				,ok : function() {
					artDialog.defaults.zIndex = zIndexBak;
					var relas = [];
					var sels = $('#editRelaDiv select');
					for (var i=0; i<sels.length; i++) relas.push($(sels[i]).val());
					field.relas = relas;
					aly.refresh();
					return true;
				}
				,cancel : function() {
					artDialog.defaults.zIndex = zIndexBak;
					return true;
				}
				,okVal : resources.guide.js20
				,cancelVal : resources.guide.js21
				,lock : true
				,duration : 0
				,width : '300px'
				,height : '160px'
				,opacity : 0.1
				,padding : '2px 2px'
				,zIndex : 41000
			});
			
			var usedTables = rpxu.getUsedTables(conf);
			for (var i=0; i<usedTables.length; i++) {
				var tObj = mdUtils.getTable(usedTables[i]);
				var dimObj = mdUtils.getDim(field.dim);
				var infoss = [];
				dqlQuery.confUtils.getDimInfos(usedTables[i], field.dim, infoss, 0, false);
				if (infoss.length>0) {
					var disps = [];
					for (var j=0; j<infoss.length; j++){
						var objj = dqlQuery.confUtils.getInfosObj(infoss[j]);
						disps[j] = objj.alias2;
					}
					
					var rela = null;
					for (var j=0; j<field.relas.length; j++) {
						if (dqlQuery.confUtils.getInfosObj(field.relas[j]).firstTable == usedTables[i]) {
							rela = field.relas[j];
							break;
						}
					}
					
					if (infoss)
					var selDom = getSelectDom(infoss, disps,rela);
					selDom.attr('id','confItemAggrGroup1').css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'4px'}).attr('title','').change(function(){
						//d2.css('display',$(this).val()==1?'none':'block');
					});
					$('#editRelaDiv').append(tObj.dispName+"&nbsp;:&nbsp;").append(selDom).append("<br>");
				} else $('#editRelaDiv').append(tObj.dispName+"&nbsp;:&nbsp;"+resources.guide.js134+"["+dimObj.dispName+"]<br>");
				
			}
			
		}
		,aggr : function(aggr) {
			$.powerFloat.hide();
			var conf = aly.getCurrRpx();
			var field = aly.getRpxFieldByName(conf,aly.confField.currField);
			//去掉过滤条件
			if(field.aggr != aggr){
				field.where.conf = [];
			}
			field.aggr = aggr;
			aly.refresh();
		}
	}
	,editConfItem : function(name){
		"use strict";
		var conf = aly.getCurrRpx();
		if (!name) name = '';
		var confField = null;
		var isNew = true;
		var isTest = true;
		//var 
		if (name != '') {
			confField = aly.getRpxFieldByName(conf,name);
			isNew = false;
		} else {
			//aly.getNewConfFieldName(conf,item.name,rd)
			//analyse:{analyseName:'占比/排名/比上期/比同期',field:'被分析的测度字段',scopeGroups:[空则表示针对全部]},format:'',dataType:'',_parentType:'top/left/field',_fieldType:'group/detail/aggr/analyse',_status:'为空表示正确，不为空是失效的具体信息'}
			confField = {name:''
				,src:''
				,autoSrc:''
				,dataType:''//原始字段数据类型/或聚合后计算字段的表达式
				,srcName:''//原始字段名称
				,srcEdit:''//编辑风格
				,aggr:''
				,use:1
				,order:0//无序/1升序/2降序
				,groups:null//null表示随分组自动聚合
				,analyse:{//指标字段
					analyseName:''
					,field:''
					,scopeGroups:[]
				}
				,newAnalyse:null
				,exp:''//聚合后的计算字段，要求聚合指标在同一个层次上，否则计算出来的数据没意义。
				,where:{conf:[]} //去掉,exp:"",disp:""
				,having:{conf:[]}
				,format:''
				,macroName:''
				,_finalType:''//加上聚合后的最终数据类型
  			,_parentType:'field'
				,_fieldType:isTest?'newAnalyse':'analyse'
				,_status:''
			}
			//{name:'',srcItems:[],item:'',use:1,order:0,exp:"",aggrExp:"",macroName:'',groups:null,analyse:{analyseName:'排名',field:'',scopeGroups:[]},format:'',dataType:2,_fieldType:'analyse',_parentType:'field'};
		}

		var aggrs = [];
		for (var i=0; i<conf.fields.length; i++) {
			if (conf.fields[i]._fieldType == 'aggr') {
				aggrs[aggrs.length] = conf.fields[i].name;
			}
		}

		zIndexBak = artDialog.defaults.zIndex;
		var dlg = art.dialog({
			id : dialogCount++,
			title : isNew?resources.guide.js135:resources.guide.js136,
	    content: '<div style="margin:10px;"><input type="text" id="confItemName" placeholder="'+resources.guide.js118+'" style="width:210px;height:30px;" value="'+name+'"></div>'
	    	+(confField._fieldType=='aggr'?'<div id="confItemAggrGroup" style="margin:10px;"></div>':'')
	    	+(confField._fieldType.indexOf('nalyse')>=0?'<div id="newAnalyse" style="margin:10px;display:none;"></div><div id="confItemAggrs" style="margin:10px;display:none;"></div><div id="confItemAnalyse" style="margin:10px;display:none;"></div><div id="confItemAnalyseGroups" style="margin:10px;display:none;"></div>':'')
	    ,ok : function() {
	    	if (isTest && confField._fieldType=='newAnalyse') {
	    		return analyseSave();
	    	}
				var groups = null;
				var analyseName = '';
				var aggr = '';
				var scopeGroups = [];					
				if (confField._fieldType=='aggr') {
					if ($('#confItemAggrGroup1').val() == 2) {
						var divs = $('#confItemAggrGroup').find('div .ui-selected');
						groups = [];
						for (var i=0; i<divs.length; i++) groups[groups.length] = $(divs[i]).html();
					}
				} else if (confField._fieldType=='analyse') {
					if (aggrs.length == 0) {
						return true;
					}
					analyseName = $('#confItemAggrs2').val();
					aggr = $('#confItemAggrs1').val();
					var divs = $('#confItemAnalyseGroups').find('div .ui-selected');
					for (var i=0; i<divs.length; i++) scopeGroups[scopeGroups.length] = $(divs[i]).html();
				}
				var n = $.trim($('#confItemName').val());
		    	if (n == '') {
		    		alert(resources.guide.js112);
		    		return false;
		    	}
		    	if (!isNaN(parseInt(n[0]))) {
		    		alert("不能以数字开头！");
		    		return false;
		    	}
		    	if (aly.getRpxFieldByName(conf,n)!=null && n!=confField.name) {
		    		alert(resources.guide.js113);
		    		return false;
		    	}
		    	
				if (confField._fieldType=='aggr') {
					if (groups != null && groups.length>0) {
						var oldGroups = confField.groups;
						confField.groups = groups;
						aly.checkConf(conf);
						if (confField._status != '') {
							alert(confField._status);
							confField.groups = oldGroups;
							confField._status = '';
							return false;
						}
					} else confField.groups = groups;
				} else if (confField._fieldType=='analyse') {
					if (isNew) {
						confField.name = 'tempName';
						conf.fields[conf.fields.length] = confField;
			    	}
					var oldAggr = confField.analyse.field;
					var oldAnalyseName = confField.analyse.analyseName;
					var oldScopeGroups = confField.analyse.scopeGroups;
					confField.analyse.analyseName = analyseName;
					confField.analyse.field = aggr;
					confField.analyse.scopeGroups = scopeGroups;
					aly.checkConf(conf);
					if (confField._status != '') {
						alert(confField._status);
						if (isNew) {
							conf.fields.remove(confField);
						} else {
							confField.analyse.analyseName = oldAnalyseName;
							confField.analyse.field = oldAggr;
							confField.analyse.scopeGroups = oldScopeGroups;
						}
						confField._status = '';
						return false;
					}
				}
				aly.modifyRpxFieldName(conf,confField,n);		    	
	    	
	    	artDialog.defaults.zIndex = zIndexBak;
	    	setTimeout(function(){aly.refresh();},1);
	    	return true;
	    }
	    ,cancel : function() {
	    	artDialog.defaults.zIndex = zIndexBak;
	    	return true;
	    }
	    ,okVal : resources.guide.js20
	    ,cancelVal : resources.guide.js21
	    ,lock : true
	    ,duration : 0
		  ,width : isTest?"900px":(confField._fieldType=='aggr'?'550px':(confField._fieldType=='analyse'?'550px':'240px'))
			,height : isTest?"500px":(confField._fieldType=='aggr'?'230px':(confField._fieldType=='analyse'?'300px':'63px'))
			,opacity : 0.1
			,padding : '2px 2px'
			,zIndex : 41000
		});
		$('.aui_content').css('overflow','auto');
		var currAnalyse = null;
		if (confField._fieldType=='aggr') {
			if (confField.aggr != 'avg') { // 2017/05/25 : confField.aggr != 'countd' && 
				var d1 = $('#confItemAggrGroup');
				//TODO 把聚合改为具体的求和、计数等
				var selDom4 = getSelectDom([1,2], [resources.guide.js139,resources.guide.js140],confField.groups==null?1:2);
				selDom4.attr('id','confItemAggrGroup1').css('width','210px').css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'4px'}).attr('title','').change(function(){
					d2.css('display',$(this).val()==1?'none':'block');
				});
				var d2 = $('<div style="display:'+(confField.groups==null?'none':'block')+';margin:0 10px;"></div>');
				d2.append("<div style='color:gray;margin:10px 7px;'>"+resources.guide.js141+"</div>");
				var lefts = [];
				//if (conf.lefts.length>0) d2.append("<div>左表头分组</div>"); 
				for (var i=0; i<conf.lefts.length; i++) {
					var ni = conf.lefts[i].name;
					if (confField.groups!=null&&confField.groups.indexOf(ni)>=0) d2.append("<div sel=1>"+ni+"</div>");
					else d2.append("<div seq='l"+i+"' sel=0>"+ni+"</div>");
				}
				var tops = [];
				if (conf.tops.length>0) {
					if (conf.lefts.length>0) d2.append("<div style='font-size:3px;clear:both;'>&nbsp;</div>");
					//d2.append("<div>上表头分组</div>");
				}
				for (var i=0; i<conf.tops.length; i++) {
					var ni = conf.tops[i].name;
					if (confField.groups!=null&&confField.groups.indexOf(ni)>=0) d2.append("<div sel=1>"+ni+"</div>");
					else d2.append("<div seq='t"+i+"' sel=0>"+ni+"</div>");
				}
				
				d2.find('div[sel=1]').addClass('ui-selected');
				d2.find('div[sel]').css('float','left').css('margin','2px').css('padding','5px').css('cursor','pointer');
				//p.append('<div'+((selectDatas.length>0&&selectDatas.indexOf(ss1[i])>=0)?' class="ui-selected"':"")+' style="padding:5px;margin:2px;float:left;" disp="'+(ss2==null?"":ss2[i])+'" value="' + ss1[i] + '">'+disp+'</div>');
				d2.bind("mousedown", function(e) {
					  e.metaKey = true;
				}).selectable({
					filter: "div[sel]"
					,stop: function() {
					}
				});
				
				d1.append(selDom4).append(d2);//.css('display','none');//TODO 16/12/29隐藏掉这个汇总显示的功能
			}
		} else if (confField._fieldType=='analyse') {
			$('#confItemName').css('width','270px');
			var d5 = $('#confItemAnalyse');
			var selDom3 = getSelectDom([resources.guide.js142,resources.guide.js143,resources.guide.js144,resources.guide.js145], [resources.guide.js142,resources.guide.js143,resources.guide.js144,resources.guide.js145], confField.analyse.analyseName);
			selDom3.attr('id','confItemAggrs2').css('width','198px').css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'4px'}).attr('title','').change(function(){
				//changeClassTable();
			});
			d5.css('display','block').append("<span style='font-weight:bold;'>"+resources.guide.js146+"　：</span>").append(selDom3);

			var d1 = $('#confItemAggrs');
			if (aggrs.length == 0) {
				d1.css('display','block').html("<span style=font-weight:bold;'>"+resources.guide.js147+"：</span>"+resources.guide.js148);
				return;
			}
			var selDom4 = getSelectDom(aggrs, aggrs, confField.analyse.field);
			selDom4.attr('id','confItemAggrs1').css('width','198px').css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'4px'}).attr('title','').change(function(){
				//changeClassTable();
			});
			d1.css('display','block').append("<span style='font-weight:bold;'>"+resources.guide.js147+"：</span>").append(selDom4);
			
			var d3 = $('#confItemAnalyseGroups');
			d3.append('<span style="font-weight:bold;">'+resources.guide.js149+'　：</span>');
			d3.append("<span style='color:gray;margin:10px 0px;'>"+resources.guide.js150+"</span>");
			d3.append('<div style="font-size:1px;">&nbsp;</div>');
			var d2 = $('<div style="margin-left:65px;"></div>');
			d3.append(d2);
			var lefts = [];
			//if (conf.lefts.length>0) d2.append("<div>左表头分组</div>"); 
			for (var i=0; i<conf.lefts.length; i++) {
				var ni = conf.lefts[i].name;
				if (confField.analyse.scopeGroups!=null&&confField.analyse.scopeGroups.indexOf(ni)>=0) d2.append("<div sel=1>"+ni+"</div>");
				else d2.append("<div seq='l"+i+"' sel=0>"+ni+"</div>");
			}
			var tops = [];
			if (conf.tops.length>0) {
				if (conf.lefts.length>0) d2.append("<div style='clear:both;'></div>");
				//d2.append("<div>上表头分组</div>");
			}
			for (var i=0; i<conf.tops.length; i++) {
				var ni = conf.tops[i].name;
				if (confField.analyse.scopeGroups!=null&&confField.analyse.scopeGroups.indexOf(ni)>=0) d2.append("<div sel=1>"+ni+"</div>");
				else d2.append("<div seq='t"+i+"' sel=0>"+ni+"</div>");
			}
			
			d2.find('div[sel=1]').addClass('ui-selected');
			d2.find('div[sel]').css('float','left').css('margin','2px').css('padding','5px').css('cursor','pointer');
			//p.append('<div'+((selectDatas.length>0&&selectDatas.indexOf(ss1[i])>=0)?' class="ui-selected"':"")+' style="padding:5px;margin:2px;float:left;" disp="'+(ss2==null?"":ss2[i])+'" value="' + ss1[i] + '">'+disp+'</div>');
			d2.bind("mousedown", function(e) {
				  e.metaKey = true;
			}).selectable({
				filter: "div[sel]"
				,stop: function() {
			    }
			});
			
			d3.css('display','block');
		} else if (confField._fieldType=='newAnalyse') {
			/*
				,newAnalyse : {
					leftLevel : ''//root/维字段
					,topLevel : ''//root/维字段
					,exp : ''// ?1/?2，?1代表下面第一个子项
					,items : [
						{
							field:'数据来源字段，可以是维或测度或其它分析字段，但分析字段不能互相引用'
							,value:'curr/find' //当前值、查找值
							//以下属性只针对find
							,aggr:'count/avg/sum/max/min/first'
							,exp:'fieldCurrValue/fieldFindValue/fieldCurrSeq/fieldFindSeq' //'上层维度字段或本测度字段'
						}
					]
				}
			*/
			
			if (!confField.newAnalyse) {
				confField.newAnalyse = {
					leftLevel : ''//root/维字段
					,topLevel : ''//root/维字段
					,exp : ''// ?1/?2，?1代表下面第一个子项
					,items : [
					]
				};
			}
					
			var na = $('#newAnalyse');
			na.css('display','block');
			
			let d1 = $('<div id="analyseD1"></div>');
			let d2 = $('<div id="analyseD2"></div>');
			let d3 = $('<div id="analyseD3"></div>');
			let d4 = $('<div id="analyseD4"></div>');
			let d11 = $('<div></div>');
			let d22 = $('<div style="border-left:3px solid lightgray;margin:10px 2px 0;padding-left:5px;"></div>');
			na.append(d11);
			na.append(d22);
			d22.append(d3);
			d22.append(d4);

			var lefts = [];
			if (conf.lefts.length>0) {
				d11.append(d1);
				var pos = conf.lefts.length;
				if (confField.newAnalyse.leftLevel == 'root') {
					pos = -1;
				} else {
					for (var i=0; i<conf.lefts.length; i++) {
						var ni = conf.lefts[i].name;
						if (confField.newAnalyse.leftLevel==ni) {
							pos = i;
							break;
						}
					}
				}
				
				d1.append("<div level='root' class='ui-selected'>"+resources.guide.js151+"</div>");
				for (var i=0; i<conf.lefts.length; i++) {
					lefts[i] = conf.lefts[i].name;
					d1.append("<div level='"+conf.lefts[i].name+"' class="+(pos>=i?'ui-selected':'')+">"+conf.lefts[i].name+"</div>");
				}
				d1.find('div').css('float','left').css('margin','2px').css('padding','5px').css('cursor','pointer').click(function(){
					d12func($('#analyseD1'),this);
				});
				d1.append('<div style="clear:both;"></div>');
			}

			var tops = [];
			if (conf.tops.length>0) {
				d11.append(d2);
				var pos = conf.tops.length;
				if (confField.newAnalyse.topLevel == 'root') {
					pos = -1;
				} else {
					for (var i=0; i<conf.tops.length; i++) {
						var ni = conf.tops[i].name;
						if (confField.newAnalyse.topLevel==ni) {
							pos = i;
							break;
						}
					}
				}
				d2.append("<div level='root' class='ui-selected'>"+resources.guide.js152+"</div>");
				for (var i=0; i<conf.tops.length; i++) {
					tops[i] = conf.tops[i].name;
					d2.append("<div level='"+conf.tops[i].name+"' class="+(pos>=i?'ui-selected':'')+">"+conf.tops[i].name+"</div>");
				}
				d2.find('div').css('float','left').css('margin','2px').css('padding','5px').css('cursor','pointer').click(function(){
					d12func($('#analyseD2'),this);
				});
				d2.append('<div style="clear:both;"></div>');
			}
			
			let lastDim = "";
			if (lefts.length>0) lastDim = lefts[lefts.length-1];
			else if (tops.length>0) lastDim = tops[tops.length-1];
			let lastDim2 = ""; // 倒数第二个维
			if (lefts.length>1) {
				lastDim = lefts[lefts.length-1];
				lastDim2 = lefts[lefts.length-2];
			} else if (tops.length>1) {
				lastDim = tops[tops.length-1];
				lastDim2 = tops[tops.length-2];
			}
			

			var nas = [
				{//排名
					exp : '?1+1'// ?1/?2，?1代表下面第一个子项
					,items : [
						{
							field:aggrs[0]
							,value:'find' //当前值、查找值
							//以下属性只针对find
							,aggr:'count'
							,exp:aggrs[0]+resources.guide.js153+'<'+aggrs[0]+resources.guide.js154 //'上层维度字段或本测度字段'
						}
					]
				}
				,{//占比
					exp : '?1/?2'// ?1/?2，?1代表下面第一个子项
					,items : [
						{
							field:aggrs[0]
							,value:'curr' //当前值、查找值
							,aggr:'first'
							,exp:''
						}
						,{
							field:aggrs[0]
							,value:'find' //当前值、查找值
							//以下属性只针对find
							,aggr:'sum'
							,exp:''
						}
					]
				}
				,{//环比
					exp : '?1/?2'// ?1/?2，?1代表下面第一个子项
					,items : [
						{
							field:aggrs[0]
							,value:'curr' //当前值、查找值
							,aggr:'first'
							,exp:''
						}
						,{
							field:aggrs[0]
							,value:'find' //当前值、查找值
							//以下属性只针对find
							,aggr:'first'
							,exp:lastDim+resources.guide.js155+'=='+lastDim+resources.guide.js156+'+'+1
						}
					]
				}
				,{//累积
					exp : '?1'// ?1/?2，?1代表下面第一个子项
					,items : [
						{
							field:aggrs[0]
							,value:'find' //当前值、查找值
							//以下属性只针对find
							,aggr:'sum'
							,exp:lastDim+resources.guide.js155+'>='+lastDim+resources.guide.js156
						}
					]
				}
				,{//同比
					exp : '?1/?2'// ?1/?2，?1代表下面第一个子项
					,items : [
						{
							field:aggrs[0]
							,value:'first' //当前值、查找值
							,aggr:'count'
							,exp:''
						}
						,{
							field:aggrs[0]
							,value:'find' //当前值、查找值
							//以下属性只针对find
							,aggr:'first'
							,exp:lastDim+resources.guide.js155+'==('+lastDim+resources.guide.js156+'+4)'
						}
					]
				}

			];
			
			if (!isNew) {
				d3.append("<div class=''>"+resources.guide.js157+"</div>");
				nas.splice(0,0,JSON.parse(JSON.stringify(confField.newAnalyse)));
			}
			d3.append("<div class=''>"+resources.guide.js143+"</div>");
			d3.append("<div class=''>"+resources.guide.js142+"</div>");
			d3.append("<div class=''>"+resources.guide.js158+"</div>");
			d3.append("<div class=''>"+resources.guide.js145+"</div>");
			d3.append("<div class=''>"+resources.guide.js159+"</div>");
			currAnalyse = nas[0];
			d3.find('div').css('float','left').css('margin','2px').css('padding','5px').css('cursor','pointer').click(function(){
				var d2ds = d3.find('div');
				for (var i=0; i<d2ds.length; i++){
					//$(d2ds[i]).removeClass('ui-selected');
					if (d2ds[i] == this) {
						saveAn();
						currAnalyse = nas[i];
						showAn();
						//$(d2ds[i]).addClass('ui-selected');
					}
				}
			});
			d3.append('<div style="clear:both;"></div>');
		
			var allf = lefts.concat(tops).concat(aggrs);	
			
			function showAn() {
				//d4.html("");
				d4.html('<input type="text" id="analyseExp" placeholder="'+resources.guide.js160+'" style="width:280px;height:30px;margin-left:4px;" value="'+currAnalyse.exp+'">');
				for (let i=0; i<currAnalyse.items.length; i++) {
					let itemi = currAnalyse.items[i];
					let delButi = $('<img style="vertical-align:-2px;cursor:pointer;margin:0 5px;'+(i==0?"visibility:hidden;":"")+'" src="'+contextPath+guideConf.guideDir+'/img/guide/13.png">');
					let divi = $('<div idx='+i+' style="margin:3px 7px 3px 3px;padding:3px;border-left:3px solid lightgray;"></div>');
					divi.append(delButi).append('<span style="font-weight:bold;font-size:13px;margin-right:5px;">?'+(i+1)+'</span>');
					d4.append(divi);
					delButi.click(function(){
						saveAn();
						currAnalyse.items.remove(currAnalyse.items[i]);
						showAn();
					});

					
					let selDom2 = getSelectDom(allf, allf, itemi.field);
					selDom2.attr('id','itemField').css('width','150px').css({'margin':'3px 3px 3px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px'}).attr('title','').change(function(){
						itemi.field = selDom2.val();
						showCond();
					});
					divi.append(selDom2);

					let selDom1 = getSelectDom(["curr","find"], [resources.guide.js153,resources.guide.js154], itemi.value);
					selDom1.attr('id','itemValue').css('width','75px').css({'margin':'3px','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px'}).attr('title','').change(function(){
						itemi.value = getSelDom1Value(selDom1);
						showCond();
					});
					divi.append(selDom1);
					
					let selDom3 = getSelectDom(["sum","count","avg","max","min","first"], [resources.guide.js6,resources.guide.js7,resources.guide.js11,resources.guide.js10,resources.guide.js9,resources.guide.js161], itemi.aggr);
					selDom3.attr('id','itemAggr').css('width','75px').css({'visibility':'hidden','margin':'3px','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px'}).attr('title','').change(function(){
						//changeClassTable();
					});
					divi.append(selDom3);
					
					let divii = $('<div style="display:none;margin:3px 0 0 45px;"></div>');
					divi.append(divii);
					let showCond = function () {
						if (itemi.value == 'find') {
							selDom3.css('visibility','visible');
							divii.css('display','block');
						} else {
							selDom3.css('visibility','hidden');
							divii.css('display','none');
						}
						divii.html("");
						divii.append('<input type="text" id="analyseItemExp" placeholder="'+resources.guide.js162+'" style="width:760px;height:26px;" value="'+itemi.exp+'">');
						let fs = [];
						if (aggrs.indexOf(itemi.field)>=0) {
							fs = lefts.concat(tops).concat(itemi.field);
						} else if (lefts.indexOf(itemi.field)>=0) {
							for (let m=0; m<=lefts.indexOf(itemi.field); m++) fs[m] = lefts[m];
						} else {
							for (let m=0; m<=tops.indexOf(itemi.field); m++) fs[m] = tops[m]; 
						}
						
						let divm = $('<div></div>');
						divii.append(divm);
						for (let m=0; m<fs.length; m++) {
							//divm.append(fs[m]+" : ");
							divm.append('<a style="color:gray;padding:5px;" href="javascript:void(0)" v="'+fs[m]+''+resources.guide.js153+'">'+fs[m]+''+resources.guide.js153+'</a>');
							divm.append('<a style="color:gray;padding:5px;" href="javascript:void(0)" v="'+fs[m]+''+resources.guide.js154+'">'+fs[m]+''+resources.guide.js154+'</a>');
							if (aggrs.indexOf(fs[m])==-1){
								divm.append('<a style="color:gray;padding:5px;" href="javascript:void(0)" v="'+fs[m]+''+resources.guide.js155+'">'+fs[m]+''+resources.guide.js155+'</a>');
								divm.append('<a style="color:gray;padding:5px;" href="javascript:void(0)" v="'+fs[m]+''+resources.guide.js156+'">'+fs[m]+''+resources.guide.js156+'</a>');
							}
						}
						divm.append('&nbsp;&nbsp;|&nbsp;&nbsp;');
						divm.append('<a style="color:#333;padding:5px;" href="javascript:void(0)" v="==">'+resources.guide.js25+'</a>');
						divm.append('<a style="color:#333;padding:5px;" href="javascript:void(0)" v=">">'+resources.guide.js27+'</a>');
						divm.append('<a style="color:#333;padding:5px;" href="javascript:void(0)" v="<">'+resources.guide.js28+'</a>');
						divm.append('<a style="color:#333;padding:5px;" href="javascript:void(0)" v="&&">'+resources.guide.js22+'</a>');
						divm.append('<a style="color:#333;padding:5px;" href="javascript:void(0)" v="||">'+resources.guide.js23+'</a>');
						divii.find('a[v]').css('text-decoration','none').click(function(){
							divii.find('#analyseItemExp').val(divii.find('#analyseItemExp').val()+" "+$(this).attr("v")+" ");
						});
					}
					showCond();
				}
				let addBut = $('<img style="vertical-align:-2px;cursor:pointer;margin:0 5px;" src="'+contextPath+guideConf.guideDir+'/img/guide/9.png">');
				d4.append(addBut);
				addBut.click(function(){
					saveAn();
					currAnalyse.items.push(
						{
							field:aggrs[0]
							,value:'curr' //当前值、查找值
							,aggr:'count'
							,exp:''
						}
					);
					showAn();
				});

			}
			showAn();			
		}
		let analyseSave = function(){
			let n = $.trim($('#confItemName').val());
    	if (n == '') {
    		alert(resources.guide.js112);
    		return false;
    	}
    	if ($.trim($('#analyseExp').val())=='') {
    		alert(resources.guide.js230);
    		return false;
    	}
    	if (aly.getRpxFieldByName(conf,n)!=null && n!=confField.name) {
    		alert(resources.guide.js119);
    		return false;
    	}
			saveAn();

			let json = null;
			if (isNew) {
				confField.name = 'tempName';
				conf.fields[conf.fields.length] = confField;
			} else json = JSON.stringify(confField);

			currAnalyse.leftLevel = d12func2($("#analyseD1"));
			currAnalyse.topLevel = d12func2($("#analyseD2"));
			confField.newAnalyse = currAnalyse;

			aly.checkConf(conf);
			if (confField._status != '') {
				alert(confField._status);
				if (isNew) {
					conf.fields.remove(confField);
				} else {
					confField = JSON.parse(json);
				}
				confField._status = '';
				return false;
			}
				
			aly.modifyRpxFieldName(conf,confField,n);		    	
			
    	artDialog.defaults.zIndex = zIndexBak;
    	setTimeout(function(){aly.refresh();},1);
    	return true;
		}
		let saveAn = function(){
			let d4 = $('#analyseD4');
			currAnalyse.exp = d4.find('#analyseExp').val();
			let items = [];
			let is = d4.find('div[idx]');
			for (let i=0; i<is.length; i++) {
				items.push(
					{
						field:$(is[i]).find('#itemField').val()
						,value:$(is[i]).find('#itemValue').val() //当前值、查找值
						,aggr:$(is[i]).find('#itemAggr').val()
						,exp:$(is[i]).find('#analyseItemExp').val()
					}
				);
			}
			currAnalyse.items = items;
		}
		let d12func = function(d1,thisObj){
			var level = '';
			var d1ds = d1.find('div');
			for (var i=0; i<d1ds.length; i++){
				$(d1ds[i]).removeClass('ui-selected');
				if (level=='') $(d1ds[i]).addClass('ui-selected');
				if (d1ds[i] == thisObj) {
					level = $(thisObj).attr('level');
				}
			}
			return level;
		}
		let d12func2 = function(d1){
			var level = '';
			var d1ds = d1.find('div');
			for (var i=0; i<d1ds.length; i++){
				if ($(d1ds[i]).hasClass('ui-selected')) level = $($(d1ds[i])).attr('level');
				else break;
			}
			return level;
		}
		
	}
	,rpxFocusChanged : function() {
		//console.log(initRpxsOver);
		if (!initRpxsOver) return;
		var reports = aly.cache.reports;
		var topRpx = null;
		for (var i=0; i<reports.length; i++){
			if (reports[i].dlg.DOM.wrap.css('display').toLowerCase() == 'none') continue;
			if (topRpx == null) topRpx = reports[i];
			else {
				var z1 = reports[i].dlg.DOM.wrap.css('z-index');
				var z2 = topRpx.dlg.DOM.wrap.css('z-index');
				if (z2<z1) topRpx = reports[i];
			}
		}
		if (!topRpx) return;
		if (aly.getRpx(topRpx.name) == null) return;
		if (rqAnalyse.currRpx == topRpx.name) return;
		rqAnalyse.currRpx = topRpx.name;
		aly.refresh(true,true);
	}
	,focusReport : function(name) {
		var reports = aly.cache.reports;
		for (var i=0; i<reports.length; i++){
			if (reports[i].name == name) {
				reports[i].dlg.focus();
				break;
			}
		}
	}
	,refreshReport : function(confName, noCalc, noRefreshDialog, drillRpx, zongji) {
		if(!zongji) zongji = false;
		if (noRefreshDialog) return;
		var reports = aly.cache.reports;
		if(drillRpx) rqAnalyse.currRpx = drillRpx;
		for (var i=0; i<rqAnalyse.rpxs.length; i++) {
			var confi = rqAnalyse.rpxs[i];
			if (confName && confi.name != (drillRpx == null ? confName : drillRpx)) continue;
			var dlg = null;
			for (var j=0; j<reports.length; j++) {
				if (reports[j].name == confi.name) {
					dlg = reports[j].dlg;
				}
			}
			if (!confi.dialog) confi.dialog = {open:1,top:random(200,50),left:random(500,40),width:550,height:300};
			if (dlg == null) {
				confi._firstOpen = true;
				initDialogOver = false;
				dlg = art.dialog({
					id : dialogCount++,
					title : confi.name+"<img confNameLoading='"+confi.name+"' style='vertical-align:-3px;margin-left:4px;visibility:hidden;' src='"+contextPath+guideConf.guideDir+"/js/ztree/css/zTreeStyle/img/loading.gif'/>",
				    content: '<iframe name="'+confi.name+'" confName="'+confi.name+'" style="border:0;width:100%;height:100%;"></iframe>'
				    ,ok : null
				 	,close: function () {
				 		if(drillRpx) {
				 			rqAnalyse.currRpx = confName;
				 			return true;
				 		}
				 		else{this.hide();
					        for (var z=0; z<reports.length; z++) {
					        	if (reports[z].dlg == this) {
					        		var confz = aly.getRpx(reports[z].name);
					        		if (confz == null) break;
					        		confz.dialog.open = 0;
					        		break;
					        	} 
					        }
					        dialogs.remove(this);
							setTimeout(function(){aly.rpxFocusChanged();},1);
							return false;
				 		}
				    }
					,button : []
				    ,okVal : ''
				    ,cancelVal : ''
				    ,lock : false
				    //,follow:'#reportDiv'
				    ,duration : 0
				    ,width : confi.dialog.width+'px'
					,height : confi.dialog.height+'px'
					,opacity : 0.1
					,padding : '0'
					,fixed : false
					,top:confi.dialog.top+'px'
					,left:confi.dialog.left+'px'
					//,drag: false
				});
				dlg.DOM.wrap.find('.aui_main').css('padding-top','0');
				dlg.DOM.wrap.find('.aui_content').css('width','100%').css('height','100%');
				
				//dlg.follow('#reportConfTable');
				reports[reports.length] = {dlg:dlg,name:confi.name};
				initDialogOver = true;

				$('iframe[confName="'+confi.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(confi.name));
			} else {
				artDialog.defaults.zIndex++;
				dlg.show();
				dlg.DOM.wrap.css('z-index',artDialog.defaults.zIndex);
        		confi.dialog.open = 1;
				
				//alert(wrap.css('z-index'));
			}
			var openHisory = false;
			if (dialogs.indexOf(dlg)==-1) {
				dialogs[dialogs.length] = dlg;
				if (guideConf.showHistoryRpx == 'yes' && confi._firstOpen) {
					var n = guideConf.resultRpxPrefixOnServer+confi.name+".rpx";
					$.ajax({
						type: 'POST',
						async : false,
						url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
						data: {action:2,oper:'fileExist',file:n},
						success: function(data){
							if (data.indexOf('error:')==0) {
								alert(data.substring(6));
								return;
							}
							if (data == 1) {
								openHisory = true;
								//$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
								//$('iframe[confName="'+conf.name+'"]').attr('src', "");
								$('iframe[confName="'+confi.name+'"]').attr('src', guideConf.reportPage+"?reportId="+confi.reportId+"&guideDir="+guideConf.guideDir+"&isOlap=no"+"&confName="+encodeURIComponent(confi.name)+"&finish=1&rpxFile="+encodeURIComponent(n));
								return;
							}
						}
					});
				}
			}
			confi._firstOpen = false;

			if ((!openHisory) && confi.autoCalc==1 && !noCalc) aly.queryData(confi,drillRpx,zongji);
			for (var ii=0; ii<rqAnalyse.rpxs.length; ii++) {
				var confi = rqAnalyse.rpxs[ii];
				if(confi.name == drillRpx) {
					rqAnalyse.rpxs.remove(confi);
					for(var jj = 0; jj < aly.cache.reports.length; jj++){
						var rpxjj = aly.cache.reports[jj];
						aly.cache.reports.remove(rpxjj);
					}
					break;
				}
			}
			if(drillRpx) rqAnalyse.currRpx = confName;
		}
	}
	,editCalcField : function(fieldName, callback) {
		var field = null;
		var conf = aly.getCurrRpx();
		var dataSet = aly.getDataSet(conf.dataSet);
		var type67 = dataSet.type == 6 || dataSet.type == 7;
		if(type67 && aly.calcField.currTable) {
			var lmdTableObj = mdUtils.getTable(aly.calcField.currTable);
			var fields = lmdTableObj.fields;
			for(var i = 0; i < fields.length; i++){
				if(fields[i].name == fieldName){
					field = fields[i];
				}
			}
		}else if (fieldName) {
			field = aly.getDataSetField(dataSet,fieldName);
		}
		//2020.1.15
		var fields = [];
		if(type67) {
			//dql计算字段先不要提供这种选项，getFieldInfos会解析并缓存字段，这块没有合理的字段计算表达式传入方法
			//var ts = aly.getDataSet(conf.dataSet).tableName.split(",");
			//for (var i=0; i<ts.length; i++) cus.getFieldInfos(ts[i], fields, 0, null, null,false);
			//for (var i=0; i<fields.length; i++) fields[i] = transWhereInfo(fields[i],null,false);
		}else{
			fields = dataSet.fields;
		}
		zIndexBak = artDialog.defaults.zIndex;
		var fs = "";
		var tableOptions = "";
		if(type67) {
			//for (var i=0; i<fields.length; i++) {
				//var fieldi = fields[i];
				//if (!fieldi.exp) fieldi.exp = fieldi.name;
				//if (fieldi.exp != '' && fieldi.exp !== undefined) continue;
			//}
			var tArray;
			tArray = dataSet.tableName.split(',');
			for(var a = 0; a < tArray.length; a++){
				tArray[a] = mdUtils.getTable(tArray[a]);
			}
			tableOptions = getTableOptions(tArray,aly.calcField.currTable);
		}else{
			for (var i=0; i<fields.length; i++) {
				var fieldi = fields[i];
				//if (!fieldi.exp) fieldi.exp = fieldi.name;
				if (fieldi.exp != '' && fieldi.exp !== undefined) continue;
				fs += "<div style='float:left;cursor:pointer;padding:3px 10px 3px 0;'>"+fieldi.name+"</div>";
			}
		}
		fs += "<div style='clear:both;'></div>";
		var ct = aly.calcField.currTable == null ? "":aly.calcField.currTable;
		var placeholder = type67 ? "dql表达式":resources.guide.js167;
		var dis = (type67 && aly.calcField.currTable) ? ' disabled="disabled"' : "";
		var dlg = art.dialog({
			id : dialogCount++,
			title :resources.guide.js163,
		    content: '<div style="margin:10px;">'+resources.guide.js164+'：<input type="text" id="calcFieldName" value="'+(field==null?"":field.name)+'" style="width:120px;"></div>'
		    	+ (type67 ? '<div style="margin:10px;">范　　围：<select'+dis+' id="selectTable" style="width:120px;">'+tableOptions+'</select></div>' : "")
		    	+'<div style="margin:10px;">'+resources.guide.js165+'：<select id="calcFieldType" style="width:120px;">'+raqDt.getDataTypeOptions(2)+'</select></div>' //回显在下面
		    	+'<div style="margin:10px;">'+resources.guide.js166+'：<input placeholder="'+placeholder+'" type="text" id="calcFieldExp" value="" style="width:370px;"></div>'
		    	+'<div style="margin:10px;" id="calcFieldSrcs">'+fs+'</div>'
		    	+(type67 ? '<script>$("#selectTable").val("'+ct+'")</script>' : "")
		    ,ok : function() {
				var n = $.trim($('#calcFieldName').val());
		    	if (n == '') {
		    		alert(resources.guide.js112);
		    		return false;
		    	}
		    	if(type67){
		    		var st = $.trim($('#selectTable').val());
		    		if (st == '') {
		    			alert('请选择范围');
		    			return false;
		    		}
		    	}
				var e = $.trim($('#calcFieldExp').val());
		    	if (e == '') {
		    		alert(resources.guide.js168);
		    		return false;
		    	}
				var t = $.trim($('#calcFieldType').val());
				var table = $.trim($('#selectTable').val());
				
				if(fieldName == null){
					if(type67) {
						fields = [];
						var lmdTableObj = mdUtils.getTable(table);
						var pattern = /^[a-zA-Z]+$/;
						fields = lmdTableObj.fields;
						for(var a = 0; a < fields.length; a++){
							var fa = fields[a];
							if( fa.name == n ){
								alert(resources.guide.js113);
								return false;
							} 
							if(pattern.test(n)){
								if(n.toUpperCase() == fa.name.toUpperCase()){
									alert(resources.guide.js113);
									return false;
								}
							}
						}
					}else{
						if (aly.getDataSetField(dataSet,n) && (field != null && field.name != n)) {
							alert(resources.guide.js113);
							return false;
						}
					}
				}
				if(!type67){
			    	if (field == null) {
						dataSet.fields.push({name:n,exp:e,dataType:t,edit:'',newField:1});
			    	} else {
			    		field.name = n;
			    		field.dataType = t;
			    		field.exp = e;
					}
				}else{
					if (field == null) {
						var lmdTableObj = mdUtils.getTable(table);
						lmdTableObj.fields.push({name:n,exp:e,type:t,edit:'',newField:1});
					}else{
						var oldName = field.name;
						field.name = n;
			    		field.type = t;
			    		field.exp = e;
			    		if(conf.fields.length > 0){
			    			for(var j = 0; j < conf.fields.length; j++){
			    				if(conf.fields[j].name == oldName){
			    					conf.fields[j].calc = e;
			    					conf.fields[j].dataType = t;
			    					conf.fields[j]._finalType = t;
			    					conf.fields[j].name = n;
			    				}
			    			}
			    		}
			    		if(conf.tops.length > 0){
				    		for(var k = 0; k < conf.tops.length; k++){
				    			if(conf.tops[k].name == oldName){
			    					conf.tops[k].calc = e;
			    					conf.tops[k].dataType = t;
			    					conf.tops[k]._finalType = t;
			    					conf.tops[k].name = n;
			    				}
				    		}
			    		}
			    		if(conf.lefts.length > 0){
				    		for(var l = 0; l < conf.lefts.length; l++){
				    			if(conf.lefts[l].name == oldName){
			    					conf.lefts[l].calc = e;
			    					conf.lefts[l].dataType = t;
			    					conf.lefts[l]._finalType = t;
			    					conf.lefts[l].name = n;
			    				}
				    		}
			    		}
					}
				}
		    	artDialog.defaults.zIndex = zIndexBak;
		    	aly.calcField.currTable = null;
				if (callback) {
					callback(fieldName);
					return;
				}
		    }
		    ,cancel : function() {
		    	artDialog.defaults.zIndex = zIndexBak;
		    	aly.calcField.currTable = null;
		    	return true;
		    }
		    ,okVal : resources.guide.js20
		    ,cancelVal : resources.guide.js21
		    ,lock : true
		    ,duration : 0
		    ,width : '530px'
			,height : '200px'
			,opacity : 0.1
			,padding : '2px 2px'
			,zIndex : 41000
		});
		
		if (field != null) {
			$('#calcFieldType').val(field.type);
			$('#calcFieldExp').val(field.exp);
		}
		$('#calcFieldSrcs').find('div').click(function(){
			$('#calcFieldExp').val($('#calcFieldExp').val()+" "+$(this).html());
		});
	}
	,generateReport : function(conf, drillRpx, zongji) {
		if (conf._status != '' && !conf._status){
			aly.checkConf(conf);
		}
		var success = function(data){
			if (data.indexOf('error:')==0) {
				if (data.indexOf('null')>=0) {
					alert(resources.guide.js169);
				} else {
					alert(data.substring(6));
				}
				$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
				$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
				return;
			}
			
			if(drillRpx) $('iframe[confName="'+conf.name+'"]').attr('src', "../jsp/showReport.jsp"+"?reportId="+conf.reportId+"&guideDir="+guideConf.guideDir+"&isOlap=no"+"&confName="+encodeURIComponent(conf.name)+"&finish="+finish);
			else $('iframe[confName="'+conf.name+'"]').attr('src', guideConf.reportPage+"?reportId="+conf.reportId+"&guideDir="+guideConf.guideDir+"&isOlap=no"+"&confName="+encodeURIComponent(conf.name)+"&finish="+finish);
		}
		var finish = conf._dataOver;

		var templateRpx = function() {
			if (conf._dataCount == 0) {
				$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
				$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
				return;
			}
			finish = conf._dataOver;
			var fields = "";
			for (var j=0; j<conf.fields.length; j++) {
				var fj = conf.fields[j];
				if (fj == null) {
					$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
					return;
				}
				if (j>0) fields += "<;>";
				var disps = '';
				if (fj.aggr == '') disps = defaultEdit.getEditExp4Rpx(fj.srcEdit,fj.dataType==1);
				fields += fj.macroName+"<,>"+fj.name+"<,>"+disps;
			}
			
			$.ajax({
				type : 'POST',
				async : true,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'calcReport',reportId:conf.reportId,title:conf.name,reportType:conf.type,fields:fields,template:conf.template,resultRpxPrefixOnServer:guideConf.resultRpxPrefixOnServer},
				//confs:[{type:1自定义分析报表/2模板报表,name:'报表名称',reportId:'',template:'',show:0/1,isRowData:1,lefts:[{name:'',item:itemId,use:1,order:0无序/1升序/2降序}],tops:[],fields:[],wheres:[{item:itemId}]}...] 调序、排序、改名
				success:success
			});
		}
		if (conf.type == 2) {
			if (conf.fields.length == 0) {
				$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
				$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
				return;
			}
			for (var j=0; j<conf.fields.length; j++) {
				var fj = conf.fields[j];
				if (fj == null) {
					$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
					$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
					return;
				}
			}
		}
		var olapRpx = function() {
			var rpt = rpxu.getRpxDefine(conf);
			if (rpt == null) return;
			$.ajax({
				type : 'POST',
				async : true,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,zongji:zongji?true:false,oper:'genReport',infi:guideConf.infinity,reportId:conf.reportId,title:conf.name,rpt:JSON.stringify(rpt).replaceAll('"','<d_q>'),lefts:rpt.lefts,tops:rpt.tops,maxSize:guideConf.maxReportSize,resultRpxPrefixOnServer:guideConf.resultRpxPrefixOnServer,onlyRefreshDs:guideConf.onlyRefreshDs},
				//confs:[{type:1自定义分析报表/2模板报表,name:'报表名称',reportId:'',template:'',show:0/1,isRowData:1,lefts:[{name:'',item:itemId,use:1,order:0无序/1升序/2降序}],tops:[],fields:[],wheres:[{item:itemId}]}...] 调序、排序、改名
				success: success
			});
		}
		conf.type==1?olapRpx():templateRpx();
	}
	,getCalcFieldTypeJSON : function(fs){
		var jsonstr = {};
		var hasContent = false;
		var pattern = /^[a-zA-Z]+$/;
		for(var s = 0; s < fs.length; s++){
			if(fs[s].calc && fs[s].calc.length > 0 && (fs[s].aggr == "" || fs[s].aggr == "max" || fs[s].aggr == "min")){
				var namex = fs[s].name;
				if(pattern.test(namex)){
					namex = namex.toUpperCase(namex);
				}
				jsonstr[namex] = fs[s].dataType;
				hasContent = true;
			}
		}
		if(!hasContent) return "";
		return JSON.stringify(jsonstr);
	}
	,queryData : function(conf,drillRpx,zongji) {
		if (conf.tops.length+conf.lefts.length+conf.fields.length==0) {
			$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
			$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
			return;
		}

		if (conf.type == 2){
			for (var i=0; i<conf.fields.length; i++){
				if(conf.fields[i]==null) return;
			}
		}
		var dataSet = aly.getDataSet(conf.dataSet);
		if (dataSet.type == 6){
			var dql = rpxu.getDqlSegments(conf);
			if (dql == null) {
				return;
			}
			$('img[confNameLoading="'+conf.name+'"]').css('visibility','visible');
			var reportId = conf.reportId;
			var calcFieldTypeJSON = aly.getCalcFieldTypeJSON(conf.fields);
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,calcFieldTypeJSON:calcFieldTypeJSON,oper:'queryDqlData',reportId:conf.reportId,dqlSegments:dql,dataSource:dataSet.dataSource,maxDataSize:guideConf.maxDataSize,filter:guideConf.filter},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					}
					data = data.split(":");
					conf._dataCount = data[0];
					if (data[0] == 0)
					{
						alert(resources.guide.js170);
						$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
						return;
					}
					conf._dataOver = data[1];
					aly.generateReport(conf,drillRpx,zongji);
					//alert(data);
				}
			});
		} else if (dataSet.type == 7) {
			//alert("TODO sql report");
			//return;
			var currsd = getItemByAttr(sqlDatasets,dataSet.sqlId,"sqlId");
			var sqlTemplate = rpxu.getSqlTemplate(conf,currsd.sql);
			if (sqlTemplate == null) {
				return;
			}
			$('img[confNameLoading="'+conf.name+'"]').css('visibility','visible');
			var reportId = conf.reportId;
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'querySqlData',reportId:conf.reportId,sqlTemplate:sqlTemplate,sqlId:currsd.sqlId,dataSource:currsd.dataSource,sql:currsd.sql},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					}
					data.split(":");
					conf._dataCount = data[0];
					if (data[0] == 0)
					{
						alert(resources.guide.js170);
						return;
					}
					conf._dataOver = data[1];
					aly.generateReport(conf,drillRpx,zongji);
					//alert(data);
				}
			});
		} else {
			aly.calcDfxData(null, conf, function(d1){
				if (d1 == 'empty') {
					$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
					$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
					return;
				}
				if (d1.indexOf('error:')==0) {
					alert(d1.substring(6));
					$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
					$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
					return;
				}
				d1 = eval('('+d1+')');
				//conf._dataCount = data[0];
				conf._dataOver = d1.finish;
				aly.generateReport(conf,drillRpx,zongji);
			});
		}
	}
	,calcDfxData : function(dataSetField, conf, callback) {
		var r = rpxu.getDfxExps(dataSetField, conf);
		var ds = aly.getDataSet(conf.dataSet);
		if (r == null) {
			callback("empty");
			return;
		}
		//1结果返回给前台,2结果转成DataSet保存起来
		var cacheType = 1;
		var reportId = "where";
		if (dataSetField == null) {
			reportId = conf.reportId;
			cacheType = 2;
		}
		var calcs = r.calcs;//"\"aa\"+说明:a1<;>\"bb\"+a1:a2";
		var filters = r.filters;//"!like(a1,\"*软*\")<;>!like(a2,\"*软*\")";
		var fields = r.fields;//"说明,a1<;>说明,a2";
		var resultExp = r.resultExp;
		var dataId = r.dataId;
		var aggrFieldFilters = r.aggrFieldFilters;

		//var resultExp = "groups(说明:A;count(a2):B;1)";
		//console.log(r);
		//getIds("d:/temp/a1",,,,);
	
		function f() {
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2, oper:'calc',reportId:reportId,dataId:dataId,cacheType:cacheType,calcs:calcs,filters:filters,fields:fields,aggrFieldFilters:aggrFieldFilters,resultExp:resultExp,types:r.types,srcTypes:r.srcTypes,dataFileType:guideConf.dataFileType,maxDataSize:guideConf.maxDataSize},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					} else if (data.indexOf('error:')>0) {
						data = eval("("+data+")");
						if (data.action == 'reQuery') {
							if (confirm(data.error)){
								aly.queryDataSet(1,ds.name,function(data){
									refreshStatus(ds,function(){
										f();
									});
								});
							}
							return;
						}
					}
					callback(data);
				}
			});
		}
		f();
	}
	
}


function canDrill(reportConfName) {
	var conf = aly.getRpx(reportConfName);
	if (!rpxu.isGroupRpx(conf)) return false;
	return true;
}

var drillCounter = 1;
function reportCellDrill(reportConfName, topValues, leftValues, fieldValues, detail, zongji) {
	var conf = aly.getRpx(reportConfName);
	if (!rpxu.isGroupRpx(conf)) return;
	var conf2 = JSON.parse(JSON.stringify(conf));
	//去掉过滤条件
	for(var confIndex = 0; confIndex < conf2.fields.length; confIndex++){
		var f = conf2.fields[confIndex];
		f.where.conf = [];
	}
	for (var i=conf2.fields.length-1; i>=0; i--) {
		if (conf2.fields[i]._fieldType.indexOf("nalyse")>=0)  conf2.fields.remove(conf2.fields[i]);
	}
	var conf2Name = '';
	conf2.reportId = "rid"+new Date().getTime();
	conf2.dialog.top = conf2.dialog.top+(0.5-Math.random())*100;
	conf2.dialog.left = conf2.dialog.left+(0.5-Math.random())*200;
	//[{"level":1,"fieldInfo":{"disp":"雇员.市","dataType":1,"useTreeDisp":false,"edit":"市","exp":"市","valueType":2,"values":"市"},"oper":"等于","values":"30101","disp":""}]
	//
	var dataSet = aly.getDataSet(conf.dataSet);
	if(!zongji){
		for (var i=0; i<topValues.length; i++)
		{
			if (conf2Name != '') conf2Name += '_';
			conf2Name += topValues[i];
			if (dataSet.type == 6 || dataSet.type == 7) {
				var whereSrc = conf2.tops[i].relas.length == 0 ? conf2.tops[i].src : conf2.tops[i].relas;
				var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.tops[i].srcEdit,topValues[i]),"disp":""}];
				conf2.tops[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
				//同时处理左表头条件
				replaceSpecificExps(conf2,true,false);
			} else {
				var whereConf = [{"level":1,"fieldInfo":{disp:conf2.tops[i].name,dataType:conf2.tops[i].dataType,edit:conf2.tops[i].srcEdit,exp:conf2.tops[i].src,valueType:1,values:""},"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.tops[i].srcEdit,topValues[i]),"disp":""}];
				conf2.tops[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "", 1, 2),disp:whereUtils.getDisp(whereConf)};	
				replaceSpecificExps(conf2,true,false);
			}
		}
		for (var i=0; i<leftValues.length; i++)
		{
			if (conf2Name != '') conf2Name += '_';
			conf2Name += leftValues[i];
			if (dataSet.type == 6 || dataSet.type == 7) {
				//20190319
				var whereSrc = conf2.lefts[i].relas.length == 0 ? conf2.lefts[i].src : conf2.lefts[i].relas;
				var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.lefts[i].srcEdit,leftValues[i]),"disp":""}]
				conf2.lefts[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
				replaceSpecificExps(conf2,false,true);
			} else {
				var whereConf = [{"level":1,"fieldInfo":{disp:conf2.lefts[i].name,dataType:conf2.lefts[i].dataType,edit:conf2.lefts[i].srcEdit,exp:conf2.lefts[i].src,valueType:1,values:""},"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.lefts[i].srcEdit,leftValues[i]),"disp":""}];
				conf2.lefts[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "", 1, 2),disp:whereUtils.getDisp(whereConf)};	
				replaceSpecificExps(conf2,false,true);
			}
		}
	}
	if(zongji){
		for (var i=0; i<leftValues.length; i++){
			if (conf2Name != '') conf2Name += '_';
			conf2Name += leftValues[i];
			if(leftValues[i] != "总计"){
				if (dataSet.type == 6 || dataSet.type == 7) {
					//20190319
					var whereSrc = conf2.lefts[i].relas.length == 0 ? conf2.lefts[i].src : conf2.lefts[i].relas;
					var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.lefts[i].srcEdit,leftValues[i]),"disp":""}]
					conf2.lefts[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
					replaceSpecificExps(conf2,false,true);
				} else {
					var whereConf = [{"level":1,"fieldInfo":{disp:conf2.lefts[i].name,dataType:conf2.lefts[i].dataType,edit:conf2.lefts[i].srcEdit,exp:conf2.lefts[i].src,valueType:1,values:""},"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.lefts[i].srcEdit,leftValues[i]),"disp":""}];
					conf2.lefts[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "", 1, 2),disp:whereUtils.getDisp(whereConf)};	
					replaceSpecificExps(conf2,false,true);
				}
			}else{
				if(conf2.lefts[i] && conf2.lefts[i].where){
					for(var d =0; d < conf2.lefts[i].where.conf.length; d++){
						var lconf = conf2.lefts[i].where.conf[d];
						lconf.fieldInfo.exp = lconf.fieldInfo.exp.replaceAll("_dimFieldName_",conf2.lefts[i].name);
					}
				}
			}
		}
		for (var i=0; i<topValues.length; i++){
			if (conf2Name != '') conf2Name += '_';
			conf2Name += topValues[i];
			if(conf2Name != "总计"){
				if (dataSet.type == 6 || dataSet.type == 7) {
					var whereSrc = conf2.tops[i].relas.length == 0 ? conf2.tops[i].src : conf2.tops[i].relas;
					var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.tops[i].srcEdit,topValues[i]),"disp":""}];
					conf2.tops[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
					//同时处理左表头条件
					replaceSpecificExps(conf2,true,false);
				} else {
					var whereConf = [{"level":1,"fieldInfo":{disp:conf2.tops[i].name,dataType:conf2.tops[i].dataType,edit:conf2.tops[i].srcEdit,exp:conf2.tops[i].src,valueType:1,values:""},"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(conf2.tops[i].srcEdit,topValues[i]),"disp":""}];
					conf2.tops[i].where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "", 1, 2),disp:whereUtils.getDisp(whereConf)};	
					replaceSpecificExps(conf2,true,false);
				}
			}else{
				if(conf2.tops[i] && conf2.tops[i].where){
					for(var d =0; d < conf2.tops[i].where.conf.length; d++){
						var tconf = conf2.tops[i].where.conf[d];
						tconf.fieldInfo.exp = tconf.fieldInfo.exp.replaceAll("_dimFieldName_",conf2.tops[i].name);
					}
				}
			}
		}
	}
	//钻取所有字段
	var oldDetails = conf2.fields.concat();//2019.11.18
	conf2.fields = [];
	var categoryF = [];
	for (var i=0; i<conf2.tops.length ; i++ ) {
		conf2.tops[i].aggr = "";
		conf2.tops[i]._fieldType = "detail";
		conf2.fields.push(conf2.tops[i]);
		categoryF.push(conf2.tops[i]);
	}
	for (var j=0; j<conf2.lefts.length ; j++ ) {
		conf2.lefts[j].aggr = "";
		conf2.lefts[j]._fieldType = "detail";
		conf2.fields.push(conf2.lefts[j]);
		categoryF.push(conf2.lefts[j]);
	}
	conf2.tops = [];
	conf2.lefts = [];
	
	var prex = conf2Name;
	if (prex != '') prex = "["+conf2Name+"]";
	conf2.name = prex+resources.guide.js171;//"钻取结果" + (drillCounter++);
	var count = 1;
	while (aly.getRpx(conf2.name) != null){
		conf2.name = prex+resources.guide.js171+"_"+count;
		count++;
	}
	if(dataSet.type == 7 || dataSet.type == 6){
		var fs = [];
		var fsi = [];
//		for(var p = 0; p < oldDetails.length; p++){
//			var cfobj = dqlQuery.confUtils.getInfosObj(oldDetails[p].src);
//			dqlQuery.confUtils.getFieldInfos(cfobj.lastTable, fs, dqlQuery.getDetectLevel()-1, null, null,true);
//		}
		//采集跟明细有关的字段
		for(var l = 0; l < oldDetails.length; l++){
			var cfobj = dqlQuery.confUtils.getInfosObj(oldDetails[l].src);
			dqlQuery.confUtils.getFieldInfos(cfobj.lastTable, fsi, 0, null, null,true,1,true);
			fs = fs.concat(fsi);
		}
		//fs去重 去年月日
		
		var ss = fs;
		var aSrcs = dqlQuery.confUtils.autoSrcs(ss);
		var pos = "field";
		for (var z=0; z<ss.length; z++) {
			for(var a = 0; a < categoryF.length; a++){
				if(categoryF[a].src == ss[z]) continue;
			}
			var iiObj = dqlQuery.confUtils.getInfosObj(ss[z]);
			if (pos != 'field' && pos != 'params' && iiObj.dim == '' && conf2.type==1) return;
			var aggr = '';//aObj.attr('aggr');
	//		if (aggr == '' && divsi == null)
	//		{
	//			if (iiObj.finalType == 1) aggr = 'sum';
	//			else aggr = 'count';
	//		}
			//alert(aggr);
			var name = dqlQuery.confUtils.generateNewFieldAlias(iiObj);
			//if (aggr != '') {
			//	var iObj = cus.getInfosObj(ss[0]);
			//	ss[0] = iObj.str + split_2 + iObj.lastTable + split_1 + iObj.lastField + split_1 + split_1 + aggr;
			//}
			var edit = iiObj.dim;
			edit = defaultEdit.getEditStyle(edit);
			edit = edit==null?"":edit.name;
			var idx = -1;
			var macroName = '';
	//		if (divsi != null) {
	//			idx = divsi.attr("idx");
	//			macroName = divsi.attr("macroName");
	//		}
			
			var newItem = {
				autoSrc: aSrcs.autoSrcs[z]
				,name : iiObj.lastField
				,src:ss[z]
				,dataType:iiObj.finalType
				,srcName:name
				,srcEdit:edit//编辑风格
				,aggr:aggr
				,use:1
				,order:0
				,groups:null//[lefts,tops里的分组，空分组表示整体聚合]/null表示随分组自动聚合
	
				,analyse:{//指标字段
					analyseName:''//'占比/排名/比上期/比同期'
					,field:''//'被分析的测度字段'
					,scopeGroups:[]//[空则表示针对全部]
				}
				,where:{conf:[]}
				,having:{conf:[]}
				,format:''
				,macroName:macroName
				,_finalType:''
				,_parentType:''//'top/left/field'
				,_fieldType:''//'group/detail/aggr/analyse'
				,_status:''//'为空表示正确，不为空是失效的具体信息'
			};
			var nosuchfieldadded = true;
			for(var b = 0; b < categoryF.length; b++){
				if(newItem.name == categoryF[b].name){
					nosuchfieldadded = false;
					break;
				}
//				var dataSetObj = null;
//				if( typeof dataSet == "string" )
//					dataSetObj = aly.getDataSet(dataSet);
//				else dataSetObj = dataSet;
//				if (dataSetObj.type == 6 || dataSetObj.type == 7) {
//					//20190319
//					var whereSrc = newItem.src;//newItem.relas.length == 0 ? newItem.src : newItem.relas;
//					var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(newItem.srcEdit,ca),"disp":""}]
//					newItem.where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
//					replaceSpecificExps(rpx,false,true);
//				} else {
//					var whereConf = [{"level":1,"fieldInfo":{disp:newItem.name,dataType:newItem.dataType,edit:newItem.srcEdit,exp:newItem.src,valueType:1,values:""},"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(newItem.srcEdit,ca),"disp":""}];
//					newItem.where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "", 1, 2),disp:whereUtils.getDisp(whereConf)};	
//					replaceSpecificExps(rpx,false,true);
//				}
			}
			if(nosuchfieldadded) 
				conf2.fields.push(newItem);
		}
	}else{
		fcircle:for(var p = 0; p < dataSet.fields.length; p++){
			for(var c = 0; c < categoryF.length; c++){
				if(categoryF[c].srcEdit != "" && categoryF[c].srcEdit == dataSet.fields[p].edit) {
					continue fcircle;
				}else if(categoryF[c].name == dataSet.fields[p].name) {
					continue fcircle;
				}
			}
			var objp = rpxu.newRpxField(aly.getDataSetField(dataSet,dataSet.fields[p].name));
			objp.aggr = "";
			objp._fieldType = "detail";
			conf2.fields.push(objp);
		}
	}
	
	
	
	
	
	rqAnalyse.rpxs.push(conf2);
	//rqAnalyse.currRpx = conf2.name;
	aly.refresh(null,null,conf2.name,null,zongji);
}

function replaceSpecificExps(conf2,left,top){
	if(left) 
		for(var i = 0; i<conf2.lefts.length ;i++){
			var cfws = conf2.lefts[i].where.conf;
			for(var d =0; d < cfws.length; d++){
				var conf = cfws[d];
				conf.fieldInfo.exp = conf.fieldInfo.exp.replaceAll("_dimFieldName_",conf2.lefts[i].name);
			}
		}
	else if(top) 
		for(var i = 0; i<conf2.tops.length ;i++){
			var cfws = conf2.tops[i].where.conf;
			for(var d =0; d < cfws.length; d++){
				var conf = cfws[d];
				conf.fieldInfo.exp = conf.fieldInfo.exp.replaceAll("_dimFieldName_",conf2.tops[i].name);
			}
		}
}

function downloadRpx(n) {
	n = guideConf.resultRpxPrefixOnServer+n+".rpx";
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'fileExist',file:n},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			if (data != 1) {
				alert(resources.guide.js172);
				return;
			}
			$('#downloadForm #path').val(n);
			$('#downloadForm #content').val("");
			$('#downloadForm #mode').val("");
			$('#downloadForm').submit();
		}
	});
}

function saveFile(content,type,needDataPath,oldDataPath) {
	//是否勾选本地下载；是否显示本地下载选项；是否勾选服务器保存；是否显示服务器保存选项
	var saveDisp = '1111';
	try {
		if (guideConf.saveDisp && guideConf.saveDisp.length == 4) saveDisp = guideConf.saveDisp;
	} catch(e){console.log(e);}
	var serverSavePath = '';
	try {
		if (guideConf.serverSavePath) serverSavePath = guideConf.serverSavePath;
	} catch(e){console.log(e);}
	//console.log(guideConf.saveDisp);
	//console.log(guideConf.saveDisp.length);
	var height = 150;
	if (saveDisp[1]!=1) height = height - 50;
	if (saveDisp[3]!=1) height = height - 50;
	
	var cb = function() {
		var name = $.trim($('#saveGrpxName').val());
		if (name.indexOf('.'+type) == -1) name = name + "."+type;
		var onServer = type=='qyx'?guideConf.qyxFolderOnServer:(type=='olap'?guideConf.olapFolderOnServer:"");
		$('#downloadForm #path').val(onServer+"/"+$.trim($('#saveGrpxPath1').val())+"/"+name);
		$('#downloadForm #content').val(content);
		var mode = $('#saveGrpxChk1')[0].checked?"client":"";
		mode += $('#saveGrpxChk2')[0].checked?"server":"";
		$('#downloadForm #mode').val(mode);
		$('#downloadForm').submit();
	}

	zIndexBak = artDialog.defaults.zIndex;
	
	try {
		if (!guideConf.defaultSaveName) guideConf.defaultSaveName = "";
	}catch(e){
		guideConf.defaultSaveName = "";
	}
	var dlg = art.dialog({
		id : dialogCount++,
		title : resources.guide.js51+type,
	    content: '<input id="saveGrpxName" type="text" value="'+guideConf.defaultSaveName+'" placeholder="'+resources.guide.js173+'" style="width:150px;margin:10px 22px;">'
	    	+'<div'+(saveDisp[1]==1?'':' style="display:none;"')+'><input id="saveGrpxChk1" type="checkbox" '+(saveDisp[0]==1?'checked':'')+' style="cursor:pointer;vertical-align:-2px;">'+resources.guide.js174+'</div>'
	    	+'<div'+(saveDisp[3]==1?'':' style="display:none;"')+'><input id="saveGrpxChk2"'+(saveDisp[2]==1?' checked ':'"')+' type="checkbox" style="cursor:pointer;"><input id="saveGrpxPath1" type="text" placeholder="'+resources.guide.js175+'" style="width:350px;margin:10px 2px;" value="'+serverSavePath+'"></div>'
	    	+'<div style="'+(needDataPath?'':'display:none;')+'"><input style="cursor:pointer;" id="saveGrpxChk3" type="checkbox"><input id="saveGrpxPath2" type="text" placeholder="'+resources.guide.js176+'" style="width:350px;margin:0px 2px;"></div>'
    	,button: [
	         {
	             name: resources.guide.js51,
	             callback: function() {
					var name = $.trim($('#saveGrpxName').val());
	 				if (name.length == 0) {
	 					alert(resources.guide.js177);
	 					return false;
	 				}
	 				if (!($('#saveGrpxChk1')[0].checked || $('#saveGrpxChk2')[0].checked)) {
	 					alert(resources.guide.js178);
	 					return false;
	 				}
					var fileExist = false;
					if ($('#saveGrpxChk2')[0].checked) {
						var onServer = type=='qyx'?guideConf.qyxFolderOnServer:(type=='olap'?guideConf.olapFolderOnServer:"");
						onServer += "/"+$.trim($('#saveGrpxPath1').val())+"/"+name;
						$.ajax({
							type: 'POST',
							async : false,
							url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
							data: {action:2,oper:'fileExist',file:onServer},
							success: function(data){
								if (data.indexOf('error:')==0) {
									alert(data.substring(6));
									return;
								}
								fileExist = data==1;
								
							}
						});
						if (fileExist) {
							if (!confirm(resources.guide.js179)) {
								return;
							}
						}
					}

			    	if ($('#saveGrpxChk3')[0].checked) {
		 				var path = guideConf.dataFolderOnServer+"/"+$.trim($('#saveGrpxPath2').val())+"/"+name+(guideConf.dataFileType.toLowerCase()=="binary"?".bin":".txt");
				    	$.ajax({
				    		type: 'POST',
				    		async : false,
				    		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				    		data: {action:2,oper:'saveCacheData',path:path,dataId:topResource.dataId},
				    		success: function(data){
				    			content = content.replaceAll(oldDataPath,path);
				    			cb();
				    		}
				    	});
			    	} else cb(); 
			    	artDialog.defaults.zIndex = zIndexBak;
				},
	            focus: true
	         },
	         {
	             name: resources.guide.js21
	         }
	     ]
	    ,cancel : function() {
	    	artDialog.defaults.zIndex = zIndexBak;
	    	return true;
	    }
	    ,okVal : resources.guide.js20
	    ,cancelVal : resources.guide.js21
	    ,lock : true
	    ,duration : 0
	    ,width : '400px'
		,height : '150px'
		,opacity : 0.1
		,padding : '2px 2px'
		,zIndex : 41000
	});
}

function openFile(type,callback) {
	loadServerFiles();
	var typen = 0;
	var typer = '';
	if(type == "fileData") {
		typen = 1;
		typer = resources.guide.js183;
		type = "txt,.xls,.xlsx,.csv,.btx,.ctx";
	}
	zIndexBak = artDialog.defaults.zIndex;
	var dlg = art.dialog({
		id : dialogCount++,
		title : resources.guide.js180+(type=='qyx'?resources.guide.js181:(type=='olap'?resources.guide.js182:typer)),
	    content: ''
	    	+'<a href="javascript:void(0);" title="'+resources.guide.js180+type+resources.guide.js184+'" style="display:none;overflow:hidden;display:-moz-inline-box;display:inline-block;width:140px;height:30px;vertical-align:top;background-image:url('+contextPath+guideConf.guideDir+'/img/guide/43.png);margin:10px;">'
	    	+'<form id="openForm" METHOD=POST ACTION="'+contextPath+'/servlet/dataSphereServlet?action=38" ENCTYPE="multipart/form-data" target=hiddenFrame>'
	    		+'<input accept=".'+type+'" id="openGrpxFile" name="openGrpxFile" type="file" style="height: 30px; margin-left:-80px;filter:alpha(opacity=0);opacity:0;cursor:pointer;" />'//accept=".'+type+'" 
	    		+'<input type=hidden name=path id=upPath value="tmp">'
	    		+'<input type=hidden name=saveServer id=saveServer value="'+typen+'">'
	    	+'</form>'
	    	+'</a>'
	    	+'<div style="margin-left:10px;"><input id="openGrpxBut" type="button" value="'+resources.guide.js185+'" style="margin:0 5px 0 0;height:30px;width:140px;"><span id="openGrpxSel"></span></div>'
    	,button: [
	     ]
	    ,close : function() {
			artDialog.defaults.zIndex = zIndexBak;
	    	return true;
	    }
	    //,okVal : '保存'
	    //,cancelVal : '取消'
	    ,lock : true
	    ,duration : 0
	    ,width : '500px'
		,height : '130px'
		,opacity : 0.1
		,padding : '2px 2px'
		,zIndex : 41000
	});

	openFileCb = callback;
	$('#openGrpxFile').change(function(){
		openFileName = $('#openGrpxFile').val();
		var idx = openFileName.lastIndexOf('/');
		if (idx == -1) idx = openFileName.lastIndexOf('\\');
		if (idx >= 0) openFileName = openFileName.substring(idx + 1);
		var f = openFileName.toLowerCase();
		
		if (type == 'qyx' || type == 'olap') {
			if (f.indexOf('.'+type) == -1) {
				alert(resources.guide.js186.replaceAll("{0}",type));
				return;
			}
		} else if (f.indexOf('.ctx') == -1 && f.indexOf('.btx') == -1 && f.indexOf('.txt') == -1 && f.indexOf('.csv') == -1 && f.indexOf('.xls') == -1 && f.indexOf('.xlsx') == -1) {
			alert(resources.guide.js187);
			return;
		}else {
//			alert(resources.guide.js187);
//			return;
		}
		if(f.indexOf('.ctx') != -1 || f.indexOf('.btx') != -1){
			guideConf.dataFileType = "binary";
		}
		//alert(f);
		$('#openForm').submit();
	});

	var exists = type=='qyx'?existQyx:(type=='olap'?existOlap:(type=='txt,.xls,.xlsx,.csv,.btx,.ctx'?existFileDatas:[]));
	var selDom1 = getSelectDom(exists.length==0?[""]:exists, exists.length==0?[resources.guide.js188.replaceAll("{0}",type)]:exists,"" );
	selDom1.css({'color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'4px','margin-top':'9px','width':'300px','height':'28px'}).attr('title','').change(function(){
	});
	$('#openGrpxSel').append(selDom1);
	
	$('#openGrpxBut').click(function(){
		if (getSelDom1Value(selDom1) == '') return;
		openFileCb(null,getSelDom1Value(selDom1));
	});
}
var openFileName;
var openFileCb;
function openFileCallback(content,file) {
	openFileCb(content,file);
}

function openQyx(){
	openFile("qyx",function(content, file){
		var form = $('<form method="post" accept-charset="UTF-8"></form>');
		var url = window.location.href;
		if (url.indexOf('?')>=0) url = url.substring(0,url.indexOf('?'));
		form.attr('action',url);
		form.attr('target', "_self");
		form.append('<input type="hidden" name="qyx" value="'+(content==null?file:content)+'">');
		$('body').append(form);
		form[0].submit();
	});
}
function saveQyx(){
	saveFile(domUtils.toString(),"qyx",false,"");
}
function openOlap(){
	openFile("olap",function(content, file){
		var form = $('<form method="post" accept-charset="UTF-8"></form>');
		var url = window.location.href;
		if (url.indexOf('?')>=0) url = url.substring(0,url.indexOf('?'));
		form.attr('action',url);
		form.attr('target', "_self");
		form.append('<input type="hidden" name="olap" value="'+(content==null?file:content)+'">');
		if(guideConf.norefreshfilter){
			form.append('<input type="hidden" name="norefreshfilter" value="yes" >');
		}
		$('body').append(form);
		form[0].submit();
	});
}


function openDataFile(){
	openFile("fileData",function(content, file){
		content = null;
		var srcf = file;
		if (file.toLowerCase().indexOf(".txt")>=0) file = "return file(\""+file+"\").import@t()";
		else if (file.toLowerCase().indexOf(".csv")>=0) file = "return file(\""+file+"\").import@t(;,\",\")";
		else if (file.toLowerCase().indexOf(".xlsx")>=0) file = "return file(\""+file+"\").importxls@tx()";
		else if (file.toLowerCase().indexOf(".xls")>=0) file = "return file(\""+file+"\").importxls@t()";
		else if (file.toLowerCase().indexOf(".ctx")>=0) {
			file = "return file(\""+file+"\").create().cursor()";
			guideConf.dataFileType = "binary";
		}
		else if (file.toLowerCase().indexOf(".btx")>=0) {
			file = "return file(\""+file+"\").cursor@b()";
			guideConf.dataFileType = "binary";
		}
		else {
			alert(resources.guide.js189);
			return;	
		}
		var form = $('<form method="post" accept-charset="UTF-8"></form>');
		var url = window.location.href;
		if (url.indexOf('?')>=0) url = url.substring(0,url.indexOf('?'));
		//2018.11.5
		if(guideConf.dataFileType != 'text'){
			form.append('<input id="dataFileType" type="hidden" name="dataFileType" value="'+guideConf.dataFileType+'">');
		}
		form.attr('action',url);
		form.attr('target', "_self");
		form.append('<input type="hidden" name="dfxFile" value="WEB-INF/files/dfx/official/readFile.dfx">');
		form.append('<input id="params" type="hidden" name="dfxParams">');
		form.find('#params').val("f="+srcf);
		$('body').append(form);
		form[0].submit();
	});
}

function saveOlap(){
	saveFile(aly.toString(),"olap",false,"");
}


var dialogs = [];
//1平铺；2重叠
function relocalReports(type){
	if (dialogs.length == 0) return; 
	var w = $(window).width();
	var h = $(window).height() - 50;
	if (type == 1) {
		var w1 = w/dialogs.length;
		var h1 = h;
		for (var i=0; i<dialogs.length; i++) {
			relocalReports2(dialogs[i],w1-40,h1-50,i*w1+10,50,i*1000);
			relocalReports2(dialogs[i],w1-40,h1-50,i*w1+10,50,i*1000);
		}
	} else if (type == 2) {
		var w1 = w;
		var h1 = h/dialogs.length;
		for (var i=0; i<dialogs.length; i++) {
			relocalReports2(dialogs[i],w1-40,h1-50,0+10,50+i*h1,i*1000);
			relocalReports2(dialogs[i],w1-40,h1-50,0+10,50+i*h1,i*1000);
		}
	} else if (type == 3) {
		var w1 = w - dialogs.length*60;
		var h1 = h - dialogs.length*30-20;
		for (var i=0; i<dialogs.length; i++) {
			relocalReports2(dialogs[i],w1,h1,10+i*60,50+i*30,i*1000);
			relocalReports2(dialogs[i],w1,h1,10+i*60,50+i*30,i*1000);
		}
	}

	var reports = aly.cache.reports;
	for (var i=0; i<reports.length; i++) {
		var wrap = reports[i].dlg.DOM.wrap;
		var confz = aly.getRpx(reports[i].name);
		confz.dialog.width = wrap.width();
		confz.dialog.height = wrap.height();
		confz.dialog.top = wrap.position().top;
		confz.dialog.left = wrap.position().left;
	}
}
function relocalReports2(dlg,w,h,l,t,time) {
	dlg.size(w,h);
	dlg.position(l,t);
}
	
var zIndexBak;

function getSelDom1Value(selDom1){
	var v = "";
	if(selDom1[0].tagName == "DIV"){
		v = selDom1.find("select").val();
	}else if(selDom1[0].tagName == "SELECT"){
		v = selDom1.val();
	}
	return v;
}

function getTableOptions(tableObjs, currTable){
	var s = "";
	for(var i = 0; i < tableObjs.length; i++){
		var v = tableObjs[i].name;
		s += "<option value='"+v+"'>"+v+"</option>"
	}
	return s;
}