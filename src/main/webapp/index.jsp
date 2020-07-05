<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>
<%@ page import="com.raqsoft.report.usermodel.Context"%>
<%@ page import="com.raqsoft.report.view.*"%>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title></title>

<script type="text/javascript">
	window.location="<%=request.getSession().getServletContext().getContextPath()%>/reportCenterServlet?action=52";
	
</script>
<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/styles.css" rel="stylesheet">
<script src="js/jquery-1.8.3.min.js"></script>
<script src="js/bootstrap.min.js"></script>
    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-reset.css" rel="stylesheet">
    <!--external css-->
    <link href="assets/font-awesome/css/font-awesome.css" rel="stylesheet" />
    <link href="assets/jquery-easy-pie-chart/jquery.easy-pie-chart.css" rel="stylesheet" type="text/css" media="screen"/>
    <link rel="stylesheet" href="css/owl.carousel.css" type="text/css">
    <!-- Custom styles for this template -->
    <link href="css/style.css" rel="stylesheet">
    <link href="css/style-responsive.css" rel="stylesheet" />

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 tooltipss and media queries -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
      <script src="js/respond.min.js"></script>
    <![endif]-->
  </head>

  <body style="overflow:hidden">

<%
	String url="/demo/reportJsp/showReport.jsp?rpx=/dashboard/dashboard.rpx";
	String search = request.getParameter( "search" );
	String reportName="/dashboard/dashboard.rpx";
	if(search != null && search.length() > 0) {
		url="/reportJsp/showReport.jsp?rpx=/search/search.rpx&scroll=yes&search="+URLEncoder.encode(search,"utf-8");
		reportName="/search/search.rpx";
		}
	

%>
<script type="text/javascript">
	var reportName="<%= reportName%>"
    function show(name){
		//alert("/reportJsp/showReport.jsp?rpx="+encodeURIComponent(name));
		reportName=name;
		console.log(name);
	   document.getElementById("report").src = encodeURI("/demo/reportJsp/showReport.jsp?rpx="+name); 
	   showLoading();
	}
    function readme(){
		document.getElementById("report").src = encodeURI("/demo/reportJsp/showReport.jsp?rpx=/search/readme.rpx&search="+reportName); 
	}

	function showJsp(url,name){
		reportName=name;
	   document.getElementById("report").src = encodeURI(url); 
	   showLoading();
	}
	function doSearch( value ) {
		if( value == "" ) {
			alert( "请输入搜索内容" );
			return;
		}
		var searchUrl = encodeURI( "reportJsp/showReport.jsp?rpx=/search/search.rpx&search=" + value );
		$("#report").attr( "src", searchUrl );
	}
	function showLoading() {
		var mban = document.getElementById( "mengban" );
		var ww = document.getElementById( "sidebar" ).offsetWidth;
		var hh = document.getElementById( "headerbar" ).offsetHeight;
		mban.style.left = ww + "px";
		mban.style.top = hh + "px";
		mban.style.width = document.body.clientWidth - ww + "px";
		mban.style.height = document.getElementById( "mainDiv" ).offsetHeight + "px";
		mban.style.display = "";
	}
	function hideLoading() {
		var mban = document.getElementById( "mengban" );
		mban.style.display = "none";
	}		

