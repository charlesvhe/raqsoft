var rpxIndex = 1;
var controlUtil = null;
var lastChange = {"test":"test"};
var x=0;
var divTableControl = null;
var cleanMode = false;
var currDiv = null;
var divide = 10;
var minDivWidth = 50;
var countArea = 0;
var createRpxType = 1;
var selectLayoutsModel = 0;
var ua = navigator.userAgent.toLocaleLowerCase();
var editingReportName = false;
var domModified = false;
var diyR = 0;
var diyC = 0;
function cleanLastChangeOnMouseDown(){
	document.onmousedown = function(){
		lastChange = {};
	}
}

function dbdInit(layout){
	Array.prototype.deleteIndex = function(index){
		return this.slice(0, index).concat(this.slice(parseInt(index, 10) + 1));
	};
	
	Array.prototype.deleteValue = function(value){
		var i = 0;
		var hasValue = false;
		for(i in this){
			if(this[i] == value) {
				hasValue = true;
				break;
			}
		}
		if(hasValue){
			return this.slice(0, i).concat(this.slice(parseInt(i, 10) + 1));
		}else{
			return this;
		}
	}
	
	Array.prototype.changeIndex = function(index, newvalue){
		this[index] = newvalue;
	};
	controlUtil = initAreaControl();
	divTableControl = createDivTableControl(layout);
	divTableControl.defaultLayout.tableLeft = "0px";
	divTableControl.defaultLayout.tableTop = "0px";
	var model = false;
	initDivTable(layout, model);
//	if(layout && layout.cleanMode){
//		setTimeout(function(){cleanModeOn();},100);
//	}
	//初始化ds选择器，随当前选中表变化而变化
	var sel = $('#selectDs');
	if(guideConf.openDOlap != "new"){
		for (var i=0; i<rqAnalyse.dataSets.length; i++) {
			var dsn = rqAnalyse.dataSets[i].name;
			var opt = $('<option value="'+dsn+'">'+dsn+'</option>');
			sel.append(opt);
		}
	}
	sel.attr('disabled',true);
	$('.layoutsImg').off();
	$('.layoutsImg').mouseover(function(e){$(e.target).css('filter','opacity(1.0)')})
	.mouseout(function(e){$(e.target).css('filter','opacity(0.5)');})
	.click(function(e){
		aly.cache.reports = [];
		selectLayoutsModel = e.target.id;
		var layoutm= layoutModels[selectLayoutsModel].layout;
		if(layoutm.areas.length < rqAnalyse.rpxs.length) {
			alert('新建布局格数小于当前报表数！');
			return;
		}
		var olapstr = olapObj.getConfStr(layoutm);
		guideConf.openDOlap = "new";
		divTableControl.divInfos.divs = [];
		aly.set(olapstr);
		cleanSideBoard();
	});
	if(finalView) {
		$('.main').css('background-color','white');
		$('.divCell').css('border','solid 1px #eeeeee');
	}
	//加载editors
	if(beta != "null") {
		initEditors();
	}
}


function initAreaControl(){
	return {
		setAreaByReportName: function(reportName,divid,id){
			for(var a = 0; a < this.areas.length; a++){
				if(this.areas[a].report && this.areas[a].report == reportName){
					this.areas[a].inDivCell = divid;
					break;
				}
			}
		}
		,checkGetAreaName: function(name, targetArr){
			for(var i = 0; i < targetArr.length; i++){
				if(targetArr[i].report == name){
					name += '_1';
					return this.checkGetAreaName(name,targetArr);
				}
			}
			return name;
		}
		,draggableFunc: function draggable(div,handleType,needClickFunc){
			div.draggable({
				distance: 20 ,
				delay: 300,
				helper:function(){
				      return '<div style="width:'+div.css('width')+';height:'+div.css('height')+';z-index:'+1001+';background:black;opacity:0.4;"></div>';
			    },
			    iframeFix: true,
				handle: handleType,stop:function(event, ui ){
				if (parseInt(div.css("top"))<0){
					div.css('top',0+'px');
				}
				if (parseInt(div.css("left"))<0){
					div.css('left',0+'px');
				}
				var idcount = div.attr("count");
				idcount = parseInt(idcount);
				//controlUtil.areas[idcount].xy={x:div.css("left"),y:div.css("top")};
			}});
			if(needClickFunc){
				needClickFunc.click(function(){
					popAddReport(this.parentElement,addReportToArea(addedReportName, areaDom));
				});
			}
		},
		addTo: function(divCellId,identifyAreaId){
			if(identifyAreaId == null) identifyAreaId = countArea;
			var div = $("<div class='singleArea' count="+identifyAreaId+" id='singleArea"+identifyAreaId+"'></div>");
			var areaObj = {
				id:parseInt(identifyAreaId)
				,xy:{x:div.css("left"),y:div.css("top")}
				,hw:{h:div.css("height"),w:div.css("height")}
				,inDivCell:divCellId
			}
			//新版直接添加了虚拟的报表
			//var plusimg = $("<img src='../img/plus.png' class='plus'/>");
			this.draggableFunc(div,'img div');
			//var delimg = $("<img src='../img/delete.png' class='del' onClick='controlUtil.removeArea($(this.parentElement))'/>")
//			div.append(plusimg);
//			div.append(delimg);
			$('#'+divCellId).append(div);
//			plusimg.css("width",plusimg.css("height"));
//			plusimg.css("height",plusimg.css("width"));
//			centerContent(div,plusimg);
			if(!identifyAreaId) countArea++;
			else countArea = Math.max(countArea,parseInt(identifyAreaId))+1;
			//执行一次即可？
			divTableControl.droppableFunc($('.divCell').not('[row=0]').not('[col=0]'));
			return areaObj;
		},
		areas:[
//			"id":{
//				xy:[]
//				,hw:[]
//			}
		],
		changeInfo: function(oldRpxName, rpxName){
			for(var a = 0; a < this.areas.length; a++){
				if(this.areas[a].report == oldRpxName) {
					this.areas[a].report = rpxName;
					$('#'+this.areas[a].inDivCell).attr("confName", rpxName);
					var areaId = "singleArea"+this.areas[a].id;
					$('#'+areaId).attr("confName", rpxName);
					$('#'+areaId).find('iframe').attr("confName", rpxName);
					return areaId;
				}
			}
		},
		dashboardParse: function dashboardParse(area1){
			initDialogOver = false;
			$(area1).find('iframe').remove();//2020.1.8
			$(area1).append('<iframe name="'+$(area1).attr("confName")+'" confName="'+$(area1).attr("confName")+'" style="border:0;width:inherit;height:100%;"></iframe>')
			initDialogOver = true;
			$('iframe[confName="'+$(area1).attr("confName")+'"]').attr('src',"./empty.jsp?fromDbd=true&guideDir="+guideConf.guideDir+"&confName="+encodeURIComponent($(area1).attr("confName")));
			//if(!previewDbd) 
			redefineFrameHeight($(area1).attr("confName"));
		}
		,removeArea:function(area,permission){
			removeReport($(area).find('iframe').attr('confname'),permission);
			controlUtil.areas = controlUtil.areas.deleteValue(this.getAreaByReport($(area).attr('confName')));
			$(area).remove();
		}
		,getAreaByReport:function(name, layoutAreas){
			if(!layoutAreas) layoutAreas = this.areas;
			for(var a = 0; a < layoutAreas.length; a++){
				if(layoutAreas[a].report == name) return layoutAreas[a];
			}
			return null;
		}
		,getAreaByInDivCell:function(inDivCellId, layoutAreas){
			if(!layoutAreas) layoutAreas = this.areas;
			for(var a = 0; a < layoutAreas.length; a++){
				if(layoutAreas[a].inDivCell == inDivCellId) return layoutAreas[a];
			}
			return null;
		}
		,getAreaCount:function(p){
			var count = null;
			if(typeof p == "string") count = $("#"+p).attr('count');
			else  count = $(p).attr('count');
			for(var a = 0; a < this.areas.length; a++){
				if(this.areas[a].id == count) return this.areas[a];
			}
			return null;
		}
		,getAreaFolded:function(name){
			var ar = this.getAreaByReport(name);
			if(ar == null) return 0;
			if(ar.folded == null) return 0;
			else return ar.folded;
		}
	};
}

