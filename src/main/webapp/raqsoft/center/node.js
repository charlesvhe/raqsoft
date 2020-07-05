function addReport(uploadType){
	if(uploadType == null){
		if($('#typeBox').val() == "5"){
			uploadType = "report_businessInput";
		}else if($('#typeBox').val() == "6"){
			uploadType = "report_aggr";
		}
	}
	layui.use('layer', function(){
		$('#openLayerIndex').val(layer.open({
			type:2,
			title:"上传报表",
			content:appmap+'/reportCenterServlet?action=26&uploadType='+uploadType+'&refresh=no',
			area: ['350px', '385px'],
			offset: 'auto'
		}));
	});
}

function refreshReportList(newReportName, value){
	$(raqBox).append($("<option value=\""+value+"\" selected>"+newReportName+"</option>"));
}

function refreshArgList(newReportName, value){
	$(formBox).append($("<option value=\""+value+"\" selected>"+newReportName+"</option>"));
}

function noselect(){
	formSelects.render({
		name:"xm-select1",
		init:[]
	});
	formSelects.render({
			name:"xm-select2",
			init:[]
	});
 }

function dqldbChange(event){
	 if(event.value != "") {
		 $('#qyxBox').val("");
		 $('#qyxBoxMsgSpan').html("&#x1006;");
		 $('#qyxBoxMsgSpan').css("color","red");
		 $('#queryBoxMsgSpan').html("&#xe605;");
		 $('#queryBoxMsgSpan').css("color","green");
	 }
	 anaDqldbChange(event);
	 filter(event);
}

function anaDqldbChange(event){
	 var dqldb2 = event.value;
	 $('#anaTables').empty();
	 $('#anaTables').append("<OPTION value=\"\">查询中...</OPTION>");
	 $('#frame_tableArrange').attr("src", appmap+raqdir+"/guide/jsp/centerQuerySupport.jsp?dataSource="+dqldb2);
}

function qyxChange(event){
	 if(event.value != "") {
		 $('#queryBox').val("");
		 $('#queryBoxMsgSpan').html("&#x1006;");
		 $('#queryBoxMsgSpan').css("color","red");
		 $('#qyxBoxMsgSpan').html("&#xe605;");
		 $('#qyxBoxMsgSpan').css("color","green");
	 }
}

function reFreshAnalysefileList(analyseType){
	$.ajax({
		data:[],
		url:appmap+"/reportCenterServlet?action=55&analyseType="+analyseType,
		type:'post',
		success:function(anaFilesString){
			var anaFilesArr = anaFilesString.split(',');
			$(anaBox).empty();
			if(analyseType == 'inputFiles'){
				$(anaBox).append($("<option value='' style='color:#DDD' selected disabled>选择文件会拼接到填报文件</option>"));
			}
			var selected = '';
			if(analyseType != 'inputFiles'){
				selected = " selected"
			}
			for(var a = 0 ;a < anaFilesArr.length; a++){
				$(anaBox).append($("<option"+selected+" value=\""+anaFilesArr[a]+"\">"+anaFilesArr[a]+"</option>"));
			}
		}
	});
} 
 
function attachInputFiles(fromId,toId,split,suffix){
	var inputDir = inputHome + '/';
	if($('#'+fromId).val() == '') inputDir = inputHome;
	var inputFile1 = $('#'+fromId).val();//inputDir+
	if($('#'+toId).val().length == 0){
		$('#'+toId).val(split+inputFile1+suffix);
	}else{
		if($('#'+toId)[0].value.indexOf(split+inputFile1+suffix) < 0){
			$('#'+toId)[0].value += split+inputFile1+suffix;
		}
	}
}

