function contains(arr, value){
	  var index = $.inArray(value,arr);
	    if(index >= 0){
	        return true;
	    }
	    return false;
}

var trid = 0;
var count = 0;
var currTrid = 0;
var oldTrids = new Array();
var currListid = 0;
var hasNullParam = false;

function showReportParams(){
	var length = 0;
	var obj = null;
	try{
		obj = JSON.parse(params);
	}catch(e){
		return;
	}
	length = obj.length;
	var strArr = new Array("name","desc","type","value");//此顺序和页面关联
	for(var i = 0 ; i < length; i++){
		var param = obj[i];
		var row = addReportParam();//一行六列行
		var tds = $(row).children('td');
		for(var k = 1; k < tds.length-1; k++){//k=0是checkbox不需要
			var td = tds[k];
			var input = td.firstChild;
			input.value = eval("param."+strArr[k-1]);
		}
	}
	trid = length;
	count = length;
}
function showReportParams2(){
	var length = 0;
	var obj = null;
	try{
		obj = JSON.parse(params);
	}catch(e){
		return;
	}
	length = obj.length;
	var strArr = new Array("name","desc","type","value");//此顺序和页面关联
	for(var i = 0 ; i < length; i++){
		var param = obj[i];
		var table = addReportParam2();//五行两列表
		currListid = 0;
		var trs = $($(table).children()[0]).children('tr');
		for(var j = 0; j < trs.length - 1; j++){
			var td = $(trs[j]).children('td')[1];
			var input = td.firstChild;
			input.value = eval("param."+strArr[j]);
		}
	}
	trid = length;
	count = length;
}

function inputToJson(){
	var jsonranklist=[];
	var strArr = new Array("name","desc","type","value");//此顺序和页面关联
	var rows = $('#reportParamTrs')[0].rows;
	out1:for(var i = 0 ; i < rows.length; i++){
		var paramObj = {"name":"","desc":"","type":12,"value":""};
		var row = rows[i];
		var name,desc,value = "";
		var type = 12;
		var mode = 1;
		var tds = $(row).children('td');
		for(var k = 1; k < tds.length; k++){//k=0是checkbox不需要
			var td = tds[k];
			var input = td.firstChild;
			if(strArr[k-1] == "name" && (input.value == null || input.value.trim() == "") ){
				hasNullParam = true;
				continue out1;
			}
			paramObj[strArr[k-1]] = input.value;
		}
		jsonranklist[jsonranklist.length] = paramObj;
	}
	if(jsonranklist.length == 0) return "";
	var j = JSON.stringify(jsonranklist);
	return j;
}

function inputToJson2(){
	var jsonranklist=[];
	var strArr = new Array("name","desc","type","value");//此顺序和页面关联
	var rows = $('#reportParamTrs')[0].rows;
	out1:for(var i = 0 ; i < rows.length; i++){
		var paramObj = {"name":"","desc":"","type":12,"value":""};
		var row = rows[i];
		var innerTableId = 'innerTable_'+row.getAttribute('trid');
		var innerTrs = $($('#'+innerTableId).children()[0]).children();
		console.log(innerTrs);
		for(var k = 0; k < innerTrs.length - 1; k++){
			var innerTr = innerTrs[k];
			var inputtd = $(innerTr).children('td')[1];
			var input = inputtd.firstChild;
			console.log(innerTr);
			console.log(input);
			if(strArr[k] == "name" && (input.value == null || input.value.trim() == "") ){
				console.log("continue out1");
				hasNullParam = true;
				continue out1;
			}
			
			paramObj[strArr[k]] = input.value;
		}
		jsonranklist[jsonranklist.length] = paramObj;
	}
	var j = JSON.stringify(jsonranklist);
	return j;
}

function addReportParam(){
	trid++;
	count++;
	try{
		var tr = $('<tr trid='+trid+'></tr>');
		tr.append('<td><input type="checkbox" class="layui-checkbox" value="'+trid+'"/></td>');
		tr.append('<td><input type="text" class="layui-input"/></td>');
		tr.append('<td><input type="text" class="layui-input"/></td>');
		var select1td = $('<td></td>');
		var select1 = $('<select style="width:125px" class="layui-input layui-select" ></select>');
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
		tr.append('<td><input type="text" class="layui-input"/></td>');
		var select2td = $('<td>普通参数</td>');
		tr.append(select2td);
		$(tr).appendTo('#reportParamTrs');
	}catch(e){
		count--;
	}
	return tr;
}
	
