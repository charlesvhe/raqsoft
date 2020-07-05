function initAddEditorButtons(){
	var ebs = $('.addEditorButton');
	for(var i = 0; i < ebs.length; i++){
		var ebi = ebs[i];
		$(ebi).click(showForm);
	}
}

function addEditorToCurrDiv(e){
	var form = $('#currGenEditorForm')[0];
	var type = form.type.value;
	var pname = form.pname.value;
	checkHasEditor(currDiv);
	createEditor(type,pname,$(currDiv).find('.singleArea'));
	$('#currGenEditorForm').html('');
}

var showForm = function showCreateEditorForm(e){
	$('#currGenEditorForm').remove();//temp
	var type = $(e.target).attr('type');
	var fo = $('<form id="currGenEditorForm"></form>');
	fo.append('关联共享参数：');
	var s = $('<select style="width:100px" name="pname" id="sysparamsSelector"></select>');
	fo.append(s);
	createSysParamsSelector(s);
	var options = types[type];
	options.showForm(fo,type);
	$('#dbd-west-editor').append(fo);
}

function createEditor(type,pname,parent){
	if(!pname || pname == "") return '';
	if(parent.find('.editor_o').length > 0){
		if(!confirm("会清除已有的控件")) return;
	}
	parent.find('.editor_o').remove();
	var options = types[type];
	var v = sysparams.getValueFromSysParams(pname);
	var div = $('<div class="editor_o dontchoose"></div>');
	var fo = $('<form class="editor_o '+pname+'"></form>');
	appendEditor(options,pname,fo,v);
	div.append(fo);
	parent.append(div);
	//var input2 = $('<input class="easyui-slider" value="12" style="width:200px" data-options="showTip:true,rule:[0,\'|\',25,\'|\',50,\'|\',75,\'|\',100]">');
	//fo.append(input2);
	$(function(){
		easyuiapi.parser.parse(fo);
	});
	preventPropagation(parent,'.editor_o','click');
}

function createSysParamsSelector(s){
	if(!aly.sysparams) {
		s.append('<option value="">无共享参数</option>');
		return;
	}
	for (var i=0; i<aly.sysparams.length; i++) {
		var pname = aly.sysparams[i].name;
		var opt = $('<option value="'+pname+'">'+pname+'</option>');
		s.append(opt);
	}
}

function appendEditor(options,pname,parent,v){
	var data = options.prepareData();
	options.append(parent,pname,v,data);
}

function checkHasEditor(c){
	$(currDiv).find('.singleArea')
}


function isEditor(div){
	return $(div).find('.singleArea').attr('type') == "1";
}

var types = {
	"input":{
		clazz:'easyui-textbox',
		append:function(parent,pname,v,data){
			var table = $('<table></table>');
			parent.append(table);
			var tr1 = $('<tr></tr>');
			var tr2 = $('<tr></tr>');
			table.append(tr1).append(tr2);
			tr1.append('<td>'+pname+'</td><td></td>');
			tr2.append('<td></td><td></td>');
			var input1 = $('<input name="val" type="text" value="'+v+'"/>');
			$(tr2.find('td')[0]).append(input1);
			var btn1 = $('<input type="button" class=".btn" value="go"/>');
			$(tr2.find('td')[1]).append(btn1);
		},
		prepareData:function(){
			return null;
		},
		showForm:function(parent,type){
			parent.append('<input type="hidden" name="type" value="'+type+'"/>');
			parent.append('<input type="button" onclick="addEditorToCurrDiv(this);" value="确认"/>');
		}
	}
}

