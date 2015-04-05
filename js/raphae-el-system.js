
var RaphaeElSystem = function () {

	var paper,
	lSystem,
	customCommandMap,
	domElement,
	paperWidth,
	paperHeight,
	startX,
	startY,
	startAngle,
	lineLength,
	drawSpeedMillis,
	lineAttributes;
	
	var isPaperConfigured = false;

	//Set up the drawing surface, where the pen will start (top left is 0,0),
	//the starting draw angle (90 is straight up) the length of line segments (in pixels),
    //and a RaphaelJS attr object to apply to line segments.
	this.configurePaper = function(domElementId, x, y, angle, lineLen, attr){
		
		domElement = document.getElementById(domElementId);

		paperWidth = domElement.offsetWidth;
		paperHeight = domElement.offsetHeight;
		
		startX = parseFloat(x);
		startY = parseFloat(y);
		startAngle = parseFloat(angle);
		lineLength = parseInt(lineLen);
		
		lineAttributes = attr;
		
		isPaperConfigured = true;
		
		return this;
		
	}

	this.setLSystem = function(lsys){
		
		lSystem = lsys;
		
		return this;
	}
		
	//A key,value object where a key is a single character and a value
	//is a function.  Keys can be used in your L-System alphabet and when encountered,
	//will fire the function, being passed the x, y coordinates of the turtle (the current draw position).
	//A common example would be a custom raphael drawing, such as to draw a flower bulb at the tip of branches.
	//Characters F, f, +, -, [, and ] cannot be remapped.
	this.setCustomCommandMap = function(map){
		
		customCommandMap = map;
		
		return this;
	}	
	
	//Begin drawing.  Drawing will be animated if anim = true;
	this.draw = function(anim, speedMillis){ 
		
		if (isPaperConfigured == false || lSystem == undefined){
			console.error("configurePaper() and setLSystem() must be called before draw().");
			return;
		}
		
		clearPaper();

		var turtleInstructor = initTurtleInstructor(startX, startY, startAngle, lineLength, lSystem);

		if (anim){

			animate(paper, parseInt(speedMillis), turtleInstructor.generateAsyncTurtlePath());

		} else {

			var drawing = paper.path( generateRaphaelPathString( turtleInstructor.generateTurtlePath() ) );
			
			if (lineAttributes != undefined){
				
				drawing.attr(lineAttributes);
			}			
			
		}
		
	}

	//Wipe paper clean.  Not needed between subsequent draw() calls.
	this.clear = function(){
		clearPaper();
	}
	
	function clearPaper(){

		if (paper != undefined){
			var paperDom = paper.canvas;
    		paperDom.parentNode.removeChild(paperDom);
			paper.remove();
		}
		
		paper = new Raphael(domElement, paperWidth, paperHeight);
	}

	function initTurtleInstructor(startX, startY, startAngle, lineLength, lsystem){
		
		var instructor = new TurtleInstructor(startX, startY, startAngle, lineLength, lsystem);
		
		if (customCommandMap != undefined){
			
			var keys = Object.keys(customCommandMap);
			
			for (var i = 0; i < keys.length; i++){
				
				instructor.addCommand(keys[i], instructor.CommandType.CUSTOM);
			}
		}
		
		return instructor;
	}
	
	function generateRaphaelPathString(turtlePath){

			var raphPath = "";

			for (var i = 0; i < turtlePath.length; i++){

				var currentPath = turtlePath[i];

				if (currentPath.isCustomCommand){
					customCommandMap[currentPath.customCommandKey]( paper, currentPath.endX, currentPath.endY );
					continue;
				}
				
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

	function animate(paper, speed, turtlePath){

		animateSegment(paper, turtlePath, 0, speed);
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

		if (currentSegment.isCustomCommand){
			customCommandMap[currentSegment.customCommandKey]( paper, currentSegment.endX, currentSegment.endY );
			animateSegment(paper, turtlePath, i+1, speed);
			return;
		}

		//standard line drawing
		var start = "M" + currentSegment.startX + " " + currentSegment.startY;

		var end;
		if (currentSegment.penDown){
			end = "L";
		} else {
			end = "M";
		}
		
		end = end + currentSegment.endX + " " + currentSegment.endY;

		var line = paper.path(start);

		line.animate( {path : (start + end)}, speed, 
			function(){
						animateSegment(paper, turtlePath, i+1, speed); //when one segment finished, animate next.
					});
		
		if (lineAttributes != undefined){
				
			line.attr(lineAttributes);
		}	

	}


}