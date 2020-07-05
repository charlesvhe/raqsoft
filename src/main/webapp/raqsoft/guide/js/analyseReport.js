function setDataScope() {
	zIndexBak = artDialog.defaults.zIndex;
	var s = guideConf.dataScope;
	var dlg = art.dialog({
		id : dialogCount++,
		title : '设置数据范围',
	    content: 
	    	'<div style="margin:10px;">性能说明：用来分析的基础数据可以无限大，但展现的最终分析结果报表不能过大，否则有可能会内存溢出，我们也认为很大的分析结果也难以被观察；设置以下范围来防止产生巨大结果的分析</div>'
			+'<div><div style="margin:10px;"><input type="text" id="scope0" value="'+(s.length>0?s[0]:30000)+'" style="width:50px;margin-right:5px;"><span style="color:gray">明细列表查询时返回的最大行数</span></div>'
			+'<div style="margin:10px;"><input type="text" id="scope1" value="'+(s.length>1?s[1]:5000)+'" style="width:50px;margin-right:5px;"><span style="color:gray">只有1个分组时，分组内数据最大数量</span></div>'
			+'<div style="margin:10px;"><input type="text" id="scope2" value="'+(s.length>2?s[2]:200)+'" style="width:50px;margin-right:5px;"><span style="color:gray">只有2个分组时，每个分组内数据最大数量</span></div>'
			+'<div style="margin:10px;"><input type="text" id="scope3" value="'+(s.length>3?s[3]:50)+'" style="width:50px;margin-right:5px;"><span style="color:gray">只有3个分组时，每个分组内数据最大数量</span></div>'
			+'<div style="margin:10px;"><input type="text" id="scope4" value="'+(s.length>4?s[4]:40)+'" style="width:50px;margin-right:5px;"><span style="color:gray">只有4个分组时，每个分组内数据最大数量</span></div>'
			+'<div style="margin:10px;"><input type="text" id="scope5" value="'+(s.length>5?s[5]:40)+'" style="width:50px;margin-right:5px;"><span style="color:gray">只有5个分组时，每个分组内数据最大数量</span></div>'
			+'<div style="margin:10px;"><input type="text" id="scope6" value="'+(s.length>6?s[6]:40)+'" style="width:50px;margin-right:5px;"><span style="color:gray">只有6个分组时，每个分组内数据最大数量</span></div>'
			+'</div>'
	    ,ok : function() {
			var s0 = $('#scope0').val();
			s0 = parseInt(s0);
			if (isNaN(s0) || s0<1) s0 = 1;
			var s1 = $('#scope1').val();
			s1 = parseInt(s1);
			if (isNaN(s1) || s1<1) s1 = 1;
			var s2 = $('#scope2').val();
			s2 = parseInt(s2);
			if (isNaN(s2) || s2<1) s2 = 1;
			var s3 = $('#scope3').val();
			s3 = parseInt(s3);
			if (isNaN(s3) || s3<1) s3 = 1;
			var s4 = $('#scope4').val();
			s4 = parseInt(s4);
			if (isNaN(s4) || s4<1) s4 = 1;
			var s5 = $('#scope5').val();
			s5 = parseInt(s5);
			if (isNaN(s5) || s5<1) s5 = 1;
			var s6 = $('#scope6').val();
			s6 = parseInt(s6);
			if (isNaN(s6) || s6<1) s6 = 1;
			s[0] = s0;
			s[1] = s1;
			s[2] = s2;
			s[3] = s3;
			s[4] = s4;
			s[5] = s5;
			s[6] = s6;
			artDialog.defaults.zIndex = zIndexBak;
	    	setTimeout(function(){
				for (var i=0; i<rpxData.confs.length; i++) {
					if (!rpxData.confs[i].dialog){
						rpxData.confs[i].dialog = {open:1,top:100,left:100+100*i,width:500,height:300};
					}
					if (rpxData.confs[i].dialog.open == 1) rpx.refreshReport(rpxData.confs[i].name, false, false);
				}
			},1);
	    	return true;
	    }
	    ,cancel : function() {
	    	artDialog.defaults.zIndex = zIndexBak;
	    	return true;
	    }
	    ,okVal : '确定'
	    ,cancelVal : '取消'
	    ,lock : true
	    ,duration : 0
	    ,width : '570px'
		,height : '280px'
		,opacity : 0.1
		,padding : '2px 2px'
		,zIndex : 41000
	});
}

function reportCellMouseover() {
	var td = $(this);
	//alert();
	var tt = td.attr('title');
	if (tt && tt != '') {
		td.attr('tt',tt);
		td.attr('title','');
	} else tt = td.attr('tt');
	if (!(tt && tt != '')) {
		td.css('cursor','');
		return;
	}
	if ((isOlap=='yes' && tt != "3") || !parent.canDrill(reportConfName)){
		td.css('cursor','');
		return;
	}
	td.css('cursor','pointer');//dbd暂不开放
}

