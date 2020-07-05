<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="org.json.*" %>
<%@ page import="com.raqsoft.report.usermodel.Context"%>
<%@ page import="com.raqsoft.common.Types"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.center.*" %>
<%@ page import="com.raqsoft.center.entity.*" %>
<%@ page import="com.raqsoft.report.util.*"%>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
	String report = request.getParameter( "rpx" );
	String scroll = request.getParameter( "scroll" );
	String scale = request.getParameter("scale");
	//2020.4.30
	/* String contextName = request.getParameter("contextName");
	if(contextName != null && contextName.length() > 0){
		Object ctxobj = session.getAttribute("curr_context");
		if(ctxobj != null) request.setAttribute("center_context", ctxobj);
		Object ctxobjp = session.getAttribute("curr_context_param");
		if(ctxobjp != null) request.setAttribute("center_context_param", ctxobjp);
	} */
	//2017.10.13 by hdw
	String excelFormat = request.getParameter( "excelFormat" );
	String excelPageStyle = request.getParameter( "excelPageStyle" );
	if (scroll==null || scroll.length()==0) scroll = "no";
	Enumeration paramNames = request.getParameterNames();
	StringBuffer param = new StringBuffer();
	if(paramNames!=null){
		while(paramNames.hasMoreElements()){
			String paramName = (String) paramNames.nextElement();
			String paramValue=request.getParameter(paramName);
			//System.out.println("paramValue="+paramValue);
			if(paramValue!=null){
				//把参数拼成name=value;name2=value2;.....的形式
				param.append(paramName).append("=").append(paramValue).append(";");
			}
		}
	}
%>
<report:html name="report1" reportFileName="<%=report%>"
	funcBarLocation="no"
	needScroll="<%=scroll%>"
	contextName="center_context"
	scrollWidth="100%" 
	scrollHeight="100%"
	needImportEasyui="no"
	excelFormat="<%=excelFormat%>"
	excelPageStyle="<%=excelPageStyle%>"
	scale="<%=scale %>"
	params="<%=param.toString() %>"
/>
<script language="javascript">
	document.getElementById( "t_page_span" ).innerHTML = getPageCount( "report1" );
	document.getElementById( "report1_currPage" ).innerHTML = getCurrPage( "report1" );
	try{ _resizeScroll('report1');}catch(ex){}
</script>
