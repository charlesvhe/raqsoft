<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/raqsoftReport.tld" prefix="report" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.raqsoft.report.usermodel.Context"%>

<html>
<link type="text/css" href="css/style.css" rel="stylesheet"/>
<head>
<STYLE>.clsMenu {
	BORDER-RIGHT: buttonhighlight 2px outset; BORDER-TOP: buttonhighlight 2px outset; VISIBILITY: hidden; BORDER-LEFT: buttonhighlight 2px outset; WIDTH: 200px; CURSOR: default; COLOR: menutext; BORDER-BOTTOM: buttonhighlight 2px outset; POSITION: absolute; BACKGROUND-COLOR: menu
}
.menuitems {
	PADDING-RIGHT: 5px; PADDING-LEFT: 5px; FONT-SIZE: 12px; COLOR: #000000; LINE-HEIGHT: 18px
}
</STYLE>
 
<SCRIPT language=JavaScript1.2> 
 
function disableclick(e) {
if (document.all) {
  if (event.button==1||event.button==2||event.button==3) {
    if (event.srcElement.tagName=="A"){
 
          //event.srcElement.onclick=disClick;
          event.srcElement.oncontextmenu=disClick;
		  //alert(event.srcElement);
          //return popMenu(event.srcElement);
          //alert(location.target);
          return false;
       
     }
     else{
        if (event.srcElement.tagName!="DIV"){
           hidemenu();
           return false;
        }
     }
   }
 }
}
 
function disClick(){
  return false;
}
if (document.all){
document.onmousedown=disableclick;
}
</SCRIPT>
 
<SCRIPT> 
 
var strMenu = "<div id=\"menu\" class=\"clsMenu\" onMouseover=\"highlight()\" onMouseout=\"lowlight()\">"
strMenu += "</div>"
 
// 判断客户端浏览器
function ie() {
	if (navigator.appName=="Microsoft Internet Explorer") {
		return true;
	} else {
		return false;
}}
 
function showmenu(){
	if (ie()){
	var rightedge=document.body.clientWidth-event.clientX
	var bottomedge=document.body.clientHeight-event.clientY
	if (rightedge<menu.offsetWidth)
		menu.style.left=document.body.scrollLeft+event.clientX-menu.offsetWidth
	else
		menu.style.left=document.body.scrollLeft+event.clientX
	if (bottomedge<menu.offsetHeight)
		menu.style.top=document.body.scrollTop+event.clientY-menu.offsetHeight
	else
		menu.style.top=document.body.scrollTop+event.clientY
 
		menu.style.visibility="visible"
 
	}
	return false
}
 
function sysMenu(){
	return false
}
 
// 隐藏菜单
function hidemenu(){
	if (ie()) menu.style.visibility="hidden"
}
 
// 菜单项获得焦点时加亮显示
function highlight(){
	if (event.srcElement.className=="menuitems"){
		event.srcElement.style.backgroundColor="highlight"
		event.srcElement.style.color="highlighttext"
}}
 
// 菜单项失去焦点
function lowlight(){
	if (event.srcElement.className=="menuitems"){
	event.srcElement.style.backgroundColor=""
	event.srcElement.style.color="menutext"
}}
function openNewWindow(winhref,winstyle){
	    var objNewWindow = window.open(winhref,"",winstyle);
		objNewWindow.focus();
 
}
if (ie()) document.write (strMenu);
</SCRIPT>
 
<SCRIPT language=jscript>
 function popMenu(cb) {
	var SubstrMenu = "<div class=\"menuitems\" onClick=\"window.open('http://127.0.0.1:6666/demo/reportJsp/analysis.jsp?rpx=订单报表/emp.rpx&month="+cb+"','_blank')\">["+cb+"]-雇员-金额统计图</div>"
 
        SubstrMenu += "<div class=\"menuitems\" onClick=\"\">["+cb+"]-供应商-金额统计图</a></div>"
        SubstrMenu += "<hr>"
 
        SubstrMenu += "<div class=\"menuitems\" onClick=\"\">["+cb+"]-本月任务完成情况</div>"
        SubstrMenu += "<div class=\"menuitems\" onClick=\"\">["+cb+"]-本月盈亏分析图</div>"
 
        SubstrMenu += "<hr>"
        SubstrMenu += "<div class=\"menuitems\" onClick='hidemenu()'>隐藏此菜单</a></div>"
        menu.innerHTML = SubstrMenu;
		showmenu();
		return false;
	}
</SCRIPT>
</head>
<body topmargin=0 leftmargin=0 rightmargin=0 bottomMargin=0>
<%
	request.setCharacterEncoding( "UTF-8" );
	String report = request.getParameter( "rpx" );
	String reportFileHome=Context.getInitCtx().getMainDir();
	StringBuffer param=new StringBuffer();
	
	//保证报表名称的完整性
	int iTmp = 0;
	if( (iTmp = report.lastIndexOf(".rpx")) <= 0 ){
		report = report + ".rpx";
		iTmp = 0;
	}
	
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

	//以下代码是检测这个报表是否有相应的参数模板
	String paramFile = report.substring(0,iTmp)+"_arg.rpx";
	File f=new File(application.getRealPath(reportFileHome+ File.separator +paramFile));

%>
<jsp:include page="toolbar.jsp" flush="false" />
<table id="rpt" align="center" width=100% height=100%>
<%	//如果参数模板存在，则显示参数模板
	if( f.exists() ) {
	%>
	<tr><td align=center>
		<table id="param_tbl"><tr><td>
			<report:param name="form1" paramFileName="<%=paramFile%>"
				needSubmit="no"
				params="<%=param.toString()%>"
				
			/>
		</td>
		<td><a href="javascript:_submit( form1 )"><img src="../raqsoft/images/query.jpg" border=no style="vertical-align:middle"></a></td>
		</tr></table>
	</td></tr>
	<% }%>


	<tr><td align=center valign=top height=100%>
		<report:html name="report1" reportFileName="<%=report%>"
			scrollWidth="950"         
			needScroll="no"         
			scrollHeight="350"         
			funcBarLocation="top"
			scrollBorder="border:1px solid red" 
			needPageMark="yes"
			generateParamForm="no"
			params="<%=param.toString()%>"
			exceptionPage="/reportJsp/myError2.jsp"
			appletJarName="raqsoftReportApplet.jar"
		/>
	</td></tr>
</table>

<script language="javascript">
	//设置分页显示值
	
	document.getElementById( "t_page_span" ).innerHTML=report1_getTotalPage();
	document.getElementById( "c_page_span" ).innerHTML=report1_getCurrPage();

</script>
</body>
</html>
