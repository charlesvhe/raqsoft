<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.util.*"%>

<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String report = request.getParameter( "board" );
	String boardId = request.getParameter( "boardId" );
	if( boardId == null ) boardId = "b" + System.currentTimeMillis();
	String groupId = request.getParameter( "groupId" );
	StringBuffer param = new StringBuffer();
	Enumeration paramNames = request.getParameterNames();
	if(paramNames!=null){
		while(paramNames.hasMoreElements()){
			String paramName = (String) paramNames.nextElement();
			String paramValue = request.getParameter(paramName);
			if( paramValue != null ){
				param.append(paramName).append("=").append(paramValue).append(";");
			}
		}
	}
%>
<report:html name="<%=boardId%>" reportFileName="<%=report%>"
	params="<%=param.toString()%>"
	funcBarLocation="no"
	needImportEasyui="no"
/>
<script language=javascript>
	try{ _resizeBoard( "<%=groupId%>" );}catch(e){}
</script>
