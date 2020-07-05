<%@page import="org.json.JSONArray"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.raqsoft.report.view.*" %>
<%@ page import="com.raqsoft.center.*" %>
<%@ page import="com.raqsoft.center.entity.Report" %>
<%@ page import="com.raqsoft.center.schedule.ScheduleImpl" %>
<%@ page import="org.json.*" %>
<%@ page isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<%
	String contextPath = request.getContextPath();
	boolean newsche = "yes".equals(request.getParameter("newsche"));
	newsche = newsche && request.getAttribute("schedule") == null;
	String timerType = "onetime";
	String date = "";
	String time = "";
	String weekDay = "";
	String monthDay = "";
	if(monthDay == null) monthDay = "1";
	String userIds = "";
	String report = "";
	String exports = "";
	if(!newsche){
		ScheduleImpl si = (ScheduleImpl)request.getAttribute("schedule");
		if(si != null){
			java.util.Map map = si.getDataMap();
			userIds = (String)map.get("to_email");
			report = (String)map.get("relateFile");
			exports = (String)map.get("export");
			String scheduleTimerType = si.getScheduleTimerType();
			String[] type_day_time = scheduleTimerType.split(",");
			timerType = type_day_time[0];
			if(timerType.equals("daily")){
				time = type_day_time[1];
			}else if(timerType.equals("onetime")){
				date = type_day_time[1];
			}else if(timerType.equals("weekly") || timerType.equals("monthly")){
				if(timerType.equals("weekly")) weekDay = type_day_time[1];
				if(timerType.equals("monthly")) monthDay = type_day_time[1];
				time = type_day_time[2];
			}
		}
	}
	Config cfg = Center.getConfig();
	String role_user_jsonstr = cfg.getRoleUserJson();
	JSONArray role_user_json = new JSONArray(role_user_jsonstr);
	UserManager um = new UserManager(cfg);
	RoleManager rm = new RoleManager(cfg);
	Report[] reports = cfg.getReports();
