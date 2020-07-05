/**
TODO
	--1、RS1这些名字可以编辑。
	--2、拼的sql还有问题，也未考虑中间表呢。
	--3、中间表删除。
	4、删除、修改一些中间信息时的自动联动问题。
		
		添加表
			在本结果集、父结果集中递归添加字段
		删除表
			递归删除父结果集中无效的字段。
		修改表名
			修改本结果集、父结果集中已选出字段
		添加字段
			向父结果集递归添加
		删除字段
			递归删除父结果中字段
		修改字段别名
			修改父结果集字段。
		删除计算字段
			递归删除相关字段
		添加/删除汇总方式：修改字段别名？
		*别名要检查重名
		
		addField
		checkValid
		modifyField
		modifyRsName
		
		
	5、多tab页现实不同的中间表。
	6、两个原始表join，也会拼成子查询，看这里是否需要优化。

{tables:[],bys:[]}
type为数据类型 1、数字；2、字符串；3、日期；4、时间；5、日期时间。

*/
var str = "({tables:["+
	"{name:'北京通话记录',fields:[{name:'主叫号码',type:2,pk:0},{name:'被叫号码',type:2},{name:'开始时间',type:5},{name:'结束时间',type:5},{name:'主叫地区编码',type:2},{name:'被叫地区编码',type:2}]}"+
	",{name:'河北通话记录',fields:[{name:'主叫号码',type:2,pk:0},{name:'被叫号码',type:2},{name:'开始时间',type:5},{name:'结束时间',type:5},{name:'主叫地区编码',type:2},{name:'被叫地区编码',type:2}]}"+
	",{name:'用户表',fields:[{name:'号码',type:2,pk:1},{name:'地区编码',type:2},{name:'入网时间',type:5},{name:'身份证号码',type:2},{name:'用户类型',type:1}]}"+
	",{name:'公民表',fields:[{name:'身份证号码',type:2,pk:1},{name:'姓名',type:2},{name:'籍贯',type:2},{name:'性别',type:1},{name:'出生日期',type:3}]}"+
	",{name:'地区表',fields:[{name:'地区编码',type:2,pk:1},{name:'地区名称',type:2}]}"+
	//",{name:'地区表',sql:'...',def:'...',fields:[{name:'地区编码',type:2,pk:1},{name:'地区名称',type:2}]}"+
	"]})";


//var dbInfos = eval(str);
var dropDoms;
var dropSelects;
var firstShow = true;

