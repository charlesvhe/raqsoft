<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="java.io.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.net.*" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>润乾报表DEMO-润乾软件</title>

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
	String url="/demo/reportJsp/showReport.jsp?rpx="+URLEncoder.encode("/04第三方统计图/Echarts3/散点图/圈选地图散点查看TOP20.rpx","UTF-8");
	String search = request.getParameter( "search" );
	String reportName="/04第三方统计图/Echarts3/散点图/圈选地图散点查看TOP20.rpx";
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
	   document.getElementById("report").src = encodeURI("/demo/reportJsp/showReport.jsp?rpx="+name); 
	   showLoading();
	}
	function show1(name){
		//alert("/reportJsp/showReport.jsp?rpx="+encodeURIComponent(name));
		reportName=name;
	   document.getElementById("report").src = encodeURI("/demo/reportJsp/showBaidu.jsp?rpx="+name); 
	   showLoading();
	}
    function readme(){
		document.getElementById("report").src = encodeURI("/demo/reportJsp/showReport.jsp?rpx=/search/readme.rpx&search="+reportName); 
	}

	function showJsp(url,name){
		reportName=name;
	   document.getElementById("report").src = encodeURI(""+url); 
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
<style>
ul.sidebar-menu li.sub-menu a i{background: url(img/chart-icon.png) no-repeat; padding:0 10px; margin:0 10px 0 0; font-size: 12px;!important}
#icon-scatter{background-position:left -60px; }
#icon-line{background-position: left -0px; }
#icon-bar{background-position: left -30px; }
#icon-map{background-position: left -240px; }
#icon-pie{background-position: left -120px; }
#icon-radar{background-position: left -150px; }
#icon-KLine{background-position: left -90px; }
#icon-heatmap{background-position: left -330px; }
#icon-funnel{background-position: left -300px; }
#icon-gauge{background-position: left -270px; }
</style>
				  <li class="sub-menu">
					  <a href="javascript:;" class="">
                          <i id="icon-scatter" ></i>
                          <span>散点图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
						 <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/气泡图.rpx')">气泡图</a></li>
						<li><a class="" href="javascript:show1('/04第三方统计图/Echarts3/散点图/百度地图气泡图.rpx')">百度地图气泡图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/矢量地图气泡图.rpx')">矢量地图气泡图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/地图气泡联动曲线.rpx')">地图气泡联动曲线</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/带数值杆散点图.rpx')">带数值杆散点图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/圈选地图散点查看TOP20.rpx')">圈选地图散点查看前20</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/彩色散点地图.rpx')">彩色散点地图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/雷达式散点图.rpx')">雷达式散点图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/两维散点图.rpx')">两维散点图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/单轴散点图.rpx')">单轴散点图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/多分布区散点图.rpx')">多分布区散点图</a></li>
						<li><a class="" href="javascript:show('/04第三方统计图/Echarts3/散点图/世界地图气泡图.rpx')">世界地图气泡图</a></li>



					  </ul>
                  </li>
                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i id="icon-line"></i>
                          <span>折线图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/上下折线图.rpx')">上下折线图</a></li>
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/大数据量面积图.rpx')">大数据量面积图</a></li>
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/堆积面积图.rpx')">堆积面积图</a></li>
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/按时间动态数据.rpx')">按时间动态数据</a></li>
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/上下双折线图.rpx')">上下双折线图</a></li>

						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/MINI曲线图.rpx')">MINI曲线图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/最大最小标示折线图.rpx')">最大最小标示折线图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/极坐标双数值轴.rpx')">极坐标双数值轴</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/区间高亮折线图.rpx')">区间高亮折线图</a></li>

						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/折线图/其他曲线图.rpx')">其他曲线图</a></li>


                      </ul>
                  </li>
                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i id="icon-bar"></i>
                          <span>柱状图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/柱状图动画延迟.rpx')">柱状图动画延迟</a></li>
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/柱状图框选.rpx')">柱状图框选</a></li>
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/正负条形图.rpx')">正负条形图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/交错正负轴标签.rpx')">交错正负轴标签</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/堆叠柱状图.rpx')">堆叠柱状图</a></li>

						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/阶梯瀑布图.rpx')">阶梯瀑布图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/堆叠条形图.rpx')">堆叠条形图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/簇状条形图.rpx')">簇状条形图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/最大最小值柱状图.rpx')">最大最小值柱状图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/动态数据柱线图.rpx')">动态数据柱线图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/簇状柱线图.rpx')">簇状柱线图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/柱状图/时序主饼图.rpx')">时序主饼图</a></li>

                      </ul>
                  </li>
                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i id="icon-map"></i>
                          <span>地图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/地图/中国地图-模拟迁徙.rpx')">中国地图-模拟迁徙</a></li>
                          <!--
						  <li><a class="" href="javascript:show('/地图/世界地图-飞机航线.rpx')">世界地图-飞机航线</a></li>
                          <li><a class="" href="javascript:show('/地图/百度地图-北京公交路线.rpx')">百度地图-北京公交路线</a></li>

						  <li><a class="" href="javascript:show('/地图/线特效-北京公交路线.rpx')">线特效-北京公交路线</a></li>
						  <li><a class="" href="javascript:show('/地图/杭州热门步行路线.rpx')">杭州热门步行路线</a></li>
						  <li><a class="" href="javascript:show('/地图/香港人口密度.rpx')">香港人口密度</a></li>
