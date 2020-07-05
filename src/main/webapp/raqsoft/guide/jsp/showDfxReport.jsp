<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%
String cp = request.getContextPath();
String reportId = request.getParameter( "reportId" );
if (session.getAttribute(reportId) == null) {
	out.println("报表已失效");
	return;
}
//System.out.println("reportId [ " + reportId);
String isOlap = request.getParameter( "isOlap" );
if (!"yes".equals(isOlap)) isOlap = "no";
isOlap = "no";
String rName = "report1";
%>
<jsp:include page="/dl/jsp/resource.jsp" flush="true">
	<jsp:param name="pageName" value="showDfxReport"></jsp:param>
	<jsp:param name="title" value="超维报表"></jsp:param>
</jsp:include>
<script type="text/javascript" src="<%=cp %>/dl/js/report.js"></script>
<script language=javascript>
	var _ddboxSelectedItemColor = "red";
	var _ddboxSelectedItemBackColor = "yellow";
	var autoSelectWhileFilter = true;
	var reportConfName = '<%=request.getParameter("confName") %>';
	function dealPage(t) {
		var curr = <%=rName%>_getCurrPage();
		var total = <%=rName%>_getTotalPage();
		if (t == 1) {
			if (curr == 1) return;
			curr = 1;
		} else if (t == 2) {
			if (curr == 1) return;
			else curr--;
		} else if (t == 3) {
			if (curr == total) return;
			else curr++;
		} else if (t == 4) {
			if (curr == total) return;
			else curr = total;
		}
		<%=rName%>_toPage(curr);
	}
	$(document).ready(function(){
		document.getElementById('<%=rName%>_funcbar').style.display='none';
		$('#mainDiv').css('display','block');
		$('td').mouseover(reportCellMouseover).click(reportCellClick);//
	});
</script>
<a id="pageFirst" href="javascript:dealPage(1);"></a>
<a id="pageBefore" href="javascript:dealPage(2);"></a>
<a id="pageAfter" href="javascript:dealPage(3);"></a>
<a id="pageEnd" href="javascript:dealPage(4);"></a>
<a id="excel" href="javascript:<%=rName %>_saveAsExcel();"></a>
<a id="word" href="javascript:<%=rName %>_saveAsWord();"></a>
<a id="pdf" href="javascript:<%=rName %>_saveAsPdf();"></a>
<a id="txt" href="javascript:<%=rName %>_saveAsText();"></a>
<a id="print" href="javascript:<%=rName %>_print();"></a>
<%if("0".equals(request.getParameter("finish"))){ %>
<span style="margin:3px;vertical-align:10px;color:red">由于分组太多，报表未采用全部数据</span>
<%} %>
<br/>
<div id="mainDiv" style="display:none">
<report:html name="<%=rName %>" srcType="reportBean" beanName="<%=reportId%>" width="-1"
	funcBarLocation="top"
	needPageMark="yes"
	firstPageLabel=""
	prevPageLabel=""
	nextPageLabel=""
	lastPageLabel=""
	functionBarColor="#fff5ee"
	funcBarFontFace="隶书"
	funcBarFontSize="16px"
	funcBarFontColor="blue"
	separator="|"
	needSaveAsExcel="no"
	needSaveAsPdf="no"
	needSaveAsText="no"
	needSaveAsWord="no"
	needPrint="no"
	printLabel="打印"
	generateParamForm="no"
	displayNoLinkPageMark="no"
	needDirectPrint="no"
	needPrintPrompt="no"
	useCache="yes"
	needSelectPrinter="no"
	exceptionPage="myError.jsp"
	needLinkStyle="no"
	savePrintSetup="no"
	serverPagedPrint="no"
	textDataSeparator="\t"
	textDataLineBreak="\r\n"
	excelFormat="2007"
	isOlap="<%=isOlap %>"
/>
</div>
</body>
</html>