var domInfos = {
	/**
	ResultSets, 
	{	name:'rs3' 结果集名称
		,tables:['rs2','t1'] 子结果集，可能是原始表、前面的结果集；可以是1到多个。
		,connectType:'' 有多个子结果集时，连接类型，目前要求都一样。join/left join/full join/union/union all/minus...
		,connects:[['rs1','field1','rs2','field2'],...] 连接字段。
		,calcFields:['f1+f2','f3%1000']
		,selects:[{name:'',exp:'',type:1,order:0升序/1降序,seq:1字段次序,aggr:'sum'}] 选出字段，有聚合字段时，不聚合的字段就是分组字段。
		,where:"'f1>5','f2 in (...)'"
		,having:""
	}
	*/
	rss : [/*{name:'rs1',tables:['t1111'],connectType:'',connects:[],calcFields:[],where:'',selects:[],having:''},
		{name:'rs2',tables:['t2222222222'],connectType:'',connects:[],calcFields:[],where:'',selects:[],having:''},
		{name:'rs3',tables:['rs1','rs2'],connectType:'union',connects:[],calcFields:[],where:'',selects:[],having:''},
		{name:'rs4',tables:['t32'],connectType:'',calcFields:[],connects:[],where:'',selects:[],having:''},
		{name:'rs5',tables:['rs3','rs4'],connectType:'join',connects:[],calcFields:[],where:'',selects:[],having:''}
	*/]
}
var domUtils = {
	currRs : ''
	,currTop : null
	,auto : function(){
		
	}
	,refresh : function(){
		dropDoms = new Array();
		var mainDiv = $('#mainDiv');
		
		mainDiv.droppable(bigDrop);
		var structDiv = $('#structDiv');
		structDiv.html('');
		
		var rsDoms = [];
		var allChildRss = [];
		var topRs;
		domUtils.currTop = null;
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			var tableDom = $('<table style="border-collapse:separate;" border=0 cellspacing=0 cellpadding=0></table>');
			// tdpos: 1主格、2join格、3union格、4无意义
			tableDom.append('<tr><td tdpos=1 style="border:1px solid lightgray"></td><td tdpos=2 style="width:15px;font-size:1px;">&nbsp;</td></tr><tr style="height:15px;font-size:1px;"><td tdpos=3>&nbsp;</td><td tdpos=4>&nbsp;</td></tr>');
			rsDoms[i] = tableDom;
			var tds = tableDom.find('td');
			tds.attr('rsName',rsi.name);

			var td1 = $(tds[1]);
			dropDoms[dropDoms.length] = td1;
			td1.attr('ct','background-color');
			td1.css('background-color', '');
			td1.attr('c1','');
			td1.attr('c2','#b5cce7');
			td1.attr('c3','#5c8fca');
			td1.droppable(itemDrop);
			var td2 = $(tds[2]);
			dropDoms[dropDoms.length] = td2;
			td2.attr('ct','background-color');
			td2.css('background-color', '');
			td2.attr('c1','');
			td2.attr('c2','#b5cce7');
			td2.attr('c3','#5c8fca');
			td2.droppable(itemDrop);
			
			var tbi = $('<table style="width:100%;height:100%;border-collapse:separate;" border=0 cellspacing=0 cellpadding=0><tr><td style="vertical-align:top;"></td></tr></table>');
			$(tds[0]).append(tbi);
			var tbitds = tbi.find('td');
			var title = $('<div style="clear:both;background-image:url('+contextPath + guideConf.guideDir +'/img/dl/tr.png);height:25px;margin-bottom:10px;"><div style="float:left;padding:3px 5px 0 10px;">'+rsi.name+'</div><div style="float:right;width:10px;padding:4px 4px 0 0"><img rs="'+rsi.name+'" class="deleteRs" src="'+ contextPath + guideConf.guideDir +  consts.imgFolder +'delete1.png" border=0></div><div style="clear:both;"></div></div>');
			$(title.children()[0]).dblclick(function(){
				var curr = $(this);
				if (curr.find('input').length == 1) return;
				var name = curr.html();
				curr.html("<input type='text' style='width:70px;' value='"+name+"'><img style='margin-left:2px;' src='"+contextPath + guideConf.guideDir +  +"/img/dl/zjb-modify.png'>")
				var currInput = curr.find('input');
				var currImg = curr.find('img');
				var editDone = function(){
					var v = currInput[0].value.trim();
					if (v == '') {
						alert('名称不能为空！');
						return;
					}
					if (domUtils.getRs(v) && name != v) {
						alert('名称重复！');
						return;
					}
					var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.refresh();domUtils.selectRs(\''+name+'\');")';
					domUtils.operModifyRsName(name,v);
					var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.refresh();domUtils.selectRs(\''+v+'\');")';
					var oper = {undo:undo,redo:redo};
					operations.addOper(oper);
					eval(redo);
				}
				currInput.keyup(function(e){
					if ( e.which == 13 ) {
						editDone();
					}
				});
				setCaretToPos(currInput[0], name.length);
				currImg.css('cursor','pointer').click(editDone);
			});
			$(tbitds[0]).append(title);
			if (rsi.tables.length == 1) {
				$(tbitds[0]).append("<div style='margin:0 10px 10px;'>"+rsi.tables[0]+"</div>");
			} else {
				allChildRss = allChildRss.concat(rsi.tables);
				//$(tbitds[0]).css('padding','10px 0 0 10px');
				var tbl = $('<table style="border-collapse:separate;margin-left:10px;" border=0 cellspacing=0 cellpadding=0></table>');
				if (rsi.connectType.indexOf('JOIN') >= 0) {
					var tr = $('<tr></tr>')
					for (var j=0; j<rsi.tables.length; j++) {
						//if (j > 0) subTables[j].css('height','100%');
						var td = $('<td parentrs="' + rsi.name + '"></td>');
						tr.append(td);
					}
					tbl.append(tr);
				} else {
					for (var j=0; j<rsi.tables.length; j++) {
						var tr = $('<tr></tr>')
						var td = $('<td parentrs="' + rsi.name + '"></td>');
						tr.append(td);
						tbl.append(tr);
					}
				}
				$(tbitds[0]).append(tbl);
			}
			
			tbi.find('.deleteRs').css('cursor','pointer').hover(function(){
				$(this).css('box-shadow','0 0 3px #777 inset');
			},function(){
				$(this).css('box-shadow','');
			}).click(function(){
				var rs = $(this).attr("rs");
				var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.refresh();domUtils.selectRs(\''+rs+'\');")';
				domUtils.removeRs(rs);
				var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.refresh();")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			});
		}
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			
			if (allChildRss.indexOf(rsi.name) == -1) {
				if (domUtils.currRs == '') domUtils.currRs = rsi.name;
				topRs = rsDoms[i];
				domUtils.currTop = rsi;
				var topTds = topRs.find("td[rsName='"+rsi.name+"'][tdpos=2]");
				topTds.attr('defaultConnect',1);
			}
			
			if (rsi.tables.length > 1) {
				var subTables = [];
				for (var j=0; j<rsi.tables.length; j++) {
					subTables[j] = rsDoms[domUtils.getRsIndex(rsi.tables[j])];
				}
				var subRss = rsDoms[i].find("td[parentrs='" + rsi.name + "']");
				for (var j=0; j<rsi.tables.length; j++) {
					subTables[j].css('width','100%').css('height','100%');
					$(subRss[j]).append(subTables[j]);
				}
				if (rsi.connectType.indexOf('JOIN') >= 0) {
					subTables[0].addClass("firstJoinDom");
					subTables[0].resize(function(){
						var prs = $(this).parent().attr('parentrs');
						var tds = structDiv.find("td[parentrs='"+prs+"']");
						var max = 0;
						for (var j=0; j<tds.length; j++) {
							var curr = $($(tds[j]).children()[0]).height();
							if (curr > max) max = curr;
						}
						for (var j=0; j<tds.length; j++) {
							$($(tds[j]).children()[0]).css('height',max);
						}
					});
				}
			}
		}
		
		generateTables();
		//var selectRs = '';
		if (rsDoms.length == 0) {
			structDiv.css('height','25px');
			var mainTop = $('#mainTop');
			dropDoms[dropDoms.length] = mainTop;
			mainTop.attr('ct','background-color');
			mainTop.css('background-color', '');
			mainTop.attr('c1','');
			mainTop.attr('c2','#b5cce7');
			mainTop.attr('c3','#5c8fca');
			mainTop.attr('defaultConnect',1);
			domUtils.selectRs(domUtils.currRs);
			return;
		}
		//alert(topRs);
		structDiv.css('height','');
		structDiv.append(topRs);
		
		
		structDiv.find('.firstJoinDom').trigger('resize');
		//structDiv.trigger('resize');
		domUtils.selectRs(domUtils.currRs);
	}
	,selectRs : function(rsName){
		var rsObj = domUtils.getRs(rsName);
		if (!rsObj) rsName = '';

		var structDiv = $('#structDiv');
		var tds = structDiv.find('td[tdpos=1]');
		for (var i=0; i<tds.length; i++) {
			var tdi = $(tds[i]);
			var spani = $($(tdi.find('td')[0]).children()[0]);
			tdi.css('background-color',tdi.attr('rsName')==rsName?'#e9ecf8':'');
			//tdi.css('background-color',tdi.attr('rsName')==rsName?'#e9ecf8':'#e9ecf8');
			//tdi.css('background-color',tdi.attr('rsName')==rsName?'':'');
			if (tdi.attr('rsName')==rsName) {
				tdi.css('box-shadow','5px 5px 5px #888888').css('color','#000000');
				spani.css('font-size','16px').css('text-shadow','1px 1px #bbb').css('font-weight','bold').css('color','#186EB3');
			} else {
				tdi.css('box-shadow','').css('color','');
				spani.css('font-size','').css('text-shadow','').css('font-weight','').css('color','');
			}
		}
		$('#rsAttrsDiv').css('display',rsObj?'block':'none');
		if (!rsObj) {
			domUtils.currRs = rsName;
			$('#finalSql').html('');
			return;
		}

		var connectDiv = $('#connectDiv');
		var allFields = $('#allFields');
		var fieldAttrs = $('#fieldAttrs');
		var selectedFields = $('#selectedFields');
		// 重新生成dom元素
		//alert(domUtils.currRs +"---"+ rsName);
		if (/*firstShow || domUtils.currRs != rsName*/true) {
			firstShow = false;
			if (rsObj.tables.length>1) {
				var d1 = new Date().getTime();
				var d0 = new Date().getTime();
				if (rsObj.connectType.indexOf('JOIN')>=0) {
					$('#connectType').html('<option value="JOIN">JOIN</option><option value="LEFT JOIN">LEFT JOIN</option><option value="FULL JOIN">FULL JOIN</option>');
				} else {
					$('#connectType').html('<option value="UNION">UNION</option><option value="UNION ALL">UNION ALL</option><option value="MINUS">MINUS</option>');
				}
				$('#connectType').selectric('refresh');
				
				var d2 = new Date().getTime();
				
				var joinInfos = $('#joinInfos');
				if (rsObj.connectType.indexOf('JOIN')>=0){
					joinInfos.find('#d2,#d3,#d4,#d5,#d6,#d7,#d8,#connectDispBut,#connectRelations').css('display','block');
					var jt1 = joinInfos.find('#joint1');
					var jt2 = joinInfos.find('#joint2');
					var d4 = new Date().getTime();
					jt1.html('');jt2.html('');
					var d5 = new Date().getTime();
					var ts = [];
					for (var i=0; i<rsObj.tables.length; i++) {
						if (i==0) jt1.append('<option value="'+rsObj.tables[i]+'">'+rsObj.tables[i]+'</option>');
						else jt2.append('<option value="'+rsObj.tables[i]+'">'+rsObj.tables[i]+'</option>');
					}
					jt1.val(rsObj.tables[0]);
					jt2.val(rsObj.tables[1]);
					jt1.selectric('refresh');
					jt2.selectric('refresh');
					$('#connectType').selectric('refresh');
					jt1.trigger('change');
					jt2.trigger('change');
				} else joinInfos.find('#d2,#d3,#d4,#d5,#d6,#d7,#d8,#connectDispBut,#connectRelations').css('display','none');
				
				var d3 = new Date().getTime();
				//alert((d3-d2) + "--" + (d2-d1) + "--" + (d0-d1));
				connectDiv.css('display','block');
			} else connectDiv.css('display','none');
			
		}
		
		//设置属性
		$('connection').connections('remove');
		if (rsObj.tables.length>1) {
			var selectBox = connectDiv.find('#connectType');
			selectBox.val(rsObj.connectType);
			selectBox.selectric('refresh');
		
			if (rsObj.connectType.indexOf('JOIN')>=0){
				domUtils.refreshRelations(rsObj);
			}
		}

		allFields.html("<div style='float:left;margin:5px 10px 5px 0;'><input id='addCalcFieldInput' type='text' style='width:200px;padding:0;' title='添加计算字段'><img id='addCalcFieldBut' style='margin-left:2px;' src='"+contextPath + guideConf.guideDir+"/img/dl/sql-add.png'></div>");
		var addCalcFieldDone = function(){
			var exp = $('#addCalcFieldInput').val().trim();
			var rs = domUtils.getRs(domUtils.currRs);
			if (rs.calcFields.indexOf(exp)>=0) return;
			if (exp != '') {
				var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				rs.calcFields[rs.calcFields.length] = exp;
				var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			}
		}
		allFields.find('#addCalcFieldBut').css('cursor','pointer').click(function(){
			addCalcFieldDone();
		});
		allFields.find('#addCalcFieldInput').keyup(function(e){
			if ( e.which == 13 ) {
				addCalcFieldDone();
			}
		});
		var fd = {connectToSortable:'#selectedFields',helper:'clone',revert:"invalid",stop:function(event, ui){
			return;
		}};
		
		var cfs = rsObj.calcFields;
		for (var i=cfs.length-1; i>=0; i--) {
			var fi = $("<div class='selectric calcFieldItem' name='"+cfs[i]+"' style='float:left;padding:3px 5px 0 5px;margin:2px 10px 2px 0;height:17px;background-color:#e9ede2;height:17px;'><img class='deleteCFBut' style='vertical-align:-2px;margin-right:5px;' src='"+contextPath + guideConf.guideDir+"/img/dl/delete1.png'>"+cfs[i]+"</div>");
			allFields.prepend(fi);
			fi.draggable(fd);
		}
		var fs = domUtils.getAllFields(rsName);
		var isUnion = rsObj.connectType != '' && rsObj.connectType.indexOf('JOIN')==-1;
		for (var i=fs.length-1; i>=0; i--) {
			fi = $("<div class='selectric fieldItem' name='"+fs[i].name+"' rs='"+(isUnion?rsName:fs[i].rs)+"' type='"+fs[i].type+"' style='float:left;padding:3px 5px 0 5px;margin:2px 10px 2px 0;height:17px;background-color:#e9ede2;height:17px;'>"+(rsObj.tables.length==1?"":(isUnion?rsName:fs[i].rs)+".")+fs[i].name+"</div>");
			allFields.prepend(fi);
			fi.draggable(fd);
		}
		//allFields.prepend("<div id='title' style='float:left;margin:0 20px 5px 0;'><img style='margin-right:5px;vertical-align:middle;' src='"+contextPath+"/dl/img/dl/sql-all-field.png'><span class='attrTitle'>全部字段</span></div>");
		allFields.find('.deleteCFBut').hover(function(){
			$(this).css('box-shadow','0 0 3px #777 inset');
		},function(){
			$(this).css('box-shadow','');
		}).css('cursor','pointer').click(function(){
			var exp = $(this).parent().attr('name');
			var rs = domUtils.getRs(domUtils.currRs);
			var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
			rs.calcFields.remove(exp);
			domUtils.operCheckValid();
			var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
			var oper = {undo:undo,redo:redo};
			operations.addOper(oper);
			eval(redo);
		});
		allFields.find('.fieldItem,.calcFieldItem').dblclick(function(){
			var rs = domUtils.getRs(domUtils.currRs);
			var curr = $(this);
			var dom = $('#addCalcFieldInput');
			dom.focus();
			var pos = getInputSelection(dom[0]).end;
			var val = dom.val();
			var insert = curr.attr('name');
			if (curr.attr('rs')) insert = curr.attr('rs') + '.' + insert;
			var lastVal = val.substring(0, pos) + ' ' + insert + ' ' + val.substring(pos);
			dom.val(lastVal);
			pos = pos + insert.length + 2;
			setCaretToPos(dom[0], pos);
		});
		
		selectedFields.html('');
		dropSelects = [];
		//,selects:[{name:'',exp:'',type:1,order:0:无序/1升序/2降序,seq:1字段次序,aggr:'sum'}] 选出字段，有聚合字段时，不聚合的字段就是分组字段。
		for (var i=0; i<rsObj.selects.length; i++) {
			var si = rsObj.selects[i];
			var di = $("<div class='selectric selectItem' seq='"+(i+1)+"' style='float:left;padding:3px 5px 0 5px;margin:2px 10px 2px 0;height:17px;background-color:#e9ede2;'></div>");
			var exp = $("<span>"+si.exp+"</span>");
			var alias = $("<span>，"+si.name+"</span>");
			var aggrStr = si.aggr==''?'':"<img style='margin-left:2px;vertical-align:-4px;' src='"+contextPath + guideConf.guideDir +  "/img/dl/sql-"+si.aggr+".png'>";
			var aggr = $("<span>"+aggrStr+"</span>");
			var orderStr = '';
			if (si.order>0) orderStr = "<img style='vertical-align:-4px;margin-left:2px;' src='"+contextPath + guideConf.guideDir +  "/img/dl/sql-"+(si.order==1?'up.png':'down.png')+"'>";
			var order = $("<span>"+orderStr+"</span>");
			var del = $("<span><img style='vertical-align:-2px;margin-right:5px;' src='"+contextPath + guideConf.guideDir +  "/img/dl/delete1.png'></span>");
			di.append(del).append(exp).append(alias).append(aggr).append(order);
			exp.dblclick(function(){
				var rs = domUtils.getRs(domUtils.currRs);
				var seq = $(this).parent().attr('seq')-1;
				var curr = $(this);
				var dom = $('#whereInput');
				if (rs.selects[seq].aggr != '') dom = $('#havingInput');
				dom.focus();
				var pos = getInputSelection(dom[0]).end;//cfExp.attr("selectionEnd");
				var val = dom.val();
				var insert = domUtils.getSelectExp(rs.selects[seq]);
				var lastVal = val.substring(0, pos) + ' ' + insert + ' ' + val.substring(pos);
				pos = pos + insert.length + 2;
				
				if (rs.selects[seq].aggr != '') {
					var undo = "operations.setHaving('"+domUtils.currRs+"','"+rs.having+"')";
					var redo = "operations.setHaving('"+domUtils.currRs+"','"+lastVal+"')";
					var oper = {undo:undo,redo:redo};
					operations.addOper(oper);
					eval(redo);
				} else {
					var undo = "operations.setWhere('"+domUtils.currRs+"','"+rs.where+"')";
					var redo = "operations.setWhere('"+domUtils.currRs+"','"+lastVal+"')";
					var oper = {undo:undo,redo:redo};
					operations.addOper(oper);
					eval(redo);
				}
				//
				setCaretToPos(dom[0], pos);
			});
			alias.dblclick(function(){
				var rs = domUtils.getRs(domUtils.currRs);
				var seq = $(this).parent().attr('seq')-1;
				var curr = $(this);
				curr.html(",<input type='text' style='width:70px;' value='"+rs.selects[seq].name+"'><img style='margin-left:2px;' src='"+contextPath + guideConf.guideDir +  "/img/dl/zjb-modify.png'>")
				var currInput = curr.find('input');
				var currImg = curr.find('img');
				var editDone = function(){
					var v = currInput[0].value.trim();
					if (v == '') return;
					if (rs.selects[seq].name==v) {
						domUtils.selectRs(domUtils.currRs);
						return;
					} 
					var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
					domUtils.operModifyField(domUtils.currRs, rs.selects[seq].name, v);
					//rs.selects[seq].name = v;
					var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
					var oper = {undo:undo,redo:redo};
					operations.addOper(oper);
					eval(redo);
				}
				currInput.keyup(function(e){
					if ( e.which == 13 ) {
						editDone();
					}
				});
				setCaretToPos(currInput[0], rs.selects[seq].name.length);
				currImg.css('cursor','pointer').click(editDone);
			});
			aggr.css('cursor','pointer').click(function(){
				var rs = domUtils.getRs(domUtils.currRs);
				var seq = $(this).parent().attr('seq')-1;
				var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				rs.selects[seq].aggr = '';
				var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			});
			order.css('cursor','pointer').click(function(){
				var rs = domUtils.getRs(domUtils.currRs);
				var seq = $(this).parent().attr('seq')-1;
				var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				rs.selects[seq].order = 0;
				var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			});
			del.find('img').hover(function(){
				$(this).css('box-shadow','0 0 3px #777 inset');
			},function(){
				$(this).css('box-shadow','');
			}).css('cursor','pointer').click(function(){
				var rs = domUtils.getRs(domUtils.currRs);
				var seq = $(this).parent().parent().attr('seq')-1;
				var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				rs.selects.remove(rs.selects[seq]);
				domUtils.operCheckValid();
				var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
				var oper = {undo:undo,redo:redo};
				operations.addOper(oper);
				eval(redo);
			});
			di.droppable(selectDrop);
			
			selectedFields.append(di);
			dropSelects = di;
		}
		
		$('#whereInput').val(charUtils2.decoding(rsObj.where));
		$('#havingInput').val(charUtils2.decoding(rsObj.having));
		
		domUtils.refreshSql(rsName);
		//<div style='float:left;margin:2px 10px 2px 0;padding-top:3px;'>年龄段,年龄段<img style='margin-left:2px;' src="<%=cp %>/dl/img/dl/delete1.png"></div>
		//<div style='float:left;margin:2px 10px 2px 0;padding-top:3px;'>性别,<input value='性别' type='text' style='width:70px;padding:0;'><img style='margin-left:2px;' src="<%=cp %>/dl/img/dl/zjb-modify.png"><img style='margin-left:2px;' src="<%=cp %>/dl/img/dl/delete1.png"></div>
		//<div style='float:left;margin:2px 10px 2px 0;padding-top:3px;'>姓+名,姓名计数,计数<img style='margin-left:2px;' src="<%=cp %>/dl/img/dl/delete1.png"></div>

		domUtils.currRs = rsName;
		topResize();
	}
	, refreshSql : function(rsName){
		var result = domUtils.toSql(rsName);
		$('#finalSql').html(result.sql + result.error);
	}
	, refreshRelations : function(rsObj){
		var connectRelations = $("#connectRelations");	
		connectRelations.css('display',$('#controlConnects').attr('src').indexOf('show')>=0?'none':'block');	
		connectRelations.html('');
		var tableDom = $('<table style="border-collapse:collapse;margin:10px 0 5px;" border=0 cellspacing=0 cellpadding=0></table>');
		connectRelations.append(tableDom);
		var tr0 = $('<tr></tr>');
		tableDom.append(tr0);
		for (var i=0; i<rsObj.tables.length; i++) {
			var bl = "border-left:"+(i==0?'1px solid':'0px dashed')+' lightgray;';
			if (i != rsObj.tables.length-1) bl += 'border-right:0;';
			tr0.append('<td style="border:1px solid lightgray;border-bottom:0;'+bl+'"><div tname="'+rsObj.tables[i]+'" style="margin:1px;padding:3px 5px;background-color:#E9ECF8;">'+rsObj.tables[i]+'</div></td>');
		}

		var used = [];//1,3
		var relations = [];//{from:'1,2',to:'1,3'}; 行,列
		var fs = [];//表.字段
		var fspos = [];//1,3
		for (var i=0; i<rsObj.tables.length-1; i++) {
			for(var j=0; j<rsObj.connects.length; j++){
				if (used.indexOf(j)>=0) continue;
				var cj = rsObj.connects[j];
				
				var fromfs = cj[0]+'.'+cj[1];
				var topos = j+'_'+rsObj.tables.indexOf(cj[2]);
				var tofs = cj[2]+'.'+cj[3];

				if (cj[0] == rsObj.tables[i] && rsObj.tables.indexOf(cj[2])>i) {
				} else if(cj[2] == rsObj.tables[i] && rsObj.tables.indexOf(cj[0])>i) {
					//fromfs = cj[2]+'.'+cj[3];
					//topos = j+'_'+rsObj.tables.indexOf(cj[0]);
					//tofs = cj[0]+'.'+cj[1];
				} else {
					continue;
				}
				var idx = fs.indexOf(fromfs);
				var frompos = j+'_'+i;
				if (idx == -1) {
					fs[fs.length] = fromfs;
					fspos[fspos.length] = frompos;
					used[used.length] = j;
				} else {
					frompos = fspos[idx];
					topos = frompos.split('_')[0]+'_'+rsObj.tables.indexOf(cj[2]);
				}
				fs[fs.length] = tofs;
				fspos[fspos.length] = topos;
				//idx = fs.indexOf(tofs);
				//if (idx == -1) {
				//	fs[fs.length] = tofs;
				//	fspos[fspos.length] = topos;
				//} else topos = fspos[idx];
/*
				if (cj[0] == rsObj.tables[i] && rsObj.tables.indexOf(cj[2])>i) {
				} else if(cj[2] == rsObj.tables[i] && rsObj.tables.indexOf(cj[0])>i) {
					fromfs = cj[2]+'.'+cj[3];
					topos = j+'_'+rsObj.tables.indexOf(cj[0]);
					tofs = cj[0]+'.'+cj[1];
				} else {
					continue;
				}
				var idx = fs.indexOf(fromfs);
				var frompos = j+'_'+i;
				if (idx == -1) {
					fs[fs.length] = fromfs;
					fspos[fspos.length] = frompos;
				} else frompos = fspos[idx];
				idx = fs.indexOf(tofs);
				if (idx == -1) {
					fs[fs.length] = tofs;
					fspos[fspos.length] = topos;
				} else topos = fspos[idx];
*/
				relations[relations.length] = {from:frompos,to:topos};
			}
		}
		
		for(var j=0; j<rsObj.connects.length; j++){
			var trj = $('<tr></tr>');
			var has = false;
			for (var i=0; i<rsObj.tables.length; i++) {
				var idx = fspos.indexOf(j+'_'+i);
				var bl = "border-left:"+(i==0?'1px solid':'0px dashed')+' lightgray;';
				if (i != rsObj.tables.length-1) bl += 'border-right:0;';
				if (idx >= 0) {
					var f = fs[idx].split('.');
					trj.append('<td style="border:1px solid lightgray;'+bl+'"><div title="点击删除关系" f="'+fs[idx]+'" id="conid'+fspos[idx]+'" style="cursor:pointer;margin:4px 6px;">'+f[1]+'</div></td>');
					trj.find('div').hover(function(){
						$(this).css('color','lightgray');
					},function(){
						$(this).css('color','');
					}).click(function(){
						var f=$(this).attr('f').split('.');
						var cs = "[";
						for (var i=0; i<rsObj.connects.length; i++) {
							var c = rsObj.connects[i];
							if ((c[0]==f[0]&&c[1]==f[1])||(c[2]==f[0]&&c[3]==f[1])) {
								if (cs != "[") cs += ',';
								cs += "['"+c[0]+"','"+c[1]+"','"+c[2]+"','"+c[3]+"']";
							}
						}
						cs += "]";
						var undo = "operations.addConnects('"+domUtils.currRs+"',"+cs+")";
						var redo = "operations.removeConnects('"+domUtils.currRs+"',"+cs+")";
						var oper = {undo:undo,redo:redo};
						operations.addOper(oper);
						eval(redo);
					});
					has = true;
				}
				else trj.append('<td style="border:1px solid lightgray;'+bl+'">&nbsp;</td>');
			}
			if (has) tableDom.append(trj);
		}
		tableDom.find('tr').last().find('td').css('border-bottom','1px solid lightgray');
		
		for (var i=0; i<relations.length; i++) {
			//tableDom.find('#conid'+relations[i].from+',#conid'+relations[i].to).connections({css:{border: '1px solid blue',opacity: 0.5,zIndex:5}});
		}
	}
	,getRsIndex : function(name) {
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			if (rsi.name == name) return i;
		}
	}
	//operAddField : function(rsName,srcRs,fName,type,order,aggr){
	,addRs : function(index, t, connectRs, connectType){
		domInfos.rss[domInfos.rss.length] = {name:'RS'+index,tables:[t],connectType:'',connects:[],calcFields:[],selects:[],where:'',having:''};
		var fs = domUtils.getAllFields('RS'+index);
		var selects = [];
		var selects2 = [];
		for (var i=0; i<fs.length; i++) {
			//domUtils.operAddField('RS'+index,fs[i].rs,fs[i].name,fs[i].type,0,'');
			//selects[selects.length] = {name:fs[i].name,exp:fs[i].rs+'.'+fs[i].name,type:fs[i].type,order:0,aggr:''};
			//selects2[selects2.length] = {name:fs[i].name,exp:fs[i].rs+'.'+fs[i].name,type:fs[i].type,order:0,aggr:''};
		}
		//domUtils.getRs('RS'+index).selects = selects;
		if (connectRs && connectRs != '') {
			var cts;
			//TODO, 确定连续的join、union是否必须要用同一种方式？不同方式，是否可以变通的以嵌套方式实现？
			if (connectType == 'JOIN') cts = ['JOIN','LEFT JOIN','FULL JOIN'];
			else cts = ['UNION', 'UNION ALL', 'MINUS'];
			var prs = domUtils.getParentRs(connectRs);
			if (prs && cts.indexOf(prs.connectType)>=0) {
				prs.tables.splice(prs.tables.indexOf(connectRs)+1,0,'RS'+index);
				//if (connectType.indexOf('JOIN')>=0) prs.selects = prs.selects.concat(selects2);
			} else {
				var crs = domUtils.getRs(connectRs).selects;
				var crs2 = [];
				var prsname = 'RS'+(index+1);
				domUtils.refreshConnects(connectRs, prsname);
				//domUtils.addTable('RS'+(index+1),[connectRs,'RS'+index],connectType,[],[],crs2,'','');//TODO,默认把结果集字段设置到selects里面
				domInfos.rss[domInfos.rss.length] = {name:prsname,tables:[connectRs,'RS'+index],connectType:connectType,connects:[],calcFields:[],selects:crs2,where:'',having:''};
				if (connectType.indexOf('JOIN')>=0) {
					for (var i=0; i<crs.length; i++) {
						domUtils.operAddField(prsname,connectRs,crs[i].name,crs[i].type,0,'');
						//crs2[i] = {name:crs[i].name,exp:connectRs+'.'+crs[i].name,type:crs[i].type,order:0,aggr:''};
					}
					//crs2 = crs2.concat(selects2);
				} else {
					for (var i=0; i<crs.length; i++) {
						//crs2[i] = {name:crs[i].name,exp:prsname+'.'+crs[i].name,type:crs[i].type,order:0,aggr:''};
						domUtils.operAddField(prsname,prsname,crs[i].name,crs[i].type,0,'');
					}
				}
			}
		}
		for (var i=0; i<fs.length; i++) {
			domUtils.operAddField('RS'+index,fs[i].rs,fs[i].name,fs[i].type,0,'');
		}
	}
	,removeRs : function(name){
		var removeRss = domUtils.getAllChildRss(name);
		var prs = domUtils.getParentRs(name);
		if (prs) {
			if (prs.tables.length>2) {
				var pos = prs.tables.indexOf(name);
				prs.tables.remove(name);
				for (var i=prs.selects.length-1; i>=0; i--) {
					if (prs.selects[i].exp.indexOf(name+'.')>=0) prs.selects.remove(prs.selects[i]);
				}
			} else {
				removeRss = removeRss.concat([prs.name]);
				var pprs = domUtils.getParentRs(prs.name);
				if (pprs) {
					var pos = pprs.tables.indexOf(prs.name);
					pprs.tables.splice(pos,1,prs.tables[prs.tables.indexOf(name)==0?1:0]);
				}
			}
		}
		for (var i=0; i<removeRss.length; i++) {
			domInfos.rss.remove(domUtils.getRs(removeRss[i]));
		}
		domUtils.operCheckValid();
	}
	,getMaxRs : function() {
		var max = 0;
		for (var i=0; i<domInfos.rss.length; i++) {
			if (domInfos.rss[i].name.indexOf('RS') == 0) {
				try {
					var curr = parseInt(domInfos.rss[i].name.substring(2));
					if (curr > max) max = curr;
				} catch(e){}
			}
		}
		for (var i=0; i<dbInfos.tables.length; i++) {
			if (dbInfos.tables[i].name.indexOf('RS') == 0) {
				try {
					var curr = parseInt(dbInfos.tables[i].name.substring(2));
					if (curr > max) max = curr;
				} catch(e){}
			}
		}
		return max;
	}
	,getRs : function(name){
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			if (rsi.name == name) return rsi;
		}
	}
	,getParentRs : function(name){
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			if (rsi.tables.indexOf(name)>=0) return rsi;
		}
	}
	,refreshConnects : function(oldRs, newRs){
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			var idx = rsi.tables.indexOf(oldRs);
			if (idx>=0) rsi.tables.splice(idx, 1, newRs);
		}
	}
	,getAllChildRss : function(name) {
		var childRss = [name];
		var rsObj = domUtils.getRs(name);
		if (!rsObj) return [];
		if (rsObj.tables.length == 1) return childRss;
		for (var i=0; i<rsObj.tables.length; i++) {
			childRss = childRss.concat(domUtils.getAllChildRss(rsObj.tables[i]));
		}
		return childRss;
	}
	//{name:'rs2',tables:['t2222222222'],connectType:'',connects:[],calcFields:[],selects:[],where:'',having:''},
	//,selects:[{name:'',exp:'',type:1,order:0升序/1降序,seq:1字段次序,aggr:'sum'}] 选出字段，有聚合字段时，不聚合的字段就是分组字段。
	,rsToString : function(name) {
		var rsObj = domUtils.getRs(name);
		
		var str = "{name:'"+rsObj.name+"',tables:[";
		if (rsObj.tables.length>0) str += "'"+rsObj.tables.join("','")+"'";
		str += "],connectType:'"+rsObj.connectType+"',connects:[";
		for (var i=0; i<rsObj.connects.length; i++) {
			if (i>0) str += ",";
			if (rsObj.connects[i].length == 0) str += "[]";
			else str += "['" + rsObj.connects[i].join("','") + "']";
		}
		str += "],calcFields:["
		if (rsObj.calcFields.length > 0) str += "'" + rsObj.calcFields.join("','")+"'";
		str += "],selects:[";
		str += domUtils.selectsToString(rsObj.selects);
		str += "],where:'"+rsObj.where+"',having:'"+rsObj.having+"'}";
		return str;
	}
	,getTop : function() {
		//if (domUtils.currTop!=null) return domUtils.currTop;
		var allChildRss = [];
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			if (rsi.tables.length > 1) {
				allChildRss = allChildRss.concat(rsi.tables);
			}
		}
		for (var i=0; i<domInfos.rss.length; i++) {
			var rsi = domInfos.rss[i];
			if (allChildRss.indexOf(rsi.name) == -1) {
				domUtils.currTop = rsi;
			}
		}
		return	domUtils.currTop;
	}
	//获得自己及所有子结果集的定义，json字串中的字符用单引号
	,toString : function(name) {
		if (domUtils.getTop()==null) return 'rss:[]';
		if (!name) name = domUtils.currTop.name;
		var childRss = domUtils.getAllChildRss(name);
		var rss = 'rss:[';
		for (var i=0; i<childRss.length; i++) {
			if (i>0) rss += ',';
			rss += domUtils.rsToString(childRss[i]);
		}
		rss += ']';
		return rss;
	}
	,selectsToString : function(selects){
		var str = '';
		for (var i=0; i<selects.length; i++) {
			var si = selects[i];
			if (i>0) str+=",";
			str += "{name:'"+si.name+"',exp:'"+si.exp+"',type:"+si.type+",order:"+si.order+",aggr:'"+si.aggr+"'}";
		}
		return str;
	}
	,getSelectExp : function(select){
		return select.aggr==''?select.exp:(select.aggr+"("+select.exp+")");
	}
	//TODO 数据类型会变动，不准确，暂不处理。
	,getAllFields : function(name){
		var rs = domUtils.getRs(name);
		var fields=[];
		if (!rs || rs.tables.length == 1) {
			var tObj;
			if (!rs) tObj = dbTableUtils.getTable(name);
			else tObj = dbTableUtils.getTable(rs.tables[0]);
			for (var i=0; i<tObj.fields.length; i++) {
				fields[fields.length] = {name:tObj.fields[i].name,type:tObj.fields[i].type,rs:name};
			}
		} else {
			if (rs.connectType.indexOf('JOIN')>=0) {
				for (var i=0; i<rs.tables.length; i++) {
					var rsi = domUtils.getRs(rs.tables[i]);
					for (var j=0; j<rsi.selects.length; j++) {
						fields[fields.length] = {name:rsi.selects[j].name,type:rsi.selects[j].type,rs:rsi.name};
					}
				}
			} else {
				var rs0 = domUtils.getRs(rs.tables[0]);
				for (var i=0; i<rs0.selects.length; i++) {
					fields[fields.length] = {name:rs0.selects[i].name,type:rs0.selects[i].type,rs:rs0.name};
				}
			}
		}
		return fields;
	}
	,getConnect : function(rsName,t1,f1,t2,f2) {
		var rsObj = domUtils.getRs(rsName);
		if (!rsObj) return;
		for (var i=0; i<rsObj.connects.length; i++) {
			var ci = rsObj.connects[i];
			if ((ci[0]==t1&&ci[1]==f1&&ci[2]==t2&&ci[3]==f2) || (ci[2]==t1&&ci[3]==f1&&ci[0]==t2&&ci[1]==f2)) return ci;
		}
	}
	,toSql : function(rsName) {
		var result = {
			sql : ''
			,error : ''
		};
		var rs = domUtils.getRs(rsName);
		if (rs.selects.length == 0) {
			result.error = rsName + ' : 没有选出字段';
			return result;
		}
		var sql = 'SELECT ';
		var groups = '';
		var hasAggr = false;
		var orders = '';
		for (var i=0; i<rs.selects.length; i++) {
			if (i>0) sql += ',';
			var exp = domUtils.getSelectExp(rs.selects[i]);
			sql += exp+' '+rs.selects[i].name;
			if (rs.selects[i].aggr != '') hasAggr = true;
			else {
				if (groups != '') groups += ',';
				groups += exp;
			}
			if (rs.selects[i].order > 0) {
				if (orders != '') orders += ',';
				if (rs.selects[i].order == 1) orders += exp + " ASC";
				else orders += exp + " DESC";
			}
		}
		sql += ' FROM ';
		if (rs.tables.length == 1) {
			var t = dbTableUtils.getTable(rs.tables[0]);
			if (t.sql && t.sql != '') sql += "("+t.sql+") " + rsName;
			else sql += rs.tables[0] + ' ' + rsName;
		}
		else {
			if (rs.connectType.indexOf('JOIN')>=0) {
				for (var i=0; i<rs.tables.length; i++) {
					if (i>0) sql += ' '+rs.connectType + ' ';
					var subSql = domUtils.toSql(rs.tables[i]);
					if (subSql.error != '') {
						result.error = subSql.error;
						return result;
					}
					sql += '(' + subSql.sql + ') ' + rs.tables[i];
					if (i>0) {
						var currJoins = '';
						for(var j=0; j<rs.connects.length; j++){
							var cj = rs.connects[j];
							if ((cj[0] == rs.tables[i] && rs.tables.indexOf(cj[2])<i) || (cj[2] == rs.tables[i] && rs.tables.indexOf(cj[0])<i)) {
								if (currJoins != '') currJoins += ' AND ';
								currJoins += cj[0]+'.'+cj[1]+'='+cj[2]+'.'+cj[3];
							}
						}
						if (currJoins == '') {
							result.error = rsName + ' : 子结果集['+rs.tables[i]+']没有设置与前面结果集的连接条件';
							return result;
						}
						sql += ' ON ' + currJoins;
					}
				}
			} else {
				sql += '('
				for (var i=0; i<rs.tables.length; i++) {
					if (i>0) sql += ' '+rs.connectType + ' ';
					var subSql = domUtils.toSql(rs.tables[i]);
					if (subSql.error != '') {
						result.error = subSql.error;
						return result;
					}
					sql += '(' + subSql.sql + ')';
				}
				sql += ') '+rs.name
			}
		}
		if (rs.where != '') {
			sql += ' WHERE ' + charUtils2.decoding(rs.where);
		}
		if (hasAggr && groups != '') {
			sql += ' GROUP BY ' + groups;
		}
		if (rs.having != '') {
			sql += ' HAVING ' + charUtils2.decoding(rs.having);
		}
		if (orders != '') {
			sql += ' ORDER BY ' + orders;
		}
		result.sql = sql;
		return result;
	}
	,getRsField : function(rs,name){
		for (var i=0; i<rs.selects.length; i++) {
			if (rs.selects[i].name == name) return rs.selects[i];
		}
	}
	,getNewName : function(rs, name) {
		if (!domUtils.getRsField(rs, name)) return name;
		var c = 0;
		while (!domUtils.getRsField(rs, name+(c++))) return name+c;
	}
	,operAddField : function(rsName,srcRs,fName,type,order,aggr){
		var rs = domUtils.getRs(rsName);
		var name = domUtils.getNewName(rs,charUtils2.remove(fName));
		rs.selects[rs.selects.length] = {name:name,exp:(srcRs==''?'':(srcRs+'.'))+fName,type:type,order:order,aggr:aggr};
		var prs = domUtils.getParentRs(rsName);
		if (!prs) return;
		if (prs.connectType.indexOf('JOIN')>=0 || prs.tables[0]==rsName) {
			domUtils.operAddField(prs.name,rsName,name,type,order,aggr);
		}
	}
	,operCheckValid : function(){
		var fs = domUtils.getAllRsFields();
		var fs2 = [];
		for (var i=0; i<fs.length; i++) fs2[i] = (fs[i].rs==''?'':fs[i].rs+'.')+fs[i].name;
		var found = true;
		while (found) {
			found = false;
			for (var i=0; i<domInfos.rss.length; i++) {
				var si = domInfos.rss[i].selects;
				for (var j=si.length-1; j>=0; j--) {
					if (fs2.indexOf(si[j].exp)==-1) {
						fs2.remove(domInfos.rss[i].name+'.'+si[j].name);
						si.remove(si[j]);
						found = true;
					}
				}
			}
		}
	}
	,getAllRsFields : function() {
		var top = domUtils.getTop();
		var rss = [];
		var fs = [];
		for (var i=0; i<domInfos.rss.length; i++) {
			fs = fs.concat(domUtils.getAllFields(domInfos.rss[i].name));
		}
		return fs;
	}
	,operModifyField : function(rsName, oldName, newName){
		var rs = domUtils.getRs(rsName);
		var name = domUtils.getNewName(rs,newName);
		var f = domUtils.getRsField(rs, oldName).name = name;
		domUtils.updateParentFields(rsName, oldName, name);
	}
	,updateParentFields : function(rsName, oldName, newName){
		var prs = domUtils.getParentRs(rsName);
		if (!prs) return;
		if (prs.connectType.indexOf('JOIN')==-1 && prs.tables[0]!=rsName) return;
		var o = rsName+'.'+oldName;
		var n = rsName+'.'+newName;
		for (var i=0; i<prs.calcFields.length; i++) {
			prs.calcFields[i] = prs.calcFields[i].replaceAll(o,n);
		}
		for (var i=0; i<prs.selects.length; i++) {
			var si = prs.selects[i];
			if (si.exp == o) {
				var name = domUtils.getNewName(prs,newName);
				si.name = name;
				domUtils.updateParentFields(prs.name, oldName, name);
			}
			si.exp = si.exp.replaceAll(o,n);
		}
	}
	,operModifyRsName : function(oldRs, newRs){
		var prs = domUtils.getParentRs(oldRs);
		var o = oldRs+'.';
		var n = newRs+'.';
		if (prs) {
			var idx = prs.tables.indexOf(oldRs);
			prs.tables[idx] = newRs;
			for (var i=0; i<prs.calcFields.length; i++) {
				prs.calcFields[i] = prs.calcFields[i].replaceAll(o,n);
			}
			for (var j=0; j<prs.selects.length; j++) {
				prs.selects[j].exp = prs.selects[j].exp.replaceAll(o,n);
			}
		}	
		var rs = domUtils.getRs(oldRs);
		for (var i=0; i<rs.calcFields.length; i++) {
			rs.calcFields[i] = rs.calcFields[i].replaceAll(o,n);
		}
		for (var j=0; j<rs.selects.length; j++) {
			rs.selects[j].exp = rs.selects[j].exp.replaceAll(o,n);
		}
		rs.name = newRs;	
	}
	
}

	//",{name:'地区表',sql:'...',def:'...',fields:[{name:'地区编码',type:2,pk:1},{name:'地区名称',type:2}]}"+

