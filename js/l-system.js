

var Lsystem = function(axiom, numDerivations, angle){

    this.axiom = axiom; //starting string
    this.numDerivations = numDerivations;  //how many times to run production rules on string.
    this.productions = [];
    this.generatedString = "";
    this.angle = angle; //the angle to turn when rendering


    var ProductionRule = function(predecessor, successor, likelihood){

        this.predecessor = predecessor;
        this.successor = successor;
        this.likelihood = likelihood;  //a value from 0 to 1 representing the odds that this production will occur.
    }

    this.addProduction = function(predecessor, successor, likelihood){

    	this.productions.push( new ProductionRule(predecessor, successor, likelihood) );

    	return this;
    }


    //applies the production rules to the string (beginning with the axiom) for the number of derivations given.
    this.generate = function(){

    	var current = this.axiom;
    	var builder = "";
    	
    	for (var i = 0; i < this.numDerivations; i++){

    		for (var j = 0; j < current.length; j++){

    			replacement = predecessorMatch.call(this, current.charAt(j));
    			builder = builder.concat(replacement);
    		}
    		
    		current = builder;
    		builder = "";
    	}

    	this.generatedString = current; //complete

    	return this;
    }

    //determines if the given character is the predecessor of a production rule
    //and returns the successor if so.  Allows for ignorable characters.
    function predecessorMatch(character){
    	
    	var randomNumber = Math.random();
    	
    	for (var i = 0; i < this.productions.length; i++){

    		if (character == this.productions[i].predecessor){
    			
    			if (randomNumber <= this.productions[i].likelihood){  //Naive stochastic check
    				return this.productions[i].successor;
    			}
    		}
    	}

    	return character;
    }


}