function typeChanged() {
	hideSpan( 'analysisSpan' );
	hideSpan( 'analysisSpan0' );
	hideSpan( 'reportSpan' );
	hideSpan( 'urlSpan' );
	hideSpan( 'querySpan' ); 
	hideSpan( 'businessInput' );
	hideSpan( 'reportParam' );
	if( typeBox.value == "1" || typeBox.value == "6" || typeBox.value == "5") {
		showSpan( 'reportSpan' );
		showSpan( 'reportParam' );
		//showReportParams();
		if(typeBox.value != "6" && typeBox.value != "5"){
			$('#upReportFile').off('onclick').attr('onclick','');
			$('#upReportFile').click(function(){
				addReport('report_1');
			});
		}
		if(typeBox.value == "6"){
			filterByType("aggr");
			$('#raqBoxLabel').html("统计表");
			hideSpan('aggrhide');
			$('.layui-form[name=radioForm_TreeStructure] input[type=radio]').attr('checked',false);
			$('#upReportFile').off('onclick').attr('onclick','');
			$('#upReportFile').click(function(){
				addReport('report_aggr');
			});
			lookoverdir(aggrDataFile, false);
		}else if(typeBox.value == "5"){
			filterByType("business");
			$('#raqBoxLabel').html("业务填报表");
			hideSpan('aggrshow');
			hideSpan('busihide');
			$('.layui-form[name=radioForm_TreeStructure] input[type=radio]').attr('checked',false);
			showSpan( 'businessInput' );
			showSpan( 'reportParam' );
			//showReportParams();
			$('#raqBoxLabel').html("对应报表");
			lookoverdir(businessInputSubDir, true);
			$('#upReportFile').off('onclick').attr('onclick','');
			$('#upReportFile').click(function(){
				addReport();
			});
		}else {
			hideSpan('aggrshow');
			$('#raqBoxLabel').html("对应报表");
			filterByType("");
			rpgHide($('#raqBox')[0]);
		}
	}else if( typeBox.value == "2" ) {
		showSpan( 'urlSpan' );
	}else if( typeBox.value == "3" ) {
		showSpan( 'querySpan' );
		dqldbChange(queryBox);
		filter(queryBox);
	}else if( typeBox.value == "4" ) {
		showSpan( 'analysisSpan' );
	}
}

function contains(arr, value){
	  var index = $.inArray(value,arr);
	    if(index >= 0){
	        return true;
	    }
	    return false;
}

var trid = 0;

function showReportParams(){
	var length = 0;
	var obj = JSON.parse(params);
	length = obj.length;
	var strArr = new Array("name","desc","type","value","mode");//此顺序和页面关联
	for(var i = 0 ; i < length; i++){
		var param = obj[i];
		var row = addReportParam();
		var tds = $(row).children('td');
		for(var k = 1; k < tds.length; k++){//k=0是checkbox不需要
			var td = tds[k];
			var input = td.firstChild;
			input.value = eval("param."+strArr[k-1]);
		}
	}
	trid = length;
}

function addReportParam(){
	trid++;
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
	return tr;
}
	
function delReportParam(){
	var ids = deleteSelect();
	var reportParamTrs = $('#reportParamTrs').children();
	for(var i = 0 ; i < reportParamTrs.length; i++){
		var id = reportParamTrs[i].getAttribute("trid");
		if(contains(ids, id)){
			$(reportParamTrs[i]).remove();
		}
	}
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

function rpgHide(e){
	var val = e.value.toLowerCase();
	if(val != null && val.indexOf(".rpg") >= 0){
		$($('.rpghide')[0]).css('display','none');
		var tds = $($('.rpghide')[0]).children('td');
		var input = $(tds[1]).children('input')[0];
		$(input).prop('checked', false);
	}else{
		if($('#typeBox').val() != '6'){
			$($('.rpghide')[0]).css('display','');
		}
	}
}

function shtHide(e){
	var val = e.value.toLowerCase();
	if(val != null && val.indexOf(".sht") >= 0){
		var shthides = $('.shthide');
		for(var i = 0; i < shthides.length; i++){
			$(shthides[i]).css('display','none');
			var tds = $(shthides[i]).children('td');
			var input = $(tds[1]).children('input')[0];
			$(input).prop('checked', false);
			if(i == 1){
				$(input).prop('disabled', true);
			}
			
		}
	}else{
		$($('.shthide')[0]).css('display','');
	}
}

function matchShow(e){
	var val = e.value.toLowerCase();
	if(val != null && val.indexOf(".rpx") >= 0){
		var hideElm = $('#matchBoxTr');
		var tds = $(hideElm).children('td');
		hideElm.css('display','block');
	}else{
		var hideElm = $('#matchBoxTr');
		hideElm.css('display','none');
		var tds = $(hideElm).children('td');
		var input = $(tds[1]).children('input')[0];
		$(input).prop('checked', false);
	}
}

function inputToJson(){
	var jsonranklist=[];
	var strArr = new Array("name","desc","type","value","mode");//此顺序和页面关联
	var rows = $('#reportParamTrs')[0].rows;
	for(var i = 0 ; i < rows.length; i++){
		var paramObj = {"name":"","desc":"","type":12,"value":"","mode":1};
		var row = rows[i];
		var name,desc,value = "";
		var type = 12;
		var mode = 1;
		var tds = $(row).children('td');
		for(var k = 1; k < tds.length; k++){//k=0是checkbox不需要
			var td = tds[k];
			var input = td.firstChild;
			paramObj[strArr[k-1]] = input.value;
		}
		jsonranklist[jsonranklist.length] = paramObj;
	}
	var j = JSON.stringify(jsonranklist);
	return j;
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