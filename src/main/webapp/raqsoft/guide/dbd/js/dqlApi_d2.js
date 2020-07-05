guideConf.detectLevel = 4;
/*
查询对象，用法示例
var dqlQuery = new DqlQuery();
dqlQuery.setLmdStr();//元数据
dqlQuery.setDctStr();//字典文件内容
dqlQuery.setVsbStr();//可视文件内容
dqlQuery.setConfStr();//初始化的qyx的内容

var mdu = dqlQuery.metadataUtils;
var cu = dqlQuery.confUtils;

//...通过dqlQuery、mdu、cu里面的方法做各种界面动作的支持，方法的详细用法看代码里的注释


*/
function DqlQuery() {
	var obj = new Object();
	var lmd = null;
	var dct = null;
	var vsb = null;
	var domInfos = {relas:[],wheres:[],srcs:[],dataSource:"_db_pre_DataLogic_db_end_",outerCondition:[]};
	obj.conf = domInfos;
	var fulllmd = null;
	
	obj.setLmd = function(l) {
		obj.fulllmd = l;
		fulllmd = l;
		obj._refreshLmd();
	}
	
	obj.setLmdStr = function(str) {
		if (str == null || str.length == 0) fulllmd = null;
		else {
			fulllmd = eval("("+str.replaceAll('<d__q>','\\"').replaceAll('<d_q>','"')+")");
			if (fulllmd != null && fulllmd.tables) {
				for (var i=fulllmd.tables.length-1; i>=0; i--){
					if (fulllmd.tables[i].fields.length == 0) {
						fulllmd.tables.remove(fulllmd.tables[i]);
					}
				}
			}
		}
		obj.fulllmd = fulllmd;
		obj._refreshLmd();
	}
	obj.setVsbStr = function(str) {
		if (str && str.length>0) vsb = JSON.parse(str.replaceAll('<d__q>','\\"').replaceAll('<d_q>','"'));
		else vsb = null;
		obj.vsb = vsb;
		obj._refreshLmd();
	}
	obj.setDctStr = function(str) {
		if (str && str.length>0) dct = JSON.parse(str.replaceAll('<d__q>','\\"').replaceAll('<d_q>','"'));
		else dct = null;
		obj.dct = dct;
		obj._refreshLmd();
	}
	obj._refreshLmd = function() {
		lmd = clone(fulllmd);
		obj.lmd = lmd;
		if (lmd) {
			for (var i=0; i<lmd.dims.length; i++) {
				if (!lmd.dims[i].dispName) lmd.dims[i].dispName = lmd.dims[i].name;
			}
		}
		var where = [];
		if (vsb != null) {
			for (var i=lmd.tables.length-1; i>=0; i--) {
				var t = lmd.tables[i];
				var ti = null;
				for (var j=0; j<vsb.tableVisibilityList.length; j++) {
					var tj = vsb.tableVisibilityList[j];
					if (tj.name == t.name) {
						ti = tj;
						break;
					}					
				}
				
				if (ti == null || ti.isVisible==0) {
					var d = mdUtils.getDimByTable(t.name);
					if (d) d.hide = true;
					lmd.tables.remove(t);
					continue;
				}
				
				//alert(ti.name + "--" + (ti.isVisible == 2) +"--"+ ti.filter);
				if (ti.isVisible == 2 && ti.filter) {
					where.push({"table":t.name,"exp":ti.filter});
				}
				if (ti.invisibleFieldList) {
					for (var j=0; j<ti.invisibleFieldList.length; j++) {
						for (var z=0; z<t.fields.length; z++) {
							if (ti.invisibleFieldList[j] == t.fields[z].name) {
								t.fields.remove(t.fields[z]);
								break;
							}
						}
						for (var z=0; z<t.fks.length; z++) {
							if (ti.invisibleFieldList[j] == t.fks[z].name) {
								t.fks.remove(t.fks[z]);
								break;
							}
						}
					}
				}
			}
		}
		obj.outerCondition = where;
		
		if (dct != null) {
			for (var i=0; i<dct.tableItemList.length; i++) {
				var ti = dct.tableItemList[i];
				var t = mdUtils.getTable(ti.objectName, true);
				if (t == null) continue;
				t.dispName = ti.name;
				for (var j=0; j<ti.dataItemList.length; j++) {
					var fj = ti.dataItemList[j];
					var f = mdUtils.getField(t.name,fj.objectName,true);
					if (f != null) f.dispName = fj.name;
					f = mdUtils.getFK(t.name,fj.objectName);
					if (f != null) f.dispName = fj.name;
				}
			}
			
			
			for (var i=0; i<dct.dimItemList.length; i++) {
				var di = dct.dimItemList[i];
				//console.debug("di" + di.dimName);
				var d = mdUtils.getDim(di.dimName);
				//console.debug("d" + d);
				if (d == null) continue;
				d.dispName = di.name;
				try {
					if (di.codeCol) {
						//console.debug(di.codeCol);
						var cd = di.codeCol.split(".");
						d.item = {table:mdUtils.getTableByDisp(cd[0],true).name,code:mdUtils.getFieldByDisp(cd[0],cd[1],true).name};
						if (di.dispCol) d.item.disp = mdUtils.getFieldByDisp(cd[0],di.dispCol.split(".")[1],true).dispName;
						if (d.item.table==null||d.item.code==null||d.item.disp==null) d.item = null;
					}
				} catch(e) {
					console.warn(di.codeCol + " / " + di.dispCol + " / " + e);
				}
			}
			
			if (dct.classItemList != null && dct.classItemList.length>0) {
				lmd.classTables = [];
				for (var i=0; i<dct.classItemList.length; i++) {
					var ci = dct.classItemList[i];
					var c = {name:ci.name,tables:[],dims:ci.dimItemNameList};
					lmd.classTables.push(c);
					for (var j=0; j<ci.tableItemList.length; j++) {
						var cij = ci.tableItemList[j];
						if (cij.dataItemList) {
							var ct = {name:cij.objectName,fields:[]};
							c.tables.push(ct);
							for (var z=0; z<cij.dataItemList.length; z++) {
								ct.fields[z] = cij.dataItemList[z].name;
							}
						}
					}
				}
			} 
		}
		
		
	}
	obj.getConfStr = function(ds) {
		if (!ds) ds = guideConf.dataSource;
		if (!obj.conf) return "";
		obj.conf.dataSource = "_db_pre_" + ds + "_db_end_";
		if (!obj.conf.outerCondition) obj.conf.outerCondition = guideConf.outerCondition;
		var cp = JSON.parse(JSON.stringify(obj.conf));
		return JSON.stringify(cp).replaceAll('"','<d_q>');
	}
	obj.setConfStr = function(str) {
		if (str && str != '') {
			str = str.replaceAll('<d_q>','"');
			try{
				domInfos = JSON.parse(str);
			}catch(e){
				domInfos = eval("("+str+")");
			}
		} else {
			domInfos = {relas:[],wheres:[],srcs:[],dataSource:guideConf.dataSource,outerCondition:[]};
		}
		if (domInfos.outerCondition && domInfos.outerCondition.length>0) guideConf.outerCondition = domInfos.outerCondition;
		guideConf.dataSource = domInfos.dataSource.replaceAll("_db_pre_","").replaceAll("_db_end_","");
		obj.conf = domInfos;
	}
	
	//操作元数据的一些方法
	var mdUtils = {
		//通过所有表对象
		getTables : function() {
			if (lmd == null) return null;
			return lmd.tables;
		},
		//获得所有显示表
		getAllTreeTables : function() {
			var ts = [];
			var ts1 = mdUtils.getTables();
			if (ts1==null) return ts;
			for (var i=0; i<ts1.length; i++) {
				if (ts1[i].fields.length>1) ts.push(ts1[i].name);
			}
			return ts;
		},
		//通过表名获得表对象
		getTable : function(name, silence) {
			for (var i=0; i<lmd.tables.length; i++) {
				if (lmd.tables[i].name == name) return lmd.tables[i];
			}
			if (silence) return null;
			else {
				//alert('未找到表【' + name + '】');
			}
		},
		//通过表别名获得表对象
		getTableByDisp : function(disp, silence) {
			for (var i=0; i<lmd.tables.length; i++) {
				if (!lmd.tables[i].dispName) lmd.tables[i].name
				if (lmd.tables[i].dispName == disp) return lmd.tables[i];
			}
			if (silence) return null;
			else alert(resources.guide.js192.replaceAll("{0}",disp));
		},
		//获得一个表的所有子表，间接子表也算
		getAllSubTables : function(t) {//获得所有子表，先写死的找10层关系
			var ts = new Array();
			var tsNew = new Array();
			ts.push(t);
			tsNew.push(t);
			for (var i=0; i<10; i++){
				var tsi = new Array();
				if (tsNew.length == 0) break;
				for (var j=0; j<tsNew.length; j++){
					tsi = tsi.concat(mdUtils.getSubTables(tsNew[j]));
				}
				tsNew = [];
				if (tsi.length == 0) break;
				for (var j=0; j<tsi.length; j++)
				{
					if (ts.indexOf(tsi[j]) == -1) {
						tsNew.push(tsi[j]);
						ts.push(tsi[j]);
					}
				}
			}
			return ts;
		},
		//获得直接子表，A表有外键字段指向B表，那A就是B表的子表
		getSubTables : function(t,ts) {//获得子表
			if (!ts) ts = new Array();
			var dimObj = mdUtils.getDimByTable(t);
			if (!dimObj) return ts;
			for (var i=0; i<lmd.tables.length; i++) {
				var infoss = new Array();
				
				domUtils.getDimInfos(lmd.tables[i].name, dimObj.name, infoss, 0, true);
				if (infoss.length>0) ts[ts.length] = lmd.tables[i].name;
			}
			return ts;
		},
		//获得分类项下所有字段
		getShowFields : function(calssName, table, exceptPk) {
			var fs = [];
			if (!mdUtils.classContain(calssName, table, null, null)) return fs;
			var tObj = mdUtils.getTable(table);
			if (tObj && tObj.fields){
				for (var i=0; i<tObj.fields.length; i++){
					if (!mdUtils.classContain(calssName, table, tObj.fields[i].name, null)) continue;
					//alert(tObj.fields[i].name);
					if (exceptPk && tObj.fields[i].pk == 1) continue;
					if (tObj.fields[i].hide == 1) continue;
					fs.push(tObj.fields[i]);
				}
			}
			//alert(table+"--" +fs.length);
			return fs;
		},
		//分类项下是否有某个表、某个维
		classContain : function(calssName, table, field, dim) {
			var contain = true;
			if (calssName!=null && calssName!='') {
				contain = false;
				for (var k=0; k<lmd.classTables.length; k++) {
					var ck = lmd.classTables[k];
					if (ck.name == calssName) {

						if (table != null) {
							for (var m=0; m<ck.tables.length; m++) {
								var tm = ck.tables[m];
								if (tm.name == table) {
									if (field == null) return true;
									//alert(tm.fields + "------" + field);
									for (var i=0; i<tm.fields.length; i++) {
										if (tm.fields[i] == field) return true;
									}
								}
							}
						} else if (dim != null) {
							for (var m=0; m<ck.dims.length; m++) {
								if (ck.dims[m] == dim) return true;
							}
						}
					}
				}
			}
			return contain;
		},
		//获得字段的层函数列表，可能来自于字段的维
		getFieldDestLevels : function(fObj) {
			if (!fObj) return null;
			if (fObj.destLevels != null && fObj.destLevels.length>0) return fObj.destLevels;
			if (fObj.dim && fObj.dim != '') {
				var dObj = mdUtils.getDimByTableField(fObj.dim);
				if (dObj && dObj.destLevels != null && dObj.destLevels.length>0) return dObj.destLevels;
			}
			return null;
		},
		//获得字段对象
		getField : function(t, f, mustNull) {
			var t = mdUtils.getTable(t);
			/*
			try {
				if (ccnntt === undefined) ccnntt = 0;
			}catch(e){
				ccnntt = 0;	
			}
			ccnntt++;
			console.log("ccnntt : "+ccnntt);
			if (ccnntt>2000) return null;
			*/
			if (t) {
				for (var i=0; i<t.fields.length; i++) {
					if (t.fields[i].name == f) return t.fields[i];
				}
			}
			if (mustNull) return null;
			else return {name:f};
		},
		//通过表别名、字段别名获得字段对象
		getFieldByDisp : function(tDisp, fDisp, mustNull) {
			var t = mdUtils.getTableByDisp(tDisp,true);
			if (t) {
				for (var i=0; i<t.fields.length; i++) {
					if (!t.fields[i].dispName) t.fields[i].dispName = t.fields[i].name;
					if (t.fields[i].dispName == fDisp) return t.fields[i];
				}
			}
			if (mustNull) return null;
			else return {name:f};
		},
		//通过字段获得外键对象
		getFieldFK : function(t, f) {// 获得外键，单独以该字段为关系。
			var t = mdUtils.getTable(t);
			if (!t.fks) return;
			for (var i=0; i<t.fks.length; i++) {
				if (t.fks[i].fields.length > 1) continue;
				if (t.fks[i].fields[0] == f) return t.fks[i];
			}
		},
		//通过外键名称获得外键对象
		getFK : function(t, fk) {
			var t = mdUtils.getTable(t);
			if (t.fks) {
				for (var i=0; i<t.fks.length; i++) {
					if (t.fks[i].name == fk) return t.fks[i];
				}
			}
		},
		//获得表的主键列表
		getTablePKs : function(tName) {
			var t = mdUtils.getTable(tName);
			var pks = new Array();
			if (!t || !t.fields) return pks;
			for (var i=0; i<t.fields.length; i++) {
				var f = t.fields[i];
				if (f.pk == 1) pks[pks.length] = f;
			}
			return pks;
		},
		//获得一组同维表
		getAnnexTables : function(t) {
			var ats = new Array();
			ats[0] = {name:t,pks:[]};
			Out:
			for (var i=0; i<lmd.annexTables.length; i++) {
				for (var j=0; j<lmd.annexTables[i].length; j++) {
					if (lmd.annexTables[i][j].name == t) {
						ats = lmd.annexTables[i];
						break Out;
					}
				}
			}
			return ats;		
		},
		//判断两个表是否是同维表
		isAnnex : function(t1, t2) {
			if (t1 == t2) return true;
			var ts1 = mdUtils.getAnnexTables(t1);
			if (ts1) {
				for (var i=0; i<ts1.length; i++) {
					if (ts1[i].name == t2) return true;
				}
			}
			return false;
		},
		//获得分类项列表
		getClassTables : function() {
			return lmd.classTables;
		},
		//获得维列表
		getDims : function(className,containFinalDim) {
			var ds = [];
			for (var i=0; i<lmd.dims.length; i++) {
				if ((!containFinalDim) && mdUtils.getSubTables(lmd.dims[i].table).length == 0) continue;//孤维
				var show = mdUtils.classContain(className,null,null,lmd.dims[i].name);
				if (!show) continue;
				ds.push(lmd.dims[i]);
			}
			return ds;
		},
		//获得维对象
		getDim : function(dim) {
			if (!dim) return null; 
			for (var i=0; i<lmd.dims.length; i++) {
				if (dim == lmd.dims[i].name) return lmd.dims[i];
			}
			if (dim.indexOf('.') > 0) {
				var ds = dim.split('.');
				var pk = mdUtils.getField(ds[0],ds[1],true);
				if (pk == null || !pk.pk) return null;
				return {name:dim, dispName:ds[0]+ds[1], table:ds[0], field:ds[1]};
			}
		},
		//获得维表的表名称
		getDimTable : function(dim) {
			var t = mdUtils.getDim(dim).table;
			var pks = mdUtils.getTablePKs(t);
			if (pks.length == 1) return t;
			else return null;
		},
		//通过表名获得维对象
		getDimByTable : function(table) {
			//return mdUtils.getDim(tableField);
			for (var i=0; i<lmd.dims.length; i++) {
				if (table == lmd.dims[i].table) return lmd.dims[i];
			}
		},
		//通过"表.字段"获得维对象
		getDimByTableField : function(tableField) {
			//return mdUtils.getDim(tableField);
			var tableField = tableField.split('.');
			for (var i=0; i<lmd.dims.length; i++) {
				if (tableField[0] == lmd.dims[i].table && tableField[1] == lmd.dims[i].field) return lmd.dims[i];
			}
		}
	}
	//操作元数据的一些方法
	obj.metadataUtils = mdUtils;
	
	//操作qyx，界面配置对象的一些方法
	var domUtils = {
		//获得聚合字段和维字段的关系，也及时dql里的by信息
		getRela : function(fName, dName) {
			for (var i=0; i<domInfos.relas.length; i++) {
				var byObj = domInfos.relas[i];
				if (byObj.field == fName && byObj.dim == dName) return byObj;
			}
		},
		//获得条件
		getWhere : function(name) {
			var currDomInfos = domInfos;
			for (var i=0; i<currDomInfos.wheres.length; i++) {
				var byObj = currDomInfos.wheres[i];
				if (byObj.target == name) return byObj;
			}
			var o = {target:name,conf:[],havingConf:[],dimConf:[],where:'',whereDisp:'',having:'',havingDisp:''};
			domInfos.wheres.splice(domInfos.wheres.length, 0, o);
			return o;
		},
		//获得拖拽出来的字段或维
		getSrc : function(name) {
			var currDomInfos = domInfos;
			for (var i=0; i<currDomInfos.srcs.length; i++) {
				if (currDomInfos.srcs[i].name == name) return currDomInfos.srcs[i];
			}
		},
		//删除已选出的字段或维，同时把条件、关联关系删除掉
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
		},
		//改选出字段名称
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
		},
		//删除关联关系
		removeRela : function(f, d) {
			domInfos.relas.remove(domUtils.getRela(f, d));
		},
		//添加关联关系
		addRela : function(f, d, infos, currDomInfos) {
			if (!currDomInfos) currDomInfos = domInfos;
			//alert(infos);
			currDomInfos.relas[currDomInfos.relas.length] = {infos:infos, dim:d, field:f};
		},
		//新增字段或维
		addSrc : function(infos,isDim) {
			var iObj = domUtils.getInfosObj(infos);
			var name = domUtils.generateNewFieldAlias(iObj);
			var pos = domInfos.srcs.length;
			if (isDim) {
				for (var i=0; i<domInfos.srcs.length; i++) {
					if (domInfos.srcs[i].selectType == 'field') {
						pos = i;
						break;
					}
				}
			}
			domInfos.srcs.splice(pos,0,{src:infos,real:infos,dimKey:isDim?11:10,name:name,selectType:isDim?'dim':'field',aggr:iObj.aggr,tAlias:'',errorInfo:''});
			domInfos.wheres.splice(domInfos.wheres.length, 0, {target:name,conf:[],havingConf:[],dimConf:[],where:'',whereDisp:'',having:'',havingDisp:''});
		},
		//得到所有选出的维
		getDims : function(){
			var dims = [];
			for (var i=0; i<domInfos.srcs.length; i++) {
				if (domInfos.srcs[i].selectType == 'dim')
					dims[dims.length] = domInfos.srcs[i];
			}
			return dims;
		},
		//得到所有选出字段
		getFields : function() {
			var dims = [];
			for (var i=0; i<domInfos.srcs.length; i++) {
				if (domInfos.srcs[i].selectType != 'dim')
					dims[dims.length] = domInfos.srcs[i];
			}
			return dims;
		},
		//获得选出字段和维的名称
		getNames : function() {
			var currDomInfos = domInfos;
			var names = new Array();
			for (var i=0; i<currDomInfos.srcs.length; i++) {
				names[i] = currDomInfos.srcs[i].name;
			}
			return names;
		},
		//给字段设置新名称
		setFieldName : function(name, newName) {
			var fDom = domUtils.getField(name);
			var wDom = domUtils.getWhere(name);
			for (var i=0; i<domInfos.relas.length; i++) {
				if (domInfos.relas[i].field == name) {
					domInfos.relas[i].field = newName;
				}
			}
			fDom.name = newName;
			wDom.target = newName;
		},
		/**
		解析广义字段定义串，解析成对象，方便查看各种属性，容易获得不同表达方式
		 * T:表或子表、F:字段、L:层、A:聚合方式，
			T1:T11;T2,F2;T3,F3,L3;T3,F4;T5,F5,L5;T6,F6,L6,A6
			T1@T11.A6(F2.F3#L3.F4.F5#L5.F6)
		*/
		getInfosObj2 : function(info) {
			var obj = infoCache[info];
			if (obj) return obj;
			var s = info.split(split_2);
			obj = {
				str : info
				,dim : ''//最终的维
				,firstTable : ''
				,subTable : ''//子表
				,lastTable : ''
				,lastField : ''
				,lastLevel : ''
				,tables : [] //expNoTableNoAggr
				,tableExps : []
				,exp : ''//广义字段表达式，主表@子表....
				//,exp2 : ''//广义字段表达式，子表....
				,expNoTable : ''
				,expNoTableNoAggr : ''
				,alias1 : ''//针对该广义字段，来自字典的别名，格式和表达式一样
				,alias2 : ''//针对该广义字段，来自词典的别名
				,aggr : ''
				,aggrName : ''
				,subTableAggr : ''//
				,subTableAggrName : ''//
				,dimKey : false// true：维表.主键 ； false：表.外键.主键
				,finalType : '' //aggr==''时，是字段类型、否则计数会导致所有类型转换成数值
			};
			if(s == '' || s == null) return obj;
			var tObj = null;
			var fObj = null;
			var middleExp = '';
			for (var i=0; i<s.length; i++) {
				var ss = s[i].split(split_1);
				if (i == 0) {
					var sss = ss[0].split(":");

					obj.firstTable = sss[0];
					if (obj.tables.indexOf(sss[0]) == -1) {
						obj.tables.push(sss[0]);
						obj.tableExps.push(middleExp);
					}
					//obj.exp = sss[0];
					tObj = mdUtils.getTable(sss[0]);
					var tdn = tObj.dispName;
					if (!tdn) tdn = tObj.name;
					obj.alias1 = tdn;
					obj.alias2 = tdn;
					if (sss.length>1) {
						obj.subTable = sss[1];
						middleExp = "@"+sss[1];
						if (obj.tables.indexOf(sss[1]) == -1) {
							obj.tables.push(sss[1]);
							obj.tableExps.push(middleExp);
						}
						//obj.exp += "@"+sss[1];
						var tObj2 = mdUtils.getTable(sss[1]);
						var tdn2 = tObj2.dispName;
						if (!tdn2) tdn2 = tObj2.name;
						obj.alias1 += "." + tdn2;
						obj.alias2 = tdn2;
					}
				} else {
					fObj = mdUtils.getField(ss[0],ss[1],true);
					if (fObj == null) fObj = mdUtils.getFK(ss[0],ss[1]);
					if (fObj == null) {
						alert(info);
					}
					var dn = fObj.dispName;
					if (!dn) dn = fObj.name;
					if (obj.expNoTableNoAggr != '') obj.expNoTableNoAggr += ".";
					obj.expNoTableNoAggr += ss[1];
					if (ss.length>2&& ss[2] != '') obj.expNoTableNoAggr += "#" + ss[2];
					if (ss.length>3) {
						obj.alias1 = obj.alias1 + "." + dn;
						obj.alias2 = obj.alias2 + "." + dn;
						if (obj.subTable != '') {
							obj.subTableAggrName = getAggrName(ss[3]);
							obj.subTableAggr = ss[3];
						} else {
							obj.aggrName = getAggrName(ss[3]);
							obj.aggr = ss[3];
						}
					} else if (ss.length>2) {
						
						obj.lastLevel = ss[2];
						//obj.exp = obj.exp + "#" + ss[2];
						obj.alias1 = obj.alias1 + "." + ss[2];// + "#" + ss[2];
						obj.alias2 = obj.alias2 + "." + ss[2];
						middleExp += "#"+ss[2];
						var destLevels = mdUtils.getFieldDestLevels(fObj);
						if (destLevels && destLevels.length>0) {
							for (var k=0; k<destLevels.length; k++) {
								if (destLevels[k].name == ss[2]) {
									var sss = destLevels[k].dest.split(".");
									if (obj.tables.indexOf(sss[0]) == -1) {
										obj.tables.push(sss[0]);
										obj.tableExps.push(middleExp);
									}
									break;
								}
							}
						}
					} else {
						if (obj.tables.indexOf(ss[0]) == -1) {
							obj.tables.push(ss[0]);
							obj.tableExps.push(middleExp);
						}
						middleExp += "."+ss[1];
						//obj.exp = obj.exp + "#" + ss[2];
						var dn = fObj.dispName;
						if (!dn) dn = fObj.name;
						obj.alias1 = obj.alias1 + "." + dn;
						obj.alias2 = obj.alias2 + "." + dn;
					}
				}
				if (i == s.length-1) {
					if (ss.length>3) {
						obj.alias1 += getAggrName(ss[3]);
						obj.alias2 += getAggrName(ss[3]);
					}
					
					obj.lastTable = ss[0];
					if (fObj && fObj.dim && fObj.dim != ''){
						var t5 = mdUtils.getDim(fObj.dim).table;
						if (t5 != ss[0] && obj.tables.indexOf(t5) == -1) {
							obj.tables.push(t5);
							obj.tableExps.push(middleExp);
						}
					}
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
											obj.finalType = mdUtils.getField(sss[0],sss[1]).type;
											break;
										}
									}
								}
							}
						}
					}
					if (fObj && fObj.dim) obj.dim = fObj.dim;
				}
			}
			if (s.length == 2 && obj.firstTable == obj.lastTable) { 
				var fObj = mdUtils.getField(obj.lastTable,obj.lastField,true);
				obj.dimKey = fObj && fObj.pk==1;
			}
			if(obj.aggr == 'count' || obj.aggr == 'countd' || obj.subTableAggr == 'count' || obj.subTableAggr == 'countd') obj.finalType = 1;
			obj.expNoTable = obj.expNoTableNoAggr;

			if (obj.aggr != '' || obj.subTableAggr != '') {
				obj.expNoTable = obj.aggr + obj.subTableAggr + "(" + obj.expNoTableNoAggr + ")";
			}
			if (obj.subTable == '') obj.exp = obj.firstTable + "." + obj.expNoTable;
			else  obj.exp = obj.firstTable + "@" + obj.subTable + "." + obj.expNoTable;

			//var idx = obj.expNoTable.indexOf("(");
			//if (idx>0) obj.expNoTableNoAggr = obj.expNoTable.substring(idx+1,obj.expNoTable.length-1);
			//else obj.expNoTableNoAggr = obj.expNoTable;

			infoCache[info] = obj;

			return obj;
		},
		
		/**
		解析广义字段定义串，解析成对象，方便查看各种属性，容易获得不同表达方式
		 * T:表或子表、F:字段、L:层、A:聚合方式，
			T1:T11;T2,F2;T3,F3,L3;T3,F4;T5,F5,L5;T6,F6,L6,A6
			T1@T11.A6(F2.F3#L3.F4.F5#L5.F6)
		*/
		getInfosObj : function(info,calcExp) {
			var obj = infoCache[info];
			if (obj) return obj;
			var s = info.split(split_2);
			obj = {
				str : info
				,dim : ''//最终的维
				,firstTable : ''
				,subTable : ''//子表
				,lastTable : ''
				,lastField : ''
				,lastLevel : ''
				,tables : [] //expNoTableNoAggr
				,tableExps : []
				,exp : ''//广义字段表达式，主表@子表....
				//,exp2 : ''//广义字段表达式，子表....
				,expNoTable : ''
				,expNoTableNoAggr : ''
				,alias1 : ''//针对该广义字段，来自字典的别名，格式和表达式一样
				,alias2 : ''//针对该广义字段，来自词典的别名
				,aggr : ''
				,aggrName : ''
				,subTableAggr : ''//
				,subTableAggrName : ''//
				,dimKey : false// true：维表.主键 ； false：表.外键.主键
				,finalType : '' //aggr==''时，是字段类型、否则计数会导致所有类型转换成数值
			};
			var tObj = null;
			var fObj = null;
			var middleExp = '';
			for (var i=0; i<s.length; i++) {
				var ss = s[i].split(split_1);
				if (i == 0) {
					var sss = ss[0].split(":");

					obj.firstTable = sss[0];
					if (obj.tables.indexOf(sss[0]) == -1) {
						obj.tables.push(sss[0]);
						obj.tableExps.push(middleExp);
					}
					//obj.exp = sss[0];
					tObj = mdUtils.getTable(sss[0]);
					if(tObj == null) {
						alert('失效： check [table/field] '+sss[0]);
						continue;
					}
					var tdn = tObj.dispName;
					if (!tdn) tdn = tObj.name;
					obj.alias1 = tdn;
					obj.alias2 = tdn;
					if (sss.length>1) {
						obj.subTable = sss[1];
						middleExp = "@"+sss[1];
						if (obj.tables.indexOf(sss[1]) == -1) {
							obj.tables.push(sss[1]);
							obj.tableExps.push(middleExp);
						}
						//obj.exp += "@"+sss[1];
						var tObj2 = mdUtils.getTable(sss[1]);
						var tdn2 = tObj2.dispName;
						if (!tdn2) tdn2 = tObj2.name;
						obj.alias1 += "." + tdn2;
						obj.alias2 = tdn2;
					}
				} else {
					fObj = mdUtils.getField(ss[0],ss[1],true);
					if (fObj == null) fObj = mdUtils.getFK(ss[0],ss[1]);
					if (fObj == null) {
						console.error("find field failed ["+ss[0]+"."+ss[1]+"]");
					}
					if (ss.length>3) {
						obj.alias1 += getAggrName(ss[3]);
						obj.alias2 += getAggrName(ss[3]);
						if (obj.subTable != '') {
							obj.subTableAggrName = getAggrName(ss[3]);
							obj.subTableAggr = ss[3];
						} else {
							obj.aggrName = getAggrName(ss[3]);
							obj.aggr = ss[3];
						}
					} else if (ss.length>2) {
						obj.expNoTableNoAggr += "#" + ss[2];
						obj.lastLevel = ss[2];
						//obj.exp = obj.exp + "#" + ss[2];
						obj.alias1 = obj.alias1 + "." + ss[2];// + "#" + ss[2];
						obj.alias2 = obj.alias2 + "." + ss[2];
						middleExp += "#"+ss[2];
						var destLevels = mdUtils.getFieldDestLevels(fObj);
						if (destLevels && destLevels.length>0) {
							for (var k=0; k<destLevels.length; k++) {
								if (destLevels[k].name == ss[2]) {
									var sss = destLevels[k].dest.split(".");
									if (obj.tables.indexOf(sss[0]) == -1) {
										obj.tables.push(sss[0]);
										obj.tableExps.push(middleExp);
									}
									break;
								}
							}
						}
					} else {
						if (obj.tables.indexOf(ss[0]) == -1) {
							obj.tables.push(ss[0]);
							obj.tableExps.push(middleExp);
						}
						middleExp += "."+ss[1];
						if (obj.expNoTableNoAggr != '') obj.expNoTableNoAggr += ".";
						obj.expNoTableNoAggr += ss[1];
						//obj.exp = obj.exp + "#" + ss[2];
						var dn = fObj.dispName;
						if (!dn) dn = fObj.name;
						obj.alias1 = obj.alias1 + "." + dn;
						obj.alias2 = obj.alias2 + "." + dn;
					}
				}
				if (i == s.length-1) {
					obj.lastTable = ss[0];
					if (fObj && fObj.dim && fObj.dim != ''){
						var t5 = mdUtils.getDim(fObj.dim).table;
						if (t5 != ss[0] && obj.tables.indexOf(t5) == -1) {
							obj.tables.push(t5);
							obj.tableExps.push(middleExp);
						}
					}
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
											obj.finalType = mdUtils.getField(sss[0],sss[1]).type;
											break;
										}
									}
								}
							}
						}
					}
					if (fObj && fObj.dim) obj.dim = fObj.dim;
				}
			}
			if (s.length == 2 && obj.firstTable == obj.lastTable) {
				var fObj = mdUtils.getField(obj.lastTable,obj.lastField,true);
				obj.dimKey = fObj && fObj.pk==1;
			}
			if(obj.aggr == 'count' || obj.aggr == 'countd' || obj.subTableAggr == 'count' || obj.subTableAggr == 'countd') obj.finalType = 1;
			obj.expNoTable = obj.expNoTableNoAggr;
			if(calcExp) obj.expNoTable = calcExp;
			if (obj.aggr != '' || obj.subTableAggr != '') {
				obj.expNoTable = obj.aggr + obj.subTableAggr + "(" + obj.expNoTable + ")";
			}
			if (obj.subTable == '') obj.exp = obj.firstTable + "." + obj.expNoTable;
			else  obj.exp = obj.firstTable + "@" + obj.subTable + "." + obj.expNoTable;

			//if () {}
			var idx = obj.expNoTable.indexOf("(");
			if (idx>0 && !calcExp) obj.expNoTableNoAggr = obj.expNoTable.substring(idx+1,obj.expNoTable.length-1);
			else obj.expNoTableNoAggr = obj.expNoTable;
			if(calcExp) obj.expNoTableNoAggr = "("+obj.expNoTableNoAggr + ")";
			infoCache[info] = obj;

			return obj;
		},
		autoSrcs : function(srcs) {
			if (lmd == null) {
				alert("luck of lmd!");
				return srcs;
			}
//			if (lmd.dims.length == 0) {
				//alert("No dim define, maybe lmd has changed or no dql license! ");
				//return srcs;
//			}
			
			var tNames = [];
			//var tAlias = [];
			var autos = [];
			var lastTables = [];
			var lastFields = [];
			var allTables = [];
			for (var i=0; i<srcs.length; i++) {
				var oi = domUtils.getInfosObj(srcs[i]);
				lastTables.push(oi.lastTable);
				lastFields.push(oi.lastField);
				if (allTables.indexOf(oi.firstTable) == -1) allTables.push(oi.firstTable);
			}

			var tIdx = 0;
			var over = 0; 
			while (over < srcs.length) {
				var result = null;
				//var maxi = 0;
				var max = 0;
				for (var i=0; i<allTables.length; i++) {
					var currResult = {
						idxs : []
						,auto : []
					}
					for (var j=0; j<lastTables.length; j++) {
						if (autos[j]) continue;
						var infoss = [];
						domUtils.getFieldInfos(allTables[i], infoss, 0, lastTables[j], lastFields[j], true);
						if (infoss.length > 0) {
							currResult.idxs.push(j);
							currResult.auto.push(infoss[0]);
						}
					}
					if (result == null || max<currResult.idxs.length) {
						result = currResult;
						max = result.idxs.length;
						//maxi = i;
					}
				}
				tIdx++;
				if(currResult.auto.length == 0){
					over++;
					console.log("autoSrc lost 1");
				}
				for (var i=0; i<result.idxs.length; i++) {
					tNames[result.idxs[i]] = "T"+tIdx;
					autos[result.idxs[i]] = result.auto[i];
					over++;
				}
			}
			
			return {"tNames":tNames,"autoSrcs":autos};
		},
		//参考已出现的维名，产生新拖入维的名称，考虑重复
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
		//参考已出现的字段名，产生新拖入字段的名称，考虑重复
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
			//alert(_alias + "--" + infoObj.dim);
			if ((_alias=='编号' || _alias=='序号') && infoObj.dim != '') {
				_alias = mdUtils.getDim(infoObj.dim).dispName;
				//alert(mdUtils.getDim(infoObj.dim).dispName);
				if (!_alias) _alias = mdUtils.getDim(infoObj.dim).name;
			}
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
		},
		//自动更新维和字段的关系
		refreshRela : function() {
			for (var i=domInfos.relas.length-1; i>=0; i--) {
				var src1 = domUtils.getSrc(domInfos.relas[i].field);
				var src2 = domUtils.getSrc(domInfos.relas[i].dim);
				var valid = false;
				if (src1 && src1.selectType == 'field' && src2 && src2.selectType == 'dim') {
					var fObj = domUtils.getInfosObj(src1.real);
					var rObj = domUtils.getInfosObj(domInfos.relas[i].infos);
					if (fObj.firstTable == rObj.firstTable) valid = true;
				}
				if (!valid) domInfos.relas.remove(domInfos.relas[i]);
			}

			for (var i=0; i<domInfos.srcs.length; i++) {
				var dObj = domInfos.srcs[i];
				if (dObj.selectType == 'field') continue;
				var dInfo = domUtils.getInfosObj(dObj.real);
				for (var j=0; j<domInfos.srcs.length; j++) {
					var fObj = domInfos.srcs[j];
					if (fObj.selectType == 'dim') continue;
					if (domUtils.getRela(fObj.name, dObj.name) != null) continue;

					var fInfo = domUtils.getInfosObj(fObj.real);
					var infoss = new Array();
					domUtils.getDimInfos(fInfo.firstTable, dInfo.dim, infoss, 0, false);
					if (infoss.length > 0) {
						//alert(2);
						//var idx = infoss.indexOf(dObj.infos);
						//if (idx==-1) idx = 0;
						domUtils.addRela(fObj.name, dObj.name, infoss[0], domInfos);
					}
				}
			}
		},
		//从parent开始，逐层往下找所有的广义字段
		getFieldInfos : function(parent, fields, levelCount, table, field, containPk, templevelCount, drill) {
			if(!templevelCount) templevelCount = obj.getDetectLevel()
			if (levelCount == templevelCount) return;
			levelCount++;
			var p = domUtils.getInfosObj(parent);
			var subTables = [];

			var targetTable = p.firstTable;
			if (levelCount > 1) {
				var fObj = mdUtils.getField(p.lastTable, p.lastField,true);
				var fkObj = mdUtils.getFK(p.lastTable, p.lastField);
				if (fkObj != null) {
					if (fkObj.fields.length == 1) return;
					targetTable = fkObj.destTable;
				} else {
					var dimObj = mdUtils.getDim(fObj.dim);
					if (dimObj) targetTable = dimObj.table;
					else {
						return;
					}
				}
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
				if (!tObj) continue;
				var fks1 = tObj.fks;
				if(drill){//2019.11.21
					for(var l = 0; l < fks1.length; l++){
						var fkt = fks1[l].destTable;
						if(mdUtils.getTable(fkt).fields.length <= 1){
							fks1 = fks1.slice(0, l).concat(fks1.slice(parseInt(l, 10) + 1));
							l--;
						}
					}
				}
				var fs = tObj.fields.concat(fks1);
				var pks = mdUtils.getTablePKs(t);
				//fks:[{name:'fk_城市',hide:0,destTable:'城市',desc:'',dispName:'fk_城市',format:'',fields:['城市编码']}]}
				for (var i=0; i<fs.length; i++) {
					var fObj = fs[i];
					//alert(fObj.fields);
					var infos = parent + split_2 + t + split_1 + fs[i].name;
					if (fObj.fields) {
						if (fObj.fields.length > 1) {
							subTables.push(infos);
							//console.log("-1--" + infos);
						}
						continue;
					}
					if ((!table) || (table == t && field == fs[i].name)) {
						if (fObj.pk!=1 || containPk && fields.indexOf(infos) < 0)
							fields[fields.length] = infos;
					}

					var dObj = mdUtils.getDim(fObj.dim);
					if (dObj == null) continue;
					if (fObj.pk == 1) {
						if (mdUtils.getDimTable(fObj.dim) != null && pks.length>1) subTables.push(infos);
					} else {
						subTables.push(infos);
					}

					var destLevels = mdUtils.getFieldDestLevels(fObj);
					if (destLevels && destLevels.length>0) {
						for (var k=0; k<fObj.destLevels.length; k++) {
							var dimObj = mdUtils.getDimByTableField(destLevels[k].dest);
							var tf = destLevels[k].dest.split('.');
							var infosk = infos + split_2 + tf[0] + split_1 + tf[1] + split_1 + destLevels[k].name;
							if(drill && mdUtils.getTable(tf[0]).fields.length > 1){
								subTables[subTables.length] = infosk;
								if ((!table) || (table == tf[0] && field == tf[1]) && fields.indexOf(infosk) < 0){
									fields[fields.length] = infosk;
								}
							}
						}
					}

					//if (fObj.destTable && fObj.destTable != '') {

					//}
				}
			}
			//alert(levelCount + "--" + subTables.length + "--" + relations.length);
			for (var i=0; i<subTables.length; i++) {
				domUtils.getFieldInfos(subTables[i], fields, levelCount, table, field,containPk,templevelCount, drill);
			}
		},
		//从parent开始，逐层往下找某个维的所有维字段
		getDimInfos : function(parent, dim, fields, levelCount, first) {
			//console.debug("lmd.dims[i].table : " + parent + " "+dim + " [[[[[[[[[" + obj.getDetectLevel());

			if (levelCount == obj.getDetectLevel()) return;
			levelCount++;
			var p = domUtils.getInfosObj(parent);
			var subTables = [];

			var targetTable = p.firstTable;
			if (levelCount > 1) {
				var dimObj = mdUtils.getDim(mdUtils.getField(p.lastTable, p.lastField).dim);
				if (dimObj == null) return;
				targetTable = dimObj.table;
			}
			var ts = mdUtils.getAnnexTables(targetTable);

			for (var j=0; j<ts.length; j++) {
				var t = ts[j].name;
				var tObj = mdUtils.getTable(t,true);
				if (!tObj)continue;
				var fs = tObj.fields.concat(tObj.fks);
				var pks = mdUtils.getTablePKs(t);
				for (var i=0; i<fs.length; i++) {
					var fObj = fs[i];
					//alert(fObj.fields);
					if (fObj.fields) {
						if (fObj.fields.length > 1) {
							var infos = parent + split_2 + t + split_1 + fs[i].name;
							subTables.push(infos);
							//console.log("-1--" + infos);
						}
						continue;
					}
					if (fObj.dim==''||!fObj.dim) continue;
					var dObj = mdUtils.getDim(fObj.dim);
					if (levelCount==1) {
						var infos = parent + split_2 + t + split_1 + fs[i].name;
						if (fObj.dim == dim) {
							fields[fields.length] = infos;
							//alert(fields.length);
							if (first) return;
						}
						//console.log(mdUtils.getDimTable(fObj.dim) + "-1--" + infos);
						if ((fObj.pk==1 && pks.length==1) || mdUtils.getDimTable(fObj.dim) == null ) {
						} else subTables.push(infos);
					} else {
						if ((fObj.pk==1 && pks.length==1) || mdUtils.getDimTable(fObj.dim) == null) continue;
						var infos = parent + split_2 + t + split_1 + fs[i].name;
						//alert(infos);
						if (fObj.dim == dim) {
							fields[fields.length] = infos;
							//alert(fields.length);
							if (first) return;
						}
						subTables.push(infos);
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
				domUtils.getDimInfos(subTables[i], dim, fields, levelCount, first);
			}
		},
		
		/*
	{
		fields : [
			{
				tableAlias:'t1'
				,subTable:''
				,aggr:'sum'
				,field:'f1'
				,alias:'a1'
			}
			,
			{
				tableAlias:'t2'
				,subTable:''
				,aggr:'count'
				,field:'f2'
				,alias:'a2'
			}
		]
		, dims : [
			{
				dim : 'dim1'
				,alias:'a3'
			}
		]
		,dimWhere : ''
		, tables : [
			{
				table : 't1'
				,alias : 'a4'
				,bys : [
					'byf1'
				]
				,where : 'where2'
				,joinType : ''
			}
			,{
				table : 't2'
				,alias : 'a5'
				,bys : [
					'byf2'
				]
				,where : 'where2'
				,joinType : ' join '
			}
		]
		, having : 'having1'
	}
		*/
		//根据界面配置对象生成DQL语句
		generateDql : function(currDomInfos, silence, top) {
			var sgts = {fields:[],dims:[],dimWhere:'',tables:[],having:''};
			dqlFields = [];
			if (currDomInfos.srcs.length == 0) {
				if (!silence) alert(resources.guide.js193);
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
			var allFields = [];
			var fields = domUtils.getFields();
			var dims = domUtils.getDims();
			if (fields.length == 0) {
				if (!silence) alert(resources.guide.js194);
				return false;
			}

			for (var i=0; i<fields.length; i++) {
				var fObji = fields[i];

				var fatherDim = "";
				if (fObji.aggr == '' && dims.length>0) {
					for (var j=0; j<currDomInfos.relas.length; j++){
						var infoObjj = domUtils.getInfosObj(currDomInfos.relas[j].infos);
						if (fObji.real.indexOf(currDomInfos.relas[j].infos)==0) {
							fatherDim = currDomInfos.relas.dim;
							break;
						}
					}

					if (fatherDim == "") {
						if (!silence) alert(resources.guide.js195);
						return false;
					}
					fObji.tAlias = "";
					continue;
				}

				//var wDomi = domUtils.getWhere(fObji.name, currDomInfos);
				var ii = domUtils.getInfosObj(fObji.real);
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
						var ij = domUtils.getInfosObj(fObjj.real);
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
				var ii = domUtils.getInfosObj(fObji.real);
				if (fObji.aggr == '' && dims.length>0) {
					for (var j=0; j<fields.length; j++) {
						var fObjj = fields[j];
						if (fObjj.tAlias == '') continue;
						var ij = domUtils.getInfosObj(fObjj.real);
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
							alert(resources.guide.js196.replaceAll('{0}',currDomInfos.wheres[i].target));
							return false;
						}
						tWhere = currDomInfos.wheres[i].where;
					}
				}
			}

			//var currDomInfos = domInfos;
			var on='',from='',having='',orderby='';

			var tableAnnexs = new Array();
			var tableAliass = new Array();
			var joins = new Array();
			var tableWheres = new Array();
			var outerTables = new Array();
			var outerTableExps = new Array();
			var tableBys = new Array();
			var attrs = new Array();
			var orderBys = new Array();
			var orderFields = new Array();
			var resultFields = new Array();
			var having = "";
			var dims2 = new Array();
			var dimWheres = "";

			var hasOn = dims.length>0;
			
			//var sgts = {fields:[],dims:[],dimWhere:'',tables:[],having:''};

			for (var i=0; i<fields.length; i++) {
				var fDom = fields[i];

				if (!isNaN(fDom.name[0])) {
					if (!silence) alert(resources.guide.js197.replaceAll("{0}",fDom.name));
					return false;
				}
				var iObj = domUtils.getInfosObj(fDom.real);
				dqlFields.push({name:fDom.name,dataType:iObj.finalType,edit:defaultEdit.autoEditStyle(iObj.finalType,'',iObj.dim)});
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

				if (wDom && (wDom.conf.length>0 || wDom.where != '')) {
					var where = whereUtils.getExp(wDom.conf, fDom.tAlias+".", 1);
					if (where == '') {
						if (wDom.where.indexOf("w,w")>=0) where = getSqlWhere(wDom.where, false).replaceAll(iObj.firstTable+".",fDom.tAlias+".");
						else if (wDom.where != '') where = wDom.where;
					}

					if (tableWheres[tidx].indexOf(where) == -1) tableWheres[tidx][tableWheres[tidx].length] = where;
				}
				if (dims.length>0 && wDom && wDom.havingConf.length>0) {
					var where = whereUtils.getExp(wDom.havingConf, fDom.tAlias+".", 2);
					if (having != '') having += ' AND ';
					having += '(' + where + ')';
				}
				
				sgts.fields.push({
					tableAlias:tableAliass[tidx]
					,subTable:iObj.subTable
					,aggr:iObj.aggr
					,field:iObj.expNoTableNoAggr
					,alias:fDom.name
				});

			}

			for (var i=0; i<dims.length; i++) {
				var dDom = dims[i];
				var iObj = domUtils.getInfosObj(dDom.real);
				dqlFields.push({name:dDom.name,dataType:iObj.finalType,edit:defaultEdit.autoEditStyle(iObj.finalType,'',iObj.dim)});
				dims2[dims2.length] = dDom.dim + " " + dDom.name;
				for (var j=0; j<fields.length; j++) {
					var fDom = fields[j];
					if (fDom.aggr == '') continue;
					var rela = domUtils.getRela(fDom.name, dDom.name,currDomInfos);
					if (!rela) {
						alert(resources.guide.js198);
						return;
					}
					var iObj = domUtils.getInfosObj(rela.infos);
					var tidx = tableAliass.indexOf(fDom.tAlias);
					if (tableBys[tidx]==null) tableBys[tidx] = [];
					var exp = (iObj.subTable!=''?'@'+iObj.subTable+".":'') + iObj.expNoTableNoAggr;
					if (tableBys[tidx].indexOf(exp) == -1)
						tableBys[tidx][tableBys[tidx].length] = exp;
				}

				var wDom = domUtils.getWhere(dDom.name,currDomInfos);
				if (wDom && wDom.dimConf.length>0) {
					var where = whereUtils.getExp(wDom.dimConf,"",3).replaceAll("_dimFieldName_",dDom.name);
					//where = where.replaceAll('_x_', );
					if (dimWheres != '') dimWheres += ' AND ';
					dimWheres += '(' + where + ')';
				}
				if (guideConf.showNullGroup == 'no') {
					if (dimWheres != '') dimWheres += ' AND ';
					dimWheres += '(' + dDom.name + ' is not null)';
				}

				sgts.dims.push({
					dim : dDom.dim
					,alias:dDom.name
				});
				
			}
			sgts.dimWhere = dimWheres;

			for (var i=0; i<dims2.length; i++){
				if (i>0) on += ",";
				on += dims2[i];
			}
			var finalWhere = true;
			var outerUsed = [];
			for (var i=0; i<tableAnnexs.length; i++){
				if (i>0) from += " JOIN ";
				from += tableAnnexs[i] + " " + tableAliass[i];
				var wi = "";
				for (var j=0; j<tableWheres[i].length; j++) {
					if (j>0) wi += " AND ";
					wi += "("+tableWheres[i][j]+")";
				}
				tableAliass[i] + "." + iObj.expNoTable;

				/*
				for (var j=0; j<guideConf.outerCondition.length; j++) {
					var oj = guideConf.outerCondition[j];
					if (oj.table == tableAnnexs[i]) {
						if (outerUsed.indexOf(oj.table) >= 0) break;
						outerUsed.push(oj.table);
						if (wi!='') wi += " AND ";
						wi += "("+oj.exp.replaceAll("${T}",tableAliass[i])+")";
						break;
					}
				}
				for (var j=0; j<guideConf.outerCondition.length; j++) {
					var oj = guideConf.outerCondition[j];
					if (outerUsed.indexOf(oj.table) >= 0) continue;
					var dimObj = mdUtils.getDimByTable(oj.table);
					if (!dimObj) continue;
					var infoss = new Array();
					domUtils.getDimInfos(tableAnnexs[i], dimObj.name, infoss, 0, false);
					if (infoss.length == 0) continue;
					outerUsed.push(oj.table);
					if (wi!='') wi += " AND ";
					wi += "("+oj.exp.replaceAll("${T}",tableAliass[i]+"."+domUtils.getInfosObj(infoss[0]).expNoTable)+")";
				}
				*/
				
				if (wi != "") from += " WHERE " + wi;
				var bi = "";
				if (tableBys[i] != null) {
					for (var j=0; j<tableBys[i].length; j++) {
						if (j>0) bi += ",";
						bi += tableBys[i][j];
					}
					if (bi != "") from += " BY " + bi;
				}

				sgts.tables.push({
					table : tableAnnexs[i]
					,alias : tableAliass[i]
					,bys : bi!=''?bi.split(","):[]
					,where : wi
					,joinType : 'JOIN'
				});
				
			}
			sgts.having = having;
			
			var dql3 = null;
			$.ajax({
				type: 'POST',
				async : false,
				url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
				data: {action:2,oper:'getDql',dataSource:guideConf.dataSource,dqlSegments:JSON.stringify(sgts).replaceAll('"',"<d_q>"),filter:guideConf.filter},
				success: function(data){
					if (data.indexOf('error') == 0) {
						alert(data.replaceAll('error:',''));
						return;
					}
					dql3 = data;
				}
			});
			
			return dql3;
		}

	}
	//操作qyx，界面配置对象的一些方法
	obj.confUtils = domUtils;

	var split_1 = ',,,,';
	var split_2 = ';;;;';
	var infoCache = {}
	obj.detectLevel = 4;
	obj.getDetectLevel = function() {
		if (obj.detectLevel == 0) obj.detectLevel = 4;
		return obj.detectLevel;
	}
	//var dqlFields = [];
	
	return obj;
}

