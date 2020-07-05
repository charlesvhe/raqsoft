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
	srcs : [{src:'',real:'',dimKey:'0/1',name:'',selectType:'dim/field',aggr:'',tAlias:'',errorInfo:''}]
*/
var domInfos = {items:[],fields:[],dims:[],relas:[],wheres:[],srcs:[]};

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
var removeNullGroup = true;

var domUtils = {
	toString : function(domInfosObj) {
		if (!domInfosObj) domInfosObj = domInfos;
		if (!domInfosObj.dataSource) domInfosObj.dataSource = "_db_pre_" + dbName + "_db_end_";
		return JSON.stringify(domInfosObj).replaceAll('"','<double_quote>');
		var ss = "[";
		for (var i=0; i<domInfosObj.srcs.length; i++) {
			var src = domInfosObj.srcs[i];
			if (i > 0) ss += ",";
			ss += "{src:'"+src.src+"',real:'"+src.real+"',dimKey:'"+src.dimKey+"',name:'"+src.name+"',selectType:'"+src.selectType+"',aggr:'"+src.aggr+"',tAlias:'"+src.tAlias+"',errorInfo:'"+src.errorInfo+"'}";
		}
		ss += "]";
/*
		var fs = "[";
		for (var i=0; i<domInfosObj.fields.length; i++) {
			var fDom = domInfosObj.fields[i];
			if (i > 0) fs += ",";
			fs += "{name:'" + fDom.name + "',infos:'" + fDom.infos.replaceAll("'","<single_quote>") + "',aggr:'" + fDom.aggr + "',tAlias:'"+fDom.tAlias+"'}";
		}
		fs += "]";
		var ds = "[";
		for (var i=0; i<domInfosObj.dims.length; i++) {
			var tDom = domInfosObj.dims[i];
			if (i > 0) ds += ",";
			ds += "{name:'" + tDom.name + "',dim:'" + tDom.dim + "',infos:'" + tDom.infos.replaceAll("'","<single_quote>") + "'}";
		}
		ds += "]";
*/
		var rs = "[";
		for (var i=0; i<domInfosObj.relas.length; i++) {
			var bDom = domInfosObj.relas[i];
			if (i > 0) rs += ",";
			rs += "{dim:'" + bDom.dim + "',infos:'" + bDom.infos.replaceAll("'","<single_quote>") + "',field:'" + bDom.field + "'}";
		}
		rs += "]";
		var ws = "[";
		for (var i=0; i<domInfosObj.wheres.length; i++) {
			var bDom = domInfosObj.wheres[i];
			if (i > 0) ws += ",";
			ws += "{target:'"+bDom.target+"',type:" + bDom.type + ",where:'" + bDom.where.replaceAll("'","<single_quote>") + "',whereDisp:'" + bDom.whereDisp.replaceAll("'","<single_quote>") + "',having:'" + bDom.having.replaceAll("'","<single_quote>") + "',havingDisp:'" + bDom.havingDisp.replaceAll("'","<single_quote>") + "'}";
		}
		ws += "]";
		return "{srcs:"+ss+",relas:" + rs + ",wheres:"+ws+"}";
	},
	set : function(initQyx) {
		if (initQyx && initQyx != '') {
			initQyx = initQyx.replaceAll('<double_quote>','"');
			try {
				domInfos = JSON.parse(initQyx);
				console.log("new qyx");
			} catch(e) {
				console.log(e);
				console.log("old qyx");
				console.log(initQyx);
				domInfos = eval("(" + initQyx + ")");
				var targetTables = [];
				if (domInfos.srcs) {
					for (var i=0; i<domInfos.srcs.length; i++) {
						//domInfos.srcs[i] = domInfos.srcs[i].replaceAll('<single_quote>',"'");
					}
					for (var i=0; i<domInfos.relas.length; i++) {
						domInfos.relas[i].infos = domInfos.relas[i].infos.replaceAll('<single_quote>',"'");
					}
					for (var i=0; i<domInfos.wheres.length; i++) {
						domInfos.wheres[i].conf = [];
						domInfos.wheres[i].havingConf = [];
						domInfos.wheres[i].dimConf = [];
						//domInfos.wheres[i].where = domInfos.wheres[i].where.replaceAll('<single_quote>',"'");
						//domInfos.wheres[i].whereDisp = domInfos.wheres[i].whereDisp.replaceAll('<single_quote>',"'");
						//domInfos.wheres[i].having = domInfos.wheres[i].having.replaceAll('<single_quote>',"'");
						//domInfos.wheres[i].havingDisp = domInfos.wheres[i].havingDisp.replaceAll('<single_quote>',"'");
					}
				} else {
					alert('不兼容旧的qyx文件，请重新生成查询并保存');
					domInfos = {relas:[],wheres:[],srcs:[]};
				}
			}
		} else {
			domInfos = {relas:[],wheres:[],srcs:[]};
		}
		domUtils.refresh();
	},
	getRela : function(fName, dName, currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.relas.length; i++) {
			var byObj = currDomInfos.relas[i];
			if (byObj.field == fName && byObj.dim == dName) return byObj;
		}
	},
	getDim : function(name, currDomInfos){
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.dims.length; i++) {
			if (currDomInfos.dims[i].name == name) return currDomInfos.dims[i];
		}
	},
	getWhere : function(name, currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.wheres.length; i++) {
			var byObj = currDomInfos.wheres[i];
			if (byObj.target == name) return byObj;
		}
		var o = {target:name,conf:[],havingConf:[],dimConf:[],where:'',whereDisp:'',having:'',havingDisp:''};
		domInfos.wheres.splice(domInfos.wheres.length, 0, o);
		return o;
	},
	getField : function(name,currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.fields.length; i++) {
			if (currDomInfos.fields[i].name == name) return currDomInfos.fields[i];
		}
	},
	getSrc : function(name,currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.srcs.length; i++) {
			if (currDomInfos.srcs[i].name == name) return currDomInfos.srcs[i];
		}
	},
	removeField : function(name) {
		for (var i=domInfos.relas.length-1; i>=0; i--) {
			if (domInfos.relas[i].field == name) {
				domInfos.relas.remove(domInfos.relas[i]);
			}
		}
		for (var i=domInfos.wheres.length-1; i>=0; i--) {
			if (domInfos.wheres[i].target == name) {
				domInfos.wheres.remove(domInfos.wheres[i]);
			}
		}
		domInfos.items.remove(domUtils.getField(name).infos);
		domInfos.fields.remove(domUtils.getField(name));
		domUtils.refresh();
	},
	modifyField : function(old, name) {
		for (var i=domInfos.relas.length-1; i>=0; i--) {
			if (domInfos.relas[i].field == old) {
				domInfos.relas[i].field = name;
			}
		}
		for (var i=domInfos.wheres.length-1; i>=0; i--) {
			if (domInfos.wheres[i].target == old) {
				domInfos.wheres[i].target = name;
			}
		}
		domUtils.getField(old).name = name;
		domUtils.refresh();
	},
	removeTable : function(name) {
		var baks = '{';
		var t = domUtils.getTable(name);
		baks += 'idx:' + domInfos.tables.indexOf(t) + ",name:'" + t.name + "',annexT:'" + t.annexT + "',joinType:" + t.joinType + ',bys:[';
		var count = 0;
		for (var i=domInfos.bys.length-1; i>=0; i--) {
			if (domInfos.bys[i].tAlias == name) {
				if (count > 0) baks += ',';
				baks += "{infos:'" + domInfos.bys[i].infos + "',tAlias:'" + name + "',dimAlias:'" + domInfos.bys[i].dimAlias + "'}";
				domInfos.bys.remove(domInfos.bys[i]);
				count++;
			}
		}
		baks += ']}';
		domInfos.tables.remove(t);
		colWidths[name] = null;
		return baks;
	},
	removeSrc : function(name) {
		for (var i=domInfos.relas.length-1; i>=0; i--) {
			if (domInfos.relas[i].dim == name || domInfos.relas[i].field == name) {
				domInfos.relas.remove(domInfos.relas[i]);
			}
		}
		for (var i=domInfos.wheres.length-1; i>=0; i--) {
			if (domInfos.wheres[i].target == name) {
				domInfos.wheres.remove(domInfos.wheres[i]);
			}
		}
		domInfos.srcs.remove(domUtils.getSrc(name));
		domUtils.refresh();
	},
	modifySrc : function(old, name) {
		for (var i=domInfos.relas.length-1; i>=0; i--) {
			if (domInfos.relas[i].dim == old) {
				domInfos.relas[i].dim = name;
			}
			if (domInfos.relas[i].field == old) {
				domInfos.relas[i].field = name;
			}
		}
		for (var i=domInfos.wheres.length-1; i>=0; i--) {
			if (domInfos.wheres[i].target == old) {
				domInfos.wheres[i].target = name;
			}
		}
		domUtils.getSrc(old).name = name;
		domUtils.refresh();
	},
	removeRela : function(f, d) {
		domInfos.relas.remove(domUtils.getRela(f, d));
	},
	addRela : function(f, d, infos, currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		//alert(infos);
		currDomInfos.relas[currDomInfos.relas.length] = {infos:infos, dim:d, field:f};
	},
	addSrc : function(infos) {
		var iObj = getInfosObj(infos);
		var name = onInfosUtil.generateNewFieldAlias(iObj);
		domInfos.srcs[domInfos.srcs.length] = {src:infos,real:infos,dimKey:0,name:name,selectType:'field',aggr:iObj.aggr,tAlias:'',errorInfo:''};
		domInfos.wheres.splice(domInfos.wheres.length, 0, {target:name,conf:[],havingConf:[],dimConf:[],where:'',whereDisp:'',having:'',havingDisp:''});		
		domUtils.refresh();
	},
	getDims : function(){
		var dims = [];
		for (var i=0; i<domInfos.srcs.length; i++) {
			if (domInfos.srcs[i].selectType == 'dim')
				dims[dims.length] = domInfos.srcs[i];
		}
		return dims;
	},
	getFields : function() {
		var dims = [];
		for (var i=0; i<domInfos.srcs.length; i++) {
			if (domInfos.srcs[i].selectType != 'dim')
				dims[dims.length] = domInfos.srcs[i];
		}
		return dims;
	},
	//1、看是否存在聚合方式、字段的维
	//srcs : [{src:'',real:'',dimKey:'0/1',name:'',selectType:'dim/field',aggr:'',tAlias:'',errorInfo:''}]
	check : function() {
		var srcObjs = [];
		var realObjs = [];
		
		if (domInfos.srcs.length==0) {
			relaTablesBak = [];
			onlyPksBak = [];
			generateFields();
			return;
		}
		
		//原始选出字段的所有已存在的表
		var tables = [];
		for (var i=0; i<domInfos.srcs.length; i++) {
			srcObjs[i] = getInfosObj(domInfos.srcs[i].src);
			domInfos.srcs[i].aggr = srcObjs[i].aggr;
			domInfos.srcs[i].dim = srcObjs[i].dim;
			realObjs[i] = getInfosObj(domInfos.srcs[i].real);
			if (tables.indexOf(srcObjs[i].firstTable) == -1) tables.push(srcObjs[i].firstTable);
		}

		var existAggr = false;
		var existDimKeyNoAggr = false; //非聚合维表主键
		var existNoAggr = false; //非聚合
		//
		for (var i=0; i<domInfos.srcs.length; i++) {
			domInfos.srcs[i].aggr = srcObjs[i].aggr;
			domInfos.srcs[i].dimKey = srcObjs[i].dimKey;
			
			if (srcObjs[i].aggr != '') existAggr = true;
			else {
				if (srcObjs[i].dimKey) existDimKeyNoAggr = true;
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
					byInfosUtil._getFields(tables[j], infoss, 0, srcObjs[i].lastTable, srcObjs[i].lastField,true);
					if (infoss.length == 0) break;

					var infoObj0 = getInfosObj(infoss[0]);
					if (srcObjs[i].aggr != '') {
						infoss[0] += split_2 + infoObj0.lastTable + split_1 + infoObj0.lastField + split_1 + split_1 + srcObjs[i].aggr;
						//infoObj0 = getInfosObj(infoss[z]);
					}
					reals[i] = infoss[0];

				}
				
				if (reals.length == domInfos.srcs.length) {
					for (var i=0; i<domInfos.srcs.length; i++) {
						if (realObjs[i].firstTable != tables[j]) {
							domInfos.srcs[i].real = reals[i];
							realObjs[i] = getInfosObj(domInfos.srcs[i].real);
						}
					}
					break;
				}
			}
		} else {
			for (var i=0; i<domInfos.srcs.length; i++) {
				domInfos.srcs[i].real = domInfos.srcs[i].src;
				realObjs[i] = getInfosObj(domInfos.srcs[i].real);
			}
		}
		
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
		
		byInfosUtil.refreshRela();

		var relaTables = [];
		var onlyPks = [];
		if (autoFilter) {
			var dimTables = [];
			var currTable;
			for (var i=0; i<domInfos.srcs.length; i++) {
				var srci = domInfos.srcs[i];
				if (srci.aggr != '') continue;
				if (srci.dimKey) dimTables[dimTables.length] = getInfosObj(srci.real).firstTable;
				else {
					currTable = getInfosObj(srci.real).firstTable;
					break;
				}
			}
			
			if (currTable) {
				var ts = mdUtils.getSubTables(currTable);
				if (ts.indexOf(currTable)==-1)
					ts.splice(0, 0, currTable);
				relaTables = ts;
				for (var i=0; i<relaTables.length; i++) {
					onlyPks[i] = 0;
				}
			} else if (dimTables.length>0) {
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
				
				for (var i=0; i<lmd.tables.length; i++) {
					if (relaTables.indexOf(lmd.tables[i].name) == -1) {
						relaTables[relaTables.length] = lmd.tables[i].name;
						onlyPks[onlyPks.length] = 1;
					}
				}
			}
			
			var change = false;
			for (var i=0; i<relaTables.length; i++) {
				if (relaTablesBak[i] != relaTables[i] || onlyPksBak[i] != onlyPks[i]) {
					change = true;
					break;
				}
			}
			//alert(change);
			
			if (change) {
				generateFields(relaTables,onlyPks);
				relaTablesBak = relaTables;
				onlyPksBak = onlyPks;
			}
		} else {
			if (relaTablesBak.length>0) {
				relaTablesBak=[];
				onlyPksBak=[];
				generateFields();
			}
		}
		

	},
	addTable : function(row, name, annexT, joinType){
		if (row == -1) row = domInfos.tables.length;
		domInfos.tables.splice(row, 0, {name:name,annexT:annexT,joinType:joinType});
		colWidths[name] = 120;
	},
	getFieldTables : function(f, currDomInfos){
		if (!currDomInfos) currDomInfos = domInfos;
		var fObj = domUtils.getField(f,currDomInfos);
		var ts = [];
		for (var i=0; i<currDomInfos.fields.length; i++) {
			if (fObj == currDomInfos.fields[i]) continue;
			if (ts.indexOf(currDomInfos.fields[i].tAlias) == -1) {
				ts[ts.length] = currDomInfos.fields[i].tAlias;
			}
		}
		if (ts.length != 0) {
			if (ts.indexOf(fObj.tAlias) == -1) {
				ts[ts.length] = fObj.tAlias;
			} else {
				ts[ts.length] = '新组';
			}
		}
		return ts;
	},
	getNewTableAlias : function(infos) {
		var ri = getInfosObj(infos);
		var max = 0;
		for (var i=0; i<domInfos.fields.length; i++) {
			var curr = parseInt(domInfos.fields[i].tAlias.substring(1));
			if (curr>max) max = curr;
		}
		return '组'+(max+1);		
	},
	getNames : function(currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		var names = new Array();
		for (var i=0; i<currDomInfos.srcs.length; i++) {
			names[i] = currDomInfos.srcs[i].name;
		}
		return names;
	},
	setFieldName : function(name, newName, needRefresh) {
		var fDom = domUtils.getField(name);
		var wDom = domUtils.getWhere(name);
		for (var i=0; i<domInfos.relas.length; i++) {
			if (domInfos.relas[i].field == name) {
				domInfos.relas[i].field = newName;
			}
		}
		fDom.name = newName;
		wDom.target = newName;
		if (needRefresh) domUtils.refresh();
	},
	setFieldWhere : function(idx, where, disp, pos){
		var fDom = domInfos.fields[idx];
		fDom.where = where;
		fDom.whereDisp = disp;
		fDom.wherePos = pos;
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
		for (var i=0; i<domInfos.srcs.length; i++) {
			if (domInfos.srcs[i].selectType == 'dim') dimCount++;
			else fieldCount++;
		}
		
		var tbody = $('<table border=0 style="table-layout:fixed;border:0;border-collapse:collapse;border:0px;margin:25px 25px;" cellspacing=0 cellpadding=0></table>');
		var table = $('<tbody></tbody>');
		tbody.append(table);
		var colspan = 0;
		//alert(domInfos.dims.length + "--" + domInfos.fields.length);
		if (dimCount>0) {
			colspan = dimCount+1;
		} else if (fieldCount>0) colspan = 1;
		
		if (colspan>0) {
			var row = $('<tr seq="no" style="height:30px;background-color:#F4F4F4;text-align:center;"><td style="width:30px;"></td><td><span id="clearBut" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;">全部删除</span></td><td>名称</td><td>条件</td><td colspan='+colspan+' class="srcs">信息来源</td></tr>');
			table.append(row);
			row.find('#clearBut').click(function(){
				var undo = "operations.status('" + domUtils.toString() + "')";
				domInfos.srcs = [];
				domInfos.wheres = [];
				domInfos.relas = [];
				domUtils.refresh();
				var redo = "operations.status('" + domUtils.toString() + "')";
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
			});
		}
		
		for (var i=0; i<domInfos.srcs.length; i++) {
			var si = domInfos.srcs[i];
			if (si.selectType == 'field') continue; 
			
			var row = $('<tr seq="'+i+'" style="background-color:#F9F9F9;"></tr>');
			table.append(row);

			var infoObj = getInfosObj(si.real);

			var dName = si.name;

			var td1 = $('<td style="align:center;"></td>');
			row.append(td1);

			var td2 = $('<td style="text-align:center;"></td>');
			row.append(td2);
 			var div2 = $('<div style=""></div>');
			td2.append(div2);
			var img1 = $('<span f="'+dName+'" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;">删除</span>');
			img1.click(function(e){
				var f = $(this).attr('f');
				var undo = "operations.status('" + domUtils.toString() + "')";
				domUtils.removeSrc(f);
				var redo = "operations.status('" + domUtils.toString() + "')";
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
			});

			div2.append(img1);
			
			var td3 = $('<td></td>');
			row.append(td3);
			td3.append('<span f="'+dName+'" style="padding:2px 20px 2px 2px;cursor:pointer;">' + dName + "</span>");
			td3.find('span').click(function(e){
				var f = $(this).attr('f');
				var dlg = art.dialog({
					id : dialogCount++,
					title : '修改名称',
				    content: '<input id="modifyName" style="width:120px;margin:15px;" type="text" f="'+f+'" value="'+f+'">'
				    ,ok : function() {
						var m = $('#modifyName');
				    	var n = $.trim(m.val());
				    	if (n == m.attr('f')) return true;
				    	if (n == '') {
				    		alert("名称不能为空");
				    		return false;
				    	}
				    	if (domUtils.getSrc(n)) {
				    		alert("名称已存在");
				    		return false;
				    	}
						var undo = "operations.status('" + domUtils.toString() + "')";
						domUtils.modifySrc(m.attr('f'),n);
						var redo = "operations.status('" + domUtils.toString() + "')";
						var oper = {undo:undo,redo:redo};
						operations.addOper(oper);
				    }
				    ,cancel : true
				    ,okVal : '确定'
				    ,cancelVal : '取消'
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
			var div3 = $('<div f="'+dName+'" style="margin:5px;cursor:pointer;'+(wi.where!=''?'':'color:gray;')+'" title="'+(whereDisp!=''?whereDisp:'过滤条件')+'">'+(whereDisp!=''?(whereDisp.length>20?whereDisp.substring(0,30)+'...':whereDisp):'过滤条件')+'</div>');
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
					td4j.html("<img src='"+contextPath+"/dl/img/guide/24.png' style='border:0;margin-left:2px;'/>");
				} 
			}
		}

		var firstTable = "";
		var cnt = 0;
		for (var i=0; i<domInfos.srcs.length; i++) {
			var si = domInfos.srcs[i];
			if (domInfos.srcs[i].selectType == 'dim') continue;
			var row = $('<tr seq='+(100+cnt)+' style="background-color:#FFFFFF;"></tr>');
			cnt++;
			table.append(row);

			var infoObj = getInfosObj(si.real);

			var fName = si.name;
			if (firstTable == "") firstTable = infoObj.firstTable;
			var sameTable = firstTable == infoObj.firstTable;

			if (!sameTable) sameTable = mdUtils.isAnnex(firstTable, infoObj.firstTable);
			var td1 = $('<td></td>');
			row.append(td1);

			var td2 = $('<td style="text-align:center;"></td>');
			row.append(td2);
 			var div2 = $('<div style=""></div>');
			td2.append(div2);
			var img1 = $('<span f="'+fName+'" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;">删除</span>');
			img1.click(function(e){
				var f = $(this).attr('f');
				var undo = "operations.status('" + domUtils.toString() + "')";
				domUtils.removeSrc(f);
				var redo = "operations.status('" + domUtils.toString() + "')";
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
			});

			div2.append(img1);
			
			var td3 = $('<td></td>');
			row.append(td3);
			td3.append('<span f="'+fName+'" style="padding:2px 20px 2px 2px;cursor:pointer;">' + fName + "</span>");
			td3.find('span').click(function(e){
				var f = $(this).attr('f');
				var dlg = art.dialog({
					id : dialogCount++,
					title : '修改名称',
				    content: '<input id="modifyName" style="width:120px;margin:15px;" type="text" f="'+f+'" value="'+f+'">'
				    ,ok : function() {
						var m = $('#modifyName');
				    	var n = $.trim(m.val());
				    	if (n == m.attr('f')) return true;
				    	if (n == '') {
				    		alert("名称不能为空");
				    		return false;
				    	}
				    	if (domUtils.getSrc(n)) {
				    		alert("名称已存在");
				    		return false;
				    	}
						var undo = "operations.status('" + domUtils.toString() + "')";
						domUtils.modifySrc(m.attr('f'),n);
						var redo = "operations.status('" + domUtils.toString() + "')";
						var oper = {undo:undo,redo:redo};
						operations.addOper(oper);
				    }
				    ,cancel : true
				    ,okVal : '确定'
				    ,cancelVal : '取消'
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
 			var div3 = $('<div f="'+fName+'" style="float:left;white-space:nowrap;cursor:pointer;margin:5px;'+(whereDisp!=''?'':'color:gray;')+'" title="'+(whereDisp!=''?whereDisp:'过滤条件')+'">'+(whereDisp!=''?(whereDisp.length>20?whereDisp.substring(0,30)+'...':whereDisp):'过滤条件')+'</div>');
			td5.append(div3);
			div3.click(function(){
				var f = $(this).attr('f');
				//commonWhere2(f);
				finalWhere(f,false);
			});
			
			if (dimCount>0 && si.aggr != '') {
	 			var havingDisp = whereUtils.getDisp(wi.havingConf);
				var div4 = $('<div f="'+fName+'" style="float:right;white-space:nowrap;cursor:pointer;margin:5px;'+(havingDisp!=''?'':'color:gray;')+'" title="'+(havingDisp!=''?havingDisp:'汇总值条件')+'">'+(havingDisp!=''?(havingDisp.length>20?havingDisp.substring(0,30)+'...':havingDisp):'汇总值条件')+'</div>');
				td5.append('<div style="float:left;margin:5px;"> | </div>').append(div4);
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
			var infoss = [];
			byInfosUtil._getFields(infoObj.firstTable, infoss, 0, infoObj.lastTable, infoObj.lastField,true);
			if (infoss.length == 1) {
				td4.append(infoObj.alias1);
			} else {
				var str = "";
				for (var z=0; z<infoss.length; z++) {
					var infoObjz = getInfosObj(infoss[z]);
					if (infoObj.aggr != '') {
						infoss[z] += split_2 + infoObjz.lastTable + split_1 + infoObjz.lastField + split_1 + split_1 + infoObj.aggr;
						infoObjz = getInfosObj(infoss[z]);
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
			
			
			for (var j=0; j<domInfos.srcs.length; j++) {
				if (domInfos.srcs[j].selectType == 'field') continue;
				var infoObjj = getInfosObj(domInfos.srcs[j].real);		
				
				var td44 = $('<td class="srcs"></td>');
				row.append(td44);

				if (si.aggr == '') {
					if (si.real.indexOf(domInfos.srcs[j].real) == 0) {
						fatherDim = domInfos.srcs[j].name;
						td44.html("<img src='"+contextPath+"/dl/img/guide/40.png' style='border:0;'/>");
					}
				} else {
					var dName = domInfos.srcs[j].name;
					var rela = domUtils.getRela(fName, dName);
					if (rela) {
						var div4 = $('<div style="float: left;color:blue;margin:0 10px 0 0;font-size:12px;" d="'+dName+'" f="'+fName+'"></div>');
						td44.append(div4);
						//var ri = getInfosObj(rela.infos);
						var str = "";
						var infoss = new Array();
						byInfosUtil._getDims(infoObj.firstTable, infoObjj.dim, infoss, 0, false);
						for (var z=0; z<infoss.length; z++) {
							str += '<option value="'+infoss[z]+'"'+(infoss[z]==rela.infos?' selected':'')+'>'+getInfosObj(infoss[z]).alias1+'</option>';
						}
						div4.append(str==""?"":('<select>'+str+'</select>'));
						//alert(div2.find( "select" ).length);
						div4.find( "select" ).css({'margin':'1px 0','border':'0','color':'#333333','padding':'1px'}).change(function(){
							var f = $(this).parent().attr('f');
							var d = $(this).parent().attr('d');
							var undo = "operations.status('" + domUtils.toString() + "')";
							//var r = getInfosObj(v);
							domUtils.getRela(f, d).infos = this.value;
							domUtils.refresh();
							var redo = "operations.status('" + domUtils.toString() + "')";
							var oper = {undo:undo,redo:redo};
							operations.addOper(oper);
						});//.selectBoxIt();
						//var byj = getInfosObj(rela.infos).alias1;
						//if (bys.indexOf(byj)==-1) bys[bys.length] = byj;
					} else {
						td44.append("&nbsp;");
						missing = true;
						//bys[bys.length] = "?";
					}
				}
			}
			
			td1.css('text-align','center').html((missing || (dimCount==0 && !sameTable) || (dimCount>0 && (infoObj.aggr == '' && fatherDim == ''))) ?"<img src='"+contextPath+"/dl/img/guide/11.png' style=''/>":"&nbsp;");
			if ((dimCount==0 && !sameTable) || missing) {
				td1.attr('title','无法把您所选出的信息连接起来，它们来自不同的表，且没有关联信息连接它们。');
			} else if (dimCount>0 && (infoObj.aggr == '' && fatherDim == '')) {
				td1.attr('title','目前查询方式为统计，而非查询明细数据，非统计信息相关的信息需要选择“求和”、“计数”等统计方式');
			}
		}
		
		if (colspan>0) {
			for (var i=0; i<domInfos.wheres.length; i++){
				if (domInfos.wheres[i].type != 3) continue;
				
				var row = $('<tr seq="no" style="background-color:#E0E0E0;"></tr>');
				table.append(row);
	
				var wi = domInfos.wheres[i];
	
				var td1 = $('<td style="align:center;"></td>');
				row.append(td1);
				td1.html((domInfos.dims.length>0 || firstTable != wi.target)?"<img src='"+contextPath+"/dl/img/guide/11.png' style=''/>":"&nbsp;");
				if (domInfos.dims.length>0) {
					td1.attr('title','该复杂条件针对表['+wi.target+'],多表查询将失效！');
				}
				if (firstTable != wi.target) {
					td1.attr('title','该复杂条件针对表['+wi.target+'],出现其它表查询将失效！');
				}
	
				var td2 = $('<td style="text-align:center;"></td>');
				row.append(td2);
	 			var div2 = $('<div style=""></div>');
				td2.append(div2);
				var img1 = $('<span f="'+wi.target+'" style="vertical-align:0px;cursor:pointer;margin:5px;color:#EB8110;">删除</span>');
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
	 			var div3 = $('<div t="'+wi.target+'" style="cursor:pointer;'+(wi.where!=''?'':'color:gray;')+'" title="'+(wi.where!=''?wi.whereDisp:'过滤条件')+'"><img style="vertical-align:-3px;margin:1px;cursor:pointer;" src="'+consts.relaPath + consts.imgFolder + consts.img34 + '">'+wi.where+'</div>');
				td5.append(div3);
				div3.click(function(e){
					var f = $(this).attr('f');
					var dlg = art.dialog({
						id : dialogCount++,
						title : '编辑复杂条件',
					    content: '<textarea id="modifyWhere" style="width:450px;height:180px;margin:15px;" type="text">'+wi.where+'</textarea>'
					    ,ok : function() {
							var m = $('#modifyWhere');
					    	var n = $.trim(m.val());
					    	if (n == '') {
					    		if(confirm("确定要删除条件吗？")) {
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
					    ,okVal : '确定'
					    ,cancelVal : '取消'
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

		var tdDom = $('#tableDiv').css('border','0');
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
		tdDom.droppable(bigDrop);
		if (descDim != '') {
			descDim = '<span style="">按&nbsp;</span>'+descDim+'<br><br><span style="">统计&nbsp;</span>';
			if (descField == '') descField = '<span style="font-size:16px;color:blue;">...</span>';
		} else {
			if (descField != '') {
				descField = '<span style="">查询&nbsp;</span>' + descField;
			}
		}
		tdDom.append('<div style="vertical-align:bottom;clear:both;padding:4px;">' + descDim + descField +'</div>');


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
				p.css('top',poses[insertPos]-10+'px').css('left','360px').css('display','block').attr('insertPos',insertPos).attr('seq',seq).attr('show','1');
				
				
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
					domUtils.refresh();
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

function transWhereInfo(infos, dimFieldName, isHaving) {
	var iObj = getInfosObj(infos);
	var disp = iObj.alias1;
	if (dimFieldName) disp = dimFieldName;
	var edit = null;
	//(type==3?"":("."+(type==1?iObj.expNoTableNoAggr:iObj.expNoTable))));
	if (iObj.finalType>=3) edit = {type:3,calendarType:(iObj.finalType==3?2:(iObj.finalType==4?3:1))};
	return {disp:disp,dataType:iObj.finalType,edit:edit,exp:dimFieldName?dimFieldName:(isHaving?iObj.expNoTable:iObj.expNoTableNoAggr),valueType:2,values:iObj.dim}
}

function finalWhere(f, isHaving) {
	var wDom = domUtils.getWhere(f);
	currWhereField = wDom;
	var fDom = domUtils.getSrc(f);
	var iObj = getInfosObj(fDom.real);
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
			byInfosUtil._getFields(iObj.firstTable, fields, 0,null,null,false);
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
var consts = {
	relaPath : contextPath+'/dl',
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
	//设置字段条件
	setFieldWhere : function(row, where, disp, pos) {
		domUtils.setFieldWhere(row, where, disp, pos);
		domUtils.refresh();
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

/*
by on操作规则
	1、增加第一个字段，主键放到by中，自动生成on。
	2、增加一个by
		21、on已在维列表。
		22、on不在维列表。
*/

var IDMark_Switch = "_switch",
IDMark_Icon = "_ico",
IDMark_Span = "_span",
IDMark_Input = "_input",
IDMark_Check = "_check",
IDMark_Edit = "_edit",
IDMark_Remove = "_remove",
IDMark_Ul = "_ul",
IDMark_A = "_a",
selectOutName = '选出',
leftJoinName = '向左对齐';
var CONST = {
	
};
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
var confTmp = '';
function setConfig(isEnd, conf) {
	confTmp += conf;
	if (isEnd == 0) return;

	$('.dl_c1').css({'background-color':consts.color3});
	$('.dl_c2').css({'color':consts.color5});//弹出窗口中确定按钮的边框，字色
	$('.dl_c3').css({'color':consts.color6});
	$('.dl_c4').css({'background-color':consts.color7});
	
	$('.dl_c5').css({'border':'1px solid '+consts.color8});//表格线颜色
	$('.dl_c6').css({'border-top':'0','border-left':'0','border-right':'1px solid '+consts.color8,'border-bottom':'1px solid '+consts.color8});
	$('.dl_c7').css({'border-top':'0','border-left':'0','border-right':'0','border-bottom':'1px solid '+consts.color8});
	$('.dl_c10').css({'border-top':'0','border-right':'0','border-left':'1px solid '+consts.color8,'border-bottom':'1px solid '+consts.color8});
	
	$('.dl_c8').css({'color':consts.color9});//表头字颜色
	$('.dl_c9').css({'border':'1px solid '+consts.color10});//区域边框色
	$('.dl_c11').css({'background-color':consts.color11});//查询按钮背景色
	$('.dl_c12').css({'background-color':consts.color20});//操作表格背景色

	$('.dl_img1').css({'background-image':'url('+consts.relaPath + consts.imgFolder + consts.img3 + ')'});
	$('.dl_img2').attr('src',consts.relaPath + consts.imgFolder + consts.img4);
	$('.dl_img3').attr('src',consts.relaPath + consts.imgFolder + consts.img5);
	$('.dl_img4').css({'background-image':'url('+consts.relaPath + consts.imgFolder + consts.img6 + ')'});
	$('.dl_img5').css({'background-image':'url('+consts.relaPath + consts.imgFolder + consts.img7 + ')'});
	$('.dl_img6').attr('src',consts.relaPath + consts.imgFolder + consts.img8);
	$('.dl_img7').attr('src',consts.relaPath + consts.imgFolder + consts.img9);
	$('.dl_img8').attr('src',consts.relaPath + consts.imgFolder + consts.img10);
	$('.dl_img12').attr('src',consts.relaPath + consts.imgFolder + consts.img28);
	$('.dl_img9').attr('src',consts.relaPath + consts.imgFolder + consts.img11);
	$('.dl_img10').attr('src',consts.relaPath + consts.imgFolder + consts.img12);
	$('.dl_img11').attr('src',consts.relaPath + consts.imgFolder + consts.img13);
	
	lmd = eval(confTmp);
	lmd.editStyles[lmd.editStyles.length] = {name:'_txt',type:1};
	lmd.editStyles[lmd.editStyles.length] = {name:'_calendar',type:3,calendarType:1};//calendarType定义在Calendar.java中，TYPE_DATETIME=1、TYPE_DATE=2、TYPE_TIME=3、TYPE_MONTH=4
	lmd.editStyles[lmd.editStyles.length] = {name:'_datetime',type:3,calendarType:1};
	lmd.editStyles[lmd.editStyles.length] = {name:'_date',type:3,calendarType:2};//年月日
	lmd.editStyles[lmd.editStyles.length] = {name:'_time',type:3,calendarType:3};
	lmd.editStyles[lmd.editStyles.length] = {name:'_yearmonth',type:3,calendarType:4};//年月
	lmd.editStyles[lmd.editStyles.length] = {name:'_year',type:3,calendarType:5};//年
	lmd.editStyles[lmd.editStyles.length] = {name:'_month',type:3,calendarType:6};//月
	lmd.editStyles[lmd.editStyles.length] = {name:'_day',type:3,calendarType:7};//日
	lmd.editStyles[lmd.editStyles.length] = {name:'_nyrsfm',type:3,calendarType:8};//年月日时分秒
	for (var i=lmd.tables.length-1; i>=0; i--) {
		if (lmd.tables[i].middle && !lmd.tables[i].dispName) {
			lmd.tables.remove(lmd.tables[i]);
		}
	}
	initPage();
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
function generateFields(tables,onlyPks) {
	var classTable = $('#classTableSelect').val();
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
	for (var i=0; i<lmd.tables.length; i++) {
		//if (lmd.tables[i].type == 2) continue;
		if (lmd.tables[i].middle) continue;
		//if (lmd.tables[i].fields.length==1) continue;
		if (lmd.tables[i].hide == 1) continue;
		var t = lmd.tables[i].name;
		var ta = lmd.tables[i].dispName;
		var onlyPk = 0;
		if (tables && tables.length>0) {
			var idx = tables.indexOf(t);
			if (idx==-1) continue;
			onlyPk = onlyPks[idx];
		} 

		var show = true;
		var stObj = null;
		if (classTable!=null && classTable!='') {
			show = false;
			Out:
			for (var k=0; k<lmd.classTables.length; k++) {
				if (lmd.classTables[k].name == classTable) {
					for (var m=0; m<lmd.classTables[k].tables.length; m++) {
						stObj = lmd.classTables[k].tables[m];
						if (stObj.name == ta) {
							//alert(stObj.fields.length);
							show = true;
							break Out;
						}
					}
				}
			}
		}
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
			var currTable = mdUtils.getTable(ts[j].name);
			if (currTable.hide == 1) continue;
			var tj = currTable.name;
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
		currIndex++;
		zNodes[zNodes.length] = {id:currIndex, isParent:true, pId:0, name:dispNames, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/2.png",infos:t,destTable:t,tName:'',fName:'',load:false,onlyPk:onlyPk}		
	}

	var treeDiv = $('#contentDiv');
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

					$('.zTreeDragUL').css('z-index',10).attr('infos',infos);
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
				for (var i=0; i<treeNode.children.length; i++) {
					if (expendNodes.indexOf(treeNode.children[i].infos)>=0)
						treeObj.expandNode(treeNode.children[i], true, false, false, true);
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
				var iObj = getInfosObj(infos);
				if (iObj.lastField == '') return;
				if (iObj.aggr != '') return;
				fObj = mdUtils.getField(iObj.lastTable, iObj.lastField);
				if (fObj == null) fObj = mdUtils.getFK(iObj.lastTable, iObj.lastField);
			
				var aggrs = [];
				if (fObj.type == 1) {
					aggrs[aggrs.length] = {aggr:'sum',name:'求和',aliases:''};
				}
				if (fObj.type == 1) {
					aggrs[aggrs.length] = {aggr:'avg',name:'平均',aliases:''};
				}
				aggrs[aggrs.length] = {aggr:'count',name:'计数',aliases:''};
				aggrs[aggrs.length] = {aggr:'max',name:'最大',aliases:''};
				aggrs[aggrs.length] = {aggr:'min',name:'最小',aliases:''};
				aggrs[aggrs.length] = {aggr:'countd',name:'值计数',aliases:''};

				if (aggrs) {
					for (var i=0; i<aggrs.length; i++) {
						if ($("#diyBtn_"+aggrs[i].aggr+"_"+treeNode.id).length>0) return;
						var editStr = $("<a id='diyBtn_"+aggrs[i].aggr+"_" +treeNode.id+ "' style='padding:0 3px;'>"+getAggrName(aggrs[i].aggr)+"</a>");
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
	treeObj = $.fn.zTree.getZTreeObj("contentDiv");
	var nodes = treeObj.getNodes();
	for (var i=0; i<nodes.length; i++) {
		treeObj.expandNode(nodes[i], true, false, false, true);
		//if (expendNodes.indexOf(nodes[i].infos)==-1) {
		//	expendNodes[expendNodes.length] = nodes[i].infos;
		//}
	}
	//var nodes1 = treeObj1.getNodes();
	//if (nodes1.length>0) {
	//	treeObj1.selectNode(nodes1[nodes1.length-1]);
	//}
	
	var showT = $('#fieldShowStyle')[0].value == '分类-数据项 ';
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
		allChilds.sort(sortBy("name"));
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
	if (fName && fName!=''){
		//alert(fName);
		//alert(tName + "---" + fName);
		fObj = mdUtils.getField(tName, fName);
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
				var isParent = mdUtils.getTable(tName1).fields.length > 1;
				var n = treeObj.addNodes(node, [{id:currIndex, isParent:isParent, pId:pId, name:namei, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/3.png",infos:infos1,destTable:tName1,tName:'',fName:'',load:false}], true);
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
			if (currTable.hide == 1) continue;
			var ti = currTable.name;
			var ta = currTable.dispName;
			for (var j=0; j<currTable.fields.length; j++) {
				var fObj = currTable.fields[j];
				if (fObj.hide == 1) continue;
				if (fObj.pk == 1 && node.level>0) continue;
				if (fObj.pk != 1 && node.onlyPk == 1) continue;
	
				var targetTable = fObj.destTable;
				var canOpen = false;
				if (targetTable) {
					canOpen = true;
				} else {
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
				
				currIndex++;
				var n = treeObj.addNodes(node, [{id:currIndex, isParent:canOpen, pId:pId, name:fa, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/"+(dimObj==null?"f":"d")+".png",infos:infos1,destTable:targetTable,tName:ti,fName:fj,load:false}], true);
				if (canOpen && expendNodes.indexOf(infos1)>=0) {
					loadSub(n);
				} 

				if (fObj.aggrs) {
					for (var p=0; p<fObj.aggrs.length; p++) {
						currIndex++;
						var namei = ""+fObj.aggrs[p].name+"";
						if (fObj.aggrs[p].aliases && fObj.aggrs[p].aliases != '') namei += "<span style='color:gray'>,"+fObj.aggrs[p].aliases+"</span>";
						var infos1 = infos + split_2 + ti + split_1 + fj + split_2 + ti + split_1 + fj + split_1 + split_1 + fObj.aggrs[p].aggr;
						var n2 = treeObj.addNodes(node, [{id:currIndex, isParent:false, pId:node.id, name:namei, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/8.png",infos:infos1,destTable:'',tName:ti,fName:fj,load:false}], true);
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
					var n = treeObj.addNodes(node, [{id:currIndex, isParent:true, pId:pId, name:fa, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/4.png",infos:infos1,destTable:currTable.fks[j].destTable,tName:ti,fName:fj,load:false}], true);
					if (expendNodes.indexOf(infos1)>=0) {
						loadSub(n);
						//treeObj.expandNode(n[0], true, false, false, false);
					}

					if (fObj.aggrs) {
						for (var p=0; p<fObj.aggrs.length; p++) {
							currIndex++;
							var namei = ""+fObj.aggrs[p].name+"";
							if (fObj.aggrs[p].aliases && fObj.aggrs[p].aliases != '') namei += "<span style='color:gray'>,"+fObj.aggrs[p].aliases+"</span>";
							var infos1 = infos + split_2 + ti + split_1 + fj + split_2 + ti + split_1 + fj + split_1 + split_1 + fObj.aggrs[p].aggr;
							var n2 = treeObj.addNodes(node, [{id:currIndex, isParent:false, pId:node.id, name:namei, open:false, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/8.png",infos:infos1,destTable:'',tName:ti,fName:fj,load:false}], true);
						}
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
	errorMsg: "放错了...请选择正确的类别！",
	curTarget: null,
	curTmpTarget: null,
	noSel: function() {
		try {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		} catch(e){}
	},
	dragTree2Dom: function(treeId, treeNodes) {
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
		if (treeNodes[0].level == 0 && $('#fieldShowStyle')[0].value == '分类-数据项 ') {
			for (var z=0; z<treeNodes[0].children.length; z++) {
				ss[z] = treeNodes[0].children[z].infos;
			}
		} else {
			var aObj = $("#" + treeNodes[0].tId + "_a");
			ss[0] = treeNodes[0].infos;
			var aggr = aObj.attr('aggr');
			//alert(aggr);
			if (aggr != '') {
				var iObj = getInfosObj(ss[0]);
				ss[0] = iObj.str + split_2 + iObj.lastTable + split_1 + iObj.lastField + split_1 + split_1 + aggr;
			}
			//ss[0] = ss[0] + split_2 + Math.random();
		}
		
		var undo = "operations.status('" + domUtils.toString() + "')";
		for (var z=0; z<ss.length; z++) {
			var infos = ss[z];
			if (infos) {
				infos = getInfosObj(infos);
			}
			var fObj = mdUtils.getField(infos.lastTable, infos.lastField, true);
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
				var ii = getInfosObj(domInfos.fields[i].infos);
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
			alert(target.text());
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


function generateDimFields() {
	return false;
	var classTable = $('#classTableSelect').val();
	//TODO 排序
	var list = $('#dimsDiv');//$('<div id="contentDiv"></div>');
	list.html('<div style="padding-top:0px;float:left;width:100%;"><input type="button" value="维度选择" disabled=true style="color:lightgray;width:100px;height:28px;border: 0;margin: 2px 1px; background-color: #fff;background-repeat:no-repeat; background-image:url(\''+contextPath+'/dl/img/dl/dim_title.png\')"></div><div style="clear:both;"></div>');
	//color:#000;;
	for (var i=0; i<lmd.dims.length; i++) {
		var alias = lmd.dims[i].dispName;
		var show = true;
		if (classTable!=null && classTable!='') {
			show = false;
			for (var k=0; k<lmd.classTables.length; k++) {
				if (lmd.classTables[k].name == classTable) {
					if (lmd.classTables[k].dims.indexOf(alias) >= 0) {
						show = true;
						break;
					}
				}
			}
		}
		if (!show) continue;
		if (alias == '' || !alias) alias = lmd.dims[i].name;
		addDim(list, lmd.dims[i].name, alias);
	}
}

//自动合并中间表到同维表
var unionmt = true;

function changeUnionMT() {
	unionmt = !unionmt;
	$('#unionMiddleTable').css('background-image','url(' + contextPath + '/dl/img/dl/' + (unionmt?'zjb-union.png':'zjb-union-no.png') + ')').attr('title',unionmt?'自动合并同维中间表':'不自动合并同维中间表');
	if (currShowTable) {
		reloadSubs(currShowTable, $('#fieldsDiv'), true);
	}
}

function addDim(container, dim, alias) {
	if (!alias) alias = dim;
	var dimObj = mdUtils.getDim(dim);
	
	var canOpen = false;//mdUtils.getSubTables(dimObj.table).length > 0;
	var openImg = canOpen?('<img src="'+consts.relaPath + consts.imgFolder + consts.img15 + '">'):'';
	//if (dimObj == null) openImg = '<img id="openImg" t=1 src="'+consts.relaPath + consts.imgFolder + consts.img16 + '">';
	var fImg = consts.img17;
	var exp = alias;
	var conts = '<div id="conts" style="overflow:hidden;margin-bottom:1px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;padding:0px;padding-left:10px;border:0px;"></div>';
	var curr = $('<div style="padding:0px;margin:0px;border:0px;" class="item"><h3 id="dimItem" style="outline:0px;border:1px solid ' + consts.color12 + ';border-bottom:0;border-radius:0px;height:26px;background-image:url('+consts.relaPath + consts.imgFolder + consts.img26 + ');color:' + consts.color23 + ';margin:0px;margin-top:0px;" dim="' + dim + '" title="' + dim + '" t="' + dimObj.table + '"><div style="padding:4px;"><span><img src="'+consts.relaPath + consts.imgFolder + fImg + '"></span>' + exp + '<div style="float:right;padding:0 2px 0 0;" id="openImg">' + openImg + '</div>' + '</div></h3>' + conts + '</div>');
	
	container.append(curr);
	curr.find('h3').css('font-weight','normal').css('cursor','move').draggable({
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
			c.css('z-index','10001').css('opacity', 0.4);
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
/*
	type 1：加载附表；  2：加载定位式
*/

function reloadSubs(targetTable, contents, refreshAnyway) {
	reloadSubs2(1, targetTable, contents, refreshAnyway)
}

//{name:'',exp:'',table:''}
//var calcFields = new Array();



var viewedTables = new Array();
function loadFields(table){
	if (mdUtils.getTable(table, true).type == 2) return;
	var idx = viewedTables.indexOf(table);
	if (idx >= 0)  viewedTables.remove(table);
	viewedTables[viewedTables.length] = table;
	//$('#mytabs').tabs('select',2);
	selectTab(3);
	reloadSubs(table, $('#fieldsDiv'));
}

var filterDom = null;//

function changeShowStyle(v) {
	var but = $('#fieldShowStyle');
	if (v == '数据项[分类]') {
		but[0].value = '分类-数据项 ';
		$.cookie('guideShowType', '1', { expires: 77777 });
	} else {
		but[0].value = '数据项[分类]';
		$.cookie('guideShowType', '2', { expires: 77777 });
	}
	generateFields(relaTablesBak, onlyPksBak);
	//filterEvent(filterDom.val());	
}


function changeShowDim(v) {
	var but = $('#fieldShowDim');
	if (v == '1') {
		but[0].value = '0';
		$('#fieldShowPK').val('0').attr('checked', false).attr('disabled', true);
	} else {
		but[0].value = '1';
		$('#fieldShowPK').attr('disabled', false);
	}
	filterEvent(filterDom.val());	
}


function changeShowPK(v) {
	var but = $('#fieldShowPK');
	if (v == '1') {
		but[0].value = '0';
	} else {
		but[0].value = '1';
	}
	filterEvent(filterDom.val());	
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
		if (d.attr('id') == 'dimItem') return true;
		if (d.attr('infos')) return true;
		return false;
		//return d.attr('id') == 'dimItem';
	},
	drop: function(event, ui) {
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
				var alias = onInfosUtil.generateNewDimAlias(dim);
				
				var undo = "operations.status('" + domUtils.toString() + "')";
				domUtils.addDim(alias, dim);
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
	T1;T2,F2;T3,F3,L3;T3,F4;T5,F5,L5,T6,F6,L6,A6
	T1.F2.F3#L3.F4.F5.L5.F6
*/
var infoCache = {}
function getInfosObj(info,isExp) {
	if (isExp) {
		//alert(info);
		var result = "";
		var t = '';
		var f = '';
		var l = '';
		var ss = info.split(".");
		for (var i=0; i<ss.length; i++) {
			if (i == 0) {
				t = ss[0];
				result += t;
			} else {
				var sss = ss[i].split('#');
				f = sss[0];
				var fObj = mdUtils.getField(t,f,true);
				if (!fObj) {
					var ts = mdUtils.getAnnexTables(t);
					if (ts == null) {
						ts = new Array();
						ts[0] = {name:t,pks:[]};
					}
					//alert(ts.length);
					for (var j=0; j<ts.length; j++) {
						t = ts[j].name;
						fObj = mdUtils.getField(t,f,true);
						if (fObj) break;
					}
				}
				if (!fObj) {
					alert("钻取暂不支持计算字段");
					return;
				}
				//alert(t + "--" + fObj)
				
				result += split_2 + t + split_1 + f;
				if (sss.length>1) {
					result += split_2 + t + split_1 + f + split_1 + sss[1];

					var destLevels = mdUtils.getFieldDestLevels(fObj);
					if (destLevels && destLevels.length>0) {
						for (var k=0; k<destLevels.length; k++) {
							if (sss[1] == destLevels[k].name) {
								var tf = destLevels[k].dest.split('.');
								t = tf[0];
								break;
							}
						}
					}
				} else {
					if (fObj.dim) t = mdUtils.getDim(fObj.dim).table;
				}
			}
		}
		info = result;
		//info = info + split_2 + Math.random();
	}
	if (info.lastIndexOf(split_2)<info.lastIndexOf(split_1)) {
		//info = info + split_2 + Math.random();
		//alert(info);
	}
	var obj = infoCache[info];
	if (obj) {
	} else {
		var s = info.split(split_2);
		obj = {
			str : info 
			,dim : ''//最终的维
			,firstTable : ''
			,lastTable : ''
			,lastField : ''
			,exp : ''//广义字段表达式
			,expNoTable : ''
			,expNoTableNoAggr : ''
			,alias1 : ''//针对该广义字段，来自字典的别名，格式和表达式一样
			,alias2 : ''//针对该广义字段，来自词典的别名
			,aggr : ''
			,aggrName : ''
			,dimKey : false// true：维表.主键 ； false：表.外键.主键
			,finalType : '' //aggr==''时，是字段类型、否则计数会导致所有类型转换成数值
		};
		var tObj = null;
		var fObj = null;
		for (var i=0; i<s.length; i++) {
			var ss = s[i].split(split_1);
			if (i == 0) {
				obj.firstTable = ss[0];
				obj.exp = ss[0];
				tObj = mdUtils.getTable(ss[0]);
				var tdn = tObj.dispName;
				if (!tdn) tdn = tObj.name;
				obj.alias1 = tdn;
			} else {
				if (ss.length>3) {
					var idx = obj.exp.indexOf('.');
					obj.exp = obj.exp.substring(0,idx+1)+ss[3]+"("+obj.exp.substring(idx+1)+")";
					obj.aggrName = getAggrName(ss[3]);
					obj.alias1 = obj.alias1 + getAggrName(ss[3]);// + "#" + ss[2];
					obj.aggr = ss[3];
				} else if (ss.length>2) {
					obj.exp = obj.exp + "#" + ss[2];
					obj.alias1 = obj.alias1 + "." + ss[2];;// + "#" + ss[2];
				} else {
					obj.exp = obj.exp + "." + ss[1];
					fObj = mdUtils.getField(ss[0],ss[1]);
					var dn = fObj.dispName;
					if (!dn) dn = fObj.name;
					obj.alias1 = obj.alias1 + "." + dn;
				}
			}
			if (i == s.length-1) {
				obj.lastTable = ss[0];
				if (ss.length>1) {
					obj.lastField = ss[1];
					obj.finalType = fObj.type;
					if (ss.length != 4) {
						if (ss.length==3) {
							var destLevels = mdUtils.getFieldDestLevels(fObj);
							if (destLevels && destLevels.length>0) {
								for (var k=0; k<destLevels.length; k++) {
									if (destLevels[k].name == ss[2]) {
										var sss = destLevels[k].dest.split(".");
										var dimObj = mdUtils.getDimByTableField(destLevels[k].dest);
										obj.dim = dimObj.name;
										obj.finalType = mdUtils.getField(sss[0],sss[1]).type;
										break;
									}
								}
							}
						} else if (fObj.dim) obj.dim = fObj.dim;
						
					}
				}
			}
		}
		if (s.length == 2 && obj.firstTable == obj.lastTable) {
			var fObj = mdUtils.getField(obj.lastTable,obj.lastField);
			obj.dimKey = fObj.pk==1;
		}
		if(obj.aggr == 'count' || obj.aggr == 'countd') obj.finalType = 1;
		obj.expNoTable = obj.exp.substring(obj.firstTable.length+1);
		
		var idx = obj.expNoTable.indexOf("(");
		if (idx>0) obj.expNoTableNoAggr = obj.expNoTable.substring(idx+1,obj.expNoTable.length-1);
		else obj.expNoTableNoAggr = obj.expNoTable;
		
		infoCache[info] = obj;
	}
	return obj;
}

var onInfosUtil = {
	generateNewDimAlias : function(dim) {
		var aliass = domUtils.getNames();
		var dimObj = mdUtils.getDim(dim);
		var alias = dim;
		if (dimObj) {
			if (dimObj.dispName) alias = dimObj.dispName;
			else alias = dimObj.name;
		}
		alias = alias.replaceAll('.','');
		if (aliass.indexOf(alias) >= 0) {
			for (i=1; i<1000; i++) {
				if (aliass.indexOf(alias + i) == -1) {
					alias = alias + i;
					break;
				}
			}
		}
		return alias;
	},
	generateNewFieldAlias : function(infoObj,currDomInfos) {
		var fObj = mdUtils.getField(infoObj.lastTable, infoObj.lastField, true);
		var _alias = '';
		//if (infoObj.dim != '') {
		//	_alias = mdUtils.getDim(infoObj.dim).dispName;
		//} else {
			var fObj = mdUtils.getField(infoObj.lastTable, infoObj.lastField, true);
			_alias = fObj.dispName;
		//}
		if (!_alias) _alias = fObj.name;
		if (infoObj.aggr != '') {
			var find = false;
			if (fObj.aggrs && fObj.aggrs.length>0) {
				for (var i=0; i<fObj.aggrs.length; i++) {
					if (fObj.aggrs[i].aggr == infoObj.aggr) {
						_alias = fObj.aggrs[i].name;
						find = true;
						break;
					}
				}
			}
			if (!find) {
				_alias += "" + infoObj.aggrName;
			}
		}

		var aliass = domUtils.getNames(currDomInfos);
		if (aliass.indexOf(_alias) >= 0) {
			for (var i=1; i<1000; i++) {
				if (aliass.indexOf(_alias+i) == -1) {
					_alias = _alias+i;
					break;
				}
			}
		}
		return _alias;
	}
}

function filterEvent(v) {
	
}


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
	$("body").css('overflow','hidden').html(doms);

	//<div style='padding-top:0px;float:left;'><input type="button" id="fieldShowStyle" onclick='changeShowStyle(this.value);' value="数据项[分类]" style="color:#F8F8F8;width:102px;height:28px;border: 0;margin: 2px 1px; background-color: #fff;background-repeat:no-repeat; background-image:url('<%=cp %>/dl/img/dl/tree_mode1.png')"></div>
	//<div style='float:left;padding:1px 10px;margin-top:1px;' id="hideNoRela" title=''></div>
	//<div style="display:none;float:right;width:90px;padding-right:5px;margin-top:1px;" id="classTableDiv"></div>

	if (lmd.classTables.length>0 && 3==3) {
		var values = [''];
		var disps = ['全部分类'];
		for (var i=0; i<lmd.classTables.length; i++) {
			var classTable = lmd.classTables[i];
			values[values.length] = classTable.name;
			disps[disps.length] = classTable.name;
		}
		var selDom4 = getSelectDom(values, disps, '');
		selDom4.attr('id','classTableSelect').css('width','110px').css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'4px'}).attr('title','').change(function(){
			changeClassTable();
		});
		$('#fieldShowStyle').parent().css('width','110px');
		$('#hideNoRela').css('width','100px');
		$('#classTableDiv').css('display','block').html('').append(selDom4);
	} else {
		$('#fieldShowStyle').parent().css('width','165px');
		$('#hideNoRela').css('width','165px');
	}
	
	var selDom1 = getSelectDom([2,3,4,5,6,7,8], ['自动探测2层','自动探测3层','自动探测4层','自动探测5层','自动探测6层','自动探测7层','自动探测8层'], 4);
	selDom1.css({'background-color':'#41455A','border':'0','color':'#bbb','padding':'4px','margin-top':'9px'}).attr('title','自动探测数据项的深度层数').change(function(){
		findLevel=this.value;
	});
	$('#autoFindLevel').append(selDom1);
	var selDom2 = getSelectDom([0,1], ['全部数据项','仅显示相关'], 1);
	selDom2.css({'margin':'1px 0','color':'#333333','background-color': '#F8F8F8','border': '1px solid #E4E4E4','padding':'4px','width':'100%'}).attr('title','').change(function(){
		autoFilter = this.value==1;
		domUtils.check();
	});
	$('#hideNoRela').append(selDom2);
	var selDom3 = getSelectDom([0,1], ['保留空分组','去除空分组'], 1);
	selDom3.css({'background-color':'#41455A','border':'0','color':'#bbb','padding':'4px','margin-top':'9px'}).attr('title','').change(function(){
		removeNullGroup = this.value == 1;
	});
	$('#exceptNullGroup').append(selDom3);
	//<div style='float:right;padding:4px 10px;margin-top:1px;' id="" title=''><input id='autoFilterBut' style='vertical-align:-2px;' onclick=';' checked type='checkbox'><span onclick="changeAutoFilter()" style="cursor:pointer;">自动隐藏无关数据项</span></div>
	//<div style='float:right;padding:4px 10px;margin-top:1px;' id="" title=''><input id='removeNullGroupBut' style='vertical-align:-2px;' onclick='changeRemoveNullGroup();' checked type='checkbox'><span onclick="changeRemoveNullGroup()" style="cursor:pointer;">去除空分组</span></div>
	
	generateFields();
	generateDimFields();
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

	/*
	topLayout = $('body').css('color', consts.color1).layout({
		resizable : true
		, spacing_open:7  // ALL panes
		, spacing_closed:7 // ALL panes
		, west : {
			spacing_open:8,
			spacing_closed:8,
			size : "0",
 			resizable : true,
			closable:false
			//initClosed:true
		}
	});
	*/
	middleLayout = $('.mainPanel').layout({
	
		spacing_open: 0
		,spacing_closed: 0
		, north: {
			spacing_open:0
			,spacing_closed:0
			,size: "50"
			,paneSelector: ".ui-layout-toolbar"
 			,resizable : true
			,closable:false
			,initHidden:false
		}
		, center: {
			paneSelector: "#innerLayout"
			,onresize : function() {
				innerLayout.resizeAll();
				if (editMode == 0) {
					var td = $('#tableDiv');
					$('#dqlDiv').css('height',td.css('height')).css('width',td.css('width'));
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
	innerLayout = $('#innerLayout').layout({
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
					$('#dqlDiv').css('height',td.css('height')).css('width',td.css('width'));
				}
				//$("#tableDiv").css('height',"100%").css('width','100%');
				//$('#tabs-1,#tabs-2,#tabs-3').css('height', parseInt($('#mytabs').css('height'))-40+'px').css('padding','1px');
			}
		}
		, west : {
			spacing_open:0
			,spacing_closed:0
			,paneSelector: "#mytabs",
			size : "350",
			minSize : "350",
			onresize : function() {
				$('#tabs-1,#tabs-2,#tabs-3,#tabs-4').css('height', parseInt($('#mytabs').css('height'))-5+'px').css('padding','1px');
				$('#contentDiv').css('height', parseInt($('#mytabs').css('height'))-80+'px');
				$('#tabs-2').css('width', parseInt($('#mytabs').css('width'))-0+'px');
			}
		}
	});

	$('#mytabs').css('overflow','hidden').css('border','0');
	//topLayout.toggle("west");
	$('.ui-state-disabled').removeClass('ui-state-disabled');
	$('#tabs-1,#tabs-2,#tabs-3,#tabs-4').css('height', parseInt($('#mytabs').css('height'))-5+'px').css('padding','1px');
	$('#contentDiv').css('height', parseInt($('#mytabs').css('height'))-80+'px');

	var dropList = null;
	var helperWidth = null;


	$(".fields-north").disableSelection();

	$(document).bind('mousedown selectstart', function(e) {
	    return $(e.target).is('input, textarea, select, option');
	});	

	//$( "#pageMode" ).button();
	operations.refreshButs();
	//if (escalc) $('#resultSetButs, #pageMode').css('display','none');
	
	changeRSButs(false);
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
	generateDimFields();
	generateFields();
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
var byInfosUtil = {
	canAdd : function(infos, onDim) {
		var onDimObj = mdUtils.getDim(onDim);
		var byDim = getInfos(infos, 3);
		if (onDim == byDim) return true;
		var byDimObj = mdUtils.getDim(byDim);
		if (byDimObj && byDimObj.destLevels && byDimObj.destLevels.length>0) {
			for (var i=0; i<byDimObj.destLevels.length; i++) {
				if (byDimObj.destLevels[i].dest == onDimObj.table + '.' + onDimObj.field) return true;
			}
		}
		return false;
	},
	refreshRela : function() {
		for (var i=domInfos.relas.length-1; i>=0; i--) {
			var src1 = domUtils.getSrc(domInfos.relas[i].field);
			var src2 = domUtils.getSrc(domInfos.relas[i].dim);
			var valid = false;
			if (src1 && src1.selectType == 'field' && src2 && src2.selectType == 'dim') {
				var fObj = getInfosObj(src1.real);
				var rObj = getInfosObj(domInfos.relas[i].infos);
				if (fObj.firstTable == rObj.firstTable) valid = true;
			}
			if (!valid) domInfos.relas.remove(domInfos.relas[i]);
		}

		for (var i=0; i<domInfos.srcs.length; i++) {
			var dObj = domInfos.srcs[i];
			if (dObj.selectType == 'field') continue;
			var dInfo = getInfosObj(dObj.real);
			for (var j=0; j<domInfos.srcs.length; j++) {
				var fObj = domInfos.srcs[j];
				if (fObj.selectType == 'dim') continue;
				if (domUtils.getRela(fObj.name, dObj.name) != null) continue;
				
				var fInfo = getInfosObj(fObj.real);
				var infoss = new Array();
				byInfosUtil._getDims(fInfo.firstTable, dInfo.dim, infoss, 0, false);
				if (infoss.length > 0) {
					//alert(2);
					//var idx = infoss.indexOf(dObj.infos);
					//if (idx==-1) idx = 0;
					domUtils.addRela(fObj.name, dObj.name, infoss[0], domInfos);
				}
			}
		}
	},
	_getFields : function(parent, fields, levelCount, table, field, containPk) {
		if (levelCount == findLevel) return;
		levelCount++;
		var p = getInfosObj(parent);
		var subTables = [];
		
		var targetTable = p.firstTable;
		if (levelCount > 1) {
			var dimObj = mdUtils.getDim(mdUtils.getField(p.lastTable, p.lastField).dim);
			if (!dimObj) return;
			targetTable = dimObj.table;
		}
		var ts = mdUtils.getAnnexTables(targetTable);
		if (ts == null) {
			ts = new Array();
			ts[0] = {name:t,pks:[]};
		}
		//alert(ts.length);
		for (var j=0; j<ts.length; j++) {
			var t = ts[j].name;
			var tObj = mdUtils.getTable(t);
			var fs = tObj.fields.concat(tObj.fks);
			var pkCount = 0;
			for (var i=0; i<fs.length; i++) {
				var fObj = fs[i];
				if (fObj.pk == 1) pkCount++;
			}
			//fks:[{name:'fk_城市',hide:0,destTable:'城市',desc:'',dispName:'fk_城市',format:'',fields:['城市编码']}]}
			for (var i=0; i<fs.length; i++) {
				var fObj = fs[i];
				//alert(fObj.fields);
				if (fObj.fields && fObj.fields.length == 1) continue;
				if (levelCount==1) {
					var infos = parent + split_2 + t + split_1 + fs[i].name;
					if ((!table) || (table == t && field == fs[i].name)) 
						fields[fields.length] = infos;
					if (fObj.pk != 1 || pkCount>1) 
						subTables[subTables.length] = infos;
				} else {
					if (fObj.pk==1 && !containPk) continue;
					var infos = parent + split_2 + t + split_1 + fs[i].name;
					//alert(infos);
					if ((!table) || (table == t && field == fs[i].name)) 
						fields[fields.length] = infos;
					if (fObj.pk != 1 || pkCount>1)
						subTables[subTables.length] = infos;
				}

				var destLevels = mdUtils.getFieldDestLevels(fObj);
				if (destLevels && destLevels.length>0) {
					for (var k=0; k<fObj.destLevels.length; k++) {
						var dimObj = mdUtils.getDimByTableField(destLevels[k].dest);
						var tf = destLevels[k].dest.split('.');
						var infosk = infos + split_2 + tf[0] + split_1 + tf[1] + split_1 + destLevels[k].name;
						subTables[subTables.length] = infosk;
						if ((!table) || (table == tf[0] && field == tf[1])) 
							fields[fields.length] = infosk;
					}
				}
				
				//if (fObj.destTable && fObj.destTable != '') {
					
				//}
			}
		}
		//alert(levelCount + "--" + subTables.length + "--" + relations.length);
		for (var i=0; i<subTables.length; i++) {
			byInfosUtil._getFields(subTables[i], fields, levelCount, table, field, containPk);
		} 
	},

	_getDims : function(parent, dim, fields, levelCount, first) {
		if (levelCount == findLevel) return;
		levelCount++;
		var p = getInfosObj(parent);
		var subTables = [];
		
		var targetTable = p.firstTable;
		if (levelCount > 1) {
			var dimObj = mdUtils.getDim(mdUtils.getField(p.lastTable, p.lastField).dim);
			targetTable = dimObj.table;
		}
		var ts = mdUtils.getAnnexTables(targetTable);
		if (ts == null) {
			ts = new Array();
			ts[0] = {name:t,pks:[]};
		}
		//alert(ts.length);
		for (var j=0; j<ts.length; j++) {
			var t = ts[j].name;
			var tObj = mdUtils.getTable(t);
			var fs = tObj.fields.concat(tObj.fks);
			for (var i=0; i<fs.length; i++) {
				var fObj = fs[i];
				//alert(fObj.fields);
				if (fObj.fields && fObj.fields.length == 1) continue;
				if (fObj.dim==''||!fObj.dim) continue;
				if (levelCount==1) {
					var infos = parent + split_2 + t + split_1 + fs[i].name;
					if (fObj.dim == dim) {
						fields[fields.length] = infos;
						//alert(fields.length);
						if (first) return;
					}
					if (fObj.pk==1 && ts[j].pks.length==1) {
					} else subTables[subTables.length] = infos;
				} else {
					if (fObj.pk==1 && ts[j].pks.length==1) continue;
					var infos = parent + split_2 + t + split_1 + fs[i].name;
					//alert(infos);
					if (fObj.dim == dim) {
						fields[fields.length] = infos;
						//alert(fields.length);
						if (first) return;
					}
					subTables[subTables.length] = infos;
				}

				var destLevels = mdUtils.getFieldDestLevels(fObj);
				if (destLevels && destLevels.length>0) {
					for (var k=0; k<destLevels.length; k++) {
						var dimObj = mdUtils.getDimByTableField(destLevels[k].dest);
						var tf = destLevels[k].dest.split('.');
						var infosk = infos + split_2 + tf[0] + split_1 + tf[1] + split_1 + destLevels[k].name;
						subTables[subTables.length] = infosk;
						if (dimObj.name==dim) {
							fields[fields.length] = infosk;
							if (first) return;
						}
					}
				}
			}
		}
		//alert(levelCount + "--" + subTables.length + "--" + relations.length);
		for (var i=0; i<subTables.length; i++) {
			byInfosUtil._getDims(subTables[i], dim, fields, levelCount, first);
		} 
	}
};

function getCurrTitle() {
	return document.title;
}

var currDispTable = '';
function getDimCallback(container, dispTable, where, dim, over) {
	if (dispTable == 'none') {
		return;
	}
	if (over == 0) {
		currDispTable += dispTable;
		return;
	}
	dispTable = currDispTable + dispTable;
	currDispTable = '';
	if (dispTable.indexOf('error:') == 0) {
		alert(dispTable.substring(5));
		return;
	}
	dispTable = dispTable.split("r;q");
	var codes = dispTable[0].split('r,q');
	var disps = null;
	if (dispTable.length > 1) disps = dispTable[1].split('r,q');
	//var type = currWhereField._type;
	var dimObj = mdUtils.getDim(dim);
	//var typeObj = conditionConfig.getType(type);
	//if (typeObj == null) {
	//	alert('unavailable type[' + type + ']!');
	//	return;
	//}
	//等于:2,3,4,5_;_OR
	var items = new Array();
	var opt;
	if (where.indexOf('middleTable') == -1 && where.indexOf('fkwhere') == -1 && where != '' && where.indexOf('_;_') >= 0) {
		var as = where.split('_;_')[0].split(':');
		opt = as[0];
		items = as[1].split(',');
	}
	
	$('#dimWhereReverse')[0].checked = opt == '不等于';

	var p = container;
	p.html('');
	
	/*
	//模拟数据实现功能
	var datas = [["001r,q华北","001001r,q河北","001001001r,q石家庄"],["001r,q华北","001001r,q河北","001001002r,q保定"],["002r,q东北","002001r,q黑龙江","002001001r,q哈尔滨"]];
	for (var i=0; i<datas[0].length; i++) {
		var sel = '<select multiple="multiple" style="margin:0 5px;width:140px;height:190px;">'
		var vs = new Array();
		for (var j=0; j<datas.length; j++) {
			var code = datas[j][i];
			if (vs.indexOf(code) >= 0) continue;
			vs[vs.length] = code;
			var disp = code;
			if (code.indexOf('r,q')>0) {
				var code = code.split('r,q');
				disp = code[1] + '(' + code[0] + ')';
				code = code[0];
			}
			sel += '<option value="' + code + '"' + (items.indexOf(code)>=0?' selected':'') + '>' + disp + '</option>';
			//if (items.indexOf(data[i]) >= 0) p.append('<li class="selectedfilter">' + data[i] + '</li>');
			//else p.append('<li class="">' + data[i] + '</li>');
		}
		sel += '</select>';
		sel.change(function(){
			alert();
		});
		sel = $(sel);
		p.append(sel);
	}
	return;
	*/
	
	if (container.attr('id') == "whereValues" || container.attr('id') == "whereDimValues" ) {
		p.html('');
		for (var i=0; i<codes.length; i++) {
			var disp = codes[i];
			if (disps != null) {
				disp = disps[i] + '(' + codes[i] + ')';
			}
			p.append('<div style="padding:3px;margin:2px;float:left;" value="' + codes[i] + '">'+disp+'</div>');
		}
		p.append('<div style="clear:both;"></div>');
		container.find('div').css('cursor','pointer').click(function(){
			var sel = $(this).attr('sel') == 1;
			$(this).css('background-color',sel?'':'lightgray').css('font-weight',sel?'':'bold').attr('sel',sel?0:1);
			var value = '';
			var divs = $(this).parent().find('div[sel=1]');
			for (var i=0; i<divs.length; i++) {
				if (i>0) value += ",";
				value += $(divs[i]).attr('value');
			}
			$(this).parent().parent().find('#wv input').val(value);
		});
		return;
	}
	
	var ht = 220;
	if (dimObj.destLevels && dimObj.destLevels.length>0) {
		var level = '<select style="font-size:12px;width:99%;padding:0 0 2px 0;margin:1px 4px;height:22px;color:' + consts.color22 + '" id="whereToLevels"><option value="">选择导出层</option>';
		var hasOption = false;
		for (var j=0; j<dimObj.destLevels.length; j++) {
			//var lObj = mdUtils.getLevel(fObj.destLevels[i]);
			
			var destDim = mdUtils.getDimByTableField(dimObj.destLevels[j].dest);
			if (!destDim.sql) continue; 
			hasOption = true;
			//var namej = destDim.name;
			//if (destDim.dispName && destDim.dispName != "") namej = destDim.dispName;
			var namej = dimObj.destLevels[j].name;
			level += '<option formula="' + dimObj.destLevels[j].formula + '" value="' + dimObj.destLevels[j].dest/*.split(".")[0]*/ + '">' + namej + '</option>'
		}
		level += '</select>';
		if (hasOption) {
			ht = 180;
			level = $(level);
			p.append(level);
			p.append('<select style="font-size:12px;width:99%;padding:0 0 2px 0;margin:1px 4px;height:22px;color:' + consts.color22 + '" id="wtlv"></select>');
			level.change(function(){
				//TODO
				var lcf = function(lvs){
					var wtlv = $('#wtlv');
					var htm = '<option value="">全部</option>';
					if (lvs.indexOf('error:') == 0) {
						return;
					}
					if (lvs != '') {
						lvs = lvs.split("r;q");
						var codes = lvs[0].split('r,q');
						var disps = lvs[1].split('r,q');
						for (var i=0; i<codes.length; i++) {
							htm += '<option value="' + codes[i] + '">' + disps[i] + '</option>';
						}
					}
					wtlv.html(htm);
				};
				if (this.value != '') {
					var ld = mdUtils.getDimByTableField(this.value);
					
					jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:4,oper:'dispTable',sql:ld.sql,dbName:currDBName}, lcf);
				} else {
					lcf("");
				}
			});
			p.find('#wtlv').change(function(){
				var dimO = mdUtils.getDimByTableField($('#whereToLevels').val());
				var fObj = mdUtils.getField(dimO.table, dimO.field);
				var type = fObj.type;
				if (!type) type = 2;
				if (type != 1) v = "'" + v + "'";
				var formula = $('#whereToLevels option:selected').attr('formula');
				var v = this.value;
				formula = formula.replaceAll('?',dimObj.code) + "=" + v;
				var sql = dimObj.sql;
				if (sql.indexOf('ORDER BY') >= 0) sql = sql.replaceAll(" ORDER BY",' WHERE '+formula + ' ORDER BY');
				else sql = sql + ' WHERE '+formula;
				jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:4,oper:'dispTable',sql:sql,dbName:currDBName}, function(lvs){
					var wtlv = $('#dimWhereSelect');
					var htm = '';
					if (lvs.indexOf('error:') == 0) {
						return;
					}
					lvs = lvs.split("r;q");
					var codes = lvs[0].split('r,q');
					var disps = lvs[1].split('r,q');
					for (var i=0; i<codes.length; i++) {
						htm += '<option value="' + codes[i] + '">' + disps[i] + '</option>';
					}
					wtlv.html(htm);
				});
			});
		}
	}
	
	var sel = '<select id="dimWhereSelect" multiple="multiple" style="margin:1px 4px;width:99%;height:' + ht + 'px;">'
	for (var i=0; i<codes.length; i++) {
		var disp = codes[i];
		if (disps != null) {
			disp = disps[i] + '(' + codes[i] + ')';
		}
		sel += '<option value="' + codes[i] + '"' + (items.indexOf(codes[i])>=0?' selected':'') + '>' + disp + '</option>';
		//if (items.indexOf(data[i]) >= 0) p.append('<li class="selectedfilter">' + data[i] + '</li>');
		//else p.append('<li class="">' + data[i] + '</li>');
	}
	sel += '</select>';
	sel = $(sel);
	p.append(sel);
}

var currWhereField = null;

var currQuery = null;

function generateSql(currDomInfos, silence, top) {
	if (currDomInfos.srcs.length == 0) {
		if (!silence) alert('至少要选出一个字段！');
		return false;
	}
	if (!top) top = 100000;
	var tts = [];
	var diffTable = false;
	var aTable = "";
	
	/*
	if (currDomInfos.dims.length == 0) {
		var wheres = [];
		for (var i=0; i<currDomInfos.fields.length; i++) {
			
			var fObji = currDomInfos.fields[i];
			var wDomi = domUtils.getWhere(fObji.name, currDomInfos);
			if (wDomi.where != '')
		}
	}
	*/
	
	var fields = domUtils.getFields();
	var dims = domUtils.getDims();
	
	for (var i=0; i<fields.length; i++) {
		var fObji = fields[i];
		
		var fatherDim = "";
		if (fObji.aggr == '' && dims.length>0) {
			for (var j=0; j<dims.length; j++) {
				if (fObji.real.indexOf(dims[j].real) == 0) {
					fatherDim = dims[j].name;
					break;
				}
			}
			if (fatherDim == "") {
				if (!silence) alert('目前查询方式为统计，而非查询明细数据，非统计信息相关的信息需要选择“求和”、“计数”等统计方式');
				return false;
			}
			fObji.tAlias = "";
			continue;
		}
		
		//var wDomi = domUtils.getWhere(fObji.name, currDomInfos);
		var ii = getInfosObj(fObji.real);
		aTable = ii.firstTable;
		var tAlias = "";
		if (i == 0) {
			tAlias = "T" + tts.length;
			tts[tts.length] = tAlias;
			
			//wDomi.where = .where.
			
		} else {
			for (var j=0; j<i; j++) {
				var fObjj = fields[j];
				if (fObjj.aggr == '' && dims.length>0) continue;
				var ij = getInfosObj(fObjj.real);
				var sameTable = ii.firstTable == ij.firstTable;
				if (!sameTable) diffTable = true;
				//var sameWhere = wDomi.where == domUtils.getWhere(fObjj.name, currDomInfos).where;
				var sameBy = true;
				for (var z=0; z<dims.length; z++) {
					if (domUtils.getRela(fObji.name,dims[z].name,currDomInfos).infos != domUtils.getRela(fObjj.name,dims[z].name,currDomInfos).infos) {
						sameBy = false;
						break;
					}
				}
				if (sameTable && sameBy/* && sameWhere*/) {
					tAlias = fObjj.tAlias;
					break;
				}
			}
			if (tAlias == "") {
				tAlias = "T" + tts.length;
				tts[tts.length] = tAlias;
			}
		}
		fObji.tAlias = tAlias;
	}
	
	for (var i=0; i<fields.length; i++) {
		var fObji = fields[i];
		var ii = getInfosObj(fObji.real);
		if (fObji.aggr == '' && dims.length>0) {
			for (var j=0; j<fields.length; j++) {
				var fObjj = fields[j];
				if (fObjj.tAlias == '') continue;
				var ij = getInfosObj(fObjj.real);
				if (ii.firstTable == ij.firstTable) {
					fObji.tAlias = fObjj.tAlias;
					break;
				}
			}	
		}
	}	
	
	var tWhere = '';
	if (dims.length == 0) {

		/*
		if (diffTable) {
			if (!silence) alert('两组以上不能关联上的数据，必须通过相同的维连接起来才能查询！');
			return false;
		} else if (tts.length > 1) {
			if (!silence) alert('被查询的字段有多种条件，请设置成相同条件再查询！');
			return false;
		}
		*/

		for (var i=0; i<currDomInfos.wheres.length; i++) {
			if (currDomInfos.wheres[i].type == 3) {
				if (aTable != currDomInfos.wheres[i].target) {
					alert('该复杂条件只针对表['+currDomInfos.wheres[i].target+'],删除该条件或重新选择查询字段！');
					return false;
				} 
				tWhere = currDomInfos.wheres[i].where;
			}
		}
	}
	
	//var currDomInfos = domInfos;
	var select='',on='',from='',having='',orderby='';
	
	var tableAnnexs = new Array();
	var tableAliass = new Array();
	var joins = new Array();
	var tableWheres = new Array();
	var tableBys = new Array();
	var attrs = new Array();

	var fields2 = new Array();
	var orderBys = new Array();
	var orderFields = new Array();
	var resultFields = new Array();
	var having = "";
	var dims2 = new Array();
	var dimWheres = "";
	
	var hasOn = dims.length>0;
	for (var i=0; i<fields.length; i++) {
		var fDom = fields[i];

		if (!isNaN(fDom.name[0])) {
			if (!silence) alert('[' + fDom.name + ']名称不能以数字开头:');
			return false;
		}
		var iObj = getInfosObj(fDom.real);
		var exp = fDom.tAlias + "." + iObj.expNoTable;
		//if (fDom.aggr != '') exp = fDom.tAlias + "." + fDom.aggr + "(" + iObj.expNoTable + ")";
		fields2[i] = exp + " " + fDom.name;
		//tableAnnexs.indexOf(iObj.firstTable);
		var tidx = tableAliass.indexOf(fDom.tAlias);
		if (tidx == -1) {
			tidx = tableAnnexs.length;
			tableAnnexs[tableAnnexs.length] = iObj.firstTable;
			tableAliass[tableAliass.length] = fDom.tAlias;
			tableWheres[tidx] = [];
			if (tWhere != '') {
				tableWheres[tidx][tableWheres[tidx].length] = tWhere;
			}
		}
		var wDom = domUtils.getWhere(fDom.name,currDomInfos);
		
		/*
		if (wDom && wDom.where != '') {
			if (!wDom._type) {
				dealDim(fDom.name,currDomInfos);
			}
			var where = wDom.where;
			if (where.indexOf("w,w")>=0) {
				where = getSqlWhere(wDom.where, false).replaceAll(iObj.firstTable+".",fDom.tAlias+".");
			} else {
				where = conditionConfig.transfer(wDom._type, wDom.where, wDom._dimType, wDom._dimExp);
				where = where.replaceAll('_x_', fDom.tAlias + "." + iObj.expNoTable);
			} 
			
			if (tableWheres[tidx].indexOf(where) == -1) tableWheres[tidx][tableWheres[tidx].length] = where;			
		}
		if (dims.length>0 && wDom && wDom.having != '') {
			if (!wDom._havingType) {
				dealDim(fDom.name,currDomInfos);
			}
			var where = conditionConfig.transfer(wDom._havingType, wDom.having, wDom._dimType, wDom._dimExp);
			where = where.replaceAll('_x_', exp);
			if (having != '') having += ' AND ';
			having += '(' + where + ')';
		}
		*/
		if (wDom && (wDom.conf.length>0 || wDom.where != '')) {
			var where = whereUtils.getExp(wDom.conf, fDom.tAlias+".", 1);
			if (where == '') {
				if (wDom.where.indexOf("w,w")>=0) where = getSqlWhere(wDom.where, false).replaceAll(iObj.firstTable+".",fDom.tAlias+".");
				else if (wDom.where != '') where = wDom.where;
			}
			
			//where = where.replaceAll('_x_', fDom.tAlias + "." + iObj.expNoTableNoAggr);
			if (tableWheres[tidx].indexOf(where) == -1) tableWheres[tidx][tableWheres[tidx].length] = where;			
		}
		if (dims.length>0 && wDom && wDom.havingConf.length>0) {
			var where = whereUtils.getExp(wDom.havingConf, fDom.tAlias+".", 2);
			//where = where.replaceAll('_x_', exp);
			if (having != '') having += ' AND ';
			having += '(' + where + ')';
		}
	}
	
	for (var i=0; i<dims.length; i++) {
		var dDom = dims[i];
		//var iObj = getInfosObj(fDom.infos);
		dims2[dims2.length] = dDom.dim + " " + dDom.name;
		for (var j=0; j<fields.length; j++) {
			var fDom = fields[j];
			if (fDom.aggr == '') continue;
			var rela = domUtils.getRela(fDom.name, dDom.name,currDomInfos);
			if (!rela) {
				alert("维来源不能缺失！");
				return;
			}
			var iObj = getInfosObj(rela.infos);
			var tidx = tableAliass.indexOf(fDom.tAlias);
			if (tableBys[tidx]==null) tableBys[tidx] = [];
			var exp = fDom.tAlias + "." + iObj.expNoTable;
			if (tableBys[tidx].indexOf(exp) == -1)
				tableBys[tidx][tableBys[tidx].length] = exp;
		}
		
		var wDom = domUtils.getWhere(dDom.name,currDomInfos);
		if (wDom && wDom.dimConf.length>0) {
			var where = whereUtils.getExp(wDom.dimConf,"",3);
			//where = where.replaceAll('_x_', );
			if (dimWheres != '') dimWheres += ' AND ';
			dimWheres += '(' + where + ')';
		}
		if (removeNullGroup) {
			if (dimWheres != '') dimWheres += ' AND ';
			dimWheres += '(' + dDom.name + ' is not null)';
		}
	}

	for (var i=0; i<fields2.length; i++) {
		if (i>0) select += ",";
		select += fields2[i];
	}
	for (var i=0; i<dims2.length; i++){
		if (i>0) on += ",";
		on += dims2[i];
	}
	for (var i=0; i<tableAnnexs.length; i++){
		if (i>0) from += " JOIN ";
		from += tableAnnexs[i] + " " + tableAliass[i];
		var wi = "";
		for (var j=0; j<tableWheres[i].length; j++) {
			if (j>0) wi += " AND ";
			wi += tableWheres[i][j];
		}
		if (wi != "") from += " WHERE " + wi;
		var bi = "";
		if (tableBys[i] != null) {
			for (var j=0; j<tableBys[i].length; j++) {
				if (j>0) bi += ",";
				bi += tableBys[i][j];
			}
			if (bi != "") from += " BY " + bi;
		}
	}
	if (having != "") having = " HAVING " + having;
	if (on != "") on = " ON " + on;
	if (dimWheres != "") dimWheres = " WHERE " + dimWheres;
	//top = " TOP "+top;
	top = "";
	return "SELECT"+top+" " + select + on + dimWheres + " FROM " + from + having;  
}

function dealDim(target,currDomInfos) {
	var wDom = domUtils.getWhere(target,currDomInfos);
	currWhereField = wDom;
	var sDom = domUtils.getSrc(target,currDomInfos);
	//var fDom = domUtils.getField(target,currDomInfos);
	var iObj = getInfosObj(sDom.real);
	var fObj = null;
	var t1=t5=false;
	var t2=t3=true;
	var dim = '';
	var dimObj = null;
	var dimExp = '';
	var dimType = 0;
	var type = 2;
	var edit = '';
	var aggr = '';
	var tab = 3;
	
	if (sDom) {
		fObj = mdUtils.getField(iObj.lastTable, iObj.lastField);                                                                      
		dim = fObj.dim;
		if (dim && dim != '') dimObj = mdUtils.getDim(dim);
		aggr = sDom.aggr;
		type = fObj.type;
		wDom._type = type;
		if (aggr == 'count' || aggr == 'countd') type = 1;
	} else {
		//alert(target);
		dim = sDom.dim;
		dimObj = mdUtils.getDim(dim);
		fObj = mdUtils.getField(dimObj.table, dimObj.field);
		type = fObj.type;
		wDom._type = type;
	}
	if (dimObj && dimObj.exp && dimObj.dt > 0) {
		dimExp = dimObj.exp;
		dimType = dimObj.dt;
	}
	wDom._dim = dim;
	wDom._dimType = dimType;
	wDom._dimExp = dimExp;
	wDom._havingType = type;

}

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

function downloadTxt() {
	//$("#saveFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=txt&pageId=" + pageId;
	var dql = generateSql(domInfos, false, 1000000000);
	if (!dql) return;

	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath + "/DLServlet?d=" + new Date().getTime());
	form.attr('target', '_self');
	//form.append('<input type="hidden" name="rid" value="'+data+'">');
	form.append('<input type="hidden" name="action" value="2">');
	form.append('<input type="hidden" name="oper" value="txt">');
	form.append('<input type="hidden" name="dql" value="'+dql+'">');
	form.append('<input type="hidden" name="dbName" value="'+dbName+'">');
	$('body').append(form);
	form[0].submit();
	
}

function downloadGex() {
	//$("#saveFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=txt&pageId=" + pageId;
	var dql = generateSql(domInfos, false, 1000000000);
	if (!dql) return;

	var gex = "d"+new Date().getTime();
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'gex',dql:dql,dbName:currDBName,gex:gex},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			window.open(contextPath+"/gexTmp/"+gex+".gex");
		}
	});
}


function openGex() {
	//$("#saveFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=txt&pageId=" + pageId;
	var dql = generateSql(domInfos, false, 100000);
	if (!dql) return;

	var gex = "d"+new Date().getTime();
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'gex',dql:dql,dbName:currDBName,gex:gex},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			window.open(contextPath+"/esCalc.jsp?gex=gexTmp/"+gex+".gex");
		}
	});
}

function submitQuery() {
	//if ($('#queryBut').attr('src').indexOf('-h') > 0) return;
	var dql = generateSql(domInfos);
	if (!dql) return;
	
	
	
	var dataId = "q"+new Date().getTime();	
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath+dataPage);
	form.attr('target', '_blank');
	form.append('<input type="hidden" name="dataId" value="'+dataId+'">');
	form.append('<input type="hidden" name="ql" value="'+dql+'">');
	form.append('<input type="hidden" name="dataSource" value="'+currDBName+'">');
	form.append('<input type="hidden" name="hideWhere" value="1">');
	
	//form.append('<input type="hidden" name="dql" value="select * from 雇员">');
	//form.append('<input type="hidden" name="dataSource" value="HSQL">');
	
	//form.append('<input type="hidden" name="srcFiles" value="D:/data/workspace/input/WebRoot/raqsoft/inputFiles/userData/7.1.3.b;D:/data/workspace/input/WebRoot/raqsoft/inputFiles/userData/7.1.4.b">');
	
	
	$('body').append(form);
	form[0].submit();

	/*
	var qid = "q"+new Date().getTime();	
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'query',dql:dql,dbName:currDBName,qid:qid},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
		}
	});
	*/
}

function dfxQuery(create, qyx, execTime){
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath+reportPage);
	form.attr('target', '_blank');
	//form.append('<input type="hidden" name="rid" value="'+data+'">');
	form.append('<input type="hidden" name="dql" value="'+dql+'">');
	form.append('<input type="hidden" name="dataSource" value="'+dbName+'">');
	$('body').append(form);
	form[0].submit();
}


function doQuery(create, qyx, execTime){
	//if ($('#queryBut').attr('src').indexOf('-h') > 0) return;
	//var fields = "name_,_dim_,_sql_;_";
	// "tops_;_lefts_;_aggrs"
	var dql = generateSql(domInfos);
	if (!dql) return;
	/*
	var report = "";
	for (var i=0; i<domInfos.dims.length; i++) {
		if (i>0) report += "_,_";
		report += domInfos.dims[i].name;
	}
	for (var i=0; i<domInfos.fields.length; i++) {
		if (report!='') report += "_,_";
		report += domInfos.fields[i].name;
	}
	*/
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath+reportPage);
	form.attr('target', '_blank');
	//form.append('<input type="hidden" name="rid" value="'+data+'">');
	form.append('<input type="hidden" name="dql" value="'+dql+'">');
	form.append('<input type="hidden" name="dataSource" value="'+dbName+'">');
	$('body').append(form);
	form[0].submit();
}

function dfxReport(){
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'showTxtReport'},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			
		}
	});
}


function clearDimWhereSelected() {
	$('#dimWhereSelect option').removeAttr('selected');
}

/*
{
	dql:""
	,sql:{sql:"",arg:[]}
	,on:[{dim:"",alias:""}]
	,where:""
	,from:[{table:"",alias:'',by:["",""},where:"",join:""]
	,select:[{field,"",from:"",aggr:"",alias:"",table:"",dim:""}]
	,having:""
	,order:""
}
*/

function generateDqlFromJSON(def){
	var dql = "SELECT ";
	for (var i=0; i<def.select.length; i++) {
		if (i>0) dql += ",";
		dql += def.select[i].from + "." + (def.select[i].aggr==""?def.select[i].field:(def.select[i].aggr+"("+def.select[i].field+")")) + " " + def.select[i].alias;
	}
	if (def.on.length>0) {
		dql += " ON ";
		for ( var i=0; i<def.on.length; i++ ) {
			if (i>0) dql += ",";
			dql += def.on[i].dim + " " + def.on[i].alias;
		}
		if (def.where != '') dql += " WHERE " + def.where;
	}
	dql += " FROM ";
	for (var i=0; i<def.from.length; i++) {
		if (i>0) dql += " " + def.from[i-1].join + " ";
		dql += def.from[i].table + " " + def.from[i].alias;
		if (def.from[i].by.length>0) {
			dql += " BY ";
			for (var j=0; j<def.from[i].by.length; j++) {
				if (j>0) dql += ",";
				dql += def.from[i].by[j];
			}
		}
		if (def.from[i].where != '') dql += " WHERE " + def.from[i].where;
	}
	
	if (def.having != '') dql += " HAVING " + def.having;
	if (def.order != '') dql += " ORDER BY " + def.order;
	return dql;
}

function drill(){
	var title = $(this).attr('title');
	if (title) {
		var ss = title.split('<;>');
		if (ss.length == 3) {
			
			$(this).attr('trueValue',ss[2]);
			var fieldName = ss[0].replace(',','');
			$(this).attr('field',fieldName);
			$(this).attr('show',ss[1]);
			if (ss[1] == 0) $(this).css('display','none');
			
			if (domInfos.sql && domInfos.on.length>0) {
				for (var j=0; j<domInfos.select.length; j++) {
					if (domInfos.select[j].alias == $(this).attr('field')) {
						$(this).attr('table',domInfos.select[j].from).css('cursor','pointer').html("<a href='javascript:void(0);'>"+$(this).html()+"</a>").click(function(){
							var tds = $(this).parent().find('td');
							var headTds = $($(this).parent().parent().find('tr')[1]).find('td');
							doDrillQuery(tds, headTds,$(this).attr('table'));
						});
						break;
					}
				}
			}
		} else {
			$(this).attr('dims',title);
			$(this).dblclick(doDrill);
		}
	}
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
			var iObj = getInfosObj(tn+"."+sj.field,true);
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

function doDrillQuery(tds, headTds, table) {
	var whereExp = "";
	
	var fromObj = null;
	var selects = [];
	var trueTable = null;
	
	for (var i=0; i<domInfos.from.length; i++) {
		if (domInfos.from[i].alias == table) {
			fromObj = domInfos.from[i];
			break;
		}
	}
	trueTable = fromObj.table;
	//alert(table);
	
	for (var i=0; i<tds.length; i++) {
		var alias = $(tds[i]).attr("field");
		var value = $.trim($(tds[i]).attr('trueValue'));
		for (var j=0; j<domInfos.on.length; j++) {
			//alert(domInfos.on[j].alias + "-----" + alias);
			if (domInfos.on[j].alias == alias) {
				var dObj = mdUtils.getDim(domInfos.on[j].dim);
				var fObj = mdUtils.getField(dObj.table, dObj.field);
				var byField = fromObj.by[j];
				if (whereExp != "") whereExp += " AND ";
				if (value == '') whereExp += byField+" is null";
				else whereExp += byField+"="+(fObj.type==1?"":"'")+value+(fObj.type==1?"":"'");
				selects[selects.length] = byField;
				//alert("byField = " + byField);
				break;
			}
		}

		for (var j=0; j<domInfos.select.length; j++) {
			if (domInfos.select[j].alias == alias) {
				var tn = domInfos.select[j].from;
				for (var z=0; z<domInfos.from.length; z++) {
					if (domInfos.from[z].alias == tn) {
						tn = domInfos.from[z].table;
						break;
					}
				}
				if (tn == trueTable){
					selects[selects.length] = domInfos.select[j].field;
				} 
				//alert("selectj = " + domInfos.select[j].field);
			}
		}
	}
	
	if (fromObj.where && fromObj.where != '') {
		if (whereExp != "") whereExp += " AND ";
		whereExp += "("+fromObj.where+")";
	}
	
	//alert(trueTable);

	/*
	 *  items : [infos]
		fields : [{name:'',infos:'',aggr:'',tAlias:''}],
		dims : [{name:'',dim:'',infos:''}],
		relas : [{dim:'',field:'',infos:''}]
		wheres : [{type:1字段/2维/3复杂条件,target:fieldName/dimName,where:'',whereDisp:'',having:'',havingDisp:'',_type:'',_dim:'',_dimType:'',_dimExp:''}]
	*/
	//var domInfos = {items:[],fields:[],dims:[],relas:[],wheres:[]};
	
	var di = {srcs:[],relas:[],wheres:[]};
	
	var existField = [];
	for (var i=0; i<selects.length; i++) {
		//alert(fromObj.table+"."+selects[i]);
		var iObj = getInfosObj(trueTable+"."+selects[i],true);
		if (!iObj) continue;
		if (existField.indexOf(iObj.str)==-1) {
			var name = onInfosUtil.generateNewFieldAlias(iObj,di);
			di.srcs[i] = {src:iObj.str,real:iObj.str,dimKey:0,name:name,selectType:'field',aggr:'',tAlias:'',errorInfo:''};
			existField.push(iObj.str);
		}
	}
	if (whereExp != '') {
		di.wheres[0] = {type:1,target:di.srcs[0].name,conf:[],havingConf:[],dimConf:[],where:whereExp,whereDisp:'',having:'',havingDisp:''};
	}
	var str = domUtils.toString(di);
	//alert(str);
	
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath + "/dl/jsp/dl.jsp");
	form.attr('target', '_blank');
	form.append('<input type="hidden" name="qyxStr" value="'+str+'">');
	$('body').append(form);
	form[0].submit();
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

function doDrill(){
	var dims = $(this).attr('dims');
	if (!dims) {
		var tr = $(this).parent();
		var tds = tr.find('td');
		var leftDim="",topDim="";
		for (var i=0; i<tds.length; i++) {
			if (tds[i] == this) break;
			if ($(tds[i]).attr('dims') && $(tds[i]).attr('dims').length>0) {
				var c = comparePosition($(this),$(tds[i]));
				if (c == 'left' && $(tds[i]).attr('dims').length > leftDim.length) leftDim = $(tds[i]).attr('dims');
			}
		}
		var trs = tr.parent().find('tr');
		for (var i=0; i<trs.length; i++) {
			if (trs[i] == tr) break;
			var tdsi = $(trs[i]).find('td');
			for (var j=0; j<tdsi.length; j++) {
				if ($(tdsi[j]).attr('dims') && $(tdsi[j]).attr('dims').length>0) {
					var c = comparePosition($(this),$(tdsi[j]));
					if (c == 'left' && $(tdsi[j]).attr('dims').length > leftDim.length) leftDim = $(tdsi[j]).attr('dims');
					if (c == 'top' && $(tdsi[j]).attr('dims').length > topDim.length) topDim = $(tdsi[j]).attr('dims');
				}
			}
		}
		//alert(leftDim + "--" + topDim);
		if (leftDim == '' && topDim == '') return;
		dims = leftDim;
		if (leftDim != '' && topDim != '') dims = leftDim + ";" + topDim;
		else dims = leftDim + topDim;
	}

	var dims = dims.split(';');
	var domInfosObj = eval(domInfosStr);
	var dql = "";
	if (domInfosObj.sql) {
		domInfosObj.dql = currDql;
		//dql = currDql;
		for (var i=0; i<dims.length; i++) {
			var di = dims[i].split(':');
			for (var j=0; j<domInfosObj.on.length; j++) {
				var dObj = mdUtils.getDim(domInfosObj.on[j].dim);
				var fObj = mdUtils.getField(dObj.table, dObj.field);
				if (domInfosObj.on[j].alias == di[0]) {
					if (domInfosObj.where != "") domInfosObj.where += " AND ";
					if (di[1] == '') domInfosObj.where += di[0]+" is null";
					else domInfosObj.where += di[0]+"="+(fObj.type==1?"":"'")+di[1]+(fObj.type==1?"":"'");
					break;
				}
			}

			for (var j=0; j<domInfosObj.select.length; j++) {
				if (domInfosObj.select[j].dim == '') continue;
				var dObj = mdUtils.getDim(domInfosObj.select[j].dim);
				var fObj = mdUtils.getField(dObj.table, dObj.field);
				if (domInfosObj.select[j].alias == di[0]) {
					for(var z=0; z<domInfosObj.from.length; z++) {
						if (domInfosObj.from[z].alias == domInfosObj.select[j].from) {
							if (domInfosObj.from[z].where != "") domInfosObj.from[z].where += " AND ";
							if (di[1] == '') domInfosObj.from[z].where += domInfosObj.select[j].from+"."+domInfosObj.select[j].field+" is null";
							else domInfosObj.from[z].where += domInfosObj.select[j].from+"."+domInfosObj.select[j].field+"="+(fObj.type==1?"":"'")+di[1]+(fObj.type==1?"":"'");
							break;
						}
					}
				}
			}
			
		}
		dql = generateDqlFromJSON(domInfosObj);
	} else {
		for (var i=0; i<dims.length; i++) {
			var di = dims[i].split(':');
			var wi = domUtils.getWhere(di[0],domInfosObj);
			if (wi) wi.where = "等于:"+di[1]+"_;_AND";
			else domInfosObj.wheres.splice(domInfosObj.wheres.length, 0, {type:2,target:di[0],where:"等于:"+di[1]+"_;_AND",whereDisp:'',having:'',havingDisp:''});
		}
		dql = generateSql(domInfosObj);
	}

	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	var url = top.window.location.href;
	if (url.indexOf('?')>=0) url = url.substring(0,url.indexOf('?'));
	form.attr('action',url);
	form.attr('target', '_blank');
	form.append('<input type="hidden" name="dql" value="'+dql+'">');
	form.append('<input type="hidden" name="isOlap" value="no">');
	form.append('<input type="hidden" name="dataSource" value="'+dbName+'">');
	$('body').append(form);
	form[0].submit();

	return;
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'showReport',dql:dql,rid:rid,reportDetail:report},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			window.location.href = contextPath+showReportPage+"?rid=" + data;
		}
	});
}

// type 1网格、2分组、3交叉
function changeType(type) {
	var roots = analyzeTreeObj.getNodes() ;
	var nodes = analyzeTreeObj.transformToArray(roots);
	var nodeId = null;
	
	var top = roots[1];
	var left = roots[0];
	if ((!hasDimField) && type != 1) {
		alert('没有维字段，不能产生'+(type==2?'分组报表':'交叉报表'));
		type = 1;
	}
	var aggr = roots[2];
	//alert(top.name);
	for(var j=0; j<nodes.length; j++) {
		if (nodes[j].dim && nodes[j].dim != 0) {
			analyzeTreeObj.hideNodes(nodes[j].children);
			if (type == 1) {
				if (nodes[j].pId != 1001) {
					analyzeTreeObj.moveNode(aggr, nodes[j], "inner");
				}
				analyzeTreeObj.showNodes(nodes[j].children);
			} else if (type == 2) {
				if (nodes[j].pId != 101) {
					analyzeTreeObj.moveNode(left, nodes[j], "inner");
				}
			} else {
				var curr = left;
				if (left.children) {
					if (left.children.length>1) curr = top;
					else if (left.children.length==1 && nodes[j].pId != 101) curr = top;
				} else {
				}
				analyzeTreeObj.moveNode(curr, nodes[j], "inner");
			}
		}
	}
	
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].nType == 2 || nodes[i].nType == 3) continue;
		analyzeTreeObj.checkNode(nodes[i], false, false, true);
		var c = false;
		if (nodes[i].pId == 1 || nodes[i].pId == 101) c = true;
		else if (nodes[i].pId == 1001 && type == 1) c = true;
		else if (type != 1 && nodes[i].aggr == 'sum') c = true;
		analyzeTreeObj.checkNode(nodes[i], c, false, true);
		$("#diyBtn_"+nodes[i].id).css('visibility',(c && (nodes[i].aggr == '' || !nodes[i].aggr))?'visible':'hidden');
		$("#modifyName_"+nodes[i].id).css('visibility',c?'visible':'hidden');
		$("#modifyName_"+nodes[i].id).parent().find('#alias').css('visibility',c?'visible':'hidden');
		
	}
}

function changeReportTag(type) {
	$('#graphDiv').css('display',type==1?'none':'block');
	$('#graphTypeDiv').css('display',type==1?'none':'block');
	$('#analyzeDiv').css('display',type==1?'block':'none');
}

function refreshReportTreeNodes() {
	var roots = analyzeTreeObj.getNodes();
	var left = roots[0];
	var top = roots[1];
	var aggr = roots[2];
	
	var hasLeft = false;
	if (left.children) {
		for (var i=0; i<left.children.length; i++) {
			$('#' +left.children[i].tId + "_check").css('display','inline-block');
			var aggrs = analyzeTreeObj.getNodesByParam("nType", "1", left.children[i]);
			var dimValues = analyzeTreeObj.getNodesByParam("nType", "2", left.children[i]);
			var dimValues2 = analyzeTreeObj.getNodesByParam("nType", "3", left.children[i]);
			analyzeTreeObj.hideNodes(aggrs);
			if (dimValues.length==0) {
		    	var dom = $('#' +left.children[i].tId + "_switch");
		    	if (dom.hasClass('bottom_open') || dom.hasClass('bottom_close')) dom.removeClass('bottom_open').removeClass('bottom_close').addClass('bottom_docu');
		    	if (dom.hasClass('center_open') || dom.hasClass('center_close')) dom.removeClass('center_open').removeClass('center_close').addClass('center_docu');
			} else {
				analyzeTreeObj.showNodes(dimValues);
				if (dimValues2.length>0) analyzeTreeObj.showNodes(dimValues2);
			}
			if(left.children[i].checked) hasLeft = true;
		}
	}
	var hasTop = false;
	if (top.children){
		for (var i=0; i<top.children.length; i++) {
			$('#' +top.children[i].tId + "_check").css('display','inline-block');
			var aggrs = analyzeTreeObj.getNodesByParam("nType", "1", top.children[i]);
			var dimValues = analyzeTreeObj.getNodesByParam("nType", "2", top.children[i]);
			var dimValues2 = analyzeTreeObj.getNodesByParam("nType", "3", top.children[i]);
			analyzeTreeObj.hideNodes(aggrs);
			if (dimValues.length==0) {
				var dom = $('#' +top.children[i].tId + "_switch");
		    	if (dom.hasClass('bottom_open') || dom.hasClass('bottom_close')) dom.removeClass('bottom_open').removeClass('bottom_close').addClass('bottom_docu');
		    	if (dom.hasClass('center_open') || dom.hasClass('center_close')) dom.removeClass('center_open').removeClass('center_close').addClass('center_docu');
			} else {
				analyzeTreeObj.showNodes(dimValues);
				if (dimValues2.length>0) analyzeTreeObj.showNodes(dimValues2);
		    }
			if(top.children[i].checked) hasTop = true;
		}
	}
	
	if (aggr.children){
		for (var i=0; i<aggr.children.length; i++) {
			var aggrs = analyzeTreeObj.getNodesByParam("nType", "1", aggr.children[i]);
			var dimValues = analyzeTreeObj.getNodesByParam("nType", "2", aggr.children[i]);
			var dimValues2 = analyzeTreeObj.getNodesByParam("nType", "3", aggr.children[i]);
//			if (dimValues.length > 0) {
//				analyzeTreeObj.hideNodes(dimValues);
//				if (dimValues2.length > 0) {
//					analyzeTreeObj.hideNodes(dimValues2);
//				}
//			}
			if (hasLeft || hasTop) {
				analyzeTreeObj.showNodes(aggrs);
				analyzeTreeObj.checkNode(aggr.children[i], false, false);
			    $('#'+aggr.children[i].tId + "_span").css('font-weight','normal');
				$("#diyBtn_"+aggr.children[i].id).css('visibility','hidden');
				$("#modifyName_"+aggr.children[i].id).css('visibility','hidden');
				$("#modifyName_"+aggr.children[i].id).parent().find('#alias').css('visibility','hidden');
				$('#' +aggr.children[i].tId + "_check").css('display','none');
		    	var dom = $('#' +aggr.children[i].tId + "_switch");
		    	if (dom.hasClass('bottom_docu')) dom.removeClass('bottom_docu').addClass('bottom_open');
		    	if (dom.hasClass('center_docu')) dom.removeClass('center_docu').addClass('center_open');
			} else {
				analyzeTreeObj.hideNodes(aggrs);
				$('#' +aggr.children[i].tId + "_check").css('display','inline-block');
		    	var dom = $('#' +aggr.children[i].tId + "_switch");
		    	if (dom.hasClass('bottom_open') || dom.hasClass('bottom_close')) dom.removeClass('bottom_open').removeClass('bottom_close').addClass('bottom_docu');
		    	if (dom.hasClass('center_open') || dom.hasClass('center_close')) dom.removeClass('center_open').removeClass('center_close').addClass('center_docu');
			}
			//alert(1);
		}
	}
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
			data: {action:4,oper:'dispTable',sql:sql,dbName:currDBName},
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
			analyzeTreeObj.addNodes(nodes[i],[{id:dimValueCount++,open:false,isHidden:false,isParent:true,checked:true, pId:nodes[i].id, name:'选择数据', icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:'all',drag:false,nType:3}]);
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
function initReportTree(){
	var aNodes = [];
	hasDimField = false;
	aNodes[aNodes.length] = {id:101,drag:false, isParent:true,nocheck:true, pId:0, name:'左表头', open:true, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/2.png"}	
	aNodes[aNodes.length] = {id:1,drag:false, isParent:true, pId:0,nocheck:true, name:'上表头', open:true, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/2.png"}
	aNodes[aNodes.length] = {id:1001, drag:false,isParent:true,nocheck:true, pId:0, name:'数据值', open:true, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/2.png"}
	if (domInfos && domInfos.sql) {
		for (var i=0; i<domInfos.on.length; i++) {
			var id = aNodes.length+1;
			var name = domInfos.on[i].alias;
			var dimObj = mdUtils.getDim(domInfos.on[i].dim);
			var fObj = mdUtils.getField(dimObj.table, dimObj.field);
			var type = fObj.type;
			aNodes[aNodes.length] = {id:id, isParent:false,open:true,checked:true, pId:1001, name:name, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/4.png",field:name,initAlias:name,alias:name,dim:domInfos.on[i].dim};
			if (type == 1) aNodes[aNodes.length] = {id:aNodes.length+1,checked:true, isParent:false, pId:id, name:"求和", icon:consts.relaPath+"/img/dl/sql-sum.png",field:name,initAlias:name+"-求和",alias:name+"-求和",drag:false,aggr:'sum',nType:1};
			if (type == 1) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"平均", icon:consts.relaPath+"/img/dl/sql-avg.png",field:name,initAlias:name+"-平均",alias:name+"-平均",drag:false,aggr:'avg',nType:1};
			if (type != 2) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"最大", icon:consts.relaPath+"/img/dl/sql-max.png",field:name,initAlias:name+"-最大",alias:name+"-最大",drag:false,aggr:'max',nType:1};
			if (type != 2) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"最小", icon:consts.relaPath+"/img/dl/sql-min.png",field:name,initAlias:name+"-最小",alias:name+"-最小",drag:false,aggr:'min',nType:1};
			aNodes[aNodes.length] = {id:aNodes.length+1,checked:true, isParent:false, pId:id, name:"计数", icon:consts.relaPath+"/img/dl/sql-count.png",field:name,initAlias:name+"-计数",alias:name+"-计数",drag:false,aggr:'count',nType:1};
		
			var vs = getDimValues(domInfos.on[i].dim);
			if (vs.length > 0) {
				//aNodes[aNodes.length] = {id:dimValueCount++, isHidden:true,isParent:false,checked:true, pId:id, name:'全选/取消全选', icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:'all',drag:false,nType:3};
			} 
			/*
			var vs = getDimLevelValues(domInfos.on[i].dim);
			if (vs.length > 0) {
				aNodes[aNodes.length] = {id:dimValueCount++, isParent:false,checked:true, pId:id, name:'全选/取消全选', icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:'all',drag:false,nType:2};
				for (var j=0; j<vs.length; j++) {
					var idj = dimValueCount++;
					aNodes[aNodes.length] = {id:idj, isParent:false,checked:true, pId:id, name:vs[j].disp, icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:vs[j].code,drag:false,nType:vs[j].vs.length==0?2:3};
					for (var z=0; z<vs[j].vs.length; z++) {
						var idz = dimValueCount++;
						aNodes[aNodes.length] = {id:idz, isParent:false,checked:true, pId:idj, name:vs[j].vs[z].disp, icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:vs[j].vs[z].code,drag:false,nType:2};
					}
				}
			} 
			*/
			
			hasDimField = true;
		}
		for (var i=0; i<domInfos.select.length; i++) {
			var id = aNodes.length+1;
			var name = domInfos.select[i].alias;
			/* TODO
			var fi = domInfos.fields[i];
			var infos = getInfosObj(fi.infos);
			var fObj = mdUtils.getField(infos.lastTable, infos.lastField);
			var dim = fObj.dim;
			if (!dim) dim = "0";
			*/
			var type = 1;
			if (domInfos.select[i].table != '') {
				var fObj = mdUtils.getField(domInfos.select[i].table,domInfos.select[i].field);
				if (fObj) type = fObj.type;
			}
			if (domInfos.select[i].aggr == 'sum' || domInfos.select[i].aggr == 'avg' || domInfos.select[i].aggr == 'count') type = 1;
			var dim = domInfos.select[i].dim;
			if (dim == '' ||　domInfos.select[i].aggr!='') dim = "0";
			else {
				hasDimField = true;
			}
			aNodes[aNodes.length] = {id:id, isParent:true,open:true, pId:1001, name:name, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/"+(dim?4:3)+".png",field:name,initAlias:name,alias:name,drag:true,dim:dim};
			if (type == 1) aNodes[aNodes.length] = {id:aNodes.length+1,checked:true, isParent:false, pId:id, name:"求和", icon:consts.relaPath+"/img/dl/sql-sum.png",field:name,initAlias:name+"-求和",alias:name+"-求和",drag:false,aggr:'sum',nType:1};
			if (type == 1) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"平均", icon:consts.relaPath+"/img/dl/sql-avg.png",field:name,initAlias:name+"-平均",alias:name+"-平均",drag:false,aggr:'avg',nType:1};
			if (type != 2) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"最大", icon:consts.relaPath+"/img/dl/sql-max.png",field:name,initAlias:name+"-最大",alias:name+"-最大",drag:false,aggr:'max',nType:1};
			if (type != 2) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"最小", icon:consts.relaPath+"/img/dl/sql-min.png",field:name,initAlias:name+"-最小",alias:name+"-最小",drag:false,aggr:'min',nType:1};
			aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false,checked:true, pId:id, name:"计数", icon:consts.relaPath+"/img/dl/sql-count.png",field:name,initAlias:name+"-计数",alias:name+"-计数",drag:false,aggr:'count',nType:1};
			
			if (dim != 0) {
				var vs = getDimValues(dim);
				if (vs != null && vs.length > 0) {
					//aNodes[aNodes.length] = {id:dimValueCount++,isHidden:true, isParent:false,checked:true, pId:id, name:'全选/取消全选', icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:'all',drag:false,nType:3};
				} 
			}
			/*
			if (dim != 0) {
				var vs = getDimLevelValues(dim);
				if (vs != null && vs.length > 0) {
					aNodes[aNodes.length] = {id:dimValueCount++, isParent:false,checked:true, pId:id, name:'全选/取消全选', icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:'all',drag:false,nType:2};
					for (var j=0; j<vs.length; j++) {
						var idj = dimValueCount++;
						aNodes[aNodes.length] = {id:idj, isParent:false,checked:true, pId:id, name:vs[j].disp, icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:vs[j].code,drag:false,nType:vs[j].vs.length==0?2:3};
						for (var z=0; z<vs[j].vs.length; z++) {
							var idz = dimValueCount++;
							aNodes[aNodes.length] = {id:idz, isParent:false,checked:true, pId:idj, name:vs[j].vs[z].disp, icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:vs[j].vs[z].code,drag:false,nType:2};
						}
					}
				} 
			}
			*/
		}
	} else { // txtReport
		for (var i=0; i<txtFields.length; i++) {
			var id = aNodes.length+1;
			var name = txtFields[i].name;
			var dim = "1";
			var vs = null;
			if (txtFields[i].values.length > 0) {
				vs = txtFields[i].values;
				hasDimField = true;
			}
			var type = 1;
			aNodes[aNodes.length] = {id:id, isParent:false,open:true,checked:true, pId:1001, name:name, icon:consts.relaPath+"/js/ztree/css/zTreeStyle/img/diy/4.png",field:name,initAlias:name,alias:name,dim:dim};
			if (vs != null) {
				var dpid = aNodes.length+1;
				aNodes[aNodes.length] = {id:dpid, isHidden:false,isParent:true,checked:true, pId:id, name:'选择数据', icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:'all',drag:false,nType:3};
				for (var j=0; j<vs.length; j++) {
					aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false,checked:true, pId:dpid, name:vs[j], icon:consts.relaPath+"/img/dl/sql-count.png",dimValue:vs[j],drag:false,nType:2};
				}
			}
			if (type == 1) aNodes[aNodes.length] = {id:aNodes.length+1,checked:true, isParent:false, pId:id, name:"求和", icon:consts.relaPath+"/img/dl/sql-sum.png",field:name,initAlias:name+"-求和",alias:name+"-求和",drag:false,aggr:'sum',nType:1};
			if (type == 1) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"平均", icon:consts.relaPath+"/img/dl/sql-avg.png",field:name,initAlias:name+"-平均",alias:name+"-平均",drag:false,aggr:'avg',nType:1};
			if (type != 2) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"最大", icon:consts.relaPath+"/img/dl/sql-max.png",field:name,initAlias:name+"-最大",alias:name+"-最大",drag:false,aggr:'max',nType:1};
			if (type != 2) aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false, pId:id, name:"最小", icon:consts.relaPath+"/img/dl/sql-min.png",field:name,initAlias:name+"-最小",alias:name+"-最小",drag:false,aggr:'min',nType:1};
			aNodes[aNodes.length] = {id:aNodes.length+1, isParent:false,checked:true, pId:id, name:"计数", icon:consts.relaPath+"/img/dl/sql-count.png",field:name,initAlias:name+"-计数",alias:name+"-计数",drag:false,aggr:'count',nType:1};
			
		}
	}
	
	$.fn.zTree.init($('#analyzeDiv'), {
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false,
			drag: {
				prev: function(treeId, nodes, targetNode){
					if (!targetNode) return false;
					if (targetNode.pId==1001) return true;
					if (targetNode.pId==1 || targetNode.pId==101) {
						if (nodes[0].dim && nodes[0].dim != 0) return true;
					}
					return false;
				},
				next: function(treeId, nodes, targetNode){
					if (!targetNode) return false;
					if (targetNode.pId==1001) return true;
					if (targetNode.pId==1 || targetNode.pId==101) {
						if (nodes[0].dim && nodes[0].dim != 0) return true;
					}
					return false;
				},
				inner: function(treeId, nodes, targetNode){
					if (!targetNode) return false;
					if (targetNode.id==1001) return true;
					if (targetNode.id==1 || targetNode.id==101) {
						if (nodes[0].dim && nodes[0].dim != 0) return true;
					}
					return false;
				}
			}
		},
		check : {
			enable:true
			, chkboxType: { "Y": "", "N": "" }
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
			beforeDrag: function (treeId, treeNodes) {
				for (var i=0,l=treeNodes.length; i<l; i++) {
					if (treeNodes[i].drag === false) {
						return false;
					}
				}
				return true;
			},
			beforeDrop: function (treeId, treeNodes, targetNode, moveType) {
				return targetNode ? targetNode.drop !== false : true;
			},
			onDrop : function (event, treeId, treeNodes, targetNode, moveType) {
				analyzeTreeObj.checkNode(treeNodes[0], true, false);
				refreshReportTreeNodes();
			},
			onCheck : function(event, treeId, treeNode) {
				if (treeNode.nType == 2) {
					/*
					if (treeNode.dimValue == 'all') {
						var c = treeNode.checked;
						var dimValues = analyzeTreeObj.getNodesByParam("nType", "2", treeNode.getParentNode());
						for (var i=0; i<dimValues.length; i++) {
							analyzeTreeObj.checkNode(dimValues[i], c, false);
						}
					}
					return;
					*/
				} else if (treeNode.nType == 3) {
					var c = treeNode.checked;
					var dimValues = analyzeTreeObj.getNodesByParam("nType", "2", treeNode.dimValue == 'all'?treeNode.getParentNode():treeNode);
					var dimValues2 = analyzeTreeObj.getNodesByParam("nType", "3", treeNode.dimValue == 'all'?treeNode.getParentNode():treeNode);
					for (var i=0; i<dimValues.length; i++) {
						analyzeTreeObj.checkNode(dimValues[i], c, false);
					}
					for (var i=0; i<dimValues2.length; i++) {
						analyzeTreeObj.checkNode(dimValues2[i], c, false);
					}
					return;
				}
			    $('#'+treeNode.tId + "_span").css('font-weight',treeNode.checked?'bold':'normal');
				$("#diyBtn_"+treeNode.id).css('visibility',(treeNode.checked && (treeNode.aggr == '' || !treeNode.aggr))?'visible':'hidden');
				$("#modifyName_"+treeNode.id).css('visibility',treeNode.checked?'visible':'hidden');
				$("#modifyName_"+treeNode.id).parent().find('#alias').css('visibility',treeNode.checked?'visible':'hidden');
				refreshReportTreeNodes();
			}
		},
		view: {
			showIcon : function(treeId, treeNode){
				return treeNode.level==1;
			}
			,selectedMulti: true
			,addDiyDom:function(treeId, treeNode){
				if (treeNode.nocheck==true) return;
				if (treeNode.dimValue && treeNode.dimValue != '') return;
				var aObj = $("#" + treeNode.tId + "_a");
				var editStr = "<img id='diyBtn_" +treeNode.id+ "' sort=0 src='"+consts.relaPath+"/img/dl/no_order.png"+"' style='vertical-align:-3px;cursor:pointer;'>";
				var modifyName = "<img id='modifyName_" +treeNode.id+ "' src='"+consts.relaPath+"/img/dl/edit5.png"+"' style='vertical-align:-2px;cursor:pointer;'>";
				aObj.after('&nbsp;').after(modifyName)
				if (treeNode.aggr == '' || !treeNode.aggr) aObj.after('&nbsp;').after(editStr);
				var btn = $("#diyBtn_"+treeNode.id);
				$("#modifyName_"+treeNode.id).click(function(){
					var dlg = art.dialog({
						id : dialogCount++,
						title : '修改名称',
					    content: '<div style="margin:30px;"><input type="text" id="modifyNameTxt" value="'+treeNode.alias+'"></div>'
					    ,ok : function() {
							var n = $.trim($('#modifyNameTxt').val());
					    	if (n == '') {
					    		alert("名称不能为空");
					    		return false;
					    	}
					    	treeNode.alias = n;
					    	aObj.parent().find('span[id="alias"]').remove();
					    	if (treeNode.initAlias != treeNode.alias) {
					    		$("#modifyName_"+treeNode.id).after('<span id="alias" style="color:gray;">&nbsp;'+n+'</span>');
					    	}
					    }
					    ,cancel : true
					    ,okVal : '确定'
					    ,cancelVal : '取消'
					    ,lock : true
					    ,duration : 0
					    ,width : '200px'
						,height : '80px'
						,opacity : 0.1
						,padding : '2px 2px'
					});
				});
				if (btn) btn.bind("click", function(){
					//if (btn.parent().find('select').length>0) return;
					var curr = $(this);
					if (curr.attr('sort')==0) {
						curr.attr('sort',1).attr('src',consts.relaPath+"/img/dl/up5.png");
					} else if (curr.attr('sort')==1) {
						curr.attr('sort',-1).attr('src',consts.relaPath+"/img/dl/down5.png");
					} else if (curr.attr('sort')==-1) {
						curr.attr('sort',0).attr('src',consts.relaPath+"/img/dl/no_order.png");
					}
				});
			}
			
		}
	}, aNodes);
	analyzeTreeObj = $.fn.zTree.getZTreeObj("analyzeDiv");
	var roots = analyzeTreeObj.getNodes();
	for (var i=0; i<roots.length; i++) {
		$("#" + roots[i].tId + '_span').css({'color':'#6A6A6A','font-weight':'bold','font-size':'14px'});
		$("#" + roots[i].tId + '_switch').css('display','none');
		$("#" + roots[i].tId + '_ico').css('display','none');
		//if (roots[i].id != 1001) 
		$("#" + roots[i].tId + '_ul').removeClass('line');
		$("#" + roots[i].tId).css('margin-bottom','20px').css('border','1px solid lightgray').css('padding','5px').css('background-color','#F8F8F8');
	}
	
	//$('#analyzeDiv_101_span').css({'background-color':'lightblue','color':'#FFFFFF','font-weight':'bold'});
	//$('#analyzeDiv_1001_span').css({'background-color':'lightblue','color':'#FFFFFF','font-weight':'bold'});
}

var graphType = '<select id="graphType" style="float:left;margin:10px;">';
var gTypes = ["区域图,1","条形图,2",	"三维条形图,3",	"三维簇状条形图,4","堆积条形图,5","三维堆积条形图,6","柱形图,7","三维柱形图,8","三维簇状柱形图,9","堆积柱形图,10","三维堆积柱形图,11","折线图,12","饼型图,13","散列图,14","三维区域图,15","三维折线图,16","三维饼型图,17","雷达图,22","仪表盘,24","3D仪表盘,28"];
for (var i=0; i<gTypes.length; i++) {
	var gi = gTypes[i].split(',');
	graphType += '<option'+(gi[1]==7?' selected':'')+' value="'+gi[1]+'">'+gi[0]+'</option>';
}
graphType += '</select>';


var currGraphReport = null;
function showGraphDialog(){
	var roots = analyzeTreeObj.getNodes();
	var nodes = analyzeTreeObj.transformToArray(roots);
	var tops = [], lefts = [], aggrs = [], hasAggr = false, hasNoAggr = false;
	var f1=null,f2=null,f3=null;
	var flts = "";
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].pId == 1 || nodes[i].pId == 101 || nodes[i].pId == 1001) {
			var dimValues = analyzeTreeObj.getNodesByParam("nType", "2", nodes[i]);
			if (dimValues.length>0) {
				var filter = "";
				var allCheck = true;
				var dvs = [];
				for (var j=0; j<dimValues.length; j++) {
					if (dimValues[j].checked) {
						var dv = dimValues[j].dimValue;
						if (dvs.indexOf(dv)>=0) continue;
						dvs[dvs.length] = dv;
						if (filter != "") filter += " || ";
						if (isNaN(dv)) dv = "'" + dv + "'";
						filter += nodes[i].alias+"=="+dv;
					} else allCheck = false;
				}
				if (filter == '') {
					alert("[" + nodes[i].alias + ']至少要选择一个数据！');
					return;
				}
				if (allCheck) {
					filter = "";
				}
				if (filter != "") {
					if (flts != "") flts += "&&";
					flts += "(" + filter + ")";
				}
			}
		}
		if (!nodes[i].checked) continue;
		if (nodes[i].isHidden) continue;
		var sql = "";
		if (nodes[i].dim && nodes[i].dim != '0' && nodes[i].dim != '1') {
			//alert(nodes[i].dim);
			//alert(mdUtils.getDim(nodes[i].dim));
			sql = mdUtils.getDim(nodes[i].dim).sql;
			if (!sql) sql = "";
		}
		if (nodes[i].pId == 1) {
			var filter = "";
			tops[tops.length] = nodes[i].alias + "<;>" + nodes[i].field + "<;>" + sql + "<;>" /*+ sort*/ + "<;>" + filter;
			if (f1==null) f1 = nodes[i].field;
			else if (f2==null) f2 = nodes[i].field;
		}
		else if (nodes[i].pId == 101) {
			var filter = "";
			lefts[lefts.length] = nodes[i].alias + "<;>" + nodes[i].field + "<;>" + sql + "<;>" /*+ sort*/ + "<;>" + filter;
			if (f1==null) f1 = nodes[i].field;
			else if (f2==null) f2 = nodes[i].field;
		} else {
			//if (nodes[i].f1) aggrs[aggrs.length] = nodes[i].name + "<;>" + nodes[i].f1 + "<;>" + nodes[i].f2;
			if (nodes[i].pId == 1001) {
				aggrs[aggrs.length] = nodes[i].field + "<;>" + nodes[i].field + "," + "<;>" + sql;
				if (f3==null) f3 = nodes[i].field;
				hasNoAggr = true;
			} else if (nodes[i].nType == 1) {
				aggrs[aggrs.length] = nodes[i].field + "-" + nodes[i].name + "<;>" + nodes[i].field + "," + nodes[i].aggr + "<;>" + sql;
				if (f3==null) f3 = nodes[i].field + "-" + nodes[i].name;
				hasAggr = true;
			}
		}
	}
	if (tops.length == 0 &&　lefts.length == 0) {
		alert('上表头或左表头中至少要选出一个用于统计图分类的维！');
		return;
	}
	if (aggrs.length == 0) {
		alert('至少要选出一个指标！');
		return;
	}
	// "tops_;_lefts_;_top/left_,_aggrs"
	var tStr = "";
	for (var i=0; i<tops.length; i++) {
		if (i>0) tStr += "_,_";
		tStr += tops[i];
	}
	var lStr = "";
	for (var i=0; i<lefts.length; i++) {
		if (i>0) lStr += "_,_";
		lStr += lefts[i];
	}
	var aStr = "";
	for (var i=0; i<aggrs.length; i++) {
		if (i>0) aStr += "_,_";
		aStr += aggrs[i];
	}
	
	if (flts == "") flts = "none";
	
	var report = aStr + "_;_" + flts;
	if (tStr != '' || lStr != '') report = tStr + "_;_" + lStr + "_;_left_;_" + aStr + "_;_" + flts;
	
	currGraphReport = report;
	displayGraph(currGraphReport,$('#graphType').val(),$('#reportFrame').width()-40,$('#reportFrame').height()-60, null,"g" + new Date().getTime());
	return;
	
	var currId = dialogCount++;
	var bts = "<div style='padding:10px;float:right;'>";
	bts += '<a id="excel" href="javascript:graphMethod('+currId+',\'_saveAsExcel()\');"></a>';
	bts += '<a id="word" href="javascript:graphMethod('+currId+',\'_saveAsWord()\');"></a>';
	bts += '<a id="pdf" href="javascript:graphMethod('+currId+',\'_saveAsPdf()\');"></a>';
	bts += '<a id="print" href="javascript:graphMethod('+currId+',\'_print()\');"></a>';
	bts += "</div>";
	var dlg = art.dialog({
		id : currId,
		title : '查看统计图',
	    content: "<div id='graph"+currId+"' style='width:100%;height:100%;overflow:hidden;'><div style='width:98%;'><div style='padding:10px;float:left;'>分类【"+f1+"】"+(f2==null?"":("</div><div style='padding:10px;float:left;'>系列【"+f2+"】"))+"</div><div style='padding:10px;float:left;'>值【"+f3+"】</div>"+graphType+bts+"<div style='clear:both;'></div></div><div style='width:98%;'></div></div>"
/*	    
	    ,ok : function() {
	    	return;
			var m = $('#graphType');
	    	var n = $.trim(m.val());

			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'showGraph',rid:rid,reportDetail:report,graphType:n},
				success: function(data){
					if (data.indexOf('error:')==0) {
						alert(data.substring(6));
						return;
					}
					window.open(contextPath+showReportGraphPage+"?gid=" + data);
				}
			});
	    }
*/
	    ,init : function(){
	    	var si = setInterval(function(){
	    		var g = $('#graph'+currId);
	    		if (g.length == 0) {
	    			clearInterval(si);
	    			return;
	    		}
	    		
	    		if (wBack[currId] == g.width() && hBack[currId] == g.height()) return;
	    		var c = $(g.children()[1]);
	    		//c.width(g.width()-10+'px');
	    		c.height(g.height()-60+'px');
	    		wBack[currId] = g.width();
	    		hBack[currId] = g.height();
	    		displayGraph(report,g.find('#graphType').val(),c.width()-5,c.height()-5,g,"g" + new Date().getTime());
	    	},2000);

    		var g = $('#graph'+currId);
    		var c = $(g.children()[1]);
    		wBack[currId] = g.width();
    		hBack[currId] = g.height();
    		//c.width(g.width()-10+'px');
    		c.height(g.height()-60+'px');
    		displayGraph(report,g.find('#graphType').val(),c.width()-5,c.height()-5,g,"g" + new Date().getTime());
    		
    		g.find('#graphType').change(function(){
    			var g = $(this).parent().parent();
    			var c = $(g.children()[1]);
	    		displayGraph(report,$(this).val(),c.width()-5,c.height()-5,g,"g" + new Date().getTime());
    		});
/*
	    	$('#graph'+currId).resize(function(){
	    		var c = $($(this).children()[1]);
	    	});
*/
	    }
	    //,cancel : true
	    //,okVal : ''
	    //,cancelVal : ''
	    ,button : null
	    ,lock : false
	    ,duration : 0
	    ,width : '800px'
		,height : '500px'
		,opacity : 0.1
		,padding : '2px 2px'
	});
}
var wBack = [];
var hBack = [];

function graphMethod(currId, method) {
	//try{
		var gid = $('#graph'+currId).find('iframe').attr('name');
		if (gid) eval("window.frames['"+gid+"']."+gid+method+";");
	//} catch(e){
		
	//}
}

function displayGraph(reportDetail,graphType,width,height, panel,gid) {
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'showGraph',rid:rid,reportDetail:reportDetail,graphType:graphType,width:width,height:height,gid:gid,title:$('#reportTitle').html()=="编辑名称"?"":$('#reportTitle').html()},
		success: function(data){
			if (data.indexOf('error:')==0) {
				if (data.indexOf('null')>=0) {
					alert('报表已超时失效，请访问查询页面重新查询！');
				}
				else alert(data.substring(6));
				return;
			}
			//$(panel.children()[1]).html('<iframe name="'+gid+'" style="width:100%;height:100%;border:0;" src="'+contextPath+showReportGraphPage+"?gid=" + gid+'"></iframe>');//window.open(contextPath+showReportGraphPage+"?gid=" + data);
			if ($('#showResultType').attr('v') == 'right') {
				$('#reportFrame').attr('src', contextPath+showReportGraphPage+"?gid=" + gid);
				currRightShow = 'graph';
			} else {
				window.open(contextPath+showReportGraphPage+"?gid=" + gid);	
			}
		}
	});
}

function calcReport(obj){
	if (!obj) obj = domInfos;
	var roots = analyzeTreeObj.getNodes();
	var nodes = analyzeTreeObj.transformToArray(roots);
	var tops = [], lefts = [], aggrs = [], hasAggr = false, hasNoAggr = false;
	var flts = "";
	var style = $('#allReportStyles').val();
	var desc = "";
	var aggrCount = 0;
	if (style.indexOf(";")>=0) {
		desc = style.substring(style.indexOf(";")+1);
		desc = desc.split(";");
		var copy = [];
		for (var i=0; i<desc.length; i++) {
			var di = desc[i].split(":");
			if (di.length == 2) {
				copy.push({name:di[0],dataType:di[1]=='date'?3:(di[1]=='number'?1:2)});
			}  
		}
		desc = copy;
		style = style.substring(0,style.indexOf(";"));
	}
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].pId == 1 || nodes[i].pId == 101 || nodes[i].pId == 1001) {
			var dimValues = analyzeTreeObj.getNodesByParam("nType", "2", nodes[i]);
			if (dimValues.length>0) {
				//alert(nodes[i].alias + "" + dimValues.length);
				var dimObj = mdUtils.getDim(nodes[i].dim);
				var fObj = mdUtils.getField(dimObj.table, dimObj.field);
				//alert(fObj.type);
				var filter = "";
				var allCheck = true;
				var dvs = [];
				for (var j=0; j<dimValues.length; j++) {
					if (dimValues[j].checked) {
						var dv = dimValues[j].dimValue;
						if (dvs.indexOf(dv)>=0) continue;
						dvs[dvs.length] = dv;
						if (filter != "") filter += " || ";
						//if (isNaN(dv)) dv = "'" + dv + "'";
						if (fObj.type != 1) dv = "'" + dv + "'";
						filter += nodes[i].alias+"=="+dv;
					} else allCheck = false;
				}
				if (filter == '') {
					alert("[" + nodes[i].alias + ']至少要选择一个数据！');
					return;
				}
				if (allCheck) {
					filter = "";
				}
				if (filter != "") {
					if (flts != "") flts += "&&";
					flts += "(" + filter + ")";
				}
			}
		}

		//if (!nodes[i].checked) continue;
		if (nodes[i].isHidden) continue;
		var sql = "";
		var sort = $("#diyBtn_"+nodes[i].id).attr('sort');
		if (sort == '' || !sort) sort = 0;
		if (nodes[i].dim && nodes[i].dim != '0' && nodes[i].dim != '1') {
			//alert(nodes[i].dim);
			//alert(mdUtils.getDim(nodes[i].dim));
			var dimObji = mdUtils.getDim(nodes[i].dim); //2016/03/24 松波孤维bug
			if (dimObji && dimObji.sql) sql = dimObji.sql;
			else sql = "";
		}
		if (nodes[i].pId == 1) {
			if (!nodes[i].checked) continue;
			if (desc.length>0) {
				alert("您选的报表模板不能设置表头");
				return;
			} 
			var filter = "";
			tops[tops.length] = nodes[i].alias + "<;>" + nodes[i].field + "<;>" + sql + "<;>" + sort + "<;>" + filter;
		}
		else if (nodes[i].pId == 101) {
			if (!nodes[i].checked) continue;
			if (desc.length>0) {
				alert("您选的报表模板不能设置表头");
				return;
			} 
			var filter = "";
			lefts[lefts.length] = nodes[i].alias + "<;>" + nodes[i].field + "<;>" + sql + "<;>" + sort + "<;>" + filter;
		} else {
			//if (nodes[i].f1) aggrs[aggrs.length] = nodes[i].name + "<;>" + nodes[i].f1 + "<;>" + nodes[i].f2;
			if (nodes[i].pId == 1001) {
				if (desc.length>0) {
					if (nodes[i].checked) {
						if (desc.length>aggrCount) {
							//var dataType = getFieldType(nodes[i].field);
							//if (dataType>=3) dataType = 3; 
							//if (dataType != desc[aggrCount].dataType) {
							//	alert('报表模板“'+style+'”第'+(aggrCount+1)+'个数据的数据类型必须为'+(desc[aggrCount].dataType==1?'数字':(desc[aggrCount].dataType==2?'文本字符':'日期')));
							//	return;
							//}
						}
						aggrCount++;
					}
					aggrs[aggrs.length] = nodes[i].alias + "<;>" + nodes[i].field + "," + "<;>" + sql + "<;>" + sort + "<;><;>" + (nodes[i].checked?1:0);
					hasNoAggr = true;
				} else if (tops.length == 0 && lefts.length == 0) {
					aggrs[aggrs.length] = nodes[i].alias + "<;>" + nodes[i].field + "," + "<;>" + sql + "<;>" + sort + "<;><;>" + (nodes[i].checked?1:0);
					hasNoAggr = true;
				}
			} else if (nodes[i].nType == 1) {
				if (!nodes[i].checked) continue;
				aggrs[aggrs.length] = nodes[i].alias + "<;>" + nodes[i].field + "," + nodes[i].aggr + "<;>" + sql + "<;>" + sort + "<;>";
				hasAggr = true;
			}
		}
	}
	if (tops.length == 0 && lefts.length == 0 && hasAggr && hasNoAggr) {
		alert('网格报表中的指标不允许部分被汇总！');
		return;
	}
	if (aggrs.length == 0) {
		alert('至少要选出一个指标！');
		return;
	}
	if (desc != "") {
		if (hasAggr) {
			alert('报表模板“'+style+'”只需要原始数据，不能设置表头及汇总方式！');
			return;
		}
		//alert(aggrs.length + "--" + desc.length);
		if (aggrCount<desc.length) {
			alert('报表模板“'+style+'”需要'+desc.length+'个数据值！');
			return;
		}
	} 
	var isOlap = (tops.length>1 || lefts.length>1)?"yes":"no";
	// "tops_;_lefts_;_top/left_,_aggrs"
	var tStr = "";
	for (var i=0; i<tops.length; i++) {
		if (i>0) tStr += "_,_";
		tStr += tops[i];
	}
	var lStr = "";
	for (var i=0; i<lefts.length; i++) {
		if (i>0) lStr += "_,_";
		lStr += lefts[i];
	}
	var aStr = "";
	for (var i=0; i<aggrs.length; i++) {
		if (i>0) aStr += "_,_";
		aStr += aggrs[i];
	}
	
	if (flts == "") flts = "none";
	
	var report = aStr + "_;_" + flts;
	if (tStr != '' || lStr != '') report = tStr + "_;_" + lStr + "_;_left_;_" + aStr + "_;_" + flts;

	$.ajax({
		type : 'POST',
		async : true,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'showReport',rid:rid,reportDetail:report,style:style,title:$('#reportTitle').html()=="编辑名称"?"":$('#reportTitle').html()},
		success: function(data){
			if (data.indexOf('error:')==0) {
				if (data.indexOf('null')>=0) {
					alert('报表已超时失效，请访问查询页面重新查询！');
				} else alert(data.substring(6));
				return;
			}
			if ($('#showResultType').attr('v') == 'right') {
				$('#reportFrame').attr('src', contextPath+showReportPage+"?rid=" + rid+"&isOlap="+isOlap);
				currRightShow = 'report';
			} else window.open(contextPath+showReportPage+"?rid=" + rid+"&isOlap="+isOlap);
		}
	});
}

//[select]：fieldExp, aggr, tableAlias，lastTable，lastField, fieldAlias
//[on] ：dim, dimAlias, where
//[from] table, tableAlias, where, [by]
/*
{
	sql:{sql:"",arg:[]}
	,on:[{dim:"",alias:""}]
	,where:""
	,from:[{table:"",alias:'',by:["",""},where:"",join:""]
	,select:[{field,"",table:"",aggr:"",alias:""}]
	,having:""
	,order:""
}
*/
function dealDqlInfo(){

}

var qyxName = "超维查询.qyx";
function saveLocalDL() {
	//if ($('#saveLocalBut').attr('src').indexOf('-h') > 0) return;
	//alert(window.location.href);
	//return;
	if (domInfos.srcs.length == 0) return;
	var json = domUtils.toString();
	var name = qyxName;
	if (qyxName.indexOf('.qyx') == -1) name = qyxName + ".qyx";
	$('#downQyxForm #path').val(name);
	$('#downQyxForm #dlConf').val(json);
	$('#downQyxForm #type').val('qyx');
	$('#downQyxForm').submit();
}

var openQyxName;
function openLocalDL() {
	openQyxName = $('#localQyxFile').val();
	var idx = openQyxName.lastIndexOf('/');
	if (idx == -1) idx = openQyxName.lastIndexOf('\\');
	if (idx >= 0) openQyxName = openQyxName.substring(idx + 1);
	var f = openQyxName.toLowerCase();
	if (f.indexOf('.qyx') == -1) {
		alert("请选择[.qyx]类型文件！");
		return;
	}
	//alert(f);
	$('#openQyxForm').submit();
}

function tree_setCurrNode() {
	//var url = window.location.href;
	//if (url.indexOf('#') > 0) url = url.substring(0,url.indexOf('#'));
	//window.location.href = (url.indexOf('?')>0?url.substring(0,url.indexOf('?')):url) + "?qyx=" + encodeURIComponent(openQyxName);
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	var url = window.location.href;
	if (url.indexOf('?')>=0) url = url.substring(0,url.indexOf('?'));
	form.attr('action',url);
	form.attr('target', '_self');
	form.append('<input type="hidden" name="qyx" value="'+openQyxName+'">');
	$('body').append(form);
	form[0].submit();
}

function openQyx(qyx){
	openQyxName = qyx + ".qyx";
	tree_setCurrNode();
}

function openDL(){
	if (existQyx == '') {
		alert('服务器上不存在查询文件(*.qyx)');
		return;
	}
	var fs = existQyx.split(',');
	var fss = "<div style='width:170px;height:210px;'>";
	for (var i=0; i<fs.length; i++) {
		fss += "<div style='margin:5px;'><a href='javascript:openQyx(\""+fs[i]+"\");'>"+fs[i]+".qyx</a></div>"
	}
	fss += "</div>";
	var dlg = art.dialog({
		id : dialogCount++,
		title : '打开查询文件',
	    content: fss
	    //,ok : function() {}
	    //,cancel : true
	    //,okVal : '确定'
	    //,cancelVal : '取消'
	    ,button : []
	    ,lock : true
	    ,duration : 0
	    ,width : '200px'
		,height : '240px'
		,opacity : 0.1
		,padding : '2px 2px'
	});
}


$(document).ready(function(){
	var ltHtml = '<select style="margin:5px;vertical-align:2px;" id="allReportStyles"></select>';
	ltHtml += '<img onclick="calcReport()" title="生成报表" src="'+contextPath+'/dl/img/dl/reportTitle/icon01.png" style="cursor:pointer;vertical-align:-6px;">';
	ltHtml += '<img src="'+contextPath+'/dl/img/dl/reportTitle/line.png" style="display:none;margin:0 5px 0 10px;vertical-align:-5px;">';
	ltHtml += '<select style="margin:5px;vertical-align:2px;display:none;" id="graphType"><option value="1">区域图</option><option value="2">条形图</option><option value="3">三维条形图</option><option value="4">三维簇状条形图</option><option value="5">堆积条形图</option><option value="6">三维堆积条形图</option><option value="7" selected="">柱形图</option><option value="8">三维柱形图</option><option value="9">三维簇状柱形图</option><option value="10">堆积柱形图</option><option value="11">三维堆积柱形图</option><option value="12">折线图</option><option value="13">饼型图</option><option value="14">散列图</option><option value="15">三维区域图</option><option value="16">三维折线图</option><option value="17">三维饼型图</option><option value="22">雷达图</option><option value="24">仪表盘</option><option value="28">3D仪表盘</option></select>';
	ltHtml += '<img onclick="showGraphDialog()" title="生成统计图" src="'+contextPath+'/dl/img/dl/reportTitle/icon02.png" style="cursor:pointer;vertical-align:-6px;display:none;">';
	ltHtml += '<img src="'+contextPath+'/dl/img/dl/reportTitle/line.png" style="margin:5px 10px 0 10px;vertical-align:-5px;">';
	ltHtml += '<img id="showResultType" v="right" title="在“右侧”显示报表或统计图" src="'+contextPath+'/dl/img/dl/reportTitle/icon04.png" style="cursor:pointer;vertical-align:-6px;">';
	if ("showReport" == pageName) {
		try {
			lmd = eval(lmdStr);
			domInfos = eval(domInfosStr);
		} catch(e) {
		}

		var trs1 = $('tr');
		for (var i=0; i<trs1.length; i++) {
			if (i == 0) {
				$(trs1[0]).find('td').attr('colno','')
			} else {
				var tri = $(trs1[i]).find('td');
				for (var j=0; j<tri.length; j++) {
					$(tri[j]).attr('colno',j+1);
					//if (i>1) 
				}
			}
		}

		$('td').each( drill );

		if ($('tr').length>3) {
			var header = $($('tr')[1]).find("td");
			var row1 = $($('tr')[2]).find("td");
			var row2 = $($('tr')[3]).find("td");
			var colspan = 0;
			for (var i=0; i<row2.length; i++) {
				//alert($(row2[i]).attr("show") + "-" + $(row2[i]).html());
				if ($(row2[i]).attr("show") == '0') $(row1[i]).attr('h','1').css('display','none');
			}
			for (var i=0; i<row1.length; i++) {
				//alert($(row2[i]).attr("show") + "-" + $(row2[i]).html());
				if ($(row1[i]).attr("h") == '1') continue;
				var cs = $(row1[i]).attr("colspan");
				if (cs == '' || !cs) cs = 1;
				else cs = parseInt(cs);
				colspan+=cs;
			}
			header.attr('colspan',colspan);			
		}

		$('td').attr('title','');
	} else if ("report" == pageName) {
		topLayout = $('body').css('color', consts.color1).layout({
			resizable : true
			, spacing_open:7  // ALL panes
			, spacing_closed:7 // ALL panes
			, east : {
				spacing_open:8,
				spacing_closed:8,
				size : "350",
	 			resizable : true,
				closable:false
				//initClosed:true
			},center : {
				onresize : function() {
					if (currRightShow == 'report') return;
					displayGraph(currGraphReport,$('#graphType').val(),$('#reportFrame').width()-40,$('#reportFrame').height()-60, null,"g" + new Date().getTime());
				}
							
			}
		});

		$('#leftTop').html(ltHtml).css({'background-image':"url('"+contextPath+"/dl/img/dl/reportTitle/bg.png')","height":"40px","margin":"0 0 10px 0"});

		$('#showResultType').click(function(){
			if ($(this).attr('v') == 'right') {
				$(this).attr('v','').attr('src',contextPath+'/dl/img/dl/reportTitle/icon03.png').attr('title','在“新窗口”显示报表或统计图');
			} else {
				$(this).attr('v','right').attr('src',contextPath+'/dl/img/dl/reportTitle/icon04.png').attr('title','在“右侧”显示报表或统计图');
			}
		});
		allReportStyles = allReportStyles.split(',');
		for (var i=0; i<allReportStyles.length; i++) {
			var ni = allReportStyles[i];
			var desc = "";
			if (ni.indexOf(";")>=0) {
				desc = ni.substring(ni.indexOf(";")+1);
				ni = ni.substring(0,ni.indexOf(";"));
			}
			var select = (currReportStyle==ni?' selected':'');
			$('#allReportStyles').append('<option value="'+allReportStyles[i]+'"'+select+'>'+ni+'</option>');
		}
		$('#allReportStyles').change(function(){
			var hint = $("#templateHint");
			if (hint.length == 0) {
				hint = $("<div style='display:none;margin-bottom:10px;' id='templateHint'></div>");
				$('#leftTop').after(hint);
			}
			var ni = $(this).val();
			var desc = "";
			if (ni.indexOf(";")>=0) {
				desc = ni.substring(ni.indexOf(";")+1);
				ni = ni.substring(0,ni.indexOf(";"));
			}
			if (desc == '') {
				hint.css('display','none');
			} else {
				var r = "“"+ni+"”需要以下数据，请在数据值中按顺序提供：<br>";
				r += desc.replaceAll("number","").replaceAll("string","").replaceAll("date","").replaceAll(":;","，").replaceAll(":","");
				hint.html(r).css('display','block');
			}
		});
		var gt = $(graphType);
		gt.css('margin','1px');
		$('#graphButDiv').prepend(gt);
		//$('#allReportStyles')
		
		lmd = eval(lmdStr);
		mdUtils.setDimValues(reportDimValues);
		domInfos = eval(domInfosStr);
		if (domInfos.sql) domInfos.dql = currDql;
		initReportTree();
		//initGraphTree();
		/*
		var gt = $('<select></select>');
		var types = [	"1",	"2"];
		var typeNames =["柱形图",	"三维柱形图"];
		for (var i=0; i<types.length; i++) {
			gt.append('<option value="'+types[i]+'">'+typeNames[i]+'</option>');
		}
		$('#graphTypeDiv').append(gt);
		*/
		changeType(reportType=='grid'?1:(reportType=='group'?2:3));
		refreshReportTreeNodes();
		calcReport();
		
		$('#reportTitle').click(function(){
			if ($(this).find('input').length==1) return;
			var title = $(this).html();
			if (title == '编辑名称') title = '';
			var dlg = art.dialog({
				id : dialogCount++,
				title : '编辑报表/统计图名称',
			    content: '<input id="modifyName" style="width:150px;margin:15px;" type="text" value="'+title+'">'
			    ,ok : function() {
					var m = $('#modifyName');
			    	var n = $.trim(m.val());
			    	if (n == '') {
			    		n = "编辑名称";
			    	}
			    	$('#reportTitle').html(n);
			    }
			    ,cancel : true
			    ,okVal : '确定'
			    ,cancelVal : '取消'
			    ,lock : true
			    ,duration : 0
			    ,width : '200px'
				,height : '50px'
				,opacity : 0.1
				,padding : '2px 2px'
			});
		});
		asyncDimValue();
	} else if ("view" == pageName) {
	} else if ("txtReport" == pageName) {
		topLayout = $('body').css('color', consts.color1).layout({
			resizable : true
			, spacing_open:7  // ALL panes
			, spacing_closed:7 // ALL panes
			, east : {
				spacing_open:8,
				spacing_closed:8,
				size : "350",
	 			resizable : true,
				closable:false
				//initClosed:true
			},center : {
				onresize : function() {
					if (currRightShow == 'report') return;
					displayGraph(currGraphReport,$('#graphType').val(),$('#reportFrame').width()-40,$('#reportFrame').height()-60, null,"g" + new Date().getTime());
				}			
			}
		});
		
		$('#leftTop').html(ltHtml).css({'background-image':"url('"+contextPath+"/dl/img/dl/reportTitle/bg.png')","height":"40px","margin":"0 0 10px 0"});

		$('#showResultType').click(function(){
			if ($(this).attr('v') == 'right') {
				$(this).attr('v','').attr('src',contextPath+'/dl/img/dl/reportTitle/icon03.png').attr('title','在“新窗口”显示报表或统计图');
			} else {
				$(this).attr('v','right').attr('src',contextPath+'/dl/img/dl/reportTitle/icon04.png').attr('title','在“右侧”显示报表或统计图');
			}
		});
		allReportStyles = allReportStyles.split(',');
		for (var i=0; i<allReportStyles.length; i++) {
			$('#allReportStyles').append('<option value="'+allReportStyles[i]+'"'+(currReportStyle==allReportStyles[i]?' selected':'')+'>'+allReportStyles[i]+'</option>');
		}
		var gt = $(graphType);
		gt.css('margin','1px');
		$('#graphButDiv').prepend(gt);
		//$('#allReportStyles')
		
		txtFields = eval("("+txtFields+")");
		initReportTree();
		//initGraphTree();
		/*
		var gt = $('<select></select>');
		var types = [	"1",	"2"];
		var typeNames =["柱形图",	"三维柱形图"];
		for (var i=0; i<types.length; i++) {
			gt.append('<option value="'+types[i]+'">'+typeNames[i]+'</option>');
		}
		$('#graphTypeDiv').append(gt);
		*/
		changeType(1);
		refreshReportTreeNodes();
		calcReport();
		
		$('#reportTitle').click(function(){
			if ($(this).find('input').length==1) return;
			var title = $(this).html();
			if (title == '编辑名称') title = '';
			var dlg = art.dialog({
				id : dialogCount++,
				title : '编辑报表/统计图名称',
			    content: '<input id="modifyName" style="width:150px;margin:15px;" type="text" value="'+title+'">'
			    ,ok : function() {
					var m = $('#modifyName');
			    	var n = $.trim(m.val());
			    	if (n == '') {
			    		n = "编辑名称";
			    	}
			    	$('#reportTitle').html(n);
			    }
			    ,cancel : true
			    ,okVal : '确定'
			    ,cancelVal : '取消'
			    ,lock : true
			    ,duration : 0
			    ,width : '200px'
				,height : '50px'
				,opacity : 0.1
				,padding : '2px 2px'
			});
		});
	} else if ("query" == pageName) {
		setConfig(1, lmdStr);
		domUtils.set(initQyx);
		if ($.cookie('guideShowType') == '1') {
			changeShowStyle("数据项[分类]");
		}
	} else if ("mobileQuery" == pageName) {
	} 
	
});

var sortBy = function(name,minor){
	return function(o, p){
		var a, b;
		if (typeof o === "object" && typeof p === "object" && o && p) {
			a = o[name];
			b = p[name];
			if (a === b) {return typeof minor==='function' ?minor(o,p):0;}
			if (typeof a === typeof b) { return a < b ? -1 : 1;}
			return typeof a < typeof b ? -1 : 1;
		} else {throw ("error"); }
	}
}


