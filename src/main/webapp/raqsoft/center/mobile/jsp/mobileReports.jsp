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

function down(fileName, isAggr){
	fileName = encodeURIComponent(fileName);
	window.location="<%=contextPath%>/reportCenterServlet?action=38&isMobile=1&isAggr="+isAggr+"&file="+fileName+"&fileDirType=report"+"&rightType=0";
}

function deleteSelect(id){
	var delReportIds = new Array();
	if(id != null){
		delReportIds[0] = id;
	}
    if(window.confirm("删除后无法找回，请确认！")==false) {return;}
    window.location = '<%=contextPath %>/reportCenterServlet?action=25&fileType=report&isMobile=1&delReportIds='+delReportIds;
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
				  ,content: '<%=contextPath%>/reportCenterServlet?action=26&uploadType=report&isMobile=1'
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
		    	content:'<%=contextPath%>/reportCenterServlet?action=26&uploadType=report&isMobile=1',
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
	window.location = "<%=contextPath%>/reportCenterServlet?action=24&isMobile=1&currPage=0&page="+targetPage+"&sizePerPage="+document.getElementById("sizePerPage").value;
}
 	
</script>
<style type="text/css">
	.right{
		float:right;
	}
	.reportNameSpan{
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
</head>
<body>
<div align="center" style="padding-bottom:90px">
<div id="headname">
	<h3 style="height:28px;z-index:10">报表列表</h3>
</div>
<div style="padding-top:0px" class="layui-collapse" lay-accordion>
<c:forEach items="${pageInfo.entity }" var="report">
 		<div class="layui-colla-item">
		    <h2 class="layui-colla-title">
		    <span class="reportNameSpan" style="">
		    	<b>${report.name }</b>
		    </span>
		    <div class="right"><c:if test="${report.type eq 1}">报表(组)/填报表</c:if>
     			<c:if test="${report.type eq 2}">参数表单</c:if>
     			<c:if test="${report.type eq 3}">dfx脚本</c:if>
     			<c:if test="${report.type eq 8}">dfx文件</c:if>
     			<c:if test="${report.type eq 9}">其他文件</c:if>
     			<c:if test="${report.type eq 10}">其他文件</c:if>
     		</div> 
			</h2>
		    <div class="layui-colla-content">
		    <div id="mainTableDiv" style="position:relative;overflow-y: scroll;overflow-x: hidden">
		    <table id="mainTable" lay-skin="nob" class="layui-table">
		    	<tr><td>ID</td>
		    	<td class="col-id right">${report.reportId }</td>
		    	</td></tr>
		    	<tr><td>报表中文名</td>
		    	<td class="col-cnname right">${report.name }</td>
		    	</td></tr>
		    	<tr><td>报表文件名</td>
		    	<td class="col-rpt right">${report.rpt }</td>
		    	</td></tr>
		    	<tr><td>报表类型</td>
		    	<td class="col-type right">
     			<c:if test="${report.type eq 1}">报表(组)/填报表</c:if>
     			<c:if test="${report.type eq 2}">参数表单</c:if>
     			<c:if test="${report.type eq 3}">dfx脚本</c:if>
     			<c:if test="${report.type eq 8}">dfx文件</c:if>
     			<c:if test="${report.type eq 9}">其他文件</c:if>
     			</td>
		    	</td></tr>
		    	<tr style="height:50px"><td>操作</td><td class="right">
		    	<span onClick="down('${report.rpt }'<c:if test="${report.type eq 10}">,'yes'</c:if>)" style="color:green;"><i style="font-size:30px" class="layui-icon">&#xe601;</i></span>
		    	<span onClick="deleteSelect('${report.reportId }')" style="color:red;"><i style="font-size:30px" class="layui-icon">&#xe640;</i></span>
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
</script>
</body>
</html>
