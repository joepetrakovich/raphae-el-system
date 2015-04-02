
//draws a given turtle path using RaphaelJS.

var RaphaeElSystem = function(){

	var paper;

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


	this.draw = function(domSurface, lsystem, lineLength){ 

		var domElement = document.getElementById(domSurface);

		var width = domElement.offsetWidth;
		var height = domElement.offsetHeight;
		var padding = window.getComputedStyle(domElement, null).getPropertyValue('padding');
	
		paper = new Raphael(domElement, width, height);

		//starts in the middle bottom of paper.  use height/2 for middle of paper.
		var turtle = new Turtle(width/2, height, 90, lineLength); //step should be passed

		var instructor = new TurtleInstructor(turtle, lsystem);

		var turtlePath = instructor.generateTurtlePath();

		paper.path(generateRaphaelPathString(turtlePath));
		
	
	}

	this.clear = function(){

		if (paper != undefined){
			var paperDom = paper.canvas;
    		paperDom.parentNode.removeChild(paperDom);
			paper.remove();
		}
	}

}