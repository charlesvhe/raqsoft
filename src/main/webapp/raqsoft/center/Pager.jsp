<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div style="padding-right:100px" id="layui-table-page1">
<div class="layui-box layui-laypage layui-laypage-default" id="layui-laypage-2">
<a href="javascript:jumpToPage('${pageInfo.previousPage}');" class="layui-laypage-prev <c:if test='${pageInfo.targetPage eq 1 }'>layui-disabled</c:if>" data-page="0"><i class="layui-icon"></i></a>
<button type="button" onclick="jumpToPage('1');" class="layui-btn-sm" title="首页">1</button>
<span style="color: gray">当前在第${pageInfo.targetPage }页</span>
<button type="button" onclick="jumpToPage('${pageInfo.totalPage}');" class="layui-btn-sm" title="尾页">${pageInfo.totalPage}</button>
<a href="javascript:jumpToPage('${pageInfo.nextPage}');" class="layui-laypage-next <c:if test='${pageInfo.targetPage eq pageInfo.totalPage }'>layui-disabled</c:if>" data-page="2"><i class="layui-icon"></i></a>
<span class="layui-laypage-skip">到第<input type="text" min="1" id="page" value="1" class="layui-input">页<button onclick="jumpToPage();" type="button" class="layui-laypage-btn">确定</button></span><span class="layui-laypage-limits">
<select id="sizePerPage" lay-ignore="" value="${pageInfo.sizePerPage }">
	<%
	for(int i = 1; i <= 10; i++){
	%>
	<option value="<%=i %>0" ><%=i %>0 条/页</option>
	<%
	}
	%>
</select>
</span></div></div>
</body>
</html>