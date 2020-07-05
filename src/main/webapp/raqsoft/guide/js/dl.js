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
var domInfos = {fields:[],tables:[],bys:[]};
var detailDomInfos;//明细数据拼接时的信息，根据domInfos自动生成。
var dialogCount = 0;
var colWidths = {'c0':40,'c1':100,'c2':62,'c3':37,'c4':200,'c5':100};
var tableCol = 120;
var scrollX=scrollY=0;
var disctictStatus = false;
var detailJoin = false;

var dropDoms = new Array();
var lastOpt = new Date().getTime(); //最后一次操作时间，防止二次操作，不严谨。

function refreshDetailDomInfos() {
	detailDomInfos = {fields:[],tables:[],bys:[]};
	if (domInfos.tables.length == 0) return;
	for (var i=0; i<domInfos.tables.length; i++) {
		detailDomInfos.tables[i] = domInfos.tables[i];
	}
	
	var tObj = mdUtils.getTable(domInfos.tables[0].annexT);
	var pks = mdUtils.getTablePKs(tObj.name);
	for (var i=0; i<pks.length; i++) {
		var dimi = pks[i].dim;
		var exists = false;
		if (dimi != '' && dimi) {
			for (var j=0; j<domInfos.fields.length; j++) {
				var fj = domInfos.fields[j];
				if (fj.type == 2 && fj.selectOut == 1 && fj.dim == dimi) {
					exists = true;
					break;
				}
			}
		} else dimi = tObj.name + '.' + pks[i].name;
		if (!exists) {
			var dad = mdUtils.getDefaultAttr4Dim(dimi);
			var alias = onInfosUtil.generateNewDimAlias(pks[i].name);
			detailDomInfos.fields[detailDomInfos.fields.length] = {name:alias,type:2,where:'',whereDisp:'',wherePos:'',order:0,seq:0,format:dad.format,useDisp:dad.useDisp,dim:dimi,selectOut:1,colWidth:80,infos:'',aggr:'',tAlias:'',lcts:'',level:'',exp:''/*,dataType:2,edit:''*/};
			byInfosUtil.addDimBy(alias, detailDomInfos);
		}
	}
	
	for (var j=0; j<domInfos.fields.length; j++) {
		var fj = domInfos.fields[j];
		if (fj.type == 2) {
			detailDomInfos.fields[detailDomInfos.fields.length] = fj;
			byInfosUtil.addDimBy(fj.name, detailDomInfos);
		} else break;
	}

	for (var i=0; i<pks.length; i++) {
		var dimi = pks[i].dim;
		if (dimi == '' || !dimi) {
			dimi = tObj.name + '.' + pks[i].name;
		}
		var ta = tObj.dispName;
		if (ta == '' || !ta) ta = tObj.name;
		var fa = pks[i].dispName;
		if (fa == '' || !fa) fa = pks[i].name;
		var infos = tObj.name + split_1 + ta + split_1 + pks[i].name + split_1 + fa + split_1 + split_1 + dimi + split_1 + dimi;
		var exists = false;
		for (var j=0; j<domInfos.fields.length; j++) {
			var fj = domInfos.fields[j];
			if (fj.type == 1 && fj.selectOut == 1 && fj.infos == infos) {
				exists = true;
				break;
			}
		}
		if (!exists) {

			var tDom = domInfos.tables[0];
			var tAlias = tDom.name;
			
			var _alias = fa; 
			var aliass = domUtils.getFieldNames();
			if (aliass.indexOf(_alias) >= 0) {
				for (var k=1; k<1000; k++) {
					if (aliass.indexOf(_alias+k) == -1) {
						_alias = _alias+k;
						break;
					}
				}
			}
					
			var fObj = pks[i];
			var dim = dimi;
			var format = '';
			var useDisp = 0;
			var domType = 1;
			var selectOut = 1;

			if (!dim) dim = '';		
			if (dim != '') {
				var dimObj = mdUtils.getDim(dim);
				if (dimObj) {
					if (dimObj && dimObj.sql != null && dimObj.sql != '') {
						useDisp = 1;
					}
				} else dim = '';
			}

			format = fObj.format;
			if (!format) format = '';
			if (format == '') {
				if (fObj.type == 3) {
					format = 'yyyy-MM-dd';
				} else if (fObj.type == 4) {
					format = 'HH:mm:ss';
				} else if (fObj.type == 5) {
					format = 'yyyy-MM-dd';
				}
			}

			detailDomInfos.fields[detailDomInfos.fields.length] = {name:_alias,type:1,where:'',whereDisp:'',wherePos:'',order:0,seq:0,format:format,useDisp:useDisp,dim:dim,selectOut:1,colWidth:80,infos:infos,aggr:'',tAlias:tAlias,lcts:'',level:'',exp:''/*,dataType:'',edit:''*/};
		}
	}

	for (var j=0; j<domInfos.fields.length; j++) {
		var fj = domInfos.fields[j];
		if (fj.type != 2) {
			detailDomInfos.fields[detailDomInfos.fields.length] = fj;
		}
	}
	
	for (var i=1; i<detailDomInfos.tables.length; i++) {
		var tName = detailDomInfos.tables[i].annexT;
		var pks = mdUtils.getTablePKs(tName);
		var tObji = mdUtils.getTable(tName);
		for (var j=0; j<pks.length; j++) {
			var dimj = pks[j].dim;
			if (dimj == '' || !dimj) {
				dimj = tObji.name + '.' + pks[j].name;
			}
			var dimObj = mdUtils.getDim(dimj);
			var da = dimObj.dispName;
			if (!da) da = dimj;
			var existj = false;
			for (var z=0; z<detailDomInfos.fields.length; z++) {
				var zDom = detailDomInfos.fields[z];
				if (zDom.type == 2 && zDom.dim==dimj && zDom.selectOut==1) {
					existj = true;
				}
			}
			if (!existj) {
				alert("被连接的表[" + detailDomInfos.tables[i].name + "]缺少主键维[" + da + "]!");
				return false;
			}
		}
	}
	return true;
}

/*
function existsInfo() {
	var middles = mdUtils.getMiddleTables();
	var eis = new Array();
	for(var i=0; i<domInfos.tables.length; i++) {
		var ei = {table:domInfos.tables[i].name,fks:[]}
		for (var j=0; j<middles.length; j++) {
			var pks = mdUtils.getTablePKs(middles[j].name);
			if (pks.length == 0) continue;
			for (var k=0; k<pks.length; k++) {
				pks[k].dim
			}
		}
	}
}
*/

