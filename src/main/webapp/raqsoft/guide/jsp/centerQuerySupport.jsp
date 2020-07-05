<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.tag.*" %>
<%@ page import="com.raqsoft.guide.resource.*" %>
<%@ taglib uri="/WEB-INF/raqsoftQuery.tld" prefix="raqsoft" %>
<%
request.setCharacterEncoding("UTF-8");
String cp = request.getContextPath();
String dataSource = request.getParameter( "dataSource" );
if (dataSource == null) dataSource = "";
String dct = request.getParameter( "dct" );
if (dct == null) dct = "";
String vsb = request.getParameter( "vsb" );
if (vsb == null) vsb = "";

String infos[] = QueryTag.getDqlInfo(dataSource,dct,vsb);
String guideDir = cp + "/raqsoft/guide/";
String v = "469";
%>


<script type="text/javascript" src="<%=guideDir %>js/jquery-1.9.1.js"></script>
<script type="text/javascript" src="<%=guideDir %>js/common.js?v=<%=v %>"></script>
<script type="text/javascript" src="<%=guideDir %>js/json2.js"></script>
<script>

	var contextPath = '<%=cp%>';
	var guideConf = {};
	var lmdStr = "<%=infos[0]%>";
	guideConf.dictionary = "<%=infos[1]%>";
	guideConf.visibility = "<%=infos[2]%>";
</script>

<script type="text/javascript" src="<%=guideDir %>js/dqlApi.js?v=<%=v %>"></script>

<script>

	var dqlQuery = new DqlQuery();

	dqlQuery.setLmdStr(lmdStr);
	dqlQuery.setVsbStr(guideConf.visibility);
	dqlQuery.setDctStr(guideConf.dictionary);
	dqlQuery.detectLevel = 4;

	var cus = dqlQuery.confUtils;
	var mdUtils = dqlQuery.metadataUtils;
	
	function getTables() {
		try {
			return {"tables":mdUtils.getTables()};
		} catch(e) {
			console.error(e);
			return {"error":"load dataSource [<%=dataSource%>] error!"};
		}
	}
	
	try {
		parent.getLmdTables(getTables());
	} catch(e) {}
	
	console.log(getTables());
</script>

