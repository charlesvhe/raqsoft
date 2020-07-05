
var cache = {
	where : {
		fields:null
		,initField:null
		,wheres:null
		,less:false //精简模式去掉操作项，让结构更清晰
	},
	where1 : {
		fields:null
		,initField:null
		,wheres:null
		,less:false //精简模式去掉操作项，让结构更清晰
	}
}

var whereUtils = {
	// {disp:'',dataType:'',edit:{type:3,calendarType:2},exp:'',values:''}   {type:3,calendarType:(iObj.finalType==3?2:(iObj.finalType==4?3:1))};
	refresh : function(fields, initField, wheres, isDsParam,chooseSysParams) {
		cacheWhere = cache.where;
		if(isDsParam) cacheWhere = cache.where1;
		//alert(JSON.parse("{'a':1,'b':2}").b);
		if (fields) cacheWhere.fields = fields;
		else fields = cacheWhere.fields;
		if (!initField && !cacheWhere.initField) initField = fields[0];
		if (initField) cacheWhere.initField = initField;
		else initField = cacheWhere.initField;		
		if (wheres) cacheWhere.wheres = wheres;
		else wheres = cacheWhere.wheres;
		
		//var whereInfos = {join:'AND/OR',level:1,fieldInfo:'',oper:'',values:''};
		if (wheres == null || wheres == '' || wheres.length == 0) {
			wheres = [];
			wheres[0] = {level:1,fieldInfo:initField,oper:'',values:'',disp:''};
		}
		
		//最前及、最后位置上的join要删除，以及两个相连的join中的一个
		for (var i=wheres.length-1; i>=0; i--) {
			if (!wheres[i].join) continue;
			
			if (i == 0 || i == wheres.length-1) {
				wheres.remove(wheres[i]);
				continue;
			}
			
			var before1 = wheres[i-1];
			var after1 = wheres[i+1];
			if (before1.join && wheres[i].level>before1.level) wheres.remove(wheres[i]);
			if (after1.join && (wheres[i].level>=after1.level)) wheres.remove(wheres[i]);
		}
		//现在已经是规律的条件被join隔开的格式，把join调整到上下条件的较高层；
		for (var i=wheres.length-1; i>=0; i--) {
			if (!wheres[i].join) continue;
			
			var before1 = wheres[i-1].level;
			var after1 = wheres[i+1].level;
			if (wheres[i].level>before1 ||　wheres[i].level>after1) {
				wheres[i].level = before1>after1?after1:before1;
			}
		}
		//join层次假如高于上下条件，上下条件块层次相等，看有没有必要自动调整join层等于上下条件的层
		for (var i=wheres.length-1; i>=0; i--) {
			if (!wheres[i].join) continue;
			
			var before1 = wheres[i-1].level;
			var after1 = wheres[i+1].level;
			if (before1 != after1) continue;
			if (i>1 && wheres[i-2].level == before1) continue;
			if (i<=wheres.length-3 && wheres[i+2].level == after1) continue;
			wheres[i].level = before1;
		}

		var maxLevel = 1;
		for (var i=wheres.length-1; i>=0; i--) {
			if (maxLevel<wheres[i].level) maxLevel = wheres[i].level;
		}

		cacheWhere.wheres = wheres;
		
		var fw = $('#finalWheres');
		fw.html('');
		var div = $("<div style='margin:5px 20px;'><input"+(cacheWhere.less?" checked":"")+" type='checkbox' id='lessBut' style='vertical-align:-2px;'><span id='lessBut2' style='cursor:pointer'>&nbsp;&nbsp;简洁显示</span><span style='color:gray'>&nbsp;&nbsp;(简洁显示会隐藏掉“新增条件、调整条件层次”的功能，更能凸显条件之间的层次关系)</span></div>");
		div.find('#lessBut,#lessBut2').click(function(){
			cacheWhere.less = !cacheWhere.less;
			whereUtils.refresh(null,null,null,isDsParam,chooseSysParams);
		});
		fw.append(div);
		
		//操作列、字段列、操作列、值列
		var cols = 3+maxLevel;
		for (var i=0; i<wheres.length; i++) {
			whereUtils.addRow(cols,wheres[i].level,i,false,isDsParam,chooseSysParams);
			if (wheres[i].join) continue;
			if (!cacheWhere.less) {
				var toLevel = 0;
				if (i < wheres.length - 1) {
					toLevel = wheres[i+1].level;
				}
				if (toLevel>wheres[i].level) {
					alert('unknown error in where!');
				} else if (toLevel>wheres[i].level) continue;
				for (var j=wheres[i].level; j>toLevel; j--) {
					whereUtils.addRow(cols,j,i,true,isDsParam, chooseSysParams);
				}
			}
		}
		
	}
	//
	,addRow : function(cols,level,index,andOr,isDsParam, chooseSysParams) {//,join,fieldInfo,oper,values
		//if (index>0)
		var cacheWhere = cache.where;
		if(isDsParam) cacheWhere = cache.where1;
		var row = $("<div style=''></div>");
		$('#finalWheres').append(row);
		// 750px
		var div1 = $("<div style='float:left;width:"+((level-1)*50+40)+"px;margin:4px 3px;'>&nbsp;</div>");
		row.append(div1);
		var divs = $("<div style='float:left;border-bottom:0px solid grey;'></div>");
		row.append(divs).append("<div style='clear:both;'></div>");
		var div2 = $("<div style='float:left;width:150px;margin:1px 0;'></div>");
		var div3 = $("<div style='float:left;width:90px;margin:1px 2px;'></div>");
		var div4 = $("<div style='float:left;width:"+(500-(level-1)*50-160)+"px;margin:2px;'></div>");
		if(chooseSysParams) chooseSysParams = $("<div style='float:left;width:160px;margin:2px;'></div>");
		var div5 = $("<div style='float:left;width:30px'></div>");
		divs.append(div2).append(div3).append(div4).append(chooseSysParams).append(div5);
		var fields = cacheWhere.fields;
		var initField = cacheWhere.initField;		
		var wheres = cacheWhere.wheres;
		
		if (andOr) {
			divs.css('border-bottom','');
			div2.append('<a href="#">AND</a>&nbsp;|&nbsp;<a href="#">OR</a>');
			div2.find('a').css('color','gray').click(function(){
				var join = $(this).html();
				wheres.splice(index+1,0,{level:level,fieldInfo:wheres[index].fieldInfo,oper:'',values:'',disp:''});
				wheres.splice(index+1,0,{join:join,level:level});
				whereUtils.refresh(null,null,null,isDsParam,chooseSysParams);
			});
			return;
		}
		
		var toLeft = level>1;
		var toRight = false;
		if (wheres[index].join) {
			if (wheres[index-1].level>wheres[index].level && wheres[index+1].level>wheres[index].level) toRight = true;
			//divs.css('border-bottom','');
			if (wheres[index].join == "AND") {
				div2.append('<span style="font-weight:bold;">AND</span>&nbsp;|&nbsp;<a href="#">OR</a>');
			} else {
				div2.append('<span style="font-weight:bold;">OR</span>&nbsp;|&nbsp;<a href="#">AND</a>');
			}
			
			div2.find('a').css('color','gray').click(function(){
				var join = $(this).html();
				wheres[index].join = join;
				whereUtils.refresh(null,null,null,isDsParam,chooseSysParams);
			});
		} else {
			toRight = true;
			var fsDiv = null;
			var idx = 0;
			if (fields.length>1) {
				fsDiv = '<select class="dept_select" id="whereFields" style="width:100%;border:0px;color:#373636;">';
				for (var i=0; i<fields.length; i++) {
					//var iObji = getInfosObj(fields[i]);
					//2020.06.03
					if (wheres[index].fieldInfo.disp == fields[i].disp) idx = i;
					fsDiv += '<option value="'+i+'">'+fields[i].disp+'</option>';//('+iObji.expNoTable+')
				}
				fsDiv += "</select>";
				fsDiv = $(fsDiv);
				div2.append(fsDiv);
			} else {
				//var iObji = getInfosObj(wheres[index].fieldInfo);
				div2.css('margin','4px 0').append(fields[0].disp);//(iObji.alias1.substring(iObji.alias1.indexOf('.')+1));
			}
			
	
			var optChange = function(type,name, notSetValue) {
				var opt = whereUtils.getOption(type, name);
				div4.find("#wv").children().css("visibility",opt.html()?"visible":"hidden");
				if (!notSetValue) {
					wheres[index].oper = name;
					wheres[index].values = opt.html()?div4.find('#wv ._VALUE_').val():"";				
				}
			};
			
			var fieldChange = function(thisInfos){
				wheres[index].fieldInfo = thisInfos;
				//var iObj = getInfosObj(thisInfos);
				//var fObj = mdUtils.getField(iObj.lastTable, iObj.lastField);
	
				if (thisInfos.dataType<=0 || thisInfos.dataType>5) thisInfos.dataType = 2;
				var typeObj = whereUtils.getType(thisInfos.dataType);//(iObj.finalType);
				//alert(currWhereField4Having + "--" + currWhereField._type);
				if (typeObj == null) {
					alert('unavailable type[' + thisInfos.dataType + ']!');
					return;
				}
	
				div3.html('');
				var opts = '<select id="opt" style="width:100%;border:0px;color:#373636;">';
				for (var i=0; i<typeObj.options.length; i++) {
					var opti = typeObj.options[i];
					opts += '<option'+(i==0?' selected':'')+' value="' + opti.name + '">' + opti.name + '</option>';					
				}
				if (wheres[index].oper == '') wheres[index].oper = typeObj.options[0].name;
				//wheres[index].values = '';
				div4.find('#wv ._VALUE_').val('');
				if(chooseSysParams) chooseSysParams.find('.sp').val('');
				
				opts = $(opts + '</select>');
				div3.append(opts);
				opts.chosen({
					search_contains: true
					,width: "100%"
				}).on('change', function(evt, params) {
					optChange(thisInfos.dataType,opts.val());
				});
				//opts.change(function(){
				//	optChange(iObj.finalType,opts.val());
				//});
	
				
				div4.html('');
				div4.append('<div style="" id="wv"><input type="text" class="_VALUE_" style="width:'+(460-(level-1)*50-160)+'px;"></div>');
				div4.find('#wv ._VALUE_').change(function(){
					wheres[index].values = this.value;
				}).keyup(function(){
					wheres[index].values = this.value;
				}).blur(function(){
					wheres[index].values = this.value;
				}).click(function(){
					//console.log("click--");
					//setTimeout(function(){
					//	$(this).blur();
					//	$(this).focus();
					//},100);
				});
				if(wheres[index].chooseSp != null) div4.find('#wv ._VALUE_').attr('disabled','disabled');
				var edit = thisInfos.edit;
				//alert(thisInfos.edit);
				if (edit && edit != '') {
					//}
					//if (thisInfos.dataType>=3) {
					defaultEdit.registerEsEvent(edit, div4, "", thisInfos.useTreeDisp);
				} else if (thisInfos.values && thisInfos.values != '') {
					return;
					var dimFunc = function(vs) {
						if (vs == 'none' || vs == '' || vs.indexOf('error:')==0) {
							//div4.find('#chooseBut').remove();
							return;
						}
						//alert(vs);
						div4.find('#wv').append('<img id="chooseBut" init=1 closed=1 src="'+contextPath+guideConf.guideDir+'/img/dl/sql-hide.png" style="visibility:hidden;padding:2px;vertical-align:-5px;"><div style="padding:2px;display:none;" id="whereDimValues"></div>');					
						div4.find("#chooseBut").css('visibility','visible').click(function(){
							var c = ($(this).attr('closed') == 1);
							var init = ($(this).attr('init') == 1);
							div4.find("#whereDimValues").css('display',c?'block':'none');
							if (init) {
								var initVal = ","+div4.find('._VALUE_').val()+",";
								div4.find('#whereDimValues').find('div').each(function(){
									if (initVal.indexOf(","+$(this).attr('value')+",")>=0) {
										$(this).css('background-color','lightgray').css('font-weight','bold').attr('sel',1);
									}
								});
							}
							$(this).attr('closed',c?'0':'1').attr('init',0).attr('src',contextPath+guideConf.guideDir+'/img/dl/sql-'+(c?'show.png':'hide.png'));
							
						});
						var dt = vs.split('r;q');
						var codes = dt[0].split('r,q');
						var disps = null;
						if (dt.length > 1) disps = dt[1].split('r,q');
						var p = div4.find("#whereDimValues");
						for (var i=0; i<codes.length; i++) {
							var disp = codes[i];
							if (disps != null) {
								disp = disps[i] + '(' + codes[i] + ')';
							}
							p.append('<div style="padding:3px;margin:2px;float:left;" disp="'+disps[i]+'" value="' + codes[i] + '">'+disp+'</div>');
						}
						p.append('<div style="clear:both;"></div>');
						div4.find('#whereDimValues').find('div').css('cursor','pointer').click(function(){
							var sel = $(this).attr('sel') == 1;
							$(this).css('background-color',sel?'':'lightgray').css('font-weight',sel?'':'bold').attr('sel',sel?0:1);
							var value = '';
							var disp = '';
							var divs = $(this).parent().find('div[sel=1]');
							for (var i=0; i<divs.length; i++) {
								if (i>0) {
									value += ",";
									disp += ",";
								}
								value += $(divs[i]).attr('value');
								disp += $(divs[i]).attr('disp');
							}
							
							div4.find('#wv ._VALUE_').val(value);
							wheres[index].values = value;
							wheres[index].disp = disp;
						});
	
					}
					if (thisInfos.valueType == 1) {
						dimFunc(thisInfos.values);
					} else if (thisInfos.valueType == 2) {
						var dimObj = mdUtils.getDim(thisInfos.values);
						if (dimObj.sql == null || dimObj.sql == '') {
							if (dimObj.vs && dimObj.vs != '') {
								dimFunc(dimObj.vs);
							}
						} else {
							if (!(dimObj.dt>0 && dimObj.exp!='')) {
								var topRpxData = rpx.getTopRpxData();
								var topResource = topRpxData.srcDs.resource;
								jQuery.post(contextPath + "/DLServletAjax?d=" + new Date().getTime(), {action:4,oper:'dispTable',sql:dimObj.sql,dbName:topResource.dataSource}, function(data){
									dimFunc(data);
								});
							}
						}
					}
				}
			};
			if (fsDiv != null) {
				fsDiv.val(idx+"");
				
				fsDiv.chosen({
					search_contains: true
					,width: "100%"
				}).on('change', function(evt, params) {
					fieldChange(fields[div2.find("#whereFields").val()]);
					//do_something(evt, params);
				});
			    /*
				fsDiv.change(function(){
					fieldChange($(this).val());
				});
				*/
				
			}
			fieldChange(wheres[index].fieldInfo);
			if (div2.find("#whereFields").length>0)
			{
				fieldChange(fields[div2.find("#whereFields").val()]);
			}
			optChange(wheres[index].fieldInfo.dataType,wheres[index].oper, true);
			div3.find("#opt").val(wheres[index].oper).trigger('chosen:updated');
			//$('.my_select_box').trigger('chosen:updated');
			div4.find('#wv ._VALUE_').val(wheres[index].values).attr('disp',wheres[index].disp);
			
			div5.append('<img src="'+contextPath+guideConf.guideDir+'/img/dl/to-del.png" style="margin:4px 3px;">');
			div5.find('img').css('cursor','pointer').click(function(){
				wheres.remove(wheres[index]);
				whereUtils.refresh(null,null,null,isDsParam,chooseSysParams);
			});
			if(chooseSysParams) {
				var selectSysparams = $('<select class="sp" style="width:160px"></select>');
				chooseSysParams.append(selectSysparams);
				selectSysparams.append('<option value="">不选择</option>');
				for(var sp = 0; sp < aly.sysparams.length; sp++){
					var sp_name = aly.sysparams[sp].name;
					var sp_value = aly.sysparams[sp].value;
					var s = '<option value="'+sp_value+'"';
					if(wheres[index].chooseSp != null) {//fillback
						var whereChooseSp = wheres[index];
						var chooseElm = null;
						if(sp_name == wheres[index].chooseSp){
							s += " selected";
						}
					}
					s += ('>'+sp_name+'</option>');
					selectSysparams.append(s);
				}
				selectSysparams.change(function(){
					var sp_value = $(this).val();
					if(sp_value != "") {
						wheres[index].values = sp_value;
						wheres[index].chooseSp = $(this.selectedOptions).html();
						div4.find('#wv ._VALUE_').val(sp_value);
						div4.find('#wv ._VALUE_').attr('disabled','disabled');
					}else{
						wheres[index].chooseSp = null;
						div4.find('#wv ._VALUE_').removeAttr('disabled');
					}
				});
			}
		}
		
		if (!cacheWhere.less) {
			if (toRight) div1.append('<img add=1 src="'+contextPath+guideConf.guideDir+'/img/dl/to-right.png" style="float:right;margin:0 3px;">');
			if (toLeft) div1.append('<img add="-1" src="'+contextPath+guideConf.guideDir+'/img/dl/to-left.png" style="float:right;margin:0 3px;">');
			div1.find('img').css('cursor','pointer').click(function(){
				var a = $(this).attr("add");
				wheres[index].level = wheres[index].level+parseInt(a);
				whereUtils.refresh(null,null,null,isDsParam,chooseSysParams);
			});
		}	
	}
	,getDisp : function(conf) {
		var currLevel = 1;
		var r = "";
		for (var i=0; i<conf.length; i++) {
			var ci = conf[i];
			if (currLevel<ci.level) {
				for (var j=currLevel; j<ci.level; j++) r += "(";
			} else if (currLevel>ci.level)  {
				for (var j=currLevel; j>ci.level; j--) r += ")";
			}
			currLevel = ci.level;
			if (ci.join) {
				if (ci.join == 'AND') r += " "+resources.guide.js22+" "
				else  r += " "+resources.guide.js23+" ";
				continue;
			}
			
			//var iObj = getInfosObj(ci.fieldInfo);
			var cif = ci.fieldInfo;
			var opt = whereUtils.getOption(cif.dataType,ci.oper);
			if (opt.html() && ci.values == '') {
				alert("所有条件必须输入或选择值");
				return "";
			}
			//var iObj = getInfosObj(ci.fieldInfo);
			r += /*iObj.alias1*/cif.disp + " " + ci.oper + " " + (ci.disp==""?ci.values:ci.disp); 
		}
		for (var j=currLevel; j>1; j--) r += ")";
		return r;
	}
	// type 1:expNoTableNoAggr;  2:expNoTable;   3:nothing
	// expType 默认1是sql类型； 2是dfx类型
	,getExp : function(conf, add, type, expType,field) {//conf=fi.where.conf
		if (!expType) expType = 1;
		var currLevel = 1;
		var r = "";
		for (var i=0; i<conf.length; i++) {
			var ci = conf[i];
			if (currLevel<ci.level) {
				for (var j=currLevel; j<ci.level; j++) r += "(";
			} else if (currLevel>ci.level)  {
				for (var j=currLevel; j>ci.level; j--) r += ")";
			}
			currLevel = ci.level;
			if (ci.join) {
				if (expType == 1) {
					if (ci.join == 'AND') r += " AND "
					else  r += " OR ";
				} else {
					if (ci.join == 'AND') r += " && "
					else  r += " || ";
				}
				continue;
			}
			
			//var iObj = getInfosObj(ci.fieldInfo);
			var cif = ci.fieldInfo;
			var opt = whereUtils.getOption(cif.dataType,ci.oper);
			if (opt.html() && ci.values == '') {
				alert(resources.guide.js24);
				return "";
			}
			var exp = "";
			if (expType == 1) exp = opt.exp(null,[ci.values]);
			else exp = opt.dfxExp(ci.values);
			var e = cif.exp;
			if(field && field.aggr != "") e = cif.exp;
			if(field && field.calc != null) e = cif.exp;
			exp = exp.replaceAll("_x_",add+e);//(type==3?"":("."+(type==1?iObj.expNoTableNoAggr:iObj.expNoTable))));
			r += exp; 
		}
		for (var j=currLevel; j>1; j--) r += ")";
		return r;
	}
	,types : [
	    {type:1,options:[
			{name:resources.guide.js25,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js33+'</span>';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_=' + translateDimExp(dimType, dimExp, values[0]);
					if (values[0].indexOf(',') > 0) return '_x_ in (' + values[0] + ')';
					else {
						try{
							var number = typeof parseInt(values[0]) == 'number';
							if( number ) return '_x_=' + values[0];
							else return '_x_=\'' + values[0] +'\'';
						}catch(e){
							return '_x_=' + values[0];
						}
					}
				},dfxExp:function(values){
					if (values.indexOf(',') > 0) return '['+values+'].pos(_x_)>0';
					else return '_x_==' + values;
				}
			},
			{name:resources.guide.js26,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js33+'</span>';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_<>' + translateDimExp(dimType, dimExp, values[0]);
					if (values[0].indexOf(',') > 0) return '_x_ not in (' + values[0] + ')';
					else{
						try{
							var number = parseInt(values[0]) instanceof Number;
							if( number ) return '_x_<>' + values[0];
							else return '_x_<>\'' + values[0]+'\'';
						}catch(e){
							return '_x_<>' + values[0];
						}
					} 
				},dfxExp:function(values){
					if (values.indexOf(',') > 0) return '['+values+'].pos(_x_)<=0';
					else return '_x_!=' + values;
				}
			},
			{name:resources.guide.js27,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_>' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>' + values[0];
				},dfxExp:function(values){
					return '_x_>' + values;
				}
			},
			{name:resources.guide.js28,html:function(){
					return '_EDITOR_'
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_<' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<' + values[0];
				},dfxExp:function(values){
					return '_x_<' + values;
				}
			},
			{name:resources.guide.js29,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_>=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>=' + values[0];
				},dfxExp:function(values){
					return '_x_>=' + values;
				}
			},
			{name:resources.guide.js30,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_<=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<=' + values[0];
				},dfxExp:function(values){
					return '_x_<=' + values;
				}
			},
			{name:resources.guide.js31,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is null';
				},dfxExp:function(values){
					return '_x_==null';
				}
			},
			{name:resources.guide.js32,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is not null';
				},dfxExp:function(values){
					return '_x_!=null';
				}
			}
			
		]},
		{type:2,options:[
			{name:resources.guide.js25,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js34+'</span>';
				},exp:function(item, values, dimType, dimExp){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ',';
						r += vs[i];
					}
					if (r.indexOf(',') > 0) return '_x_ in (\'' + r + '\')';
					else {
						try{
							var number = parseInt(r) instanceof Number;
							if( number ) return '_x_=' + r;
							else return '_x_=\'' + r +'\'';
						}catch(e){
							return '_x_=' + r;
						}
					}
				},dfxExp:function(values){
					var vs = values.split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ',';
						r += '"' + vs[i] + '"';
					}
					if (r.indexOf(',') > 0) return '['+r+'].pos(_x_)>0';
					else return '_x_==' + r;
				}
			},
			{name:resources.guide.js26,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js34+'</span>';
				},exp:function(item, values, dimType, dimExp){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ',';
						r += vs[i];
					}
					if (r.indexOf(',') > 0) return '_x_ not in (\'' + r + '\')';
					else{
						try{
							var number = parseInt(r) instanceof Number;
							if( number ) return '_x_<>' + r;
							else return '_x_<>\'' + r+'\'';
						}catch(e){
							return '_x_<>' + r;
						}
					} 
				},dfxExp:function(values){
					var vs = values.split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ',';
						r += '"' + vs[i] + '"';
					}
					if (r.indexOf(',') > 0) return '['+r+'].pos(_x_)<=0';
					else return '_x_!=' + r;
				}
			},
			{name:resources.guide.js35,noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js34+'</span>';
				},exp:function(item, values, decorated){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' OR ';
						r += "_x_ like '%" + vs[i] + "%'";
						//alert(r);
					}
					return r;
				},dfxExp:function(values){
					var vs = values.split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' || ';
						r += 'like(_x_,"*'+vs[i]+'*")'
						//alert(r);
					}
					return r;
				}
			},
			{name:resources.guide.js36,noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js34+'</span>';
				},exp:function(item, values){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' AND ';
						r += "_x_ not like '%" + vs[i] + "%'";
					}
					return r;
				},dfxExp:function(values){
					var vs = values.split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' && ';
//						r += '!like(_x_,"*'+vs[i]+'*")'
						r += 'pos(_x_,"'+vs[i]+'")!=null';
						//alert(r);
					}
					return r;
				}
			},
			{name:resources.guide.js37,noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js34+'</span>';
				},exp:function(item, values){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' OR ';
						r += "_x_ like '" + vs[i] + "%'";
					}
					return r;
				},dfxExp:function(values){
					var vs = values.split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' || ';
						//r += 'like(_x_,"'+vs[i]+'*")'
						r += 'pos(_x_,"'+vs[i]+'")==1';
						//alert(r);
					}
					return r;
				}
			},
			{name:resources.guide.js38,noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">'+resources.guide.js34+'</span>';
				},exp:function(item, values){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' OR ';
						r += "_x_ like '%" + vs[i] + "'";
					}
					return r;
				},dfxExp:function(values){
					var vs = values.split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' || ';
						//r += 'like(_x_,"*'+vs[i]+'")'
						r += 'pos(_x_,"'+vs[i]+'")==len(_x_)';
						//alert(r);
					}
					return r;
				}
			},
			{name:resources.guide.js31,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is null';
				},dfxExp:function(values){
					return '_x_==null';
				}
			},
			{name:resources.guide.js32,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is not null';
				},dfxExp:function(values){
					return '_x_!=null';
				}
			}
		]},
		{type:3,options:[
			{name:resources.guide.js25,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_=' + translateDimExp(dimType, dimExp, values[0]);
					return "_x_=date('" + values[0] + "')";
				},dfxExp:function(values){
					return '_x_==date("' + values + '")';
				}
			},
			{name:resources.guide.js26,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_<>' + translateDimExp(dimType, dimExp, values[0]);
					return "_x_<>date('" + values[0] + "')";
				},dfxExp:function(values){
					return '_x_!=date("' + values + '")';
				}
			},
			{name:resources.guide.js39,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_>' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>date(\'' + values[0] + "')";;
				},dfxExp:function(values){
					return '_x_>date("' + values + '")';
				}
			},
			{name:resources.guide.js40,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_>=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>=date(\'' + values[0] + "')";;
				},dfxExp:function(values){
					return '_x_>=date("' + values + '")';
				}
			},
			{name:resources.guide.js41,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_<' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<date(\'' + values[0] + "')";;
				},dfxExp:function(values){
					return '_x_<date("' + values + '")';
				}
			},
			{name:resources.guide.js42,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_<=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<=date(\'' + values[0] + "')";;
				},dfxExp:function(values){
					return '_x_<=date("' + values + '")';
				}
			},
			{name:resources.guide.js43,html:function(){
					return false;
				},exp:function(item, values){
					return "_x_=date('" + dateUtils.getToday() + "')";
				},dfxExp:function(values){
					return '_x_==date("' + dateUtils.getToday() + '")';
				}
			},
			{name:resources.guide.js44,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_>=date(\'' + dateUtils.getWeekBegin() + '\') AND _x_<=date(\'' + dateUtils.getWeekEnd() + '\')';
				},dfxExp:function(values){
					return '_x_>=date("' + dateUtils.getWeekBegin() + '") && _x_<=date("' + dateUtils.getWeekEnd() + '")';
				}
			},
			{name:resources.guide.js45,html:function(){
					return false;
				},exp:function(item, values){
					return "_x_>=date('" + dateUtils.getMonthBegin() + "') AND _x_<=date('" + dateUtils.getMonthEnd() + "')";
				},dfxExp:function(values){
					return '_x_>=date("' + dateUtils.getMonthBegin() + '") && _x_<=date("' + dateUtils.getMonthEnd() + '")';
				}
			},
			{name:resources.guide.js46,html:function(){
					return false;
				},exp:function(item, values){
					return "_x_>=date('" + dateUtils.getYearBegin() + "') AND _x_<=date('" + dateUtils.getYearEnd() + "')";
				},dfxExp:function(values){
					return '_x_>=date("' + dateUtils.getYearBegin() + '") && _x_<=date("' + dateUtils.getYearEnd() + '")';
				}
			},
			{name:resources.guide.js47,html:function(){
					return false;
				},exp:function(item, values){
					return "YEAR(_x_)=YEAR(TODAY()) AND MONTH(_x_)=MONTH(TODAY()) AND DAY(_x_)=DAY(TODAY())";
				},dfxExp:function(values){
					return "year(_x_)==year(now()) && month(_x_)==month(now()) && day(_x_)==day(now())";
				}
			},
			{name:resources.guide.js48,html:function(){
					return false;
				},exp:function(item, values){
					return "YEAR(_x_)=YEAR(TODAY()) AND MONTH(_x_)=MONTH(TODAY())";
				},dfxExp:function(values){
					return "year(_x_)==year(now()) && month(_x_)==month(now())";
				}
			},
			{name:resources.guide.js49,html:function(){
					return false;
				},exp:function(item, values){
					return "YEAR(_x_)=YEAR(TODAY())";
				},dfxExp:function(values){
					return "year(_x_)==year(now())";
				}
			},
			{name:resources.guide.js31,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is null';
				},dfxExp:function(values){
					return '_x_==null';
				}
			},
			{name:resources.guide.js32,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is not null';
				},dfxExp:function(values){
					return '_x_!=null';
				}
			}
		]},
		{type:4,options:[
			{name:resources.guide.js25,html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return "_x_=timestamp('" + values[0] + "')";
				},dfxExp:function(values){
					return '_x_==time("' + values + '")';
				}
			},
			{name:resources.guide.js26,html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return "_x_<>timestamp('" + values[0] + "')";
				},dfxExp:function(values){
					return '_x_!=time("' + values + '")';
				}
			},
			{name:resources.guide.js39,html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_>timestamp(\'' + values[0] + "')";;
				},dfxExp:function(values){
					return '_x_>time("' + values + '")';
				}
			},
			{name:resources.guide.js40,html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_>=timestamp(\'' + values[0] + "')";
				},dfxExp:function(values){
					return '_x_>=time("' + values + '")';
				}
			},
			{name:resources.guide.js41,html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_<timestamp(\'' + values[0] + "')";
				},dfxExp:function(values){
					return '_x_<time("' + values + '")';
				}
			},
			{name:resources.guide.js42,html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_<=timestamp(\'' + values[0] + "')";;
				},dfxExp:function(values){
					return '_x_<=time("' + values + '")';
				}
			},
			{name:resources.guide.js31,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is null';
				},dfxExp:function(values){
					return '_x_==null';
				}
			},
			{name:resources.guide.js32,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is not null';
				},dfxExp:function(values){
					return '_x_!=null';
				}
			}
		]},
		{type:5,options:[
			{name:resources.guide.js25,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_=" + translateDimExp(dimType, dimExp, values[0]);
					return "_x_=timestamp('" + values[0] + "')";
				},dfxExp:function(values){
					return '_x_==datetime("' + values + '")';
				}
			},
			{name:resources.guide.js26,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_<>" + translateDimExp(dimType, dimExp, values[0]);
					return "_x_<>timestamp('" + values[0] + "')";
				},dfxExp:function(values){
					return '_x_!=datetime("' + values + '")';
				}
			},
			{name:resources.guide.js39,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_>" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>timestamp(\'' + values[0] + "')";
				},dfxExp:function(values){
					return '_x_>datetime("' + values + '")';
				}
			},
			{name:resources.guide.js40,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_>=" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>=timestamp(\'' + values[0] + "')";
				},dfxExp:function(values){
					return '_x_>=datetime("' + values + '")';
				}
			},
			{name:resources.guide.js41,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_<" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<timestamp(\'' + values[0] + "')";
				},dfxExp:function(values){
					return '_x_<datetime("' + values + '")';
				}
			},
			{name:resources.guide.js42,html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_<=" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<=timestamp(\'' + values[0] + "')";
				},dfxExp:function(values){
					return '_x_<=datetime("' + values + '")';
				}
			},
			{name:resources.guide.js43,html:function(){
					return false;
				},exp:function(item, values){
					return "_x_=timestamp('" + dateUtils.getToday() + "')";
				},dfxExp:function(values){
					return '_x_==date("' + dateUtils.getToday() + '")';
				}
			},
			{name:resources.guide.js44,html:function(){
					return false;
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getWeekBegin() + "') AND _x_<=timestamp('" + dateUtils.getWeekEnd() + "')";
				},dfxExp:function(values){
					return '_x_>=date("' + dateUtils.getWeekBegin() + '") && _x_<=date("' + dateUtils.getWeekEnd() + '")';
				}
			},
			{name:resources.guide.js45,html:function(){
					return false;
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getMonthBegin() + "') AND _x_<=timestamp('" + dateUtils.getMonthEnd() + "')";
				},dfxExp:function(values){
					return '_x_>=date("' + dateUtils.getMonthBegin() + '") && _x_<=date("' + dateUtils.getMonthEnd() + '")';
				}
			},
			{name:resources.guide.js46,html:function(){
					return false;
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getYearBegin() + "') AND _x_<=timestamp('" + dateUtils.getYearEnd() + "')";
				},dfxExp:function(values){
					return '_x_>=date("' + dateUtils.getYearBegin() + '") && _x_<=date("' + dateUtils.getYearEnd() + '")';
				}
			},
			{name:resources.guide.js47,html:function(){
					return false;
				},exp:function(item, values){
					return "YEAR(_x_)=YEAR(TODAY()) AND MONTH(_x_)=MONTH(TODAY()) AND DAY(_x_)=DAY(TODAY())";
				},dfxExp:function(values){
					return "year(_x_)==year(now()) && month(_x_)==month(now()) && day(_x_)==day(now())";
				}
			},
			{name:resources.guide.js48,html:function(){
					return false;
				},exp:function(item, values){
					return "YEAR(_x_)=YEAR(TODAY()) AND MONTH(_x_)=MONTH(TODAY())";
				},dfxExp:function(values){
					return "year(_x_)==year(now()) && month(_x_)==month(now())";
				}
			},
			{name:resources.guide.js49,html:function(){
					return false;
				},exp:function(item, values){
					return "YEAR(_x_)=YEAR(TODAY())";
				},dfxExp:function(values){
					return "year(_x_)==year(now())";
				}
			},
			{name:resources.guide.js31,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is null';
				},dfxExp:function(values){
					return '_x_==null';
				}
			},
			{name:resources.guide.js32,html:function(){
					return false;
				},exp:function(item, values){
					return '_x_ is not null';
				},dfxExp:function(values){
					return '_x_!=null';
				}
			}
		]}
	],
	getType : function(t) {
		for (var i=0; i<whereUtils.types.length; i++) {
			if (whereUtils.types[i].type == t) return whereUtils.types[i];
		}
	},
	getOption : function(t, optName) {
		var type = whereUtils.getType(t);
		for (var i=0; i<type.options.length; i++) {
			if (type.options[i].name == optName) return type.options[i];
		}
	}
	,openWhereDialog : function(saveFunc, clearFunc, chooseSysParams) {
		zIndexBak = artDialog.defaults.zIndex;
		var dlg = art.dialog({
			id : 1314,
			title : resources.guide.js50,
		    content: '<div id="finalWheres" style="width:100%;height:100%;overflow:auto;"></div>'
	    	,button: [
	    	         {
	    	             name: resources.guide.js51,
	    	             callback: saveFunc,
	    	             focus: true
	    	         },
	    	         {
	    	             name: resources.guide.js52,
	    	             callback: clearFunc
	    	         },
	    	         {
	    	             name: resources.guide.js21
	    	         }
	    	     ]
		    //,ok : function() {
		    //}
		    ,cancel : function(){
				artDialog.defaults.zIndex = zIndexBak;
				return true;
			}
		    ,okVal : resources.guide.js20
		    ,cancelVal : resources.guide.js21
		    ,lock : true
		    ,duration : 0
			,zIndex : 44444
		    ,width : (chooseSysParams?970:900)+'px'
			,height : '400px'
			,opacity : 0.1
			,padding : '2px 2px'
		});
	}
}

