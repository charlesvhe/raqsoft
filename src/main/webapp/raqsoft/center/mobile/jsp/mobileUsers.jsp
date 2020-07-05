<%@ page contentType="text/html;charset=UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css" media="all">
<script type="text/javascript">
	var newCount = 0;
	
	function deleteSelect(id){
		var delUserIds = new Array();
		if(id != null){
			delUserIds[0] = id;
		}else{
		  var subGo=0;
		  for(var i=0;i<document.forms.form3.elements.length;i++){
	        if(document.forms.form3.elements[i].type=="checkbox"){
			  if(document.forms.form3.elements[i].checked){
				  if(document.forms.form3.elements[i].name == 'selectAll'){
					  continue;
				  }
				  delUserIds[delUserIds.length] = document.forms.form3.elements[i].value;
				  subGo++;
			   }
		    }
		   }
		    if(subGo<1){
			   alert("您没有选择用户！");
			   return ;
		    }
	    }
        if(window.confirm("确认要删除 请确认！")) {
       		document.forms.form3.action = '<%=contextPath%>/reportCenterServlet?action=14&isMobile=1&delUserIds='+ delUserIds;
            document.forms.form3.submit();
       	}
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
		var isMobile = device.toLowerCase().indexOf('mobile') >= 0;
 	};
 	
 	function selectAllToggle(){
 		if($(form3.selectAll).prop("checked") == true){
 			selectAll(form3);
 		}else{
 			clearAll(form3);
 		}
 	}
 	
 	function modifyInList(id){
 		var saveForm = form3;
 		if(saveForm.tagName != "FORM"){
 			return;
 		}
 		var userId = id;
		var url = "<%=contextPath%>/reportCenterServlet?action=13";
		if(userId!= null){
			url += "&userId="+userId;
		}
		var userName = eval("saveForm.userName_"+userId);
		userName = $(userName);
		if(userName.val() != null && userName.val().length != 0){
			if(userName.val() == "admin" || userName.val() == "raq_visitor"){
				alert("不能设置用户名为"+ userName.val()+"！");
				return;
			}
			url += "&userName="+encodeURIComponent(userName.val());
		}else{
			alert("用户名不能为空！");
			userName.focus();
			return;
		}
		
		var role = eval("saveForm.userRole_"+userId);
		if(role.value != null){
			url += "&role="+encodeURIComponent(role.value);
		}
		url += "&params=";
		$.ajax({
			type:"post",
			url:url,
			data:[],
			success:function(str){
				if(str == "success"){
					alert("保存成功!");
				}else{
					alert(str);
				}
			}
		});
 	}
 	
 	function ajaxGetOptions(content,userId,acId,type){
 		if($(content).children().length > 0){return;}
 		$.ajax({
 			type:"post",
 			url:"<%=contextPath%>/reportCenterServlet?action=58&userId="+userId+"&type="+type,
 			data:[],
 			success:function(acIds){
 				if(acIds != null && acIds.length != 0){
 					var acIdArr = acIds.split(',');
 					for(var k = 0; k < acIdArr.length; k++){
 						var innerSrc1 = encodeURIComponent('<%=contextPath%>/reportCenterServlet?action=58%26type%3D'+type+'%26userId%3D'+userId+'%26acId%3D'+acIdArr[k]);
	 					$(content).append('<div>'+acIdArr[k]
	 					+'<a title="删除" href=\"javascript:deleteCondition(\''+userId+'\',\''+acIdArr[k]+'\');\"><i style=\"float:right;color:red\" class=layui-icon>&#xe640;</i></a>'
	 					+'<a title="编辑" href=\"javascript:top.window.location = \'./outfitForm.jsp?submitFunction=form_submit&inner='+innerSrc1+'\';\"><i style=\"float:right;color:blue\" class=layui-icon>&#xe642;</i></a>'
	 					+'</div></br>');
 					}
 				}
 				var innerSrc2 = encodeURIComponent('<%=contextPath%>/reportCenterServlet?action=59%26type%3D'+type+'%26userId%3D'+userId);
 				$(content).append('<a href=\"javaScript:top.window.location = \'./outfitForm.jsp?submitFunction=form_submit&inner='+innerSrc2+'\';\"><i style=\"color:#CFA;font: bold;\" class=\"layui-icon\">&#xe654;</i><i>添加</i></a>');
 			}
 		});
 	}
 	
 	function showMarco(td,userId,acId,type){
 		var innerSrc1 = encodeURIComponent('<%=contextPath%>/reportCenterServlet?action=58&type='+type+'&userId='+userId+'&acId=_raqsoft_outerCondition_');
 		top.window.location = './outfitForm.jsp?submitFunction=form_submit&inner='+innerSrc1
 	}
 	
 	function showParams(userId){
 		var innerSrc1 = encodeURIComponent("<%=contextPath%>/<%=ReportConfig.raqsoftDir%>/center/mobile/jsp/mobileUserParams.jsp?userId="+userId);
 		top.window.location = './outfitForm.jsp?submitFunction=form_submit&inner='+innerSrc1
 	}
 	
 	function showMenu(td,userId,acId,type){
 		var collapsContent = $(td).children('div')[0];
 		collapsContent = $(collapsContent).children('div')[0];
 		collapsContent = $(collapsContent).children('div')[0];
		ajaxGetOptions(collapsContent,userId,acId,type);
 	}
 	
 	function deleteCondition(userId, acId){
 		if(!confirm("确认要删除:“"+acId+"”的条件")){
 			return;	
 		}
 		$.ajax({
 			type:"post",
 			url:"<%=contextPath%>/reportCenterServlet?action=60&userId="+userId+"&acId="+acId,
 			data:[],
 			success:function(str){
 				if(str == "success"){
 					window.location = "<%=contextPath%>/reportCenterServlet?action=16&isMobile=1";
 				}
 			}
 		});
 		
 	}
 	
 	function hideMenu(dl){
 		$(dl[0]).hide();
 	}
 	
 	function rebuildSaveButton(userName,saveButton){
 		$.ajax({
 			type:'post',
 			data:[],
 			url:"<%=contextPath%>/reportCenterServlet?action=-16&userName="+userName.val(),
			success:function(userId1){
				var newAddTempId = userName.attr("id");
				newAddTempId = newAddTempId.split('-')[1];
				$("#newSelect-"+newAddTempId).attr("name","userRole_"+userId1);
				$("#userName-"+newAddTempId).attr("name","userName_"+userId1);
				$("#newCheckBox-"+newAddTempId).prop("disabled",false).val(userId1);
				
				$(saveButton).removeAttr("onclick");
				$(saveButton).attr("onclick","modifyInList("+userId1+");");
			}
		});
 	} 	
 	
 	function add(){//手机端单去一个form
 		var innerSrc2 = encodeURIComponent('<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/addUser.jsp');
		top.window.location = '<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/mobile/jsp/outfitForm.jsp?submitFunction=submit&inner='+innerSrc2;
 	}
 	
