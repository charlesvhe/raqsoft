//"use strict"

/*
	fields : [{name:'',type:1字段/2维/3计算字段/4条件/5多字段外键条件,where:'',whereDisp:'',wherePos:'表别名/HAVING',order:0无序/1升序/-1降序,seq:seq++,format:'',useDisp:0/1,dim:'',selectOut:0/1,colWidth:80,
		1:  infos:'',aggr:'',tAlias:'',lcts:'定位式',
		2:  level:'',
		3:  exp:'',
		,dataType,edit
	}],
	tables : [{name:'',annexT:'',joinType:'0取交集/1向左对齐/2取并集'}]
	bys : [{infos:'',dimAlias:'',tAlias:''}]
*/

/*
 *  items : [infos]
	fields : [{name:'',infos:'',aggr:'',tAlias:''}],
	dims : [{name:'',dim:'',infos:''}],
	relas : [{dim:'',field:'',infos:''}]
	wheres : [{type:1字段/2维/3复杂条件,target:fieldName/dimName,conf:{},havingConf:{},dimConf:{},where:'',whereDisp:'',having:'',havingDisp:'',_type:'',_dim:'',_dimType:'',_dimExp:''}]
	srcs : [{src:'',real:'',dimKey:'0/1/10新版的非维字段/11新版的维字段',name:'',selectType:'dim/field',aggr:'',tAlias:'',errorInfo:''}]
	
	
domInfos示例：
{
    "relas": [
        {
            "infos": "订单明细;;;;订单明细,,,,编号;;;;订单,,,,签单日期;;;;年,,,,年,,,,年",
            "dim": "年",
            "field": "订单金额"
        },
        {
            "infos": "订单明细;;;;订单明细,,,,编号;;;;订单,,,,雇员",
            "dim": "雇员",
            "field": "订单金额"
        },
        {
            "infos": "回款单;;;;回款单,,,,回款日期;;;;年,,,,年,,,,年",
            "dim": "年",
            "field": "回款金额"
        },
        {
            "infos": "回款单;;;;回款单,,,,销售",
            "dim": "雇员",
            "field": "回款金额"
        },
        {
            "infos": "回款单;;;;回款单,,,,回款日期;;;;年,,,,年,,,,年",
            "dim": "年",
            "field": "回款笔数"
        },
        {
            "infos": "回款单;;;;回款单,,,,销售",
            "dim": "雇员",
            "field": "回款笔数"
        },
        {
            "infos": "回款单;;;;回款单,,,,回款日期;;;;年,,,,年,,,,年",
            "dim": "年",
            "field": "上级"
        },
        {
            "infos": "回款单;;;;回款单,,,,销售",
            "dim": "雇员",
            "field": "上级"
        }
    ],
    "wheres": [
        {
            "target": "年",
            "conf": [],
            "havingConf": [],
            "dimConf": [],
            "where": "",
            "whereDisp": "",
            "having": "",
            "havingDisp": ""
        },
        {
            "target": "雇员",
            "conf": [],
            "havingConf": [],
            "dimConf": [],
            "where": "",
            "whereDisp": "",
            "having": "",
            "havingDisp": ""
        },
        {
            "target": "订单金额",
            "conf": [
                {
                    "level": 1,
                    "fieldInfo": {
                        "disp": "订单明细.金额",
                        "dataType": 1,
                        "useTreeDisp": false,
                        "edit": null,
                        "exp": "金额"
                    },
                    "oper": "大于",
                    "values": "50",
                    "disp": ""
                }
                ,{
                		"join" : "OR"
                		,"level" : 1
                }
            ],
            "havingConf": [
                {
                    "level": 1,
                    "fieldInfo": {
                        "disp": "订单明细.金额求和",
                        "dataType": 1,
                        "useTreeDisp": false,
                        "edit": null,
                        "exp": "sum(金额)"
                    },
                    "oper": "大于",
                    "values": "10000",
                    "disp": ""
                }
            ],
            "dimConf": [],
            "where": "",
            "whereDisp": "",
            "having": "",
            "havingDisp": ""
        },
        {
            "target": "回款金额",
            "conf": [],
            "havingConf": [],
            "dimConf": [],
            "where": "",
            "whereDisp": "",
            "having": "",
            "havingDisp": ""
        },
        {
            "target": "回款笔数",
            "conf": [],
            "havingConf": [],
            "dimConf": [],
            "where": "",
            "whereDisp": "",
            "having": "",
            "havingDisp": ""
        },
        {
            "target": "上级",
            "conf": [],
            "havingConf": [],
            "dimConf": [],
            "where": "",
            "whereDisp": "",
            "having": "",
            "havingDisp": ""
        }
    ],
    "srcs": [
        {
            "src": "年;;;;年,,,,年",
            "real": "订单明细;;;;订单明细,,,,编号;;;;订单,,,,签单日期;;;;年,,,,年,,,,年",
            "dimKey": 11,
            "name": "年",
            "selectType": "dim",
            "aggr": "",
            "tAlias": "",
            "errorInfo": "",
            "dim": "年"
        },
        {
            "src": "雇员;;;;雇员,,,,雇员",
            "real": "订单明细;;;;订单明细,,,,编号;;;;订单,,,,雇员;;;;雇员,,,,雇员",
            "dimKey": 11,
            "name": "雇员",
            "selectType": "dim",
            "aggr": "",
            "tAlias": "",
            "errorInfo": "",
            "dim": "雇员"
        },
        {
            "src": "订单明细;;;;订单明细,,,,金额;;;;订单明细,,,,金额,,,,,,,,sum",
            "real": "订单明细;;;;订单明细,,,,金额;;;;订单明细,,,,金额,,,,,,,,sum",
            "dimKey": 10,
            "name": "订单金额",
            "selectType": "field",
            "aggr": "sum",
            "tAlias": "",
            "errorInfo": "",
            "dim": ""
        },
        {
            "src": "回款单;;;;回款单,,,,金额;;;;回款单,,,,金额,,,,,,,,sum",
            "real": "回款单;;;;回款单,,,,金额;;;;回款单,,,,金额,,,,,,,,sum",
            "dimKey": 10,
            "name": "回款金额",
            "selectType": "field",
            "aggr": "sum",
            "tAlias": "",
            "errorInfo": "",
            "dim": ""
        },
        {
            "src": "回款单;;;;回款单,,,,金额;;;;回款单,,,,金额,,,,,,,,count",
            "real": "回款单;;;;回款单,,,,金额;;;;回款单,,,,金额,,,,,,,,count",
            "dimKey": 10,
            "name": "回款笔数",
            "selectType": "field",
            "aggr": "count",
            "tAlias": "",
            "errorInfo": "",
            "dim": ""
        },
        {
            "src": "回款单;;;;回款单,,,,销售;;;;雇员,,,,上级",
            "real": "回款单;;;;回款单,,,,销售;;;;雇员,,,,上级",
            "dimKey": 10,
            "name": "上级",
            "selectType": "field",
            "aggr": "",
            "tAlias": "",
            "errorInfo": "",
            "dim": "雇员"
        }
    ],
    "dataSource": "_db_pre_DataLogic_db_end_",
    "outerCondition": []
}	
	
*/
var domInfos = {relas:[],wheres:[],srcs:[],dataSource:"_db_pre_DataLogic_db_end_",outerCondition:[]};

var dialogCount = 0;
var disctictStatus = false;
var detailJoin = false;
//组的背景色
var groupColors = ['#DBE2FC','#80DDFF','#6765B7','#3399FF','#E4EFF5'];
var byStyle = 2; // 1维的信息来源在维行上、2维的信息来源在列上、3不显示信息来源

var dropDoms = new Array();
var lastOpt = new Date().getTime(); //最后一次操作时间，防止二次操作，不严谨。
var autoFilter = true;
var relaTablesBak = new Array();
var onlyPksBak = new Array();
var relaDimsBak = null;
var selectedDims = [];
var selectedFields = [];
var dqlQuery = new DqlQuery();

var cus = dqlQuery.confUtils;
var mdUtils = dqlQuery.metadataUtils;

