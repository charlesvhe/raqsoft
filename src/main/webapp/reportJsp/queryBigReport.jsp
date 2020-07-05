<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
	String report = request.getParameter( "rpx" );
	String scroll = request.getParameter( "scroll" );
	if (scroll==null || scroll.length()==0) scroll = "no";
%>
<report:big name="report1" reportFileName="<%=report%>"
	needScroll="<%=scroll%>"
	scrollWidth="100%" 
	scrollHeight="100%"
	rowNumPerPage="20"
	fetchSize="1000"
	needImportEasyui="no"
/>
<script language="javascript">
	document.getElementById( "report1_totalPage" ).innerHTML = getPageCount( "report1" );
	document.getElementById( "report1_currPage" ).innerHTML = getCurrPage( "report1" );
	try{ _resizeScroll('report1');}catch(ex){}
</script>