var dbTableUtils = {
	getTable : function(name){
		for (var i=0; i<dbInfos.tables.length; i++) {
			if (dbInfos.tables[i].name == name) return dbInfos.tables[i];
		}
	}
	//生成自定义中间表json，字符串用双引号
	,toString : function(){
		var ts = "";
		for (var i=0; i<dbInfos.tables.length; i++) {
			if (!dbInfos.tables[i].def) continue;
			if (ts != '') ts += ','
			ts += dbTableUtils.tableToString(dbInfos.tables[i]);
		}
		return ts == ""?ts:"tables:[" + ts + "]"
	}
	,tableToString : function(t) {
		var str = '{name:"'+t.name+'",sql:"'+t.sql+'",def:"'+t.def+'",fields:[';
		for (var i=0; i<t.fields.length; i++){
			if (i>0) str += ',';
			str += '{name:"'+t.fields[i].name+'"';
			if (t.fields[i].type) str += ',type:'+t.fields[i].type;
			if (t.fields[i].pk) str += ',pk:'+t.fields[i].pk;
			str += '}'
		}
		str += ']}'
		return str;
	}
	,checkUsed : function(t){
		var infos = [domInfos];
		for (var i=0; i<dbInfos.tables.length; i++) {
			if (!dbInfos.tables[i].def) continue;
			infos[infos.length] = eval('({'+dbInfos.tables[i].def+'})');
		}
		for (var i=0; i<infos.length; i++) {
			var info = infos[i];
			for (var j=0; j<info.rss.length; j++) {
				var ts = info.rss[j].tables;
				if (ts.length==1 && ts[0]==t) return true;
			}
		}
		return false;
	}
}