function initDivTable(layout,model){
	//初始2*3
	var isMobileView = false;
	try{
		isMobileView = mobileView;
	}catch(e){}
	if(ua.indexOf('mobile') >= 0){
		minit();
	}
	var containerWidth = $('.main').css('width');
	var containerHeight = $('.main').css('height');
	divTableControl.defaultLayout.lastRow = divTableControl.defaultLayout.lastRow ? divTableControl.defaultLayout.lastRow : 2;
	divTableControl.defaultLayout.lastCol = divTableControl.defaultLayout.lastCol ? divTableControl.defaultLayout.lastCol : 3;
	var row = 0;
	var col = 0;
	var top = 0;
	var left = 0;
	var height = divTableControl.defaultLayout.height ? divTableControl.defaultLayout.height : 
		(parseInt(containerHeight)-20)/divTableControl.defaultLayout.lastRow;
	var width = divTableControl.defaultLayout.width ? divTableControl.defaultLayout.width : 
		(parseInt(containerWidth)-20)/divTableControl.defaultLayout.lastCol;
	height += "px";
	width += "px";
	if(isMobileView) width = $('.main').css('width');
	var cw,rh;
	if(!model && layout && layout.divWHs){//预设和缩放
		cw = layout.divWHs.cw;
		rh = layout.divWHs.rh;
		var wratio = parseInt($('.main').css('width'))/parseInt(layout.mainWidth);
		var hratio = parseInt($('.main').css('height'))/parseInt(layout.mainHeight);
		for(var c = 0; c < cw.length; c++){
			cw[c] = (parseInt(cw[c])*wratio)+"px";
		}
		for(var r = 0; r < rh.length; r++){
			if(ua.indexOf('mobile') < 0){
				rh[r] = (parseInt(rh[r])*hratio)+"px";
			}else{
				//wratio = parseInt($('#mobileViewMain').css('width'))/parseInt(layout.mainWidth);
				//rh[r] = (parseInt(rh[r])*hratio)+"px";
			}
		}
	}
	if(isMobileView){
		var mobileWidth = parseInt($('.main').css('width'));// - divide * 2;
		divTableControl.defaultLayout.lastCol = 1;
		divTableControl.defaultLayout.lastRow = rqAnalyse.rpxs.length;
		if(layout && layout.divWHs){
			for(var c = 0; c < layout.divWHs.cw.length; c++){
				layout.divWHs.cw[c] = mobileWidth;
			}
			var rh2 = [];
			rh2[rh2.length] = layout.divWHs.rh[0];
			for(var r = 1; r <= divTableControl.defaultLayout.lastRow; r++){
				//r当前报表行号
				var rname = rqAnalyse.rpxs[r-1].name;
				var layoutRow = controlUtil.getAreaByReport(rname, layout.areas).inDivCell.split('_')[1];
				rh2[rh2.length] = layout.divWHs.rh[layoutRow];
			}
			rh = rh2;
			layout.mergeCellIds = [];
		}else{
			
		}
	}else if(!layout){
		var diff = rqAnalyse.rpxs.length - divTableControl.defaultLayout.lastRow * divTableControl.defaultLayout.lastCol;
		divTableControl.defaultLayout.lastRow = diff > 0
			? (rqAnalyse.rpxs.length + divTableControl.defaultLayout.lastCol) / divTableControl.defaultLayout.lastCol - 1 : divTableControl.defaultLayout.lastRow;
	}
	//按行按列生成div表格
	var startpos = -1;//是否生成行号列号 -1时生成，目前是必要的，拖拽合并格对此有依赖
	for(var x = startpos; x < divTableControl.defaultLayout.lastRow; x++){
		row = x+1;
		left = 0+divide;
		var h = (x == -1 ? '20px':height);
		if( layout && !model && guideConf.openDOlap != "new" && rh) {
			h = rh[row];
		}
		for(var y = startpos; y < divTableControl.defaultLayout.lastCol; y++){
			col = y+1;
			var id = "d"+"_"+row+"_"+col;
//			var onclick = "";
//			if(y == -1 && x != -1){
//				onclick = " onClick='showRowMenu(this);'";
//			}else if(y != -1 && x == -1){
//				onclick = " onClick='showColMenu(this);'";
//			}else{
//				onclick = " onClick='divTableControl.divCellAddReport(this);'";
//			}
			var w = (y == -1 ? '20px':width);
			if( layout && !model && guideConf.openDOlap != "new" && cw) {
				w = cw[col];
			}
			var currentDiv = $("<div row='"+row+"' col='"+col+"' id='"+id+"' class='divCell'"+onclick+"></div>");
			currentDiv.css("top",top+"px").css("left",left+"px")
				.css("height", h).css("width",w)
				.css("background-color","white").css("position","absolute");
			
			if(x == -1 || y == -1) currentDiv.css('display','none');
			if( x == -1 ) {
				currentDiv.css('text-align','center');
			}
			if( y == -1 ) {
				currentDiv.css('line-height','200px');
			}
			$('#contents').append(currentDiv);
			if(y == -1 || x == -1) {
				currentDiv.css('background-color','rgb(210, 210, 210)');
			}else{
				currentDiv.addClass('resiz');
			}
			if(y == -1 && x != -1){
				currentDiv.html(row);
			}
			if(y != -1 && x == -1){
				currentDiv.html(col);
			}
			if(y != -1) left += parseInt(w)+divide;
			//单元格选中，新版转到area
//			currentDiv.click(function(event){
//				var div = event.target;
//				divTableControl.changeChoosedDiv(div);
//			});			
		}
		if(x != -1) top += parseInt(h)+divide+3;
	}
	//再调整main的大小容纳全部报表格
	var v1 = top +  divide;
	if(layout) v1 = top + divide;
	var v2 = left  + divide+10;
	if(layout) v2 = left + divide+10;
	changeMainWidthHeight(v1,v2);
	
	
	
	if(!finalView) resizableNormalCell();
	if(layout) {
		divTableControl.mergeCellIds = layout.mergeCellIds;
		aly.sysparams = layout.sysparams;
	}
	for(var i = 0; i < divTableControl.mergeCellIds.length; i++){
		var s = divTableControl.mergeCellIds[i].split('_');
		var r1 = s[1];
		var c1 = s[2];
		var r2 = s[3];
		var c2 = s[4];
		divTableControl.mergeDiv(r1,c1,r2,c2);
	}
	var divCells = $('.divCell').not('[row=0]').not('[col=0]');
	try{
		if(mobileFinal && layout.mobileRpxOrder && layout.mobileRpxOrder.length > 0) {
			var rpxs = rqAnalyse.rpxs;
			rqAnalyse.rpxs = [];
			for(var o = 0; o < layout.mobileRpxOrder.length; o++){
				var orderedReportName = layout.mobileRpxOrder[o];
				var fr = findReportInArray(rpxs,orderedReportName);
				rqAnalyse.rpxs.push(fr);
			}
		}
	}catch(e){}
	if(isMobileView) {
		layout = {};
		layout.params = [];
		layout.paramNames = [];
		layout.mergeCellIds = [];
		layout.areas = new Array();
//		var divCells = $('.divCell').not("[row=0]").not("[col=0]");
//		while(divCells.length < rqAnalyse.rpxs.length){
//			divTableControl.createRow();
//			divCells = $('.divCell').not("[row=0]").not("[col=0]");
//		}
		for(var x = 0; x < rqAnalyse.rpxs.length; x++){
			var rpxName = rqAnalyse.rpxs[x].name;
			var divCell = divCells[x];
			layout.areas[x] = {
				hw:{h:"0px",w:"0px"},
				id:x,
				inDivCell: divCell.id,
				report:rpxName,
				xy:{x:"",y:""}
			}
		}
	}
	for(var x = 0; x < divCells.length; x++){
		var sArea = $(divCells[x]).find('.singleArea');
		if(sArea == null || sArea.length == 0){
			var identifyAreaId = controlUtil.getAreaByInDivCell(divCells[x].id,layout?layout.areas:null);
			identifyAreaId = identifyAreaId?identifyAreaId.id:null;
			var areaid = addAreaIntoDivCell($(divCells[x]).attr('id'),identifyAreaId);
			var areaDom = $('#'+areaid);
			var addedReportName = "图表名称"+x;
			if(layout && (guideConf.openDOlap == 'true' || guideConf.openDOlap == true || guideConf.openDOlap == 'new')){
				addedReportName = controlUtil.getAreaByInDivCell(divCells[x].id,layout.areas).report;
			}
			addReportToArea(addedReportName, areaDom);
		}
	}
	if(!finalView && !previewDbd ) refreshItemsReportWhereBuf();
	if(layout){
		for(var i = 0 ; i < layout.areas.length; i++){
			var areaE = layout.areas[i];
			if(areaE.type == "1"){
				controlUtil.areas = layout.areas;
				break;
			}
		}
	}
	if(rqAnalyse == null || rqAnalyse.rpxs == null || rqAnalyse.rpxs.length == 0){
		return;
	}
	if(layout) {
		controlUtil.areas = layout.areas;
	}
	if(!layout){
		//打开的olap中没有layout的时候自动增加一个areas按顺序排布报表
		layout = {};
		layout.params = [];
		layout.paramNames = [];
		layout.mergeCellIds = [];
		layout.areas = new Array();
		var divCells = $('.divCell').not("[row=0]").not("[col=0]");
		//新增空间
//		while(divCells.length < rqAnalyse.rpxs.length){
//			divTableControl.createRow(layout);
//			divCells = $('.divCell').not("[row=0]").not("[col=0]");
//		}
		for(var x = 0; x < rqAnalyse.rpxs.length; x++){
			var rpxName = rqAnalyse.rpxs[x].name;
			var divCell = divCells[x];
			layout.areas[x] = {
				hw:{h:"0px",w:"0px"},
				id:x,
				inDivCell: divCell.id,
				report:rpxName,
				xy:{x:"",y:""}
			}
		}
	}
	controlUtil.areas = layout.areas;
	if(rqAnalyse.rpxs.length > 0){
		for(var r = 0; r < rqAnalyse.rpxs.length; r++){
			var area = controlUtil.getAreaByReport(rqAnalyse.rpxs[r].name);
			if(area == null) continue;
			var inDivCell = $('#'+area.inDivCell);
			var oldName = inDivCell.find('.barReportName').html();
			inDivCell.find('.barReportName').html(rqAnalyse.rpxs[r].name).attr('value',rqAnalyse.rpxs[r].name);
			inDivCell.find('a.reportRemove').attr('href',"javascript:removeReport('"+rqAnalyse.rpxs[r].name+"')");
			var rmbar = inDivCell.find('.rmbar').attr('id','rmbar_'+rqAnalyse.rpxs[r].name)
		}
	}
	
	initReport(layout);
	if(!finalView && !previewDbd ) refreshItemsReportWhereBuf();
	if(isMobileView) $('.singleArea').find('iframe').css('width','auto');
}
var lockGoUp = true;
var lockGoLeft = true;
function resizableNormalCell(){
	setTimeout(function(){
		$('.divCell.resiz').resizable({
			helper:"ui-resizable-helper",
			resize:function(event,ui){
				var divCell = event.target;
				var lastVh = 0;
				var lastVw = 0;
				var row = $(divCell).attr('row');
				var col = $(divCell).attr('col');
				//$(divCell).find('iframe').hide();
				if(document.onmouseup == null){
					document.onmouseup=function(){
						eval("lastChange.row_"+row+"=0;lastChange.col_"+col+"=0;");
						document.onmouseup = null;
						//防止快速拖
//						if(parseInt($(divCell).css('width')) < 20 
//								|| parseInt($(divCell).css('height')) < 20 
//							) {
							var refr = $(divCell).attr('row');
							var refc = $(divCell).attr('col');
							var newh = $('#d_'+refr+'_0').css('height');
							var neww = $('#d_0_'+refc).css('width');
							$(divCell).css('width',neww).css('height',newh);
//						}
						$(divCell).mouseup();
						$('.resiz').find('.reportMengBan').remove();
					}
				}
				var os = ui.originalSize;
				var s = ui.size;
				var vw = 0;
				var vh = 0;
				//console.log("---------------");
				if(eval("lastChange.row_"+row)){
					lastVh = eval("lastChange.row_"+row);
				}
				
				var theRow = $(".divCell[row="+row+"]").not('.mergeCell');
				var theNextRow = $(".divCell[row="+(parseInt(row)+1)+"],mergeCell[row="+(parseInt(row)+1)+"]");
				var rowHeightSum = parseFloat(theNextRow.css('height'))+parseFloat(os.height)+lastVh;
				var oldThisRowHeight = theRow.css("height");
				var oldNextRowHeight = theNextRow.css("height");
				vh = parseFloat(s.height) - parseFloat(os.height);
				if(vh != 0){
					if(rowHeightSum <= parseFloat(s.height) + minDivWidth){
	//					theRow.css('height', (parseFloat(os.height)+lastVh) + 'px').css('ling-height', (parseFloat(os.height)+lastVh) + 'px');
	//					theNextRow.css('height', (rowHeightSum - (parseFloat(os.height)+lastVh)) + 'px');
						theRow.css('height',(os.height+lastVh)+"px");
						theNextRow.css('height',oldNextRowHeight);
					}else if(s.height < minDivWidth){
						//theRow.css('height', '15px').css('line-height','15px');
						//theNextRow.css('height', (rowHeightSum - 15) + 'px');
						theRow.css('height',oldThisRowHeight);
						theNextRow.css('height',oldNextRowHeight);
					}else{
						eval("lastChange.row_"+row+"="+vh+";");
						var theRowNewHeight = parseFloat(s.height);
						var theNextRowNewHeight = rowHeightSum - parseFloat(s.height);
						theRow.css('height',theRowNewHeight + 'px');//.css('line-height',parseFloat(s.height) + 'px');影响bar的位置,要改为缩放报表
						//if(!viewDbd) 
						theRow.find('iframe').css('height',(theRowNewHeight - 20 - divide - 5)+"px");
						theNextRow.not('.mergeCell').css('height', theNextRowNewHeight + 'px');
						theNextRow.css('top', (parseFloat(theNextRow.css('top')) + vh - lastVh) + 'px');
						//if(!viewDbd)
							theNextRow.find('iframe').css('height',(theNextRowNewHeight - 20 - divide - 5) + 'px');
						//列结尾相同的合并格跟随运动
						divTableControl.changeRelMergeCell(row,'height',vh - lastVh);
						if(row == divTableControl.defaultLayout.lastRow) {//尾行
							$('.main').css('height',(parseInt($('.main').css('height'))+vh - lastVh)+'px');
						}
					}
				}
				if(eval("lastChange.col_"+col)){
					lastVw = eval("lastChange.col_"+col);
				}
				vw = parseFloat(s.width) - parseFloat(os.width);
				if(vw != 0){
					var theCol = $(".divCell[col="+col+"]").not('.mergeCell');
					var theNextCol = $(".divCell[col="+(parseInt(col)+1)+"],mergeCell[col="+(parseInt(col)+1)+"]");
					var oldThisColWidth = theCol.css("width");
					var oldNextColWidth = theNextCol.css('width');
					var colWidthSum = parseFloat(theNextCol.css('width'))+parseFloat(os.width)+lastVw;
					if(colWidthSum <= parseFloat(s.width) + minDivWidth){
//						theCol.css('width', (parseFloat(os.width)+lastVw) + 'px');
//						theNextCol.css('width', (colWidthSum - (parseFloat(os.width)+lastVw)) + 'px');
						theCol.css('width',(os.width+lastVw)+"px");
						theNextCol.css('width',oldNextColWidth);
						return;
					}else if(s.width < minDivWidth){
						//theCol.css('height', '15px');
						//theNextCol.css('width', (colWidthSum - 15) + 'px');
						theCol.css('width',oldThisColWidth);
						theNextCol.css('width',oldNextColWidth);
						return;
					}
					eval("lastChange.col_"+col+"="+vw+";");
					theCol.css('width', parseFloat(s.width) + 'px');
					theNextCol.not('.mergeCell').css('width', (colWidthSum - parseFloat(s.width)) + 'px');
					theNextCol.css('left', (parseFloat(theNextCol.css('left')) + vw - lastVw) + 'px');
					divTableControl.changeRelMergeCell(col,'width',vw - lastVw);
					if(col == divTableControl.defaultLayout.lastCol) {//尾列
						//$('.dbd-center').css('width',(parseInt($('.dbd-center').css('width'))+vw - lastVw)+'px');
						$('.main').css('width',(parseInt($('.main').css('width'))+vw - lastVw)+'px');
					}
				}
			}
		});
		$('.ui-resizable-handle').on('mousedown',function(e){
			//$(e.target).parent().find('iframe').hide();
			//console.log('mousedown handle');
			//console.log($(e.target));
			activeReportMengBan($(e.target).parent());
		});
	},0);
}

function initReport(layout,ds){
	aly.params = layout.params;
	aly.paramNames = layout.paramNames;
	aly.dsWhereParams = layout.dsWhere;
	aly.dsWhereParams = layout.dsWhere;
	for(var j = 0; j < controlUtil.areas.length; j++ ){
		//reAddAreaIntoDivCell(controlUtil.areas[j].inDivCell,controlUtil.areas[j].id);
		nonedlg_ok_refreshReport($('#singleArea'+controlUtil.areas[j].id),controlUtil.areas[j].report);
	}
	if(guideConf.openDOlap == "new") {
		aly.refreshAll();
	}
	setTimeout(function(){
		//aly.refreshAll();
		cleanSideBoard();
	},100);
}

function nonedlg_ok_refreshReport(currArea,rname) {
	var n = rname;
	if (aly.getRpx(n)) {
		//console.log( '识别了报表' + n);
	}else{
		return;
	}
	$(currArea).attr("confName",n);
	controlUtil.dashboardParse(currArea);
}

function addAreaIntoDivCell(id,identifyAreaId){
	var areaObj = controlUtil.addTo(id,identifyAreaId);
	controlUtil.areas.push(areaObj);
	return "singleArea"+areaObj.id;
}
function reAddAreaIntoDivCell(id,identifyAreaId){
	var areaObj = controlUtil.addTo(id,identifyAreaId);
	return "singleArea"+areaObj.id;
}

function createRandomColor(){
	var arr = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
	var j = 0;
	var color = "#";
	while(j < 6){
		var i = random16();
		color += arr[i];
		j++;
	}
	return color;
}

function random16(){
	var a = Math.floor(Math.random()*10);
	var b = Math.floor(Math.random()*10);
	var i = 0;
	if(a<5){
		a = 0;
	}else{
		a = 1;
	}
	if(a == 0){
		i = b;
	}else{
		if(b>5) b = 5;
		i = ""+a+b;
		i = parseInt(i);
	}
	return i;
}

function centerContent(div,content){
//	var dh = $(div).css("height");
//	var dw = $(div).css("width");
//	dh = parseInt(dh.split("px")[0]);
//	dw = parseInt(dw.split("px")[0]);
//	$(content).css("top",dh/2+"px").css("left",dw/2+"px").css("transform","translate(-50%,-50%)");
	
}

