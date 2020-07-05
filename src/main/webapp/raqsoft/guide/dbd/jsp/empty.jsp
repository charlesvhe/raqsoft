<%@ page contentType="text/html;charset=UTF-8" %>
<%
String cp = request.getContextPath();
String guideDir = cp + request.getParameter("guideDir");
String v = "10";
String fromDbd = request.getParameter("fromDbd");
String finalView = request.getParameter("finalView");
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
	<title></title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge;" /><!-- 强制以IE8模式运行 -->
	<script type="text/javascript" src="<%=guideDir %>/js/j_query_yi_jiu_yi.js?v=<%=v %>"></script>
	<script type="text/javascript" src="<%=guideDir %>/js/common.js?v=<%=v %>"></script>
	<link rel="stylesheet" href="<%=guideDir %>/css/style.css" type="text/css">
	<script language=javascript>
		var dbd = <%=fromDbd%>;
		var finalView = <%=finalView%>;
		var reportConfName = '<%=request.getParameter("confName") %>';
		$(document).ready(function(){
			parent.$('img[confNameLoading="'+reportConfName+'"]').css('visibility','hidden');
			function resize() {
				$('#mainDiv').css({width:$(window).width()-6,height:$(window).height()-31});
			}
			$('body').click(function(){
				//parent.aly.focusReport(reportConfName);//hdw should change code
			});
			$(window).scroll(function(){
				//$('#toolbarDiv').css('top',$(window).scrollTop()+"px");
			}).resize(function(){
				resize();
			});
			resize();
			//if(dbd) generateDbdItems();
		});
		function generateDbdItems(){
			var body = document.getElementsByTagName("BODY");
			$(body).append('<a id="del" title="清除此报表" href="javascript:deleteReport();"></a>');
		}
		
		function deleteReport(reportName){
			if(!reportName) reportName = reportConfName;
			if(!reportName) {
				return;
			}
			var success = window.top.removeReport(reportName);
		}
		
	</script>
</head>
<body style="overflow:hidden;margin:3px;width:100%;height:100%;">
<div id="empty" style="height:100%;width:100%;text-align:center;font-size:100px;color:azure">empty</div>
<script>
	var height = parseInt($($('div')[0]).css('height'))-20;
	$($('div')[0]).css('line-height',height+"px");
	if(finalView) $('#empty').hide();
</script>
</body>
</html>
