<%@ page contentType="text/html;charset=utf-8"%>
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isELIgnored="false" %> 
<%@ page import="com.raqsoft.center.console.*" %>
<%@ page import="com.raqsoft.center.*" %>
<%@ page import="com.raqsoft.center.entity.*" %>
<%@ page import="com.raqsoft.center.util.CharTranslation" %>
<%@ page import="com.raqsoft.common.*" %>
<%@ page import="com.raqsoft.report.view.*"%>
<%
	String appmap = request.getContextPath();
	
	request.setCharacterEncoding( "UTF-8" );
	String id = request.getParameter( "id" );
	String action = request.getParameter( "action" );
	String title = "新增";
	String label = request.getParameter( "label" );
	String servletActionNum = "7";
	if(label == null || label.trim().length() == 0){
		if( action.equals( "2" ) ) {
			title = "插入";
			servletActionNum = "15";
		}
	}else{
		title = label;
		servletActionNum = "10";
	}
	String mark= request.getParameter( "mark" );
	String type = request.getParameter( "type" );
	String roles = request.getParameter( "roles" );
	String rpt = request.getParameter( "rpt" );
	String form = request.getParameter( "form" );
	String url = request.getParameter( "url" );
	String scale = request.getParameter( "scale" );
	String useJsp = request.getParameter( "useJsp" );
	if(useJsp == null){
		useJsp = "default";
	}
		
	if(scale == null){
		scale="1.0";
	}
	String paged = request.getParameter( "paged" );
	String genpf = request.getParameter( "genpf" );
	String scroll = request.getParameter( "scroll" );
	String params = request.getParameter( "params" );
	if(params == null || params.length() == 0){
		params="";//下版本json格式替换[]
	}
	String dqldb = request.getParameter( "dqldb" );
	String dct = request.getParameter( "dct" );
	String vsb = request.getParameter( "vsb" );
	String qyx = request.getParameter( "qyx" );
	String afile = request.getParameter( "afile" );
	String treeStructure = "";
	if("yes".equals(request.getParameter("isTree"))) treeStructure = "isTree";
	if("yes".equals(request.getParameter("isOlap"))) treeStructure = "isOlap";
	String query = request.getParameter( "query" );
	String busiDir = request.getParameter( "busiDir" );
	String dataFileType = request.getParameter( "dataFileType" );
	String analyseDB = request.getParameter( "analyseDB" );
	String analyseSQL = request.getParameter( "analyseSQL" );
	String anaDqldb = request.getParameter( "anaDqldb" );
	String anaTables = request.getParameter( "analyseTables" );
	String dfxScript = request.getParameter( "dfxScript" );
	if(dfxScript == null){
		dfxScript = "";
	}
	String queryType = request.getParameter( "queryType" );
	String fixedTable = request.getParameter( "fixedTable" );
	String anaFile = request.getParameter( "analyseFile" );
	if("null".equals(anaFile)) anaFile = null;
	String dfxParams = request.getParameter( "dfxParams" );
	String analyseType = request.getParameter( "analyseType" );
	String reWrite = request.getParameter("reWrite");
	String authorizedType = request.getParameter( "authorizedType" );
	String aggrDataFilesValue = request.getParameter("aggrDataFiles");
	if(aggrDataFilesValue == null){
		aggrDataFilesValue = "";
	}
	String[] segs = null;
	if(roles != null){
		segs = roles.split(";");
	}
	String[] tmpGroups = null;
	if(segs != null && segs.length > 0 && segs[0].length() > 0){
		tmpGroups = segs[0].split("=");
	}else{
		tmpGroups = new String[]{};
	}
	String groups ="";
	if(tmpGroups.length > 1) groups = tmpGroups[1];
	String users = "";
	if(segs != null && segs.length > 1 && segs[1].length() > 0){
		tmpGroups = segs[1].split("=");
	}else{
		tmpGroups = new String[]{};
	} 
	if(tmpGroups.length > 1) users = tmpGroups[1]; 
	if( groups == null ) groups = "";
	if( users == null ) users = "";
	Config cfg = Center.getConfig( );
	com.raqsoft.center.entity.Role[] configroles = cfg.getRoles();
	UserManagerInterface umi = Center.getUserManager();
	com.raqsoft.center.entity.User[] user = umi.getUsers();
	com.raqsoft.center.entity.Report[] reports = cfg.getReports();
	String[] dbs = cfg.getDbs();
	Object[] dqldbs = cfg.getSpecifiedDbs("com.datalogic.jdbc.LogicDriver");
	String dct_vsb_json = cfg.getDctVsbJson();
	String role_user_json = cfg.getRoleUserJson();
	String[] qyxs = cfg.getFilesBySuffixType(new String[]{"qyx"});
	String inputHome = cfg.getInputHome();
	String[] afiles = cfg.getFilesBySuffixType(new String[]{});
	
	if(analyseType != null){
		afiles = cfg.getFilesByAnalyseType(analyseType);
	}
	String fileRoot = cfg.getFileRoot();
	
	RoleDb ugd=cfg.getUserGroupDbConfig();
	String ds=ugd.getDs();
	String userDb=ugd.getUserName();
	String table=ugd.getTable();