</script>


  <section id="container" class="">
      
	<jsp:include page="header.jsp" flush="false" />
                
      <!--sidebar start-->
      <aside>
          <div id="sidebar"  class="nav-collapse ">
              <!-- sidebar menu start-->
			  
              <ul class="sidebar-menu">
                  <li class="sub-menu">
					  <a href="javascript:;" class="">
                          <i class="icon-dashboard"></i>
                          <span>dashboard</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
						  <li><a class="" href="javascript:show('/dashboard/dashboard.rpx')">订单综合表</a></li>
						  <li ><span class="label label-danger pull-right mail-info">新</span><a class="" href="javascript:show('/dashboard/shebeiguzhang.rpx')">设备故障分析</a></li>
						  <li><span class="label label-danger pull-right mail-info">新</span><a class="" href="javascript:show('/dashboard/dashboard-phone.rpx')">手机销售</a></li>
					  </ul>
                  </li>

                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i class="icon-th"></i>
                          <span>基本报表</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/基本报表/网格式报表.rpx')">网格式报表</a></li>
                          <li><a class="" href="javascript:show('/basic/cross.rpx')">交叉报表</a></li>
                          <li><a class="" href="javascript:show('/基本报表/分组报表.rpx')">分组报表</a></li>
                          <li><a class="" href="javascript:show('/基本报表/按段分组.rpx')">按段分组</a></li>
                          <li><a class="" href="javascript:show('/基本报表/归并分组.rpx')">归并分组</a></li>

						  <li><a class="" href="javascript:show('/基本报表/同期比.rpx')">同期比</a></li>
						  <li><a class="" href="javascript:show('/basic/divided.rpx&scroll=yes')">多源分片</a></li>
						  <li><a class="" href="javascript:show('/基本报表/库间关联.rpx')">库间关联</a></li>

						  <li><a class="" href="javascript:showJsp('/demo/reportJsp/showReportGroup.jsp?rpg=newrpg.rpg','newrpg.rpg')">报表组</a></li>
						  <li><a class="" href="javascript:show('/基本报表/统计图跟随扩展.rpx')">统计图跟随扩展</a></li>
                      </ul>
                  </li>
                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i class="icon-cogs"></i>
                          <span>参数表单</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/参数表单/下拉日历.rpx')">下拉日历</a></li>
                          <li><a class="" href="javascript:show('/pf/down.rpx')">下拉联动</a></li>
                          <li><a class="" href="javascript:show('/pf/ddlistbox.rpx')">下拉树</a></li>

						  <li><a class="" href="javascript:show('/参数表单/复选框.rpx')">复选框</a></li>
						  <li><a class="" href="javascript:show('/参数表单/单选按钮.rpx')">单选按钮</a></li>
						  <li><a class="" href="javascript:show('/pf/subway.rpx')">地铁综合查询</a></li>

                      </ul>
                  </li>
                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i class="icon-bar-chart"></i>
                          <span>统计图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/统计图/饼图.rpx')">饼图</a></li>
                          <li><a class="" href="javascript:show('/统计图/折线图.rpx')">折线图</a></li>
                          <li><a class="" href="javascript:show('/统计图/曲线图.rpx')">曲线图</a></li>

						  <li><a class="" href="javascript:show('/统计图/柱状图.rpx')">柱状图</a></li>
						  <li><a class="" href="javascript:show('/统计图/条形图.rpx')">条形图</a></li>
						  <li><a class="" href="javascript:show('/统计图/点线面图.rpx')">点线面图</a></li>
						  <li><a class="" href="javascript:show('/统计图/雷达图.rpx')">雷达图</a></li>

						  <li><a class="" href="javascript:show('/统计图/仪表盘.rpx')">仪表盘</a></li>
						  <li><a class="" href="javascript:show('/统计图/全距图.rpx')">全距图</a></li>
						  <li><a class="" href="javascript:show('/统计图/时间走势图.rpx')">时间走势图</a></li>
						  <li><a class="" href="javascript:show('/统计图/时序状态图.rpx')">时序状态图</a></li>
						  <li><a class="" href="javascript:show('/统计图/甘特图.rpx')">甘特图</a></li>
						  <li><a class="" href="javascript:show('/统计图/工字图.rpx')">工字图</a></li>

                      </ul>
                  </li>
                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i class="icon-glass"></i>
                          <span>动态统计图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/动态统计图/动态饼图.rpx')">动态饼图</a></li>
						  <li><a class="" href="javascript:show('/动态统计图/动态折线图.rpx')">动态折线图</a></li>
						  <li><a class="" href="javascript:show('/动态统计图/动态曲线图.rpx')">动态曲线图</a></li>
						  <li><a class="" href="javascript:show('/动态统计图/动态柱状图.rpx')">动态柱状图</a></li>
						  <li><a class="" href="javascript:show('/动态统计图/动态仪表盘.rpx')">动态仪表盘</a></li>
						  <li><a class="" href="javascript:show('/动态统计图/动态地图.rpx')">动态地图</a></li>
                          
                      </ul>
                  </li>

                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i class="icon-book"></i>
                          <span>特色报表</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
							
                          <li><span class="label label-danger pull-right mail-info">新</span><a class="" href="javascript:show('/defined/dynamicCol.rpx')">自定义分析-动态列</a></li>
						  <li><span class="label label-danger pull-right mail-info">新</span><a class="" href="javascript:show('/特色报表/分组.rpx')">自定义分析-分组</a></li>
						  <li><span class="label label-danger pull-right mail-info">新</span><a class="" href="javascript:show('/特色报表/交叉.rpx')">自定义分析-交叉</a></li>

						  <li><a class="" href="javascript:show('/特色报表/月订单分析.rpx')">月订单分析</a></li>
                          <li><a class="" href="javascript:show('/特色报表/动态选择列.rpx')">动态选择列</a></li>
                          <li><a class="" href="javascript:show('/special/hdepart.rpx')">横向分栏</a></li>
                          <li><a class="" href="javascript:show('/特色报表/错行分栏.rpx')">错行分栏</a></li>
                          <li><a class="" href="javascript:show('/特色报表/JSON数据源.rpx')">JSON数据源</a></li>

						  <li><a class="" href="javascript:show('/特色报表/条件控制分组格式.rpx')">条件控制分组格式</a></li>
						  <li><a class="" href="javascript:show('/特色报表/子表动态插入主表.rpx')">子表动态插入主表</a></li>
						  <li><a class="" href="javascript:show('/特色报表/横向拼接列表.rpx')">横向拼接列表</a></li>
						  <li><a class="" href="javascript:show('/特色报表/交叉表列间计算.rpx')">交叉表列间计算</a></li>

						  <li><a class="" href="javascript:show('/特色报表/动态表头架构树.rpx')">动态表头架构树</a></li>
						  <li><a class="" href="javascript:showJsp('/demo/reportJsp/tree1.jsp','/特色报表/带分组汇总的伸缩表.rpx')">带分组汇总的伸缩表</a></li>
						  <li><a class="" href="javascript:show('/特色报表/统计图钻取.rpx')">统计图钻取</a></li>
						  <li><a class="" href="javascript:show('/特色报表/动态合并格.rpx')">动态合并格</a></li>

                      </ul>
                  </li>

              </ul>
              <!-- sidebar menu end-->
          </div>
      </aside>
      <!--sidebar end-->
      <!--main content start-->
      <section id="main-content" >
          <section class="wrapper">
          
		  <div id=mainDiv  style="height:100%;padding:0px">			<IFRAME ID="report" SRC="<%=url %>" height="100%" width="100%" frameborder=0 scrolling=no seamless></IFRAME> 
		  </div>	<!--/.main col-lg-offset-2-->
