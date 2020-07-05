<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.report.view.*" %>
<% 
	if(request.getProtocol().compareTo("HTTP/1.1")==0 ) response.setHeader("Cache-Control","no-cache");
	else response.setHeader("Pragma","no-cache");
	request.setCharacterEncoding( "UTF-8" );
	String appmap = request.getContextPath();
%>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts3/update/echarts.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts3/dist/extension/dataTool.min.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts3/map/js/china.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts3/map/js/world.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts3/dist/extension/bmap.min.js"></script>

<script src="<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts2/dist/echarts.js"></script>
<script language=javascript>
    require.config({
        paths: {
            echarts: '<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts2/dist',
            zrender: '<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts2/dist/zrender'
        },
        packages: [
            {
                name: 'BMap',
                location: '<%=appmap%><%=ReportConfig.raqsoftDir%>/echarts2/dist/extension/BMap/src',
                main: 'main'
            }
        ]
    });
</script>
