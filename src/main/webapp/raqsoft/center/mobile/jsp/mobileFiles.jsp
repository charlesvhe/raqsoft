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
function detail(rpt, rp){
	layui.use('layer', function(){
    	layer.open({
    		type:2,
    		title:'文件夹详情',
    		content:'<%=contextPath%>/reportCenterServlet?action=50&rpt='+encodeURIComponent(rpt),
    		area: ['650px','200px'],
    		offset: '100px'
    	});
    });
}

function down(fileName){
	fileName = encodeURIComponent(fileName);
	window.location="<%=contextPath%>/reportCenterServlet?action=38&file="+fileName+"&fileDirType=other";
}

function deleteSelect(dir){
	var deleteFiles = new Array();
	if(dir != null){
		deleteFiles[0] = dir;
	}
    if(window.confirm("删除后无法找回，请确认！")==false) {return;}
    window.location = '<%=contextPath %>/reportCenterServlet?action=25&isMobile=1&fileType=files&deleteFiles='+encodeURIComponent(deleteFiles);
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

function addReport(){
	if(navigator.userAgent.toLowerCase().indexOf("mobile") >= 0){
		layui.use('layer', function(){
		   $('#openLayerIndex').val(layer.open({
				  type:2
				  ,content: '<%=contextPath%>/reportCenterServlet?action=26&uploadType=file&isMobile=1'
				  ,anim: 2 
				  ,area:['350px','400px'],
				  offset: '10px'
			}));
		});
	}else{
		layui.use('layer', function(){
		   $('#openLayerIndex').val(layer.open({
		    	type:2,
		    	title:"上传报表",
		    	content:'<%=contextPath%>/reportCenterServlet?action=26&uploadType=file&isMobile=1',
		    	area:['550px','335px'],
		    	offset: '100px'
		   }));
		});
	}
}

function jumpToPage(page){
	var targetPage;
	if(page != null){
		targetPage = page;
	}else{
		targetPage = document.getElementById("page").value;
	}
	window.location = "<%=contextPath%>/reportCenterServlet?action=39&isMobile=1&currPage=0&page="+targetPage+"&sizePerPage="+document.getElementById("sizePerPage").value;
}
 	
</script>
<style type="text/css">
.right{
	float:right;
}
.reportDirSpan{
	float:left;
}
#addBtn{
	position:relative;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	bottom:-12px;
	left:0px;
	height:42px;
	width:100%;
	background-color:#0F0;
}
</style>
<div align="center" style="padding-bottom:90px">
<div id="headname">
	<h3 style="height:28px;z-index:10">查询分析文件列表</h3>
</div>
<div style="padding-top:0px" class="layui-collapse" lay-accordion>
<c:forEach items="${pageInfo.entity }" var="file">
 		<div class="layui-colla-item">
		    <h2 class="layui-colla-title">
		    <span class="reportDirSpan" style="">
		    	<b>${file.dir }</b>
		    </span>
			</h2>
		    <div class="layui-colla-content">
		    <div id="mainTableDiv" style="position:relative;overflow-y: scroll;overflow-x: hidden">
		    <table id="mainTable" lay-skin="nob" class="layui-table">
		    	<tr><td>文件</td>
		    	<td class="col-dir right">${file.dir}</td>
		    	</td></tr>
		    	<c:if test="${file.type eq 'dct' or file.type eq 'vsb' }">
		    	<tr><td>关联DQL数据库</td>
		    		<td class="col-relation right" >${file.relation}</td>
		    	</tr>
		    	</c:if>
		    	<tr><td>文件后缀类型</td>
		    	<td class="col-type right">${file.type }</td>
		    	</td></tr>
		    	<tr style="height:50px"><td>操作</td><td class="right">
		    	<span onClick="down('${file.dir}')" style="color:green;"><i style="font-size:30px" class="layui-icon">&#xe601;</i></span>
		    	<span onClick="deleteSelect('${file.dir }')" style="color:red;"><i style="font-size:30px" class="layui-icon">&#xe640;</i></span>
		    	</td></tr>
			</table>
			</div>
		    </div>
		  </div>
</c:forEach>
</div>
<input type="hidden" value id="openLayerIndex"/>
<div style="padding:0px;position:fixed;bottom:10px;height:70px;background-color: white;border-radius: 10px"  align="left" class="layui-table-page">
<jsp:include page="mobilePager.jsp"></jsp:include>
<div class="layui-btn" id="addBtn" text-align="center" onclick="addReport()"><i class="layui-icon">&#xe654;</i>添加</div>
</div>
</div>

<script src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.js"></script>
<script>
layui.use('element', function(){
	  var element = layui.element;
});
$(function(){
	$('#sizePerPage').val('${pageInfo.sizePerPage }');
});
</script>
</body>
</html>