-->

						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/地图/北上广动态聚焦.rpx')">北上广动态聚焦</a></li>

						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/地图/中国区域图.rpx')">中国区域图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/地图/世界区域图.rpx')">世界区域图</a></li>

                      </ul>
                  </li>
                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i  id="icon-pie"></i>
                          <span>饼图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/饼图/饼图.rpx')">饼图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/饼图/环形图.rpx')">环形图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/饼图/纹理饼图.rpx')">纹理饼图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/饼图/南丁格尔玫瑰图.rpx')">南丁格尔玫瑰图</a></li>
                          
                      </ul>
                  </li>

                  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i  id="icon-radar"></i>
                          <span>雷达图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/雷达图/切换系列雷达图.rpx')">切换系列雷达图</a></li>
                          <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/雷达图/自定义雷达图.rpx')">自定义雷达图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/雷达图/多雷达图.rpx')">多雷达图</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/雷达图/时序雷达图.rpx')">时序雷达图</a></li>
                      </ul>
                  </li>

				  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i  id="icon-KLine"></i>
                          <span>K线图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/K线图/K线图.rpx')">K线图</a></li>
						  <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/K线图/K线图-最高最低标示.rpx')">K线图-最高最低标示</a></li>
                      </ul>
                  </li>

				  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i  id="icon-heatmap"></i>
                          <span>热力图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/热力图/笛卡尔坐标系上的热力图.rpx')">笛卡尔坐标系上热力图</a></li>
						  <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/热力图/热力图-颜色的离散映射.rpx')">热力图-颜色的离散映射</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/热力图/热力图-2w数据.rpx')">热力图-2w数据</a></li>
						  <li><a class="" href="javascript:show('/04第三方统计图/Echarts3/热力图/热力图-地图.rpx')">热力图-地图</a></li>
                      </ul>
                  </li>

				  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i  id="icon-funnel"></i>
                          <span>漏斗图</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/漏斗图/漏斗图-金字塔.rpx')">漏斗图-金字塔</a></li>
						  <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/漏斗图/漏斗图.rpx')">漏斗图</a></li>
                      </ul>
                  </li>

				  <li class="sub-menu">
                      <a href="javascript:;" class="">
                          <i  id="icon-gauge"></i>
                          <span>仪表盘</span>
                          <span class="arrow"></span>
                      </a>
                      <ul class="sub">
                          <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/仪表盘/仪表盘.rpx')">仪表盘</a></li>
						  <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/仪表盘/汽车仪表盘.rpx')">汽车仪表盘</a></li>
						  <li> <a class="" href="javascript:show('/04第三方统计图/Echarts3/仪表盘/汽车仪表盘-黑.rpx')">汽车仪表盘-黑</a></li>

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
		  <div id=mainDiv  style="height:100%;padding:0px;">			<IFRAME ID="report" SRC="<%=url %>" height="100%" width="100%" frameborder=0 scrolling=no seamless></IFRAME> 
		  </div>	<!--/.main col-lg-offset-2-->

<style >
body,html,#main-content,.wrapper {height:100%;}
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

      $(function(){
          $('select.styled').customSelect();
      });

  </script>

  </body>
</html>
