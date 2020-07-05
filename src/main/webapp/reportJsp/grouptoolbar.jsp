<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
%>
<div class="btnBar">
  <ul class="left">
    <!--<li class="borderRight submitLi" onClick="_submitTable( report1 );return false;" href="#"> <a title="提交" href="#" class="submit"></a></li>-->
    <li class="toggleBg borderRight">
      <ul class="fileOper">
        <li><a class="ICOhover" href="#" onClick="group_print('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.printPreview")%>' class="print2"></span></a></li>
	<li><a class="ICOhover" href="#" onClick="group_pdfPrintReport('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.pdfPrint")%>' class="pdfprint2"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_exportExcel('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_excel")%>' class="excel"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_exportPdf('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_pdf")%>' class="pdf"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="group_exportWord('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_word")%>' class="word"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="group_exportMht('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.e_mht")%>' class="mht"></span></a></li>
      </ul>
    </li>
    <li class="floatRight borderLeft">
      <ul class="fileOper">
        <Li><a class="ICOhover" href="#" onClick="group_firstPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.firstPage")%>' class="begin"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_prevPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.prevPage")%>' class="pre"></span></a></li>
        <Li><a class="ICOhover" href="#" onClick="group_nextPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.nextPage")%>' class="next"></span></a></li>
        <li><a class="ICOhover" href="#" onClick="group_lastPage('group1');return false;"><span title='<%=ServerMsg.getMessage(request,"jsp.lastPage")%>' class="end"></span></a></li>    
      </ul>
    </li>
    <li class="floatRight">  <div style="display:inline-block; margin:9px 4px 3px 4px; float:left; "><%=ServerMsg.getMessage(request,"jsp.currPage1")%><span id="group1_currPage"></span><%=ServerMsg.getMessage(request,"jsp.currPage2")%>/<%=ServerMsg.getMessage(request,"jsp.totalPage1")%><span id="group1_totalPage"></span><%=ServerMsg.getMessage(request,"jsp.totalPage2")%>&nbsp;&nbsp;</div></li>
  </ul>
</div>