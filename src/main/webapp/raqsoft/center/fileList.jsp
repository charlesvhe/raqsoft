<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isELIgnored="false" %> 
<%@ page import="com.raqsoft.report.view.*" %>
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
<link rel="stylesheet" href="<%=contextPath %><%=ReportConfig.raqsoftDir%>/center/font-awesome-4.7.0/css/font-awesome.min.css">
<script type="text/javascript">
	function refresh(){
		window.location.href = "";
	}
	
	Array.prototype.deleteIndex = function(index){
		return this.slice(0, index).concat(this.slice(parseInt(index, 10) + 1));
	};
	
	function down(fileName){
		var farr1 = fileName.split('.');
		var fType = farr1[1];
		var farr2 = farr1[0].split('/');
		var fName = farr2[farr2.length - 1];
		farr2 = farr2.deleteIndex(farr2.length - 1);
		var rp = farr2.join('/');
		window.location = "<%=contextPath%>/reportCenterServlet?action=38&fileType="+fType+"&fileName="+encodeURIComponent(fName)+"&relativePath="+encodeURIComponent(rp)+"&fileDirType=other";
	}
	
	function deleteSelect(){
	  var subGo=0;
	  var deleteFiles = new Array();
	  for(var i=0;i<document.forms.form3.elements.length;i++){
        if(document.forms.form3.elements[i].type=="checkbox"){
		  if(document.forms.form3.elements[i].checked){
			  if(document.forms.form3.elements[i].name=='selectAll'){
				  continue;
			  }
			  deleteFiles[deleteFiles.length] = document.forms.form3.elements[i].value;
			  subGo++;
		   }
	    }
	   }
	    if(subGo<1){
		   alert("您没有选择文件！");
		   return ;
	    }
          if(window.confirm("删除后无法找回，请确认！")==false)return;
          document.forms.form3.action = '<%=contextPath %>/reportCenterServlet?action=25&fileType=files&deleteFiles='+encodeURIComponent(deleteFiles);
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
 	
	var device = navigator.userAgent;
	var isMobile = device.indexOf('Mobile') >= 0;
	
	function selectAllToggle(){
 		if($(form3.selectAll).prop("checked") == true){
 			selectAll(form3);
 		}else{
 			clearAll(form3);
 		}
 	}
	
	function addFile(){
		if(navigator.userAgent.toLowerCase().indexOf("mobile") >= 0){
			layui.use('layer', function(){
			   $('#openLayerIndex').val(layer.open({
					  type:2
					  ,content: '<%=contextPath%>/reportCenterServlet?action=26&uploadType=file'
					  ,anim: 2 
					  ,area:['350px','335px']
				}));
			});
		}else{
		    layui.use('layer', function(){
		    	$('#openLayerIndex').val(layer.open({
		    		type:2,
		    		title:"上传文件",
		    		content:'<%=contextPath%>/reportCenterServlet?action=26&uploadType=file',
		    		area:['550px','335px'],
		    		offset: '100px'
		    	}));
		    });
		}
	}
	
	function filtFileType(typeSelect){
		var typeValue = $(typeSelect).val();
		if(typeValue != ""){
			window.location="<%=contextPath%>/reportCenterServlet?action=39&fileType=all&filter="+typeValue;
		}
	}
	
	function jumpToPage(page){
		var typeValue = $('#typefilter').val();
		var plusType = "";
		if(typeValue != ""){
			plusType = "&filter="+ typeValue;
		}
		var targetPage;
		if(page != null){
			targetPage = page;
		}else{
			targetPage = document.getElementById("page").value;
		}
		window.location = "<%=contextPath%>/reportCenterServlet?action=39&currPage=0&page="+targetPage+"&sizePerPage="+document.getElementById("sizePerPage").value + plusType;
	}
	
</script>
</head>
<body >
<input type="hidden" value id="openLayerIndex"/>
<div align="center">
<div style="width:1200px;">
<div class="layui-layout" style="margin-left:20px;margin-top:50px">
	<div class="layui-bg-white" style="height:40px">
	<div class="layui-row">
    <div class="layui-col-xs1">
    <button  style="cursor: pointer;"  class="layui-btn layui-bg-green layui-btn-sm" onclick="addFile()"><i class="layui-icon">&#xe654;</i>添加</button>
    </div>
    <div class="layui-col-xs1">
    <button style="cursor: pointer;" class="layui-btn layui-bg-red layui-btn-sm" onclick="deleteSelect()"><i class="layui-icon">&#xe640;</i>删除</button>
    </div>
  </div>
</div>
</div>
</div>
</div>
<div class="layui-container" align="center">
<form action="<%=contextPath %>/" method="post" name="form3" id="form3">
		<table lay-skin="nob" class="layui-table"
			id="table1" title="文件管理" 
			rowsDisplayed="15" style="width:1200px">
			<colgroup>
				<col width="8%"/>
				<col width="28%"/>
				<c:if test="${filterType eq 'dct' or filterType eq 'vsb' }">
					<col width="28%"/>
				</c:if>
				<col width="28%"/>
				<col width="8%"/>
			</colgroup>
			<thead>
	     		<tr>
	     			<th><input name="selectAll" type="checkbox" onchange="selectAllToggle();"/></th>
	     			<th >文件名</th>
	     			<c:if test="${filterType eq 'dct' or filterType eq 'vsb' }"><th class="relate">关联DQL数据库</th></c:if>
	     			<th>
	     				<span style="cursor: pointer" onclick="$('#typefilter').css('display','');$('#typefilter').focus()">文件类型&nbsp;<i class="fa fa-filter"></i></span>
	     				<select onblur="$(this).hide();" style="width:150px;height:32px;position:fixed;display:none;margin-left:-60px;margin-top:20px;z-index:100"
	     					 title="筛选" id=typefilter name=typefilter class="layui-select" onchange="filtFileType(this);">
					    	<option value="" style="color:gray">筛选</option>
					    	<option value="all" style="color:blue">全部</option>
					    	<option value="dct">dct(关联数据库)</option>
					    	<option value="vsb">vsb(关联数据库)</option>
					    	<option value="xlsx">xlsx</option>
					    	<option value="txt">txt</option>
					    	<option value="xls">xls</option> 
					    	<option value="csv">csv</option>
					    	<option value="b">b</option>
					    	<option value="json">json</option>
					    	<option value="olap">olap</option>
					    	<option value="qyx">qyx</option>
					    </select>
    				</th>
	     			<th >操作</th>
	     		</tr>
     			</thead>
     		<c:forEach items="${pageInfo.entity }" var="file">
     		<tr>
     			<td style="width:100px"><input name="clspwd" type="checkbox" value="${file.dir }"></td>
     			<td>${file.dir}</td>
     			<c:if test="${filterType eq 'dct' or filterType eq 'vsb' }"><td class="relate" >${file.relation}</td></c:if>
     			<td>${file.type}</td>
	     		<td>
	     			<span onClick="down('${file.dir}')" class="down"><img src="<%=contextPath %><%=ReportConfig.raqsoftDir%>/center/images/down.gif" border="noborder"/></span>
	     		</td>
     		</tr>
     		</c:forEach>
     	</table>
</form>
</div>
<div style="position:fixed;bottom:0px;background-color: white" align="right" class="layui-table-page">
<jsp:include page="Pager.jsp"></jsp:include>
</div>
<script type="text/javascript">
$(function(){
	$('#sizePerPage').val('${pageInfo.sizePerPage }');
	$('#typefilter').val('${pageInfo.typeFilter }');
});
</script>
</body>
</html>