function addReportParam2(){
	trid++;
	count++;
	try{
		var tr = $('<tr class="paramTr" trid='+trid+'></tr>');
		tr.appendTo('#reportParamTrs');
		tr.append('<td colspan=4><table id=innerTable_'+trid+'></table></td>');
		var innertr1 = $('<tr></tr>');
		var innertr2 = $('<tr></tr>');
		var innertr3 = $('<tr></tr>');
		var innertr4 = $('<tr></tr>');
		var innertr5 = $('<tr></tr>');
		var innerTable = $('#innerTable_'+trid);
		innertr1.append('<td colspan=2>名称</td><td colspan=2><input type="text" class="layui-input"/></td>');
		innertr2.append('<td colspan=2>描述</td><td colspan=2><input type="text" class="layui-input"/></td>');
		var select1td = $('<td colspan=2></td>');
		var select1 = $('<select style="width:125px" class="layui-input layui-select" ></select>');
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
		innertr3.append('<td colspan=2>数据类型</td>');innertr3.append(select1td);
		innertr4.append('<td colspan=2>参数值</td><td colspan=2><input type="text" class="layui-input"/></td>');
		var select2td = $('<td colspan=2>普通参数</td>');
		innertr5.append('<td colspan=2>参数类型</td>');innertr5.append(select2td);
		$(innertr1).appendTo(innerTable);
		$(innertr2).appendTo(innerTable);
		$(innertr3).appendTo(innerTable);
		$(innertr4).appendTo(innerTable);
		$(innertr5).appendTo(innerTable);
		//$('#btn_td').append('<input onclick="delReportParam2('+trid+');" type=button class="layui-btn layui-btn-warm layui-btn-sm" value="删除参数"/>');
	}catch(e){
		count--;
		return;
	}
	oldTrids.push(trid);
	$("#count").html(count);
	currTrid = trid;
	currListid = oldTrids.length - 1;
	showOneParam();
	return innerTable;
}

function delReportParam(){
	var ids = deleteSelect();
	if(ids.length == 0){
		return;
	}
	var reportParamTrs = $('#reportParamTrs').children();
	for(var i = 0 ; i < reportParamTrs.length; i++){
		var id = reportParamTrs[i].getAttribute("trid");
		if(contains(ids, id)){
			count--;
			try{
				$(reportParamTrs[i]).remove();
			}catch(e){
				count++;
			}
		}
	}
	layui.use('layer',function(){
		layer.msg('参数修改\删除在保存后生效');
	});
}

function delReportParam2(){
	if(oldTrids.length == 0){
		layui.use('layer',function(){
			layer.msg('无参数');
		});
		return;
	}
	
	layui.use('layer',function(){
		layer.msg('参数修改\删除在保存后生效');
	});
	
	var reportParamTrs = $('#reportParamTrs').children();
	for(var i = 0 ; i < reportParamTrs.length; i++){
		var id = reportParamTrs[i].getAttribute("trid");
		if(id == currTrid){
			try{
				$(reportParamTrs[i]).remove();
				count--;
			}catch(e){
				count++;
				return;
			}
		}
	}
	var removeListid = currListid;
	if(oldTrids.length == 1){
		oldTrids = new Array();
		currListid = 0;
		currTrid = 0;
		$("#count").html(count);
		return;
	}
	if(currListid == oldTrids.length - 1){
		currTrid = oldTrids[oldTrids.length - 2];
		currListid = oldTrids.length - 2;
	}else{
		currListid++;
		currTrid = oldTrids[currListid];
	}
	showOneParam();
	oldTrids.splice(removeListid,1);
	$("#count").html(count);
}

function deleteSelect(){
	var delUserIds = new Array();
	var checkboxs = $('#reportParamTrs input[type=checkbox]');
  var subGo=0;
  for(var i=0;i<checkboxs.length;i++){
	  if(checkboxs[i].checked){
		  if(checkboxs[i].name == 'selectAll'){
			  continue;
		  }
		  delUserIds[delUserIds.length] = checkboxs[i].value;
		  subGo++;
	   }
   }
    if(subGo<1){
	   alert("您没有选择参数！");
	   return ;
    }
    return delUserIds;
}

function showOneParam(){
	var tr = null;
	for(var i = 0 ; i < oldTrids.length; i++){
		tr = $('tr[trid='+oldTrids[i]+']')[0];
		$(tr).hide();
	}
	tr = $('tr[trid='+currTrid+']')[0];
	if(tr != null){
		$(tr).show();
	}
}

function next(){
	console.log(currListid);
	console.log(oldTrids.length);
	
	if(!(currListid == oldTrids.length - 1)){
		currListid++;
		currTrid = oldTrids[currListid];
		showOneParam();
	}
}

function former(){
	if(!(currListid == 0)){
		currListid--;
		currTrid = oldTrids[currListid];
		showOneParam();
	}
}

function get_scheduleUserParams(){
	var paramsJson = inputToJson();
	if(paramsJson == '[]') return null;
	else return "{id:"+userid+",paramsJson:"+paramsJson+"}";
}

$(function(){
	if(navigator.userAgent.toLowerCase().indexOf('mobile')<0){
		//$('.layui-tab')[0].style.width='1000px';
		showReportParams();
	}else{
		showReportParams2();
	}
	if(count > 0){
		currTrid = oldTrids[0];
	}
	showOneParam();
	$("#count").html(count);
});