/*
 * TODO 
 * 1,条件exp方法中根据数据库类型、数据类型拼出sql条件。
 *
 */
//以下方法now为null时，用服务器时间。
var dateUtils = {
	getServerTime : function() {
		var d = new Date();
		d.setTime(d.getTime() + timeDiffer);
		return d;
	},
	getToday : function(now) {//获得今天日期:yyyy-MM-dd
		if (!now) now = dateUtils.getServerTime();
		var d = $.datepicker.formatDate( 'yy-mm-dd', now );
		return d;
	},
	getYestoday : function(now) {//昨天
		if (!now) now = dateUtils.getServerTime();
		now.setTime(now.getTime()-24*60*60*1000);
		return dateUtils.getToday(now);
	},
	getYestoday2 : function(now) {//前天
		if (!now) now = dateUtils.getServerTime();
		now.setTime(now.getTime()-2*24*60*60*1000);
		return dateUtils.getToday(now);
	},
	getWeekBegin : function(now) {//获得本周的第一天（星期日）
		if (!now) now = dateUtils.getServerTime();
		now.setTime(now.getTime()-now.getDay()*24*60*60*1000);
		return dateUtils.getToday(now);
	},
	getWeekEnd : function(now) {//获得本周的最后一天（星期六）
		if (!now) now = dateUtils.getServerTime();
		now.setTime(now.getTime()+(6-now.getDay())*24*60*60*1000);
		return dateUtils.getToday(now);
	},
	getMonthBegin : function(now) {//获得本月第一天
		if (!now) now = dateUtils.getServerTime();
		now.setDate(1);
		return dateUtils.getToday(now);
	},
	getMonthEnd : function(now) {//获得本月最后一天
		if (!now) now = dateUtils.getServerTime();
		if (now.getMonth() == 11) {
			now.setDate(31);
		} else {
			now.setDate(1);
			now.setMonth(now.getMonth()+1);
			now.setTime(now.getTime()-24*60*60*1000);
		}
		return dateUtils.getToday(now);
	},
	getSeasonBegin : function(now) {//季度首
		if (!now) now = dateUtils.getServerTime();
		if (now.getMonth() <= 2) {
			now.setMonth(0);
		} else if (now.getMonth() <= 5) {
			now.setMonth(3);
		} else if (now.getMonth() <= 8) {
			now.setMonth(6);
		} else {
			now.setMonth(9);
		}
		return dateUtils.getMonthBegin(now);
	},
	getSeasonEnd : function(now) {//季度末
		if (!now) now = dateUtils.getServerTime();
		if (now.getMonth() <= 2) {
			now.setMonth(2);
		} else if (now.getMonth() <= 5) {
			now.setMonth(5);
		} else if (now.getMonth() <= 8) {
			now.setMonth(8);
		} else {
			now.setMonth(11);
		}
		return dateUtils.getMonthEnd(now);
	},
	getYearBegin : function(now) {//获得本年的第一天
		if (!now) now = dateUtils.getServerTime();
		now.setDate(1);
		now.setMonth(0);
		return dateUtils.getToday(now);
	},
	getYearEnd : function(now) {//获得本年的最后一天
		if (!now) now = dateUtils.getServerTime();
		now.setDate(31);
		now.setMonth(11);
		return dateUtils.getToday(now);
	}
}

function translateDimExp(dimType, exp, time) {
	time = $.trim(time);
	if (dimType == 1) {//年
		exp = exp.replaceAll('?1',time);
	} else if (dimType == 2) {//月
		exp = exp.replaceAll('?2',time);
	} else if (dimType == 3) {//日
		exp = exp.replaceAll('?3',time);
	} else if (dimType == 4) {//年月
		time = time.split('-');
		exp = exp.replaceAll('?1',time[0]).replaceAll('?2',time[1]);
	} else if (dimType == 5) {//年月日
		time = time.split('-');
		exp = exp.replaceAll('?1',time[0]).replaceAll('?2',time[1]).replaceAll('?3',time[2]);
	} else if (dimType == 6) {//年月日时分秒
		time = time.split(' ');
		var date = time[0].split('-');
		time = time[1].split(':');
		exp = exp.replaceAll('?1',date[0]).replaceAll('?2',date[1]).replaceAll('?3',date[2]).replaceAll('?4',time[0]).replaceAll('?5',time[1]).replaceAll('?6',time[2]);
	}
	return exp;
}

