function gameState() {
 
this.config = {
        enemyMinVelocity: 10
		enemyMaxVelocity: 10
        pointsHit: 5
    };

this.lives = 3;
this.width = 0;
this.height = 0;
this.gameBound = {left: 0, top: 0, right: 0, bottom: 0};
 

this.stateStack = [];
 
this.pressedKeys = {};
this.gameCanvas =  null;
}

gameState.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};