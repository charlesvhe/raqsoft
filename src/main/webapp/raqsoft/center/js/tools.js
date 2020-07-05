/**
 * 
 */
var ua = navigator.userAgent;

function tool_closeFrameLayer(frame,saveItemId){
	var index = $("#"+saveItemId).val();
	var frameWin = top.document.getElementById(frame).contentWindow;
	frameWin.layer.close(index);
}

function tool_cancelLayerFrameJump(frameId,url){
	if(ua.toLowerCase().indexOf("mobile") >= 0){
		
	}
	window.location = url;
}

function tool_bindCharCheck(elm, b){
	var bans = b == null ? ['<','>',';'] : b;
	var ta = "以下字符被禁止:";
	for(var i = 0; i < bans.length; i++){
		ta += bans[i] + " ";
	}
	var t = $(elm).attr("title");
	$(elm).attr("title", (t == null ? "" : (t +",") )+ta);
	var l = $(elm).length;
	$(elm).bind('keyup',function(e){
		var v = e.target.value;
		for(var j = 0; j < bans.length; j++){
			if(v.indexOf(bans[j]) >= 0){
				removeCharForElm(e.target, v, bans[j]);
			}
		}
	});
}

function removeCharForElm(elm, v, b){
	v = v.replace(eval("/"+b+"/"),"");
	$(elm).val(v);
}