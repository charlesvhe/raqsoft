<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	String appmap = request.getContextPath();
%>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/pdfjs/toast/javascript/jquery.toastmessage.js"></script>
<link href="<%=appmap%><%=ReportConfig.raqsoftDir%>/pdfjs/toast/resources/css/jquery.toastmessage.css" type="text/css" rel="stylesheet" />
<div class="btnBar">
  <ul class="left">
    <li class="toggleBg borderRight">
      <ul class="fileOper">
        <li><a class="ICOhover" href="#" onClick="exportExcel('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_excel")%>' class="excel"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="exportPdf('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_pdf")%>' class="pdf"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="exportWord('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_word")%>' class="word"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="printReport('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.printPreview")%>' class="print2"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="flashPrintReport('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.flashPrint")%>' class="flashprint2"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="pdfPrintReport('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.pdfPrint")%>' class="pdfprint2"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="exportMht('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_mht")%>' class="mht"></span></a></li>
       </ul>
    </li>
    <li class="toggleBg borderRight">
      <ul class="fileOper">
        <li><a class="ICOhover" href="#" onClick="directPrintReport('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.d_print")%>' class="print"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="directFlashPrintReport('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.d_flashPrint")%>' class="flashprint"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="directPdfPrintReport('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.d_pdfPrint")%>' class="pdfprint"></span></a></li>
       </ul>
    </li>
    <li class="floatRight borderLeft">
      <ul class="fileOper">
         <Li><a class="ICOhover" href="#" onClick="try{toPage('report1',1);}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.firstPage")%>' class="begin"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="try{prevPage('report1');}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.prevPage")%>' class="pre"></span></a></li>
        <Li><a class="ICOhover" href="#" onClick="try{nextPage('report1');}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.nextPage")%>' class="next"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="try{toPage('report1',getPageCount('report1'));}catch(e){}return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.lastPage")%>' class="end"></span></a></li>    
      </ul>
    </li>
    <li class="floatRight">  <div style="display:inline-block; margin:9px 4px 3px 4px; float:left; "><%=ServerMsg.getMessage(request,"jsp.currPage1")%><span id="report1_currPage"></span><%=ServerMsg.getMessage(request,"jsp.currPage2")%>/<%=ServerMsg.getMessage(request,"jsp.totalPage1")%><span id="t_page_span"></span><%=ServerMsg.getMessage(request,"jsp.totalPage2")%>&nbsp;&nbsp;</div></li>
  </ul>

</div>
<script language=javascript>
	var myToast, flashToast;
	function showToast() {
		myToast = $().toastmessage('showToast', {
		    text     : '<%=ServerMsg.getMessage(request,"jsp.loadingPrint")%>',
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
		    text     : '<%=ServerMsg.getMessage(request,"jsp.printing")%>',
		    sticky   : true,
		    position : 'middle-center',
		    type:         'notice'
		});		
	}
	function closeFlashToast() {
		$().toastmessage('removeToast', flashToast);
	}
</script>