var domUtils = {
	toString : function() {
		var fs = "[";
		for (var i=0; i<domInfos.fields.length; i++) {
			var fDom = domInfos.fields[i];
			if (i > 0) fs += ",";
			fs += "{name:'" + fDom.name + "',type:" + fDom.type + ",where:'" + fDom.where.replaceAll("'","<single_quote>") + "',whereDisp:'" + fDom.whereDisp.replaceAll("'","<single_quote>") + "',wherePos:'" + fDom.wherePos + "',order:" + fDom.order + ",seq:" + fDom.seq + ",format:'" + fDom.format + "',useDisp:" + fDom.useDisp + ",dim:'" + fDom.dim + "',selectOut:" + fDom.selectOut + ",infos:'" + fDom.infos.replaceAll("'","<single_quote>") + "',aggr:'" + fDom.aggr + "',tAlias:'" + fDom.tAlias + "',level:'" + fDom.level + "',colWidth:" + fDom.colWidth + ",lcts:'" + fDom.lcts.replaceAll("'","<single_quote>") + "',exp:'" + fDom.exp.replaceAll("'","<single_quote>") + "'}";
		}
		fs += "]";
		var ts = "[";
		for (var i=0; i<domInfos.tables.length; i++) {
			var tDom = domInfos.tables[i];
			if (i > 0) ts += ",";
			ts += "{name:'" + tDom.name + "',annexT:'" + tDom.annexT + "',joinType:" + tDom.joinType + "}";
		}
		ts += "]";
		var bs = "[";
		for (var i=0; i<domInfos.bys.length; i++) {
			var bDom = domInfos.bys[i];
			if (i > 0) bs += ",";
			bs += "{infos:'" + bDom.infos + "',dimAlias:'" + bDom.dimAlias + "',tAlias:'" + bDom.tAlias + "'}";
		}
		bs += "]";
		return "{fields:" + fs + ",tables:" + ts + ",bys:" + bs + "}";
	},
	getFieldType : function(name, currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		var f = domUtils.getField(name, currDomInfos);

		if (!f.dataType) {
			if (f.type == 1) {
				var infos = parseFieldInfos(f.infos);
				fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6));
				f.dataType = fObj.type;
			} else if (f.type == 2) {
				var dimObj = mdUtils.getDim(f.dim);
				fObj = mdUtils.getField(dimObj.table, dimObj.field);
				f.dataType = fObj.type;
			}
		}

		if (f.type == 2) return f.dataType; 
		var aggr = f.aggr;
		if (aggr == '' && currDomInfos.fields[0].type == 2) aggr = 'count';
		if (f.dataType == 1) return 1;
		else if (f.dataType == 2) {
			if (aggr != '') return 1;
			else return 2;
		} else {
			if (aggr == 'count' || f.aggr == 'countd') return 1;
			else return f.dataType;
		}
	},
	getBy : function(tAlias, dimAlias, currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.bys.length; i++) {
			var byObj = currDomInfos.bys[i];
			if (byObj.dimAlias == dimAlias && byObj.tAlias == tAlias) return byObj;
		}
	},
	getTable : function(name, currDomInfos){
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.tables.length; i++) {
			if (currDomInfos.tables[i].name == name) return currDomInfos.tables[i];
		}
	},
	getField : function(name,currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.fields.length; i++) {
			if (currDomInfos.fields[i].name == name) return currDomInfos.fields[i];
		}
	},
	removeField : function(idx) {
		var f = domInfos.fields[idx];
		var baks = "({idx:" + domInfos.fields.indexOf(f)
		domInfos.fields.remove(f);
		if (f.type == 1) {
			var exist = false;
			for (var i=0; i<domInfos.fields.length; i++) {
				if (domInfos.fields[i].tAlias == f.tAlias) {
					exist = true;
					break;
				}
			}
			if (!exist) {
				baks += ",table:" + domUtils.removeTable(f.tAlias);
			}
		} else if(f.type == 2) {
			baks += ",bys:[";
			var count = 0;
			for (var i=domInfos.bys.length-1; i>=0; i--) {
				if (domInfos.bys[i].dimAlias == f.name) {
					if (count > 0) baks += ',';
					baks += "{infos:'" + domInfos.bys[i].infos + "',tAlias:'" + domInfos.bys[i].tAlias + "',dimAlias:'" + domInfos.bys[i].dimAlias + "'}";
					domInfos.bys.remove(domInfos.bys[i]);
					count++;
				}
			}
			baks += ']';
		}
		baks += '})';
		var undo = 'operations.addField(' + idx + ',"' + f.name + '",' + f.type + ',"' + f.where + '","' + f.whereDisp + '","' + f.wherePos + '",' + f.order + ',' + f.seq + ',"' + f.format + '",' + f.useDisp + ',"' + f.dim + '",' + f.selectOut + ',"' + f.infos + '","' + f.aggr + '","' + f.tAlias + '","' + f.level + '",' + f.colWidth + ',"' + f.lcts + '","' + baks + '","")';
		return undo;
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
	removeBy : function(tAlias, dimAlias) {
		domInfos.bys.remove(domUtils.getBy(tAlias, dimAlias));
	},
	addBy : function(tAlias, dimAlias, infos, currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		currDomInfos.bys[currDomInfos.bys.length] = {infos:infos, dimAlias:dimAlias, tAlias:tAlias};
	},
	addField : function(row, name, type, where, whereDisp, wherePos, order, seq, format, useDisp, dim, selectOut, infos, aggr, tAlias, level, colWidth, lcts, exp) {
		if (row == -1) row = domInfos.fields.length;
		domInfos.fields.splice(row, 0, {name:name, type:type, where:where, whereDisp:whereDisp, wherePos:wherePos, order:order, seq:seq, format:format, useDisp:useDisp, dim:dim, selectOut:selectOut,infos:infos,aggr:aggr,tAlias:tAlias,level:level,colWidth:colWidth,lcts:lcts,exp:exp});
	},
	addTable : function(row, name, annexT, joinType){
		if (row == -1) row = domInfos.tables.length;
		domInfos.tables.splice(row, 0, {name:name,annexT:annexT,joinType:joinType});
		colWidths[name] = 120;
	},
	getFieldNames : function() {
		var names = new Array();
		for (var i=0; i<domInfos.fields.length; i++) {
			names[i] = domInfos.fields[i].name;
		}
		return names;
	},
	setFieldName : function(idx, name, needRefresh) {
		var fDom = domInfos.fields[idx];
		if (fDom.type == 2) {
			for (var i=0; i<domInfos.bys.length; i++) {
				if (domInfos.bys[i].dimAlias == fDom.name) {
					domInfos.bys[i].dimAlias = name;
				}
			}
		}
		fDom.name = name;
		if (needRefresh) domUtils.refresh();
		else generateResultSetHeader();
	},
	modifyCalc : function(idx, name, exp) {
		var fDom = domInfos.fields[idx];
		fDom.name = name;
		fDom.exp = exp;
		domUtils.refresh();
	},
	setSelectOut : function(idx, selectOut, needRefresh) {
		var fDom = domInfos.fields[idx];
		fDom.selectOut = selectOut;
		if (needRefresh) domUtils.refresh();
		else generateResultSetHeader();
	},
	setLevel : function(idx, level, needRefresh) {
		var fDom = domInfos.fields[idx];
		fDom.level = level;
		if (needRefresh) domUtils.refresh();
		else generateResultSetHeader();
	},
	setAggr : function(idx, aggr, needRefresh) {
		var fDom = domInfos.fields[idx];
		fDom.aggr = aggr;
		if (aggr != '' && fDom.type == 1) fDom.useDisp = 0; //2013/1/10,汇总了的维字段不能使用显示值
		domUtils.refresh();
		//if (needRefresh) domUtils.refresh();
		//else generateResultSetHeader();
	},
	
	setFieldWhere : function(idx, where, disp, pos){
		var fDom = domInfos.fields[idx];
		fDom.where = where;
		fDom.whereDisp = disp;
		fDom.wherePos = pos;
	},
	setFieldFormat : function(idx, format, useDisp) {
		var fDom = domInfos.fields[idx];
		fDom.format = format;
		fDom.useDisp = useDisp;
		domUtils.refresh();
	},
	setOrder : function (idx, order) {
		var fDom = domInfos.fields[idx];
		var old = fDom.order;
		var oldSeq = fDom.seq;
		fDom.order = order;
		fDom.seq = order==0?0:1;

		for (var i=0; i<domInfos.fields.length; i++) {
			if (i == idx || domInfos.fields[i].order == 0) continue;
			if (old == 0 && order != 0) {
				domInfos.fields[i].seq += 1;
			} else if (order == 0 && old != 0) {
				if (domInfos.fields[i].seq > oldSeq) domInfos.fields[i].seq += -1;
			} else {
				if (domInfos.fields[i].seq < oldSeq) domInfos.fields[i].seq += 1;
			}
		}

		domUtils.refresh();
	},
	setTableInfo : function(tAlias, annexT, joinType) {
		var tDom = domUtils.getTable(tAlias);
		tDom.annexT = annexT;
		tDom.joinType = joinType;
		domUtils.refresh();
	},
	reOrder : function(orders, flag) {
		var newOrder = new Array();
		orders = orders.split(',');
		var result = '';
		if (flag == 1) {
			for (var i=0; i<orders.length; i++) {
				newOrder[i] = domInfos.fields[orders[i]];
			}
		} else {
			for (var i=0; i<orders.length; i++) {
				newOrder[orders[i]] = domInfos.fields[i];
			}
		}
		
		domInfos.fields = newOrder;
		domUtils.refresh();
		return result;
	},
	reOrderBy : function(orderStr) {
		for (var i=0; i<domInfos.fields.length; i++) {
			domInfos.fields[i].seq = 0;
			domInfos.fields[i].order = 0;
		}
		orderStr = orderStr.split(',');
		for (var i=0; i<orderStr.length; i++) {
			var oi = orderStr[i].split('<:>');
			if (oi.length != 3) continue;
			var fDom = domUtils.getField(oi[0]);
			if (fDom) {
				fDom.seq = oi[1];
				fDom.order = oi[2];
			}
		}
		domUtils.refresh();
	},
	reOrderTable : function(tables) {
		tables = tables.split(',');
		var newTables = new Array();
		for (var i=0; i<tables.length; i++) {
			newTables[i] = domUtils.getTable(tables[i]);
		}
		domInfos.tables = newTables;
		domUtils.refresh();
	},
	refresh : function() {
		//alert(11);
		var d1 = new Date();
		//$('#currDs').attr('disabled', domInfos.fields.length > 0).css('color', domInfos.fields.length>0?'lightgray':'');
		dropDoms = new Array();
		var date1 = new Date().getTime();
		var tableWidth = colWidths['c0'] + colWidths['c1'] + colWidths['c2'] + colWidths['c3'] + colWidths['c4'] + colWidths['c5'];
		for (var i=0; i<domInfos.tables.length; i++) {
			if (!colWidths[domInfos.tables[i].name]) colWidths[domInfos.tables[i].name] = 120;
			tableWidth += colWidths[domInfos.tables[i].name];
		}
		//alert(tableWidth);
		//while (colWidths.length > 6 + domInfos.tables.length) colWidths.pop();
		//for (var i=0; i<colWidths.length; i++) tableWidth += colWidths[i];
		var tDom1 = $("<table id='dimTable' style='width:" + tableWidth + "px;background-color:#FFFFFF;table-layout:fixed;border-collapse:collapse;border:0px;' border=1 cellspacing=0 cellpadding=0></table>");
		var titleTr1 = $("<tr id='dimTr' style='text-align:center;background-image:url(.." + consts.imgFolder + consts.img6 + ");height:25px;'></tr>");
		tDom1.append(titleTr1);
		var newDimTd = $('<td id="newDimTd" style="border-color:#BFC2C6 #D0D0D0 #BFC2C6 #BFC2C6;border-width:1px;border-style:solid dotted solid solid;padding-left:3px;width:' + colWidths['c0'] + 'px;" cn="c0"><div>维</div></td>');
		titleTr1.attr('ct','background-image');	
		titleTr1.css('background-image', "url(.." + consts.imgFolder + consts.img6 + ")");
		titleTr1.attr('c1',"url(.." + consts.imgFolder + consts.img6 + ")");
		titleTr1.attr('c2','url(..' + consts.imgFolder + 'tr-active.jpg)');
		titleTr1.attr('c3','url(..' + consts.imgFolder + 'tr-on.jpg)');
		//titleTr1.droppable(onDrop);
		dropDoms[dropDoms.length] = titleTr1;
		titleTr1.append(newDimTd);
		titleTr1.append("<td cn='c1' style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;padding-left:3px;width:" + colWidths['c1'] + "px'><div>名称</div></td><td cn='c2' style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;padding-left:3px;width:" + colWidths['c2'] + "px;'><div>层</div></td><td cn='c3' id='orderbytitle' style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;padding-left:3px;width:" + colWidths['c3'] + "px;'><div>排序</div></td><td cn='c4' style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;padding-left:3px;width:" + colWidths['c4'] + "px;'><div id='complexWhere' style='cursor:pointer;display:none;'>+条件</div><div>条件</div></td><td cn='c5' style='border-color:#BFC2C6 #BFC2C6 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid solid solid dotted;padding-left:3px;width:" + colWidths['c5'] + "px;'><div>显示格式</div></td>");
		titleTr1.find('#complexWhere').click(function(){
			currWhereField = null;
			initComplexWhere();
			
			$('#wherePos').attr('value','');
			$('#cfExpression1').attr('value','');

			//$('#fkWherePos').attr('value','');
			

			$('#focusInput').css('display','block');
			var dlg = art.dialog({
				id : dialogCount++,
				title : '设置查询条件',
			    content: $('#setWheres')[0]
			    ,ok : function() {
			    	saveWhere();
			    }
			    ,cancel : true
			    ,okVal : '确定'
			    ,cancelVal : '取消'
			    ,lock : true
			    ,duration : 0
			    ,width : '600px'
				,height : '300px'
				,opacity : 0.1
				,padding : '2px 2px'
			});
			if ($('#setWheres').length == 0) {
				$('body').append(dlg.DOM.wrap);
			}
			$('#focusInput').css('display','none');
			
			whereTab(4);
		});
		titleTr1.find('#orderbytitle').dblclick(function(){
			if (domInfos.fields.length == 0) return;
			$('#noOrdersDiv').html('');
			$('#ordersDiv').html('');
			var orders = new Array();
			currOrderStr = '';
			for (var i=0; i<domInfos.fields.length; i++) {
				var fDom = domInfos.fields[i];
				var li = $('<li order="1" class="ui-state-highlight" style="height:17px;margin: 3px; padding: 3px; width: 120px;"><a href="#">' + fDom.name + '</a></li>');
				li.css('cursor','move').find('a').click(function(){
					if ($(this).parent().parent()[0].id == 'noOrdersDiv') return;
					$(this).parent().attr('order', $(this).parent().attr('order')==1?-1:1);
					refreshOrderBys();
				});
				if (fDom.order == 0) $('#noOrdersDiv').append(li);
				else {
					orders[fDom.seq] = fDom;
				}
			}
			for (var i=0; i<orders.length; i++) {
				var fDom = orders[i];
				if (!fDom) continue;
				var li = $('<li order="' + fDom.order + '" class="ui-state-highlight" style="height:17px;margin: 3px; padding: 3px; width: 120px;"><a href="#">' + fDom.name + '</a></li>');
				li.css('cursor','move').find('a').click(function(){
					if ($(this).parent().parent()[0].id == 'noOrdersDiv') return;
					$(this).parent().attr('order', $(this).parent().attr('order')==1?-1:1);
					refreshOrderBys();
				});
				$('#ordersDiv').append(li);
				if (currOrderStr != '') currOrderStr += ',';
				currOrderStr += fDom.name + '<:>' + fDom.seq + "<:>" + fDom.order;
			}
			refreshOrderBys();
			var dlg = art.dialog({
				id : dialogCount++,
				title : '设置结果集排序',
			    content: $('#setOrderBy')[0]
			    ,ok : function() {
			    	setOrderBy();
			    }
			    ,cancel : true
			    ,okVal : '确定'
			    ,cancelVal : '取消'
			    ,lock : true
			    ,duration : 0
				,opacity : 0.1
				,zIndex : 10001
				,padding : '5px 5px'
			});
			if ($('#setOrderBy').length == 0) {
				$('body').append(dlg.DOM.wrap);
			}
			
		});

		for (var i=0; i<domInfos.tables.length; i++) {
			var lj = "";
			if (i > 0) lj = domInfos.tables[i].joinType==0?'[连]':(domInfos.tables[i].joinType==1?'[左]':(domInfos.tables[i].joinType==2?'[全]':''));
			var atObj = mdUtils.getTable(domInfos.tables[i].annexT);
			var annexTName = atObj.name;
			if (atObj.dispName && atObj.dispName != '') annexTName = atObj.dispName;
			var titleTd = $('<td cn="' + domInfos.tables[i].name + '" style="border:1px solid ' + consts.color8 + ';padding-left:3px;width:' + colWidths[domInfos.tables[i].name] + 'px;" class="tableName"><div>' + lj + annexTName + '</div></td>');
			titleTd.attr('ct','background-color');
			titleTd.css('background-color', consts.color20);
			titleTd.attr('c1',consts.color20);
			titleTd.attr('c2',consts.color13);
			titleTd.attr('c3',consts.color14);

			titleTd.attr('ct','background-image');
			titleTd.css('background-image', 'url(..' + consts.imgFolder + 'tr-table.png)');
			titleTd.attr('c1','url(..' + consts.imgFolder + 'tr-table.png)');
			titleTd.attr('c2','url(..' + consts.imgFolder + 'tr-active.jpg)');
			titleTd.attr('c3','url(..' + consts.imgFolder + 'tr-on.jpg)');

			titleTd.attr('tAlias', domInfos.tables[i].name);
			titleTd.droppable(fieldDrop);
			dropDoms[dropDoms.length] = titleTd;
			titleTd.dblclick(function(){
				var d = $('#setTableInfo');
				var tAlias = $(this).attr('tAlias');
				var first = tAlias == domInfos.tables[0].name;
				var tDom1 = domUtils.getTable(tAlias);
				d.find('#jtDiv').css('display', first?'none':'block');
				var dlg = art.dialog({
					id : dialogCount++,
					title : '设置表信息',
				    content: $('#setTableInfo')[0]
				    ,ok : function() {
				    	setTableInfo();
				    }
				    ,cancel : true
				    ,okVal : '确定'
				    ,cancelVal : '取消'
				    ,lock : true
				    ,duration : 0
					,opacity : 0.1
					,zIndex : 10001
					,padding : '2px 2px'
				});
				if ($('#setTableInfo').length == 0) {
					$('body').append(dlg.DOM.wrap);
				}
				//d.dialog('open');
				currTIAlias = tDom1.name;
				var annexT = tDom1.annexT;
				var jt = tDom1.joinType;
				var ts = mdUtils.getAnnexTables(annexT);
				var html = '<select id="usedTable" size=4 style="color:' + consts.color22 + '">';
				if (ts) {
					for (var k=0; k<ts.length; k++) {
						var ta = mdUtils.getTableAlias(ts[k].name);
						html += '<option value="' + ts[k].name + '"' + (ts[k].name==annexT?' selected':'') + '>' + ta + '</option>';
					}
				} else {
					var ta = mdUtils.getTableAlias(annexT);
					html += '<option value="' + annexT + '" selected>' + ta + '</option>';
				}
				html += '</select>';
				d.find('#tables').html(html);
				d.find('input[name=joinType]').each(function(){
					//alert(jt + "--" + this.value);
					if (this.value == jt) this.checked = true;
				});
			});
			titleTr1.append(titleTd);
		}
		
		
		titleTr1.find('div').resizable({
			start : function(event,ui){
				//event.stopPropagation();
			},
			resize:function(event,ui){
				var sz = ui.size.width;
				var idx = ui.helper.parent().prevAll().length;
				var old = colWidths[ui.helper.parent().attr('cn')];
				colWidths[ui.helper.parent().attr('cn')] = sz;
				//alert(parseInt(tDom1.css('width')));
				tDom1.css('width', parseInt(tDom1.css('width')) + sz - parseInt(old) + 'px');
				//ui.helper.parent().css('width',sz+'px');
				tDom1.find('tr').each(function(){
					$(this).find('td')[idx].style.width = sz+'px';
				});
				tDom2.css('width', parseInt(tDom2.css('width')) + sz - parseInt(old) + 'px');
				tDom2.find('tr').each(function(){
					$(this).find('td')[idx].style.width = sz+'px';
				});
				
				//ui.helper.data('trObj').attr('colWidth', parseInt(ui.size.width));
			},
			stop : function(event,ui){
				//ui.helper.parent().css('width',ui.size.width+'px');
				//tr.attr('colWidth', parseInt(ui.size.width));
				titleTr1.sortable( "option", "disabled", false);
			}
		});
		titleTr1.find('.ui-resizable-s').remove();
		titleTr1.find('.ui-icon-gripsmall-diagonal-se').remove();
		titleTr1.find('.ui-resizable-e').mousedown(function(event){
			titleTr1.sortable( "option", "disabled", true);
		}).mouseup(function(event){});
		

		
		titleTr1.sortable({axis:'x',items:'td:.tableName',stop:function(event, ui){
			var oldTables = '';
			for (var i=0; i<domInfos.tables.length; i++) {
				if (i > 0) oldTables += ',';
				oldTables += domInfos.tables[i].name;
			}
			var tables = '';
			var tds = titleTr1.find('td:.tableName');
			for (var i=0; i<tds.length; i++) {
				if (i > 0) tables += ',';
				tables += $(tds[i]).attr('tAlias'); 
			}
			var undo = 'operations.reOrderTable("' + oldTables + '")';
			var redo = 'operations.reOrderTable("' + tables + '")';
			var oper = {undo:undo,redo:redo};
			operations.addOper(oper);
			eval(redo);
		}, helper : function(e, elt){
        	var h = $(elt).height();
        	var w = $(elt).width();
        	//alert($(elt)[0].tagName + "-***--" + h + "--*--" + w);
			return $("<td style='padding-left:3px;border:1px solid " + consts.color8 + ";background-image:url(.." + consts.imgFolder + "tr-table.png);width:" + elt.width() + "px;height:" + elt.height() + ";'>" + elt.html() + "</td>")[0];
		}, placeholder : {
	        element: function(currentItem) {
	        	//return "&nbsp;";
	        	//var tds = titleTr.find('td');
	        	var h = $(currentItem).height();
	        	var w = $(currentItem)[0].style.width;
	        	//alert(currentItem[0].tagName + "---" + h + "----" + w);
	        	/*
	        	for (var i=6; i<tds.length-1; i++) {
	        		var hi = $(tds[i]).height();
	        		var wi = $(tds[i]).width();
	        		if (h < hi) h = hi;
	        		if (w < wi) w = wi;
	        	}
	        	for (var i=6; i<tds.length; i++) {
	        		$(tds[i]).css('height', h + 'px');
	        		$(tds[i]).css('width', w + 'px');
	        	}
	        	*/
	        	//alert(w);
	            return $("<td style='width:" + w + ";height:" + h + "px;padding-left:3px;border:1px solid lightGrey;'>&nbsp;</td>")[0];
	        },
	        update: function(container, p) {
	            return;
	        }
		}});


		var tDom2 = $("<table id='fieldTable' style='width:" + tableWidth + "px;background-color:#FFFFFF;table-layout:fixed;border-collapse:collapse;border:0px;' border=1 cellspacing=0 cellpadding=0></table>");
		var titleTr2 = $("<tr style='text-align:center;background-image:url(.." + consts.imgFolder + consts.img6 + ");height:25px;'></tr>");
		tDom2.append(titleTr2);
		//2014/2/12隐藏掉newDimTd
		//newDimTd = $('<td bgColorBak="" style="cursor:pointer;border-color:#BFC2C6 #D0D0D0 #BFC2C6 #BFC2C6;border-width:1px;border-style:solid dotted solid solid;border-top:0px;padding-left:3px;width:' + colWidths['c0'] + 'px;" onclick="addCalcField1()">+字段</td>');
		newDimTd = $('<td bgColorBak="" style="border-color:#BFC2C6 #D0D0D0 #BFC2C6 #BFC2C6;border-width:1px;border-style:solid dotted solid solid;border-top:0px;padding-left:3px;width:' + colWidths['c0'] + 'px;">字段</td>');
		titleTr2.append(newDimTd);
		titleTr2.append("<td style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;border-top:0px;padding-left:3px;width:" + colWidths['c1'] + "px;'>&nbsp;</td><td style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;border-top:0px;padding-left:3px;width:" + colWidths['c2'] + "px;'>汇总</td><td style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;border-top:0px;padding-left:3px;width:" + colWidths['c3'] + "px;'>&nbsp;</td><td style='border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;border-top:0px;padding-left:3px;width:" + colWidths['c4'] + "px;'>&nbsp;</td><td style='border-color:#BFC2C6 #BFC2C6 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid solid solid dotted;border-top:0px;padding-left:3px;width:" + colWidths['c5'] + "px;'>&nbsp;</td>");
		for (var i=0; i<domInfos.tables.length; i++) {
			var border = "border-color:#D0D0D1 #BFC2C6 #D0D0D1 #BFC2C6;border-width:1px;border-style:dotted solid dotted solid;";
			var distinct = '&nbsp;';
			if (domInfos.tables.length == 1) {
				var hasDim = false;
				for (var j=0; j<domInfos.fields.length; j++) {
					var fj = domInfos.fields[j];
					if (fj.type == 2 && fj.selectOut == 1) {
						hasDim = true;
						break;
					}
					if (fj.type != 2) break;
				}
				//2014/2/12屏蔽掉
				//if (!hasDim) distinct = '<div style="float:left;"><input' + (disctictStatus?' checked':'') + ' type="checkbox" onchange="disctictStatus=this.checked;" id="distinctBut" style="cursor:pointer;"></div><div style="float:left;cursor:pointer;padding-top:2px;" onclick="$(\'#distinctBut\').click()">去重复值</div>';
			}
			var titleTd = $('<td style="' + border + 'border-top:0px;padding-left:0px;padding-right:3px;width:' + colWidths[domInfos.tables[i].name] + 'px;"><div style="">' + distinct + '</div></td>');
			titleTd.attr('ct','background-color');
			titleTd.css('background-color', "#F8F8F8");
			titleTd.attr('c1',"#F8F8F8");
			titleTd.attr('c2',consts.color13);
			titleTd.attr('c3',consts.color14);
			titleTd.attr('tAlias', domInfos.tables[i].name);
			titleTd.droppable(fieldDrop);
			dropDoms[dropDoms.length] = titleTd;
			titleTr2.append(titleTd);
		}
		//var newTableTd = $('<td bgColorBak="#CBDAED" style="border:0px solid ' + consts.color8 + ';width:' + widths[7] + ';padding-left:3px;background-color:#CBDAED;" id="newTableTd">+表</td>');
		//newTableTd.droppable(fieldDrop);
		//titleTr1.append(newTableTd);
		//titleTr2.append('<td bgColorBak="#FFFFFF" style="border:0px solid ' + consts.color8 + ';width:' + widths[7] + ';padding-left:3px;background-color:#FFFFFF;">&nbsp;</td>');

		
		for (var i=0; i<domInfos.fields.length; i++) {
			var f = domInfos.fields[i];
			var tri = $('<tr id="row' + i + '" class="' + (f.type==2?'dimRow':'fieldRow') + '" style="height:25px;"></tr>');
			if (i>0 && f.type==1 &&　domInfos.fields[i-1].type==2) {
				//tri.css('border-top','2px solid ' + consts.color8);
			}
			tri.attr('fName', f.name);
			
			//tri.css('background-color', f.type==1?'':'#EEEEEE');

			var td1 = $('<td align="center" style="height:25px;border-color:#BFC2C6 #D0D0D0 #BFC2C6 #BFC2C6;border-width:1px;border-style:solid dotted solid solid;width:' + colWidths['c0'] + 'px;padding-right:3px;"><span id="copy" style="display:none;" title="复制"><img src="..' + consts.imgFolder + consts.img20 + '"></span><span id="remove" title="删除"><img style="vertical-align:middle;" src="..' + consts.imgFolder + consts.img21 + '"></span></td>');
			td1.append('&nbsp;<input style="vertical-align:middle;" type="checkbox" id="selectOut"' + (f.selectOut==1?' checked':'') + '>');
			tri.append(td1);
			td1.find('#remove').css('cursor','pointer').click(function(e){
				var idx = parseInt($(this).closest('tr')[0].id.substring(3));
				var redo = 'operations.removeField(' + idx + ')';
				var undo = eval(redo);
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
			});
			td1.find('#selectOut').attr('disabled',f.type==4||f.type==5).click(function(){
				var idx = parseInt($(this).closest('tr')[0].id.substring(3));
				var oper = {undo:'operations.selectOut(' + idx + ',' + (!this.checked) + ')',redo:'operations.selectOut(' + idx + ',' + this.checked + ')'};
				operations.addOper(oper);
				eval(oper.redo);
				//domUtils.setSelectOut(idx, this.checked);
			});

			var td2 = $('<td style="border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;width:' + colWidths['c1'] + 'px;"><input type="text" id="alias" style="width:98%;border:0;color:' + consts.color22 + '" value="' + f.name + '"></td>');
			var modify = function(){
				var currTr = $(this).closest('tr');
				var idx = parseInt(currTr[0].id.substring(3));
				var fDom = domInfos.fields[idx];
				var old = fDom.name;
				var newValue = $.trim(this.value);
				if (newValue == '') {
					//this.value = fDom.name;
					return;
				}
				if (old == this.value) return;
				var aliass = domUtils.getFieldNames();
				aliass[idx] = '';
				if (aliass.indexOf(this.value) >= 0) {
					alert('维、字段中的别名不能重复');
					this.value = old;
					return;
				}
				var oper = {undo:'operations.modifyFieldAlias(' + idx + ',"' + old + '")',redo:'operations.modifyFieldAlias(' + idx + ',"' + newValue + '")'};
				operations.addOper(oper);
				domUtils.setFieldName(idx, newValue);
				currTr.attr('fName', newValue);
			}
			td2.find('#alias').attr('disabled',f.type==4||f.type==5).keyup(modify).blur(function(event){
				var currTr = $(this).closest('tr');
				var idx = parseInt(currTr[0].id.substring(3));
				var fDom = domInfos.fields[idx];
				this.value = fDom.name;
			}).click(function(event){
				//event.stopPropagation();
			}).dblclick(function(e){
			});
			tri.append(td2);


			var td3 = $('<td id="td3" style="border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;width:' + colWidths['c2'] + 'px;">&nbsp;</td>');
			var dimObj;
			if (f.type == 1) {
				var infoObj = parseFieldInfos(f.infos);
				var _t = getInfos(infoObj, 5);
				var _f = getInfos(infoObj, 6);
				var fObj = mdUtils.getField(_t, _f);
				var aggrStr = '';
				if (fObj.aggr != 1) {
					/* 不默认聚合类型了。*/
					var fType = 2;
					if (fObj.type) fType = fObj.type;
					if (fType == 1) {//数字
						aggrStr = '<div style="float:right;padding:0;"><select id="aggr" style="border:1px solid lightGrey;color:' + consts.color22 + '"><option value="" selected>&nbsp;&nbsp;-</option><option value="sum">求和</option><option value="count">计数</option><option value="countd">值计数</option><option value="avg">平均</option><option value="max">最大</option><option value="min">最小</option></select></div>';
						//if (fObj.pk != 1) aggr = 'sum';
					} else if (fType == 2) {//字符
						aggrStr = '<div style="float:right;padding:0;"><select id="aggr" style="border:1px solid lightGrey;color:' + consts.color22 + '"><option value="" selected>&nbsp;&nbsp;-</option><option value="count">计数</option><option value="countd">值计数</option></select></div>';
						//if (fObj.pk != 1) aggr = 'count';
					} else {//日期类。。。
						aggrStr = '<div style="float:right;padding:0;"><select id="aggr" style="border:1px solid lightGrey;color:' + consts.color22 + '"><option value="" selected>&nbsp;&nbsp;-</option><option value="count">计数</option><option value="countd">值计数</option><option value="max">最大</option><option value="min">最小</option></select></div>';
						//if (fObj.pk != 1) aggr = 'count';
					}
				}
				td3.html(aggrStr);
				td3.find('#aggr').attr('value',f.aggr).change(function(){
					//TODO
					var idx = parseInt($(this).closest('tr')[0].id.substring(3));
					var oldAggr = domInfos.fields[idx].aggr;
					var oper = {undo:'operations.changeFieldAggr(' + idx + ',"' + oldAggr + '")',redo:'operations.changeFieldAggr(' + idx + ',"' + this.value + '")'}
					operations.addOper(oper);
					domUtils.setAggr(idx, this.value);
				});
/*
				td3.html('<input type="checkbox" id="selectOut"' + (f.selectOut==1?' checked':'') + '>');
				td3.find('#selectOut').click(function(){
					var idx = parseInt($(this).closest('tr')[0].id.substring(3));
					var oper = {undo:'operations.selectOut(' + idx + ',' + (!this.checked) + ')',redo:'operations.selectOut(' + idx + ',' + this.checked + ')'};
					operations.addOper(oper);
					domUtils.setSelectOut(idx, this.checked);
				});
*/
			} else if (f.type == 2) {
				dimObj = mdUtils.getDim(f.dim);
				if (dimObj && dimObj.destLevels && dimObj.destLevels.length>0) {
					var level = '<select style="font-size:12px;width:100%;color:' + consts.color22 + '" id="toLevels"><option value="' + dimObj.table + '.' + dimObj.field + '">本维</option>';
					var hasOption = false;
					for (var j=0; j<dimObj.destLevels.length; j++) {
						//var lObj = mdUtils.getLevel(fObj.destLevels[i]);
						if (dimObj.destLevels[j].type == 1) continue;
						hasOption = true;
						var destDim = mdUtils.getDimByTableField(dimObj.destLevels[j].dest);
						//var namej = destDim.name;
						//if (destDim.dispName && destDim.dispName != "") namej = destDim.dispName;
						var namej = dimObj.destLevels[j].name;
						level += '<option value="' + dimObj.destLevels[j].dest/*.split(".")[0]*/ + '">' + namej + '</option>'
					}
					level += '</select>';
					if (hasOption) {
						level = $(level);
						level.attr('value',f.level);
						level.change(function(){
							//TODO
							var idx = parseInt($(this).closest('tr')[0].id.substring(3));
							var oldLevel = domInfos.fields[idx].level;
							var oper = {undo:'operations.changeDimLevel(' + idx + ',"' + oldLevel + '")',redo:'operations.changeDimLevel(' + idx + ',"' + this.value + '")'}
							operations.addOper(oper);
							domUtils.setLevel(idx, this.value);
						});
						td3.html('');
						td3.append(level);
					}
				}
			}
			tri.append(td3);

			var td4 = $('<td id="td4" style="color:#70A4D1;border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;width:' + colWidths['c3'] + 'px;" align="center"></td>');
			if (f.order != 0) td4.html(f.seq+(f.order==1?('<img style="vertical-align:middle;border:0;" src="..' + consts.imgFolder + consts.img11 + '">'):('<img style="vertical-align:middle;border:0;" src="..' + consts.imgFolder + consts.img12 + '">')));
			else td4.html('&nbsp;');
			td4.css('cursor','pointer');
			td4.click(function(event){
				var idx = parseInt($(this).closest('tr')[0].id.substring(3));
				var fDom = domInfos.fields[idx];
				if (fDom.type == 4||fDom.type == 5) return;
				var old = fDom.order;
				var newO = old==0?1:old==1?-1:0;
				var redo = 'operations.setFieldOrder(' + idx + ', ' + newO + ')';
				var undo = 'operations.setFieldOrder(' + idx + ', ' + old + ')';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			});
			tri.append(td4);

			var td5 = $('<td id="whereTd" style="border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;width:' + colWidths['c4'] + 'px;padding-left:3px;">' + f.whereDisp + '</td>');
			td5.attr('title',f.whereDisp);
			td5.dblclick(function(e){
				var idx = parseInt($(this).closest('tr')[0].id.substring(3));
				var fDom = domInfos.fields[idx];
				var tab = 3;
				if (fDom.type == 3) return;
				currWhereField = fDom;
				if (fDom.type == 5) {
					tab = 6;

					var usedTable = '';
					var inTable = true;
					var hasMiddle = false;
					var mainTable = '';
					var fs = new Array();
					if (fDom.where.indexOf('fkwhere') == 0) {
						var fkInfos = fDom.where.replaceAll('fkwhere','').replaceAll('_;_AND','');
						if (fkInfos.indexOf('2') == 0) inTable = false;
						fkInfos = fkInfos.substring(1).split('_fk2_');
						usedTable = fkInfos[0];
						mainTable = fkInfos[1];
						fkInfos.remove(usedTable);
						fkInfos.remove(mainTable);
						fs = fkInfos;
					}
					
					initComplexWhere();
					$('#fkWhereTable').attr('value',mainTable);
					var sfs = $('#fkFields');
					for (var p=0; p<fs.length; p++) {
						var fii = $('<span style="color:#31B5EA;margin:3px 8px 3px 0;cursor:pointer;">' + fs[p] + '</span>');
						sfs.append(fii);
						fii.click(function(){
							$(this).remove();
							eventMiddle();
						});
					}
					eventMiddle();
					$('#fkWhere').attr('value',usedTable);
					$('#fkMiddleIn').attr('checked',inTable);
					$('#fkMiddleOut').attr('checked',!inTable);
				} else {
					var t1=t5=false;
					var t2=t3=true;
					var dim = fDom.dim;
					var dimObj = null;
					var dimExp = '';
					var dimType = 0;
					if (dim != '') {
						dimObj = mdUtils.getDim(dim);
						if (dimObj.exp && dimObj.dt > 0) {
							dimExp = dimObj.exp;
							dimType = dimObj.dt;
						}
					}
	
					var fObj;
					var type = 2;
					var edit = '';
					if (fDom.type == 1) {
						var infos = parseFieldInfos(fDom.infos);
						fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6));
						type = fObj.type;
						edit = fObj.edit;
					} else if (fDom.type == 2) {
						fObj = mdUtils.getField(dimObj.table, dimObj.field);
						type = fObj.type;
						edit = fObj.edit;
					}
					if (!type) type = 2;
					var aggr = fDom.aggr;
					var where = currWhereField.where;
					var complexWhere = where;
	
					if ((fDom.aggr == '') || ((fDom.aggr == 'max' || fDom.aggr == 'min') && (type == 3 || type == 4 || type == 5))) {
						edit = '_txt';
						if (dimObj && dimObj.dt) {
							if (dimObj.dt == 1) {//IField中的定义DIM_Y
								edit = '_year';
							}else if (dimObj.dt == 2) {//IField中的定义DIM_M
								edit = '_month';
							}else if (dimObj.dt == 3) {//IField中的定义DIM_D
								edit = '_day';
							}else if (dimObj.dt == 4) {//IField中的定义DIM_YM
								edit = '_yearmonth';
							}else if (dimObj.dt == 5) {//IField中的定义DIM_YMD
								edit = '_date';
							}else if (dimObj.dt == 6) {//IField中的定义DIM_YMD_HMIS
								edit = '_nyrsfm';
							}
						} else {
							if (type == 1 || type == 2) edit = '_txt';
							else if (type == 3) edit = '_date';
							else if (type == 4) edit = '_time';
							else if (type == 5) edit = '_datetime';
						}
					} else {
						type = 1;
						edit = '_txt';
					}
					fDom.dataType = type;
					fDom.edit = edit;
					
					if (fDom.type == 4) {
						tab = 4;
					} 
					if (where != '') {
						if (fDom.type == 1 && fDom.tAlias != '') {
							var tDom = domUtils.getTable(fDom.tAlias);
							var annexT = tDom.annexT;
							var tAlias = tDom.name;
							var aggr = fDom.aggr;//tr.find('#aggr')[0].value;
							if (!aggr) aggr = '';
							var lcts = fDom.lcts;
							/*
							//自动聚合，维中有主键时，对没有聚合方式的字段自动求和或计数。只对选出的字段自动聚合
							if (aggr == '' && hasOn && selectOut == 1) {
								if (!hasAllPk(annexT)) {
									if (type == 1) aggr = 'sum';
									else  aggr = 'count';
								}
							}
							*/
							
							var f = getInfos(parseFieldInfos(fDom.infos), 10, annexT);//tr.find('#fExp').html();
							if (lcts != null && lcts != '') {
								var ls = lcts.split(',');
								for (var k=0; k<ls.length; k++) {
									var lsk = ls[k].split('<_>');
									f += '~' + lsk[0];
								}
							}
							if (fObj.calc == 1 || aggr != '') f = "(" + f + ")";
							if (fObj.calc == 1) {
								var ats = mdUtils.getAnnexTables(annexT);
								if (ats == null) {
									ats = new Array();
									ats[0] = {name:annexT,pks:[]};
								}
								for (var z=0; z<ats.length; z++) {
									var tz = mdUtils.getTable(ats[z].name);
									for (var y=0; y<tz.fields.length; y++) {
										var fzyName = tz.fields[y].name;
										var fzyAlias = tz.fields[y].dispName;
										if (fzyAlias && fzyAlias != fzyName) f = f.replaceAll(fzyAlias, fzyName);
									}
								}
							}
							var fWithAggr = f;
							if (aggr) fWithAggr = aggr + f; //加入聚合函数
							complexWhere = conditionConfig.transfer(type, where, dimType, dimExp);
							complexWhere = complexWhere.replaceAll('_x_', tAlias + '.' + fWithAggr);
						} else if (fDom.type == 2) {
							complexWhere = '';
						}
					}
					
					var typeObj = conditionConfig.getType(type);
					if (typeObj == null) {
						alert('unavailable type[' + type + ']!');
						return;
					}
					//等于:2,3,4,5_;_OR
					var items = '';
					var opt;
					if (where != '' && tab != 4) {
						var as = where.split('_;_')[0].split(':');
						opt = as[0];
						if (as[1]) {
							items = as[1];
							items = items.replaceAll(',','\n');
						}
					}
					$('#dimWhereReverse1')[0].checked = opt == '不等于';
					
					var p = $("#dimItemsDiv1");
					p.html('');
					var sel = '<textarea style="color:#759ACF;font-size:16px;width:100%;height:190px;">' + items + '</textarea>'
					sel = $(sel);
					p.append(sel);
					
					if (fDom.aggr == '' && dimObj != null) {
						if (dimObj.sql == null || dimObj.sql == '') {
							if (dimObj.vs && dimObj.vs != '') {
								tab = 1;
								getDimCallback(dimObj.vs);
								t1 = true;
							}
						} else {
							if (!(dimObj.dt>0 && dimObj.exp!='')) {
								if (tab != 4) tab = 1;
								t1 = true;
								if (escalc) {
									document.title = "01" + dimObj.sql;
								} else {
									jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:4,oper:'dispTable',sql:dimObj.sql,pageId:pageId}, getDimCallback);
								}
							}
						}
						t5 = true;
						
						//dimWhere(dimObj);
						//return;
					}
					
					initConditionDialog();
					
					initComplexWhere();
					
					var mtw = $('#middleTableWhere');
					var mtwStr = '';
					if (dimObj) {
						var usedTable = '';
						var inTable = true;
						var hasMiddle = false;
						if (fDom.where.indexOf('middleTable') == 0) {
							usedTable = fDom.where.replaceAll('middleTable','').replaceAll('_;_AND','');
							if (usedTable.indexOf('2') == 0) inTable = false;
							usedTable = usedTable.substring(1);
						}
						mtwStr += "<option value=''>-------</option>";
						for (var i=0; i<lmd.tables.length; i++) {
							var t = lmd.tables[i];
							if (t.middle && t.dispName) {
								for (var z=0; z<t.fields.length; z++) {
									if (t.fields[z].dim==dimObj.name) {
										var vz = t.name + "→" + t.fields[z].name;
										mtwStr += "<option value='" + vz + "'" + (usedTable==vz?" selected":"") + ">" + t.dispName + "→" + (t.fields[z].dispName?t.fields[z].dispName:t.fields[z].name) + "</option>";
										hasMiddle = true;
									}
								}
							}
						}
						$('#middleIn').attr('checked',inTable);
						$('#middleOut').attr('checked',!inTable);
						if (!hasMiddle) t5 = false;
						if (fDom.where.indexOf('middleTable') == 0 && hasMiddle) {
							tab = 5;
						}
					}
					mtw.html(mtwStr);
	
					
					$('#where-tabs-1').removeClass('selected');
					if (t1) $('#where-tabs-1').removeClass('disabled');
					else $('#where-tabs-1').addClass('disabled');
					$('#where-tabs-2').removeClass('selected');
					if (t2) $('#where-tabs-2').removeClass('disabled');
					else $('#where-tabs-2').addClass('disabled');
					$('#where-tabs-3').removeClass('selected');
					if (t3) $('#where-tabs-3').removeClass('disabled');
					else $('#where-tabs-3').addClass('disabled');
					$('#where-tabs-5').removeClass('selected');
					if (t5) $('#where-tabs-5').removeClass('disabled');
					else $('#where-tabs-5').addClass('disabled');
	
					
					$('#wherePos').attr('value',fDom.wherePos==''?tAlias:fDom.wherePos);
					$('#cfExpression1').attr('value',complexWhere);
				}

				$('#focusInput').css('display','block');
				var dlg = art.dialog({
					id : dialogCount++,
					title : '设置查询条件',
				    content: $('#setWheres')[0]
				    ,ok : function() {
				    	saveWhere();
				    }
				    ,cancel : true
				    ,okVal : '确定'
				    ,cancelVal : '取消'
				    ,lock : true
				    ,duration : 0
				    ,width : '600px'
					,height : '300px'
					,opacity : 0.1
					,padding : '2px 2px'
				});
				if ($('#setWheres').length == 0) {
					$('body').append(dlg.DOM.wrap);
				}
				$('#focusInput').css('display','none');
				
				whereTab(tab);

			});
			tri.append(td5);
			
			var border = "border-color:#BFC2C6 #D0D0D0 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid dotted solid dotted;";
			//if (domInfos.tables.length == 0) 
				border = "border-color:#BFC2C6 #BFC2C6 #BFC2C6 #D0D0D0;border-width:1px;border-style:solid solid solid dotted;";
			var td6 = $('<td id="td6" style="' + border + 'text-overflow: ellipsis; overflow: hidden; white-space: nowrap;width:' + colWidths['c5'] + 'px;padding-left:3px;">&nbsp;</td>');
			var disp = '';
			if (f.useDisp == 1) disp = '显示值';
			if (f.format) disp += '[' + f.format + ']';
			td6.html(disp);
			td6.attr('title',disp);
			td6.dblclick(function(event) {
				var idx = parseInt($(this).closest('tr')[0].id.substring(3));
				var fDom = domInfos.fields[idx];
				if (fDom.type == 4||fDom.type == 5) return;
				currFormatField = fDom;
				var hasDisp = false;
				if (fDom.aggr == '' && fDom.dim != '') {
					var dimObj = mdUtils.getDim(fDom.dim);
					if (dimObj.sql != null && dimObj.sql != '') {
						hasDisp = true;
					}
				}
				$('#formatBox').attr('value', fDom.format);
				$('#useDispBut')[0].checked = (fDom.useDisp == 1);
				$('#useDispBut').attr('checked', fDom.useDisp==1).attr('disabled', !hasDisp);
				var dlg = art.dialog({
					id : dialogCount++,
					title : '设置显示格式',
				    content: $('#setFormat')[0]
				    ,ok : function() {
				    	setFormat();
				    }
				    ,cancel : true
				    ,okVal : '确定'
				    ,cancelVal : '取消'
				    ,lock : true
				    ,duration : 0
					,opacity : 0.1
					,padding : '2px 2px'
				});
				if ($('#setFormat').length == 0) {
					$('body').append(dlg.DOM.wrap);
				}
				//alert($('.aui_state_focus').length + "--" + $('.aui_state_focus').css('display'));
				if ($('#setFormat').length == 0) {
					//alert($('.aui_state_focus').length + "--" + $('.aui_state_focus').css('display'));
					$('.aui_state_focus').css('display', 'block');
				}
				//return;
				//$('#setFormat').dialog('open');
			});
			tri.append(td6);
			
			for (var j=0; j<domInfos.tables.length; j++) {
				var colSpan = 1;
				if (f.type == 3) {
					if (j>0) break;
					colSpan = domInfos.tables.length;
				}
				var t = domInfos.tables[j];
				border = "border-color:#D0D0D1 #BFC2C6 #D0D0D1 #BFC2C6;border-width:1px;border-style:dotted solid dotted solid;";
				if (domInfos.fields.length == i+1) 
					border = "border-color:#D0D0D1 #BFC2C6 #BFC2C6 #BFC2C6;border-width:1px;border-style:dotted solid solid solid;";
				
				var tdj = $('<td colspan="' + colSpan + '" style="' + border + 'text-overflow: ellipsis; overflow: hidden; white-space: nowrap;width:' + colWidths[domInfos.tables[j].name] + 'px;padding-left:3px;">&nbsp;</td>');
				
				tdj.attr('tAlias', t.name);
				if (f.type == 2) tdj.attr('dimAlias', f.name);
				if (f.type == 1) {
					if (t.name == f.tAlias) {
						var c = getInfos(parseFieldInfos(f.infos), 2, t.annexT);
						tdj.html(c);
						tdj.attr('title',c);
					}
				} else if (f.type == 3) {
					tdj.html(f.exp);
					tdj.attr('title',f.exp);
					tdj.dblclick(function(){
						var idx = parseInt($(this).closest('tr')[0].id.substring(3));
						var fDom = domInfos.fields[idx];
						currCFDom1 = fDom;
						currCF1 = fDom.name;
						initCalcFieldDialog1(fDom.name, fDom.exp);
					});
				} else if (f.type == 2) {
					dimObj = mdUtils.getDim(f.dim);
					var byObj = domUtils.getBy(t.name, f.name);
					var infoss = new Array();
					byInfosUtil._getRelations(t.name, f.name, [{table:t.annexT,pInfos:''}], infoss, 0);
					if (infoss.length > 0){
						var slt = '<select>';
						if (byObj && infoss.indexOf(byObj.infos) == -1) infoss = [byObj.infos].concat(infoss);
						for (var z=0; z<infoss.length; z++) {
							var c = getInfos(parseFieldInfos(infoss[z]), 2, t.annexT);
							var selected = '';
							if (byObj && byObj.infos == infoss[z]) selected = ' selected';
							slt += '<option value="' + infoss[z] + '"' + selected + '>' + c + '</option>'
						}
						slt += '<option value=""' + ((byObj && byObj.infos != '')?'':' selected') + '>----</option>'
						slt += '</select>';
						slt = $(slt);
						slt.change(function(){
							var idx = parseInt($(this).closest('tr')[0].id.substring(3));
							var fDom = domInfos.fields[idx];
							var tAlias = $(this).parent().attr('tAlias');
							var infos = '';
							if (domUtils.getBy(tAlias, fDom.name)) infos = domUtils.getBy(tAlias, fDom.name).infos;
							var oper = {undo:'operations.changeByField("' + fDom.name + '","' + infos + '","' + tAlias + '")',redo:'operations.changeByField("' + fDom.name + '","' + this.value + '","' + tAlias + '")'};
							operations.addOper(oper);
							eval(oper.redo);
						});
						tdj.html(slt);
					}
					if (false) {
						if (byObj) {
							var c = getInfos(parseFieldInfos(byObj.infos), 2, t.annexT);
							tdj.html(c);
							tdj.attr('title','删除关系字段[' + c + ']');
							tdj.css('cursor','pointer').click(function(){
								var idx = parseInt($(this).closest('tr')[0].id.substring(3));
								var fDom = domInfos.fields[idx];
								var tAlias = $(this).attr('tAlias');
								var infos = '';
								if (domUtils.getBy(tAlias, fDom.name)) infos = domUtils.getBy(tAlias, fDom.name).infos;
								var oper = {undo:'operations.changeByField("' + fDom.name + '","' + infos + '","' + tAlias + '")',redo:'operations.changeByField("' + fDom.name + '","","' + tAlias + '")'};
								operations.addOper(oper);
								eval(oper.redo);
							});
						}
					}
				}
				//if (f.type == 2) 
				tdj.attr('ct','background-color');
				tdj.css('background-color', "#F8F8F8");
				tdj.attr('c1',"#F8F8F8");
				tdj.attr('c2',consts.color13);
				tdj.attr('c3',consts.color14);
				tdj.droppable(fieldDrop);
				dropDoms[dropDoms.length] = tdj;
				tri.append(tdj);
			}
			
			//newTableTd = $('<td style="background-color:' + consts.color2 + ';border:0px solid ' + consts.color8 + ';width:' + widths[7] + ';padding-left:3px;" bgColorBak="#FFDDFF" id="newTableTd">&nbsp;</td>');
			//newTableTd.droppable(fieldDrop);
			//tri.append(newTableTd);
			if (f.type == 1 || f.type == 3 || f.type == 4 || f.type == 5) {
				if (f.type == 1) {
					tri.click(function(){
						selectField($(this), true);
					});
				}
				tDom2.append(tri);
			} else {
				tDom1.append(tri);
			}
		}

		//2014/3/3隐藏
		var newTableSpan = $('<div bgColorBak="#CBDAED" style="display:none;border:0px solid ' + consts.color8 + ';width:40px;height:30px;padding-left:3px;" id="newTableTd">&nbsp;</div>');//75,54
		newTableSpan.attr('ct','background-image');
		newTableSpan.css('background-image', 'url(..' + consts.imgFolder + 'add-table.png)');
		newTableSpan.attr('c1','url(..' + consts.imgFolder + 'add-table.png)');
		newTableSpan.attr('c2','url(..' + consts.imgFolder + 'add-table-active.png)');
		newTableSpan.attr('c3','url(..' + consts.imgFolder + 'add-table-on.png)');
		newTableSpan.droppable(fieldDrop);
		dropDoms[dropDoms.length] = newTableSpan;
		
		//titleTr1.append(newTableSpan);
		var table = $('<table border=0 style="border:0;border-collapse:collapse;border:0px;" cellspacing=0 cellpadding=0></table>');
		var row1 = $('<tr></tr>');
		var td1 = $('<td></td>');
		td1.append(tDom1);
		var td2 = $('<td style="vertical-align:top" rowspan=3></td>');
		td2.append(newTableSpan);
		row1.append(td1).append(td2);
		var row2 = $('<tr></tr>');
		var td3 = $('<td></td>');
		td3.append(tDom2);
		row2.append(td3);
		var row3 = $('<tr></tr>');
		//var td4 = $('<td><a href="#" onclick="addCalcField1()">计算字段</a></td>');
		var td4 = $('<td>&nbsp;</td>');
		row3.append(td4);
		table.append(row1).append(row2).append(row3);
		var tdDom = $('#tableDiv');
		tdDom.html('<div id="scrollll" style="width:2000px;height:2000px;"></div>');
		tdDom.prepend(table);
		$('#scrollll').remove();
		//tdDom.attr('ct','background-color');
		//tdDom.css('background-color', "#F8F8F8");
		//tdDom.attr('c1',"#F8F8F8");
		//tdDom.attr('c2',consts.color13);
		//tdDom.attr('c3',consts.color14);
		tdDom.droppable(bigDrop);
		
		var date3 = new Date().getTime();
		
		/*
		tDom.find('td').each(function(){
			var curr = $(this);
			curr.css('border', '1px solid '+consts.color8).css('width', curr.width()+'px');
			if (curr.find('input').length==0 && curr.find('select').length==0) $(this).css('padding-left','3px');
		});
		*/
		var date4 = new Date().getTime();
		

		tDom1.sortable({axis:'y',distance:10,items:'tr:.dimRow',stop:function(event, ui){
			if(ui.item.attr('id') == 'dimItem'){
				if (new Date().getTime() - lastOpt < 1000) return;
				lastOpt = new Date().getTime();
				var index = ui.item.index()-1;
				var dim = ui.item.attr('dim');
				var dad = mdUtils.getDefaultAttr4Dim(dim);
				
				var undo = 'operations.removeField(' + index + ')';
				var redo = 'operations.addField(' + index + ',"' + alias + '",2,"","","",0,0,"' + dad.format + '",' + dad.useDisp + ',"' + dim + '",1,"","","","",80,"","","")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			} else {
				var result = "";
				var rows = $('#dimTable tr');
				for (var i=1; i<rows.length; i++) {
					if (result != '') result += ',';
					result += parseInt(rows[i].id.substring(3));
				}
				rows = $('#fieldTable tr');
				for (var i=1; i<rows.length; i++) {
					if (result != '') result += ',';
					result += parseInt(rows[i].id.substring(3));
				}

				var undo = 'operations.reOrderField("' + result + '",2)';
				var redo = 'operations.reOrderField("' + result + '",1)';;
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);

			}
			return;
		}, placeholder : {
	        element: function(currentItem) {
	        	var h = $(currentItem).css('height');
	        	var w = $(currentItem).css('width');
	            return $("<tr><td style='height:25px;border:1px solid " + consts.color8 + "' colspan=" + (6 + domInfos.tables.length) + ">&nbsp;</td></tr>")[0];
	        },
	        update: function(container, p) {
	            return;
	        }
		}});

		tDom2.sortable({axis:'y',distance:10,items:'tr:.fieldRow',stop:function(event, ui){
			var result = "";
			var rows = $('#dimTable tr');
			for (var i=1; i<rows.length; i++) {
				if (result != '') result += ',';
				result += parseInt(rows[i].id.substring(3));
			}
			rows = $('#fieldTable tr');
			for (var i=1; i<rows.length; i++) {
				if (result != '') result += ',';
				result += parseInt(rows[i].id.substring(3));
			}
			var undo = 'operations.reOrderField("' + result + '",2)';
			var redo = 'operations.reOrderField("' + result + '",1)';;
			var oper = {undo:undo,redo:redo};
			operations.addOper(oper);
			eval(redo);
		}, placeholder : {
	        element: function(currentItem) {
	        	var h = $(currentItem).css('height');
	        	var w = $(currentItem).css('width');
	            return $("<tr><td style='height:25px;border:1px solid " + consts.color8 + "' colspan=" + (7 + domInfos.tables.length) + ">&nbsp;</td></tr>")[0];
	        },
	        update: function(container, p) {
	            return;
	        }
		}});
		var date5 = new Date().getTime();

		generateResultSetHeader();
		var date6 = new Date().getTime();
		//alert((date3-date1) + "--" + (date4-date3) + "--" + (date5-date4) + "--" + (date6-date5));
	}
}


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
var currDBName = '';
function setDBName(name) {
	currDBName = name;
}
var qyxName = '';
function setQyxName(name){
	qyxName = name;
}
var consts = {
	relaPath : '../..',
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
	img29 : ''
	
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
		if ($('#undoBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
		operations.currHis--;
		eval(operations.histories[operations.currHis].undo);
		operations.refreshButs();
	},
	redo : function() {
		if ($('#redoBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
		eval(operations.histories[operations.currHis].redo);
		operations.currHis++;
		operations.refreshButs();
	},
	refreshButs : function() {
		var canu = operations.canUndo()==1;
		var canr = operations.canRedo()==1;
		$('#undoBut').attr('disabled', !canu).attr('src','..' +  consts.imgFolder + 'undo' + (canu?'':'-h') + '.png');
		$('#redoBut').attr('disabled', !canr).attr('src','..' +  consts.imgFolder + 'redo' + (canr?'':'-h') + '.png');
		if (escalc) document.title='02';
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
	//增删字段
	addField : function(row, alias, type, where, whereDisp, wherePos, order, seq, format, useDisp, dim, selectOut, infos, aggr, tAlias, level, colWidth, lcts, baks, exp ) {
		var fObj = null;
		var infoObj = null;
		if (type == 1) {
			infoObj = parseFieldInfos(infos);
			var _t = getInfos(infoObj, 5);
			var _f = getInfos(infoObj, 6);
			fObj = mdUtils.getField(_t, _f);
		} else if(type == 2) {
			var dimObj = mdUtils.getDim(dim);
			fObj = mdUtils.getField(dimObj.table, dimObj.field);
		}
		if (fObj == null) {
			//alert('找不到字段，可能原因为qyx和元数据不匹配');
			//return;
		}

		domUtils.addField(row, alias, type, where, whereDisp, wherePos, order, seq, format, useDisp, dim, selectOut, infos, aggr, tAlias, level, colWidth, lcts, exp);
		var hasAddBy = false;
		var addTable = false;
		if (baks != '') {
			var baks = eval(baks);
			if (type == 1) {
				if (baks.table) {
					domUtils.addTable(baks.table.idx,baks.table.name,baks.table.annexT,baks.table.joinType);
					addTable = true;
					if (baks.table.bys) {
						for (var i=0; i<baks.table.bys.length; i++) {
							var by = baks.table.bys[i];
							domUtils.addBy(by.tAlias, by.dimAlias, by.infos);
						}
						hasAddBy = true;
					}
				}
			} else {
				if (baks.bys) {
					for (var i=0; i<baks.bys.length; i++) {
						var by = baks.bys[i];
						domUtils.addBy(by.tAlias, by.dimAlias, by.infos);
					}
				}
			}
		} else {
			if (type == 1) {
				if (!domUtils.getTable(tAlias)) {
					domUtils.addTable(-1, tAlias, getInfos(infoObj, 1), 3);
					addTable = true;
					byInfosUtil.addTableBy(tAlias);
				}
			} else if (type == 2) {
				byInfosUtil.addDimBy(alias);
			}
		}
		domUtils.refresh();
		if (addTable) {
			var td = $("#tableDiv");
			td.scrollLeft(td[0].scrollWidth - td.width());
			//$("#tableDiv").scrollLeft(100);
		}
		return;
	},
	removeField : function(idx) {
		var undo = domUtils.removeField(idx);
		domUtils.refresh();
		return undo;
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
function setConfig(isEnd, conf, middleTables) {
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

	$('.dl_img1').css({'background-image':'url(..' + consts.imgFolder + consts.img3 + ')'});
	$('.dl_img2').attr('src','..' + consts.imgFolder + consts.img4);
	$('.dl_img3').attr('src','..' + consts.imgFolder + consts.img5);
	$('.dl_img4').css({'background-image':'url(..' + consts.imgFolder + consts.img6 + ')'});
	$('.dl_img5').css({'background-image':'url(..' + consts.imgFolder + consts.img7 + ')'});
	$('.dl_img6').attr('src','..' + consts.imgFolder + consts.img8);
	$('.dl_img7').attr('src','..' + consts.imgFolder + consts.img9);
	$('.dl_img8').attr('src','..' + consts.imgFolder + consts.img10);
	$('.dl_img12').attr('src','..' + consts.imgFolder + consts.img28);
	$('.dl_img9').attr('src','..' + consts.imgFolder + consts.img11);
	$('.dl_img10').attr('src','..' + consts.imgFolder + consts.img12);
	$('.dl_img11').attr('src','..' + consts.imgFolder + consts.img13);
	
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
	middleTables = eval(middleTables);
	for (var i=0; i<middleTables.length; i++) {
		var mi = middleTables[i];
		if (mi && mi.name && mi.alias) {
			var t = mdUtils.getTable(mi.name, true);
			if (t) {
				t.dispName = mi.alias;
			}
		}
	}
	for (var i=lmd.tables.length-1; i>=0; i--) {
		if (lmd.tables[i].middle && !lmd.tables[i].dispName) {
			lmd.tables.remove(lmd.tables[i]);
		}
	}
	initPage();
}

function generateFields(filter) {
	var classTable = $('#classTableSelect').attr('value');
	
	var fs = new Array();
	var ts = new Array();
	var fAlias = new Array();
	var faOrder = new Array();
	var tAlias = new Array();
	var tDescs = new Array();
	var fDescs = new Array();
	var tFirst = $('#fieldShowStyle')[0].value == '[表]字段';
	var showDim = $('#fieldShowDim')[0].value == '1';
	var showPK = $('#fieldShowPK')[0].value == '1';
	var bpk=(filter==':主键'), btable=(filter==':表'), btype1=(filter==':数值'), btype2=(filter==':日期'), btype3=(filter==':字符');
	for (var i=0; i<lmd.tables.length; i++) {
		if (lmd.tables[i].type == 2) continue;
		if (lmd.tables[i].middle) continue;
		var t = lmd.tables[i].name;
		var ta = lmd.tables[i].dispName;
		if (editMode == 0 || !ta || ta == '') ta = t;
		if (lmd.tables[i].hide == 1) continue;
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
		for (var j=0; j<lmd.tables[i].fields.length; j++) {
			var fObj = lmd.tables[i].fields[j];
			if (!fObj) continue;
			if (fObj.hide == 1) continue;
			//alert(lmd.tables[i].fields[j].name);
			var f = fObj.name;
			var fa = fObj.dispName;
			if (editMode == 0 || !fa || fa == '') fa = f;
			if (stObj != null && stObj.fields.length>0 && stObj.fields.indexOf(fa)==-1) {
				continue; 
			}
			//主键、表、数值、日期、字符
			var b = false;
			if (filter == null) b = true;
			else {
//				if (bpk && fObj.pk == 1) b = true;
//				else if (btable &&　j == 0) b = true;
///				else if (btype1 && fObj.type == 1) b = true;
//				else if (btype2 && fObj.type >= 3) b = true;
//				else if (btype3 && fObj.type == 2) b = true;
//				else 
				if ((fa + ta + lmd.tables[i].desc + fObj.desc).indexOf(filter) >= 0) b = true;
			}
			if (fObj.dim && fObj.dim != '' && !showDim) b = false;
			if (fObj.pk == 1 && !showPK) b = false;
			if (b) {
				var size = fs.length;
				fs[size] = f;
				ts[size] = t;
				fAlias[size] = fa;
				//if (fa == ta) alert(f + "--------" + t); 
				var exp = fa + '[' + ta + ']';
				if (tFirst) {
					exp = '[' + ta + ']' + fa;
				}
				faOrder[size] = exp + "_|_" + size;
				tAlias[size] = ta;
				tDescs[size] = lmd.tables[i].desc;
				fDescs[size] = fObj.desc;
			}
		}
	}
	//TODO 排序
	//$('#contentDiv').remove();
	faOrder.sort( function compareFunction(p1,p2){
		return p1.localeCompare(p2);
	});
	for (var i=0; i<faOrder.length; i++) {
		faOrder[i] = faOrder[i].split("_|_")[1];
	}
	
	pagi.tables = ts;
	pagi.tAlias = tAlias;
	pagi.fields = fs;
	pagi.fAlias = fAlias;
	pagi.faOrder = faOrder;
	pagi.tDescs = tDescs;
	pagi.fDescs = fDescs;
	pagination(1);
	return;
/*
	var list = $('#contentDiv');//$('<div id="contentDiv"></div>');
	list.html('');
	for (var i=0; i<faOrder.length; i++) {
		if (i > 1000) break;//只支持显示1500个字段，再多了就不显示了，可以通过过滤减少显示数量。
		var index = faOrder[i];
		addItem(list, ts[index], tAlias[index], fs[index], fAlias[index], 1);
	}
*/
}

var pagi = {
	curr:1
	,size:100
	,tables:[]
	,tAlias:[]
	,fields:[]
	,fAlias:[]
	,faOrder:[]
	,tDescs:[]
	,fDescs:[]
}

function pagination(num) {
	var total = parseInt(pagi.faOrder.length/pagi.size);//TO CONFIRM
	if (pagi.faOrder.length%pagi.size > 0) total++;
	num = parseInt(num);
	if (num == NaN) num = 1;
	if (num < 1) num = 1;
	if (num > total) num = total;
	var dom = $('#contentDiv');//$('<div id="contentDiv"></div>');
	dom.html('');
	if (total == 0) return;
	var list = $('<div></div>');
	if (total > 1) {
		var page = $('<div style="width:98%;text-align:right;"></div>');
		page.append('<img title="第一页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(1)" src="..' +  consts.imgFolder + (num==1?'page-first-h.jpg':'page-first.jpg') + '">&nbsp;');
		page.append('<img title="上一页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(' + (num-1) + ')" src="..' +  consts.imgFolder + (num==1?'page-prev-h.jpg':'page-prev.jpg') + '">&nbsp;');
		var ipt = $('<input type="text" style="width:23px;padding:0 0 1px 0;margin-top:2px;font-size:10px;" value="' + num + '">');
		ipt.keyup(function(event){
			if(event.keyCode == 13){
				pagination(this.value);
			}
		});
		page.append(ipt);
		page.append('/' + total)
		page.append('&nbsp;<img title="下一页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(' + (num+1) + ')" src="..' +  consts.imgFolder + (num==total?'page-next-h.jpg':'page-next.jpg') + '">&nbsp;');
		page.append('<img title="最后页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(' + total + ')" src="..' +  consts.imgFolder + (num==total?'page-last-h.jpg':'page-last.jpg') + '">');
		dom.append(page);
	}
	for (var i=(num-1) * 100; i<num * 100; i++) {
		if (i==pagi.faOrder.length) break;
		var index = pagi.faOrder[i];
		addItem(list, pagi.tables[index], pagi.tAlias[index], pagi.fields[index], pagi.fAlias[index], pagi.tDescs[index], pagi.fDescs[index], 1);
	}
	dom.append(list);
	if (total > 1) {
		var page = $('<div style="width:98%;text-align:right;"></div>');
		page.append('<img title="第一页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(1)" src="..' +  consts.imgFolder + (num==1?'page-first-h.jpg':'page-first.jpg') + '">&nbsp;');
		page.append('<img title="上一页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(' + (num-1) + ')" src="..' +  consts.imgFolder + (num==1?'page-prev-h.jpg':'page-prev.jpg') + '">&nbsp;');
		var ipt = $('<input type="text" style="width:23px;padding:0 0 1px 0;margin-top:2px;font-size:10px;" value="' + num + '">');
		ipt.keyup(function(event){
			if(event.keyCode == 13){
				pagination(this.value);
			}
		});
		page.append(ipt);
		page.append('/' + total)
		page.append('&nbsp;<img title="下一页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(' + (num+1) + ')" src="..' +  consts.imgFolder + (num==total?'page-next-h.jpg':'page-next.jpg') + '">&nbsp;');
		page.append('<img title="最后页" style="vertical-align:middle;border:0px;cursor:pointer;" onclick="pagination(' + total + ')" src="..' +  consts.imgFolder + (num==total?'page-last-h.jpg':'page-last.jpg') + '">');
		dom.append(page);
	}
}

function addItem(container, table, tAlias, field, fAlias, tDesc, fDesc, type/*1:字段; 2:外键*/) {
	var but = $('#fieldShowStyle');
	var exp = fAlias + '[' + tAlias + ']';
	
	if (but[0].value != '字段[表]') {
		exp = '[' + tAlias + ']' + fAlias;
	}
	var title = exp;
	if (tDesc || fDesc) {
		if (!tDesc) tDesc = '';
		if (!fDesc) fDesc = '';
		title = tAlias + ':' + tDesc + '&#13' + fAlias + ':' + fDesc;
	}
	if (exp.length > 20) {
		exp = exp.substring(0,20)+"...";
	}
	var curr = $('<div title="' + title + '" style="overflow:hidden;padding:4px 0 0 6px;margin-top:2px;border:0px;height:22px;background-image:url(..' + consts.imgFolder + consts.img14 + ');color:' + consts.color23 + ';" class="item" t="' + table + '" f="' + field + '" ta="' + tAlias + '" fa="' + fAlias + '">' + exp + '</div>');
	
	curr.dblclick(function(){
		var t = $(this);
		loadFields(t.attr('t'));
	});
	curr.attr('canDrag', 1);
	curr.attr('aggr', '');
	curr.css('cursor','move').draggable({
		//handler : "a",
		revert : true,
		cursor : 'move',
		revertDuration: 1,
		containment: 'document',
		appendTo:'body',
		//connectToSortable : "#tableDiv",
		helper: function( event ) {
			var curr = $(this);
			var dim = mdUtils.getDimByTableField(table + "." + field);
			if (dim) dim = dim.name;
			else dim = '';
			var infos = table + split_1 + tAlias + split_1 + field + split_1 + fAlias + split_1 + "" + split_1 + dim + split_1 + dim;
			curr.attr('infos', infos);
			var c = curr.clone();
			c.css('z-index','10001').css('opacity', 0.4);
			return c;
		},
		stop: function(event, ui) {
			//setTimeout("refreshSelectBgColor();",1);
		}
	});
	
	container.append(curr);
}

function generateDimFields() {
	var classTable = $('#classTableSelect').attr('value');
	//TODO 排序
	var list = $('#dimsDiv');//$('<div id="contentDiv"></div>');
	list.html('');
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
		if (editMode == 0 || alias == '' || !alias) alias = lmd.dims[i].name;
		addDim(list, lmd.dims[i].name, alias);
	}
}

function generateTables() {
	//return;
	var classTable = $('#classTableSelect').attr('value');
	
	var ts = new Array();
	var tAlias = new Array();
	var uts = new Array();
	var utAlias = new Array();
	for (var i=0; i<lmd.tables.length; i++) {
		if (lmd.tables[i].type == 2) continue;
		if (lmd.tables[i].hide == 1) continue;
		var t = lmd.tables[i].name;
		var ta = lmd.tables[i].dispName;
		if (editMode == 0 || !ta || ta == '') ta = t;
		if (lmd.tables[i].middle) {
			uts[uts.length] = t;
			utAlias[utAlias.length] = ta;
		} else {
			var show = true;
			if (classTable!=null && classTable!='') {
				show = false;
				Out:
				for (var k=0; k<lmd.classTables.length; k++) {
					if (lmd.classTables[k].name == classTable) {
						for (var m=0; m<lmd.classTables[k].tables.length; m++) {
							var stObj = lmd.classTables[k].tables[m];
							if (stObj.name == ta) {
								show = true;
								break Out;
							}
						}
					}
				}
			}
			if (!show) continue;
			ts[ts.length] = t;
			tAlias[tAlias.length] = ta;
		}
	}

	var std = $('#sysTablesDiv');
	std.html('');
	for (var i=0; i<ts.length; i++) {
		addSubTable(ts[i], std)
	}

	var utd = $('#userTablesDiv');
	utd.html('');
	for (var i=0; i<uts.length; i++) {
		addSubTable(uts[i], utd)
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
	
	var canOpen = mdUtils.getSubTables(dimObj.table).length > 0;
	var openImg = canOpen?('<img src="..' + consts.imgFolder + consts.img15 + '">'):'';
	//if (dimObj == null) openImg = '<img id="openImg" t=1 src="..' + consts.imgFolder + consts.img16 + '">';
	var fImg = consts.img17;
	var exp = alias;
	var conts = '<div id="conts" style="overflow:hidden;margin-bottom:1px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;padding:0px;padding-left:10px;border:0px;"></div>';
	var curr = $('<div style="padding:0px;margin:0px;border:0px;" class="item"><h3 id="dimItem" style="outline:0px;border:1px solid ' + consts.color12 + ';border-bottom:0;border-radius:0px;height:26px;background-image:url(..' + consts.imgFolder + consts.img26 + ');color:' + consts.color23 + ';margin:0px;margin-top:0px;" dim="' + dim + '" title="' + dim + '" t="' + dimObj.table + '"><div style="padding:4px;"><span><img src="..' + consts.imgFolder + fImg + '"></span>' + exp + '<div style="float:right;padding:0 2px 0 0;" id="openImg">' + openImg + '</div>' + '</div></h3>' + conts + '</div>');
	
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
			c.css('z-index','10001').css('opacity', 0.4);
			return c;
		},
		stop: function(event, ui) {
			//setTimeout("refreshSelectBgColor();",1);
		}
	}).dblclick(function(){
	});

	curr.accordion({
		changestart: function(event, ui) {
			if (!canOpen) return;
			if (ui.newContent.html() == null) {
				ui.oldHeader.attr('state', 'close');
			} else {
				ui.newHeader.attr('state', 'open');
				reloadSubTable(dimObj.table, ui.newContent, true);
				ui.newContent.css('height','');
			}
		},
		change: function(event, ui) {
			return;
		},
		collapsible: true,
		active : false,
		event : '',
		icons : false
	});

	curr.find('h3').skygqOneDblClick({oneclick:function(){
		curr.accordion( "option", "active", 0 );
	},dblclick:function(){
		loadFields(dimObj.table);
	}});

}

function reloadSubTable(table, container, clear) {
	var subs = mdUtils.getSubTables(table);
	if (clear) container.html('');
	if (subs.length == 0) return;
	for (var z=0; z<subs.length; z++) {
		addSubTable(subs[z], container, mdUtils.getSubTableRela(table, subs[z]));
	}
}

function addSubTable(table, container, fields) {
	var canOpen = mdUtils.getSubTables(table).length > 0;
	var tObj = mdUtils.getTable(table);
	var openImg = canOpen?('<img src="..' + consts.imgFolder + consts.img15 + '">'):'';
	var fImg = consts.img17;
	var alias = tObj.dispName;
	if (editMode == 0 || alias == '' || !alias) alias = table;
	if (fields) alias += ' [' + fields + ']';
	var conts = '<div id="conts" style="overflow:hidden;margin-bottom:1px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;padding:0px;padding-left:10px;border:0px;"></div>';
	var curr = $('<div style="padding:0px;margin:0px;border:0px;" class="item"><h3 style="outline:0px;border:1px solid ' + consts.color12 + ';border-bottom:0;border-radius:0px;height:26px;background-image:url(..' + consts.imgFolder + consts.img27 + ');color:' + consts.color23 + ';margin:0px;margin-top:0px;" title="' + alias + '" t="' + tObj.name + '"><div style="padding:4px;"><span><img src="..' + consts.imgFolder + fImg + '"></span>' + alias + '<div style="float:right;padding:0 2px 0 0;" id="openImg">' + openImg + '</div>' + '</div></h3>' + conts + '</div>');
	
	container.append(curr);

	curr.accordion({
		changestart: function(event, ui) {
			if (!canOpen) return;
			if (ui.newContent.html() == null) {
				ui.oldHeader.attr('state', 'close');
			} else {
				ui.newHeader.attr('state', 'open');
				reloadSubTable(table, ui.newContent, true);
				ui.newContent.css('height','');
			}
		},
		change: function(event, ui) {
			return;
		},
		collapsible: true,
		active : false,
		event : canOpen?'':'',
		icons : false
	});

	curr.find('h3').skygqOneDblClick({oneclick:function(){
		curr.accordion( "option", "active", 0 );
	},dblclick:function(){
		loadFields(table);
	}});
}

var currShowTable;
/*
	type 1：加载附表；  2：加载定位式
*/
function reloadSubs2(type, targetTable, contents, refreshAnyway, parents) {
	var firstLevel = contents.attr('id') == 'fieldsDiv';
	if ((!refreshAnyway) && firstLevel && targetTable == currShowTable) return;
	contents.html('');
	if (type == 1) {
		
		var tables = mdUtils.getAnnexTables(targetTable);
		if (!tables) {
			tables = new Array();
			tables[0] = {name:targetTable,pks:[]};
		}
		var fArray = new Array();
		var tArray = new Array();
		var fAlias = new Array();
		var tAlias = new Array();
		var types = new Array();
		var fieldsOnly = new Array();//记录字段，检查是否重名
		var fieldsWithTable = new Array();//最终的结果，重名字段增加“@表”
		for (var i=0; i<tables.length; i++) {
			var currTable = mdUtils.getTable(tables[i].name);
			if (currTable.hide == 1) continue;
			var tj = currTable.name;
			var ta = currTable.dispName;
			if (editMode == 0 || !ta || ta == '') ta = tj;
			for (var j=0; j<currTable.fields.length; j++) {
				if (currTable.fields[j].hide == 1) continue;
				if (currTable.fields[j].pk == 1 && (tj != targetTable || !firstLevel)) continue;
				var fj = currTable.fields[j].name;
				var fa = currTable.fields[j].dispName;
				if (editMode == 0 || !fa || fa == '') fa = fj;
				
				fArray[fArray.length] = fj;
				tArray[tArray.length] = tj;
				fAlias[fAlias.length] = fa;
				tAlias[tAlias.length] = ta;
				types[types.length] = 1;
				fieldsWithTable[fieldsWithTable.length] = currTable.fields[j].name + '@' + currTable.name;
				fieldsOnly[fieldsOnly.length] = currTable.fields[j].name;
			}
			if (currTable.fks) {
				for (var j=0; j<currTable.fks.length; j++) {
					if (!currTable.fks[j]) continue;
					if (currTable.fks[j].hide == 1) continue;
					if (currTable.fks[j].fields.length == 1) continue;
					var fj = currTable.fks[j].name;
					var fa = currTable.fks[j].dispName;
					if (editMode == 0 || !fa || fa == '') fa = fj;
					fArray[fArray.length] = fj;
					tArray[tArray.length] = tj;
					fAlias[fAlias.length] = fa; 
					tAlias[tAlias.length] = ta;
					types[types.length] = 2;
					fieldsWithTable[fieldsWithTable.length] = currTable.fks[j].name + '@' + currTable.name;
					fieldsOnly[fieldsOnly.length] = currTable.fks[j].name;
				}
			}
		}
		for (var i=0; i<fieldsOnly.length; i++) {
			if (fieldsOnly.indexOf(fieldsOnly[i]) == fieldsOnly.lastIndexOf(fieldsOnly[i])) fieldsWithTable[i] = fieldsOnly[i];
		}
	
		//TODO
		for (var i=0; i<fArray.length; i++) {
			addSub(contents, tArray[i], fArray[i], tAlias[i], fAlias[i], types[i], fieldsWithTable[i]);
		}
	
	} else {
		var lctNames = new Array();
		var ps = new Array();
		var exists = new Array();
		if (parents != '') exists = parents.split(',');
		var count = 0;
		var lcts = getLocators(targetTable);
		for (var j=0; j<lcts.length; j++) {
			var lct = lcts[j];
			if (exists.indexOf(count) >= 0) {
				count++;
				continue;
			}
			for (var k=0; k<lct.length; k++) {
				lctNames[lctNames.length] = lct[k];
				ps[ps.length] = (parents==''?(count+''):(parents+','+count));
			}
			count++;
		}
		for (var i=0; i<ps.length; i++) {
			addSub(contents, targetTable, null, null, null, 3, null, lctNames[i], ps[i]);
		}
	}
	if (contents.attr('id') != 'fieldsDiv') contents.css('height','');
	else {
		var addCFDom = $('<div style="padding:0px;margin:0px;border:0px;"><div style="display:none;border:1px solid lightGray;border-radius:0px;" id="calcEditDiv"></div><h3 style="outline:0px;border:1px solid ' + consts.color12 + ';border-bottom:0;border-radius:0px;height:26px;background-image:url(..' + consts.imgFolder + consts.img14 + ');color:' + consts.color23 + ';margin:0px;margin-top:0px;"><div style="padding:4px;"><div style="float:right;padding:0 2px 0 0;">' + '<div style="float:right;padding:0 0 0 4px;"><img src="..' + consts.imgFolder + consts.img24 + '"></div>' + "<div style='float:right;padding-top:1px;'><a href='#' style='color:#6382bf;font-family:Adobe 黑体 Std;font-weight:bold;text-decoration:none;color:#365572;font-size:11px;' id='addCFBut'>添加伪字段</a></div>" + '</div></div></h3></div>');
		
		/* 2014/2/12屏蔽掉
		contents.append(addCFDom);
		addCFDom.find('#addCFBut').click(function(){
			modifyCalcField(addCFDom, targetTable);
		});
		*/

		//var addFKDom = $('<div style="padding:0px;margin:0px;border:0px;"><div style="display:none;border:1px solid lightGray;border-radius:0px;" id="fkEditDiv"></div><h3 style="outline:0px;border:1px solid ' + consts.color12 + ';border-bottom:0;border-radius:0px;height:26px;background-image:url(..' + consts.imgFolder + consts.img14 + ');color:' + consts.color23 + ';margin:0px;margin-top:0px;"><div style="padding:4px;"><div style="float:right;padding:0 2px 0 0;">' + '<div style="float:right;padding:0 0 0 4px;"><img src="..' + consts.imgFolder + consts.img24 + '"></div>' + "<div style='float:right;padding-top:1px;'><a href='#' style='color:#6382bf;font-family:Adobe 黑体 Std;font-weight:bold;text-decoration:none;color:#365572;font-size:11px;' id='addFKBut'>添加外键字段</a></div>" + '</div></div></h3></div>');
		//contents.append(addFKDom);
		//addFKDom.find('#addFKBut').click(function(){
		//	modifyForeignKey(addFKDom, targetTable);
		//});
		
		currShowTable = targetTable;
		if (mdUtils.getTable(targetTable).dql) $("#subQuerySel").attr('value', targetTable);
		else $("#subQuerySel").attr('value', '');

		var lts = $("#latestTables");
		var vts = '<option>最近查看的表</option>';
		for (var i=viewedTables.length-2; i>=0; i--) {
			var tiObj = mdUtils.getTable(viewedTables[i]);
			var tialias = tiObj.dispName;
			if (editMode == 0 || tialias == '' || !tialias) tialias = viewedTables[i];
			vts += '<option value="' + viewedTables[i] + '">' + tialias + '</option>';
		}
		lts.html(vts);
		
/*		
		if (mdUtils.getSubTables(targetTable).length > 0) {
			contents.append('<div style="font-size:12px;">子表</div>');
			reloadSubTable(targetTable, contents, false);
		}

		if (viewedTables.length > 1) {
			contents.append('<div style="font-size:12px;">最近查看的表</div>');
			for (var i=viewedTables.length-2; i>=0; i--) {
				addSubTable(viewedTables[i], contents);
			}
		}
*/
	}
}
function reloadSubs(targetTable, contents, refreshAnyway) {
	reloadSubs2(1, targetTable, contents, refreshAnyway)
}
function getLocators(table) {
	var locators = new Array();
	var tables = mdUtils.getAnnexTables(table);
	if (!tables) {
		tables = new Array();
		tables[0] = {name:table,pks:[]};
	}
	for (var i=0; i<tables.length; i++) {
		var currTable = mdUtils.getTable(tables[i].name);
		if (currTable.locators) {
			for (var j=0; j<currTable.locators.length; j++) {
				var lct = currTable.locators[j];
				locators[locators.length] = lct;
			}
		}
	}
	//locators[0] = ['YW<_>语文','SX<_>数学','YW<_>外语'];
	//locators[1] = ['YXQ<_>一学期','EXQ<_>二学期'];
	//locators[2] = ['NAN<_>男','NV<_>女'];
	
	return locators;
}

//{name:'',exp:'',table:''}
//var calcFields = new Array();

var currCFTable = null;
var currCF = null;
var currCFDom = null;
/*
function addCalcField(table) {
	currCFTable = table;
	currCF = null;

	var names = new Array();
	var tObj = mdUtils.getTable(table);
	for (var i=0; i<tObj.fields.length; i++) {
		names[names.length] = tObj.fields[i].dispName;
	}
	var newName;
	for (j=1; j<10000; j++) {
		var newName = 'calc_' + j;
		if (names.indexOf(newName) == -1) break;
	}
	initCalcFieldDialog(newName, '', table);
}
function initCalcFieldDialog(name, exp, table) {
	var refDiv = $('#referenceFields');
	refDiv.html('');
	var tbs = mdUtils.getAnnexTables(table);
	if (!tbs) {
		tbs = new Array();
		tbs[0] = table;
	}
	var fields = new Array();//记录字段，检查是否重名

	var fs = new Array();//最终的结果，重名字段增加“\表”

	for (var i=0; i<tbs.length; i++) {
		var tObj = mdUtils.getTable(tbs[i]);
		for (var j=0; j<tObj.fields.length; j++) {
			var fObj = tObj.fields[j];
			fs[fs.length] = fObj.name + '@' + tObj.name;
			fields[fields.length] = fObj.name;
		}
	}
	for (var i=0; i<fields.length; i++) {
		if (fields.indexOf(fields[i]) == fields.lastIndexOf(fields[i])) fs[i] = fields[i];
	}
	
	for (var i=0; i<fs.length; i++) {
		refDiv.append('<span style="padding:0 15px 3px 0;"><a href="#" style="color:grey;">' + fs[i] + '</a></span>');
	}
	refDiv.find('a').click(function(){
		cfExp.focus();
		var pos = getInputSelection(cfExp[0]).end;//cfExp.attr("selectionEnd");
		var val = cfExp.attr('value');
		var lastVal = val.substring(0, pos) + ' ' + $(this).html() + ' ' + val.substring(pos);
		pos = pos + $(this).html().length + 2;
		cfExp.attr('value', lastVal);
		setCaretToPos(cfExp[0], pos);
	});

	var cfName = $('#cfName');
	cfName.attr('value', name);
	
	var cfExp = $('#cfExpression');
	cfExp.attr('value', exp);
	$("#setCalcField").dialog('open');
}
*/
function modifyForeignKey(dom, table, cf) {
	if (currFKDom != null) {
		currFKDom.find('h3').css('display','block');
		currFKDom.find('#calcFKDiv').css('display','none');
		currFKDom = null;
	}
	currFKDom = dom;
	currFKTable = table;
	currFK = cf;

	var fkObj;
	var tObj = mdUtils.getTable(table);
	for (var i=0; i<tObj.fks.length; i++) {
		if (tObj.fks[i].dispName == cf) {
			fkObj = tObj.fks[i];
			break;
		}
	}

	var editDiv = dom.find('#fkEditDiv');
	
	editDiv.html("<div><div style='float:left;width:30%;'><input type='text' id='name' value='名称' style='width:100%;height:16px;'></div><div style='float:left;width:34%;margin-left:8px;'><select id='targetTable' style='width:100%;height:22px;'></select></div><div style='float:right;width:16%;'><input id='cancelBut' style='width:98%;height:22px;border:1px solid lightGrey;' type='button' value='取消'></div><div style='float:right;width:16%;'><input id='saveBut' style='width:98%;height:22px;border:1px solid lightGrey;' type='button' value='保存'></div></div><div style='margin:25px 3px 0 0;' id='fields'></div>");
	editDiv.css('display','block').css('height','').css('padding','4px');
	dom.find('h3').css('display','none');
	var nameDom = editDiv.find('#name');
	var fieldsDom = editDiv.find('#fields');
	var ttDom = editDiv.find('#targetTable');
	if (fkObj) {
		nameDom.attr('value', fkObj.dispName);
		fieldsDom.attr('value', fObj.name);
		//dataTypeDom.attr('value', fObj.type)		
	} else {
		nameDom.attr('value', '名称').css('color', 'gray');
		expDom.attr('value', '表达式').css('color', 'gray');
	}
	nameDom.focus(function(){
		if (this.style.color != '') {
			this.style.color = '';
			this.value = '';
		}
		return true;
	});
	expDom.focus(function(){
		if (this.style.color != '') {
			this.style.color = '';
			this.value = '';
		}
		return true;
	});

	editDiv.find('#saveBut').css('cursor','pointer').click(function(){
		if (nameDom.attr('value') == '名称') nameDom.attr('value','');
		if (expDom.attr('value') == '表达式') expDom.attr('value','');
		setCalcField(nameDom.attr('value'), expDom.attr('value'), dataTypeDom.attr('value'));
	});
	editDiv.find('#cancelBut').css('cursor','pointer').click(function(){
		dom.find('h3').css('display','block');
		editDiv.css('display','none');
		currCFDom = null;
	});

}

function modifyCalcField(dom, table, cf) {
	if (currCFDom != null) {
		currCFDom.find('h3').css('display','block');
		currCFDom.find('#calcEditDiv').css('display','none');
		currCFDom = null;
	}
	currCFDom = dom;
	currCFTable = table;
	currCF = cf;

	var fObj;
	var tObj = mdUtils.getTable(table);
	for (var i=0; i<tObj.fields.length; i++) {
		if (tObj.fields[i].dispName == cf) {
			fObj = tObj.fields[i];
			break;
		}
	}

	var editDiv = dom.find('#calcEditDiv');
	
	editDiv.html("<div><div style='float:left;width:30%;'><input type='text' id='name' value='名称' style='width:100%;height:16px;'></div><div style='float:left;width:34%;margin-left:8px;'><select id='dataType' style='width:100%;height:22px;'><option value='1'>数值</option><option value='2'>字符</option><option value='3'>日期</option><option value='4'>时间</option><option value='5'>日期时间</option></select></div><div style='float:right;width:16%;'><input id='cancelBut' style='width:98%;height:22px;border:1px solid lightGrey;' type='button' value='取消'></div><div style='float:right;width:16%;'><input id='saveBut' style='width:98%;height:22px;border:1px solid lightGrey;' type='button' value='保存'></div></div><div style='margin:25px 3px 0 0;'><input id='exp' type='text' value='表达式' style='width:99%;height:16px;'></div>");
	editDiv.css('display','block').css('height','').css('padding','4px');
	dom.find('h3').css('display','none');
	var nameDom = editDiv.find('#name');
	var expDom = editDiv.find('#exp');
	var dataTypeDom = editDiv.find('#dataType');
	if (fObj) {
		nameDom.attr('value', fObj.dispName);
		expDom.attr('value', fObj.name)		
		dataTypeDom.attr('value', fObj.type)		
	} else {
		nameDom.attr('value', '名称').css('color', 'gray');
		expDom.attr('value', '表达式').css('color', 'gray');
	}
	nameDom.focus(function(){
		if (this.style.color != '') {
			this.style.color = '';
			this.value = '';
		}
		return true;
	});
	expDom.focus(function(){
		if (this.style.color != '') {
			this.style.color = '';
			this.value = '';
		}
		return true;
	});

	editDiv.find('#saveBut').css('cursor','pointer').click(function(){
		if (nameDom.attr('value') == '名称') nameDom.attr('value','');
		if (expDom.attr('value') == '表达式') expDom.attr('value','');
		setCalcField(nameDom.attr('value'), expDom.attr('value'), dataTypeDom.attr('value'));
	});
	editDiv.find('#cancelBut').css('cursor','pointer').click(function(){
		dom.find('h3').css('display','block');
		editDiv.css('display','none');
		currCFDom = null;
	});
	//initCalcFieldDialog(fObj.dispName, fObj.name, table);
}

function setCalcField(name, exp, type) {
	var cfName = $.trim(name);
	var cfExp = $.trim(exp);
	if (cfName == '') {
		alert('名称不能为空');
		return;
	}
	if (!isNaN(cfName[0])) {
		alert('名称不能以数字开头');
		return;
	}
	if (cfExp == '') {
		alert('表达式不能为空');
		return;
	}
	var names = new Array();
	var tObj = mdUtils.getTable(currCFTable);
	for (var i=0; i<tObj.fields.length; i++) {
		names[names.length] = tObj.fields[i].dispName;
	}
	if (currCF == null)	{
		if (names.indexOf(cfName) >= 0) {
			alert('名称重复');
			return;
		}
		if (mdUtils.getField(currCFTable, cfExp, true)){
			alert('表达式重复');
			return;
		}
		tObj.fields[tObj.fields.length] = {name:cfExp,dispName:cfName,pk:0,calc:1,dim:'',type:type};
		
		reloadSubs(currCFTable,  $('#fieldsDiv'), true);
	} else {
		if (names.indexOf(cfName) >= 0 && cfName != currCF) {
			alert('名称重复');
			return;
		}
		var existFObj = mdUtils.getField(currCFTable, cfExp, true);
		if (existFObj && existFObj.dispName != currCF){
			alert('表达式重复');
			return;
		}
		for (var i=0; i<tObj.fields.length; i++) {
			var fObj = tObj.fields[i];
			if (fObj.dispName == currCF) {
				fObj.dispName = cfName;
				fObj.name = cfExp;
				fObj.type = type;
				reloadSubs(tObj.name, $('#fieldsDiv'), true);
				break;
			}
		}
	}
}


var currCF1 = null;
var currCFDom1 = null;
function addCalcField1() {
	currCF1 = null;
	currCFDom1 = null;
	initCalcFieldDialog1('', '');
}

function initCalcFieldDialog1(name, exp) {
	var refDiv = $('#referenceFields');
	refDiv.html('');
	var fDoms = new Array();
	for (var i=0; i<domInfos.fields.length; i++) {
		var fDom = domInfos.fields[i];
		if (fDom.type != 1) continue;
		if (fDom.tAlias == '') continue;

/*		
		var tDom = domUtils.getTable(fDom.tAlias);
		var annexT = tDom.annexT;
		var tAlias = tDom.name;
		var aggr = fDom.aggr;//tr.find('#aggr')[0].value;
		if (!aggr) aggr = '';
		var lcts = fDom.lcts;
		//自动聚合，维中有主键时，对没有聚合方式的字段自动求和或计数。只对选出的字段自动聚合
		--
		if (aggr == '' && hasOn && selectOut == 1) {
			if (!hasAllPk(annexT)) {
				if (type == 1) aggr = 'sum';
				else  aggr = 'count';
			}
		}
		--
		
		var f = getInfos(parseFieldInfos(fDom.infos), 10, annexT);//tr.find('#fExp').html();
		if (lcts != null && lcts != '') {
			var ls = lcts.split(',');
			for (var k=0; k<ls.length; k++) {
				var lsk = ls[k].split('<_>');
				f += '~' + lsk[0];
			}
		}
		f = "(" + f + ")";
		var fWithAggr = f;
		if (aggr) fWithAggr = aggr + f; //加入聚合函数
*/		
		refDiv.append('<span style="padding:0 15px 3px 0;"><a href="#" style="color:grey;">' + /*tAlias + "." + fWithAggr*/fDom.name + '</a></span>');
	}

	refDiv.find('a').click(function(){
		cfExp.focus();
		var pos = getInputSelection(cfExp[0]).end;//cfExp.attr("selectionEnd");
		var val = cfExp.attr('value');
		var lastVal = val.substring(0, pos) + ' ' + $(this).html() + ' ' + val.substring(pos);
		pos = pos + $(this).html().length + 2;
		cfExp.attr('value', lastVal);
		setCaretToPos(cfExp[0], pos);
	});

	var cfName = $('#cfName');
	cfName.attr('value', name);
	
	var cfExp = $('#cfExpression');
	cfExp.attr('value', exp);

	var dlg = art.dialog({
		id : dialogCount++,
		title : '计算列',
	    content: $('#setCalcField')[0]
	    ,ok : function() {
	    	return setCalcField1($('#cfName').attr('value'), $('#cfExpression').attr('value'));
	    }
	    ,cancel : true
	    ,okVal : '确定'
	    ,cancelVal : '取消'
	    ,lock : true
	    ,duration : 0
		,opacity : 0.1
		,zIndex : 10001
		,padding : '5px 5px'
	});
	if ($('#setCalcField').length == 0) {
		$('body').append(dlg.DOM.wrap);
	}
}

function setCalcField1(name, exp) {
	var cfName = $.trim(name);
	var cfExp = $.trim(exp);
	if (cfName == '') {
		alert('名称不能为空');
		return false;
	}
	if (!isNaN(cfName[0])) {
		alert('名称不能以数字开头');
		return false;
	}
	if (cfExp == '') {
		alert('表达式不能为空');
		return false;
	}
	if (currCF1 == null)	{
		if (domUtils.getField(cfName) != null) {
			alert('名称重复');
			return false;
		}
		var rowIndex = domInfos.fields.length;
		var undo = 'operations.removeField(' + rowIndex + ')';
		var redo = 'operations.addField(' + rowIndex + ',"' + cfName + '",3,"","","",0,0,"",0,"",1,"","","","",80,"","","' + exp + '")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	} else {
		if (domUtils.getField(cfName) != null && cfName != currCF1) {
			alert('名称重复');
			return false;
		}
		var rowIndex = domInfos.fields.indexOf(currCFDom1);
		var undo = 'operations.modifyCalc(' + rowIndex + ', "' + currCFDom1.name + '", "' + currCFDom1.exp + '")';
		var redo = 'operations.modifyCalc(' + rowIndex + ', "' + cfName + '", "' + cfExp + '")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	}
	return true;
}


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
function addSub(container, table, field, ta, fa, type/*1:字段; 2:外键; 3:定位式*/, fieldsWithTable, locatorName, parents) {
	if (type == 3) {
		var canOpen = getLocators(table).length > parents.split(',').length;
		var openImg = canOpen?'<img id="openImg" t=0 src="..' + consts.imgFolder + consts.img25 + '">':'';
		var conts = '';
		if (canOpen) conts = '<div id="conts" style="overflow:hidden;margin-bottom:1px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;padding:0px;padding-left:10px;border:0px;"></div>';
		var curr = $('<div style="padding:0px;margin:0px;border:0px;" class="item"><h3 style="outline:0px;border:1px solid ' + consts.color12 + ';border-bottom:0;border-radius:0px;height:26px;background-image:url(..' + consts.imgFolder + consts.img14 + ');color:' + consts.color23 + ';margin:0px;margin-top:0px;" canDrag="1" canOpen="' + (canOpen?"1":"0") + '" title="' + locatorName.split('<_>')[1] + '" t="' + table + '" lctName="' + locatorName + '"><div style="padding:4px;"><span><img src="..' + consts.imgFolder + consts.img17 + '"></span>' + locatorName.split('<_>')[1] +'<div style="float:right;padding:0 2px 0 0;" id="openImg">' + openImg + '</div></div></h3>' + conts + '</div>');

		curr.accordion({
			changestart: function(event, ui) {
				if (!canOpen) return;
				
				if (ui.newContent.html() == null) {
					ui.oldHeader.attr('state', 'close');
				} else {
					ui.newHeader.attr('state', 'open');
					var targetTable = ui.newHeader.attr('t');
					reloadSubs2(2, targetTable, ui.newContent, false, parents);
				}
				setTimeout(function(){ //IE滚动条无规律异常，特殊处理一下
					$('#tabs-3').css('overflow','scroll').css('overflow','auto');
				}, 500);
			},
			change: function(event, ui) {
				return;
			},
			collapsible: true,
			active : false,
			event : canOpen?'':'',
			icons : false
		});
	
		curr.find('h3').skygqOneDblClick({oneclick:function(){
			if (canOpen) curr.accordion( "option", "active", 0 );
		},dblclick:function(){
		}});
	
		curr.find('h3').removeClass('ui-accordion-header ui-helper-reset ui-state-default ui-corner-all')
			.css({'font-weight':'normal'}).unbind('mouseover');
		//curr.find('#openImg').css('cursor','pointer').click(function(event){
		//	if ($(this).attr('t') != 1) return;
		//	event.stopPropagation();
		//	showLocators(curr);
		//});
		container.append(curr);
		curr.find('h3').css('cursor','move').draggable({
			//handler : "a",
			revert : true,
			cursor : 'move',
			revertDuration: 1,
			containment: 'document',
			appendTo:'body',
			//connectToSortable : "#tableDiv",
			helper: function( event ) {
				var curr = $(this);
				var infos = '';
				var lcts = '';
				var h3ps = curr.parents('.item');
				for (var i=0; i<h3ps.length; i++) {
					var h = $($(h3ps[i]).children()[0]);
					var t='',f='',l='',dim='';
					t = h.attr('t');
					f = h.attr('f');
					if (f) {
						var baseDim = h.attr('dim');
						var dim = baseDim;
						var lObj = h.find('#toLevels');
						if (lObj.length == 1) {
							if (lObj[0].selectedIndex != 0) {
								dim = mdUtils.getDimByTableField(lObj[0].value).name;
								l = lObj[0].options[lObj[0].selectedIndex].text;
								//l = lObj[0].value
							}
						}
						var info = t + split_1 + h.attr('ta') + split_1 + f + split_1 + h.attr('fa') + split_1 + l + split_1 + dim + split_1 + baseDim;
						if (infos != '') infos += split_2;
						infos += info;
					} else {//定位式
						lcts = h.attr('lctName') + (lcts==''?'':(','+lcts));
					}
				}
				curr.attr('infos', infos);
				curr.attr('aggr', '');
				curr.attr('lcts', lcts);
				var c = curr.clone();
				c.css('z-index','10001').css('opacity', 0.4);
				c.find('#toLevels').remove();
				c.find('#aggr').remove();
				return c;
			},
			stop: function(event, ui) {
				//setTimeout("refreshSelectBgColor();",1);
			}
		});

		return;
	}
	var canDrag=true,canOpen=false, canBy=false;
	
	var fObj = null;
	if (type==1) fObj = mdUtils.getField(table, field);
	else fObj = mdUtils.getFK(table, field);
	var targetTable = fObj.destTable;
	if (targetTable) canOpen = true;
	var dim = fObj.dim;
	var dimObj = null;
	if (dim && dim!='') dimObj = mdUtils.getDim(fObj.dim);
	if (dimObj != null) canBy = true;
	var levelStr = '';
	if (type==1) {
		if (/*dimObj && */fObj.destLevels && fObj.destLevels.length>0) {
			var currDim = '';
			if (dimObj) currDim = dimObj.table + '.' + dimObj.field;
			levelStr = '<select style="font-size:12px;color:' + consts.color22 + '" id="toLevels"><option value="' + currDim + '">本层</option>';
			for (var i=0; i<fObj.destLevels.length; i++) {
				var destDim = mdUtils.getDimByTableField(fObj.destLevels[i].dest);
				//var namej = destDim.name;
				//if (destDim.dispName && destDim.dispName != "") namej = destDim.dispName;
				var namej = fObj.destLevels[i].name;
				levelStr += '<option value="' + fObj.destLevels[i].dest/*.split(".")[0]*/ + '">' + namej + '</option>'
			}
			levelStr += '</select>';
			canBy = true;
			//canOpen = true;
		}
		var fkObj = mdUtils.getFieldFK(table, field);
		if (fkObj) {
			//targetTable = fkObj.destTable;
			//canOpen = true;
			//canBy = true;
		} else {
			if (dimObj != null) {
				//targetTable = dimObj.table;
				//canBy = true;
			} else {
				//canOpen = false;
			}
		}
	} else {
		if (fObj.fields.length == 1) {
			return; //单字段外键不列出来。
		} else {
			canDrag = false; //外键也可拖拽过去，用来设置条件 2013/8/27;外键又不可拖拽了
		}
	}
	/*
	if (table == targetTable) canOpen = false;
	var ats = mdUtils.getAnnexTables(targetTable);
	if (ats) {
		for (var i=0; i<ats.length; i++) {
			if (ats[i].name == table) canOpen = false;
		}
	}
	*/
	
	//单字段假表就不再展开。
	
	
	if (canOpen && mdUtils.getTable(targetTable).fields.length == 1) {
		canOpen = false;
	}
	
	//var openImg = '<img src="..' + consts.imgFolder + (canOpen?consts.img15:consts.img16) + '">';
	var openImg = canOpen?'<img src="..' + consts.imgFolder + (dimObj==null?consts.img16:consts.img15) + '">':'';
	if (dimObj == null && getLocators(table).length > 0) {
		canOpen = true;
		openImg = '<img src="..' + consts.imgFolder + consts.img25 + '">';
	}
	//if (dimObj == null) openImg = '<img id="openImg" t=1 src="..' + consts.imgFolder + consts.img16 + '">';
	var fImg = consts.img17;
	if (type == 2) fImg = consts.img18;
	else {
		if (fObj.pk == 1) fImg = consts.img19;
	}
	var conts = '';
	if (canOpen) conts = '<div id="conts" style="overflow:hidden;margin-bottom:1px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;padding:0px;padding-left:10px;border:0px;"></div>';
	var aggrStr = '';
	var aggr = '';
	var calcDelete = '';
	var calcModify = '';
	var calcDiv = '';
	if (fObj.calc == 1) {
		calcDelete = '<div style="float:right;padding:0 4px 0 0;"><img id="deleteImg" src="..' + consts.imgFolder + consts.img21 + '"></div>';
		calcModify = '<div style="float:right;padding:0 4px 0 0;"><img id="modifyImg" src="..' + consts.imgFolder + consts.img20 + '"></div>';
		calcDiv = '<div style="border:1px solid lightGray;display:none;border-radius:0px;" id="calcEditDiv"></div>';
	}

	var exp = fa;// + '[' + ta + ']';
	
	var curr = $('<div style="padding:0px;margin:0px;border:0px;" class="item"><h3 style="outline:0px;border:1px solid ' + consts.color12 + ';border-bottom:0;border-radius:0px;height:26px;background-image:url(..' + consts.imgFolder + consts.img14 + ');color:' + consts.color23 + ';margin:0px;margin-top:0px;" dim="' + dim + '" canDrag="' + (canDrag?"1":"0") + '" canOpen="' + (canOpen?"1":"0") + '" title="' + ta + '" canBy="' + (canBy?"1":"0") + '" targetTable="' + targetTable + '" f="' + field + '" t="' + table + '" fa="' + fa + '" ta="' + ta + '" aggr="' + aggr + '"><div style="padding:4px;"><span><img src="..' + consts.imgFolder + fImg + '"></span>' + exp + levelStr +'<div style="float:right;padding:0 2px 0 0;" id="openImg">' + openImg + '</div>' +  aggrStr + calcDelete + calcModify + '</div></h3>' + conts + calcDiv + '</div>');
	
	curr.accordion({
		changestart: function(event, ui) {
			if (curr.find('h3').attr('canOpen') != 1) return;
			
			if (ui.newContent.html() == null) {
				ui.oldHeader.attr('state', 'close');
			} else {
				ui.newHeader.attr('state', 'open');
				if (dimObj == null && type == 1) {
					var targetTable = ui.newHeader.attr('t');
					reloadSubs2(2, targetTable, ui.newContent, false, '');
				} else {
					var targetTable = ui.newHeader.attr('targetTable');
					var level = ui.newHeader.find('#toLevels');
					if (level.length > 0) {
						targetTable = level[0].value.split('.')[0];
					}
					reloadSubs(targetTable, ui.newContent);
				}
			}
			setTimeout(function(){ //IE滚动条无规律异常，特殊处理一下
				$('#tabs-3').css('overflow','scroll').css('overflow','auto');
			}, 500);
		},
		change: function(event, ui) {
			return;
			/*
			if (!canOpen) return;
			if (ui.newContent.html() == null) {
				ui.oldHeader.removeClass('ui-state-focus ui-state-default ui-corner-all').css({'background-color':'#F7F9FA'})//;
				ui.newHeader.removeClass('ui-state-focus ui-state-default ui-corner-all').css({'background-color':'#F7F9FA'})//;
			} else {
				ui.newHeader.css({'background-color':'#F7F9FA'});//.removeClass('ui-state-active ui-corner-top');
				ui.newContent.css({'padding':'3px','background-color':'#F7F9FA'});//.removeClass('ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active');
			}
			*/
		},
		collapsible: true,
		active : false,
		event : canOpen?'':'',
		icons : false
	});

	curr.find('h3').skygqOneDblClick({oneclick:function(){
		if (canOpen) curr.accordion( "option", "active", 0 );
	},dblclick:function(){
		if (currCFDom != null) {
			if (fObj.calc == 1) return;
			var addStr = '';
			if (fieldsWithTable.indexOf(field) >= 0) {
				addStr = field;
			} else if (fieldsWithTable.indexOf(table + '@' + field) >= 0) {
				addStr = table + '@' + field;
			} else return;
			
			var cfExp = currCFDom.find('#exp');
			if (cfExp.attr('value') == '表达式') {
				cfExp.attr('value','');
			}
			cfExp.focus();
			var pos = getInputSelection(cfExp[0]).end;//getCaret(cfExp[0]);//cfExp.attr("selectionEnd");
			var val = cfExp.attr('value');
			var lastVal = val.substring(0, pos) + ' ' + addStr + ' ' + val.substring(pos);
			pos = pos + addStr.length + 2;
			cfExp.attr('value', lastVal);
			setCaretToPos(cfExp[0], pos);
		} else {
			if (canOpen && targetTable) loadFields(targetTable);
		}
	}});

	curr.find('h3').removeClass('ui-accordion-header ui-helper-reset ui-state-default ui-corner-all')
		.css({'font-weight':'normal'}).unbind('mouseover');
	
	curr.find('#toLevels').change(function(){
		var co = false;
		var tt = null;
		if ($(this)[0].selectedIndex == 0) {
			if (targetTable) {
				co = true;
				tt = targetTable;
			}
		} else {
			var t = mdUtils.getTable($(this).attr('value').split('.')[0]);
			if (t && t.type != 2) {
				co = true;
				tt = t.name;
			}
		}
		//alert(co);
		if (co) {
			curr.find('h3').attr('canOpen', 1);
			curr.find('#openImg').html('<img src="..' + consts.imgFolder + consts.img15 + '">');
			reloadSubs(tt, curr.find('#conts'));
		} else {
			curr.find('h3').attr('canOpen', 0);
			curr.find('#openImg').html('');
			curr.find('#conts').html('');
		}
		
		//curr.find('h3').attr('canOpen', );
	}).click(function(event){
		event.stopPropagation();
	});
	curr.find('#aggr').change(function(){
		curr.find('h3').attr('aggr', $(this).attr('value'));
	}).click(function(event){
		event.stopPropagation();
	});
//	curr.find('#openImg').css('cursor','pointer').click(function(event){
//		if ($(this).attr('t') != 1) return;
//		event.stopPropagation();
//		showLocators(curr);
//	});
	curr.find('#deleteImg').css('cursor','pointer').click(function(event){
		var tObj = mdUtils.getTable(table);
		tObj.fields.remove(fObj);
		reloadSubs(table, $('#fieldsDiv'), true);
		event.stopPropagation();
	});
	curr.find('#modifyImg').css('cursor','pointer').click(function(event){
		modifyCalcField(curr, table, fObj.dispName);
		event.stopPropagation();
	});
	container.append(curr);
	//container.css("height","");
	if (canDrag) curr.find('h3').css('cursor','move').draggable({
		//handler : "a",
		revert : true,
		cursor : 'move',
		revertDuration: 1,
		containment: 'document',
		appendTo:'body',
		//connectToSortable : "#tableDiv",
		helper: function( event ) {
			var curr = $(this);
			var infos = '';
			var h3ps = curr.parents('.item');
			for (var i=0; i<h3ps.length; i++) {
				var h = $($(h3ps[i]).children()[0]);
				var t='',f='',l='',dim='';
				t = h.attr('t');//.find('#table').html();
				f = h.attr('f');//find('#field').html();
				var baseDim = h.attr('dim');
				var dim = baseDim;
				var lObj = h.find('#toLevels');
				if (lObj.length == 1) {
					if (lObj[0].selectedIndex != 0) {
						l = lObj[0].options[lObj[0].selectedIndex].text;
						dim = mdUtils.getDimByTableField(lObj[0].value).name;
						//l = dim;
						//l = lObj[0].value;
					}
				}
				var info = t + split_1 + h.attr('ta') + split_1 + f + split_1 + h.attr('fa') + split_1 + l + split_1 + dim + split_1 + baseDim;
				if (i>0) infos += split_2;
				infos += info;
			}
			curr.attr('infos', infos);
			var c = curr.clone();
			c.css('z-index','10001').css('opacity', 0.4);
			c.find('#toLevels').remove();
			c.find('#aggr').remove();
			return c;
		},
		stop: function(event, ui) {
			//setTimeout("refreshSelectBgColor();",1);
		}
	});
}

function changeShowStyle(v) {
	var but = $('#fieldShowStyle');
	if (v == '字段[表]') {
		but[0].value = '[表]字段';
	} else {
		but[0].value = '字段[表]';
	}
	filterEvent(filterDom.attr('value'));	
}


function changeShowDim(v) {
	var but = $('#fieldShowDim');
	if (v == '1') {
		but[0].value = '0';
		$('#fieldShowPK').attr('value', '0').attr('checked', false).attr('disabled', true);
	} else {
		but[0].value = '1';
		$('#fieldShowPK').attr('disabled', false);
	}
	filterEvent(filterDom.attr('value'));	
}


function changeShowPK(v) {
	var but = $('#fieldShowPK');
	if (v == '1') {
		but[0].value = '0';
	} else {
		but[0].value = '1';
	}
	filterEvent(filterDom.attr('value'));	
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
				if (d[0].id != 'dimTr') break;
				d.css(d.attr('ct'),d.attr('c1'));
				//alert(new Date().getTime() - lastOpt);
				if (new Date().getTime() - lastOpt < 50) return;
				lastOpt = new Date().getTime();
				var index = $('#dimTable').find('tr').length - 1;
				var dim = ui.draggable.attr('dim');
				var alias = onInfosUtil.generateNewDimAlias(dim);
				var dad = mdUtils.getDefaultAttr4Dim(dim);
				
				var undo = 'operations.removeField(' + index + ')';
				var redo = 'operations.addField(' + index + ',"' + alias + '",2,"","","",0,0,"' + dad.format + '",' + dad.useDisp + ',"' + dim + '",1,"","","","",80,"","","")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			} else {
				if (d.attr('act') != 3) continue;
				var infoStr = ui.draggable.attr('infos');
				var lcts = ui.draggable.attr('lcts');
				if (!lcts) lcts = '';
				var infos = parseFieldInfos(infoStr);
				var tAlias = d.attr('tAlias');
				var tDom = domUtils.getTable(tAlias);
				var fName = d.parent().attr('fName');
				if (fName) {
					var fDom = domUtils.getField(fName);
					if (fDom.type == 2) {
						annexT = tDom.annexT;
						var currTr = d.closest('tr');
						var dim = fDom.dim;
						var alias = fDom.name;
						var byObj = domUtils.getBy(tAlias, alias);
						var oper = {undo:'operations.changeByField("' + alias + '","' + (byObj?byObj.infos:'') + '","' + tAlias + '")',redo:'operations.changeByField("' + alias + '","' + infoStr + '","' + tAlias + '")'};
						operations.addOper(oper);
						eval(oper.redo);
						return;
					}
				}
				
				var t = getInfos(infos, 1);
				if (!tAlias) {
					tAlias = getNewAlias(t);
				}
				
				var _alias = getInfos(infos, 9); 
				if (lcts != '') {
					var ls = lcts.split(',');
					for (var k=0; k<ls.length; k++) {
						var lsk = ls[k].split('<_>');
						_alias += '_' + lsk[1];
					}
				} 
				var aliass = domUtils.getFieldNames();
				if (aliass.indexOf(_alias) >= 0) {
					for (var i=1; i<1000; i++) {
						if (aliass.indexOf(_alias+i) == -1) {
							_alias = _alias+i;
							break;
						}
					}
				}
						
				var _aggr = ui.draggable.attr('aggr');
				if (_aggr == 'sum') _alias += "求和"; 
				else if (_aggr == 'count') _alias += "计数"; 
				else if (_aggr == 'countd') _alias += "值计数"; 
				else if (_aggr == 'avg') _alias += "平均"; 
				else if (_aggr == 'max') _alias += "最大"; 
				else if (_aggr == 'min') _alias += "最小";
				
				var fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6), true);
				var dim = '';
				var format = '';
				var useDisp = 0;
				var domType = 1;
				var selectOut = 1;
				if (fObj != null) {
					dim = fObj.dim;
					if (!dim) dim = '';		
					if (dim != '') {
						var dimObj = mdUtils.getDim(dim);
						if (dimObj) {
							if (dimObj && dimObj.sql != null && dimObj.sql != '') {
								useDisp = 1;
							}
						} else dim = '';
					}
	
					format = fObj.format;
					if (!format) format = '';
					if (format == '') {
						if (fObj.type == 3) {
							format = 'yyyy-MM-dd';
						} else if (fObj.type == 4) {
							format = 'HH:mm:ss';
						} else if (fObj.type == 5) {
							format = 'yyyy-MM-dd';
						}
					}
				} else {
					domType = 5;
					selectOut = 0;
				}
		
				var rowIndex = domInfos.fields.length;
				var undo = 'operations.removeField(' + rowIndex + ')';
				var redo = 'operations.addField(' + rowIndex + ',"' + _alias + '",' + domType + ',"","","",0,0,"' + format + '",' + useDisp + ',"' + dim + '",' + selectOut + ',"' + infoStr + '","' + _aggr + '","' + tAlias + '","",80,"' + lcts + '","","")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
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
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			if (ui.draggable.attr('id') == 'dimItem') {
				if (d[0].id == 'dimTr') actives[0] = d;
				break;
			} else {
				if (d[0].id == 'newTableTd') {
					actives[actives.length] = d;
					continue;
				}
				if (infos) {
					var tAlias = d.attr('tAlias');
					if (!tAlias) continue;
					var fName = d.parent().attr('fName');
					if (fName) {
						var fDom = domUtils.getField(fName);
						if (fDom.type == 1) {
							var tDom = domUtils.getTable(tAlias);
							if (mdUtils.isAnnex(tDom.annexT, infos[0].table)) actives[actives.length] = d;
						} else if(fDom.type == 2) {
							var tDom = domUtils.getTable(tAlias);
							var dim = fDom.dim;
							var alias = fDom.name;
							var annexT = tDom.annexT;
							var t = getInfos(infos, 1);
							if (t != annexT && !mdUtils.isAnnex(t, annexT)) continue;
							if (tAlias && tAlias != '') {
								if (ui.draggable.attr('canBy') == 1 && byInfosUtil.canAdd(infos, dim)) {
									actives[actives.length] = d;
								}
							}
						}
					} else if (mdUtils.isAnnex(domUtils.getTable(tAlias).annexT, infos[0].table)) actives[actives.length] = d;
				}
			}
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

var fieldDrop = {
	tolerance : 'pointer',
	accept:function(d) {
		if (d.attr('canDrag') != 1) return false;
		
		if (this.id == 'newTableTd') {
			return true;
		}
		var infos = parseFieldInfos(d.attr('infos'));
		var tAlias = $(this).attr('tAlias');
		var fName = $(this).parent().attr('fName');
		if (fName) {
			var fDom = domUtils.getField(fName);
			if (fDom.type == 3) return false;
			if (fDom.type == 1) {
				var tDom = domUtils.getTable(tAlias);
				return mdUtils.isAnnex(tDom.annexT, infos[0].table);
			} else if(fDom.type == 2) {
				var tDom = domUtils.getTable(tAlias);
				var dim = fDom.dim;
				var alias = fDom.name;
				var annexT = tDom.annexT;
				var t = getInfos(infos, 1);
				if (t != annexT && !mdUtils.isAnnex(t, annexT)) return false;
				if (tAlias && tAlias != '') {
					if (d.attr('canBy') == 1) {
						return byInfosUtil.canAdd(infos, dim);
					}
				}
			}
		} else return mdUtils.isAnnex(domUtils.getTable(tAlias).annexT, infos[0].table);
		return false;
	},
	drop: function(event, ui) {
		return true;
	},
	over: function(event, ui) {
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			if (d.attr('act') == 1) continue;
			d.attr('act', d[0] == this?3:2);
			d.css(d.attr('ct'),d.attr('c' + d.attr('act')));
		}
	},
	out: function(event, ui) {
		var first = true;
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			if (d.attr('act') == 1) continue;
			d.attr('act', first?3:2);
			d.css(d.attr('ct'),d.attr(first?'c3':'c2'));
			first = false;
		}
	},
	activate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c2'));
	},
	deactivate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c1'));
	}
};

