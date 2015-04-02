
//A class used to walk a turtle using a given Lindenmayer system.

var TurtleInstructor = function(turtle, lsystem){


	var turtle = turtle;
	var lsystem = lsystem;

    //Holds one step of turtle movement.
	var Path = function(){

        this.startX;
        this.startY;

        this.endX;
        this.endY;

        this.penDown; //boolean indicating whether the line should be drawn or not.
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

    this.generateTurtlePath = function(){

    	var nextChar = '';
		
		lsystem.generate();

		var paths = [];
		paths.push(moveTurtle());
			
		for (var i = 0; i < lsystem.generatedString.length; i++){
			
			nextChar = lsystem.generatedString.charAt(i);
			
			switch(nextChar){
			
			case 'F':
				paths.push(moveTurtleWithPenDown());
				break;
			case 'f':
				paths.push(moveTurtle());
				break;
			case '+':
				turtle.turn(lsystem.angle);
				break;
			case '-':
				turtle.turn(-(lsystem.angle));
				break;
			case '\u2212':
				turtle.turn(-(lsystem.angle));
				break;
			case '[':
				turtle.pushState();
				break;
			case ']':
				turtle.popState();
				break;
			}
		}

		return paths;
    }


}