var topLayout,middleLayout,innerLayout;
function initPage () {
	var doms = $("#bodyDiv").html();
	$("#bodyDiv").html('');
	$("body").html(doms);

	//zNodes = generateTreeNodes(lglInfos);
	generateTables();
	topLayout = $('body').css('color', '#373636').layout({
		resizable : true
		, spacing_open:7  // ALL panes
		, spacing_closed:7 // ALL panes
		, north : {
			spacing_open:0,
			spacing_closed:0,
			size : "0",
			maxSize : "00",
			minSize : "0",
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
			,size: "37"
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
			size : "200",
			minSize : "200",
			onresize : function() {
				topResize();
			}
		}
	});

	//topLayout.toggle("west");
	//$('.ui-state-disabled').removeClass('ui-state-disabled');
	$('#tableDiv').css('height', parseInt($('#mytabs').css('height'))-24+'px');

	$(document).bind('mousedown selectstart', function(e) {
	    return $(e.target).is('input, textarea, select, option');
	});	
	
	var structDiv = $('#structDiv');
	structDiv.css('cursor','pointer');
	structDiv.click(function(e){
		var curr = $(e.target)
		var rsName = curr.attr('rsName');
		if (curr.attr('tdpos') != 1){
			var ps = curr.parents("td[tdpos=1]");
			if (ps != null) {
				rsName = $(ps[0]).attr('rsName');
			}
		}
		if (!rsName) return;

		domUtils.selectRs(rsName);
	});
	$('#fieldAttrs').find('div[id!="title"]').draggable({
		containment: 'document',
		appendTo:'body',
		helper: function( event ) {
			var curr = $(this);
			var c = curr.clone();
			c.css('z-index','10001').css('padding','2px 10px').css('opacity', 0.4);
			return c;
		},
		stop: function(event, ui) {
			//setTimeout("refreshSelectBgColor();",1);
		}
	});
	var allFields = $('#allFields');
	var selectedFields = $('#selectedFields');
	selectedFields.sortable({revert: 10,tolerance:'pointer',items:'.selectItem',helper:'clone',stop:function(event, ui){
		var ds = selectedFields.find("div");
		var rs = domUtils.getRs(domUtils.currRs);
		var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		if (selectedFields.find("div[name]").length > 0) {
			var idx=-1,dom;
			for (var i=0; i<ds.length; i++) {
				if (!$(ds[i]).attr('seq')) {
					idx = i;
					dom = $(ds[i]);
					break;
				}
			}
			if (idx==-1) return;
			var n = dom.attr('name');
			var r = dom.attr('rs');
			var t = dom.attr('type');
			if (!t) t = 2;
			if (!r) r = '';
			else r += '.';
			rs.selects.splice(idx,0,{name:charUtils2.remove(n),exp:r+n,type:t,order:0,aggr:''});
		} else {
			var selects = [];
			for (var i=0; i<ds.length; i++) {
				if (!$(ds[i]).attr('seq')) return;
				selects[i] = rs.selects[$(ds[i]).attr('seq')-1];
			}
			rs.selects = selects;
		}
		var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	},placeholder:{
		element: function(currentItem) {
			var h = $(currentItem).height();
			var w = $(currentItem).width();
			return $("<div class='selectric' style='padding:3px 5px 0 5px;margin:2px 10px 2px 0;height:17px;border:1px solid lightgray;width:" + w + "px;height:" + h + "px;float:left;red;'></div>")
		},
		update: function(container, p) {
			return;
		}
	}});
	var whereDrop = {
		accept: function(d){
			var seq = d.attr('seq');
			if (!seq) return false;
			var rs = domUtils.getRs(domUtils.currRs);
			return rs.selects[seq-1].aggr == '';
		},
		//activeClass: "ui-state-hover",
		hoverClass: "ui-state-active",
		drop: function( event, ui ) {
			var rs = domUtils.getRs(domUtils.currRs);
			var seq = ui.draggable.attr('seq')-1;
			var dom = $('#whereInput');
			dom.focus();
			var pos = getInputSelection(dom[0]).end;//cfExp.attr("selectionEnd");
			var val = dom.val();
			var insert = domUtils.getSelectExp(rs.selects[seq]);
			var lastVal = val.substring(0, pos) + ' ' + insert + ' ' + val.substring(pos);
			pos = pos + insert.length + 2;
			
			var undo = "operations.setWhere('"+domUtils.currRs+"','"+rs.where+"')";
			var redo = "operations.setWhere('"+domUtils.currRs+"','"+charUtils2.encoding(lastVal)+"')";
			var oper = {undo:undo,redo:redo};
			operations.addOper(oper);
			setTimeout(function(){eval(redo);},50);
			
			setCaretToPos(dom[0], pos);
		}
    };
	var havingDrop = {
		accept: function(d){
			var seq = d.attr('seq');
			if (!seq) return false;
			var rs = domUtils.getRs(domUtils.currRs);
			return rs.selects[seq-1].aggr != '';
		},
		//activeClass: "ui-state-hover",
		hoverClass: "ui-state-active",
		drop: function( event, ui ) {
			var rs = domUtils.getRs(domUtils.currRs);
			var seq = ui.draggable.attr('seq')-1;
			var dom = $('#havingInput');
			dom.focus();
			var pos = getInputSelection(dom[0]).end;//cfExp.attr("selectionEnd");
			var val = dom.val();
			var insert = domUtils.getSelectExp(rs.selects[seq]);
			var lastVal = val.substring(0, pos) + ' ' + insert + ' ' + val.substring(pos);
			pos = pos + insert.length + 2;

			var undo = "operations.setHaving('"+domUtils.currRs+"','"+rs.having+"')";
			var redo = "operations.setHaving('"+domUtils.currRs+"','"+charUtils2.encoding(lastVal)+"')";
			var oper = {undo:undo,redo:redo};
			operations.addOper(oper);
			setTimeout(function(){eval(redo);},50);
			setCaretToPos(dom[0], pos);
		}
    };
	$('#whereInput').keyup(function(){
		var rs = domUtils.getRs(domUtils.currRs);
		var newW = charUtils2.encoding($(this).val().trim());		
		if (rs.where.trim() == newW) return;
		var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		domUtils.getRs(domUtils.currRs).where = newW;
		var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		domUtils.refreshSql(domUtils.currRs);
		//eval(redo);
	}).droppable(whereDrop);
	$('#havingInput').keyup(function(){
		var rs = domUtils.getRs(domUtils.currRs);			
		var newH = charUtils2.encoding($(this).val().trim());	
		if (rs.having.trim() == newH) return;
		var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		domUtils.getRs(domUtils.currRs).having = newH;
		var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		domUtils.refreshSql(domUtils.currRs);
		//eval(redo);
	}).droppable(havingDrop);
	
	//$('#finalSql').enableSelection();
	topResize = function(){
		$('#finalSql').css('width',$('#mainTop').width()-$('#structDiv').width()-40+'px');
		$('.attrBody,#connectRelations').css('width',$('#mainTop').width()-120+'px');
		$('#tableDiv').css('height', parseInt($('#mytabs').css('height'))-24+'px');
	};
	$('#structDiv').resize(topResize);
	$('#mainDiv').scroll(function(){
		$('connection').connections('update');
	});
			
	var ct = $('#connectType');
	ct.selectric();
	ct.bind({ "change": function(){
		var rsObj = domUtils.getRs(domUtils.currRs);
		var old = rsObj.connectType;
		var redo = "operations.setConnectType('"+domUtils.currRs+"','"+$(this).val()+"')";
		var undo = "operations.setConnectType('"+domUtils.currRs+"','"+old+"')";
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	}});

	var jt1 = $('#joint1');
	var jt2 = $('#joint2');
	var jf1 = $('#joinf1');
	var jf2 = $('#joinf2');
	jt1.selectric();
	jt2.selectric();
	jf1.selectric();
	jf2.selectric();
	jt1.bind({ "change": function(){
		var t1 = $(this).val();
		jf1.html('');
		var fs = domUtils.getAllFields(t1);
		var fields = [];
		for (var i=0; i<fs.length; i++) {
			jf1.append('<option value="'+fs[i].name+'">'+fs[i].name+'</option>');
		}
		jf1.selectric('refresh');
	}});
	jt2.bind({ "change": function(){
		var t2 = $(this).val();
		jf2.html('');
		var fs = domUtils.getAllFields(t2);
		var fields = [];
		for (var i=0; i<fs.length; i++) {
			jf2.append('<option value="'+fs[i].name+'">'+fs[i].name+'</option>');
		}
		jf2.selectric('refresh');
	}});
	$('#joinInfos a').click(function(){
		$('#controlConnects').attr('src',$('#controlConnects').attr('src').replaceAll('show','hide'));
		var t1 = jt1.val();
		var f1 = jf1.val();
		var t2 = jt2.val();
		var f2 = jf2.val();
		if (f1=='' || f2=='') {
			domUtils.selectRs(domUtils.currRs);
			return;
		}
		var cObj = domUtils.getConnect(domUtils.currRs,t1,f1,t2,f2);
		if (cObj) {
			domUtils.selectRs(domUtils.currRs);
			return;
		}
		var redo = "operations.addConnects('"+domUtils.currRs+"',[['"+t1+"','"+f1+"','"+t2+"','"+f2+"']])";
		var undo = "operations.removeConnects('"+domUtils.currRs+"',[['"+t1+"','"+f1+"','"+t2+"','"+f2+"']])";
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	});
	
	$('#tableFilter').keyup(function(){
		generateTables(this.value.trim());
	});
	
	domUtils.refresh();
}