%>
<html>
<head>
<script type="text/javascript" src="<%=appmap%>/js/jquery.js"></script>
<script type="text/javascript" src="<%=appmap%><%=ReportConfig.raqsoftDir%>/center/js/tools.js"></script>
<script src="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/layui/layui.js"></script>
<script src="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/layui/layui.all.js"></script>
<script src="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/node.js"></script>
<link rel="stylesheet" href="<%=appmap %><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<style>
body{
	background-color: #eee;
}
</style>
<script language="javascript">	
	var isModify = "<%=servletActionNum%>"=="10";
	var appmap = "<%=appmap%>";
	var raqdir = "<%=ReportConfig.raqsoftDir%>";
	var leftIFrameWin;
	var params = '<%=params%>';
	var inputHome = '<%=inputHome%>';
	var anaFile = '<%=anaFile%>';
   	function changeReportType(type){
		  window.location="<%=request.getContextPath()%>/centerJsp/addSubNode.jsp?"+
		  'id=<%=id%>&action=<%=action%>&type=<%=type%>&url=<%=url%>&label=<%=label%>&roles=<%=roles%>&rpt=<%=rpt%>&form=<%=form%>&scale=<%=scale%>&paged=<%=paged%>&scroll=<%=scroll%>&params=<%=params%>&query=<%=query%>&authorizedType=<%=authorizedType%>&mark='+type;
	}

	 function selectall(){
		var arr = new Array();
		var role_user_json = '<%=role_user_json%>';
		var r_u_arr = JSON.parse(role_user_json);
		for(var r = 0; r < r_u_arr.length; r++){
			arr[arr.length] = r_u_arr[r].r;
		}
		formSelects.render({
			name:"xm-select1",
			init:arr
		});
		arr = new Array();
		for(var r = 0; r < r_u_arr.length; r++){
			var users = r_u_arr[r].u;
			for(var u = 0; u < users.length; u++){
				arr[arr.length] = users[u];
			}
		}
		formSelects.render({
				name:"xm-select2",
				init:arr
		});
	 }
	 
	 function getLmdTables(tables){
		 $('#anaTables').empty();
		 if(tables.tables == null){
			 $('#anaTables').append("<OPTION value=\"\">未查到</OPTION>");
			 $('#anaTables').css("height","30px");
			 return;
		 }
		 $.each(tables.tables, function(o1, o2) {
			 var tables = "";
			 if(typeBox.value == "4"){
				 tables = '<%=anaTables%>';
			 }else if(typeBox.value == "3"){
				 tables = '<%=fixedTable%>';
			 }
			 
			 tables = tables.split(',');
			 var sel = "";
			 for(var i = 0; i < tables.length; i++){
				 if(tables[i] == o2.name){		
					 sel = " selected"
				 }
			 }
			 $('#anaTables').append("<OPTION value=\""+o2.name+"\""+sel+">"+o2.dispName+"</OPTION>");
		});
		 $('#anaTables').css("height","130px");
	 }
	 
	 function lookoverdir(appendToItem, valueNoRoot){
		 $.ajax({
				type:"post",
				url:appmap+"/reportCenterServlet?action=40",
				dataType: 'json', 
				data:{},
				success:function(strRet){
					var jsonArr = eval(strRet);
					$(appendToItem).empty();
					$(appendToItem).append("<OPTION style=\"color:#DDD\" value='.' disabled selected>选择目录会拼接到填报文件目录</OPTION>");
					$(appendToItem).append("<option value='' style='color:blue'>填报根路径</option>");
					$.each(jsonArr, function(o1, o2) {
						var o3 = o2;
						if(valueNoRoot){
							var pos = inputHome.length + 1;
							o3 = o2.substring(pos);
						}
						 $(appendToItem).append("<OPTION value=\""+o3+"\">"+o2+"</OPTION>");
					});
					 appendToItem.value = "<%=busiDir%>";
				},
				error:function(strRet){
					alert( "错误:\n" + strRet );
				}
		});
	 }
	 
	 function filter(event){
		 $(dctBox).empty();
		 $(dctBox).append("<OPTION value=\"\"></OPTION>");
		 $(vsbBox).empty();
		 $(vsbBox).append("<OPTION value=\"\"></OPTION>");
		 var json = eval("("+"<%=dct_vsb_json%>"+")");
		 var fileRoot = "<%=fileRoot%>";
		 for(var i = 0; i < json.length; i++){
			 for(var key in json[i]){
				 if(key == event.value){
					 var selections = json[i][key];
					 for(var j = 0; j < selections.length; j++){
						 var dcts = selections[j]['dcts'];
						 for(var k = 0; k < dcts.length; k++){
							 var select = "";
							 if(fileRoot+"/"+dcts[k] == "<%=dct%>"){
								 select = "selected"
							 }
							 $(dctBox).append("<OPTION "+select+" value=\""+fileRoot+"/"+dcts[k]+"\">"+dcts[k]+"</OPTION>");
						 }
						 var vsbs = selections[j]['vsbs'];
						 for(var k = 0; k < vsbs.length; k++){
							 var select = "";
							 if(fileRoot+"/"+vsbs[k] == "<%=vsb%>"){
								 select = "selected"
							 }
							 $(vsbBox).append("<OPTION "+select+" value=\""+fileRoot+"/"+vsbs[k]+"\">"+vsbs[k]+"</OPTION>");
						 }
					 }
				 }
			 }
		 }
	 }
	 
	 function filterByType(typ){
		 $.ajax({
				data:[],
				url:appmap+"/reportCenterServlet?action=44&type="+typ,
				type:'post',
				success:function(shts){
					var shtsArr = shts.split(';');
					$(raqBox).empty();
					 for(var k = 0; k < shtsArr.length; k++){
						 var sht = shtsArr[k];
						 var k_v = sht.split(',');
						 var option = "";
						 option += "<OPTION value=\""+k_v[1]+"\" " ;
						 if('<%=rpt%>' == k_v[1]){
							 option += "selected";
						 }
						 option += ">"+k_v[0]+"</OPTION>";
						 $(raqBox).append(option);
					 }
				}
		});
	 }
	 
	function submitNode() {
		if( isEmpty( labelBox.value ) ) {
			alert( "请输入节点名称！" );
			return;
		}
		if( (typeBox.value == "1" || typeBox.value == "5") && isEmpty( raqBox.value ) ) {
			alert( "请输入节点对应的报表！" );
			return;
		}
		else if( typeBox.value == "2" && isEmpty( urlBox.value ) ) {
			alert( "请输入节点对应的超链接！" );
			return;
		}
		else if( (typeBox.value == "3") 
				&& isEmpty(queryBox.value) && isEmpty(qyxBox.value) ) {
			alert( "请正确配置dql数据库或qyx文件！" );
			return;
		}
		var data1 = "&id=<%=id%>&type=" + typeBox.value + "&label=" + encodeURIComponent( labelBox.value );
		if(formSelects.value("xm-select1","val").length > 0) data1 += "&groups=" + formSelects.value("xm-select1","val");
		if(formSelects.value("xm-select2","val").length > 0) data1 += "&users=" + formSelects.value("xm-select2","val");
		var anaTables_values = getSelectedValues($('#anaTables')[0]);
		if(typeBox.value == "1" || typeBox.value == "5" || typeBox.value == "6") {
			data1 += "&rpt=" + encodeURIComponent(raqBox.value) + "&scale=" + scaleBox.value;
			//2018.12.17
			if( matchCheck.checked ) data1 += "&useJsp=matchReport.jsp";
			else data1 += "&useJsp=default";
			if( pagedCheck.checked ) data1 += "&paged=1";
			else data1 += "&paged=0";
			if( scrollCheck.checked ) data1 += "&scroll=1";
			else data1 += "&scroll=0";
			if( ! isEmpty( formBox.value ) ) data1 += "&form=" + encodeURIComponent( formBox.value );
			//data1 += "&params=" + encodeURIComponent( reportParams.value );
		}
		if(typeBox.value == "1"){
			var treeOrOlap = $("form[name=radioForm_TreeStructure] input[name='treeStructure']");
			if(treeOrOlap[0].checked == true)
				data1 += "&"+treeOrOlap[0].value+"=yes";
			else if(treeOrOlap[1].checked == true)
				data1 += "&"+treeOrOlap[1].value+"=yes";
		}
		if( typeBox.value == "2" ) {
			data1 += "&url=" + encodeURIComponent( urlBox.value );
		}
		if( typeBox.value == "3" ) {
			data1 += "&dqldb=" + encodeURIComponent( queryBox.value )
				 + "&dct=" + encodeURIComponent( dctBox.value )
				 + "&vsb=" + encodeURIComponent( vsbBox.value )
				 + "&fixedTable=" + encodeURIComponent(anaTables_values )
				 + "&qyx=" + encodeURIComponent(qyxBox.value );
		}
		if(typeBox.value == "4"){
			var analyseTypeRadios = $('form[name=radioForm] input[type=radio]');
			var analyseTypeRadiosValue = "";
			for(var i = 0 ; i < analyseTypeRadios.length; i++){
				if(analyseTypeRadios[i].checked==true){
					analyseTypeRadiosValue = analyseTypeRadios[i].value; 
				}
			}
			data1 += "&analyseType=" + analyseTypeRadiosValue;
			if(analyseTypeRadiosValue == "ql"){
				if( isEmpty( anaDataSourceBox.value ) || isEmpty( anaSQLBox.value ) ) {
					alert( "请配置查询数据库和查询语句！" );
					return;
				}
				data1 += "&analyseDB=" + encodeURIComponent(anaDataSourceBox.value )
					+"&analyseSQL=" + encodeURIComponent( anaSQLBox.value ) ;
			}else if(analyseTypeRadiosValue == "fixedTable"){
					data1 += "&anaTables=" + encodeURIComponent( anaTables_values )
						+ "&anaDqldb=" + encodeURIComponent( anaDqlDataSource.value );
			}else if(analyseTypeRadiosValue == "inputFiles"){
					if( isEmpty( anaBoxInputFiles.value ) ) {
						alert( "请配置要分析的填报文件！" );
						return;
					}
					var dirsValue1 = "";
					if(anaBoxInputFiles.value.charAt(0) == ';') dirsValue1 = anaBoxInputFiles.value.substring(1);
					data1 += "&anaFile=" + encodeURIComponent( dirsValue1 );
			}else if(analyseTypeRadiosValue == "dfxScript"){
					if( isEmpty( dfxScriptBox.value ) ) {
						alert( "请编写dfx脚本！" );
						return;
					}
					data1 += "&dfxScript=" + encodeURIComponent( dfxScriptBox.value );
					data1 += "&dfxParams=" + encodeURIComponent( dfxParamsBox.value );
			}else if(analyseTypeRadiosValue == "dfxFile"){
					if( isEmpty( anaBox.value ) ) {
						alert( "请配置要分析的文件！" );
						return;
					}
					data1 += "&dfxParams=" + encodeURIComponent( dfxParamsBox.value );
					data1 += "&anaFile=" + encodeURIComponent( anaBox.value );
			}else{
					if( isEmpty( anaBox.value ) ) {
						alert( "请配置要分析的文件！" );
						return;
				}
				data1 += "&anaFile=" + encodeURIComponent(anaBox.value);
			}
		}
		if(typeBox.value == "5"){
			data1 += "&businessInputSubDir=" + encodeURIComponent(businessInputSubDir.value)
					+"&dataFileType=" + dataFileType.value;
		}
		if(typeBox.value == "6"){
			var dirsValue = "";
			if(aggrDataFileDirs.value.charAt(0) == ';') dirsValue = aggrDataFileDirs.value.substring(1);
			data1 += "&aggrDataFiles=" + encodeURIComponent(dirsValue);
		}
		data1 = data1.replace(/%C2%A0/g,"%20");
		var addon1 = "";
		if(isModify){
			addon1 = "修改";
		}
		$.ajax({
			type:"post",
			url:appmap+"/reportCenterServlet?action=<%=servletActionNum%>" + data1,
			data:{},
			success:function(strRet){
				if(strRet.indexOf('success') >= 0){
					if(isModify){
						leftIFrameWin.location = "tree.jsp?status=" + leftIFrameWin.tree_getNodeExpanded() + "&position=" + leftIFrameWin.document.getElementById('treeContainer').scrollTop + "&currId=" + strRet.substring( 8 );
						leftIFrameWin.tree_setCurrNode( document.getElementById( "id_" + strRet.substring( 8 ) ), true);
					}else{
						var leftIFrame = window.top.document.getElementById("leftF");
						dump("refresh");
						leftIFrame.src = appmap+raqdir+"/center/tree.jsp?status=" + leftIFrame.contentWindow.tree_getNodeExpanded() + ",<%=id%>,1" + ","+strRet.substring( 8 )+",1" + "&position=" + leftIFrame.contentWindow.document.body.scrollTop
										+ "&currId=" + strRet.substring( 8 ) + "&afteradd=yes";
					}
				}else{
					alert(strRet);
				}
			},
			error:function(strRet){
				var addon = "";
				if(isModify){
					addon = "修改";
				}
				alert( addon + "<%=title%>节点时错误:\n" + strRet1 );
			}
		});
	}
	
	function hideSpan( span ) {
		var elms = document.getElementsByClassName(span)
		for( var i = 0; i < elms.length; i++ ) {
			elms[i].style.display = "none";
		}
	}
	
	function showSpan( span ) {
		var elms = document.getElementsByClassName(span)
		for( var i = 0; i < elms.length; i++ ) {
			elms[i].style.display = "";
		}
	}
	
	 function urlReWrite(){
		 var opts = urlselects.childNodes;
		 var hasThisOpt = false;
		 for(var i = 0 ; i < opts.length; i++){
			 if(opts[i].value == urlBox.value){urlselects.value = urlBox.value;hasThisOpt=true;}; 
		 }
		 if(!hasThisOpt){
			 urlselects.value = "";
		 }
	 }
	 function dump(a){
			try{
				e = d1.o1;
			}catch(e){
				if(a)console.log(a);
				console.log('dump');
				console.log(e);
			}
		}
		function parseRadio(){
			layui.use('form', function(){
				  var form = layui.form; 
				  form.render();
			});
		}
		
		function layuiParse(){
			layui.config({
				base: appmap+raqdir+'/center/layui/'
			}).extend({
				formSelects: 'formSelects-rqedit'
			}).use(['form', 'formSelects'], function() {
				var role_user_json = '<%=role_user_json%>';
				var r_u_arr = JSON.parse(role_user_json);
				var form = layui.form, formSelects = layui.formSelects;
				form.render();   
				var roleArr = [];
				var userArr = [];
				if(isModify){
					var roles = "<%=groups%>";
					roleArr = roles.split(',');
					var users = "<%=users%>";
					userArr = users.split(',');	
				}
				formSelects.render({
					name:'xm-select1',
					init:roleArr,
					on:function(data,arr){
						var selectedRoleVals = formSelects.value("xm-select1","val");
						var selectedUserVals = formSelects.value("xm-select2","val");
						var selectedFlag = contains(selectedRoleVals, data.value);
						var relateUsers;
						for(var r = 0; r < r_u_arr.length; r++){
							if(data.value == r_u_arr[r].r){
								for(var a = 0; a < r_u_arr[r].u.length; a++){
									var user = r_u_arr[r].u[a];
									var containUserFlag = contains(selectedUserVals, user);
									if(selectedFlag){
										if(!containUserFlag){
											selectedUserVals[selectedUserVals.length] = user;
										}
									}else{
										if(containUserFlag){
											for(var i = 0; i < selectedUserVals.length; i++){
												if(selectedUserVals[i] == user) selectedUserVals[i] = "";
											}
										}
									}
								}
								formSelects.value('xm-select2', selectedUserVals);
								formSelects.value('xm-select1', selectedRoleVals);
								return;
							}
						}
					},
					data:{
						arr:[
							{name:'全选',val:'all',selected:false,disabled:true}
							<%
			        		for( int i = 0; i < configroles.length; i++ ) {
								if(!"0".equals(configroles[i].getId()) && !"1".equals(configroles[i].getId())){
								out.println( ",{name:'" + configroles[i].getName() + "',val:'" + configroles[i].getId() + "',selected:false,disabled:false}" );
								}
							}
				        	%>
						]
					}
				});
				formSelects.render({
					name:'xm-select2',
					init:userArr,
					on:function(data,arr){
						var selectedRoleVals = formSelects.value("xm-select1","val");
						var selectedUserVals = formSelects.value("xm-select2","val");
						var selectedFlag = contains(selectedUserVals, data.value);
						var roleId;
						var users;
						var noThisRoleUser = true;
						for(var r = 0; r < r_u_arr.length; r++){
							if(contains(r_u_arr[r].u,data.value)){
								roleId = r_u_arr[r].r;
								users = r_u_arr[r].u;
							}
						}
						if(selectedFlag){
							if(!contains(selectedRoleVals, roleId)){
								selectedRoleVals[selectedRoleVals.length] = roleId;
							}
						}else{
							for(var u = 0; u < users.length; u++){
								if(contains(selectedUserVals,users[u])){
									noThisRoleUser = false;
									break;
								}
							}
							if(noThisRoleUser){
								for(var r = 0; r < selectedRoleVals.length; r++){
									if(selectedRoleVals[r] == roleId){
										selectedRoleVals[r] = "";
									}
								}
							}
						}
						formSelects.value('xm-select1', selectedRoleVals);
						formSelects.value('xm-select2', selectedUserVals);
					}
					,data:{
						arr:[
							{name:'全选',val:'all',selected:false,disabled:true}
							<%
			        		for( int i = 0; i < user.length; i++ ) {
								if(!"0".equals(user[i].getRoleId()) && !"1".equals(user[i].getRoleId())){
								out.println( ",{name:'" + user[i].getUserName() + "',val:'" + user[i].getUserId() + "',selected:false,disabled:false}" );
								}
							}
				        	%>
						]
					}
				});
			});
		}
		
		$(function(){
			layuiParse();
			parseRadio();
			
			tool_bindCharCheck($('#labelBox'),["<",">",";"]);
		})
		
		
  </script>
  
