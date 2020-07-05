var frameType = 0;

function init(){
	var baseHeight = parseInt(window.innerHeight) - 41;
	$('.side').css('background-color','gray').css('height',baseHeight+'px');
	var height = parseInt($('.side').css('width'))*1.2;
	$('.sideMenu').css('height',height+'px');
	$('.dbd-west').css('margin-left','0px');
	//toData($('.sideMenu')[0]);
	var mainMarginLeft = $('#topMain').css('margin-left');
	$('#topMain').css('margin-left','0px')
		.css('height',baseHeight+'px');
	$("#logopic").css("width",(parseInt($('.side').css("width"))+30)+"px")
	.css("background-color","rgb(80, 164, 237)");
	$($("#logopic").parents("div")[0]).css("padding-left","0px");
}

function toFolder(e){
	//if(frameType == 1) return;
	frameType = 1;
	toPageSign(e);
	$('#mf')[0].src = "./folder.jsp";
}

function toData(e){
	if(frameType == 2) return;
	frameType = 2;
	toPageSign(e);
	var parameters = "";
	parameters += "dataSource="+p_dataSource;
	parameters += "&view="+p_view;
	parameters += "&olap="+p_olap;
	parameters += "&ql="+p_ql;
	parameters += "&dfxFile="+p_dfxFile;
	parameters += "&dfxScript="+p_dfxScript;
	parameters += "&dfxParams="+p_dfxParams;
	parameters += "&inputFiles="+p_inputFiles;
	parameters += "&fixedTable="+p_fixedTable;
	parameters += "&dataFileType="+p_dataFileType;
	parameters += "&dct="+p_dct;
	parameters += "&vsb="+p_vsb;
	parameters += "&filter="+p_filter;
	parameters += "&macro="+p_macro;
	$('#mf')[0].src = "./data.jsp?"+parameters;
}

function toPreview(e){
	if(frameType == 3) return;
	frameType = 3;
	toPageSign(e);
}

function toPageSign(iconDiv){
	$('.icon').parent().removeClass('activeSideMenu');
	$(iconDiv).addClass('activeSideMenu');
}

