<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 <%@ page import="com.raqsoft.center.*" %>
 <%@ page isELIgnored="false" %>
<!DOCTYPE html>
<%
	String appmap = request.getContextPath();
	String loginType = (String)(request.getSession().getAttribute("loginType"));
%>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<link href="../css/mui.min.css" rel="stylesheet" />
		<link href="../css/style.css" rel="stylesheet" />
		<link rel="stylesheet" href="../../font-awesome-4.7.0/css/font-awesome.min.css">
		<script src="../js/mui.min.js"></script>
		<script src="../js/mui.enterfocus.js"></script>
		<script src="../js/app.js"></script>
		<script src="<%=appmap %>/js/jquery.js"></script>
		<style>
			html,
			body {
				background-color: #efeff4;
			}
		</style>
		<script>
			mui.init();
			var device = navigator.userAgent;
			var isMobile = device.indexOf('Mobile') >= 0;
			if(!isMobile){
				window.location = "<%=appmap%>/raqsoft/center/centerIndex.jsp"
			}
			$(function(){
				var loginType = '<%=loginType%>';
				$(".user").hide();
				$(".visitor").hide();
				$(".manager").hide();
				$(".supermanager").hide();
				$(".normalmanager").hide();
				if("user" == loginType){
					$('.user').show();
				}
				if("normalManager" == loginType || "supermanager" == loginType){		
					$('.manager').show();
				}
				if("normalManager" == loginType ){
					$(".normalmanager").show();
				}
				if("supermanager" == loginType ){
					$(".supermanager").show();
				}
				if("visitor" == loginType){
					$('.visitor').show();
				}
			});
		</script>
	</head>

	<body>

<header class="mui-bar mui-bar-nav">
    <a class="mui-icon mui-icon-close mui-pull-right" href="<%=appmap%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=5&isMobile=1"></a>
   	<h1 class="mui-title manager">报表中心--管理员</span>
    <h1 class="mui-title visitor">报表中心--访客</span>
    <h1 class="mui-title user">报表中心--用户</span>
</header>
<div class="mui-content">
    <div class="mui-card">
        <ul class="mui-table-view mui-grid-view mui-grid-9">showReportContent
            <li class="manager mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=tree.jsp?showReportContent=no">
                    <span><i class="fa fa-list-ol"></i></span>
                    <div class="mui-media-body">节点管理</div></a></li>
            <li class="user visitor mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=tree.jsp?showReportContent=yes">
                    <span><i class="fa fa-list-ol"></i></span>
                    <div class="mui-media-body">浏览</div></a></li>
            <li class="manager mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=<%=appmap%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=34%26isMobile=1">
                    <span><i class="fa fa-users"></i></span>
                    <div class="mui-media-body">机构管理</div></a></li>
            <li class="manager mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=<%=appmap%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=16%26isMobile=1">
                    <span><i class="fa fa-user"></i></span>
                    <div class="mui-media-body">用户管理</div></a></li>
            <li class="user manager mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=<%=appmap%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=24%26isMobile=1">
                    <span><i class="fa fa-table"></i></span>
                    <div class="mui-media-body">报表管理</div></a></li>
            <li class="manager mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=<%=appmap%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=39%26fileType=all%26isMobile=1">
                    <span><i class="fa fa-file-text-o"></i></span>
                    <div class="mui-media-body">查询分析文件</div></a></li>
            <li class="user mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=<%=appmap%>/raqsoft/center/mobile/jsp/mobileUserPersonal.jsp">
                    <span><i class="fa fa-user-circle"></i></span>
                    <div class="mui-media-body">用户个人信息</div></a></li>
            <li class="supermanager mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=<%=appmap%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=31%26isManager=yes">
                    <span><i class="fa fa-key"></i></span>
                    <div class="mui-media-body">密码管理</div></a></li>
            <li class="user normalmanager mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="./outfit.jsp?inner=<%=appmap%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=31%26isManager=yes">
                    <span><i class="fa fa-key"></i></span>
                    <div class="mui-media-body">个人密码管理</div></a></li>
        </ul> 
    </div>
    <p>
		当前用户:<span class="manager">&nbsp;管理员:&nbsp;</span>
      <span class="visitor">&nbsp;访客:&nbsp;</span>
     <span class="visitor user manager">&nbsp;${userObj.userName}</span>
     <%-- <br class="user visitor"/>
     <span class="visitor user">所属部门：</span>
     <span class="visitor user">&nbsp;</span> --%>
     </p>
</div>
</body>
</html>