var createDivTableControl = function(layout){
	var divInfos = null;
	var lastRow = null;
	var lastCol = null;
	if(layout){
		divInfos = layout.divInfos;
		
		lastCol = divInfos.cols;
		lastRow = divInfos.rows;
	}
	if(diyC != 0) lastCol = diyC; 
	if(diyR != 0) lastRow = diyR; 
	return {
	getInnerReport:function(div){
		if(div == null) return null;
		var area = $(div).find('.singleArea');
		if(area) return area.attr('confName');
	},
	currentDiv:{row:1,col:1,range:null},
	defaultLayout:{lastRow:lastRow,lastCol:lastCol,tableTop:$('#contents').css('top'),tableLeft:$('#contents').css('left')},
	//divIds:new Array(),//d_1_2[_1]第一行第二列[拆分第几个]，初始给5*5，d_1_1~d_5_5
	divInfos:(divInfos ? divInfos : {
		rows:2,
		cols:3,
		divContents:[]
	}),//rows:4,cols:4,divContents:{"d_1_2":{height:,width:,top:,left:,info:{reportName:}}}
	moveReport:function(event,ui,areaDivId,toDivRow,toDivCol) {
    	var divCellId = event == null ? "" : event.target.id;
    	var divCell = null;
    	if(divCellId == ""){
    		divCell = $('.divCell[row='+toDivRow+'][col='+toDivCol+']');
    	}else{
    		divCell = $("#"+divCellId);
    	}
    	var area = event == null ? $("#"+areaDivId) : ui.draggable;
    	var exchange = false;
    	divCell.css("background-color","white");
    	if(divCell.find('.singleArea').length != 0){
    		area.css("top","0px").css("left","0px");
    		exchange = true;
    	}
//    	if(ui != null && ui.draggable[0].className.indexOf('select_li')>=0) {
//    		if(exchange) {
//    			alert("目标中已有报表块");
//    			return;
//    		}
//			addModelReport(ui.draggable[0],divCellId);
//			return;
//		}
    	if(exchange) {
    		divTableControl.exchange(area,divCell);
    		return;
    	}
    	var areasInfos = controlUtil.areas;
    	for(var i = 0; i < areasInfos.length; i++){
    		var areaInfo = areasInfos[i];
    		if(areaInfo.id == area.attr('count')){
    			//拖拽前的div index
    			var divIndex = getIndexOfDivById(areaInfo.inDivCell);
    			areaInfo.inDivCell = divCell.attr('id');
    			//拖拽后删除原来位置的divInfos.divs
//    			if(divIndex >= 0) divTableControl.divInfos.divs = divTableControl.divInfos.divs.deleteIndex(divIndex);
//				divTableControl.divInfos.divs.push({id:areaInfo.inDivCell,area:areaInfo});
    		}
    	}
    	area.css("top","0px").css("left","0px");
    	divCell.append(area);
    	var rpxFrame = $(area).find('iframe')[0];
    	//setTimeout(function(){
    		//$(rpxFrame.contentWindow.document).find('body').find('#mainDiv').css('display','none');
        	//$(rpxFrame.contentWindow.document).find('body').find('#move').css("background","url(../img/dl/ViewReport-ICO.gif) -502px -84px no-repeat ")
    	//},500);
    	//var rowNum = $(divCell).attr("row");
		//var colNum = $(divCell).attr("col");
		//$('div[confName='+$(area).attr('confname')+']').attr("title",rowNum+"_"+colNum);
	},
	exchange:function(fromArea,toDiv){
		var theOtherArea = toDiv.find('.singleArea');
		var theOtherDiv = fromArea.parent();
		var areasInfos = controlUtil.areas;
		toDiv.append(fromArea);
		theOtherDiv.append(theOtherArea);
		//dom实体调换过了
    	for(var i = 0; i < areasInfos.length; i++){
    		var areaInfo = areasInfos[i];
    		if(areaInfo.id == fromArea.attr('count')){
    			areaInfo.inDivCell = toDiv.attr('id');
    			//拖拽后的div index
    			var divIndex = getIndexOfDivById(areaInfo.inDivCell);
    			//divIndex是之前的inDivCell
    			if(divIndex >= 0) {
    				divTableControl.divInfos.divs[divIndex].area = controlUtil.getAreaByReport($(fromArea).attr('confname'));
    			}
    		}
    	}
    	for(var j = 0; j < areasInfos.length; j++){
    		var areaInfoj = areasInfos[j];
    		if(areaInfoj.id == theOtherArea.attr('count')){
    			areaInfoj.inDivCell = theOtherDiv.attr('id');
    			//拖拽后的div index
    			var divIndex = getIndexOfDivById(areaInfoj.inDivCell);
    			//拖拽后删除原来位置的divInfos.divs
    			if(divIndex >= 0) {
    				divTableControl.divInfos.divs[divIndex].area = controlUtil.getAreaByReport($(theOtherArea).attr('confname'));
    			}
    			
    		}
    	}
    	
	},
	droppableFunc:function(div){
		div.droppable({
			accept:'.singleArea,.select_li',
	        drop: divTableControl.moveReport
	    	,over: function(event, ui) {
	    		$( this ).css("background-color","#FFFF88");
	    	}	
	    	,out: function(event, ui) {
	    		$( this ).css("background-color","white");
	        }
	    });
	},
	mergeDiv:function(r1,c1,r2,c2){
		if(r1 > r2 ) {alert("行参数不合理："+r1+">"+r2);return;}
		if(c1 > c2 ) {alert("列参数不合理："+c1+">"+c2);return;}
		if(r1 == r2 && c1 == c2) {alert("无效参数");return;}
		var height = 0;
		var width = 0;
		//也寻找合并格
		var top = $('.divCell[row='+r1+'][col='+c1+']').css('top');
		var left = $('.divCell[row='+r1+'][col='+c1+']').css('left');
		var firstReport = null;
		for(var r = r1; r <= r2; r++){
			height += parseInt($('#d_'+r+'_'+0).css("height"));
			for(var c = c1; c <= c2; c++){
				if(r == r1) width += parseInt($('#d_'+0+'_'+c).css("width")) + divide;
				if(c == c2) width -= divide;
				//也寻找合并格
				var div = $('.divCell[row='+r+'][col='+c+']');
				if(div.find('.singleArea').length == 1){
					if(!firstReport) {
						firstReport = div.find('.singleArea')[0];
					}else{
						controlUtil.removeArea(div.find('.singleArea')[0],true);
					}
				}
				if(div.length == 1) div.remove();
			}
		}
		this.createMergeCell(r1,c1,r2,c2,top,left,height,width,firstReport);
		for(var ca = 0; ca < controlUtil.areas.length; ca++){
			var countid = controlUtil.areas[ca].id;
			if($(firstReport).attr('count') == countid){
				controlUtil.areas[ca].inDivCell = "d_"+r1+"_"+c1+"_"+r2+"_"+c2;
			}
		}
	},
	mergeCellIds: new Array(),
	createMergeCell:function(row,col,row2,col2,top,left,height,width,appendReport){
		var id = 'd_'+row+"_"+col+"_"+row2+"_"+col2;
		var currentDiv1 = $("<div row='"+row+"' col='"+col+"' row2='"+row2+"' col2='"+col2+"' id='"+id+"' class='divCell mergeCell resiz'></div>");
		$('#contents').append(currentDiv1);
		$(currentDiv1).on('click',function(event){
			//divTableControl.changeChoosedDiv($(currentDiv1)[0]);
		});
		currentDiv1.css("top",parseInt(top)+"px").css("left",parseInt(left)+"px")
			.css("height", height).css("width",width)
			.css("background-color","white").css("position","absolute");
		currentDiv1.append($(appendReport));
		controlUtil.draggableFunc($(appendReport),'img div');
		if(this.mergeCellIds.indexOf(id) < 0) this.mergeCellIds.push(id);
		if(!finalView) setTimeout(function(){
			currentDiv1.resizable({
				resize:function(event,ui){
					var divCell = event.target;
					var lastVh = 0;
					var lastVw = 0;
					var row = $(divCell).attr('row2');
					var col = $(divCell).attr('col2');
					eval("if(!lastChange.origin_height)lastChange.origin_height="+parseFloat($("#d_"+row+"_0").css('height'))+";");
					eval("if(!lastChange.origin_width)lastChange.origin_width="+parseFloat($("#d_0_"+col).css('width'))+";");
					if(document.onmouseup == null){
						document.onmouseup=function(){
							eval("lastChange.row_"+row+"=0;lastChange.col_"+col+"=0;");
							document.onmouseup = null;
							lastChange.origin_height = null;
							lastChange.origin_width = null;
							$(divCell).mouseup();
							$('.resiz').find('.reportMengBan').remove();
						}
					}
					var os = ui.originalSize;
					var s = ui.size;
					var vw = 0;
					var vh = 0;
					var originSepRowHeight = 0;
					var originSepColWidth = 0;
					//console.log("---------------");
					if(eval("lastChange.row_"+row)){
						lastVh = eval("lastChange.row_"+row);
						//console.log("上次改变的vh"+lastVh);
					}
					if(eval("lastChange.origin_height")){
						originSepRowHeight = eval("lastChange.origin_height");
					}
					var theRow = $(".divCell[row="+row+"]");
					var theNextRow = $(".divCell[row="+(parseInt(row)+1)+"],mergeCell[row="+(parseInt(row)+1)+"]");
					var row2 = $(divCell).attr('row2');
					var targetRowCell = $('#d_'+row2+'_0');
					var rowHeightSum = parseFloat(theNextRow.css('height'))+parseFloat(os.height)+lastVh;
					//console.log("下一行的高度"+parseFloat(theNextRow.css('height')));
					//console.log("高度和"+rowHeightSum);
					//console.log("本行改变高度值"+vh);
					var oldThisRowHeight = theRow.css("height");
					var oldNextRowHeight = theNextRow.css('height');
					if(rowHeightSum <= parseFloat(s.height) + minDivWidth){
						$(divCell).css('height',(parseFloat(os.height)+lastVh)+'px');
//						theRow.css('height', (originSepRowHeight+lastVh) + 'px').css('line-height', (originSepRowHeight+lastVh) + 'px');
//						theNextRow.css('height', (rowHeightSum - (parseFloat(os.height)+lastVh)) + 'px');
						theRow.css('height', oldThisRowHeight);
						theNextRow.css('height', oldNextRowHeight);
					}else if(originSepRowHeight + lastVh < minDivWidth ){
						$(divCell).css('height',(parseFloat(os.height)+lastVh)+'px');
						lastChange.origin_height = 10;
//						theRow.css('height', '15px').css('line-height', '15px');
//						theNextRow.css('height', (rowHeightSum - (parseFloat(os.height)+lastVh)) + 'px');
						theRow.css('height', oldThisRowHeight);
						theNextRow.css('height', oldNextRowHeight);
					}else{
						vh = parseFloat(s.height) - parseFloat(os.height);
						//console.log(s.height);
						//console.log(os.height);
						eval("lastChange.row_"+row+"="+vh+";");
						var theRowNewHeight = parseFloat(s.height);
						var theNextRowNewHeight = rowHeightSum - parseFloat(s.height);
						theRow.css('height',(originSepRowHeight+vh)+'px');
						//theRow.css('height',(parseFloat(targetRowCell.css('height'))+vh - lastVh) +'px');//.css('line-height',(parseFloat(targetRowCell.css('height'))+vh - lastVh) +'px');
						//if(!viewDbd)
						theRow.find('iframe').css('height',(theRowNewHeight - minDivWidth - divide - 5)+"px");
						theNextRow.css('height', (rowHeightSum - parseFloat(s.height)) + 'px');
						theNextRow.css('top', (parseFloat(theNextRow.css('top')) + vh - lastVh) + 'px');
						//if(!viewDbd)
						theNextRow.find('iframe').css('height',(theNextRowNewHeight - minDivWidth - divide - 5)+"px");
						if(row == divTableControl.defaultLayout.lastRow) {//尾行
							$('.main').css('height',(parseInt($('.main').css('height'))+vh - lastVh)+'px');
						}
					}
					
					if(eval("lastChange.col_"+col)){
						lastVw = eval("lastChange.col_"+col);
					}
					divTableControl.changeRelMergeCell(row,'height',vh - lastVh, divCell.id);
					
					vw = parseFloat(s.width) - parseFloat(os.width);
					if(vw != 0){
						if(eval("lastChange.origin_width")){
							originSepColWidth = eval("lastChange.origin_width");
						}
						var theCol = $(".divCell[col="+col+"]").not('.mergeCell');
						var theNextCol = $(".divCell[col="+(parseInt(col)+1)+"],mergeCell[col="+(parseInt(col)+1)+"]");
						var col2 = $(divCell).attr('col2');
						var targetColCell = $('#d_0_'+col2);
						var colWidthSum = parseFloat(theNextCol.css('width'))+parseFloat(os.width)+lastVw;
						var oldThisColWidth = theCol.css("width");
						var oldNextColWidth = theNextCol.css('width');
						if(colWidthSum < parseFloat(s.width) + minDivWidth){
							$(divCell).css('width',(parseFloat(os.width)+lastVw)+'px');
//							theCol.css('width', (originSepColWidth+lastVw) + 'px');
//							theNextCol.css('width', (colWidthSum - (parseFloat(os.width)+lastVw)) + 'px');
							theCol.css('width', oldThisColWidth);
							theNextCol.css('width', oldNextColWidth);
							return;
						}else if(originSepColWidth + lastVw < minDivWidth){
							//fix
							lastChange.origin_width = minDivWidth;
							$(divCell).css('width',(parseFloat(os.width)+lastVw)+'px');
//							theCol.css('width', '15px');
//							theNextCol.css('width', (colWidthSum - (parseFloat(os.width)+lastVw)) + 'px');
							theCol.css('width', oldThisColWidth);
							theNextCol.css('width', oldNextColWidth);
							return;
						}
						eval("lastChange.col_"+col+"="+vw+";");
						console.log(vw);
						console.log(lastVw);
						console.log(parseFloat(targetColCell.css('width')));
						theCol.css('width', (originSepColWidth+vw) + 'px');
						theNextCol.css('width', (colWidthSum - parseFloat(s.width)) + 'px');
						theNextCol.css('left', (parseFloat(theNextCol.css('left')) + vw - lastVw) + 'px');
						divTableControl.changeRelMergeCell(col,'width',vw - lastVw,divCell.id);
					}
				}
			});
			$('#'+id).find('.ui-resizable-handle').on('mousedown',function(e){
				activeReportMengBan($(e.target).parent());
			});
		},500);
		this.droppableFunc(currentDiv1);
	}
	,
	splitDiv:function(mc){
		if(mc == null || mc.length == 0) {
			alert('没找到合并格');
			return;
		}
		//deleteMergeCell
		var area = mc.find('.singleArea');
		//先删除其中的报表
		if(area){
			//controlUtil.removeArea(area);
			area.remove();
		}
		
		var top = parseFloat(mc.css('top'));
		var left = parseFloat(mc.css('left'));
		//createCells 暂时不支持指定分n格
		var row1 = mc.attr('row');
		var col1 = mc.attr('col');
		var row2 = mc.attr('row2');
		var col2 = mc.attr('col2');
		
		mc.remove();
		for(var r = row1 ; r <= row2; r++){
			var height = parseFloat($('.divCell[row='+r+']').css('height'));
			for(var c = col1; c <= col2; c++){
				var width = parseFloat($('.divCell[col='+c+']').css('width'));
				this.createOneCell(r,c,top,left,height,width);
				left += width;
				if(r == row1 && c == col1) {
					$("#d"+"_"+r+"_"+c).append(area);
					controlUtil.draggableFunc($(area),'img div');
					controlUtil.setAreaByReportName($(area).attr('confname'),"d"+"_"+r+"_"+c);
				}
			}
			top += height;
			left = parseFloat(mc.css('left'));
		}
		this.mergeCellIds = this.mergeCellIds.deleteValue(mc.attr('id'));
	},
	createOneCell:function(row,col,top,left,height,width){
		var id = "d"+"_"+row+"_"+col;
		//this.divIds[this.divIds.length] = id;
		var currentDiv = $("<div row='"+row+"' col='"+col+"' id='"+id+"' class='divCell'></div>");
		currentDiv.css("top",top+"px").css("left",left+"px")
			.css("height", height).css("width",width)
			.css("border-style","solid").css("position","absolute");
		$('#contents').append(currentDiv);
		currentDiv.addClass('resiz');
		setTimeout(function(){
			currentDiv.resizable({
				resize:function(event,ui){
					var divCell = event.target;
					var lastVh = 0;
					var lastVw = 0;
					var row = $(divCell).attr('row');
					var col = $(divCell).attr('col');
					if(document.onmouseup == null){
						document.onmouseup = null;
						document.onmouseup=function(){
							eval("lastChange.row_"+row+"=0;lastChange.col_"+col+"=0;");
						}
					}
					var os = ui.originalSize;
					var s = ui.size;
					var vw = 0;
					var vh = 0;
					//console.log("---------------");
					if(eval("lastChange.row_"+row)){
						lastVh = eval("lastChange.row_"+row);
						//console.log("上次改变的vh"+lastVh);
					}
					
					var theRow = $(".divCell[row="+row+"]").not('.mergeCell');
					var theNextRow = $(".divCell[row="+(parseInt(row)+1)+"],mergeCell[row="+(parseInt(row)+1)+"]");
					var rowHeightSum = parseFloat(theNextRow.css('height'))+parseFloat(os.height)+lastVh;
					x = rowHeightSum;//console.log("下一行的高度"+parseFloat(theNextRow.css('height')));
					//console.log("高度和"+rowHeightSum);
					//console.log("本行改变高度值"+vh);
					if(rowHeightSum <= parseFloat(s.height) + 15){
						theRow.css('height', (parseFloat(os.height)+lastVh) + 'px').css('line-height', (parseFloat(os.height)+lastVh) + 'px');
						theNextRow.css('height', (rowHeightSum - (parseFloat(os.height)+lastVh)) + 'px');
					}else if(s.height < 15){
						theRow.css('height', '15px').css('line-height', '15px');
						theNextRow.css('height', (rowHeightSum - 15) + 'px');
					}else{
						vh = parseFloat(s.height) - parseFloat(os.height);
						//console.log(s.height);
						//console.log(os.height);
						eval("lastChange.row_"+row+"="+vh+";");
						theRow.css('height',parseFloat(s.height) + 'px').css('line-height',parseFloat(s.height) + 'px');
						//console.log("设定下一行高度"+(rowHeightSum - parseFloat(s.height)));
						theNextRow.css('height', (rowHeightSum - parseFloat(s.height)) + 'px');
						theNextRow.css('top', (parseFloat(theNextRow.css('top')) + vh - lastVh) + 'px');
						//列结尾相同的合并格跟随运动
						divTableControl.changeRelMergeCell(row,'height',vh - lastVh);
					}
					if(eval("lastChange.col_"+col)){
						lastVw = eval("lastChange.col_"+col);
					}
					vw = parseFloat(s.width) - parseFloat(os.width);
					if(vw != 0){
						var theCol = $(".divCell[col="+col+"]").not('.mergeCell');
						var theNextCol = $(".divCell[col="+(parseInt(col)+1)+"],mergeCell[col="+(parseInt(col)+1)+"]");
						var colWidthSum = parseFloat(theNextCol.css('width'))+parseFloat(os.width)+lastVw;
						if(colWidthSum < parseFloat(s.width) + 15){
							theCol.css('width', (parseFloat(os.width)+lastVw) + 'px');
							theNextCol.css('width', (colWidthSum - (parseFloat(os.width)+lastVw)) + 'px');
							return;
						}else if(s.width < 15){
							theCol.css('height', '15px');
							theNextCol.css('width', (colWidthSum - 15) + 'px');
							return;
						}
						eval("lastChange.col_"+col+"="+vw+";");
						theCol.css('width', parseFloat(s.width) + 'px');
						theNextCol.css('width', (colWidthSum - parseFloat(s.width)) + 'px');
						theNextCol.css('left', (parseFloat(theNextCol.css('left')) + vw - lastVw) + 'px');
						divTableControl.changeRelMergeCell(col,'width',vw - lastVw);
					}
				}
			})
		},500);
		this.droppableFunc(currentDiv);
	},
	setDivCellProperties:function(divs){
		setTimeout(function(){
			divs.resizable({
				resize:function(event,ui){
					var divCell = event.target;
					var lastVh = 0;
					var lastVw = 0;
					var row = $(divCell).attr('row');
					var col = $(divCell).attr('col');
					if(document.onmouseup == null){
						document.onmouseup=function(){
							eval("lastChange.row_"+row+"=0;lastChange.col_"+col+"=0;");
						}
					}
					var os = ui.originalSize;
					var s = ui.size;
					var vw = 0;
					var vh = 0;
					//console.log("---------------");
					if(eval("lastChange.row_"+row)){
						lastVh = eval("lastChange.row_"+row);
						//console.log("上次改变的vh"+lastVh);
					}
					
					var theRow = $(".divCell[row="+row+"]").not('.mergeCell');
					var theNextRow = $(".divCell[row="+(parseInt(row)+1)+"],mergeCell[row="+(parseInt(row)+1)+"]");
					var rowHeightSum = parseFloat(theNextRow.css('height'))+parseFloat(os.height)+lastVh;
					x = rowHeightSum;//console.log("下一行的高度"+parseFloat(theNextRow.css('height')));
					//console.log("高度和"+rowHeightSum);
					//console.log("本行改变高度值"+vh);
					if(rowHeightSum <= parseFloat(s.height) + 1){
						theRow.css('height', (parseFloat(os.height)+lastVh) + 'px').css('line-height', (parseFloat(os.height)+lastVh) + 'px');
						theNextRow.css('height', (rowHeightSum - (parseFloat(os.height)+lastVh)) + 'px');
						return;
					}else if(s.height < 15){
						theRow.css('height', '15px').css('line-height', '15px');
						theNextRow.css('height', (rowHeightSum - 15) + 'px');
						return;
					}
					vh = parseFloat(s.height) - parseFloat(os.height);
					//console.log(s.height);
					//console.log(os.height);
					eval("lastChange.row_"+row+"="+vh+";");
					theRow.css('height',parseFloat(s.height) + 'px').css('line-height',parseFloat(s.height) + 'px');
					//console.log("设定下一行高度"+(rowHeightSum - parseFloat(s.height)));
					theNextRow.css('height', (rowHeightSum - parseFloat(s.height)) + 'px');
					theNextRow.css('top', (parseFloat(theNextRow.css('top')) + vh - lastVh) + 'px');
					//列结尾相同的合并格跟随运动
					divTableControl.changeRelMergeCell(row,'height',vh - lastVh);
					if(eval("lastChange.col_"+col)){
						lastVw = eval("lastChange.col_"+col);
					}
					vw = parseFloat(s.width) - parseFloat(os.width);
					if(vw != 0){
						var theCol = $(".divCell[col="+col+"]").not('.mergeCell');
						var theNextCol = $(".divCell[col="+(parseInt(col)+1)+"],mergeCell[col="+(parseInt(col)+1)+"]");
						var colWidthSum = parseFloat(theNextCol.css('width'))+parseFloat(os.width)+lastVw;
						if(colWidthSum < parseFloat(s.width) + 1){
							theCol.css('width', (parseFloat(os.width)+lastVw) + 'px');
							theNextCol.css('width', (colWidthSum - (parseFloat(os.width)+lastVw)) + 'px');
							return;
						}else if(s.width < 15){
							theCol.css('height', '15px');
							theNextCol.css('width', (colWidthSum - 15) + 'px');
							return;
						}
						eval("lastChange.col_"+col+"="+vw+";");
						theCol.css('width', parseFloat(s.width) + 'px');
						theNextCol.css('width', (colWidthSum - parseFloat(s.width)) + 'px');
						theNextCol.css('left', (parseFloat(theNextCol.css('left')) + vw - lastVw) + 'px');
						divTableControl.changeRelMergeCell(col,'width',vw - lastVw);
					}
				}
			})
		},500);
	},
	createRow:function(layout){
		var maxRow = divTableControl.defaultLayout.lastRow;
		var row = maxRow + 1;
		var maxCol = divTableControl.defaultLayout.lastCol;
		var col = 0;
		var top = parseFloat($('#d_0_'+maxCol).css('top'))+divide;
		for(var c = 0; c <= maxRow; c++){
			top += parseFloat($('#d_'+c+'_0').css('height'));
		}
		var left = 0+divide;
		var containerWidth = $('.main').css('width');
		var containerHeight = $('.main').css('height');
		var height = divTableControl.defaultLayout.height ? divTableControl.defaultLayout.height : 
			(parseInt(containerHeight)-20)/divTableControl.defaultLayout.lastRow;
		var width = width = divTableControl.defaultLayout.width ? divTableControl.defaultLayout.width : 
			(parseInt(containerWidth)-20)/divTableControl.defaultLayout.lastCol;
		//按行按列生成div表格
		for(var y = -1; y < maxCol; y++){
			col = y+1;
			width = parseFloat($('#d_'+0+'_'+col).css("width"));
			var id = "d"+"_"+row+"_"+col;
			var currentDiv = $("<div row='"+row+"' col='"+col+"' id='"+id+"' class='divCell'></div>");
			currentDiv.css("top",top+"px").css("left",left+"px")
				.css("height", height).css("width",((y == -1) ? '20px':width))
				.css("position","absolute");
			$('#contents').append(currentDiv);
			if(y == -1) {
				currentDiv.css('background-color','rgb(210, 210, 210)');
				currentDiv.css('text-align','center');
				currentDiv.hide();
			}else{
				currentDiv.addClass('resiz');
			}
			if(y == -1){
				currentDiv.html(row);
			}
			if(y != -1) left += width;
			//打开文件补全格子
			var areaid = addAreaIntoDivCell(currentDiv.attr('id'),null);
			addReportToArea("图表名称"+countArea, $('#'+areaid))
		}
		this.setDivCellProperties($('.divCell[row='+row+'].resiz'));
		divTableControl.defaultLayout.lastRow++;
		divTableControl.divInfos.rows++;
	},
	createCol:function(){
		var maxRow = divTableControl.defaultLayout.lastRow;
		var row = 0;
		var maxCol = divTableControl.defaultLayout.lastCol;
		var col = maxCol + 1;
		var left = parseFloat($('#d_'+maxRow+'_0').css('left'));
		for(var c = 0; c <= maxCol; c++){
			left += parseFloat($('#d_0_'+c).css('width'));
		}
		var top = 0;
		var height = divTableControl.defaultLayout.height;
		var width = divTableControl.defaultLayout.width;
		height = parseFloat(height);
		width = parseFloat(width);
		
		//按行按列生成div表格
		for(var x = -1; x < maxRow; x++){
			row = x+1;
			height = parseFloat($('#d_'+row+'_0').css('height'));
			var id = "d"+"_"+row+"_"+col;
			//divTableControl.divIds[divTableControl.divIds.length] = id;
			var currentDiv = $("<div row='"+row+"' col='"+col+"' id='"+id+"' class='divCell'></div>");
			currentDiv.css("top",top+"px").css("left",left+"px")
				.css("height", (x == -1) ? '20px':height).css("width",width+'px')
				.css("border-style","solid").css("position","absolute");
			$('#contents').append(currentDiv);
			if( x == -1 ) {
				currentDiv.css('text-align','center');
			}
			if(x == -1) {
				currentDiv.css('background-color','rgb(210, 210, 210)');
			}else{
				currentDiv.addClass('resiz');
			}
			if(x == -1){
				currentDiv.html(col);
				top += 20;
			}else top += height;
		}
		this.setDivCellProperties($('.divCell[col='+col+'].resiz'));
		divTableControl.defaultLayout.lastCol++;
		divTableControl.divInfos.cols++;
	},
	divCellAddReportEvent:function(event,div){
		if(event == null) {
			divCellAddReport(div);
			return;
		}
		var pop = false;
		if($(event).find('div.singleArea').length == 0) pop = true;
		if(pop) {
			var areaId = addAreaIntoDivCell(event.id);
			$('#'+event.id).css('background-color',"#FFFF88");
			popAddReport($('#'+areaId),function(addedReportName){
				$('#'+event.id).css('background-color',"");
				var divs = addedReportName.divInfos.divs;
			});
		}
	},
	divCellAddReport:function(div){
		if(div == null) return;
		addAreaIntoDivCell(div)
	},
	changeRelMergeCell:function(rev,attr,value,currId){
		rev = parseInt(rev);
		var x = attr == 'height'? 'row2' : 'col2';
		var y = attr == 'height'? 'row' : 'col';
		var currDivAttrVal;
		if(currId){
			currDivAttrVal = $('#'+currId).css(attr);
		}
		//调整本列或本行合并格宽高
		var relaMergeCells = $('.mergeCell['+x+'='+rev+']');
		for(var rmc = 0; rmc < relaMergeCells.length; rmc++){
			if($(relaMergeCells[rmc]).attr(x) != rev) continue
			var rmch = parseFloat($(relaMergeCells[rmc]).css(attr));
			$(relaMergeCells[rmc]).css(attr, (rmch + value) + 'px');
		}
		//下一行或一列
		relaMergeCells = $('.mergeCell['+y+'='+(rev+1)+']');
		for(var rmc = 0; rmc < relaMergeCells.length; rmc++){
			if($(relaMergeCells[rmc]).attr(y) != (rev+1)) continue
			var rmch = parseFloat($(relaMergeCells[rmc]).css(attr));
			$(relaMergeCells[rmc]).css(attr, (rmch - value) + 'px');
		}
		
		
		if(currId){
			$('#'+currId).css(attr,currDivAttrVal);
		}
		//调整下一列或下一行合并格宽高
	}
	,
	removeRow:function(id){
		if(!id){
			id = divTableControl.defaultLayout.lastRow; 
		}
		if(id <= 1) {
			return;
		}
		var divs = $('.divCell[row='+id+']');
		//检查列序号是否连续，不连续就有合并格
		var idArray = [];
		for(var c = 0 ; c < divs.length; c++){
			var colid = $(divs[c]).attr("col");
			idArray.push(parseInt(colid));
		}
		idArray.sort(function(a,b){
		    return a-b;
		})
		for(var i = 0 ; i < idArray.length; i++){
			if(idArray[i] != i){
				alert("行中有合并格不能删除");
				return;
			}
		}
		var decreaseHeight = parseFloat($('#d_'+id+'_0').css('height'));
		for(var d = 0; d < divs.length; d++){
			if(divs[d].className.indexOf('mergeCell') > 0){
				alert("行中有合并格不能删除");
				return;
			}else{
				var innerArea = $(divs[d]).find('.singleArea');
				if(innerArea.length > 0) controlUtil.removeArea(innerArea);
//				var mcs = $('.mergeCell');
//				for(var m = 0; m < mcs.length; m++){
//					var c = mcs[m];
//					var row1 = $(c).attr('row');
//					var row2 = $(c).attr('row2');
//					if(row<id<=row2){
//						//缩小合并格
//						var height = parseFloat($(c).css('height')) - decreaseHeight;
//						$(c).css('height',height);
//					}
//				}
			}
		}
		divs.remove();
		divTableControl.defaultLayout.lastRow--;
		divTableControl.divInfos.rows--;
		//moveUpNextRow(startRow,height);
	},
	removeCol:function(id){
		if(!id){
			id = divTableControl.defaultLayout.lastCol; 
		}
		if(id <= 1) {
			return;
		}
		var divs = $('.divCell[col='+id+']');
		//检查列序号是否连续，不连续就有合并格
		var idArray = [];
		for(var c = 0 ; c < divs.length; c++){
			var rowid = $(divs[c]).attr("row");
			idArray.push(parseInt(rowid));
		}
		idArray.sort(function(a,b){
		    return a-b;
		})
		for(var i = 0 ; i < idArray.length; i++){
			if(idArray[i] != i){
				alert("行中有合并格不能删除");
				return;
			}
		}
		var decreaseWidth = parseFloat($('#d_0_'+id).css('width'));
		for(var d = 0; d < divs.length; d++){
			if(divs[d].className.indexOf('mergeCell') > 0){
				alert("列中有合并格不能删除");
				return;
			}else{
				var innerArea = $(divs[d]).find('.singleArea');
				if(innerArea.length > 0) controlUtil.removeArea(innerArea);
			}
		}
		divs.remove();
		divTableControl.defaultLayout.lastCol--;
		divTableControl.divInfos.cols--;
		//moveUpNextCol(startCol,height);
	}
	,changeChoosedDiv: function(div){
		if(editingReportName) return;//正在编辑时不能切换div
		$("#selectDs").attr('disabled',true);
		$("#selectDs").unbind('change');
		cleanSideBoard();
		if(div == null) return;
		if(div.className.indexOf('divCell') < 0){
			currArea = null;
			return;
		}
		if(div.className.indexOf('choosedDiv') >= 0){
			$(currDiv).removeClass('choosedDiv');
			$("#selectDs").val(null);
			currArea = null;
			return;
		}
		//切换编辑块
		var rn = $(div).find(".singleArea").attr('confName');
		var rpx = aly.getRpx(rn);
		
		var dataSet = "";
		if(rpx != null) {
			dataSet = aly.getRpx(rn).dataSet;
			var ds = aly.getDataSet(dataSet);
			enableAcfBut();
		}else{
			disableAcfBut();
		}
		if(dataSet == null) dataSet = ""; 
		if(currDiv != null) {
			$(currDiv).removeClass('choosedDiv');
		}
		currDiv = div;
		currArea = $(currDiv).find('.singleArea');
		if($(currDiv).attr('row') == "0" || $(currDiv).attr('col') == "0") {
			currDiv = null;
		}else $(currDiv).addClass('choosedDiv');
		$("#selectDs").change(function(){
			changeCurrRpxDs($("#selectDs").val());
		});
		if(dataSet.length > 0) changeCurrRpxDs(dataSet);
		if(beta != "null" && isEditor(div)){
			$("#selectDs").attr('disabled',true);
			$('#dbd-west-report').removeClass('side').hide();
			$('#dbd-west-editor').addClass('side').show();
		}else{
			$("#selectDs").attr('disabled',false).val(dataSet);
			$('#dbd-west-report').addClass('side').show();
			$('#dbd-west-editor').removeClass('side').hide();
		}
		if(!rpx) return;
		selectTab(rpx.type == 2 ? "#choose":"#define");
	}
};
}

