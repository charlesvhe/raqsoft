<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%
	String cp = request.getContextPath();
	String title = request.getParameter("title");
	if (title == null) title = "Raqsoft DBD";
	String guideDir = cp + "/raqsoft/guide/";//request.getParameter("guideDir");
	String v = ""+System.currentTimeMillis();
	
	request.setCharacterEncoding("UTF-8");
	response.setContentType("text/html;charset=utf8");
	String view = request.getParameter( "view" );
	if (view == null) view = "source";
	String olap = request.getParameter( "olap" );
	if (olap == null) olap = "";
	boolean isOpenDOlap = false;
	if(olap.length()>0) isOpenDOlap = true;
	String dataSource = request.getParameter( "dataSource" );
	if (dataSource == null) dataSource = "";
	String ql = request.getParameter( "ql" );
	if (ql == null) ql = "";
	String dfxFile = request.getParameter( "dfxFile" );
	if (dfxFile == null) dfxFile = "";
	String dfxScript = request.getParameter( "dfxScript" );
	if (dfxScript == null) dfxScript = "";
	String dfxParams = request.getParameter( "dfxParams" );
	if (dfxParams == null) dfxParams = "";
	String inputFiles = request.getParameter( "inputFiles" );
	if (inputFiles == null) inputFiles = "";
	String fixedTable = request.getParameter( "fixedTable" );
	if (fixedTable == null) fixedTable = "";
	String dataFileType = request.getParameter("dataFileType");
	if(dataFileType==null) dataFileType = "text";
	String dct = request.getParameter("dct");
	if(dct==null) dct="";
	
	dct = dct.replaceAll("\\\\", "/");
	String vsb = request.getParameter("vsb");
	if(vsb==null) vsb = "";
	vsb = vsb.replaceAll("\\\\", "/");
	String filter = request.getParameter( "filter" );
	if (filter == null) filter = "default";
	String sqlId = request.getParameter( "sqlId" );
	if (sqlId == null) sqlId = "";
	String macro = request.getParameter( "macro" );
	if (macro == null) macro = "";
	macro = macro.replaceAll("\\\\", "/");
	String dataFolderOnServer = "/WEB-INF/files/data/";
	String resultRpxPrefixOnServer = "/WEB-INF/files/resultRpx/";
	if (dataSource.length() == 0) {
	//olap = "WEB-INF/files/olap/客户情况.olap";
		dataSource="DataLogic";
	//fixedTable="ALL";
	}
%>
<script>
	var p_view = "<%=view%>";
	var p_olap = "<%=olap%>";
	var p_dataSource = "<%=dataSource%>";
	var p_ql = "<%=ql%>";
	var p_dfxFile = "<%=dfxFile%>";
	var p_dfxScript = "<%=dfxScript%>";
	var p_dfxParams = "<%=dfxParams%>";
	var p_inputFiles = "<%=inputFiles%>";
	var p_fixedTable = "<%=fixedTable%>";
	var p_dataFileType = "<%=dataFileType%>";
	var p_dct = "<%=dct%>";
	var p_vsb = "<%=vsb%>";
	var p_filter = "<%=filter%>";
	var p_sqlId = "<%=sqlId%>";
	var p_macro = "<%=macro%>";
</script>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>dashboard</title>
<!-- <script src="../js/code.jquery.com.jquery.js"></script> -->
<script src="../../js/j_query_yi_jiu_yi.js"></script>
<script src="../js/index.js"></script>
<script src="../../../../js/bootstrap.min.js"></script>
<link href="../css/DBD.css" rel="stylesheet"/>
<link href="../css/index.css" rel="stylesheet"/>
<link href="../css/bootstrap/bootstrap.css" rel="stylesheet" media="screen">
<link href="../css/bootstrap/bootstrap-responsive.css" rel="stylesheet" media="screen">
</head>
<body>
<div class="container-fluid" style="background-color:rgb(26, 113, 189)">
	<nav class="navbar navbar-default" role="navigation">
			<ul class="nav navbar-nav">
				<li><a id="logopic">Dashboard</a></li>
			</ul>
	</nav>