var split_1 = ',,,,';
var split_2 = ';;;;';

/**
 * T1,T1_A,F1,F1_A,L1,D1,BD1;T2,T2_A,F2,F2_A,L2,D2,BD2;T3,T3_A,F3,F3_A,L3,D3,BD3;T4,T4_A,F4,F4_A,L4,D4,BD4
 * type决定返回结果：
 *	1,T1; 
 *	2,annexT==T1 : F1_A#L1.F2_A#L2@T2_A.F3_A#L3@T3_A.F4_A#L4@T4_A     //字段表达式，不含表名、统计函数 annexT
 * 	  annexT!=T1 : F1_A#L1@T1_A.F2_A#L2@T2_A.F3_A#L3@T3_A.F4_A#L4@T4_A
 *  3,D4;
 *  4,T1,T1_A,F1,F1_A,L1,D1,BD1;T2,T2_A,F2,F2_A,L2,D2,BD2;T3,T3_A,F3,F3_A,L3,D3,BD3;T4,T4_A,F4,F4_A,L4',D4',BD4 //转换成可导出层的 dim
 *  5,T4; //获得最后的表
 *  6,F4; //获得最后的字段
 *  7,BD4;
 *  8,T1_A;
 *  9,F4_A; //别名
 *	10,annexT==T1 : F1#L1.F2#L2@T2.F3#L3@T3.F4#L4@T4     //字段表达式，不含表名、统计函数 annexT
 * 	  annexT!=T1 : F1#L1@T1.F2#L2@T2.F3#L3@T3.F4#L4@T4
 *  11, fieldObj in metadata.
 */
