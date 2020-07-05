<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	String appmap = request.getContextPath();
	String mobile = request.getParameter("mobile");
%>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/pdfjs/toast/javascript/jquery.toastmessage.js"></script>
<link href="<%=appmap%><%=ReportConfig.raqsoftDir%>/pdfjs/toast/resources/css/jquery.toastmessage.css" type="text/css" rel="stylesheet" />
<div class="btnBar">
  <ul class="left">
    <li class="toggleBg borderRight">
      <ul class="fileOper">
        <li><a class="ICOhover" href="#" onClick="exportExcel('report1');return false;"><span title="导出excel" class="excel"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="exportPdf('report1');return false;"><span title="导出pdf" class="pdf"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="exportWord('report1');return false;"><span title="导出word" class="word"></span></a></li>
		<%
		if(mobile == null){
		%>
        <li><a class="ICOhover" href="#" onClick="printReport('report1');return false;"><span title="打印预览" class="print2"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="flashPrintReport('report1');return false;"><span title="flash打印预览" class="flashprint2"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="pdfPrintReport('report1');return false;"><span title="pdf打印预览" class="pdfprint2"></span></a></li>
		<%
		}
		%>
		<li><a class="ICOhover" href="#" onClick="exportMht('report1');return false;"><span title="导出mht" class="mht"></span></a></li>
       </ul>
    </li>
      <%
		if(mobile == null){
		%>
    <li class="toggleBg borderRight">
      <ul class="fileOper">
        <li><a class="ICOhover" href="#" onClick="directPrintReport('report1');return false;"><span title="直接打印" class="print"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="directFlashPrintReport('report1');return false;"><span title="flash直接打印" class="flashprint"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="directPdfPrintReport('report1');return false;"><span title="pdf直接打印" class="pdfprint"></span></a></li>
       </ul>
    </li>
    <li class="floatRight borderLeft">
      <ul class="fileOper">
         <Li><a class="ICOhover" href="#" onClick="try{toPage('report1',1);}catch(e){}return false;"><span title="首页" class="begin"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="try{prevPage('report1');}catch(e){}return false;"><span title="上一页" class="pre"></span></a></li>
        <Li><a class="ICOhover" href="#" onClick="try{nextPage('report1');}catch(e){}return false;"><span title="下一页" class="next"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="try{toPage('report1',getPageCount('report1'));}catch(e){}return false;"><span title="尾页" class="end"></span></a></li>    
      </ul>
    </li>
    <li class="floatRight">  <div style="display:inline-block; margin:9px 4px 3px 4px; float:left; ">第<span id="report1_currPage"></span>页/共<span id="t_page_span"></span>页&nbsp;&nbsp;</div></li>
    <%
	}
	%>
  </ul>

</div>
<script language=javascript>
	var myToast, flashToast;
	function showToast() {
		myToast = $().toastmessage('showToast', {
		    text     : '正在加载打印页......',
		    sticky   : true,
		    position : 'middle-center',
		    type:         'notice'
		});		
	}
	function closeToast() {
		$().toastmessage('removeToast', myToast);
	}
	function showFlashToast() {
		flashToast = $().toastmessage('showToast', {
		    text     : '正在打印......',
		    sticky   : true,
		    position : 'middle-center',
		    type:         'notice'
		});		
	}
	function closeFlashToast() {
		$().toastmessage('removeToast', flashToast);
	}
</script>
