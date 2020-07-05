var appRoot,labelColor, mouseOverColor, selectedColor, selectedBackColor;
var currHref, currNodeId,currNodeType,jsondata;
//document.onmousemove = tree_unselectText;

function tree_unselectText() {
	document.selection.empty();
}

function tree_setEnv( app, lc, moc, sc, sbc ) {
	appRoot = app;
	labelColor = lc;
	mouseOverColor = moc;
	selectedColor = sc;
	selectedBackColor = sbc;
}

function tree_addSubNode() {
	if( currNodeId == null ) {
		alert( "请选择节点!" );
		return;
	}
	if( currNodeType == "1" ) {
		alert( "no！" );
		return;
	}
	if( currNodeType == "2" ) {
		alert( "no！" );
		return;
	}
	tapNode("mobileAddSubNode.jsp?action=1&id=" + currNodeId);
}

function tree_insertNode() {
	if( currNodeId == null ) {
		alert( "请选择节点!" );
		return;
	}
	tapNode("mobileAddSubNode.jsp?action=2&id=" + currNodeId);
}

function tree_moveNode( updown ) {
	if( currNodeId == null ) {
		alert( "请选择节点!" );
		return;
	}
	$.ajax({
		type:"post",
		url:appRoot + "/reportCenterServlet?action=9&id="+currNodeId+"&flag="+updown,
		data:{},
		success:function(strRet){
		},
		error:function(){
			alert( "error:\n" + strRet );
		}
	});
}

function tree_deleteNode() {
	if( currNodeId == null ) {
		alert( "请选择节点!" );
		return;
	}
	if( currNodeId == "0" ) return;
	if( !window.confirm( "确认删除" ) ) return;
	$.ajax({
		type:"post",
		url:appRoot + "/reportCenterServlet?action=8&id="+currNodeId,
		data:{},
		success:function(strRet){
			refreshTree();
		},
		error:function(){
			alert( "error:\n" + strRet );
		}
	});
}

function tree_getNodeExpanded() {
	return tree_getDivExpanded( document.body );
}

function tree_getDivExpanded( pobj ) {
	var s = "";
	for( var i = 0; i < pobj.childNodes.length; i++ ) {
		var obj = pobj.childNodes[i];
		if( obj.tagName == "DIV" ) {
			if( obj.id.indexOf( "_div_" ) == 0 ) {
				var status = "1";
				if( obj.style.display == "none" ) status = "0";
				if( s.length > 0 ) s += ",";
				s += obj.id.substring( 5 ) + "," + status;
			}
		}
		var rtn = tree_getDivExpanded( obj );
		if( rtn.length > 0 ) {
			if( s.length > 0 ) s += ",";
			s += rtn;
		}
	}
	return s;
}

function urlEncode( str )
{
	var dst = "";
	for ( var i = 0; i < str.length; i++ )
	{
		switch ( str.charAt( i ) )
		{
			case ' ':
				dst += "+";
				break;
			case '!':
				dst += "%21";
				break;
			case '\"':
				dst += "%22";
				break;
			case '#':
				dst += "%23";
				break;
			case '$':
				dst += "%24";
				break;
			case '%':
				dst += "%25";
				break;
			case '&':
				dst += "%26";
				break;
			case '\'':
				dst += "%27";
				break;
			case '(':
				dst += "%28";
				break;
			case ')':
				dst += "%29";
				break;
			case '+':
				dst += "%2B";
				break;
			case ',':
				dst += "%2C";
				break;
			case '/':
				dst += "%2F";
				break;
			case ':':
				dst += "%3A";
				break;
			case ';':
				dst += "%3B";
				break;
			case '<':
				dst += "%3C";
				break;
			case '=':
				dst += "%3D";
				break;
			case '>':
				dst += "%3E";
				break;
			case '?':
				dst += "%3F";
				break;
			case '@':
				dst += "%40";
				break;
			case '[':
				dst += "%5B";
				break;
			case '\\':
				dst += "%5C";
				break;
			case ']':
				dst += "%5D";
				break;
			case '^':
				dst += "%5E";
				break;
			case '`':
				dst += "%60";
				break;
			case '{':
				dst += "%7B";
				break;
			case '|':
				dst += "%7C";
				break;
			case '}':
				dst += "%7D";
				break;
			case '~':
				dst += "%7E";
				break;
			default:
				dst += str.charAt( i );
				break;
		}
	}
	return dst;
}

function tapNode(url){
	var url = "./outfitForm.jsp?inner="+encodeURIComponent(url)+"&submitFunction=submitNode";
	top.window.location = url;
}

function showToolButtons( type, _href, isRootNode){//按钮有效性
	$('button#add').prop("disabled",false);
	$('button#show').prop("disabled",false);
	$('button#ins').prop("disabled",false);
	$('button#up').prop("disabled",false);
	$('button#down').prop("disabled",false);
	$('button#del').prop("disabled",false);
	var buttons = $('button');
	for(var b = 0 ; b < buttons.length ; b++){
		if(!$(buttons[b]).prop("disabled")){
			if($(buttons[b]).attr("enterColor") == null){
				$(buttons[b]).attr("enterColor","black");
			}
			if($(buttons[b]).attr("leaveColor") == null){
				$(buttons[b]).attr("leaveColor","gray");
			}
			changeColor(buttons[b].id,$(buttons[b]).attr("enterColor"));
		}
	}
	if(isRootNode){
		$('button#ins').prop("disabled",true).children('.ic').css('color','#BBB');
		$('button#up').prop("disabled",true).children('.ic').css('color','#BBB');
		$('button#down').prop("disabled",true).children('.ic').css('color','#BBB');
		$('button#del').prop("disabled",true).children('.ic').css('color','#BBB');
		return;
	}
	if(type == "0"){
	}else{
		$('button#add').prop("disabled",true).children('.ic').css('color','#BBB');
	}
}

function changeColor(button, color){
	$('#'+button).children('.ic').css("color",color);
}

function report_nodeClick(){
	tapNode(currHref);
}



$(function(){
	var data2 = getTreeJson2();
	jsondata = data2;
	layui.use('tree', function(){
		  layui.tree({
			  elem: '#demo' //传入元素选择器
			 ,nodes: data2
			 ,click:function(clickevent){
				 if(showReportContent == "yes"){
					 return;
				 }
				 currHref = clickevent._href;
				 currNodeType = clickevent.type;
				 currNodeId = clickevent.id;
				 showToolButtons(currNodeType, currHref ,"tree" == currNodeType);
				 $('#menu').css('top','100px');
				 $('#menu').show();
	         	 $('#menu').removeClass('layui-anim-fadeout');
	         	 if($('#menu').prop('class').indexOf('layui-anim-fadein')>=0){
	         		$('#menu').removeClass('layui-anim-fadein');
	         		$('#menu').addClass('layui-anim-fadeout');
	         		return;
	         	 }
	         	 $('#menu').addClass('layui-anim-fadein');
			 }
		});
	});
});

function getPxDouble(attr){
	var s = attr.substring(0,attr.indexOf('px'));
	return Number(s);
}

function refreshTree(){
	top.window.location = "./outfit.jsp?inner=tree.jsp?showReportContent="+showReportContent;
}