function generateTables(filter){
	var container = $("#tableDiv");
	container.html('');
	for (var i=0; i<dbInfos.tables.length; i++) {
		var t = dbInfos.tables[i];
		if (filter == '' || (t.name+t.alias).indexOf(filter)>=0)
			addItem(container, t.name, t.alias);
	}
}

function addItem(container, name, alias) {
	var but = $('#fieldShowStyle');
	if (!alias) alias = name;
	var title = '';
	var tObj = dbTableUtils.getTable(name);
	var curr = $('<div id="tableItem" title="' + title + '" style="overflow:hidden;padding:4px 0 0 6px;margin-top:2px;border:0px;height:22px;background-image:url(' + contextPath+ guideConf.guideDir + consts.imgFolder + consts.img14 + ');color:' + consts.color23 + ';" class="item" t="' + name + '" ta="' + alias + '"><div style="float:left;">' + alias + '</div><div style="float:right;width:20px;"></div><div style="clear:both;"></div></div>');
	if (tObj.sql && !dbTableUtils.checkUsed(name)) {
		var del = $('<img style="cursor:pointer;vertical-align:-2px;" src="' + contextPath + guideConf.guideDir + consts.imgFolder +'delete1.png" border=0>');
		$(curr.children()[1]).html(del);
		del.hover(function(){
				$(this).css('box-shadow','0 0 3px #777 inset');
		},function(){
			$(this).css('box-shadow','');
		}).click(function(){
			dbInfos.tables.remove(tObj);
			generateTables();
		});
	}
	
	curr.dblclick(function(){
		var curr = $(this);
		if (!tObj.sql) return;
		var old = domUtils.toString();
		var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.refresh();")';
		var redo = 'operations.setInfos("'+tObj.def+'","domUtils.refresh();")';
		var oper = {undo:undo,redo:redo};
		if (old != tObj.def) operations.addOper(oper);
		eval(redo);
	});
	curr.attr('canDrag', 1);
	curr.css('cursor','move').draggable({
		//handler : "a",
		revert : true,
		//cursor : 'move',
		revertDuration: 1,
		containment: 'document',
		appendTo:'body',
		//connectToSortable : "#tableDiv",
		helper: function( event ) {
			var curr = $(this);
			var c = curr.clone();
			c.css('z-index','10001').css('padding','2px 10px').css('opacity', 0.4);
			return c;
		},
		stop: function(event, ui) {
			//setTimeout("refreshSelectBgColor();",1);
		}
	});
	
	container.append(curr);
}

