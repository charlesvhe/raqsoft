<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.raqsoft.dm.*"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isELIgnored="false" %> 
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%
		String appmap = request.getContextPath();
		boolean isWxTemp = session.getAttribute("tempWxUser") != null;
%>
<title>报表中心</title>
</head>
<script type="text/javascript" src="<%=appmap%>/js/jquery.js"></script>
<script src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<script src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/layui/md5.js"></script>
<link rel="stylesheet" href="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/util.js"></script>
<script type="text/javascript">
</script>
<body class="layui-layout-body">
<div class="layui-layout">
	<div>
	<jsp:include page="./header.jsp"></jsp:include>
	</div>
    <div class="layui-side" style="width:150px;height:100%;padding-top:60px;overflow:hidden;z-index:1" id="tree">
   	<iframe id="leftF" name="left1" src="" style="height:100%;margin-bottom:10px;" frameborder=0></iframe>
    </div>
	<div id="props" class="layui-body" style="top:60px;overflow-y:hidden">
    <iframe id="showProp" name="props" src="" style="height:100%; width:100%;z-index: 99" frameborder=0></iframe> 
   </div>
</div>
<script>
$(function(){
	showReportList(1);
	layui.use("layer",function(){
	});
	function resize(){
		var tc = document.getElementById('props');
		var targetHeight = 0;
		var h1 = top.window.innerHeight;
		targetHeight = parseInt(h1) - 60;
		tc.style.height = targetHeight + "px";
		
		tc = document.getElementById('tree');
		targetHeight = 0;
		h1 = top.window.innerHeight;
		targetHeight = parseInt(h1) - 60;
		tc.style.height = targetHeight + "px";
	}
	//top.window.onresize=resize();
	//resize();
	var isWxTemp = <%=isWxTemp%>;
	if(isWxTemp){
		layer.open({
			type:1,
			title:"绑定账号",
			content:'请输入用户名：<input type="text" id="bindName" style="width:100px"/>',
			offset: '100px',
			area:['300px'],
			btn:["确定"],
	    	yes:function(){
	    		if($('#bindName').val() != "admin"){
		    		$.ajax({
		    			data:{name:$('#bindName').val()},
		    			type:"get",
		    			url:'<%=appmap %>/reportCenterServlet?action=83',
		    			success:function(data){
		    				if(data == "fail"){
		    					alert("没有找到这个用户");
		    				}else{
		    					var uid = data;
		    					layer.close(layer.index);
		    					layer.open({
		    						type:1,
		    						title:"绑定账号",
		    						content:'请验证密码：<input type="password" id="bindPass" style="width:100px"/>',
		    						offset: '100px',
		    						area:['300px'],
		    						btn:["确定"],
		    				    	yes:function(){
		    				    		$.ajax({
		    				    			data:{id:uid,pass:hex_md5($('#bindPass').val()).toUpperCase()},
		    				    			type:"post",
		    				    			url:'<%=appmap %>/reportCenterServlet?action=84',
		    				    			success:function(data){
		    				    				if(data.indexOf("fail") > -1){
		    				    					if(data == "fail")
		    				    						alert("密码错误，验证失败");	    				    					
		    				    					else
		    				    						alert(data);			    					
		    				    				}else{
		    				    					layer.close(layer.index);
		    				    					layer.open({
		    				    					    content: '绑定成功!即将自动登录...'
		    				    					    ,skin: 'msg'
		    				    					    ,time: 5 //2秒后自动关闭
		    				    					    ,end:function(){
		    				    					    	window.location.reload();
		    				    					    }
		    				    					});
		    				    				}
		    				    			}
		    				    		});
		    				    	}
		    					});
		    				}
		    			}
		    		});
	    		}else{
	    			var uid = "admin";
					layer.close(layer.index);
					layer.open({
						type:1,
						title:"绑定账号",
						content:'请验证管理员密码：<input type="password" id="bindPass" style="width:100px"/>',
						offset: '100px',
						area:['300px'],
						btn:["确定"],
				    	yes:function(){
				    		$.ajax({
				    			data:{id:uid,pass:hex_md5($('#bindPass').val()).toUpperCase()},
				    			type:"post",
				    			url:'<%=appmap %>/reportCenterServlet?action=84',
				    			success:function(data){
				    				if(data.indexOf("fail") > -1){
				    					if(data == "fail")
				    						alert("密码错误，验证失败");	    				    					
				    					else
				    						alert(data);
				    				}else{
				    					layer.close(layer.index);
				    					layer.open({
				    					    content: '绑定成功!即将自动登录...'
				    					    ,skin: 'msg'
				    					    ,time: 2 //2秒后自动关闭
				    					    ,end:function(){
				    					    	window.location.reload();
				    					    }
				    					});
				    				}
				    			}
				    		});
				    	}
					});
	    		}
	    	}
		 });
	}
});
</script>


</body>
</html>