function getInfos(infos, type, annexT, aggr, dim){
	if (type == 1) {
		return infos[0].table;
	} else if (type == 2) {
		var r = '';
		for (var i=0; i<infos.length; i++) {
			var t = infos[i].table;
			var l = infos[i].level;
			var f = infos[i].field;
			var fa = infos[i].fa;
			if (l != '') {
				//var dimObj = mdUtils.getDimByTableField(l);
				//l = dimObj.dispName;
				//if (!l || l == '') l = dimObj.name;
				l = '#' + l;
			}
			//alert(mdUtils.isFieldUnique(infos[i].field, t));
			//alert(i + "--" + t + "--" + annexT + "--" + mdUtils.isFieldUnique(infos[i].field, t));
			if (i == 0) {
				if (t == annexT) t = '';
				else {
					var ats = mdUtils.getAnnexTables(t);
					var tObj,atObj;
					for (var j=0; j<ats.length; j++) {
						if (ats[j].name == t) tObj = ats[j];
						if (ats[j].name == annexT) atObj = ats[j];
					}
					var isPk = false;
					for (var j=0; j<tObj.pks.length; j++) {
						if (tObj.pks[j] == f) {
							t = '';
							var fObj = mdUtils.getField(annexT, atObj.pks[j]);
							if (fObj) {
								fa = fObj.dispName;
							}
							if (!fa) fa = f;
							isPk = true;
							break;
						}
					}
					if (isPk || (mdUtils.isFieldUnique(f, t) && !mdUtils.getTable(atObj.name).middle)) t = '';
					else t = '@' + infos[i].ta;
				}
			} else {
				if (mdUtils.isFieldUnique(f, t)) t = '';
				else t = '@' + infos[i].ta;
			}
			if (i > 0) {
				r += '.';
			}
			r += infos[i].fa + l + t;
		}
		return r;
	} else if (type == 3) {
		return infos[infos.length-1].dim;
	} else if (type == 4) {
		var last = infos[infos.length-1];
		var currDim = last.baseDim;
		if (currDim != '' && currDim != dim) {
			var fObj = mdUtils.getField(last.table, last.field, true);
			if (fObj == null) fObj = mdUtils.getFK(last.table, last.field);
			if (fObj != null && fObj.destLevels && fObj.destLevels.length>0) {
				for (var i=0; i<fObj.destLevels.length; i++) {
					//var lObj = mdUtils.getLevel(fObj.destLevels[i]);
					if (mdUtils.getDimByTableField(fObj.destLevels[i].dest).name==dim) {
						last.level = fObj.destLevels[i].name;
						last.dim = dim;
						return infosToString(infos);
					}
				}
			}
		}
	} else if (type == 5) {
		if (infos[infos.length-1].level == '')  
			return infos[infos.length-1].table;
		else {
			var fObj = mdUtils.getField(infos[infos.length-1].table, infos[infos.length-1].field);
			for (var i=0; i<fObj.destLevels.length; i++) {
				if (fObj.destLevels[i].name == infos[infos.length-1].level) {
					return fObj.destLevels[i].dest.split(".")[0];
				}
			}
		}
	} else if (type == 6) {
		if (infos[infos.length-1].level == '')  
			return infos[infos.length-1].field;
		else {
			var fObj = mdUtils.getField(infos[infos.length-1].table, infos[infos.length-1].field);
			for (var i=0; i<fObj.destLevels.length; i++) {
				if (fObj.destLevels[i].name == infos[infos.length-1].level) {
					return fObj.destLevels[i].dest.split(".")[1];
				}
			}
		}
	} else if (type == 7) {
		return infos[infos.length-1].baseDim;
	} else if (type == 8) {
		return infos[0].ta;
	} else if (type == 9) {
		return infos[infos.length-1].fa;
	} else if (type == 10) {
		var r = '';
		for (var i=0; i<infos.length; i++) {
			var t = infos[i].table;
			var l = infos[i].level;
			var f = infos[i].field;
			if (l != '') {
				//var dimLObj = mdUtils.getDimByTableField(l);
				l = '#' + l;//dimLObj.name;
			}
			if (i == 0) {
				if (t == annexT) t = '';
				else {
					var ats = mdUtils.getAnnexTables(t);
					var tObj,atObj;
					for (var j=0; j<ats.length; j++) {
						if (ats[j].name == t) tObj = ats[j];
						if (ats[j].name == annexT) atObj = ats[j];
					}
					var isPk = false;
					for (var j=0; j<tObj.pks.length; j++) {
						if (tObj.pks[j] == f) {
							t = '';
							f = atObj.pks[j];
							isPk = true;
							break;
						}
					}
					if (isPk || (mdUtils.isFieldUnique(f, t) && !mdUtils.getTable(atObj.name).middle)) t = '';
					else t = '@' + t;
				} 
			} else {
				if (mdUtils.isFieldUnique(f, t)) t = '';
				else t = '@' + t;
			}
			if (i > 0) {
				r += '.';
			}
			r += f + l + t;
		}
		return r;
	} else if (type == 11) {
		return fObj = mdUtils.getField(infos[infos.length-1].table, infos[infos.length-1].field);
	} 

}