var domUtils = {
	toString : function() {
		return dqlQuery.getConfStr();
	},
	set : function(initQyx) {
		dqlQuery.setConfStr(initQyx);
		domInfos = dqlQuery.conf;
		domUtils.refresh();
	},
	getRela : function(fName, dName, currDomInfos) {
		return cus.getRela(fName,dName);
	},
	getDim : function(name, currDomInfos){
		return cus.getDim(name);
	},
	getWhere : function(name, currDomInfos) {
		return cus.getWhere(name);
	},
	getField : function(name,currDomInfos) {
		return cus.getField(name);
	},
	getSrc : function(name,currDomInfos) {
		return cus.getSrc(name);
	},
	removeSrc : function(name) {
		cus.removeSrc(name);
		domUtils.refresh();
	},
	modifySrc : function(old, name) {
		cus.modifySrc(old,name);
		domUtils.refresh();
	},
	removeRela : function(f, d) {
		cus.removeRela(f,d);
	},
	addRela : function(f, d, infos, currDomInfos) {
		cus.addRela(f,d,infos);
	},
	addSrc : function(infos,isDim) {
		cus.addSrc(infos,isDim);
		domUtils.refresh();
	},
	getDims : function(){
		return cus.getDims();
	},
	getFields : function() {
		return cus.getFields();
	},
	//1、看是否存在聚合方式、字段的维
	//srcs : [{src:'',real:'',dimKey:'0/1',name:'',selectType:'dim/field',aggr:'',tAlias:'',errorInfo:''}]
	check : function() {
		var srcObjs = [];
		var realObjs = [];
		selectedDims = [];
		selectedFields = [];

		for (var i=0; i<domInfos.srcs.length; i++) {
			var si = domInfos.srcs[i];
			if (si.dimKey == 0) si.dimKey = 10
			else if (si.dimKey == 1) si.dimKey = 11
		}

		cus.refreshRela();

		if (domInfos.srcs.length==0) {
			relaTablesBak = [];
			onlyPksBak = [];
			generateFields();
			relaDimsBak = null;
			generateDimFields();
			return;
		}

		//原始选出字段的所有已存在的表
		var tables = [];
		var subTable = '';
		var masterTable = '';
		for (var i=0; i<domInfos.srcs.length; i++) {
			srcObjs[i] = cus.getInfosObj(domInfos.srcs[i].src);
			domInfos.srcs[i].aggr = srcObjs[i].aggr;
			domInfos.srcs[i].dim = srcObjs[i].dim;
			realObjs[i] = cus.getInfosObj(domInfos.srcs[i].real);
			if (tables.indexOf(srcObjs[i].firstTable) == -1) tables.push(srcObjs[i].firstTable);

			if (srcObjs[i].subTable != '') {
				subTable = srcObjs[i].subTable;
				masterTable = srcObjs[i].firstTable;
			}

		}

		var existAggr = false;
		var existDimKeyNoAggr = false; //非聚合维表主键
		var existNoAggr = false; //非聚合
		//
		for (var i=0; i<domInfos.srcs.length; i++) {
			domInfos.srcs[i].aggr = srcObjs[i].aggr;
			//domInfos.srcs[i].dimKey = srcObjs[i].dimKey;

			if (srcObjs[i].aggr != '') existAggr = true;
			else {
				if (srcObjs[i].dimKey==11) existDimKeyNoAggr = true;
				else existNoAggr = true;
			}

			//else if (itemObjs[i].dim != '') existDims.push(itemObjs[i].dim);
		}

		//变换来源
		if (tables.length>1) {
			for (var j=0; j<tables.length; j++) {
				var reals = [];
				for (var i=0; i<domInfos.srcs.length; i++) {
					if (realObjs[i].firstTable == tables[j]) {
						reals[i] = domInfos.srcs[i].real;
						continue;
					}
					var infoss = [];
					cus.getFieldInfos(tables[j], infoss, 0, srcObjs[i].lastTable, srcObjs[i].lastField, true);
					if (infoss.length == 0) break;

					var infoObj0 = cus.getInfosObj(infoss[0]);
					if (srcObjs[i].aggr != '') {
						infoss[0] += split_2 + infoObj0.lastTable + split_1 + infoObj0.lastField + split_1 + split_1 + srcObjs[i].aggr;
						//infoObj0 = cus.getInfosObj(infoss[z]);
					}
					reals[i] = infoss[0];

				}

				if (reals.length == domInfos.srcs.length) {
					for (var i=0; i<domInfos.srcs.length; i++) {
						if (realObjs[i].firstTable != tables[j]) {
							domInfos.srcs[i].real = reals[i];
							realObjs[i] = cus.getInfosObj(domInfos.srcs[i].real);
						}
					}
					break;
				}
			}
		} else {
			for (var i=0; i<domInfos.srcs.length; i++) {
				domInfos.srcs[i].real = domInfos.srcs[i].src;
				realObjs[i] = cus.getInfosObj(domInfos.srcs[i].real);
			}
		}

/*
		//确定是字段还是维
		var dims = [];
		var fields = [];
		for (var i=0; i<srcObjs.length; i++) {
			//var type =
			if (existAggr) {
				if (srcObjs[i].dim != '' && srcObjs[i].aggr == '') {
					domInfos.srcs[i].selectType = 'dim';
					domInfos.srcs[i].real = domInfos.srcs[i].src;//维不变换来源 2016/05/09
				}
				else domInfos.srcs[i].selectType = 'field';
			} else {
				domInfos.srcs[i].selectType = 'field';
			}
			if (domInfos.srcs[i].selectType == 'dim') dims[dims.length] = domInfos.srcs[i];
			else fields[fields.length] = domInfos.srcs[i];
		}

		//调整顺序
		var newSrcs = [];
		for (var i=0; i<dims.length; i++) {
			newSrcs[newSrcs.length] = dims[i];
		}
		for (var i=0; i<fields.length; i++) {
			newSrcs[newSrcs.length] = fields[i];
		}
		domInfos.srcs = newSrcs;
*/

		//找已存在的维和字段
		for (var i=0; i<domInfos.srcs.length; i++) {
			var srci = domInfos.srcs[i];
			if (srci.dimKey == 11) {
				selectedDims.push(srci.dim);
			} else {
				selectedFields.push(srci.real);
			}
		}


		//找相关的表和维
		var relaTables = [];
		var relaDims = [];
		var onlyPks = [];
		if (autoFilter) {
			//子表查询
			if (subTable!='') {
				if (relaTablesBak.length!=1 && relaTablesBak[0] != masterTable) {
					generateFields([masterTable],[]);
					//alert(masterTable);
					relaTablesBak = [masterTable];
					onlyPksBak = [0];
				}

				relaDimsBak = [];
				generateDimFields([]);

				return;
			}

			var dimTables = [];
			var currTable;
			var existTables = [];
			var existDims = [];
			for (var i=0; i<domInfos.srcs.length; i++) {
				var srci = domInfos.srcs[i];
				//2017/09/25 去掉下面这行的注释，要求非聚合字段的表才算数
				if (srci.aggr != '') continue;
				
				if (srci.dimKey == 11) {
					existDims.push(srci.dim);
					dimTables[dimTables.length] = cus.getInfosObj(srci.real).firstTable;
					//relaDims = srci.dim;
				} else {
					existTables.push(cus.getInfosObj(srci.real).firstTable);
					currTable = cus.getInfosObj(srci.real).firstTable;
					break;
				}
			}

			if (existAggr || existDims.length>0) {
				relaDims = null;
			}

			if (existDims.length > 0) {
				relaTables = [];
				onlyPks = [];
				var getTables = mdUtils.getTables();
				for (var z=0; z<getTables.length; z++){
					var tz = getTables[z];
					if (tz.fields.length<2) continue;
					var has = true;
					for (var j=0; j<existDims.length; j++){
						var ssj = new Array();
						cus.getDimInfos(tz.name, existDims[j], ssj, 0, false);
						if (ssj.length==0) {
							has = false;
							break;
						}
					}
					if (has) {
						relaTables.push(tz.name);
						onlyPks.push(0);
					}
				}
			} else {
				if (existTables.length==0) {
					relaTables = [];
					onlyPks = [];
				} else {
					var ts = [];
					for (var j=0; j<existTables.length; j++) {
						var tsj = mdUtils.getSubTables(existTables[j]);
						if (j == 0) ts = tsj;
						else {
							for (var i=ts.length-1; i>=0; i--) {
								if (tsj.indexOf(ts[i]) == -1) ts.remove(ts[i]);
							}
						}
					}
					for (var i=existTables.length-1; i>=0; i--) {
						if (ts.indexOf(existTables[i])==-1)
							ts.splice(0, 0, existTables[i]);
					}
					relaTables = ts;
					for (var i=0; i<relaTables.length; i++) {
						onlyPks[i] = 0;
					}
				}
			}

/*
			if (dimTables.length==0){
				var ts = mdUtils.getSubTables(currTable);
				if (ts.indexOf(currTable)==-1)
					ts.splice(0, 0, currTable);
				relaTables = ts;
				for (var i=0; i<relaTables.length; i++) {
					onlyPks[i] = 0;
				}
				relaDims = [];
			} else {
				relaDims = null;
				var ts = [];
				for (var j=0; j<dimTables.length; j++) {
					var tsj = mdUtils.getSubTables(dimTables[j]);
					if (j == 0) ts = tsj;
					else {
						for (var i=ts.length-1; i>=0; i--) {
							if (tsj.indexOf(ts[i]) == -1) ts.remove(ts[i]);
						}
					}
				}
				for (var i=dimTables.length-1; i>=0; i--) {
					if (ts.indexOf(dimTables[i])==-1)
						ts.splice(0, 0, dimTables[i]);
				}
				relaTables = ts;
				for (var i=0; i<relaTables.length; i++) {
					onlyPks[i] = 0;
				}


				//for (var i=0; i<lmd.tables.length; i++) {
				//	if (relaTables.indexOf(lmd.tables[i].name) == -1) {
				//		relaTables[relaTables.length] = lmd.tables[i].name;
				//		onlyPks[onlyPks.length] = 1;
				//	}
				//}
			}
			*/

			var change = false;
			if (relaTablesBak.length != relaTables.length) change = true;
			else {
				for (var i=0; i<relaTables.length; i++) {
					if (relaTablesBak[i] != relaTables[i] || onlyPksBak[i] != onlyPks[i]) {
						change = true;
						break;
					}
				}
			}
			//console.log(relaTables);
			//console.log(onlyPks);
			//console.log(relaDims);
			change = true;
			if (change) {
				generateFields(relaTables,onlyPks);
				relaTablesBak = relaTables;
				onlyPksBak = onlyPks;
			}

			change = false;
			if (relaDimsBak != relaDims) change = true;
			else if (relaDimsBak != null) {
				if (relaDimsBak.length != relaDims.length) change = true;
				else {
					for (var i=0; i<relaDimsBak.length; i++) {
						if (relaDimsBak[i] != relaDims[i]) {
							change = true;
							break;
						}
					}
				}
			}
			change = true;
			if (change) {
				generateDimFields(relaDims);
				relaDimsBak = relaDims;
			}

		} else {
			//if (relaTablesBak.length>0) {
				relaTablesBak=[];
				onlyPksBak=[];
				generateFields();
			//}
			//if (relaDimsBak != null) {
				generateDimFields();
				relaDimsBak = null;
			//}
		}

	},
	getNames : function(currDomInfos) {
		return cus.getNames();
	},
	setFieldName : function(name, newName, needRefresh) {
		cus.setFieldName(name,newName);
		if (needRefresh) domUtils.refresh();
	},
	refresh : function() {
		domUtils.check();

		dropDoms = new Array();
		var descDim='', descField='', descWhere='';

		var itemObjs = [];
		var existAggr = false;
		var existDims = [];

		var dimCount = 0;
		var fieldCount = 0;
		var hasAggr = false;
		for (var i=0; i<domInfos.srcs.length; i++) {
			var si = domInfos.srcs[i];
			if (si.selectType == 'dim') dimCount++;
			else fieldCount++;
			if (domInfos.srcs[i].selectType == 'dim') continue;
			var infoObj = cus.getInfosObj(si.real);
			if (infoObj.aggr != '') hasAggr = true;
		}
		
		var margin = (tableDivHasTopBut?50:25)+'px 25px 0';
		if (guideConf.queryTableMargin) margin = guideConf.queryTableMargin;
		var tbody = $('<table border=0 style="table-layout:fixed;border:0;border-collapse:collapse;border:0px;margin:'+margin+';" cellspacing=0 cellpadding=0></table>');
		var table = $('<tbody></tbody>');
		tbody.append(table);
		var colspan = 0;
		//alert(domInfos.dims.length + "--" + domInfos.fields.length);
		if (dimCount>0) {
			colspan = dimCount+1;
		} else if (fieldCount>0) colspan = 1;

		var hasError = false;
		var errorCells = [];
		if (colspan>0) {
			var row = $('<tr seq="no" style="height:30px;background-color:#F4F4F4;text-align:center;"><td id="errorTh" style="width:30px;"></td><td><span id="clearBut" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;"><img src="'+contextPath+guideConf.guideDir+'img/guide/13.png" style="border:0;margin-left:2px;width:20px;height:20px;"/></span></td><td>名称</td><td>条件</td><td colspan='+colspan+' class="srcs">信息来源</td></tr>');
			table.append(row);
			row.find('#clearBut').click(function(){
				if (confirm(resources.guide.js53)) {
					var undo = "operations.status('" + domUtils.toString() + "')";
					domInfos.srcs = [];
					domInfos.wheres = [];
					domInfos.relas = [];
					domUtils.refresh();
					var redo = "operations.status('" + domUtils.toString() + "')";
					var oper = {undo:undo,redo:redo};
					operations.addOper(oper);
				}
			});
		}

		var seqi = 0;
		for (var i=0; i<domInfos.srcs.length; i++) {
			var si = domInfos.srcs[i];
			if (si.selectType == 'field') continue;

			var row = $('<tr seq="'+seqi+'" style="background-color:#F9F9F9;"></tr>');
			table.append(row);
			seqi++;

			var infoObj = cus.getInfosObj(si.real);

			var dName = si.name;

			var td1 = $('<td style="align:center;"></td>');
			row.append(td1);
			errorCells.push(td1);

			var td2 = $('<td style="text-align:center;"></td>');
 			var div2 = $('<div style=""></div>');
			td2.append(div2);
			var img1 = $('<span f="'+dName+'" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;"><img src="'+contextPath+guideConf.guideDir+'img/guide/13.png" style="border:0;margin-left:2px;"/></span>');
			img1.click(function(e){
				var f = $(this).attr('f');
				var undo = "operations.status('" + domUtils.toString() + "')";
				domUtils.removeSrc(f);
				var redo = "operations.status('" + domUtils.toString() + "')";
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
			});

			div2.append(img1);
			row.append(td2);

			var td3 = $('<td></td>');
			row.append(td3);
			td3.append('<span f="'+dName+'" style="padding:2px 20px 2px 2px;cursor:pointer;">' + dName + "</span>");
			td3.find('span').click(function(e){
				var f = $(this).attr('f');
				var dlg = art.dialog({
					id : dialogCount++,
					title : resources.guide.js54,
				    content: '<input id="modifyName" style="width:120px;margin:15px;" type="text" f="'+f+'" value="'+f+'">'
				    ,ok : function() {
						var m = $('#modifyName');
				    	var n = $.trim(m.val());
				    	if (n == m.attr('f')) return true;
				    	if (n == '') {
				    		alert(resources.guide.js55);
				    		return false;
				    	}
				    	if (domUtils.getSrc(n)) {
				    		alert(resources.guide.js56);
				    		return false;
				    	}
						var undo = "operations.status('" + domUtils.toString() + "')";
						domUtils.modifySrc(m.attr('f'),n);
						var redo = "operations.status('" + domUtils.toString() + "')";
						var oper = {undo:undo,redo:redo};
						operations.addOper(oper);
				    }
				    ,cancel : true
				    ,okVal : resources.guide.js20
				    ,cancelVal : resources.guide.js21
				    ,lock : true
				    ,duration : 0
				    ,width : '200px'
					,height : '50px'
					,opacity : 0.1
					,padding : '2px 2px'
				});
			});

			var td5 = $('<td></td>');
			row.append(td5);
 			var wi = domUtils.getWhere(dName);
 			var whereDisp = whereUtils.getDisp(wi.dimConf);
 			if (whereDisp == '' && wi.where != null) whereDisp = wi.whereDisp;
 			if (whereDisp == '') whereDisp = wi.where;
			var div3 = $('<div f="'+dName+'" style="margin:5px;cursor:pointer;'+(wi.where!=''?'':'color:gray;')+'" title="'+(whereDisp!=''?whereDisp:resources.guide.js57)+'">'+(whereDisp!=''?(whereDisp.length>20?whereDisp.substring(0,30)+'...':whereDisp):resources.guide.js57)+'</div>');
			td5.append(div3);
			div3.click(function(){
				var f = $(this).attr('f');
				finalWhere(f,false);
				//openWhere(f,false);
			});

			var td4 = $('<td style="padding:0;" class="srcs">&nbsp;</td>');
			row.append(td4);

			for (var j=0; j<domInfos.srcs.length; j++) {
				if (domInfos.srcs[j].selectType == 'field') continue;
				var td4j = $('<td style="padding:0;" class="srcs">&nbsp;</td>');
				row.append(td4j);
				if (j == i) {
					td4j.html("<img src='"+contextPath+guideConf.guideDir+"/img/guide/24.png' style='border:0;margin-left:2px;'/>");
				}
			}
			//row.append(td2);
		}

		var firstTable = "";
		var cnt = 0;
		for (var i=0; i<domInfos.srcs.length; i++) {
			var si = domInfos.srcs[i];
			if (domInfos.srcs[i].selectType == 'dim') continue;
			var row = $('<tr seq='+(100+cnt)+' style="background-color:#FFFFFF;"></tr>');
			cnt++;
			table.append(row);

			var infoObj = cus.getInfosObj(si.real);

			var fName = si.name;
			if (firstTable == "") firstTable = infoObj.firstTable;
			var sameTable = firstTable == infoObj.firstTable;

			if (!sameTable) sameTable = mdUtils.isAnnex(firstTable, infoObj.firstTable);
			var td1 = $('<td></td>');
			row.append(td1);

			var td2 = $('<td style="text-align:center;"></td>');
 			var div2 = $('<div style=""></div>');
			td2.append(div2);
			var img1 = $('<span f="'+fName+'" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;"><img src="'+contextPath+guideConf.guideDir+'img/guide/13.png" style="border:0;margin-left:2px;"/></span>');
			img1.click(function(e){
				var f = $(this).attr('f');
				var undo = "operations.status('" + domUtils.toString() + "')";
				domUtils.removeSrc(f);
				var redo = "operations.status('" + domUtils.toString() + "')";
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
			});

			div2.append(img1);
			row.append(td2);

			var td3 = $('<td></td>');
			row.append(td3);
			td3.append('<span f="'+fName+'" style="padding:2px 20px 2px 2px;cursor:pointer;">' + fName + "</span>");
			td3.find('span').click(function(e){
				var f = $(this).attr('f');
				var dlg = art.dialog({
					id : dialogCount++,
					title : resources.guide.js54,
				    content: '<input id="modifyName" style="width:120px;margin:15px;" type="text" f="'+f+'" value="'+f+'">'
				    ,ok : function() {
						var m = $('#modifyName');
				    	var n = $.trim(m.val());
				    	if (n == m.attr('f')) return true;
				    	if (n == '') {
				    		alert(resources.guide.js55);
				    		return false;
				    	}
				    	if (domUtils.getSrc(n)) {
				    		alert(resources.guide.js56);
				    		return false;
				    	}
						var undo = "operations.status('" + domUtils.toString() + "')";
						domUtils.modifySrc(m.attr('f'),n);
						var redo = "operations.status('" + domUtils.toString() + "')";
						var oper = {undo:undo,redo:redo};
						operations.addOper(oper);
				    }
				    ,cancel : true
				    ,okVal : resources.guide.js20
				    ,cancelVal : resources.guide.js21
				    ,lock : true
				    ,duration : 0
				    ,width : '200px'
					,height : '50px'
					,opacity : 0.1
					,padding : '2px 2px'
				});
			});

			var td5 = $('<td></td>');
			row.append(td5);
 			var wi = domUtils.getWhere(fName);

 			var whereDisp = whereUtils.getDisp(wi.conf);
 			if (whereDisp == '' && wi.where != null) whereDisp = wi.whereDisp;
 			if (whereDisp == '') whereDisp = wi.where;
 			var div3 = $('<div f="'+fName+'" style="white-space:nowrap;cursor:pointer;margin:5px;'+(whereDisp!=''?'':'color:gray;')+'" title="'+(whereDisp!=''?whereDisp:resources.guide.js57)+'">'+(whereDisp!=''?(whereDisp.length>20?whereDisp.substring(0,30)+'...':whereDisp):resources.guide.js57)+'</div>');
			td5.append(div3);
			div3.click(function(){
				var f = $(this).attr('f');
				//commonWhere2(f);
				finalWhere(f,false);
			});

			if (dimCount>0 && si.aggr != '') {
	 			var havingDisp = whereUtils.getDisp(wi.havingConf);
				var div4 = $('<div f="'+fName+'" style="white-space:nowrap;cursor:pointer;margin:5px;'+(havingDisp!=''?'':'color:gray;')+'" title="'+(havingDisp!=''?havingDisp:resources.guide.js58)+'">'+(havingDisp!=''?(havingDisp.length>20?havingDisp.substring(0,30)+'...':havingDisp):resources.guide.js58)+'</div>');
				td5.append('<div style="float:left;margin:5px;display:none;"> | </div>').append(div4);
				div4.click(function(){
					var f = $(this).attr('f');
					finalWhere(f,true);
					//openWhere(f,true);
				});
			}
			td5.append('<div style="clear:both;"></div>')

			var missing = false;
			var fatherDim = "";
			var td4 = $('<td class="srcs"></td>');
			row.append(td4);
			if (infoObj.subTable != '') {
				td4.append(infoObj.alias1);
			} else {
				var infoss = [];
				cus.getFieldInfos(infoObj.firstTable, infoss, 0, infoObj.lastTable, infoObj.lastField,true);
				if (infoss.length == 1) {
					td4.append(infoObj.alias1);
				} else {
					var str = "";
					for (var z=0; z<infoss.length; z++) {
						var infoObjz = cus.getInfosObj(infoss[z]);
						if (infoObj.aggr != '') {
							infoss[z] += split_2 + infoObjz.lastTable + split_1 + infoObjz.lastField + split_1 + split_1 + infoObj.aggr;
							infoObjz = cus.getInfosObj(infoss[z]);
						}
						str += '<option value="'+infoss[z]+'"'+(infoss[z]==infoObj.str?' selected':'')+'>'+infoObjz.alias1+'</option>';
					}
					td4.append('<select f="'+fName+'">'+str+'</select>');
					//alert(div2.find( "select" ).length);
					td4.find( "select" ).css({'margin':'1px 0','border':'0','color':'#333333','padding':'1px'}).change(function(){
						var undo = "operations.status('" + domUtils.toString() + "')";
						var f = $(this).attr('f');
						domUtils.getSrc(f).src = this.value;
						domUtils.getSrc(f).real = this.value;
						domUtils.refresh();
						var redo = "operations.status('" + domUtils.toString() + "')";
						var oper = {undo:undo,redo:redo};
						operations.addOper(oper);
					});//.selectBoxIt();

				}
			}



			for (var j=0; j<domInfos.relas.length; j++){
				var infoObjj = cus.getInfosObj(domInfos.relas[j].infos);
				if (si.real.indexOf(domInfos.relas[j].infos)==0) {
					fatherDim = domInfos.relas[j].dim;
					break;
				}
			}

			for (var j=0; j<domInfos.srcs.length; j++) {
				if (domInfos.srcs[j].selectType == 'field') continue;
				var infoObjj = cus.getInfosObj(domInfos.srcs[j].real);

				var td44 = $('<td class="srcs"></td>');
				row.append(td44);

				if (si.aggr == '') {
					//alert(si.real + "------------" + domInfos.srcs[j].real);

					if (fatherDim != '' && fatherDim == domInfos.srcs[j].name) {
						//td44.html("<img src='"+contextPath+guideConf.guideDir+"/img/guide/40.png' style='border:0;'/>");
					}
				} else {
					var dName = domInfos.srcs[j].name;
					var rela = domUtils.getRela(fName, dName);
					if (rela) {
						var div4 = $('<div style="float: left;color:blue;margin:0 10px 0 0;font-size:12px;" d="'+dName+'" f="'+fName+'"></div>');
						td44.append(div4);
						//var ri = cus.getInfosObj(rela.infos);
						var str = "";
						var infoss = new Array();
						cus.getDimInfos(infoObj.firstTable, infoObjj.dim, infoss, 0, false);
						for (var z=0; z<infoss.length; z++) {
							str += '<option value="'+infoss[z]+'"'+(infoss[z]==rela.infos?' selected':'')+'>'+cus.getInfosObj(infoss[z]).alias1+'</option>';
						}
						div4.append(str==""?"":('<select>'+str+'</select>'));
						//alert(div2.find( "select" ).length);
						div4.find( "select" ).css({'margin':'1px 0','border':'0','color':'#333333','padding':'1px'}).change(function(){
							var f = $(this).parent().attr('f');
							var d = $(this).parent().attr('d');
							var undo = "operations.status('" + domUtils.toString() + "')";
							//var r = cus.getInfosObj(v);
							domUtils.getRela(f, d).infos = this.value;
							domUtils.refresh();
							var redo = "operations.status('" + domUtils.toString() + "')";
							var oper = {undo:undo,redo:redo};
							operations.addOper(oper);
						});//.selectBoxIt();
						//var byj = cus.getInfosObj(rela.infos).alias1;
						//if (bys.indexOf(byj)==-1) bys[bys.length] = byj;
					} else {
						td44.append("&nbsp;");
						missing = true;
						//bys[bys.length] = "?";
					}
				}
			}

			//row.append(td2);


			hasError = (missing || (dimCount==0 && !sameTable) || (dimCount>0 && (infoObj.aggr == '' && fatherDim == '')) || (dimCount==0 && hasAggr && infoObj.aggr == ''));
			td1.css('text-align','center').html(hasError?"<img src='"+contextPath+guideConf.guideDir+"/img/guide/11.png' style=''/>":"&nbsp;");
			if ((dimCount==0 && !sameTable) || missing) {
				td1.attr('title',resources.guide.js59);
			} else if (dimCount>0 && (infoObj.aggr == '' && fatherDim == '')) {
				td1.attr('title',resources.guide.js60);
			}

			if (dimCount==0 && hasAggr && infoObj.aggr == '') {
				td1.attr('title',resources.guide.js61);
			}
			errorCells.push(td1);
		}

		if (colspan>0) {
			errorCells.push($('#errorTh'));
			for (var i=0; i<domInfos.wheres.length; i++){
				if (domInfos.wheres[i].type != 3) continue;

				var row = $('<tr seq="no" style="background-color:#E0E0E0;"></tr>');
				table.append(row);

				var wi = domInfos.wheres[i];

				var td1 = $('<td style="align:center;"></td>');
				row.append(td1);
				td1.html((domInfos.dims.length>0 || firstTable != wi.target)?"<img src='"+contextPath+guideConf.guideDir+"/img/guide/11.png' style=''/>":"&nbsp;");
				if (domInfos.dims.length>0) {
					td1.attr('title','error 464 ['+wi.target+']');
				}
				if (firstTable != wi.target) {
					td1.attr('title','error 635 ['+wi.target+']');
				}

				var td2 = $('<td style="text-align:center;"></td>');
				row.append(td2);
	 			var div2 = $('<div style=""></div>');
				td2.append(div2);
				var img1 = $('<span f="'+wi.target+'" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;"><img src="'+contextPath+guideConf.guideDir+'img/guide/13.png" style="border:0;margin-left:2px;"/></span>');
				img1.click(function(e){
					var f = $(this).attr('f');
					var undo = "operations.status('" + domUtils.toString() + "')";
					domInfos.wheres.remove(wi);
					var redo = "operations.status('" + domUtils.toString() + "')";
					var oper = {undo:undo,redo:redo};
					operations.addOper(oper);
					domUtils.refresh();
				});
				//div2.append('<img style="visibility:hidden;vertical-align:0px;cursor:pointer;float:right;margin:1px;" src="'+consts.relaPath + consts.imgFolder + consts.img29 + '">');
				//div2.append('<img style="visibility:hidden;vertical-align:0px;cursor:pointer;float:right;margin:1px;" src="'+consts.relaPath + consts.imgFolder + consts.img29 + '">');
				div2.append(img1);

				var td5 = $('<td colspan="'+(colspan+2)+'"></td>');
				row.append(td5);
	 			var div3 = $('<div t="'+wi.target+'" style="cursor:pointer;'+(wi.where!=''?'':'color:gray;')+'" title="'+(wi.where!=''?wi.whereDisp:resources.guide.js57)+'"><img style="vertical-align:-3px;margin:1px;cursor:pointer;" src="'+consts.relaPath + consts.imgFolder + consts.img34 + '">'+wi.where+'</div>');
				td5.append(div3);
				div3.click(function(e){
					var f = $(this).attr('f');
					var dlg = art.dialog({
						id : dialogCount++,
						title : resources.guide.js62,
					    content: '<textarea id="modifyWhere" style="width:450px;height:180px;margin:15px;" type="text">'+wi.where+'</textarea>'
					    ,ok : function() {
							var m = $('#modifyWhere');
					    	var n = $.trim(m.val());
					    	if (n == '') {
					    		if(confirm(resources.guide.js63)) {
									var undo = "operations.status('" + domUtils.toString() + "')";
									domInfos.wheres.remove(wi);
									var redo = "operations.status('" + domUtils.toString() + "')";
									var oper = {undo:undo,redo:redo};
									operations.addOper(oper);
									domUtils.refresh();
									return true;
					    		} else return false;
					    	}
					    	var undo = "operations.status('" + domUtils.toString() + "')";
							wi.where = n;
							var redo = "operations.status('" + domUtils.toString() + "')";
							var oper = {undo:undo,redo:redo};
							operations.addOper(oper);
							domUtils.refresh();
							return true;
					    }
					    ,cancel : true
					    ,okVal : resources.guide.js20
					    ,cancelVal : resources.guide.js21
					    ,lock : true
					    ,duration : 0
					    ,width : '500px'
						,height : '200px'
						,opacity : 0.1
						,padding : '2px 2px'
					});
				});
			}
		}

		var tdDom = $('#tableDiv').css('border','0').css('background','transparent');
		tdDom.html('');
		table.find('td').css('border','1px solid #E4E4E4').css('padding','0 5px').css('white-space','nowrap').css('overflow','hidden').css('word-break','keep-all');
		tdDom.append(tbody);
		$('#scrollll').remove();
		tdDom.attr('ct','background-color');
		tdDom.css('background-color', "");
		tdDom.attr('c1',"");
		tdDom.attr('c2',consts.color13);
		tdDom.attr('c3',consts.color14);
		if (dropDoms.indexOf(tdDom)==-1) dropDoms[dropDoms.length] = tdDom;
		if (descDim != '') {
			descDim = '<span style="">按&nbsp;</span>'+descDim+'<br><br><span style="">统计&nbsp;</span>';
			if (descField == '') descField = '<span style="font-size:16px;color:blue;">...</span>';
		} else {
			if (descField != '') {
				descField = '<span style="">查询&nbsp;</span>' + descField;
			}
		}
		tdDom.append('<div style="vertical-align:bottom;clear:both;padding:4px;">' + descDim + descField +'</div>');

		if (colspan>0) {
			errorCells.push($('#errorTh'));
		}
		if (!hasError) {
			for (var i=0; i<errorCells.length; i++){
				errorCells[i].css('display','none');
			}
		}

		table.find('tr[seq!="no"]').css('cursor','move').draggable({
			//revert:true
			//items: '> tr',
			//forcePlaceholderSize: true,
			helper: function(e) {
				var tr = $(this);
			    var originals = tr.children();
			    var helper = tr.clone();
			    helper.children().each(function(index){
			      // Set helper cell sizes to match the original sizes
			      $(this).width(originals.eq(index).width());
			    });
			    return helper;
			}
			//,axis:"y"
			,drag:function(e, ui){
				//alert(e.pageY);
				var trs = table.find('tr');
				if (trs.length == 3) return;
				var poses = [];
				var seqs = [];
				//alert(ui);
				var y = $(trs[trs.length-1]).offset().top;
				var seq = $(trs[trs.length-1]).attr('seq');
				var ps = "";
				var height = 0;
				for (var z=1; z<trs.length-1; z++) {
					var seqz = $(trs[z]).attr('seq');
					//if (seqz == seq) continue;
					if ((seq<100 && seqz>=100) || (seqz<100 && seq>=100)) continue;
					poses.push($(trs[z]).offset().top);
					height = $(trs[z]).height();
					seqs.push(seqz);
				}
				poses.push(poses[poses.length-1]+height);

				var insertPos = -1;
				for (var i=1; i<poses.length; i++) {
					if (y<poses[i]) {
						insertPos = i-1;
						break;
					}
				}
				if (insertPos == -1) insertPos = poses.length-1;

				var rseq = seq%100;
				var p = $("#insertPic");
				if (p.length == 0) {
					p = $('<img show=1 id="insertPic" src="'+consts.relaPath + consts.imgFolder + consts.img31 + '" style="display:none;position:absolute;z-index:10002;border:0;" />');
					$('body').append(p);
				}
				if (insertPos == rseq || (insertPos == (rseq+1))) {
					p.css('display','none').attr('show','0');
					return;
				}
				p.css('top',poses[insertPos]-10+'px').css('left','460px').css('display','block').attr('insertPos',insertPos).attr('seq',seq).attr('show','1');


				//alert(ps + "--" + seq);

			}
			,stop:function(e, ui){
				//alert(table.find('tr').length);
				var p = $("#insertPic");
				if (p.length == 1 && p.attr('show') == 1) {
					var seq = p.attr('seq');
					var insertPos = parseInt(p.attr('insertPos'));
					var arr = domUtils.getDims();
					var seqPos = seq;
					if (seq>=100) {
						arr = domUtils.getFields();
						insertPos += domUtils.getDims().length;
						seqPos = seq%100 + domUtils.getDims().length;
					}
					var curr = arr[seq%100];
					domInfos.srcs[seqPos] = "hold";
					domInfos.srcs.splice(insertPos,0,curr);
					//domInfos.srcs.splice(domInfos.srcs.indexOf("hold"),1);
					domInfos.srcs.remove("hold");
					p.remove();
					setTimeout("domUtils.refresh();",1);
				}
				return ui;
			}
			/*
			start:function(e, ui){
		       ui.helper.css({"background":"#fff"})     //拖动时的行，要用ui.helper
		       return ui;
			},
*/
		});

		var can = fieldCount > 0;
		$('#queryBut').attr('disabled', !can);
		$('#txtDownloadBut').attr('disabled', !can);
		//can = fieldCount > 0;
		$('#saveLocalBut').attr('disabled', !can);

	}
}

