<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.center.*" %>
<%@ page import="com.raqsoft.center.console.*" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%@ page import="com.raqsoft.center.entity.*"%>
<html>
<head>
<%
	request.setCharacterEncoding( "UTF-8" );
	String label = request.getParameter( "label" );
	String rpt = request.getParameter( "rpt" );
	String form = request.getParameter( "form" );
	String url = request.getParameter( "url" );
	String scale = request.getParameter( "scale" );
	String paged = request.getParameter( "paged" );
	String scroll = request.getParameter( "scroll" );
	Config cfg = Center.getConfig( application );
	com.raqsoft.center.entity.Report[] reports = cfg.getReports();
	String appmap = request.getContextPath();
%>
<script src="<%=appmap %>/js/jquery.js"></script>
<script src="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<link rel="stylesheet" href="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
</head>
<body>
<div style="height:100%;width:100%;padding-top:20px;">
<TABLE style="margin:auto;width:500px" cellSpacing=0 cellPadding=0 border=0 class="layui-table">
   	<TR>
    	<TD colspan=2 align=center class=titleFont style="PADDING-BOTTOM: 10px">首页属性</TD>
    </TR>
 	<TR>
    	<TD>树名称</td>
    	<TD><INPUT id=labelBox class=layui-input value="<%=label%>" style="VERTICAL-ALIGN: middle; WIDTH: 150px;"></TD>
    </TR>
  	<!-- <TR height=20>
    	<TD><hr style="color:lightblue;height:2px"></TD>
    </TR> -->
  	<TR>
  		<td>首页报表</td>
    	<TD><SELECT id=raqBox class=layui-input style="WIDTH: 150px"> 
    		<OPTION value=""></OPTION>
    	<%
    		for( int i = 0; i < reports.length; i++ ) {
    			if( reports[i].type.equals( "1" ) ) {
    				out.println( "<OPTION value=\"" + reports[i].rpt + "\">" + reports[i].name + "</OPTION>" );
    			}
    		}
    	%>
    	</SELECT></TD>
    </TR>
  	<TR>
    	<TD>首页参数表单</td>
    	<TD><SELECT id=formBox class=layui-input style="WIDTH: 150px"> 
    		<OPTION value=""></OPTION>
    	<%
    		for( int i = 0; i < reports.length; i++ ) {
    			if( reports[i].type.equals( "2" ) ) {
    				out.println( "<OPTION value=\"" + reports[i].rpt + "\">" + reports[i].name + "</OPTION>" );
    			}
    		}
    	%>
    	</SELECT></TD>
    </TR>
    <TR>
    	<TD>缩放比例</TD>
    	<TD><input type=text id=scaleBox class=layui-input style="width:150px" value="<%=scale %>"></TD>
    </TR>
    <TR>
    	<TD>固定表头&nbsp;</TD>
    	<TD><input type=checkbox id=scrollCheck onchange="$('#pagedCheck').prop('disabled',!$('#pagedCheck').prop('disabled'));"></TD>
    </TR>
    <TR>
    	<TD>固定表头后分页&nbsp;</TD>
    	<TD><input type=checkbox id=pagedCheck disabled></TD>
    </TR>
    <TR>
    	<TD>超链接</TD>
    	<TD>
    		<select style="width:150px" id=urlselects class="layui-input" id="hadfunctons" onchange="javascript:var sv=this.options[this.options.selectedIndex].value; if(sv!=''){urlBox.value=sv;}">	
    			<option value="">自定义</option>
    			<option value="onLineUser.jsp">用户在线列表</option>
    			<option value="welcome.jsp">默认首页</option>
    		</select>
    	</TD>
    </TR>
  	<TR>
	<TD>输入url</TD>
    	<TD><input type="textarea" class="layui-input" style="width:250px" onkeyup="urlReWrite();" id=urlBox value="<%=url%>"></TD>
    </TR>
  	<TR>
    	<TD colspan=2>(首页报表如果为空，则显示首页链接，两者都为空则显示空白)</TD>
	</TR>
  	<TR>
    	<TD colspan=2 style="PADDING-TOP: 10px" align=center>
    		<input class="layui-btn layui-btn-sm" type="button" onclick="submit()" value="提交"/>
    	</TD>
    </TR>
</TABLE>
</div>
<script language=javascript src="../../util.js">
</script>

<script language=javascript>
	function submit() {
		if( isEmpty( labelBox.value ) ) {
			alert( "请输入树名称！" );
			return;
		}
		var data = "&label=" + encodeURIComponent(labelBox.value);
		data += "&rpt=" + encodeURIComponent(raqBox.value) + "&scale=" + scaleBox.value;
		if( pagedCheck.checked ) data += "&paged=1";
		else data += "&paged=0";
		if( scrollCheck.checked ) data += "&scroll=1";
		else data += "&scroll=0";
		if( ! isEmpty( formBox.value ) ) data += "&form=" + encodeURIComponent(formBox.value);
		if( isEmpty( urlBox.value ) ) {
			urlBox.value = "welcome.jsp";
		}
		data += "&url=" + encodeURIComponent( urlBox.value );
		$.ajax({
			type:"post",
			url:"<%=request.getContextPath()%>/reportCenterServlet?action=6"+data,
			data:{},
			success:function(strRet){
				urlselects.value = "<%=url%>";
			},
			error:function(strRet){
				alert( "修改节点时错误:\n" + strRet );
			}
		});
	}
	
	raqBox.value = "<%=rpt%>";
	formBox.value = "<%=form%>";
	pagedCheck.checked = "<%=paged%>" == "1";
	if("<%=scroll%>" == "1"){
		scrollCheck.checked = true;
		$(pagedCheck).prop("disabled",false);
	}else{
		scrollCheck.checked = false;
	}
	urlselects.value = "<%=url%>";
	
	function urlReWrite(){
		 var opts = urlselects.childNodes;
		 for(var i = 0 ; i < opts.length; i++){
			 if(opts[i].value == urlBox.value) urlselects.value = urlBox.value; 
		 }
	 }
</script>

</body>
</html>