function infosToString(infos) {
	var r = '';
	for (var i=infos.length-1; i>=0; i--) {
		if (r.length > 0) r += split_2
		r += infos[i].table + split_1 + infos[i].ta + split_1 + infos[i].field + split_1 + infos[i].fa + split_1 + infos[i].level + split_1 + infos[i].dim + split_1 + infos[i].baseDim;
	}
	return r;
}

var onInfosUtil = {
	generateNewDimAlias : function(dim) {
		var aliass = domUtils.getFieldNames();
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
	}
}
var onDrop = {
	accept:function(d) {
		return false;
		return d.attr('id') == 'dimItem';
	},
	drop: function(event, ui) {
		return;
	},
	over: function(event, ui) {
		$(this).css($(this).attr('ct'),$(this).attr('c3'));
	},
	out: function(event, ui) {
		$(this).css($(this).attr('ct'),$(this).attr('c2'));
	},
	activate: function(event, ui) {
		$(this).css($(this).attr('ct'),$(this).attr('c2'));
	},
	deactivate: function(event, ui) {
		$(this).css($(this).attr('ct'),$(this).attr('c1'));
	}
};

function filterEvent(v) {
	if (v == null || v == '输入过滤字') {
		v = '';
	}
	filterDom.attr('filterBak', v);
	generateFields(v==''?null:v);
}

