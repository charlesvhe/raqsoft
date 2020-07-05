<%@ page contentType="text/html;charset=UTF-8" %>
<html>
  <head>
	<meta http-equiv="expires" content="0">    
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
  </head>
<body style="margin:5%;font-family:微软雅黑;"> 
<%
	String appmap = request.getContextPath();	
%>
<script language=javascript src="<%=appmap%>/reportServlet?action=10&file=%2Fcom%2Fraqsoft%2Freport%2Fview%2Fhtml%2Fmb.js"></script>


<h1 style=" margin:0em; text-align:center; color:#005DBA; font-size:3em; ">扫码示例</h1>
<div style="color:#06F; margin:2em 1em; line-height:1.5em; font-size:1em; color:#666; ">本例展示可以在html中调用android系统的扫码功能，将条形码或二维码扫描到表单中的input控件中。</div>
<input type=text id=codeId style="width:100%; height:2em; padding:0 20px; color:#000; font-size:2.5em;font-family:微软雅黑;">
<input type=button value="点击扫码" onClick="window.reportApp.scanCode('codeId')" style="width:100%;margin:0.5em 0; background:#006CD9;border-radius:4px; color:#FFF;font-size:2em;height:2em;font-family:微软雅黑; border: #005DBA 1px solid;">


<table width=100%>
	<tr><td colspan=3></td></tr>
	<tr>
		<td><nobr></nobr></td>
		<td></td>
		<td><nobr></nobr></td>
	</tr>
</table>
</body>
</html>
