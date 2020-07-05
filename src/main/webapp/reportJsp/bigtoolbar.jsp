<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
%>
<div class="btnBar">
  <ul class="left">
    <li class="toggleBg borderRight">
      <ul class="fileOper">
        <li><a class="ICOhover" href="#" onClick="exportExcel('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_excel")%>' class="excel"></span></a></li>
        <!--<li><a class="ICOhover" href="#" onClick="exportPdf('report1');return false;"><span title="导出pdf" class="pdf"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="exportWord('report1');return false;"><span title="导出word" class="word"></span></a></li>-->
		<li><a class="ICOhover" href="#" onClick="flashPrintReport('report1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.flashPrint")%>' class="flashprint2"></span></a></li>
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
    <li class="floatRight">  <div style="display:inline-block; margin:6px 4px 6px 4px; float:left;font-size:14px"><%=ServerMsg.getMessage(request,"jsp.totalPage1")%><span id="report1_totalRecords"></span><%=ServerMsg.getMessage(request,"jsp.record")%>&nbsp;&nbsp;<%=ServerMsg.getMessage(request,"jsp.currPage1")%><span id="report1_currPage"></span><%=ServerMsg.getMessage(request,"jsp.currPage2")%>/<%=ServerMsg.getMessage(request,"jsp.totalPage1")%><span id="report1_totalPage"></span><%=ServerMsg.getMessage(request,"jsp.totalPage2")%>&nbsp;&nbsp;<%=ServerMsg.getMessage(request,"jsp.toPage1")%><input type=text style="width:40px" onkeyup="if(event.keyCode==13)jumpToPage('report1',value)"><%=ServerMsg.getMessage(request,"jsp.toPage2")%></div></li>
  </ul>
  <script>
  	function exportExcel_diy(reportName){
  		eval(reportName+"_saveAsExcel();");
  	    $("#"+reportName+"_export_dlg").dialog("close");
  	}
  	
  </script>
</div>