function fieldFilterEvent(v) {
	if (v == null || v == '输入过滤字') {
		v = '';
	}
	fieldFilterDom.attr('fieldFilterBak', v);
	if (currShowTable) reloadSubs(currShowTable, $('#fieldsDiv'), true);
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
	$("body").html(doms);

	/*
	mytabs = $( "#mytabs" ).tabs({selected:0,select:function(event, ui){
		selectTab(ui.index);
	}});
	mytabs.find('li').disableSelection();
	mytabs.find(".ui-state-default").removeClass('ui-state-default');
	*/

	var ctds = $('<select style="width:100%;" id="classTableSelect" onchange="changeClassTable()"><option value="">全部</option></select>');
	for (var i=0; i<lmd.classTables.length; i++) {
		var classTable = lmd.classTables[i];
		var selected = ''
		if (classes != '') {
			if (classes.indexOf(classTable.name) == -1) continue;
			if (classTable.name == classes[0]) selected = ' selected';
		}
		ctds.append('<option value="' + classTable.name + '"' + selected + '>' + classTable.name + '</option>');
	}
	$('#classTableDiv').html('').append(ctds);

	selectTab(1);
	
	//zNodes = generateTreeNodes(lglInfos);
	generateFields();
	generateDimFields();
	generateTables();
	filterDom = $("#filter");
	filterDom.keyup(function(event){
		if(event.keyCode == 13){
			filterEvent(this.value);
			filterDom.css('color','');
		}
	}).focus(function(){
		if (this.value == '输入过滤字') this.value = '';
		filterDom.css('color','');
	}).blur(function(){
		if (this.value == '') {
			this.value = '输入过滤字';
			filterDom.css('color', 'lightgrey');
		} else filterDom.css('color','');
	});

/*
	fieldFilterDom = $("#fieldFilter");
	fieldFilterDom.keyup(function(event){
		if(event.keyCode == 13){
			fieldFilterEvent(this.value);
			fieldFilterDom.css('color','');
		}
	}).focus(function(){
		if (this.value == '输入过滤字') this.value = '';
		fieldFilterDom.css('color','');
	}).blur(function(){
		if (this.value == '') {
			this.value = '输入过滤字';
			fieldFilterDom.css('color', 'lightgrey');
		} else fieldFilterDom.css('color','');
	});
*/

	//treeObj.expandAll(true);
	//treeObj.expandAll(false);
	
	

	topLayout = $('body').css('color', consts.color1).layout({
		resizable : true
		, spacing_open:7  // ALL panes
		, spacing_closed:7 // ALL panes
		, north : {
			spacing_open:escalc?1:0,
			spacing_closed:escalc?1:0,
			size : (escalc?"1":"90"),
			maxSize : (escalc?"1":"90"),
			minSize : (escalc?"1":"90"),
 			resizable : true,
			closable:false
		}
		
		, west : {
			spacing_open:8,
			spacing_closed:8,
			size : "0",
 			resizable : true,
			closable:false
			//initClosed:true
		}
	});
	middleLayout = $('.ui-layout-center').layout({
	
		spacing_open: 0
		,spacing_closed: 0
		, north: {
			spacing_open:0
			,spacing_closed:0
			,size: escalc?"1":"37"
			,paneSelector: ".ui-layout-toolbar"
 			,resizable : true
			,closable:false
			,initHidden:escalc?true:false
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
	innerLayout = $('#innerLayout').layout({
		spacing_open: 7
		,spacing_closed: 7
		, center: {
			size: "350"
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
		, east : {
			paneSelector: "#mytabs",
			size : "331",
			minSize : "331",
			onresize : function() {
				$('#tabs-1,#tabs-2,#tabs-3,#tabs-4').css('height', parseInt($('#mytabs').css('height'))-40+'px').css('padding','1px');
				$('#contentDiv').css('height', parseInt($('#mytabs').css('height'))-60+'px');
			}
		}
	});

	topLayout.toggle("west");
	$('.ui-state-disabled').removeClass('ui-state-disabled');
	$('#tabs-1,#tabs-2,#tabs-3,#tabs-4').css('height', parseInt($('#mytabs').css('height'))-40+'px').css('padding','1px');
	$('#contentDiv').css('height', parseInt($('#mytabs').css('height'))-60+'px');

	/*
	innerNorthLayout = $('.inner-north').layout({
		spacing_open: 7
		,spacing_closed: 7
			, center: {
			paneSelector : "#inner-north-select"
		}
		, north: {
			size : (escalc?"200":"110")
			, paneSelector : "#inner-north-byon"
		}
	});
	*/
	
	var dropList = null;
	var helperWidth = null;
	//$( "#tableDiv, #fieldDropDiv, #bysTd" ).droppable(fieldDrop);//$( ".selectHeader, .byHeader" ).droppable(fieldDrop);
	//$( "#onsTd" ).droppable(onDrop);//$( ".selectHeader, .byHeader" ).droppable(fieldDrop);

/*
	$("#setWhere").dialog({closeOnEscape:true,autoOpen:false, width:600, height: 300, maxWidth:600, maxHeight:300, minWidth:600, minHeight:300, modal: true, overlay: { opacity: 0.5, 'background-color':"red" }});
	//更改样式。
	var sw = $("#setWhere").parent();
	sw.css('padding','1px');
	var sw_h = $(sw.children()[0]);
	var sw_c = $(sw.children()[1]);
	if (escalc) sw_h.css('background-color', '#6382BF').css('color',consts.color2);
	else sw_h.css('background-color', consts.color15).css('color',consts.color2);
	sw.find('.ui-icon-grip-diagonal-se').remove();
	sw.find('.ui-corner-all').removeClass('ui-corner-all');
	sw.removeClass('ui-corner-all');

	$("#setSimpleWhere").dialog({closeOnEscape:true,autoOpen:false, width:230, height: 300, maxWidth:230, maxHeight:300, minWidth:230, minHeight:300, modal: true, overlay: { opacity: 0.5, 'background-color':"red" }});
	//更改样式。
	var sw = $("#setSimpleWhere").parent();
	sw.css('padding','1px');
	var sw_h = $(sw.children()[0]);
	var sw_c = $(sw.children()[1]);
	if (escalc) sw_h.css('background-color', '#6382BF').css('color',consts.color2);
	else sw_h.css('background-color', consts.color15).css('color',consts.color2);
	sw.find('.ui-icon-grip-diagonal-se').remove();
	sw.find('.ui-corner-all').removeClass('ui-corner-all');
	sw.removeClass('ui-corner-all');

	$("#setSimpleWhere1").dialog({closeOnEscape:true,autoOpen:false, width:230, height: 300, maxWidth:230, maxHeight:300, minWidth:230, minHeight:300, modal: true, overlay: { opacity: 0.5, 'background-color':"red" }});
	//更改样式。
	var sw = $("#setSimpleWhere1").parent();
	sw.css('padding','1px');
	var sw_h = $(sw.children()[0]);
	var sw_c = $(sw.children()[1]);
	if (escalc) sw_h.css('background-color', '#6382BF').css('color',consts.color2);
	else sw_h.css('background-color', consts.color15).css('color',consts.color2);
	sw.find('.ui-icon-grip-diagonal-se').remove();
	sw.find('.ui-corner-all').removeClass('ui-corner-all');
	sw.removeClass('ui-corner-all');

	$('#setTableInfo').dialog({closeOnEscape:true,autoOpen:false, width:300, height: 160, maxWidth:300, maxHeight:160, minWidth:300, minHeight:160, modal: true, overlay: { opacity: 0.5, 'background-color':"red" }});
	//更改样式。
	sw = $("#setTableInfo").parent();
	sw.css('padding','1px');
	var sw_h = $(sw.children()[0]);
	var sw_c = $(sw.children()[1]);
	if (escalc) sw_h.css('background-color', '#6382BF').css('color',consts.color2);
	else sw_h.css('background-color', consts.color15).css('color',consts.color2);
	sw.find('.ui-icon-grip-diagonal-se').remove();
	sw.find('.ui-corner-all').removeClass('ui-corner-all');
	sw.removeClass('ui-corner-all');

	$("#setCalcField").dialog({closeOnEscape:true,autoOpen:false, width:400, height: 260, maxWidth:400, maxHeight:260, minWidth:400, minHeight:260, modal: true, overlay: { opacity: 0.5, 'background-color':"red" }});
	//更改样式。
	var sw = $("#setCalcField").parent();
	sw.css('padding','1px');
	var sw_h = $(sw.children()[0]);
	var sw_c = $(sw.children()[1]);
	if (escalc) sw_h.css('background-color', '#6382BF').css('color',consts.color2);
	else sw_h.css('background-color', consts.color15).css('color',consts.color2);
	sw.find('.ui-icon-grip-diagonal-se').remove();
	sw.find('.ui-corner-all').removeClass('ui-corner-all');
	sw.removeClass('ui-corner-all');


	$("#setFormat").dialog({closeOnEscape:true,autoOpen:false, width:310, height: 286, maxWidth:310, maxHeight:286, minWidth:310, minHeight:286, modal: true, overlay: { opacity: 0.5, 'background-color':"red" }});
	//更改样式。
	sw = $("#setFormat").parent();
	sw.css('padding','1px');
	var sw_h = $(sw.children()[0]);
	var sw_c = $(sw.children()[1]);
	if (escalc) sw_h.css('background-color', '#6382BF').css('color',consts.color2);
	else sw_h.css('background-color', consts.color15).css('color',consts.color2);
	sw.find('.ui-icon-grip-diagonal-se').remove();
	sw.find('.ui-corner-all').removeClass('ui-corner-all');
	sw.removeClass('ui-corner-all');

	$("#saveWin").dialog({closeOnEscape:true,autoOpen:false, width:500, height: 400, maxWidth:500, maxHeight:400, minWidth:500, minHeight:400, modal: true, overlay: { opacity: 0.5, 'background-color':"red" }});
	$("#saveWin").dialog( "close" );
	sw = $("#saveWin").parent();
	sw.css('padding','1px');
	var sw_h = $(sw.children()[0]);
	var sw_c = $(sw.children()[1]);
	if (escalc) sw_h.css('background-color', '#6382BF').css('color',consts.color2);
	else sw_h.css('background-color', consts.color15).css('color',consts.color2);
	sw.find('.ui-icon-grip-diagonal-se').remove();
	sw.find('.ui-corner-all').removeClass('ui-corner-all');
	sw.removeClass('ui-corner-all');
*/
	$(".fields-north").disableSelection();

          //refreshCanvas('32,52;72,32;92,112');
          //addDimDom('D类别','ddd', '');
	//$("body:not(input), .east-west,#tabs-1").disableSelection();
	//$("body").disableSelection();
	//$("input").enableSelection();
	//$('body *').not(':has(input)').not('input').disableSelection();

	$(document).bind('mousedown selectstart', function(e) {
	    return $(e.target).is('input, textarea, select, option');
	});	

	//$( "#pageMode" ).button();
	operations.refreshButs();
	if (escalc) $('#resultSetButs, #pageMode').css('display','none');
	refreshMiddleTables();
	
	changeRSButs(false);
	$('#editMode,#pageMode,#undoBut,#redoBut,#queryBut,#createTableBut,#saveBut,#saveLocalBut,#gexBut,#saveGexBut,#txtDownloadBut,#setBackBut,#txtAllBut,#txtSaveBut,#excelBut,#prevBut,#nextBut').hover(
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
     
	$( "#noOrdersDiv, #ordersDiv" ).sortable({
		connectWith: ".orderConnect"
		,stop:function(event, ui){
			refreshOrderBys();
		}
	}).disableSelection();
     
    domUtils.refresh();
    domUtils.refresh();//又见鬼了，不多刷新一次，第一次拖到“表+”上竟然没作用。
}

function changeClassTable() {
	generateTables();
	generateDimFields();
	filterEvent(filterDom.attr('value'));
}

var editMode = 1;//1拖拽模式；0手动编辑DQL模式。
function getEditMode(){
	return editMode;
}

function switchEditMode() {
	if (editMode == 1) {
		editMode = 0;
		$('#editMode').attr('title','DQL模式');
		$('#editMode').attr('src','..' +  consts.imgFolder + 'mode-dql.png');
		$('#dragModeButs, #resultSetButs, #queryButs, #defaultJoinBut, #detailJoinBut').css('display','none');
		var td = $('#tableDiv');
		currQuery = generateSql(true);
		var dql = '';
		if (currQuery && currQuery.length ==3) {
			dql = currQuery[0];
		}
		$('#dqlDiv').css('display','block').css('height',td.css('height')).css('width',td.css('width'));
		$('#dqlBox').attr('value',dql);
		
		td.css('display','none');
		//$('#designResultSet').css('display','none');
		//$('#showResultSet').css('display','block');
	} else {
		editMode = 1;
		$('#editMode').attr('title','拖拽模式');
		$('#editMode').attr('src','..' +  consts.imgFolder + 'mode-drag.png');
		$('#dragModeButs, #resultSetButs, #queryButs, #defaultJoinBut, #detailJoinBut').css('display','block');
		$('#dqlDiv').css('display','none');
		$('#tableDiv').css('display','block');
		//$('#designResultSet').css('display','block');
		//$('#showResultSet').css('display','none');
		innerLayout.resizeAll();
	}

	generateDimFields();
	filterEvent(filterDom.attr('value'));
	if (currShowTable) reloadSubs(currShowTable, $('#fieldsDiv'), true);
}

var pageMode = 1;//1编辑模式；0查询模式
function switchMode(){
	if (pageMode == 1) {
		pageMode = 0;
		$('#pageMode').attr('title','查询模式').attr('src','..' +  consts.imgFolder + 'mode-query.png');
		doQuery();
	} else {
		pageMode = 1;
		$('#pageMode').attr('title','编辑模式').attr('src','..' +  consts.imgFolder + 'mode-edit.png');
	}
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

function selectField(tr, doLocate){
	$("#fieldTable tr").each(function(){
		var curr = $(this);
		var b = this == tr[0];
		curr.css('background-color', b?consts.color17:'');
		//curr.find('#tableCol').css('background-color', curr.attr('bgcolor'));;
		//curr.attr('selected', b?1:0);
	});
	if (doLocate) locateResource(tr);
}

function locateResource(tr) {
	//反向定位资源
	var fDom = domUtils.getField(tr.attr("fName"));
	var infos = parseFieldInfos(fDom.infos);
	var parent = $('#fieldsDiv');
	reloadSubs(infos[0].table, parent);
	for (var i=0; i<infos.length; i++) {
		var info = infos[i];
		var items = parent.find('.item');
		for (var j=0; j<items.length; j++) {
			//alert($(items[j]).find('#field').html()+ "---" +info.field+ "---" +$(items[j]).find('#table').html()+ "---" +info.table);
			var h = $(items[j]).find('h3');
			if (h.attr('f')==info.field && h.attr('t')==info.table) {
				var tf = mdUtils.getDim(info.dim);
				if (tf) h.find('#toLevels').attr('value', tf.table + '.' + tf.field);
				if (i < infos.length-1 && h.attr('aria-expanded') == 'false') {
					h.triggerHandler('click');
					parent = $(items[j]).find("#conts");
				}
				//reloadSubs(info.table, parent);
				break;
			}
		}
	}
	//$('#mytabs').tabs('select',2);
	selectTab(3);
}

//选中字段，刷新该表（别名表）的by列表及by on关系。
var byInfos = {};
var level = 4;
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
	addTableBy : function(tAlias, currDomInfos) {
		if (tAlias == '') return;
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.fields.length; i++) {
			var fDom = currDomInfos.fields[i];
			if (fDom.type == 1 || fDom.type == 3 || domUtils.getBy(tAlias, fDom.name, currDomInfos) != null) continue;
			var da = fDom.name;
			var infoss = new Array();
			byInfosUtil._getRelations(tAlias, da, [{table:domUtils.getTable(tAlias,currDomInfos).annexT,pInfos:''}], infoss, 0,currDomInfos);
			if (infoss.length > 0) {
				domUtils.addBy(tAlias, da, infoss[0], currDomInfos);
			}
		}
	},
	addDimBy : function(da, currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		for (var i=0; i<currDomInfos.tables.length; i++) {
			var tDom = currDomInfos.tables[i];
			if (domUtils.getBy(tDom.name, da, currDomInfos) != null) continue;
			var infoss = new Array();
			byInfosUtil._getRelations(tDom.name, da, [{table:tDom.annexT,pInfos:''}], infoss, 0,currDomInfos);
			if (infoss.length > 0) {
				domUtils.addBy(tDom.name, da, infoss[0],currDomInfos);
			}
		}
	},
	//talbes [{table:'',pInfos:''}]
	_getRelations : function(tAlias, da, tables, relations, levelCount,currDomInfos) {
		if (!currDomInfos) currDomInfos = domInfos;
		if (levelCount == 3) return;
		levelCount++;
		var fDom = domUtils.getField(da,currDomInfos);
		var subTables = new Array();
		for (var z=0; z<tables.length; z++) {
			var table = tables[z].table;
			var pInfos = tables[z].pInfos;

			var ts = mdUtils.getAnnexTables(table);
			if (ts == null) {
				ts = new Array();
				ts[0] = {name:table,pks:[]};
			}
			for (var j=0; j<ts.length; j++) {
				var t = ts[j].name;
				var tObj = mdUtils.getTable(t);
				var ta = tObj.dispName;
				if (!ta || ta=='') ta = t;
				var fs = tObj.fields.concat(tObj.fks);
				for (var i=0; i<fs.length; i++) {
					var fObj = fs[i];
					if (fObj.fields && fObj.fields.length == 1) continue;
					if (fObj.pk == 1 && levelCount > 1) continue; 
					var targetTable = fObj.destTable;
					var dim = fObj.dim;
					var f = fObj.name;
					if (dim == '' || !dim) dim = t + '.' + f;
					var fa = fObj.dispName;
					if (!fa || fa=='') fa = f;
					var infos = t + split_1 + ta + split_1 + f + split_1 + fa + split_1 + split_1 + dim + split_1 + dim;
					if (pInfos != '') infos += split_2 + pInfos;
					if (targetTable) {
						subTables[subTables.length] = {table:targetTable,pInfos:infos};
					}
					if (fDom.dim == dim) {
						relations[relations.length] = infos;
					}

					if (fObj.destLevels && fObj.destLevels.length>0) {
						for (var k=0; k<fObj.destLevels.length; k++) {
							//var lObj = mdUtils.getLevel(fObj.destLevels[i]);
							var dimObj = mdUtils.getDimByTableField(fObj.destLevels[k].dest);
							infos = t + split_1 + ta + split_1 + f + split_1 + fa + split_1 + fObj.destLevels[k].name + split_1 + dimObj.name + split_1 + dim;
							if (pInfos != '') infos += split_2 + pInfos;
							subTables[subTables.length] = {table:dimObj.table,pInfos:infos};
							if (dimObj.name==fDom.dim) {
								relations[relations.length] = infos;
							}
						}
					}
				}
			}
		}
		//alert(levelCount + "--" + subTables.length + "--" + relations.length);
		if (subTables.length > 0) byInfosUtil._getRelations(tAlias, da, subTables, relations, levelCount,currDomInfos);
	}
};

function getCurrTitle() {
	return document.title;
}

function dimWhere(dimObj){
	if (!currWhereField) return;
	var fObj = mdUtils.getField(dimObj.table, dimObj.field);
	var type = fObj.type;
	if (!type) type = 2;
	if (dimObj.sql == null || dimObj.sql == '') {
		var where = currWhereField.where;
		var typeObj = conditionConfig.getType(type);
		if (typeObj == null) {
			alert('unavailable type[' + type + ']!');
			return;
		}
		//等于:2,3,4,5_;_OR
		var items = '';
		var opt;
		if (where != '') {
			var as = where.split('_;_')[0].split(':');
			opt = as[0];
			items = as[1];
			items = items.replaceAll(',','\n');
		}
		$('#dimWhereReverse1')[0].checked = opt == '不等于';
		
		var p = $("#dimItemsDiv1");
		p.html('');
		var sel = '<textarea style="color:#759ACF;font-size:16px;width:200px;height:190px;">' + items + '</textarea>'
		sel = $(sel);
		p.append(sel);
		var dlg = art.dialog({
			id : dialogCount++,
			title : '设置查询条件',
		    content: $('#setSimpleWhere1')[0]
		    ,ok : function() {
		    	setNewDimWhere1();
		    }
		    ,cancel : true
		    ,okVal : '确定'
		    ,cancelVal : '取消'
		    ,lock : true
		    ,duration : 0
			,opacity : 0.1
			,padding : '2px 2px'
		});
		if ($('#setSimpleWhere1').length == 0) {
			$('body').append(dlg.DOM.wrap);
		}
		//$("#setSimpleWhere1").dialog('open');
		//$("#setSimpleWhere1").find('.dl_c2_bak,.dl_c2,.dl_c3').attr('disabled', false);//灵异事件，谁把确定弄残废了。。。
	} else {
		if (escalc) {
			document.title = "01" + dimObj.sql;
		} else {
			jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:4,oper:'dispTable',sql:dimObj.sql,pageId:pageId}, getDimCallback);
		}
	}
}

var currDispTable = '';
function getDimCallback(dispTable, over) {
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
	var where = currWhereField.where;
	var dimObj = mdUtils.getDim(currWhereField.dim);
	var fObj = mdUtils.getField(dimObj.table, dimObj.field);
	var type = fObj.type;
	if (!type) type = 2;
	var typeObj = conditionConfig.getType(type);
	if (typeObj == null) {
		alert('unavailable type[' + type + ']!');
		return;
	}
	//等于:2,3,4,5_;_OR
	var items = new Array();
	var opt;
	if (where.indexOf('middleTable') == -1 && where.indexOf('fkwhere') == -1 && where != '' && where.indexOf('_;_') >= 0) {
		var as = where.split('_;_')[0].split(':');
		opt = as[0];
		items = as[1].split(',');
	}
	
	$('#dimWhereReverse')[0].checked = opt == '不等于';

	var p = $("#dimItemsDiv");
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
					jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:4,oper:'dispTable',sql:ld.sql,pageId:pageId}, lcf);
				} else {
					lcf("");
				}
			});
			p.find('#wtlv').change(function(){
				var dimO = mdUtils.getDimByTableField($('#whereToLevels').attr('value'));
				var fObj = mdUtils.getField(dimO.table, dimO.field);
				var type = fObj.type;
				if (!type) type = 2;
				if (type != 1) v = "'" + v + "'";
				var formula = $('#whereToLevels option:selected').attr('formula');
				var v = this.value;
				formula = formula.replaceAll('?',dimObj.code) + "=" + v;
				jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:4,oper:'dispTable',sql:dimObj.sql+' WHERE '+formula,pageId:pageId}, function(lvs){
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
	/*
	var dlg = art.dialog({
		id : dialogCount++,
		title : '设置查询条件',
	    content: $('#setSimpleWhere')[0]
	    ,ok : function() {
	    	setNewDimWhere();
	    }
	    ,cancel : true
	    ,okVal : '确定'
	    ,cancelVal : '取消'
	    ,lock : true
	    ,duration : 0
		,opacity : 0.1
		,padding : '2px 2px'
	});
	if ($('#setSimpleWhere').length == 0) {
		$('body').append(dlg.DOM.wrap);
	}
	*/
}

function setNewDimWhere1(){
	var val = $("#dimItemsDiv1 textarea").attr('value').split('\n');

	var vs = '';
	for (var i=0; i<val.length; i++) {
		val[i] = $.trim(val[i]);
		if (val[i] != '') {
			if (vs != '') vs += ',';
			vs += val[i];
		}
	}
	
	var whereStr = '';
	var whereDisp = '';
	if (vs != '') {
		var values = new Array();
		values[0] = vs;
		var fObj;
		if (currWhereField.type == 1) {
			var infos = parseFieldInfos(currWhereField.infos);
			fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6));
		} else if (currWhereField.type == 2) {
			var dimObj = mdUtils.getDim(currWhereField.dim);
			fObj = mdUtils.getField(dimObj.table, dimObj.field);
		}
		var type = 2;
		if (fObj && fObj.type) type = fObj.type;
		var opt = $('#dimWhereReverse1')[0].checked?'不等于':'等于';
		whereStr = conditionConfig.getOption(type, opt).saveStr("", values) + "_;_AND" ;
		whereDisp = conditionConfig.getOption(type, opt).disp("", values);
	}
	setNewWhereOper(currWhereField.where, currWhereField.whereDisp, currWhereField.wherePos, whereStr, whereDisp, '');

	//$('#setSimpleWhere1').dialog('close');
}

function setNewDimWhere() {
	var items = new Array();
	var itemDisps = new Array();
	$("#dimWhereSelect").each(function(){
		for (var i=0; i<this.options.length; i++) {
			if (this.options[i].selected) {
				items[items.length] = this.options[i].value;
				var disp = this.options[i].text;
				if (disp.indexOf('(') > 0) itemDisps[itemDisps.length] = disp.substring(0, disp.indexOf('('));
				else itemDisps[itemDisps.length] = disp;
			}
		}
	});
	var whereStr = '';
	var whereDisp = '';
	if (items.length > 0) {
		var datas = '';
		var dataDisps = '';
		for (var i=0; i<items.length; i++) {
			if (i > 0) {
				datas += ',';
				dataDisps += ',';
			}
			datas += items[i];
			dataDisps += itemDisps[i];
		}
		var vs = new Array();
		var ds = new Array();
		vs[0] = datas;
		ds[0] = dataDisps;
		var fObj;
		if (currWhereField.type == 1) {
			var infos = parseFieldInfos(currWhereField.infos);
			fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6));
		} else if (currWhereField.type == 2) {
			var dimObj = mdUtils.getDim(currWhereField.dim);
			fObj = mdUtils.getField(dimObj.table, dimObj.field);
		}
		var type = fObj.type;
		if (!type) type = 2;
		var opt = $('#dimWhereReverse')[0].checked?'不等于':'等于';
		whereStr = conditionConfig.getOption(type, opt).saveStr("", vs) + "_;_AND" ;
		whereDisp = conditionConfig.getOption(type, opt).disp("", ds);
	}

	setNewWhereOper(currWhereField.where, currWhereField.whereDisp, currWhereField.wherePos, whereStr, whereDisp, '');

	//$('#setSimpleWhere').dialog('close');
}

//获得新的表别名。
function getNewAlias(defaultT) {
	if (defaultT) {
		var alias = defaultT;
		var exist = false;
		for (var i=0; i<domInfos.tables.length; i++) {
			if (domInfos.tables[i].name == alias) {
				exist = true;
				break;
			}
		}
		if (!exist) return alias;
	}
	for (var i=0; i<10000; i++) {
		var alias = 'T_A_' + i;
		var exist = false;
		for (var j=0; j<domInfos.tables.length; j++) {
			if (domInfos.tables[j].name == alias) {
				exist = true;
				break;
			}
		}
		if (!exist) return alias;
	}
}

var currTIAlias;
function setTableInfo() {
	var d = $('#setTableInfo');
	//d.dialog('close');
	var t = d.find('#tables select').attr('value');
	var jt = 0;
	d.find('input[name=joinType]').each(function(){
		if (this.checked) jt = this.value;
	});
	var tDom = domUtils.getTable(currTIAlias);
	var oper = {undo:'operations.setTableInfo("' + currTIAlias + '","' + tDom.annexT + '","' + tDom.joinType + '")',redo:'operations.setTableInfo("' + currTIAlias + '","' + t + '","' + jt + '")'}
	operations.addOper(oper);
	eval(oper.redo);
}

var currWhereField = null;
//针对currField初始化条件编辑界面
function initConditionDialog(){
	var edit = mdUtils.getEditStyle(currWhereField.edit);
	var where = currWhereField.where;
	var fObj;
	if (currWhereField.type == 1) {
		var infos = parseFieldInfos(currWhereField.infos);
		fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6));
	} else if (currWhereField.type == 2) {
		var dimObj = mdUtils.getDim(currWhereField.dim);
		fObj = mdUtils.getField(dimObj.table, dimObj.field);
	}
	var opts = $('#dateOptions');
	opts.css('display',(fObj && (fObj.type == 3 || fObj.type == 5))?'block':'none');
	//opts.html('');
	var wheres = $('#wheres');
	
	var wt = $('#whereTable');
	var trs = wt.find('tr');
	for (var i=trs.length-1; i>0; i--) {
		$(trs[i]).remove();
	}
	if (where != null && where != '') {
		where = where.split('_;_');
		var andOrs = where[where.length-1].split(',');
		for (var i=0; i<where.length-1; i++) {
			var wi = where[i];
			var name = wi;
			var value = null;
			var andOr = andOrs[i];
			var idx = wi.indexOf(':');
			if (idx>0){
				name = wi.substring(0, idx);
				value = wi.substring(idx+1).split('_,_');
			}
			if (name.indexOf('middleTable') == -1 && name.indexOf('fkwhere') == -1) {
				addWhereDom2(wt, name, andOr, value);
			}
		}
	}
	addNewWhere();
}

function initComplexWhere(){
	var pos = $('#wherePos');
	var pos1 = $('#fkWhereTable');
	var cfExp = $('#cfExpression1');
	var refDiv = $('#referenceFields1');
	pos.html('');
	pos1.html('');
	for (var i=0; i<domInfos.tables.length; i++) {
		var o = '<option value="' + domInfos.tables[i].name + '">' + domInfos.tables[i].annexT + '</option>';
		pos.append(o);
		pos1.append(o);
	}
	pos.append('<option value="HAVING">HAVING</option>');
	refDiv.html('');
	var fDoms = new Array();
	for (var i=0; i<domInfos.fields.length; i++) {
		var fDom = domInfos.fields[i];
		if (fDom.type != 1) continue;
		if (fDom.tAlias == '') continue;
		/*
		var tDom = domUtils.getTable(fDom.tAlias);
		var annexT = tDom.annexT;
		var tAlias = tDom.name;
		var aggr = fDom.aggr;//tr.find('#aggr')[0].value;
		if (!aggr) aggr = '';
		var lcts = fDom.lcts;
		//自动聚合，维中有主键时，对没有聚合方式的字段自动求和或计数。只对选出的字段自动聚合
		--
		if (aggr == '' && hasOn && selectOut == 1) {
			if (!hasAllPk(annexT)) {
				if (type == 1) aggr = 'sum';
				else  aggr = 'count';
			}
		}
		--
		
		var f = getInfos(parseFieldInfos(fDom.infos), 10, annexT);//tr.find('#fExp').html();
		if (lcts != null && lcts != '') {
			var ls = lcts.split(',');
			for (var k=0; k<ls.length; k++) {
				var lsk = ls[k].split('<_>');
				f += '~' + lsk[0];
			}
		}
		f = "(" + f + ")";
		var fWithAggr = f;
		if (aggr) fWithAggr = aggr + f; //加入聚合函数
		*/
		refDiv.append('<span style="padding:0 15px 3px 0;"><a href="#" style="color:grey;">' + /*tAlias + "." + fWithAggr*/fDom.name + '</a></span>');
	}

	refDiv.find('a').click(function(){
		cfExp.focus();
		var pos = getInputSelection(cfExp[0]).end;//cfExp.attr("selectionEnd");
		var val = cfExp.attr('value');
		var lastVal = val.substring(0, pos) + ' ' + $(this).html() + ' ' + val.substring(pos);
		pos = pos + $(this).html().length + 2;
		cfExp.attr('value', lastVal);
		setCaretToPos(cfExp[0], pos);
	});

	pos1.change(eventExistTable);
	eventExistTable();
}

var eventExistTable = function(){
	var t = $('#fkWhereTable').attr('value');
	var all = $('#fkWhereFields');
	all.html('');
	var sfs = $('#fkFields');
	sfs.html('');
	var fkw = $('#fkWhere');
	fkw.html('');
	
	for (var i=0; i<domInfos.fields.length; i++) {
		var f = domInfos.fields[i];
		if (f.type == 1 && f.dim != '' && f.tAlias == t) {
			var fi = $('<span style="color:#31B5EA;margin:3px 8px 3px 0;cursor:pointer;">' + f.name + '</span>');
			fi.click(function () {
				var nf = $(this).html();
				var exists = false;
				sfs.find("span").each(function(){
					if ($(this).html() == nf) exists = true;
				});
				var fii = $('<span style="color:#31B5EA;margin:3px 8px 3px 0;cursor:pointer;">' + nf + '</span>');
				if (!exists) {
					sfs.append(fii);
					fii.click(function(){
						$(this).remove();
						eventMiddle();
					});
					eventMiddle();
				}
			});
			all.append(fi);
		}
	}
}

var eventMiddle = function() {
	var sfs = $('#fkFields');
	var fkw = $('#fkWhere');
	fkw.html('');
	var dims = "";
	sfs.find('span').each(function(){
		dims += "、" + domUtils.getField($(this).html()).dim;
	});
	if (dims == '') return;
	var mts = mdUtils.getMiddleTables();
	for (var i=0; i<mts.length; i++) {
		var pks = mdUtils.getTablePKs(mts[i].name);
		var ti = mts[i];
		var mtdims = "";
		var names = "";
		for (var j=0; j<pks.length; j++) {
			mtdims += "、" + pks[j].dim;
			if (pks[j].dispName && pks[j].dispName != '') names += "," + pks[j].dispName;
			else names += "," + pks[j].name;
		}
		if (mtdims == dims) {
			fkw.append("<option value='" + ti.name + "'>" + mts[i].dispName + ".(" + names.substring(1) + ")</option>");
		}
	}
}


function saveWhere() {
	if ($('#where-tabs-1').hasClass('selected')) {
		setNewDimWhere();
	} else if ($('#where-tabs-2').hasClass('selected')) {
		setNewDimWhere1();
	} else if ($('#where-tabs-3').hasClass('selected')) {
		setNewWhere();
	} else if ($('#where-tabs-4').hasClass('selected')) {
		setNewComplexWhere();
	} else if ($('#where-tabs-5').hasClass('selected')) {
		setNewMiddleWhere();
	} else if ($('#where-tabs-6').hasClass('selected')) {
		setNewFKWhere();
	}
}

