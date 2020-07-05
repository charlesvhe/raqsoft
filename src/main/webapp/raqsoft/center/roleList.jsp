<%@ page contentType="text/html;charset=UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page isELIgnored="false" %> 
<%@ page import="com.raqsoft.report.view.*"%>
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">

<%
	String contextPath = request.getContextPath();

	
%>
<html>
<head>
<script src="<%=contextPath%>/js/jquery.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script type="text/javascript">
	function add(){
		var agent = navigator.userAgent;
		if(agent.toLowerCase().indexOf("mobile")>=0){
			top.window.location = "<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/outfitForm.jsp?submitFunction=form2_submit&inner=<%=contextPath%>/reportCenterServlet?action=35%26userAction%3D32" + "%26roleId";
		}else{
			top.document.getElementById("showProp").setAttribute("src", "<%=contextPath%>/reportCenterServlet?action=35&userAction=32" + "&roleId");
		}
	}
	
	function modify(roleId){
		var agent = navigator.userAgent;
		if(agent.toLowerCase().indexOf("mobile")>=0){
			top.window.location = "<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/outfitForm.jsp?submitFunction=form2_submit&inner=<%=contextPath%>/reportCenterServlet?action=35%26userAction%3D33" + "%26roleId%3D" + roleId;
		}else{
			top.document.getElementById("showProp").setAttribute("src","<%=contextPath%>/reportCenterServlet?action=35&userAction=33" + "&roleId=" + roleId);
		}
	}
	
	function deleteSelect(){
		var delRoleIds = new Array();
		var subGo=0;
	  for(var i=0;i<document.forms.form3.elements.length;i++){
        if(document.forms.form3.elements[i].type=="checkbox"){
		  if(document.forms.form3.elements[i].checked){
			  if(document.forms.form3.elements[i].name=='selectAll'){
				  continue;
			  }
			  delRoleIds[delRoleIds.length] = document.forms.form3.elements[i].value;
			  subGo++;
		   }
	    }
	   }
	    if(subGo<1){
		   alert("您没有选择！");
		   return ;
	    }
          if(window.confirm("确认要删除 请确认！")==false)return;
          document.forms.form3.action = '<%=contextPath%>/reportCenterServlet?action=-32&delRoleIds='+ delRoleIds;
          document.forms.form3.submit();
		top.document.getElementById("showProp").setAttribute("src", "<%=contextPath%>/reportCenterServlet?action=35&userAction=32" + "&roleId");
    }

	function clearSelect(){
	  var subGo=0;
	  var clsPwdUserIds = new Array();
	  for(var i=0;i<document.forms.form3.elements.length;i++){
	        if(document.forms.form3.elements[i].type=="checkbox"){
			  if(document.forms.form3.elements[i].checked){
				  clsPwdUserIds[clsPwdUserIds.length] = document.forms.form3.elements[i].value;
				  subGo++;
			   }
		   }
	  }

      if(subGo<1){
	     alert("您没有选择！");
	     return ;
      }
      
      if(window.confirm("确认要清除密码 请确认！")==false)return;
         document.forms.form3.action = '<%=contextPath%>/reportCenterServlet?action=29';
         document.forms.form3.submit();
      }

 	function selectAll(form3 ){
	  for(var i=0;i<form3.elements.length;i++){
        if(form3.elements[i].type=="checkbox"){
					 form3.elements[i].checked = true;
	     }
	   }
 	}
 	
 	function clearAll(form3 ){
	  for(var i=0;i<form3.elements.length;i++){
        if(form3.elements[i].type=="checkbox"){
					 form3.elements[i].checked = false;
	     }
	   }
 	}

	window.onload = function(){
 		var device = navigator.userAgent;
		var isMobile = device.indexOf('Mobile') >= 0;
 	};
 	
 	$(function(){
 		$('li.layui-nav-item').bind("click",function(event){
 			layItem_Li_change(event.target);
 		});
 	});
 	
 	function layItem_Li_change(elm){
 		if(elm.tagName == "LI"){
 			$(elm).toggleClass("layui-nav-itemed");
 			return;
		}else{
			layItem_Li_change(elm.parentNode);
		}
 	}
 	
 	function selectAllToggle(){
 		if($(form3.selectAll).prop("checked") == true){
 			selectAll(form3);
 		}else{
 			clearAll(form3);
 		}
 	}
</script>

</head>
<body>
<div style="margin-top:50px;margin-left:20px" class="layui-layout">
	<div class="layui-bg-white" style="height:40px">
	<div class="layui-row">
    <div class="layui-col-xs2">
    <button  style="cursor: pointer;"  class="layui-btn layui-bg-green layui-btn-sm" onclick="add()"><i class="layui-icon">&#xe654;</i>添加</button>
    </div>
    <div class="layui-col-xs2">
    <button style="cursor: pointer;" class="layui-btn layui-bg-red layui-btn-sm" onclick="deleteSelect()"><i class="layui-icon">&#xe640;</i>删除</button>
    </div>
</div>
	
</div></div>
<form action="<%=contextPath %>/" method="post" id="form3">
<table class="layui-table"
     		align="center"
			title="机构管理"> 
			<colgroup><col width="40px"/></colgroup>
     		<tr class="layui-bg-gray">
     			<td style=""><input name="selectAll" type="checkbox" onchange="selectAllToggle();"></td>
     			<td>机构名称</td>
     			<td>现有用户</td>
     		</tr>
     		<c:forEach items="${roleArr }" var="role">
     		<c:if test="${role.id ne null and role.id ne '0'}">
     		<c:set var="userList" value="${r_u_map[role.id] }"></c:set>
     			<tr>
     				<td>
     				<c:if test="${role.id ne '-1' and role.id ne '1'}">
	     			<input name="selectRole" type="checkbox" value="${role.id }">
	     			</c:if>
	     			</td>
	     			<td <c:if test="${role.id eq '1'}">style="color:#DDD"</c:if> <c:if test="${role.id ne '1'}">onclick="modify('${role.id}');"</c:if>>${role.name }</td>
	     			<td <c:if test="${role.id ne '1'}">onclick="modify('${role.id}');"</c:if>>
	     			<span style="color:#E0C0A0">
	     				(${fn:length(userList) })
	     				<c:forEach items="${userList }" var="user">
	     					${user.userName }
	     				</c:forEach>
	     			</span>
	     			</td>
	     		</tr>
     		</c:if>
     		</c:forEach>
     	</table>
</form>
  
     	
</body>
</html>
