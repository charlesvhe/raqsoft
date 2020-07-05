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
<script type="text/javascript" src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/js/tools.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/util.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script type="text/javascript">
	var newCount = 0;
	function deleteSelect(){
		var delUserIds = new Array();
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
          if(window.confirm("确认要删除 请确认！")==false)return;
          document.forms.form3.action = '<%=contextPath%>/reportCenterServlet?action=14&delUserIds='+ delUserIds;
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
		tool_bindCharCheck($('.usernameInput'),["<",">",";"]);
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
					window.location='<%=contextPath%>/reportCenterServlet?action=16';
				}else{
					alert(str);
				}
			}
		});
 	}
 	
 	function ajaxGetOptions(dl,userId,acId,type){
 		if($(dl).children('dd').length > 0){return;}
 		$.ajax({
 			type:"post",
 			url:"<%=contextPath%>/reportCenterServlet?action=58&userId="+userId+"&type="+type,
 			data:[],
 			success:function(acIds){
 				$(dl).empty();
 				$(dl).append('<dd style="text-align:center">'+type+'宏</dd>');
 				if(acIds != null && acIds.length != 0){
 					var acIdArr = acIds.split(',');
 					for(var k = 0; k < acIdArr.length; k++){
	 					$(dl).append('<dd>'+acIdArr[k]
	 					+'<a title="删除" href=\"javascript:deleteCondition(\''+userId+'\',\''+acIdArr[k]+'\');\"><i style=\"float:right;color:red\" class=layui-icon>&#xe640;</i></a>'
	 					+'<a title="编辑" href=\"javascript:window.location=\'<%=contextPath%>/reportCenterServlet?action=58&type='+type+'&userId='+userId+'&acId='+acIdArr[k]+'\';\"><i style=\"float:right;color:blue\" class=layui-icon>&#xe642;</i></a>'
	 					+'</dd>');
 					}
 				}
 				$(dl).append('<dd><a href=\"JavaScript:window.location=\'<%=contextPath%>/reportCenterServlet?action=59&type='+type+'&userId='+userId+'\';\"><i style=\"color:#CFA;font: bold;\" class=\"layui-icon\">&#xe654;</i><i>添加</i></a></dd>');
 			}
 		});
 	}
 	
 	function showMenu(td,userId,acId,type){
 		window.location='<%=contextPath%>/reportCenterServlet?action=58&type='+type+'&userId='+userId+'&acId=_raqsoft_outerCondition_';
 		/* var dls = $(td).children('dl');
 		for(var j = 0; j < dls.length; j++){
 			var dl = dls[j];
 			if(dl.tagName == "DL"){
 				ajaxGetOptions(dl,userId,acId,type);
	 	 		$(dl).show();
 			}
 		} */
 		
 	}
 	
 	function deleteCondition(userId, acId){
 		if(!confirm("确认要删除id为:“"+acId+"”的宏?")){
 			return;	
 		}
 		$.ajax({
 			type:"post",
 			url:"<%=contextPath%>/reportCenterServlet?action=60&userId="+userId+"&acId="+acId,
 			data:[],
 			success:function(str){
 				if(str == "success"){
 					window.location = "<%=contextPath%>/reportCenterServlet?action=16";
 				}
 			}
 		});
 		
 	}
 	
 	function hideMenuEx(td){
 		var dl = $(td).children('dl')[0];
 		$(dl).hide();
 	}
 	
 	function showParams(userId){
 		window.location="<%=contextPath%>/reportCenterServlet?action=85&userId="+userId;<%-- <%=ReportConfig.raqsoftDir%>/center/userParams.jsp?userId="+userId; --%>
 	}
 	
 	function hideMenu(dl){
 		var dls = $(dl).parent().children();
 		for(var i = 0; i < dls.length; i++){
 			console.log();
 			if(dls[i].tagName == "DL") $(dls[i]).hide();
 		}
 	}
 	
 	function addInList(count, event){
 		var url = "<%=contextPath%>/reportCenterServlet?action=12";
		var userName = $("#userName-"+count);
		if(userName.val() != null && userName.val().length != 0){
			url += "&userName="+encodeURIComponent(userName.val());
		}else{
			alert("用户名不能为空！");
			userName.focus();
			return;
		}
		var role = $("#newSelect-"+count).val();
		if(role != null){
			url += "&role="+encodeURIComponent(role);
		}
		url += "&params=";
		$.ajax({
			type:"post",
			data:[],
			async: false, 
			url:url,
			success:function(str){
				if(str.indexOf("success:") == 0){
					alert("保存成功!");
					var user = eval("("+str.substring(8)+")");
					//rebuildSaveButton(userName,event);
					var table = $("#userName-"+count).parent().parent().parent();
 					$("#userName-"+count).parent().parent().remove();
					rebuildRow(table,user);
				}else{
					alert(str);
				}
			}
		});
 	}
 	
 	function rebuildRow(table,user){
 		var tr = $("<tr></tr>");
 		table.append(tr);
 		tr.append('<td><input name="" type="checkbox" value="'+user.userId+'" '+ (user.userName == 'raq_visitor' ? 'disabled':'')+'></td>');
		tr.append('<input name="userId_'+user.userId+'" type="hidden" value="'+user.userId+'"/>' )	;
		tr.append('<td><input class="usernameInput" name="userName_'+user.userId+'" type="text" value="'+user.userName+'" '+(user.userName == 'raq_visitor' ? 'disabled':'')+'/></td>' )	;
		var td3 = '<td>'
			+ '<select name="userRole_'+user.userId+'" id="roleList_'+user.userId+'" '+(user.userName == 'raq_visitor' ? 'disabled':'')+'>'
			+ '<c:forEach items="${roleArr }" var="role">'
     		+ '<c:if test="${role ne null }">'
 			+ '<option value="${role.id }">${role.name }</option>'
 			+ '</c:if>'
     		+ '</c:forEach>'
			+ '</select></td>';
		td3 = $(td3)
 		tr.append(td3);
 		tr.append('<td></td>');//email
 		tr.append('<td style="border-right-style:solid;border-left:thin;border-color:#f6f6f6;padding-right:0px"></td>');
 		var td6 = '<td style="padding-left:30px">';
 		if(user.userName != "raq_visitor") {
 			td6 += '<input type="button" onclick="modifyInList(\''+user.userId+'\');" class="layui-btn layui-btn-sm" value="保存"/>';
 		}
 		td6 += '</td>';
 		tr.append(td6);
 		tr.append('<td style="cursor: pointer;" onclick="showMenu(this, \''+user.userId+'\',\'\',\'dql\');"><span>编辑</span></td>');
 		tr.append('<td style="cursor: pointer;" onclick="showParams(\''+user.userId+'\');"><span>编辑</span></td>');
 		td3.find('select').val(user.roleId);
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
 	
 	function add(){
 		var tmp = $("<tr id='newTr"+newCount+"'></tr>");
		$('#table1 tbody').append(tmp);
		tmp = $("<td><input id='newCheckBox-"+newCount+"' name='' type='checkbox' value disabled></td>");
		$('#newTr'+newCount).append(tmp);
		tmp = $("<td><input id='userName-"+newCount+"' type='text' value/></td>");
		$('#newTr'+newCount).append(tmp);
		tmp = $("<td id='newSelectTd"+newCount+"'></td>");
		$('#newTr'+newCount).append(tmp);
		tmp = $("<select id='newSelect-"+newCount+"' name='userRole-"+newCount+"'></select>");
		$('#newSelectTd'+newCount).append(tmp);
		tmp = $("<c:forEach items='${roleArr }' var='role'>\n<c:if test='${role ne null }'>\n<option value='${role.id }' >${role.name }</option>\n</c:if>\n</c:forEach>");
		$('#newSelect-'+newCount).append(tmp);
		tmp = $('<td></td>');
		$('#newTr'+newCount).append(tmp);
		tmp = $('<td style="border-right-style:solid;border-left:thin;border-color:#f6f6f6;padding-right:0px"></td>'); 
		$('#newTr'+newCount).append(tmp);
		tmp = $("<td style='padding-left:30px'><input type='button' onclick=\'addInList("+newCount+",this);\' class='layui-btn layui-btn-sm' value='保存'/></td>");
		$('#newTr'+newCount).append(tmp);
		tmp = $("<td>-</td>");
		$('#newTr'+newCount).append(tmp);
		tmp = $("<td>-</td>"); 
		$('#newTr'+newCount).append(tmp);
		$('#newSelect-'+newCount).val('-1');
		$('#userName-'+newCount).focus();
		tool_bindCharCheck($('#userName-'+newCount),["<",">",";"]);
		newCount++;
 	}
 	
 	function setConfigs(){
 		layui.use("layer",function(){});
 		var title = "动态参数设置";
 		var hasOkBtn = true;
 		var url = "<%=contextPath%>/reportCenterServlet";
 		var getdata = {
			action:78,
			act:3,//1,set;2,remove;3,get
			act2:3,//1,set;2,remove;3,get
			tagName:'unap',
			tagName2:'rnap'
 		};
 		$.ajax({
 			url:url,
			data:getdata,
			type:'get',
			success:function(str){
				var getParamName = "";
				var roleNameParam = "";
				var vimg = "";
				var layer_index = -1;
				if(str){
					str = str.split("|||");
					getParamName = str[0] == "no_value"?"":str[0];
					roleNameParam = str[1] == "no_value"?"":str[1];
					vimg = str[2] == "no_value"?true:(str[2]=="1"?true:false);
					var okFunc = function(){
			 			var allow = $('#unap')[0].checked;
			 			var paramName = $('#pn').val();
			 			var act = 1;
			 			
			 			var allow2 = $('#rnap')[0].checked;
			 			var paramName2 = $('#pn2').val();
			 			var act2 = 1;
			 			
			 			var validImg = $('#validImg')[0].checked;
			 			if(!allow){
			 				act = 2;
				 			paramName = null;
			 			}
			 			if(!allow2){
			 				act2 = 2;
				 			paramName2 = null;
			 			}
			 			var data = {
			 				action:78,
			 				act:act,
			 				act2:act2,
			 				value:paramName,
			 				value2:paramName2,
			 				tagName:'unap',
			 				tagName2:'rnap',
			 				validImg:validImg
			 			};
			 			
			 			$.ajax({
			 				url:url,
			 				data:data,
			 				type:'post',
			 				success:function(str){
			 					window.layui.layer.close(layer_index);
			 				}
			 			});
			 		};
			 		var contentHtml = "<table style='width:100%;text-align:center'>";
			 		contentHtml += "<tr>";
			 		contentHtml += "<td>";
			 		contentHtml += "启用登录验证码";
			 		contentHtml += "</td>";
			 		contentHtml += "<td>";
			 		contentHtml += "</td>";
			 		contentHtml += "</tr>";
			 		contentHtml += "<tr>";
			 		contentHtml += "<td>";
			 		if(vimg) contentHtml += "<input id='validImg' type='checkbox' checked=true/>";
			 		else contentHtml += "<input id='validImg' type='checkbox' />";
			 		contentHtml += "</td>";
			 		contentHtml += "<td>";
			 		contentHtml += "</td>";
			 		contentHtml += "</tr>";
			 		contentHtml += "<tr>";
			 		contentHtml += "<td>";
			 		contentHtml += "使用机构名称作为参数";
			 		contentHtml += "</td>";
			 		contentHtml += "<td>";
			 		contentHtml += "设置参数名称";
			 		contentHtml += "</td>";
			 		contentHtml += "</tr>";
			 		contentHtml += "<tr>";
			 		contentHtml += "<td>";
			 		if(roleNameParam!="") contentHtml += "<input id='rnap' type='checkbox' checked=true/>";
			 		else contentHtml += "<input id='rnap' type='checkbox' />";
			 		contentHtml += "</td>";
			 		contentHtml += "<td>";
			 		contentHtml += "<input tyle='float:left' id='pn2' type='text' value='"+roleNameParam+"'/>";
			 		contentHtml += "</td>";
			 		contentHtml += "</tr>";
			 		contentHtml += "<tr>";
			 		contentHtml += "<td>";
			 		contentHtml += "使用用户名作为参数";
			 		contentHtml += "</td>";
			 		contentHtml += "<td>";
			 		contentHtml += "设置参数名称";
			 		contentHtml += "</td>";
			 		contentHtml += "</tr>";
			 		contentHtml += "<tr>";
			 		contentHtml += "<td>";
			 		if(getParamName!="") contentHtml += "<input id='unap' type='checkbox' checked=true/>";
			 		else contentHtml += "<input id='unap' type='checkbox' />";
			 		contentHtml += "</td>";
			 		contentHtml += "<td>";
			 		contentHtml += "<input tyle='float:left' id='pn' type='text' value='"+getParamName+"'/>";
			 		contentHtml += "</td>";
			 		contentHtml += "</tr>";
			 		contentHtml += "</table>";
			 		layer_index = popLayuiLayer(title,contentHtml,hasOkBtn,okFunc);
				}else{
					alert("error get");
				}
			}
 		});
 	}
</script>
</head>
<body>
<div align="center">
<div style="width:1200px;">
<div class="layui-layout" style="margin-left:20px;margin-top:50px">
	<div class="layui-bg-white" style="height:40px">
	<div class="layui-row">
    <div class="layui-col-xs1">
    <button  style="cursor: pointer;"  class="layui-btn layui-bg-green layui-btn-sm" onclick="add()"><i class="layui-icon">&#xe654;</i>添加</button>
    </div>
    <div class="layui-col-xs1">
    <button style="cursor: pointer;" class="layui-btn layui-bg-red layui-btn-sm" onclick="deleteSelect()"><i class="layui-icon">&#xe640;</i>删除</button>
    </div>
    <div class="layui-col-xs1">
    <button style="cursor: pointer;" class="layui-btn layui-bg-blue layui-btn-sm" onclick="setConfigs()"><i class="layui-icon">&#xe614;</i>设置</button>
    </div>
  </div>
</div>
</div>
</div>
</div>
<div class="layui-container" align="center">
<form action="<%=contextPath %>/" method="post" id="form3">
		<table lay-skin="nob" class="layui-table"
			id="table1" title="用户管理" 
			rowsDisplayed="15" style="width:1200px;">
			<thead>
     		<tr>
     			<th><input name="selectAll" type="checkbox" onchange="selectAllToggle();"/></th>
     			<th>&nbsp;用户名称&nbsp;</th>
     			<th>&nbsp;机构名称&nbsp;</th>
     			<th>&nbsp;邮箱&nbsp;</th>
     			<th>&nbsp;电话&nbsp;</th>
     			<th style="padding-left:30px">&nbsp;操作&nbsp;</th>
     			<th>&nbsp;dql宏&nbsp;</th>
     			<th>&nbsp;报表参数&nbsp;</th>
     		</tr>
     		</thead>
     		<c:forEach items="${userArr }" var="user">
     		<c:if test="${user ne null }">
     		<tr>
     			<td><input name="" type="checkbox" value="${user.userId }" <c:if test="${user.userName eq 'raq_visitor'}">disabled</c:if>></td>
     			<input name="userId_${user.userId}" type="hidden" value="${user.userId }"/>
	     		<td><input class="usernameInput" name="userName_${user.userId}" type="text" value="${user.userName }" <c:if test="${user.userName eq 'raq_visitor'}">disabled</c:if>/></td>
	     		<td>
	     		<select name="userRole_${user.userId}" id="roleList_${user.userId}" <c:if test="${user.userName eq 'raq_visitor'}">disabled</c:if>>
		     	<c:forEach items="${roleArr }" var="role">
		     		<c:if test="${role ne null }">
	     			<option value="${role.id }" <c:if test="${user.roleId eq role.id }">selected</c:if>>${role.name }</option>
	     			</c:if>
		     	</c:forEach>
	     		</select>
	     		</td>
	     		<td>${user.email}</td>
     			<td style="border-right-style:solid;border-left:thin;border-color:#f6f6f6;padding-right:0px">${user.phone}</td>
	     		<td style="padding-left:30px">
	     		<c:if test="${user.userName ne 'raq_visitor'}"><input type="button" onclick="modifyInList('${user.userId}');" class="layui-btn layui-btn-sm" value="保存"/></c:if>
	     		</td>
	     		<td style="cursor: pointer;" onclick="showMenu(this, '${user.userId}','','dql');">
     			<span>编辑</span>
			    <!-- <dl class="layui-nav-child" onmouseleave="hideMenu(this);" style="left:-10px;top: 0px">
			    </dl> -->
     			</td>
	     		<td style="cursor: pointer;" onclick="showParams('${user.userId}');">
     			<span>编辑</span>
     			</td>
     		</tr>
     		</c:if>
     		</c:forEach>
     	</table>
</form>
</div>
</body>
</html>