%>
<script type="text/javascript" src="<%=contextPath%>/js/jquery.js"></script>
<script type="text/javascript" src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/js/tools.js"></script>
<script type="text/javascript" src="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/layui.js"></script>
<link rel="stylesheet" href="<%=contextPath%><%=ReportConfig.raqsoftDir%>/center/layui/css/layui.css">
<script>
var newsche = <%=newsche%>;
var appmap = "<%=contextPath%>";
var raqdir = "<%=ReportConfig.raqsoftDir%>";
var exports = "<%=exports%>";
</script>
<style type="text/css">
.hide{
	background-color: #EEE;
}
</style>
</head>
<body>
	<div align="center" class="layui" style="margin-top:20px"><span id="titleType"></span>任务计划</div>
	<br>
	<div align="center">
	<div style="width:1000px" class="layui-tab">
	   <form class="layui-form" id=form1 method=post
			action="">
		<div align="center">
			<input type="hidden" name="timer" id="timer" value=""/>
			<TABLE align=center class="layui-table" style="table-layout: fixed; BORDER-COLLAPSE: collapse;width:650px">
				<tr class="">
					<td><span>任务名</span></td>
					<td>
					<div class="layui-form-item">
						<input lay-verify="name" class="layui-input" name="jobName" type="text" value="${schedule.jobName}" <c:if test="${schedule ne null}">disabled</c:if>/>
					</div>
					</td>
				</tr>
				<tr class="">
					<td><span>任务类型</span></td>
					<td>
						导出
					</td>
				</tr>
				<tr class="to-email">
					<td><span>发送到用户</span></td>
					<td>
					<div class="layui-form-item">
						<select lay-verify="selectRequired" class="layui-input" name="email" xm-select-skin="primary" xm-select="email" xm-select-type="4" xm-select-search>
						</select>
						<input type="hidden" name="toIds" id="toIds" value=""/>
					</div>
					</td>
				</tr>
				<tr class="file">
					<td><span>选择报表</span></td>
					<td>
					<div class="layui-form-item">
						<select lay-verify="required" name="report">
						<%
						for( int k = 0; k < reports.length; k++ ) {
			    			if( reports[k].type.equals( "1" ) || reports[k].type.equals( "2" ) || reports[k].type.equals( "10" ) ||reports[k].type.equals( "11" ) ) {
			    				out.println( "<OPTION value=\"" + reports[k].rpt + "\"");
			    				if(report.equals(reports[k].rpt)) out.println( " selected=true");
			    				out.println(">" + reports[k].name + "</OPTION>" );
			    			}
			    		}
						%>
						</select>
						</div>
					</td>
				</tr>
				<tr class="export">
					<td><span>导出</span></td>
					<td>
						<div class="layui-form-item">
						      <input class="" value="xls" name="xls" title=".xls" type="checkbox" lay-skin="primary"/>
						      <input class="" value="xlsx" name="xlsx" title=".xlsx" type="checkbox" lay-skin="primary"/>
						      <input class="" value="word" name="docx" title=".docx" type="checkbox" lay-skin="primary"/>
						      <input class="" value="pdf" name="pdf" title=".pdf" type="checkbox" lay-skin="primary"/>
						</div>
					</td>
				</tr>
				<tr class="timer">
					<td><span>计划时间</span></td>
					<td>
						<select lay-verify="required" lay-filter="timerType" id="timerType" name="timerType">
							<option value="onetime" id="type_onetime">定时执行一次</option>
							<option value="daily" id="type_daily">每日</option>
							<option value="weekly" id="type_weekly">每周</option>
							<option value="monthly" id="type_monthly">每月</option>
						</select>
						<!-- 每个月填1-31 -1最后一天
							每周填1-7
							时间选择
						 -->
					</td>
				</tr>
				<tr class="hide onetime">
				<td><span>指定日期时间</span></td>
				<td>
					<input type="text" name="datetime" class="layui-input" id="date-limit" placeholder="yyyy-MM-dd" value="<%=date %>"/>
				</td>
				</tr>
				<tr class="hide weekly">
				<td><span>每周几</span></td>
				<td>
					<select lay-filter="" id="weekDay" name="weekDay">
						<option value="SUN">周日</option>
						<option value="MON">周一</option>
						<option value="TUE">周二</option>
						<option value="WED">周三</option>
						<option value="THU">周四</option>
						<option value="FRI">周五</option>
						<option value="SAT">周六</option>
					</select>
				</td>
				</tr>
				<tr class="hide monthly">
				<td><span>每个月第几日</span></td>
				<td>
					<input class="layui-input" lay-verify="numberOnly" placeholder="如一月可填写1~31；-1代表每月最后一天" type="text" name='monthDay' id="monthDay" value="<%=monthDay %>"/>
				</td>
				</tr>
				<tr class="hide daily weekly monthly">
				<td><span>具体时间</span></td>
				<td>
					<input lay-verify="required" name="time" class="layui-input" id="time1" type="text" value="<%=time %>"/>
				</td>
				</tr>
				<tr >
				<td><span>文本</span></td>
				<td><textarea class="layui-input" name="contentTxt" id="contentTxt"></textarea></td>
				</tr>
			</table>
			<div class="" style="height:35px;width:100%">
		    	<button type="button" lay-submit class="layui-btn layui-btn-green" lay-filter="form1">提交</button>
		    </div>
		</div>
		</form>
	</div>
	</div>
</body>

<script type="text/javascript">
function changeType(timerType){
	var weekDay = "";
	var monthDay = "";
	var report = "";
	if(timerType == null || timerType == ""){
		$('.hide').hide();
		$('.daily').show();
	}else{
		weekDay = "<%=weekDay%>";
		monthDay = "<%=monthDay%>";
		report = "<%=report%>";
		
		$('.hide').hide();
		if(weekDay != "") $('#weekDay').val(weekDay);
		if(monthDay != "") $('#monthDay').val(monthDay);
		if(report != null && report != "") $('input[name=report]').val(report);
		setExports();
		try{
			if(timerType != null && timerType != ""){
				//$('select[name=timerType]').val(timerType);
				$('#type_'+timerType).prop('selected',true);
			}
		}catch(err){
			console.log(err);
			if(timerType.value != null){
				timerType = timerType.value;
				$('#type_'+timerType.value).prop('selected',true);
			}
		}
		$('.'+timerType).show();
	}
	
}

