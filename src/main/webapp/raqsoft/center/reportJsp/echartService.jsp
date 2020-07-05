<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<body>
<% 
	request.setCharacterEncoding( "UTF-8" );
	response.setHeader( "X-XSS-Protection", "0" );
	String appmap = request.getContextPath();
	String data = request.getParameter( "data" );
	//System.out.println( "****************" + data );
%>
<script type="text/javascript" src="<%=appmap%>/raqsoft/echarts3/dist/echarts.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/echarts3/dist/extension/dataTool.min.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/echarts3/map/js/china.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/echarts3/map/js/world.js"></script>
<script type="text/javascript" src="<%=appmap%>/raqsoft/echarts3/dist/extension/bmap.min.js"></script>
<script src="<%=appmap%>/raqsoft/echarts2/dist/echarts.js"></script>
<script language=javascript>
	var pageType = "echart";
    require.config({
        paths: {
            echarts: '<%=appmap%>/raqsoft/echarts2/dist',
            zrender: '<%=appmap%>/raqsoft/echarts2/dist/zrender'
        },
        packages: [
            {
                name: 'BMap',
                location: '<%=appmap%>/raqsoft/echarts2/dist/extension/BMap/src',
                main: 'main'
            }
        ]
    });
</script>
<%=data%>
</body>
</html>