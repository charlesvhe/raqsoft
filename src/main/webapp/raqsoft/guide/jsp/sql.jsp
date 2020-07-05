<%@ page contentType="text/html;charset=UTF-8" %>

<%@ page import="com.raqsoft.guide.web.dl.*" %>
<%@ page import="com.raqsoft.guide.*" %>
<%@ page import="com.raqsoft.guide.web.*" %>
<%@ page import="com.raqsoft.guide.web.sql.*" %>

<%
	String pageId = "ID" + System.currentTimeMillis();
	request.setCharacterEncoding("UTF-8");
	String cp = request.getContextPath();
	session.setAttribute("up_answer_", "1");
	String dlFile = request.getParameter("dlFile");
	String dbName = request.getParameter("dbName");
	session.setAttribute(pageId + "_db",dbName);
	String conf = null;
	if (dlFile != null) {
		//conf = SaveUtil.open(request);
	}
	
	//System.out.println(dbTables);
	
	/*
	String dbTables = "({tables:["+
		"{name:'北京通话记录',fields:[{name:'主叫号码',type:2,pk:0},{name:'被叫号码',type:2},{name:'开始时间',type:5},{name:'结束时间',type:5},{name:'主叫地区编码',type:2},{name:'被叫地区编码',type:2}]}"+
		",{name:'河北通话记录',fields:[{name:'主叫号码',type:2,pk:0},{name:'被叫号码',type:2},{name:'开始时间',type:5},{name:'结束时间',type:5},{name:'主叫地区编码',type:2},{name:'被叫地区编码',type:2}]}"+
		",{name:'用户表',fields:[{name:'号码',type:2,pk:1},{name:'地区编码',type:2},{name:'入网时间',type:5},{name:'身份证号码',type:2},{name:'用户类型',type:1}]}"+
		",{name:'公民表',fields:[{name:'身份证号码',type:2,pk:1},{name:'姓名',type:2},{name:'籍贯',type:2},{name:'性别',type:1},{name:'出生日期',type:3}]}"+
		",{name:'地区表',fields:[{name:'地区编码',type:2,pk:1},{name:'地区名称',type:2}]}"+
		//",{name:'地区表',sql:'...',def:'...',fields:[{name:'地区编码',type:2,pk:1},{name:'地区名称',type:2}]}"+
		"]})";
	*/
	String dbTables = DBUtils.getDBJson("HSQL");
	
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<HTML>
<HEAD>
	<TITLE>SQL查询</TITLE>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="<%=cp %>/raqsoft/guide/css/style.css" type="text/css">
	<link rel="stylesheet" href="<%=cp %>/raqsoft/guide/js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
	<!-- link rel="stylesheet" href="<%=cp %>/raqsoft/guide/js/SelectBoxIt/sbi.css" type="text/css"> -->
	<link rel="stylesheet" href="<%=cp %>/raqsoft/guide/js/selectric/selectric-modern2.css" type="text/css">
	<style>
		.filter{/*padding-right:20px;*/border:1px solid #CCCDCF;height:19px;}
		input {padding:0;border:0;border-bottom:1px solid lightgray;}
		textarea {border:1px solid lightgray;}
		.attrTitle {color:#186EB3;float:left;padding:3px 20px 0 0;}
		.attrBody {float:left;padding:3px 0 0 0;}
		#selectedFields div:after { clear:both; content:'.'; display:block; height:0; line-height:0; font-size:0; visibility:hidden; padding:0; margin:0; }
		#allFields div:after { clear:both; content:'.'; display:block; height:0; line-height:0; font-size:0; visibility:hidden; padding:0; margin:0; }
		select {padding:0;font-size:12px;margin:0;line-height:0;}
		#feedback { font-size: 1.4em; }
		#dimItemsDiv .ui-selecting { background: #FECA40; }
		.selectedfilter {background: #F39814;}
		#dimItemsDiv { list-style-type: none; margin: 0; padding: 0; }
		#dimItemsDiv li { margin: 1px; padding: 3px 10px 3px 10px; float: left; height: 22px; font-size: 12pt; text-align: center; }
		.hideDiv {filter:alpha(opacity=0);-moz-opacity:0;opacity: 0;}
		connection {border-radius: 50px;}
	</style>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery-1.9.1.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/common.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery.layout.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery-ui-1.10.1.custom.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery-ui-timepicker-addon.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery.tooltip.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery.bgiframe.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery.qtip-1.0.0-rc3.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/raphael-min.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery.tools.min.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/jquery.blockUI.js"></script>
	<!-- script type="text/javascript" src="../js/SelectBoxIt/sbi.js"></script-->
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/sql.js"></script>
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/artDialog/jquery.artDialog.source.js?skin=blue"></script>
	<!-- script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/ztree/js/jquery.ztree.all-3.5.min.js"></script> -->
	<script type="text/javascript" src="<%=cp %>/raqsoft/guide/js/selectric/js/jquery.selectric.js"></script>
	

	<SCRIPT LANGUAGE="JavaScript">
		var contextPath = '<%=cp%>';
		var consts = {
			relaPath : 'raqsoft/guide/',
			imgFolder : '/img/dl/',
			color1 : '#373636',//大部分字体颜色
			color2 : '#FFFFFF',
			color3 : '#F0F2F4',//弹出窗口按钮区域背景色
			color4 : '#91A3CA',//弹出窗口中确定按钮的边框
			color5 : '#0E399B',//弹出窗口中确定按钮的字色
			color6 : '#0E399B',//弹出窗口中取消按钮的边框
			color7 : '#DFE5EB',//设置条件弹出窗口表头背景色
			color8 : '#BFC2C6',//表格线颜色
			color9 : '#494A4B',//表头字颜色
			color10 : '#BBBEC3',//区域边框色
			color11 : '#D1DCED',//查询按钮背景色
			color12 : '#DDDDDD',//右侧字段列表中，字段之间的边框线
			color13 : '#FFFFDD',//拖拽字段允许落选区域的背景色。
			color14 : '#FFEE8F',//拖拽字段落选区域的背景色。
			color15 : '#BCD4EC',//'#456685',//弹出窗口标题背景色
			color16 : '#BFBDC4',//BY,ON关系箭头颜色
			color17 : '#E9E9E9',//选中字段行的背景色
			color18 : '#FBF8FB',//不同表区之间的间隔背景色。
			color19 : '#A8EDF3',//结果集表头中，on字段的背景色。
			color20 : '#D9D9D9',//操作表头格子背景色
			color21 : '#E5E6E8',//操作格子背景色
			color22 : '#373636',//文本框，下拉框里面的字体颜色
			color23 : '#373636',//资源区字段字体颜色
			color24 : '#',
			img1 : 'split_h.png',
			img2 : 'split_v.png',
			img3 : 'banner_bg.jpg',
			img4 : 'banner_left.jpg',
			img5 : 'banner_right.png',
			img6 : 'tr.png',
			img7 : 'tab.png',
			img8 : 'tab-1.png',
			img9 : 'tab-2.png',
			img10 : 'tab-3.png',
			img11 : 'up2.png',
			img12 : 'down2.png',
			img13 : 'tab-split.png',
			img14 : 'item.png',
			img15 : 'open.png',
			img16 : 'close.png',
			img17 : 'blank.png',
			img18 : 'fk.png',
			img19 : 'pk.png',
			img20 : 'copy.png',
			img21 : 'delete.png',
			img22 : 'result_dim.png',
			img23 : 'result_field.png',
			img24 : 'calc_field.png',
			img25 : 'open_locator.png',
			img26 : 'item-dim.png',
			img27 : 'item-subtable.png',
			img28 : 'tab-4.png',
			img29 : ''
		}
		
		//数据库1:默认分组1:可用分组2：可用分组3...;数据库2:默认分组1:可用分组2：可用分组3...

		var pageId = "<%=pageId%>";
		var contextPath = '<%=cp%>';
		var dbInfos = eval("<%=dbTables%>");
		var useMiddleTable = true;
		var dbName = '<%=dbName%>';
		var guideConf = {};
		guideConf.guideDir = '/raqsoft/guide/';
		$(document).ready(function(){
			<%if (conf != null){
				String[] confs = conf.split("<;>");
//				System.out.println(confs[0]);
//				System.out.println(confs[1].replaceAll("'","\\\\'"));
			%>
				domInfos = eval("({<%=confs[0]%>})");
				<%if (confs.length > 1){%>
					var conf2 = eval('({<%=confs[1].replaceAll("'","\\\\'")%>})');
					for (var i=0; i<conf2.tables.length; i++){
						dbInfos.tables[dbInfos.tables.length] = conf2.tables[i];
					}
				<%}%>
			<%}%>
			initPage();
		});
		onbeforeunload='return close();';
		//-->
	</SCRIPT>
</HEAD>

<BODY style='font-size:12px;'>
	<div id='bodyDiv' style='width:100%;height:100%;display:none;'>
		<div style="display:none;">
			<div id="setTableInfo" title="设置表信息" style="font-size:12px;padding:1px;overflow:hidden;">
				<div style="height:100px;clear:both;">
					<div style="float:left;margin-left:20px;padding-top:20px;"><div style='float:left;'>主表：</div><div style='float:left;width:100px;' id='tables'></div></div>
					<div id='jtDiv' style="float:left;margin-left:20px;padding-top:20px;"><div style='float:left;'>与上表：</div><div style='float:left;width:80px;'><input type='radio' name='joinType' value=3 checked>默认<br><input type='radio' name='joinType' value=0>取交集<br><input type='radio' name='joinType' value=1>向左对齐<br><input type='radio' name='joinType' value=2>取并集</div></div>
				</div>
			</div>
			<iframe name="saveFrame" id="saveFrame" height="100px" width="100px"></iframe>
			<iframe id='hiddenFrame' name='hiddenFrame' height="100px" width="100px"></iframe>
			<form id=downSQLXForm method=post ACTION="<%=cp%>/servlet/dataSphereServlet?action=36" target=hiddenFrame>
				<input type=hidden name=path id=path value="">
				<input type=hidden name=dlConf id=dlConf value="">
				<input type=hidden name=type id=type value="">
				<input type=hidden name=pageId id=pageId value="">
			</form>
		</div>

		<div class="ui-layout-north dl_img1" style='border:0px;overflow:hidden;'>
		</div>
		
		<div class='ui-layout-center' style="border:0px;">
			<div class='ui-layout-toolbar' style="border-bottom:2px solid #1F83B7;padding:3px 0 2px 2px;background-color:#FAFBF9;overflow:hidden;">
				<span id="toolbar" style=''>
					<div style='float:left;'>
						<img src='<%=cp %>/raqsoft/guide/img/dl/undo-h.png' id="undoBut" title="撤销" onclick='operations.undo();' style='border:0px;cursor:pointer;'>
						<img src='<%=cp %>/raqsoft/guide/img/dl/redo-h.png' id="redoBut" title="重做" onclick='operations.redo();' style='border:0px;cursor:pointer;'>
						<img src='<%=cp %>/raqsoft/guide/img/dl/split.png' style='border:0px;'>
						<img src='<%=cp %>/raqsoft/guide/img/dl/query.png' id="queryBut" onclick='querySql();' type='button' title='查询' style='border:0px;cursor:pointer;'>
						<img src='<%=cp %>/raqsoft/guide/img/dl/save-gex.png' id="addTableBut" onclick='addMiddleTable()' type='button' title='存为逻辑中间表' style='border:0px;cursor:pointer;'>
						<img src='<%=cp %>/raqsoft/guide/img/dl/create-table.png' id="createTableBut" onclick='createMiddleTable()' type='button' title='存为真实中间表' style='border:0px;cursor:pointer;'>
						<img src='<%=cp %>/raqsoft/guide/img/dl/save-local.png' onclick='saveLocalSQLX()' id='saveLocalBut' type='button' title='保存到本机' style='border:0px;cursor:pointer;'>
						<!-- 
						<img src='<%=cp %>/raqsoft/guide/img/dl/save.png' onclick='alert("待实现");' id='saveBut' type='button' title='保存' style='border:0px;cursor:pointer;'>
						-->
						<a href="javascript:void(0);" title="打开本机qyx" id="openLocalBut" style="background-image:url(<%=cp %>/raqsoft/guide/img/dl/open-local.png);overflow:hidden;display:-moz-inline-box;display:inline-block;width:35px;height:26px;vertical-align:top;">
							<form id="openSQLXForm" METHOD=POST ACTION="<%=request.getContextPath()%>/servlet/dataSphereServlet?action=10" ENCTYPE="multipart/form-data" target=hiddenFrame>
								<input title='选择本地查询文件' id="localSQLXFile" name="localSQLXFile" onchange="openLocalSQLX();" type="file" style="margin-left:-160px;filter:alpha(opacity=0);opacity:0;cursor:pointer;" />
								<input type=hidden name=path id=upPath value="tmp">
							</form>
						</a>
					</div>
				</span>
			</div>
			<div id='innerLayout' style="border:0px;">
				<div class='inner-north dl_c9' id='mainDiv' style="">
					<div id='mainTop' style="padding:15px 0 0 15px;width:%95;">
						<div id="structDiv" style="float:left;color:gray;"></div>
						<div id='finalSql' style='float:left;padding:0 0 10px 0;'></div>
						<div style='clear:both;'></div>
					</div>
					<div style='font-size:1px;height:8px;background-image:url(<%=cp %>/raqsoft/guide/img/dl/sql-split.png)'>&nbsp;</div>
					<div id='rsAttrsDiv'>
						<div id="connectDiv" style='padding:5px 0 2px 15px;border-bottom:1px solid lightgray;'>
							<div class='attrTitle'><img style='margin-right:5px;vertical-align:middle;' src='<%=cp %>/raqsoft/guide/img/dl/sql-connect.png'><span>连接设置</span></div>
							<div class='attrBody' id='joinInfos' style='padding:0 0 4px;'>
								<div id='d1' style='float:left;margin-right:30px;'><select id='connectType'></select></div>
								<div id='d2' style='float:left;'><select id='joint1'></select></div>
								<div id='d3' style='float:left;'>.</div>
								<div id='d4' style='float:left;'><select id='joinf1'></select></div>
								<div id='d5' style='float:left;padding:4px 6px 0 6px'><a href='#'>等于</a></div>
								<div id='d6' style='float:left;'><select id='joint2'></select></div>
								<div id='d7' style='float:left;'>.</div>
								<div id='d8' style='float:left;padding-right:10px;'><select id='joinf2'></select></div>
								<div id='connectDispBut' style='float:left;margin-top:2px;cursor:pointer;'><img title='显示/隐藏连接关系' id='controlConnects' onclick='toggleConnects()' src='<%=cp %>/raqsoft/guide/img/dl/sql-hide.png' style='border:0px;'></div>
								<div id='connectRelations' style='float:left;'></div>
							</div>
							<div style='clear:both;'></div>
						</div>
						<div style='padding:5px 0 4px 15px;border-bottom:1px solid lightgray;'>
							<div class='attrTitle'><img style='margin-right:5px;vertical-align:middle;' src='<%=cp %>/raqsoft/guide/img/dl/sql-all-field.png'><span>全部字段</span></div>
							<div class='attrBody fieldSortable' id='allFields' style='padding:0;'>
							</div>
							<div style='clear:both;'></div>
						</div>
						<div style='padding:5px 0 2px 15px;border-bottom:1px solid lightgray;'>
							<div class='attrTitle'><img style='margin-right:5px;vertical-align:middle;' src='<%=cp %>/raqsoft/guide/img/dl/sql-field-config.png'><span>字段设置</span></div>
							<div id='fieldAttrs' class='attrBody'>
								<div aggr='sum' style='float:left;margin:0 10px 5px 0;'><img style='vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-sum.png'>求和</div>
								<div aggr='count' style='float:left;margin:0 10px 5px 0;'><img style='vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-count.png'>计数</div>
								<div aggr='avg' style='float:left;margin:0 10px 5px 0;'><img style='vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-avg.png'>平均</div>
								<div aggr='max' style='float:left;margin:0 10px 5px 0;'><img style='vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-max.png'>最大</div>
								<div aggr='min' style='float:left;margin:0 10px 5px 0;'><img style='vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-min.png'>最小</div>
								<div order='1' style='float:left;margin:0 10px 5px 0;'><img style='vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-up.png'>升序</div>
								<div order='2' style='float:left;margin:0 10px 5px 0;'><img style='vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-down.png'>降序</div>
							</div>	
							<div style='clear:both;'></div>
						</div>
						<div style='padding:5px 0 4px 15px;border-bottom:1px solid lightgray;'>
							<div class='attrTitle'><img style='margin-right:5px;vertical-align:middle;' src='<%=cp %>/raqsoft/guide/img/dl/sql-select-field.png'><span>选出字段</span></div>
							<div class='attrBody fieldSortable' id='selectedFields' style='padding:0;min-height:20px;'>
							</div>
							<div style='clear:both;'></div>
						</div>
						<div style='padding:5px 20px 2px 15px;border-bottom:0px solid lightgray;'>
							<div style='float:left;width:49%;'>
								<div class='attrTitle' style='padding-bottom:2px;'><img style='margin-right:5px;vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-where.png'><span>过滤条件(WHERE)</span></div>
								<textarea id='whereInput' style='width:100%;height:60px;'></textarea>
							</div>
							<div style='float:right;width:49%'>
								<div class='attrTitle' style='padding-bottom:2px;'><img style='margin-right:5px;vertical-align:-3px;' src='<%=cp %>/raqsoft/guide/img/dl/sql-having.png'><span>分组过滤(HAVING)</span></div>
								<textarea id='havingInput' style='width:100%;height:60px;'></textarea>
							</div>
							<div style='clear:both;'></div>
						</div>
					</div>
		 		</div>

				<div class="dl_c9" id="mytabs" style='overflow-y:hidden;padding:1px;'>
					<div style="display:none;" class="top_nav">
						<ul style='list-style-type:none;margin:0px;padding: 0 0 0 15px;'>
							<li title='拖拽维到左边维区域'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-1' onclick='selectTab(1)' class='selected' href="#"><img class='dl_img6' style='vertical-align:middle;border:0px;' src=''>维</a></li>
							<li style='display:none;' title='双击表，打开附表组'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-4' onclick='selectTab(4)' href="#"><img class='dl_img12' style='vertical-align:middle;border:0px;' src=''>表</a></li>
							<li title='双击字段，打开该字段的所在附表'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-2' onclick='selectTab(2)' href="#"><img class='dl_img7' style='vertical-align:middle;border:0px;' src=''>数据项</a></li>
							<li title='拖拽字段到左边字段区域、维表关系列'><a style='width:75px;padding:5px 0 7px 0;' id='tabs-btn-3' onclick='selectTab(3)' href="#"><img class='dl_img8' style='vertical-align:middle;border:0px;' src=''>字段</a></li>
						</ul>
					</div>
					<div id="tabs-2" style='overflow:hidden;'>
						<div class="east-west" style='border:0px;overflow-y:auto;margin:0px;'>
							<div><input type='text' id='tableFilter' style='width:99%;border:1px solid lightgray;'/></div>
							<div id='tableDiv' style='border:0;padding:0px;'></div>
						</div>
					</div>
				</div>
			</div>

			<div class="inner-center dl_c9" id='resultSetDiv' style='overflow:hidden;'>
				<div id='designResultSet' style='padding:5px;'>
					<table class='dl_c5' style='table-layout:fixed;border-collapse:separate;' border=0 cellspacing=0 cellpadding=0>
						<tr id="resultSetHeader" style='height:26px;text-align:center;'></tr>
						<tbody id="resultSetBody"></tbody>
					</table>
				</div>
				<div id='rsDiv' style='display:none;width:100%;height:100%;overflow:hidden;'>
					<iframe name="rsFrame" id="rsFrame" height="100%" width="100%" style='border:0;'></iframe>
				</div>
			</div>
		</div>
	</div>
</BODY>	
</HTML>


