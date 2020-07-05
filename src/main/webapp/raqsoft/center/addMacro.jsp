<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isELIgnored="false" %> 
<%@ page import="com.raqsoft.report.view.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<%
  	String contextPath = request.getContextPath();
	com.raqsoft.center.Config cfg = com.raqsoft.center.Center.getConfig( application );
	Object[] dqldbs = cfg.getSpecifiedDbs("com.datalogic.jdbc.LogicDriver");
	String dct_vsb_json = cfg.getDctVsbJson();
	String fileRoot = cfg.getFileRoot();
%>
<script type="text/javascript" src="<%=contextPath%>/js/jquery.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script>
function form_submit(){
	form = $("#form")[0];
	var submiturl = form.action;
	if(form.acId.value == null || form.acId.value == 0){
		alert("必须输\"id\"");
		return;
	}
	if('${type}'=='dql' && (form.params.value.indexOf(";T=")>0 || form.params.value.indexOf("T=") == 0)){
		alert("不能用'T'代表宏名");
		return;
	}
	submiturl += "&userId="+encodeURIComponent(form.userId.value);
	submiturl += "&acId="+encodeURIComponent(form.acId.value);
	//submiturl += "&dataSource="+encodeURIComponent(form.dataSource.value);
	submiturl += "&filters="+encodeURIComponent(form.filters.value);
	submiturl += "&params="+encodeURIComponent(form.params.value);
	submiturl += "&vsb="+encodeURIComponent(form.vsb.value);
	submiturl += "&type=${type}";
	$.ajax({
		type:'post',
		data:[],
		url:submiturl,
		success:function(){
			alert("保存成功");
			if(navigator.userAgent.toLowerCase().indexOf('mobile') < 0){
				window.location="<%=contextPath%>/reportCenterServlet?action=16";
			}else{
				top.window.location="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/outfit.jsp?inner=<%=contextPath%>/raqsoft/center/mobile/jsp/reportCenterServlet?action=16%26isMobile=1";
			}
		}
	});
}
function filter(){
	 $('#vsb').empty();
	 $('#vsb').append("<OPTION value=\"\" style=\"color:gray\">选择</OPTION>");
	 var json = eval("("+"<%=dct_vsb_json%>"+")");
	 var fileRoot = "<%=fileRoot%>";
	 for(var i = 0; i < json.length; i++){
		 for(var key in json[i]){
			 //if(key == event.value){
				 var selections = json[i][key];
				 for(var j = 0; j < selections.length; j++){
					 var vsbs = selections[j]['vsbs'];
					 for(var k = 0; k < vsbs.length; k++){
						 var select = "";
						 if(fileRoot+"/"+vsbs[k] == "${analyseCondition.vsb}"){
							 select = "selected"
						 }
						 $('#vsb').append("<OPTION "+select+" value=\""+fileRoot+"/"+vsbs[k]+"\">"+vsbs[k]+"</OPTION>");
					 }
				 }
			 //}
		 }
	 }
}
$(function(){
	layui.use('form', function(){
		  var form = layui.form; 
		  form.render();
	});
	filter();
	if(navigator.userAgent.toLowerCase().indexOf('mobile') >= 0){
		$('.pc').hide();
	}
});
</script>
</head>
<body>
	<div align="center" class="layui" style="margin-top:20px"></div>
	<br>
	<div align="center">
	<form id=form method=post
		action="<%=contextPath%>/reportCenterServlet?action=${userAction}&type=${type}">
		<input type="hidden" value="${userId}" id="userId" name="userId"/>
		<TABLE align=center class="layui-table" style="table-layout: fixed; BORDER-COLLAPSE: collapse;width:350px">
			<colgroup>
				<col width="50px"/>
				<col width="50px"/>
			</colgroup>
			<tr style="display:none" class="">
				<td colspan="2" align="left"></td>
				<td>
					<input type="hidden" value="_raqsoft_outerCondition_" id="acId" name="acId"/>
				</td>
			</tr>
			<%-- <tr class="dql">
				<td colspan="2" align="left">dql数据源</td>
				<TD><select onchange="filter(this);" name=dataSource id=dataSource class="layui-input"> 
		    	<option value="">筛选</option>
		    	<%
		    		for( int i = 0; i < dqldbs.length; i++ ) {
		   				out.println( "<option" );
		   				out.println( " value=\"" + dqldbs[i] + "\">" + dqldbs[i] + "</option>" );
		    		}
		    	%>
		    	</select>
		    	</TD>
			</tr> --%>
			<tr class="dql">
				<td rowspan="2">可视条件</td>
				<td rowspan="1">自定义</td>
				<td rowspan="1">
					<textarea class="layui-textarea" placeholder="table1:expression1;table2:expression2" id="filters" name="filters">${analyseCondition.filters}</textarea>
				</td>
			</tr>
			<tr class="dql">
			<td>vsb文件</td>
			<td><select placeholder="vsb文件选择" class=layui-input id=vsb name=vsb value="">
					</select>
			</td>
			</tr>
			<tr class="">
				<td><span>宏值定义</span></td>
				<td>自定义</td>
				<td>
					<textarea class="layui-textarea" placeholder="param1=value1;param2=value2" id="params" name="params">${analyseCondition.paramValues}</textarea>
				</td>
			</tr>
			<TR class="pc">
				<td width=100% align=center colspan=3>
					<input class="layui-btn layui-btn-green" type="button" class="layui-btn layui-btn-green" onclick="form_submit();" value="提交"/>
				</td>
			</TR>
		</table>
	</form>
	</div>
</body>
</html>