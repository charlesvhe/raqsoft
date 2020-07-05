//srcDs:{fields:[{name:'f1',type:1}...],resource:{rpxData:null,type:1根据id获得数据/2dataSource及dql/3dataSource及sql,id:'数据来源ID，后台根据这个ID提供数据',dataSource:'',dql:'',sql:''}}
//items:[{id:1,type:1原始字段/2计算字段/3聚合字段/4条件/5切片条件/6复杂条件,dataType:'',datas:[示例数据，用于切片],parentId:0表示根,name:'',edit:'editStyleName',content:1原始字段/2计算字段表达式/3{field:原始或计算字段,aggr:sum/count/countd...}/4{whereConf}/5{field:原始或计算字段,disp:'中国、美国',code:'1,2'}/6复杂条件表达式}...]
//confs:[{type:1自定义分析报表/2模板报表,name:'报表名称',dialog:{open:0/1,top:100,left:100,width:500,height:400},reportId:'',rsId:'',structType:1:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表,template:'',autoCalc:0/1,isRowData:1,lefts:[{name:'',macroName:'',srcItems:[itemId0,itemId1],exp:'itemId0/itemId1',aggrExp:'sum(itemId0)/sum(itemId1)',use:1,order:0无序/1升序/2降序}],tops:[],fields:[],wheres:[{item:itemId}]}...] 调序、排序、改名
//editStyles:[{name:'ed1',type:1inputbox/2passwordbox/3checkbox/4calendar/5radio/6whereedit/7select/8tree,content:{}}]
var rpxData = {srcDs:null,items:[],confs:[],editStyles:[],maxId:0,currConf:"",currAggr:''};
var reportData = rpxData;
var dialogCount = 1;
 
