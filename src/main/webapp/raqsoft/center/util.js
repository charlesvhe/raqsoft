var url = "";

//判断一个字符串是否为空或null，或者只包含空格
function isEmpty( str ) {
	if ( str == null ) return true;
	if ( trim( str ) == "" ) return true;
	return false;
}

//删除一个字符串首尾的空格
function trim( strInput ) {
	var iLoop = 0;
	var iLoop2 = -1;
	var strChr;
	
	if( ( strInput == null) || ( strInput == "" ) )	return "";
	if( strInput )	{
		for( iLoop = 0; iLoop < strInput.length; iLoop++ ) {
			strChr = strInput.charAt( iLoop );
			if( strChr != ' ' )
			break;
		}
		for( iLoop2 = strInput.length - 1; iLoop2 >= 0; iLoop2-- ) {
			strChr = strInput.charAt( iLoop2 );
			if( strChr != ' ' )
			break;
		}
	}
	
	if( iLoop <= iLoop2 )	{
		return strInput.substring( iLoop, iLoop2 + 1 );
	}
	else return "";
}

//为一个下拉列表框在末尾添加一个新选项
//svalue 选项的值  sdisp 选项的显示文字
function addSelectItem( selectObj, svalue, sdisp ) {
	var newItem = new Option( sdisp, svalue, false, false );
	var index = selectObj.length;
	selectObj.options[ index ] = newItem;
}

//获得SELECT元素中所有选中项目的value值，以逗号分隔
function getSelectedValues( selectObj ) {
	if( selectObj.tagName != "SELECT" ) return "";
	var s = "";
	for( var i = 0; i < selectObj.length; i++ ) {
		var obj = selectObj.item( i );
		if( obj.selected ) s += "," + obj.value;
	}
	if( s.length > 0 ) s = s.substring( 1 );
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

function popLayuiLayer(title,contentHtml,hasOkBtn,okFunc,removeCancelBtn,width){
	var index = -1;
	if(width == null) width = '400px';
	var params = {
		type:1,
		title:title,
		content:contentHtml,
		offset: '100px',
		closeBtn:1,
		area:[width],
		close:function(){
			window.layui.layer.close(index);
		}
	};
	if(hasOkBtn && !removeCancelBtn){
		params.btn = ['确定','取消'];
		params.yes = okFunc;
	}else if(!removeCancelBtn){
		params.btn = "取消";
	}else if(hasOkBtn){
		params.btn = '确定';
	}
	
	index = window.layui.layer.open(params);
	return index;
}

function popScheSettingLayer(title,url,area,btnName){
	var index = -1;
	var localarea  = (area == null ? ["1000px"] : area);
	var params = {
		type:2,
		title:title,
		content:url,
		offset: '100px',
		area:localarea,
		close:function(){
			window.layui.layer.close(index);
		}
	};
	if(btnName){
		params.btn = [btnName,'取消'];
		params.yes = function(){sche_param_form_submit();};
	}else{
		params.btn = "取消";
	}
	
	index = window.layui.layer.open(params);
	return index;
}