function popAddReport(div,callback,modelDom){
	if(modelDom != null){
		var modelDisp = $(modelDom.innerHTML);
		var modelName = modelDisp.find('optionSpan').val();
	}
	currArea = div;
	var cn = resources.guide.js75;
	while (aly.getRpx(cn + rpxIndex) != null) {
		cn = resources.guide.js75+rpxIndex;
		rpxIndex++;
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
	    	currArea = div;
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
	    	$(currArea).attr("confName",n);
	    	$(currArea).click(function(){
				rqAnalyse.currRpx = div.attr('confName')?div.attr('confName'):rqAnalyse.currRpx;
				aly.refresh(true,true);
			});
	    	var type = 1;
	    	
	    	if ($('#addReportChk')[0].checked && getSelDom1Value(selDom1) != '') {
	    		type = 2;
	    	} 
	    	//var conff = {type:type,name:n,reportId:'r'+new Date().getTime(),show:1,template:getSelDom1Value(selDom1),lefts:[],tops:[],fields:[],wheres:[],isRowData:1};
			var conff = {
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
	    	if(callback) callback(n,currArea);
	    }
	    ,cancel : function() {
	    	artDialog.defaults.zIndex = zIndexBak;
	    	if(callback) callback();
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
	
	if(modelDom != null){
		$('#addReportChk').hide();
		$('#addReportChk')[0].checked = true;
		$('#select_box_disp').html('').append(modelDisp);
		$('.select_box').attr('value',modelName);
	}
	
}

function openMergeDialog(){
	if(!confirm('合并单元格只能保留第一个报表')){
		return;
	}
//	,lock : true
//    ,duration : 0
//    ,width : '500px'
//	,height : '130px'
//	,opacity : 0.1
//	,padding : '2px 2px'
//	,zIndex : 41000
	var dialog = art.dialog({
        title:"合并单元格",
        fixed:true,
        max: false,
        min: false,
        lock: true,
        resize:false,
        cache:false,
        esc:true,
		content:'<form name="mergeForm">'
			+'<table>'
			+'<tr><td>'
			+'起始行<input name="m_row1" type=text value=1 /></br>'
			+'起始列<input name="m_col1" type=text value=1 />'
			+'</td><td>'
			+'结束行<input name="m_row2" type=text value=1 /></br>'
			+'结束列<input name="m_col2" type=text value=2 />'
			+'</td>'
			+'</tr>'
			+'</table>'
			+'</form>',
        ok:function(){
			var mf = $('form[name=mergeForm]')[0];
			var r1 = mf.m_row1.value;
			var c1 = mf.m_col1.value;
			var r2 = mf.m_row2.value;
			var c2 = mf.m_col2.value;
			
			divTableControl.mergeDiv(r1,c1,r2,c2);
	    },
        dblclick:false, //双击不关闭对话框
        okVal : resources.guide.js20
		,zIndex : 41000
    });
   
   // var options = $.extend(defaults, options);

	//var dialog = art.dialog(options);
	return;
}

function splitDiv(){
	var defaults = {
        title:"拆分合并格",
        fixed:true,
        max: false,
        min: false,
        lock: true,
        resize:false,
        cache:false,
        esc:true,
		content:'<form name="splitForm">'
			+'行号<input name="m_row1" type=text value=1 /></br>'
			+'列号<input name="m_col1" type=text value=1 />'
			+'</form>',
        ok:function(){
			var mf = $('form[name=splitForm]')[0];
			var r1 = mf.m_row1.value;
			var c1 = mf.m_col1.value;
			divTableControl.splitDiv($('.mergeCell[row='+r1+'][col='+c1+']'));
	    },
        dblclick:false, //双击不关闭对话框
        okVal : resources.guide.js20
		,zIndex : 41000
    };
   
    var options = $.extend(defaults, options);

	var dialog = art.dialog(options);
	return dialog;
}

function removeReport(reportName,permission){
	if(!permission){
		if(!confirm('删除报表：'+reportName)){
			return;
		}
	}
	rqAnalyse.rpxs.remove(aly.getRpx(reportName));
	if (rqAnalyse.currRpx == reportName) {
		rqAnalyse.currRpx = '';
	}		
	var reports = aly.cache.reports;
	var hasAndDelete = false;
	for (var i=0; i<reports.length; i++) {
		if (reports[i].name == reportName) {
			reports[i].dlg.close();
			reports[i].dlg.DOM.wrap.remove();
			reports.remove(reports[i]);
			hasAndDelete = true;
			break;
		}
	}
	if(!hasAndDelete) return;
	var areas = controlUtil.areas;
	for(var a = 0; a < areas.length; a++){
		if(areas[a].report && areas[a].report == reportName){
			var count = areas[a].id;
			$('#singleArea'+count).find('iframe').remove();
			if(isChoosed($('#singleArea'+count).parent()[0])) {
				cleanSideBoard();
				$('#selectDs').val('');
			}
			break;
		}
	}
	disableAcfBut();
	refreshItemsReportWhereBuf();
	//aly.refresh();
}

function removeEditor(reportName,permission){
	if(!permission){
		if(!confirm('删除控件？')){
			return;
		}
	}
	var areas = controlUtil.areas;
	for(var a = 0; a < areas.length; a++){
		if(areas[a].report && areas[a].report == reportName){
			var count = areas[a].id;
			removeEditorDom('singleArea'+count);
			$('#singleArea'+count).find('iframe').remove();
			break;
		}
	}
	disableAcfBut();
	refreshItemsReportWhereBuf();
	//aly.refresh();
}

function createRow(){
	divTableControl.createRow();
}

function createCol(){
	divTableControl.createCol();
}

function removeRow(){
	divTableControl.removeRow();
}

function removeCol(){
	divTableControl.removeCol();
}

function showRowMenu(e){
	showMenu(0,$(e).attr('row'));
}

function showColMenu(e){
	showMenu(1,$(e).attr('col'));
}

function showMenu(type,id){
	var flag = type == 0 ? 'row':'col';
	var flag2 = type == 0 ? '行':'列';
	var ti = '删除'+flag2;
	var defaults = {
        title:ti,
        fixed:true,
        max: false,
        min: false,
        lock: true,
        resize:false,
        cache:false,
        esc:true,
		content:'<span>确认删除'+flag2+id+'</span>',
        ok:function(){
			var ff = $('form[name='+flag+'Form]')[0];
			var id = ff.id_.value;
			if(type == 0) divTableControl.removeRow(id);
			if(type == 1) divTableControl.removeCol(id);
	    },
        dblclick:false, //双击不关闭对话框
        okVal : resources.guide.js20
    };
   
    var options = $.extend(defaults, options);

	var dialog = art.dialog(options);
	return dialog;
}

function util_removeElmFromArray(arr, index, value){
	var findByValue = false;
	if( arr && arr.length > 0 ){
		if(!index || index < 0){
			findByValue = true;
		}
		
		if(findByValue && value){
			if(! (value in arr)) index = -1;
			else index = arr.indexOf(value);
		}
		
		if(index >= 0){
			return arr.deleteIndex(index);
		}
	}else{
		return;
	}
	
}

function getWidths(){
	var ws = new Array();
	for(var w = 0 ; w <= divTableControl.defaultLayout.lastCol; w++){
		var width = $('#d_0_'+w).css('width');
		ws.push(width);
	}
	return ws;
}

function getHeights(){
	var hs = new Array();
	for(var h = 0 ; h <= divTableControl.defaultLayout.lastRow; h++){
		var height = $('#d_'+h+'_0').css('height');
		hs.push(height);
	}
	return hs;
}

function getIndexOfDivById(cellId){
	if(!divTableControl.divInfos.divs){
		divTableControl.divInfos.divs = new Array();
		return -1;
	}
	for(var j = 0; j < divTableControl.divInfos.divs.length; j++){
		var div1 = divTableControl.divInfos.divs[j];
		if(div1.id == cellId){
			return j;
		}
	}
}

function cleanModeOn(){
	$('.divCell[col=0],.divCell[row=0]').hide();
	$('.divCell,.mergeCell').css('border-style','none');
	$('.singleArea').css('border-style','none');
	$('.ui-icon').hide();
	cleanMode = true;
}

function cleanModeOff(){
	$('.divCell[col=0],.divCell[row=0]').show();
	$('.divCell,.mergeCell').css('border-style','solid');
	$('.singleArea').css('border-style','none');
	$('.ui-icon').show();
	cleanMode = false;
}

var countAutoAggrGraphs = 1;
function addModelReport(area,targetDivId){

	var callback = function(addedReportName, areaDom){
		var currA = 0;
		var rowNum = $(areaDom).parent().attr("row");
		var colNum = $(areaDom).parent().attr("col");
		//$('div[confName='+addedReportName+']').attr("title",rowNum+"_"+colNum);
		var cellId = $(area).parent().attr('id');
		for(var a = 0; a < controlUtil.areas.length;a++){
			if(controlUtil.areas[a].inDivCell == cellId) {
				controlUtil.areas[a].report = addedReportName;
				currA = controlUtil.areas[a];
				break;
			}
//			if(a + 1 == controlUtil.areas.length){
//				controlUtil.areas[a+1].report = addedReportName;
//				currA = controlUtil.areas[a+1];
//			}
		}
//		var divinf = {
//			id:cellId,
//			area:currA
//		}
//		if(!divTableControl.divInfos.divs)divTableControl.divInfos.divs = new Array();
//		divTableControl.divInfos.divs.push(divinf);
		//$(div).css('border-style','none');
	};
	
	currArea = area;
	var dataSet = $('#selectDs').val();
	//if(dsname) dataSet = dsname;
	var ds = aly.getDataSet(dataSet);
	//区别处理两种数据集
	//if(ds.type != 6){
		enableAcfBut();
	//}else{
	//	disableAcfBut();
	//}
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

	var n = $(area).attr('confName'); //'统计图'+countAutoAggrGraphs++;//$.trim($('#addConfName').val());
	
	if (aly.getRpx(n)) {
		alert(resources.guide.js119);
		countAutoAggrGraphs++;
		return false;
	}
	//$(currArea).attr("confName",n);
	var type = 2;
	if(area != null){
		var modelDisp = $(area.innerHTML);
		var modelName = modelDisp.attr('value');
	}
	
	//var conff = {type:type,name:n,reportId:'r'+new Date().getTime(),show:1,template:getSelDom1Value(selDom1),lefts:[],tops:[],fields:[],wheres:[],isRowData:1};
	var conff = {
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
		,reportId:"rid"+getTime()
		,structType:1//:单条记录，全是统计字段/2:明细报表/3:分组及交叉报表

		,template:existRpx[0]
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
	sleep(1);//生成reportid
	if (type == 2) {
		var desc = existRpxDisc[0];
		for (var z=0; z<desc.split(";").length; z++) conff.fields[z] = null;
	}
	rqAnalyse.rpxs.push(conff);
	rqAnalyse.currRpx = n;
	artDialog.defaults.zIndex = zIndexBak;
	aly.refresh();
	if(!previewDbd) redefineFrameHeight(n);
	refreshItemsReportWhereBuf();
	if(callback) callback(n,currArea);
}

function addGridReport(area,dsname){
	var callback = function(addedReportName, areaDom){
		var currA = 0;
		var rowNum = $(areaDom).parent().attr("row");
		var colNum = $(areaDom).parent().attr("col");
		//$('div[confName='+addedReportName+']').attr("title",rowNum+"_"+colNum);
		var cellId = $(area).parent().attr('id');
		for(var a = 0; a < controlUtil.areas.length;a++){
			if(controlUtil.areas[a].inDivCell == cellId) {
				controlUtil.areas[a].report = addedReportName;
				currA = controlUtil.areas[a];
				break;
			}
//			if(a + 1 == controlUtil.areas.length){
//				controlUtil.areas[a+1].report = addedReportName;
//				currA = controlUtil.areas[a+1];
//			}
		}
//		var divinf = {
//			id:cellId,
//			area:currA
//		}
//		if(!divTableControl.divInfos.divs)divTableControl.divInfos.divs = new Array();
//		divTableControl.divInfos.divs.push(divinf);
		//$(div).css('border-style','none');
	};
	
	currArea = area;
	var dataSet = $('#selectDs').val();
	if(dsname) dataSet = dsname;
	var ds = aly.getDataSet(dataSet);
	//区别处理两种数据集
	//if(ds.type != 6){
		enableAcfBut();
	//}else{
	//	disableAcfBut();
	//}
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

	var n = $(area).attr('confName');//$.trim($('#addConfName').val());
	
	if (aly.getRpx(n)) {
		alert(resources.guide.js119);
		countAutoAggrGraphs++;
		return false;
	}
	var type = 1;
	
	//var conff = {type:type,name:n,reportId:'r'+new Date().getTime(),show:1,template:getSelDom1Value(selDom1),lefts:[],tops:[],fields:[],wheres:[],isRowData:1};
	var conff = {
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
		,reportId:"rid"+getTime()
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
	if (type == 2) {
		var desc = existRpxDisc[existRpx.indexOf(modelName)];
		for (var z=0; z<desc.split(";").length; z++) conff.fields[z] = null;
	}
	rqAnalyse.rpxs.push(conff);
	rqAnalyse.currRpx = n;
	artDialog.defaults.zIndex = zIndexBak;
	aly.refresh();
	if(!previewDbd) redefineFrameHeight(n);
	refreshItemsReportWhereBuf();
	if(callback) callback(n,currArea);
}

function redefineFrameHeight(n){
	var newHeight = parseInt($('iframe[confName='+n+']').parent().css('height'))-divide -5;//减去area里bar和一点偏移
	$('iframe[confName='+n+']').css('height',newHeight+"px");
}

function changeCurrRpxDs(dsName){
	if(currDiv == null) return;
	var exsitRpx = aly.getRpx($(currDiv).find('.singleArea').attr('confName'));
	if(exsitRpx){
		rqAnalyse.currRpx = $(currDiv).find('.singleArea').attr('confName');
		exsitRpx.dataSet = dsName;
		aly.refresh(false,true);
	}else{
		if(createRpxType == 1) addGridReport($(currDiv).find('.singleArea')[0],dsName);
		else if(createRpxType == 2) addModelReport($(currDiv).find('.singleArea')[0],dsName);
	}
	$('#contentDiv').css('height','200px');
}

function addReportToArea(addedReportName, areaDom){
	createMenuBar(addedReportName, areaDom);
	if(!previewDbd && !finalView){
		$(areaDom).on('click',function(event){
			divTableControl.changeChoosedDiv($(areaDom).parent()[0]);
		});
	}
	preventPropagation(areaDom,'.dontchoose','click');
	var currA = 0;
	var rowNum = $(areaDom).parent().attr("row");
	var colNum = $(areaDom).parent().attr("col");
	$(areaDom).attr("confName",addedReportName);
	//$('div[confName='+addedReportName+']').attr("title",rowNum+"_"+colNum);
	var cellId = $(areaDom).parent().attr('id');
	for(var a = 0; a < controlUtil.areas.length;a++){
		if(controlUtil.areas[a].inDivCell == cellId) {
			controlUtil.areas[a].report = addedReportName;
			currA = controlUtil.areas[a];
			break;
		}
		if(a + 1 == controlUtil.areas.length){
			controlUtil.areas[a+1].report = addedReportName;
			currA = controlUtil.areas[a+1];
		}
	}
//	var divinf = {
//		id:cellId,
//		area:currA
//	}
//	if(!divTableControl.divInfos.divs)divTableControl.divInfos.divs = new Array();
//	console.log('addreport');
//	console.log(divinf);
//	divTableControl.divInfos.divs.push(divinf);
}

function createMenuBar(reportName, areaDom){
	var bar = $('<div class="rmbar container-fluid"></div>');
	$(areaDom).append(bar);
	var barinner = $('<div class="rmbar row-fluid" id="rmbar_'+reportName+'"></div>')
	bar.append(barinner);
	barinner.append('<div style="word-break:keep-all;display:inline-flex" class="span2 dontchoose"></div>');
	barinner.append('<div class="span7"></div>');
	barinner.append('<div class="span3" class="dontchoose"></div>');
	var divs = barinner.find('div');
	$(divs[2]).append('<div class="dontchoose" style="float:left"></div>');
	$(divs[2]).append('<div class="dontchoose" style="float:left"></div>');
	$(divs[2]).append('<div class="dontchoose" style="float:left"></div>');
	$(divs[2]).append('<div class="dontchoose"></div>');
	$(divs[0]).append('<div class="barReportName dontchoose" value="'+reportName+'">'+reportName+'</div>');
	if(!previewDbd) {
		bindBarReportNameEvent(divs[0],reportName);
		var div1 = $(divs[2]).find('div')[0];
		var div2 = $(divs[2]).find('div')[1];
		var div3 = $(divs[2]).find('div')[2];
		var div4 = $(divs[2]).find('div')[3];
		if(beta != "null") {
			$(div1).append('<div class="toEditor" onclick="javascript:toEditor(\''+$(areaDom).attr('id')+'\');"><img style="height:16px" src="../img/guide/dashboard/editor.png"/></div>');
			$(div2).append('<div class="toReport"  onclick="javascript:toReport(\''+$(areaDom).attr('id')+'\');"><img style="height:16px" src="../img/guide/dashboard/table.png"/></div>');
		}
		$(div3).append('<div class="reportWhere" style="cursor:no-drop"><img src="../img/guide/dashboard/filter.png"/></div>');
		$(div4).append('<a class="reportRemove" href="javascript:removeReport(\''+reportName+'\');"><img src="../img/guide/13.png"/></a>');
	}
	
}

function cleanSideBoard(){
	$('#contentDiv').html('<p>1，请选择编辑区域</p><p>2，请选择数据集</p>');
	$('#items').html('<p>1，请选择编辑区域</p><p>2，请选择数据集</p>');
	$('#gridTable').children().remove();
	$('#allReportStyles').children().remove();
	$('#modelReportFields').children().remove();
}

function editReport(rn){
	var editDiv = $('.barReportName[value='+rn+']');
	var inputWidth = editDiv.css('width');
	editDiv.html('');
	if($('#rmNameEditor').length > 0) {
		saveRmName($('#rmNameEditor').attr('value'));
	}
	var input = $('<input  class="dontchoose" id="rmNameEditor" style="width:'+inputWidth+';" type=text value="'+rn+'"/>');
	editDiv.append(input);
	input.focus();
	editDiv.on('click','input',function(event){
		event.stopPropagation();
	});
	input.keydown(function(e){
		e = e||window.event;
	  if (e.keyCode == 13)
	  {
	    e.returnValue=false;
	    e.cancel = true;
	    editingReportName = false;
	    //rn = controlUtil.checkGetAreaName(rn,controlUtil.areas);
	    saveRmName(rn);
	  }
	});
	editingReportName = true;
}

function saveRmName(rn){
	var editDiv = $('.barReportName[value='+rn+']');
	var n = $('#rmNameEditor').val();
	if (n == '') {
		alert(resources.guide.js112);
		editDiv.html(rn);
		dealDisplayOfLongStr(editDiv[0], 150);
		return;
	}
	
	if(rn == n) {
		editDiv.html(rn).attr('value',rn);
		dealDisplayOfLongStr(editDiv[0], 150);
		return;
	}
	var areaExistReportName = false;
	//$(t2tds[0]).find('div[confName="'+cn+'"]').html(n);
	for(var i = 0; i < controlUtil.areas.length; i++){
		var area = controlUtil.areas[i];
		areaExistReportName = area.report == n;
		if(areaExistReportName) break;
	}
	
	if(areaExistReportName){
		editDiv.html(rn).attr('value',rn);
		alert(resources.guide.js113);
		return;
	}
	//$('.singleArea[confName='+rn+']').attr('confName',n);
	editDiv.html(n).attr('value',n);
	editDiv.parent().parent().find('a.reportRemove').attr('href',"javascript:removeReport('"+n+"')");
	dealDisplayOfLongStr(editDiv[0], 150);
	controlUtil.changeInfo(rn,n);
	bindBarReportNameEvent(editDiv.parent(),n);
	var rpx = aly.getRpx(rn);
	if(rpx == null) return;
	rpx.name = n;
	var reports = aly.cache.reports;
	for (var i=0; i<reports.length; i++) {
		if (reports[i].name == rn) {
			reports[i].dlg.close();
			reports[i].dlg.DOM.wrap.remove();
			reports.remove(reports[i]);
			break;
		}
	}
	artDialog.defaults.zIndex = zIndexBak;
	setTimeout(function(){
		var currAreaId = controlUtil.changeInfo(rn,n);
		currArea = $('#'+currAreaId);
		rqAnalyse.currRpx = n;
		aly.refreshReport(n, false, false);
		aly.refresh();
		if(!previewDbd) redefineFrameHeight(n);
	},1);
	
}

function bindBarReportNameEvent(d,reportName){
	unbindBarReportNameEvent(d);
	$(d).on('click','div',function(event){event.stopPropagation();editReport(reportName);})
	.on('mouseover','div',function(e){$(e.target).addClass('showBrnBorder')})
	.on('mouseout','div',function(e){$(e.target).removeClass('showBrnBorder')});
}

function unbindBarReportNameEvent(d){
	$(d).off();
}

function dsParameterButtonEvent(){
	var dataSet = $('#selectDs').val();
	if(dataSet == "" || $('#selectDs').disabled == "disabled") {
		flash($('#selectDs'),4);
		return;
	}
	var conf = null;
	var rpxname = divTableControl.getInnerReport(currDiv);
	if(rpxname) conf = aly.getRpx(rpxname);
	dataSet = aly.getDataSet(dataSet);
	aly.params = [];
	aly.paramNames = [];
	
	var inFunc = function() {
		var filter1 = "";
//		var params = aly.params;
//			if (dataSet.type == 6 || dataSet.type == 7) filter1 = whereUtils.getExp(conf.where.conf, "T1.", 1);
//			else filter1 = whereUtils.getExp(conf.where.conf, "", 1, 2);
		//20190925
		var saveFunc = function () {
			var disp = whereUtils.getDisp(cache.where1.wheres);
			if (disp == '') return false;
//				var rpxs = rqAnalyse.rpxs;
//				for(var r = 0; r < rpxs.length; r++){
//					var conf = rpxs[r];
//					conf.where.conf = cache.where1.wheres;
//					var exp = '';
//					if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(conf.where.conf, "T1.", 1);
//					else exp = whereUtils.getExp(conf.where.conf, "", 1, 2);
//				}
			var dsWhereParamItem = {dsname:dataSet.name,wheres:cache.where1.wheres};
			if(aly.dsWhereParams != null && aly.dsWhereParams.length > 0){
				for(var d = 0; d < aly.dsWhereParams.length; d++) {
					var tempDsWhereParamItem = aly.dsWhereParams[d];
					if(tempDsWhereParamItem.dsname == dataSet.name) {aly.dsWhereParams = aly.dsWhereParams.deleteIndex(d);break;}
				}
			}else{
				aly.dsWhereParams = [];
			}
			aly.dsWhereParams.push(dsWhereParamItem);
			dataSet.params = cache.where1.wheres;
			//2019.11.25多个数据集可能共享参数
//				for (var i=0; i<rqAnalyse.dataSets.length; i++) {
//					if(rqAnalyse.dataSets[i].type == dataSet.type)//不同类型数据集，where条件对象不可通用
//					rqAnalyse.dataSets[i].params = cache.where1.wheres;
//				}
			setTimeout("aly.refreshAll();",1);
			artDialog.defaults.zIndex = zIndexBak;
			return true;
		 };
		 var clearFunc = function () {
			var rpxs = rqAnalyse.rpxs;
//				for(var r = 0; r < rpxs.length; r++){
//					var conf = rpxs[r];
//					conf.where.conf = [];
//					var exp = '';
//					if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(conf.where.conf, "T1.", 1);
//					else exp = whereUtils.getExp(conf.where.conf, "", 1, 2);
//				}
			aly.dsWhereParams = [];
			dataSet.params = [];
			//setTimeout("aly.refreshAll();",1);
			aly.refreshAll();//火狐setTimeout没调用到
			artDialog.defaults.zIndex = zIndexBak;
			return true;
		}

		var fields = [];
		if (dataSet.type == 6){
			var ts = aly.getDataSet(conf.dataSet).tableName.split(",");
			for (var i=0; i<ts.length; i++) cus.getFieldInfos(ts[i], fields, 0, null, null,true);//2019.09.26改成true
			for (var i=0; i<fields.length; i++) fields[i] = transWhereInfo(fields[i],null,false);
		} else {
			for (var n=0; n<dataSet.fields.length; n++) {
				var itemn = dataSet.fields[n];
				if (itemn.exp && itemn.exp != '') continue;
				fields[fields.length] = {disp:itemn.name,dataType:itemn.dataType,edit:itemn.edit,exp:itemn.name,valueType:1,values:""};
			}
		}
		var initField = fields[0];
		//var whereString = "[]";
		var choosesp = aly.sysparams != null && aly.sysparams.length > 0;
		whereUtils.openWhereDialog(saveFunc, clearFunc, choosesp);
		if(aly.dsWhereParams == null) aly.dsWhereParams = [];
		if(dataSet.params == null) dataSet.params = [];
		whereUtils.refresh(fields, initField, JSON.parse(JSON.stringify(dataSet.params)), true, choosesp);//JSON.parse(JSON.stringify(conf.where.conf)));
	}
	analyseApi.complexWhereFunc(inFunc);
}

function flash(d,flag,color){//flag必须是偶数
	var color_ = color ? color :'#ffb5a8';
	setTimeout(function(){
		if(flag != 0){
			if(flag-- % 2 == 0)
				d.css('background-color',color_);
			else
				d.css('background-color','');
			flash(d,flag,color)
		}
	},80);
}


function preventPropagation(p,s,e){
	$(p).on(e,s,function(event){
		event.stopPropagation();
	});
}

function dsAddCalcField(){
	aly.editCalcField(null,function(){
		aly.refresh(true,true);
	});
}

function enableAcfBut(){
	enableStyle($('#acfBut'),this.dsAddCalcField);
}

function disableAcfBut(){
	disableStyle($('#acfBut'));
}

function enableStyle($1,f,confItem, dataSet){
	$1.off();
	$1.css('cursor','pointer');
	$1.addClass('enable');
	$1.on('click',function(){f(confItem,dataSet)});
}

function disableStyle($1){
	$1.css('cursor','no-drop');
	$1.removeClass('enable');
	$1.off();
}

function refreshItemsReportWhereBuf(){
	var rpxs = rqAnalyse.rpxs;
	disableStyle($('.reportWhere'));
	for(var r = 0; r < rpxs.length; r++){
		var conf = rpxs[r];
		var area = controlUtil.getAreaByReport(conf.name);
		var areaType = $(area).attr('type');//0是报表，1是控件
		var isNotEnabled = $("#singleArea"+area.id).find('.reportWhere')[0].className.indexOf('enabled') < 0;
		var dataSet = aly.getDataSet(conf.dataSet);
		if(isNotEnabled){
			var f = function(confItem, dataSet){
				var inFunc = function() {
					//改变光标位置
					var divcell = $('.singleArea[confname="'+confItem.name+'"]').parent()[0];
					if( !isChoosed(divcell) ){
						divTableControl.changeChoosedDiv(divcell);
					}
					var filter1 = "";
					if (dataSet.type == 6 || dataSet.type == 7) filter1 = whereUtils.getExp(confItem.where.conf, "T1.", 1);
					else filter1 = whereUtils.getExp(confItem.where.conf, "", 1, 2);
					var saveFunc = function () {
						var disp = whereUtils.getDisp(cache.where.wheres);
						if (disp == '') return false;
						confItem.where.conf = cache.where.wheres;
						var exp = '';
						if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(confItem.where.conf, "T1.", 1);
						else exp = whereUtils.getExp(confItem.where.conf, "", 1, 2);
						if (exp != filter1) {
							setTimeout("aly.refresh();",1);
						}
						artDialog.defaults.zIndex = zIndexBak;
						return true;
					 };
					 var clearFunc = function () {
						confItem.where.conf = [];
						var exp = '';
						if (dataSet.type == 6 || dataSet.type == 7) exp = whereUtils.getExp(confItem.where.conf, "T1.", 1);
						else exp = whereUtils.getExp(confItem.where.conf, "", 1, 2);
						if (exp != filter1) {
							setTimeout("aly.refresh();",1);
						}
						artDialog.defaults.zIndex = zIndexBak;
						return true;
					}

					var fields = [];
					if (dataSet.type == 6){
						var ts = aly.getDataSet(confItem.dataSet).tableName.split(",");
						//for (var i=0; i<ts.length; i++) cus.getFieldInfos(ts[i], fields, 0, null, null,false);
						for(var i = 0; i < confItem.fields.length; i++){
							fields[fields.length] = confItem.fields[i].src;
						}
						for(var i2 = 0; i2 < confItem.tops.length; i2++){
							fields[fields.length] = confItem.tops[i2].src;
						}
						for(var i3 = 0; i3 < confItem.lefts.length; i3++){
							fields[fields.length] = confItem.lefts[i3].src;
						}
						for (var i=0; i<fields.length; i++) fields[i] = transWhereInfo(fields[i],null,false);
						if(fields.length == 0) {
							alert("此类型报表中没有字段时无法过滤");
							return;
						}
					} else {
						for (var n=0; n<dataSet.fields.length; n++) {
							var itemn = dataSet.fields[n];
							if (itemn.exp && itemn.exp != '') continue;
							fields[fields.length] = {disp:itemn.name,dataType:itemn.dataType,edit:itemn.edit,exp:itemn.name,valueType:1,values:""};
						}
					}
					var initField = fields[0];

					whereUtils.openWhereDialog(saveFunc,clearFunc);
					whereUtils.refresh(fields, initField, JSON.parse(JSON.stringify(confItem.where.conf)));
				}
				analyseApi.complexWhereFunc(inFunc);
			};
			enableStyle($("#singleArea"+area.id).find('.reportWhere'),f,conf, dataSet);
		}
	}
	var toEditorButtons = $('.toEditor');
	for(var j = 0; j < toEditorButtons.length; j++){
		var area = findParentArea(toEditorButtons[j]);
		var areaType = $(area).attr('type');
		if(!areaType) {
			areaType = "0";
			$(area).attr('type',"0");
		}
		if(areaType == "1"){
			$(area).find('.toEditor').hide();
		}else if(areaType == "0"){
			$(area).find('.toReport').hide();
		}
	}
}

function findParentArea(e){
	var p = $(e).parent();
	if(p == null) return null;
	if(p.hasClass('singleArea')) {
		return p;
	}
	else {
		return findParentArea(p);
	}
}

var layoutModels = {
	i1:{"layout":
		{"areas":
		[
		{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"},
		{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"},
		{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1_2_2","report":"图表名称2"}
		],
		"divInfos":{"rows":2,"cols":2,"divContents":[],"divs":
		[
		{"id":"d_1_1","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"}},
		{"id":"d_1_2","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"}},
		{"id":"d_2_1_2_2","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1_2_2","report":"图表名称2"}}
		]
		},"mergeCellIds":["d_2_1_2_2"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i2:{"layout":
		{"areas":
		[
		{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1_1_2","report":"图表名称0"},
		{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称1"},
		{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_2","report":"图表名称2"}
		],
		"divInfos":{"rows":2,"cols":2,"divContents":[],"divs":
		[
		{"id":"d_1_1_1_2","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1_1_2","report":"图表名称0"}},
		{"id":"d_2_1","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称1"}},
		{"id":"d_2_2","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_2","report":"图表名称2"}}
		]
		},"mergeCellIds":["d_1_1_1_2"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i3:{"layout":
		{"areas":
		[
		{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"},
		{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2_2_2","report":"图表名称1"},
		{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称2"}
		],
		"divInfos":{"rows":2,"cols":2,"divContents":[],"divs":
		[
		{"id":"d_1_1","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"}},
		{"id":"d_1_2_2_2","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2_2_2","report":"图表名称1"}},
		{"id":"d_2_1","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称2"}}
		]
		},"mergeCellIds":["d_1_2_2_2"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i4:{"layout":
	{"areas":
	[
	{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"},
	{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"},
	{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称2"},
	{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_2","report":"图表名称3"}
	],
	"divInfos":{"rows":2,"cols":2,"divContents":[],"divs":
	[
	{"id":"d_1_1","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"}},
	{"id":"d_1_2","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"}},
	{"id":"d_2_1","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称2"}},
	{"id":"d_2_2","area":{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_2","report":"图表名称3"}}
	]
	},"mergeCellIds":[],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i5:{"layout":
	{"areas":
	[
	{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"},
	{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"},
	{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3","report":"图表名称2"},
	{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1_2_3","report":"图表名称3"}
	],
	"divInfos":{"rows":2,"cols":3,"divContents":[],"divs":
	[
	{"id":"d_1_1","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"}},
	{"id":"d_1_2","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"}},
	{"id":"d_2_1","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称2"}},
	{"id":"d_2_1_2_3","area":{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1_2_3","report":"图表名称3"}}
	]
	},"mergeCellIds":["d_2_1_2_3"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i6:{"layout":
	{"areas":
	[
	{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"},
	{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2_2_2","report":"图表名称1"},
	{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3_2_3","report":"图表名称2"},
	{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称3"}
	],
	"divInfos":{"rows":2,"cols":3,"divContents":[],"divs":
	[
	{"id":"d_1_1","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"}},
	{"id":"d_1_2_2_2","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2_2_2","report":"图表名称1"}},
	{"id":"d_1_3_2_3","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3_2_3","report":"图表名称2"}},
	{"id":"d_2_1","area":{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称3"}}
	]
	},"mergeCellIds":["d_1_2_2_2","d_1_3_2_3"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i7:{"layout":
	{"areas":
	[
	{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"},
	{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2_2_2","report":"图表名称1"},
	{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3","report":"图表名称2"},
	{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称3"},
	{"id":4,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_3","report":"图表名称4"}
	],
	"divInfos":{"rows":2,"cols":3,"divContents":[],"divs":
	[
	{"id":"d_1_1","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"}},
	{"id":"d_1_2_2_2","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2_2_2","report":"图表名称1"}},
	{"id":"d_1_3","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3","report":"图表名称2"}},
	{"id":"d_2_1","area":{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称3"}},
	{"id":"d_2_3","area":{"id":4,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_3","report":"图表名称4"}}
	]
	},"mergeCellIds":["d_1_2_2_2"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i8:{"layout":
	{"areas":
	[
	{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"},
	{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"},
	{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3_2_3","report":"图表名称2"},
	{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称3"},
	{"id":4,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_2","report":"图表名称4"}
	],
	"divInfos":{"rows":2,"cols":3,"divContents":[],"divs":
	[
	{"id":"d_1_1","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1","report":"图表名称0"}},
	{"id":"d_1_2","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_2","report":"图表名称1"}},
	{"id":"d_1_3_2_3","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3_2_3","report":"图表名称2"}},
	{"id":"d_2_1","area":{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1","report":"图表名称3"}},
	{"id":"d_2_2","area":{"id":4,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_2","report":"图表名称4"}}
	]
	},"mergeCellIds":["d_1_3_2_3"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
	,i9:{"layout":
	{"areas":
	[
	{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1_1_2","report":"图表名称0"},
	{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3_1_4","report":"图表名称1"},
	{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_5_1_6","report":"图表名称2"},
	{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1_2_3","report":"图表名称3"},
	{"id":4,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_4_2_6","report":"图表名称4"}
	],
	"divInfos":{"rows":2,"cols":6,"divContents":[],"divs":
	[
	{"id":"d_1_1_1_2","area":{"id":0,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_1_1_2","report":"图表名称0"}},
	{"id":"d_1_3_1_4","area":{"id":1,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_3_1_4","report":"图表名称1"}},
	{"id":"d_1_5_1_6","area":{"id":2,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_1_5_1_6","report":"图表名称2"}},
	{"id":"d_2_1_2_3","area":{"id":3,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_1_2_3","report":"图表名称3"}},
	{"id":"d_2_4_2_6","area":{"id":4,"xy":{"x":"","y":""},"hw":{"h":"0px","w":"0px"},"inDivCell":"d_2_4_2_6","report":"图表名称4"}}
	]
	},"mergeCellIds":["d_1_1_1_2","d_1_3_1_4","d_1_5_1_6","d_2_1_2_3","d_2_4_2_6"],"divWHs":{"cw":["0px","0px","0px"],"rh":["0px","0px","0px"]}}}
}

function preview(){
	//var isOpenOlapFile = guideConf.openDOlap == 'true' || guideConf.openDOlap == true;
	//if((!isOpenOlapFile || olapFile[0] == "{") || domModified) {
		var name = saveOlapTemp();
		olapFile = guideConf.olapFolderOnServer + "temp/"+name;
	//}
	$('#preview').css('cursor','progress');
	setTimeout(function(){
		$('#preview').css('cursor','pointer');
		window.location = './view.jsp?olap='+encodeURIComponent(olapFile);
	},1000);
}

function findReportInArray(rpxs,name){
	for(var i = 0; i < rpxs.length; i++){
		if(rpxs[i].name == name) {
			return rpxs[i];
		}
	}
}

function checkHasReport(d){
	var rname = $(d).find('.singleArea').attr('confName');
	return aly.getRpx(rname) != null;
}

function sleep(numberMillis) { 
	var now = new Date(); 
	var exitTime = now.getTime() + numberMillis; 
	while (true) { 
		now = new Date(); 
		if (now.getTime() > exitTime) 
			return; 
	} 
}

function sysparams(){
	return {
		getSysparams:function(){
			zIndexBak = artDialog.defaults.zIndex;
			var dlg = art.dialog({
				id : 0325,
				title : "共享参数",
			    content: '<div id="sysparams_div" style="width:100%;height:100%;overflow:auto;">'
			    	+'<table id="sys_p_content" style="width:100%"></table></div>'
		    	,button: [
		    	     ]
			    ,ok : this.saveSysparams
			    ,cancel : function(){
					artDialog.defaults.zIndex = zIndexBak;
					return true;
				}
			    ,okVal : resources.guide.js51
			    ,cancelVal : '退出'
			    ,lock : true
			    ,duration : 0
				,zIndex : 44444
			    ,width : '900px'
				,height : '400px'
				,opacity : 0.1
				,padding : '2px 2px'
			});
			this.initSysparams();
		},
		initSysparams:function(){
			$('#sysparams_div').append('<a onclick="addSysParam();">添加</a>');
			$('#sysparams_div').find('#sys_p_content').append('<tr><th>名称</th><th>值</th><th>类型</th><th>&nbsp;</th></tr>');
			var initparams = aly.sysparams;
			if(initparams != null && initparams.length > 0){
				for(var j = 0; j < initparams.length; j++){
					addSysParam(initparams[j]);
				}
			}else{
				aly.sysparams = [];
			}
		},
		saveSysparams:function(){
			var params = [];
			var saveSysTrs = $('.sysParamsTr');
			for(var i = 0 ; i < saveSysTrs.length; i++){
				var pname = $(saveSysTrs[i]).find('.sp_name').val();
				var val = $(saveSysTrs[i]).find('.sp_value').val();
				var ptype = $(saveSysTrs[i]).find('.sp_type').val();
				//校验
				if(pname == null || pname.length == 0){
					alert("参数名不能为空");
					return false;
				}
				if(val == null || val.length == 0){
					alert("值不能为空");
					return false;
				}
				var param = {name:pname,value:val,type:ptype};
				params.push(param);
				refreshDsSysparams(pname,val);
			}
			//覆盖
			aly.sysparams = params;
			alert("保存成功");
			aly.refreshAll();
			cleanSideBoard();
			return false;
		},
		changeOneSysParam:function(pname, value){
			for(var k = 0; k < aly.sysparams.length; k++){
				if(aly.sysparams[k].name == pname){
					aly.sysparams[k].value = value;
					refreshDsSysparams(pname,value);
					aly.refreshAll();
					cleanSideBoard();
					return;
				}
			}
			alert("没找到参数："+pname);
		},
		del:function(e){
			$(e).parent().parent().remove();
		},
		getValueFromSysParams: function(name){
			var initparams = aly.sysparams;
			if(initparams != null && initparams.length > 0){
				for(var j = 0; j < initparams.length; j++){
					if(initparams[j].name == name) return initparams[j].value;
				}
			}
		}
	}
}

function refreshDsSysparams(pname, value){
	for(var r = 0; r < rqAnalyse.dataSets.length; r++){
		var ds = rqAnalyse.dataSets[r];
		if(ds.params){
			for(var p = 0; p < ds.params.length; p++) {
				var csp = ds.params[p].chooseSp;
				if(pname == csp) ds.params[p].values = value;
			}
		}
	}
}

function addSysParam(jsonData){
	var tr = $('<tr class="sysParamsTr"></tr>');
	$('#sys_p_content').append(tr);
	tr.append('<td><input type="text" class="sp_name"/></td>');
	tr.append('<td><input type="text" class="sp_value"/></td>');
	var select1td = $('<td></td>');
	var select1 = $('<select style="width:125px" class="sp_type" ></select>');
	select1td.append(select1);
	select1.append('<option value=1>整数</option>');
	select1.append('<option value=2>长整数</option>');
	select1.append('<option value=3>短整数</option>');
	select1.append('<option value=4>大整数</option>');
	select1.append('<option value=5>浮点数</option>');
	select1.append('<option value=6>双精度数</option>');
	select1.append('<option value=7>数值</option>');
	select1.append('<option value=8>日期</option>');
	select1.append('<option value=9>时间</option>');
	select1.append('<option value=10>日期时间</option>');
	select1.append('<option value=11 selected>字符串</option>');
	select1.append('<option value=12>布尔值</option>');
	select1.append('<option value=51>整数组</option>');
	select1.append('<option value=52>长整数组</option>');
	select1.append('<option value=53>短整数组</option>');
	select1.append('<option value=54>大整数组</option>');
	select1.append('<option value=55>浮点数组</option>');
	select1.append('<option value=56>双精度数组</option>');
	select1.append('<option value=57>数值组</option>');
	select1.append('<option value=58>日期组</option>');
	select1.append('<option value=59>时间组</option>');
	select1.append('<option value=60>日期时间组</option>');
	select1.append('<option value=61>字符串组</option>');
	select1.append('<option value=62>二进制</option>');
	select1.append('<option value=0>默认</option>');
	select1.append('<option value=102>自动增长</option>');
	select1.append('<option value=27>大文本</option>');
	tr.append(select1td);
	tr.append('<td><a class="sp_del" onclick="javascript:delSysparam(this);">删除</a></td>');
	if(jsonData != null){
		tr.find('.sp_name').val(jsonData.name);
		tr.find('.sp_value').val(jsonData.value);
		tr.find('.sp_type').val(jsonData.type);
	}
}

function delSysparam(e){
	sysparams.del(e);
}

function dump(a){
	try{
		e = d1.o1;
	}catch(e){
		if(a)console.log(a);
		console.log('dump');
		console.log(e);
	}
}

function getTime(){
	sleep(1);
	return new Date().getTime();
}

function changeMainWidthHeight(v1,v2){
	if(v1) $('.main').css('height',v1+'px');
	if(v2) $('.main').css('width',v2+'px');
}

function getMainWidth(){
	parseInt($('.main').css('width'));
}

function getMainHeight(){
	parseInt($('.main').css('height'));
}

var sysparams = sysparams();

function changeLayout(r,c){
//	if(!confirm('新建布局会清空当前布局报表，是否继续？')){
//		return;
//	}
	//rqAnalyse.rpxs = [];
	if(r*c < rqAnalyse.rpxs.length) {
		alert('新建布局格数小于当前报表数！');
		return;
	}
	aly.cache.reports = [];
	$('#contents').html('');
	controlUtil.area = [];
	//var l = {divInfos:{cols:c,rows:r},mergeCellIds:[],areas:[]};
	diyR = r;
	diyC = c;
	guideConf.openDOlap = "new";
	divTableControl.divInfos.divs = [];
	countArea = 0;
	dbdInit();
	cleanSideBoard();
	diyR=0;
	diyC=0;
}

function diyLayout(){
	var dlg = art.dialog({
		id : dialogCount++,
		title : '自定义布局',
	    content: '<table id="diyLayout"></table>'
	    ,ok : function() {
	    	changeLayout($('#diyLayout').find('#diyrow').val(),$('#diyLayout').find('#diycol').val());
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
	var tr1 = $("<tr><td><input id=diyrow type=text /></td><td>行</td></tr>");
	var tr2 = $("<tr><td><input id=diycol type=text /></td><td>列</td></tr>");
	$('#diyLayout').append(tr1);
	$('#diyLayout').append(tr2);
}

function isChoosed(div){
	return div.className.indexOf('choosedDiv') >= 0;
}

function activeReportMengBan(div){
	for(var i = 0; i < $('.resiz').length; i++){
		div = $($('.resiz')[i]);
		if(div.find('.reportMengBan').length == 0 && div.find('.singleArea').find('iframe').length > 0)
			div.append('<div class="reportMengBan">mengban</div>');
	}
}

function dealDisplayOfLongStr(d, width){
	if(d.clientWidth > width) $(d).html($(d).html().substring(0,10)+"......");
}


function toEditor(areaid){
	var area = $("#"+areaid);
	area.find('.toEditor').hide();
	area.find('.reportWhere').hide();
	area.find('.toReport').show();
	area.attr('type','1');
	divTableControl.changeChoosedDiv(currDiv);
	var areaObj = controlUtil.getAreaCount(areaid);
	areaObj.type = "1";
	area.find('.barReportName').hide();
	var oldHrefMethod = area.find('.reportRemove')[0].href;
	area.find('.reportRemove')[0].href=oldHrefMethod.replace('removeReport','removeEditor');
	removeReport($(area).find('iframe').attr('confname'),true);
	areaObj.editor = {};
}

function toReport(areaid){
	var area = $("#"+areaid);
	area.find('.toEditor').show();
	area.find('.reportWhere').show();
	area.find('.toReport').hide();
	area.attr('type','0');
	divTableControl.changeChoosedDiv(currDiv);
	var areaObj = controlUtil.getAreaCount(areaid);
	areaObj.type = "0";
	area.find('.barReportName').show();
	var oldHrefMethod = area.find('.reportRemove')[0].href;
	area.find('.reportRemove')[0].href=oldHrefMethod.replace('removeEditor','removeReport');
	removeEditorDom(areaid);
}

function removeEditorDom(areaid){
	var area = $("#"+areaid);
	area.find('.editor_o').remove();
	var areaObj = controlUtil.getAreaCount(areaid);
	areaObj.editor = null;
}

function initEditors(){
	var areas = controlUtil.areas;
	for(var i = 0 ; i < areas.length; i++){
		var area = areas[i];
		if(area.type != "1"){
			continue;
		}
		var p1 = {
			"type" : area.editor.type,
			"pname" : area.editor.pname,
			"parent" : $('#singleArea'+area.id),
			"form" : null,
			"formData" : area.editor.data
		}
		toEditor('singleArea'+area.id);
		createEditor(p1);
	}
}

function showSysparams(){
	sysparams.getSysparams();
}

function changeEditorValueWithSamePname(pname,v){
	for(var i = 0; i < controlUtil.areas.length; i++){
		var areaObj = controlUtil.areas[i];
		if(areaObj.type != "1" || areaObj.editor.pname != pname) continue;
		var options = types[areaObj.editor.type];
		options.changeValue(areaObj,v);
	}
}