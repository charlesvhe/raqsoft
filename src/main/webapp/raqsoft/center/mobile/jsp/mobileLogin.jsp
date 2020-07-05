<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html>
<html class="ui-page-login">
<%
	String appmap = request.getContextPath();
%>
<c:if test="${userObj ne null }">
	<script type="text/javascript">window.location = "<%=appmap %><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/index.jsp"</script>
</c:if>
<script type="text/javascript">
var device = navigator.userAgent;
var isMobile = device.indexOf('Mobile') >= 0;
if(!isMobile){
	window.location = "<%=appmap%>/raqsoft/center/centerLogin.jsp"
}
</script>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
		<title></title>
		<link href="../css/mui.min.css" rel="stylesheet" />
		<link href="../css/style.css" rel="stylesheet" />
		<style>
			.area {
				margin: 20px auto 0px auto;
			}
			
			.mui-input-group {
				margin-top: 10px;
			}
			
			.mui-input-group:first-child {
				margin-top: 20px;
			}
			
			.mui-input-group label {
				width: 22%;
			}
			
			.mui-input-row label~input,
			.mui-input-row label~select,
			.mui-input-row label~textarea {
				width: 78%;
			}
			
			.mui-checkbox input[type=checkbox],
			.mui-radio input[type=radio] {
				top: 6px;
			}
			
			.mui-content-padded {
				margin-top: 25px;
			}
			
			.mui-btn {
				padding: 10px;
				background-color:#ffe000;
				border-color:#ffe000;
			}
			
			.link-area {
				display: block;
				margin-top: 25px;
				text-align: center;
			}
			
			.spliter {
				color: #bbb;
				padding: 0px 8px;
			}
			
			.oauth-area {
				position: absolute;
				bottom: 20px;
				left: 0px;
				text-align: center;
				width: 100%;
				padding: 0px;
				margin: 0px;
			}
			
			.oauth-area .oauth-btn {
				display: inline-block;
				width: 50px;
				height: 50px;
				background-size: 30px 30px;
				background-position: center center;
				background-repeat: no-repeat;
				margin: 0px 20px;
				/*-webkit-filter: grayscale(100%); */
				border: solid 1px #ddd;
				border-radius: 25px;
			}
			
			.oauth-area .oauth-btn:active {
				border: solid 1px #aaa;
			}
			
			.oauth-area .oauth-btn.disabled {
				background-color: #ddd;
			}
		</style>

	</head>

	<body>
		<header class="mui-bar mui-bar-nav">
			<h1 class="mui-title">报表中心登录</h1>
		</header>
		<div class="mui-content">
			<form id='login-form' class="mui-input-group">
				<div class="mui-input-row">
					<label>用户</label>
					<input id='userName' type="text" class="mui-input-clear mui-input" placeholder="请输入账号">
				</div>
				<div class="mui-input-row">
					<label>密码</label>
					<input id='password' type="password" class="mui-input-clear mui-input" placeholder="请输入密码">
				</div>
				<input type="hidden" id="loginType" value="0">
			</form>
			<div class="mui-content-padded">
				<button id='login' class="mui-btn mui-btn-block mui-btn-primary">登录</button>
				<!-- <img id='weixin' src="../../images/wechat.png"/> -->
				<!-- <div class="link-area"><a id='reg'>注册账号</a> <span class="spliter">|</span> <a id='forgetPassword'>忘记密码</a>
				</div> -->
			</div>
			<div class="mui-content-padded oauth-area">

			</div>
		</div>
		<script src="../js/mui.min.js"></script>
		<script src="../js/mui.enterfocus.js"></script>
		<script src="../js/app.js"></script>
		<script src="<%=appmap %>/raqsoft/easyui/jquery.min.js"></script>
		<script>
			(function($, doc) {
				$.init({
					statusBarBackground: '#f7f7f7'
				});
				var loginButton = doc.getElementById('login');
				var userBox = doc.getElementById('userName');
				var passwordBox = doc.getElementById('password');
				var loginType = doc.getElementById("loginType");
				var regButton = doc.getElementById('reg');
				var forgetButton = doc.getElementById('forgetPassword');
				loginButton.addEventListener('tap', function(event) {
					var loginInfo = {
						"userName": userBox.value,
						"p": passwordBox.value,
						"isManager": loginType.value
					};
					app.login(loginInfo, function(err) {
						if (err) {
							if(err == 'manager' || err == 'user'){
								window.location='<%=appmap%>/raqsoft/center/mobile/jsp/index.jsp';
							}else{
								alert(err);
							}
						}
					});
				});
				window.addEventListener('resize', function() {
					oauthArea.style.display = document.body.clientHeight > 400 ? 'block' : 'none';
				}, false);
				var backButtonPress = 0;
				doc.getElementById('weixin').addEventListener('tap', function(event) {
					window.location = 'https://open.weixin.qq.com/sns/explorer_broker?appid=wx0787f93501204fe5&redirect_uri=https%3A%2F%2Fxw.qq.com%2Fservice%2Fweixin%2Foauth%3Fsurl%3Dhttps%3A%2F%2Fxw.qq.com%2Fm%2Fgold%2Fassignment&response_type=code&scope=snsapi_userinfo&state=&connect_redirect=1#wechat_redirect';
				});
				
			}(mui, document));
			
			function ajaxlogin(loginInfo, callback){
				$.ajax({
					data:loginInfo,
					type:"post",
					async:false,
					url:"<%=appmap%>/reportCenterServlet?action=3",
					success:function(data){
						if(data.indexOf('manager')>=0 || data.indexOf('success')>=0){
							callback('manager');
						}else {
							callback(data);
						}
					}
				});
			}
		</script>
	</body>

</html>