</head>
<body>
<input type="hidden" value id="openLayerIndex"/>


<div class="layui-container layui-bg-gray" style="top:60px;height:100%"> 
    <div  class="layui-layout">
      <div class="layui-row layui-col-space30" style="margin-top:20px">
	  <div class="layui-col-xs5" style="font-weight: bold;">
	    节点属性    —————————————————————————
	  </div>
	  <div class="layui-col-xs6 layui-col-xs-offset1" style="font-weight: bold;">
	    浏览权限    —————————————————————————————
	  </div>
    </div>
    <div class="layui-row layui-col-space30">
    <div class="layui-col-xs5">
      <div class="grid">
      <TABLE lay-skin="nob" style="border: none;width:420px" class="layui-table layui-bg-gray" cellSpacing=0 cellPadding=0 align=center>
			 	<colgroup>
			 		<col width="150px"/>
			 		<col/>
			 	</colgroup>
			 	<TR>
		    	<TD>节点类型</TD>
		    	<TD>
			     	 <SELECT id=typeBox class="layui-input" style="VERTICAL-ALIGN: middle; width: 145px" onchange="typeChanged()"> 
			    		<OPTION value="0">分类夹</OPTION>
			    		<OPTION value="1">报表/填报表</OPTION>
			    		<OPTION value="6">统计表</OPTION>
			    		<OPTION value="2">超链接</OPTION>
			    		<OPTION value="3">DQL明细查询</OPTION>
			    		<OPTION value="4">DQL分组分析</OPTION>
						<OPTION value="5">业务填报</OPTION>
			    	</SELECT>
		    	</TD>
			</TR>
			 <TR>	
		    	<TD>节点名称</TD>
		    	<TD><INPUT id=labelBox class="layui-input" style="VERTICAL-ALIGN: middle; WIDTH: 145px;HEIGHT: 28px"></TD>
			</TR>
			<tr><td colspan="3" >
		    	<div style="height:2px;background-color: gray">
			  	</div></td></tr>
		  	<TR class="reportSpan businessInput">
		    	<TD id=raqBoxLabel>对应报表</TD>
		    	<TD><SELECT id=raqBox onchange="rpgHide(this);shtHide(this);matchShow(this);" class=layui-input style="WIDTH: 145px;"> 
		    	<%
		    		for( int i = 0; i < reports.length; i++ ) {
		    			if( reports[i].type.equals( "1" ) ) {
		    				out.println( "<OPTION value=\"" + reports[i].rpt + "\">" + reports[i].name + "</OPTION>" );
		    			}
		    		}
		    	%>
		    	</SELECT></TD>
		    	<td><input id="upReportFile" style="margin-left:-10px" type="button" class="layui-btn layui-bg-black layui-btn-sm" onclick="addReport('report_1')" value="上传"/>
		    	</td>
		    	</TD></TR>
		  	<TR class="reportSpan businessInput aggrhide">
			<TD>参数表单</TD>
		    	<TD><SELECT id=formBox class="layui-input" style="WIDTH: 145px;"> 
		    		<OPTION value=""></OPTION>
		    	<%
		    		for( int i = 0; i < reports.length; i++ ) {
		    			if( reports[i].type.equals( "2" ) ) {
		    				out.println( "<OPTION value=\"" + reports[i].rpt + "\">" + reports[i].name + "</OPTION>" );
		    			}
		    		}
		    	%>
		    	</SELECT></TD>
		    	<td><input style="margin-left:-10px" type="button" class="layui-btn layui-bg-black layui-btn-sm" onclick="addReport('report_arg')" value="上传"/>
		    	</td>
		    </TR>
		  	<TR class="reportSpan businessInput aggrhide">
		    	<TD>缩放比例</TD>
		    	<TD>
			<input type=text class="layui-input" value="<%=scale %>" id=scaleBox style="width:145px;vertical-align:middle">
			</TD></TR>
			<TR id="matchBoxTr" class="reportSpan aggrhide busihide rpghide shthide">
		    	<TD>Match-report&nbsp;</TD>
		    	<TD><input type=checkbox id=matchCheck></TD>
		    </TR>
		  	<TR class="reportSpan aggrhide busihide shthide">
		    	<TD>固定表头&nbsp;</TD>
		    	<TD><input type=checkbox id=scrollCheck onchange="$('#pagedCheck').prop('disabled',!$('#pagedCheck').prop('disabled'));"></TD>
		    </TR>
		    <TR class="reportSpan aggrhide busihide rpghide shthide">
		    	<TD>固定表头后分页&nbsp;</TD>
		    	<TD><input type=checkbox id=pagedCheck disabled></TD>
		    </TR>
		    <TR class="reportSpan aggrhide busihide">
		    	<TD>树形报表&nbsp;</TD>
		    	<TD><form class="layui-form" name="radioForm_TreeStructure">
		    	<input type=radio name=treeStructure  title="tree" value="isTree" 
				<%if("isTree".equals(treeStructure)){ %>checked<%} %>
				/>
		    	<input type=radio name=treeStructure title="olap" value="isOlap"
				<%if("isOlap".equals(treeStructure)){ %>checked<%} %>
				/>
		    	</form>
		    	</TD>
			<td>
			<input class='layui-btn layui-btn-sm' type=button onclick="$('.layui-form[name=radioForm_TreeStructure] input[type=radio]').attr('checked',false);parseRadio();return false;" value="清空"/>
			</td>
		    </TR>
		    <!-- <TR class="reportSpan">
		    	<TD id=reportParamsLabel>报表参数</TD>
		    	<TD><input placeholder="param1=value1;param2=value2..." class='layui-input' id="reportParams" type="text"/></TD>
	    	</TR> -->
			<TR class="reportSpan aggrshow">
		   		<TD>选择目录</TD>
		    	<TD>
			    	<select class="layui-select" id=aggrDataFile style="width:145px" onchange="attachInputFiles('aggrDataFile','aggrDataFileDirs',';','/*');" >
			    	</select>
		    	</TD>
		  	<TR>
			<TR class="reportSpan aggrshow">
		    	<TD colspan=1>填报文件目录</td>
		    	<td><textarea placeholder="上方选择拼接于此， 格式：dir1;dir2;..." id=aggrDataFileDirs class="layui-textarea" style="WIDTH: 140px;" ></textarea></TD>
		    </TR>
		  	<TR class=urlSpan>
		    	<TD>超链接</TD>
		    	<TD>
		    		<select id=urlselects class="layui-input" id="hadfunctons" onchange="javascript:var sv=this.options[this.options.selectedIndex].value; if(sv!=''){urlBox.value=sv;}   ">	
		    			<option value="">自定义</option>
		    			<option value="onLineUser.jsp" <c:if test='<%="onLineUser.jsp".equals(url) %>'>selected</c:if>>用户在线列表</option>
		    		</select>
		    	</TD>
			</TR>
		  	<TR class=urlSpan>
		    	<TD>输入url</TD>
		    	<TD><textarea class="layui-textarea" onkeyup="urlReWrite();" id=urlBox></textarea></TD>
		    </TR>
		    <TR class=urlSpan>
		    	<TD colspan="2">(以/开头表示相对于WEB应用的根目录)</TD>
		    </TR>
    
		  	<TR class="querySpan">
		  		<TD>DQL数据库<i id=queryBoxMsgSpan class="layui-icon"></i></TD>
		    	<TD><select id=queryBox class=layui-input onchange="dqldbChange(this);" style="WIDTH: 100px"> 
		    	<option value="">不选择</option>
		    	<%
		    		for( int i = 0; i < dqldbs.length; i++ ) {
		   				out.println( "<OPTION" );
		   				out.println( " value=\"" + dqldbs[i] + "\">" + dqldbs[i] + "</OPTION>" );
		    		}
		    	%>
		    	</select>
		    	</TD>
		    </TR>
		    <TR class="querySpan">
		    	<TD>qyx文件<i id=qyxBoxMsgSpan class="layui-icon"></i></TD>
		    	<TD><SELECT id=qyxBox class=layui-input onchange="qyxChange(this);" style="WIDTH: 100px"> 
		    	<option value="">不选择</option>
		    	<%
		    		for( int i = 0; i < qyxs.length; i++ ) {
		   				out.println( "<option" );
		   				out.println( " value=\"" + fileRoot + "/" + qyxs[i] + "\">" + qyxs[i] + "</option>" );
		    		}
		    	%>
		    	</SELECT></TD>
		    </TR>
		    <TR class="querySpan">
		    	<TD>dct文件:</TD>
		    	<TD><SELECT id=dctBox class="layui-input" style="WIDTH: 100px"> 
		    	</SELECT></TD>
		    </TR>
		    <TR class="querySpan">
		    	<TD>vsb文件:</TD>
		    	<TD><SELECT id=vsbBox class=layui-input style="WIDTH: 100px"> 
		    	</SELECT></TD>
		    </TR>
		    	<TR class="analysisSpan">
		    	<TD colspan=3>
			    	<form name="radioForm">
				    	<table style="width=100%">
					    	<tr>
					    	<td>分析类型:&nbsp;</TD>
					    	<td>
					    		<input type="radio" class="analyseType" onclick="hideSpan( 'analysisSpan0' );showSpan( 'analysisSpan3' );anaDqldbChange($('#anaDqlDataSource')[0]);anaBox.value='';" name="analyseType" value="fixedTable"/>dql表
					    	</td><td>
					    		<input type="radio" class="analyseTypeInput" onclick="hideSpan( 'analysisSpan0' );showSpan( 'analysisSpan1' );showSpan( 'analysisSpan4' );reFreshAnalysefileList('inputFiles');anaBox.value='';anaBoxInputFiles.value='';" name="analyseType" value="inputFiles"/>填报文件
					    	</td></tr>
					    	<tr><td></td><td>
					    		<input type="radio" class="analyseType" onclick="hideSpan( 'analysisSpan0' );showSpan( 'analysisSpan2' );anaBox.value='';" name="analyseType" value="ql"/>数据源+查询语句
					    	</td><td>
					    		<input type="radio" class="analyseType" onclick="hideSpan( 'analysisSpan0' );showSpan( 'analysisSpan1' );reFreshAnalysefileList('dataFile');anaBox.value='';" name="analyseType" value="dataFile"/>数据文件
					    	</td></tr>
					    	<tr><td></td><td>
					    		<input type="radio" class="analyseType" onclick="hideSpan( 'analysisSpan0' );showSpan( 'analysisSpan1' );showSpan( 'analysisSpan6' );reFreshAnalysefileList('dfxFile');anaBox.value='';" name="analyseType" value="dfxFile"/>dfx文件
					    	</td><td>
					    		<input type="radio" class="analyseType" onclick="hideSpan( 'analysisSpan0' );showSpan( 'analysisSpan5' );showSpan( 'analysisSpan6' );anaBox.value='';" name="analyseType" value="dfxScript"/>dfx脚本
					    	</td></tr>
				    	</table>
			    	</form>
		    	</TD>
		    	</TR>
		    	<TR class="analysisSpan1 analysisSpan0">
		    	<TD colspan=1>需要分析的文件:</td>
		    	<td><SELECT id=anaBox class="layui-input" style="WIDTH: 140px;" onchange="attachInputFiles('anaBox','anaBoxInputFiles',';','');"> 
		    	<%
		    		for( int i = 0; i < afiles.length; i++ ) {
		    			if(afiles[i] != null){
			   				out.println( "<OPTION" );
			   				out.println( " value=\"" + afiles[i] + "\" " );
			   				if((fileRoot+"/"+afiles[i]).equals(anaFile)){
				   				out.println( "selected=true" );
			   				}
			   				out.println( ">" + afiles[i] + "</OPTION>" );
			   				
		    			}
		    		}
		    	%>
		    	</SELECT></TD></TR>
		    	<TR class="analysisSpan4 analysisSpan0">
		    	<TD colspan=1>填报文件</td>
		    	<td><textarea placeholder="上方选择拼接于此：value1;value2....." class="layui-textarea" style="WIDTH: 140px;" id=anaBoxInputFiles ></textarea></TD></TR>
		    	<TR  class="analysisSpan2 analysisSpan0">
		    	<TD colspan=2>数据库<select id=anaDataSourceBox class="layui-input" style="width:300px" > 
			    	<%
			    		for( int i = 0; i < dbs.length; i++ ) {
			   				out.println( "<option" );
			   				out.println( " value=\"" + dbs[i] + "\">" + dbs[i] + "</option>" );
			    		}
			    	%>
			    	</select>
			    	</TD>
		    	</TR>
		    	<TR  class="analysisSpan2 analysisSpan0">
		    	<TD colspan=2>查询语句<input type="text" id=anaSQLBox class="layui-input" style="WIDTH: 300px"> 
			    </TD>
		    	</TR>
		    	<TR  class="analysisSpan3 analysisSpan0">
		    	<TD colspan=1>DQL数据库</TD>
		    	<td colspan=1>
		    	<select id=anaDqlDataSource class="layui-input" value="" onchange="anaDqldbChange(this);" style="WIDTH: 100px"> 
		    	<%
		    		for( int i = 0; i < dqldbs.length; i++ ) {
		   				out.println( "<option" );
		   				out.println( " value=\"" + dqldbs[i] + "\">" + dqldbs[i] + "</option>" );
		    		}
		    	%>
		    	</select>
		    	</td>
		    	</TR>
		    	<TR  class="analysisSpan3 analysisSpan0 querySpan">
		    	<td style="vertical-align:top;">表范围</td>
		    	<TD colspan=1>
		    	<select multiple="multiple" id=anaTables class="layui-input" style="WIDTH: 100px;height:130px">
		    	</select>
			    </TD>
		    	</TR>
		    	<tr class="analysisSpan5 analysisSpan0">
		    	<td>编写dfx脚本</td>
		    	<td colspan=2>
		    	<textarea class="layui-textarea" id="dfxScriptBox"><%=dfxScript %>></textarea>
		    	</td>
		    	</tr>
		    	<tr class="analysisSpan6 analysisSpan0">
		    	<td>dfx参数</td>
		    	<td colspan=2>
		    	<textarea placeholder="格式：param1=value;param2=value....." class="layui-textarea" style="WIDTH: 140px;" id="dfxParamsBox"></textarea>
		    	</td>
		    	</tr>
		    	<TR class="businessInput">
			    	<TD>数据保存类型</TD>
			    	<TD>
				    	<SELECT id=dataFileType class=layui-input style="VERTICAL-ALIGN: middle; WIDTH: 145px" onchange="typeChanged()"> 
				    		<OPTION value="json" selected>json</OPTION>
				    		<OPTION value="bin">bin</OPTION>
		    			</SELECT>
			    	</TD>
		  		</TR>
		    	<TR class="businessInput">
		    		<TD>数据保存目录</TD>
			    	<TD>
				    	<select class=layui-input id=businessInputSubDir style="width:145px" >
				    	</select>
			    	</TD>
		    	</TR>
				</TABLE>
				</div>
		
	</div>
	<div class="layui-col-xs3 layui-col-xs-offset1">
    	<div class="grid">
   	     机构浏览权限<input class="layui-btn layui-btn-sm" type="button" value="全选" name="r1" onclick="selectall()">
   	     <input class="layui-btn layui-btn-sm" type="button" value="清空" name="r1" onclick="noselect()">
   		<SELECT name=userGroupBox xm-select-placeholder="机构" xm-select-skin="primary" xm-select="xm-select1" xm-select-type="2" lay-filter="xm-select1" xm-select-search id=userGroupBox> 
       	</SELECT>
	</div>
    </div>
    <div class="layui-col-xs3">
         <div class="grid">
	       用户浏览权限<input class="layui-btn layui-btn-sm" type="button" value="全选" name="r2" onclick="selectall()">
	 	 <input class="layui-btn layui-btn-sm" type="button" value="清空" name="r2" onclick="noselect()">  
  		 <SELECT name=userBox xm-select-placeholder="用户" xm-select-skin="primary" xm-select="xm-select2" xm-select-type="2" lay-filter="xm-select2" xm-select-search id=userBox> 
        </SELECT>
      </div>
    </div>
    </div>
	</div>	
	</div>
	
	