function change_ToIds(){
	var datas = formSelects.value("email","val");
	var oldIds = $('input[name=toIds]').val().split(',');
	
	$('input[name=toIds]').val(datas);
	for(var i = 0; i < datas.length; i++){
		createUserParamTab(datas[i],"",true);
	}
	for(var j = 0; j < oldIds.length; j++){
		try{
			if(!datas.includes(oldIds[j])) removeTab(oldIds[j]);//ie不支持
		}catch(E){
			if(arrayIncludes(datas,oldIds[j])){
				removeTab(oldIds[j]);
			}
				
		}
	}
}

function setExports(){
	if(exports.indexOf("xlsx")>=0){
		$("input[name=xlsx]").prop("checked",true);	
	}
	if(exports.indexOf("docx")>=0){
		$("input[name=docx]").prop("checked",true);	
	}
	if(exports.indexOf("pdf")>=0){
		$("input[name=pdf]").prop("checked",true);	
	}
	var expArr = exports.split(",");
	for(var i = 0; i < exports.split().length; i++){
		if(expArr[i] == "xls"){
			$("input[name=xls]").prop("checked",true);
		}
	}
}

function layuiParse(){
	String.prototype.startsWith = function(str) {
		var reg = new RegExp("^" + str);
		return reg.test(this);
	}
	layui.config({
		base: appmap+raqdir+'/center/layui/'
	}).extend({
		formSelects: 'formSelects-rqedit'
	}).use(['form','formSelects','laydate'], function() {
		var form = layui.form, formSelects = layui.formSelects, laydate = layui.laydate;
		form.render();
		var now_datetime = new Date();
		now_datetime = now_datetime.pattern("yyyy-MM-dd") + " " + now_datetime.pattern("HH:mm:ss");
		laydate.render({
			elem: '#date-limit',
			type: 'datetime',
			min: now_datetime
		});
		laydate.render({
			elem: '#time1',
			type:'time'
		});
		var initData = [];
		if(!newsche){
			if("<%=userIds%>"!=null) initData = eval("[<%=userIds %>]");
		}
		formSelects.render({
			name:'email',
			init:initData,
			data:{
				arr:[
					<%
					int length = role_user_json.length();
	        		for( int i = 0; i < length; i++ ) {
	        			if(i > 0){
	        				out.println(",");
	        			}
	        			JSONObject jobj = (JSONObject)role_user_json.get(i);
	        			String role_value = (String) jobj.get("r");
	        			if( "-1".equals(role_value) ){
	        				continue;
	        			}
	        			JSONArray jarr = (JSONArray)jobj.get("u");
	        			String users = "";
	        			if(jarr.length() == 0){
	        				break;
	        			}
	        			for(int j = 0; j < jarr.length(); j++){
	        				String userid = (String)jarr.get(j);
	        				if(users.length() != 0){
	        					users += ",";
	        				}
	        				String user = "{name:'" + um.getUser(userid).getUserName() + "',val:'" + userid + "',selected:false,disabled:false}";
	        				users += user;
	        			}
						out.println( "{name:'" + rm.getRole((String)jobj.get("r")).getName() + "',arr:[" + users + "]}" );
					}
		        	%>
				]
			},
			on:function(data,arr){
				change_ToIds();
			}
		});
		change_ToIds();
		form.verify({
			name:function(value){
				if(value == null ||value.length == 0){
					return "任务名不能为空";
				}
				if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
				      return '用户名不能有特殊字符';
				}
				if(value.indexOf(" ") >= 0){
					return "任务名中不要含有空格";
				}
			},
			selectRequired:function(value){
				if(value == null ||value.length == 0){
					value = $("#toIds").val();
					console.log(value);
					if(value == null ||value.length == 0) return "请选择发送至用户";
				}
			},
			numberOnly:function(value){
				console.log(parseInt(value));
				console.log(isNaN(value));
				if($('#timerType').val() == "monthly"){
					if(isNaN(value) || (parseInt(value) < 1 && parseInt(value) > 31)|| value != "-1"){
			        	return "必须是数字（1-31）";
			    	}
			    }
			}
		});
		form.on("select(timerType)",changeType);
		form.on("submit(form1)",function(data1){
			var userParams = getUserParams();
			var userParamJsonStr = "{params:["+userParams.toString()+"]}";
			//userParamJsonStr = encodeURIComponent(userParamJsonStr);
			var url = data1.form.action;
			var paramsJson = inputToJson();
			paramsJson = encodeURIComponent(paramsJson);//reportParams
			var fields = data1.field;
			fields.userParams = userParamJsonStr;
			fields.reportParams = paramsJson;
			$.ajax({
				type:'post',
				url:url,
				data: fields,
				success:function(str){
					console.log(str);
					if(str.indexOf("fail:") >= 0){
						alert(str);
						return;
					}
					alert("保存成功");
					data1.form.jobName.disabled = true;
					data1.form.action = appmap+"/reportCenterServlet?action=65";
					$('#titleType').html('修改');
				},
				error:function(e){
					alert("执行异常");
					console.log(e);
				}
			});
		});
	});
}
changeType("<%=timerType %>");
var now = new Date();
var hours = now.getHours();
var minutes = now.getMinutes();
var secs = now.getSeconds();
if(hours < 10){
	hours = "0"+hours;
}
if(minutes < 10){
	minutes = "0"+minutes;
}
if(secs < 10){
	secs = "0"+secs;
}
var now_time = hours+":"+minutes+":"+secs;
if("<%=time%>" == null || "<%=time%>".length == 0){
	$('#time1').val(now_time);
}