function setNewFKWhere(){
	var mtw = $('#fkWhere')[0];
	var v = mtw.value;
	//if (mtw == '' || !mtw) return;
	var where = whereDisp = '';
	if (mtw && mtw != '' && mtw.options.length > 0) {
		var disp = mtw.options[mtw.selectedIndex].innerHTML;
		//var t = mdUtils.getTable(mtw);
		if (v != '') {
			var mt = $('#fkWhereTable').attr('value');
			var fs = '';
			var fs1 = '';
			$('#fkFields span').each(function() {
				if (fs != '') {
					fs += '_fk2_';
					fs1 += ','
				}
				fs += $(this).html();
				fs1 += $(this).html();
			});
			where = "fkwhere" + ($('#fkMiddleIn')[0].checked?"1":"2") + v + "_fk2_" + mt + "_fk2_" + fs + "_;_AND";
			whereDisp = "'" + mt + ".(" + fs1 + ")'" + " 在'" + disp + "'" + ($('#fkMiddleIn')[0].checked?"内":"外");
		}
	}
	
	if (currWhereField)	setNewWhereOper(currWhereField.where, currWhereField.whereDisp, currWhereField.wherePos, where, whereDisp , '');
	else {
		var rowIndex = domInfos.fields.length;
		var cfName = '中间表条件';
		var count = 1;
		while (domUtils.getField(cfName)) {
			cfName = '中间表条件' + count;
			count++;
		}
		var undo = 'operations.removeField(' + rowIndex + ')';
		var redo = 'operations.addField(' + rowIndex + ',"' + cfName + '",5,"' + where + '","' + whereDisp + '","",0,0,"",0,"",0,"","","","",80,"","","")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	}
	
}

function setNewMiddleWhere(){
	var mtw = $('#middleTableWhere')[0];
	var v = mtw.value;
	//if (mtw == '' || !mtw) return;
	var where = whereDisp = '';
	if (mtw && mtw != '') {
		var disp = mtw.options[mtw.selectedIndex].innerHTML;
		//var t = mdUtils.getTable(mtw);
		if (v != '') {
			where = "middleTable" + ($('#middleIn')[0].checked?"1":"2") + v + "_;_AND";
			whereDisp = "值" + "在[" + disp + "]" + ($('#middleIn')[0].checked?"内":"外");
		} 
	}
	
	setNewWhereOper(currWhereField.where, currWhereField.whereDisp, currWhereField.wherePos, where, whereDisp , '');
}

function setNewComplexWhere() {
	var where = $.trim($('#cfExpression1').attr('value'));
	var pos = '';
	if (where != '') pos = $('#wherePos').attr('value');
	if (currWhereField)	setNewWhereOper(currWhereField.where, currWhereField.whereDisp, currWhereField.wherePos, where, where, pos);
	else {
		var rowIndex = domInfos.fields.length;
		var cfName = '复杂条件';
		var count = 1;
		while (domUtils.getField(cfName)) {
			cfName = '复杂条件' + count;
			count++;
		}
		var undo = 'operations.removeField(' + rowIndex + ')';
		var redo = 'operations.addField(' + rowIndex + ',"' + cfName + '",4,"' + where + '","' + where + '","' + pos + '",0,0,"",0,"",0,"","","","",80,"","","")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	}
}

function whereTab(tab) {
	if ($('#where-tabs-' + tab).hasClass('disabled')) return;
	if (tab == 4 || tab == 6) {
		$('#where-tabs-1,#where-tabs-2,#where-tabs-3,#where-tabs-5').css('display', 'none');
		$('#where-tabs-4,#where-tabs-6').css('display', 'block');
	} else {
		$('#where-tabs-1,#where-tabs-2,#where-tabs-3,#where-tabs-5').css('display', 'block');
		$('#where-tabs-4,#where-tabs-6').css('display', 'none');
	}
	$('#where-tabs-1,#where-tabs-2,#where-tabs-3,#where-tabs-4,#where-tabs-5,#where-tabs-6').removeClass('selected');
	$('#where-tabs-' + tab).addClass('selected');
	$('#setWhere,#setSimpleWhere,#setSimpleWhere1,#setComplexWhere,#setMiddleTableWhere,#setFKWhere').css('display','none');
	if (tab == 1) {
		$('#setSimpleWhere').css('display','block');
	} else if (tab == 2) {
		$('#setSimpleWhere1').css('display','block');
	} else if (tab == 3) {
		$('#setWhere').css('display','block');
	} else if (tab == 4) {
		$('#setComplexWhere').css('display','block');
	} else if (tab == 5) {
		$('#setMiddleTableWhere').css('display','block');
	} else if (tab == 6) {
		$('#setFKWhere').css('display','block');
	}
	
}

function addNewWhere(name, andOr, values) {
	var wt = $('#whereTable');
	return addWhereDom2(wt, name, andOr, values);
}

/*
<a href='#' style='text-decoration:none;' onclick='addDateWhere(1)'>今天</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(2)'>昨天</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(3)'>前天</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(4)'>本周</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(5)'>上周</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(6)'>本月</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(7)'>上月</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(8)'>本季度</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(9)'>上季度</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(10)'>本年</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(11)'>去年</a>&nbsp;
<a href='#' style='text-decoration:none;' onclick='addDateWhere(12)'>前年</a>&nbsp;
*/
function addDateWhere(type) {
	var trs = $('#whereTable tr');
	$(trs[trs.length-1]).remove();

	var values = new Array();
	if (type == 1) {
		values[0] = dateUtils.getToday();
		addNewWhere('等于', 'AND', values);
	} else if (type == 2) {
		values[0] = dateUtils.getYestoday();
		addNewWhere('等于', 'AND', values);
	} else if (type == 3) {
		values[0] = dateUtils.getYestoday2();
		addNewWhere('等于', 'AND', values);
	} else if (type == 4) {
		values[0] = '>=';
		values[1] = dateUtils.getWeekBegin();
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getWeekEnd();
		addNewWhere('区间', 'AND', values);
	} else if (type == 5) {
		var now = dateUtils.getServerTime(); 
		now.setTime(now.getTime()-7*24*60*60*1000);
		values[0] = '>=';
		values[1] = dateUtils.getWeekBegin(now);
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getWeekEnd(now);
		addNewWhere('区间', 'AND', values);
	} else if (type == 6) {
		values[0] = '>=';
		values[1] = dateUtils.getMonthBegin();
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getMonthEnd();
		addNewWhere('区间', 'AND', values);
	} else if (type == 7) {
		var now = dateUtils.getServerTime(); 
		if (now.getMonth() == 0) {
			now.setMonth(11);
			now.setYear(now.getYear()-1);
		} else {
			now.setMonth(now.getMonth()-1);
		}
		values[0] = '>=';
		values[1] = dateUtils.getMonthBegin(now);
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getMonthEnd(now);
		addNewWhere('区间', 'AND', values);
	} else if (type == 8) {
		values[0] = '>=';
		values[1] = dateUtils.getSeasonBegin();
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getSeasonEnd();
		addNewWhere('区间', 'AND', values);
	} else if (type == 9) {
		var now = dateUtils.getServerTime(); 
		if (now.getMonth <=2) {
			now.setMonth(10);
			now.setYear(now.getYear()-1);
		} else {
			now.setMonth(now.getMonth()-3);
		}
		values[0] = '>=';
		values[1] = dateUtils.getSeasonBegin(now);
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getSeasonEnd(now);
		addNewWhere('区间', 'AND', values);
	} else if (type == 10) {
		values[0] = '>=';
		values[1] = dateUtils.getYearBegin();
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getYearEnd();
		addNewWhere('区间', 'AND', values);
	} else if (type == 11) {
		var now = dateUtils.getServerTime(); 
		now.setYear(now.getFullYear()-1);
		values[0] = '>=';
		values[1] = dateUtils.getYearBegin(now);
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getYearEnd(now);
		addNewWhere('区间', 'AND', values);
	} else if (type == 12) {
		var now = dateUtils.getServerTime(); 
		now.setYear(now.getFullYear()-2);
		values[0] = '>=';
		values[1] = dateUtils.getYearBegin(now);
		values[2] = 'AND';
		values[3] = '<=';
		values[4] = dateUtils.getYearEnd(now);
		addNewWhere('区间', 'AND', values);
	}
	addNewWhere();
}

function addWhereDom2(wt, name, andOr, values ){
	var dim = currWhereField.dim;
	var dimObj = null;
	if (dim != '') dimObj = mdUtils.getDim(dim);
	var timeDim = false;
	if (dimObj && dimObj.dt > 0 && dimObj.exp != '') timeDim = true;
	var edit = mdUtils.getEditStyle(currWhereField.edit);
	var typeObj = conditionConfig.getType(domUtils.getFieldType(currWhereField.name));
	if (typeObj == null) {
		('unavailable type[' + type + ']!');
		return;
	}

	var opts = '<select id="opt" style="width:100%;border:0px;color:' + consts.color22 + ';">';
	for (var i=0; i<typeObj.options.length; i++) {
		var opti = typeObj.options[i];
		if (timeDim && opti.noDim == 1) continue;
		if (name == null && i==0) name = opti.name; 
		opts += '<option' + (name==opti.name?' selected':'') + ' value="' + opti.name + '">' + opti.name + '</option>';
	}
	opts = $(opts + '</select>');
	var tr = $('<tr style="height:23px;background-color:#FFFFFF;"></tr>');
	var td1 = $('<td style="width:80px;border-color:' + consts.color8 + ';"></td>');
	tr.append(td1);
	td1.append(opts);
	var td2 = $('<td style="border-color:' + consts.color8 + ';"></td>');
	tr.append(td2);
	changeWhereOpt(td2, typeObj, edit, name, values);
	var td3 = $('<td style="width:55px;border-color:' + consts.color8 + ';"><select id="andOr" style="width:100%;border:0px;color:' + consts.color22 + ';"><option value="AND">并且</option><option' + (andOr=='OR'?' selected':'') + ' value="OR">或者</option></select></td>');
	td3.find('#andOr').change(function(e){
		var trs = $('#whereTable tr');
		if (tr[0] == trs[trs.length-1]) addNewWhere();
	});
	tr.append(td3);
	var td4 = $('<td style="width:30px;border-color:' + consts.color8 + ';" align="center"><a href="#"><img src="..' + consts.imgFolder + consts.img21 + '" style="border:0px"></a></td>');
	tr.append(td4);

	opts.change(function(e){
		changeWhereOpt(td2, typeObj, edit, opts.attr('value'));
		var trs = $('#whereTable tr');
		if (tr[0] == trs[trs.length-1]) addNewWhere();
	});
	td4.find('a').click(function(e){
		tr.remove();
		if ($('#whereTable tr').length == 1) addNewWhere();
	});

	wt.append(tr);
	return tr;
}

function changeWhereOpt(td, typeObj, edit, optName, values){
	var optObj = conditionConfig.getOption(typeObj.type, optName);
	var html = '<span>' + optObj.html() + '</span>';
	var count=0;
	var editHtml = mdUtils.getEsHtml(edit);
	while (html.indexOf("_EDITOR_") >= 0) {
		//TODO， 根据编辑风格决定编辑器
		html = html.replace("_EDITOR_", editHtml);
		count++;
	}
	html = $(html);
	td.html(html);
	//TODO， 根据编辑风格设置事件
	var dimObj = currWhereField.dim;
	//if (!dimObj) {
	//	dimObj = getInfos(parseFieldInfos(currWhereField.attr('infos')), 3);
	//}
	if (dimObj) dimObj = mdUtils.getDim(dimObj);
	mdUtils.registerEsEvent(edit, html, dimObj==null?'':dimObj.exp);
	html.find('input[type=text]').css('border-top','0px').css('border-left','0px').css('border-right','0px').css('border-bottom','1px solid grey');
	html.css('padding-bottom', '1px');//.css('border-bottom', '1px solid lightgrey').css('padding-bottom', '1px');
	if (values) optObj.setValues(html, values);
}

function getWhereDisp(where, type, edit) {
	if (where == null || where == '') return '';
	where = where.split('_;_');
	for (var i=0; i<where.length; i++) {
		var wi = where[i];
		var idx = wi.indexOf(':');
		var name = wi;
		var value = null;
		if (idx>0){
			name = wi.substring(0, idx);
			value = wi.substring(idx+1).split('_,_');
		}
	}
}

function setNewWhere() {
	var whereStr = '';
	var whereDisp = '';
	var andOrs = '';
	var trs = $('#whereTable tr');
	var fObj;
	if (currWhereField.type == 1) {
		var infos = parseFieldInfos(currWhereField.infos);
		fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6));
	} else if (currWhereField.type == 2) {
		var dimObj = mdUtils.getDim(currWhereField.dim);
		fObj = mdUtils.getField(dimObj.table, dimObj.field);
	}
	var andOr = 'AND';
	for (var i=1; i<trs.length; i++) {
		var curr = $(trs[i]);
		var vs = new Array();
		var ds = new Array();
		var allNull = true;
		var opt = curr.find('#opt')[0].value;
		curr.find("._VALUE_").each(function() {
			if (this.value) {
				allNull = false;
				vs.push(this.value);
			} else vs.push('');
			ds.push(mdUtils.getEsDisps(fObj?fObj.edit:'', this.value));
		});
		if (allNull && vs.length > 0) continue;
		if (whereStr != '') {
			whereStr += '_;_';
			andOrs += ',';
		}
		if (whereDisp != '') {
			whereDisp += ' ' + (andOr=='AND'?'&':'||') + ' ';
		}
		var type = domUtils.getFieldType(currWhereField.name);
		whereStr += conditionConfig.getOption(type, opt).saveStr(curr, vs);
		whereDisp += conditionConfig.getOption(type, opt).disp(curr, ds);				
		var andOr = curr.find('#andOr')[0].value;
		andOrs += andOr;
	}
	if (whereStr != '') whereStr += '_;_' + andOrs;
	
	setNewWhereOper(currWhereField.where, currWhereField.whereDisp, currWhereField.wherePos, whereStr, whereDisp, '');

	//$('#setWhere').dialog('close');
}

function setNewWhereOper(oldWhere, oldDisp, oldPos, newWhere, newDisp, newPos) {
	var i = domInfos.fields.indexOf(currWhereField);
	var oper = {undo:'operations.setFieldWhere(' + i + ',"' + oldWhere + '","' + oldDisp + '","' + oldPos + '")',redo:'operations.setFieldWhere(' + i + ',"' + newWhere + '","' + newDisp + '","' + newPos + '")'}
	operations.addOper(oper);
	eval(oper.redo);
}

var openQyxName;
function openLocalDL() {
	openQyxName = $('#localQyxFile').attr('value');
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
	window.location.href = contextPath + '/dl/jsp/dataLogic.jsp?dlFile=' + encodeURIComponent('tmp/' + openQyxName);
}

function saveLocalDL() {
	var json = getSaveStrOnce();
	if (json == null) return;
	var name = qyxName;
	if (qyxName.indexOf('.qyx') == -1) name = qyxName + ".qyx";
	$('#downQyxForm #path').attr('value', name);
	$('#downQyxForm #dlConf').attr('value', json);
	$('#downQyxForm #type').attr('value', 'qyx');
	$('#downQyxForm #pageId').attr('value', pageId);
	$('#downQyxForm').submit();

/*	var params = { action: "36", path: qyxName, dlConf:json, type:'qyx', pageId:pageId };
	$.ajax( { type: "POST", url: contextPath + "/servlet/dataSphereServlet" + "?d=" + new Date().getTime(), data: params,
		success: function( msg ) {
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert( textStatus );
		}
	} );
*/
}
function saveLocalDLCallback(){
	//window.location.href = contextPath + '/dl/jsp/dataLogic.jsp?dlFile=' + encodeURIComponent('tmp/' + qyxName + ".qyx");
}

function openDL() {
	var fr = $('<iframe id="saveDLFrame" src="" style="width:99%;height:99%;" frameBorder=no></iframe>');
	$("#saveDLWin").html('').append(fr);
	//fr.attr('src', contextPath + '/dl/jsp/dl.html');
	fr.attr('src', contextPath + "/webFile/saveFile.jsp?defaultName=" + encodeURIComponent(qyxPath + qyxName) + "&ext=qyx&okfunc=doSaveDL&cancelfunc=hideSaveWin&d=" + new Date().getTime());
	var dlg = art.dialog({
		id : 1999
		,title : '保存查询'
	    ,content: $('#saveDLWin')[0]
	    ,lock : true
	    ,duration : 0
		,opacity : 0.1
		,padding : '2px 2px'
		,width : '510px'
		,height : '410px'
	});
	if ($('#saveDLWin').length == 0) {
		$('body').append(dlg.DOM.wrap);
	}


	var pageName = "../jsp/save.jsp";
	var returnStr = window.showModalDialog(pageName + "?d=" + new Date().getTime() + "&oper=open", null, "dialogWidth=520px;dialogHeight=400px;dialogTop=" + (screen.height-400)/2 + "px;dialogLeft=" + (screen.width-520)/2 + "px;");
	if (returnStr != null && returnStr.length > 0) {
		var div = document.createElement("div");
		div.style.display = 'none';
		var frame = document.createElement("iframe");
		div.appendChild(frame);
		document.body.appendChild(div);
		frame.src = pageName + "?d=" + new Date().getTime() + "&oper=openFile&name=" + encodeURIComponent(returnStr);
	}
}

//var json = "({fields:[{table:'客户表',alias:'名称',annexT:'客户表',seq:'1',order:'0',colWidth:'80',tAlias:'客户表',infos:'客户表,客户表,名称,名称,,,',joinType:'0',where:'',whereDisp:'',aggr:''}],dims:[{dim:'月',alias:'月',order:'0',colWidth:'80',where:'',whereDisp:'',level:'年表.年'},{dim:'客户',alias:'客户',order:'0',colWidth:'80',where:'',whereDisp:'',level:'客户表.编号'}],bys:\"({客户表:{annexT:'客户表',fields:[{infos:'客户表,客户表,加入日期,加入日期,,日期,日期',alias:'月'},{infos:'客户表,客户表,编号,编号,,客户,客户',alias:'客户'}]}})\"})"
var dlConfBak = '';
function doOpenDL(flag, conf){
	dlConfBak += conf;
	if (flag == 0) {
		return;
	}
	conf = dlConfBak;
	dlConfBak = '';
	operations.clear();
	if (pageMode == 0) switchMode();
	
	if (conf == null || conf == '') return;
	//conf = json;
	conf = conf.split('<;>')[1];
	conf = conf.replaceAll('<double_quote>','"');
	var conf = eval(conf);
	
	mdUtils.clearCustomer();
	for (var i=0; i<conf.tables.length; i++) {
		var tObj1 = conf.tables[i];
		var tObj2 = mdUtils.getTable(tObj1.name);
		if (tObj2) {
			for (var j=0; j<tObj1.fields.length; j++) {
				tObj2.fields[tObj2.fields.length] = tObj1.fields[j];
			}
		} else {
			lmd.tables[lmd.tables.length] = tObj1;
		}
	}
	filterEvent(filterDom.attr('value'));
	
	domInfos = conf.domInfos;
	for (var i=0; i<domInfos.fields.length; i++) {
		if (!domInfos.fields[i].lcts) domInfos.fields[i].lcts = '';
		domInfos.fields[i].where = domInfos.fields[i].where.replaceAll('<single_quote>',"'");
		domInfos.fields[i].whereDisp = domInfos.fields[i].whereDisp.replaceAll('<single_quote>',"'");
		domInfos.fields[i].infos = domInfos.fields[i].infos.replaceAll('<single_quote>',"'");
		domInfos.fields[i].exp = domInfos.fields[i].exp.replaceAll('<single_quote>',"'");
		domInfos.fields[i].lcts = domInfos.fields[i].lcts.replaceAll('<single_quote>',"'");
	}
	domUtils.refresh();
}

var saveStr = null;
var saveStrLen = 800;
function getSaveStr() {
	if (saveStr == null) saveStr = getSaveStrOnce();
	if (saveStr == null || saveStr == '') {
		saveStr = null;
		return '';
	} else {
		if (saveStr.length > saveStrLen) {
			var ret = saveStr.substring(0, saveStrLen);
			saveStr = saveStr.substring(saveStrLen);
			return ret;
		} else {
			var ret = saveStr;
			saveStr = '';
			return ret;
		}
	}
}

function getSaveStrOnce(onlyDoms) {
	if (domInfos.fields.length == 0) {
		if (!escalc) alert("至少选出一个字段");
		return null;
	}
	
	if (onlyDoms) {
		return '({domInfos:' + domUtils.toString() + '})';
	}
	
	var tables = '';
	for (var i=0; i<lmd.tables.length; i++) {
		var tObj = lmd.tables[i];
		var table = '';
		if (tObj.dql) {
			table += "{name:'" + tObj.name + "',dql:<double_quote>" + tObj.dql + "<double_quote>,fields:[";
			var fields = '';
			for (var j=0; j<tObj.fields.length; j++) {
				var calc = tObj.fields[j].calc;
				if (calc != 1) calc = '';
				else calc = ',calc:1';
				var type = tObj.fields[j].type;
				var edit = tObj.fields[j].edit;
				var format = tObj.fields[j].format;
				if (!type) type = '0';
				if (!edit) edit = '';
				if (!format) format = '';
				var dispName = tObj.fields[j].dispName;
				if (dispName) dispName = ",dispName:'" + dispName + "'";
				else dispName = '';
				var field = "{name:'" + tObj.fields[j].name + "'" + calc + dispName + ',pk:' + tObj.fields[j].pk + ",dim:'" + tObj.fields[j].dim + "',type:" + type + ",edit:'" + edit + "',format:'" + format + "'}";
				if (fields != '') fields += ',';
				fields += field;
			}
			table += fields + ']}';
		} else {
			var fields = '';
			for (var j=0; j<tObj.fields.length; j++) {
				var calc = tObj.fields[j].calc;
				if (calc != 1) continue;
				calc = ',calc:1';
				var type = tObj.fields[j].type;
				var edit = tObj.fields[j].edit;
				var format = tObj.fields[j].format;
				if (!type) type = '0';
				if (!edit) edit = '';
				if (!format) format = '';
				var dispName = tObj.fields[j].dispName;
				if (dispName) dispName = ",dispName:'" + dispName + "'";
				else dispName = '';
				var field = "{name:'" + tObj.fields[j].name + "'" + calc + dispName + ',pk:' + tObj.fields[j].pk + ",dim:'" + tObj.fields[j].dim + "',type:" + type + ",edit:'" + edit + "',format:'" + format + "'}";
				if (fields != '') fields += ',';
				fields += field;
			}
			if (fields != '') {
				table += "{name:'" + tObj.name + "',fields:[" + fields + ']}';
			}
		}
		if (tables != '') tables += ',';
		tables += table;
	}
	
	var queryInfos = generateSql(true);
	var dql = '', attrs = '';
	if (queryInfos && queryInfos.length == 3) {
		dql = queryInfos[0];
		attrs = queryInfos[1];
	}
	var json = currDBName + '<;>' + '({domInfos:' + domUtils.toString() + ',tables:[' + tables + ']})' + '<;>' + dql + '<;>' + attrs;
	return json;
}

function saveDL() {
	var json = getSaveStrOnce();
	if (json == null) return;
	//$("#saveWin").dialog('open');
	var fr = $('<iframe id="saveDLFrame" src="" style="width:99%;height:99%;" frameBorder=no></iframe>');
	$("#saveDLWin").html('').append(fr);
	//fr.attr('src', contextPath + '/dl/jsp/dl.html');
	fr.attr('src', contextPath + "/webFile/saveFile.jsp?defaultName=" + encodeURIComponent(qyxPath + qyxName) + "&ext=qyx&okfunc=doSaveDL&cancelfunc=hideSaveWin&d=" + new Date().getTime());
	var dlg = art.dialog({
		id : 1999
		,title : '保存查询'
	    ,content: $('#saveDLWin')[0]
	    ,lock : true
	    ,duration : 0
		,opacity : 0.1
		,padding : '2px 2px'
		,width : '510px'
		,height : '410px'
	});
	if ($('#saveDLWin').length == 0) {
		$('body').append(dlg.DOM.wrap);
	}
	
	//$("#saveWin").css('width','');
/*
	//测试保存
	var json = getSaveStrOnce();
	var pageName = "../jsp/save.jsp";
	var returnStr = window.showModalDialog(pageName + "?d" + new Date().getTime() + "&oper=beforeSave", "", "dialogWidth=520px;dialogHeight=400px;dialogTop=" + (screen.height-400)/2 + "px;dialogLeft=" + (screen.width-520)/2 + "px;");
	if (returnStr != null && returnStr.length > 0) {
		document.getElementById("saveFrame").src=pageName + "?d" + new Date().getTime() + "&oper=save" + "&name=" + encodeURIComponent(returnStr) + "&dlConf=" + encodeURIComponent(json);
	}
*/
	
}

