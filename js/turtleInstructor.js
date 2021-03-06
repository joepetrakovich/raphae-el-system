
//A class used to walk a turtle using a given Lindenmayer system.

var TurtleInstructor = function(startX, startY, startAngle, lineLength, lsystem){

	var turtle = new Turtle(startX, startY, startAngle, lineLength);
	var lsystem = lsystem;

	this.CommandType = {
    	DRAWFORWARD : 0,
    	MOVEFORWARD : 1,
    	TURNLEFT : 2,
    	TURNRIGHT : 3,
    	PUSHSTATE : 4,
    	POPSTATE : 5,
    	CUSTOM : 6
    }

	var commandMap = {

		'F' : this.CommandType.DRAWFORWARD,
		'A' : this.CommandType.DRAWFORWARD,
		'B' : this.CommandType.DRAWFORWARD,
		'G' : this.CommandType.DRAWFORWARD,
 		'f' : this.CommandType.MOVEFORWARD,
		'-' : this.CommandType.TURNLEFT,
		'\u2212' : this.CommandType.TURNLEFT,
		'+' : this.CommandType.TURNRIGHT,
		'[' : this.CommandType.PUSHSTATE,
		']' : this.CommandType.POPSTATE
 
	}

    //Holds one step of turtle movement.
	var Path = function(){

        this.startX;
        this.startY;

        this.endX;
        this.endY;

        this.penDown; //boolean indicating whether the line should be drawn or not.

        this.isBranch = false;
        this.branch = [];

        this.isCustomCommand = false;
        this.customCommandKey; 
    }

	this.addCommand = function(letter, commandType){

		commandMap[letter] = commandType;
	}
	
    function branchTurtle(branch){

    	var path = new Path();

    	path.startX = turtle.x;
    	path.startY = turtle.y;

    	path.endX = turtle.x;
    	path.endY = turtle.y;

    	path.isBranch = true;
    	path.branch = branch;

    	return path;
    }
    
    function moveTurtle(){

    	var path = new Path();

    	path.startX = turtle.x;
    	path.startY = turtle.y;

    	turtle.advance();

    	path.endX = turtle.x;
    	path.endY = turtle.y;

    	return path;
    }

    function moveTurtleWithPenDown(){

    	var path = moveTurtle();
    	path.penDown = true;

    	return path;
    }

    function doCustomCommand(character){
    	var path = new Path();

    	path.startX = turtle.x;
    	path.startY = turtle.y;

    	path.endX = turtle.x;
    	path.endY = turtle.y;

    	path.isCustomCommand = true;
    	path.customCommandKey = character;

    	return path;
    }

    this.generateAsyncTurtlePath = function(){
		
		lsystem.generate();

		var pathStack = [];
		var currentBranchPath = [];
		var currentCharacter = '';
		
		currentBranchPath.push(moveTurtle());
			
		for (var i = 0; i < lsystem.generatedString.length; i++){
			
			currentCharacter = lsystem.generatedString.charAt(i);
			
			if (currentCharacter in commandMap) {
				  
					switch(commandMap[currentCharacter]){
					
						case this.CommandType.DRAWFORWARD:

							currentBranchPath.push(moveTurtleWithPenDown());
							break;

						case this.CommandType.MOVEFORWARD:

							currentBranchPath.push(moveTurtle());
							break;

						case this.CommandType.TURNRIGHT:

							turtle.turn(lsystem.angle);
							break;

						case this.CommandType.TURNLEFT:

							turtle.turn(-(lsystem.angle));
							break;
						
						case this.CommandType.PUSHSTATE:

							turtle.pushState();
							pathStack.push(currentBranchPath);
							currentBranchPath = [];
							break;
						
						case this.CommandType.POPSTATE:

							turtle.popState();
							var finishedBranch = currentBranchPath;
							currentBranchPath = pathStack.pop();
							currentBranchPath.push( branchTurtle(finishedBranch) );
							break;

						case this.CommandType.CUSTOM:
							currentBranchPath.push( doCustomCommand(currentCharacter) );
							break;
					}	

				} else {
				   // ignore 
				}
		}


		return currentBranchPath;

    	
    }

    this.generateTurtlePath = function(){

    	var nextChar = '';
		
		lsystem.generate();

		var paths = [];
		paths.push(moveTurtle());
			
		for (var i = 0; i < lsystem.generatedString.length; i++){
			
			nextChar = lsystem.generatedString.charAt(i);
			
			instruct.call(this, nextChar, paths);
		}


		return paths;
    }
	
    function instruct(character, paths){

    	if (character in commandMap) {
			  
				switch(commandMap[character]){
				
					case this.CommandType.DRAWFORWARD:

						paths.push(moveTurtleWithPenDown());
						break;

					case this.CommandType.MOVEFORWARD:

						paths.push(moveTurtle());
						break;

					case this.CommandType.TURNRIGHT:

						turtle.turn(lsystem.angle);
						break;

					case this.CommandType.TURNLEFT:
						turtle.turn(-(lsystem.angle));
						break;
					
					case this.CommandType.PUSHSTATE:

						turtle.pushState();
						break;
					
					case this.CommandType.POPSTATE:

						turtle.popState();
						break;
					
					case this.CommandType.CUSTOM:
						paths.push(doCustomCommand(character));
						break;

				}	

			} else {
			   // ignore 
			}
    }



}