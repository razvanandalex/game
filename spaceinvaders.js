var myScreen, input, frames, Spriteframe, Levelframe;
var alienSprite, shipSprite, citySprite;
var aliens, direction, ship, rockets, cities;

	function play(){
		myScreen= new myScreen(600,900);
		input = new takeInput();
		
		var image = new Image();
		image.addEventListener("load",function(){
			
			alienSprite= [
				[new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)],
				[new Sprite(this, 22, 0 ,16, 16), new Sprite(this, 22, 16, 16, 16)],
				[new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
		];
		shipSprite= new Sprite(this, 62, 0 ,22, 16);
		citySprite= new Sprite(this, 84, 8, 36, 24);
		
		initialize();
		run();
		});
		image.src= "res/invaders.png";
	};
	
	function initialize(){
		frames=0;
		Spriteframe=0;
		Levelframe=60;
		direction=1;
		ship={
			sprite: shipSprite,xPosition: myScreen.width/2,yPosition : myScreen.height- shipSprite.height*2
		}
		rockets=[];
		cities={
			canvas:null;
			ctx:null;
			
			yPosition : ship.yPosition - (30 + citySprite.height),
			height: citySprite.height,
			initialize: function(){
				this.canvas= document.createElement("canvas");
				this.canvas.width = myScreen.width;
				this.canvas.height = this.height;
				this.ctx = this.canvas.getContext("2d");
				
				for(var i=0;i<4;i++){
					this.ctx.drawImage(citySprite.image,citySprite.xPosition,citySprite.yPosition,citySprite.width,citySprite.height,68 + 111*i, 0, citySprite.width, citySprite.height);
				}
			},
			
			generateDamage: function(xPosition, yPosition){
				x = Math.floor(xPosition/2) * 2;
				y = Math.floor(yPosition/2) * 2;
				this.ctx.clearRect(xPosition-2, yPosition-2, 4, 4);
				this.ctx.clearRect(xPosition+2, yPosition-4, 2, 4);
				this.ctx.clearRect(xPosition+4, yPosition, 2, 2);
				this.ctx.clearRect(xPosition+2, yPosition+2, 2, 2);
				this.ctx.clearRect(xPosition-4, yPosition+2, 2, 2);
				this.ctx.clearRect(xPosition-6, yPosition, 2, 2);
				this.ctx.clearRect(xPosition-4, yPosition-4, 2, 2);
				this.ctx.clearRect(xPosition-2, yPosition-6, 2, 2);
			},
			
			hits: function(xPosition, yPosition){
				yPosition -= this.yPosition;
				var data= this.ctx.getImageData(xPosition,yPosition, 1, 1);
				if (data.data[3] !== 0){
					this.generateDamage(xPosition,yPosition);
					return true;
				}
				return false;
			}
		};
		cities.initialize();
	
		aliens = [];
		var rows = [1, 0, 0, 2, 2];
		for(var i=0, len=rows.length;i < len; i++){
			for(var j=0;j<10;j++){
				var a=rows[i];
				aliens.push({
						sprite: alienSprite[a];
						xPosition: 30 + j*30 + [0,4,0][a],
						yPosition: 30 + i*30,
						width: alienSprite[a][0].width,
						height:alienSprite[a][0].height
				});
			}
		}
	};
	
	function run(){
	   var loop = function(){
		   update();
		   render();
		   window.requestAnimationFrame(loop,myScreen.canvas);
	   }
	   window.requestAnimationFrame(loop,myScreen.canvas);
	};
	
	
	function update(){
		frames++;
		if(takeInputinput.isDown(37)){
			ship.xPosition -=4;
		}
		if(takeInputinput.isDown(39)){
			ship.xPosition +=4;
		}
		ship.xPosition=Math.max(Math.min(ship.xPosition,myScreen.width - (30 + shipSprite.width)), 30);
		
		if(takeInputinput.isPressed(32)){
			rockets.push(new Rocket(ship.xPosition + 10,ship.yPosition, -8, 2, 6, "#fff"));
		}
		
		for(var i= 0, len= rockets.length; i< len; i++){
			var b= rockets[i];
			b.update();
			if( b.yPosition + b.height < 0 || b.yPosition > myScreen.height){
				rockets.splice(i,1);
				i--;
				len--;
				continue;
			}
			var h2= b.height * 0.5;
			if(cities.yPosition < b.yPosition+h2 && b.yPosition+h2 < cities.yPosition + cities.height){
				if(cities.hits(b.xPosition, b.yPosition+h2)){
					rockets.splice(i,1);
					i--;
					len--;
					continue;
				}
			}
			for( var j=0, len2 = aliens.length ; j<len2; j++){
				var a = aliens[j];
				if(Intersect(b.xPosition,b.yPosition,b.width,b.height,a.xPosition,a.yPosition,a.width,a.height)){
					aliens,splice(j,1);
					j--;
					len2--;
					rockets.splice(i,1);
					i--;
					len--;
					switch(len2){
						case 30:{
							this.Levelframe = 40;
							break;
						}
						case 10:{
							this.Levelframe = 20;
							break;
						}
						case 5:{
							this.Levelframe = 15;
							break;
						}
						case 1:{
							this.Levelframe = 6;
							break;
						}
					}
				}
			}
		}
		
		if ( Math.random() < 0.03 && aliens.length > 0){
			var a = aliens[Math.round(Math.random() * (aliens.length - 1))];
			for( var i=0, len = aliens.length; i< len;i++){
				var b = aliens[i];
				
				if(Intersect(a.xPosition,a.yPosition,a.width,100,b.xPosition,b.yPosition,b.width,b.height)){
					a=b;
				}
			}
			rockets.push(new Rocket(a.xPosition + a.width*0.5, a.yPosition + a.height, 4, 2, 4, "#fff"));
		}
		
		if(frames % Levelframe === 0){
			Spriteframe = (Spriteframe + 1)%2;
			var _max = 0, _min=myScreen.width;
			for(var i=0, len= aliens.length; i<len; i++){
				var a = aliens[i];
				a.xPosition += 30 * dir;
				_max = Math.max(_max, a.xPosition + a.width);
				_min = Math.min(_min, a.xPosition);
			}
			if (_max > myScreen.width - 30 || _min < 30){
				dir *= -1;
				for(var i=0, len = aliens.length; i< len; i++){
					aliens[i].xPosition += 30 * dir;
					aliens[i].yPosition += 30;
				}
			}
		}
	};
	
	
	function render(){
		myScreen.clear();
		for(var i= 0, len = aliens.length; i< len; i++){
			var a=aliens[i];
			myScreen.draw(a.sprite[Spriteframe],a.xPosition,a.yPosition);
		}
		myScreen.ctx.save();
		for (var i=0, len = rockets.length; i< len; i++){
			myScreen.drawRocket(rockets[i]);
		}
		myScreen.ctx.restore();
		myScreen.ctx.draw(cities.canvas, 0, cities.yPosition);
		myScreen.draw(ship.sprite, ship.xPosition,ship.yPosition);
	};
	
	play();
	
				
			