/*
	JS that is primarly responsible for working with and drawing on the canvas element.
	(module pattern)
 */

var draw = (function () {
	//Variable declarations so as to note polute global scope
	var canvas;
	var context;
	//The canvas image being generated from the ca represented by black/white pixels
	var imageData;

	//Canvas width
	var cWidth;
	//Canvas height: determines number of generations shown
	var cHeight;

	//The current generation of the given CA. Each generation is rep. by one row of pixels
	var generation;

	//Used control the speed with which each generation of the CA is drawn
	var rowInterval;

	var initCanvas = function (myCanvas) {
		//Set the canvas size to fit browser window when loaded
            $("#cellCanvas").prop('width', $("#container-canvas").width());
            //Setting the height to half the width allows the CA not to be cut off at bottom
            $("#cellCanvas").prop('height', $("#container-canvas").width()/2);
		canvas = myCanvas;
		context = canvas.getContext('2d');

		//Get height/width of canvas and use it to init the image
		cWidth = canvas.width;
		cHeight = canvas.height;
		imageData = context.createImageData(cWidth, cHeight);

		//draw the canvas as a white rectangle
		context.fillStyle = "#FFF";
		context.fillRect(0, 0, cWidth, cHeight);

		generation = 0;
	};

	//Code to turn image into png and save it
	function download() {
		  var url = canvas.toDataURL("image/png");
	      url = url.replace("image/png", "image/octet-stream");
	      document.location.href = url;
	      return;
	}

	//Stop calculating/rendering the CA
	var caFinished = function() {
		//Clear interval and stop calling drawGeneration
		rowInterval = clearInterval(rowInterval);

		//fade control btn
		$("#controlbtn").fadeToggle(500, function () {
			$("#controlbtn").html('Restart');
			$("#controlbtn").removeClass("btn-warning").addClass("btn-success");
		});
		$("#controlbtn").fadeToggle();

		//Set the control btn to restart when clicked
		$("#controlbtn").unbind();
		$("#controlbtn").click(function(){start()});

		//enable download button to save ca as png
		$("#downloadbtn").removeClass("disabled");
		$("#downloadbtn").click(function(){download()});
	}

	//Sets a single cell (pixel) to the canvas image by setting RGBA values for pixel
	var drawCell = function(bit, pixelIndex) {
		var color = 255; //default white
		if(bit==1) { color = 0; } //if the bit is a 1, set RGB value to 0 (black)

		imageData.data[pixelIndex] = color; //R
		imageData.data[pixelIndex+1] = color; //G
		imageData.data[pixelIndex+2] = color; //B
		imageData.data[pixelIndex+3] = 255; //opacity always max
	}

	/* Sets a single generation of the CA (row of pixels) to the canvas image based on
	   an array of bits with size=width of canvas. */
	var drawGeneration = function(cells) {
		//make sure we're not exeeding the number of generations that can fit on the canvas
		if(generation == (cHeight-1)) {
			//clear the interval to draw generations and break

			caFinished();
			return;
			//This could be improved so as to not check every iteration
		}

		//each row of the image has 4*canvas-width values (r,g,b,a)
		//First index for the row of pixels
		var rowIndex = generation * cWidth * 4;
		//Current cell index
		var cellIndex = 0;

		//iterate through pixels for the row
		for(i=rowIndex; i<(rowIndex+(cWidth*4)); i+=4) {
			//set pixel value in image for given cell
			if(cells[cellIndex]==1){
				//Only alter image data if the cell is live. Background is already white
				drawCell(cells[cellIndex], i);
			}

			cellIndex++;
		}
		generation++;
		renderGeneration();
	}

	/*Actually sets the image to the canvas and draws on screen */
	var renderGeneration = function() {
		context.putImageData(imageData,0,0);
		/*This function uses a lot of cpu. Can call it every so often
		to save CPU or just call at end to save a lot. Calling it every
		generation lets you see evolution though.*/
	}

	/*Continues drawing a CA that was paused during drawing*/
	var unPauseCa = function() {
		rowInterval = setInterval(function() {drawGeneration(rules.getCells());}, 0);
		$("#controlbtn").fadeToggle(0, function () {
			$("#controlbtn").html('Pause');
			$("#controlbtn").removeClass("btn-success").addClass("btn-warning");
		});
		$("#controlbtn").fadeToggle();
		$("#controlbtn").unbind();
		$("#controlbtn").click(function(){pauseCa()});
	}

	/*Pauses the CA that's currently being generated*/
	var pauseCa = function() {
		rowInterval = clearInterval(rowInterval);
		$("#controlbtn").fadeToggle(0, function () {
			$("#controlbtn").html('Resume');
			$("#controlbtn").removeClass("btn-warning").addClass("btn-success");
		});
		$("#controlbtn").fadeToggle();
		$("#controlbtn").unbind();
		$("#controlbtn").click(function(){unPauseCa()});
	}

	/*Starts or continues drawing the CA*/
	var drawCa = function() {
		initCanvas($("#cellCanvas")[0]);
		// $("#controlbtn").removeClass("btn-success").addClass("btn-warning");
		$("#controlbtn").fadeToggle(0, function () {
			$("#controlbtn").html('Pause');
			$("#controlbtn").removeClass("btn-success").addClass("btn-warning");
		});
		$("#controlbtn").fadeToggle();
		$("#controlbtn").unbind();
		$("#controlbtn").click(function(){pauseCa()});

		//calculate cell values for each generation of the CA and draw each one
		rules.init(cWidth);

		//keep calling drawGeneration until canvas is filled
		rowInterval = setInterval(function() {drawGeneration(rules.getCells());}, 0);
	};

	var adjustCanvas = function() {
		canvas.prop('width', $("#container-canvas").width());
        canvas.prop('height', $("#container-canvas").height());
        init($("#cellCanvas")[0])
	}


	return {
		initCanvas : initCanvas,
		drawCa : drawCa
	};

}());


