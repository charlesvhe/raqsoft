<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>目录</title>
<script src="../js/code.jquery.com.jquery.js"></script>
<script src="../../../../js/bootstrap.min.js"></script>
<link href="../css/folder.css" rel="stylesheet"/>
<link href="../css/DBD.css" rel="stylesheet"/>
<link href="../css/bootstrap/bootstrap.css" rel="stylesheet" media="screen">
<link href="../css/bootstrap/bootstrap-responsive.css" rel="stylesheet" media="screen">
</head>
<%
String cp = request.getContextPath();
String currFolderId = request.getParameter( "currFolderId" );
if(currFolderId == null) currFolderId = "0";
String currLevel = request.getParameter( "currLevel" );
if(currLevel == null) currLevel = "level1";
else{
	currLevel = "level"+currLevel;
}
%>
<body>
<div class="container-fluid" style="background-color:#efefef">
	<nav class="navbar navbar-default" role="navigation">
			<ul class="nav navbar-nav">
				<li><a id='backbut' class="navFont-default" href="javascript:goback();">返回
				<svg t="1579754746243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13997" id="mx_n_1579754746244" width="15" height="15"><path d="M425.856 886.263467a29.499733 29.499733 0 0 1-19.669333-7.466667L18.4832 534.135467a29.636267 29.636267 0 0 1 0-44.305067L406.186667 145.186133a29.5936 29.5936 0 0 1 31.761066-4.855466 29.636267 29.636267 0 0 1 17.527467 27.016533v215.415467a29.602133 29.602133 0 0 1-29.610667 29.6192 29.610667 29.610667 0 0 1-29.6192-29.6192V233.284267L82.7136 511.982933 396.245333 790.698667V641.237333a29.610667 29.610667 0 0 1 29.6192-29.6192 29.602133 29.602133 0 0 1 29.610667 29.6192v215.415467a29.6448 29.6448 0 0 1-29.6192 29.610667z" fill="#1296db" p-id="13998"></path><path d="M985.856 886.263467a29.627733 29.627733 0 0 1-27.477333-18.628267c-0.759467-1.672533-88.507733-196.795733-532.522667-196.795733-16.366933 0-29.6192-13.252267-29.6192-29.6192s13.243733-29.6192 29.6192-29.6192c295.185067 0 446.788267 82.0224 521.361067 149.0176-68.317867-343.287467-501.461333-348.2112-521.4208-348.2624a29.6192 29.6192 0 0 1 0.059733-59.2384c5.896533 0 589.610667 5.7856 589.610667 503.509333a29.678933 29.678933 0 0 1-29.610667 29.636267z" fill="#1296db" p-id="13999"></path></svg>
				</a>
				</li>
				<li><a class="navFont-default" href="javascript:deleteFile();">删除
				<img src="../img/guide/13.png">
				</a>
				</li>
				<li><a id="cutBut" class="navFont-default" href="javascript:copyFile();">剪切文件
				<svg t="1581668573624" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2071" width="15" height="15"><path d="M494.3872 614.4l-67.05152 66.1504a61.44 61.44 0 0 0-18.10432 48.76288c0.24576 2.9696 0.36864 5.61152 0.36864 7.96672a143.36 143.36 0 1 1-143.36-143.36 102.4 102.4 0 0 1 9.48224 0.512 61.44 61.44 0 0 0 48.92672-17.42848L390.5536 512l-65.90464-65.00352a61.44 61.44 0 0 0-48.92672-17.408A102.4 102.4 0 0 1 266.24 430.08a143.36 143.36 0 1 1 143.36-143.36c0 2.3552-0.12288 4.99712-0.36864 7.96672a61.44 61.44 0 0 0 18.10432 48.78336l467.70176 461.25056a20.2752 20.2752 0 0 1 0 28.95872c-3.8912 3.85024-9.17504 6.00064-14.68416 6.00064h-123.12576a83.6608 83.6608 0 0 1-58.73664-24.00256L494.3872 614.4zM266.24 348.16a61.44 61.44 0 1 0 0-122.88 61.44 61.44 0 0 0 0 122.88z m0 327.68a61.44 61.44 0 1 0 0 122.88 61.44 61.44 0 0 0 0-122.88z m266.24-303.3088l169.984-165.13024A82.8416 82.8416 0 0 1 760.0128 184.32h120.7296c5.38624 0 10.56768 2.06848 14.39744 5.77536a19.2512 19.2512 0 0 1 0 27.8528L634.2656 471.04 532.48 372.5312z" p-id="2072" fill="#13227a"></path></svg>
				</a>
				</li>
				<li><a class="navFont-default" href="javascript:pasteFile();">粘贴文件
				<svg t="1581668662584" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3353" width="15" height="15"><path d="M469.12 80.64h128a32 32 0 0 0 32-32 32 32 0 0 0-32-32h-128a32 32 0 0 0-32 32 32 32 0 0 0 32 32zM276.48 174.08a32 32 0 0 0 32-32v-29.44a32 32 0 0 1 31.36-32 32 32 0 0 0 32-32 33.28 33.28 0 0 0-32.64-32 96.64 96.64 0 0 0-94.72 96v29.44a32 32 0 0 0 32 32zM727.68 80.64h128a32 32 0 0 0 32-32 32 32 0 0 0-32-32h-128a32 32 0 0 0-32 32 32 32 0 0 0 32 32zM976 571.52a32 32 0 0 0-32 32v128a32.64 32.64 0 0 0 32 32 32 32 0 0 0 32-32v-128a32 32 0 0 0-32-32zM912 794.88h-128a32.64 32.64 0 0 0-32 32 32 32 0 0 0 32 32h128a31.36 31.36 0 0 0 31.36-32 33.28 33.28 0 0 0-31.36-32zM1000.32 74.24A32 32 0 0 0 960 57.6a32.64 32.64 0 0 0-16.64 42.24 28.8 28.8 0 0 1 0 12.8v103.04a32.64 32.64 0 0 0 32 32 32 32 0 0 0 32-32V112.64a97.92 97.92 0 0 0-7.04-38.4zM976 312.96a32 32 0 0 0-32 32v128a32.64 32.64 0 0 0 32 32 32 32 0 0 0 32-32v-128a32 32 0 0 0-32-32z" fill="#323333" p-id="3354"></path><path d="M683.52 1006.08H112a96 96 0 0 1-96-96V259.84a96 96 0 0 1 96-96h571.52a96 96 0 0 1 96 96v650.24a96 96 0 0 1-96 96zM112 227.84a32 32 0 0 0-32 32v650.24a32 32 0 0 0 32 32h571.52a32 32 0 0 0 32-32V259.84a32 32 0 0 0-32-32z" fill="#323333" p-id="3355"></path><path d="M604.16 423.68H192a32 32 0 0 1-32-32 32 32 0 0 1 32-32h412.16a32 32 0 0 1 32 32 32.64 32.64 0 0 1-32 32zM604.16 616.96H192a32 32 0 0 1 0-64h412.16a32 32 0 0 1 0 64zM604.16 810.24H192a32 32 0 0 1-32-32 32 32 0 0 1 32-32h412.16a32.64 32.64 0 0 1 32 32 32 32 0 0 1-32 32z" fill="#323333" p-id="3356"></path></svg>
				</a>
				</li>
			</ul>
	</nav>
</div>
<div class="container-fluid" style="height:500px;margin:10px">
 <div class="row-fluid" id="folderMain">
  </div>
</div>
<script src="../js/folder.js" type="text/javascript">
</script>
<script src="../js/folder-pc.js" type="text/javascript">
</script>
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
				$('.folder,.file').click(chooseDiv);
			}
		});
		$('#backbut').css('cursor','no-drop');
		$('#cutBut').css('cursor','no-drop');
	}
	init();
</script>
</body>
</html>