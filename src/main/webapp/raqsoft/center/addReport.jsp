<%@ page contentType="text/html;charset=UTF-8"%>
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.center.entity.*"%>
<%@ page import="java.util.*" %>
<%@ page isELIgnored="false" %> 
 <%
    	String contextPath = request.getContextPath();
 		String uploadType = request.getParameter("uploadType");
 		String refresh = request.getParameter("refresh");
 		String isMobile = request.getParameter("isMobile");
 		com.raqsoft.center.Config cfg = com.raqsoft.center.Center.getConfig();
 		String inputHome = cfg.getInputHome();
 		User[] users = cfg.getUsers();
 		List<Map<String,String>> bInputNodeList = cfg.getNodeList();
    %>
<html>
<head>
<script src="<%=contextPath%>/js/jquery.js"></script>
<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script type="text/javascript">
			function refresh(){
				window.location.href = "";
			}
			function delReportTR(e){
				var fl = addFile.rows.length;
			  while (e.tagName != "TD")   
		      e  =  e.parentElement;   
		 		while (e.tagName != "TR")   
		      e  =  e.parentElement;   
				var ri = e.rowIndex;
				uploadReport.deleteRow( ri );
			}
			
			function addReportTR(){
			  tr = document.createElement( "tr" );
			  td = document.createElement( "td" );
			  td.setAttribute( "width" , "100%"  );
			  td.innerHTML = "上传文件：<input type=file size=50 name=file><img src='<%=contextPath%>/images/del.gif' style='cursor:pointer' onclick='delReportTR(event.srcElement)'>";
			  tr.appendChild( td );
			  addFile.appendChild( tr );
			}
			function regroupActionBeforeSubmit(){
				form2.action = "<%=contextPath %>/reportCenterServlet/upload";
				var isMobile = "<%=isMobile%>";
				var refresh = "<%=refresh %>";
				var tmp1 =  form2.raq.value;
			  	var rp = document.getElementById("relativePath") != null ? document.getElementById("relativePath").value : null;
			  	var uploadType = "<%=uploadType%>";
			  	var name ="";
			  	if(uploadType.indexOf("report")>=0){
				  	name = document.getElementById("cnName").value;
			  	}
				var type = document.getElementById("type").value;
				//查询分析文件另设置保存路径，不给用户选择
				switch(type){
				case "6":
					if(document.getElementById('relateBusinessinput').value != null && document.getElementById('relateBusinessinput').value != ""){
						rp = document.getElementById('relateBusinessinput').value;
					}
					break;
				case "5":
					rp = "vsbs";
					break;
				case "4":
					rp = "dcts";
					break;
				case "7":
				case "3":
				case "13":
					rp = "analyseFiles";
					break;
				case "8":
					rp = "dfxs";
					break;
				case "10":
				case "11":
					//rp = document.getElementById("aggrPathRelativePath").value;
					break;
				case "12":
					rp = "input";
					break;
				}
				form2.action = form2.action +"?uploadType="+uploadType+"&name="+encodeURIComponent(name)
				+"&type="+type
				+"&rp="+encodeURIComponent(rp)
				+"&refresh="+refresh;   /* +"&writedb="+form2.writedb.value;*/ 
				if(type == "4" || type=="5"){
					form2.action += "&dqldb="+encodeURIComponent(document.getElementById("extraSelect").value);
				}
				if(type == "12"){
					rp = "input";
				}
				/* if(type == "6"){
					form2.action += "&changeFileName="+encodeURIComponent(document.getElementById("relateUser").value);
				} */
				if(isMobile == "1"){
					form2.action += "&isMobile=1";
				}
			}
			
			function toSubmit(){
				var refresh1 = "<%=refresh %>";
				var uploadType = "<%=uploadType%>";
				var type = document.getElementById("type").value;
				if(uploadType.indexOf("report")>=0 && type != "6" &&  type != "9"){
					var name = document.getElementById("cnName").value;
					if(name == null || name.length == 0){
						alert("请填写文件名称");
						return;
					}
			  	}
				if(document.getElementById("type").value == "10" || document.getElementById("type").value == "11"){
					/* if(document.getElementById("aggrPathRelativePath").value == null 
							|| document.getElementById("aggrPathRelativePath").value == ""){
						if(!confirm("没有输入路径，文件会储存在填报根目录下，确认？")){
							return;
						}
					} */
				}else{
					if(document.getElementById("relativePath").value == null 
							|| document.getElementById("relativePath").value == ""){
						if(!confirm("没有输入路径，文件会储存在根目录下，确认？")){
							return;
						}
					}
				}
				regroupActionBeforeSubmit();
				var tmp1 = form2.raq.value;
				if(refresh1 == "no"){
					var formData = new FormData(form2);
					$.ajax({
						data:formData,
						type:'post',
						url:form2.action,
						async: false,  
				        cache: false,  
				        contentType: false,  
				        processData: false,  
						success:function(callbackstr){
							if(callbackstr.indexOf("|||") < 0){
								alert("上传失败："+callbackstr);
								closeFrameLayer("showProp");
								return;
							}
							alert("上传成功！");
							var sep = "|||";
							var arr = callbackstr.split(sep);
							if("report" == uploadType || "report_aggr" == uploadType || "report_businessInput" == uploadType || "report_1" == uploadType){
								top.document.getElementById("showProp").contentWindow.refreshReportList(arr[0], arr[1]);
							}else if("report_arg"==uploadType){
								top.document.getElementById("showProp").contentWindow.refreshArgList(arr[0], arr[1]);
							}
							closeFrameLayer("showProp");
							
						}
					});
					return;
				}
			  	if ( tmp1 != '' ){
					  	var tmp2 = tmp1.split("/");
					  	var tmp3 = tmp2[ tmp2.length-1 ];
					  	tmp3 = tmp3.toUpperCase();
					  	form2.action = "";//保留
					  	if( form2.file.value!='' ){
					  		  var uploadFile = form2.file.value.toUpperCase();
					  	    if ( uploadFile.indexOf( tmp3 ) < 0)	{
					  	    	 alert( "更新不能执行 确保更新文件是'" + tmp3.toLowerCase() + "'！" );
					  	    	 return;
					  	    }
					  	    else{
					  	    	 form2.submit();	
					  	    }
					  	}
					  	else{
					  	    form2.submit();	
					  	}
			  	}else{
			  		 form2.submit();	
			  	}
			}
			
			
			function closeFrameLayer(frame){
				var index = top.document.getElementById(frame).contentDocument.getElementById("openLayerIndex").value;
				var frameWin = top.document.getElementById(frame).contentWindow;
				frameWin.layer.close(index);
				frameWin.lookoverdir(frameWin.document.getElementById("businessInputSubDir"));
			}
			
			function showExtra(event){
				var value = event.value;
				if(value == "4" || value == "5"){
					$('#extraSpan').show();
				}else{
					$('#extraSpan').hide();
				}
				/* if(value == "10" || value == "11"){
					$('#extraPath').show();
					$('#normalPath').hide();
				}else{
					$('#extraPath').hide();
					$('#normalPath').show();
				} */
				if(value == "6"){
					$('#relateBusinessinputs').show();//#relateUsers,
				}else{
					$('#relateBusinessinputs').hide();
				}
				if(value == "12"){
					$('#relateBusinessinputs').hide();
				}
				if(value == "3" || value == "4" || value == "5" || value == "7" || value == "8" || value == "12"){
					$('#normalPath').hide();
				}
				if(value == "6" || value == "9"){
					$('.mastInput').hide();
				}else{
					$('.mastInput').show();
				}
			}
			
			function changeRelateUser(userName){
				if(userName == ""){
					$('#relateUserSpan').hide();
					$('#relateUser').css("width","200px");
					return;
				}
				$('#relateUserName').html(userName);
				$('#relateUserSpan').show();
				$('#relateUser').css("width","100px");
			}
			
			function changeRelateNode(path){
				if(path == ""){
					$('#relateInputPath').html("未选择");
					$('#relateBusinessinput').css("width","100px");
					$('#relativePath').prop("disabled", false);
					return;
				}
				$('#relativePath').prop("disabled", true);
				$('#relateInputPath').html(path);
				$('#relateInputSpan').show();
				$('#aggrPathRelativePath').val(path);
				$('#relateBusinessinput').css("width","100px");
			}
		</script>
	</head>
	<body>
		<form id=form2 method=post action="<%=contextPath %>/reportCenterServlet/upload" accept-charset="utf-8" enctype="multipart/form-data">
		    <input type="hidden" name="uploadType" value="<%=request.getParameter("uploadType")%>">
		    <input type="hidden" name="refresh" value="<%=request.getParameter("refresh")%>">
			<TABLE id=uploadReport align=center cellSpacing=0 cellPadding=3 width="450" border=1 class=layui-table
				style="table-layout:fixed; BORDER-COLLAPSE: collapse">
				<colgroup>
					<col width="200px"/>
					<col width="250px"/>
				</colgroup>
				  <tr>
				  	<td  align=center class="tableHeader" colSpan="2" > 添加文件 </td>
				  </tr>
				<%if(uploadType.indexOf("report")>=0){%>
					<TR>
						<td width=100%>文件中文名:
						</td><td>
							<input id="cnName" style="width:100px" type=text size="10" name='name' value='${reportName }'>
							<font class="mastInput" color=red>*必填</font>
						</td>				
					</TR>
				<% } %>
				<TR>
					<td width=100%>文件类型:
					</td><td>
						  <select style="width:125px" id="type" name="type" onchange="showExtra(this);">
				       	   	  <%if("file".equals(uploadType)){ %>
					       		<option value="4" >dct文件</option>
				       	   	  	<option value="5" >vsb文件</option>
				       	   	  	<option value="7" >数据文件</option>
				       	   	  	<option value="12" >填报文件</option>
				       	   	  	<option value="3" >查询文件(qyx)</option>
				       	   	  	<option value="13" >分析文件(olap)</option>
				       	   	  	<option value="8" >dfx文件</option>
					       	  <% }else if("report".equals(uploadType)){%>
				       	   	  <option value="1" selected>报表(组)/填报表</option>
				       	   	  <option value="2">参数表单</option>
				       	   	   <option value="11" >业务填报表</option>
				       	   	   <option value="8" >dfx文件</option>
				       	   	   <option value="10" >统计表</option>
				       	   	   <option value="6" >填报文件</option>
				       	   	   <option value="9" >其他类型</option>
				       	   	  <% }else if("report_arg".equals(uploadType)){%>
				       	   	  <option value="2" selected>参数表单</option>
				       	   	  <% }else if("report_businessInput".equals(uploadType)){%>
				       	   	  <option value="11" selected>业务填报表</option>
				       	   	  <% }else if("report_aggr".equals(uploadType)){%>
				       	   	  <option value="10" >统计表</option>
				       	   	  <% }else if("report_1".equals(uploadType)){%>
				       	   	  <option value="1">报表(组)/填报表</option>
				       	   	  <% }%>
						  </select>
					</td>				
				</TR>
				<TR style="display:none;" id="relateUsers">
					<td width=100%>关联用户:
					</td>
					<td>
						 <select style="width:200px" id="relateUser" name="ru" onchange="changeRelateUser(this.value);">
						 <option value="">不关联，保持文件名</option>
							<%for(User user: users){
								if(Integer.valueOf(user.getRoleId())>1){
							%>
							<option value="<%=user.getUserName()%>"><%=user.getUserName()%></option>
							<%}}%>
						 </select>
						 <span id="relateUserSpan" style="display: none;color: red">上传文件名改为：<span id="relateUserName"></span></span>
					</td>
				</TR>
				<TR style="display:none;" id="relateBusinessinputs">
					<td width=100%>关联业务填报节点:
					</td>
					<td>
						 <select style="width:200px" id="relateBusinessinput" name="rb" onchange="changeRelateNode(this.value);">
						 	<option value="">不关联，上传到选择的路径</option>
							<%
							for(Map<String,String> node: bInputNodeList){
								String savePath = node.get("rpt");
								if(node.get("busiDir") != null && node.get("busiDir").length() != 0){
									savePath = node.get("busiDir")+"/"+node.get("rpt");
								}
							%>
							<option value="<%=savePath %>"><%=node.get("label")%></option>
							<%}%>
						 </select>
						 <span id="relateInputSpan" style="display: none;color: red">上传路径为：<span id="relateInputPath"></span></span>
					</td>
				</TR>
				<%-- <TR style="display:none" id="extraPath">
					<td width=100%>路径:<%=inputHome %>/
					</td>
					<td>
						 <input style="width:100px" type="text" id="aggrPathRelativePath" name="aggrPath"/>
					</td>
				</TR> --%>
				<TR id="normalPath">
					<td width=100%>路径:
					</td>
					<td>
						  <select style="width:100px" id="relativePath" name="rp">
							<%if(uploadType.indexOf("report")>=0){%>
							<c:forEach items="${pathArr }" var="path">
								<option value="${path }">${path }</option>
							</c:forEach>
							<%} else {%>
						  		<option value="dcts">dcts</option>
						  		<option value="vsbs">vsbs</option>
						  		<option value="analyseFiles">analyseFiles</option>
						  		<option value="dfx">dfx</option>
						  		<option value="dfxScript">dfxScript</option>
						  		<option value="inputFiles">inputFiles</option>
						  	<%} %>
						  </select>
					</td>
				</TR>
				
				<%
				if("file".equals(uploadType)){
				%>
				<TR id="extraSpan">
					<td width=100%>关联dql数据库:
					</td><td>
						  <select style="width:100px" id="extraSelect" name="extraSelect">
						  	<c:forEach items="${dqldbs }" var="db">
						  		<option value="${db }">${db }</option>
						  	</c:forEach>
						  </select>
					</td>				
				</TR>
				<%
				}
				%>
				
				<TR>
					<td width=100% colSpan="2">
						选择上传文件:
						<input type=file size="50" name=file id=file>
					</td>
				</TR>
				<tr>
					<td colspan="2" align="center"> <input type=hidden name=raq id=raq value=''>
					<button onclick="toSubmit();" type="button" class="layui-btn">
  					<i class="layui-icon">&#xe67c;</i>确定
					</button>	
					</td>
				</tr>	
        		<tbody id="addFile" width="100%"></tbody>
			</TABLE>
		</form>
<script>
layui.use('upload', function(){
  var upload = layui.upload;
  //执行实例
  var uploadInst = upload.render({
	multiple:true,
    elem: '#test2',//点击test2进入上传选择界面
    url: '#', //上传接口
    bindAction:'#test1',//点击test1提交
    auto: false,//是否选择后直接上传
    accept:'file',//上传类型默认只有图片
    acceptMime:'file/*',//上传可用类型配合
    choose:function(obj){
    	var files = obj.pushFile();//加入上传组
    	//预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
        obj.preview(function(index, file, result){
        	//遍历文件，找到文件名和
        }); 
    },
    before: function(){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
    },
    done: function(res){
      alert("lay上传成功");
    },
    error: function(){
      //请求异常回调
    }
  });
});
showExtra($('#type')[0]);
$('#relateInputPath').html("未选择");
$('#relateInputSpan').show();
$('#relateBusinessinput').css("width","100px");
</script>
</body>
</html>
