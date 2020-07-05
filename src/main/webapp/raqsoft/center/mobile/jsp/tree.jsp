<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.raqsoft.report.view.*"%>
<!DOCTYPE html>
<html>
<%
	String appmap = request.getContextPath();
	String showReportContent = request.getParameter("showReportContent");
%>
<head>
<meta charset="utf-8">
<!-- Required Stylesheets -->
<script src="<%=appmap %>/js/jquery.js"></script>
<script src="<%=appmap %>/js/bootstrap-treeview.js"></script> 
<script src="<%=appmap %>/raqsoft/center/layui/layui.all.js"></script> 
<link href="<%=appmap %>/css/bootstrap.css" rel="stylesheet">
<link href="<%=appmap %>/raqsoft/center/layui/css/layui.css" rel="stylesheet" media="all">
<link href="<%=appmap %>/css/bootstrap-treeview.css" rel="stylesheet">
<script src="../js/mtree.js"></script>
<link rel="stylesheet" href="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/font-awesome-4.7.0/css/font-awesome.min.css">
<style>
	li{
	}
	.layui-anim{
		display:none;
		position:fixed;
		top:10px
	}
	#menu{
		margin-top:55px
	}
	.tree{
		height:100%
	}
</style>
</head>  
<body>
	<div id="menu" class="layui-anim layui-layout" data-anim="layui-anim-up">
	<div class="layui-bg-gray">
	<ul>
		<li>
	     <button id="add" onClick="tree_addSubNode()" enterColor="green" class="rootnode layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe654;</i></button>
	    	</br>
	    	新增
	    </li></br>
	    <li>
	     <button id="ins" onClick="tree_insertNode()" enterColor="green" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic fa fa-indent"></i></button><!-- &#xe61f; -->
	    	</br>
	    	插入
	    </li></br>
	    <li>
	     <button id="show" onClick="report_nodeClick()" enterColor="blue" class="rootnode layui-btn layui-btn-xs layui-bg-gray"><i class="ic fa fa-eye"></i></button>
	     	</br>
	    	管理
	    </li></br>
	    <li>
	     <button id="up" onClick="tree_moveNode('up')" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe619;</i></button>
	     	</br>
	    	上移
	    </li></br>
	    <li>
	     <button id="down" onClick="tree_moveNode('down')" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe61a;</i></button>
	     	</br>
	    	下移
	    </li></br>
	    <li>
	     <button id="del" onClick="tree_deleteNode()" enterColor="red" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe640;</i></button>
	     	</br>
	    	删除
	    </li></br>
	</ul>
	</div>
	</div>
	<div class="tree panel panel-primary">
	<div class="panel-heading">
		节点浏览
    </div>
	    <div class="panel-body">
	    	<div style="margin-left:50px">
	        <ul id="demo">
			</ul>
			</div>
	    </div>
	</div>
</body>

<script type="text/javascript">
var appRoot = "<%=appmap%>";
var showReportContent = "<%=showReportContent%>";
function getTreeJson2(){
	var jsonArr;
	$.ajax({
		type:"post",
		url:"./reportCenterServlet?action=4&showReportContent="+showReportContent,
		async:false,
		success:function(jsonStr){
			try{
				jsonArr = eval('('+jsonStr+')');
			}catch(e){
				jsonArr = eval('[{name: "获取树时出错，请联系管理员!",icon: "fa fa-home",type: "tree",id: "0"}]');
			}
		},
		error:function(){
			jsonArr = eval("([{text:'无可用节点'}])");
		}
	});
	return jsonArr;
}
</script>
</html>