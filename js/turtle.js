
//A class representing a turtle used in turtle graphics
var Turtle = function(startX, startY, startingAngle, stepLength){

    this.x = startX;
	this.y = startY;
	this.currentAngle = startingAngle; //90 is up on the coordinate plane.

	var stepLength = stepLength;
	var positionStack = [];
	
	//turn the turtle in 2D space
	this.turn = function(angle){

		this.currentAngle = this.currentAngle + angle;
	};
	
	//advance the turtle in the direction it is facing by one step.
	this.advance = function(){

		this.x = (this.x - (Math.cos((Math.PI/180) * this.currentAngle) * stepLength));
		this.y = (this.y - (Math.sin((Math.PI/180) * this.currentAngle) * stepLength));
	};
	
	this.pushState = function(){
		
		positionStack.push( new Turtle(this.x, this.y, this.currentAngle, stepLength) );
	};
	
	this.popState = function(){
		
		var pastTurtle = positionStack.pop();
		
		this.x = pastTurtle.x;
		this.y = pastTurtle.y;
		this.currentAngle = pastTurtle.currentAngle;
	};

}