var conditionConfig = {
	types : [
		{type:1,options:[
			{name:'等于',html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个数值以“,”隔开。如：1,2,3</span>';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_=' + translateDimExp(dimType, dimExp, values[0]);
					if (values[0].indexOf(',') > 0) return '_x_ in (' + values[0] + ')';
					else return '_x_=' + values[0];
				},disp:function(item, disps){
					return '等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'不等于',html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个数值以“,”隔开。如：1,2,3</span>';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_<>' + translateDimExp(dimType, dimExp, values[0]);
					if (values[0].indexOf(',') > 0) return '_x_ not in (' + values[0] + ')';
					else return '_x_<>' + values[0];
				},disp:function(item, disps){
					return '不等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '不等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'大于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_>' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>' + values[0];
				},disp:function(item, disps){
					return '大于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '大于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'小于',html:function(){
					return '_EDITOR_'
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_<' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<' + values[0];
				},disp:function(item, disps){
					return '小于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '小于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'大于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_>=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>=' + values[0];
				},disp:function(item, disps){
					return '大于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '大于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'小于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_<=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<=' + values[0];
				},disp:function(item, disps){
					return '小于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '小于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'区间',html:function(){
					return '<select id="_first_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_<select id="union"><option value="AND">并且</option><option value="OR">或者</option></select><select id="_second_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option selected value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					//if (dimType > 0) return '_x_' + values[0] + translateDimExp(dimType, dimExp, values[1]) + ' ' + values[2] + ' _x_' + values[3] + translateDimExp(dimType, dimExp, values[4]); 
					return '_x_' + values[0] + values[1] + ' ' + values[2] + ' _x_' + values[3] + values[4]; //TODO 复杂判断
				},disp:function(item, disps){
					var v1 = item.find('#_first_oper_ option:selected').text();
					var v2 = disps[0];
					var v3 = item.find('#union option:selected').text();
					var v4 = item.find('#_second_oper_ option:selected').text();
					var v5 = disps[1];
					return v1 + "[" + v2 + "] " + v3 + " " + v4 + "[" + v5 + ']';
				},saveStr:function(item, values){
					var v1 = item.find('#_first_oper_')[0].value;
					var v2 = values[0];
					var v3 = item.find('#union')[0].value;
					var v4 = item.find('#_second_oper_')[0].value;
					var v5 = values[1];
					return '区间:' + v1 + "_,_" + v2 + "_,_" + v3 + "_,_" + v4 + "_,_" + v5;
				},setValues:function(item, values){
					item.find('#_first_oper_').val(values[0]);
					var vs = item.find('._VALUE_');
					vs[0].value = values[1];
					item.find('#union').val(values[2]);
					item.find('#_second_oper_').val(values[3]);
					vs[1].value = values[4];
					item.find('._VALUE_').change();
				}
			},
			{name:'为空',html:function(){
					return ''
				},exp:function(item, values){
					return '_x_ is null';
				},disp:function(item, disps){
					return '为空'
				},saveStr:function(item, values){
					return '为空';
				}
			},
			{name:'不为空',html:function(){
					return ''
				},exp:function(item, values){
					return '_x_ is not null';
				},disp:function(item, disps){
					return '不为空';
				},saveStr:function(item, values){
					return '不为空';
				}
			}
			
		]},
		{type:2,options:[
			{name:'等于',html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个值以“,”隔开。如：李芳,王大涛</span>';
				},exp:function(item, values, dimType, dimExp){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ',';
						//if (dimType>0) r += translateDimExp(dimType, dimExp, vs[i]);
						//else 
						r += "'" + vs[i] + "'";
					}
					if (r.indexOf(',') > 0) return '_x_ in (' + r + ')';
					else return '_x_=' + r;
					return "_x_ in (" + r + ")";
				},disp:function(item, disps){
					return '等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'不等于',html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个值以“,”隔开。如：李芳,王大涛</span>';
				},exp:function(item, values, dimType, dimExp){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ',';
						//if (dimType>0) r += translateDimExp(dimType, dimExp, vs[i]);
						//else 
						r += "'" + vs[i] + "'";
					}
					if (r.indexOf(',') > 0) return '_x_ not in (' + r + ')';
					else return '_x_<>' + r;
				},disp:function(item, disps){
					return '不等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '不等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'包含',noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个值以“,”隔开。如：李,涛</span>';
				},exp:function(item, values, decorated){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' OR ';
						r += "_x_ like '%" + vs[i] + "%'";
						alert(r);
					}
					return r;
				},disp:function(item, disps){
					return '包含[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '包含:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'始于',noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个值以“,”隔开。如：李,王</span>';
				},exp:function(item, values){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' OR ';
						r += "_x_ like '" + vs[i] + "%'";
					}
					return r;
				},disp:function(item, disps){
					return '始于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '始于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'终于',noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个值以“,”隔开。如：芳,涛</span>';
				},exp:function(item, values){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' OR ';
						r += "_x_ like '%" + vs[i] + "'";
					}
					return r;
				},disp:function(item, disps){
					return '终于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '终于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'不包含',noDim:1,html:function(){
					return '_EDITOR_<span style="color:lightGray">注：多个值以“,”隔开。如：李,涛</span>';
				},exp:function(item, values){
					var vs = values[0].split(',');
					var r = '';
					for (i=0; i<vs.length; i++) {
						if (i>0) r += ' AND ';
						r += "_x_ not like '%" + vs[i] + "%'";
					}
					return r;
				},disp:function(item, disps){
					return '不包含[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '不包含:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'为空',html:function(){
					return ''
				},exp:function(item, values){
					return '_x_ is null';
				},disp:function(item, disps){
					return '为空'
				},saveStr:function(item, values){
					return '为空';
				}
			},
			{name:'不为空',html:function(){
					return ''
				},exp:function(item, values){
					return '_x_ is not null';
				},disp:function(item, disps){
					return '不为空';
				},saveStr:function(item, values){
					return '不为空';
				}
			}
		]},
		{type:3,options:[
			{name:'等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_=' + translateDimExp(dimType, dimExp, values[0]);
					return "_x_=date('" + values[0] + "')";
				},disp:function(item, disps){
					return '等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'不等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_<>' + translateDimExp(dimType, dimExp, values[0]);
					return "_x_<>date('" + values[0] + "')";
				},disp:function(item, disps){
					return '不等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '不等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'迟于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_>' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>date(\'' + values[0] + "')";;
				},disp:function(item, disps){
					return '迟于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '迟于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'迟于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_>=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>=date(\'' + values[0] + "')";;
				},disp:function(item, disps){
					return '迟于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '迟于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'早于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_<' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<date(\'' + values[0] + "')";;
				},disp:function(item, disps){
					return '早于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '早于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'早于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_<=' + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<=date(\'' + values[0] + "')";;
				},disp:function(item, disps){
					return '早于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '早于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'区间',html:function(){
					return '<select id="_first_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_<select id="union"><option value="AND">并且</option><option value="OR">或者</option></select><select id="_second_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option selected value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return '_x_' + values[0] + translateDimExp(dimType, dimExp, values[1]) + " " + values[2] + ' _x_' + values[3] + translateDimExp(dimType, dimExp, values[4]); //TODO 复杂判断;
					return '_x_' + values[0] + "date('" + values[1] + "') " + values[2] + ' _x_' + values[3] + "date('" + values[4] + "')"; //TODO 复杂判断
				},disp:function(item, disps){
					var v1 = item.find('#_first_oper_ option:selected').text();
					var v2 = disps[0];
					var v3 = item.find('#union option:selected').text();
					var v4 = item.find('#_second_oper_ option:selected').text();
					var v5 = disps[1];
					return v1 + "[" + v2 + "] " + v3 + " " + v4 + "[" + v5 + ']';
				},saveStr:function(item, values){
					var v1 = item.find('#_first_oper_')[0].value;
					var v2 = values[0];
					var v3 = item.find('#union')[0].value;
					var v4 = item.find('#_second_oper_')[0].value;
					var v5 = values[1];
					return '区间:' + v1 + "_,_" + v2 + "_,_" + v3 + "_,_" + v4 + "_,_" + v5;
				},setValues:function(item, values){
					item.find('#_first_oper_').val(values[0]);
					var vs = item.find('._VALUE_');
					vs[0].value = values[1];
					item.find('#union').val(values[2]);
					item.find('#_second_oper_').val(values[3]);
					vs[1].value = values[4];
					item.find('._VALUE_').change();
				}
			},
/*			{name:'今天',html:function(){
					return '<a style="color:lightgray;">('+ dateUtils.getToday() +')</a>';
				},exp:function(item, values){
					return "_x_=timestamp('" + dateUtils.getToday() + "')";
				},disp:function(item, disps){
					return '今天['+ dateUtils.getToday() +']';
				},saveStr:function(item, values){
					return '今天';
				},setValues:function(item, values){
				}
			},
			{name:'本周',html:function(){
					return '<a style="color:lightgray;">(' + dateUtils.getWeekBegin() + ' --> ' + dateUtils.getWeekEnd() + ')</a>';
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getWeekBegin() + "') AND _x_<=timestamp('" + dateUtils.getWeekEnd() + "')";
				},disp:function(item, disps){
					return '本周[' + dateUtils.getWeekBegin() + ' --> ' + dateUtils.getWeekEnd() + ']';
				},saveStr:function(item, values){
					return '本周';
				},setValues:function(item, values){
				}
			},
			{name:'本月',html:function(){
					return '<a style="color:lightgray;">(' + dateUtils.getMonthBegin() + ' --> ' + dateUtils.getMonthEnd() + ')</a>';
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getMonthBegin() + "') AND _x_<=timestamp('" + dateUtils.getMonthEnd() + "')";
				},disp:function(item, disps){
					return '本月[' + dateUtils.getMonthBegin() + ' --> ' + dateUtils.getMonthEnd() + ']';
				},saveStr:function(item, values){
					return '本月';
				},setValues:function(item, values){
				}
			},
			{name:'本年',html:function(){
					return '<a style="color:lightgray;">(' + dateUtils.getYearBegin() + ' --> ' + dateUtils.getYearEnd() + ')</a>';
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getYearBegin() + "') AND _x_<=timestamp('" + dateUtils.getYearEnd() + "')";
				},disp:function(item, disps){
					return '本年[' + dateUtils.getYearBegin() + ' --> ' + dateUtils.getYearEnd() + ']';
				},saveStr:function(item, values){
					return '本年';
				},setValues:function(item, values){
				}
			},
*/			{name:'为空',html:function(){
					return ''
				},exp:function(item, values){
					return 'is null';
				},disp:function(item, disps){
					return '为空'
				},saveStr:function(item, values){
					return '为空';
				}
			},
			{name:'不为空',html:function(){
					return ''
				},exp:function(item, values){
					return 'is not null';
				},disp:function(item, disps){
					return '不为空'
				},saveStr:function(item, values){
					return '不为空';
				}
			}
		]},
		{type:4,options:[
			{name:'等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return "_x_=timestamp('" + values[0] + "')";
				},disp:function(item, disps){
					return '等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'不等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return "_x_<>timestamp('" + values[0] + "')";
				},disp:function(item, disps){
					return '不等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '不等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'迟于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_>timestamp(\'' + values[0] + "')";;
				},disp:function(item, disps){
					return '迟于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '迟于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'迟于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_>=timestamp(\'' + values[0] + "')";
				},disp:function(item, disps){
					return '迟于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '迟于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'早于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_<timestamp(\'' + values[0] + "')";
				},disp:function(item, disps){
					return '早于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '早于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'早于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values){
					return '_x_<=timestamp(\'' + values[0] + "')";;
				},disp:function(item, disps){
					return '早于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '早于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'区间',html:function(){
					return '<select id="_first_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_<select id="union"><option value="AND">并且</option><option value="OR">或者</option></select><select id="_second_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option selected value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_';
				},exp:function(item, values){
					return '_x_' + values[0] + "timestamp('" + values[1] + "') " + values[2] + ' _x_' + values[3] + "timestamp('" + values[4] + "')"; //TODO 复杂判断
				},disp:function(item, disps){
					var v1 = item.find('#_first_oper_ option:selected').text();
					var v2 = disps[0];
					var v3 = item.find('#union option:selected').text();
					var v4 = item.find('#_second_oper_ option:selected').text();
					var v5 = disps[1];
					return v1 + "[" + v2 + "] " + v3 + " " + v4 + "[" + v5 + ']';
				},saveStr:function(item, values){
					var v1 = item.find('#_first_oper_')[0].value;
					var v2 = values[0];
					var v3 = item.find('#union')[0].value;
					var v4 = item.find('#_second_oper_')[0].value;
					var v5 = values[1];
					return '区间:' + v1 + "_,_" + v2 + "_,_" + v3 + "_,_" + v4 + "_,_" + v5;
				},setValues:function(item, values){
					item.find('#_first_oper_').val(values[0]);
					var vs = item.find('._VALUE_');
					vs[0].value = values[1];
					item.find('#union').val(values[2]);
					item.find('#_second_oper_').val(values[3]);
					vs[1].value = values[4];
					item.find('._VALUE_').change();
				}
			},
			{name:'为空',html:function(){
					return ''
				},exp:function(item, values){
					return 'is null';
				},disp:function(item, disps){
					return '为空'
				},saveStr:function(item, values){
					return '为空';
				}
			},
			{name:'不为空',html:function(){
					return ''
				},exp:function(item, values){
					return 'is not null';
				},disp:function(item, disps){
					return '不为空'
				},saveStr:function(item, values){
					return '不为空';
				}
			}
		]},
		{type:5,options:[
			{name:'等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_=" + translateDimExp(dimType, dimExp, values[0]);
					return "_x_=timestamp('" + values[0] + "')";
				},disp:function(item, disps){
					return '等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'不等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_<>" + translateDimExp(dimType, dimExp, values[0]);
					return "_x_<>timestamp('" + values[0] + "')";
				},disp:function(item, disps){
					return '不等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '不等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'迟于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_>" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>timestamp(\'' + values[0] + "')";
				},disp:function(item, disps){
					return '迟于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '迟于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'迟于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_>=" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_>=timestamp(\'' + values[0] + "')";
				},disp:function(item, disps){
					return '迟于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '迟于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'早于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_<" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<timestamp(\'' + values[0] + "')";
				},disp:function(item, disps){
					return '早于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '早于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'早于等于',html:function(){
					return '_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType>0) return "_x_<=" + translateDimExp(dimType, dimExp, values[0]);
					return '_x_<=timestamp(\'' + values[0] + "')";
				},disp:function(item, disps){
					return '早于等于[' + disps[0] + ']';
				},saveStr:function(item, values){
					return '早于等于:' + values[0];
				},setValues:function(item, values){
					item.find('._VALUE_').val(values[0]);
					item.find('._VALUE_').change();
				}
			},
			{name:'区间',html:function(){
					return '<select id="_first_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_<select id="union"><option value="AND">并且</option><option value="OR">或者</option></select><select id="_second_oper_"><option value=">">大于</option><option value=">=">大于等于</option><option selected value="<">小于</option><option value="<=">小于等于</option></select>_EDITOR_';
				},exp:function(item, values, dimType, dimExp){
					if (dimType > 0) return '_x_' + values[0] + translateDimExp(dimType, dimExp, values[1]) + " " + values[2] + ' _x_' + values[3] + translateDimExp(dimType, dimExp, values[4]); //TODO 复杂判断
					return '_x_' + values[0] + "timestamp('" + values[1] + "') " + values[2] + ' _x_' + values[3] + "timestamp('" + values[4] + "')"; //TODO 复杂判断
				},disp:function(item, disps){
					var v1 = item.find('#_first_oper_ option:selected').text();
					var v2 = disps[0];
					var v3 = item.find('#union option:selected').text();
					var v4 = item.find('#_second_oper_ option:selected').text();
					var v5 = disps[1];
					return v1 + "[" + v2 + "] " + v3 + " " + v4 + "[" + v5 + ']';
				},saveStr:function(item, values){
					var v1 = item.find('#_first_oper_')[0].value;
					var v2 = values[0];
					var v3 = item.find('#union')[0].value;
					var v4 = item.find('#_second_oper_')[0].value;
					var v5 = values[1];
					return '区间:' + v1 + "_,_" + v2 + "_,_" + v3 + "_,_" + v4 + "_,_" + v5;
				},setValues:function(item, values){
					item.find('#_first_oper_').val(values[0]);
					var vs = item.find('._VALUE_');
					//alert(values[1]);
					vs[0].value = values[1];
					item.find('#union').val(values[2]);
					item.find('#_second_oper_').val(values[3]);
					vs[1].value = values[4];
					item.find('._VALUE_').change();
				}
			},
/*			{name:'今天',html:function(){
					return '<a style="color:lightgray;">('+ dateUtils.getToday() +')</a>';
				},exp:function(item, values){
					return "_x_=timestamp('" + dateUtils.getToday() + "')";
				},disp:function(item, disps){
					return '今天['+ dateUtils.getToday() +']';
				},saveStr:function(item, values){
					return '今天';
				},setValues:function(item, values){
				}
			},
			{name:'本周',html:function(){
					return '<a style="color:lightgray;">(' + dateUtils.getWeekBegin() + ' --> ' + dateUtils.getWeekEnd() + ')</a>';
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getWeekBegin() + "') AND _x_<=timestamp('" + dateUtils.getWeekEnd() + "')";
				},disp:function(item, disps){
					return '本周[' + dateUtils.getWeekBegin() + ' --> ' + dateUtils.getWeekEnd() + ']';
				},saveStr:function(item, values){
					return '本周';
				},setValues:function(item, values){
				}
			},
			{name:'本月',html:function(){
					return '<a style="color:lightgray;">(' + dateUtils.getMonthBegin() + ' --> ' + dateUtils.getMonthEnd() + ')</a>';
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getMonthBegin() + "') AND _x_<=timestamp('" + dateUtils.getMonthEnd() + "')";
				},disp:function(item, disps){
					return '本月[' + dateUtils.getMonthBegin() + ' --> ' + dateUtils.getMonthEnd() + ']';
				},saveStr:function(item, values){
					return '本月';
				},setValues:function(item, values){
				}
			},
			{name:'本年',html:function(){
					return '<a style="color:lightgray;">(' + dateUtils.getYearBegin() + ' --> ' + dateUtils.getYearEnd() + ')</a>';
				},exp:function(item, values){
					return "_x_>=timestamp('" + dateUtils.getYearBegin() + "') AND _x_<=timestamp('" + dateUtils.getYearEnd() + "')";
				},disp:function(item, disps){
					return '本年[' + dateUtils.getYearBegin() + ' --> ' + dateUtils.getYearEnd() + ']';
				},saveStr:function(item, values){
					return '本年';
				},setValues:function(item, values){
				}
			},
*/			{name:'为空',html:function(){
					return ''
				},exp:function(item, values){
					return 'is null';
				},disp:function(item, disps){
					return '为空'
				},saveStr:function(item, values){
					return '为空';
				}
			},
			{name:'不为空',html:function(){
					return ''
				},exp:function(item, values){
					return 'is not null';
				},disp:function(item, disps){
					return '不为空'
				},saveStr:function(item, values){
					return '不为空';
				}
			}
		]}
	],
	getType : function(t) {
		for (var i=0; i<conditionConfig.types.length; i++) {
			if (conditionConfig.types[i].type == t) return conditionConfig.types[i];
		}
	},
	getOption : function(t, optName) {
		var type = conditionConfig.getType(t);
		for (var i=0; i<type.options.length; i++) {
			if (type.options[i].name == optName) return type.options[i];
		}
	},
	transfer : function(t, conds, dimType, dimExp) {//把保存的条件翻译成sql条件
		if (conds.indexOf('middleTable1') == 0) {
			var vs = conds.replaceAll('middleTable1','').replaceAll('_;_AND','').split("→");
			return "_x_ IN (SELECT " + vs[1] + " FROM " + vs[0] + ")";
		}
		if (conds.indexOf('middleTable2') == 0) {
			var vs = conds.replaceAll('middleTable2','').replaceAll('_;_AND','').split("→");
			return "_x_ NOT IN (SELECT " + vs[1] + " FROM " + vs[0] + ")";
		}
		if (conds.indexOf('fkwhere1') == 0) {
			var items = conds.replaceAll('fkwhere1','').replaceAll('_;_AND','').split('_fk2_');
			var tName = items[0];
			var tAlias = 't' + new Date().getTime();
			var pks = mdUtils.getTablePKs(tName);
			var conds = '';
			for (var i=0; i<pks.length; i++) {
				if (i > 0) conds += ' AND ';
				conds += tAlias+"."+pks[i].name+"=" + items[i+2];
			}
			return "EXISTS (SELECT " + tAlias + "." + pks[0].name + " FROM " + tName + " " + tAlias + " WHERE " + conds + ")";
		}
		if (conds.indexOf('fkwhere2') == 0) {
			var items = conds.replaceAll('fkwhere2','').replaceAll('_;_AND','').split('_fk2_');
			var tName = items[0];
			var tAlias = 't' + new Date().getTime();
			var pks = mdUtils.getTablePKs(tName);
			var conds = '';
			for (var i=0; i<pks.length; i++) {
				if (i > 0) conds += ' AND ';
				conds += tAlias+"."+pks[i].name+"=" + items[i+2];
			}
			return "NOT EXISTS (SELECT " + tAlias + "." + pks[0].name + " FROM " + tName + " " + tAlias + " WHERE " + conds + ")";
		}
		conds = conds.split('_;_');
		var result = '';
		var andOrs = conds[conds.length-1].split(',');
		for (var i=0; i<conds.length-1; i++) {
			var cond = conds[i];
			var idx = cond.indexOf(':');
			var optName = cond;
			var values = null;
			if (idx > 0) {
				optName = cond.substring(0, idx);
				values = cond.substring(idx + 1).split('_,_');
			}
			var opt = conditionConfig.getOption(t, optName);
			if (result != '') result += ' ' + andOrs[i-1] + ' ';
			result += opt.exp(null, values, dimType, dimExp);
		}
		return result;
	}
}

var mdUtils = {
	getTable : function(t, silence) {
		for (var i=0; i<lmd.tables.length; i++) {
			if (lmd.tables[i].name == t) return lmd.tables[i];
		}
		if (silence) return;
		if (debug) alert('未找到表【' + t + '】');
	},
	getMiddleTables : function() {
		var mts = new Array();
		for (var i=0; i<lmd.tables.length; i++) {
			if (lmd.tables[i].middle) mts[mts.length] = lmd.tables[i];
		}
		return mts;
	},
	getTableAlias : function(t) {
		for (var i=0; i<lmd.tables.length; i++) {
			if (lmd.tables[i].name == t) {
				var ta = lmd.tables[i].dispName;
				if (!ta || ta == '') ta = t;
				return ta;
			}
		}
	},
	getAllSubTables : function(t) {//获得所有子表，先写死的找10层关系
		var ts = new Array();
		var tsNew = new Array();
		ts.push(t);
		tsNew.push(t);
		for (var i=0; i<10; i++){
			var tsi = new Array();
			if (tsNew.length == 0) break;
			for (var j=0; j<tsNew.length; j++){
				tsi = tsi.concat(mdUtils.getSubTables(tsNew[j]));
			}
			tsNew = [];
			if (tsi.length == 0) break;
			for (var j=0; j<tsi.length; j++)
			{
				if (ts.indexOf(tsi[j]) == -1) {
					tsNew.push(tsi[j]);
					ts.push(tsi[j]);
				}
			}
		}
		return ts;
	},
	getShowFields : function(calssName, table, exceptPk) {
		var fs = [];
		if (!mdUtils.classContain(calssName, table, null, null)) return fs;
		var tObj = mdUtils.getTable(table);
		if (tObj && tObj.fields){
			for (var i=0; i<tObj.fields.length; i++){
				if (!mdUtils.classContain(calssName, table, tObj.fields[i].name, null)) continue;
				//alert(tObj.fields[i].name);
				if (exceptPk && tObj.fields[i].pk == 1) continue;
				if (tObj.fields[i].hide == 1) continue;
				fs.push(tObj.fields[i]);
			}
		}
		//alert(table+"--" +fs.length);
		return fs;
	},
	classContain : function(calssName, table, field, dim) {
		var contain = true;
		if (calssName!=null && calssName!='') {
			contain = false;
			for (var k=0; k<lmd.classTables.length; k++) {
				var ck = lmd.classTables[k];
				if (ck.name == calssName) {

					if (table != null) {
						for (var m=0; m<ck.tables.length; m++) {
							var tm = ck.tables[m];
							if (tm.name == table) {
								if (field == null) return true;
								//alert(tm.fields + "------" + field);
								for (var i=0; i<tm.fields.length; i++) {
									if (tm.fields[i] == field) return true;
								}
							}
						}
					} else if (dim != null) {
						for (var m=0; m<ck.dims.length; m++) {
							if (ck.dims[m] == dim) return true;
						}
					}
				}
			}
		}
		return contain;
	},
	getSubTables : function(t,ts) {//获得子表
		if (!ts) ts = new Array();
		var dimObj = mdUtils.getDimByTable(t);
		if (!dimObj) return ts;
		for (var i=0; i<lmd.tables.length; i++) {
			var infoss = new Array();
			byInfosUtil._getDims(lmd.tables[i].name, dimObj.name, infoss, 0, true);
			if (infoss.length>0) ts[ts.length] = lmd.tables[i].name;
		}
		return ts;
/*		
		var ts = new Array();
		var ats = mdUtils.getAnnexTables(t);
		if (ats == null) {
			ats = new Array();
			ats[0] = {name:t,pks:[]};
		}
		for (var z= 0; z<ats.length; z++) {
			for (var i=0; i<lmd.tables.length; i++) {
				var ti = lmd.tables[i];
				if (ti.hide == 1 || ti.name == ats[z].name ) continue;
				for (var j=0; j<ti.fks.length; j++) {
					if (ti.fks[j].destTable == ats[z].name) {
						if (ts.indexOf(ti.name) == -1) {
							ts[ts.length] = ti.name;
						}
						break;
					}
				}
			}
		}
		return ts;
*/
	},
	getFieldDestLevels : function(fObj) {
		if (!fObj) return null;
		if (fObj.destLevels != null && fObj.destLevels.length>0) return fObj.destLevels;
		if (fObj.dim && fObj.dim != '') {
			var dObj = mdUtils.getDimByTableField(fObj.dim);
			if (dObj && dObj.destLevels != null && dObj.destLevels.length>0) return dObj.destLevels;
		}
		return null;
	},
	getSubTableRela : function(t, sub) {
		var ats = mdUtils.getAnnexTables(t);
		if (ats == null) {
			ats = new Array();
			ats[0] = {name:t,pks:[]};
		}
		var str = '';
		sub = mdUtils.getTable(sub);
		for (var z= 0; z<ats.length; z++) {
			for (var i=0; i<sub.fks.length; i++) {
				if (sub.fks[i].destTable == ats[z].name) {
					var v = sub.fks[i].dispName;
					if (editMode == 0 || v == '' || !v) v = sub.fks[i].name;
					if (sub.fks[i].fields.length == 1) {
						var fObj = mdUtils.getField(sub.name, sub.fks[i].fields[0]);
						v = fObj.dispName;
						if (editMode == 0 || v == '' || !v) v = fObj.name;
					}
					if (str != '') str += ',';
					str += v;
				}
			}
		}
		return str;
	},
	getField : function(t, f, mustNull) {
		var t = mdUtils.getTable(t);
		if (t) {
			for (var i=0; i<t.fields.length; i++) {
				if (t.fields[i].name == f) return t.fields[i];
			}
		}
		if (mustNull) return;
		else return {name:f};
	},
	getFieldFK : function(t, f) {// 获得外键，单独以该字段为关系。
		var t = mdUtils.getTable(t);
		if (!t.fks) return;
		for (var i=0; i<t.fks.length; i++) {
			if (t.fks[i].fields.length > 1) continue;
			if (t.fks[i].fields[0] == f) return t.fks[i];
		}
	},
	getFK : function(t, fk) {
		var t = mdUtils.getTable(t);
		if (t.fks) {
			for (var i=0; i<t.fks.length; i++) {
				if (t.fks[i].name == fk) return t.fks[i];
			}
		}
	},
	getTablePKs : function(tName) {
		var t = mdUtils.getTable(tName);
		var pks = new Array();
		if (!t || !t.fields) return pks;
		for (var i=0; i<t.fields.length; i++) {
			var f = t.fields[i];
			if (f.pk == 1) pks[pks.length] = f;
		}
		return pks;
	},
	getLevel : function(name) {
		for (var i=0; i<lmd.levels.length; i++) {
			if (name == lmd.levels[i].name) return lmd.levels[i];
		}
	},
	getAnnexTables : function(t) {
		return mdUtils._getAnnexTables(t);
	},
	//从原始表中获得附表组
	_getAnnexTables : function(t) {
		var ats = new Array();
		ats[0] = {name:t,pks:[]};
		Out:
		for (var i=0; i<lmd.annexTables.length; i++) {
			for (var j=0; j<lmd.annexTables[i].length; j++) {
				if (lmd.annexTables[i][j].name == t) {
					ats = lmd.annexTables[i];
					break Out;
				}
			}
		}
		return ats;		
	},
	isAnnex : function(t1, t2) {
		if (t1 == t2) return true;
		var ts1 = mdUtils.getAnnexTables(t1);
		if (ts1) {
			for (var i=0; i<ts1.length; i++) {
				if (ts1[i].name == t2) return true;
			}
		}
		return false;
	},
	getDim : function(dim) {
		if (!dim) return null; 
		for (var i=0; i<lmd.dims.length; i++) {
			if (dim == lmd.dims[i].name) return lmd.dims[i];
		}
		if (dim.indexOf('.') > 0) {
			var ds = dim.split('.');
			var pk = mdUtils.getField(ds[0],ds[1],true);
			if (pk == null || !pk.pk) return null;
			return {name:dim, dispName:ds[0]+ds[1], table:ds[0], field:ds[1]};
		}
	},
	getDimTable : function(dim) {
		var t = mdUtils.getDim(dim).table;
		var pks = mdUtils.getTablePKs(t);
		if (pks.length == 1) return t;
		else return null;
	},
	setDimValues : function(vs) {
		if (vs == "" || vs == null) return;
		var vs = vs.split(":");
		for (var i=0; i<vs.length; i++) {
			var vsi = vs[i].split(";");
			if (vsi.length<2) continue;
			var dimObj = mdUtils.getDim(vsi[0]);
			if (!dimObj) {
				alert("维“"+vsi[0]+"”不存在！");
				continue;
			} 
			var codes = "";
			var disps = "";
			for (var j=1; j<vsi.length; j++) {
				if (j>1) {
					codes += "r,q";
					disps += "r,q";
				}
				codes += vsi[j];
				disps += vsi[j];
			}
			dimObj.vs = codes + "r;q" + disps;
		}
	},
	getDimByTable : function(table) {
		//return mdUtils.getDim(tableField);
		for (var i=0; i<lmd.dims.length; i++) {
			if (table == lmd.dims[i].table) return lmd.dims[i];
		}
	},
	getDimByTableField : function(tableField) {
		//return mdUtils.getDim(tableField);
		var tableField = tableField.split('.');
		for (var i=0; i<lmd.dims.length; i++) {
			if (tableField[0] == lmd.dims[i].table && tableField[1] == lmd.dims[i].field) return lmd.dims[i];
		}
	},
	isFieldUnique : function(f, t) {
		var ats = mdUtils.getAnnexTables(t);
		if (mdUtils.getTable(t).middle) return false;
		if (!ats) return true;
		for (var i=0; i<ats.length; i++) {
			//if (ats[i].middle) return false;
			if (ats[i].name == t) continue;
			var tObj = mdUtils.getTable(ats[i].name);
			var fs = tObj.fields;
			for (var j=0; j<fs.length; j++) {
				if (fs[j].name == f && fs[j].pk != 1) return false; 
			}
			var fks = tObj.fks;
			for (var j=0; j<fks.length; j++) {
				if (fks[j].name == f) return false; 
			}
		}
		return true;
	},
	getEditStyle : function(name){ //通过名字获得编辑风格
		if (!name) return null;
		for (var i=0; i<editStyles.length; i++) {
			var es = editStyles[i];
			if (es.name == name) return es;
		}
		return null;
	},
	getEditStyleValue : function(name,disp) {
		if (name == '') return disp;
		var edit = mdUtils.getEditStyle(name);
		if (!edit) return disp;
		if (edit.data && edit.data.length>0) {
			for (var i=0; i<edit.data.length; i++) {
				if (edit.data[i].name == disp) return edit.data[i].real;
			}
		}
		return disp;
	},
	setEditStyleDataScope : function(name,dataScope) {
		var edit = mdUtils.getEditStyle(name);
		if (edit) edit.dataScope = dataScope;
	},
	getEditExp4Rpx : function(edit) {
		//alert(edit);
		edit = mdUtils.getEditStyle(edit);
		if (!(edit && edit.data)) return "";
		var codes='',disps='';
		//map(list(0,2),list("男","女"));
		var codeNum=true,dispNum=true;
		for(var i=0; i<edit.data.length; i++) {
			if (edit.data[i].dim != edit.name) continue;
			if (codes != '') {
				codes += ",";
				disps += ",";
			}
			if (codeNum && isNaN(edit.data[i].real)) codeNum = false;
			if (dispNum && isNaN(edit.data[i].name)) dispNum = false;
			codes += edit.data[i].real;
			disps += edit.data[i].name;
		}
		if (codes == '') return "";
		//alert(codes);
		return "map(list("+(codeNum?codes:("'"+codes.replaceAll(",","','")+"'"))+"),list("+(dispNum?disps:("'"+disps.replaceAll(",","','")+"'"))+"))";
	},
	getEsDisps : function(name, values){
		var es = mdUtils.getEditStyle(name);
		if (es == null || !es.codes) return values;
		var codes = es.codes.split(',');
		var disps = es.disps.split(',');
		values = values.split(',');
		var ds = '';
		for (var i=0; i<values.length; i++) {
			if (i>0) ds += ',';
			ds += disps[codes.indexOf(values[i])];
		}
		return ds;
	},
	clearCustomer : function() {
		for (var i=lmd.tables.length-1; i>=0; i--) {
			if (lmd.tables[i].dql) {
				lmd.tables.remove(lmd.tables[i]);
				continue;
			}
			for (var j=lmd.tables[i].fields.length-1; j>=0; j--) {
				if (lmd.tables[i].fields[j].calc == 1) lmd.tables[i].fields.remove(lmd.tables[i].fields[j]);
			}
		}
	},
	getEsHtml : function(es) { //通过编辑风格获得html
		var html = '';
		if (es.type == 1) {
			return '<input type="text" class="_VALUE_" style="width:50px;">';
		} else if (es.type == 2) {
			html = '<select class="_VALUE_">';
			var disps = es.disps.split(',');
			var codes = es.codes.split(',');
			for (var i=0; i<disps.length; i++) {
				html += "<option value='" + codes[i] + "'>" + disps[i] + "</option>"
			}
			html += '</select>';
			return html;
		} else if (es.type == 3) {
			var width = 80;//es.calendarType == 4
			if (es.calendarType == 1||es.calendarType == 8) {
				width = 140;
			} else if (es.calendarType == 2) {
				width = 80;
			} else if (es.calendarType == 3) {
				width = 65;
			}
			return '<input type="text" class="_VALUE_" style="width:' + width + 'px;">';
		} else if (es.type == 4) {
			html = "<input type='hidden' class='_VALUE_'>";
			var disps = es.disps.split(',');
			var codes = es.codes.split(',');
			
			for (var i=0; i<disps.length; i++) {
				html += "<input type=radio value='" + codes[i] + "'>" + disps[i] + "&nbsp;&nbsp;"
			}
			return html;
		} else if (es.type == 5) {
			html = "<input type='hidden' class='_VALUE_'>";
			var disps = es.disps.split(',');
			var codes = es.codes.split(',');
			
			for (var i=0; i<disps.length; i++) {
				html += "<input type=checkbox value='" + codes[i] + "'>" + disps[i] + "&nbsp;&nbsp;"
			}
			return html;
		} else if (es.type == 6) {
			return '<input type="text" class="_VALUE_" style="width:50px;">';
		}
		return html;
	},
	getDimEditStyles : function() {
		var eds = [];
		for (var z=0; z<editStyles.length; z++)
		{
			if (editStyles[z].data && editStyles[z].data.length>0)
			{
				eds.push(editStyles[z].name);
			}
		}
		return eds;
	},
	registerEsEvent : function(es, doms, exp, useTreeDisp){
		var esIdx = -1;
		for (var i=0; i<editStyles.length; i++) {
			if (editStyles[i].name == es) {
				es = editStyles[i];
				esIdx = i;
				break;
			}
		}
		if (esIdx == -1 && editStyles.length>0) {
			es = editStyles[0];
			esIdx = 0;
		}
		if (esIdx == -1) return;
		var modifyEvent = function(){
			//var trs = $('#whereTable tr');
			//if (doms.parents('tr')[0] == trs[trs.length-1]) addNewWhere();
		};
		//doms.find('._VALUE_').change(modifyEvent).keyup(modifyEvent);
		//exp = '?1年?2月?3日--?4时?5分?6秒';
		exp = '';
		if (exp && exp != '') {
			var y = exp.indexOf('?1');
			var m1 = exp.indexOf('?2');
			var d = exp.indexOf('?3');
			var h = exp.indexOf('?4');
			var m2 = exp.indexOf('?5');
			var s = exp.indexOf('?6');
			//假定年月日与时分秒没有掺杂在一起。
			var df='yy-mm-dd', tf='', sep='', pos1=0, pos2=0;
			if (h >= 0 || m2 >= 0 || s >= 0) {
				tf = 'hh:mm:ss';
			}
			/*
			if (h >= 0 || m2 >= 0 || s >= 0) {
				if (y < h) {
					pos1 = y<m1?(m1<d?d:m1):(y<d?d:y);
					pos2 = h<m2?(h<s?h:s):(m2<s?m2:s);
					df = exp.substring(0, pos1 + 2);
					tf = exp.substring(pos2);
					sep = exp.substring(pos1+2, pos2);
				} else {
					pos1 = h<m2?(m2<s?s:m2):(h<s?s:h);
					pos2 = y<m1?(y<d?y:d):(m1<d?m1:d);
					tf = exp.substring(0, pos1 + 2);
					df = exp.substring(pos2);
					sep = exp.substring(pos1+2, pos2);
				}
			} else {
				df = exp;
			}
			df = df.replace('?1','yy').replace('?2','MM').replace('?3','dd')
			tf = tf.replace('?4','hh').replace('?5','mm').replace('?6','ss');
			*/
			if (tf != '') {
				doms.find('._VALUE_').datetimepicker({
					changeMonth: true,
					changeYear: true,
					dateFormat : df,
					timeFormat : tf,
					showTime: tf,
					showSecond : true,
					separator: sep,
					hourGrid: 4,
					minuteGrid: 10,
					secondGrid: 10
					,onClose:function(s,obj){
						myblur();
					}
				});
			} else {
				doms.find('._VALUE_').datepicker({
					changeMonth: true,
					changeYear: true,
					dateFormat : df
					,onClose:function(s,obj){
						myblur();
					}
				});
			}
			return;
		}
		if (es.type == 1) {
		} else if (es.type == 2) {
		} else if (es.type == 3) {
			if (es.dateFormat && es.timeFormat) {
				doms.find('._VALUE_').datetimepicker({
					changeMonth: true,
					changeYear: true,
					dateFormat : es.dateFormat,
					timeFormat : es.timeFormat,
					showSecond: true,
					hourGrid: 4,
					minuteGrid: 10,
					secondGrid: 10
					,onClose:function(s,obj){
						myblur();
					}
				});
			} else if (es.dateFormat) {
				doms.find('._VALUE_').datepicker({
					changeMonth: true,
					changeYear: true,
					dateFormat : es.dateFormat
					,onClose:function(s,obj){
						myblur();
					}
				});
			} else if (es.timeFormat) {
				doms.find('._VALUE_').timepicker({
					timeFormat : es.timeFormat,
					showSecond: true,
					hourGrid: 4,
					minuteGrid: 10,
					secondGrid: 10
					,onClose:function(s,obj){
						myblur();
					}
				});
			} else  if (es.calendarType == 1 || es.calendarType == 8) {
				doms.find('._VALUE_').datetimepicker({
					changeMonth: true,
					changeYear: true,
					dateFormat : es.dateFormat?es.dateFormat:'yy-mm-dd',
					timeFormat : es.timeFormat?es.timeFormat:(es.calendarType==8?'hh:mm:ss':'hh:mm'),
					showSecond: true,
					hourGrid: 4,
					minuteGrid: 10,
					secondGrid: 10
				});
			} else if (es.calendarType == 3) {
				doms.find('._VALUE_').timepicker({
					timeFormat : es.timeFormat?es.timeFormat:'hh:mm:ss',
					showSecond: true,
					hourGrid: 4,
					minuteGrid: 10,
					secondGrid: 10
				});
			} else {
				doms.find('._VALUE_').datepicker({
					changeMonth: true,
					changeYear: true,
					dateFormat : es.dateFormat?es.dateFormat:(es.calendarType==2?'yy-mm-dd':(es.calendarType==4?'yy-mm':(es.calendarType==5?'yy':(es.calendarType==6?'mm':'dd'))))
					,onClose:function(s,obj){
						myblur();
					}
				});
			}
		} else if (es.type == 4) {
			doms.find('input[type="radio"]').click(function(){
				var curr = this.value;
				doms.find('._VALUE_').val(curr);
				doms.find('input[type="radio"]').each(function(){
					if (this.value != curr) this.checked = false; 
				});
			});
			doms.find('._VALUE_').change(function(){
				var curr = this.value;
				doms.find('input[type="radio"]').each(function(){
					this.checked = (this.value == curr); 
				});
			})
		} else if (es.type == 5) {
			doms.find('input[type="checkbox"]').click(function(){
				var vs = '';
				doms.find('input[type="checkbox"]').each(function(){
					if (this.checked) {
						if (vs != '') vs += ',';
						vs += this.value;
					}
				});
				doms.find('._VALUE_').val(vs);
			});
			doms.find('._VALUE_').change(function(){
				var curr = this.value.split(',');
				doms.find('input[type="checkbox"]').each(function(){
					this.checked = (curr.indexOf(this.value)>=0); 
				});
			})
		} else if (es.type == 6) {
			var div = $("#_es_tree_div_" + esIdx);
			//div.remove();
			if (div.length==0) {
				div = $("<div style='position:absolute;display:none;'><div style='overflow-y:auto;overflow-x:auto;background-color:#F8F8F8;width:auto;max-width:300px;height:300px;' id='_es_tree_div_"+esIdx+"'></div></div>");
				$('body').append(div);
			}
			
			var text = doms.find('._VALUE_');
			text.powerFloat({
				target : $("#_es_tree_div_" + esIdx).parent()
				,eventType:'click'
				,zIndex:50000
				,width:'auto'
				,hideCall:function(){
					
				}
				,showCall:function(){
					$("#_es_tree_div_" + esIdx).html('');
					var tree = $("<div class='ztree' style='padding: 10px 20px 0 10px; height: 280px;background-color:#F8F8F8;width:auto;' id='_es_tree_"+esIdx+"'></div>");
					$("#_es_tree_div_" + esIdx).append(tree);
					var data = [];
					var pids = [];
					if (es.dataScope && es.dataScope.length>0)
					{
						
						for (var m=0; m<es.data.length; m++)
						{
							if (es.dataScope.indexOf(es.data[m].real)>=0)
							{
								data.push(es.data[m]);
								pids.push(es.data[m].pId);
							}
						}
						while (pids.length>0)
						{
							var currPids = [];
							for (var m=0; m<es.data.length; m++)
							{
								if (pids.indexOf(es.data[m].id)>=0)
								{
									data.push(es.data[m]);
									currPids.push(es.data[m].pId);
								}
							}
							pids = currPids;
						}
					} else data = es.data;
					$.fn.zTree.init(tree, {
						data: {
							simpleData: {
								enable: true
							}
						}
						,check: {
							enable: true
						}
						,callback: {
							onCheck: function(){
								var nodes = treeObj.getCheckedNodes(true);
								var values = '';
								var disps = '';
								for (var i=0; i<nodes.length; i++) {
									if (nodes[i].dim != es.name) continue;
									if (values.length>0) {
										values += ',';
										disps += ',';
									}
									values += useTreeDisp?nodes[i].name:nodes[i].real;
									disps += nodes[i].name;
								}
								text.val(values);
								text.change();
								text.attr('disp',disps);
								//alert(1);
							}
						}

					}, data);

					treeObj = $.fn.zTree.getZTreeObj("_es_tree_" + esIdx);
					treeObj.checkAllNodes(false);
					var values = text.val().split(',');
					//values = [2];
					var nodes = treeObj.getNodesByFilter(function(node){
						return (node.dim == es.name && values.indexOf(useTreeDisp?node.name:node.real)>=0);
					});
					for (var i=0; i<nodes.length; i++) {
						treeObj.checkNode(nodes[i],true,true,false);
						var parent = nodes[i].getParentNode();
						while(parent) {
							treeObj.expandNode(parent,true,false,false,false);
							parent = parent.getParentNode();
						}
					}
				}
			}).click(function(){
				return;
				var curr = this;

				var div = $("#_es_tree_div_" + esIdx);
				var offset = $(this).offset();
				//if(div.data('curr') && div.data('curr')[0] == this) alert(true);
				div.data('curr', $(this));
				if (div.css('display') != 'none') return;
				es.treeObj.cancelSelectedNode();
				//alert($(this).attr('selectId'));
				es.treeObj.selectNode(es.treeObj.getNodeByTId($(this).attr('selectId')));
				div.css({left:offset.left + "px", top:offset.top + $(this).outerHeight() + 2 + "px"}).slideDown();
				onBodyDown = function(event){
					//alert(1);
					if (!(event.target == curr || $(event.target).parents("#_es_tree_div_" + es.name).length>0)) {
						div.slideUp();
						$("body").unbind("mousedown", onBodyDown);
					}
				}
				
				$("body").bind("mousedown", onBodyDown);
			});
		}
	},
	getDefaultAttr4Dim : function(dim) {
		var dimObj;
		var fObj;
		if (dim.indexOf('.') >= 0) {
			var dim = dim.split('.');
			fObj = mdUtils.getField(dim[0], dim[1]);
		} else {
			dimObj = mdUtils.getDim(dim);
			fObj = mdUtils.getField(dimObj.table, dimObj.field);
		}
		var useDisp = 0;
		var format = fObj.format;
		if (!format) format = '';
		if (format == '') {
			if (fObj.type == 3) {
				format = 'yyyy-MM-dd';
			} else if (fObj.type == 4) {
				format = 'HH:mm:ss';
			} else if (fObj.type == 5) {
				format = 'yyyy-MM-dd';
			}
		}
		if (dimObj && dimObj.sql != null && dimObj.sql != '') {
			useDisp = 1;
		}
		return {useDisp:useDisp,format:format};
	}
}

function myblur() {
	var fi = $('#focusInput888');
	if (fi.length == 0) {
		fi = $('<input type="text" id="focusInput888" style="position:absolute;width:1px;height:1px;font-size:1px;">')
		fi.css("opacity","0");
		$('body').append(fi);
	}
	fi.focus();
}