var rpx = {
	cache : {
		reports : []
	}
	,toString : function() {
		return JSON.stringify(rpxData).replaceAll('"','<d_q>');
	}
	,rpxBak : null
	,before : function(obj) {
		rpx.rpxBak = rpxData;
		rpxData = obj;
	}
	,after : function() {
		rpxData = rpx.rpxBak;
	}
	,load : function(str) {
		if (str) {
			rpxData = JSON.parse(str.replaceAll('<d_q>','"'));
			for (var i=0; i<rpxData.confs.length; i++) {
				if (rpxData.confs[i].dialog.open == 1) rpx.refreshReport(rpxData.confs[i].name, false, false);
			}
		} else rpxData = {srcDs:null,items:[],confs:[],editStyles:[],maxId:0};
		rpx.refresh();
	}
	,init : function(dataId,str) {
		var src = JSON.parse(str.replaceAll('<d_q>','"'));
		rpx.setSrcDs({fields:[],resource:{rpxData:src,type:1,id:dataId}}, true);
		rpx.refresh();
	}
	,getDfxExps : function(exceptWhereItem, confObj) {
		//var dataId = "data"+new Date().getTime();
		//var calcs = "\"aa\"+说明:a1<;>\"bb\"+a1:a2";
		//var filters = "!like(a1,\"*软*\")<;>!like(a2,\"*软*\")";
		//var fields = "说明,a1<;>说明,a2";
		//var resultExp = "groups(说明:A;count(a2):B;1)";
		//var resultExp = "id("+item.name+";100)";
		var dataId = null;
		var resultExp = "";
		if (exceptWhereItem) resultExp = "id("+exceptWhereItem.name+";100)";
		var datas = [];
		datas[0] = rpxData;
		var di = rpxData.srcDs.resource.rpxData;
		while (di != null && di != '') {
			datas[datas.length] = di;
			di = di.srcDs.resource.rpxData;
		}
		var calcs = null;
		var filters = null;
		var fields = null;
		if (!confObj) confObj = rpx.getCurrConf();
		var types = '';
		for (var i=datas.length-1; i>=0; i--) {
			var di = datas[i];
			rpx.before(di);
			var conf = rpx.getCurrConf();
			if (dataId == null) dataId = rpxData.srcDs.resource.id;
			var calc = "";
			var filter = "";
			for (var j=0; j<di.items.length; j++) {
				var itemj = di.items[j];
				if (itemj.type == 2) {
					if (calc != "") calc += ",";
					calc += itemj.content + ":" + itemj.name;
				}
			}
			for (var j=0; j<conf.wheres.length; j++) {
				var itemj = rpx.getItem(conf.wheres[j].item);
				var parentItem = rpx.getItem(itemj.parentId);;
				var code = itemj.content.code;
				if (itemj.type == 5) {
					if (code.length>0 && exceptWhereItem != parentItem) {
						code = JSON.stringify(code);
						if (filter != "") filter += " && ";
						if (code.indexOf('"')>=0) filter += "("+code+".pos(string("+parentItem.name+"))>0)";
						else filter += "("+code+".pos("+parentItem.name+")>0)";
					}
				} else if (itemj.type == 4) {
					//TODO
				}
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
			
			if (i == 0 && !exceptWhereItem) {
				//var resultExp = "groups(说明:A;count(a2):B;1)";
				if (confObj.tops.length==0 && confObj.lefts.length==0 && confObj.fields.length==0) return null;
				if (confObj.type == 1 || confObj.type == 2) {
					//var existAggr = false;
					//var existNoAggr = false;
					var groups = '';
					var aggrs = '';
					var existItems = [];
					for (var j=0; j<confObj.fields.length; j++) {
						for (var z=0; z<confObj.fields[j].srcItems.length; z++) {
							var itemz = rpx.getItem(confObj.fields[j].srcItems[z]);
							if (existItems.indexOf(itemz.id)>=0) continue;
							existItems[existItems.length] = itemz.id;
							if (itemz.type == 3) {
								if (aggrs != '') aggrs += ',';
								aggrs += itemz.content.aggr + "(" + itemz.content.field + "):" + itemz.name;
							} else {
								if (groups != '') groups += ',';
								groups += itemz.name;
							}
							types += "," + itemz.name + ":" + itemz.dataType;
						}
					}
					var isGroup = false;
					for (var j=0; j<confObj.tops.length; j++) {
						for (var z=0; z<confObj.tops[j].srcItems.length; z++) {
							var itemz = rpx.getItem(confObj.tops[j].srcItems[z]);
							if (existItems.indexOf(itemz.id)>=0) continue;
							existItems[existItems.length] = itemz.id;
							if (itemz.type == 3) {
								alert("分组分析时，分组不能是聚合数据");
								return;
							} else {
								if (groups != '') groups += ',';
								groups += itemz.name;
							}
							types += "," + itemz.name + ":" + itemz.dataType;
						}
						isGroup = true;
					}
					for (var j=0; j<confObj.lefts.length; j++) {
						for (var z=0; z<confObj.lefts[j].srcItems.length; z++) {
							var itemz = rpx.getItem(confObj.lefts[j].srcItems[z]);
							if (existItems.indexOf(itemz.id)>=0) continue;
							existItems[existItems.length] = itemz.id;
							if (itemz.type == 3) {
								alert("分组分析时，分组不能是聚合数据");
								return;
							} else {
								if (groups != '') groups += ',';
								groups += itemz.name;
							}
							types += "," + itemz.name + ":" + itemz.dataType;
						}
						isGroup = true;
					}
					//查询数据时
					//if (existNoAggr && existAggr) {
						//alert("聚合、非聚合的数据不能同时计算");
						//return null;
					//}
					if (aggrs=='' && !isGroup) {
						resultExp = "new("+groups+").fetch(10000)";
					} else {
						resultExp = "groups("+groups+";"+aggrs+";100)";
					}
				} else {
					//TODO 自定义rpx
					//return null;
				}
			}
			
			rpx.after();
		}
		if (types.length>0) types = types.substring(1);
		return {calcs:calcs,filters:filters,fields:fields,resultExp:resultExp,dataId:dataId,types:types};
	}
	,setSrcDs : function(srcDs, isObj) {
		if (!isObj) {
			srcDs = srcDs.replaceAll("<d_q>", "\"");
			srcDs = JSON.parse(srcDs);
		}
		rpxData.srcDs = srcDs;
		rpxData.confs[0] = {type:1,name:'报表名称',reportId:'r'+new Date().getTime(),rsId:'rs'+new Date().getTime(),template:'',show:1,lefts:[],tops:[],fields:[],wheres:[],isRowData:1};
		if (srcDs.resource.type == 1 && srcDs.resource.rpxData != '' && (srcDs.fields == null || srcDs.fields.length == 0)) {
			var obj = srcDs.resource.rpxData;
			rpx.before(obj);
			var conf = rpx.getCurrConf();
			var fs = [];
			for (var i=0; i<conf.tops.length; i++) {
				var itemi = rpx.getItem(conf.tops[i].srcItems[0]);
				fs[fs.length] = {name:conf.tops[i].name,type:itemi.dataType};
			}
			for (var i=0; i<conf.lefts.length; i++) {
				var itemi = rpx.getItem(conf.lefts[i].srcItems[0]);
				fs[fs.length] = {name:conf.lefts[i].name,type:itemi.dataType};
			}
			for (var i=0; i<conf.fields.length; i++) {
				var itemi = rpx.getItem(conf.fields[i].srcItems[0]);
				if (conf.fields[i].use != 1) continue;
				fs[fs.length] = {name:conf.fields[i].name,type:itemi.dataType};
			}
			rpx.after();
			srcDs.fields = fs;
		} else if (srcDs.resource.type == 2) {
			srcDs.resource.dql = srcDs.resource.dql.replaceAll('"',"<dq>").replaceAll("<sq>","'");
		}
		for (var i=0; i<srcDs.fields.length; i++) {
			var id = rpxData.maxId++;
			var dataType = srcDs.fields[i].type;
			//if (!dataType) dataType = 2;
			rpxData.items[i] = {id:id,type:1,parentId:0,name:srcDs.fields[i].name,content:srcDs.fields[i].name,dataType:dataType,datas:[]};
			if (pageName == 'data' || i<4) rpxData.confs[0].fields[i] = {name:srcDs.fields[i].name,use:1,order:0,srcItems:[id],exp:'itemId0',aggrExp:''}; 
		}
	}
	,getSrc : function(name) {
		for (var i=0; i<rpxData.srcDs.fields.length; i++) {
			var f = rpxData.srcDs.fields[i];
			if (f.name == name) return f;
		}
	}
	,getItem : function(id) {
		for (var i=0; i<rpxData.items.length; i++) {
			if (rpxData.items[i].id == id) return rpxData.items[i];
		}
	}
	,getItemByParentId : function(parentId, type) {
		for (var i=0; i<rpxData.items.length; i++) {
			if (rpxData.items[i].parentId == parentId && rpxData.items[i].type == type) return rpxData.items[i];
		}
		return null;
	}
	,getAggrItem : function(aggrigate,parentId) {
		var aggrs = [];
		if (aggrigate == 'avg') {
			aggrs = ["sum","count"];
		//} else if (aggr == 'count' || aggr == 'countd') {
		//	aggrs = ['sum'];
		} else aggrs = [aggrigate];

		var p = rpx.getItem(parentId);
		var items = [];
		for (var j=0; j<aggrs.length; j++) {
			var exist = false;
			for (var i=0; i<rpxData.items.length; i++) {
				var ii = rpxData.items[i];
				if (ii.type == 3 && ii.parentId == parentId && ii.content.aggr == aggrs[j]) {
					exist = true;
					items[j] = ii.id; 
					break;
				}
			}
			if (exist) continue;
			
			var id = rpxData.maxId++;
			var dataType = p.dataType;
			var aggr = aggrs[j];
			if (aggr == 'count' || aggr == 'countd' || aggr == 'sum') dataType = 1;
			var name = raqDt.getAggrName(aggrs[j]);
			if (["sum","count","countd"].indexOf(aggr)>=0) name = p.name+name;
			else name = name + p.name;
			var ii = {id:id,type:3,parentId:parentId,name:name,content:{field:p.name,aggr:aggr},dataType:dataType,datas:[]};
			rpxData.items[rpxData.items.length] = ii;
			items[j] = ii.id; 
		}
		return items;
	}
	,removeItem : function(id){
		//
		for (var i=0; i<rpxData.confs.length; i++) {
			var conf = rpxData.confs[i];
			for (var j=conf.tops.length-1; j>=0; j--) {
				for (var z=0; z<conf.tops[j].srcItems.length; z++) {
					if (conf.tops[j].srcItems[z] == id) conf.tops.remove(conf.tops[j]);
					break;
				}
			}
			for (var j=conf.lefts.length-1; j>=0; j--) {
				for (var z=0; z<conf.lefts[j].srcItems.length; z++) {
					if (conf.lefts[j].srcItems[z] == id) conf.lefts.remove(conf.lefts[j]);
					break;
				}
			}
			for (var j=conf.fields.length-1; j>=0; j--) {
				for (var z=0; z<conf.fields[j].srcItems.length; z++) {
					if (conf.fields[j].srcItems[z] == id) conf.fields.remove(conf.fields[j]);
					break;
				}
			}
			for (var j=conf.wheres.length-1; j>=0; j--) {
				if (conf.wheres[j].item == id) conf.wheres.remove(conf.wheres[j]);
			}
		}
		rpxData.items.remove(rpx.getItem(id));
	}
	,getConf : function(name) {
		for (var i=0; i<rpxData.confs.length; i++) {
			if (rpxData.confs[i].name == name) return rpxData.confs[i];
		}
	}
	,isGroupConf : function(conf) {
		if (conf.tops.length>0||conf.lefts.length>0) return true;
		for (var i=0;i<conf.fields.length; i++) {
			if (rpx.getItem(conf.fields[i].srcItems[0]).type==3) return true;
		}
		return false;
	}
	,newConfItem : function(itemId,aggr, conf){
		var item = rpx.getItem(itemId);
		var aggr = '';
		$('#aggrs').find('div').each(function(){
			if($(this).hasClass('ui-selected')) aggr = $(this).attr('aggr');
		});
		if (aggr == '') {
			return {name:rpx.getNewConfFieldName(conf,item.name),srcItems:[itemId],item:itemId,use:1,order:0,exp:"itemId0",aggrExp:""};
		} else {
			var exp = "itemId0";
			var aggrExp = aggr+"(itemId0)";
			if (["count","countd"].indexOf(aggr)>=0) {
				aggrExp = 'sum(itemId0)';
			} else if ("avg" == aggr) {
				exp = 'itemId0/itemId1';
				aggrExp = 'sum(itemId0)/sum(itemId1)';
			}
			var name = raqDt.getAggrName(aggr);
			if (["sum","count","countd"].indexOf(aggr)>=0) name = item.name+name;
			else name = name + item.name;
			var items = rpx.getAggrItem(aggr,itemId);
			return {name:rpx.getNewConfFieldName(conf,name),srcItems:items,use:1,order:0,exp:exp,aggrExp:aggrExp};
		}
	}
	,getCurrConf : function() {
		if (rpxData.confs.length == 0) return null;
		if (rpxData.currConf === undefined || rpxData.currConf == "") {
			rpxData.currConf = rpxData.confs[0].name;
			return rpxData.confs[0];
		}
		return rpx.getConf(rpxData.currConf);
	}
	,getConfField : function(conf, itemId) {
		for (var i=0; i<conf.fields.length; i++) {
			for (var z=0; z<conf.fields[i].srcItems.length; z++) {
				if (conf.fields[i].srcItems[z] == itemId) return conf.fields[i];
			}
		}
	}
/*
	,getConfItemName : function(confItem) {
		if (confItem.name === undefined || confItem.name == "") {
			var item = rpx.getItem(confItem.item);
			confItem.name = item.name;
		}
		return confItem.name;
	}
*/
	,getNewConfFieldName : function(conf, name) {
		var names = [];
		for (var i=0; i<conf.fields.length; i++) {
			if (conf.fields[i] == null) continue;
			names[names.length] = conf.fields[i].name;
		}
		for (var i=0; i<conf.tops.length; i++) {
			names[names.length] = conf.tops[i].name;
		}
		for (var i=0; i<conf.lefts.length; i++) {
			names[names.length] = conf.lefts[i].name;
		}
		var count = 1;
		if (names.indexOf(name) == -1) return name;
		while (names.indexOf(name+count)>=0) {
			count++;
		}
		return name+count;
	}
	,isItemUsed : function(itemId) {
		var used = 0;
		for (var i=0; i<rpxData.confs.length; i++) {
			for (var j=0; j<rpxData.confs[i].lefts.length; j++) {
				for (var z=0; z<rpxData.confs[i].lefts[j].srcItems.length; z++) {
					if (rpxData.confs[i].lefts[j].srcItems[z] == itemId) used++;
				}
			}
			for (var j=0; j<rpxData.confs[i].tops.length; j++) {
				for (var z=0; z<rpxData.confs[i].tops[j].srcItems.length; z++) {
					if (rpxData.confs[i].tops[j].srcItems[z] == itemId) used++;
				}
			}
			for (var j=0; j<rpxData.confs[i].fields.length; j++) {
				for (var z=0; z<rpxData.confs[i].fields[j].srcItems.length; z++) {
					if (rpxData.confs[i].fields[j].srcItems[z] == itemId) used++;
				}
			}
			for (var j=0; j<rpxData.confs[i].wheres.length; j++) {
				if (rpxData.confs[i].wheres[j].item == itemId) used++;
			}
		}
		return used;
	}
	,getSameSlice : function(parentId, code) {
		for (var i=0; i<rpxData.items.length; i++) {
			var ii = rpxData.items[i];
			var code2 = ii.content.code;
			if (ii.type != 5 || code.length !=code2.length) continue;
			var same = true;
			for (var j=0; j<code.length; j++) {
				if (code2.indexOf(code[j])==-1) {
					same = false;
					break;
				}
			}
			if (same) return ii;
		}
		return null;
	}
	,setSlice : function(parentId, selectDatas,sliceItem, conf, refresh){
		if (sliceItem == null) {
			if (selectDatas.length == 0) return;
			if (rpx.getSameSlice(parentId, selectDatas) != null) return;
		} else {
			var used = rpx.isItemUsed(sliceItem.id);
			if (used<=1) {
				rpx.removeItem(sliceItem.id);
				for (var z=0; z<conf.wheres.length; z++) {
					if (conf.wheres[z].item == sliceItem.id) conf.wheres.remove(conf.wheres[z]);
				} 
			}
			if (selectDatas.length == 0) {
				setTimeout(function(){rpx.refresh()},100);
				return;
			}
		}
		var id = rpxData.maxId++;
		var si = {id:id,type:5,parentId:parentId,name:"",content:{field:"",disp:[],code:[]}};
		rpxData.items[rpxData.items.length] = si;
		si.content.code = selectDatas;
		si.content.disp = selectDatas; //TODO
		conf.wheres.push({item:id});
		if (refresh) setTimeout(function(){rpx.refresh()},100);
	}
	//TODO 完善删除left、top、where等
	,getCalcFields : function(conf) {
		var exp = "";
		for(var i=0; i<conf.fields.length; i++) {
			var confi = conf.fields[i];
			var item = rpx.getItem(confi.srcItems[0]);
			if (item.type == 2) {
				if (exp!="") exp += ",";
				exp += item.content + ":" + item.name;
			}
		}
		return exp;
	}
	,refresh : function(noCalc, noRefreshDialog) {
		//alert(1);
		//items/reports/reportConf/reportDiv
//		if (areas == "" || !areas) areas = "items;reports;reportConf";
		
		var conf = rpx.getCurrConf();
		var reportConf = $("#reportConf");
		var reportConfBut = $("#reportConfBut");
		//reportConf.css("opacity","0.8");
		var t2 = $('<table border=0 style="border:0;border-collapse:collapse;border:0px;margin:0px 0 10px 10px;" cellspacing=0 cellpadding=0></table>');
		var t3 = $('<table id="reportConfTable" border=0 style="border:0;border-collapse:collapse;border:0px;" cellspacing=0 cellpadding=0></table>');
		reportConf.html("").append(t3);
		t3.append('<tr><td></td><td style=""></td><td></td></tr>');
		var t3tds = t3.find('td');
		t3tds.css({"vertical-align":"top",'background-color':'#FFFFFF'});
		if ($('#reportConfBut').html() == '') {
			$('#reportConfBut').append('<img isOpen="1" style="vertical-align:-5px;cursor:pointer;margin:5px 5px;" src="'+contextPath + '/dl/img/guide/36.png"><span style="vertical-align:5px;font-weight:bold;">报表分析设置器</span>');
			$('#reportConfBut').find('img').click(function(){
				if ($(this).attr('isOpen') == "1") {
					$(this).attr('isOpen',"0").attr('src',contextPath + '/dl/img/guide/37.png');
					reportConf.animate({left:0-reportConf.width()+"px"},500);
					reportConfBut.animate({width:130+"px"},500);
					
				} else {
					$(this).attr('isOpen',"1").attr('src',contextPath + '/dl/img/guide/36.png');
					reportConf.animate({left:"0px"},500);
					reportConfBut.animate({width:reportConf.width()+"px"},500);
				}
			});
		}
		var confsDiv = $("<div style='margin-left: 10px;'></div>");
		var confsTitle = $("<div style='border-right:1px solid #E4E4E4;padding:5px;'><div style='font-weight:bold;color:#333333;float:left;padding:5px 20px 5px 0;'>报表列表</div></div>");
		confsDiv.append(confsTitle);
		for (var i=rpxData.confs.length-1; i>=0; i--) {
			var confi = rpxData.confs[i];
			if (confi.autoCalc != 0) confi.autoCalc = 1;
			var sty = "border-right:1px solid #E4E4E4;";
			if (rpxData.currConf == confi.name) sty = "border-top:1px solid #E4E4E4;border-bottom:1px solid #E4E4E4;border-left:1px solid #E4E4E4;";
			confsDiv.append("<div style='padding:5px;cursor:pointer;"+sty+"' confName='"+confi.name+"'><img style='vertical-align:-2px;cursor: pointer;' lock=1 src='"+contextPath+(confi.autoCalc==1?"/dl/img/guide/17.png":"/dl/img/guide/18.png")+"'><span style='padding:0 20px 0 5px;vertical-align:1px;'>"+confi.name+"</span><img modify=1 style='vertical-align:-2px;cursor:pointer;margin:0 5px;' src='"+contextPath + "/dl/img/guide/31.png'><img style='vertical-align:-2px;cursor:pointer;margin:0 5px;' del=1 src='"+contextPath + "/dl/img/guide/13.png'></div>")
		}
		if (rpxData.confs.length == 0) {
			confsDiv.append("<div style='font-size:14px;padding:5px;border-right:1px solid #E4E4E4;'>请创建新的报表</div>");
		}
		confsDiv.find('img[lock=1]').click(function(){
			var cn = $(this).parent().attr('confName');
			var thisConf = rpx.getConf(cn);
			thisConf.autoCalc = thisConf.autoCalc==1?0:1;
			//$(this).attr('src',contextPath+(thisConf.autoCalc==1?"/dl/img/guide/17.png":"/dl/img/guide/18.png"));
			//if (thisConf.autoCalc == 1) {
		    	rpxData.currConf = cn;
				rpx.refresh();
			//}
		});
		confsDiv.find('span').click(function(){
			var cn = $(this).parent().attr('confName');
			//var conf = rpx.getConf(cn);
	    	rpxData.currConf = cn;
			rpx.refresh(true);
		});
		confsDiv.find('img[del=1]').click(function(){
			var cn = $(this).parent().attr('confName');
			rpxData.confs.remove(rpx.getConf(cn));
			if (rpxData.currConf == cn) {
				rpxData.currConf = '';
			}		
			var reports = rpx.cache.reports;
			for (var i=0; i<reports.length; i++) {
				if (reports[i].name == cn) {
					reports[i].dlg.close();
					reports[i].dlg.DOM.wrap.remove();
					reports.remove(reports[i]);
					break;
				}
			}
			rpx.refresh();
		});
		confsDiv.find('img[modify=1]').click(function(){
			var cn = $(this).parent().attr('confName');
			zIndexBak = artDialog.defaults.zIndex;
			var dlg = art.dialog({
				id : dialogCount++,
				title : '修改报表名称',
			    content: '<div style="margin:30px;"><input type="text" id="modifyNameTxt" value="'+cn+'"></div>'
			    ,ok : function() {
					var n = $.trim($('#modifyNameTxt').val());
			    	if (n == '') {
			    		alert("名称不能为空");
			    		return false;
			    	}
			    	//$(t2tds[0]).find('div[confName="'+cn+'"]').html(n);
			    	rpx.getConf(cn).name = n;
			    	rpxData.currConf = n;
					var reports = rpx.cache.reports;
					for (var i=0; i<reports.length; i++) {
						if (reports[i].name == cn) {
							//reports[i].dlg.title(n);
							//reports[i].name = n;
							reports[i].dlg.close();
							reports[i].dlg.DOM.wrap.remove();
							reports.remove(reports[i]);
							break;
						}
					}
					artDialog.defaults.zIndex = zIndexBak;
			    	setTimeout('rpx.refresh()',1);
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
			    ,width : '200px'
				,height : '80px'
				,opacity : 0.1
				,padding : '2px 2px'
				,zIndex : 21000
			});
		});
		$(t3tds[0]).append(confsDiv);
		var addReport = $('<div style="margin-right:10px;color:#FFFFFF;background-color:#64CE67;padding:5px;float:right;cursor:pointer;">新增报表</div>');
		addReport.click(function(){
			var cn = "报表名称";
			var count = 1;
			while (rpx.getConf(cn) != null) {
				cn = "报表名称"+count;
				count++;
			}
			zIndexBak = artDialog.defaults.zIndex;
			var dlg = art.dialog({
				id : dialogCount++,
				title : '添加报表',
			    content: '<div style="margin:10px;"><input type="text" id="addConfName" style="width:180px;" value="'+cn+'"></div>'
			    	+'<div style="margin:10px;"><select id="addConfType" style="width:180px;"><option value=1>自定义分析报表</option><option value=2>预定义模板报表</option></select></div>'
			    ,ok : function() {
					var n = $.trim($('#addConfName').val());
			    	if (n == '') {
			    		alert("名称不能为空");
			    		return false;
			    	}
			    	var type = $.trim($('#addConfType').val());
					rpxData.confs[rpxData.confs.length] = {type:type,name:n,reportId:'r'+new Date().getTime(),rsId:'rs'+new Date().getTime(),show:1,template:'',lefts:[],tops:[],fields:[],wheres:[],isRowData:1};
			    	rpxData.currConf = n;
			    	artDialog.defaults.zIndex = zIndexBak;
			    	rpx.refresh();
			    }
			    ,cancel : function() {
			    	artDialog.defaults.zIndex = zIndexBak;
			    	return true;
			    }
			    ,okVal : '确定'
			    ,cancelVal : '取消'
			    ,lock : true
			    ,duration : 0
			    ,width : '210px'
				,height : '90px'
				,opacity : 0.1
				,padding : '2px 2px'
				,zIndex : 21000
			});
		});
			
		$(confsTitle).append(addReport).append('<div style="clear:both;"></div>');
		$(t3tds[2]).css('border-right','1px solid #E4E4E4').append(t2);
		if (conf == null) return; 

		
		
		t2.append('<tr><td style="padding-top:5px;"></td><td rowspan=2 style="padding:5px 10px 0;"></td></tr><tr><td></td></tr>');
		var t2tds = t2.find('td');
		t2tds.css({"vertical-align":"top"});
		
		var aggrs = $("<div id='aggrs' style='padding: 2px 0 2px 5px;background-color:#F8F8F8;border:1px solid #E4E4E4;'></div>");
		var items = $("<div id='items' style='overflow:auto;'></div>");
		$(t2tds[1]).append(aggrs);
		var aggrsDef = [{name:'',title:'原始值'},{name:'sum',title:'求和'},{name:'count',title:'计数'},{name:'avg',title:'平均'},{name:'max',title:'最大'},{name:'min',title:'最小'},{name:'countd',title:'值计数'}];
		for (var i=0; i<aggrsDef.length; i++) {
			var uis = rpxData.currAggr==aggrsDef[i].name?" class='ui-selected'":"";
			aggrs.append("<div"+uis+" style='float:left;cursor:pointer;' aggr='"+aggrsDef[i].name+"'>"+aggrsDef[i].title+"</div>");
		}
		aggrs.find('div').css({"margin":"2px","padding":"3px"}).click(function(){
			aggrs.find('div').each(function(){
				$(this).removeClass('ui-selected');
			});
			$(this).addClass('ui-selected');
			rpxData.currAggr = $(this).attr('aggr');
		});
		aggrs.append('<div style="clear:both;"></div>');
		//aggrs.selectable();
		
		$(t2tds[1]).append(items);
		for (var i=0; i<rpxData.items.length; i++) {
			var item = rpxData.items[i];
			if (item.type > 2) continue;
			var itemDiv = $("<div style='padding:3px 5px;border:1px solid #E4E4E4;border-top:0;' id='"+item.id+"'></div>");
			items.append(itemDiv);
			var item0 = $("<div iType=1 itemId='"+item.id+"' style='margin:0 5px;width:80px;'>"+item.name+"</div>");
			itemDiv.append('<img src="'+contextPath+'/dl/img/guide/27.png" style="float:left;">');
			itemDiv.append(item0);
			item0.css({"float":"left"});
			//var aggrs = raqDt.getAggr(item.dataType);
			//for (var j=0; j<aggrs.length; j++) {
			//	var itemj = $("<div iType=2 style='' parentId='"+item.id+"' aggr='"+aggrs[j]+"'>"+raqDt.getAggrName(aggrs[j])+"</div>");
			//	itemDiv.append(itemj);
			//	itemj.css({"float":"left","margin":"2px","padding":"2px"});
			//}
			var item5 = null;
			for (var j=0; j<conf.wheres.length; j++) {
				var itemj = rpx.getItem(conf.wheres[j].item);
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
			itemDiv.append("<div style='clear:both'></div>");
		}
		items.css('height','');
		if (items.height()>350) items.css('height','350px');
		
		var div0 = null;
		var div1 = null;
		var div2 = null;
		var div3 = null;
		var divs = [];
		var table = null;
		if (conf.type == 1) { //自定义报表
			$(t2tds[0])
				.append("<div style='float:left;font-weight:bold;padding-top:5px;'>设计报表</div>")
				.append("<div isRowData=1 style='color:#FFFFFF;background-color:#64CE67;padding:5px;float:right;cursor:pointer;margin-left:30px;'>"+(conf.isRowData==0?"纵向显示数据":"横向显示数据")+"</div>")
				.append('<div style="clear:both;"></div>');
			$(t2tds[0]).find('div[isRowData]').click(function(){
				conf.isRowData = conf.isRowData==0?1:0;
				rpx.refresh();
				$(t2tds[0]).find('div[isRowData]').html(conf.isRowData==0?"纵向显示数据":"横向显示数据");
			});

			table = $('<table border=0 style="border:0;border-collapse:collapse;border:0px;margin:10px 0;width:100%;" cellspacing=0 cellpadding=0></table>');
			var tbody = $('<tbody><tr><td style="border:1px solid #E4E4E4;"><div cType=1>&nbsp;</div></td><td style="border:1px solid #E4E4E4;"><div cType=2></div></td></tr><tr><td style="border:1px solid #E4E4E4;"><div cType=3></div></td><td style="border:1px solid #E4E4E4;"><div cType=4></div></td></tr></tbody>');
			table.append(tbody);
			$(t2tds[2]).append(table);
			
			var tds = tbody.find('td');
			div0 = $(tds[0]).find('div');
			div1 = $(tds[1]).find('div');
			div2 = $(tds[2]).find('div');
			div3 = $(tds[3]).find('div');
			
			tbody.find("div").css({width:'100%',height:'100%'});
			for (var i=0; i<conf.tops.length; i++) {
				var topi = conf.tops[i];
				var divi = $("<div iType=5 idx='"+i+"'>"+topi.name+"</div>");
				div1.append(divi);
				var img = topi.order==0?"19.png":(topi.order==1?"14.png":"10.png");
				var orderImg = $('<img confItemName="'+topi.name+'" style="vertical-align:-3px;cursor:pointer;margin:0 2px;" src="'+contextPath + '/dl/img/guide/'+img+'">');
				orderImg.click(function(e){
					var confItemName = $(this).attr("confItemName");
					for (var i=0; i<conf.tops.length; i++) {
						if (conf.tops[i].name == confItemName) {
							var o = conf.tops[i].order;
							o = o==0?1:(o==1?2:0);
							conf.tops[i].order = o;
							//var img2 = o==0?"19.png":(o==1?"14.png":"10.png");
							//$(this).attr('src',contextPath + '/dl/img/guide/'+img2);
							break;
						}
					}
					rpx.refresh();
				});
				divi.append(orderImg);
				var delImg = $('<img confItemName="'+topi.name+'" style="vertical-align:-3px;cursor:pointer;margin:0 2px;" src="'+contextPath + '/dl/img/guide/13.png">');
				delImg.click(function(e){
					var confItemName = $(this).attr("confItemName");
					for (var i=0; i<conf.tops.length; i++) {
						if (conf.tops[i].name == confItemName) {
							conf.tops.remove(conf.tops[i]);
							break;
						}
					}
					rpx.refresh();
				});
				divi.append(delImg);
			}
			if (conf.tops.length == 0) div1.html("<div id='confHints' style='height:18px;width:100%;margin:3px;padding:3px;color:lightgray'>上表头</div>");
			for (var i=0; i<conf.lefts.length; i++) {
				var lefti = conf.lefts[i];
				var divi = $("<div iType=6 idx='"+i+"'>"+lefti.name+"</div>");
				div2.append(divi);
				var img = lefti.order==0?"19.png":(lefti.order==1?"14.png":"10.png");
				var orderImg = $('<img confItemName="'+lefti.name+'" style="vertical-align:-3px;cursor:pointer;margin:0 2px;" src="'+contextPath + '/dl/img/guide/'+img+'">');
				orderImg.click(function(e){
					var confItemName = $(this).attr("confItemName");
					for (var i=0; i<conf.lefts.length; i++) {
						if (conf.lefts[i].name == confItemName) {
							var o = conf.lefts[i].order;
							o = o==0?1:(o==1?2:0);
							conf.lefts[i].order = o;
							//var img2 = o==0?"19.png":(o==1?"14.png":"10.png");
							//$(this).attr('src',contextPath + '/dl/img/guide/'+img2);
							break;
						}
					}
					rpx.refresh();
				});
				divi.append(orderImg);
				var delImg = $('<img confItemName="'+lefti.name+'" style="vertical-align:-3px;cursor:pointer;margin:0 2px;" src="'+contextPath + '/dl/img/guide/13.png">');
				delImg.click(function(e){
					var confItemName = $(this).attr("confItemName");
					for (var i=0; i<conf.lefts.length; i++) {
						if (conf.lefts[i].name == confItemName) {
							conf.lefts.remove(conf.lefts[i]);
							break;
						}
					}
					rpx.refresh();
				});
				divi.append(delImg);
			}
			if (conf.lefts.length == 0) div2.html("<div id='confHints' style='height:100%;width:40px;margin:3px;padding:3px;color:lightgray'>左表头</div>");
			for (var i=0; i<conf.fields.length; i++) {
				var fieldi = conf.fields[i];
				var divi = $("<div iType=7 idx='"+i+"'>"+fieldi.name+"</div>");
				div3.append(divi);
				if (conf.tops.length == 0 && conf.lefts.length == 0) {
					var img = fieldi.order==0?"19.png":(fieldi.order==1?"14.png":"10.png");
					var orderImg = $('<img confItemName="'+fieldi.name+'" style="vertical-align:-3px;cursor:pointer;margin:0 2px;" src="'+contextPath + '/dl/img/guide/'+img+'">');
					orderImg.click(function(e){
						var confItemName = $(this).attr("confItemName");
						for (var i=0; i<conf.fields.length; i++) {
							if (conf.fields[i].name == confItemName) {
								var o = conf.fields[i].order;
								o = o==0?1:(o==1?2:0);
								conf.fields[i].order = o;
								//var img2 = o==0?"19.png":(o==1?"14.png":"10.png");
								//$(this).attr('src',contextPath + '/dl/img/guide/'+img2);
								break;
							}
						}
						rpx.refresh();
					});
					divi.append(orderImg);
				}
				var delImg = $('<img confItemName="'+fieldi.name+'" style="vertical-align:-3px;cursor:pointer;margin:0 2px;" src="'+contextPath + '/dl/img/guide/13.png">');
				delImg.click(function(e){
					var confItemName = $(this).attr("confItemName");
					for (var i=0; i<conf.fields.length; i++) {
						if (conf.fields[i].name == confItemName) {
							conf.fields.remove(conf.fields[i]);
							break;
						}
					}
					rpx.refresh();
				});
				divi.append(delImg);
			}
			if (conf.fields.length == 0) div3.html("<div id='confHints' style='margin:3px;padding:3px;color:lightgray'>数据区</div>");
			if (conf.isRowData === undefined) conf.isRowData = 1;
			var div567s = table.find('div[iType=5],div[iType=6],div[iType=7]');
			div567s.css({margin:"3px",padding:"3px",cursor:"move"});
			var div5s = table.find('div[iType=5]');
			var div6s = table.find('div[iType=6]');
			div6s.css({float:'left'});
			div2.append('<div style="clear:both;"></div>');
			var div7s = table.find('div[iType=7]');
			if (conf.isRowData == 1) {
				div7s.css({float:'left'});
				div3.find("#confHints").css({float:'left'});
				div3.append('<div style="clear:both;"></div>');
			}
			div3.css('width','100%');
			div3.css('height','100%');
			//if (div3.height()>80) div3.css('height','80px');
			if (div3.width()>400) div3.css('width','400px');

		} else {
			$(t2tds[0])
				.append("<div style='float:left;font-weight:bold;padding:5px 20px 5px 0;'>关联数据</div>")
				.append("<div isRowData=1 style='float:right;margin:3px 0 0 20px;cursor:pointer;'><select id='allReportStyles'></select></div>")
				.append('<div style="clear:both;"></div>');
			var reportStyles = allReportStyles.split(',');
			var currDesc = "";
			var styles = $('#allReportStyles');
			for (var i=0; i<reportStyles.length; i++) {
				var ni = reportStyles[i];
				var desc = "";
				if (ni.indexOf(";")>=0) {
					desc = ni.substring(ni.indexOf(";")+1);
					ni = ni.substring(0,ni.indexOf(";"));
				} else continue;

				var select = (conf.template==ni?' selected':'');
				styles.append('<option value="'+reportStyles[i]+'"'+select+'>'+ni+'</option>');
				if (conf.template == '') {
					conf.template = ni;
					currDesc = desc.split(";");		
					conf.fields = [];
					for (var j=0; j<currDesc.length; j++) conf.fields[j] = null;
				} else if (conf.template==ni) currDesc = desc.split(";");
			}
			//currDesc = currDesc.split(";");		
			if (reportStyles.length == 0) {
				styles.append('<option value="">没有报表模板可用</option>');
			} else {
				styles.change(function(){
					var ni = $(this).val();
					var desc = ni.substring(ni.indexOf(";")+1).split(';');
					conf.template = ni.substring(0,ni.indexOf(";"));
					conf.fields = [];
					for (var i=0; i<desc.length; i++) conf.fields[i] = null;
					rpx.refresh();
				});
				
				table = $('<table border=0 style="width:100%;border:0;border-collapse:collapse;border:0px;margin:10px 0;" cellspacing=0 cellpadding=0></table>');
				var tbody = $('<tbody></tbody>');
				table.append(tbody);
				$(t2tds[2]).append(table);
				for (var i=0; i<currDesc.length; i++) {
					var fi = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					if (conf.fields[i] != null) fi = conf.fields[i].name;
					var macroName = currDesc[i];
					if (macroName.indexOf("(")>=0) macroName = macroName.substring(0,macroName.indexOf("("));
					else if (macroName.indexOf(":")>=0) macroName = macroName.substring(0,macroName.indexOf(":"));
					//.replaceAll(":number","").replaceAll(":string","").replaceAll(":date","");
					var tri = $('<tr><td>'+macroName+'</td><td><div style="width:100%;height:100%;" cType=6 macroName="'+macroName+'" idx='+i+'>'+fi+'</div></td></tr>');
					tbody.append(tri);
					divs[i] = tri.find('div');
				}
				tbody.find("td").css('padding','3px').css('border','1px solid #E4E4E4');
			}
		}

		items.find('div[iType=3] span,div[iType=4] span').css({"cursor":"pointer"}).click(function(){
			var item = rpx.getItem($(this).parent().parent().attr('id'));
			var disps = null; // TODO
			var sliceItem = null;
			var sliceItemId = $(this).parent().attr("itemId");
			var selectDatas = [];
			if (sliceItemId) {
				sliceItem = rpx.getItem(sliceItemId);
				selectDatas = sliceItem.content.code;
			}
			var func = function(data) {
				if (data == 'empty') {
					return;
				}				
				if (data.indexOf('info:')==0) {
					alert(data.substring(5));
					return;
				}
				data = JSON.parse(data);
				item.datas = data;
				var callback5 = function(selectDatas) {	
					rpx.setSlice(item.id, selectDatas,sliceItem, conf, true);
				}
				dialog.slice(item.datas, selectDatas, disps, callback5);
			}
			var dataId = "data"+new Date().getTime();
			calcDfxData(item, conf, func);
		});


		var changeFunc = function( event, ui ) {
			var container = ui.placeholder.parent();
			var cType = container.attr('cType');
			div1.find('#confHints').css("visibility","visible");
			div2.find('#confHints').css("visibility","visible");
			div3.find('#confHints').css("visibility","visible");

			var aggr = '';
			$('#aggrs').find('div').each(function(){
				if($(this).hasClass('ui-selected')) aggr = $(this).attr('aggr');
			});
			
			if (ui.item.attr("iType") == 7) {
				var fieldi = conf.fields[ui.item.attr("idx")];
				var item = rpx.getItem(fieldi.srcItems[0]);
				if (item.type == 3 && cType != 4) {
					ui.placeholder.css('display',"none");
					return;
				}
			} else if ((ui.item.attr("iType") == 1 && aggr != '') && (cType == 2 || cType == 3)) {
				ui.placeholder.css('display',"none");
				return;
			}

			if (conf.type == 1) {
				div1.parent().attr('sel',0).css("background-color","");
				div2.parent().attr('sel',0).css("background-color","");
				div3.parent().attr('sel',0).css("background-color","");
				//console.log("----1");
				
				ui.placeholder.css({'display':"block",padding:"3px",margin:"3px","background-color":"red"});
				//alert (ui.helper.css('width'));
				ui.placeholder.css('width',ui.helper.width()+"px");
				if ((cType == 4 && conf.isRowData == 1) || cType == 3) ui.placeholder.css("float","left");
				else ui.placeholder.css("float","");
				container.find('#confHints').css("visibility","hidden");
				container.parent().attr('sel',1).css("background-color","#FFFF88");
			} else {
				for (var i=0; i<divs.length; i++) {
					divs[i].parent().attr('sel',0).css("background-color","");
				}
				
				ui.placeholder.css({'display':"block",padding:"3px",float:"",margin:"3px","background-color":"red"});
				//alert (ui.helper.css('width'));
				ui.placeholder.css('width',ui.helper.width()+"px");
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
			if (table == null) return;
			var confItems = table.find('div[iType]');
			var newTops = [];
			var newLefts = [];
			var newFields = [];
			//console.log("confOverFunc");
			for (var i=0; i<confItems.length; i++) {
				var ii = $(confItems[i]);
				var iType = ii.attr("iType");
				var itemId = ii.attr("itemId");
				var idx = ii.attr("idx");
				var parentId = ii.attr("parentId");
				var aggr = ii.attr("aggr");
				var item = null;
				var obj = null;
				if (iType == 1) {
					obj = rpx.newConfItem(itemId,aggr,conf);
				} else {
					if (iType == 5) obj = conf.tops[idx];
					else if (iType == 6) obj = conf.lefts[idx];
					else if (iType == 7) obj = conf.fields[idx];
				}
				item = rpx.getItem(obj.srcItems[0]);
				if ((ii.parent()[0] == div1[0] || ii.parent()[0] == div2[0]) && item.type == 3) {
					ii.remove();
					return;
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
			conf.tops = newTops;
			conf.lefts = newLefts;
			conf.fields = newFields;
			setTimeout("rpx.refresh()",1);
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
				var iType = div.attr("iType");
				var item = null;
				var str = "";
				if (iType == 1) {
					var item = rpx.getItem(div.attr('itemId'));
					var aggr = '';
					$('#aggrs').find('div').each(function(){
						if($(this).hasClass('ui-selected')) aggr = $(this).attr('aggr');
					});
					
					if (aggr != '') {
						str = raqDt.getAggrName(aggr);
						if (["sum","count","countd"].indexOf(aggr)>=0) str = item.name+str;
						else str = str + item.name;
					} else str = item.name;
				}
			    var helper = $("<div style='margin:3px;padding:3px;background-color:#F8F8F8;'>"+str+"</div>");
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

		$( "div[cType=2],div[cType=3],div[cType=4]" ).sortable({
			connectWith: "div[cType=2],div[cType=3],div[cType=4]"
			,tolerance : "pointer"
			,items : "div[iType]"
		    ,change:changeFunc
		    ,start:changeFunc
		    ,stop:confOverFunc
		});
		
	    $( "div[cType=5]" ).droppable({
	        accept: "div[iType=3]",
	        //activeClass: "ui-state-hover",
	        //hoverClass: "ui-state-active",
	        drop: function( event, ui ) {
	    		divWhere.attr("sel",0).parent().css("background-color","");
	    		var iType = ui.draggable.attr('iType');
	    		if (iType == 3) {
	    			var item = rpx.getItem(ui.draggable.attr('itemId'));
	    			var p = rpx.getItem(ui.draggable.attr('parentId'));
	    			for (var i=0; i<conf.wheres.length; i++) {
	    				var item2 = rpx.getItem(conf.wheres[i].item);
	    				if (item2.type == 5) {
			    			var p2 = rpx.getItem(item2.parentId);
			    			if (p2.id == p.id) conf.wheres.remove(conf.wheres[i]);
	    				}
	    			}
	    			conf.wheres[conf.wheres.length] = {item:item.id};
	    			setTimeout("rpx.refresh()",1);
	    		}
	        }
	    });

	    if (conf.type == 2) {
		    table.find('div[cType=6]').droppable({
		        accept: "div[iType=1]",
		        //activeClass: "ui-state-hover",
		        //hoverClass: "ui-state-active",
		        drop: function(event,ui) {
		    		var itemId = ui.draggable.attr("itemId");
		    		var idx = $(this).attr("idx");
		    		var macroName = $(this).attr("macroName");
		    		//console.log(111);
		    		//console.log(idx);
		    		//console.log(333);
					var aggr = ui.draggable.attr("aggr");
		    		var obj = rpx.newConfItem(itemId,aggr,conf);
		    		obj.macroName = macroName;
		    		conf.fields[idx] = obj;
		    		setTimeout("rpx.refresh();",1);
		    	}
		    	,over: function(event, ui) {
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
	    
	    var ht = $(window).height()-reportConf.height();
	    if (ht<80) ht = 80;
	    reportConf.css("top",ht+"px");
		reportConfBut.css("top",ht-30+"px").css("width",reportConf.width()+"px");

		confsDiv.append('<div style="border-right:1px solid #E4E4E4;height:'+(confsDiv.parent().height()-confsDiv.height())+'px;"></div>');

	    rpx.refreshReport(rpx.getCurrConf().name, noCalc, noRefreshDialog);
	}
	,refreshReport : function(confName, noCalc, noRefreshDialog) {
		if (noRefreshDialog) return;
		var reports = rpx.cache.reports;
		for (var i=0; i<rpxData.confs.length; i++) {
			var confi = rpxData.confs[i];
			if (confName && confi.name != confName) continue;
			var dlg = null;
			for (var j=0; j<reports.length; j++) {
				if (reports[j].name == confi.name) {
					dlg = reports[j].dlg;
				}
			}
			if (!confi.dialog) confi.dialog = {open:1,top:random(200,10),left:random(500,40),width:550,height:300};
			if (dlg == null) {
				dlg = art.dialog({
					id : dialogCount++,
					title : confi.name,
				    content: '<iframe name="'+confi.name+'" confName="'+confi.name+'" style="border:0;width:100%;height:100%;"></iframe>'
				    ,ok : null
				 	,close: function () {
				        this.hide();
				        for (var z=0; z<reports.length; z++) {
				        	if (reports[z].dlg == this) {
				        		var confz = rpx.getConf(reports[z].name);
				        		if (confz == null) break;
				        		confz.dialog.open = 0;
				        		break;
				        	} 
				        }
				        dialogs.remove(this);
				        return false;
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
					,padding : '0px 0px'
					,fixed : true
					,top:confi.dialog.top+'px'
					,left:confi.dialog.left+'px'
					//,drag: false
				});
				//dlg.follow('#reportConfTable');
				reports[reports.length] = {dlg:dlg,name:confi.name};
			} else {
				artDialog.defaults.zIndex++;
				dlg.show();
				dlg.DOM.wrap.css('z-index',artDialog.defaults.zIndex);
        		confi.dialog.open = 1;
				
				//alert(wrap.css('z-index'));
			}
			if (dialogs.indexOf(dlg)==-1) dialogs[dialogs.length] = dlg;

			if (confi.autoCalc==1 && !noCalc) doCalcDfxData(confi);
		}
	}
	,refreshView : function() {
		$('#addCalcFieldDiv').css('display','block');
		var tr = $('#viewTableHead');
		if (tr.length == 0) {
			var t = $('<table id="viewTable" border=0 style="border:0;border-collapse:collapse;border:0px;" cellspacing=0 cellpadding=0></table>');
			$('#resultDiv').html('').append(t);
			tr = $("<tr style='height:24px;background-color:#F8F8F8;'></tr>");
			t.append(tr);
		}
		tr.html('');
		for (var i=0; i<rpxData.confs[0].fields.length; i++) {
			var f = rpxData.confs[0].fields[i];
			var item = rpx.getItem(f.srcItems[0]);
			//if (item)
			var td = $("<td itemId='"+item.id+"'></td>");
			td.append('<input type="checkbox"'+(f.use==1?' checked':'')+' value=""><span style="vertical-align:2px;margin:0 5px;">'+item.name+'</span>');
			td.find('input').css('cursor','pointer').click(function(){
				var itemId = $(this).parent().attr('itemId');
				rpx.getConfField(rpxData.confs[0], itemId).use = this.checked?1:0;
			});
			if (item.type == 2) {
				td.append("<img style='float:right;' src='"+contextPath+"/dl/img/guide/13.png'/>");
				td.find('img').css('cursor','pointer').click(function(){
					var itemId = $(this).parent().attr('itemId');
					rpx.removeItem(itemId);
					rpx.refreshView();
					getPageRows(0);
				});
				
				td.find('span').css('cursor','pointer').click(function(){
					var itemId = $(this).parent().attr('itemId');
					rpx.editCalcField(itemId);
				});
			}
			tr.append(td);
		}
		
		try {
			if (hideWhere != 1) hideWhere = 0;
		} catch(e) {hideWhere=0;}
		if (typeof(hideWhere) !== undefined && hideWhere == 1) {
			$('#whereDiv').css('visibility','hidden');
		} else {
			var str = '<img src="'+contextPath+'/dl/img/guide/7.png" style="vertical-align:-4px;margin:1px;cursor:pointer;">';
			var wid = rpxData.confs[0].wheres[0].item;
			var wItem = rpx.getItem(wid);	
	 		var whereDisp = whereUtils.getDisp(wItem.content);
	 		if (whereDisp != '') str += whereDisp;
	 		else str += "添加条件";	
			$('#whereDiv').html("<div style='cursor:pointer;border:1px solid #E4E4E4;background-color:#F8F8F8;float:left;height:25px;padding:5px 5px 0;' id='whereBut'>"+str+"</div><div style='clear:both;'></div>");
			$('#whereBut').click(function(){
				var fields = [];
				var initField = null;
				for (var n=0; n<rpxData.items.length; n++) {
					var itemn = rpxData.items[n];
					if (itemn.type != 1) continue;
					var srcn = rpx.getSrc(itemn.name);
					var edit = null;
					if (srcn.type>=3) edit = {type:3,calendarType:(srcn.type==3?2:(srcn.type==4?3:1))};
					fields[fields.length] = {disp:itemn.name,dataType:srcn.type,edit:edit,exp:itemn.content,valueType:1,values:""};
				}
				function transWhereInfo(infos, dimFieldName, isHaving) {
					var iObj = getInfosObj(infos);
					var disp = iObj.alias1;
					if (dimFieldName) disp = dimFieldName;
					return 
				}
	
				var saveFunc = function () {
				 	var disp = whereUtils.getDisp(cache.where.wheres);
				 	if (disp == '') return false;
					wItem.content = cache.where.wheres;
					rpx.refreshView();
					var filter = whereUtils.getExp(wItem.content,"",3,2);
					if (filter != viewPage.filter) changeFilter(filter);
					return true;
			     };
			     var clearFunc = function () {
					wItem.content = [];
					rpx.refreshView();
					var filter = whereUtils.getExp(wItem.content,"",3,2);
					if (filter != viewPage.filter) changeFilter(filter);
			        return true;
			    }
			    whereUtils.openWhereDialog(saveFunc,clearFunc);
				whereUtils.refresh(fields, initField, JSON.parse(JSON.stringify(wItem.content)));
			});
		}
	}
	,initPage : function(srcDs) {
		rpxData.srcDs = srcDs;
	}
	,editCalcField : function(itemId) {
		var item = null;
		if (itemId) item = rpx.getItem(itemId);
		//if (itemId == null)
		zIndexBak = artDialog.defaults.zIndex;
		var fs = "";
		for (var i=0; i<rpxData.confs[0].fields.length; i++) {
			var f = rpxData.confs[0].fields[i];
			var item2 = rpx.getItem(f.srcItems[0]);
			if (item2.type != 1) continue;
			fs += "<div style='float:left;cursor:pointer;padding:3px 10px 3px 0;'>"+item2.name+"</div>";
		}
		fs += "<div style='clear:both;'></div>";
		var dlg = art.dialog({
			id : dialogCount++,
			title : '编辑计算字段',
		    content: '<div style="margin:10px;">名　　称：<input type="text" id="calcFieldName" value="'+(item==null?"":item.name)+'" style="width:120px;"></div>'
		    	+'<div style="margin:10px;">数据类型：<select id="calcFieldType" style="width:120px;">'+raqDt.getDataTypeOptions(2)+'</select></div>'
		    	+'<div style="margin:10px;">表达式　：<input type="text" id="calcFieldExp" value="'+(item==null?"":item.content)+'" style="width:250px;"></div>'
		    	+'<div style="margin:10px;" id="calcFieldSrcs">'+fs+'</div>'
		    ,ok : function() {
				var n = $.trim($('#calcFieldName').val());
		    	if (n == '') {
		    		alert("名称不能为空");
		    		return false;
		    	}
				var e = $.trim($('#calcFieldExp').val());
		    	if (e == '') {
		    		alert("表达式不能为空");
		    		return false;
		    	}
				var t = $.trim($('#calcFieldType').val());
		    	if (item == null) {
					var id = rpxData.maxId++;
					rpxData.items[rpxData.items.length] = {id:id,type:2,dataType:t,parentId:0,name:n,content:e};
					rpxData.confs[0].fields[rpxData.confs[0].fields.length] = {name:rpx.getNewConfFieldName(rpxData.confs[0],n),srcItems:[id],item:id,use:1,order:0,exp:"itemId0",aggrExp:""};
		    	} else {
		    		rpx.getConfField(rpxData.confs[0],item.id).name = n;
		    		item.name = n;
		    		item.content = e;
		    	}
		    	rpx.refreshView();
		    	getPageRows(0);
		    }
		    ,cancel : function() {
		    	artDialog.defaults.zIndex = zIndexBak;
		    	return true;
		    }
		    ,okVal : '确定'
		    ,cancelVal : '取消'
		    ,lock : true
		    ,duration : 0
		    ,width : '400px'
			,height : '200px'
			,opacity : 0.1
			,padding : '2px 2px'
			,zIndex : 21000
		});
		if (item != null) $('#calcFieldType').val(item.dataType);
		$('#calcFieldSrcs').find('div').click(function(){
			$('#calcFieldExp').val($('#calcFieldExp').val()+" "+$(this).html());
		});
	}
}

function doCalcDfxData(confi) {
	var success = function(data, finish){
		if (data.indexOf('error:')==0) {
			if (data.indexOf('null')>=0) {
				alert('报表已超时失效，请访问查询页面重新查询！');
			} else alert(data.substring(6));
			return;
		}
		
		//if ($('#showResultType').attr('v') == 'right') {
		
		var form = $('#frameForm');
		if (form.length == 0) {
			form = $('<form id="frameForm" method="post" accept-charset="UTF-8"></form>');
			$('body').append(form);					
		}
		form.html('');
		var url = contextPath+"/dl/jsp/showDfxReport.jsp?reportId=" + confi.rsId+"&isOlap=no";
		form.attr('action',url);
		form.attr('target', confi.name);
		form.append('<input type="hidden" name="confName" value="'+confi.name+'">');
		form.append('<input type="hidden" name="finish" value="'+finish+'">');
		form[0].submit();

		//$('iframe[confName="'+confi.name+'"]').attr('src', &confName="+encodeURIComponent(confi.name));
			//currRightShow = 'report';
		//} else window.open(contextPath+showReportPage+"?rid=" + rid+"&isOlap="+isOlap);
	}
	var finish = "0";
	var func1 = function(d1) {
		if (d1 == 'empty') {
			$('iframe[confName="'+confi.name+'"]').attr('src', "");
			return;
		}
		if (d1.indexOf('error:')==0) {
			alert(d1.substring(6));
			$('iframe[confName="'+confi.name+'"]').attr('src', "");
			return;
		}
		d1 = eval('('+d1+')');
		finish = d1.finish;
		//1：单条记录，全是统计字段； 2：明细报表；3：分组及交叉报表
		var structType = 0;  
		var tops = '';
		for (var j=0; j<confi.tops.length; j++) {
			var topj = confi.tops[j];
			var exp = topj.exp;
			for (var z=0; z<topj.srcItems.length; z++) {
				var itemz = rpx.getItem(topj.srcItems[z]);
				exp = exp.replaceAll("itemId"+z,itemz.name);
			}
			
			var order = "";
			if (topj.order != 0) order = (topj.order==1?(";"+exp+":1"):(";"+exp+":-1"));
			else order = (";"+exp+":0");
			exp = "ds1.group(" + exp + order + ")"
			if (tops != '') tops += '<;>';
			tops += topj.name+"<,>"+exp;
		}
		var lefts = '';
		for (var j=0; j<confi.lefts.length; j++) {
			var leftj = confi.lefts[j];
			var exp = leftj.exp;
			for (var z=0; z<leftj.srcItems.length; z++) {
				var itemz = rpx.getItem(leftj.srcItems[z]);
				exp = exp.replaceAll("itemId"+z,itemz.name);
			}
			var order = "";
			if (leftj.order != 0) order = (leftj.order==1?(";"+exp+":1"):(";"+exp+":-1"));
			else order = ";"+exp+":0";
			exp = "ds1.group(" + exp + order + ")"
			if (lefts != '') lefts += '<;>';
			lefts += leftj.name+"<,>"+exp;
		}
		
		if (tops != '' || lefts != '') structType = 3;
		else {
			structType = 1;
			for (var j=0; j<confi.fields.length; j++) {
				var fieldj = confi.fields[j];
				if (fieldj.aggrExp == '') {
					structType = 2;
					break;
				}
			}
		}
		confi.structType = structType;

		var orders = '';
		for (var j=0; j<confi.fields.length; j++) {
			var fieldj = confi.fields[j];
			var exp = fieldj.exp;
			if (structType == 1) {
			} else if (structType == 2) {
				if (fieldj.order != 0) {
					if (orders != '') orders += ",";
					orders += fieldj.name+":"+(fieldj.order==1?1:-1);
				}
			} else if (structType == 3) {
			}
		}
		
		var fields = '';
		for (var j=0; j<confi.fields.length; j++) {
			var fieldj = confi.fields[j];
			var exp = fieldj.exp;
			if (structType == 1) {
				exp = fieldj.aggrExp;
				for (var z=0; z<fieldj.srcItems.length; z++) {
					var itemz = rpx.getItem(fieldj.srcItems[z]);
					exp = exp.replaceAll("itemId"+z,"ds1."+itemz.name);
				}
				//exp = "=" + exp;
			} else if (structType == 2) {
				//if (fieldj.aggrExp != '') exp = fieldj.aggrExp; 
				for (var z=0; z<fieldj.srcItems.length; z++) {
					var itemz = rpx.getItem(fieldj.srcItems[z]);
					exp = exp.replaceAll("itemId"+z,itemz.name);
				}
				if (j == 0) exp = "ds1.select(" + exp + ";"+orders+")";
				else exp = "ds1."+exp;
			} else if (structType == 3) {
				if (fieldj.aggrExp != '') exp = fieldj.aggrExp; 
				for (var z=0; z<fieldj.srcItems.length; z++) {
					var itemz = rpx.getItem(fieldj.srcItems[z]);
					exp = exp.replaceAll("itemId"+z,"ds1."+itemz.name);
				}
				exp = exp;
			}
			
			if (fields != '') fields += '<;>';
			fields += fieldj.name+"<,>"+exp+"<,>"+fieldj.order;
		}
		
		//TODO
		
		$.ajax({
			type : 'POST',
			async : true,
			url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
			data: {action:2,oper:'calcReport',reportId:confi.reportId,rsId:confi.rsId,title:confi.name,reportType:confi.type,tops:tops,lefts:lefts,fields:fields,orders:orders,structType:structType,isRowData:confi.isRowData},
			//confs:[{type:1自定义分析报表/2模板报表,name:'报表名称',reportId:'',template:'',show:0/1,isRowData:1,lefts:[{name:'',item:itemId,use:1,order:0无序/1升序/2降序}],tops:[],fields:[],wheres:[{item:itemId}]}...] 调序、排序、改名
			success: success
		});
	}
	var func2 = function(d1) {
		d1 = eval('('+d1+')');
		finish = d1.finish;
		var fields = "";
		for (var j=0; j<confi.fields.length; j++) {
			var fj = confi.fields[j];
			if (fj == null) {
				$('iframe[confName="'+confi.name+'"]').attr('src', "");
				return;
			}
			if (j>0) fields += "<;>";
			fields += fj.macroName+"<,>"+fj.name;
		}
		
		$.ajax({
			type : 'POST',
			async : true,
			url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
			data: {action:2,oper:'calcReport',reportId:confi.reportId,rsId:confi.rsId,title:confi.name,reportType:confi.type,fields:fields,template:confi.template},
			//confs:[{type:1自定义分析报表/2模板报表,name:'报表名称',reportId:'',template:'',show:0/1,isRowData:1,lefts:[{name:'',item:itemId,use:1,order:0无序/1升序/2降序}],tops:[],fields:[],wheres:[{item:itemId}]}...] 调序、排序、改名
			success:success
		});
	}
	if (confi.type == 2) {
		if (confi.fields.length == 0) {
			$('iframe[confName="'+confi.name+'"]').attr('src', "");
			return;
		}
		for (var j=0; j<confi.fields.length; j++) {
			var fj = confi.fields[j];
			if (fj == null) {
				$('iframe[confName="'+confi.name+'"]').attr('src', "");
				return;
			}
		}
	}
	calcDfxData(null, confi, confi.type==1?func1:func2);			
}

function calcDfxData(item, conf, callback) {
	var r = rpx.getDfxExps(item, conf);
	if (r == null) {
		callback("empty");
		return;
	}
	//1结果返回给前台,2结果转成DataSet保存起来
	var cacheType = 1;
	var rsId = "where";
	if (item == null) {
		rsId = conf.rsId;
		cacheType = 2;
	}
	var calcs = r.calcs;//"\"aa\"+说明:a1<;>\"bb\"+a1:a2";
	var filters = r.filters;//"!like(a1,\"*软*\")<;>!like(a2,\"*软*\")";
	var fields = r.fields;//"说明,a1<;>说明,a2";
	var resultExp = r.resultExp;
	var dataId = r.dataId;

	//var resultExp = "groups(说明:A;count(a2):B;1)";
	//console.log(r);
	//getIds("d:/temp/a1",,,,);
	
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'calc',rsId:rsId,dataId:dataId,cacheType:cacheType,calcs:calcs,filters:filters,fields:fields,resultExp:resultExp,types:r.types},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			callback(data);
			//alert(data);
		}
	});
}



$(document).ready(function(){
	if ("dfxReport" == pageName) {
	} else if ("data" == pageName) {
		if (tableNames.length>0) {
			var select = $('<select></select>');
			for (var i=0; i<tableNames.length; i++) {
				select.append('<option value="'+tableNames[i]+'">'+tableNames[i]+'</option>');
			}
			$('#tableNameSpan').css('visibility','visible').append(select);
			//alert(select.val());
			select.val(currTable);
			//alert(select.val());
			select.change(function(){
				currTable = $(this).val();
				//alert(select.val());
				var filter = whereUtils.getExp([],"",3,2);
				changeFilter(filter,function(){
					window.location.href = selfUrl+"?dataId="+dataId;
				});
			});
		}
		refreshStatus();
		$('#currPage').keyup(function(event){
			if(event.keyCode != 13) return;
			var v = parseInt($(this).val());
			if (isNaN(v)) v = 1;
			var totalPage = parseInt(viewPage.loadedRow/viewPage.pageRow+"");
			if (v<0) v = 1;
			else if (v>totalPage) v = totalPage;
			if (v != $(this).val()) $(this).val(v);
			var shift = v-viewPage.currPage;
			if (shift != 0) getPageRows(shift);
		});
	}
});

var dialog = {
	slice : function(datas, selectDatas, disps, cb) {
		zIndexBak = artDialog.defaults.zIndex;
		var dlg = art.dialog({
			id : dialogCount++,
			title : '选择数据值',
		    content: '<div id="sliceDatas" style="margin:30px;overflow:auto;height:90%;"></div>'
	    	,button: [
    	         {
    	             name: '保存',
    	             callback: function() {
    	 				var r = [];
    					$( "#sliceDatas .ui-selected" ).each(function() {
    						var v = $(this).attr("value");
    						if (v == '') return;
    						r[r.length] = raqDt.toString(v);
    				    });
    					//if (r.length == datas.length) r = [];
    					//alert(r);
    			    	artDialog.defaults.zIndex = zIndexBak;
    					cb(r);
    				},
    	            focus: true
    	         },
    	         {
    	             name: '清除并关闭',
    	             callback: function() {
    	 				var r = [];
    			    	artDialog.defaults.zIndex = zIndexBak;
    					cb(r);
    				}
    	         },
    	         {
    	             name: '取消'
    	         }
    	     ]
		    //,ok : function() {
		    //}
 		    ,cancel : function() {
		    	artDialog.defaults.zIndex = zIndexBak;
		    	return true;
		    }
		    ,okVal : '确定'
		    ,cancelVal : '取消'
		    ,lock : true
		    ,duration : 0
		    ,width : '700px'
			,height : '400px'
			,opacity : 0.1
			,padding : '2px 2px'
			,zIndex : 21000
		});
		var p = $('#sliceDatas');
		var ss1 = datas;
		var ss2 = null;
		if (disps) {
			ss2 = disps;
		}
		for (var i=0; i<ss1.length; i++) {
			var disp = ss1[i];
			if (ss2 != null) {
				disp = ss2[i] + '(' + ss1[i] + ')';
			}
			p.append('<div'+((selectDatas.length>0&&selectDatas.indexOf(ss1[i])>=0)?' class="ui-selected"':"")+' style="padding:5px;margin:2px;float:left;" disp="'+(ss2==null?"":ss2[i])+'" value="' + ss1[i] + '">'+disp+'</div>');
		}
		p.append('<div style="clear:both;"></div>');
		p.selectable({
			stop: function() {
		    }
		});
		return;
	}
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
}
function relocalReports2(dlg,w,h,l,t,time) {
	dlg.size(w,h);
	dlg.position(l,t);
	//setTimeout(function(){
	//},time+1);
}


var grpxName = "超维报表.grpx";
function saveGrpx() {
	//if ($('#saveLocalBut').attr('src').indexOf('-h') > 0) return;
	//alert(window.location.href);
	//return;
	//if (domInfos.srcs.length == 0) return;
	var json = rpx.toString();
	var name = grpxName;
	if (grpxName.indexOf('.grpx') == -1) name = grpxName + ".grpx";
	$('#downQyxForm #path').val(name);
	$('#downQyxForm #dlConf').val(json);
	$('#downQyxForm #type').val('grpx');
	$('#downQyxForm').submit();
}

var openQyxName;
function openGrpx() {
	openQyxName = $('#localQyxFile').val();
	var idx = openQyxName.lastIndexOf('/');
	if (idx == -1) idx = openQyxName.lastIndexOf('\\');
	if (idx >= 0) openQyxName = openQyxName.substring(idx + 1);
	var f = openQyxName.toLowerCase();
	if (f.indexOf('.grpx') == -1) {
		alert("请选择[.grpx]类型文件！");
		return;
	}
	//alert(f);
	$('#openQyxForm').submit();
}

function openGrpxCallback(grpx) {
	//var url = window.location.href;
	//if (url.indexOf('#') > 0) url = url.substring(0,url.indexOf('#'));
	//window.location.href = (url.indexOf('?')>0?url.substring(0,url.indexOf('?')):url) + "?qyx=" + encodeURIComponent(openQyxName);
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	var url = window.location.href;
	if (url.indexOf('?')>=0) url = url.substring(0,url.indexOf('?'));
	form.attr('action',url);
	form.attr('target', '_self');
	form.append('<input type="hidden" name="grpx" value="'+grpx+'">');
	$('body').append(form);
	form[0].submit();
}

function canDrill(reportConfName) {
	var conf = rpx.getConf(reportConfName);
	if (!rpx.isGroupConf(conf)) return false;
	return true;
}

var drillCounter = 1;
function reportCellDrill(reportConfName, topValues, leftValues, fieldValues, detail) {
	var conf = rpx.getConf(reportConfName);
	if (!rpx.isGroupConf(conf)) return;
	var n = "钻取结果" + (drillCounter++);
	var newConf = {type:1,name:n,reportId:'r'+new Date().getTime(),rsId:'rs'+new Date().getTime(),show:1,template:'',lefts:[],tops:[],fields:[],wheres:[],isRowData:1};
	rpxData.confs[rpxData.confs.length] = newConf;
	rpxData.currConf = n;
	if ((conf.tops.length + conf.lefts.length == topValues.length+leftValues.length) && !detail) detail = true;

	for (var i=0; i<conf.wheres.length; i++) {
		newConf.wheres[newConf.wheres.length] = {item:conf.wheres[i].item};
	}
	for (var i=0; i<topValues.length; i++) {
		//var parentId = rpx.getItem(conf.tops[i].srcItems[0]).parentId;
		var id = conf.tops[i].srcItems[0];
		var sliceItem = rpx.getItemByParentId(id,5);
		rpx.setSlice(id, [raqDt.toString(topValues[i])],sliceItem, newConf, false);
	}
	for (var i=0; i<leftValues.length; i++) {
		//var parentId = rpx.getItem(conf.lefts[i].srcItems[0]).parentId;
		var id = conf.lefts[i].srcItems[0];
		var sliceItem = rpx.getItemByParentId(id,5);
		rpx.setSlice(id, [raqDt.toString(leftValues[i])],sliceItem, newConf, false);
	}
	for (var i=0; i<fieldValues.length; i++) {
		var id = conf.fields[i].srcItems[0];//rpx.getItem(conf.fields[i].srcItems[0]).parentId;
		var item = rpx.getItem(id);
		if (item.type>2) continue;
		var sliceItem = rpx.getItemByParentId(id,5);
		rpx.setSlice(id, [raqDt.toString(fieldValues[i])],sliceItem, newConf, false);
	}

	//{name:'',srcItems:[itemId0,itemId1],exp:'itemId0/itemId1',aggrExp:'sum(itemId0)/sum(itemId1)',use:1,order:0无序/1升序/2降序}
	
	if (detail) {
		for (var i=0; i<rpxData.items.length; i++) {
			var ii = rpxData.items[i];
			if (ii.type>2) continue;
			var nti = {name:ii.name,srcItems:[ii.id],exp:"itemId0",aggrExp:"",use:1,order:0};
			newConf.fields[newConf.fields.length] = nti;
		}
	} else {
		for (var i=topValues.length; i<conf.tops.length; i++) {
			var ti = conf.tops[i];
			var nti = {name:ti.name,srcItems:[],exp:ti.exp,aggrExp:ti.aggrExp,use:ti.use,order:ti.order};
			newConf.tops[newConf.tops.length] = nti;
			for (var j=0; j<ti.srcItems.length; j++) {
				nti.srcItems[j] = ti.srcItems[j];
			} 
		}
		for (var i=leftValues.length; i<conf.lefts.length; i++) {
			var ti = conf.lefts[i];
			var nti = {name:ti.name,srcItems:[],exp:ti.exp,aggrExp:ti.aggrExp,use:ti.use,order:ti.order};
			newConf.lefts[newConf.lefts.length] = nti;
			for (var j=0; j<ti.srcItems.length; j++) {
				nti.srcItems[j] = ti.srcItems[j];
			} 
		}
		for (var i=0; i<conf.fields.length; i++) {
			var ti = conf.fields[i];
			var nti = {name:ti.name,srcItems:[],exp:ti.exp,aggrExp:ti.aggrExp,use:ti.use,order:ti.order};
			newConf.fields[newConf.fields.length] = nti;
			for (var j=0; j<ti.srcItems.length; j++) {
				nti.srcItems[j] = ti.srcItems[j];
			}
		}
	}
	
	rpx.refresh();
}

//----------------------------------------report page--------------------------------------------
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
	if (!top.canDrill(reportConfName)){
		td.css('cursor','');
		return;
	}
	td.css('cursor','pointer');
}


function reportCellClick() {
	var td = $(this);
	var tds = td.parent().parent().find('td');
	var x1 = td.position().left;
	var y1 = td.position().top;
	var x2 = x1 + td.width();
	var y2 = y1 + td.height();
	//alert(left + "--" + top);
	var topValues = [];
	var leftValues = [];
	var fieldValues = [];
	var tt = td.attr('title');
	if (tt && tt != '') {
		td.attr('tt',tt);
		td.attr('title','');
	} else tt = td.attr('tt');
	var detail = tt == "3";
	for (var i=0; i<tds.length; i++) {
		var tdi = $(tds[i]);
		var x11 = tdi.position().left;
		var y11 = tdi.position().top;
		var x22 = x11 + tdi.width();
		var y22 = y11 + tdi.height();
		if (tt == 1 && (y1>=y11&&y1<=y22) && (y2>=y11&&y2<=y22) && x11<=x1) {
			leftValues[leftValues.length] = tdi.html();
		}
		if (tt == 2 && (x1>=x11&&x1<=x22) && (x2>=x11&&x2<=x22)) {
			topValues[topValues.length] = tdi.html();
		}
		if (tt == 4 && y1 == y11 && y2 == y22) {
			fieldValues[fieldValues.length] = tdi.html();
		}
		
		if (y11>y1) break;
	}
	top.reportCellDrill(reportConfName, topValues, leftValues, fieldValues, detail);
}

/*----------------------------------------data page----------------------------------------*/
var viewPage = {
	currPage : 0
	,pageRow : 20
	,over : false
	,loadedRow : 0
	,loadFirstRow : false
	,filter : ''
	,pause : false
}

function refreshStatus() {
	if (viewPage.pause) return;
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'getLoadedStatus',dataId:dataId},
		success: function(data){
			if (viewPage.pause) return;
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			data = eval("("+data+")");
			if (data.error) {
				alert(data.error);
				return;
			}
			viewPage.over = data.over;
			viewPage.loadedRow = data.loadedRow;
			if (data.loadedRow>=viewPage.pageRow && !viewPage.loadFirstRow) {
				getPageRows(1);
			} 
			if (data.over == 1) {
				if (!viewPage.loadFirstRow) getPageRows(1);
				$('#viewStatus').html("已加载完毕，共&nbsp;" + data.loadedRow + "&nbsp;行数据");
			} else {
				if (data.loadedRow == 0) {
					$('#viewStatus').html("正在执行查询");
				} else {
					$('#viewStatus').html("已加载&nbsp;" + data.loadedRow + "&nbsp;行数据");
				}
				viewPage.timeout = setTimeout("refreshStatus()",1000);
			}
			var totalRow = parseInt(viewPage.loadedRow/viewPage.pageRow+"") + (viewPage.loadedRow%viewPage.pageRow==0?0:1);
			$('#totalPage').html("&nbsp;/&nbsp;" + totalRow);
		}
	});
}
function changeFilter(filter,func) {
	if (viewPage.timeout) clearTimeout(viewPage.timeout);
	viewPage = {
		currPage : 0
		,pageRow : 20
		,over : false
		,loadedRow : 0
		,loadFirstRow : false
		,filter : filter
		,pause : false
	}
	viewPage.pause = true;
	viewPage.filter = filter;
	var trs = $('#viewTable tr');
	//alert(trs.length);
	for (var i=trs.length-1; i>=1; i--) {
		$(trs[i]).remove();
	}
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'changeFilter',dataId:dataId,filter:viewPage.filter,currTable:currTable},
		success: function(data){
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			if (func) {
				func();
				retrun;
			}
			viewPage.pause = false;
			refreshStatus();
		}
	});	
}

function getPageRows(shift) {
	if (viewPage.pause) return;
	var totalRow = parseInt(viewPage.loadedRow/viewPage.pageRow+"") + (viewPage.loadedRow%viewPage.pageRow==0?0:1);
	//alert(totalRow);
	if (viewPage.currPage+shift<=0 || viewPage.currPage+shift>totalRow) {
		return;
	}
	viewPage.loadFirstRow = true;
	viewPage.currPage += shift;
	$('#currPage').val(viewPage.currPage);
	//$('#prevBut')
	$.ajax({
		type: 'POST',
		async : false,
		url: contextPath + "/DLServletAjax?d="+new Date().getTime(),
		data: {action:2,oper:'getRows',dataId:dataId,begin:(viewPage.currPage-1)*viewPage.pageRow+1,end:viewPage.currPage*viewPage.pageRow+1,calcFields:(reportData.confs.length>0?rpx.getCalcFields(reportData.confs[0]):"")},
		success: function(data){
			if (viewPage.pause) return;
			if (data.indexOf('error:')==0) {
				alert(data.substring(6));
				return;
			}
			var data = eval("("+data+")");
			var d = data.rows;
			if (d.length == 0) return;
			if (reportData.srcDs == null) {
				rpx.setSrcDs(data.struct);
				var id2 = rpxData.maxId++;
				rpxData.items[rpxData.items.length] = {id:id2,type:4,parentId:0,name:'',content:[]};
				rpxData.confs[0].wheres[0] = {item:id2};
			}
			rpx.refreshView();
			
			var t = $('#viewTable');
			var trs = t.find("tr");
			for (var m=trs.length-1; m>=1; m--) $(trs[m]).remove();
			for (var i=0; i<d.length; i++) {
				var tr = $('<tr></tr>');
				t.append(tr);
				for (var j=0; j<d[i].length; j++) {
					var td = $('<td>'+d[i][j]+'</td>');
					tr.append(td);
				}
			}
			t.find('td').css('border','1px solid #E4E4E4').css('padding','3px 5px');
		}
	});	
}

function doReport(){
	if (!viewPage.over) {
		alert("请等待查询完毕后再分析");
		return;
	}
	if (viewPage.loadedRow == 0) {
		alert("未查询出数据，不能进入报表分析界面");
		return;
	}
	
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath + "/dl/jsp/dfxReport.jsp?d=" + new Date().getTime());
	form.attr('target', '_blank');
	form.append('<input type="hidden" name="src" value="'+rpx.toString()+'">');
	$('body').append(form);
	form[0].submit();
}




