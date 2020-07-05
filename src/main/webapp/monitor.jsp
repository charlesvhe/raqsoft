<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.report.usermodel.*" %>
<%@ page import="com.raqsoft.report.cache.*" %>
<html>
<head>
<title>报表服务器监控</title>
</head>
<body>
	<table border=1 cellspacing=0 cellpadding=8 align=center width=400>
		<tr>
			<td>最大并发任务数:</td><td align=right><%=PerfMonitor.getMaxConcurrentTaskNum()%></td>
		</tr>
		<tr>
			<td>当前并发任务数:</td><td align=right><%=PerfMonitor.getConcurrentTaskNum()%></td>
		</tr>
		<tr>
			<td>最大等待任务数:</td><td align=right><%=PerfMonitor.getMaxWaitingTaskNum()%></td>
		</tr>
		<tr>
			<td>当前等待任务数:</td><td align=right><%=PerfMonitor.getWaitingTaskNum()%></td>
		</tr>
		<tr>
			<td colspan=2>  注:任务是指报表计算或分页</td>
		</tr>
		<tr>
			<td>当前写缓存文件的线程数:</td><td align=right><%=CacheManager.getCurrentWriteCount()%></td>
		</tr>
	</table>
	<script language=javascript>
		window.setTimeout( "reload()", 3000 );
		function reload() {
			document.location = document.location;
		}
	</script>
</body>
</html>
