<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
</head>
<script language=javascript>
	function showReport( rpx, matchScreen, bkColor ) {
		var url = "mbReport.jsp?rpx=" + encodeURIComponent( rpx );
		if( matchScreen != null ) url += "&match=" + matchScreen;
		if( bkColor != null ) url += "&bkcolor=" + bkColor;
		document.location = url;
	}
	function showParam( arg, rpx, matchScreen ) {
		var url = "mbParam.jsp?arg=" + encodeURIComponent( arg ) + "&rpx=" + encodeURIComponent( rpx );
		if( matchScreen != null ) url += "&match=" + matchScreen;
		document.location = url;
	}
	function setShareUrl() {
		window.reportApp.setShareUrl( document.location.href );
	}
</script>

<link href="style.css" rel="stylesheet" type="text/css" />
<body >
<div id="container">
        <div id="main">
            <div id="headerImage">
                <img src="images/pic-1.png"/>
            </div>
            <div id="cent">
            <div id="kg1">
                <div id="part1" class="leftImg">
                	<a onClick="showReport('/mobile/match.rpx','1','404A59')">
                    <img src="images/icon1.png"/>
                    <p class="tt">按宽自适应</p>
                    </a>
                </div>
                <div id="part2" class="rightImg">
                <a onClick="showReport('/mobile/match.rpx','2','404A59')">
                    <img src="images/icon2.png"/>
                    <p class="tt">按高自适应</p></a>
                </div>
             </div>
             <div id="kg2">
                <div id="part3" class="leftImg">
                <a onClick="showReport('/mobile/match.rpx','3','404A59')">
                    <img src="images/icon3.png"/>
                    <p class="tt">竖按高，横按宽</p></a>
                </div>
                <div id="part4" class="rightImg">
                <a onClick="showReport('/mobile/match.rpx','4','404A59')">
                    <img src="images/icon4.png"/>
                    <p class="tt">竖按宽，横按高</p></a>
                </div>
             </div>
			 <div id="kg3">
                <div id="part5" class="leftImg">
                <a onClick="showReport('/mobile/match.rpx','5','404A59')">
                    <img src="images/icon5.png"/>
                    <p class="tt">竖屏宽高自适应<br>横屏无自适应</p></a>
                </div>
                <div id="part6" class="rightImg">
                <a onClick="showReport('/mobile/match-2.rpx','6','404A59')">
                    <img src="images/icon6.png"/>
                    <p class="tt">竖屏无自适应<br>横屏宽高自适应</p></a>
                </div>
             </div>
             <div id="kg4">
                <div id="part7" class="leftImg">
                <a onClick="showReport( '/mobile/列宽自适应.rpx' )">
                    <img src="images/icon7.png"/>
                    <p class="tt">列宽自适应</p></a>
                </div>
                <div id="part8" class="rightImg">
                <a onClick="document.location='scan.jsp'">
                    <img src="images/icon8.png"/>
                     <p class="tt">二维码输入</p></a>
                </div>
              </div>
              <div id="kg5">
                <div id="part9" class="leftImg">
                <a onClick="showParam( '/mobile/下拉联动_arg.rpx', '/mobile/下拉联动.rpx' )">
                    <img src="images/icon9.png"/>
                     <p class="tt">参数表单</p></a>
                </div>
                <div id="part10" class="rightImg">
                <a onClick="showReport( '/mobile/phone.rpx' )">
                    <img src="images/icon10.png"/>
                     <p class="tt">长按拨号</p></a>
               </div>
               </div>
            </div>
            <div id="nextImage">
				
                <img src="images/pic-2.png"/>
				
            </div>
            <div id="chartsImg">
                <a onClick="showReport('/mobile/phone_1.rpx','1','000000')">
					<div class="more">
						<img src="images/mb-1.png">
					</div>
				</a>
				<!--<a onClick="showReport('/mobile/phone_2.rpx','1','000000')">
					<div class="more">
						<img src="images/mb-2.png">
					</div>
				</a>
				-->
				<a onClick="showReport('/mobile/phone_3.rpx','1','000000')">
					<div class="more">
						<img src="images/mb-3.png">
					</div>
				</a>
				
				<a onClick="showReport('/mobile/phone_4.rpx','1','F6F6F6')">
					<div class="more">
						<img src="images/mb-4.png">
					</div>
				</a>
            </div>

        </div>
    </div>


	
</body>
</html>
