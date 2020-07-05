<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
	<title>自定义JS实现伸缩表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<!-- 引入样式文件 -->
	<link type="text/css" href="css/style.css" rel="stylesheet"/>
</head>
<%
	String report = "/05特色报表/自定义JS实现伸缩表.rpx";
%>

<body onload="try{parent.hideLoading()}catch(e){}">
	<center>
		<jsp:include page="../reportJsp/toolbar.jsp" flush="false" />
		<report:html name="report1" reportFileName="<%=report%>"
			funcBarLocation=""
			needPageMark="yes"
			generateParamForm="no"
			params=""
		/>

	</center>
</body>
<script language="javascript">
	//设置分页显示值
	
	document.getElementById( "t_page_span" ).innerHTML=report1_getTotalPage();
	document.getElementById( "c_page_span" ).innerHTML=report1_getCurrPage();
	function showHidden(row,groupNum){
		var rn = parseInt(row);	//当前行号
		var gn = parseInt(groupNum);	//分组成员数
		var flagObj = document.getElementById("report1_A"+rn);	//+-号所在单元格
		for (var i=rn+1;i<=rn+gn;i++){	
			var obj = document.getElementById("report1_C"+i).parentNode;	//获取分组成员所在行TR
			var disp = obj.style.display;
			if(disp==null || disp==""){//设置TR折叠
				obj.style.display="none";
				flagObj.innerHTML="+";
			}else{//设置TR展开
				obj.style.display="";
				flagObj.innerHTML="-";
			}
		}
	}

</script>
</html>