</script>
<style type="text/css">
	.userNameSpan{
		float:left;
	}
	#addBtn{
		position:fixed;
		bottom:0px;
		left:0px;
		width:100%;
		background-color:#0F0;
	}
	#headname{
		/* background-color:#666;
		color: white */
	}
	.layui-colla-title{
		/* background-color: #666; */
		/* color: white; */
	}
	.layui-colla-item{
		/* background-color: #666 */
	}
</style>
</head>
<body>
<div align="center" style="padding-bottom:50px">
<div id="headname">
	<h3 style="height:28px;z-index:10">用户列表</h3>
</div>
<div style="padding-top:0px" class="layui-collapse" lay-accordion>
<form action="<%=contextPath %>/" method="post" id="form3">
<c:forEach items="${userArr }" var="user">
 		<c:if test="${user ne null }">
 		<div class="layui-colla-item">
		    <h2 class="layui-colla-title">
		    <span class="userNameSpan" style="">
		    	${user.userName }
		    </span> 
			</h2>
		    <div class="layui-colla-content">
		    <table class="layui-table">
		    	<tr><td>用户名称</td>
     			<td><input class="layui-input" name="userName_${user.userId}" type="text" value="${user.userName }" <c:if test="${user.userName eq 'raq_visitor'}">disabled</c:if>/></td>
		    	</td>
		    	</tr>
     			<tr><td>所属机构</td>
     			<td><select class="layui-input" name="userRole_${user.userId}" id="roleList_${user.userId}" <c:if test="${user.userName eq 'raq_visitor'}">disabled</c:if>>
				   	<c:forEach items="${roleArr }" var="role">
				   		<c:if test="${role ne null }">
				  			<option value="${role.id }" <c:if test="${user.roleId eq role.id }">selected</c:if>>${role.name }</option>
				  			</c:if>
				   	</c:forEach>
		  		</select>
		  		</td>
     			</tr>
     			<tr><td>邮箱</td><td>${user.email}</td></tr>
     			<tr><td>电话</td><td>${user.phone}</td></tr>
     			<tr><td>dql宏</td>
     			<td onclick="showMarco(this, '${user.userId}','','dql');">
     				<div class="layui-collapse" lay-accordion="">
     					<div class="layui-colla-item">
					    <h2 class="layui-colla-title">编辑</h2>
					    </div>
				    </div>
				</td>
     			</tr>
     			<tr><td>报表参数</td>
     			<td onclick="showParams('${user.userId}');">
     				<div class="layui-collapse" lay-accordion="">
     					<div class="layui-colla-item">
					    <h2 class="layui-colla-title">编辑</h2>
					    </div>
				    </div>
				</td>
     			</tr>
     			
     			<%-- <tr><td>报表宏</td>
     			<td onclick="showMenu(this, '${user.userId}','','report');">
		 			<div class="layui-collapse" lay-accordion="">
     					<div class="layui-colla-item">
					    <h2 class="layui-colla-title">设计</h2>
					    <div class="layui-colla-content">
					    </div>
					    </div>
				    </div>
				</td>
     			</tr> --%>
			</table>
		    <div class="saveBtn">
				<c:if test="${user.userName ne 'raq_visitor'}"><input type="button" onclick="modifyInList('${user.userId}');" class="layui-btn layui-btn-sm" value="保存"/></c:if>
		    	<input type="button" class="layui-btn layui-bg-red layui-btn-sm" onclick="deleteSelect('${user.userId}')" value='删除'/>
			</div>
		    </div>
		  </div>
</c:if>
</c:forEach>
</form>

</div>
<div class="layui-btn" id="addBtn" text-align="center" onclick="add()"><i class="layui-icon">&#xe654;</i>添加</div>
</div>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.js"></script>
<script>
layui.use('element', function(){
	  var element = layui.element;
});
</script>
</body>
</html>
