<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false" %> 
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div style="width:100%;float:left" align="left" id="layui-table-page1">
<div class="layui-box layui-laypage layui-laypage-default" id="layui-laypage-2">
<table class="" style="width:100%;">
<tr>
<td><a href="javascript:jumpToPage('${pageInfo.previousPage}');" class="layui-laypage-prev <c:if test='${pageInfo.targetPage eq 1 }'>layui-disabled</c:if>" data-page="0"><i class="layui-icon"></i></a></td>
<td><button style="margin-left:0px;margin-right:5px;margin-bottom:10px;width:10px" type="button" onclick="jumpToPage('1');" class="layui-btn-sm" title="首页">1</button></td>
<td><span style="margin-bottom:10px;color: gray;"><u>${pageInfo.targetPage }</u></span></td>
<td><button style="margin-left:5px;margin-bottom:10px;width:10px" type="button" onclick="jumpToPage('${pageInfo.totalPage}');" class="layui-btn-sm" title="尾页">${pageInfo.totalPage}</button></td>
<td><a href="javascript:jumpToPage('${pageInfo.nextPage}');" class="layui-laypage-next <c:if test='${pageInfo.targetPage eq pageInfo.totalPage }'>layui-disabled</c:if>" data-page="2"><i class="layui-icon"></i></a></td>
<td><span class="layui-laypage-skip">跳转<input style="margin:0px"  type="text" min="1" id="page" value="1" class="layui-input"><button onclick="jumpToPage();" type="button" style="margin-left:0px" class="">确定</button></span></td>
<td><span class="layui-laypage-limits">
<select id="sizePerPage" lay-ignore="" value="${pageInfo.sizePerPage }">
	<%
	for(int i = 1; i <= 10; i++){
	%>
	<option value="<%=i %>0" ><%=i %>0 条/页</option>
	<%
	}
	%>
</select>
</span></td>
</tr>
</table>
</div>
</div>
</body>
</html>