<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>An Error Occured</title>
<script type="text/javascript">
document.getElementById("count").innerHTML=secs;

</script>
</head>
<body>
<span id="msg"></span>
<p>
<span id="count"></span>秒后跳转...
</p>
<script type="text/javascript">
	var jumpto = "<%=request.getParameter("url") %>";
	var msg = "<%=request.getParameter("msg") %>";
	 function countDown(secs, msg){
		 document.getElementById("count").innerHTML=secs;
	     if(--secs>0)
	        setTimeout( "countDown(" +secs+ ")" ,1000);
	 }
	 if(jumpto == 'null'){
			jumpto = "<%=request.getContextPath()%><%=ReportConfig.raqsoftDir%>/center/centerIndex.jsp";
	}
	 window.setTimeout("jump('"+jumpto+"');",3000);
	if(msg == "haventLogout"){
		msg = "重复登录";
	}else if(msg == 'null'){
		msg = "错误：未知";
	}
	document.getElementById("msg").innerHTML=msg;
	countDown(3,msg);
	
	function jump(url){
		window.location = url;
	}
</script>
</body>
</html>