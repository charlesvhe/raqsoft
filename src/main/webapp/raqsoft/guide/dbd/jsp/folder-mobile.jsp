<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>手机DBD</title>
<script src="../js/jquery.min.js"></script>
<script src="../js/jquery.mobile-1.4.5.min.js"></script>
<script src="../js/folder.js"></script>
<script src="../js/folder-mobile.js"></script>
<link href="../css/jquery.mobile-1.4.5.min.css" rel="stylesheet"/>
<link href="../css/folder-mobile.css" rel="stylesheet"/>
</head>
<%
String cp = request.getContextPath();
String currFolderId = request.getParameter("currFolderId");
if(currFolderId == null) currFolderId = "0";
String currLevel = request.getParameter("currLevel");
if(currLevel == null) currLevel = "level1";
else{
	currLevel = "level"+currLevel;
}
%>
<body>
	<div data-role="page">

  <div data-role="header" style="font-size:50px;background-color: white!important;">
  	<div id="backButton" style="float:left;margin-top:20px"><svg onclick="javascript:goback();" t="1586586302591" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1148" width="80" height="80"><path d="M769.405 977.483c-27.074 27.568-71.045 27.568-98.121 0l-416.591-423.804c-27.173-27.568-27.173-72.231 0-99.899l416.492-423.804c13.537-13.734 31.324-20.652 49.109-20.652s35.572 6.917 49.109 20.652c27.173 27.568 27.173 72.331 0 99.899l-367.482 373.806 367.482 373.904c27.074 27.568 27.074 72.231 0 99.899z" p-id="1149"></path></svg>
  	</div>
    <h1>Dashboard浏览</h1>
  </div>

  <div data-role="main" class="ui-content">
  	<ul data-role="listview" data-inset="true" id="folderMain">
    </ul>
  </div>
	<!-- <div data-role="navbar">
		<ul>
		<li><a href="javascript:goback();" style="font-size:50px">后退</a></li>
		</ul>
	</div> -->
</div>
</body>
<script>
	var cp = "<%=cp%>";
	var currFolderId = "<%=currFolderId%>";
	var currLevel = "<%=currLevel%>"
	function init(){
		$.ajax({
			url:"<%=cp%>/servlet/dataSphereServlet?action=39",
			type:"post",
			dataType:"json",
			data:{},
			success:function(data){
				showFolder(data,currLevel,currFolderId);
				folderInfo.data = data;
			}
		});
	}
	init();
</script>
</html>