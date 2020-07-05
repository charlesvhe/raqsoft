<%@ page contentType="text/html;charset=utf-8" %>

<style>
#top_menu{ float:left;margin:0px;}
#top_menu ul {margin:0px 0 0 20px;}
#top_menu ul li{float:left; display:inline; font-size:16px; line-height:50px; margin: 5px 10px;}
#top_menu ul li a{color:#3B6DCC; padding:5px 10px;line-height:40px;}
#top_menu ul li a:hover, #top_menu ul li a:focus {background-color: #3B6DCC!important;border-color: #f0f0f8 !important;text-decoration: none;border-radius: 4px;-webkit-border-radius: 4px;color: #fff !important;}

#top_menu_mini{ display:none;}

</style>

<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?4c7942f643acd0ccf9f71c61e63ddc07";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>

<header id=headerbar class="header white-bg">
	<div class="sidebar-toggle-box">
		<div data-original-title="折叠侧栏" data-placement="right" class="icon-reorder tooltips"></div>
	</div>
	<!--logo start-->
	<a  class="logo">润乾报表<span>DEMO</span></a>
	<!--logo end-->
	<div class="nav notify-row" id="top_menu" >
		<ul>
			<li><a href="index.jsp">推荐示例</a></li>
			<li><a href="charts.jsp">酷炫图表</a></li>
			<!-- <li><a href="Industry.jsp">行业报表</a></li>  -->
		</ul>
	<!--  notification end -->
	</div>
	<div class="nav notify-row" id="top_menu_mini" >
		<ul>
			<li><a href="index.jsp">推荐</a></li>
			<li><a href="charts.jsp">图表</a></li>
			<!-- <li><a href="Industry.jsp">行业报表</a></li>  -->
		</ul>
	<!--  notification end -->
	</div>
	<div class="top-nav ">
		<!--search & user info start-->
		<ul class="nav pull-right top-menu">
			<li>
				<input type="text" class="form-control search easyui-searchbox" placeholder="请输入报表名" data-options="prompt:'搜索本站',searcher:doSearch" onkeyup="if(event.keyCode==13)doSearch(value);">

			</li>
			
			<li >
				<a href="javascript:readme()"><span class="glyphicon glyphicon-info-sign"></span> 当前报表说明 </a>
			</li>


		</ul>
		<!--search & user info end-->
	</div>
</header>
<!--header end-->

