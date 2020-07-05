<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.center.console.node.*" %>
<%@ page import="com.raqsoft.report.view.*"%>
<html>
<head>
<style>
	.toolSpan{
		font-size:28px;
		cursor:pointer;
	}
</style>
<%
	String appmap = request.getContextPath();
	String loginType = (String)(request.getSession().getAttribute("loginType"));
%>
<script type="text/javascript" src="<%=appmap %>/js/jquery.js"></script>
<script src="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<link rel="stylesheet" href="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/font-awesome-4.7.0/css/font-awesome.min.css">
</head>
<body class="layui-layout-body" style="width:300px;margin-top: 0px">
<div class="layui-layout manager">
	<div class="layui-bg-gray" style="height:40px">
	<div class="layui-row" style="padding-top:10px">
    <div class="layui-col-xs2">
     <button id="add" title="新增子节点" onClick="tree_addSubNode()" enterColor="green" class="rootnode layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe654;</i></button>
    </div>
    <div class="layui-col-xs2">
     <button id="ins" title="同级插入节点" onClick="tree_insertNode()" enterColor="green" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic fa fa-indent"></i></button><!-- &#xe61f; -->
    </div>
    <div class="layui-col-xs2">
     <button id="show" title="预览" onClick="report_nodeClick( currNode )" enterColor="blue" class="rootnode layui-btn layui-btn-xs layui-bg-gray"><i class="ic fa fa-eye"></i></button>
    </div>
    <div  class="layui-col-xs2">
     <button id="up" title="节点上移" onClick="tree_moveNode('up')" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe619;</i></button>
    </div>
    <div class="layui-col-xs2">
     <button id="down" title="节点下移" onClick="tree_moveNode('down')" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe61a;</i></button>
    </div>
    <div class="layui-col-xs2">
     <button id="del" title="删除节点" onClick="tree_deleteNode()" enterColor="red" class="layui-btn layui-btn-xs layui-bg-gray"><i class="ic layui-icon">&#xe640;</i></button>
    </div>
  </div>
</div>
</div>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String html = "";
	DeployTree tree = new DeployTree( application, request );
	tree.setLabelFace( "宋体", "black", "12px", "orange" );
	//参数分别是：树节点的字体、字体颜色、字体大小、鼠标经过时的颜色，若为空串则表示用缺省值
	tree.setSelectedFace( "red", "#eee8aa" );
	//参数分别是：树节点被选中时的前景色、背景色，若为空串则表示用缺省值
	String currNodeId = request.getParameter( "currId" );
	if(currNodeId == null || currNodeId.length() == 0){
		currNodeId ="0";
	}
	html = tree.generateHtml(currNodeId, appmap);
%>
<div id="treeContainer" style="height:100%;overflow:scroll;position:relative">
<%=html%>
</div>
<%
	String status = request.getParameter( "status" );
	String afteradd = request.getParameter( "afteradd" );
	out.print( "<script language=javascript>\n" );
	if( "yes".equals(afteradd) ){
		out.print( "\tvar cNode = document.getElementById(\"id_"+currNodeId+"\");\n" );
		out.print( "\ttree_setCurrNode( cNode, false );\n" );
	}else if(currNodeId == "0"){
		out.println("\tcurrNode = document.getElementById('id_0');\n\tshowToolButtons( currNode , true );\n");
	}
	if( status != null ) {
		String position = request.getParameter( "position" );
		out.print( "\ttree_restoreStatus( \"" + status + "\", " + position + ", \"" + currNodeId + "\" );\n" );
	}
	String ifShowTreeNodeComp = request.getParameter( "ifShowTreeNodeComp" );
	if("1".equals(ifShowTreeNodeComp)){
		out.print( "\twindow.onload=function(){var tNode = document.getElementById('id_0');report_nodeClick( tNode );}\n" );
	}
	out.print( "</script>\n" );
%>
</body>
<script>
	function resizeTree(){
		var tc = document.getElementById('treeContainer');
		var targetHeight = 0;
		var h1 = top.window.innerHeight;
		targetHeight = parseInt(h1) - 100;
		tc.style.height = targetHeight + "px";
	}
	top.window.onresize=resizeTree();
	resizeTree();
	$(function(){
		var loginType = '<%=loginType%>';
		if("normalManager" != loginType && "supermanager" != loginType){
			$('.layui-icon').css("color","#BBB");
			$('.manager').hide();
		}
	});
</script>
</html>
