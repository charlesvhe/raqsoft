var viewMode = 1;

function setViewMode(m){
	if(viewMode == m) return;
	viewMode = m;
	if(m == 1){//pc
		$('.main').show();
		$('.main2').hide();
	}else{//mobile
		$('.main').hide();
		$('.main2').show();
		if($('#mframe').attr('src') == null || $('#mframe').attr('src').length == 0)
			$('#mframe').attr('src','./mobileView.jsp?olap='+encodeURIComponent(olapName));
	}
}

function toData(){
	window.location = "./data.jsp?olap="+encodeURIComponent(olapName);
}
