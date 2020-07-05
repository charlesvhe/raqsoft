<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="com.raqsoft.input.model.resources.*"%>
<%
	String sgid = request.getParameter("sgid");
	if (sgid == null) sgid = "sg1";
	boolean isAggr = "1".equals(request.getParameter("isAggr"));
%>
<link href="toolbar.css" rel="stylesheet">
<div class="btnBar">
  <ul class="left">
    <%if (isAggr){ %>
    <li class="toggleBg borderRight">
      <ul class="fileOper">
		<li><a class="ICOhover" href="#" onClick="_inputDownloadExcel('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web1")%>" class="excel"></span></a></li>
       </ul>
    </li>
    <%} else { %>
    <li class="borderRight submitLi" onClick="_inputSubmit('<%=sgid %>');return false;" href="#"> <a title="<%=InputMessage.get(request).getMessage("input.web6")%>" href="#" class="submit"></a></li>
    <li class="toggleBg borderRight">
      <ul class="fileOper">
		<li><a class="ICOhover" href="#" onClick="_inputDownloadExcel('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web1")%>" class="excel"></span></a></li>
		<li><a class="ICOhover" href="#" onClick="_inputLoadExcelData('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web2")%>" class="excel-import"></span></a></li>
		<li id="inputAppendExcel"><a class="ICOhover" href="#" onClick="_inputAppendExcelData('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web2")%>" class="excel-append"></span></a></li>
		<li id="inputDefaultAddRow" style="display:none;"><a class="ICOhover" href="#" onClick="_appendRow('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web3")%>" class="rowFillVer"></span></a></li>
		<li id="inputDefaultInsertRow" style="display:none;"><a class="ICOhover" href="#" onClick="_insertRow('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web4")%>" class="rowFillHor"></span></a></li>
		<li id="inputDefaultDeleteRow" style="display:none;"><a class="ICOhover" href="#" onClick="_deleteRow('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web5")%>" class="rowFillDel"></span></a></li>
		<li id="inputBatchDownload" style=""><a class="ICOhover" href="#" onClick="_batchDown('<%=sgid %>');return false;"><span title="<%=InputMessage.get(request).getMessage("input.web13")%>" class="batchDownSpan"></span></a></li>
       </ul>
    </li>
    <%} %>
  </ul>
</div>
<script>
function showRowInputButtons(){
	try {
		if (sheetRowArea && sheetRowArea.indexOf("1")>=0) {
			$("#inputAppendExcel,#inputDefaultAddRow,#inputDefaultInsertRow,#inputDefaultDeleteRow").css('display','block');
		}
	} catch(e){
		throw e;
	}
}
	$(document).ready(function(){
		showRowInputButtons();
	});
</script>
