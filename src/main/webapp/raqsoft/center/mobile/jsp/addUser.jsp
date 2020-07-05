<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.center.*"%>
<%@ page import="com.raqsoft.center.entity.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%
	String contextPath = request.getContextPath();
	Config cfg = Center.getConfig( application );
	com.raqsoft.center.entity.Role[] roles = cfg.getRoles();
%>
<title>添加用户</title>
<script src="<%=contextPath%>/js/jquery.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css" media="all">
<script type="text/javascript">
function submit(){
	var url = "<%=contextPath%>/reportCenterServlet?action=12";
	var userName = form.userName;
	if(userName.value != null && userName.value.length != 0){
		url += "&userName="+encodeURIComponent(userName.value);
	}else{
		alert("用户名不能为空！");
		userName.focus();
		return;
	}
	var role = form.userRole;
	if(role != null){
		url += "&role="+encodeURIComponent(role.value);
	}
	$.ajax({
		type:"post",
		data:[],
		async: false, 
		url:url,
		success:function(str){
			if(str == "success"){
				alert("添加成功!");
				top.window.location = '<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/outfit.jsp?inner=<%=contextPath%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=16%26isMobile=1';
			}else{
				alert(str);
			}
		}
	});
}
</script>
</head>
<body>
	<div align="center">
		<form action="" method="post" id="form">
			<table class="layui-table">
		    	<tr><td>用户名称</td>
     			<td><input required autofocus class="layui-input" name="userName" type="text" value=""/></td>
		    	</td>
		    	</tr>
     			<tr><td>所属机构</td>
     			<td>
     				<select class="layui-input" name="userRole" id="">
				   <%
				   	for(int i = 0 ; i < roles.length; i++){
				   		String id = roles[i].getId();
				   		if(roles[i] != null && !("0".equals(id))){
				   %>
				   <option value="<%=id %>" 
  					<%
				   		if("-1".equals(id)){
				   %>
							selected
 					<%
				   		}
				   %>
					><%=roles[i].getName() %></option>
				   <%
				   		}
				   	}
				   %>
		  			</select>
		  		</td>
     			</tr>
     			<!-- <tr><td>邮箱(选填)</td>
     			<td><input class="layui-input" name="email" type="text" value=""/></td>
     			</tr>
     			<tr><td>电话(选填)</td>
     			<td><input class="layui-input" name="phone" type="text" value=""/></td>
     			</tr> -->
			</table>
		</form>
	</div>
</body>
</html>