layuiParse();
tool_bindCharCheck($('input[name=jobName]'),["<",">",";"]);

var form1 = $("#form1")[0];
if(newsche){
	$('#titleType').html('新增');
	form1.action=appmap+"/reportCenterServlet?action=64";
}else{
	$('#titleType').html('修改');
	form1.action=appmap+"/reportCenterServlet?action=65";
}

Date.prototype.pattern=function(fmt) { 
	var o = { 
		"M+" : this.getMonth()+1, //月份 
		"d+" : this.getDate(), //日 
		"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时 
		"H+" : this.getHours(), //小时 
		"m+" : this.getMinutes(), //分 
		"s+" : this.getSeconds(), //秒 
		"S" : this.getMilliseconds() //毫秒 
	}; 
	var week = { 
		"0" : "/u65e5", 
		"1" : "/u4e00", 
		"2" : "/u4e8c", 
		"3" : "/u4e09", 
		"4" : "/u56db", 
		"5" : "/u4e94", 
		"6" : "/u516d" 
	}; 
	if(/(y+)/.test(fmt)){ 
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 
	if(/(E+)/.test(fmt)){ 
		fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]); 
	} 
	for(var k in o){ 
		if(new RegExp("("+ k +")").test(fmt)){ 
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
		} 
	} 
	return fmt; 
} 

function getUserParams(){
	var userIds = form1.toIds.value;
	var userIdArr = userIds.split(',');
	var s = new Array();
	for(var i = 0 ; i < userIdArr.length; i++){
		var userid = userIdArr[i];
		var params = $('#userParamFrame'+userid)[0].contentWindow.get_scheduleUserParams();
		if( params != null ) s.push(params);
	}
	return s;
}

function arrayIncludes(datas,target){
	for(var d = 0; d < datas.length; d++){
		if(datas[d] == target) {
			return true;
		}
	}
}
</script>
</html>