var bigDrop = {
	tolerance : 'pointer',
	accept:function(d) {
		if (d.attr('id') == 'tableItem') return true;
		return false;
	},
	drop: function(event, ui) {
		var t = ui.draggable.attr('t');
		var ta = ui.draggable.attr('ta');
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			d.css(d.attr('ct'),d.attr('c1'));
			if (d.attr('act') != 3) continue;
			//if (new Date().getTime() - lastOpt < 50) return;
			//lastOpt = new Date().getTime();
			var index = domUtils.getMaxRs()+1;
			var rsName = d.attr('rsName');
			var connectType = '';
			var tdpos = d.attr('tdpos');
			if (!rsName) rsName = '';
			if (tdpos == 2) connectType = 'JOIN'; //默认join
			else if (tdpos == 3) connectType = 'UNION'; //默认 union
			
			
			var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.refresh();domUtils.selectRs(\''+domUtils.currRs+'\');")';
			domUtils.addRs(index,t,rsName,connectType);
			var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.refresh();domUtils.selectRs(\'RS'+index+'\');")';
			var oper = {undo:undo,redo:redo};
			operations.addOper(oper);
			eval(redo);
			//return;
		}
	},
	over: function(event, ui) {
		/*
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			d.attr('act', 1);
		}
		*/
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			d.css(d.attr('ct'),d.attr(d.attr('defaultConnect')==1?'c3':'c2'));
			d.attr('act', d.attr('defaultConnect')==1?3:2);
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

var itemDrop = {
	tolerance : 'pointer',
	accept:function(d) {
		if (d.attr('id') == 'tableItem') return true;
		return false;
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
		for (var i=0; i<dropDoms.length; i++) {
			var d = dropDoms[i];
			if (d.attr('act') == 1) continue;
			d.attr('act', d.attr('defaultConnect')==1?3:2);
			d.css(d.attr('ct'),d.attr(d.attr('defaultConnect')==1?'c3':'c2'));
		}
	},
	activate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c2'));
	},
	deactivate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c1'));
	}
}

var selectDrop = {
	tolerance : 'pointer',
	accept:function(d) {
		//alert(d.attr('aggr'));
		if (d.attr('aggr') || d.attr('order')) return true;
		return false;
	},
	drop: function(event, ui) {
		var aggr = ui.draggable.attr('aggr');
		var order = ui.draggable.attr('order');
		$(this).css('background-color','#e9ede2');
		var seq = $(this).attr('seq')-1;
		var rs = domUtils.getRs(domUtils.currRs);
		var undo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		if (aggr) rs.selects[seq].aggr = aggr;
		if (order) rs.selects[seq].order = order;
		var redo = 'operations.setInfos("'+domUtils.toString()+'","domUtils.selectRs(\''+domUtils.currRs+'\');")';
		var oper = {undo:undo,redo:redo};
		operations.addOper(oper);
		eval(redo);
	},
	over: function(event, ui) {
		$(this).removeClass('selectric').addClass('selectric2');	
		//$(this).css('background-color','#5c8fca');
	},
	out: function(event, ui) {
		$(this).removeClass('selectric2').addClass('selectric');	
		//$(this).css('background-color','#e9ede2');
	},
	activate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c2'));
	},
	deactivate: function(event, ui) {
		//$(this).css($(this).attr('ct'),$(this).attr('c1'));
	}
}


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
		$('#undoBut').attr('disabled', !canu).attr('src',contextPath + guideConf.guideDir +  consts.imgFolder + 'undo' + (canu?'':'-h') + '.png');
		$('#redoBut').attr('disabled', !canr).attr('src',contextPath + guideConf.guideDir +  consts.imgFolder + 'redo' + (canr?'':'-h') + '.png');
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
	}
	,addConnects : function(rsName,connects) {
		var rs = domUtils.getRs(rsName);
		for (var i=0; i<connects.length; i++) {
			rs.connects[rs.connects.length] = connects[i];
		}
		domUtils.selectRs(rsName);
	},removeConnects : function(rsName,connects) {
		for (var i=0; i<connects.length; i++) {
			var ci = connects[i];
			var c = domUtils.getConnect(rsName,ci[0],ci[1],ci[2],ci[3]);
			if (c) domUtils.getRs(rsName).connects.remove(c);
		}
		domUtils.selectRs(rsName);
	}
	,setConnectType : function(rsName,type) {
		domUtils.getRs(rsName).connectType = type;
		domUtils.selectRs(rsName);
	}
	,setWhere : function(rsName,where) {
		domUtils.getRs(rsName).where = where;
		domUtils.selectRs(rsName);
	}
	,setHaving : function(rsName,having) {
		domUtils.getRs(rsName).having = having;
		domUtils.selectRs(rsName);
	}
	//oper
	,setInfos : function(info,oper) {
		domInfos = eval("({"+info+"})");
		if (oper) eval(oper);
	}
	
}