<style>
body,html,#main-content,.wrapper {height:100%;}
.wrapper {padding-bottom: 60px;}
#mainDiv {height:90%;}
</style>
		<div id=mengban style="background-color:white;position:absolute;z-index:99999;display:none;width:1500px;height:1200px">
			<table width=100% height=100%>
				<tr><td width=100% style="text-align:center;vertical-align:middle"><img src="raqsoft/images/loading.gif"><br>正在加载报表......</td></tr>
			</table>
		</div>
          </section>
      </section>
      <!--main content end-->
  </section>

    <!-- js placed at the end of the document so the pages load faster -->
    <script type="text/javascript" src="/demo/<%=ReportConfig.raqsoftDir%>/easyui/jquery.easyui.min.js"></script>
    <script src="js/jquery.scrollTo.min.js"></script>
    <script src="js/jquery.nicescroll.js" type="text/javascript"></script>
    <script src="js/jquery.sparkline.js" type="text/javascript"></script>
    <script src="assets/jquery-easy-pie-chart/jquery.easy-pie-chart.js"></script>
    <script src="js/owl.carousel.js" ></script>
    <script src="js/jquery.customSelect.min.js" ></script>

    <!--common script for all pages-->
    <script src="js/common-scripts.js"></script>

    <!--script for this page-->
    <script src="js/sparkline-chart.js"></script>
    <script src="js/easy-pie-chart.js"></script>

  <script>

      //owl carousel

      $(document).ready(function() {
          $("#owl-demo").owlCarousel({
              navigation : true,
              slideSpeed : 300,
              paginationSpeed : 400,
              singleItem : true

          });
      });

      //custom select box
  </script>

  </body>
</html>
