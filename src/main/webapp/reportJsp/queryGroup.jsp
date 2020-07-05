<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String report = request.getParameter( "rpg" );
	String needPaged = request.getParameter( "needPaged" );
	if( needPaged == null ) needPaged = "no";
	String match = request.getParameter( "match" );
	if( match == null ) match = "0";
%>
<report:group groupId="group1" groupFileName="<%=report%>"
	funcBarLocation=""
	width="100%"
	height="100%"
	needImportEasyui="no"
	needPaged="<%=needPaged%>"
	sheetAlign="center"
	matchScreen="<%=match%>"
/>
<script language="javascript">
	try{ $(window).trigger( "resize" ); }catch(ex){}
</script>