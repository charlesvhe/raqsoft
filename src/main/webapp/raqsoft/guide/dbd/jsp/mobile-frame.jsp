<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>手机DBD</title>
<script src="../js/jquery.min.js"></script>
<script src="../js/jquery.mobile-1.4.5.min.js"></script>
<link href="../css/jquery.mobile-1.4.5.min.css" rel="stylesheet"/>
</head>
<%
String cp = request.getContextPath();
%>
<body>
	<div data-role="page">
   <div data-role="header" style="font-size:50px;background-color: white!important;">
  	<div id="backButton" style="float:left;margin-top:20px"><svg t="1580786632882" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2087" data-spm-anchor-id="a313x.7781069.0.i1" width="100" height="100"><path d="M232.727273 0h558.545454a232.727273 232.727273 0 0 1 232.727273 232.727273v558.545454a232.727273 232.727273 0 0 1-232.727273 232.727273H232.727273a232.727273 232.727273 0 0 1-232.727273-232.727273V232.727273a232.727273 232.727273 0 0 1 232.727273-232.727273z m438.178909 711.819636L471.086545 512l199.819637-199.819636L605.090909 246.365091 339.456 512 605.090909 777.634909l65.815273-65.815273z" p-id="2088" fill="#1296db"></path></svg>
  	</div>
  	<div id="backButton2" style="float:left;margin-top:20px"><svg t="1580786632882" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2087" data-spm-anchor-id="a313x.7781069.0.i1" width="100" height="100"><path d="M232.727273 0h558.545454a232.727273 232.727273 0 0 1 232.727273 232.727273v558.545454a232.727273 232.727273 0 0 1-232.727273 232.727273H232.727273a232.727273 232.727273 0 0 1-232.727273-232.727273V232.727273a232.727273 232.727273 0 0 1 232.727273-232.727273z m438.178909 711.819636L471.086545 512l199.819637-199.819636L605.090909 246.365091 339.456 512 605.090909 777.634909l65.815273-65.815273z" p-id="2088" fill="#1296db"></path></svg>
  	</div>
    <h1>Dashboard</h1>
  </div>

  <div data-role="main" class="ui-content">
  	<iframe src="./folder-mobile.jsp" style="height:100%;width:100%;border:none 0px"></iframe>
  </div>
	<!-- <div data-role="navbar">
		<ul>
		<li><a href="javascript:goback();" style="font-size:50px">后退</a></li>
		</ul>
	</div> -->
</div>
<script>
	var frameHeight = window.innerHeight;
	frameHeight = parseInt(frameHeight) - parseInt($('div[data-role=header]').css('height'));
	var frame = $('iframe');
	frame.css('height',frameHeight+'px');
	$('#backButton').click(function(){
		frame[0].contentWindow.goback();
		if(frame[0].contentWindow.currFolderId == 0 ){
			$('#backButton').hide();
		}else{
			$('#backButton').show();
		}
	});
	$('#backButton2').click(function(){
		frame[0].src = './folder-mobile.jsp';
		$('#backButton2').hide();
	});
	$('#backButton').hide();
	$('#backButton2').hide();
</script>
</body>
</html>