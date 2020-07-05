<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.raqsoft.report.usermodel.Context"%>
<%@ page import="com.raqsoft.dm.*"%>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.report.util.*"%>

<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();

	String oldRpxHome = Context.getInitCtx().getMainDir();
	String oldDfxHome = Env.getMainPath();
	String report = request.getParameter( "rpx" );
	String rpxHome = request.getParameter( "rpxHome" );
	String dfxHome = request.getParameter( "dfxHome" );
	Context.getInitCtx().setMainDir( rpxHome );
	Env.setMainPath( dfxHome );
	try {
		String argRpx = request.getParameter( "arg" );
		
	} finally {
		Context.getInitCtx().setMainDir( oldRpxHome );
		Env.setMainPath( oldDfxHome );
	}
%>