//$.extend( domUtils, domUtils2 );

function transWhereInfo(infos, dimFieldName, isHaving, firstTable,calcExp) {
	var iObj;
	if(infos instanceof Array){
		for(var i = 0 ; i < infos.length; i++){
			var infoi = infos[i];
			var iObj_i = cus.getInfosObj(infoi);
			if(firstTable == null || iObj_i.firstTable == firstTable){
				iObj = iObj_i;
				break;
			}
		}
	}else iObj = cus.getInfosObj(infos,calcExp);
	var disp = iObj.alias1;
	//alert(infos+"-------"+iObj.expNoTable+"------"+iObj.expNoTableNoAggr);
	if (dimFieldName) disp = dimFieldName;
	//(type==3?"":("."+(type==1?iObj.expNoTableNoAggr:iObj.expNoTable))));

	var fObj = mdUtils.getField(iObj.lastTable,iObj.lastField);
	var edit = fObj.edit;

	var useTreeDisp = false;
	if(edit==""||!edit){
//		if( isGlmd ){
//			if(iObj.finalType == 91 || iObj.finalType == 92 || iObj.finalType == 93 ) edit = iObj.finalType==91?"_date":(iObj.finalType==2?"_time":"_nyrsfm");
//		}else{
			if ( iObj.finalType>=3 ) edit = iObj.finalType==3?"_date":(iObj.finalType==4?"_time":"_nyrsfm");//{type:3,calendarType:(iObj.finalType==3?2:(iObj.finalType==4?3:1))};
			else if (iObj.dim != '') edit = iObj.dim;
			else{
				var dimObj = mdUtils.getDimByTable(iObj.lastTable);
				if (dimObj) {
					if (dimObj.item && dimObj.item.disp == iObj.lastField) {
						//2017/05/23注释，忘了以前为啥这样做省

						//edit = dimObj.name;
						//useTreeDisp = true;
					}
				}
			}
		//}
	}
	//useTreeDisp = true;
	return {disp:disp,dataType:iObj.finalType,useTreeDisp:useTreeDisp,edit:edit,exp:dimFieldName?"_dimFieldName_":(isHaving?iObj.expNoTable:iObj.expNoTableNoAggr)}
}



function finalWhere(f, isHaving) {
	var wDom = domUtils.getWhere(f);
	currWhereField = wDom;
	var fDom = domUtils.getSrc(f);
	var iObj = cus.getInfosObj(fDom.real);
	var fields = [];
	var initField = fDom.real;
	// {disp:'',dataType:'',edit:{type:3,calendarType:2},exp:'',valueType:1真实值 显示值/2维名称,values:''}   {type:3,calendarType:(iObj.finalType==3?2:(iObj.finalType==4?3:1))};
	var dimField = null;
	if (fDom.selectType == 'dim') {
		fields[0] = transWhereInfo(fDom.real,fDom.name,false);//fDom.real;
		initField = fields[0];
		dimField = true;
	} else {
		if (isHaving) {
			fields[0] = transWhereInfo(fDom.real,null,true);//fDom.real;
			initField = fields[0];
		} else {
			cus.getFieldInfos(iObj.firstTable, fields, 0, null, null,true);
			for (var i=0; i<fields.length; i++) fields[i] = transWhereInfo(fields[i],null,false);
			if (iObj.aggr != '') {
				initField = fDom.real.substring(0,fDom.real.lastIndexOf(split_2));
			}
			initField = transWhereInfo(initField,null,false);
			//var idx = initField.lastIndexOf(split_1);
			//if (idx == initField.length-split_1.length) initField = initField.substring(0,initField.lastIndexOf(split_1));
			//alert(initField);
		}
	}

	var saveFunc = function () {
	 	var disp = whereUtils.getDisp(cache.where.wheres);
	 	if (disp == '') return false;

	 	var undo = "operations.status('" + domUtils.toString() + "')";
	 	if (isHaving) currWhereField.havingConf = cache.where.wheres;
	 	else if (dimField != null) currWhereField.dimConf = cache.where.wheres;
	 	else currWhereField.conf = cache.where.wheres;
	 	currWhereField.where = '';
		domUtils.refresh();
		var redo = "operations.status('" + domUtils.toString() + "')";
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		return true;
     };
     var clearFunc = function () {
		var undo = "operations.status('" + domUtils.toString() + "')";
	 	if (isHaving) currWhereField.havingConf = [];
	 	else if (dimField != null) currWhereField.dimConf = [];
	 	else currWhereField.conf = [];
	 	currWhereField.where = '';
		domUtils.refresh();
		var redo = "operations.status('" + domUtils.toString() + "')";
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
        return true;
    }
    whereUtils.openWhereDialog(saveFunc,clearFunc);

	whereUtils.refresh(fields, initField, JSON.parse(JSON.stringify(isHaving?wDom.havingConf:(dimField==null?wDom.conf:wDom.dimConf))));
}

var currWhereField4Having = false;

/*
esCalc接口
	setDBName
	initPage
	generateLglSql
	getFieldAttrs
	getSaveStr()
	operations.redo()
	operations.undo()
	operations.canUndo()
	operations.canRedo()
	switchEditMode()
	getEditMode() return:1拖拽模式 0DQL编辑模式
*/

var status = 0;

var operations = {
	currHis : 0,
	//元素是{undo:'',redo:''}
	histories : new Array(),
	clear : function() {
		operations.currHis = 0;
		operations.histories = new Array();
		operations.refreshButs();
	},
	undo : function() {
		if (!operations.canUndo()) return;
		//if ($('#undoBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
		operations.currHis--;
		//alert(operations.histories[operations.currHis].undo);
		//domUtils.set(operations.histories[operations.currHis].undo);
		eval(operations.histories[operations.currHis].undo);
		operations.refreshButs();
	},
	redo : function() {
		if (!operations.canRedo()) return;
		//if ($('#redoBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
		//domUtils.set(operations.histories[operations.currHis].redo);
		eval(operations.histories[operations.currHis].redo);
		operations.currHis++;
		operations.refreshButs();
	},
	refreshButs : function() {
		var canu = operations.canUndo()==1;
		var canr = operations.canRedo()==1;
		$('#undoBut').attr('disabled', !canu);
		$('#redoBut').attr('disabled', !canr);
		//if (escalc) document.title='02';
		return true;
	},
	addOper : function(oper) {
		for (var i=operations.histories.length-1; i>=operations.currHis; i--) {
			operations.histories.remove(operations.histories[i]);
		}
		operations.currHis++;
		operations.histories[operations.histories.length] = oper;
		operations.refreshButs();
	},
	canUndo : function() {
		return operations.currHis > 0?1:0;
	},
	canRedo : function() {
		return operations.currHis < operations.histories.length?1:0;
	},
	status : function(str) {
		domUtils.set(str);
		//domInfos = eval("("+str+")");
		domUtils.refresh();
	},
	//字段拖拽排序
	reOrderField : function(orders, flag) {
		domUtils.reOrder(orders, flag);
	},
	//修改字段别名
	modifyFieldAlias : function(row, newAlias) {
		domUtils.setFieldName(row, newAlias, true);
	},
	modifyCalc : function(idx, name, exp) {
		domUtils.modifyCalc(idx, name, exp);
	},
	//选出/不选出字段
	selectOut : function(row, flag) {
		domUtils.setSelectOut(row, flag, true);
	},
	setFieldOrder : function(row, order) {
		domUtils.setOrder(row, order);
	},
	setFieldFormat : function(idx, format, useDisp) {
		domUtils.setFieldFormat(idx, format, useDisp);
	},
	reOrderTable : function(tables) {
		domUtils.reOrderTable(tables);
	},
	//设置附表、连接方式
	setTableInfo : function(tAlias, annexT, joinType) {
		domUtils.setTableInfo(tAlias, annexT, joinType);
	},
	//改变维层
	changeDimLevel : function(row, level) {
		domUtils.setLevel(row, level, true);
	},
	changeFieldAggr : function (row, aggr) {
		domUtils.setAggr(row, aggr, true);
	},
	//改变维的by字段
	changeByField : function(alias, info, tAlias) {
		domUtils.removeBy(tAlias, alias);
		if (info != '') domUtils.addBy(tAlias, alias, info);
		domUtils.refresh();
	},
	reOrderBy : function(orderStr) {
		domUtils.reOrderBy(orderStr);
	},
	//
	a : function() {

	},
	b : function() {

	}

}


var timeDiffer = 0;//服务器时间毫秒数-前段时间毫秒数

var canvas = null;

/*
	type为数据类型1、数字；2、字符串；3、日期；4、时间；5、日期时间。
	edit为编辑风格。默认：根据数据类型数字、字符串为_txt；日期为_calendar；。
*/
var maxId = 0;
var zNodes = null;
var subZNodes = null;
var currField = null;
var treeDrag = null;
var zIndexCount = 1000;

var lmd = null;
var treeObjs = [];
var confTmp = '';

var consts = {
	relaPath : contextPath+guideConf.guideDir,
	imgFolder : '/img/dl/',
	color1 : '#373636',//大部分字体颜色
	color2 : '#FFFFFF',
	color3 : '#F0F2F4',//弹出窗口按钮区域背景色
	color4 : '#91A3CA',//弹出窗口中确定按钮的边框
	color5 : '#4A5E97',//弹出窗口中确定按钮的字色
	color6 : '#AEAEAE',//弹出窗口中取消按钮的边框
	color7 : '#DFE5EB',//设置条件弹出窗口表头背景色
	color8 : '#BFC2C6',//表格线颜色
	color9 : '#494A4B',//表头字颜色
	color10 : '#A5ACB5',//区域边框色
	color11 : '#D1DCED',//查询按钮背景色
	color12 : '#DDDDDD',//右侧字段列表中，字段之间的边框线
	color13 : '#0000CC',//拖拽字段允许落选区域的背景色。
	color14 : '#FFFF88',//拖拽字段落选区域的背景色。
	color15 : '#456685',//弹出窗口标题背景色
	color16 : '#BFBDC4',//BY,ON关系箭头颜色
	color17 : '#FCDE81',//选中字段行的背景色
	color18 : '#FBF8FB',//不同表区之间的间隔背景色。
	color19 : '#A8EDF3',//结果集表头中，on字段的背景色。
	color20 : '#D9D9D9',//操作表头格子背景色
	color21 : '#E5E6E8',//操作格子背景色
	color22 : '#373636',//文本框，下拉框里面的字体颜色
	color23 : '#373636',//资源区字段字体颜色
	color24 : '#',
	img1 : 'split_h.png',
	img2 : 'split_v.png',
	img3 : 'bg_banner.jpg',
	img4 : 'banner_left.jpg',
	img5 : 'banner_right.jpg',
	img6 : 'tr.png',
	img7 : 'tab.png',
	img8 : 'tab-1.png',
	img9 : 'tab-2.png',
	img10 : 'tab-3.png',
	img11 : 'up2.png',
	img12 : 'down2.png',
	img13 : 'tab-split.png',
	img14 : 'item.png',
	img15 : 'open.png',
	img16 : 'close.png',
	img17 : 'blank.png',
	img18 : 'fk.png',
	img19 : 'pk.png',
	img20 : 'copy.png',
	img21 : 'delete.png',
	img22 : 'result_dim.png',
	img23 : 'result_field.png',
	img24 : 'calc_field.png',
	img25 : 'open_locator.png',
	img26 : 'item-dim.png',
	img27 : 'item-subtable.png',
	img28 : 'tab-4.png',
	img29 : 'to-del.png',
	img30 : 'to-left.png',
	img31 : 'to-right.png',
	img32 : 'to-up.png',
	img33 : 'to-down.png',
	img34 : 'sql-where.png',
	img35 : 'sql-having.png',
	img36 : ''
}

/*

		var zNodes =[
			{ id:1, pId:0, name:"展开、折叠 自定义图标不同", open:true, iconOpen:"../../../css/zTreeStyle/img/diy/1_open.png", iconClose:"../../../css/zTreeStyle/img/diy/1_close.png"},
			{ id:11, pId:1, name:"叶子节点1", icon:"../../../css/zTreeStyle/img/diy/2.png"},
			{ id:12, pId:1, name:"叶子节点2", icon:"../../../css/zTreeStyle/img/diy/3.png"},
			{ id:13, pId:1, name:"叶子节点3", icon:"../../../css/zTreeStyle/img/diy/5.png"},
			{ id:2, pId:0, name:"展开、折叠 自定义图标相同", open:true, icon:"../../../css/zTreeStyle/img/diy/4.png"},
			{ id:21, pId:2, name:"叶子节点1", icon:"../../../css/zTreeStyle/img/diy/6.png"},
			{ id:22, pId:2, name:"叶子节点2", icon:"../../../css/zTreeStyle/img/diy/7.png"},
			{ id:23, pId:2, name:"叶子节点3", icon:"../../../css/zTreeStyle/img/diy/8.png"},
			{ id:3, pId:0, name:"不使用自定义图标", open:true },
			{ id:31, pId:3, name:"叶子节点1"},
			{ id:32, pId:3, name:"叶子节点2"},
			{ id:33, pId:3, name:"叶子节点3"}

		];

		$.fn.zTree.init($("#contentDiv"), {
			data: {
				simpleData: {
					enable: true
				}
			}
		}, zNodes);
*/

