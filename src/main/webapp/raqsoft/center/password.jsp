<%@ page contentType="text/html;charset=UTF-8"%>
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>
<%@ page import="com.raqsoft.report.view.*"%>
<html>
<head>
<%
  String contextPath = request.getContextPath();
%>
<script type="text/javascript" src="<%=contextPath%>/js/jquery.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script type="text/javascript">
	function form2_submit(){
		var url1 = form2.action;
		var type = document.getElementById("type");
		if(type != null && type.value != null){
			url1 += "&type="+type.value;
		}else{
			url1 += "&type=self";
		}
		var userId = document.getElementById("userId");
		if(userId.value != null){
			url1 += "&userId="+userId.value;
		}
		var oldPwd = document.getElementById("oldPwd");
		if(oldPwd.value != null){
			url1 += "&oldPwd="+oldPwd.value;
		}
		var newPwd = document.getElementById("newPwd");
		if(newPwd.value != null){
			url1 += "&newPwd="+newPwd.value;
		}
		var repeat = document.getElementById("repeat");
		if(repeat.value != null){
			url1 += "&repeat="+repeat.value;
		}
		var inputUsername = document.getElementById("inputUsername");
		if(inputUsername.value != null){
			url1 += "&inputUsername="+inputUsername.value;
		}
		$.ajax({
			type:"post",
			data:[],
			url:url1,
			success:function(data){
				layui.use("layer",function(){
				});
				if(data != 'success'){
					layer.msg(data);
				}
				else if(data == 'success'){
					if($('#type').val() == "u"){
						layer.alert("用户"+$('#inputUsername').val()+"的密码已重置为初始密码",function(){
							window.location="<%=contextPath%>/reportCenterServlet?action=31&isManager=yes";
						});
					}else{
						var index = window.layui.layer.open({
							type:1,
							title:"修改成功",
			    			content:'<div align="center"><i class="layui-layer-ico layui-layer-ico1"></i>密码修改成功，请重新登陆！</div>',
			    			offset: '100px',
			    			closeBtn:0,
			    			area:['300px','150px'],
			    			btn:'确定',
			    			yes:function(){
			    				
			    				if(navigator.userAgent.toLowerCase().indexOf("mobile") < 0){
			    					top.window.location="<%=contextPath%>/reportCenterServlet?action=5";
			    				}else{
			    					window.location="<%=contextPath%>/reportCenterServlet?action=5";
			    				}
			    				window.layui.layer.close(index);
			    			}
						});
					}
				}
			}
		});
	}
	
	function typeWarning(){
		if($('#type').val() == "u"){
			if(	confirm("注意！您选择了重置一个用户的密码！请确认！") ){
				layui.use('layer', function(){
		    		$('#openLayerIndex').val(layer.open({
		    			type:1,
		    			title:"输入当前登录者“"+'${userObj.userName}'+"”的密码",
		    			content:'<input required class="layui-input" autofocus type="password" id="managerPass" name="managerPass" value=""/><input type="button" class="layui-btn layui-btn-sm layui-btn-warm" onclick="inputManagerPass();" value="验证身份"/>',
		    			area: ['350px','150px'],
		    			offset: '100px',
		    			cancel:function(){
		    				$('#type').select("m");
							$('#type').val("m");
		    			}
		    		}));
		    	});
			}else{
				$('#type').select("m");
				$('#type').val("m");
			}
		}else{
			$('.modpass').css('display','table-row');
			$('.reset').css('display','none');
		}
	}
	
	function closeFrameLayer(frame){
		var index = $("#openLayerIndex").val();
		var frameWin = top.document.getElementById(frame).contentWindow;
		frameWin.layer.close(index);
	}
	
	function inputManagerPass(){
		var pass = $('#managerPass').val();
		$.ajax({
			type:"post",
			url:"<%=contextPath%>/reportCenterServlet?action=42&checkManager="+pass,
			data:[],
			success:function(str){
				if(str.indexOf( "success" ) >= 0){
					alert("验证成功！请输入要重置的用户名后，点击提交重置！");
					$('.modpass').css('display','none');
					$('.reset').css('display','table-row');
					if(isMobile){
						closeFrameLayer("mainframe");
					}else{
						closeFrameLayer("showProp");
					}
				}else{
					alert("密码错误，请重试！");
				}
			}
		});
		return false;
	}
	
	var device = navigator.userAgent;
	var isMobile = device.toLowerCase().indexOf('mobile') >= 0;
	$(function(){
		layui.use("layer",function(){
		});
	});
</script>
</head>
<body>
	<input type="hidden" id="openLayerIndex" value/>
	<div align="center" class="layui" style="margin-top:50px">
			<c:choose>
				<c:when test="${loginType eq 'supermanager' }">
				  	管理员密码修改
				</c:when>
				<c:otherwise>
					个人密码修改
				</c:otherwise>
			</c:choose> </span>
	</div>
	<br>
	<div align="center">
	<form id=form2 method=post
		action="<%=contextPath%>/reportCenterServlet?action=28">
		<c:if test="${user ne null }">
				<input type="hidden" value="${user.userId}" id="userId" name="userId"/>
			</c:if>
		<TABLE align=center class="layui-table" style="table-layout: fixed; BORDER-COLLAPSE: collapse;width:350px">
			<tr>
				<td>
					<c:if test="${loginType ne 'supermanager' }">
						<span>用户名称:</span>
					</c:if>
					<c:if test="${loginType eq 'supermanager' }">
						<span>修改类型:</span>
					</c:if>
				</td>
				<td><c:choose>
						<c:when test="${loginType eq 'supermanager'}">
							<select class="layui-select" onchange="typeWarning();" id="type">
								<option style="color:red" value="m" selected>超级管理员</option>
								<option style="color:red" value="u">强制重置用户密码</option>
							</select>
 						</c:when>
						<c:otherwise>
							<input class="layui-input" style="width:130px" type=hidden required name='userName' value='${user.userName }'>
							${user.userName }
						</c:otherwise>
					</c:choose></td>
			</tr>
			<tr class=modpass>
				<td><span>旧密码：</span></td>
				<td>
					<input class="layui-input" required name='oldPwd' style="width:130px" type="password" id="oldPwd"/>
				</td>
			</tr>
			<tr class=reset style="display: none">
				<td><span>用户名：</span></td>
				<td>
					<input class="layui-input" style="width:130px" type="text" id='inputUsername' name="inputUserName"/>
				</td>
			</tr>
			<tr class=modpass>
				<td><span>新密码：</span></td>
				<td>
					<input required class="layui-input" type="password" style="width:130px"  name="newPwd" id="newPwd"/>
				</td>
			</tr>
			<tr class=modpass>
				<td><span>确认新密码：</span></td>
				<td>
					<input required class="layui-input" type="password" name="repeat" style="width:130px" id="repeat"/>
				</td>
				
			</tr>

			<TR>
				<td width=100% align=center colspan=2>
					<input type="button" class="layui-btn layui-btn-green" onclick="form2_submit();" value="提交"/>
				</td>
			</TR>
		</table>
	</form>
	</div>
</body>
</html>