<div class="layui-bg-gray" style="position:fixed;left:0px;bottom:0px;height:35px;width:100%">
    <input type="button" value="提交" onclick="submitNode();"id="loginbtn" style="margin-top:0px;" class="layui-btn layui-btn-sm"/>
  	</div>
<script language=javascript src="util.js"></script>
<iframe id="frame_tableArrange" src="" style="display: none;"></iframe>
<script language=javascript>
$(function(){
	hideSpan( 'analysisSpan0' );
	hideSpan( 'reportSpan' );
	hideSpan( 'urlSpan' );
	hideSpan( 'querySpan' );
	hideSpan( 'analysisSpan' )
	hideSpan( 'businessInput' );
	hideSpan( 'reportParam' );
	if(isModify){
		$('#typeBox').prop('disabled',true);
		raqBox = $('#raqBox')[0];
		formBox = $('#formBox')[0];
		pagedCheck = $('#pagedCheck')[0];
		scrollCheck = $('#scrollCheck')[0];
		labelBox = $('#labelBox')[0];
		anaBox = $('#anaBox')[0];
		qyxBox = $('#qyxBox')[0];
		anaDataSourceBox = $('#anaDataSourceBox')[0];
		anaSQLBox = $('#anaSQLBox')[0];
		reportParams = $('#reportParams')[0];
		queryBox = $('#queryBox')[0];
		fixedTableBox = $('#fixedTableBox')[0];
		anaDqlDataSource = $('#anaDqlDataSource')[0];
		businessInputSubDir = $('#businessInputSubDir')[0];
		aggrDataFileDirs = $('#aggrDataFileDirs')[0];
		dataFileType = $('#dataFileType')[0];
		dfxParamsBox = $('#dfxParamsBox')[0];
		typeBox.value = "<%=type%>";
		urlBox.value="<%=url%>";
		labelBox.value = "<%=label%>";
		dfxScriptBox.value='<%=dfxScript%>';
		dfxParamsBox.value='<%=dfxParams%>';
		raqBox.value = "<%=rpt%>";
		reportParams = params;
		formBox.value = "<%=form%>";
		qyxBox.value="<%=qyx%>";
		aggrDataFileDirs.value=';'+"<%=aggrDataFilesValue%>"
		if("<%=scroll%>" == "1"){
			scrollCheck.checked = true;
			$(pagedCheck).prop("disabled",false);
		}else{
			scrollCheck.checked = false;
		}
		pagedCheck.checked = "<%=paged %>" == "1";
		matchCheck.checked = "<%=useJsp %>" == "matchReport.jsp";
		anaDataSourceBox.value = "<%=analyseDB %>";
		anaSQLBox.value = "<%=analyseSQL %>";
		businessInputSubDir.value = "<%=busiDir %>";
		dataFileType.value = "<%=dataFileType %>";
		typeChanged();
		hideSpan( 'analysisSpan0' );
		if(typeBox.value == "3"){
			showSpan('querySpan');
		}
		
		var analyseTypeRadios = $('form[name=radioForm] input[type=radio]');
		if("<%=analyseType%>" != null){
			for(var i = 0 ; i < analyseTypeRadios.length; i++){
				if(analyseTypeRadios[i].value == "<%=analyseType%>"){
					analyseTypeRadios[i].checked="checked"; 
					if("<%=analyseType%>" == "ql") {
						showSpan( 'analysisSpan2' );
					}else if("<%=analyseType%>" == "fixedTable"){
						showSpan( 'analysisSpan3' );
					}else if("<%=analyseType%>" == "inputFiles"){
						if(anaFile != null && anaFile != "null" && anaFile.length > 0){
							$('#anaBoxInputFiles').val(';'+'<%=anaFile%>');
						}
						showSpan( 'analysisSpan1' );
						showSpan( 'analysisSpan4' );
					}else if("<%=analyseType%>" == "dfxScript"){
						showSpan( 'analysisSpan5' );
						showSpan( 'analysisSpan6' );
					}else if("<%=analyseType%>" == "dfxFile"){
						showSpan( 'analysisSpan1' );
						showSpan( 'analysisSpan6' );
						if(anaFile != null && anaFile != "null" && anaFile.length > 0){
							//anaBox.value="<%=anaFile%>";
						}
					}else{
						if(anaFile != null && anaFile != "null" && anaFile.length > 0){
							//anaBox.value="<%=anaFile%>";
						}
						showSpan( 'analysisSpan1' );
					}
				}
			}  
		}
		
		
		queryBox.value = "<%=dqldb%>";
		anaDqlDataSource.value = "<%=anaDqldb%>";
		if("<%=type%>"=="3"){
			dqldbChange($('#queryBox')[0]);
		}else if("<%=type%>"=="4"){
			anaDqldbChange($('#anaDqlDataSource')[0]);
		}
		leftIFrameWin = window.top.document.getElementById('leftF').contentWindow;
		if( parent.parent.tree !=null ){
			var s = leftIFrameWin.tree_getNodeExpanded();
			leftIFrameWin.location.replace( "tree.jsp?status=" + s + ",<%=id%>,1" + "&position=" + leftIFrameWin.document.body.scrollTop + "&currId=<%=id%>" );
		}
		else if( parent.tree !=null ){
			var s = leftIFrameWin.tree_getNodeExpanded();
			leftIFrameWin.location.replace( "tree.jsp?status=" + s + ",<%=id%>,1"+"&position=" + leftIFrameWin.document.body.scrollTop + "&currId=<%=id%>" );		   	
		}
		}
	});
</script>
</body>
</html>