var currIndex = 0;
var zNodes = [];
var expendNodes = [];
var treeObj = null;
var existTables = [];
var generateFieldsCounter = 0;
function generateFields(tables,onlyPks) {
	if (lmd == null) return;
	generateFieldsCounter++;
	if (guideConf.fixedTable.length>0) {
		if ((!tables) || tables.length==0) {
			tables = clone(guideConf.fixedTable);
		} else {
			for (var i=tables.length-1; i>=0; i--) {
				if (guideConf.fixedTable.indexOf(tables[i]) == -1) tables.remove(tables[i]);
			}
		}
		onlyPks = false;
	}

	//console.log(guideConf.fixedTable);
	//console.log(tables);
	var showAggr = true;

	var fs = new Array();
	var ts = new Array();
	var fAlias = new Array();
	var faOrder = new Array();
	var tAlias = new Array();
	var tDescs = new Array();
	var fDescs = new Array();
	var showDim = 1;//$('#fieldShowDim')[0].value == '1';
	var showPK = 1;//$('#fieldShowPK')[0].value == '1';
	currIndex = 0;
	zNodes = [];
	existTables = [];
	var lmdtables = mdUtils.getTables();
	for (var i=0; i<lmdtables.length; i++) {
		if (lmdtables[i].fields.length==1) continue;
		if (lmdtables[i].hide == 1) continue;
		var t = lmdtables[i].name;
		var ta = lmdtables[i].dispName;
		var onlyPk = 0;
		if (tables && tables.length>0) {
			var idx = tables.indexOf(t);
			if (idx==-1) continue;
			onlyPk = onlyPks[idx];
		}

		var show = mdUtils.classContain($('#classTableSelect').val(),t,null,null);
		if (!show) continue;
		if (existTables.indexOf(t)>=0) continue;


		var ts = mdUtils.getAnnexTables(t);
		if (!ts) {
			ts = new Array();
			ts[0] = {name:t,pks:[]};
		}
		var tNames = "";
		var dispNames = "";
		for (var j=0; j<ts.length; j++) {
			var currTable = mdUtils.getTable(ts[j].name,true);
			if (!currTable) continue;
			if (currTable.hide == 1) continue;
			var tj = currTable.name;
			if (!mdUtils.classContain($('#classTableSelect').val(),tj,null,null)) continue;
			var taj = currTable.dispName;
			if (tNames.length > 0) {
				tNames += ",";
				dispNames += ",";
			}
			tNames += tj;
			if (!taj || taj == '') taj = tj;
			dispNames += taj;
			existTables[existTables.length] = tj;
		}
		if (dispNames == '') continue;
		if (dispNames.length>20) dispNames = dispNames.substring(0,20)+"...";
		currIndex++;
		zNodes[zNodes.length] = {id:currIndex, isParent:true, pId:0, name:dispNames, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/2.png",infos:t,destTable:t,tName:'',fName:'',load:false,onlyPk:onlyPk}
	}

	var treeDiv = $('#contentDiv');
	if (guideConf.view == 'olap') {
		$.fn.zTree.init(treeDiv, {
			edit: {
				enable: true,
				showRemoveBtn: false,
				showRenameBtn: false,
				drag: {
					prev: false,
					next: false,
					inner: false
				}
			},
			data: {
				keep: {
					parent: true,
					leaf: true
				},
				simpleData: {
					enable: true
				}
			},
			callback: {
				onClick: function(event, treeId, treeNodes){
					if(treeNodes.calc){//计算字段
						aly.calcField.init(treeNodes.name,treeNodes.tName);
						$(event.target).powerFloat({target:$('#calcFieldFloat'),eventType:'click',zIndex:50000});
					}
					return true;
				},
				onDrag : function(event, treeId, treeNodes){
					//alert(treeNodes[0].infos);
					var aObj = $('.zTreeDragUL').find("#" + treeNodes[0].tId + "_a");
					if (aObj.length>0) {
						$('.zTreeDragUL li').html(aObj.attr('disp'));
						var infos = treeNodes[0].infos;

						$('.zTreeDragUL').attr('iType','5').css('z-index',30000).attr('infos',infos);
					}

				}
				,beforeDrag: function(treeId, treeNodes) {
					var iObj = cus.getInfosObj(treeNodes[0].infos,(treeNodes[0].calc != null && treeNodes[0].calc.length > 0 ) ? treeNodes[0].calc : null);
					/*
					if (iObj.subTable != '') {
						var aObj = $("#" + treeNodes[0].tId + "_a");
						var aggr = aObj.attr('aggr');
						if (aggr == '') return false;
					}
					*/
					if (aly.cache.doms.div1 && iObj.dim != ''){
						aly.cache.doms.div1.bind('mouseover',function(){
							aly.cache.doms.div1.find('#placeHolders').css('display','block');
						}).bind('mouseout',function(){
							aly.cache.doms.div1.find('#placeHolders').css('display','none');
						});
					}
					if (aly.cache.doms.div2 && iObj.dim != ''){
						aly.cache.doms.div2.bind('mouseover',function(){
							aly.cache.doms.div2.find('#placeHolders').css('display','block');
						}).bind('mouseout',function(){
							aly.cache.doms.div2.find('#placeHolders').css('display','none');
						});
					}
					if (aly.cache.doms.div3){
						aly.cache.doms.div3.bind('mouseover',function(){
							aly.cache.doms.div3.find('#placeHolders').css('display','block');
						}).bind('mouseout',function(){
							aly.cache.doms.div3.find('#placeHolders').css('display','none');
						});
					}
					for (var i=0; i<aly.cache.doms.divs.length; i++) {
						aly.cache.doms.divs[i].bind('mouseover',function(){
							$(this).attr('sel',1).css('background-color','#FFFF88');
						}).bind('mouseout',function(){
							$(this).attr('sel',0).css('background-color','');
						});
					}
					return true;//!treeNodes[0].isParent;
				}
				,onDrop: function(e, treeId, treeNodes, targetNode, moveType) {
					var divsi = null;
					if (aly.cache.doms.divs.length>0) {
						for (var i=0; i<aly.cache.doms.divs.length; i++) {
							var di = aly.cache.doms.divs[i];
							if (di.attr('sel') == 1) {
								//console.log("divsi bc : "+di.css('background-color'));
								divsi = di;
								di.css('background-color','');
							}
							di.unbind('mouseover').unbind('mouseout');
						}
					}
					var pos = '';
					if (aly.cache.doms.div1){
						aly.cache.doms.div1.unbind('mouseover').unbind('mouseout');
						//alert(aly.cache.doms.div1.find('#placeHolders').css('display'));
						if (aly.cache.doms.div1.find('#placeHolders').css('display') == 'block'){
							pos = 'top';
						}
						aly.cache.doms.div1.find('#placeHolders').css('display','none');
					}
					if (aly.cache.doms.div2){
						aly.cache.doms.div2.unbind('mouseover').unbind('mouseout');
						//alert(aly.cache.doms.div2.find('#placeHolders').css('display'));
						if (aly.cache.doms.div2.find('#placeHolders').css('display') == 'block'){
							pos = 'left';
						}
						aly.cache.doms.div2.find('#placeHolders').css('display','none');
					}
					if (aly.cache.doms.div3){
						aly.cache.doms.div3.unbind('mouseover').unbind('mouseout');
						//alert(aly.cache.doms.div3.find('#placeHolders').css('display'));
						if (aly.cache.doms.div3.find('#placeHolders').css('display') == 'block'){
							pos = 'field';
						}
						aly.cache.doms.div3.find('#placeHolders').css('display','none');
					}

					if (pos == '' && divsi == null) return;

					var conf = aly.getCurrRpx();
					var ss = new Array();
					if (treeNodes[0].level == 0) {
						//return;
						for (var z=0; z<treeNodes[0].children.length; z++) {
							ss[z] = treeNodes[0].children[z].infos;
							ss[z].calc = treeNodes[0].children[z].calc;
						}
					} else {
						var aObj = $("#" + treeNodes[0].tId + "_a");
						ss[0] = treeNodes[0].infos;
						//ss[0] = ss[0] + split_2 + Math.random();
					}
					//2018.12.24
					var aSrcs = cus.autoSrcs(ss);
					for (var z=0; z<ss.length; z++) {
						var iiObj = cus.getInfosObj(ss[z]);
						if (pos != 'field' && iiObj.dim == '' && conf.type==1) return;
						var aggr = '';//aObj.attr('aggr');
						if (aggr == '' && divsi == null)
						{
							if (iiObj.finalType == 1) aggr = 'sum';
							else aggr = 'count';
						}
						//alert(aggr);
						var name = cus.generateNewFieldAlias(cus.getInfosObj(ss[z]));
						//if (aggr != '') {
						//	var iObj = cus.getInfosObj(ss[0]);
						//	ss[0] = iObj.str + split_2 + iObj.lastTable + split_1 + iObj.lastField + split_1 + split_1 + aggr;
						//}
						var edit = iiObj.dim;
						edit = defaultEdit.getEditStyle(edit);
						edit = edit==null?"":edit.name;
						var idx = -1;
						var macroName = '';
						if (divsi != null) {
							idx = divsi.attr("idx");
							macroName = divsi.attr("macroName");
						}
						
						var newItem = {
							autoSrc: aSrcs.autoSrcs[z]
							,name : ''
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
						}
						if(treeNodes[0].children != null){
							if(treeNodes[0].children[z].calc) newItem.calc = treeNodes[0].children[z].calc;
						}
						else if(treeNodes[z] != null && treeNodes[z].calc) newItem.calc = treeNodes[z].calc;
						if (divsi != null) {
							conf.fields[idx] = newItem;
						} else if (pos == 'top'){
							conf.tops.push(newItem);
						} else if (pos == 'left') {
							conf.lefts.push(newItem);
						} else if (pos == 'field') {
							conf.fields.push(newItem);
						}
					}
					aly.refresh();
					return;
				}
				//onMouseUp: MoveTest.dom2Tree
				,onExpand : function(event, treeId, treeNode){
					if (expendNodes.indexOf(treeNode.infos)==-1) {
						//alert(treeNode.infos);
						expendNodes[expendNodes.length] = treeNode.infos;
					}
					//alert(treeNode.children.length + "--------"  + treeNode.infos);
					if (treeNode.children) {
						for (var i=0; i<treeNode.children.length; i++) {
							if (expendNodes.indexOf(treeNode.children[i].infos)>=0)
								treeObj.expandNode(treeNode.children[i], true, false, false, true);
						}
					}
				}
				,onCollapse : function(event, treeId, treeNode) {
					expendNodes.remove(treeNode.infos);
				}
				,beforeExpand : function(treeId, treeNode){
					if (!treeNode.load) loadSub(treeNode);
					return true;
				}
				,onDragMove : function(e, treeId, treeNodes) {
					//aly.cache.doms = {div1:div1,div2:div2,div3:div3};
					//if ()
					//{
					//}
					var p = null;
					if (e.target.id == 'tableDiv') {
						p = $(e.target);
					} else {
						p = $(e.target).parent('#tableDiv');
						if (!p.get(0)) {
							p = null;
						}
					}

					$('#tableDiv').css('background-color',$('#tableDiv').attr('c1'));
					if (p) {
						p.css('background-color',p.attr('c3'));
					}
				}
			},
			view: {
				selectedMulti: false
				,nameIsHTML: true
				,fontCss: function(treeId, node) {
					return node.font ? node.font : {};
				}
				,addHoverDom : function(treeId, treeNode) {
					return;
				}
				,removeHoverDom:function(treeId, treeNode) {
					//if (treeNode.parentTId && treeNode.getParentNode().id!=1) return;
					var aggrs = ["sum","max","min","avg","count","countd"];
					for (var i=0; i<aggrs.length; i++) {
						if ($("#diyBtn_"+aggrs[i]+"_"+treeNode.id).length > 0) {
							$("#diyBtn_"+aggrs[i]+"_"+treeNode.id).remove();
						}
					}
				}
			}
		}, zNodes);
		var addBut = $('<img src="'+contextPath+guideConf.guideDir+'/img/guide/9.png" style="cursor:pointer;margin:4px 2px;" title="'+resources.guide.js130+'">');
		treeDiv.append(addBut);
		addBut.click(function(){
			aly.editCalcField(null,function(){
				aly.refresh(true,true);
			});
		});
	} else {
		$.fn.zTree.init(treeDiv, {
			edit: {
				enable: true,
				showRemoveBtn: false,
				showRenameBtn: false,
				drag: {
					prev: false,
					next: false,
					inner: false
				}
			},
			data: {
				keep: {
					parent: true,
					leaf: true
				},
				simpleData: {
					enable: true
				}
			},
			callback: {
				onDrag : function(event, treeId, treeNodes){
					//alert(treeNodes[0].infos);
					var aObj = $('.zTreeDragUL').find("#" + treeNodes[0].tId + "_a");
					if (aObj.length>0) {
						$('.zTreeDragUL li').html(aObj.attr('disp'));
						var infos = treeNodes[0].infos;

						$('.zTreeDragUL').css('z-index',30000).attr('infos',infos);
					}

				}
				,beforeDrag: MoveTest.dragTree2Dom
				,onDrop: MoveTest.dropTree2Dom
				//onMouseUp: MoveTest.dom2Tree
				,onExpand : function(event, treeId, treeNode){
					if (expendNodes.indexOf(treeNode.infos)==-1) {
						//alert(treeNode.infos);
						expendNodes[expendNodes.length] = treeNode.infos;
					}
					//alert(treeNode.children.length + "--------"  + treeNode.infos);
					if (treeNode.children) {
						for (var i=0; i<treeNode.children.length; i++) {
							if (expendNodes.indexOf(treeNode.children[i].infos)>=0)
								treeObj.expandNode(treeNode.children[i], true, false, false, true);
						}
					}
				}
				,onCollapse : function(event, treeId, treeNode) {
					expendNodes.remove(treeNode.infos);
				}
				,beforeExpand : function(treeId, treeNode){
					if (!treeNode.load) loadSub(treeNode);
					return true;
				}
				,onDragMove : MoveTest.dragMove
			},
			view: {
				selectedMulti: false
				,nameIsHTML: true
				,fontCss: function(treeId, node) {
					return node.font ? node.font : {};
				}
				,addHoverDom : function(treeId, treeNode) {

					var aObj = $("#" + treeNode.tId + "_a");
					var liObj = $("#" + treeNode.tId);
					$("#" + treeNode.tId + "_span").bind('mousedown',function(){
						aObj.attr('aggr','').attr('disp',$("#" + treeNode.tId + "_span").html());
					});
					$("#" + treeNode.tId + "_ico").bind('mousedown',function(){
						aObj.attr('aggr','').attr('disp',$("#" + treeNode.tId + "_span").html());
					});


					var infos = treeNode.infos;
					if (!infos) return;
					var iObj = cus.getInfosObj(infos);
					if (iObj.lastField == '') return;
					if (iObj.aggr != '') return;
					if (guideConf.queryType == 'detail' && guideConf.showSubTable=='yes' && iObj.subTable == '') return;

					var aggrs = [];
					//console.log(iObj.lastTable + "----" + iObj.lastField);
					var fieldObj = mdUtils.getField(iObj.lastTable, iObj.lastField,true);
					if (fieldObj == null)  return;
					if (fieldObj.type == 1) {
						aggrs[aggrs.length] = {aggr:'sum',name:resources.guide.js6,aliases:''};
						aggrs[aggrs.length] = {aggr:'avg',name:resources.guide.js11,aliases:''};
					}
					aggrs[aggrs.length] = {aggr:'count',name:resources.guide.js7,aliases:''};
					aggrs[aggrs.length] = {aggr:'max',name:resources.guide.js10,aliases:''};
					aggrs[aggrs.length] = {aggr:'min',name:resources.guide.js9,aliases:''};
					aggrs[aggrs.length] = {aggr:'countd',name:resources.guide.js8,aliases:''};

					if (aggrs.length>0) {
						for (var i=0; i<aggrs.length; i++) {
							if ($("#diyBtn_"+aggrs[i].aggr+"_"+treeNode.id).length>0) return;
							var bold = selectedFields.indexOf(infos+split_2+iObj.lastTable+split_1+iObj.lastField+split_1+iObj.lastLevel+split_1+aggrs[i].aggr)>=0?"bold":'normal';
							var editStr = $("<a id='diyBtn_"+aggrs[i].aggr+"_" +treeNode.id+ "' style='padding:1px 3px;font-weight:"+bold+";'>"+getAggrName(aggrs[i].aggr)+"</a>");
							aObj.append(editStr);
							editStr.bind("mousedown", function(){
								//alert();
								var aggr = $(this).attr('id').split('_');
								aggr = aggr[1];
								aObj.attr('aggr',aggr).attr('disp',$("#" + treeNode.tId + "_span").html()+" "+getAggrName(aggr));
							});
						}
					}
				}
				,removeHoverDom:function(treeId, treeNode) {
					//if (treeNode.parentTId && treeNode.getParentNode().id!=1) return;
					var aggrs = ["sum","max","min","avg","count","countd"];
					for (var i=0; i<aggrs.length; i++) {
						if ($("#diyBtn_"+aggrs[i]+"_"+treeNode.id).length > 0) {
							$("#diyBtn_"+aggrs[i]+"_"+treeNode.id).remove();
						}
					}
				}
			}
		}, zNodes);
	}
	treeObj = $.fn.zTree.getZTreeObj("contentDiv");
	var nodes = treeObj.getNodes();
	for (var i=0; i<nodes.length; i++) {
		//2017/11/16
		try {
			if (guideConf.treeStatus != 'close') guideConf.treeStatus = 'open';
		} catch(e) {guideConf.treeStatus = 'open';}
		if (guideConf.treeStatus=="open") treeObj.expandNode(nodes[i], true, false, false, true);
	}
	//var nodes1 = treeObj1.getNodes();
	//if (nodes1.length>0) {
	//	treeObj1.selectNode(nodes1[nodes1.length-1]);
	//}

	var showT = ($('#fieldShowStyle').val() == resources.guide.js64 || guideConf.view=='olap');
	if (!showT) {
		var ns = treeObj.getNodes();
		var nodes = [];
		for (var i=0; i<ns.length; i++) {
			nodes[i] = ns[i];
		}

		var allChilds = [];
		for (var i=0; i<nodes.length; i++) {
			var cs = nodes[i].children;
			//alert(nodes[i].name);
			if (cs) {
				var childs = [];
				for (var j=0; j<cs.length; j++) {
					childs[j] = cs[j];
					allChilds[allChilds.length] = cs[j];
				}
				for (var j=0; j<childs.length; j++) {
					treeObj.moveNode(null, childs[j], "inner");
					var tObj = mdUtils.getTable(childs[j].tName);
					var alias = tObj.dispName;
					if (alias=='' || !alias) alias = childs[j].tName;
					var span = $(treeDiv.find('#'+childs[j].tId + "_span")[0]);
			   		span.html(span.html() + "[" + alias + "]");
					//treeObj.updateNode(childs[j]);
				}
			} else {
				//alert(nodes[i].name);
			}
			//alert(nodes.length);
			treeObj.removeNode(nodes[i]);
		}
		if (guideConf.reSort != 'no') allChilds.sort(sortBy("name"));
		for (var i=0; i<allChilds.length; i++) {
			treeObj.moveNode(null, allChilds[i], "inner");
		}
	}

	var nodes = treeObj.getNodes();
	for (var i=0; i<nodes.length; i++) {
		if (expendNodes.indexOf(nodes[i].infos)>=0 && !nodes[i].open) {
			treeObj.expandNode(nodes[i], true, false, false, true);
		}
	}

	/*
	var ns = treeObj.transformToArray(nodes);
	for (var i=0; i<ns.length; i++) {
		if (expendNodes.indexOf(ns.infos)>=0) {
			treeObj.expandNode(ns[i], true, false, false, true);
		}
	}
	*/
}


//infos, table, levels, nodes
function loadSub(node){
	var infos = node.infos;
	var tName = node.tName;
	var destTable = node.destTable;
	var fName = node.fName;
	var pId = node.id;
	node.load = true;
	var fObj = null;
	var classTable = $('#classTableSelect').val();
	var showT = $('#fieldShowStyle').val()==resources.guide.js64 || guideConf.view=='olap';
	if (fName && fName!=''){
		//alert(fName);
		//alert(tName + "---" + fName);
		fObj = mdUtils.getField(tName, fName,true);
		if (fObj == null) fObj = mdUtils.getFK(tName, fName);
		var destLevels = mdUtils.getFieldDestLevels(fObj);
		if (destLevels && destLevels.length>0) {
			for (var i=0; i<destLevels.length; i++) {
				//var destDim = mdUtils.getDimByTableField(fObj.destLevels[i].dest);
				var namei = destLevels[i].name;
				var tName1 = destLevels[i].dest.split(".")[0];
				var fName1 = destLevels[i].dest.split(".")[1];
				var infos1 = infos + split_2 + tName1 + split_1 + fName1 + split_1 + destLevels[i].name;
				currIndex++;
				var font1 = null;
				if (selectedFields.indexOf(infos1)>=0){
					font1 = {'font-weight':'bold'};
				}
				var isParent = mdUtils.getShowFields(classTable,tName1).length>1;
				var n = treeObj.addNodes(node, [{id:currIndex, isParent:isParent, pId:pId, name:namei, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/3.png",infos:infos1,destTable:tName1,tName:'',fName:'',load:false,font:font1}], true);
				if (isParent && expendNodes.indexOf(infos1)>=0) {
					loadSub(n);
					//treeObj.expandNode(n[0], true, false, false, false);
				}
			}
		}
		/*
		if (fObj.aggrs) {
			if (fObj.aggrs == 'no') fObj.aggrs = [];
		} else {
			fObj.aggrs = [];
			if (fObj.type == 1) {
				fObj.aggrs[fObj.aggrs.length] = {aggr:'sum',name:'求和',aliases:''};
			}
			fObj.aggrs[fObj.aggrs.length] = {aggr:'count',name:'计数',aliases:''};
			fObj.aggrs[fObj.aggrs.length] = {aggr:'countd',name:'值计数',aliases:''};
			if (fObj.type != 2) {
				fObj.aggrs[fObj.aggrs.length] = {aggr:'max',name:'最大',aliases:''};
				fObj.aggrs[fObj.aggrs.length] = {aggr:'min',name:'最小',aliases:''};
			}
			if (fObj.type == 1) {
				fObj.aggrs[fObj.aggrs.length] = {aggr:'avg',name:'平均',aliases:''};
			}
		}
		if (fObj.aggrs) {
			for (var i=0; i<fObj.aggrs.length; i++) {
				currIndex++;
				var namei = "<span>"+fObj.aggrs[i].name+"</span>";
				if (fObj.aggrs[i].aliases && fObj.aggrs[i].aliases != '') namei += "<span style='color:gray'>,"+fObj.aggrs[i].aliases+"</span>";
				var infos1 = infos + split_2 + tName + split_1 + fName + split_1 + split_1 + fObj.aggrs[i].aggr;
				var n = treeObj.addNodes(node.getParentNode(), [{id:currIndex, isParent:false, pId:node.getParentNode().id, name:namei, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/8.png",infos:infos1,destTable:'',tName:'',fName:'',load:false}], true);
			}
		}
		*/
	}

	if (destTable && destTable != '') {
		var ts = mdUtils.getAnnexTables(destTable);
		if (!ts) {
			ts = new Array();
			ts[0] = {name:destTable,pks:[]};
		}
		//var tNames = "";
		//var dispNames = "";
		for (var i=0; i<ts.length; i++) {
			var currTable = mdUtils.getTable(ts[i].name);
			if (currTable == null) continue;
			if (currTable.hide == 1) continue;
			if (!mdUtils.classContain(classTable,ts[i].name,null,null)) continue;
			var ti = currTable.name;
			var ta = currTable.dispName;
			var pks = mdUtils.getTablePKs(ts[i].name);
			var fields = mdUtils.getShowFields(classTable,ti, ((node.level>0 || !showT) && pks.length == 1)?true:false);
			//alert(fields.length);
			for (var j=0; j<fields.length; j++) {
				var fObj = fields[j];
				//if (fObj.hide == 1) continue;
				//if (fObj.pk == 1 && (node.level>0 || !showT) && pks.length == 1) continue;
				//if (fObj.pk != 1 && node.onlyPk == 1) continue;

				var targetTable = fObj.destTable;
				var canOpen = false;
				if (targetTable) {
					if (mdUtils.classContain(classTable,targetTable,null,null)) canOpen = true;
				}
				if (!canOpen) {
					var destLevels = mdUtils.getFieldDestLevels(fObj);
					if (destLevels && destLevels.length>0) canOpen=true;
					targetTable = '';
				}
				//canOpen = true;

				var dim = fObj.dim;
				var dimObj = null;
				if (dim && dim!='') dimObj = mdUtils.getDim(fObj.dim);
				//if (dimObj != null) canBy = true;

				var fj = fObj.name;
				var fa = fObj.dispName;
				if (!fa || fa == '') fa = fj;
				fa = ""+fa+"";
				if (fObj.aliases && fObj.aliases != '') fa += "<span style='color:gray;'>,"+fObj.aliases+"</span>";
				//fa = fa + "<span style='color:gray;'>灰色</span>"

				var infos1 = infos + split_2 + ti + split_1 + fj;

				var font1 = null;
				if (selectedFields.indexOf(infos1)>=0){
					font1 = {'font-weight':'bold'};
				}
				currIndex++;
				var icon1 = consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/"+(dimObj==null?"f":"d")+".png";
				if(fields[j].exp) icon1 = consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/E.png";
				var attrs = [{id:currIndex, isParent:canOpen, pId:pId, name:fa, open:false, icon:icon1,infos:infos1,destTable:targetTable,tName:ti,fName:fj,load:false,font:font1}];
				if(fObj.exp) {//计算字段
					attrs[0].calc = fObj.exp;
				}
				var n = treeObj.addNodes(node, attrs, true);
				if (canOpen && expendNodes.indexOf(infos1)>=0) {
					loadSub(n);
				}

				if (fObj.aggrs) {
					for (var p=0; p<fObj.aggrs.length; p++) {
						//alert(1234);
						currIndex++;
						var namei = ""+fObj.aggrs[p].name+"";
						if (fObj.aggrs[p].aliases && fObj.aggrs[p].aliases != '') namei += "<span style='color:gray'>,"+fObj.aggrs[p].aliases+"</span>";
						var infos1 = infos + split_2 + ti + split_1 + fj + split_2 + ti + split_1 + fj + split_1 + split_1 + fObj.aggrs[p].aggr;
						var font2 = null;
						if (selectedFields.indexOf(infos1)>=0){
							//alert();
							font2 = {'font-weight':'bold'};
						}
						var n2 = treeObj.addNodes(node, [{id:currIndex, isParent:false, pId:node.id, name:namei, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/8.png",infos:infos1,destTable:'',tName:ti,fName:fj,load:false,font:font2}], true);
					}
				}
			}
			if (currTable.fks) {
				for (var j=0; j<currTable.fks.length; j++) {
					var fObj = currTable.fks[j];
					if (!fObj) continue;
					if (fObj.hide == 1) continue;
					if (fObj.fields.length == 1) continue;
					var fj = fObj.name;
					var fa = fObj.dispName;
					if (!fa || fa == '') fa = fj;
					var infos1 = infos + split_2 + ti + split_1 + fj;
					currIndex++;
					var font1 = null;
					if (selectedFields.indexOf(infos1)>=0){
						font1 = {'font-weight':'bold'};
					}
					var n = treeObj.addNodes(node, [{id:currIndex, isParent:mdUtils.getShowFields(classTable,currTable.fks[j].destTable,true).length>0, pId:pId, name:fa, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/4.png",infos:infos1,destTable:currTable.fks[j].destTable,tName:ti,fName:fj,load:false,font:font1}], true);
					if (expendNodes.indexOf(infos1)>=0) {
						loadSub(n);
						//treeObj.expandNode(n[0], true, false, false, false);
					}

					/*
					if (fObj.aggrs) {
						for (var p=0; p<fObj.aggrs.length; p++) {
							//alert(23233);
							currIndex++;
							var namei = ""+fObj.aggrs[p].name+"";
							if (fObj.aggrs[p].aliases && fObj.aggrs[p].aliases != '') namei += "<span style='color:gray'>,"+fObj.aggrs[p].aliases+"</span>";
							var infos1 = infos + split_2 + ti + split_1 + fj + split_2 + ti + split_1 + fj + split_1 + split_1 + fObj.aggrs[p].aggr;
							var font1 = null;
							if (selectedFields.indexOf(infos1)>=0){
								font1 = {'font-weight':'bold'};
							}
							var n2 = treeObj.addNodes(node, [{id:currIndex, isParent:false, pId:node.id, name:namei, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/8.png",infos:infos1,destTable:'',tName:ti,fName:fj,load:false,font:font1}], true);
						}
					}
					*/
				}
			}
			if (!(fName && fName!='')) {
				if (currTable.subTables && guideConf.showSubTable=='yes' && domUtils.getDims().length == 0) {
					for (var j=0; j<currTable.subTables.length; j++) {
						var tablej = mdUtils.getTable(currTable.subTables[j].table);
						if (tj == null) continue; 
						var tj = tablej.name;
//						if (tj == null) continue; 
						if (mdUtils.getShowFields(classTable,tj).length==0) continue;
						var ta = tablej.dispName;
						if (ta == '' || !ta) ta = tj;
						currIndex++;
						var n = treeObj.addNodes(node, [{id:currIndex, isParent:true, pId:pId, name:ta, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/2.png",infos:ti+":"+tj,destTable:tj,tName:ti,fName:'',load:false}], true);
						//zNodes[zNodes.length] = {id:currIndex, isParent:true, pId:0, name:dispNames, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/2.png",infos:t,destTable:t,tName:'',fName:'',load:false,onlyPk:onlyPk}
					}
				}
			}
		}
	}
	//setTimeout(function() {
		//alert(treeObj.expandNode(node, true, false, false, true));
	//}, 1000);
	//

}

var MoveTest = {
	errorMsg: "...",
	curTarget: null,
	curTmpTarget: null,
	noSel: function() {
		try {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		} catch(e){}
	},
	dragTree2Dom: function(treeId, treeNodes) {
		var iObj = cus.getInfosObj(treeNodes[0].infos);
		var aObj = $("#" + treeNodes[0].tId + "_a");
		var aggr = aObj.attr('aggr');
		if (iObj.subTable != '') {
			if (aggr == '') return false;
		}
		//console.debug(aggr + "--" + guideConf.queryType);
		if (aggr == '' && guideConf.queryType=='group') return false;
		return true;//!treeNodes[0].isParent;
	},
	dragMove: function(e, treeId, treeNodes) {
		var p = null;
		if (e.target.id == 'tableDiv') {
			p = $(e.target);
		} else {
			p = $(e.target).parent('#tableDiv');
			if (!p.get(0)) {
				p = null;
			}
		}

		$('#tableDiv').css('background-color',$('#tableDiv').attr('c1'));

		var infos = treeNodes[0].infos;
		if (!infos) return;
		var iObj = cus.getInfosObj(infos);

		var fieldObj = mdUtils.getField(iObj.lastTable, iObj.lastField,true);

		if (fieldObj == null) return;

		if (p) {
			p.css('background-color',p.attr('c3'));
		}
	},
	prevTree: function(treeId, treeNodes, targetNode) {
		return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
	},
	nextTree: function(treeId, treeNodes, targetNode) {
		return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
	},
	innerTree: function(treeId, treeNodes, targetNode) {
		return targetNode!=null && targetNode.isParent && targetNode.tId == treeNodes[0].parentTId;
	},
	dropTree2Dom: function(e, treeId, treeNodes, targetNode, moveType) {
		if (moveType != null || !("tableDiv" == e.target.id || $(e.target).parents("#tableDiv").length > 0)) {
			return;
		}
		//alert(treeNodes[0].level);

		var ss = new Array();
		if (treeNodes[0].level == 0 && $.cookie('guideShowType') != '0') {
			if (treeNodes[0].children && treeNodes[0].children.length>0) {
				for (var z=0; z<treeNodes[0].children.length; z++) {
					ss[z] = treeNodes[0].children[z].infos;
					if (ss[z]) {
						var infos = cus.getInfosObj(ss[z]);
						if (infos.subTable != '') ss[z] = null;
					}
				}
			}
		} else {
			var aObj = $("#" + treeNodes[0].tId + "_a");
			ss[0] = treeNodes[0].infos;
			var aggr = aObj.attr('aggr');
			//alert(aggr);
			if (aggr && aggr != '') {
				var iObj = cus.getInfosObj(ss[0]);
				iObj.aggr = aggr;
				ss[0] = iObj.str + split_2 + iObj.lastTable + split_1 + iObj.lastField + split_1 + split_1 + aggr;
			}
			//ss[0] = ss[0] + split_2 + Math.random();
		}
		//alert(ss.length);
		var undo = "operations.status('" + domUtils.toString() + "')";
		for (var z=0; z<ss.length; z++) {
			if (ss[z] == null) continue;
			var infos = cus.getInfosObj(ss[z]);
			var fObj = mdUtils.getField(infos.lastTable, infos.lastField, true);
			if (!fObj) continue;
			var _alias = fObj.dispName;
			if (!_alias) _alias = fObj.name;
			var aliass = domUtils.getNames();
			if (aliass.indexOf(_alias) >= 0) {
				for (var i=1; i<1000; i++) {
					if (aliass.indexOf(_alias+i) == -1) {
						_alias = _alias+i;
						break;
					}
				}
			}

			var tAlias = "";
			/*
			var tAlias = domUtils.getNewTableAlias(infos.str);//"组1";
			for (var i=domInfos.fields.length-1; i>=0; i--) {
				var ii = cus.getInfosObj(domInfos.fields[i].infos);
				if (ii.firstTable == infos.firstTable) {
					tAlias = domInfos.fields[i].tAlias;
					break;
				}
			}
			*/
			//domUtils.addField(_alias, infos.str, tAlias);

			domUtils.addSrc(infos.str);
		}
		var redo = "operations.status('" + domUtils.toString() + "')";
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
	},
	dom2Tree: function(e, treeId, treeNode) {
		return;
		var target = MoveTest.curTarget, tmpTarget = MoveTest.curTmpTarget;
		if (!target) return;
		var zTree = treeObj, parentNode;
		if (treeNode != null && treeNode.isParent && "dom_" + treeNode.id == target.parent().attr("id")) {
			parentNode = treeNode;
		} else if (treeNode != null && !treeNode.isParent && "dom_" + treeNode.getParentNode().id == target.parent().attr("id")) {
			parentNode = treeNode.getParentNode();
		}

		if (tmpTarget) tmpTarget.remove();
		if (!!parentNode) {
			var nodes = zTree.addNodes(parentNode, {id:target.attr("domId"), name: target.text()});
			zTree.selectNode(nodes[0]);
		} else {
			target.removeClass("domBtn_Disabled");
			target.addClass("domBtn");
			alert(MoveTest.errorMsg);
		}
		MoveTest.updateType();
		MoveTest.curTarget = null;
		MoveTest.curTmpTarget = null;
	},
	updateType: function() {
		var zTree = treeObj,
		nodes = zTree.getNodes();
		for (var i=0, l=nodes.length; i<l; i++) {
			var num = nodes[i].children ? nodes[i].children.length : 0;
			nodes[i].name = nodes[i].name.replace(/ \(.*\)/gi, "") + " (" + num + ")";
			zTree.updateNode(nodes[i]);
		}
	},
	bindDom: function() {
		$(".domBtnDiv").bind("mousedown", MoveTest.bindMouseDown);
	},
	bindMouseDown: function(e) {
		var target = e.target;
		if (target!=null && target.className=="domBtn") {
			var doc = $(document), target = $(target),
			docScrollTop = doc.scrollTop(),
			docScrollLeft = doc.scrollLeft();
			target.addClass("domBtn_Disabled");
			target.removeClass("domBtn");
			curDom = $("<span class='dom_tmp domBtn'>" + target.text() + "</span>");
			//alert(target.text());
			curDom.appendTo("body");

			curDom.css({
				"top": (e.clientY + docScrollTop + 3) + "px",
				"left": (e.clientX + docScrollLeft + 3) + "px"
			});
			MoveTest.curTarget = target;
			MoveTest.curTmpTarget = curDom;

			doc.bind("mousemove", MoveTest.bindMouseMove);
			doc.bind("mouseup", MoveTest.bindMouseUp);
			doc.bind("selectstart", MoveTest.docSelect);
		}
		if(e.preventDefault) {
			e.preventDefault();
		}
	},
	bindMouseMove: function(e) {
		MoveTest.noSel();
		var doc = $(document),
		docScrollTop = doc.scrollTop(),
		docScrollLeft = doc.scrollLeft(),
		tmpTarget = MoveTest.curTmpTarget;
		if (tmpTarget) {
			tmpTarget.css({
				"top": (e.clientY + docScrollTop + 3) + "px",
				"left": (e.clientX + docScrollLeft + 3) + "px"
			});
		}
		return false;
	},
	bindMouseUp: function(e) {
		var doc = $(document);
		doc.unbind("mousemove", MoveTest.bindMouseMove);
		doc.unbind("mouseup", MoveTest.bindMouseUp);
		doc.unbind("selectstart", MoveTest.docSelect);

		var target = MoveTest.curTarget, tmpTarget = MoveTest.curTmpTarget;
		if (tmpTarget) tmpTarget.remove();

		if ($(e.target).parents("#contentDiv").length == 0) {
			if (target) {
				target.removeClass("domBtn_Disabled");
				target.addClass("domBtn");
			}
			MoveTest.curTarget = null;
			MoveTest.curTmpTarget = null;
		}
	},
	bindSelect: function() {
		return false;
	}
};


function generateDimFields(relaDims) {
	setTimeout(function(){
		var classTable = $('#classTableSelect').val();
		//TODO 排序
		var list = $('#dimDiv');//$('<div id="contentDiv"></div>');
		list.html('<div style="padding-top:0px;height:25px;padding:8px 0 5px 18px;background-color:#F2F2F4;font-weight:bold;">'+resources.guide.js65+'</div>');
		//color:#000;;
		var ds = mdUtils.getDims(classTable);
		for (var i=0; i<ds.length; i++) {
			if (ds[i].hide) continue;
			if (relaDims && relaDims != null) if(relaDims.indexOf(ds[i].name)==-1) continue;
			addDim(list, ds[i].name);
		}
	},50);
}

function addDim(container, dim) {
	var dimObj = mdUtils.getDim(dim);

	var canOpen = false;//mdUtils.getSubTables(dimObj.table).length > 0;
	var openImg = canOpen?('<img src="'+contextPath+guideConf.guideDir+'/img/guide/33.png">'):'';
	//if (dimObj == null) openImg = '<img id="openImg" t=1 src="'+consts.relaPath + consts.imgFolder + consts.img16 + '">';
	var fImg = consts.img17;
	var exp = dimObj.dispName;
	var bold = selectedDims.indexOf(dim)>=0?'font-weight:bold;':'font-weight:normal;';
	var conts = '<div id="conts" style="overflow:hidden;margin-bottom:1px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;padding:0px;padding-left:10px;border:0px;"></div>';
	var curr = $('<div style="padding:0px;margin:0px;border:0px;" class="item"><h3 id="dimItem" style="outline:0px;border:1px solid #D6D6D6;border-top:0;border-radius:0px;height:26px;background-color:#FAFAFA;color:' + consts.color23 + ';margin:0px;margin-top:0px;'+bold+'" dim="' + dim + '" title="' + dim + '" t="' + dimObj.table + '"><div style="padding:4px 0;"><span><img src="'+consts.relaPath + consts.imgFolder + fImg + '"></span>' + exp + '<div style="padding:0 2px 0 0;" id="openImg">' + openImg + '</div>' + '</div></h3>' + conts + '</div>');

	container.append(curr);
	curr.find('h3').css('cursor','move').draggable({
		//handler : "a",
		revert : true,
		cursor : 'move',
		revertDuration: 1,
		containment: 'document',
		appendTo:'body',
		//connectToSortable : "#dimTable",
		helper: function( event ) {
			var curr = $(this);
			var c = curr.clone();
			c.css('z-index','10001').css('opacity', 0.4).css('border-top','1px solid #D6D6D6');
			return c;
		},
		stop: function(event, ui) {
			//setTimeout("refreshSelectBgColor();",1);
		}
	}).dblclick(function(){
	});
}

var editMode = 0;
var currShowTable;

var filterDom = null;//

function changeShowStyle(v) {
	var but = $('#fieldShowStyle');
	if (v == resources.guide.js66) {
		but[0].value = resources.guide.js64;
		$.cookie('guideShowType', '2', { expires: 77777 });
	} else {
		but[0].value = resources.guide.js66;
		$.cookie('guideShowType', '1', { expires: 77777 });
	}
	generateFields(relaTablesBak, onlyPksBak);
	//filterEvent(filterDom.val());
}

function observeObj(obj){
	var ii = "";
	for (var iii in obj){
		ii += iii + ",";
	}
	document.getElementById("observeDiv").innerHTML = ii;
}

var bigDrop = {
	accept:function(d) {
		//alert(d.html());
		if (d.attr('id') == 'dimItem') return true;
		if (d.attr('infos')) return true;
		return false;
		//return d.attr('id') == 'dimItem';
	},
	drop: function(event, ui) {
		//alert(33);
		var infos = ui.draggable.attr('infos');
		if (infos) {
			infos = parseFieldInfos(infos);
		}
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			if (ui.draggable.attr('id') == 'dimItem') {
				//alert():
				if (d[0].id != 'tableDiv') break;
				d.css(d.attr('ct'),d.attr('c1'));
				//alert(new Date().getTime() - lastOpt);
				if (new Date().getTime() - lastOpt < 50) return;
				lastOpt = new Date().getTime();
				var dim = ui.draggable.attr('dim');
				var alias = cus.generateNewDimAlias(dim);
				var dimObj = mdUtils.getDim(dim);

				var undo = "operations.status('" + domUtils.toString() + "')";
				var infos = dimObj.table + split_2 + dimObj.table + split_1 + dimObj.field;
				domUtils.addSrc(infos,true);
				var redo = "operations.status('" + domUtils.toString() + "')";
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
			} else {
			}
		}
	},
	over: function(event, ui) {
		var infos = ui.draggable.attr('infos');
		if (infos) {
			infos = parseFieldInfos(infos);
		}
		var actives = new Array();
		var onActive;
		//alert(dropDoms.length);
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			actives[actives.length] = d;
		}
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			d.attr('act', 1);
		}
		for (var i=0; i<actives.length; i++) {
			var d = actives[i];
			d.css(d.attr('ct'),d.attr(i==0?'c3':'c2'));
			d.attr('act', i==0?3:2);
		}
	},
	out: function(event, ui) {
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			d.css(d.attr('ct'),d.attr('c1'));
		}
		//$(this).css($(this).attr('ct'),$(this).attr('c2'));
	},
	activate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c2'));
	},
	deactivate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c1'));
	}
}

var split_1 = ',,,,';
var split_2 = ';;;;';
/**
 * L:level, A:aggr
	T1:T11;T2,F2;T3,F3,L3;T3,F4;T5,F5,L5;T6,F6,L6,A6
	T1@T11.A6(F2.F3#L3.F4.F5#L5.F6)
*/
var getInfosObj = cus.getInfosObj;

var mytabs = null;
function selectTab(idx) {
	if (idx==1) $('#tabs-btn-1').addClass('selected');
	else $('#tabs-btn-1').removeClass('selected');
	$('#tabs-1').css('display',idx==1?'block':'none');

	if (idx==2) $('#tabs-btn-2').addClass('selected');
	else $('#tabs-btn-2').removeClass('selected');
	$('#tabs-2').css('display',idx==2?'block':'none');

	if (idx==3) $('#tabs-btn-3').addClass('selected');
	else $('#tabs-btn-3').removeClass('selected');
	$('#tabs-3').css('display',idx==3?'block':'none');

	if (idx==4) $('#tabs-btn-4').addClass('selected');
	else $('#tabs-btn-4').removeClass('selected');
	$('#tabs-4').css('display',idx==4?'block':'none');
}

var topLayout,middleLayout,innerLayout,innerNorthLayout;
function initPage () {
	var doms = $("#bodyDiv").html();
	$("#bodyDiv").html('');
	$("#bodyDiv").parent().html(doms);

	if (!guideConf.dimAreaWidth) guideConf.dimAreaWidth = 100;
	if (!guideConf.fieldAreaWidth) guideConf.fieldAreaWidth = 350;

	if (rqBrowser.FF){
		$('#filterUp,#filterDown').css('vertical-align','-7px');
	}
	if (guideConf.showToolBar == 'no'){
		$('#exceptNullGroup,#autoFindLevel').css('top','0')
	}
	$('#exceptNullGroup').css('left',guideConf.dimAreaWidth+guideConf.fieldAreaWidth+17+'px');
	$('#autoFindLevel').css('left',guideConf.dimAreaWidth+guideConf.fieldAreaWidth+130+'px');
	var contentDivAdjust = 80;
	if (guideConf.fixedTable != '' && guideConf.fixedTable.length == 1){
		$('#tabs-2-top').css('display','none');
		contentDivAdjust = 0;
	}

	tableDivHasTopBut = false;
	if (guideConf.showNullGroup == 'user') {
		$('#exceptNullGroup').css('display','block');
		guideConf.showNullGroup = 'yes';
		tableDivHasTopBut = true;
	}
	if (guideConf.detectLevel == '0') {
		$('#autoFindLevel').css('display','block');
		guideConf.detectLevel = 4;
		tableDivHasTopBut = true;
	}

	middleLayout = $('.mainPanel').layout({

		spacing_open: 0
		,spacing_closed: 0
		, north: {
			spacing_open:0
			,spacing_closed:0
			,size: guideConf.showToolBar=='no'?"0":"50"
			,paneSelector: ".ui-layout-toolbar"
 			,resizable : true
			,closable:false
			,initHidden:guideConf.showToolBar=='no'?true:false
		}
		, center: {
			paneSelector: "#innerLayout"
			,onresize : function() {
				innerLayout.resizeAll();
				if (editMode == 0) {
					var td = $('#tableDiv');
					//$('#dqlDiv').css('height',td.css('height')).css('width',td.css('width'));
				}
				//$("#tableDiv").css('height',"100%").css('width','100%');
				//$('#tabs-1,#tabs-2,#tabs-3').css('height', parseInt($('#mytabs').css('height'))-40+'px').css('padding','1px');
			}
		}
		/*
		, south: {
			paneSelector: ".inner-center"
			,size : (escalc?"40":"150")
			,initHidden:escalc?true:false
		}
		*/
	});
	$('.mainPanel').css('position','');
	var dropList = null;
	var helperWidth = null;


	$(".fields-north").disableSelection();
	operations.refreshButs();

	$(document).bind('mousedown selectstart', function(e) {
	    return $(e.target).is('input, textarea, select, option');
	});

	changeRSButs(false);

	var ddss = guideConf.dqlDataSources;
	if (ddss.length>0) {
		ddss = ddss.split(";");
	}
	var selDom4 = getSelectDom(ddss, ddss, guideConf.dataSource);
	selDom4.css({'background-color':'#41455A','border':'0','color':'#bbb','padding':'4px','margin-top':'9px'}).attr('title','').change(function(){
		if (this.value == guideConf.dataSource) return;
		var form = $('<form method="post" accept-charset="UTF-8"></form>');
		form.attr('action',selfUrl);
		form.attr('target', '_blank');
		form.append('<input type="hidden" name="dataSource" value="'+this.value+'">');
		$('body').append(form);
		form[0].submit();
		$(this).val(guideConf.dataSource);
	});
	var ddsDom = $('#dqlDataSources');
	ddsDom.append(selDom4);
	//if (!guideConf.showDataSources) guideConf.showDataSources = "yes";
	if (guideConf.showDataSources != 'no') ddsDom.css('visibility','visible');

	if (lmd == null) {
		$('#innerLayout').html('');
		return;
	}
	
	var cts = mdUtils.getClassTables();
	if (cts.length>0) {
		var values = [''];
		var disps = [resources.guide.js67];
		var dft = '';
		for (var i=0; i<cts.length; i++) {
			var classTable = cts[i];
			values[values.length] = classTable.name;
			disps[disps.length] = classTable.name;
		}
		if (guideConf.dqlCategory.length>0) {
			while (guideConf.dqlCategory.indexOf('')>=0) guideConf.dqlCategory.remove('');
			for (var i=guideConf.dqlCategory.length-1; i>=0; i--) {
				if (values.indexOf(guideConf.dqlCategory[i])==-1) guideConf.dqlCategory.remove(guideConf.dqlCategory[i]);
			}
			if (guideConf.dqlCategory.length>0) {
				values = guideConf.dqlCategory;
				disps = guideConf.dqlCategory;
				dft = guideConf.dqlCategory[0];
			}
		}
		var selDom4 = getSelectDom(values, disps, dft);
		selDom4.attr('id','classTableSelect').css('width','110px').css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px'}).attr('title','').change(function(){
			domUtils.check();
			//changeClassTable();
		});
		$('#fieldShowStyle').parent().css('width','110px');
		$('#hideNoRela').css('width','100px');
		$('#classTableDiv').css('display','block').html('').append(selDom4);
	} else {
		$('#fieldShowStyle').parent().css('width','165px');
		$('#hideNoRela').css('width','165px');
	}

	var selDom1 = getSelectDom([2,3,4,5,6,7,8], [resources.guide.js68+2+resources.guide.js69,resources.guide.js68+3+resources.guide.js69,resources.guide.js68+4+resources.guide.js69,resources.guide.js68+5+resources.guide.js69,resources.guide.js68+6+resources.guide.js69,resources.guide.js68+7+resources.guide.js69,resources.guide.js68+8+resources.guide.js69], guideConf.detectLevel);
	selDom1.css({'margin':'6px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','width':'100%'}).attr('title',resources.guide.js70).change(function(){
		dqlQuery.detectLevel = this.value;
		//findLevel=this.value;
	});
	$('#autoFindLevel').append(selDom1);
	var selDom2 = getSelectDom([0,1], [resources.guide.js71,resources.guide.js72], 1);
	selDom2.css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','width':'100%'}).attr('title','').change(function(){
		autoFilter = this.value==1;
		domUtils.check();
	});
	$('#hideNoRela').append(selDom2);

	var selDom3 = getSelectDom([0,1], [resources.guide.js73,resources.guide.js74], guideConf.showNullGroup=='yes'?0:1);
	selDom3.css({'margin':'6px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','width':'100%'}).attr('title','').change(function(){
		guideConf.showNullGroup = this.value == 1?"no":"yes";
	});
	$('#exceptNullGroup').append(selDom3);

	//<div style='float:right;padding:4px 10px;margin-top:1px;' id="" title=''><input id='autoFilterBut' style='vertical-align:-2px;' onclick=';' checked type='checkbox'><span onclick="changeAutoFilter()" style="cursor:pointer;">自动隐藏无关数据项</span></div>
	//<div style='float:right;padding:4px 10px;margin-top:1px;' id="" title=''><input id='removeNullGroupBut' style='vertical-align:-2px;' onclick='changeRemoveNullGroup();' checked type='checkbox'><span onclick="changeRemoveNullGroup()" style="cursor:pointer;">去除空分组</span></div>

	generateFields();
	generateDimFields();
	$('#tableDiv').droppable(bigDrop);

	filterDom = $("#filter");
	filterDom.val('').css('color','').attr('idx',0).attr('bak','');
	var filterFunc = function(shift){
		if ($.trim(filterDom.val()) == '') return;
		var nodes = treeObj.getNodesByFilter(function(node){
			return (node.name.indexOf(filterDom.val())>=0);
		})
		if (nodes.length==0) return;

		var idx = filterDom.attr('idx');
		idx = idx%nodes.length;
		if (idx<=0 && shift==-1) idx = nodes.length-1;
		else if (idx>=nodes.length-1 && shift==1) idx = 0;
		else idx = idx + shift;
		filterDom.attr('idx',idx);
		node = nodes[idx];
		treeObj.selectNode(node);
		$('#contentDiv').parent().scrollTo('#contentDiv_'+node.id);
	}
	$('#filterUp').click(function(){
		filterFunc(-1);
	});
	$('#filterDown').click(function(){
		filterFunc(1);
	});
	filterDom.keyup(function(event){
		var node = null;
		if(event.keyCode == 13){
			if ($.trim(filterDom.val()) != '') {

				var nodes = treeObj.getNodesByFilter(function(node){
					return (node.name.indexOf(filterDom.val())>=0);
				})
				//alert(nodes.length);
				if (nodes.length!=0) {
					var idx = filterDom.attr('idx');
					idx++;
					filterDom.attr('idx',idx);
					idx = idx%nodes.length;
					node = nodes[idx];
				}

				setTimeout(function(){
					//$('#contentDiv').parent().scrollTo('#contentDiv_'+node.id);
				},3000);

				//filterEvent(this.value);
				//filterDom.css('color','');
			}
		} else {
			if (filterDom.attr('bak')==filterDom.val()) return;
			filterDom.attr('bak',filterDom.val());
			filterDom.attr('idx',0);
			//alert(2);
			if ($.trim(filterDom.val()) != '') {
				var nodes = treeObj.getNodesByFilter(function(node){
					return (node.name.indexOf(filterDom.val())>=0);
				})
				if (nodes.length!=0) {
					node = nodes[0];
				}
			}
			//alert(node);

		}
		if (node != null) {
			treeObj.selectNode(node);
			$('#contentDiv').parent().scrollTo('#contentDiv_'+node.id);
		} else {
			$('#contentDiv').parent().scrollTo(0);
		}
		filterDom.focus();
	});
	var changeE = function(event){
		if (filterDom.attr('bak')==filterDom.val()) return;
		filterDom.attr('bak',filterDom.val());
		filterDom.attr('idx',0);
		var node = null;
		//alert(2);
		if ($.trim(filterDom.val()) != '') {
				var nodes = treeObj.getNodesByFilter(function(node){
					return true;//(node.name.indexOf(filterDom.val())>=0);
				})
				if (nodes.length!=0) {
					node = nodes[0];
				}
		}
		//alert(node);

		setTimeout(function(){
			if (node != null) {
				treeObj.selectNode(node);
				$('#contentDiv').parent().scrollTo('#contentDiv_'+node.id);
			} else {
				$('#contentDiv').parent().scrollTo(0);
			}
			filterDom.focus();
			//alert(node);
		},3000);
	};
	
	innerLayout = $('#innerLayout').css('background','url("'+contextPath+guideConf.guideDir+'/img/guide/29.png") no-repeat scroll right bottom').layout({
		spacing_open: 0
		,spacing_closed:0
		, center: {
			spacing_open:0
			,spacing_closed:0
			//,size: "350"
			,paneSelector: ".inner-north"
			,onresize : function() {
				//innerNorthLayout.resizeAll();
				if (editMode == 0) {
					var td = $('#tableDiv');
					//$('#dqlDiv').css('height',td.css('height')).css('width',td.css('width'));
				}
				//$("#tableDiv").css('height',"100%").css('width','100%');
				//$('#tabs-1,#tabs-2,#tabs-3').css('height', parseInt($('#mytabs').css('height'))-40+'px').css('padding','1px');
			}
		}
		, west : {
			spacing_open:0
			,spacing_closed:0
			,paneSelector: "#sourceArea",
			size : guideConf.dimAreaWidth+guideConf.fieldAreaWidth+"",
			minSize : guideConf.dimAreaWidth+guideConf.fieldAreaWidth+"",
			onresize : function() {
				$('#tabs-1,#tabs-2,#tabs-3,#tabs-4').css('height', parseInt($('#mytabs').css('height'))-5+'px').css('padding','1px');
				$('#contentDiv').css('height', parseInt($('#mytabs').css('height'))-contentDivAdjust+'px');
				$('#tabs-2').css('width', parseInt($('#mytabs').css('width'))-0+'px');
			}
		}
	});

	innerLayout = $('#sourceArea').layout({
		spacing_open: 0
		,spacing_closed:0
		, west: {
			spacing_open:0
			,spacing_closed:0
			,size: guideConf.dimAreaWidth+""
			,minSize: guideConf.dimAreaWidth+""
			,maxSize: guideConf.dimAreaWidth+""
			,paneSelector: "#dimDiv"
			,onresize : function() {
				//innerNorthLayout.resizeAll();
				if (editMode == 0) {
					var td = $('#tableDiv');
					//$('#dqlDiv').css('height',td.css('height')).css('width',td.css('width'));
				}
				//$("#tableDiv").css('height',"100%").css('width','100%');
				//$('#tabs-1,#tabs-2,#tabs-3').css('height', parseInt($('#mytabs').css('height'))-40+'px').css('padding','1px');
			}
		}
		, east : {
			spacing_open:0
			,spacing_closed:0
			,paneSelector: "#mytabs",
			size : guideConf.fieldAreaWidth+"",
			minSize : guideConf.fieldAreaWidth+"",
			onresize : function() {
				$('#tabs-1,#tabs-2,#tabs-3,#tabs-4').css('height', parseInt($('#mytabs').css('height'))-5+'px').css('padding','1px');
				$('#contentDiv').css('height', parseInt($('#mytabs').css('height'))-contentDivAdjust+'px');
				$('#tabs-2').css('width', parseInt($('#mytabs').css('width'))-0+'px');
			}
		}
	});

	$('#mytabs').css('overflow','hidden').css('border','0');
	//topLayout.toggle("west");
	$('.ui-state-disabled').removeClass('ui-state-disabled');
	$('#tabs-1,#tabs-2,#tabs-3,#tabs-4').css('height', parseInt($('#mytabs').css('height'))-5+'px').css('padding','1px');
	$('#contentDiv').css('height', parseInt($('#mytabs').css('height'))-contentDivAdjust+'px');

	$('#openBut,#editMode,#pageMode,#undoBut,#redoBut,#queryBut,#analyzeBut,#createTableBut,#saveBut,#saveLocalBut,#gexBut,#saveGexBut,#txtDownloadBut,#setBackBut,#txtAllBut,#txtSaveBut,#excelBut,#prevBut,#nextBut').hover(
         function () {
           var src = $(this).attr('src').toLowerCase();
           if (src.indexOf('-h') > 0) return;
           $(this).attr('src', src.replace('png', 'jpg'));
         },
         function () {
           var src = $(this).attr('src').toLowerCase();
           if (src.indexOf('-h') > 0) return;
           $(this).attr('src', src.replace('jpg', 'png'));
         }
    );
	$('#openLocalBut').hover(
         function () {
           $(this).css('background-image', $(this).css('background-image').replace('png', 'jpg'));
         },
         function () {
           $(this).css('background-image', $(this).css('background-image').replace('jpg', 'png'));
         }
    );

    domUtils.refresh();
}

function changeClassTable() {
	domUtils.check();
	//generateDimFields();
	//generateFields();
}

function parseFieldInfos(infos) {
	var fs = infos.split(split_2);
	var fArray = new Array();
	for (var i=fs.length-1; i>=0; i--) {
		var arr = fs[i].split(split_1);
		var f = {
			table : arr[0],
			ta : arr[1],
			field : arr[2],
			fa : arr[3],
			level : arr[4],
			dim : arr[5],
			baseDim : arr[6]
		}
		fArray[fArray.length] = f;
	}
	return fArray;
}

//选中字段，刷新该表（别名表）的by列表及by on关系。
var byInfos = {};
var findLevel = 4;

function getCurrTitle() {
	return document.title;
}

var currDispTable = '';
var currWhereField = null;

var currQuery = null;

//guideConf.outerTableExps = [{table:"雇员",exp:'${T}.雇员="2"'}];
//guideConf.outerTableExps = [{table:"雇员",exp:"${T}.雇员='2'"},{table:"省",exp:"${T}.名称='天津'"}];
function getOuterCondition(t) {
	var ts = guideConf.outerCondition;
	for (var i=0; i<ts.length; i++)
	{
		if (ts[i].table == t) return ts[i];
	}
}

var dqlFields = [];

function changeRSButs(enable){
	$('#prevBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'prev' + (enable?'':'-h') + '.png');
	$('#nextBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'next' + (enable?'':'-h') + '.png');
	$('#txtDownloadBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'txt-download' + (enable?'':'-h') + '.png');
	$('#setBackBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'set-back' + (enable?'':'-h') + '.png');
	$('#txtSaveBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'txt-save' + (enable?'':'-h') + '.png');
	$('#txtAllBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'txt-all' + (enable?'':'-h') + '.png');
	$('#excelBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'excel' + (enable?'':'-h') + '.png');
	$('#gexBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'gex' + (enable?'':'-h') + '.png');
	$('#saveGexBut').attr('disabled',!enable).attr('src',consts.relaPath +  consts.imgFolder + 'save-gex' + (enable?'':'-h') + '.png');
}

function submitQuery() {
	//if ($('#queryBut').attr('src').indexOf('-h') > 0) return;
	var dql = cus.generateDql(domInfos);
	if (!dql) return;
	var emptyReport = false;
	
	var rqAnalyse = {
	currRpx:resources.guide.js75
	,dataSets:[
		{
			name:'dqlQuery'
			,type:2//2（dataSource及ql）/3（dfxFile及dfxParams）/4（dfxScript及dfxParams）/5（inputFiles|currTable|tableNames）/6（dql类型dataSource、tableName）
			,dataSource:guideConf.dataSource
			,parent:null
			,fields:dqlFields
			,ql:dql
			,dfxFile:''
			,dfxScript:''
			,dfxParams:''
			,inputFiles:''
			,currTable:''
			,tableNames:''
			,tableName:''
			,dqlConf:domInfos
			,dataId:''//缓存的数据ID
			,rowCount:0
		}
	],rpxs:[
		{
			name:resources.guide.js75
			,dataSet:'dqlQuery'
			//,dataSetLevel:'none/calc/where/group/having/order'
			,_hasAggr:0//'0/1'
			,_status:''//'为空表示正确，不为空是失效的具体信息'
			,type:1//1自定义分析报表/2模板报表
			,dialog:{
				open:1//0/1
				,top:100
				,left:100
				,width:800
				,height:500
			}
			,reportId:"rid"+new Date().getTime()
			,structType:1//:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表
			,template:''
			,autoCalc:1//0/1
			,isRowData:1//0/1
			,lefts:[
			]
			,tops:[]
			,fields:emptyReport?[]:rpxu.initRpxFields(dqlFields)
			,where:{conf:[]}
			,calcs:[]
		}
	]};

	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	if (guideConf.dataPage.indexOf("/")!=0) guideConf.dataPage = "/"+guideConf.dataPage;
	form.attr('action',contextPath+guideConf.dataPage);
	form.attr('target', '_blank');
	form.append('<input type="hidden" name="olap" value="'+aly.toString(rqAnalyse)+'">');
	$('body').append(form);
	form[0].submit();
}

function submitAnalyse() {
	//if ($('#queryBut').attr('src').indexOf('-h') > 0) return;
	var dql = cus.generateDql(domInfos);
	if (!dql) return;
	var emptyReport = false;
	try {
		emptyReport = guideConf.emptyReport=="yes";
	} catch(e){}

	var rqAnalyse = {
	currRpx:resources.guide.js75
	,dataSets:[
		{
			name:'dqlQuery'
			,type:2//2（dataSource及ql）/3（dfxFile及dfxParams）/4（dfxScript及dfxParams）/5（inputFiles|currTable|tableNames）/6（dql类型dataSource、tableName）
			,dataSource:guideConf.dataSource
			,parent:null
			,fields:dqlFields
			,ql:dql
			,dfxFile:''
			,dfxScript:''
			,dfxParams:''
			,inputFiles:''
			,currTable:''
			,tableNames:''
			,tableName:''
			,dqlConf:domInfos
			,dataId:''//缓存的数据ID
			,rowCount:0
		}
	],rpxs:[
		{
			name:resources.guide.js75
			,dataSet:'dqlQuery'
			//,dataSetLevel:'none/calc/where/group/having/order'
			,_hasAggr:0//'0/1'
			,_status:''//'为空表示正确，不为空是失效的具体信息'
			,type:1//1自定义分析报表/2模板报表
			,dialog:{
				open:1//0/1
				,top:100
				,left:100
				,width:500
				,height:400
			}
			,reportId:"rid"+new Date().getTime()
			,structType:1//:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表
			,template:''
			,autoCalc:1//0/1
			,isRowData:1//0/1
			,lefts:[
			]
			,tops:[]
			,fields:emptyReport?[]:rpxu.initRpxFields(dqlFields)
			,where:{conf:[]}
			,calcs:[]
		}
	]};

	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	if (guideConf.analysePage.indexOf("/")!=0) guideConf.analysePage = "/"+guideConf.analysePage;
	form.attr('action',contextPath+guideConf.analysePage);
	form.attr('target', '_blank');
	form.append('<input type="hidden" name="olap" value="'+aly.toString(rqAnalyse)+'">');
	$('body').append(form);
	form[0].submit();
}

function clearDimWhereSelected() {
	$('#dimWhereSelect option').removeAttr('selected');
}


function getFieldType(name, currDomInfos) {
	if (!currDomInfos) currDomInfos = domInfos;
	if (!currDomInfos.sql) return null;
	for (var j=0; j<currDomInfos.select.length; j++) {
		var sj = currDomInfos.select[j];
		if (sj.alias == name) {
			if (sj.aggr == 'sum' || sj.aggr == 'count' || sj.aggr == 'countd' || sj.aggr == 'dcount' || sj.aggr == 'avg') {
				return 1;
			}
			var tn = sj.from;
			for (var z=0; z<currDomInfos.from.length; z++) {
				if (currDomInfos.from[z].alias == tn) {
					tn = currDomInfos.from[z].table;
					break;
				}
			}
			var iObj = cus.getInfosObj(tn+"."+sj.field,true);
			if (iObj) {
				var fObj = mdUtils.getField(iObj.lastTable, iObj.lastField);
				if (fObj) return fObj.type;
			}
		}
	}

	for (var j=0; j<currDomInfos.on.length; j++) {
		if (currDomInfos.on[j].alias == name) {
			var dimObj = mdUtils.getDim(currDomInfos.on[j].dim);
			if (dimObj) {
				var fObj = mdUtils.getField(dimObj.table, dimObj.field);
				if (fObj) return fObj.type;
			}
		}
	}
}

// top:e2在e1正上方； left：e2在e1正左方；
function comparePosition(e1, e2) {
	//e1中取一个参考点
	var l1 = e1.position().left + 5;
	var t1 = e1.position().top + 5;
	//var w1 = e1.width();
	//var h1 = e1.height();
	var l2 = e2.position().left;
	var t2 = e2.position().top;
	var w2 = e2.width();
	var h2 = e2.height();

	if (t1>t2 && (t2+h2)>t1 && l1>l2) return "left";
	if (l1>l2 && (l2+w2)>l1 && t1>t2) return "top";
}

function getDimValues(dim, where) {
	var dimObj = mdUtils.getDim(dim);
	if (!dimObj) return []; //2016/03/24 松波孤维bug
	var vs = null;
	if (dimObj.sql == null || dimObj.sql == '') {
		if (dimObj.vs && dimObj.vs != '') {
			if (where != null && where != '') {
				var where = where.substring(where.lastIndexOf('=')+1);
				var dvs = dimObj.vs.split('r;q');
				var codes = dvs[0].split('r,q');
				var disps = dvs[1].split('r,q');
				var cs = "";
				var ds = "";
				for (var i=0; i<codes.length; i++) {
					if (codes[i].indexOf(where) == -1) continue;
					if (cs != "") {
						cs += "r,q";
						ds += "r,q";
					}
					cs += codes[i];
					ds += disps[i];
				}
				vs = cs + "r;q" + ds;
			} else vs = dimObj.vs;
		}
	} else {
		var sql = dimObj.sql;
		if (where && where != '') {
			where = " WHERE " + where;
			var pos  = sql.indexOf('ORDER BY');
			if (pos == -1) sql = sql + where;
			else {
				sql = sql.replace('ORDER BY', where + " ORDER BY");
			}
		}
		$.ajax({
			type: 'POST',
			async : false,
			url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
			data: {action:4,oper:'dispTable',sql:sql,dbName:guideConf.dataSource},
			success: function(data){
				if (data.indexOf('error:')==0) {
					alert(data.substring(6));
					return;
				}
				if (data != 'none')
					vs = data;
			}
		});
	}
	if (vs == null) return [];
	else {
		vs = vs.split("r;q");
		var codes = vs[0].split('r,q');
		var disps = null;
		if (vs[1]) disps = vs[1].split('r,q');
		var result = [];
		for (var i=0; i<codes.length; i++) {
			var disp = codes[i];
			if (disps != null) disp = disps[i];
			result[i] = {code:codes[i],disp:disp,vs:[]};
		}
		return result;
	}
}

function getDimLevelValues(dim) {
	var self = getDimValues(dim,"");
	if (self.length == 0) return self;
	var dimObj = mdUtils.getDim(dim);
	if (dimObj.destLevels && dimObj.destLevels.length>0) {
		var parents = [];
		for (var j=0; j<dimObj.destLevels.length; j++) {
			if (j < dimObj.destLevels.length-1) continue;
			var destDim = mdUtils.getDimByTableField(dimObj.destLevels[j].dest);
			if ((destDim.vs == null) && !destDim.sql) continue;
			//var ri = [];
			var dvi = getDimValues(destDim.name,"");
			if (dvi.length==0) continue;
			var formula = dimObj.destLevels[j].formula;
			for (var z=0; z<dvi.length; z++) {
				dvi[z].vs = getDimValues(dim, formula.replaceAll('?',dimObj.code) + "=" + dvi[z].code);
			}
			parents[parents.length] = dvi;
		}
		/*
		if (parents.length>0) {
			var all = [];
			for (var z=0; z<parents.length; z++) {
				all = all.concat(parents[z]);
			}
			return all;
		} return self;
		*/
		//有中间层的时候需要把中间层归类下TODO
		if (parents.length>1) {
			return parents[parents.length-1];
			var p2 = [];
			for (var z=0; z<parents.length; z++) {
				p2[parents.length] = parents;
			}
			var p3 = [];
			for (var z=0; z<p2.length; z++) {
				if (!p2[z]) continue;
				p3[p3.length] = p2[z];
			}
			p3[p3.length] = self;

			for (var z=0; z<p3.length-1; z++) {
				if (!p3[z].vs) continue;
				for (var m=0; m<p3[z].vs.length; m++) {
					var vs = [];
					var vsm = p3[z].vs[m];
					if (vsm.length == 0) continue;
					for (var k=0; k<p3[z+1].vs.length; k++) {
						var vsk = k<p3[z+1].vs[k];
					}
				}

			}
			return p3[0];

		} else return parents[0];
	}
	return self;
}

function asyncDimValue() {
	var roots = analyzeTreeObj.getNodes();
	var nodes = analyzeTreeObj.transformToArray(roots);
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].dim && nodes[i].dim != '' && nodes[i].dim != 1 && nodes[i].dim != 0) {
			var vs = getDimLevelValues(nodes[i].dim);
			if (vs == null || vs.length == 0) continue;
			analyzeTreeObj.addNodes(nodes[i],[{id:dimValueCount++,open:false,isHidden:false,isParent:true,checked:true, pId:nodes[i].id, name:resources.guide.js76, icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:'all',drag:false,nType:3}]);
			//alert(nodes[i].dim + "--" + vs.length);
			var n3 = analyzeTreeObj.getNodesByParam("nType", "3", nodes[i])[0];
			analyzeTreeObj.moveNode(analyzeTreeObj.getNodesByParam("nType", "1", nodes[i])[0],n3,"prev");
			addDimSub(n3,vs);
		}
	}
}

function addDimSub(node, vs) {
	if (vs && vs.length > 0) {
		for (var j=0; j<vs.length; j++) {
			var idj = dimValueCount++;
			var isParent = vs[j].vs&&vs[j].vs.length>0;
			var n = analyzeTreeObj.addNodes(node, [{id:idj,isHidden:false, isParent:isParent,open:false,checked:true, pId:node.id, name:vs[j].disp, icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:vs[j].code,drag:false,nType:isParent?3:2}],true);
			//$("#" + n[0].tId + '_ico').css('display','none');
			//alert($("#" + n[0].tId + '_ico').length);
			if (isParent) addDimSub(n[0], vs[j].vs);
		}
	}
}

var hasDimField = false;
var dimValueCount = 10000;

var graphType = '<select id="graphType" style="float:left;margin:10px;">';
var gTypes = ["区域图,1","条形图,2",	"三维条形图,3",	"三维簇状条形图,4","堆积条形图,5","三维堆积条形图,6","柱形图,7","三维柱形图,8","三维簇状柱形图,9","堆积柱形图,10","三维堆积柱形图,11","折线图,12","饼型图,13","散列图,14","三维区域图,15","三维折线图,16","三维饼型图,17","雷达图,22","仪表盘,24","3D仪表盘,28"];
for (var i=0; i<gTypes.length; i++) {
	var gi = gTypes[i].split(',');
	graphType += '<option'+(gi[1]==7?' selected':'')+' value="'+gi[1]+'">'+gi[0]+'</option>';
}
graphType += '</select>';


var currGraphReport = null;

function loadTreeEditStyles(){
	//dimName,vs,table,code,disp _,_ _;_
	
	var r = '';
	if (lmd != null) {
		var dims = mdUtils.getDims(null,true);
		for (var i=0; i<dims.length; i++){
			var d = dims[i];
			if (d.vs && d.vs != '')
			{
				if (r != '') r += "_;_";
				r += d.name+"_,_"+d.vs;
			} else if (d.item)
			{
				if (d.item.table && d.item.code && d.item.disp) {
					if (r != '') r += "_;_";
					r += d.name+"_,_"+"_,_"+d.item.table+"_,_"+d.item.code+"_,_"+d.item.disp+"_,_"+d.dispName+"_,_";
					var l = '';
					if (d.destLevels && d.destLevels.length>0) {
						for (var k=0; k<d.destLevels.length; k++) {
							var tf = d.destLevels[k].dest.split('.');
							if (l != '') l += "_,_";
							l += tf[1]+"_:_"+d.destLevels[k].formula;
						}
					}
					r += l;
				}
			}
		}
	}
	//console.log("loadTreeEditStyles's r = "+r );
	if (!guideConf.maxDimSize) guideConf.maxDimSize = 50000;
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'generateGuideTrees',dataSource:guideConf.dqlDataSources.indexOf(guideConf.dataSource)>=0?guideConf.dataSource:"",trees:r,file:guideConf.dimDataOnServer,maxDimSize:guideConf.maxDimSize,autoReload:guideConf.autoReloadDimDataOnServer},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			if (data == "no") return;
			//console.log("data1 : [" + data + "]");
			//console.log("data2 : [" + (data=="no") + "]");
			//console.log("data3 : " + data)
			try {
				data = JSON.parse(data);
				for (var i=0; i<data.length; i++)
				{
					//alert(data[i].name);
					queryApi.setEditStyleDef(data[i]);
					//editStyles.push(data[i]);
					data[i].type = 6;
				}
			} catch(e) {
				alert(resources.guide.js77);
			}
		}
	});
}



$(document).ready(function(){
	
	dqlQuery.setLmdStr(lmdStr);
	dqlQuery.setVsbStr(guideConf.visibility);
	dqlQuery.setDctStr(guideConf.dictionary);
	dqlQuery.detectLevel = guideConf.detectLevel;
	lmd = dqlQuery.lmd;
	if (dqlQuery.lmd != null)	{
		lmds.push({dsName:guideConf.dataSource,lmd:dqlQuery});
		if (typeof(guideConf.dct)!='undefined' && guideConf.dct != "") {
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'getDct',dct:guideConf.dct},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					}
					dqlQuery.setDctStr(data);
				}
			});
		}

		if (typeof(guideConf.vsb)!='undefined' && guideConf.vsb != "") {
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'getVsb',vsb:guideConf.vsb},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					}
					dqlQuery.setVsbStr(data);
				}
			});
		}
	}

	

	loadTreeEditStyles();
	loadServerFiles();

	try
	{
		if (guideConf.outerCondition != '') guideConf.outerCondition = JSON.parse(guideConf.outerCondition.replaceAll('<d_q>','"'));
		else guideConf.outerCondition = dqlQuery.outerCondition;
	} catch (e) {
		alert(resources.guide.js78 +e);
		guideConf.outerCondition = [];
	}
	
	try
	{
		if (guideConf.fixedTable != '') guideConf.fixedTable = guideConf.fixedTable.replaceAll("，",",").split(",");
		else { // if (guideConf.fixedTable == 'ALL' || guideConf.fixedTable == 'all') {
			guideConf.fixedTable = mdUtils.getAllTreeTables();
		}  
	} catch (e) {
		guideConf.fixedTable = '';
	}
	
	if (guideConf.queryType == 'detail' && guideConf.fixedTable != '') {
		for (var z=guideConf.fixedTable.length-1;z>=0;z--) {
			if (mdUtils.getTable(guideConf.fixedTable[z],true) == null) guideConf.fixedTable.remove(guideConf.fixedTable[z]);
		}
		if (guideConf.fixedTable.length==0) {
			guideConf.fixedTable = '';//[lmd.tables[0].name];
		}
	}
	
	//if (guideConf.queryType != 'group' && guideConf.fixedTable.length>0) guideConf.fixedTable = [guideConf.fixedTable[0]];
	

	if ("olap" != guideConf.view) {
		//guideConf.dictionary = guideConf.dictionary.replaceAll("<d_q>",'"');
		//guideConf.visibility = guideConf.visibility.replaceAll("<d_q>",'"');
		$('#queryView').parent().html($('#queryView').html());
		if (dqlQuery.lmd == null) {
			alert(resources.guide.js79.replaceAll('{0}',guideConf.dataSource));
			return;
		}
		if (guideConf.reSort != 'no') mdUtils.getTables().sort(sortBy("dispName"));
		initPage();
		domUtils.set(qyxStr);
		domInfos = dqlQuery.conf;
		//domUtils.refresh();
		if ($.cookie('guideShowType') == '1') {
			//alert(1111);
			changeShowStyle(resources.guide.js66);
		}
	} else {
		var abs = guideConf.analyseButs.split(",");
		for (var i=1; i<=8; i++) {
			if (abs.indexOf(i)>=0) $('#analyseBut'+i).css('visibility',"visible");
			else $('#analyseBut'+i).remove();
		}
		try {
			if (!guideConf.emptyReport) guideConf.emptyReport = 'no';
		} catch(e) {guideConf.emptyReport = 'no';}
		$("#dataSetBut").css('display',guideConf.canEditDataSet!='yes'?'none':'block');
		$("#analyseConf1").css('display',guideConf.canEditReport!='yes'?'none':'block');
		$(".ui-layout-north").css('display',guideConf.showToolBar=='no'?'none':'block');
		artDialogMaxTop = guideConf.showToolBar=='no'?0:50;
		$('#analyseView').parent().html($('#analyseView').html());
		$('.ui-layout-center,ui-layout-east').disableSelection();
		var ac2 = $("#analyseConf2");
		var ac1 = $("#analyseConf1");
		ac1.draggable({ handle: "#analyseConf2",stop:function(event, ui ){
			if (parseInt(ac1.css("top"))<artDialogMaxTop){
				ac1.css('top',artDialogMaxTop+'px');
			}
		}});
		ac2.css('opacity', 0.8);
		var ac = $("#analyseConf");
		ac.css('opacity', 1);
		ac2.find("img").click(function(){
			var src = $(this).attr("src").toLowerCase();
			if (src.indexOf('21.png')>=0||src.indexOf('20.png')>=0){
				if (ac.height() == 0){
					//ac.animate({height:ac.attr("ht")+"px"},200);
					ac.css('height','');
					$(this).attr("src", src.replace('21.png', '20.png'));
				} else {
					ac.attr("ht",ac.height()).animate({height:"0"},200);
					$(this).attr("src", src.replace('20.png', '21.png'));
				}
			} else {
				var td = $($("#reportConfTable td")[0]);
				var div = $(td.find("div")[0]);
				
				if (ac2.width() == 752){
					ac2.animate({'width':752-244+'px'},200);
					ac.animate({'width':760-244+'px'},200);
					//alert(ac1.css('left'));
					ac1.animate({'left':parseInt(ac1.css('left'))+244+"px"},200);
					ac1.css('width',760-244+'px');
					td.css('display','none');
					//div.css('overflow','hidden').animate({'width':0,'margin-left':'0'},200);
					$(this).attr("src", src.replace('45.png', '44.png'));
					guideConf.showOlapList = "no";
				} else {
					ac2.animate({'width':752+'px'},200);
					ac.animate({'width':760+'px'},200);
					td.css('display','').css('width','244px');
					ac1.css('width','760px');
					ac1.animate({'left':parseInt(ac1.css('left'))-244+"px"},200,null,function(){
						//alert(td.height()-div.height());
						var h = $('#olapsBottomDiv').height();
						$('#olapsBottomDiv').css('height',td.height()-div.height()+h+"px");
					});
					//div.css('overflow','hidden').animate({'width':'160px','margin-left':'10'},200);
					$(this).attr("src", src.replace('44.png', '45.png'));
					guideConf.showOlapList = "yes";
				}
			}
		});
		
		$('body').css('overflow','auto')
//		$(window).scroll(function(){
//			if($(this).scrollTop() != 0) $(this).scrollTop(0);
//		});

		//if (guideConf.fixedTable == '') {
		//	alert("dql类型的分析报表需要指定要分析的表名称：fixedTable");
		//	return;
		//}
		if (olapStr != '') {
			aly.set(olapStr);
			var suffix = new Date().getTime();
			for (var ii = 0; ii<rqAnalyse.rpxs.length; ii++) {
				if (!rqAnalyse.rpxs[ii].reportId) rqAnalyse.rpxs[ii].reportId = "rid"+ suffix;
				else if ((rqAnalyse.rpxs[ii].reportId+"").indexOf("rid") == -1) rqAnalyse.rpxs[ii].reportId = "rid"+rqAnalyse.rpxs[ii].reportId;
				suffix++;
			}
		} else {
			var type = 0;
			if (guideConf.dataSource != '' && guideConf.ql != ''){
				type = 2;
			} else if (guideConf.dfxFile != '') {
				type = 3;
			} else if (guideConf.dfxScript != '') {
				type = 4;
			} else if (guideConf.inputFiles != '') {
				type = 5;
			} else if (guideConf.dataSource != '' && guideConf.fixedTable.length > 0) {
				type = 6;
			} else if (guideConf.sqlId != '') {
				type = 7;
			}
			if (type == 0){
				rqAnalyse = {
					currRpx:resources.guide.js75
					,dataSets:[]
					,rpxs:[]
				};
				aly.refresh();
			} else {
				rqAnalyse = {
					currRpx:resources.guide.js75
					,dataSets:[
						{
							name:"fileQuery"
							,type:type//2（dataSource及ql）/3（dfxFile及dfxParams）/4（dfxScript及dfxParams）/5（inputFiles|currTable|tableNames）/6（dql类型dataSource、tableName）							,dataId:guideConf.dataFolderOnServer+'q'+new Date().getTime()+"."+(guideConf.dataFileType=='text'?'txt':'bin')
							,dataSource:guideConf.dataSource
							,ql:guideConf.ql
							,fields:null
							,parent:null
							,dfxFile:guideConf.dfxFile
							,dfxScript:guideConf.dfxScript.replaceAll("<d_q>","\"")
							,dfxParams:guideConf.dfxParams
							,inputFiles:guideConf.inputFiles
							,currTable:guideConf.currTable
							,tableNames:guideConf.tableNames
							,tableName:guideConf.fixedTable.length>0?guideConf.fixedTable.join(","):''
							,dqlConf:{}
							,sqlId:guideConf.sqlId
							,rowCount:0
						}
					],rpxs:[
						{
							name:resources.guide.js75
							,dataSet:"fileQuery"
							//,dataSetLevel:'none/calc/where/group/having/order'
							,_hasAggr:0//'0/1'
							,_status:''//'为空表示正确，不为空是失效的具体信息'
							,type:1//1自定义分析报表/2模板报表
							,dialog:{
								open:1//0/1
								,top:100
								,left:100
								,width:500
								,height:400
							}
							,reportId:"rid"+new Date().getTime()
							,structType:1//:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表
							,template:''
							,autoCalc:1//0/1
							,isRowData:1//0/1
							,lefts:[
							]
							,tops:[]
							,fields:[]
							,where:{conf:[]}
							,calcs:[]
						}
					]
				};
			}
			olapObj.setConf(rqAnalyse);
		}
		
		analyseApi.udf.modifyOlap();
		olapObj.setConf(rqAnalyse);
		
		for (var i=0; i<_dsEs.length; i++) {
			analyseApi.setEditStyle4DataSet(_dsEs[i][0],_dsEs[i][1],_dsEs[i][2]);
		}
		
		if (rqAnalyse.rpxs.length == 0) {
			aly.refresh();
			initRpxsOver = true;
			return;
		} 

		//alert(dsi.type);
		var currRpx = rqAnalyse.currRpx;
		initRpxCount = 0;
		initRpxsOver = false;
		var lastRpxFunc = function() {
			if (initRpxCount == rqAnalyse.rpxs.length) {
				//console.log(currRpx);
				//rqAnalyse.currRpx = currRpx;
				aly.refresh();
				initRpxsOver = true;
			}
		}
		for (var i=0; i<rqAnalyse.dataSets.length; i++){
			var dsi = rqAnalyse.dataSets[i];
			if (dsi.type == 6) {
				loadLmd(dsi.dataSource);
				aly.showDataSetRpxs(dsi.name,lastRpxFunc);
				continue;
			} else if (dsi.type == 7) {
				if (dsi.fields == null) {
					var currsd = getItemByAttr(sqlDatasets,dsi.sqlId,"sqlId");
					if (currsd == null) {
						alert("not define sqlDataset ["+dsi.sqlId+"]");
						return;
					}
					olapObj.server({action:2,oper:'getTableInfo',dqlTableFilterName:guideConf.filter,sqlId:dsi.sqlId,sql:currsd.sql,dataSource:currsd.dataSource,scanRow:guideConf.scanRow,isCursor:guideConf.dataFileType=='text'?2:1},function(data){
							if (data.indexOf('error:')==0) {
								dsi._status = data.substring(6);
								return;
							}
							data = JSON.parse(data.replaceAll('<d_q>','"'));
							dsi.fields = data.fields;			
							for (var j=0; j<dsi.fields.length; j++) {
								dsi.fields[j].edit = defaultEdit.autoEditStyle(dsi.fields[j].dataType,'',dsi.fields[j].name);
							}
					});
					
				}
				aly.showDataSetRpxs(dsi.name,lastRpxFunc);
			} else {
				var ft = function(dsi) {
					var fileExist = false;
					if (dsi.dataId == '') dsi.dataId = guideConf.dataFolderOnServer+"q"+new Date().getTime()+(guideConf.dataFileType.toLowerCase()=="binary"?".bin":".txt");
					else {
						$.ajax({
							type: 'POST',
							async : false,
							url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
							data: {action:2,oper:'fileExist',file:dsi.dataId},
							success: function(data){
								if (data.indexOf('error:')==0) {
									alert(data.substring(6));
									return;
								}
								fileExist = data==1;
							}
						});
					}

					if (fileExist && guideConf.showHistoryRpx == 'yes') {
						aly.showDataSetRpxs(dsi.name,lastRpxFunc);
					} else {
						var filter = "";
						if (fileExist) {
							aly.showDataSetRpxs(dsi.name,lastRpxFunc);
						} else {
							aly.queryDataSet(1,dsi.name,function(data){
								//if (filter != '' || guideConf.currTable != '') changeFilter(filter,function(){});
								refreshStatus(dsi,function(){
									//aly.refresh();
									aly.showDataSetRpxs(dsi.name,lastRpxFunc);
								});
							});
						}
					}
				}
				ft(dsi);
			}
		}

		
		//rqAnalyse.currRpx = currRpx;
		//aly.refresh();
	}


	if (guideConf.error != '') {
		alert(guideConf.error);
	}

	$('#confFieldFloat,#calcFieldFloat').find('div').css('cursor','pointer').css('padding','2px').css('margin','2px 5px 2px 5px').hover(function(){
		$(this).css('background-color','#BBBBBB');
	},function(){
		$(this).css('background-color','');
	});

});

