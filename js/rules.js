/*
	JS to calculate the evolution of the CA according to Rule30
	(module pattern)
 */

var rules = function() {

	var cWidth;

	/*Generating the CA requires the use of buffers so as to calculate the next
	  generation without mutating the generation we're using to calculate it */
	var thisGeneration;
	var nextGeneration;

	var rule30;

	var generation;

	/*Generate an array of cells representing the first generation of the CA*/
	var firstGen = function() {
		//create zero-filled array the size of canvas width
		cells = new Array (cWidth);
		for (var i = 0; i < cWidth; i++) cells[i] = 0;
		//place a 1 (live cell) in middle (roughly)
		cells[Math.round(cWidth/2)] = 1;
		return cells;
	};

	/*Calculate the evolution of the CA based on the lat generation*/
	var evolve = function(currentGeneration) {
		var returnGeneration = new Array(cWidth);
		for(x=0;x<cWidth; x++) {

			//check the cells neighbors including edge cases
			if(x>0){
				leftNeighbor = currentGeneration[x-1];
			} else {
				leftNeighbor = 0;
			}
			subject = currentGeneration[x];
			if(x<cWidth-1){
				rightNeighbor = currentGeneration[x+1];
			}
			else {
				rightNeighbor = 0;
			}

			//treat the three digits as a binary string and use to lookup in rule table
			key = ""+leftNeighbor+subject+rightNeighbor;

			//convert binary string to base 2 number
			key = parseInt(key, 2);

			//use number as key into rule array to determine state of cell in next gen
			returnGeneration[x] = rule30[key];

		}


		return returnGeneration;
	};

	/*Get the next generation of cells*/
	var getCells = function() {
		//If this is the first call - just return seed cell
		if(generation==0) {

			nextGeneration = thisGeneration;
			generation++;
			return thisGeneration;
		}
		//Othwerise we must evolve the CA and return the next generation

		nextGeneration = evolve(thisGeneration);

		//Copy over old generation to prepare for the next iteration
		thisGeneration = nextGeneration;

		generation++;

		return nextGeneration;
	};

	var init = function(canvasWidth) {
		cWidth = canvasWidth;
		//create array representing first gen with 1 live cell in middle
		thisGeneration = firstGen();
		nextGeneration = new Array (cWidth-1);

		generation = 0;

		//set the binary representation of rule30 based on http://mathworld.wolfram.com/Rule30.html
		rule30 = [0, 1, 1, 1, 1, 0, 0, 0];
	};

	return {
		init : init,
		getCells : getCells
	};

}();