//
/**
	编辑风格
	[
		{
			name:'_datetime'	//编辑风格名称
			,type:3						//1文本、3日历、6下拉树
			,calendarType:1  	//calendarType定义在Calendar.java中，TYPE_DATETIME=1、TYPE_DATE=2、TYPE_TIME=3、TYPE_MONTH=4
			,data:[]         	//下拉树json对象
		}
	]
*/
function EditStyle() {
	var obj = new Object();
	obj.editStyles = 	[];
	var editStyles = obj.editStyles;
	editStyles.push({name:'_txt',type:1});
	editStyles.push({name:'_calendar',type:3,calendarType:1});//calendarType定义在Calendar.java中，TYPE_DATETIME=1、TYPE_DATE=2、TYPE_TIME=3、TYPE_MONTH=4
	editStyles.push({name:'_datetime',type:3,calendarType:1});
	editStyles.push({name:'_date',type:3,calendarType:2});//年月日
	editStyles.push({name:'_time',type:3,calendarType:3});
	editStyles.push({name:'_yearmonth',type:3,calendarType:4});//年月
	editStyles.push({name:'_year',type:3,calendarType:5});//年
	editStyles.push({name:'_month',type:3,calendarType:6});//月
	editStyles.push({name:'_day',type:3,calendarType:7});//日
	editStyles.push({name:'_nyrsfm',type:3,calendarType:8});//年月日时分秒
	
	obj.autoEditStyle = function(srcType,aggr,dim) {
		
		if (aggr) {
			if (aggr == 'sum' || aggr == 'count' || aggr == 'countd' || aggr == 'dcount' || aggr == 'avg') srcType = 1 
		} 
		if (srcType == 3) return "_datetime";
		else if (srcType == 4) return "_time";
		else if (srcType == 5) return "_nyrsfm";
		if (dim) return dim;
		return "";
	}

	var obj2 = {
		//通过名称获得编辑风格对象
		getEditStyle : function(name){ //通过名字获得编辑风格
			if (!name) return null;
			for (var i=0; i<editStyles.length; i++) {
				var es = editStyles[i];
				if (es.name == name) return es;
			}
			return null;
		},
		//通过显示值获得真实值
		getEditStyleValueByDisp : function(name,disp) {
			if (name == '') return disp;
			var edit = obj2.getEditStyle(name);
			if (!edit) return disp;
			if (edit.data && edit.data.length>0) {
				for (var i=0; i<edit.data.length; i++) {
					if (edit.data[i].name == disp) return edit.data[i].real;
				}
			}
			return disp;
		},
		//生成维rpx里需要的显示值表达式
		getEditExp4Rpx : function(edit,isRealNum) {
			//alert(edit);
			edit = obj2.getEditStyle(edit);
			if (!(edit && edit.data)) return "";
			var codes='',disps='';
			//map(list(0,2),list("男","女"));
			var codeNum=isRealNum?true:false,dispNum=true;
			for(var i=0; i<edit.data.length; i++) {
				if (edit.data[i].dim != edit.name) continue;
				if (codes != '') {
					codes += ",";
					disps += ",";
				}
				if (codeNum && isNaN(edit.data[i].real)) codeNum = false;
				if (dispNum && isNaN(edit.data[i].name)) dispNum = false;
				codes += edit.data[i].real;
				disps += edit.data[i].name;
			}
			if (codes == '') return "";
			//alert(codes);
			return "map(list("+(codeNum?codes:("'"+codes.replaceAll(",","','")+"'"))+"),list("+(dispNum?disps:("'"+disps.replaceAll(",","','")+"'"))+"))";
		},
		//获得“有下拉数据的编辑风格名称”的数组
		getTreeEditStyles : function() {
			var eds = [];
			for (var z=0; z<editStyles.length; z++)
			{
				if (editStyles[z].data && editStyles[z].data.length>0)
				{
					eds.push(editStyles[z].name);
				}
			}
			return eds;
		},
		//根据编辑风格给编辑框注册点击事件，触发下拉框、下拉日历
		registerEsEvent : function(es, doms, exp, useTreeDisp){
			var esIdx = -1;
			for (var i=0; i<editStyles.length; i++) {
				if (editStyles[i].name == es) {
					es = editStyles[i];
					esIdx = i;
					break;
				}
			}
			if (esIdx == -1 && editStyles.length>0) {
				es = editStyles[0];
				esIdx = 0;
			}
			if (esIdx == -1) return;
			var modifyEvent = function(){
				//var trs = $('#whereTable tr');
				//if (doms.parents('tr')[0] == trs[trs.length-1]) addNewWhere();
			};
			//doms.find('._VALUE_').change(modifyEvent).keyup(modifyEvent);
			//exp = '?1年?2月?3日--?4时?5分?6秒';
			exp = '';
			if (exp && exp != '') {
				var y = exp.indexOf('?1');
				var m1 = exp.indexOf('?2');
				var d = exp.indexOf('?3');
				var h = exp.indexOf('?4');
				var m2 = exp.indexOf('?5');
				var s = exp.indexOf('?6');
				//假定年月日与时分秒没有掺杂在一起。
				var df='yy-mm-dd', tf='', sep='', pos1=0, pos2=0;
				if (h >= 0 || m2 >= 0 || s >= 0) {
					tf = 'hh:mm:ss';
				}
				/*
				if (h >= 0 || m2 >= 0 || s >= 0) {
					if (y < h) {
						pos1 = y<m1?(m1<d?d:m1):(y<d?d:y);
						pos2 = h<m2?(h<s?h:s):(m2<s?m2:s);
						df = exp.substring(0, pos1 + 2);
						tf = exp.substring(pos2);
						sep = exp.substring(pos1+2, pos2);
					} else {
						pos1 = h<m2?(m2<s?s:m2):(h<s?s:h);
						pos2 = y<m1?(y<d?y:d):(m1<d?m1:d);
						tf = exp.substring(0, pos1 + 2);
						df = exp.substring(pos2);
						sep = exp.substring(pos1+2, pos2);
					}
				} else {
					df = exp;
				}
				df = df.replace('?1','yy').replace('?2','MM').replace('?3','dd')
				tf = tf.replace('?4','hh').replace('?5','mm').replace('?6','ss');
				*/
				if (tf != '') {
					doms.find('._VALUE_').datetimepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat : df,
						timeFormat : tf,
						showTime: tf,
						showSecond : true,
						separator: sep,
						hourGrid: 4,
						minuteGrid: 10,
						secondGrid: 10
						,onClose:function(s,obj){
							myblur();
						}
					});
				} else {
					doms.find('._VALUE_').datepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat : df
						,onClose:function(s,obj){
							myblur();
						}
					});
				}
				return;
			}
			if (es.type == 1) {
			} else if (es.type == 2) {
			} else if (es.type == 3) {
				if (es.dateFormat && es.timeFormat) {
					doms.find('._VALUE_').datetimepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat : es.dateFormat,
						timeFormat : es.timeFormat,
						showSecond: true,
						hourGrid: 4,
						minuteGrid: 10,
						secondGrid: 10
						,onClose:function(s,obj){
							myblur();
						}
					});
				} else if (es.dateFormat) {
					doms.find('._VALUE_').datepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat : es.dateFormat
						,onClose:function(s,obj){
							myblur();
						}
					});
				} else if (es.timeFormat) {
					doms.find('._VALUE_').timepicker({
						timeFormat : es.timeFormat,
						showSecond: true,
						hourGrid: 4,
						minuteGrid: 10,
						secondGrid: 10
						,onClose:function(s,obj){
							myblur();
						}
					});
				} else  if (es.calendarType == 1 || es.calendarType == 8) {
					doms.find('._VALUE_').datetimepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat : es.dateFormat?es.dateFormat:'yy-mm-dd',
						timeFormat : es.timeFormat?es.timeFormat:(es.calendarType==8?'hh:mm:ss':'hh:mm'),
						showSecond: true,
						hourGrid: 4,
						minuteGrid: 10,
						secondGrid: 10
					});
				} else if (es.calendarType == 3) {
					doms.find('._VALUE_').timepicker({
						timeFormat : es.timeFormat?es.timeFormat:'hh:mm:ss',
						showSecond: true,
						hourGrid: 4,
						minuteGrid: 10,
						secondGrid: 10
					});
				} else {
					doms.find('._VALUE_').datepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat : es.dateFormat?es.dateFormat:(es.calendarType==2?'yy-mm-dd':(es.calendarType==4?'yy-mm':(es.calendarType==5?'yy':(es.calendarType==6?'mm':'dd'))))
						,onClose:function(s,obj){
							myblur();
						}
					});
				}
			} else if (es.type == 4) {
				doms.find('input[type="radio"]').click(function(){
					var curr = this.value;
					doms.find('._VALUE_').val(curr);
					doms.find('input[type="radio"]').each(function(){
						if (this.value != curr) this.checked = false; 
					});
				});
				doms.find('._VALUE_').change(function(){
					var curr = this.value;
					doms.find('input[type="radio"]').each(function(){
						this.checked = (this.value == curr); 
					});
				})
			} else if (es.type == 5) {
				doms.find('input[type="checkbox"]').click(function(){
					var vs = '';
					doms.find('input[type="checkbox"]').each(function(){
						if (this.checked) {
							if (vs != '') vs += ',';
							vs += this.value;
						}
					});
					doms.find('._VALUE_').val(vs);
				});
				doms.find('._VALUE_').change(function(){
					var curr = this.value.split(',');
					doms.find('input[type="checkbox"]').each(function(){
						this.checked = (curr.indexOf(this.value)>=0); 
					});
				})
			} else if (es.type == 6) {
				var div = $("#_es_tree_div_" + esIdx);
				//div.remove();
				if (div.length==0) {
					div = $("<div style='position:absolute;display:none;'><div style='overflow-y:auto;overflow-x:auto;background-color:#F8F8F8;width:auto;max-width:300px;height:300px;' id='_es_tree_div_"+esIdx+"'></div></div>");
					$('body').append(div);
				}
				
				var text = doms.find('._VALUE_');
				text.powerFloat({
					target : $("#_es_tree_div_" + esIdx).parent()
					,eventType:'click'
					,zIndex:50000
					,width:'auto'
					,hideCall:function(){
						
					}
					,showCall:function(){
						$("#_es_tree_div_" + esIdx).html('');
						var tree = $("<div class='ztree' style='padding: 10px 20px 0 10px; height: 280px;background-color:#F8F8F8;width:auto;' id='_es_tree_"+esIdx+"'></div>");
						$("#_es_tree_div_" + esIdx).append(tree);
						var data = [];
						var pids = [];
						if (es.dataScope && es.dataScope.length>0)
						{
							
							for (var m=0; m<es.data.length; m++)
							{
								if (es.dataScope.indexOf(es.data[m].real)>=0)
								{
									data.push(es.data[m]);
									pids.push(es.data[m].pId);
								}
							}
							while (pids.length>0)
							{
								var currPids = [];
								for (var m=0; m<es.data.length; m++)
								{
									if (pids.indexOf(es.data[m].id)>=0)
									{
										data.push(es.data[m]);
										currPids.push(es.data[m].pId);
									}
								}
								pids = currPids;
							}
						} else data = es.data;
						$.fn.zTree.init(tree, {
							data: {
								simpleData: {
									enable: true
								}
							}
							,check: {
								enable: true
							}
							,callback: {
								onCheck: function(){
									var nodes = treeObj.getCheckedNodes(true);
									var values = '';
									var disps = '';
									for (var i=0; i<nodes.length; i++) {
										if (nodes[i].dim != es.name) continue;
										if (values.length>0) {
											values += ',';
											disps += ',';
										}
										values += useTreeDisp?nodes[i].name:nodes[i].real;
										disps += nodes[i].name;
									}
									text.val(values);
									text.change();
									text.attr('disp',disps);
									//alert(1);
								}
							}

						}, data);

						treeObj = $.fn.zTree.getZTreeObj("_es_tree_" + esIdx);
						treeObj.checkAllNodes(false);
						var values = text.val().split(',');
						//values = [2];
						var nodes = treeObj.getNodesByFilter(function(node){
							return (node.dim == es.name && values.indexOf(useTreeDisp?node.name:node.real)>=0);
						});
						for (var i=0; i<nodes.length; i++) {
							treeObj.checkNode(nodes[i],true,true,false);
							var parent = nodes[i].getParentNode();
							while(parent) {
								treeObj.expandNode(parent,true,false,false,false);
								parent = parent.getParentNode();
							}
						}
					}
				}).click(function(){
					return;
					var curr = this;

					var div = $("#_es_tree_div_" + esIdx);
					var offset = $(this).offset();
					//if(div.data('curr') && div.data('curr')[0] == this) alert(true);
					div.data('curr', $(this));
					if (div.css('display') != 'none') return;
					es.treeObj.cancelSelectedNode();
					//alert($(this).attr('selectId'));
					es.treeObj.selectNode(es.treeObj.getNodeByTId($(this).attr('selectId')));
					div.css({left:offset.left + "px", top:offset.top + $(this).outerHeight() + 2 + "px"}).slideDown();
					onBodyDown = function(event){
						//alert(1);
						if (!(event.target == curr || $(event.target).parents("#_es_tree_div_" + es.name).length>0)) {
							div.slideUp();
							$("body").unbind("mousedown", onBodyDown);
						}
					}
					
					$("body").bind("mousedown", onBodyDown);
				});
			}
		}
	}
	$.extend( obj, obj2 );
	return obj;
}
var defaultEdit = new EditStyle();
editStyles = defaultEdit.editStyles;


