<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.report.cache.*" %>
<html>
<head>
<title>报表服务器配置</title>
</head>
<body>
<%
	WebConfig wc = new WebConfig();
	wc.read( application.getRealPath( "/WEB-INF/reportConfig.xml" ) );
%>
<iframe id=if1 name=if1 style="display:none"></iframe>
<form id=cfgForm method=post action="reportServlet?action=77" target="if1">
	<table border=0 cellspacing=0 cellpadding=6 align=center width=1000 style="font-size:14px">
		<tr>
			<td><nobr>报表模板文件主目录reportFileHome:</nobr></td><td width=100%><input type=text name="reportFileHome" value='<%=wc.getConfig("reportFileHome")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表授权文件license:</nobr></td><td width=100%><input type=text name="license" value='<%=wc.getConfig("license")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表日志文件配置logConfig:</nobr></td><td width=100%><input type=text name="logConfig" value='<%=wc.getConfig("logConfig")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>数据连接池数据源的JNDI名称前缀JNDIPrefix:</nobr></td><td width=100%><input type=text name="JNDIPrefix" value='<%=wc.getConfig("JNDIPrefix")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>数据连接池数据源配置串dataSource:</nobr></td><td width=100%><input type=text name="dataSource" value='<%=wc.getConfig("dataSource")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>每次浏览报表都重载报表模板alwaysReloadDefine:</nobr></td><td width=100%><input type=hidden name="alwaysReloadDefine" value='<%=wc.getConfig("alwaysReloadDefine")%>'><input type=checkbox id="alwaysReloadDefine_box" onclick="boxClicked(this,'alwaysReloadDefine')"></td>
		</tr>
		<tr>
			<td><nobr>报表缓存文件保存目录cachedReportDir:</nobr></td><td width=100%><input type=text name="cachedReportDir" value='<%=wc.getConfig("cachedReportDir")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表缓存ID号前缀cachedIdPrefix:</nobr></td><td width=100%><input type=text name="cachedIdPrefix" value='<%=wc.getConfig("cachedIdPrefix")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表缓存超时时间(分钟)cachedReportTimeout:</nobr></td><td width=100%><input type=text name="cachedReportTimeout" value='<%=wc.getConfig("cachedReportTimeout")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表参数缓存超时时间(分钟)cachedParamsTimeout:</nobr></td><td width=100%><input type=text name="cachedParamsTimeout" value='<%=wc.getConfig("cachedParamsTimeout")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>缓存监视器运行间隔(秒)cacheMonitorInterval:</nobr></td><td width=100%><input type=text name="cacheMonitorInterval" value='<%=wc.getConfig("cacheMonitorInterval")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>任务中报表单元格最大数maxCellNum:</nobr></td><td width=100%><input type=text name="maxCellNum" value='<%=wc.getConfig("maxCellNum")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>缺省的报表单元格数defaultCellNum:</nobr></td><td width=100%><input type=text name="defaultCellNum" value='<%=wc.getConfig("defaultCellNum")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>同时计算的最大报表数maxConcurrentForReport:</nobr></td><td width=100%><input type=text name="maxConcurrentForReport" value='<%=wc.getConfig("maxConcurrentForReport")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>等待计算的报表最大数maxWaitForReport:</nobr></td><td width=100%><input type=text name="maxWaitForReport" value='<%=wc.getConfig("maxWaitForReport")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表等待计算的最长时间maxWaitTimeForReport:</nobr></td><td width=100%><input type=text name="maxWaitTimeForReport" value='<%=wc.getConfig("maxWaitTimeForReport")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>缓存文件目录是否在集群间共享isCachedFileShared:</nobr></td><td width=100%><input type=hidden name="isCachedFileShared" value='<%=wc.getConfig("isCachedFileShared")%>'><input type=checkbox id="isCachedFileShared_box" onclick="boxClicked(this,'isCachedFileShared')"></td>
		</tr>
		<tr>
			<td><nobr>服务器集群配置串clusterMember:</nobr></td><td width=100%><input type=text name="clusterMember" value='<%=wc.getConfig("clusterMember")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>JSP文件字符集jspCharset:</nobr></td><td width=100%><input type=text name="jspCharset" value='<%=wc.getConfig("jspCharset")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>应用访问地址前缀appUrlPrefix:</nobr></td><td width=100%><input type=text name="appUrlPrefix" value='<%=wc.getConfig("appUrlPrefix")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>浏览器端输入访问报表的页面地址reportEnterUrl:</nobr></td><td width=100%><input type=text name="reportEnterUrl" value='<%=wc.getConfig("reportEnterUrl")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>自动换行单元格两端留的空白宽度wrapInchingWidth:</nobr></td><td width=100%><input type=text name="wrapInchingWidth" value='<%=wc.getConfig("wrapInchingWidth")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>在字符处折行wrapByChar:</nobr></td><td width=100%><input type=hidden name="wrapByChar" value='<%=wc.getConfig("wrapByChar")%>'><input type=checkbox id="wrapByChar_box" onclick="boxClicked(this,'wrapByChar')"></td>
		</tr>
		<tr>
			<td><nobr>自定义用于自动换行时字间距计算类letterSpacingClass:</nobr></td><td width=100%><input type=text name="letterSpacingClass" value='<%=wc.getConfig("letterSpacingClass")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>展现报表时的错误页面errorPage:</nobr></td><td width=100%><input type=text name="errorPage" value='<%=wc.getConfig("errorPage")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>导出报表时的错误页面errorPage4export:</nobr></td><td width=100%><input type=text name="errorPage4export" value='<%=wc.getConfig("errorPage4export")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表服务器的类型(一般不用填,resin专用)webServerType:</nobr></td><td width=100%><input type=text name="webServerType" value='<%=wc.getConfig("webServerType")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>为浏览器安装jre用于打印的安装文件jreInstallName:</nobr></td><td width=100%><input type=text name="jreInstallName" value='<%=wc.getConfig("jreInstallName")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>为浏览器安装的jre版本号jreVersion:</nobr></td><td width=100%><input type=text name="jreVersion" value='<%=wc.getConfig("jreVersion")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>临时生成的统计图文件保存时间picFileExistTime:</nobr></td><td width=100%><input type=text name="picFileExistTime" value='<%=wc.getConfig("picFileExistTime")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>用于显示flash统计图的swf文件目录flashGraphDir:</nobr></td><td width=100%><input type=text name="flashGraphDir" value='<%=wc.getConfig("flashGraphDir")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>报表单元格样式表文件CSSFile:</nobr></td><td width=100%><input type=text name="CSSFile" value='<%=wc.getConfig("CSSFile")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>esProc配置文件esProcConfig:</nobr></td><td width=100%><input type=text name="esProcConfig" value='<%=wc.getConfig("esProcConfig")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td><nobr>自定义函数配置文件customFunction:</nobr></td><td width=100%><input type=text name="customFunction" value='<%=wc.getConfig("customFunction")%>' style="width:100%"></td>
		</tr>
		<tr>
			<td colspan=2><input tpye=button value="提交配置" onclick="document.getElementById('cfgForm').submit()" style="cursor:pointer"></td>
		</tr>
	</table>
</form>
<script language=javascript>
	function boxClicked( box, cfg ) {
		var prop = document.getElementsByName( cfg )[0];
		if( box.checked ) prop.value = "yes";
		else prop.value = "no";
	}
	
	function initBox( cfg ) {
		var prop = document.getElementsByName( cfg )[0];
		var box = document.getElementById( cfg + "_box" );
		box.checked = prop.value == "yes";
	}
	
	initBox( "alwaysReloadDefine" );
	initBox( "isCachedFileShared" );
	initBox( "wrapByChar" );
</script>
</body>
</html>
