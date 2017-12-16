


function myScreen(width, height){
	this.canvas=document.createElement("canvas");
	this.canvas.width=width;
	this.width=width;
	this.canvas.height=height;
	this.height=height;
	this.ctx=this.canvas.getContext("2d");
	
	document.body.appendChild(this.canvas);
};
myScreen.prototype.draw = function(sprite, xPosition, yPosition){
	this.ctx.drawImage(sprite.image,sprite.xPosition,sprite.yPosition,sprite.width,sprite.height,xPosition,yPosition,sprite.width,sprite.height);
};

myScreen.prototype.drawRocket = function(rocket){
	this.ctx.fillStyle = rocket.color;
	this.ctx.fillRect(rocket.xPosition,rocket.yPosition,rocket.width,rocket.height);
};

function Sprite(image, xPosition, yPosition, width, height){
	this.image=image;
	this.xPosition=xPosition;
	this.yPosition=yPosition;
	this.width=width;
	this.height=height;
};

function takeInput(){
	this.down={};
	this.pressed={};
	
	var _this = this;
	document.addEventListener("keydown",function(event){
		_this.down[event.keyCode] = true;
	});
	document.addEventListener("keyup", function(event){
		delete _this.down[event.keyCode];
		delete _this.pressed[event.keyCode];
	});
};

takeInput.prototype.isDown = function(button){
		return this.down[button];
};
takeInput.prototype.isPressed = function(button){
	if(this.pressed[button]){
		return false;
	}
	else if (this.down[button]){
		return this.pressed[button] = true;
	}
	return false;
};

function Rocket( xPosition, yPosition, velocity, width, height, color){
	this.xPosition=xPosition;
	this.yPosition=yPosition;
	this.velocity=velocity;
	this.width=width;
	this.height=height;
	this.color=color;
};

Rocket.protoype.update = function(){
	this.yPosition += this.velocity;
};

function Intersect(axPosition, ayPostion, awidth, aheight, bxPostion,byPosition,bwidth,bheight){
	return axPosition < bxPostion+bwidth && bxPostion < axPosition+awidth && ayPostion < byPosition+bheight && byPosition < ayPostion + aheight;
}
