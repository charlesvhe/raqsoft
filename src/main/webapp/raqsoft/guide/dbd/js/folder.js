var serverFolder = 'WEB-INF/files/dbd';
var folderInfo = {
	currFolderId : '0',
	currFolderName : ''
}
Array.prototype.deleteIndex = function(index){
	return this.slice(0, index).concat(this.slice(parseInt(index, 10) + 1));
};

var back = new Array();
var currFolderId = '';


function goback(){
	if(back.length == 0) return;
	var lastBackInfo = back[back.length - 1];
	showFolder(folderInfo.data, lastBackInfo.currLevel, lastBackInfo.toFolderId, true);
	choosedFile = null;
	$('#cutBut').css('cursor','no-drop');
}


