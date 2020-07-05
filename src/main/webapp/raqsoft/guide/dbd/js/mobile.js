try{
	var backurl = "./folder-mobile.jsp?currFolderId="+currFolderId+"&currLevel="+currLevel;
}catch(e){
	//报表中心浏览olap
}

function minit(){
	$('.main').css('height', window.innerHeight+"px");
	$('.main').css('width', window.innerWidth+"px");
	$('.body').css('height', window.innerHeight+"px");
	$('.body').css('width', window.innerWidth+"px");
	//$('.dtable').css('top','5px');
	try{//浏览
		divide = 10;//parseInt(layout.mainWidth);
	}catch(e){}
	
	$('.back').on('click',function(){
		if($('.back').css('opacity') == '1') {
			window.location = backurl;
		}else{
			backButActivate();
		}
	});
}

function backButActivate(){
	$('.back').css('opacity','1.0');
	setTimeout(function(){
		$('.back').css('opacity','0.3');
		$('#mengban').hide();
	},1500);
	$('#mengban').css('width','100%').css('height','100%').show();
}