function addMiddleTable(){
	var sql = domUtils.toSql(domUtils.currTop.name);
	if (sql.error == '') sql = sql.sql;
	else {
		alert(sql.error);
		return;
	}
	var t = {name:domUtils.currTop.name,sql:sql,def:domUtils.toString(),fields:[]};
	var dbTable = dbTableUtils.getTable(domUtils.currTop.name);
	if (dbTable) {
		if (dbTable.sql) { // 中间表
			if (confirm("表名["+domUtils.currTop.name+"]已存在，是否要覆盖掉?")){
				t = dbTable;
				t.sql = sql;
				t.def = domUtils.toString();
				t.fields = [];
			} else return;
		} else { // 数据库表，不能被覆盖
			alert("表名["+domUtils.currTop.name+"]已存在，请修改名称后再保存！");
			return;
		}
	}
//	,selects:[{name:'',exp:'',type:1,order:0升序/1降序,seq:1字段次序,aggr:'sum'}] 选出字段，有聚合字段时，不聚合的字段就是分组字段。
	for (var i=0; i<domUtils.currTop.selects.length; i++) {
		var fi = domUtils.currTop.selects[i];
		t.fields[t.fields.length] = {name:fi.name,type:fi.type}
	}
	if (dbInfos.tables.indexOf(t)==-1) dbInfos.tables[dbInfos.tables.length] = t;
	generateTables();
}

