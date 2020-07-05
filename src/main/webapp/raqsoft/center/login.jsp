<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.center.Center"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>login</title>
<% 
	String appmap = request.getContextPath(); 
	Object o = request.getAttribute("passEncode");
	boolean pe = false;
	if(o != null){
		pe = (Boolean)o;
	}
	Object enableValidImg = request.getSession().getAttribute("enableValieImg");
%>
<c:if test="${userObj ne null }">
	<script type="text/javascript">window.location = "<%=appmap %><%=ReportConfig.raqsoftDir%>/center/centerIndex.jsp"</script>
</c:if>
<link rel="stylesheet" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script src="<%=appmap%>/js/jquery.js"></script>
<script src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/layui/layui.js"></script>
<script src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/layui/layui.js"></script>
<script src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/layui/md5.js"></script>
</head>
<script type="text/javascript">
	var enableValidImg = <%=enableValidImg %>;
	$(function(){
		if(enableValidImg){
			getVi();
			setTimeout(refreshCurrVimg,5000);
		}
	});

	var device = navigator.userAgent;
	var isMobile = device.indexOf('Mobile') >= 0;
	var currSessionImg ="";
	if(isMobile){
		window.location = "<%=appmap %><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/mobileLogin.jsp"
	}
	
	function vnChange(e){
		var v = e.value;
		if(v.length == 5){
			v = v.substr(0,4);
		}
		$("#validNum").val(v);
	}
	
	function getVi(){
		var vurl = "<%=appmap%>/reportCenterServlet";
		$('#vimg').html("loading...");
		$.ajax({
			data: {action:81},
			url:vurl,
			type: "post",
			success:function(data){
				currSessionImg = data;
				var img = $('<img onclick="getVi();" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/images/tmp/'+data+'?t='+new Date().getTime()+'" />');//data文件名
				$('#vimg').html("");
				$('#vimg').append(img);
				var input = $('<input  placeholder="验证码" onkeyup="vnChange(this);" type="text" name="validNum" id="validNum" class="layui-input" lay-verify="required"/>');
				$('#vnInput').html("");
				$('#vnInput').append(input);
			}
		});
	}
	
	
	function doLogin(){
		var form = $("#loginForm")[0];
		var userName = form.userName.value;
		var password = form.p.value;
		if(enableValidImg) var validNum = form.validNum.value;
		var pe = <%=pe%>;
		if(userName == null || userName.length == 0){
			layui.use("layer",function(){
				layer.msg('请输入用户名');
			});
			return;
		}else if(enableValidImg && (validNum == null || validNum.length != 4)){
			layui.use("layer",function(){
				layer.msg('请输入图形中4位验证码');
			});
			return;
		}
		if(pe) password = hex_md5(password).toUpperCase();
		$.ajax({
			data:{
				userName:userName,
				p:password,
				validNum:validNum
			},
			type:"post",
			url:"<%=appmap %>/reportCenterServlet?action=3",
			success:function(data){
				if(data.indexOf("success") == -1){
					layui.use("layer",function(){
						layer.msg(data);
					});
					$(form.p).focus();
					getVi();
				}else{
					window.location="<%=appmap %>/raqsoft/center/centerIndex.jsp";
				}
			},
			error:function(e){
				console.log(e);
			}
		});
	}
	
	function reset_checkbox(){
		$('#isManager').val('0');
	}
	
	function keyDown(e)
	{
	e = e||window.event;
	  if (e.keyCode == 13)
	  {
	    e.returnValue=false;
	    e.cancel = true;
	    doLogin();
	  }
	}
	
	function secretReset(){
		var name = $('input[name=userName]').val();
		layui.use('layer', function(){
			if(name != null && name.length>0){
				layer.open({
					type:1,
			    	title:"输入邮箱",
			    	content:'<form id="emailForm" action="<%=appmap %>/reportCenterServlet?action=74"><input id="email" name="email" type="text" class="layui-input"/><input name="username" type="hidden"/></form>',
			    	area:['300px','150px'],
			    	offset: '100px',
			    	btn:["确定"],
			    	yes:function(){
			    		$.ajax({
							data:{email:$('#email').val(),userName:name},
							type:'post',
							url:'<%=appmap %>/reportCenterServlet?action=74',
							success:function(str){//
								if(str.indexOf('fail')>=0){
									if(str.split(":").length > 1) alert(str.split(":")[1]);
									alert('验证有误，请输入【'+name+'】正确的邮箱！');
									return;
								}else{
									layer.close(layer.index);
									var id = "";
									if(str.indexOf('id')>=0) id = str.split(':')[1];
									alert('验证码已经发出到【'+name+'('+id+')】的邮箱！');
									layer.open({
								    	type:1,
								    	title:"输入4位验证码",
								    	content:'<form id="secretForm" action="<%=appmap %>/reportCenterServlet?action=75"><input id="secret" name="secret" type="text" class="layui-input"/><input name="userid" type="hidden"/></form>',
								    	area:['200px','150px'],
								    	offset: '100px',
								    	btn:["确定"],
								    	yes:function(){
								    		var secretNumber = $('#secret').val();
								    		//$('#secretForm')[0].userid.value=id;
								    		if(secretNumber != null && secretNumber.length == 4){
								    			$.ajax({
													data:{userid:id,secret:secretNumber},
													type:'post',
													url:'<%=appmap %>/reportCenterServlet?action=75',
								    				success:function(checkSecretNumber){
								    					if ("success" == checkSecretNumber){
								    						alert("重置成功，密码为【a000000】，请尽快修改密码！");
								    						layer.close(layer.index);
								    					}else{
								    						alert("验证码不正确！");
								    					}
								    				}
								    			});
								    		}else{
								    			alert("验证码不正确！");
								    		}
								    	}
								   });
									return;
								}
							}
						});
			    	}
			   });
			}else{
				layer.open({
			    	type:0,
			    	title:"提示",
			    	content:'请输入用户名',
			    	area:['200px','150px'],
			    	offset: '100px',
			    	btn:["确定"],
			    	yes:function(){layer.close(layer.index);}
			   });
			}
		});
	}
	
	function refreshCurrVimg(){
		var img = $('<img title="点击刷新" style="cursor:pointer" onclick="getVi();" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/images/tmp/'+currSessionImg+'?t='+new Date().getTime()+'" />');//sessionImg文件名
		$('#vimg').html("");
		$('#vimg').append(img);
		setTimeout(refreshCurrVimg,5000);
	}
