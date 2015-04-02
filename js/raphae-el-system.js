
//draws a given turtle path using RaphaelJS.

var RaphaeElSystem = function(){

	var paper;
	var turtle;

	function generateRaphaelPathString(turtlePath){

			var raphPath = "";

			for (var i = 0; i < turtlePath.length; i++){

				var currentPath = turtlePath[i];

				if (currentPath.penDown){
					//not sure if i need the oldX,Y...
					//raphPath = raphPath + ("M" + currentPath.startX + " " + currentPath.startY);
					raphPath = raphPath + ("L" + currentPath.endX + " " + currentPath.endY);

				} else {

					raphPath = raphPath + ("M" + currentPath.endX + " " + currentPath.endY);
				}
			}

			return raphPath;
	}



	function animate(paper, turtlePath){

		animateSegment(paper, turtlePath, 0);
	}

	function animateSegment(paper, turtlePath, i){

		var currentSegment = turtlePath[i];

		if (currentSegment == undefined){
			return;
		}

		var start = "M" + currentSegment.startX + " " + currentSegment.startY;
		var end = "L" + currentSegment.endX + " " + currentSegment.endY;

		var lineStart = paper.path(start);

		lineStart.animate( {path : (start + end)}, 500, 
			function(){
						animateSegment(paper, turtlePath, i+1); //when one segment finished, animate next.
					});

	}


	function clearPaper(){

		if (paper != undefined){
			var paperDom = paper.canvas;
    		paperDom.parentNode.removeChild(paperDom);
			paper.remove();
		}
	}

	function getFreshPaper(domSurface, lineLength){

		var domElement = document.getElementById(domSurface);

		var width = domElement.offsetWidth;
		var height = domElement.offsetHeight;

		clearPaper();
		
		paper = new Raphael(domElement, width, height);

		//starts in the middle bottom of paper.  use height/2 for middle of paper.
		turtle = new Turtle(width/2, height, 90, lineLength); //step should be passed
	}

	this.draw = function(domSurface, lsystem, lineLength, anim){ 
		
		getFreshPaper(domSurface, lineLength);

		var instructor = new TurtleInstructor(turtle, lsystem);

		var turtlePath = instructor.generateTurtlePath();

		if (anim){

			animate(paper, turtlePath);

		} else {

			paper.path(generateRaphaelPathString(turtlePath));
		}
		
	
	}


}