function Olap(){
	var obj = new Object();
	obj.conf = null;
	var rqAnalyse = obj.conf;
	obj.setConfStr = function(str) {
		str = str.replaceAll("<d_q>",'"').replaceAll("\r\n",'').replaceAll("\n",'');
		var a = null;
		try{
			a = eval("("+ str.replaceAll("<d_q>",'"').replaceAll("\r\n",'').replaceAll("\n",'')+")");
		}catch(e){
			alert('读取有误：'+str);
		}
		for (var i=0; i<a.dataSets.length; i++) {
			var dsi = a.dataSets[i];
			dsi.ql = dsi.ql.replaceAll("<d__q>",'"').replaceAll('<_n_>',"\n").replaceAll('<_t_>',"\t");
			dsi.dfxParams = dsi.dfxParams.replaceAll("<d__q>",'"');
			dsi.dfxScript = dsi.dfxScript.replaceAll("<d__q>",'"').replaceAll('<_n_>',"\n").replaceAll('<_t_>',"\t");
			if (dsi.fields) {
				for (var j=0; j<dsi.fields.length; j++) {
					var fj = dsi.fields[j];
					if (fj.exp) fj.exp = fj.exp.replaceAll("<d__q>",'"');
				}
			}
			if(dsi.type == 6 || dsi.type == 7) {
				var calcFields = dsi.calcFields;
				if(calcFields){
					setcf:for(var ci = 0; ci < calcFields.length; ci++){
						for(var ti = 0; ti < lmd.tables.length; ti++){
							var t = lmd.tables[ti];
							if(t.name == calcFields[ci].tname){
								//检查是否已有字段、同样是lmd数据集是否已经设置过
								for(var tf = 0; tf < t.fields.length ; tf++){
									if(t.fields[tf].name == calcFields[ci].field.name) continue setcf;
								}
								t.fields.push(calcFields[ci].field);
							}
						}
					}
				}
				dsi.calcFields = [];
			}
		}
		for (var i=0; i<a.rpxs.length; i++){
			a.rpxs[i]._firstOpen = true;
		}
		
		rqAnalyse = a;
		obj.conf = a;
		
		//问题代码2020.1.17
		//obj.layout = a.layout;
		return eval("("+ str.replaceAll("<d_q>",'"').replaceAll("\r\n",'').replaceAll("\n",'')+")").layout;
	}
	obj.setConf = function(c) {
		rqAnalyse = c;
		obj.conf = c;
	}
	obj.getConfStr = function(layout_arg,dbdMobileFrame,dwps, sysparams) {
		var layout = {
				params : aly.params,
				paramNames : aly.paramNames,
				areas : controlUtil.areas,
				divInfos : divTableControl.divInfos,
				mergeCellIds : divTableControl.mergeCellIds,
				dsWhere : dwps,
				sysparams: sysparams,
				mainWidth : $('.main').css('width'),
				mainHeight : $('.main').css('height')
		}
		if(cleanMode){
			layout.cleanMode = cleanMode;
		}
		var cw = getWidths();
		var rh = getHeights();
		layout.divWHs = {'cw':cw,'rh':rh};
		if(layout_arg) layout = layout_arg;
		var a = JSON.parse(JSON.stringify(rqAnalyse));
		for (var i=0; i<a.dataSets.length; i++) {
			var dsi = a.dataSets[i];
			dsi.ql = dsi.ql.replaceAll('"',"<d__q>").replaceAll("\n",'<_n_>').replaceAll("\t",'<_t_>');
			dsi.dfxParams = dsi.dfxParams.replaceAll('"',"<d__q>");
			dsi.dfxScript = dsi.dfxScript.replaceAll('"',"<d__q>").replaceAll("\n",'<_n_>').replaceAll("\t",'<_t_>');
			if (dsi.fields) {
				for (var j=0; j<dsi.fields.length; j++) {
					var fj = dsi.fields[j];
					if (fj.exp) fj.exp = fj.exp.replaceAll('"',"<d__q>");
				}
			}
			//计算字段的保存
			a.dataSets[i].calcFields = [];
			if(dsi.type == 6 || dsi.type == 7) {
				var l = lmd.lmd == null ? lmd : lmd.lmd;
				for(var ti = 0; ti < l.tables.length; ti++){
					var t = l.tables[ti];
					for(var fi = 0; fi < t.fields.length; fi++){
						var f = t.fields[fi];
						if(f.exp && f.exp.length > 0){
							//是计算字段
							//检查是否已有字段、同样是lmd数据集是否已经设置过
							for(var tf = 0; tf < a.dataSets[i].calcFields.length ; tf++){
								if(a.dataSets[i].calcFields[tf].field.name == f.name) {
									continue;
								}
							}
							a.dataSets[i].calcFields.push({tname:t.name,field:f});
						}
					}
				}
			}
		}
		//dashboard
		if(dbdMobileFrame){
			layout.mobileRpxOrder = getMobileRpxOrder(dbdMobileFrame);
		}
		a.layout = layout;
		a.currRpx = null;
		
		
		return JSON.stringify(a).replaceAll('"','<d_q>');
	}
	
	obj.server = function(data,callback) {
		$.ajax({
			type: 'POST',
			async : false,
			url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
			data: data,
			success: function(data){
				callback(data);
			}
		});
	}
	
	//数据集相关的方法
	obj.dataSetUtils = {
		//检查数据集信息是否完整
		checkDataSet : function(dataSet) {
			var ds = obj.dataSetUtils.getDataSet(dataSet);
			ds._status = '';
			if (ds.type == 2) {
				if (ds.dataSource == '') ds._status = resources.guide.js199;
				if (ds.ql == '') ds._status = resources.guide.js200;
			} else if (ds.type == 3) {
				if (ds.dfxFile == '') ds._status = resources.guide.js201;
			} else if (ds.type == 4) {
				if (ds.dfxScript == '') ds._status = resources.guide.js202;
			} else if (ds.type == 5) {
				if (ds.inputFiles == '') ds._status = resources.guide.js203;
			} else if (ds.type == 6) {
				if (ds.dataSource == '') ds._status = resources.guide.js204;
				if (ds.fixedTable == '') ds._status = resources.guide.js205;
			} else if (ds.type == 7) {
				if (ds.sqlId == '') ds._status = resources.guide.js200;
			} else {
				ds._status = resources.guide.js206;
			}
		}
		//通过名字获得数据集
		,getDataSet : function(name){
			for (var i=0; i<rqAnalyse.dataSets.length; i++) {
				if (rqAnalyse.dataSets[i].name == name) return rqAnalyse.dataSets[i];
			}
		}
		//获得数据集字段
		,getDataSetField : function(dataSet, field) {		
			for (var i=0; i<dataSet.fields.length; i++) {
				if (dataSet.fields[i].name == field) return dataSet.fields[i];
			}
		}
	}
	var aly = obj.dataSetUtils;

	//报表相关的方法
	obj.rpxUtils = {
		//f1是否有引用了f2字段，间接引用
		isReferField : function(f1,f2) {
		}
		//通过数据集字段定义，初始化为报表可用的字段
		,initRpxFields : function(dataSetFields) {
			var items = [];
			for (var i=0; i<dataSetFields.length; i++) {
				items.push(obj.rpxUtils.newRpxField(dataSetFields[i]));
			}
			return items;
		}
		//通过数据集字段定义，初始化为报表可用的字段
		,newRpxField : function(dataSetField){
			return {
				name : dataSetField.name
				,src:dataSetField.name
				,dataType:dataSetField.dataType
				,srcName:dataSetField.name
				,srcEdit:dataSetField.edit//编辑风格
				,aggr:dataSetField.dataType==1?'sum':'count'
				,use:1
				,order:0
				,groups:null//[lefts,tops里的分组，空分组表示整体聚合]/null表示随分组自动聚合
				,analyse:{//指标字段
					analyseName:''//'占比/排名/比上期/比同期'
					,field:''//'被分析的测度字段'
					,scopeGroups:[]//[空则表示针对全部]
				}
				,macroName:''
				,where:{conf:[]}
				,having:{conf:[]}
				,format:''
				,_finalType:''
				,_parentType:''//'top/left/field'
				,_fieldType:''//'group/detail/aggr/analyse'
				,_status:''//'为空表示正确，不为空是失效的具体信息'
			};
		}
		//DQL表类型的数据集，通过界面拖拽的分组、明细字段信息，生成dql，查询结果将作为报表的数据集
		,getDqlSegments : function(conf,params,dsWhere) {
			var rd = rqAnalyse;
			if (!conf) conf = obj.rpxUtils.getCurrRpx();
			var paramsFields = new Array();
			
			if(params && params.length > 0){
				for(var p = 0; p < params.length; p++){
					var paramItem = params[p].item;
					paramsFields.push(paramItem);
				}
			}
			var sgts = {fields:[],dims:[],dimWhere:'',tables:[],having:''};
			
			var dims = [];
			var dimNames = [];
			var bys = [];
			var dimWhere = '';
			var tableWhere = '';
			var fields = [];
			var fieldNames = [];
			var recordedFields = [];
			//参数加入到表中
			var tops = conf.tops.slice();
			var lefts = conf.lefts.slice();
			var fields = conf.fields.slice();
			var addparamToTop = null;
			var addparamToLeft = null;
			var addparamToField = null;
			var pushedItemNames = new Array();
			if(paramsFields.length > 0){
				if(tops.length != 0){
					addparamToTop = one_t_check_push(tops,paramsFields);
					pushedItemNames = pushedItemNames.concat(addparamToTop);
				}
				if(lefts.length != 0){
					addparamToLeft = one_t_check_push(lefts,paramsFields);
					pushedItemNames = pushedItemNames.concat(addparamToLeft);
				}
				if(fields.length != 0){
					addparamToField = one_t_check_push(fields,paramsFields);
					pushedItemNames = pushedItemNames.concat(addparamToField);
				}
			}
			
			if (fields.length==0) {
				for (var i=0; i<tops.length; i++) {
					var jObj = dqlQuery.confUtils.getInfosObj(tops[i].src);
					var tj = getItemByAttr(sgts.tables,jObj.firstTable,"table");
					if (tj == null) {
						tj = {table :jObj.firstTable,alias : 'T'+(sgts.tables.length+1),bys : [],where : '',joinType : 'JOIN'};
						sgts.tables.push(tj);
					}
					if (sgts.tables.length>1) {
						//conf.tops[i]._status = "只有来自不同表的维字段，不能拼出正确dql，请拖拽一些测度字段到数据区";
						alert(resources.guide.js208);
						return null;
					}
					var expNoTableNoAggr = jObj.expNoTableNoAggr;
					if(tops.calc) expNoTableNoAggr = tops[i].calc;
					tj.bys.push(expNoTableNoAggr);
				}

				for (var i=0; i<lefts.length; i++) {
					var jObj = dqlQuery.confUtils.getInfosObj(lefts[i].src);
					var tj = getItemByAttr(sgts.tables,jObj.firstTable,"table");
					if (tj == null) {
						tj = {table :jObj.firstTable,alias : 'T'+(sgts.tables.length+1),bys : [],where : '',joinType : 'JOIN'};
						sgts.tables.push(tj);
					}
					if (sgts.tables.length>1) {
						//conf.lefts[i]._status = "来自不同表的维字段，不能拼出正确dql，请拖拽一些测度字段到数据区";
						alert(resources.guide.js208);
						//alert("can not dql error 2");
						return null;
					}
					var expNoTableNoAggr = jObj.expNoTableNoAggr;
					if(lefts.calc) expNoTableNoAggr = lefts[i].calc;
					tj.bys.push(expNoTableNoAggr);
				}
				
			}
			
			for (var i=0; i<tops.length; i++)
			{
				var topi = tops[i];
				recordedFields.push(topi.src);
				if (topi._status != '') {
					alert(topi._status);
					return null;
				}
				
				sgts.dims.push({dim:topi.dim,alias:topi.name});
				
				
				//var iObj = dqlQuery.confUtils.getInfosObj(topi.src);
				//dims.push(iObj.dim);
				//dimNames.push(topi.name);
				//var subTable = iObj.subTable;
				//if (subTable != '') subTable = "@"+subTable;
				if (topi.relas.length>0) {
					for (var j=0; j<topi.relas.length; j++) {
						var jObj = dqlQuery.confUtils.getInfosObj(topi.relas[j]);
						var tj = getItemByAttr(sgts.tables,jObj.firstTable,"table");
						if (tj == null) {
							tj = {table :jObj.firstTable,alias : 'T'+(sgts.tables.length+1),bys : [],where : '',joinType : 'JOIN'};
							sgts.tables.push(tj);
						}
						var expNoTableNoAggr = jObj.expNoTableNoAggr;
						if(topi.calc) expNoTableNoAggr = topi.calc;
						tj.bys.push(expNoTableNoAggr);
					}
				}
				//bys.push("T1"+subTable+"."+iObj.expNoTableNoAggr);
				if (topi.where.conf != null && topi.where.conf.length>0){
					var where = whereUtils.getExp(topi.where.conf, "", 1).replaceAll("_dimFieldName_",topi.name);
					if (sgts.dimWhere != '') sgts.dimWhere += " AND "
					sgts.dimWhere += "("+where+")"
				}
			}
			for (var i=0; i<lefts.length; i++)
			{
				var lefti = lefts[i];
				recordedFields.push(lefti.src);
				if (lefti._status != '') {
					alert(lefti._status);
					return null;
				}
				sgts.dims.push({dim:lefti.dim,alias:lefti.name});
				
				
				if (lefti.relas.length>0) {
					for (var j=0; j<lefti.relas.length; j++) {
						var jObj = dqlQuery.confUtils.getInfosObj(lefti.relas[j]);
						var tj = getItemByAttr(sgts.tables,jObj.firstTable,"table");
						if (tj == null) {
							tj = {table :jObj.firstTable,alias : 'T'+(sgts.tables.length+1),bys : [],where : '',joinType : 'JOIN'};
							sgts.tables.push(tj);
						}
						var expNoTableNoAggr = jObj.expNoTableNoAggr;
						if(lefti.calc) expNoTableNoAggr = lefti.calc;
						tj.bys.push(expNoTableNoAggr);
					}
				}
				//bys.push("T1"+subTable+"."+iObj.expNoTableNoAggr);
				if(!sgts.dimWhere) sgts.dimWhere = '';
				if (lefti.where.conf != null && lefti.where.conf.length>0){
					var where = whereUtils.getExp(lefti.where.conf, "", 1).replaceAll("_dimFieldName_",lefti.name);
					if (sgts.dimWhere != '') sgts.dimWhere += " AND "
					sgts.dimWhere = "("+where+")"
				}

			}
			var modelRpxAggrDim = null;
			var modelHasAggrField = false;
			if(conf.type == 2){
				for(var o = 0 ; o < conf.fields.length; o++){
					if(conf.fields[o].aggr != null && conf.fields[o].aggr.length > 0){
						modelHasAggrField = true;
						break;
					}
				}
			}
			
			for (var i=0; i<fields.length; i++)
			{
				var fieldi = fields[i];
				recordedFields.push(fieldi.src);
				//模板报表使用
				if(conf.type == 2){
					if (fieldi._status != '') {
						alert(fieldi._status);
						return null;
					}
					if(fieldi.dim != null && fieldi.dim.length > 0 && !modelRpxAggrDim && modelHasAggrField){
						//只有一个dim
						sgts.dims.push({dim:fieldi.dim,alias:fieldi.name});
						modelRpxAggrDim = fieldi.dim;
					}
				}
				
				if (fieldi._fieldType == 'analyse' || fieldi._fieldType == 'newAnalyse') continue;
				if (fieldi._status != '') {
					alert(fieldi._status);
					return null;
				}
				
				var iObj = dqlQuery.confUtils.getInfosObj(fieldi.autoSrc == null ? fieldi.src : fieldi.autoSrc,fieldi.calc);// || fieldi.src != fieldi.autoSrc 
				var tj = getItemByAttr(sgts.tables,iObj.firstTable,"table");
				if (tj == null) {
//						if (sgts.tables.length>0) {
//							alert(resources.guide.js209);
//							return null;
//						}
					//dashboard允许没有左右表头的多表查询，当有params的时候写入dim和by
						tj = {table :iObj.firstTable,alias : 'T'+(sgts.tables.length+1),bys : [],where : '',joinType : 'JOIN'};
						sgts.tables.push(tj);
				}
				var expNoTableNoAggr = iObj.expNoTableNoAggr;
				if(fieldi.calc) expNoTableNoAggr = fieldi.calc;
				sgts.fields.push({tableAlias:tj.alias ,subTable:iObj.subTable ,aggr:fieldi.aggr ,field:expNoTableNoAggr ,alias:fieldi.name});
				if(modelHasAggrField && modelRpxAggrDim == fieldi.dim){
					tj.bys.push(expNoTableNoAggr);
				}
				/*
				var subTable = iObj.subTable;
				if (subTable != '') subTable = "@"+subTable;
				if (fieldi._fieldType == 'group') {
					dims.push(iObj.dim);
					dimNames.push(fieldi.name);
					bys.push("T1"+subTable+"."+iObj.expNoTableNoAggr);
				} else {
					if (fieldi._fieldType == 'aggr') fields.push("T1"+subTable+"."+fieldi.aggr+"("+iObj.expNoTableNoAggr+")");
					else fields.push("T1"+subTable+"."+iObj.expNoTableNoAggr);
					fieldNames.push(fieldi.name);
				}
				*/
				
				if (fieldi.where.conf != null && fieldi.where.conf.length>0){
					var where = whereUtils.getExp(fieldi.where.conf, tj.alias+".", 1, null, fieldi);
					if (tj.where != '') tj.where += " AND "
					tj.where += "("+where+")"
				}

				if (fieldi.having.conf != null && fieldi.having.conf.length>0){
					var where = whereUtils.getExp(fieldi.having.conf, tj.alias+".", 1, null, fieldi);
					if (sgts.having != '') sgts.having += " AND "
					sgts.having += "("+where+")"
				}
			}
			
			if (conf.where.conf != null && conf.where.conf.length>0) {
				var tableWhere = whereUtils.getExp(conf.where.conf, tj.alias+".", 1);
				sgts.tableWhere = tableWhere;
			}
			
			if(sgts.tableWhere == null) sgts.tableWhere = "";
			//补充通过hasField验证当前表是否有数据集参数中的字段
			
			if (dsWhere != null && dsWhere.length>0) {
				var tempDsWhere = hasTableInDP(recordedFields,dsWhere);
				if(tempDsWhere.length > 0){
					var dsWhereExp = whereUtils.getExp(tempDsWhere, tj.alias+".", 1);
					if(sgts.tableWhere != null && sgts.tableWhere.length > 0) sgts.tableWhere += " AND ";
					sgts.tableWhere += dsWhereExp;
				}
			}
			
			
			for(var p1 = 0 ; p1 < paramsFields.length; p1++){
				var paramItem = paramsFields[p1];
				
				if(includes(pushedItemNames,paramItem.srcName) || paramItem.where.conf.length == 0) continue;
				parse_params(paramItem,sgts,lefts, tops);
			}
			//数据集参数改用table.where
			
			if(sgts.tableWhere == null) sgts.tableWhere = "";
			return JSON.stringify(sgts).replaceAll('"',"<d_q>");
			//以下代码用不到
//			var tName = obj.dataSetUtils.getDataSet(conf.dataSet).tableName;
//
//			if (guideConf.outerCondition && guideConf.outerCondition.length>0) {
//				var outerUsed = [];
//				for (var j=0; j<guideConf.outerCondition.length; j++) {
//					var oj = guideConf.outerCondition[j];
//					if (oj.table == tName) {
//						if (outerUsed.indexOf(oj.table) >= 0) break;
//						outerUsed.push(oj.table);
//						if (tableWhere!='') tableWhere += " AND ";
//						tableWhere += "("+oj.exp.replaceAll("${T}","T1")+")";
//						break;
//					}
//				}
//				for (var j=0; j<guideConf.outerCondition.length; j++) {
//					var oj = guideConf.outerCondition[j];
//					if (outerUsed.indexOf(oj.table) >= 0) continue;
//					var dimObj = mdUtils.getDimByTable(oj.table);
//					if (!dimObj) continue;
//					var infoss = new Array();
//					dqlQuery.confUtils.getDimInfos(tName, dimObj.name, infoss, 0, false);
//					if (infoss.length == 0) continue;
//					outerUsed.push(oj.table);
//					if (tableWhere!='') tableWhere += " AND ";
//					tableWhere += "("+oj.exp.replaceAll("${T}","T1."+dqlQuery.confUtils.getInfosObj(infoss[0]).expNoTable)+")";
//				}
//			}
//					
//			
//			var dql = "SELECT ";
//			for (var i=0; i<fields.length; i++)
//			{
//				if (i>0) dql += ",";
//				dql += fields[i]+" " + fieldNames[i];
//			}
//			if (dims.length>0)
//			{
//				dql += " ON ";
//				for (var i=0; i<dims.length; i++)
//				{
//					if (i>0) dql += ",";
//					{
//						dql += dims[i]+" "+dimNames[i];
//					}
//				}
//			}
//			dql += " FROM " + tName + " T1";
//			if (tableWhere != '') dql += " WHERE " + tableWhere;
//			if (dims.length>0)
//			{
//				dql += " BY ";
//				for (var i=0; i<dims.length; i++)
//				{
//					if (i>0) dql += ",";
//					{
//						dql += bys[i];
//					}
//				}
//			}
//			return dql;
		}
		//通过名字获得报表配置对象
		,getRpx : function(name) {
			for (var i=0; i<rqAnalyse.rpxs.length; i++) {
				if (rqAnalyse.rpxs[i].name == name) return rqAnalyse.rpxs[i];
			}
		}
		//缓存数据文件方式的数据集，通过这里获得的dfx表达式计算后，生成报表需要的数据集
		,getDfxExps : function(exceptWhereItem, rpx, params, dsWhere) {
			var rd = rqAnalyse;
			//var dataId = "data"+new Date().getTime();
			//var calcs = "\"aa\"+说明:a1<;>\"bb\"+a1:a2";
			//var filters = "!like(a1,\"*软*\")<;>!like(a2,\"*软*\")";
			//var fields = "说明,a1<;>说明,a2";
			//var resultExp = "groups(说明:A;count(a2):B;1)";
			//var resultExp = "id("+item.name+";100)";
			
			var resultExp = "";
			var calcs = null;
			var filters = null;
			var fields = null;
			if (!rpx) rpx = obj.rpxUtils.getCurrRpx();
			var types = '';
			var srcTypes = '';
			var conf = rpx;
			var dataSet = obj.dataSetUtils.getDataSet(conf.dataSet);
			if(!dsWhere) dsWhere = dataSet.params;
 			var dataId = dataSet.dataId;
			
			var paramsFields = new Array();
//			if(params.length > 0){
//				for(var p = 0; p < params.length; p++){
//					var paramItem = params[p].item;
//					paramsFields.push(paramItem);
//				}
//			}
			
			if (exceptWhereItem) {
				if (guideConf.dataFileType == 'text') resultExp = "id("+exceptWhereItem.name+")";
				else resultExp = "id("+exceptWhereItem.name+";100)";
			}
			var calc = "";
			var filter = "";
			addC:for (var j=0; j<dataSet.fields.length; j++) {
				var itemj = dataSet.fields[j];
				if (itemj.exp && itemj.exp != '') {
					var rpxNoSuchFieldInvolve = true;
					for (var jj=0; jj<rpx.fields.length; jj++) {
						var fjj = rpx.fields[jj];
						if(	itemj.exp.indexOf(fjj.name) > -1 ){
							rpxNoSuchFieldInvolve = false;
						}
					}
					if(rpxNoSuchFieldInvolve) continue addC;
					
					if (calc != "") calc += ",";
					calc += itemj.exp + ":" + itemj.name;
				}
			}

			if (conf.where.conf != null && conf.where.conf.length>0) {
				if (filter != "") filter += " && ";
				filter += "("+whereUtils.getExp(conf.where.conf, "", 1, 2)+")";
			}
			
			if (dsWhere != null && dsWhere.length>0) {
				if (filter != "") filter += " && ";
				var dsWhereExp = whereUtils.getExp(dsWhere, "", 1, 2);
				filter += "("+dsWhereExp+")";
				//当存在数据集参数的时候，忽略type属性参数？
			}
			
			
			if (paramsFields.length>0) {
				for(var f = 0 ; f < paramsFields.length; f++){
					if(paramsFields[f].where.conf.length == 0) continue;
					if (filter != "") filter += " && ";
					filter += "("+whereUtils.getExp(paramsFields[f].where.conf, "", 1, 2)+")";
				}
			}
			
			var fs = obj.rpxUtils.getRpxFields(conf);
			for (var j=0; j<fs.length; j++) {
				if (exceptWhereItem && exceptWhereItem.name == fs[j].srcName) continue;
				if (fs[j].where.conf == null || fs[j].where.conf.length==0) continue;
				if (filter != "") filter += " && ";
				filter += "("+whereUtils.getExp(fs[j].where.conf, "", 1, 2)+")";
			}
			if (calc == '') calc = 'no';
			if (filter == '') filter = 'no';
			if (calcs == null) {
				calcs = calc;
				filters = filter;
				fields = "no";
			} else {
				calcs += "<;>" + calc;
				filters += "<;>" + filter;
				fields += "<;>" + "no";
			}
			
			if (!exceptWhereItem) {
				//var resultExp = "groups(说明:A;count(a2):B;1)";
				if (conf.tops.length==0 && conf.lefts.length==0 && conf.fields.length==0) return null;
				if (conf.type == 1 || conf.type == 2) {
					var groups = '';
					var aggrs = '';
					var existItems = [];
					var hasGroup = false;
					for (var j=0; j<fs.length; j++) {
						if (fs[j]._fieldType != 'group') continue;
						hasGroup = true;
						var n = fs[j].name;
						var srcn = fs[j].src;
						//if (existItems.indexOf(e)>=0) continue;
						var fj = obj.dataSetUtils.getDataSetField(dataSet,fs[j].srcName);
						if (!fj) {
							alert(resources.guide.js210.replaceAll("{0}",n));
							return null;
						}
						var e = fj.exp;
						if (e == '' || !e) e = fj.name;
						//existItems.push(n);
						if (groups != '') groups += ',';
						groups += e+":"+n;
						types += "," + n + ":" + fs[j].dataType;
						srcTypes += "," + srcn + ":" + fs[j].dataType;
					}
					for (var j=0; j<fs.length; j++) {
						if (fs[j]._fieldType != 'detail' && fs[j]._fieldType != 'aggr') continue;
						var n = fs[j].name;
						var srcn = fs[j].src;
						//if (existItems.indexOf(e)>=0) continue;
						var fj = obj.dataSetUtils.getDataSetField(dataSet,fs[j].srcName);
						if (!fj) {
							alert(resources.guide.js210.replaceAll("{0}",n));
							return null;
						}
						var e = fj.exp;
						if (e == '' || !e) e = fj.name;
						//existItems.push(n);
						if (hasGroup ){
							if (aggrs != '') aggrs += ',';
							var aggr = fs[j].aggr;
							if (aggr == 'countd') aggr = 'icount';
							aggrs += aggr + "(" + e + "):" + n;
							types += "," + n + ":" + fs[j]._finalType;
							var ds = aly.getDataSet(conf.dataSet);
							var fieldItem = aly.getDataSetField(ds,srcn);
							if(fieldItem){
								if(fieldItem.newField == null || fieldItem.newField == 0){
									srcTypes += "," + srcn + ":" + fs[j].dataType;
								}else{
									srcTypes += "," + getCalcFieldAlianField_Types(ds,obj.dataSetUtils.getDataSetField(ds,fs[j].srcName).exp);
								}
							}
						} else {
							if (groups != '') groups += ',';
							groups += e+":"+n;
							types += "," + n + ":" + fs[j].dataType;
							var ds = aly.getDataSet(conf.dataSet);
							var fieldItem = aly.getDataSetField(ds,srcn);
							if(fieldItem){
								if(fieldItem.newField == null || fieldItem.newField == 0){
									srcTypes += "," + srcn + ":" + fs[j].dataType;
								}else{
									srcTypes += "," + getCalcFieldAlianField_Types(ds,obj.dataSetUtils.getDataSetField(ds,fs[j].srcName).exp);
								}
							}
						}
					}
					if (!hasGroup) {
						if (guideConf.dataFileType.toLowerCase()=='binary')
							resultExp = "new("+groups+").fetch("+guideConf.maxDataSize+")";
						else
							resultExp = "new("+groups+")";
					} else {
						var scope = groups.split(',').length;
						if (guideConf.dataFileType.toLowerCase()=='binary')
							resultExp = "groups("+groups+";"+aggrs+";"+guideConf.maxDataSize+")";
						else
							resultExp = "groups("+groups+";"+aggrs+")";
					}
				} else {
					//TODO 自定义rpx
					//return null;
				}
			}

			if (types.length>0) types = types.substring(1);
			if (srcTypes.length>0) {
				srcTypes = srcTypes.substring(1);
				var arr = srcTypes.split(',');
				srcTypes = '';
				for(var l = 0; l < arr.length; l++){
					if(srcTypes.indexOf(arr[l]) < 0) srcTypes += ","+arr[l];
				}
				srcTypes = srcTypes.substring(1);
			}
			
			if (dsWhere != null && dsWhere.length>0) {
				srcTypes = "";
			}
			return {calcs:calcs,filters:filters,fields:fields,resultExp:resultExp,dataId:dataId,types:types,srcTypes:srcTypes};
		}
		//sql数据集，返回类似： select f1,sum(f2) from ${SRCSQL} t where ... group by ... having ...
		,getSqlTemplate : function(rpx,srcsql) {
			if (!rpx) rpx = obj.rpxUtils.getCurrRpx();
			var conf = rpx;
			var rd = rqAnalyse;
			var isSimpleFlag = !this.notSimple(srcsql);
			var field = [];
			var fieldAlias = [];
			var fieldAggr = [];
			var groupAlias = [];
			var aggrFields = "";
			var where = "";
			var having = "";
			if (conf.tops.length==0 && conf.lefts.length==0 && conf.fields.length==0) return null;
			var hasGroup = false;
			var fs = obj.rpxUtils.getRpxFields(conf);
			var tableMark = "";
			if(isSimpleFlag){
				tableMark = "";
			}
			for (var j=0; j<fs.length; j++) {
				if (fs[j]._fieldType != 'group') continue;
				hasGroup = true;
				field.push(fs[j].srcName);
				fieldAlias.push(fs[j].name);
				fieldAggr.push("");

				
				if (fs[j].where.conf != null && fs[j].where.conf.length>0){
					var w = whereUtils.getExp(fs[j].where.conf, tableMark, 1);
					if (where != '') where += " AND ";
					where += w;
				}

				if (fs[j].having.conf != null && fs[j].having.conf.length>0){
					var h = whereUtils.getExp(fs[j].having.conf, "t.", 1);
					if (having != '') having += " AND ";
					having += "("+h+")";
				}

			}
			for (var j=0; j<fs.length; j++) {
				if (fs[j]._fieldType != 'detail' && fs[j]._fieldType != 'aggr') continue;
				field.push(fs[j].srcName);
				fieldAlias.push(fs[j].name);
				fieldAggr.push(fs[j].aggr);

				if (fs[j].where.conf != null && fs[j].where.conf.length>0){
					var w = whereUtils.getExp(fs[j].where.conf, tableMark, 1);
					if (where != '') where += " AND ";
					where += w;
				}

				if (fs[j].having.conf != null && fs[j].having.conf.length>0){
					var h = whereUtils.getExp(fs[j].having.conf, "t.", 1);
					if (having != '') having += " AND ";
					having += "("+h+")";
				}
			}
			
			if (conf.where.conf != null && conf.where.conf.length>0){
				var w = whereUtils.getExp(conf.where.conf, tableMark, 1);
				if (where != '') where += " AND ";
				where += w;
			}
			
			
			var sql = "SELECT ";
			var groupBy = "";
			var tmpsql = "";
			var cases = this.parseCaseCalc(srcsql);//
			var orderField = this.parseOrderField(srcsql);
			//去掉order
			if(orderField != null){
				for(var i=0;i < fieldAlias.length;i++){
					if(srcsql.indexOf("order by") > 0){
						srcsql = srcsql.replace("order by "+orderField.field+" " +orderField.type ,"")
					}else if(srcsql.indexOf("ORDER BY") > 0){
						srcsql = srcsql.replace("ORDER BY "+orderField.field+" " +orderField.type,"")
					}
					
				}
			}
			var newsql = srcsql;
			
			var sqlsplitAtFrom = newsql.toUpperCase().split(" FROM ");
			newsql = "SELECT ";
			for (var i=0; i<field.length; i++) {
				if (i>0) tmpsql += ",";
				if(cases[field[i]]){
					field[i] = cases[field[i]];
				}
				if (fieldAggr[i] == ''){
					tmpsql += tableMark + field[i] + " " + fieldAlias[i];
				}
				else tmpsql += fieldAggr[i]+"("+ tableMark + field[i] + ") " + fieldAlias[i];
				if (hasGroup && fieldAggr[i]=="") {
					if (groupBy != '') groupBy += ",";
					groupBy += field[i];
				}
			}
			
			
			if(isSimpleFlag){
				newsql += tmpsql;
				newsql += " FROM " + sqlsplitAtFrom[1];
			}
			sql += tmpsql;
			sql += " FROM ${SRCSQL}";
			if ( where != "" ) {
				//sql += " WHERE "+where;
				if(isSimpleFlag){
					if( srcsql.toUpperCase().indexOf(" WHERE ") > 0 ){
						var sqlSplits = srcsql.toUpperCase().split(" WHERE ");
						var mainSql = sqlSplits[0];
						var conditionSql = sqlSplits[1];//where后面的部分
						conditionSql = where + " AND " + conditionSql;
						newsql = mainSql + " WHERE " + conditionSql;
					}else{
						newsql = srcsql + " WHERE " + where;
					}
				}
				sql += " WHERE " + where;
			}
			if (groupBy!="") {
				if(isSimpleFlag){
					newsql += " GROUP BY "+groupBy;
				}
				sql += " GROUP BY "+groupBy;
			}
			if (having!="") {
				if(isSimpleFlag){
					newsql += " HAVING "+having;
				}
				sql += " HAVING "+having;
			}
			var hasCase = srcsql.toUpperCase().indexOf("(CASE ") >= 0 ||　srcsql.toUpperCase().indexOf("(　CASE ") >= 0;
			if(hasCase){//存在别名，过滤时候需要t.f1 > 0 这样的表达式
				if(newsql.toUpperCase().indexOf(" WHERE ") >= 0){
					isSimpleFlag = false;
				}
			}
			//order再拼接
			if(orderField != null){
				for(var i=0;i < fieldAlias.length;i++){
					if(fieldAlias[i] == orderField.field){
						newsql += " ORDER BY "+ orderField.field + " " + orderField.type;
						break;
					}
				}
			}
			
			if(isSimpleFlag){
				return newsql;
			}else{
				return sql;
			}
		},
		notSimple : function(srcsql){
			srcsql = srcsql.toUpperCase();
			var hasInnerSelection = srcsql.split("SELECT ").length >= 3;;
			var hasGroupby = srcsql.indexOf(" GROUP BY ") >= 0;
			var hasWhere = false;//srcsql.indexOf(" WHERE ") >= 0;不验证where
			var hasHaving = srcsql.indexOf(" HAVING ") >= 0;
			var hasJoin = srcsql.indexOf(" JOIN ") >= 0;
			var hasUnion = srcsql.indexOf(" UNION ") >= 0;
			return hasGroupby || hasWhere || hasHaving || hasJoin || hasUnion || hasInnerSelection;
		}
		,parseCaseCalc : function(srcsql){
			var start = srcsql.indexOf('case ') + 1;
			var cases = {};
			while(start != 0){
				var end = srcsql.indexOf(' end');
				var caseSql = srcsql.substring(start+4,end);
				var asIndex = srcsql.substring(end).indexOf('as');
				var as = srcsql.substring(end).substring(asIndex+3);
				as = as.substring(0,as.indexOf(' '));
				eval('cases.'+as+'='+'"(case '+caseSql+' end)"');
				srcsql = srcsql.substring(end);
				start = srcsql.indexOf('case ') + 1;
			}
			return cases;
		}
		,parseOrderField : function(srcsql){
			var r = {};
			if(srcsql.toUpperCase().indexOf('ORDER BY ') < 0){
				return null;
			}
			var field = '';
			var type = '';
			var sub = '';
			if(srcsql.indexOf('ORDER BY ') >= 0){
				sub = srcsql.split('ORDER BY ')[1];
			}else if(srcsql.indexOf('order by ') >= 0){
				sub = srcsql.split('order by ')[1];
			}
			field = sub.substring(0,sub.indexOf(' '));
			type = sub.substring(sub.indexOf(' ') + 1);
			if(type.indexOf(' ') > 0){
				type = type.substring(0,type.indexOf(' '));
			}
			
			eval('r.field="'+field+'"');
			eval('r.type="'+type+'"');
			return r;
		}
		
		//是否为分组报表
		,isGroupRpx : function(rpx) {
			if(rpx == null || (rpx.tops == null && rpx.lefts == null)) return false;
			else if (rpx.tops.length>0||rpx.lefts.length>0) return true;
			else return false;
		}
		//获得当前选中报表
		,getCurrRpx : function() {
			var rd = rqAnalyse;
			if (rd == null || rd.rpxs == null || rd.rpxs.length == 0) return null;
			if (rd.currRpx === undefined || rd.currRpx == "") {
				rd.currRpx = rd.rpxs[0].name;
				return rd.rpxs[0];
			}
			return obj.rpxUtils.getRpx(rd.currRpx);
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
		//获得报表字段
		,getRpxFieldByName : function(rpx, name) {
			for (var i=0; i<rpx.fields.length; i++) {
				if (rpx.fields[i] == null) continue;
				if (rpx.fields[i].name == name) return rpx.fields[i];
			}
			for (var i=0; i<rpx.tops.length; i++) {
				if (rpx.tops[i].name == name) return rpx.tops[i];
			}
			for (var i=0; i<rpx.lefts.length; i++) {
				if (rpx.lefts[i].name == name) return rpx.lefts[i];
			}
		}
		//修改报表字段名称
		,modifyRpxFieldName : function(rpx, field, name) {
			var old = field.name;
			field.name = name;
			for (var i=0; i<rpx.fields.length; i++) {
				var fi = rpx.fields[i];
				if (fi == null) continue;
				if (fi._fieldType == 'aggr' && fi.groups != null) {
					for (var j=0; j<fi.groups.length; j++) {
						if (fi.groups[j] == old) fi.groups[j] = name;
					}
				} else if (fi._fieldType == 'analyse') {
					for (var j=0; j<fi.analyse.scopeGroups.length; j++) {
						if (fi.analyse.scopeGroups[j] == old) fi.analyse.scopeGroups[j] = name;
					}
					if (fi.analyse.field == old) fi.analyse.field = name;
				}
			}
		}
		//获得报表所有字段，包括左上表头
		,getRpxFields : function(rpx) {
			var fs = [];
			for (var i=0; i<rpx.fields.length; i++) {
				if (rpx.fields[i] == null) continue;
				fs.push(rpx.fields[i]);
			}
			for (var i=0; i<rpx.tops.length; i++) {
				fs.push(rpx.tops[i]);
			}
			for (var i=0; i<rpx.lefts.length; i++) {
				fs.push(rpx.lefts[i]);
			}
			return fs;
		}
		,getUsedTables : function(rpx) {
			var dataSet = obj.dataSetUtils.getDataSet(rpx.dataSet);
			if (dataSet.type != 6) return null;
			var ts = [];
			var fields = rpx.fields;//obj.rpxUtils.getRpxFields(rpx);
			for (var i=0; i<fields.length; i++) {
				if (fields[i] == null || fields[i]._fieldType == "newAnalyse" || fields[i]._fieldType == "analyse") continue;
				var iObj = dqlQuery.confUtils.getInfosObj(fields[i].autoSrc);
				if (iObj != null && ts.indexOf(iObj.firstTable == -1)) if (ts.indexOf(iObj.firstTable)==-1) ts.push(iObj.firstTable);
			}
			return ts;
		}
		//检查字段名称，同时修正，自动增减聚合方式名称
		,checkFieldName : function(rpx, f){
			var rd = rqAnalyse;
			var conf = rpx;
			var name = f.name;
			if (f.relas === undefined) f.relas = [];
			if (f.dim === undefined) f.dim = '';
			f._status = '';
			if (f._fieldType == 'analyse' || f._fieldType == 'newAnalyse')
			{
				return;
			}
			var dataSet = obj.dataSetUtils.getDataSet(conf.dataSet);
			if (dataSet.type == 6){
				try {
					var alertBack = alert;
					alert = function(){};
					var iObj = dqlQuery.confUtils.getInfosObj(f.src);
					if (dataSet.tableName.indexOf(iObj.firstTable) == -1){
						f._status = resources.guide.js210.replaceAll("{0}",f.name) + "(1)";
					}
					
					f.dim = iObj.dim;
					
					if (f._parentType != 'field') {
						var usedTables = clone(obj.rpxUtils.getUsedTables(rpx));
						for (var i=f.relas.length-1; i>=0; i--) {
							var byObj = dqlQuery.confUtils.getInfosObj(f.relas[i]);
							if (byObj == null || usedTables.indexOf(byObj.firstTable) == -1) f.relas.remove(f.relas[i]);
							else usedTables.remove(usedTables);
							
						}
						var invalidTable = "";
						for (var i=0; i<usedTables.length; i++) {
							var infoss = [];
							dqlQuery.confUtils.getDimInfos(usedTables[i], f.dim, infoss, 0, true);
							if (infoss.length>0) {
								if (f.relas.indexOf(infoss[0])==-1) f.relas.push(infoss[0]); 
							}
							else invalidTable = usedTables[i];
						}
						if (invalidTable != "") {
							f._status = "invalidTable--No dim define, maybe lmd has changed or no dql license! ";
							if (f.dim != '') f._status += resources.guide.js211.replaceAll("{0}",f.dim).replaceAll("{1}",invalidTable);
						}
					}
					
					alert = alertBack;
				} catch (e) {
					console.warn(e);
					f._status = resources.guide.js210.replaceAll("{0}",f.name) + "(2)";
				}
			} else {
				var src = obj.dataSetUtils.getDataSetField(dataSet,f.srcName);
				if (!src) f._status = resources.guide.js210.replaceAll("{0}",f.name) + "(3)";
			}
			if (name == '')
			{
				if (f._fieldType == 'aggr')
				{
					name = f.srcName + getAggrName(f.aggr);
				} else {
					name = f.srcName;
				}
			} else {
				name = name.replaceAll(f.srcName,'_src_');
				
				for (var i=aggrNames.length-1; i>=0; i--)
				{
					//if (!(f._fieldType == 'aggr' && aggrs[i] == f.aggr)){
						if (name == '_src_'+aggrNames[i]) name = name.replaceAll(aggrNames[i],'');
					//}
				}
				if (name == '_src_' && f._fieldType == 'aggr') name += getAggrName(f.aggr);
				name = name.replaceAll('_src_',f.srcName);
			}
			var names = [];
			for (var i=0; i<conf.fields.length; i++) {
				if (conf.fields[i] == null || f == conf.fields[i]) continue;
				names[names.length] = conf.fields[i].name;
			}
			for (var i=0; i<conf.tops.length; i++) {
				if (f == conf.tops[i]) continue;
				names[names.length] = conf.tops[i].name;
			}
			for (var i=0; i<conf.lefts.length; i++) {
				if (f == conf.lefts[i]) continue;
				names[names.length] = conf.lefts[i].name;
			}
			if (names.indexOf(name) == -1) {
				f.name = name;
			} else {
				var count = 1;
				while (names.indexOf(name+count)>=0) {
					count++;
				}
				f.name = name+count;
			}
		}
		//检查配置的有效性，错误信息记录到_status属性
		,checkConf : function(conf, params) {
			//_parentType:'top/left/field',_fieldType:'group/detail/aggr/analyse/newAnalyse',_status:'为空表示正确，不为空是失效的具体信息'		
	//		lefts:[{name:'',macroName:'',srcItems:[itemId0,itemId1],exp:'itemId0/itemId1',aggrExp:'sum(itemId0)/sum(itemId1)',use:1,order:0无序/1升序/2降序,groups:[lefts,tops里的分组，空分组表示整体聚合]/null表示随分组自动聚合,analyse:{analyseName:'占比/排名/比上期/比同期',field:'被分析的测度字段',scopeGroups:[空则表示针对全部]},format:'',dataType:'',_parentType:'top/left/field',_fieldType:'group/detail/aggr/analyse',_status:'为空表示正确，不为空是失效的具体信息'}]
			//var conf = obj.rpxUtils.getCurrRpx();
			//if (conf.type == 2) return;
			selectedFields = [];
			conf._status = '';
			var dataSet = obj.dataSetUtils.getDataSet(conf.dataSet);
			
			var hasGroup = conf.tops.length+conf.lefts.length>0;
			var hasAggr = false;
			if (dataSet.type == 6) {
				var dims = [];
				var tables = [];
				for (var i=0; i<conf.tops.length; i++) {
					conf.tops[i]._parentType = 'top';
					conf.tops[i]._fieldType = 'group';
					conf.tops[i]._finalType = conf.tops[i].dataType;
					dims.push(conf.tops[i].dim);
					selectedFields.push(conf.tops[i].src);
				}
				for (var i=0; i<conf.lefts.length; i++) {
					conf.lefts[i]._parentType = 'left';
					conf.lefts[i]._fieldType = 'group';
					conf.lefts[i]._finalType = conf.lefts[i].dataType;
					dims.push(conf.lefts[i].dim);
					selectedFields.push(conf.lefts[i].src);
				}
				var srcs = [];
				var srcIdx = [];
				for (var i=0; i<conf.fields.length; i++) {
					var fi = conf.fields[i];
					if (fi) {
						selectedFields.push(fi.src);
					}
					if (conf.type == 1) {
						fi._parentType = 'field';
						if (fi._fieldType == 'analyse' || fi._fieldType == 'newAnalyse') {
							fi._finalType = 1;
						} else {
							if (hasGroup) {
								fi._fieldType = 'aggr';
								if (fi.aggr =='' || fi.aggr===undefined) fi.aggr = 'count';
								if (fi.aggr == 'sum' || fi.aggr == 'count' || fi.aggr == 'countd' || fi.aggr == 'avg') fi._finalType = 1;
								else fi._finalType = fi.dataType;
								hasAggr = true;
							} else {
								fi.aggr = '';
								fi._fieldType = 'detail';
								fi._finalType = fi.dataType;
							}
							
							srcs.push(fi.src);
							srcIdx.push(i);
						}
						obj.rpxUtils.checkFieldName(conf,fi);
					} else {
						if (fi) fi._status = resources.guide.js212;
					}
				}
				
				var result = dqlQuery.confUtils.autoSrcs(srcs);
				for (var i=0; i<srcs.length; i++) {
					var fi = conf.fields[srcIdx[i]];
					fi.autoSrc = result.autoSrcs[i];
					fi.autoTAlias = result.tNames[i];
				}
			}
			
			for (var i=0; i<conf.tops.length; i++) {
				conf.tops[i]._parentType = 'top';
				conf.tops[i]._fieldType = 'group';
				conf.tops[i]._finalType = conf.tops[i].dataType;
				obj.rpxUtils.checkFieldName(conf,conf.tops[i]);
			}
			for (var i=0; i<conf.lefts.length; i++) {
				conf.lefts[i]._parentType = 'left';
				conf.lefts[i]._fieldType = 'group';
				conf.lefts[i]._finalType = conf.lefts[i].dataType;
				obj.rpxUtils.checkFieldName(conf,conf.lefts[i]);
			}
			for (var i=0; i<conf.fields.length; i++) {
				var fi = conf.fields[i];
				if (conf.type == 1) {
					fi._parentType = 'field';
					if (fi._fieldType == 'analyse' || fi._fieldType == 'newAnalyse') {
						fi._finalType = 1;
					} else {
						if (hasGroup) {
							fi._fieldType = 'aggr';
							if (fi.aggr =='' || fi.aggr===undefined) fi.aggr = 'count';
							if (fi.aggr == 'sum' || fi.aggr == 'count' || fi.aggr == 'countd' || fi.aggr == 'avg') fi._finalType = 1;
							else fi._finalType = fi.dataType;
							hasAggr = true;
						} else {
							fi.aggr = '';
							fi._fieldType = 'detail';
							fi._finalType = fi.dataType;
						}
					}
					obj.rpxUtils.checkFieldName(conf,fi);
				} else {
					if (fi) {
						fi._parentType = 'field';
						fi._fieldType = (fi.aggr =='' || fi.aggr===undefined)?'group_detail':'aggr';
						if (fi._fieldType == 'aggr') hasAggr = true;
						if (fi.aggr == 'sum' || fi.aggr == 'count' || fi.aggr == 'countd' || fi.aggr == 'avg') fi._finalType = 1;
						else fi._finalType = fi.dataType;
						obj.rpxUtils.checkFieldName(conf,fi);
					}
				}
			}
			//参数修改aggr类型
			if(params){
				for (var i=0; i<params.length; i++) {
					params[i].item.aggr="";
				}
			}
			
			if (conf.type == 2) {
				for (var i=0; i<conf.fields.length; i++) {
					var fi = conf.fields[i];
					if (fi && fi._fieldType == 'group_detail') {
						if (hasAggr) {
							fi._fieldType = 'group';
							hasGroup = true;
						} else {
							fi._fieldType = 'detail';
						}
					}
				}
			}
			
			
			conf._hasAggr = hasAggr;
			conf.structType = hasGroup?3:2;
			for (var i=0; i<conf.fields.length; i++) {
				var fi = conf.fields[i];
				if (!fi) continue;
				var status = "";
				if (fi._fieldType == 'aggr') {
					if (fi.groups != null && fi.groups.length>0) {
						var lefts=[],tops=[];
						for (var j=0; j<fi.groups.length; j++) {
							var fj = obj.rpxUtils.getRpxFieldByName(conf,fi.groups[j]);
							if (fj == null) {
								status = resources.guide.js213.replaceAll("{0}",fi.groups[j]);
							} else if (fj._parentType == 'field') {
								status = resources.guide.js214.replaceAll("{0}",fi.groups[j]);
							} else if (fj._parentType == 'top') {
								tops[tops.length] = [conf.tops.indexOf(fj),j];
							} else if (fj._parentType == 'left') {
								lefts[lefts.length] = [conf.lefts.indexOf(fj),j];
							}
							if (status != '') break;
						}
						if (status == '') {
							for (var j=0; j<lefts.length; j++) {
								if (lefts[j][0]>=lefts.length) {
									status = resources.guide.js215.replaceAll("{0}",fi.groups[lefts[j][1]]);
									break;
								}
							}						
						}
						if (status == '') {
							for (var j=0; j<tops.length; j++) {
								if (tops[j][0]>=tops.length) {
									status = resources.guide.js216.replaceAll("{0}",fi.groups[tops[j][1]]);
									break;
								}
							}
						}
						if (status == '') {
							if (lefts.length==0&&tops.length==0) {
								status = resources.guide.js217;
							}
						}
					}
				} else if (fi._fieldType == 'newAnalyse') {
				} else if (fi._fieldType == 'analyse') {
					//analyse:{analyseName:'占比/排名/比上期/比同期',field:'被分析的测度字段',scopeGroups:[空则表示针对全部]},format:'',dataType:'',_parentType:'top/left/field',_fieldType:'group/detail/aggr/analyse',_status:'为空表示正确，不为空是失效的具体信息'
					var fa = obj.rpxUtils.getRpxFieldByName(conf,fi.analyse.field);
					if (!fa) {
						status = resources.guide.js218;	
					} else {
						if (fa.groups != null && fa.groups.length == 0) {
							status = resources.guide.js219;
						} else {
							var groups = fa.groups;
							if (fa.groups == null) {
								groups = [];
								for (var z=0; z<conf.lefts.length; z++) {
									groups[groups.length] = conf.lefts[z].name;
								}
								for (var z=0; z<conf.tops.length; z++) {
									groups[groups.length] = conf.tops[z].name;
								}
							}
							if (fi.analyse.scopeGroups == null) fi.analyse.scopeGroups = []; 
							var topGroups = fi.analyse.scopeGroups;
							if (topGroups.length>=groups.length) {
								status = resources.guide.js220;
							} else {
								for (var z=0; z<topGroups.length; z++) {
									if (groups.indexOf(topGroups[z]) == -1) {
										status = resources.guide.js220;
										break;
									} 
								}
								if (status == '') {
									var lefts=[],tops=[];
									for (var j=0; j<topGroups.length; j++) {
										var fj = obj.rpxUtils.getRpxFieldByName(conf,topGroups[j]);
										if (fj == null) {
											status = resources.guide.js221.replaceAll("{0}",topGroups[j]);
										} else if (fj._parentType == 'field') {
											status = resources.guide.js222.replaceAll("{0}",topGroups[j]);
										} else if (fj._parentType == 'top') {
											tops[tops.length] = [conf.tops.indexOf(fj),j];
										} else if (fj._parentType == 'left') {
											lefts[lefts.length] = [conf.lefts.indexOf(fj),j];
										}
										if (status != '') break;
									}
									if (status == '') {
										for (var j=0; j<lefts.length; j++) {
											if (lefts[j][0]>=lefts.length) {
												status = resources.guide.js223.replaceAll("{0}",topGroups[lefts[j][1]]);
												break;
											}
										}						
									}
									if (status == '') {
										for (var j=0; j<tops.length; j++) {
											if (tops[j][0]>=tops.length) {
												status = resources.guide.js224.replaceAll("{0}",topGroups[tops[j][1]]);
												break;
											}
										}
									}
								}
							}
						}
					}
				}
				if (fi._status == '') fi._status = status;
			}
		}
		//rpxConf为报表定义, = rqAnalyse.rpxs[n]
		,getRpxDefine : function(rpxConf) {
			return func4(rpxConf);
		}
	}
	
	var func4 = function(conf) {
		//conf, field, type:1src/2group/3select/4aggr/5field/6detail, outerOrder 
		var getExps = function(conf, field, type, outerOrder, aggrCell, leftMain, topMain, currCell, fieldOrder) {
			
			if (type == 1 || type == 5) {
				var tmp = "ds1."+field.name;
				return "if(ifstring("+tmp+"),if(len("+tmp+")>100,left("+tmp+",100)+\"...\","+tmp+"),"+tmp+")";
			}
			if (type == 4) {
				var aggr = field.aggr;
				if (aggr == 'count' || aggr == 'countd') aggr = 'sum';
				return "ds1." + aggr + "(" + field.name + ")";
			}
			if (type == 3) {
				if (outerOrder != '') outerOrder = ";" + outerOrder;
				return "ds1.select("+field.name+outerOrder+")";
			}
			if (type == 2) {
				var exp = field.name;
				var order = "";
				if(fieldOrder && fieldOrder.length > 0) {
					fieldOrder = fieldOrder.split("//");
					var exp1 = "";
					exp1 = fieldOrder[0];
					order = fieldOrder[1];
					if (order != 0) order = order==1?(";"+exp1+":1"):(";"+exp1+":-1");
					else order = ";"+exp+":0";
				}
				else if (field.order != 0) order = (field.order==1?(";"+exp+":1"):(";"+exp+":-1"));
				else order = ";"+exp+":0";
				exp = "ds1.group(" + exp + order + ")";
				return exp;
			}
			if (type == 6) {
				//if(len(string(ds1.select(联系人姓名)))>20,left(string(ds1.select(联系人姓名)),20)+"...",string(ds1.select(联系人姓名)))
				var exp = field.name;
				return "if(len(string(ds1.select("+exp+")))>20,left(string(ds1.select("+exp+")),20)+\"...\",string(ds1.select("+exp+")))";
			} else if (type == 7) {
				//E4/sum(E4[`0;`0]{})
				if (field.analyse.analyseName == resources.guide.js142) {
					return aggrCell+"/sum("+aggrCell+"["+leftMain+";"+topMain+"]{})";
				} else if (field.analyse.analyseName == resources.guide.js143) {
					return "count("+aggrCell+"["+leftMain+";"+topMain+"]{"+aggrCell+">$"+aggrCell+"})+1";
				} else if (field.analyse.analyseName == resources.guide.js144) {
					return ""+aggrCell+"/"+aggrCell+"[-1]";
				} else if (field.analyse.analyseName == resources.guide.js145) {
					return ""+aggrCell+"+"+currCell+"[-1]";
				} else if (field.analyse.analyseName == resources.guide.js225) {
					return "";
				}
				
			}
			return exp;
		}
		
		var cellCols = ["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL"];
		var backColors = ['255,255,255','242,248,238','255,255,255','242,248,238','255,255,255','242,248,238','255,255,255','242,248,238','255,255,255','242,248,238','255,255,255','242,248,238','255,255,255','242,248,238','255,255,255','242,248,238','255,255,255','242,248,238'];
		var colWidths1 = [];
		var colWidths2 = [];
		if (conf.colWidths && conf.colWidths != "") {
			var cw = conf.colWidths.split(";");
			for (var i=0; i<cw.length; i++) {
				var cwi = cw[i].split(":");
				if (cwi.length == 2) {
					try {
						var cw1 = parseInt(cwi[0]);
						var cw2 = parseInt(cwi[1]);
						colWidths1.push(cw1);
						colWidths2.push(cw2);
					} catch(e) {}
				}
			}
		}
		var defaultWidth = guideConf.defaultWidth;

		var rowHeights1 = [];
		var rowHeights2 = [];
		if (conf.rowHeights && conf.rowHeights != "") {
			var rh = conf.rowHeights.split(";");
			for (var i=0; i<rh.length; i++) {
				var rhi = rh[i].split(":");
				if (rhi.length == 2) {
					try {
						var rh1 = parseInt(rhi[0]);
						var rh2 = parseInt(rhi[1]);
						rowHeights1.push(rh1);
						rowHeights2.push(rh2);
					} catch(e) {}
				}
			}
		}
		var defaultHeight = guideConf.defaultHeight;
		var formatExp = guideConf.formatExp?guideConf.formatExp:'';

		if (conf._dataCount == 0) {
			return;
		}
		finish = conf._dataOver;
		
		//{rowCount:1,colCount:1,rows:[{row:1,type:'IRowCell定义'}],cols:[{col:1,type:'IColCell定义'}],cells:[{row:1,col:1,row2:1,col2:1,format:'',valueExp:'',value:'',extend:'',leftMain:'左主格',topMain:'上主格'}]}
		var rpt = {rowCount:1,colCount:1,rows:[],cols:[],cells:[]};
		//1：单条记录，全是统计字段； 2：明细报表；3：分组及交叉报表
		var fields = [];
		for (var i=0; i<conf.fields.length; i++) {
			if (conf.fields[i]._status == '') fields[fields.length] = conf.fields[i];
		}

		var biaoti = {"name":resources.guide.js226,"backColor":-1641217,"color":-16777216,"hAlign":-47};
		var fenzu = {"name":resources.guide.js227,"backColor":-1641217,"color":-16777216,"hAlign":-47};
		var zongji = {"name":resources.guide.js228,"backColor":"204,255,255","color":-16777216,"hAlign":-47};
		
		var zhibiao = [];
		
		for (var i=0; i<guideConf.style.length; i++)
		{
			var si = guideConf.style[i];
			if (si.name == resources.guide.js226) biaoti = si;
			else if (si.name == resources.guide.js227) fenzu = si;
			else if (si.name.indexOf(resources.guide.js229)>=0) zhibiao.push(si);
		}
		if (zhibiao.length == 0) zhibiao = [{"name":resources.guide.js229+"1","backColor":-1,"color":-16777216,"hAlign":-48},{"name":resources.guide.js229+"2","backColor":-853778,"color":-16777216,"hAlign":-48}];

		var ts = "";
		var ls = "";
		if (conf.tops.length==0&&conf.lefts.length==0) {
			if (fields.length==0) {
				//alert("没有可展示的维度和指标");
				$('iframe[confName="'+conf.name+'"]').attr('src', contextPath + guideConf.guideDir+"jsp/empty.jsp?guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent(conf.name));
				$('img[confNameLoading="'+conf.name+'"]').css('visibility','hidden');
				return;
			}
			
			var orders = '';
			for (var j=0; j<conf.fields.length; j++) {
				var fieldj = conf.fields[j];
				var exp = getExps(conf,fieldj,1);
				if (fieldj.order != 0) {
					if (orders != '') orders += ",";
					orders += exp+":"+(fieldj.order==1?1:-1);
				}
			}

			//,adjustSizeMode:48,textWrap:1,hAlign:208/209/210,color:'',backColor:''
			//map(list(0,2),list("男","女"))
			if (conf.isRowData) {
				var rhIdx = rowHeights1.indexOf(1);
				rpt.rows[0] = {row:1,type:161,height:rhIdx==-1?defaultHeight:rowHeights2[rhIdx]};
				for (var i=0; i<fields.length; i++) {
					rpt.cells.push({row:1,col:i+1,row2:1,col2:i+1,format:'',value:fields[i].name,valueExp:'',extend:16,leftMain:'',topMain:'',tip:5,adjustSizeMode:48,textWrap:1,hAlign:biaoti.hAlign,color:biaoti.color,backColor:biaoti.backColor,dispExp:'',formatExp:formatExp});//'230,244,255'
					rpt.cells.push({row:2,col:i+1,row2:2,col2:i+1,format:fields[i].format,value:'',valueExp:getExps(conf,fields[i],i==0?3:5,i==0?orders:''),extend:16,leftMain:'',topMain:'',tip:4,adjustSizeMode:48,textWrap:1,hAlign:zhibiao[0].hAlign,color:zhibiao[0].color,backColor:zhibiao[0].backColor,dispExp:defaultEdit.getEditExp4Rpx(fields[i].srcEdit,fields[i].dataType==1),formatExp:formatExp});
					var cwIdx = colWidths1.indexOf(i+1);
					rpt.cols[rpt.cols.length] = {col:i+1,type:177,width:cwIdx==-1?defaultWidth:colWidths2[cwIdx]};
				}
				rpt.rowCount = 2;
				rpt.colCount = fields.length;
			} else {
				var cwIdx = colWidths1.indexOf(1);
				rpt.cols[0] = {col:1,type:176,width:cwIdx==-1?defaultWidth:colWidths2[cwIdx]};
				for (var i=0; i<fields.length; i++) {
					rpt.cells.push({row:i+1,col:1,row2:i+1,col2:1,format:'',value:fields[i].name,valueExp:'',extend:16,leftMain:'',topMain:'',tip:5,adjustSizeMode:48,textWrap:1,hAlign:biaoti.hAlign,color:biaoti.color,backColor:biaoti.backColor,dispExp:'',formatExp:formatExp});
					rpt.cells.push({row:i+1,col:2,row2:i+1,col2:2,format:fields[i].format,value:'',valueExp:getExps(conf,fields[i],i==0?3:5,i==0?orders:''),extend:19,leftMain:'',topMain:'',tip:4,adjustSizeMode:48,textWrap:1,hAlign:zhibiao[0].hAlign,color:zhibiao[0].color,backColor:zhibiao[0].backColor,dispExp:defaultEdit.getEditExp4Rpx(fields[i].srcEdit,fields[i].dataType==1),formatExp:formatExp});
					var rhIdx = rowHeights1.indexOf(i+1);
					rpt.rows[i] = {row:i+1,type:161,height:rhIdx==-1?defaultHeight:rowHeights2[rhIdx]};
				}
				rpt.rowCount = fields.length;
				rpt.colCount = 2;
			}
		} else {
			var tops = [];
			var lefts = [];
			for (var i=0; i<conf.tops.length; i++) {
				tops.push(conf.tops[i].name);
			}
			for (var i=0; i<conf.lefts.length; i++) {
				lefts.push(conf.lefts[i].name);
			}
			var fieldOrder = "";
			if(conf.lefts.length != 0 && conf.tops.length == 0){
				for (var j=0; j<conf.fields.length; j++) {
					var fieldj = conf.fields[j];
					if(fieldj.order != 0){
						fieldOrder += fieldj.name;
						fieldOrder += "//";
						fieldOrder += fieldj.order;
						break;
					}
				}
			}
			if (!guideConf.showZongji) guideConf.showZongji = "yes";
			var showZongji = guideConf.showZongji != "no";
			var onlyZongji = fields.length==1;
			//alert(showZongji);
			
			conf.autoFields = [];
			var autoFields = conf.autoFields;
			if (showZongji) {
				for (var i=0; i<fields.length; i++) {
					var tops2 = clone(tops);
					var lefts2 = clone(lefts);
					if (fields[i]._fieldType == 'aggr' && fields[i].groups == null) {
						if (conf.isRowData) {
							//if (tops.length>0){
								var newf = clone(fields[i]);
								newf.groups = clone(lefts2);
								newf.showName = onlyZongji?resources.guide.js228:(newf.name+"-"+resources.guide.js228);
								autoFields.push(newf);
								for (var j=0; j<tops.length-1; j++) {
									lefts2.push(tops[j]);
									newf = clone(fields[i]);
									newf.groups = clone(lefts2);
									newf.showName = onlyZongji?resources.guide.js228:(newf.name+"-"+resources.guide.js228);
									autoFields.push(newf);
								}
							//}
						} else {
							//if (lefts.length>0){
								var newf = clone(fields[i]);
								newf.groups = clone(tops2);
								newf.showName = onlyZongji?resources.guide.js228:(newf.name+"-"+resources.guide.js228);
								autoFields.push(newf);
								for (var j=0; j<lefts.length-1; j++) {
									tops2.push(lefts[j]);
									newf = clone(fields[i]);
									newf.groups = clone(tops2);
									newf.showName = onlyZongji?resources.guide.js228:(newf.name+"-"+resources.guide.js228);
									autoFields.push(newf);
								}
							//}
						}
					}
				}
			}
			
			fields = fields.concat(autoFields);
			//console.log(fields.length+"---"+autoFields.length);
			//2018.11.06 hdw
			var showAggrTitle = conf.fields.length>0;

			//横向显示数据
			if (conf.isRowData) {
				//[top,left,scopeTop,scopeLeft]
				var levels = [];
				var maxTop = 0;
				if (fields.length == 0) maxTop = conf.tops.length;
				for (var i=0; i<fields.length; i++) {
					var level = [conf.tops.length,conf.lefts.length,conf.tops.length,conf.lefts.length];
					levels.push(level);
					if (fields[i]._fieldType == 'aggr' && fields[i].groups != null) {
						var max = 0;
						for (var j=0; j<fields[i].groups.length; j++) {
							var maxj = tops.indexOf(fields[i].groups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[0] = max;
						if (max>maxTop) maxTop = max;
						max = 0;
						for (var j=0; j<fields[i].groups.length; j++) {
							var maxj = lefts.indexOf(fields[i].groups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[1] = max;
					} else if (fields[i]._fieldType == 'newAnalyse') {
						var max = tops.indexOf(fields[i].newAnalyse.topLevel)+1;
						level[0] = max;
						if (max>maxTop) maxTop = max;
						max = lefts.indexOf(fields[i].newAnalyse.leftLevel)+1;
						level[1] = max;
					} else if (fields[i]._fieldType == 'analyse') {
						var fa = obj.rpxUtils.getRpxFieldByName(conf,fields[i].analyse.field);
						
						var max = 0;
						if (fa.groups != null) {
							for (var j=0; j<fa.groups.length; j++) {
								var maxj = tops.indexOf(fa.groups[j]);
								if (maxj==-1) continue;
								if (maxj+1>max) max = maxj+1;
							}
							level[0] = max;
							if (max>maxTop) maxTop = max;
							
							max = 0;
							for (var j=0; j<fa.groups.length; j++) {
								var maxj = lefts.indexOf(fa.groups[j]);
								if (maxj==-1) continue;
								if (maxj+1>max) max = maxj+1;
							}
							level[1] = max;
						}
						
						max = 0;
						for (var j=0; j<fields[i].analyse.scopeGroups.length; j++) {
							var maxj = tops.indexOf(fields[i].analyse.scopeGroups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[2] = max;
						
						max = 0;
						for (var j=0; j<fields[i].analyse.scopeGroups.length; j++) {
							var maxj = lefts.indexOf(fields[i].analyse.scopeGroups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[3] = max;
					} else maxTop = conf.tops.length;
				}
				
				rpt.rowCount = maxTop+(showAggrTitle?1:0)+(conf.lefts.length>0||fields.length>0?((showZongji?conf.lefts.length:0)+1):0);
				var firstAggrRow = maxTop+(showAggrTitle?1:0)+(conf.lefts.length>0||fields.length>0?1:0);
				rpt.colCount = conf.lefts.length+(fields.length>0?fields.length:(conf.tops.length>0?1:0));
				var cellNames = [];
				var cellRefs = [];

				for (var i=0; i<maxTop; i++) {
					if (ts != '') ts += ",";
					ts += tops[i];
					var rhIdx = rowHeights1.indexOf(i+1);
					rpt.rows[rpt.rows.length] = {row:i+1,type:161,height:rhIdx==-1?defaultHeight:rowHeights2[rhIdx]};
				}
				for (var i=0; i<conf.lefts.length; i++) {
					if (ls != '') ls += ",";
					ls += lefts[i];
					var cwIdx = colWidths1.indexOf(i+1);
					rpt.cols[rpt.cols.length] = {col:i+1,type:177,width:cwIdx==-1?defaultWidth:colWidths2[cwIdx]};
				}
				if (firstAggrRow>1 && conf.lefts.length>0) {
					var topNames = ',';
					for (var i=0; i<maxTop; i++) {
						if (i>0) topNames += ";";
						topNames += conf.tops[i].name;
					}
					var leftNames = '';
					for (var i=0; i<conf.lefts.length; i++) {
						if (i>0) leftNames += ";";
						leftNames += conf.lefts[i].name;
					}
					var aggrNames = '';
					if (fields.length == 1) aggrNames = ","+fields[0].name;
					var value11 = leftNames + "" + topNames + "" + aggrNames;
					rpt.cells.push({
						row:1 //合并格的开始行
						,col:1 //合并格的开始列
						,row2:firstAggrRow-1 //合并格的结束行
						,col2:conf.lefts.length //合并格的结束列
						,format:'' //显示格式
						,value:value11  //单元格的值
						,diagonal:36 //斜线样式，用于显示交叉表的左上格子，斜线风格, 可取值为INormalCell.LINE_NONE, INormalCell.LINE_DOTTED, INormalCell.LINE_DASHED,INormalCell.LINE_SOLID, INormalCell.LINE_DOUBLE
						,valueExp:'' //单元格的值表达式
						,extend:16 //扩展方式
						,leftMain:'' //左主格
						,topMain:'' //上主格
						,tip:"6" //提示
						,adjustSizeMode:48 //单元格大小调整模式,可取值为INormalCell.ADJUST_EXTEND, INormalCell.ADJUST_FIXED, INormalCell.ADJUST_FILL, INormalCell.ADJUST_SHRINK
						,textWrap:1 //1:自动换行
						,hAlign:biaoti.hAlign //对齐方式
						,color:biaoti.color //前景色
						,backColor:biaoti.backColor //背景色
						,dispExp:'' //显示值表达式
						,formatExp:formatExp //显示格式表达式
						});
				}
				for (var i=0; i<lefts.length; i++) {
					if (showZongji) {
						rpt.cells.push({row:firstAggrRow,col:i+1,row2:firstAggrRow+(lefts.length-i-1),col2:i+1,format:conf.lefts[i].format,value:'',valueExp:getExps(conf,conf.lefts[i],2,null,null,null,null,null,fieldOrder),extend:18,leftMain:'',topMain:'',tip:1,adjustSizeMode:48,textWrap:1,hAlign:fenzu.hAlign,color:fenzu.color,backColor:fenzu.backColor,dispExp:defaultEdit.getEditExp4Rpx(conf.lefts[i].srcEdit,conf.lefts[i].dataType==1),formatExp:formatExp});
						cellNames.push(lefts[i]);
						cellRefs.push(cellCols[i+1]+firstAggrRow);
						rpt.cells.push({row:firstAggrRow+(lefts.length-i),col:i+1,row2:firstAggrRow+(lefts.length-i),col2:lefts.length,format:conf.lefts[i].format,value:resources.guide.js228,valueExp:'',extend:18,leftMain:'',topMain:'',tip:1,adjustSizeMode:48,textWrap:1,hAlign:zongji.hAlign,color:zongji.color,backColor:zongji.backColor,dispExp:'',formatExp:''});
					} else {
						rpt.cells.push({row:firstAggrRow,col:i+1,row2:firstAggrRow,col2:i+1,format:conf.lefts[i].format,value:'',valueExp:getExps(conf,conf.lefts[i],2,null,null,null,null,null,fieldOrder),extend:18,leftMain:'',topMain:'',tip:1,adjustSizeMode:48,textWrap:1,hAlign:fenzu.hAlign,color:fenzu.color,backColor:fenzu.backColor,dispExp:defaultEdit.getEditExp4Rpx(conf.lefts[i].srcEdit,conf.lefts[i].dataType==1),formatExp:formatExp});
						cellNames.push(lefts[i]);
						cellRefs.push(cellCols[i+1]+firstAggrRow);
					}
				}
				
				
				var currCol = conf.lefts.length;
				var finalFields = [];
				var finalCells = [];
				for (var i=maxTop; i>=0; i--) {
					var counti = 0;
					for (var j=0; j<fields.length; j++) {
						var level = levels[j];
						if (level[0]!=i) continue;
						currCol++;
						counti++;
						var namej = fields[j].showName;
						if (showAggrTitle || namej) {
							var currStyle = biaoti;
							if (!namej) namej = fields[j].name;
							else currStyle = zongji;
							rpt.cells.push({row:i+1,col:currCol,row2:firstAggrRow-1,col2:currCol,format:'',value:namej,valueExp:'',extend:16,leftMain:'',topMain:'',tip:7,adjustSizeMode:48,textWrap:1,hAlign:currStyle.hAlign,color:currStyle.color,backColor:currStyle.backColor,dispExp:'',formatExp:formatExp});
							var rhIdx = rowHeights1.indexOf(i+1);
							rpt.rows[rpt.rows.length] = {row:i+1,type:161,height:rhIdx==-1?defaultHeight:rowHeights2[rhIdx]};
						}
						finalFields.push(fields[j]);
						var exp = "";
						var leftMain = level[1]>0?cellCols[level[1]]+firstAggrRow:"`0";
						var topMain = level[0]>0?cellCols[conf.lefts.length+1]+level[0]:"`0";
						if (fields[j]._fieldType == 'detail') exp = getExps(conf,fields[j],6);
						else if (fields[j]._fieldType == 'aggr') exp = getExps(conf,fields[j],4);
						else if (fields[j]._fieldType == 'analyse') {
							//exp = getExps(conf,fields[i],7,);
						}
						
						var zhibiaoj = zhibiao[j%zhibiao.length];
						if (fields[j].showName) zhibiaoj = zongji;
						var cell = {row:firstAggrRow,col:currCol,row2:firstAggrRow,col2:currCol,format:fields[j].format,value:'',valueExp:exp,extend:16,leftMain:leftMain,topMain:topMain,tip:3,adjustSizeMode:48,textWrap:1,hAlign:zhibiaoj.hAlign,color:zhibiaoj.color,backColor:zhibiaoj.backColor,dispExp:'',formatExp:formatExp};
						finalCells.push(cell);
						rpt.cells.push(cell);
						cellNames.push(fields[j].name);
						cellRefs.push(cellCols[currCol]+firstAggrRow);
						
						if (showZongji && fields[j]._fieldType == 'aggr' && lefts.length>0) {
							for (var z=0; z<lefts.length; z++){
								var cellz = {row:firstAggrRow+z+1,col:currCol,row2:firstAggrRow+z+1,col2:currCol,format:fields[j].format,value:'',valueExp:exp,extend:16,leftMain:'',topMain:'',tip:3,adjustSizeMode:48,textWrap:1,hAlign:zongji.hAlign,color:zongji.color,backColor:zongji.backColor,dispExp:'',formatExp:formatExp};
								rpt.cells.push(cellz);
							}
						}
					}
					if (i>0) {
						rpt.cells.push({row:i,col:lefts.length+1,row2:i,col2:fields.length==0?currCol+1:currCol,format:conf.tops[i-1].format,value:'',valueExp:getExps(conf,conf.tops[i-1],2),extend:19,leftMain:'',topMain:'',tip:2,adjustSizeMode:48,textWrap:1,hAlign:fenzu.hAlign,color:fenzu.color,backColor:fenzu.backColor,dispExp:defaultEdit.getEditExp4Rpx(conf.tops[i-1].srcEdit,conf.tops[i-1].dataType==1),formatExp:formatExp});
						cellNames.push(tops[i-1]);
						cellRefs.push(cellCols[lefts.length+1]+i);
					}
				}

				//console.log(cellNames);
				//console.log(cellRefs);
				var rhIdx = rowHeights1.indexOf(firstAggrRow);
				rpt.rows[rpt.rows.length] = {row:firstAggrRow,type:165,height:rhIdx==-1?defaultHeight:rowHeights2[rhIdx]};

				for (var i=0; i<finalFields.length; i++) {
					if (finalFields[i]._fieldType != 'analyse') continue;
					var aggrCell = "";
					for (var j=0; j<finalFields.length; j++) {
						if (finalFields[j].name == finalFields[i].analyse.field) {
							aggrCell = cellCols[conf.lefts.length+j+1]+firstAggrRow;
							break;
						}
					}
					var level = levels[i];
					var currCell = cellCols[conf.lefts.length+i+1]+firstAggrRow;
					var leftMain = level[3]>0?cellCols[level[3]]+firstAggrRow:"`0";
					var topMain = level[2]>0?cellCols[conf.lefts.length+1]+level[2]:"`0";
					finalCells[i].valueExp = getExps(conf,fields[i],7,null,aggrCell,leftMain,topMain,currCell);
				}

				for (var i=0; i<finalFields.length; i++) {
					if (finalFields[i]._fieldType != 'newAnalyse') continue;
					var valueExp = finalFields[i].newAnalyse.exp;
					for (var j=0; j<finalFields[i].newAnalyse.items.length; j++) {
						var itemj = finalFields[i].newAnalyse.items[j];
						var exp = "";
						if (itemj.value=='curr') exp = cellRefs[cellNames.indexOf(itemj.field)];
						else {
							exp = cellRefs[cellNames.indexOf(itemj.field)]+"[`0;`0]{"+itemj.exp+"}";
							for (var z=0; z<cellNames.length; z++) {
								exp = exp.replaceAll(cellNames[z]+resources.guide.js153,"$"+cellRefs[z]);
								exp = exp.replaceAll(cellNames[z]+resources.guide.js154,cellRefs[z]);
								exp = exp.replaceAll(cellNames[z]+resources.guide.js155,"seq($"+cellRefs[z]+")");
								exp = exp.replaceAll(cellNames[z]+resources.guide.js156,"seq("+cellRefs[z]+")");
							}
							if (itemj.aggr=='first') exp = "valueat("+exp+",0)";
							else exp = itemj.aggr+"("+exp+")";
						}
						valueExp = valueExp.replaceAll("?"+(j+1),exp);
					}
					finalCells[i].valueExp = valueExp;
				}
			//纵向显示数据
			} else {
				//[left,top,scopeLeft,scopeTop]
				var levels = [];
				var maxLeft = 0;
				if (fields.length == 0) maxLeft = conf.lefts.length;
				for (var i=0; i<fields.length; i++) {
					var level = [conf.lefts.length,conf.tops.length,conf.lefts.length,conf.tops.length];
					levels.push(level);
					if (fields[i]._fieldType == 'aggr' && fields[i].groups != null) {
						var max = 0;
						for (var j=0; j<fields[i].groups.length; j++) {
							var maxj = lefts.indexOf(fields[i].groups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[0] = max;
						if (max>maxLeft) maxLeft = max;
						max = 0;
						for (var j=0; j<fields[i].groups.length; j++) {
							var maxj = tops.indexOf(fields[i].groups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[1] = max;
					} else if (fields[i]._fieldType == 'newAnalyse') {
						var max = lefts.indexOf(fields[i].newAnalyse.leftLevel)+1;
						level[0] = max;
						if (max>maxLeft) maxLeft = max;
						max = tops.indexOf(fields[i].newAnalyse.topLevel)+1;
						level[1] = max;
					} else if (fields[i]._fieldType == 'analyse') {
						var fa = obj.rpxUtils.getRpxFieldByName(conf,fields[i].analyse.field);
						
						var max = 0;
						if (fa.groups != null) {
							for (var j=0; j<fa.groups.length; j++) {
								var maxj = lefts.indexOf(fa.groups[j]);
								if (maxj==-1) continue;
								if (maxj+1>max) max = maxj+1;
							}
							level[0] = max;
							if (max>maxLeft) maxLeft = max;
							
							max = 0;
							for (var j=0; j<fa.groups.length; j++) {
								var maxj = tops.indexOf(fa.groups[j]);
								if (maxj==-1) continue;
								if (maxj+1>max) max = maxj+1;
							}
							level[1] = max;
						}
						
						max = 0;
						for (var j=0; j<fields[i].analyse.scopeGroups.length; j++) {
							var maxj = lefts.indexOf(fields[i].analyse.scopeGroups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[2] = max;
						
						max = 0;
						for (var j=0; j<fields[i].analyse.scopeGroups.length; j++) {
							var maxj = tops.indexOf(fields[i].analyse.scopeGroups[j]);
							if (maxj==-1) continue;
							if (maxj+1>max) max = maxj+1;
						}
						level[3] = max;
					} else maxLeft = conf.lefts.length;
				}
				
				rpt.rowCount = conf.tops.length+(fields.length>0?fields.length:(conf.lefts.length>0?1:0));
				rpt.colCount = maxLeft+(showAggrTitle?1:0)+(conf.tops.length>0||fields.length>0?((showZongji?conf.tops.length:0)+1):0);
				var firstAggrCol = maxLeft+(showAggrTitle?1:0)+(conf.tops.length>0||fields.length>0?1:0);
				var cellNames = [];
				var cellRefs = [];
				
				for (var i=0; i<maxLeft; i++) {
					if (ls != '') ls += ",";
					ls += lefts[i];
					var cwIdx = colWidths1.indexOf(i+1);
					rpt.cols[rpt.cols.length] = {col:i+1,type:177,width:cwIdx==-1?defaultWidth:colWidths2[cwIdx]};
				}
				for (var i=0; i<conf.tops.length; i++) {
					if (ts != '') ts += ",";
					ts += tops[i];
					var rhIdx = rowHeights1.indexOf(i+1);
					rpt.rows[rpt.rows.length] = {row:i+1,type:161,height:rhIdx==-1?defaultHeight:rowHeights2[rhIdx]};
				}
				if (firstAggrCol>1 && conf.tops.length>0) {
					var topNames = ',';
					for (var i=0; i<conf.tops.length; i++) {
						if (i>0) topNames += ";";
						topNames += conf.tops[i].name;
					}
					var leftNames = '';
					for (var i=0; i<maxLeft; i++) {
						if (i>0) leftNames += ";";
						leftNames += conf.lefts[i].name;
					}
					var aggrNames = '';
					if (fields.length == 1) aggrNames = ","+fields[0].name;
					var value11 = leftNames + "" + topNames + "" + aggrNames;
					rpt.cells.push({row:1,col:1,row2:conf.tops.length,col2:firstAggrCol-1,format:'',value:value11,diagonal:36,valueExp:'',extend:16,leftMain:'',topMain:'',tip:6,adjustSizeMode:48,textWrap:1,hAlign:biaoti.hAlign,color:biaoti.color,backColor:biaoti.backColor,dispExp:'',formatExp:formatExp});
				}
				for (var i=0; i<conf.tops.length; i++) {
					if (showZongji) {
						rpt.cells.push({row:i+1,col:firstAggrCol,row2:i+1,col2:firstAggrCol+tops.length-i-1,format:conf.tops[i].format,value:'',valueExp:getExps(conf,conf.tops[i],2),extend:19,leftMain:'',topMain:'',tip:2,adjustSizeMode:48,textWrap:1,hAlign:fenzu.hAlign,color:fenzu.color,backColor:fenzu.backColor,dispExp:defaultEdit.getEditExp4Rpx(conf.tops[i].srcEdit),formatExp:formatExp});
						cellNames.push(tops[i]);
						cellRefs.push(cellCols[firstAggrCol]+(i+1));
						rpt.cells.push({row:i+1,col:firstAggrCol+(tops.length-i),row2:tops.length,col2:firstAggrCol+(tops.length-i),format:conf.tops[i].format,value:resources.guide.js228,valueExp:'',extend:16,leftMain:'',topMain:'',tip:2,adjustSizeMode:48,textWrap:1,hAlign:zongji.hAlign,color:zongji.color,backColor:zongji.backColor,dispExp:'',formatExp:''});
					} else {
						rpt.cells.push({row:i+1,col:firstAggrCol,row2:i+1,col2:firstAggrCol,format:conf.tops[i].format,value:'',valueExp:getExps(conf,conf.tops[i],2),extend:19,leftMain:'',topMain:'',tip:2,adjustSizeMode:48,textWrap:1,hAlign:fenzu.hAlign,color:fenzu.color,backColor:fenzu.backColor,dispExp:defaultEdit.getEditExp4Rpx(conf.tops[i].srcEdit),formatExp:formatExp});
						cellNames.push(tops[i]);
						cellRefs.push(cellCols[firstAggrCol]+(i+1));
					}
				}

				var currRow = conf.tops.length;
				var finalFields = [];
				var finalCells = [];
				for (var i=maxLeft; i>=0; i--) {
					var counti = 0;
					for (var j=0; j<fields.length; j++) {
						var level = levels[j];
						if (level[0]!=i) continue;
						currRow++;
						counti++;
						var namej = fields[j].showName;
						if (showAggrTitle || namej) {
							var currStyle = biaoti;
							if (!namej) namej = fields[j].name;
							else currStyle = zongji;
							rpt.cells.push({row:currRow,col:i+1,row2:currRow,col2:firstAggrCol-1,format:'',value:namej,valueExp:'',extend:16,leftMain:'',topMain:'',tip:7,adjustSizeMode:48,textWrap:1,hAlign:currStyle.hAlign,color:currStyle.color,backColor:currStyle.backColor,dispExp:'',formatExp:formatExp});
						}
						finalFields.push(fields[j]);
						var exp = "";
						var topMain = level[1]>0?cellCols[firstAggrCol]+level[1]:"`0";
						var leftMain = level[0]>0?cellCols[level[0]]+(conf.tops.length+1):"`0";
						if (fields[j]._fieldType == 'detail') exp = getExps(conf,fields[j],6);
						else if (fields[j]._fieldType == 'aggr') exp = getExps(conf,fields[j],4);
						else if (fields[j]._fieldType == 'analyse') {
							//exp = getExps(conf,fields[i],7,);
						}
						var zhibiaoj = zhibiao[j%zhibiao.length];
						if (fields[j].showName) zhibiaoj = zongji;
						var cell = {row:currRow,col:firstAggrCol,row2:currRow,col2:firstAggrCol,format:fields[j].format,value:'',valueExp:exp,extend:16,leftMain:leftMain,topMain:topMain,tip:3,adjustSizeMode:48,textWrap:1,hAlign:zhibiaoj.hAlign,color:zhibiaoj.color,backColor:zhibiaoj.backColor,dispExp:'',formatExp:formatExp};
						finalCells.push(cell);
						rpt.cells.push(cell);
						cellNames.push(fields[j].name);
						cellRefs.push(cellCols[firstAggrCol]+currRow);
						
						if (showZongji && fields[j]._fieldType == 'aggr' && tops.length>0) {
							for (var z=0; z<tops.length; z++){
								var cellz = {row:currRow,col:firstAggrCol+z+1,row2:currRow,col2:firstAggrCol+z+1,format:fields[j].format,value:'',valueExp:exp,extend:16,leftMain:'',topMain:'',tip:3,adjustSizeMode:48,textWrap:1,hAlign:zongji.hAlign,color:zongji.color,backColor:zongji.backColor,dispExp:'',formatExp:formatExp};
								rpt.cells.push(cellz);
							}
						}

					}
					if (i>0) {
						rpt.cells.push({row:conf.tops.length+1,col:i,row2:fields.length==0?currRow+1:currRow,col2:i,format:conf.lefts[i-1].format,value:'',valueExp:getExps(conf,conf.lefts[i-1],2),extend:18,leftMain:'',topMain:'',tip:1,adjustSizeMode:48,textWrap:1,hAlign:fenzu.hAlign,color:fenzu.color,backColor:fenzu.backColor,dispExp:defaultEdit.getEditExp4Rpx(conf.lefts[i-1].srcEdit,conf.lefts[i-1].dataType==1),formatExp:formatExp});
						cellNames.push(lefts[i-1]);
						cellRefs.push(cellCols[i]+(tops.length+1));
					}
				}

				var cwIdx = colWidths1.indexOf(firstAggrCol);
				rpt.cols[rpt.cols.length] = {col:firstAggrCol,type:177,width:cwIdx==-1?defaultWidth:colWidths2[cwIdx]};

				for (var i=0; i<finalFields.length; i++) {
					if (finalFields[i]._fieldType != 'analyse') continue;
					var aggrCell = "";
					for (var j=0; j<finalFields.length; j++) {
						if (finalFields[j].name == finalFields[i].analyse.field) {
							aggrCell = cellCols[firstAggrCol]+(conf.tops.length+j+1);
							break;
						}
					}
					var level = levels[i];
					var currCell = cellCols[firstAggrCol]+(conf.tops.length+i+1);
					var topMain = level[3]>0?cellCols[firstAggrCol]+level[3]:"`0";
					var leftMain = level[2]>0?cellCols[level[2]]+(conf.tops.length+1):"`0";
					finalCells[i].valueExp = getExps(conf,fields[i],7,null,aggrCell,leftMain,topMain,currCell);
				}
				
				for (var i=0; i<finalFields.length; i++) {
					if (finalFields[i]._fieldType != 'newAnalyse') continue;
					var valueExp = finalFields[i].newAnalyse.exp;
					for (var j=0; j<finalFields[i].newAnalyse.items.length; j++) {
						var itemj = finalFields[i].newAnalyse.items[j];
						var exp = "";
						if (itemj.value=='curr') exp = cellRefs[cellNames.indexOf(itemj.field)];
						else {
							exp = cellRefs[cellNames.indexOf(itemj.field)]+"[`0;`0]{"+itemj.exp+"}";
							for (var z=0; z<cellNames.length; z++) {
								exp = exp.replaceAll(cellNames[z]+resources.guide.js153,"$"+cellRefs[z]);
								exp = exp.replaceAll(cellNames[z]+resources.guide.js154,cellRefs[z]);
								exp = exp.replaceAll(cellNames[z]+resources.guide.js155,"seq($"+cellRefs[z]+")");
								exp = exp.replaceAll(cellNames[z]+resources.guide.js156,"seq("+cellRefs[z]+")");
							}
							if (itemj.aggr=='first') exp = "valueat("+exp+",0)";
							else exp = itemj.aggr+"("+exp+")";
						}
						valueExp = valueExp.replaceAll("?"+(j+1),exp);
					}
					finalCells[i].valueExp = valueExp;
				}
			}			
		}

		for (var i=1; i<=rpt.rowCount; i++) {
			var rhIdx = rowHeights1.indexOf(i);
			rpt.rows.push({row:i,height:rhIdx==-1?defaultHeight:rowHeights2[rhIdx]});
		}
		for (var i=1; i<=rpt.colCount; i++) {
			var cwIdx = colWidths1.indexOf(i);
			rpt.cols.push({col:i,width:cwIdx==-1?defaultWidth:colWidths2[cwIdx]});
		}
		
		rpt.lefts = ls;
		rpt.tops = ts;

		return rpt;
	};
	return obj;
}

function one_t_check_push(origin,paramsFields){
	var pushed = new Array();
	for(var o = 0; o < origin.length; o++){
		for(var p = 0; p < paramsFields.length; p++){
			if(origin[o].src == paramsFields[p].src){
				var relas = origin[o].relas;
				var name = origin[o].name;
				var dim = origin[o].dim;
				
				origin[o] = paramsFields[p];
				
				origin[o].relas = relas;
				origin[o].name = name;
				origin[o].dim = dim;
				pushed.push(paramsFields[p].srcName);
				
			}else{
				if(!paramsFields[p].relas) paramsFields[p].relas = new Array();
				if(!includes(paramsFields[p].relas,origin[o].src) && paramsFields[p].srcName == origin[o].srcName){
					paramsFields[p].relas.push(origin[o].src);
				}
				if(!includes(paramsFields[p].relas,paramsFields[p].src ) && paramsFields[p].srcName == origin[o].srcName){
					paramsFields[p].relas.push(paramsFields[p].src);
				}
			}
			
		}
	}
	return pushed;
}

function parse_params(paramsField, sgts, lefts, tops){//没有找到报表设计中相同src的参数字段，在最后处理
	var pf = paramsField;
	if( sgts.tables.length>1 ){//多表,使用规则：必须同维度；免去判断维度是否相同
		for(var l = 0; l < lefts.length; l++){
			if(includes(lefts[l].relas,paramsField.src)){
				//参数是维度字段
				pf = lefts[l];
				if (paramsField.where.conf != null && paramsField.where.conf.length>0){
					var where = whereUtils.getExp(paramsField.where.conf, "", 1).replaceAll("_dimFieldName_",paramsField.name);
					if(sgts.dimWhere && sgts.dimWhere != '') sgts.dimWhere += " AND ";
					sgts.dimWhere += "("+where+")";
				}
				break;
			}
		}
		for(var t = 0; t < tops.length; t++){
			if(includes(tops[t].relas,paramsField.src)){
				//参数是维度字段
				pf = tops[l];
				if (paramsField.where.conf != null && paramsField.where.conf.length>0){
					var where = whereUtils.getExp(paramsField.where.conf, "", 1).replaceAll("_dimFieldName_",paramsField.name);
					if(sgts.dimWhere && sgts.dimWhere != '') sgts.dimWhere += " AND ";
					sgts.dimWhere += "("+where+")";
				}
				break;
			}
		}
		//若不是维字段则不添加条件
	}else{//单表
		var jObj = dqlQuery.confUtils.getInfosObj(paramsField.src);
		var tj = getItemByAttr(sgts.tables,jObj.firstTable,"table");
		if(sgts.tableWhere == null) sgts.tableWhere = "";
		if(tj){//当属于当前表，直接添加条件
			if(sgts.tableWhere && sgts.tableWhere != '') sgts.tableWhere += " AND ";
			sgts.tableWhere += "("+whereUtils.getExp(paramsField.where.conf, tj.alias+".", 1)+")";
		}//否则不添加
	}
}

function includes(a,v){
	for(var s1 in a){
		if(a[s1] == v) {
			return true;
		}
	}
	return false;
}

function getMobileRpxOrder(f){
	var divCells = f[0].contentDocument.getElementsByClassName('divCell');
	var reportOrder = new Array();
	for(var i = 0; i < divCells.length; i++){
		var div = divCells[i];
		if($(div).find('.singleArea').length > 0){
			reportOrder.push($(div).find('.singleArea').attr('confname'));
		}
	}
	return reportOrder;
}

function getCalcFieldAlianField_Types(ds,fexp){
	var fields = ds.fields;
	var s = "";
	for(var i = 0; i < fields.length; i++){
		if(fields[i].newField != 1 && fexp.indexOf(fields[i].name) >= 0){
			if(s.length > 0) s += ",";
			s += fields[i].name+":"+fields[i].dataType;
		}
	}
	return s;
}

function hasTableInDP(recordedFields,dsWhere){
	var tempDsWhere = new Array();
	var dsWhere2 = dsWhere.concat();
	for(var d = 0; d < dsWhere.length; d++){
		console.log(dsWhere[d]);
		for(var r = 0; r < recordedFields.length; r++){
			if(dsWhere[d].fieldInfo){//不是and or
				if(dsWhere[d].fieldInfo.disp.split('.')[0] == recordedFields[r].split(';;;;')[0]){
					if(tempDsWhere.length > 0){
						tempDsWhere.push(dsWhere[d-1]);
					}
					tempDsWhere.push(dsWhere[d]);
					break;//一个条件只做一次
				}
			}
		}
	}
	return tempDsWhere;
}

/*function findSameValueIn2Array(recordedFields,dsWhereFields){
	//正则表达式，验证数据连续重复
	var reg = /,(.+)\1+/gim;
	//去掉数组1中重复的数据
	recordedFields=trimSameData(recordedFields);
	//去掉数组2中重复的数据
	dsWhereFields=trimSameData(dsWhereFields);
	//连接两数组中的元素
	var item = recordedFields.concat(dsWhereFields);
	//进行排序，使用系统的元素排列在一起
	item.sort();
	//存储两个数组相同元素的数组
	var sameDataArray=[];
	//从第二个元素开始遍历数组,与前者比较
	for(var i=1;i<item.length;i++){
		//判断与前面的元素是否相同，且是否已经保存到sameDataArray数组了
		if(item[i]==item[i-1] && sameDataArray[sameDataArray.length-1]!=item[i]){
			sameDataArray.push(item[i]);//添加两个数组相同的元素
		}
	}
	return sameDataArray;
}

function trimSameData(array){
	//正则表达式，验证数据连续重复
	var reg = /,(.+)\1+/gim;
	var arrayStr=","+array.sort().toString()+",";
	//考虑这样的字符串怎么去重 ,1,1,3,3,34,4,4,5,8,9,9,
	// 你就知道这里为什么要使用while循环了
	while(reg.test(arrayStr)){

	arrayStr=arrayStr.replace(reg,",$1");
	}
	arrayStr=arrayStr.slice(1,arrayStr.length-1);
	return arrayStr.split(",");
}
*/