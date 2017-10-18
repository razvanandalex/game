function stars() {
	this.fps = 30;
	this.canvas = null;
	this.width = 0;
	this.width = 0;
	this.minVelocity = 20;
	this.maxVelocity = 40;
	this.stars = 100;
	this.intervalId = 0;
}


stars.prototype.initialise = function(div) {
	var keepingIn = this;

	
	this.containerDiv = div;
	keepingIn.width = window.innerWidth;
	keepingIn.height = window.innerHeight;

	window.onresize = function(event) {
		keepingIn.width = window.innerWidth;
		keepingIn.height = window.innerHeight;
		keepingIn.canvas.width = keepingIn.width;
		keepingIn.canvas.height = keepingIn.height;
		keepingIn.draw();
 	}

	
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

stars.prototype.start = function() {

	
	var stars = [];
	for(var i=0; i<this.stars; i++) {
		stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1,
		 (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.stars = stars;

	var keepingIn = this;
	
	this.intervalId = setInterval(function() {
		keepingIn.update();
		keepingIn.draw();	
	}, 1000 / this.fps);
};

stars.prototype.stop = function() {
	clearInterval(this.intervalId);
};

stars.prototype.update = function() {
	var dt = 1 / this.fps;

	for(var i=0; i<this.stars.length; i++) {
		var star = this.stars[i];
		star.y += dt * star.velocity;
		
		if(star.y > this.height) {
			this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*3+1, 
		 	(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
};

stars.prototype.draw = function() {

	
	var ctx = this.canvas.getContext("2d");


 	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);


	ctx.fillStyle = '#ffffff';
	for(var i=0; i<this.stars.length;i++) {
		var star = this.stars[i];
		ctx.fillRect(star.x, star.y, star.size, star.size);
	}
};

function Star(x, y, size, velocity) {
	this.x = x;
	this.y = y; 
	this.size = size;
	this.velocity = velocity;
}