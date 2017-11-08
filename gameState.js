function gameState() {
 
this.config = {
        enemyMinVelocity: 10,
	enemyMaxVelocity: 10,
        gameWidth: 400,
        gameHeight: 300,
        pointsHit: 5,
        fps: 50
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

Game.prototype.initialise = function(gameCanvas) {
    this.gameCanvas = gameCanvas;
 
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

   
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
};

function Ship(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 16;
}
 

function Rocket(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}
 

function Bomb(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
}
 
 
function Invader(x, y, rank, file, type) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 18;
    this.height = 14;
} 


Game.prototype.moveToState = function(state) {

   if(this.currentState() && this.currentState().leave) {
     this.currentState().leave(game);
     this.stateStack.pop();
   }

   if(state.enter) {
     state.enter(game);
   }

   this.stateStack.pop();
   this.stateStack.push(state);
 };

Game.prototype.pushState = function(state) {
 
    if(state.enter) {
        state.enter(game);
    }

    this.stateStack.push(state);
};
 
Game.prototype.popState = function() {
 

    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }
 

        this.stateStack.pop();
    }
}; 

function GameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {

        
        var dt = 1 / game.config.fps;

        
        var ctx = this.gameCanvas.getContext("2d");
        
       
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

Game.prototype.start = function() {
 
    this.moveToState(new WelcomeState());
 
    
    this.lives = 3;
 

 
}; 

function WelcomeState() {

}

WelcomeState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) {
        game.level = 1;
        game.score = 0;
        game.lives = 3;
        game.moveToState(/*initialise start gamr state*/);
    }
};
function GameOverState() {

}

GameOverState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) {
        game.lives = 3;
        game.score = 0;
        game.level = 1;
        game.moveToState(/*move to welcomeState*/);
    }
};

function PlayState(config, level) {
}

function PlayState(config, level) {
    this.config = config;
    this.level = level;

    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
}