function saveLocalSQLX() {
	var s1 = domUtils.toString();
	var s2 = dbTableUtils.toString();
	if (s1==''&&s2=='') return;
	var json = s1 + "<;>" + s2;
	var name = "untitled.sqlx";
	$('#downSQLXForm #path').attr('value', name);
	$('#downSQLXForm #dlConf').attr('value', json);
	$('#downSQLXForm #type').attr('value', 'sqlx');
	$('#downSQLXForm #pageId').attr('value', pageId);
	$('#downSQLXForm').submit();
}

var openSQLXName;
function openLocalSQLX() {
	openSQLXName = $('#localSQLXFile').val();
	var idx = openSQLXName.lastIndexOf('/');
	if (idx == -1) idx = openSQLXName.lastIndexOf('\\');
	if (idx >= 0) openSQLXName = openSQLXName.substring(idx + 1);
	var f = openSQLXName.toLowerCase();
	if (f.indexOf('.sqlx') == -1) {
		alert("请选择[.sqlx]类型文件！");
		return;
	}
	//alert(f);
	$('#openSQLXForm').submit();
}


//var aaa = eval("({a:new Date('2001','1','1')})")
function tree_setCurrNode() {
	window.location.href = contextPath + '/dl/jsp/sql.jsp?dbName='+dbName+'&dlFile=' + encodeURIComponent('tmp/' + openSQLXName);
}

function toggleConnects(){
	var dom = $('#controlConnects');
	if (dom.attr('src').indexOf('show')>=0) {
		dom.attr('src',dom.attr('src').replaceAll('show','hide'));
	} else {
		dom.attr('src',dom.attr('src').replaceAll('hide','show'));
	}
	domUtils.selectRs(domUtils.currRs);
}

function querySql() {
	var result = domUtils.toSql(domUtils.currRs);
	if (result.sql == '') {
		alert(result.error);
		return;
	}
	//result.sql = 'select 公司代码 from 分红';
	
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath + "/dl/jsp/result.jsp");
	form.attr('target', '_blank');
	form.append('<input type="hidden" name="show" value="1">');
	form.append('<input type="hidden" name="action" value="2">');
	form.append('<input type="hidden" name="name" value="">');
	form.append('<input type="hidden" name="oper" value="execute">');
	form.append('<input type="hidden" name="pageId" value="' + pageId + '">');
	form.append('<input type="hidden" name="dql" value="' + result.sql + '">');
	form.append('<input type="hidden" name="attrs" value="">');
	//if (qyx) form.append('<input type="hidden" name="qyx" value="">');
	//if (execTime) form.append('<input type="hidden" name="execTime" value="">');
	$('body').append(form);
	form[0].submit();
}


function createMiddleTable() {
	var result = domUtils.toSql(domUtils.currRs);
	if (result.sql == '') {
		alert(result.error);
		return;
	}
	//result.sql = 'select 公司代码 from 分红';
	//var qyx = "/" + new Date().getTime() + ".q_y_x";
	var form = $('<form method="post" accept-charset="UTF-8"></form>');
	form.attr('action',contextPath + "/dl/jsp/result.jsp");
	form.attr('target', 'hiddenFrame');
	form.append('<input type="hidden" name="show" value="1">');
	form.append('<input type="hidden" name="action" value="2">');
	form.append('<input type="hidden" name="name" value="'+domUtils.currRs+'">');
	form.append('<input type="hidden" name="oper" value="create">');
	form.append('<input type="hidden" name="pageId" value="' + pageId + '">');
	form.append('<input type="hidden" name="dql" value="' + result.sql + '">');
	form.append('<input type="hidden" name="attrs" value="">');
	form.append('<input type="hidden" name="id" value="' + domUtils.currRs + '">');
	//if (qyx) form.append('<input type="hidden" name="qyx" value="'+path+'">');
	//if (execTime) form.append('<input type="hidden" name="execTime" value="">');
	$('body').append(form);
	form[0].submit();
	alert('已提交生成中间表的查询任务，执行成功后，刷新本页，即可使用新保存的中间表！');
	//startServerStatus();
}