function reportCellClick(event) {
	if(parent.guideConf.useDrill != null && !parent.guideConf.useDrill) return;
	var td = $(this);
	var tds = td.parent().parent().find('td');
	//var tds2 = td.parent().parent().parent().find('td');
	//alert(tds.length);
	//alert(tds2.length);
	var x1 = td.position().left;
	var y1 = td.position().top;
	var x2 = x1 + td.width();
	var y2 = y1 + td.height();
	//alert(left + "--" + top);
	var topValues = [];
	var leftValues = [];
	var fieldValues = [];
	var zongji = false;
	var tt = td.attr('title');
	if (tt && tt != '') {
		td.attr('tt',tt);
		td.attr('title','');
	} else tt = td.attr('tt');
	var detail = tt == "3";
	if (isOlap=='yes' && !detail) return;
	for (var i=0; i<tds.length; i++) {
		var tdi = $(tds[i]);
		var x11 = tdi.position().left;
		var y11 = tdi.position().top;
		var x22 = x11 + tdi.outerWidth(true);
		var y22 = y11 + tdi.outerHeight(true);
		var tti = tdi.attr('title');
		if (tti && tti != '') {
			tdi.attr('tt',tti);
			tdi.attr('title','');
		} else tti = tdi.attr('tt');
		var val = tdi.html().replaceAll("<br>","").replaceAll("\n\r","").replaceAll("\n","");
		
		if ((tti == 1) && (y1>=y11&&y1<=y22) && (y2>=y11&&y2<=y22) && x11<=x1) {
			leftValues[leftValues.length] = val;
			//alert(tdi.html());
		}
		if ((tti == 2) && (x1>=x11&&x1<=x22) && (x2>=x11&&x2<=x22)) {
			topValues[topValues.length] = val;
		}
		if (tti == 4 && y1 == y11 && y2 == y22) {
			fieldValues[fieldValues.length] = val;
		}
		if ((tti == 10) && (y1>=y11&&y1<=y22) && (y2>=y11&&y2<=y22) && x11<=x1) {
			zongji = true;
			leftValues[leftValues.length] = val;
		}
		if (y11>y2) break;
	}
	//alert(topValues);
	//alert(leftValues);
	if (topValues.length != 0 || leftValues.length != 0) event.stopPropagation();
	if(topValues.indexOf("总计") >= 0 && leftValues.length != 0) topValues = [];
	if(leftValues.indexOf("总计") >= 0 && topValues.length != 0) leftValues = [];
	parent.reportCellDrill(reportConfName, topValues, leftValues, fieldValues, detail, zongji);
}

