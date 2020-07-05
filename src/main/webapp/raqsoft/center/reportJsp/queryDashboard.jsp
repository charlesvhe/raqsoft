<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String report = request.getParameter( "rpg" );
%>
<report:dashboard groupFileName="<%=report%>"
	exceptionPage="/reportJsp/myError2.jsp"
	width="100%" 
	height="100%"
	needTitle="yes"
	needImportEasyui="no"
/>
