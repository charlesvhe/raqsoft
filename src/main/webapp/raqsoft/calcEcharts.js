var page = require("webpage").create();
page.viewportSize = { width: 1, height: 1 };
var system = require('system');     
var echarts = system.args[1];
var needWait = system.args[2];
var divwidth = system.args[3];
var divheight = system.args[4];
if( divwidth != null && divwidth != "" ) {
	var w = parseInt( divwidth, 10 );
	var h = parseInt( divheight, 10 );
	page.clipRect = { top: 0, left: 0, width: w, height: h };
}
page.open( echarts, function( status ) {
	if(status !== "success") {
        console.log( "open fail!" );
    }
    if( needWait == "yes" ) slimer.wait( 2000 );
    var image = "data:image/png;base64," + page.renderBase64( "png" );
  	console.log( image );
    slimer.exit();
});