var sortBy = function(name,minor){
	return function(o, p){
		var a, b;
		if (typeof o === "object" && typeof p === "object" && o && p) {
			a = o[name];
			b = p[name];
			//console.log("a:" + a + ", b:"+b+",r:"+a.localeCompare(b));
			return a.localeCompare(b);
			var r = comparePinYin(a,b)>0;
			return r;
			if (a === b) {return typeof minor==='function' ?minor(o,p):0;}
			if (typeof a === typeof b) { return a < b ? -1 : 1;}
			return typeof a < typeof b ? -1 : 1;
		} else {throw ("error"); }
	}
}

//{dsName:'',lmd:null}
var lmds = [];

function loadServerFiles() {
	var data1 = "";
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'getFiles',dfxFolderOnServer:guideConf.dfxFolderOnServer,qyxFolderOnServer:guideConf.qyxFolderOnServer,olapFolderOnServer:guideConf.olapFolderOnServer,rpxFolderOnServer:guideConf.rpxFolderOnServer,inputFileFolderOnServer:guideConf.inputFileFolderOnServer,fileDataFolderOnServer:guideConf.fileDataFolderOnServer},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			data1 = data;
		}
	});
	eval(data1.replaceAll("var ",""));

}

function manageDataSet(){
	loadServerFiles();

	zIndexBak = artDialog.defaults.zIndex;
	var dlg = art.dialog({
		id : dialogCount++,
		title : resources.guide.js80,
	    content:'<div style="float:left;width:150px;border-right:1px solid lightgray;height:330px;overflow:auto;" id="dataSetsDiv">'
			+''
			+'</div><div id="currDataSet" style="float:right;width:650px;">'
			+'</div>'
	    ,ok : null
	    ,close : function() {
	    	artDialog.defaults.zIndex = zIndexBak;
	    	return true;
	    }
	    ,okVal : ""
	    ,cancelVal : ""
		,button : []
	    ,lock : true
	    ,duration : 0
	    ,width : '850px'
		,height : '340px'
		,opacity : 0.1
		,padding : '2px 2px'
		,zIndex : 41000
	});

	var dsClick = function(){
		$('#dataSetsDiv').find('div').css('font-weight','normal').css('border-bottom','');
		$(this).parent().css('font-weight','bold').css('border-bottom','1px solid lightgray');
		var ds = aly.getDataSet($(this).parent().attr('dsName'));
		var existReport = false;
		for (var j=0; j<rqAnalyse.rpxs.length; j++){
			if (rqAnalyse.rpxs[j].dataSet == ds) {
				existReport = true;
				break;
			}
		}

		var fileExist = "";
		$.ajax({
			type: 'POST',
			async : false,
			url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
			data: {action:2,oper:'fileExist',file:ds.dataId},
			success: function(data){
				if (data.indexOf('error:')==0) {
					alert(data.substring(6));
					return;
				}
				fileExist = data;
			}
		});

		var currDataSet = $('#currDataSet');
		currDataSet.html(
			'<div style="margin:5px 0px 10px;"><input id="dataSetName" type="text" style="height:26px;"><input id="saveDsBut" type="button" value="'+resources.guide.js51+'" style="float:right;margin-right:10px;"></div>'
			+'<div id="queryTypes" style="width: 540px; height:21px; border-bottom:1px solid lightgray;"><a sel=0 idx=6 href="#">DQL表</a>&nbsp;&nbsp;&nbsp;<a sel=1 idx=2 href="#">'+resources.guide.js81+'</a>&nbsp;&nbsp;&nbsp;<a sel=0 idx=3 href="#">'+resources.guide.js82+'</a>&nbsp;&nbsp;&nbsp;<a href="#" sel=0 idx=4 style="">'+resources.guide.js83+'</a>&nbsp;&nbsp;&nbsp;<a href="#" idx=5 sel=0>'+resources.guide.js84+'</a></div>'
	    	+'<div id="dbQuery"><div style="" id="dataSources"></div><div style="margin-top:10px;"><textarea id="ql" style="width:540px;height:150px;" placeholder="'+resources.guide.js85+'"></textarea></div><div style="margin-top:10px;"><input type="text" style="width:350px;height:28px;" dataId="2"><input dataIdBut="2" style="float:right;height:29px;margin-right:10px;" type="button" value="'+resources.guide.js86+'"></div></div>'
	    	+'<div style="display:none;" id="dfxFileQuery"><div style="" id="dfxFile"></div><div style="margin-top:10px;"><textarea id="dfxParams1" style="width:540px;height:150px;" placeholder="'+resources.guide.js87+'"></textarea></div><div style="margin-top:10px;"><input type="text" style="width:350px;height:28px;" dataId="3"><input dataIdBut="3" style="float:right;height:29px;margin-right:10px;" type="button" value="'+resources.guide.js86+'"></div></div>'
	    	+'<div style="display:none;" id="dfxScriptQuery"><div style="margin-top:10px;"><textarea id="dfxScript" style="width:540px;height:120px;" placeholder="'+resources.guide.js89+'"></textarea></div><div style="margin-top:10px;"><textarea placeholder="'+resources.guide.js90+'" id="dfxParams2" style="width:540px;height:50px;"></textarea></div><div style="margin-top:10px;"><input dataId="4" type="text" style="width:350px;height:28px;"><input dataIdBut="4" style="float:right;height:29px;margin-right:10px;" type="button" value="'+resources.guide.js86+'"></div></div>'
	    	+'<div style="display:none;" id="inputQuery"><div style="" id="inputFile"></div><div style="margin-top:10px;"><textarea id="inputFiles" style="width:540px;height:150px;" placeholder="'+resources.guide.js88+'"></textarea></div><div style="margin-top:10px;"><input dataId="5" type="text" style="width:350px;height:28px;"><input style="float:right;height:29px;margin-right:10px;" dataIdBut="5" type="button" value="'+resources.guide.js86+'"></div></div>'
	    	+'<div style="display:none;" id="dqlTable3"><div style="" id="dqlDataSources3"></div><div style="" id="dqlTables3"></div></div>'
		);
		$('#dataSetName').val(ds.name);

		$('#queryTypes').find('a').css('color','#41455A').css('font-weight','bold').css('text-decoration','none').click(function(){
			var idx = $(this).attr('idx');
			$('#dfxScriptQuery,#dbQuery,#dfxFileQuery,#inputQuery,#dqlTable3').css('display','none');
			$('#queryTypes').find('a').attr('sel',0).css('padding','5px').removeClass("ui-selected");
			$(this).attr('sel',1).addClass("ui-selected");
			if (idx == 2) $('#dbQuery').css('display','block');
			else if (idx == 3) $('#dfxFileQuery').css('display','block');
			else if (idx == 4) $('#dfxScriptQuery').css('display','block');
			else if (idx == 5) $('#inputQuery').css('display','block');
			else if (idx == 6) $('#dqlTable3').css('display','block');
		});

		$('#queryTypes').find('a[idx='+(ds.type==0?2:ds.type)+']').click();

		var ddss1 = guideConf.dqlDataSources;
		var ddss2 = null;
		if (ddss1.length>0) {
			ddss1 = ddss1.split(";");
			ddss2 = clone(ddss1);
			if (ds.dataSource == '') {
				ddss1.push(resources.guide.js91);
				ddss2.push("");
			}
		} else {
			ddss1 = [resources.guide.js92];
			ddss2 = [""];
		}
		var selDom8 = getSelectDom(ddss2, ddss1, ds.dataSource);
		selDom8.css({'color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','margin-top':'9px'}).attr('title','').change(function(){
		});
		$('#dqlDataSources3').append(selDom8);
		var dqlChange = function(dsName){
			$('#dqlTables3').html();
			if (dsName == '') return;
			loadLmd(dsName);
			if (dqlQuery == null) return;
			var tables = [];
			var tableNames = [];
			for (var i=0; i<mdUtils.getTables().length; i++) {
				var t = mdUtils.getTables()[i];
				if (t.fields.length <= 1) continue;
				tables.push(t.name);
				tableNames.push(t.dispName);
			}
			var selDom9 = getSelectDom(tables, tableNames, ds.tableName);
			selDom9.css({'color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','margin-top':'9px'}).attr('title','').change(function(){
			});
			$('#dqlTables3').html('').append(selDom9);
		}
		selDom8.change(function(){
			dqlChange($(this).val());
		});
		if (selDom8.val() != '') dqlChange(selDom8.val());


		var ddss = guideConf.dataSources;
		if (ddss.length>0) {
			ddss = ddss.split(";");
		}
		var selDom4 = getSelectDom(ddss, ddss, ds.dataSource);
		selDom4.css({'color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','margin-top':'9px'}).attr('title','').change(function(){
		});
		$('#dataSources').append(selDom4);
		if (ds.dqlConf != null && ds.dqlConf.srcs) {
			var returnQuery = $('<input type="button" value="'+resources.guide.js93+'" style="margin-left:5px;height:29px;">');
			returnQuery.click(function(){
				var form = $('<form method="post" accept-charset="UTF-8"></form>');
				var qp = guideConf.queryPage;
				if (qp == '') {
					if (ds.ql.indexOf("ON")>=0 || ds.ql.indexOf('.count')>=0 || ds.ql.indexOf('.avg')>=0 || ds.ql.indexOf('.sum')>=0 || ds.ql.indexOf('.min')>=0 || ds.ql.indexOf('max')>=0) qp = "raqsoft/guide/jsp/groupQuery.jsp";
					else  qp = "raqsoft/guide/jsp/detailQuery.jsp";
				}
				qp = contextPath+"/"+qp;
				form.attr('action',qp);
				form.attr('target', "_blank");
				var dq2 = new DqlQuery();
				dq2.conf = ds.dqlConf;
				//console.debug(dq2.getConfStr(ds.dataSource));
				form.append('<input type="hidden" name="qyx" value="'+dq2.getConfStr(ds.dataSource)+'">');
				$('body').append(form);
				form[0].submit();
			});
			$('#dataSources').append(returnQuery);
		}


		var selDom3 = getSelectDom(existDfx.length==0?[""]:existDfx, existDfx.length==0?[resources.guide.js94]:existDfx,"" );
		selDom3.css({'color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','margin-top':'9px'}).attr('title','').change(function(){
		});
		$('#dfxFile').append(selDom3);

		var selDom2 = getSelectDom(existInputFiles.length==0?[""]:existInputFiles, existInputFiles.length==0?[resources.guide.js95]:existInputFiles,"" );
		selDom2.css({'color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'2px','height':'27px','margin-top':'9px'}).attr('title','').change(function(){
			addInputFile($(this).val());
		});
		var addInputFile = function(v){
			if (v == '') return;
			var v2 = $("#inputFiles").val();
			if ((";"+v2+";").indexOf(";"+v+";")>=0) return;
			if (v2 != '') v2 += ";";
			v2 += v;
			$("#inputFiles").val(v2);
		}
		$('#inputFile').append(selDom2);
		addInputFile(selDom2.val());

		if (ds.dataSource) selDom4.val(ds.dataSource);
		if (ds.ql) $('#ql').val(ds.ql);
		if (ds.dfxFile) selDom3.val(ds.dfxFile);
		if (ds.dfxScript) $('#dfxScript').val(ds.dfxScript);
		if (ds.type==3&&ds.dfxParams) $('#dfxParams1').val(ds.dfxParams);
		if (ds.type==4&&ds.dfxParams) $('#dfxParams2').val(ds.dfxParams);
		if (ds.inputFiles) $('#inputFiles').val(ds.inputFiles);
		//if (ds.type==6&&ds.dataSource) $('#dfxParams2').val(ds.dfxParams);
		currDataSet.find('input[dataId]').val(ds.dataId.replaceAll(guideConf.dataFolderOnServer,""));
		//2019.03.25
		//currDataSet.find('input[dataId]').attr('placeholder', guideConf.dataFileType=='text'?'txt':'bin');
		if (fileExist == 1) currDataSet.find('input[dataIdBut]').val(resources.guide.js96);
		currDataSet.find('input[dataIdBut]').click(function(){
			saveFunc(true);
			aly.checkDataSet(ds.name);
			if (ds._status != '') {
				alert(ds._status);
				return;
			}
			ds.fields = null;
			aly.queryDataSet(1,ds.name,function(data2){
				currDataSet.find('input[dataIdBut]').val(resources.guide.js86);
				refreshStatus(ds,function(){
					olapObj.server({action:2,oper:'getTableInfo',dqlTableFilterName:guideConf.filter,dataId:ds.dataId,dataFileType:guideConf.dataFileType,scanRow:guideConf.scanRow,isCursor:guideConf.dataFileType=='text'?2:1},function(data){
							if (data.indexOf('error:')==0) {
								ds._status = data.substring(6);
								return;
							}
							data = JSON.parse(data.replaceAll('<d_q>','"'));
							ds.fields = data.fields;			
							for (var j=0; j<ds.fields.length; j++) {
								ds.fields[j].edit = defaultEdit.autoEditStyle(ds.fields[j].dataType,'',ds.fields[j].name);
							}
					});
				});
			});
		});

		var saveFunc = function(silence){
			var type = $('#queryTypes').find('a[sel=1]').attr('idx');
			var name = $.trim($('#dataSetName').val());
			if (name == '') {
				alert(resources.guide.js97);
				return false;
			}
			if (name != ds.name && aly.getDataSet(name) != null) {
				alert(resources.guide.js98);
				return false;
			}
			if (type == 2) {
				var dataSource = selDom4.val();
				var sdql = $('#ql').val();
				if(sdql == "") {
					alert('Please input sql or dql statment');
					return false;
				}
				ds.dataSource = dataSource;
				ds.ql = sdql;
			} else if (type == 3) {
				var var1 = selDom3.val();
				var var2 = $('#dfxParams1').val();
				ds.dfxFile = var1;
				ds.dfxParams = var2;
			} else if (type == 4) {
				var var1 = $('#dfxScript').val();
				var var2 = $('#dfxParams2').val();
				ds.dfxScript = var1;
				ds.dfxParams = var2;
			} else if (type == 5) {
				var var1 = $('#inputFiles').val();
				ds.inputFiles = var1;
			} else if (type == 6) {
				var var1 = $('#dqlDataSources3').find('select').val();
				var var2 = $('#dqlTables3').find('select').val();
				ds.dataSource = var1;
				ds.tableName = var2;
			}
			ds.type = type;
			if (type != 6) ds.dataId = guideConf.dataFolderOnServer+currDataSet.find('input[dataId='+type+']').val();
			for (var z=0; z<rqAnalyse.rpxs.length; z++) {
				var rpxz = rqAnalyse.rpxs[z];
				if (rpxz.dataSet == ds.name) rpxz.dataSet = name;
			}
			$('#dataSetsDiv').find('div[dsName="'+ds.name+'"]').attr('dsName',name).find('span').html(name);
			ds.name = name;
			if (silence!==true) alert(resources.guide.js99);
			return true;
		};

		$('#saveDsBut').click(saveFunc);

	}
	var delClick = function(){
		var ds = aly.getDataSet($(this).parent().attr("dsName"));
		for (var i=0; i<rqAnalyse.rpxs.length; i++) {
			if (rqAnalyse.rpxs[i].dataSet == ds.name)
			{
				alert(resources.guide.js100.replaceAll('{0}',rqAnalyse.rpxs[i].name));
				return;
			}
		}
		rqAnalyse.dataSets.remove(ds);
		$(this).parent().remove();
	}

	for (var i=0; i<rqAnalyse.dataSets.length; i++) {
		$('#dataSetsDiv').append('<div style="margin:10px 0;" dsName="'+rqAnalyse.dataSets[i].name+'"><span style="cursor:pointer;">'+rqAnalyse.dataSets[i].name+"</span><img style='float:right;vertical-align:-2px;cursor:pointer;margin:0 5px;' del=1 src='"+contextPath+guideConf.guideDir+"/img/guide/13.png'>"+'</div>');
	}
	var dss = $('#dataSetsDiv').find('span');
	dss.click(dsClick);
	$('#dataSetsDiv').find('img').click(delClick);
	if (dss.length>0) $(dss[0]).click();
	var addBut = $('<img src="'+contextPath+guideConf.guideDir+'/img/guide/9.png" style="cursor:pointer;margin:4px -1px;" title="'+resources.guide.js103+'">');
	$('#dataSetsDiv').append(addBut);
	addBut.click(function(){
		var n = resources.guide.js101;
		for (var j=1; j<100; j++){
			if (aly.getDataSet(n+j) == null) {
				n = n + j;
				break;
			}
		}

		rqAnalyse.dataSets.push({
			name:n
			,type:0//2（dataSource及ql）/3（dfxFile及dfxParams）/4（dfxScript及dfxParams）/5（inputFiles|currTable|tableNames）/6（dql类型dataSource、tableName）
			,dataSource:''
			,parent:null
			,fields:null
			,ql:''
			,dfxFile:''
			,dfxScript:''
			,dfxParams:''
			,inputFiles:''
			,currTable:''
			,tableNames:''
			,tableName:''
			,dqlConf:{}
			,dataId:guideConf.dataFolderOnServer+'q'+new Date().getTime()+"."+(guideConf.dataFileType=='text'?'txt':'bin')//缓存的数据ID
			//,dataId:guideConf.dataFolderOnServer//缓存的数据ID 2019.03.25没有默认文件名，只有路径
			,rowCount:0
		});
		var nd = $('<div style="margin:10px 0;" dsName="'+n+'"><span style="cursor:pointer;">'+n+"</span><img style='float:right;vertical-align:-2px;cursor:pointer;margin:0 5px;' del=1 src='"+contextPath+guideConf.guideDir+"/img/guide/13.png'>"+'</div>');
		$(this).before(nd);
		nd.find('span').click(dsClick).click();
		nd.find('img').click(delClick);
	});
}