</script>
 <style>
 body{background: url(<%=appmap%><%=ReportConfig.raqsoftDir%>/center/images/login.png)no-repeat;background-size:cover;font-size: 16px;}
    .form{
    background: rgba(255,255,255,0);
    padding: 20px;
    padding-left: 40px;
     padding-right: 40px;
}

h1{
	font-size: 54px;
	padding-top:50px
}
</style>
<body >
<div class="layui-container" style="margin-top: 120px;">  
  <div class="layui-row" style="height:100%;">
    <div class="layui-col-md4 layui-col-md-offset7"  style="height:100%;">
		<form class="layui-form" method="post" id="loginForm" action="<%=appmap %>/reportCenterServlet" style="border-radius:10px;height:475px;width:550px;margin-left: 40px;background-color: #EEEEEE">
		<h1 style="padding-top: 20px;text-align: center">润乾报表中心</h1>
		 <div class="layui-form-item" style="margin-top:20px;">
		<input onkeydown="keyDown();" style="width:380px;margin-left:80px" type="text" name="userName" required  lay-verify="required" placeholder="用户名" autocomplete="off" class="layui-input">
		</div>
		<div class="layui-form-item">
		<div class="layui-input-inline">
		<input onkeydown="keyDown();" style="width:380px;margin-left:80px" type="password" name="p" required lay-verify="required" placeholder="密码" autocomplete="off" class="layui-input">
		</div>
		</div>
		 <div id="vidiv" class="layui-form-item" style="width:380px;margin-top:0px;">
 			<div id='vnInput' class="layui-col-md3 layui-col-md-offset1"  style="margin-left:80px">
 			</div>
			<div id='vimg' class="layui-col-md3 layui-col-md-offset1"  style="margin-left:80px">
 			</div>
		</div>
		<script>
			if(!enableValidImg) $('#vidiv').hide();
		</script>
		
		<div style="font-size: 12px;margin-left:80px;color: gray" class="layui-form-item">
		<a style="font-size:12px" href="javascript:secretReset();"><u>密码重置</u></a>
		</div>
		<div style="font-size: 12px;margin-left:80px;color: gray" class="layui-form-item">
		*超级管理员用户名【admin】，密码初始为【a000000】<br/>登录后请尽快修改个人密码。
		</div>
		<div class="layui-form-item">
			<div class="layui-col-md5 layui-col-md-offset2"  style="margin-left:80px">
			<input type="button" id="loginbtn" value="登录" onclick="doLogin();return false;" style="margin-top:40px;width:150px" class="layui-col-md1 layui-btn layui-btn-warm"/>
			<!-- 下一版测试微信登录 -->
			<a class="layui-col-md3"  style="cursor:pointer;margin-left:10px;margin-top:46px;" onclick="javascript:window.location='./wxcode.html';"><image src="images/wechat.png"/></a>
 			</div>
			<div class="layui-col-md1" style="margin-left:80px;margin-top:45px"><span style="color: red;" id="msg" ></span></div>
		</div>
		<input type="hidden" name="action" value="3"/>
		</form>
    </div>
  </div>
  </div>
  <iframe id="secretFrame" style="display:none" src=""></iframe>
</body>
</html>