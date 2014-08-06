var init = function() {
	$("#controlbtn").click(function(){start()});
}

var start = function() {
	//set up our canvas
	draw.initCanvas($("#cellCanvas")[0]);
	//start drawing the CA
	draw.drawCa();
};