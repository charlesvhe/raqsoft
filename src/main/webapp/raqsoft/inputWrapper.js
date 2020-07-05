//
$(document).ready(function(){
/*
	<img src='<%=cp %>/dl/img/dl/save-h.png' onclick='saveLocalDL()' id='saveLocalBut' type='button' title='保存到本机' style='border:0px;cursor:pointer;'>
	<a href="javascript:void(0);" title="打开本机qyx" id="openLocalBut" style="background-image:url(<%=cp %>/dl/img/dl/open-local.png);overflow:hidden;display:-moz-inline-box;display:inline-block;width:35px;height:26px;vertical-align:top;">
		<form id="openQyxForm" METHOD=POST ACTION="<%=request.getContextPath()%>/servlet/dataSphereServlet?action=10" ENCTYPE="multipart/form-data" target=hiddenFrame>
			<input id="localQyxFile" name="localQyxFile" onchange="openLocalDL();" type="file" style="margin-left:-160px;filter:alpha(opacity=0);opacity:0;cursor:pointer;" />
			<input type=hidden name=path id=upPath value="tmp">
		</form>
	</a>
	<img src='<%=cp %>/dl/img/dl/mode-edit.png' id="pageMode" onclick='switchMode()' title='编辑模式' style='border:0px;cursor:pointer;'>
	<img src='<%=cp %>/dl/img/dl/split.png' style='border:0px;'>

	out.println("<input type='button' id='inputButSave' value='保存'/>");
	if (this.excel.indexOf("o")>=0)  out.println("<input type='button' id='inputButExcelOut' value='保存到excle'/>");
	if (this.excel.indexOf("i")>=0)  out.println("<input type='button' id='inputButExcelIn' value='从excel导入数据'/>");
	out.println("<input type='button' id='inputButAddRow' value='添加行'/>");
	out.println("<input type='button' id='inputButInsertRow' value='插入行'/>");
	out.println("<input type='button' id='inputButDelRow' value='删除行'/>");
*/
	var bar = $("#toolbar");
	bar.append("<img src='"+contextPath+"/raqsoft/images/inputImg/save.png' id='inputButSave' title='保存' style='border:0px;cursor:pointer;'>");
	if (inputConfig.excelIO.indexOf("o")>=0) {
		bar.append("<img src='"+contextPath+"/raqsoft/images/inputImg/saveExcel.png' id='inputButExcelOut' title='保存到excle' style='border:0px;cursor:pointer;'>");
	}
	if (inputConfig.excelIO.indexOf("i")>=0) {
		bar.append("<img src='"+contextPath+"/raqsoft/images/inputImg/loadExcel.png' id='inputButExcelIn' title='从excel导入数据' style='border:0px;cursor:pointer;'>");
		var but = '<a href="javascript:void(0);" title="从excel导入数据" id="inputButExcelIn" style="background-image:url('+contextPath+'/raqsoft/images/inputImg/loadExcel.png);overflow:hidden;display:-moz-inline-box;display:inline-block;width:35px;height:26px;vertical-align:top;">'
			+'<form id="openQyxForm" METHOD=POST ACTION="'+contextPath+'/InputServlet?action=3" ENCTYPE="multipart/form-data" target=hiddenFrame>'
			+'<input id="localQyxFile" name="localQyxFile" onchange="loadExcelData();" type="file" style="margin-left:-160px;filter:alpha(opacity=0);opacity:0;cursor:pointer;" />'
			+'<input type=hidden name="sgid" value="'+sgid+'">'
			+'</form>'
			+'</a>'
	}
	bar.append("<img src='"+contextPath+"/raqsoft/images/inputImg/split.png' style='border:0px;'>");
	bar.append("<img src='"+contextPath+"/raqsoft/images/inputImg/addRow.png' id='inputButAddRow' title='添加行' style='border:0px;cursor:pointer;'>");
	bar.append("<img src='"+contextPath+"/raqsoft/images/inputImg/insertRow.png' id='inputButInsertRow' title='插入行' style='border:0px;cursor:pointer;'>");
	bar.append("<img src='"+contextPath+"/raqsoft/images/inputImg/deleteRow.png' id='inputButDelRow' title='删除行' style='border:0px;cursor:pointer;'>");
	
	bar.find('#inputButSave').click(function(){
		$.ajax({
			type: 'POST',
			async : false,
			url: contextPath + "/InputServlet?d="+new Date().getTime(),
			data: {action:1,sgid:sgid,data:_getInputDatas(sgid)},
			success: function(data){
				if (data.indexOf('error:')==0) {
					alert(data.substring(6));
					return;
				}
				alert("保存成功");
			}
		});
	});
	
	bar.find('#inputButExcelOut').click(function(){
		$('#downloadFile').remove();
		var form = $('<form id="downloadFile" method="post" accept-charset="UTF-8"></form>');
		form.attr('action',contextPath + "/InputServlet?d=" + new Date().getTime());
		form.attr('target', '_self');
		form.append('<input type="hidden" name="action" value="2">');
		form.append('<input type="hidden" name="sgid" value="'+sgid+'">');
		form.append('<input type="hidden" name="data" value="'+''+'">');
		form.append('<input type="hidden" name="is2007" value="'+1+'">');
		$('body').append(form);
		form[0].submit();
	});
	bar.find('#inputButAddRow').click(function(){
		_appendRow( sgid )
	});
	bar.find('#inputButInsertRow').click(function(){
		_insertRow( sgid )
	});
	bar.find('#inputButDelRow').click(function(){
		_deleteRow(sgid)
	});
	
});

function loadExcelData() {
	loadExcel = $('#localQyxFile').val();
	var idx = loadExcel.lastIndexOf('/');
	if (idx == -1) idx = loadExcel.lastIndexOf('\\');
	if (idx >= 0) loadExcel = openQyxName.substring(idx + 1);
	var f = loadExcel.toLowerCase();
	if (f.indexOf('.xls') == -1) {
		alert("请选择excel文件！");
		return;
	}
	//alert(f);
	$('#openQyxForm').submit();
}