function saveGex() {
	if ($('#saveGexBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
	var json = getSaveStrOnce();
	if (json == null) return;
	$('#rsFrame')[0].contentWindow.saveGex();
	return;
	//$("#saveWin").dialog('open');
	var fr = $('<iframe id="saveFileFrame" src="" style="width:99%;height:99%;" frameBorder=no></iframe>');
	$("#saveWin").html('').append(fr);
	//fr.attr('src', contextPath + '/dl/jsp/dl.html');
	fr.attr('src', contextPath + "/webFile/saveFile.jsp?defaultName=" + encodeURIComponent(qyxPath + qyxName.replace('.qyx', '')) + "&ext=gex&okfunc=doSaveGex&cancelfunc=hideSaveWin&d=" + new Date().getTime());
	var dlg = art.dialog({
		id : 1999
		,title : '保存结果集'
	    ,content: $('#saveWin')[0]
	    ,lock : true
	    ,duration : 0
		,opacity : 0.1
		,padding : '2px 2px'
		,width : '510px'
		,height : '410px'
	});
	if ($('#saveWin').length == 0) {
		$('body').append(dlg.DOM.wrap);
	}
}

function doSaveDL( path, callback ) {
	try{art.dialog.list[1999].close();}catch(e){}
	var json = getSaveStrOnce();
	if (json == null) return;
	if (path.toLowerCase().indexOf('.q_y_x') == -1 && path.toLowerCase().indexOf('.qyx') == -1) {
		path = path + '.qyx';
	}
	var params = { action: "6", path: path, dlConf:json, type:'qyx', pageId:pageId };
	$.ajax( { type: "POST", url: contextPath + "/servlet/dataSphereServlet" + "?d=" + new Date().getTime(), data: params,
		success: function( msg ) {
			if( msg.indexOf( "error:" ) == 0 ) {
				alert( msg.substring( 6 ) );
			} else {
				if (callback) {
					eval(callback);
					return;
				}
				alert( "文件" + path + " 已保存!" );
				if (!escalc) {
					var pos = path.lastIndexOf('/');
					if (pos == -1) pos = path.lastIndexOf('\\');
					qyxName = path.substring(pos+1).replace('.qyx','');
					document.title = 'DataSphere数据查询 [' + qyxName + '] - [' + currDBName + ']';
				}
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert( textStatus );
		}
	} );
}

var currQuery = null;
function generateLglSql() {
	if(editMode == 0) {
		var dql = $.trim($('#dqlBox').attr('value'));
		if (dql == '') {
			alert('请输入DQL语句');
		}
		return dql;
	} else {
		currQuery = generateSql();
		if (currQuery && currQuery.length ==3) {
			return currQuery[0];
		}
	}
	//alert('未正确生成查询语句');
	return "";
}
function getFieldAttrs() {
	if (editMode == 1 && currQuery && currQuery.length == 3) {
		return currQuery[1];
	} else {
		return _attrsToString();
	}
	return "";
}

function hasAllPk(t,currDomInfos){
	if (!currDomInfos) currDomInfos = domInfos;
	var ats = mdUtils.getAnnexTables(t);
	if (ats) {
		var pos = new Array();
		var count = 0;
		for (var j=0; j<currDomInfos.bys.length; j++) {
			var bDom = currDomInfos.bys[j];
			var fDomj = domUtils.getField(bDom.dimAlias,currDomInfos);
			if (fDomj.selectOut == 0) continue;
			var infoObj = parseFieldInfos(bDom.infos);
			if (infoObj.length > 1) continue;
			var _t = getInfos(infoObj, 5);
			var _f = getInfos(infoObj, 6);
			if (!mdUtils.isAnnex(_t, t)) continue;
			for (var i=0; i<ats.length; i++) {
				if (ats[i].name == _t) {
					var idx = ats[i].pks.indexOf(_f);
					if (idx >= 0) pos[idx] = 1;
					count = ats[i].pks.length;
					break;
				}
			}
		}
		if (count == 0) return false;
		for (var i=0; i<count; i++) {
			//alert(pos[i]);
			if (pos[i] != 1) return false;
		}
		return true;
	} else {
		var pks = mdUtils.getTablePKs(t);
		for (var j=0; j<currDomInfos.bys.length; j++) {
			var bDom = currDomInfos.bys[j];
			var fDomj = domUtils.getField(bDom.dimAlias,currDomInfos);
			if (fDomj.selectOut == 0) continue;
			var infoObj = parseFieldInfos(bDom.infos);
			if (infoObj.length > 1) continue;
			var _t = getInfos(infoObj, 5);
			var _f = getInfos(infoObj, 6);
			if (!mdUtils.isAnnex(_t, t)) continue;
			for (var i=0; i<pks.length; i++) {
				if (pks[i].name == _f) {
					pks.remove(pks[i]);
					break;
				}
			}
		}
		return pks.length == 0;
	}
}

function generateSql(silence) {
	var currDomInfos = domInfos;
	if (detailJoin) {
		if (!refreshDetailDomInfos()) return;
		currDomInfos = detailDomInfos;
	}
	var select='',from='',having='',orderby='';
	
	var tableAnnexs = new Array();
	var tableAliass = new Array();
	var joins = new Array();
	var tableWheres = new Array();
	var tableBys = new Array();
	var attrs = new Array();

	var fields = new Array();
	var orderBys = new Array();
	var orderFields = new Array();
	var resultFields = new Array();
	//字段别名及字段表达式，用于替换计算列中的别名
	var fs = new Array();
	var fExps = new Array();
	var calcFs = new Array();//计算列的表达式，未处理前fields中只存别名。

	for (var i=0; i<currDomInfos.tables.length; i++) {
		var tDom = currDomInfos.tables[i];
		tableAliass[i] = tDom.name;
		tableAnnexs[i] = tDom.annexT;
		joins[i] = tDom.joinType;
	}
	var hasOn = false;
	for (var i=0; i<currDomInfos.fields.length; i++) {
		var fDom = currDomInfos.fields[i];

		if (!isNaN(fDom.name[0])) {
			if (!silence) alert('[' + fDom.name + ']名称不能以数字开头:');
			return false;
		}

		var type = 2;
		var fAlias = fDom.name;
		var infos = fDom.infos;
		var lcts = fDom.lcts;
		var edit = '';
		var aggr = fDom.aggr;//tr.find('#aggr')[0].value;
		if (!aggr) aggr = '';
		var where = fDom.where;
		var selectOut = fDom.selectOut;
		var order = fDom.order;
		var seq = fDom.seq;
		var format = fDom.format;
		if (!format) format = '';
		if (format == 'null') format = '';
		var width = fDom.colWidth;
		if (!width) width = 80;
		
		if (fDom.type == 2) {
			if (fDom.selectOut == 1) hasOn = true;
			continue;
		} else if (fDom.type == 4) {
			continue;
		} else if (fDom.type == 3) {
			if (selectOut == 1){//select
				//fields[i] = '(' + fDom.exp + ') AS ' + fAlias;
				fields[i] = fAlias;
				calcFs[i] = fDom.exp;
				attrs[attrs.length] = "_,_" + fAlias + "_,_" + width + "_,_" + format + "_,_" + fDom.useDisp;
				//var currField = {name:fAlias,pk:0,dim:getInfos(parseFieldInfos(infos), 3),type:type,edit:edit,format:format}
				//resultFields[resultFields.length] = currField;
			}
			if (order != '0') {
				orderBys[seq] = order;
				orderFields[seq] = fDom.exp;
			}
			if (where && where != '') {// 复杂条件不让编辑where，这里无效了
				if (where.indexOf('_;_') == -1) {
					if ("HAVING" == fDom.wherePos) {
						if (having != '') having += ' AND ';
						having += '(' + where + ')';
					} else {
						var ti = tableAliass.indexOf(fDom.wherePos);
						var wheres;
						if (ti >= 0) {
							wheres = tableWheres[ti];
							if (wheres == null) {
								wheres = new Array();
								tableWheres[ti] = wheres;
							}
						} else {
							wheres = new Array();
							tableAliass[tableAliass.length] = fDom.wherePos;
							tableWheres[tableWheres.length] = wheres;
						}
						wheres[wheres.length] = where;
					}
				}
			}
			continue;
		} else if (fDom.type == 5) {
			continue;
		}

		var tDom = domUtils.getTable(fDom.tAlias, currDomInfos);
		var annexT = tDom.annexT;
		var tAlias = tDom.name;
		var infos = parseFieldInfos(fDom.infos);
		var fObj = mdUtils.getField(getInfos(infos, 5), getInfos(infos, 6));
		edit = fObj.edit;
		type = domUtils.getFieldType(fDom.name, currDomInfos);

		//自动聚合，维中有主键时，对没有聚合方式的字段自动求和或计数。只对选出的字段自动聚合
		if (aggr == '' && hasOn && selectOut == 1) {
			if (!hasAllPk(annexT,currDomInfos)) {
				if (type == 1) aggr = 'sum';
				else  aggr = 'count';
			}
		}
		
		var f = getInfos(parseFieldInfos(fDom.infos), 10, annexT);//tr.find('#fExp').html();
		if (lcts != null && lcts != '') {
			var ls = lcts.split(',');
			for (var k=0; k<ls.length; k++) {
				var lsk = ls[k].split('<_>');
				f += '~' + lsk[0];
			}
		}
		if (fObj.calc == 1 || aggr != '') f = "(" + f + ")";
		if (fObj.calc == 1) {
			var ats = mdUtils.getAnnexTables(annexT);
			if (ats == null) {
				ats = new Array();
				ats[0] = {name:annexT,pks:[]};
			}
			for (var z=0; z<ats.length; z++) {
				var tz = mdUtils.getTable(ats[z].name);
				for (var y=0; y<tz.fields.length; y++) {
					if (tz.fields[y].calc == 1) continue;
					var fzyName = tz.fields[y].name;
					var fzyAlias = tz.fields[y].dispName;
					if (fzyAlias && fzyAlias != fzyName) f = f.replaceAll(fzyAlias, fzyName);
				}
			}
		}
		var fWithAggr = f;
		if (aggr) fWithAggr = aggr + f; //加入聚合函数
		var join = tDom.joinType;
		//(where);
		
		var dim = fDom.dim;
		//if (ds == null) ds = '';
		//else ds += '_,_';
		//var codeDisp = '';
		var dimExp = '';
		var dimType = 0;
		if (dim && dim!=''){
			var dimObj = mdUtils.getDim(dim);
			if (dimObj.exp && dimObj.dt > 0) {
				dimExp = dimObj.exp;
				dimType = dimObj.dt;
			}
			//var codes = dimObj.codes;
			//var disps = dimObj.disps;
			//if (codes != null && codes != '' && disps != null && disps != '') {
			//	codeDisp += codes + 'r;q' + disps;
			//}
		}

		if (selectOut == 1){//select
			fields[i] = tAlias + '.' + fWithAggr + " AS " + fAlias;
			attrs[attrs.length] = "_,_" + fAlias + "_,_" + width + "_,_" + format + "_,_" + fDom.useDisp;
			var currField = {name:fAlias,pk:0,dim:getInfos(infos, 3),type:type,edit:edit,format:format}
			resultFields[resultFields.length] = currField;
		}
		fs[fs.length] = fAlias;
		fExps[fExps.length] = tAlias + '.' + fWithAggr;
		
		if (where && where != '') {
			//TODO翻译where
			if (where.indexOf('_;_') == -1) {
				if ("HAVING" == fDom.wherePos) {
					if (having != '') having += ' AND ';
					having += '(' + where + ')';
				} else {
					var ti = tableAliass.indexOf(fDom.wherePos);
					var wheres;
					if (ti >= 0) {
						wheres = tableWheres[ti];
						if (wheres == null) {
							wheres = new Array();
							tableWheres[ti] = wheres;
						}
					} else {
						wheres = new Array();
						tableAliass[tableAliass.length] = fDom.wherePos;
						tableWheres[tableWheres.length] = wheres;
					}
					wheres[wheres.length] = where;
				}
				
			} else {
				if (fObj.aggr != 1  && !aggr) {
					var ti = tableAliass.indexOf(tAlias);
					var wheres;
					if (ti >= 0) {
						wheres = tableWheres[ti];
						if (wheres == null) {
							wheres = new Array();
							tableWheres[ti] = wheres;
						}
					} else {
						wheres = new Array();
						tableAliass[tableAliass.length] = tAlias;
						tableWheres[tableWheres.length] = wheres;
					}

					where = conditionConfig.transfer(type, where, dimType, dimExp);
					where = where.replaceAll('_x_', tAlias + '.' + fWithAggr);
					wheres[wheres.length] = where;
				} else {
					if (having != '') having += ' AND ';
					where = conditionConfig.transfer(type, where, dimType, dimExp);
					where = where.replaceAll('_x_', tAlias + '.' + fWithAggr);
					having += '(' + where + ')';
				}
			}
		}
		
		if (order != '0') {
			orderBys[seq] = order;
			orderFields[seq] = tAlias + '.' + fWithAggr;
		}
	}

	var maxLength = 0;
	for (var k=0; k<fs.length; k++) {
		maxLength = (maxLength > fs[k].length ? maxLength : fs[k].length);
	}

	for (var i=0; i<currDomInfos.fields.length; i++) {
		var fDom = currDomInfos.fields[i];

		var where = fDom.where;
		var pos = '';
		if (fDom.type == 4) {
			pos = fDom.wherePos;
			for (var z=maxLength; z>0; z--) {
				for (var k=0; k<fs.length; k++) {
					if (fs[k].length == z) {
						where = where.replaceAll(fs[k], "__" + k + "__");
						//where = where.replaceAll(fs[k], fExps[k]);
						//exp = exp.replaceAll(fs[k], fExps[k]);
					}
				}
			}
			for (var k=0; k<fs.length; k++) {
				where = where.replaceAll("__" + k + "__", fExps[k]);
			}
		} else if (fDom.type == 5) {
			var items = where.replaceAll('fkwhere','').substring(1).replaceAll('_;_AND','').split('_fk2_');
			pos = items[1];
			where = conditionConfig.transfer('', fDom.where, '', '');
			for (var z=maxLength; z>0; z--) {
				for (var k=0; k<fs.length; k++) {
					if (fs[k].length == z) {
						where = where.replaceAll("="+fs[k], "__" + k + "__");
						//where = where.replaceAll(fs[k], fExps[k]);
						//exp = exp.replaceAll(fs[k], fExps[k]);
					}
				}
			}
			for (var k=0; k<fs.length; k++) {
				where = where.replaceAll("__" + k + "__", "=" + fExps[k]);
			}
		} else continue;

		if ("HAVING" == pos || where.indexOf('sum')>=0 || where.indexOf('countd')>=0 || where.indexOf('count')>=0 || where.indexOf('avg')>=0 || where.indexOf('max')>=0 || where.indexOf('min')>=0) {
			if (having != '') having += ' AND ';
			having += '(' + where + ')';
		} else {
			var ti = tableAliass.indexOf(pos);
			var wheres;
			if (ti >= 0) {
				wheres = tableWheres[ti];
				if (wheres == null) {
					wheres = new Array();
					tableWheres[ti] = wheres;
				}
			} else {
				wheres = new Array();
				tableAliass[tableAliass.length] = pos;
				tableWheres[tableWheres.length] = wheres;
			}
			wheres[wheres.length] = where;//.substring(where.indexOf('.') + 1); 2013/05/29
		}
	}
	
	for (var j=0; j<fields.length; j++) {
		if (fields[j] && fields[j].indexOf('AS') == -1) {
			var fa = fields[j];
			var exp = calcFs[j];
			for (var z=maxLength; z>0; z--) {
				for (var k=0; k<fs.length; k++) {
					if (fs[k].length == z) {
						exp = exp.replaceAll(fs[k], "__" + k + "__");
					}
				}
			}
			for (var k=0; k<fs.length; k++) {
				exp = exp.replaceAll("__" + k + "__", fExps[k]);
			}
			fields[j] = '(' + exp + ') AS ' + fa;
		}
	}
	
	for (var j=0; j<fields.length; j++) {
		if (fields[j]) {
			if (select != '') select += ',\n\t';
			select += fields[j];
		}
	}
	if (select == '') {
		if (!silence) alert('至少要选出一个字段。');
		return;
	}
	
	var on = '';
	var fieldAttrs = null;
	var onCount = 0;
	//var ws = null;
	//var ds = null;
	for (var i=0; i<currDomInfos.fields.length; i++) {
		var fDom = currDomInfos.fields[i];
		if (fDom.type != 2) continue;
		
		var cond = fDom.where;
		if (cond && cond != '') {
			if (cond.indexOf('_;_') == -1) {
				if ("HAVING" == fDom.wherePos) {
					if (having != '') having += ' AND ';
					having += '(' + cond + ')';
				} else {
					var ti = tableAliass.indexOf(fDom.wherePos);
					var wheres;
					if (ti >= 0) {
						wheres = tableWheres[ti];
						if (wheres == null) {
							wheres = new Array();
							tableWheres[ti] = wheres;
						}
					} else {
						wheres = new Array();
						tableAliass[tableAliass.length] = fDom.wherePos;
						tableWheres[tableWheres.length] = wheres;
					}
					wheres[wheres.length] = where;
				}
			}
		}

		if (fDom.selectOut == 0) continue;
		onCount++;
		var dim = fDom.dim;
		var dimObj = mdUtils.getDim(dim);
		var fObj = mdUtils.getField(dimObj.table, dimObj.field);
		var alias = fDom.name;
		var type = fObj.type;
		var edit = fObj.edit;
		var order = fDom.order;
		var seq = fDom.seq;
		var format = fDom.format;
		if (!format) format = '';
		if (format == 'null') format = '';
		var level = fDom.level;
		var width = fDom.colWidth;
		if (!width) width = 80;
		var dimExp = '';
		var dimType = 0;
		if (dimObj.exp && dimObj.dt > 0) {
			dimExp = dimObj.exp;
			dimType = dimObj.dt;
		}
		if (level) {
			if ((dimObj.table + "." + dimObj.field) != level) {
				dimObj = mdUtils.getDimByTableField(level);
				dim = dimObj.name;
			}
		}
		
		if (order != '0') {
			orderBys[seq] = order;
			for (var z=0; z<currDomInfos.bys.length; z++) {
				var byDom = currDomInfos.bys[z];
				if (byDom.dimAlias == alias) {
					var tDom = domUtils.getTable(byDom.tAlias,currDomInfos);
					var annexT = tDom.annexT;
					var tAlias = tDom.name;
					var infosz = byDom.infos;
					if (level) infosz = getInfos(parseFieldInfos(infosz), 4, '', '', dim);
					orderFields[seq] = byDom.tAlias + '.' + getInfos(parseFieldInfos(infosz), 10, annexT);
					break;
				}
			}
		}
		
		//if (ds == null) ds = '';
		//else ds += '_,_';
		
		//var codes = dimObj.codes;
		//var dsps = dimObj.disps;
		//var codeDisp = '';
		//if (codes != null && codes != '' && dsps != null && dsps != '') {
		//	codeDisp += codes + 'r;q' + dsps;
		//}

		if (fieldAttrs == null) fieldAttrs = '';
		else fieldAttrs += '_;_';
		fieldAttrs += '_,_' + alias + '_,_' + width + "_,_" + format + "_,_" + fDom.useDisp;

		//if (ws == null) ws = '';
		//else ws += '_,_';
		//ws += width;

		if (cond != '') {
			cond = conditionConfig.transfer(type, cond, dimType, dimExp);
			cond = cond.replaceAll('_x_', alias);
		}
		if (on != '') on += ',\n\t';
		on += dim + (" AS "+alias)/*(dim==alias?'':(" AS "+alias))*/ + (cond==''?'':' WHERE ' + cond);
		var currField = {name:alias,pk:1,dim:dim,type:type,edit:edit,format:format}
		resultFields[resultFields.length] = currField;
	}

	for (var j=0; j<orderBys.length; j++) {
		if (orderBys[j]) {
			if (orderby != '') orderby += ',';
			orderby += orderFields[j] + (orderBys[j]=='1'?' ASC':' DESC');
		}
	}
	
	if (on != '') {
		if (detailJoin) select += '\n   ONLY ON ' + on;
		else select += '\n   ON ' + on;
	}
	if (on == '' && tableAliass.length > 1) {
		if (!silence) alert('多于两个表连接时，必须设置维与连接字段。');
		return;
	}
	var withs = '';
	var fullBy = new Array();
	for (var i=0; i<tableAliass.length; i++) {
		var jt = joins[i];
		if (jt == 3) jt = $('#defaultJoinType').attr('value');
		if (from != '') from += '\r' + (jt==0?' JOIN ':(jt==1?' LEFT JOIN ':' FULL JOIN '));
		from += tableAnnexs[i]+' AS '+tableAliass[i];
		if (tableWheres[i]) {
			var w = '';
			for (var j=0; j<tableWheres[i].length; j++) {
				if (j>0) w+= ' AND ';
				w += '(' + tableWheres[i][j] + ')';
			}
			from += '\n   WHERE ' + w;
		}

		var by = '';
		var count = 0;
		for (var j=0; j<currDomInfos.bys.length; j++) {
			var bDom = currDomInfos.bys[j];
			var fDomj = domUtils.getField(bDom.dimAlias,currDomInfos);
			if (fDomj.selectOut == 0) continue;
			if (bDom.tAlias == tableAliass[i]) {
				if (by != '') by += ',';
				//以前不知道为啥屏蔽掉表名了，2013、11、08又加上。
				by += tableAnnexs[i] + "." + getInfos(parseFieldInfos(bDom.infos), 10, tableAnnexs[i]) + ' AT ' + bDom.dimAlias;
				count++;
			}
		}
		fullBy[i] = (count == onCount);
		//alert(fullBy[i]);
		if (by != '') from += '\n   BY ' + by;
		else if (onCount > 0) {
			if (!silence) alert('表【' + tableAnnexs[i] + '】中至少有一个与维对应的by字段!');
			return;
		}
		var tableObj = mdUtils.getTable(tableAnnexs[i]);
		if (tableObj.dql) {
			if (withs.length > 0) withs += ", ";
			withs += tableAliass[i] + " AS (" + tableObj.dql + ")";
		}
	}
	var oneFullBy = false;
	for (var i=0; i<fullBy.length; i++) {
		if (fullBy[i]) {
			oneFullBy = true;
			break;
		}
	}
	if (!oneFullBy) {
		if (!silence) {
			var pmt = confirm('没有一个表与全部维对应，可能查询出巨大数据集，是否继续？');
			if (!pmt) return;
		}
		//if (!silence) alert('至少有一个表要与所有维存在对应字段!');
		//return;
	}
	if (withs.length > 0) {
		withs = "WITH " + withs + " ";
	}
	for (var j=0; j<attrs.length; j++) {
		if (fieldAttrs == null) fieldAttrs = '';
		else fieldAttrs += '_;_';
		fieldAttrs += attrs[j];
	}
/*
	for (var j=0; j<widths.length; j++) {
		if (ws == null) ws = '';
		else ws += '_,_';
		ws += widths[j];
	}
	for (var j=0; j<disps.length; j++) {
		if (ds == null) ds = '';
		else ds += '_,_';
		ds += disps[j];
	}
*/	
	var dist = $('#distinctBut');
	if (dist.length == 1 && dist[0].checked) dist = 'DISTINCT ';
	else dist = '';
	var sql = withs + 'SELECT ' + dist + select + ' \nFROM ' + from + (having==''?'':' \nHAVING ' + having) + (orderby==''?'':' \nORDER BY ' + orderby);
	//sql = sql.replaceAll('\n','').replaceAll('\t','');
	var arr = new Array();
	arr[0] = sql;
	arr[1] = fieldAttrs;
	arr[2] = resultFields;
	return arr;
}

function changeFormatList( fmt ) {
	var list = shuzhi;
	switch( fmt ) {
		case "0": list = shuzhi; break;
		case "1": list = huobi; break;
		case "2": list = riqi; break;
		case "3": list = shijian; break;
		case "4": list = rqsj; break;
		case "5": list = fenshu; break;
		case "6": list = kexue; break;
	}
	var listBox = $$( "formatList" );
	listBox.options.length = 0;
	for( var i = 0; i< list.length; i++ ) {
		listBox.options.add( new Option( list[i], list[i], false, false ), listBox.options.length );
	}
}


function setFormat(){
//	var r = formatTd.data('trObj');
//	if (r) { //拖拽模式下的设置

	var i = domInfos.fields.indexOf(currFormatField);
	var oldFormat = currFormatField.format;
	var oldUseDisp = currFormatField.useDisp;
	var format = $('#formatBox').attr('value');
	var useDisp = $('#useDispBut')[0].checked?1:0;
	
	//$('#setFormat').dialog('close');
	var oper = {undo:'operations.setFieldFormat(' + i + ',"' + oldFormat + '","' + oldUseDisp + '")',redo:'operations.setFieldFormat(' + i + ',"' + format + '","' + useDisp + '")'}
	operations.addOper(oper);
	eval(oper.redo);
	_setAttrFormat(currFormatField.name, format, useDisp);
}

function changeRSButs(enable){
	$('#prevBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'prev' + (enable?'':'-h') + '.png');
	$('#nextBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'next' + (enable?'':'-h') + '.png');
	$('#txtDownloadBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'txt-download' + (enable?'':'-h') + '.png');
	$('#setBackBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'set-back' + (enable?'':'-h') + '.png');
	$('#txtSaveBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'txt-save' + (enable?'':'-h') + '.png');
	$('#txtAllBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'txt-all' + (enable?'':'-h') + '.png');
	$('#excelBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'excel' + (enable?'':'-h') + '.png');
	$('#gexBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'gex' + (enable?'':'-h') + '.png');
	$('#saveGexBut').attr('disabled',!enable).attr('src','..' +  consts.imgFolder + 'save-gex' + (enable?'':'-h') + '.png');
}

var orderClickCount = 0;//每次排序，会把当前排序动作次数记录起来，越大记录的排序字段，优先级越高。
function generateResultSetHeader() {
	var h = $('#resultSetHeader');
	h.html('');
	$('#designResultSet').css('display','block');
	$('#rsDiv').css('display','none');
	if (escalc) return;
	
	for (var i=0; i<domInfos.fields.length; i++) {
		var fDom = domInfos.fields[i];
		if (fDom.selectOut==0) continue;
		//if (fDom.type == 2 && fDom.selectOut==0) continue;
		var width = fDom.colWidth;
		var alias = fDom.name;
		
		var td = $("<td style='background-image:url(.." + consts.imgFolder + (fDom.type==2?consts.img22:consts.img23) + ")' class='onField' alias='" + alias + "'><div id='resize'>" + alias + "</div></td>");
		td.css('width', width+'px').css('border','1px solid ' + (fDom.type==2?'#708DB5':consts.color8) + '').css('padding-left','3px').css('background-color',consts.color19);
		td.data('fDom',fDom);
		h.append(td);
		td.find('#resize').resizable({
			resize:function(event,ui){
				//event.stopPropagation();
				var width = parseInt(ui.size.width);
				ui.helper.parent().css('width',width+'px');
				ui.helper.parent().data('fDom').colWidth = width;
				_setAttrWidth(ui.helper.parent().data('fDom').name, width);				
			},
			stop : function(event,ui){
				//ui.helper.parent().css('width',ui.size.width+'px');
				//tr.attr('colWidth', parseInt(ui.size.width));
			}
		});
		td.find('.ui-resizable-s').remove();
		td.find('.ui-icon-gripsmall-diagonal-se').remove();

		td.dblclick(function(){
			var fDom = $(this).data('fDom');
			currFormatField = fDom;
			var hasDisp = false;
			if (fDom.aggr == '' && fDom.dim != '') {
				var dimObj = mdUtils.getDim(fDom.dim);
				if (dimObj.sql != null && dimObj.sql != '') {
					hasDisp = true;
				}
			}
			$('#formatBox').attr('value', fDom.format);
			$('#useDispBut')[0].checked = (fDom.useDisp == 1);
			$('#useDispBut').attr('checked', fDom.useDisp==1).attr('disabled', !hasDisp);
			var dlg = art.dialog({
				id : dialogCount++,
				title : '设置显示格式',
			    content: $('#setFormat')[0]
			    ,ok : function() {
			    	setFormat();
			    }
			    ,cancel : true
			    ,okVal : '确定'
			    ,cancelVal : '取消'
			    ,lock : true
			    ,duration : 0
				,opacity : 0.1
				,padding : '2px 2px'
			});
			if ($('#setFormat').length == 0) {
				$('body').append(dlg.DOM.wrap);
			}
			if ($('#setFormat').length == 0) {
				$('.aui_state_focus').css('display', 'block');
			}
		});
	}
//	$('#resultSetBody').html('');
	changeRSButs(false);
	if (pageMode == 0) {
		doQuery();
	}
}



function doCreateMiddle(name,execTime) {
	var path = "/" + new Date().getTime() + ".q_y_x";
	doSaveDL(path, "doQuery('" + name + "','" + path + "','" + execTime + "')");
}

function doQuery(create, qyx, execTime){
	var dql = '';
	var attrs = '';
	if (editMode == 1) {
		var sql = generateSql();
		if (!sql) {
			if (pageMode == 0) switchMode();
			return;
		}
		dql = sql[0];
		attrs = sql[1];
		//jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:2,oper:'execute',sql:sql[0],attrs:sql[1], pageId:pageId}, queryCallback);
	} else {
		var fmts = '';
		var dql = $.trim($('#dqlBox').attr('value'));
		if (dql == '') {
			alert('请输入DQL语句');
			return;
		}
		attrs = _attrsToString();
	}
	//$.blockUI({ message: '<div style="padding:5px;">请稍等......&nbsp;<a href="#" onclick="cancelQuery();">取消</a></div>' });
	$('#designResultSet').css('display','none');
	$('#rsDiv').css('display','block');
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath + "/dl/jsp/result.jsp");
	form.attr('target', create?'hiddenFrame':'_blank');
	form.append('<input type="hidden" name="show" value="1">');
	form.append('<input type="hidden" name="action" value="2">');
	form.append('<input type="hidden" name="name" value="' + create + '">');
	form.append('<input type="hidden" name="oper" value="' + (create?'create':'execute') + '">');
	form.append('<input type="hidden" name="pageId" value="' + pageId + '">');
	form.append('<input type="hidden" name="dql" value="' + dql + '">');
	form.append('<input type="hidden" name="attrs" value="' + attrs + '">');
	if (qyx) form.append('<input type="hidden" name="qyx" value="' + qyx + '">');
	if (execTime) form.append('<input type="hidden" name="execTime" value="' + execTime + '">');
	$('body').append(form);
	form[0].submit();
	//$('#rsFrame')[0].src = contextPath + "/dl/jsp/result.jsp?d=" + new Date().getTime() + '&action=2&oper=execute&dql=' + encodeURIComponent(dql) + '&attrs=' + encodeURIComponent(attrs) + '&pageId=' + pageId;
}

function prev() {
	if ($('#prevBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	$('#rsFrame')[0].contentWindow.prev();
	//jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:2,oper:'prev', pageId:pageId}, queryCallback);
}
function next() {
	if ($('#nextBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	$('#rsFrame')[0].contentWindow.next();
	//jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:2,oper:'next', pageId:pageId}, queryCallback);
}
function downloadTxt() {
	if ($('#txtDownloadBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	$('#rsFrame')[0].contentWindow.exportTxt();
	//$("#hiddenFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=txt&pageId=" + pageId;
}
function setRsBack() {
	if ($('#setBackBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	setTaskBack(true);
	queryFinished(false);
	//$("#hiddenFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=txt&pageId=" + pageId;
}
function saveTxt() {
	if ($('#txtSaveBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	$('#rsFrame')[0].contentWindow.saveTxt();
	//$("#hiddenFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=txt&pageId=" + pageId;
}
function allTxt() {
	if ($('#txtAllBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	$('#rsFrame')[0].contentWindow.allTxt();
	//$("#hiddenFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=txt&pageId=" + pageId;
}

function exportExcel() {
	if ($('#excelBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	$('#rsFrame')[0].contentWindow.exportExcel();
	//$("#hiddenFrame")[0].src = contextPath + "/DLServlet?d=" + new Date().getTime() + "&action=2&oper=xlsx&pageId=" + pageId;
}
function showGex() {
	if ($('#gexBut').attr('src').toLowerCase().indexOf('-h') > 0) return;
//	startServerStatus();
	$('#rsFrame')[0].contentWindow.showGex();
}

function close(){
	$('#rsFrame')[0].contentWindow.close();
}

var subQuerys = {
//	tableName : {
//		dql : '',
//		fields : ''
//	}
};

//{name:fAlias,pk:0,dim:getInfos(parseFieldInfos(infos), 3),type:type,edit:edit,format:format}
//{name:'员工表',
//	fields:[{name:'编号',pk:1,dim:'员工'},{name:'姓名',pk:0,dim:''},{name:'性别',pk:0,dim:''},{name:'部门',pk:0,dim:'部门'}],
//	fks:[{name:'fk1',destTable:'部门表',fields:['部门']}]}
function saveSubQuery(){
	currQuery = generateSql();
	if (!(currQuery && currQuery.length ==3)) return;
	var dql = currQuery[0];
	var fs = currQuery[2];
	var tn = '';
	for (var i=0; i<1000; i++) {
		tn = 'SubQuery_' + i;
		if (!mdUtils.getTable(tn)) {
			lmd.tables[lmd.tables.length] = {
				name : tn,
				dql : dql,
				doms : eval(getSaveStrOnce(true)),
				fields : fs
			}
			break;
		}
	}
	filterEvent(filterDom.attr('value'));
	alert('成功保存为表“' + tn + '”');	//return "";
	refreshMiddleTables();
}

function refreshMiddleTables() {
	return;
	var sel = $("#middleTables");
	var val = sel.attr('value');
	sel.html('');
	var opts = "<option value=''>请选择中间表</option>";
	for (var i=0; i<lmd.tables.length; i++) {
		var t = lmd.tables[i];
		if (!t.middle) continue;
		opts += "<option value='" + t.name + "'>" + t.dispName + "</option>"
	}
	//alert(opts);
	sel.html(opts);
	if (val) sel.attr('value', val);
}

function changeLatestTable() {
	var val = $("#latestTables").attr('value');
	if (val==null||val=='') return;
	loadFields(val);
}

function removeSubQuery() {
	var val = $("#subQuerySel").attr('value');
	if (val==null||val=='') return;
	for (var i=0; i<lmd.tables.length; i++) {
		var t = lmd.tables[i];
		if (t.name == val) lmd.tables.remove(t);
	}
}

function editSubQuery() {
	
}

function clearDimWhereSelected() {
	$('#dimWhereSelect option').removeAttr('selected');
}

function setOrderBy(){
	var newOrders = '';
	var as = $('#ordersDiv').find('a');
	for (var i=0; i<as.length; i++) {
		if (i > 0) newOrders += ",";
		newOrders += $(as[i]).html() + "<:>" + (i+1) + "<:>" + $(as[i]).parent().attr('order');
	}
	var undo = 'operations.reOrderBy("' + currOrderStr + '")';
	var redo = 'operations.reOrderBy("' + newOrders + '")';
	var oper = {undo:undo,redo:redo};
	operations.addOper(oper);
	eval(redo);
}

function refreshOrderBys() {
	$('#noOrdersDiv').find('li').each(function(){
		$(this).find('img').remove();
	});
	$('#ordersDiv').find('li').each(function(){
		$(this).find('img').remove();
		$(this).append('<img src="..' + consts.imgFolder + ($(this).attr('order')==1?consts.img11:consts.img12) + '" style="border:0px;vertical-align:middle;">');
	});
}

function showLocators(curr) {
	var div = $('#zTreeDiv');
	if (div.length == 0) {
		div = $('<div id="zTreeDiv" class="ztree" style="width:250px;height:350px;overflow:auto;"></div>');
		$('body').append(div);
	}
	var dlg = art.dialog({
		id : dialogCount++,
		title : curr.find('h3').attr('f'),
	    content: $('#zTreeDiv')[0]
	    ,left : '100%'
	    ,top : '100%'
	    ,okVal : null
	    ,cancelVal : null
	    ,lock : false
	    ,duration : 0
		,opacity : 0.1
		,zIndex : 10001
		,padding : '5px 5px'
	});
	if ($('#zTreeDiv').length == 0) {
		$('body').append(dlg.DOM.wrap);
	}
	$('#zTreeDiv').html('');
	var locators = [["语文","数学","英语"],["第一学期","第二学期","第三学期","第四学期"],["男","女"]];
	var zNodes = getLocatorNode(locators, '');
	locatorTree = $.fn.zTree.init($("#zTreeDiv"), {check:{
		enable : false
		,chkboxType: { "Y": "", "N": "" }
	},data:{simpleData:{enable:true}
	},callback:{onClick:function(event, treeId, treeNode){
		//listFile(treeNode.infos, 1);
	},beforeExpand:function(treeId, treeNode){
		var nodes = treeNode.children;
		if (nodes == null || nodes.length == 0) {
			locatorTree.addNodes(treeNode, getLocatorNode(locators, treeNode.infos), true);
		}
		return true;
	}}}, zNodes);
	
}

function getLocatorNode(locators, pInfos){
	var ps = new Array();
	if (pInfos != '') ps = pInfos.split(',');
	var nodes = new Array();
	for (var i=0; i<locators.length; i++) {
		if (ps.indexOf(i) >= 0) continue;
		var cp = pInfos;
		if (cp != '') cp += ",";
		cp += i;
		var leaf = ps.length == locators.length-1;
		for (var j=0; j<locators[i].length; j++) {
			nodes[nodes.length] = {name:locators[i][j],infos:cp,isParent:!leaf};
		}
	}
	return nodes;
}

var _attrs = new Array();
function setAttrWidth(name, width) {
	if (detailJoin) {
		return;
	}
	domUtils.getField(name).colWidth = width;
	_setAttrWidth(name, width);
	//alert(name + "--" + width);
}

function setAttrFormat(name, format, useDisp) {
	var currDomInfos = domInfos;
	if (detailJoin) {
		return;
		currDomInfos = detailDomInfos;
	}
	var f = domUtils.getField(name, currDomInfos);
	var i = currDomInfos.fields.indexOf(f);
	var oldFormat = f.format;
	var oldUseDisp = f.useDisp;
	var oper = {undo:'operations.setFieldFormat(' + i + ',"' + oldFormat + '","' + oldUseDisp + '")',redo:'operations.setFieldFormat(' + i + ',"' + format + '","' + useDisp + '")'}
	operations.addOper(oper);
	eval(oper.redo);
	_setAttrFormat(name, format, useDisp);
}

function queryFinished(success) {
	changeRSButs(success);
	//art.dialog.list[1982].close();
	//statusDialogOpen = false;
}

function showTypeTables(type) {
	$('#sysTable').attr('checked', type==1);
	$('#userTable').attr('checked', type==2);
	$('#sysTablesDiv').css('display',type==1?'block':'none');
	$('#userTablesDiv').css('display',type==2?'block':'none');
}

function changeDetailJoin(b) {
	detailJoin = b;

	if (editMode == 0) {
		currQuery = generateSql(true);
		var dql = '';
		if (currQuery && currQuery.length ==3) {
			dql = currQuery[0];
		}
		$('#dqlBox').attr('value',dql);
	}
}