var drillSvgCount = 1;
function drillSvg( ca , le, lev){
	//ca是图例值即分类值
	var area = this.frameElement;//this-window
	var upperWindow = this.parent;
	var origin_name = $(area).attr('confname');
	var origin_rpx = upperWindow.olapObj.rpxUtils.getRpx(origin_name);
	var origin_fs = origin_rpx.fields;
	var dataSet = origin_rpx.dataSet;
	var n = origin_name+resources.guide.js171+drillSvgCount++;//名字存在时如何处理
	var categoryF = null;//条件字段分类
	var legendF = null;//条件字段系列
	var legendFV = null;//条件字段系列值
	for(var i = 0; i < origin_fs.length; i++){
		if(origin_fs[i].macroName == "分类") {
			categoryF = origin_fs[i];
			continue;
		}
		if(origin_fs[i].macroName == "系列") {
			legendF = origin_fs[i];
			continue;
		}
		if(origin_fs[i].macroName == "系列值") {
			legendFV = origin_fs[i];
			continue;
		}
	}
	
	var rpx = {
			name:n
			,dataSet:dataSet
			//,dataSetLevel:'none/calc/where/group/having/order'
			,_hasAggr:0//'0/1'
			,_status:''//'为空表示正确，不为空是失效的具体信息'
			,type:1
			,dialog:{
				open:1//0/1
				,top:100+Math.random()*100
				,left:100+Math.random()*200
				,width:500
				,height:400
			}
			,reportId:"rid"+new Date().getTime()
			,structType:1//:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表

			,template:""
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
	var ds = upperWindow.aly.getDataSet(dataSet);
	//先考虑一个表内的情况
	if(ds.type == 7|| ds.type == 6){
		var fs = [];
		var cfobj = upperWindow.dqlQuery.confUtils.getInfosObj(categoryF.src);
		upperWindow.dqlQuery.confUtils.getFieldInfos(cfobj.lastTable, fs, 0, null, null,true,1,true);
		//var fields = upperWindow.mdUtils.getShowFields(null,'回款单',false);
		
		var ss = fs;
		var aSrcs = upperWindow.dqlQuery.confUtils.autoSrcs(ss);
		var pos = "field";
		for (var z=0; z<ss.length; z++) {
			var iiObj = upperWindow.dqlQuery.confUtils.getInfosObj(ss[z]);
			if (pos != 'field' && pos != 'params' && iiObj.dim == '' && conf.type==1) return;
			var aggr = '';//aObj.attr('aggr');
	//		if (aggr == '' && divsi == null)
	//		{
	//			if (iiObj.finalType == 1) aggr = 'sum';
	//			else aggr = 'count';
	//		}
			//alert(aggr);
			var name = upperWindow.dqlQuery.confUtils.generateNewFieldAlias(iiObj);
			//if (aggr != '') {
			//	var iObj = cus.getInfosObj(ss[0]);
			//	ss[0] = iObj.str + split_2 + iObj.lastTable + split_1 + iObj.lastField + split_1 + split_1 + aggr;
			//}
			var edit = iiObj.dim;
			edit = upperWindow.defaultEdit.getEditStyle(edit);
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
			if(newItem.name == categoryF.name){
				var dataSetObj = upperWindow.aly.getDataSet(dataSet);
				var transWhereInfo = upperWindow.transWhereInfo;
				var defaultEdit = upperWindow.defaultEdit;
				var whereUtils = upperWindow.whereUtils;
				var replaceSpecificExps = upperWindow.replaceSpecificExps;
				
				//20190319
				var whereSrc = newItem.src;//newItem.relas.length == 0 ? newItem.src : newItem.relas;
				var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(newItem.srcEdit,ca),"disp":""}]
				newItem.where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
				replaceSpecificExps(rpx,false,true);
			}
			
			if(legendF && newItem.name == legendF.name){
				var dataSetObj = upperWindow.aly.getDataSet(dataSet);
				var transWhereInfo = upperWindow.transWhereInfo;
				var defaultEdit = upperWindow.defaultEdit;
				var whereUtils = upperWindow.whereUtils;
				var replaceSpecificExps = upperWindow.replaceSpecificExps;
				
				//20190319
				var whereSrc = newItem.src;//newItem.relas.length == 0 ? newItem.src : newItem.relas;
				var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(newItem.srcEdit,le),"disp":""}]
				newItem.where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
				replaceSpecificExps(rpx,false,true);
			}
			
			if(legendFV && lev && newItem.name == legendFV.name){
				var dataSetObj = upperWindow.aly.getDataSet(dataSet);
				var transWhereInfo = upperWindow.transWhereInfo;
				var defaultEdit = upperWindow.defaultEdit;
				var whereUtils = upperWindow.whereUtils;
				var replaceSpecificExps = upperWindow.replaceSpecificExps;
				
				//20190319
				var whereSrc = newItem.src;//newItem.relas.length == 0 ? newItem.src : newItem.relas;
				var whereConf = [{"level":1,"fieldInfo":transWhereInfo(whereSrc,null,false),"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(newItem.srcEdit,lev),"disp":""}]
				newItem.where = {conf:whereConf,exp:whereUtils.getExp(whereConf, "T1.", 1),disp:whereUtils.getDisp(whereConf)};	
				replaceSpecificExps(rpx,false,true);
			}
			
			rpx.fields.push(newItem);
		}
	}else{
		for(var p = 0; p < ds.fields.length; p++){
			newItem = upperWindow.rpxu.newRpxField(upperWindow.aly.getDataSetField(ds,ds.fields[p].name));
			var w = {};
			if(newItem.name == categoryF.name){
				var dataSetObj = ds;
				var transWhereInfo = upperWindow.transWhereInfo;
				var defaultEdit = upperWindow.defaultEdit;
				var whereUtils = upperWindow.whereUtils;
				var replaceSpecificExps = upperWindow.replaceSpecificExps;
				
				var whereConf = [{"level":1,"fieldInfo":{disp:newItem.name,dataType:newItem.dataType,edit:newItem.srcEdit,exp:newItem.src,valueType:1,values:""},"oper":resources.guide.js25,"values":""+defaultEdit.getEditStyleValueByDisp(newItem.srcEdit,ca),"disp":""}];
				w = {conf:whereConf,exp:whereUtils.getExp(whereConf, "", 1, 2),disp:whereUtils.getDisp(whereConf)};	
				replaceSpecificExps(rpx,false,true);
			}
			newItem.where = w;
			rpx.fields.push(newItem);
		}
		upperWindow.aly.checkConf(rpx);
	}
	upperWindow.rqAnalyse.rpxs.push(rpx);
	upperWindow.aly.refresh(null,null,rpx.name);
	
}