function loadLmd(dsName) {
	dqlQuery = loadLmd2(dsName);
	if (dqlQuery == null) {
		lmd = null;
		cus = null;
		mdUtils = null;
		return;
	}
	lmd = dqlQuery.lmd;
	cus = dqlQuery.confUtils;
	mdUtils = dqlQuery.metadataUtils;
	//dqlQuery.setLmd(lmd);
	loadTreeEditStyles();
	return dqlQuery;
}

function loadLmd2(dsName) {
	for (var i=0; i<lmds.length; i++){
		if (lmds[i].dsName == dsName) return lmds[i].lmd;
	}
	var currLmd = null;
	var operStr = 'getLmd';
	//if(isGlmd) operStr = 'getGlmd';
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:operStr,dataSource:dsName},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			var dq = new DqlQuery();
			dq.setLmdStr(data);
			currLmd = dq;
			lmds.push({dsName:dsName,lmd:dq});
			getStricks(dq);//不太需要
		}
	});
	return currLmd;
}

//2019.6.4
function getStricks(dqlQuery){
	if (dqlQuery.lmd != null)	{
		lmds.push({dsName:guideConf.dataSource,lmd:dqlQuery});
		if (typeof(guideConf.dct)!='undefined' && guideConf.dct != "") {
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'getDct',dct:guideConf.dct},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					}
					dqlQuery.setDctStr(data);
				}
			});
		}

		if (typeof(guideConf.vsb)!='undefined' && guideConf.vsb != "") {
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'getVsb',vsb:guideConf.vsb},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					}
					dqlQuery.setVsbStr(data);
				}
			});
		}
	}
}

function downloadData(type) {
	var find = false;
	try {
		if (rqAnalyse && rqAnalyse.dataSets && rqAnalyse.dataSets.length>0 && rqAnalyse.dataSets[0].type!=6 && rqAnalyse.dataSets[0].over==1 && rqAnalyse.dataSets[0].rowCount>0) find = true;
	} catch(e) {}
	
	if (!find) {
		alert(resources.guide.js102);
		return;
	}
	
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'downloadData',type:type,dataId:rqAnalyse.dataSets[0].dataId},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			$('#downloadForm #path').val(data);
			$('#downloadForm #content').val("");
			$('#downloadForm #mode').val("");
			$('#downloadForm').submit();
		}
	});
}

