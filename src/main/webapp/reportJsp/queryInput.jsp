<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.input.model.resources.*"%>
<%@ taglib uri="/WEB-INF/raqsoftInput.tld" prefix="raqsoft" %>
<%
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String input = request.getParameter( "sht" );
	String dataFile = request.getParameter( "dataFile" );
	String noDfx = "yes";
	String adp = "yes";
	if( dataFile == null || dataFile.length() == 0 ) {
		dataFile = "";
		noDfx = "no";
		adp = "no";
	}
	String fileType = request.getParameter( "fileType" );
	if (fileType == null) fileType = "json";

	StringBuffer param=new StringBuffer();
	Enumeration paramNames = request.getParameterNames();
	if(paramNames!=null){
		while(paramNames.hasMoreElements()){
			String paramName = (String) paramNames.nextElement();
			String paramValue=request.getParameter(paramName);
			if(paramValue!=null){
				//把参数拼成name=value;name2=value2;.....的形式
				param.append(paramName).append("=").append(paramValue).append(";");
			}
		}
	}
	String sgid = request.getParameter( "sgid" );
	if (sgid == null) sgid = "sg1";
%>
<raqsoft:input id="<%=sgid %>"
	src="<%=input%>" 
	paramMode="i"
	params="<%=param.toString()%>"
	excel="io"
	needImportEasyui="no"
	width="100%"
	height="100%"
	tabLocation=""
	adp = "<%=adp%>"
	file="<%=dataFile%>"
	fileType="<%=fileType%>"
	outerDim="id"
/>
