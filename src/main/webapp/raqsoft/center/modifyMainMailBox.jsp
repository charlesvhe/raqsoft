<%@page import="org.json.JSONArray"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.center.*" %>
<%@ page import="com.raqsoft.center.entity.Report" %>
<%@ page import="com.raqsoft.center.schedule.ScheduleImpl" %>
<%@ page import="org.json.*" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<%
	String contextPath = request.getContextPath();
	Config cfg = Center.getConfig();
%>
<script type="text/javascript" src="<%=contextPath%>/js/jquery.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script>
var appmap = "<%=contextPath%>";
var raqdir = "<%=ReportConfig.raqsoftDir%>";
/* function form_submit(){
	$.ajax({
		type:'post',
		data:[],
		url:"",
		success:function(){
			alert("保存成功");
		}
	});
} */

</script>
<style type="text/css">
.hide{
	background-color: #EEE;
}
</style>
</head>
<body>
	<div align="center" class="layui" style="margin-top:20px">发件邮箱</div>
	<br>
	<div align="center">
	<div style="width:1000px" class="layui-tab">
	   <form class="layui-form" id=form1 method=post
			action="<%=contextPath%>/reportCenterServlet?action=71">
		<div align="center">
			<!-- <input type="hidden" name="timer" id="timer" value=""/> -->
			<TABLE align=center class="layui-table" style="table-layout: fixed; BORDER-COLLAPSE: collapse;width:650px">
				<tr class="from_email">
					<td><span>邮箱地址</span></td>
					<td>
					<div class="layui-form-item">
						<input lay-verify="email" class="layui-input" type="text" name="from_email" value="${from_email }"/>
					</div>
					</td>
				</tr>
				<tr class="password">
					<td><span>密码/</span><span title="一些邮箱提供授权码，这时需要获取授权码并必须在此处填写授权码" style=""><u>授权码</u></span></td>
					<td>
					<div class="layui-form-item">
						<input lay-verify="required" class="layui-input" type="password" name="password" value="${password }"/>
					</div>
					</td>
				</tr>
				<tr class="host">
					<td><span>smtp服务器</span></td>
					<td>
					<div class="layui-form-item">
						<input lay-verify="required" class="layui-input" type="text" name="host" value="${host }"/>
					</div>
					</td>
				</tr>
				<tr class="smtpPort">
					<td><span>smtp端口</span></td>
					<td>
					<div class="layui-form-item">
						<input lay-verify="required" class="layui-input" type="text" name="smtpPort" value="${smtpPort }"/>
					</div>
					</td>
				</tr>
				<%-- <tr class="loginAuthCode">
				<td><span>授权码（来自代理邮箱服务商）</span></td>
				<td>
       				<div class="layui-form-item">
						<input lay-verify="required" class="layui-input" type="text" name="loginAuthCode" value="${loginAuthCode }"/>
					</div>
				</td>
				</tr> --%>
			</table>
			<div class="" style="height:35px;width:100%">
		    	<button type="button" lay-submit class="layui-btn layui-btn-green" lay-filter="form1">提交</button>
		    </div>
		</div>
		</form>
	</div>
	</div>
</body>

<script type="text/javascript">

function layuiParse(){
	layui.config({
		base: appmap+raqdir+'/center/layui/'
	}).extend({
		formSelects: 'formSelects-rqedit'
	}).use(['form','formSelects','laydate'], function() {
		var form = layui.form, formSelects = layui.formSelects, laydate = layui.laydate;
		form.on("submit(form1)",function(data){
			var url = data.form.action;
			$.ajax({
				type:'post',
				url:url,
				data: data.field,
				success:function(str){
					if(str.indexOf("fail:") == 0){
						alert(str);
						return;
					}
					alert("保存成功");
					
				},
				fail:function(e){
					alert("执行异常");
					console.log(e);
				}
			});
		});
	});
}
layuiParse();
</script>
</html>