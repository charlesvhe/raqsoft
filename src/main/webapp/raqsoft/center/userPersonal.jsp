<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<%
	String contextPath = request.getContextPath();
%>
<script type="text/javascript" src="<%=contextPath%>/js/jquery.js"></script>
<script type="text/javascript" src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/js/tools.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/userPersonal.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script>
var params = '${userObj.reportParams}';
function form_submit(){
	var submiturl = form.action;
	submiturl += "&userId=${userObj.userId}";
	submiturl += "&email="+encodeURIComponent(form.email.value);
	if(form.phone != null) submiturl += "&phone="+encodeURIComponent(form.phone.value);
	/* submiturl += "&reportMacro="+encodeURIComponent(form.reportMacro.value); */
	//submiturl += "&dqlMacro="+encodeURIComponent(form.dqlMacro.value);
	//var paramsJson = inputToJson();
	//submiturl += "&reportParams="+encodeURIComponent(paramsJson);
	$.ajax({
		type:'post',
		data:[],
		url:submiturl,
		success:function(data){
			alert("保存成功");
			if(data.indexOf("emailSaved") > 0) window.parent.noEmail(false);
			window.location="<%=contextPath%>/raqsoft/center/userPersonal.jsp";
		}
	});
}

$(function(){
	tool_bindCharCheck($('input[type=text]'),["<",">",";"]);
});

function removewx(){
	if(confirm("确认解除绑定？")){
		$.ajax({
			type:'post',
			data:[],
			url:"<%=contextPath%>/reportCenterServlet?action=87",
			success:function(data){
				alert(data);
			}
		});
	}
}
</script>
<style type="text/css">
.layui-input, .layui-select{
	width:130px
}
</style>
</head>
<body>
	<div align="center" class="layui" style="margin-top:20px">个人信息修改</div>
	<br>
	<div align="center">
	<div style="width:1000px" class="layui-tab">
		   <form id=form method=post
				action="<%=contextPath%>/reportCenterServlet?action=53">
			<div align="center">
				<input type="hidden" value="${userObj.userId}" id="userId" name="userId"/>
				<TABLE align=center class="layui-table" style="table-layout: fixed; BORDER-COLLAPSE: collapse;width:350px">
					<tr class="">
						<td><span>用户名</span></td>
						<td>
							${userObj.userName}
						</td>
					</tr>
					<tr class="">
						<td><span>邮箱</span></td>
						<td>
							<input class="layui-input" type="text" lay-verify="email" name='email' id="email" value="${userObj.email}"/>
						</td>
					</tr>
					<c:if test='${userObj.userId!="admin"}'>
					<tr class="">
						<td><span>电话</span></td>
						<td>
							<input class="layui-input" type="text" lay-verify="required|phone" name="phone" id="phone" value="${userObj.phone}"/>
						</td>
					</tr>
					</c:if>
					<tr class="">
						<td><span>微信昵称</span></td>
						<td>
							${userObj.wxnickname}
						</td>
					</tr>
				</table>
			</div>
			</form>
			</div>
			<div class="" style="height:35px;width:100%" style="float:left">
			    <input type="button" class="layui-btn layui-btn-green" onclick="form_submit();" value="保存"/>
			    <input type="button" class="layui-btn layui-btn-normal" onclick="removewx();" value="解绑微信"/>
			 </div>
			</div>
</body>
</html>