</div>
<div class="dbd-west">
    <div class="side">
    <ul class="nav nav-pills nav-stacked">
	  <li class="active">
		<div class="sideMenu" onclick="javascript:toFolder(this);">
			<svg t="1579747480282" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12280" width="32" height="32"><path d="M923.26 901.592H101.003c-8.49 0-15.71-6.235-16.93-14.64L9.448 376.806a17.157 17.157 0 0 1 3.978-13.671 17.146 17.146 0 0 1 12.953-5.916H997.9c4.964 0 9.693 2.155 12.953 5.916a17.157 17.157 0 0 1 3.977 13.67l-74.64 510.145c-1.22 8.406-8.44 14.64-16.93 14.64z m-807.466-34.228H908.47l69.626-475.917H46.185l69.609 475.917z m791.522-547.681c-9.46 0-17.114-7.655-17.114-17.115v-31.571c0-8.707-7.487-15.778-16.696-15.778H316.851a17.09 17.09 0 0 1-16.112-11.365c-14.473-40.529-32.974-79.603-41.849-88.778H153.9c-9.21 0-16.713 7.069-16.713 15.76v131.73c0 9.46-7.655 17.115-17.115 17.115-9.46 0-17.114-7.654-17.114-17.114V170.838c0-27.56 22.846-49.988 50.94-49.988h108.6c8.858 0 29.198 0 66.334 100.144h544.673c28.078 0 50.923 22.43 50.923 50.005v31.571c0.002 9.458-7.653 17.113-17.112 17.113z" fill="#ffffff" p-id="12281"></path><path d="M660.3 563.959H326.543c-9.46 0-17.115-7.655-17.115-17.115s7.655-17.114 17.115-17.114H660.3c9.46 0 17.115 7.654 17.115 17.114s-7.655 17.115-17.114 17.115z" fill="#ffffff" p-id="12282"></path></svg>
		</div>
	</li>
	  <li>
	  	<div class="sideMenu" onclick="javascript:toData(this);">
	  		<svg t="1579747364543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8456" width="32" height="32"><path d="M682.666667 420.977778m-28.444445 0a28.444444 28.444444 0 1 0 56.888889 0 28.444444 28.444444 0 1 0-56.888889 0Z" p-id="8457" fill="#ffffff"></path><path d="M682.666667 599.22963m-28.444445 0a28.444444 28.444444 0 1 0 56.888889 0 28.444444 28.444444 0 1 0-56.888889 0Z" p-id="8458" fill="#ffffff"></path><path d="M682.666667 770.844444m-28.444445 0a28.444444 28.444444 0 1 0 56.888889 0 28.444444 28.444444 0 1 0-56.888889 0Z" p-id="8459" fill="#ffffff"></path><path d="M511.905185 361.054815c-82.488889 0-160.426667-10.24-219.306666-28.918519-85.143704-26.927407-103.063704-62.577778-103.063704-87.703703s17.92-60.681481 103.063704-87.703704c58.88-18.583704 136.722963-28.918519 219.306666-28.918519s160.426667 10.24 219.306667 28.918519c85.143704 26.927407 103.063704 62.577778 103.063704 87.703704s-17.92 60.681481-103.063704 87.703703c-58.88 18.678519-136.817778 28.918519-219.306667 28.918519z m0-190.388148c-78.317037 0-151.608889 9.576296-206.411852 26.927407-50.346667 15.928889-73.291852 35.555556-73.291852 46.933333s22.945185 31.099259 73.291852 46.933334c54.802963 17.351111 128.18963 26.927407 206.411852 26.927407s151.608889-9.576296 206.411852-26.927407c50.346667-15.928889 73.291852-35.555556 73.291852-46.933334s-22.945185-31.099259-73.291852-46.933333C663.514074 180.242963 590.127407 170.666667 511.905185 170.666667zM511.905185 721.351111c-82.488889 0-160.426667-10.24-219.306666-28.918518-85.143704-26.927407-103.063704-62.577778-103.063704-87.703704h42.666666c0 11.472593 22.945185 31.099259 73.291852 46.933333 54.802963 17.351111 128.18963 26.927407 206.411852 26.927408s151.608889-9.576296 206.411852-26.927408c50.346667-15.928889 73.291852-35.555556 73.291852-46.933333h42.666667c0 25.125926-17.92 60.681481-103.063704 87.703704-58.88 18.678519-136.817778 28.918519-219.306667 28.918518zM511.905185 546.797037c-82.488889 0-160.426667-10.24-219.306666-28.918518-85.143704-26.927407-103.063704-62.577778-103.063704-87.703704h42.666666c0 11.472593 22.945185 31.099259 73.291852 46.933333 54.802963 17.351111 128.18963 26.927407 206.411852 26.927408 78.317037 0 151.608889-9.576296 206.411852-26.927408 50.346667-15.928889 73.291852-35.555556 73.291852-46.933333h42.666667c0 25.125926-17.92 60.681481-103.063704 87.703704-58.88 18.678519-136.817778 28.918519-219.306667 28.918518zM511.905185 896c-82.488889 0-160.426667-10.24-219.306666-28.918519-85.143704-26.927407-103.063704-62.577778-103.063704-87.703703h42.666666c0 11.472593 22.945185 31.099259 73.291852 46.933333C360.296296 843.757037 433.588148 853.333333 511.905185 853.333333s151.608889-9.576296 206.411852-26.927407c50.346667-15.928889 73.291852-35.555556 73.291852-46.933333h42.666667c0 25.125926-17.92 60.681481-103.063704 87.703703-58.88 18.583704-136.817778 28.823704-219.306667 28.823704z" p-id="8460" fill="#ffffff"></path><path d="M189.534815 244.527407h42.666666v534.945186h-42.666666z" p-id="8461" fill="#ffffff"></path><path d="M791.608889 244.527407h42.666667v534.945186h-42.666667z" p-id="8462" fill="#ffffff"></path></svg>
	  	</div>
	  </li>
	  <!-- <li>
	  	<div class="sideMenu" onclick="javascript:toPreview(this);">
	  		<svg t="1579747444713" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9266" width="32" height="32"><path d="M469.333333 170.666667v170.666666a42.666667 42.666667 0 0 1-42.666666 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h256a42.666667 42.666667 0 0 1 42.666666 42.666667z m-42.666666 298.666666H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v341.333333a42.666667 42.666667 0 0 0 42.666667 42.666667h256a42.666667 42.666667 0 0 0 42.666666-42.666667v-341.333333a42.666667 42.666667 0 0 0-42.666666-42.666667z m426.666666 170.666667h-256a42.666667 42.666667 0 0 0-42.666666 42.666667v170.666666a42.666667 42.666667 0 0 0 42.666666 42.666667h256a42.666667 42.666667 0 0 0 42.666667-42.666667v-170.666666a42.666667 42.666667 0 0 0-42.666667-42.666667z m0-512h-256a42.666667 42.666667 0 0 0-42.666666 42.666667v341.333333a42.666667 42.666667 0 0 0 42.666666 42.666667h256a42.666667 42.666667 0 0 0 42.666667-42.666667V170.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z" p-id="9267" fill="#ffffff"></path></svg>
	  	</div>
	  </li> -->
	</ul>
    </div>
  </div>
<div id='topMain'>
	<iframe id="mf" src="./folder.jsp" height="100%" width="100%" style="border:none"></iframe>
</div>
</body>
<script>
	init();
</script>
</html>