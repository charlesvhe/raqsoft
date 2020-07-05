<%@ page contentType="text/html;charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isELIgnored="false" %> 
<%@ page import="com.raqsoft.report.view.*"%>
<html>
	<head>
	<%String appmap = request.getContextPath();
	%>
		<script type="text/javascript" src="<%=appmap %><%=ReportConfig.raqsoftDir%>/easyui/jquery.min.js"></script>
	</head>
	<body>
	<script type="text/javascript">
		function kick(userName){
			$.ajax({
				data:[],
				type:"post",
				url:"<%=appmap %>/reportCenterServlet?action=43&userName="+encodeURIComponent(userName),
				success:function(str){
					if(str == "success"){
						alert("下线成功");
						window.location.reload();
					}else if(str == "fail"){
						alert("下线失败");
					}
				}
			});
		}
		
		$(function(){
			if($($('#table1').find('tr')[1]).find('td').length == 2) $('#onlinecount').attr('colspan','2');
		});
	</script>
		<table id=table1>
			<tr>
				<td id=onlinecount>在线人数：<c:out value="${onlineuser.onlinecount }"></c:out></td>
			</tr>
			<tr>
				<td>用户名</td>
				<c:if test="${rqv5_manager_login ne null }"><td>强制下线</td></c:if>
			</tr>
			<c:forEach items="${onlineuser.users }" var="user">
			<tr>
				<td>${user }</td>
				<c:if test="${rqv5_manager_login ne null }">
					<td style="text-align: center"><a href="javascript:kick('${user}'); " style="font-size: large;color: red;cursor:pointer;"><strong>x</strong></a></td>
				</c:if>
			</tr>
			</c:forEach>
		</table>
	</body>
</html>
