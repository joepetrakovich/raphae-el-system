
//draws a given turtle path using RaphaelJS.

var RaphaeElSystem = function(){

	

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


	this.draw = function(domSurface, lsystem){ 

		var domElement = document.getElementById(domSurface);

		var width = domElement.offsetWidth;
		var height = domElement.offsetHeight;
	
		var paper = new Raphael(domElement, width, height);
	 	var primer = paper.rect(0,0, width-2, height-2).attr({fill:'#FFF', 'stroke-opacity':0});

		var turtle = new Turtle(width/2, height/2, 90, 10); //step should be passed

		var instructor = new TurtleInstructor(turtle, lsystem);

		var turtlePath = instructor.generateTurtlePath();

		 return generateRaphaelPathString(turtlePath);
		
	

	}

}