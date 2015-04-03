
//draws a given turtle path using RaphaelJS.

var RaphaeElSystem = function(){

	var paper;
	var turtle;

	var customDrawingMap = {};

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

		if (currentSegment.isCustomDraw){
			customDrawingMap[currentSegment.customDrawingKey]( currentSegment.endX, currentSegment.endY );
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

	function addCustomDrawings(){

		customDrawingMap['b'] =  function drawBulb(x, y){
		
			paper.circle(x, y,  0, 0).attr({opacity:0,  fill:'#008800'})
			.animate({r:10, opacity:1}, 500, 'elastic');
			};

		customDrawingMap['B'] = function drawBloom(x, y){
		
			paper.circle(x, y, 1,1).attr({fill:'#000000'})
			.animate({r:30/2, fill:'#00AA00', opacity:1}, 1200, function(){

			this.animate({r:30,
					fill:'#FFB90F',stroke: '#63D1F4','stroke-width':30/4}, 500,'elastic', function(){
						drawPetals(0, 40, 30, -12, x, y);});});
		
			}
	}

	function drawPetals(i, speed, numPetals, rot, x, y){

		var rotate = rot;
		var bloomRadius = 30;


		if (i >= numPetals){
		
			var leftEye = paper.ellipse(x - 7, y, 0, 30/9)
				.attr({fill:'#FFFFFF', rotation:90})
				.animate({rx:bloomRadius/4, ry:bloomRadius/9}, 600, '>', function(){
	        		
	        		this.animate({rx:0}, 100, '>', function(){
	 		        	this.animate({rx:bloomRadius/4}, 100, '>', function(){
	 		        		
	 		        		this.animate({rx:0}, 100, '>', function(){
	 		 		        	this.animate({rx:bloomRadius/4}, 100, '>');});
	 		        		
	 		        	});	});
	        		
	        	});	
			
		    var rightEye = paper.ellipse(x + 7, y, 0, bloomRadius/9)
		    	.attr({fill:'#FFFFFF', rotation:90})
		    	.animate({rx:bloomRadius/4, ry:bloomRadius/9}, 600, '>', function(){
	        		
	        		this.animate({rx:0}, 100, '>', function(){
	 		        	this.animate({rx:bloomRadius/4}, 100, '>', function(){
	 		        		
	 		        		this.animate({rx:0}, 100, '>', function(){
	 		 		        	this.animate({rx:bloomRadius/4}, 100, '>');});
	 		        		
	 		        	});	});
	        		
	        	});	
	
		    
		    return;		
		}
		
			var currentRotation = ((2 * Math.PI) / numPetals)*(i); 
		
			// Working in radians, where 2pi is the full rotation of the circle

			var x1 = (bloomRadius+(bloomRadius/3)) * Math.cos(currentRotation); // R being the radius of the circle
			var y1 = (bloomRadius+(bloomRadius/3)) * Math.sin(currentRotation); // R being the radius of the circle
			rotate = rotate + 12;
			
			paper.ellipse(x1 + x, y1 + y, 0, 0).attr({fill:'#FFFFFF',rotation:rotate}).animate({rx:bloomRadius/3, ry:bloomRadius/8}, speed, 'bounce', function(){
				drawPetals(i+1, speed, numPetals, rotate, x,y);});
			}

	this.draw = function(domSurface, lsystem, lineLength, anim){ 
		
		getFreshPaper(domSurface, lineLength);

		var instructor = new TurtleInstructor(turtle, lsystem); //TODO: allow this to be subclassed.

		instructor.addCommand('b', instructor.CommandType.CUSTOMDRAW); //pull this out of here.
		instructor.addCommand('B', instructor.CommandType.CUSTOMDRAW); //pull this out of here.

		addCustomDrawings();

		if (anim){

			animate(paper, instructor.generateAsyncTurtlePath());

		} else {

			paper.path( generateRaphaelPathString( instructor.generateTurtlePath() ) );
		}
		
	
	}


}