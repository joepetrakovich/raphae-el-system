
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


	function animateAsync(paper, turtlePath){

		
	}

	function animate(paper, turtlePath){

		animateSegment(paper, turtlePath, 0, 10);
	}

	function animateSegment(paper, turtlePath, i, speed){

		var currentSegment = turtlePath[i];

		if (currentSegment == undefined){
			return;
		}

		//animate the branch and continue current branch at same time.
		if (currentSegment.isBranch){
			animateSegment(paper, currentSegment.branch, 0, speed);
			animateSegment(paper, turtlePath, i+1, speed);
			return;
		}

		var start = "M" + currentSegment.startX + " " + currentSegment.startY;

		var end;

		if (currentSegment.penDown){
			end = "L";
		} else {
			end = "M";
		}
		
		end = end + currentSegment.endX + " " + currentSegment.endY;

		var lineStart = paper.path(start);

		lineStart.animate( {path : (start + end)}, speed, 
			function(){
						animateSegment(paper, turtlePath, i+1, speed); //when one segment finished, animate next.
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

		if (anim){

			animate(paper, instructor.generateAsyncTurtlePath());

		} else {

			paper.path( generateRaphaelPathString( instructor.generateTurtlePath() ) );
		}
		
	
	}


}