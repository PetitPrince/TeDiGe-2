/*Tedige: a tetris diagram Generator*/
/* ToDo
- decoration
- updatestatus in text (or progressbar?)
- interface !
- joystick visualisation
- active shouldn't allow painting out of playfield

- ... see onenote !
*/



/* Class: Painter -------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
 Painter interact with the canvases and the html page. Painter binds / uses several layer of
 overlapping canvas elements.

>						-------------------------
>						v 						|
>	Canvas/html <-- <Painter> <-- <Frame> <-- <Diagram>
>			|		^^^^^^^^
>			|										^
>			-----------------------------------------

 Parameter
 	- CanvasIDString : the id of the canvas element
 	- CanvasHeight : the height of the canvas element
 	- CanvasWidth : the width of the canvas element
 	- blockSize : the size of the canvas element
 */
function Painter(CanvasIDString,CanvasHeight,CanvasWidth,blockSize){
	/*
		Default canvas size (same as fumen) :
		- height: 193px
		- width: 80px
		- block size: 8*8px
	*/
	// default parameter method from: http://stackoverflow.com/questions/894860/how-do-i-make-a-default-value-for-a-parameter-to-a-javascript-function

	this.CanvasHeight = typeof CanvasHeight !== 'undefined' ? CanvasHeight : 177;
	this.CanvasWidth = typeof CanvasHeight !== 'undefined' ? CanvasHeight : 97;
	this.blockSize = typeof blockSize !== 'undefined' ? blockSize : 8;



	var myself = this; // myself is used to apply closure

	// HTML-related properties //
	this.CanvasPF = $('#'+CanvasIDString);
	this.ContextPF = this.CanvasPF[0].getContext("2d");

	this.CanvasActive = $('#'+CanvasIDString+"-active");
	this.ContextActive = this.CanvasActive[0].getContext("2d"); // cPF: ContextPF

	this.CanvasBorder = $('#'+CanvasIDString+"-border");
	this.ContextBorder = this.CanvasBorder[0].getContext("2d"); // cPF: ContextPF

	this.CanvasPreview = $('#'+CanvasIDString+"-preview");
	this.ContextPreview = this.CanvasPreview[0].getContext("2d");

	this.CanvasBackground = $('#'+CanvasIDString+"-background");
	this.ContextBackground = this.CanvasBackground[0].getContext("2d");

	this.CanvasWhiteborder = $('#'+CanvasIDString+"-whiteborder");
	this.ContextWhiteborder = this.CanvasWhiteborder[0].getContext("2d");

	this.CanvasDeco = $('#'+CanvasIDString+"-deco");
	this.ContextDeco = this.CanvasDeco[0].getContext("2d");

	this.CanvasWhiteborder = $('#'+CanvasIDString+"-whiteborder");
	this.ContextWhiteborder = this.CanvasWhiteborder[0].getContext("2d");

	this.CanvasNextHold = $('#'+CanvasIDString+"-nexthold");
	this.ContextNextHold = this.CanvasNextHold[0].getContext("2d");

	// Canvas-related properties //
	// sets where in the canvas the playfield should begin
	this.PFOriginX = 1*this.blockSize;
	this.PFOriginY = 1*this.blockSize;
	// get the absolute position of the canvas
	this.PFOriginXAbsolute = this.CanvasPF.offset().left + this.PFOriginX -1;
	this.PFOriginYAbsolute = this.CanvasPF.offset().top + this.PFOriginY;

	this.sprite;
	this.spritemini;
	this.spritedeco;
	this.ready = false;
		/* Method: init
		Loads the image*/
		this.init = function(){
				// Don't know if it's the correct way to preload the image...
			// ARS.sprite = document.createElement('img'); // doesn't work in chrome ?!
			// ARS.spritemini = document.createElement('img');
			this.spritedeco = new Image();
			this.sprite = new Image();
			this.spritemini = new Image();
			this.spritedeco.src = 'res/deco-8px.png'
			this.sprite.src = 'res/palette-8px.png';
			this.spritemini.src = 'res/palette-4px.png';
			this.sprite.onload = function(){
				myself.ready = true;
			};
			this.sprite.onerror = function(){
				myself.ready = true;
			};

		};

	/* Method: eraseLayer(
		Erase one layer (the canvas still exists).
		Parameter:
		- layer: define which layer will be erased. Either 'inactive', 'active','preview' or 'all' */
	this.eraseLayer = function(layer){
		var Canvas;
		switch(layer)
		{
			case "inactive":
				Canvas = this.CanvasPF;
				break;
			case "preview":
				Canvas = this.CanvasPreview;
				break;
			case "active":
				Canvas = this.CanvasActive;
				break;
			case "nexthold":
				Canvas = this.CanvasNextHold;
				break;
			case "all":
				Canvas = this.CanvasPF;
				this.CanvasPreview.attr("width",this.CanvasPreview.width());
				this.CanvasActive.attr("width",this.CanvasActive.width());
				this.CanvasNextHold.attr("width",this.CanvasNextHold.width());
				break;
		}
		Canvas.attr("width",Canvas.width());
	};
	/*Methode: eraseBlock*/
	this.eraseBlock = function(x,y){
		this.ContextPF.clearRect(this.PFOriginX+x*this.blockSize,this.PFOriginY+y*this.blockSize,this.blockSize,this.blockSize);
	};
	/* Method: drawWhitePixel
		Draw a TGM-like white pixel around inactive blocks*/
	this.drawWhitePixel = function(playfield)
	{
		// todo: do an "anti white pixel" that clear instead of draw
		// we iterate on the playfield, look in each case if there's something in it, then look at the neighbour for empty cases to paint some borders in these cases
		for (var i = 0; i < playfield.length; i++) {
			for (var j = 0; j < playfield[0].length; j++) {
				if (playfield[i][j]) {
					this.ContextWhiteborder.beginPath();
					if (!playfield[i-1][j])
						{
							this.ContextWhiteborder.rect((this.PFOriginX+i*this.blockSize)-1,this.PFOriginY+j*this.blockSize,1,this.blockSize); //maybe -2 ?
						}
					if (!playfield[i+1][j])
						{
							this.ContextWhiteborder.rect(this.PFOriginX+(i+1)*this.blockSize,this.PFOriginY+j*this.blockSize,1,this.blockSize);
						}
					if (!playfield[i][j-1])
						{
							this.ContextWhiteborder.rect(this.PFOriginX+i*this.blockSize,this.PFOriginY+j*this.blockSize-1,this.blockSize,1);
						}
					if (!playfield[i][j+1])
						{
							this.ContextWhiteborder.rect(this.PFOriginX+i*this.blockSize,this.PFOriginY+(j+1)*this.blockSize,this.blockSize,1);
						}
					this.ContextWhiteborder.fillStyle= "white";
					this.ContextWhiteborder.fill();
					this.ContextWhiteborder.closePath();

				}
			}
		}
	};
	/* Method: drawWhitePixel
		Draw a TGM-like white pixel around in an empty case*/
	this.drawLocalWhitePixel = function(playfield,x,y){
		// todo: may still be a bit buggy
		this.ContextWhiteborder.beginPath();
		if (playfield[x-1][y])
			{
				this.ContextWhiteborder.rect(this.PFOriginX+x*this.blockSize,this.PFOriginY+y*this.blockSize,1,this.blockSize);
			}
			else
			{
				this.ContextWhiteborder.clearRect(this.PFOriginX+x*this.blockSize,this.PFOriginY+y*this.blockSize,1,this.blockSize);
			}
		if (playfield[x+1][y])
			{
				this.ContextWhiteborder.rect((this.PFOriginX+(x+1)*this.blockSize),this.PFOriginY+y*this.blockSize,1,this.blockSize);
			}
			else
			{
				this.ContextWhiteborder.clearRect((this.PFOriginX+(x+1)*this.blockSize),this.PFOriginY+y*this.blockSize,1,this.blockSize);
			}
		if (playfield[x][y-1])
			{
				this.ContextWhiteborder.rect(this.PFOriginX+x*this.blockSize,(this.PFOriginY+y*this.blockSize)-1,this.blockSize,1);
			}
			else
			{
				this.ContextWhiteborder.clearRect((this.PFOriginX+x*this.blockSize)+1,(this.PFOriginY+y*this.blockSize)-1,this.blockSize,1);
			}
		if (playfield[x][y+1])
			{
				this.ContextWhiteborder.rect(this.PFOriginX+x*this.blockSize,(this.PFOriginY+(y+1)*this.blockSize)-1,this.blockSize,1);
			}
			else
			{
				this.ContextWhiteborder.clearRect(this.PFOriginX+x*this.blockSize,(this.PFOriginY+(y+1)*this.blockSize)-1,this.blockSize,1);
			}
		this.ContextWhiteborder.fillStyle= "white";
		this.ContextWhiteborder.fill();
		this.ContextWhiteborder.closePath();

	};


	/* Method: drawGrid
	*/
	this.drawGrid = function(){
		// todo: change if width/height variable
		this.ContextBackground.beginPath();

		// Rectangle method
		// using line (ctx.moveTo, lineTo, stroke()) doesn't give good results
		this.ContextBackground.beginPath();
		//hor
		for (var i = 1; i <= 9; i++) {
			this.ContextBackground.rect(this.PFOriginX+((i)*this.blockSize),this.PFOriginY,1,20*this.blockSize);
		}
		//vert
		for (var i = 1; i <= 19; i++) {
			this.ContextBackground.rect(this.PFOriginX,this.PFOriginY+((i)*this.blockSize),10*this.blockSize,1);
		}
		this.ContextBackground.fillStyle = "#444";
		this.ContextBackground.fill();

		this.ContextBackground.closePath();
	};

	/* Method: drawDeco
		Draws the Tetrion (the playfield's border).*/
	this.drawDeco = function(x,y,kind){
		//TODO

	};

	/* Method: drawBorder
		Draws the Tetrion (the playfield's border).*/

	this.drawBorder = function(kind){
			var color1 = "#afafaf";
			var color2 = "#46545f";

		switch(kind)
		{
			case "master":
				color1 = "#afafaf";
				color2 = "#46545f";
			break;
	
			case "easy":
				color1 = "#afafaf";
				color2 = "#475f46";
			break;

			case "death":
				color1 = "#ac434a";
				color2 = "#5f0004";
			break;

			default:
				color1 = "#afafaf";
				color2 = "#46545f";
			break;

		}
		
		var radgrd1 = this.ContextBorder.createRadialGradient(0,0,this.blockSize,
															0,0,this.CanvasWidth-2*this.blockSize);
		var radgrd2 = this.ContextBorder.createRadialGradient(this.CanvasWidth,this.CanvasHeight,this.blockSize,
															this.CanvasWidth,this.CanvasHeight,this.CanvasWidth-2*this.blockSize);
		radgrd1.addColorStop(0,color1);
		radgrd1.addColorStop(1,color2);
		radgrd2.addColorStop(0,color1);
		radgrd2.addColorStop(1,color2);

		var grd_hor = this.ContextBorder.createLinearGradient(0,0,this.CanvasWidth-2*this.blockSize,0);
		var grd_hor_rev = this.ContextBorder.createLinearGradient(0,0,this.CanvasWidth-2*this.blockSize,0);

		var grd_vert = this.ContextBorder.createLinearGradient(0,0,0,this.CanvasWidth-2*this.blockSize);
		var grd_vert_rev = this.ContextBorder.createLinearGradient(0,0,0,this.CanvasWidth-2*this.blockSize);

		grd_hor.addColorStop(0,color1);
		grd_hor.addColorStop(1,color2);
		grd_hor_rev.addColorStop(0,color2);
		grd_hor_rev.addColorStop(1,color1);

		grd_vert.addColorStop(0,color1);
		grd_vert.addColorStop(1,color2);
		grd_vert_rev.addColorStop(0,color2);
		grd_vert_rev.addColorStop(1,color1);

		function drawrectangle(x_begin,y_begin,width,height, fill){
			myself.ContextBorder.beginPath();
			myself.ContextBorder.rect(x_begin,y_begin,width,height);
			myself.ContextBorder.fillStyle = fill;
			myself.ContextBorder.fill();
			myself.ContextBorder.closePath();
		}

		//bg
		drawrectangle(0,0,this.CanvasWidth,this.CanvasHeight,color2);

		//grd1
		drawrectangle(0,0,this.CanvasWidth,this.CanvasWidth,radgrd1);

		//grd2
		drawrectangle(0,this.CanvasHeight-this.CanvasWidth,this.CanvasWidth,this.CanvasWidth,radgrd2);


		//highlight outer top left -> top right
		drawrectangle(0,0,this.CanvasWidth,1,grd_hor_rev);

		//highlight outer top left -> bottom left
		drawrectangle(0,0,1,this.CanvasHeight,grd_vert_rev);

		//highlight outer top right -> bottom right
		drawrectangle(this.CanvasWidth-1,0,1,this.CanvasHeight,grd_vert);

		//highlight outer bottom right -> bottom left
		drawrectangle(0,this.CanvasHeight-1,this.CanvasWidth,1,grd_hor);

		//highlight inner top-left -> top right
		drawrectangle(this.blockSize-1,this.blockSize-1,10*this.blockSize+1,1,grd_hor_rev);

		//highlight inner top left -> bottom left
		drawrectangle(this.blockSize+10*this.blockSize,this.blockSize-1,1,20*this.blockSize+2,grd_vert);

		//highlight inner top left -> bottom left
		drawrectangle(this.blockSize-1,this.blockSize-1,1,20*this.blockSize+1,grd_vert_rev);

		//highlight inner bottom left -> bottom right
		drawrectangle(this.blockSize-1,this.blockSize+20*this.blockSize,10*this.blockSize+1,1,grd_hor);



		//pf
		drawrectangle(1*this.blockSize,1*this.blockSize,10*this.blockSize,20*this.blockSize,"black");


	};


	/*Methode: drawNext*/
	this.drawNext = function(nextArray){
		this.eraseLayer("nexthold");
		var matrix;

		if (nextArray[0]) {
			matrix = getMatrix(nextArray[0], "i", "ARS");
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						this.drawBlock(parseInt(3+j,10),parseInt(0+i,10),nextArray[0],"ARS","nexthold");
					}
				}
			}

		}
		if (nextArray[1]) {
			matrix = getMatrix(nextArray[1], "i", "ARS");
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						this.drawBlock(parseInt(13+j,10),parseInt(3+i,10),nextArray[1],"ARS","nextholdmini");
					}
				}
			}

		}
		if (nextArray[2]) {
			matrix = getMatrix(nextArray[2], "i", "ARS");
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						this.drawBlock(parseInt(17+j,10),parseInt(3+i,10),nextArray[2],"ARS","nextholdmini");
					}
				}
			}
		}
		if (nextArray[3]) {
			matrix = getMatrix(nextArray[3], "i", "ARS");
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						this.drawBlock(parseInt(-1+j,10),parseInt(2+i,10),nextArray[3],"ARS","nextholdmini");
					}
				}
			}
		}
		// ToDo: what happens when nextArray.length > 3 ? (i.e. more next than 3)
	};


	/* Method: drawBlock
		Draw one block on a given layer, relative to the origin and using a block-length as unit.
		Parameter:
		- x : horizontal coordinate
		- y : vertical coordinate
		- type: define the color of the block to be drawn
		- RS : define the style of the block
		- context: define on which layer the block will be drawn*/
	this.drawBlock = function(x,y,type,RS,context){
		if(type){
			var ctx;
			var mini = false;
			switch(context)
			{
				case "inactive":
					ctx = this.ContextPF;
					break;
				case "preview":
					ctx = this.ContextPreview;
					break;
				case "active":
					ctx = this.ContextActive;
					break;
				case "nexthold":
					ctx = this.ContextNextHold;
					break;
				case "nextholdmini":
					ctx = this.ContextNextHold;
					mini = true;
					break;
			}
			ctx.beginPath();
			/*
			rect need one point and two lengths to draw a rectangle.
			The first point is defined as [<origin x coordinate> + x*<block's size> ; <origin y coordinate> + y*<block's size>]
			The lengths are simply the block size.
			*/
			if (mini) {
				if (x >=17) {
					ctx.rect(6+this.PFOriginX+((x)*this.blockSize/2),this.PFOriginY+((y)*this.blockSize/2),(this.blockSize/2),(this.blockSize/2));

				}
				else
				{
					ctx.rect(5+this.PFOriginX+((x)*this.blockSize/2),this.PFOriginY+((y)*this.blockSize/2),(this.blockSize/2),(this.blockSize/2));
				}
			}
			else
			{
				ctx.rect(this.PFOriginX+((x)*this.blockSize),this.PFOriginY+((y)*this.blockSize),this.blockSize,this.blockSize);
			}
			
			// outline
			//this.ContextPF.lineWidth=1;
			//this.ContextPF.strokeStyle= "black";
			//this.ContextPF.stroke();

			// background

			var color;
			var sprite;
			var spriteOffset;
			switch(RS){
				case "ARS":
				if (mini) {
					sprite = this.spritemini;
				}
				else{
					sprite = this.sprite;
				}
					switch(type){
						case "I":
							color = ARS.I.color;
							spriteOffset = ARS.I.offset;
							break;
						case "T":
							color = ARS.T.color;
							spriteOffset = ARS.T.offset;
							break;
						case "L":
							color = ARS.L.color;
							spriteOffset = ARS.L.offset;
							break;
						case "J":
							color = ARS.J.color;
							spriteOffset = ARS.J.offset;
							break;
						case "S":
							color = ARS.S.color;
							spriteOffset = ARS.S.offset;
							break;
						case "Z":
							color = ARS.Z.color;
							spriteOffset = ARS.Z.offset;
							break;
						case "O":
							color = ARS.O.color;
							spriteOffset = ARS.O.offset;
							break;
						case "G":
							color = ARS.G.color;
							spriteOffset = ARS.G.offset;
							break;
					}
				break;
			}

			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
			if (sprite) {
				if (mini) {
					if (x >= 17){
						ctx.drawImage(sprite, // original image
									  spriteOffset[0]*(this.blockSize/2),spriteOffset[1]*(this.blockSize/2), //coordinate on the original image
									  (this.blockSize/2),(this.blockSize/2), // size of the rectangle to will be cut
									  6+this.PFOriginX+((x)*this.blockSize/2),this.PFOriginY+((y)*(this.blockSize/2)), // destination coordinate
									  (this.blockSize/2),(this.blockSize/2)); // destination size

					}
					else
					{
						ctx.drawImage(sprite, // original image
									  spriteOffset[0]*(this.blockSize/2),spriteOffset[1]*(this.blockSize/2), //coordinate on the original image
									  (this.blockSize/2),(this.blockSize/2), // size of the rectangle to will be cut
									  5+this.PFOriginX+((x)*this.blockSize/2),this.PFOriginY+((y)*(this.blockSize/2)), // destination coordinate
									  (this.blockSize/2),(this.blockSize/2)); // destination size

					}
				}
				else
				{
				ctx.drawImage(sprite, // original image
							  spriteOffset[0]*this.blockSize,spriteOffset[1]*this.blockSize, //coordinate on the original image
							  this.blockSize,this.blockSize, // size of the rectangle to will be cut
							  this.PFOriginX+((x)*this.blockSize),this.PFOriginY+((y)*this.blockSize), // destination coordinate
							  this.blockSize,this.blockSize); // destination size

				}
			}
		}
	};//end drawblock


} // end painter -------------------------------------------------------------------------------

/* Diagram -------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
 Diagrame stores the <frame>s and manipulate them.
 Painter receives command from the html and gives order to either the underlying frame or directly
 to the painter.

>						-------------------------
>						v 						|
>	Canvas/html <-- <Painter> <-- <Frame> <-- <Diagram>
>			|								   ^^^^^^^^
>			|										^
>			-----------------------------------------

 Parameter
 	- Painter : a reference to its associated painter.
 */

function Diagram(painter){
	var myself = this;
	this.painter = painter;
	this.border = "";
	this.frames = [];

	this.current_frame = 0;

	/* Method: init
		Initialize the frames array.*/
	this.init = function(){
		// Draws the initial playfield (essentially a blank playfield)
		this.frames.push(new Frame(this.painter));
		//this.frames[0].clear();
		// var myself = this;
		// setTimeout(function(){myself.clear2()},1000) //<- this works, closure ftw !
	};

	this.change_border = function(kind){
		this.border = kind;
		this.painter.drawBorder(kind);
	};

	/* Method: new_frame
		Adds a new frame after the current one and displays it.
		>	[Sophie] {Elisa} [Therese] [Claire]
		>	        		^
		>	      		[Jeanne]
		>	=>     
		>	Sophie Elisa Jeanne Therese Claire*/
	this.new_frame = function(){
		this.current_frame++;
		this.painter.eraseLayer("all");
		this.frames.splice(this.current_frame+1,0,new Frame(this.painter)); //inject a new frame after the current frame (modify at position current_frame+1, remove nothing, add new frame)
		this.update_framecount();
	};

	/* Method: new_copy_frame
		Makes a new frame based on the current frame*/
	this.new_copy_frame = function(){
		//this.frames.push(jQuery.extend(true, {}, this.frames[this.current_frame])) // deep copy the current frame
		var saved_frame = this.frames[this.current_frame].print();
		this.new_frame();
		this.frames[this.current_frame].load(saved_frame,"blank");
	};


	/* Method: delete
		Remove the current frame from existance*/
	this.remove_current_frame = function(){
		/**
		* Exactly what it says on the box.
		*/

		if(this.frames.length > 1 )
		{
			if(this.current_frame-1 >= 0) // if the current frame is not the first one
			{
				this.current_frame -= 1;  // redirect the current frame to the preceding one. Note that is delete backwards (like the backspace key)... some may prefer a forward delete (like the del key)
				this.frames.splice(this.current_frame+1,1);
			}
			else
			{
				this.frames.splice(this.current_frame,1);
				this.current_frame = 0;
			}

			this.frames[this.current_frame].draw();
			this.update_framecount();
		}
	};

	/* Method: show_first_frame
		Switches the current frame to the first one, displays it.*/
	this.first_frame = function(){
		this.painter.eraseLayer("all");
		this.current_frame = 0;
		this.frames[this.current_frame].draw();
		this.update_framecount();
		};

	/* Method: previous_frame
		Switches the previous frame to the previous one, displays it.*/
	this.previous_frame = function(){
		if(this.current_frame > 0)
		{
			this.painter.eraseLayer("all");
			this.current_frame--,
			this.frames[this.current_frame].draw();
			this.update_framecount();
		}
	};


	/* Method: next_frame
		Switches the current frame to the next one, displays it.*/
	this.next_frame = function(){
				this.painter.eraseLayer("all");
				this.current_frame++,
				this.frames[this.current_frame].draw();
				this.update_framecount();
	};

	/* Method: last_frame
		Switches the current frame to the last one, displays it.*/
	this.last_frame = function(){
		this.painter.eraseLayer("all");
		this.current_frame = parseInt(this.frames.length-1,0); // http://nicolaasmatthijs.blogspot.com/2009/05/missing-radix-parameter.html
		this.frames[this.current_frame].draw();
		this.update_framecount();
		};

	/* Method: update_framecount
		Update the displayed frame index..*/
	this.update_framecount = function(){
		// todo: canvas-ify this (it should not relie on an id, but write on the canvas instead)
		$('#current-frame').html(this.current_frame+1);
		$('#total-frame').html(this.frames.length);
	};

	/* Method: remove_following_frames
		Analogous with fumen's "delete following"*/
	this.remove_following_frames = function(){
		this.frames.splice(this.current_frame+1);
		this.update_framecount();
	};

	/* Method: remove_all_playfields
		Nukes everything !*/
	this.remove_all_playfields = function(){
		this.frames.splice(1);
		this.frames[0].clear("all");
		this.current_frame = 0;
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/* Method: print_differences
		Return the differences between two frames in a formatted string
		Parameter:
		- reference_frame: reference frame number
		- final_frame: final frame number
		Returns:
		A string with the format described below.
*/
	this.print_differences = function(final_frame,reference_frame){
		var output = "";
		var tmp ="";

		// check if the active piece is different in any way (type, orientation, coord)
		if(this.frames[final_frame].activePieceType != this.frames[reference_frame].activePieceType ||
			this.frames[final_frame].activePieceOrientation != this.frames[reference_frame].activePieceOrientation ||
			this.frames[final_frame].activePiecePositionX != this.frames[reference_frame].activePiecePositionX ||
			this.frames[final_frame].activePiecePositionY != this.frames[reference_frame].activePiecePositionY)
		{
			// there a difference !
			if(this.frames[final_frame].activePieceType)
			{
				// and the active piece still exists, so encode the a new string for it
				output += "A~"+this.frames[final_frame].activePieceType;
				tmp = alphanumconvert(this.frames[final_frame].activePiecePositionX);
				output += tmp;
				tmp = alphanumconvert(this.frames[final_frame].activePiecePositionY);
				output += tmp+this.frames[final_frame].activePieceOrientation+"_";
				tmp = "";
			}
			
		}

		//same principle as in frame.print(): iterate overy the 2D array, make a list of type check against it
		var candidate_case = [];
		var first_candidate = true;
		var newly_added = false;
						
		for (var i=0; i<10; i++){
			for (var j=0; j<20; j++){
				if(this.frames[final_frame].playfield[i][j] != this.frames[reference_frame].playfield[i][j])
				{
					if(first_candidate) // is this the very first case we study ?
					{
						if(this.frames[final_frame].playfield[i][j]) // is the new case is an empty one ?
						{
							candidate_case.push([]);
							candidate_case[0].val = this.frames[final_frame].playfield[i][j];
							candidate_case[0].push(alphanumconvert(i)+alphanumconvert(j));
							first_candidate = false;
						}
						else
						{
							candidate_case.push([]);
							candidate_case[0].val = "";
							candidate_case[0].push(alphanumconvert(i)+alphanumconvert(j));
							first_candidate = false;
							
						}
					}
					else
					{
						for (var k=0; k<candidate_case.length; k++)
						{
							if(this.frames[final_frame].playfield[i][j] == candidate_case[k].val) // does the case type exists in the candidate list ?
							{
								// yes
								if(newly_added) // is it the very first of its kind ?
								{
									// yes, do nothing
									newly_added = false;
								}
								else
								{
									// no, add it to the list
									candidate_case[k].push(alphanumconvert(i)+alphanumconvert(j));
									break; // <- that break is quite important otherwise it continues forward, leading to nasty side effect
								}
							}
							else if( k == parseFloat(candidate_case.length-1)) // Still no. Was it the last type tested ?
							{
								// Yes -> create a new type
								candidate_case.push([]);
								candidate_case[parseFloat(k+1)].val = this.frames[final_frame].playfield[i][j];
								candidate_case[parseFloat(k+1)].push(alphanumconvert(i)+alphanumconvert(j));
								newly_added = true;
							}
							
						}
						
					}
				}
			}
		}
		
		if(candidate_case) // if there something in the inactive state layer, iterate it's content
		{
			output += "I";
			tmp = "";
			for (var i=0; i<candidate_case.length; i++){
				tmp += "~";
				if(candidate_case[i].val)
				{
					tmp += candidate_case[i].val;
				}
				else
				{
					tmp += "E";
				}
				for (var j=0; j<candidate_case[i].length; j++){
					tmp += candidate_case[i][j];
				}
			}
			output += tmp+"_";
		}
		
		tmp = "";
		return output;

	};// end print_differences

	/*Method: print
		Print the diagram*/
	this.print = function(){
		var output = "";
		output += this.frames[0].print();
		if (this.frames.length) {
			for (var i = 1; i < this.frames.length; i++) {
				output += "+";
				output += this.print_differences(i,i-1);
			}
		}
		return output;
	};// end print

	this.load = function(str){
		if(!str){return;} // check if there's nothing
		this.remove_all_playfields();
		this.current_frame = 0;
		this.update_framecount();
		var stringframe = str.split("+");

		this.frames[0].load(stringframe[0],"blank");
		for (var i = 1; i < stringframe.length; i++) {
			this.new_copy_frame();
			this.frames[i].load(stringframe[i],"differences");
		}
		this.update_framecount();
	};
//http://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf
} // end Diagram -------------------------------------------------------------------------------



/* Frame -------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
 Frame stores a playfield an active piece, next/holded piece...
 Painter receives command from Diagram gives order to the painter..

>						-------------------------
>						v 						|
>	Canvas/html <-- <Painter> <-- <Frame> <-- <Diagram>
>			|					   ^^^^^^
>			|										^
>			-----------------------------------------

 Parameter
	- Painter : a reference to its associated painter.
 */
function Frame(painter){
	var myself = this;
	this.RS = "ARS";
	this.painter = painter;
	this.playfield = [];// Initialization of the playfield table; first coord = x; second = y;
	this.height = 20;
	this.width = 10;
	this.activePieceType = "";
	this.activePieceOrientation = "";
	this.activePiecePositionX = "";
	this.activePiecePositionY = "";
	this.duration = "";
	this.nexthold = [];

	// initialization of the frame. Should I make a method instead ?
		for (var oi=0; oi<this.width; oi++){
			this.playfield.push(new Array(this.height));
				for (var oj=0; oj<this.height; oj++){
					this.playfield[oi][oj] = "";

				//	this.playfield[oi][oj]['content'] = ""; // <- may or may be not useful later
				}
			}
	/* Method: is_in
		Check whether a pair of coordinate is in the tetrion or not.*/
	this.is_in = function(x,y){
		if(x < 0 ||y < 0 || x>=this.width || y>=this.height)
			{return false;}
		return true;
		};

	/* Method: clear
		Erase and delete one layer.
		Parameter:
		- mode: define which layer will be cleared. Either 'inactive','active' or 'all'*/
	this.clear = function(mode){
		switch(mode)
		{
			case "inactive":
				this.painter.eraseLayer("inactive");
				for (var i = 0; i < this.width; i++) {
					for (var j = 0; j < this.height; j++) {
							this.playfield[i][j] = "";
						}
				}
				break;
			case "active":
				this.painter.eraseLayer("active");
				delete this.activePieceType;
				delete this.activePieceOrientation;
				delete this.activePiecePositionX;
				delete this.activePiecePositionY;
				break;
			case "all":
				this.painter.eraseLayer("inactive");
				for (var i = 0; i < this.width; i++) {
					for (var j = 0; j < this.height; j++) {
							this.playfield[i][j] = "";
						}
				}
				this.painter.eraseLayer("active");
				delete this.activePieceType;
				delete this.activePieceOrientation;
				delete this.activePiecePositionX;
				delete this.activePiecePositionY;
			break;
		}
	};

	/* Method: modify
		Modify the inactive layer and draw the modification
		Parameter:
		- x: horizontal coordinate
		- y: vertical coordinate
		- type: type of the block*/
	this.modify = function(x,y,type){
		this.playfield[x][y] = type;
	};

	/*Method: removeBlock
		Erase*/

	this.removeBlock = function(x,y){
		this.playfield[x][y] = "";
		this.painter.eraseBlock(x,y);
	};

	/*Method: modify_next
		*/
	this.modify_next = function(position,type){
		this.nexthold[position] = type;
		this.painter.drawNext(this.nexthold);
	};

	/*Method: modify_hold
		*/
	this.modify_hold = function(type){
		this.nexthold[3] = type;
		this.painter.drawNext(this.nexthold);
	};

	/*Method: lookup
		*/
	this.lookup = function(x,y){
		return this.playfield[x][y];
	};

	/*Method: recursive_fillw
		*/
	this.recursive_fill = function(x,y, replaced, replacer) {
		/**
		*  Fills the playfield like a paint bucket. Thanks Digital !
			todo: bug on click on an already filled ?
		*/
		
		x = parseFloat(x);
		y = parseFloat(y);
		
		if (this.playfield[x][y] != replaced)
			return;

		this.modify(x, y, replacer);
		this.painter.drawBlock(x,y,replacer,this.RS,"inactive");

		if (y-1 >= 0)
			this.recursive_fill(x, y-1, replaced, replacer);

		if (y+1 < this.height)
			this.recursive_fill(x, y+1, replaced, replacer);

		if (x+1 < this.width)
			this.recursive_fill(x+1, y, replaced, replacer);

		if (x-1 >= 0)
			this.recursive_fill(x-1, y, replaced, replacer);
	};

	this.piece_is_in = function(x,y,type,orientation){
		var matrix = getMatrix(type, orientation, this.RS);
		var counter = 0;
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (matrix[i][j] && this.is_in(parseInt(x-1+j,10),parseInt(y-1+i,10))) {
						counter++;
					}
				}
			}
		if (counter == 4) {
			return true;
		}
		return false;
	};

	/* Method: addPiece
		"Macro" method that modifies several times a given layer according to the tetramino shape given in parameter.
		Parameter:
		- x: horizontal coordinate
		- y: vertical coordinate
		- type: type of the tetramino
		- orientation: orientation of the tetramino; either 'i', 'cw', 'ccw' or 'u'
		- mode: define which layer will be modified*/
	this.addPiece = function(x,y,type,orientation,mode,drop){
		var matrix = getMatrix(type, orientation, this.RS);
		var still_drop = true;
		var counter = 0;
		while(drop
				& still_drop ){
			counter = 0;
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (matrix[i][j] &&
						this.is_in(parseInt(x-1+j,10),parseInt(y+i,10)) &&
						!(this.playfield[parseInt(x-1+j,10)][parseInt(y+i,10)])
						)
					{
						counter++;
					}
				}
			}
			if (counter != 4) {
				still_drop = false;
			}
			else
			{
				y++;
			}
		}

		if (mode == "inactive") {
			this.painter.CanvasPreview.attr("width",this.painter.CanvasPreview.width()); //erase the preview layer
		}
		if (mode == "active") {
			this.activePieceType = type;
			this.activePieceOrientation = orientation;
			this.activePiecePositionX = x;
			this.activePiecePositionY = y;
			this.painter.CanvasActive.attr("width",this.painter.CanvasPreview.width()); //erase the active layer
		}


		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
//				if (matrix[i][j] && this.is_in(parseInt(x-1+j,10),parseInt(y-1+i,10))) {
				if (matrix[i][j] && this.piece_is_in(x,y,type,orientation)) {
					switch(mode)
					{
						case "inactive":
							this.modify(parseInt(x-1+j,10),parseInt(y-1+i,10),type);
							this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,"inactive");
						break;
						case "preview":
							this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,"preview");
						break;
						case "active":
							this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,"active");
							break;
					}
				}
			}
		}
	
		
	}; //end drawpiece

	/* Method: draw
		Draws everything according to what's in memory.*/
	this.draw = function(){
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				if (this.playfield[i][j]) {
					this.painter.drawBlock(i,j,this.playfield[i][j],this.RS,"inactive");
				}
				if (this.activePieceType){
					this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,"active",false);
				}
			}
		}
		this.painter.drawNext(this.nexthold);
	};//end draw

	/*Method: print
		Print a string that describe the playfield.*/
	this.print = function(){
		var output= "";
		var tmp ="";

		// Active piece: get the right propriety, put it in the output fame. Nothing too hard
		if(this.activePieceType)
		{
			output += "A~"+this.activePieceType;
			tmp = alphanumconvert(this.activePiecePositionX);
			output += tmp;
			tmp = alphanumconvert(this.activePiecePositionY);
			output += tmp+this.activePieceOrientation+"_";
			tmp = "";
		}
		// Inactive layer: that's harder to code !
		// First let's define some variable.
		var candidate_case = []; // An two dimensionnal array containing the type and all the position of a given type ("there is an S in [2,6][7,6][1,4], a T in [5,12][7,7][1,17], etc..")
		var first_candidate = true;
		// We iterate over each case looking for content.
		// If there's something, we look if the type is already registred on the list of candidate.
		// If it is, we add another position under the given type
		// If not, we add a brand new type on the list
		for (var i=0; i<10; i++)
		{
			for (var j=0; j<20; j++)
			{
				if(this.playfield[i][j])
				{
					if(first_candidate) // is this the very first case we study ?
					{
						candidate_case.push([]);
						candidate_case[0].val = this.playfield[i][j];
						candidate_case[0].push(alphanumconvert(i)+alphanumconvert(j));
						first_candidate = false;
					}
					else // not the first case
					{
						
						for (var k=0; k<candidate_case.length; k++)
						{
							if(this.playfield[i][j] == candidate_case[k].val) // does the type exists on the candidate list ?
							{
									//Yup, add it to the list
									candidate_case[k].push(alphanumconvert(i)+alphanumconvert(j));
									break; // <- that break is quite important otherwise it would continues forward, leading to nasty side effect
							}
							else if( k == parseFloat(candidate_case.length-1)) // Nope. Was it the last type tested ?
							{
								// Yes -> create a new type
								candidate_case.push([]);
								candidate_case[parseFloat(k+1)].val = this.playfield[i][j];
								candidate_case[parseFloat(k+1)].push(alphanumconvert(i)+alphanumconvert(j));
							}
							
						}
					}
				}
			}
		}
		
		// the candidate_case array is now finished
		if(candidate_case) // is there something in the candidate array ? if yes iterate its content
		{
			output += "I~"; // type identifier ("the string will now describe the inactive cases")
			for (var i=0; i<candidate_case.length; i++){
				tmp += candidate_case[i].val; //put the type
				for (var j=0; j<candidate_case[i].length; j++){
					tmp += candidate_case[i][j]; //and then the positions (candidate_case[i][j] already contains the position duplet)
				}
				if(i < candidate_case.length-1)
				{
					tmp += "~"; // if it's not the last piece type, add a tilda separator
				}
			}
			output += tmp+"_";
		}
		tmp = "";
		// finished !
		//console.log(output);
		return output;

	}; // end print

	/*Method: load
	Load the playfield from a descriptive string*/
	this.load = function(str, format){
		if(format != "differences")
		{
			this.clear("all"); // first erase everything
		}
		/* Example
		
		A~Iigh_I~Taababbcagihihjii~Zai~Jde~Sdgefegff_
		
		Algorithm
		- make an array out of the 1st level marker "_"
		- make an array out of the 2nd level marker "~"
		- parse the 1st element of the 2nd level
		- compute
		- iterate over all the string
		
		properties[0] == A~Icdccw_
			subproperties[0] == A
			subproperties[1] == cdccw
		properties[1] == I~Tadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Shdhdhehfhhidifihjdjfjgjh_
			subproperties[0] == I
			subproperties[1] == Tadaeafbfbhcdcecfcgch
			subproperties[2] == Gededeeefegehfdfffh
			subproperties[3] == Shdhdhehfhhidifihjdjfjgjh_
		*/
		if(!str){return;} //check if there's nothing
			var properties = str.split("_");
	
		for (var i=0; i<properties.length; i++){
			var subproperties = properties[i].split("~");
				switch(subproperties[0])
				{
				case "A": // active piece
						var ap_x = subproperties[1].charAt(1);
						var ap_y = subproperties[1].charAt(2);
						var ap_t = subproperties[1].charAt(0);
						var ap_o = subproperties[1].slice(3);
						this.addPiece(alphanumconvert(ap_x),alphanumconvert(ap_y),ap_t,ap_o,"activePieceType",false);
						ap_x = "";
						ap_y = "";
						ap_t = "";
						ap_o = "";
					break;
					
				case "I":
					for (var j=1; j<subproperties.length; j++){
						var type = subproperties[j].charAt(0); // first char
						if(type == "E") // check we have an "empty" character ("E")
						{
							type = ""; // modify type so it is now "" (empty string)
						}
							for (var k=1; k<subproperties[j].length; k+=2){
								var inact_x = subproperties[j].charAt(k);
								var inact_y = subproperties[j].charAt(k+1);
								this.modify(alphanumconvert(inact_x),alphanumconvert(inact_y),type);
								this.painter.drawBlock(alphanumconvert(inact_x),alphanumconvert(inact_y),type,this.RS,"inactive");
							}
					}
					break;
					
				}

		}
	};//end load
};//end frame

/*Routine: ARS
	Define the pieces orientation and their color.*/

/* Rotation definition*/

	/*
	piece: {
		color: "color",
		i: 	[[block1 offset x, block1 offset y],
			  block2 offset x, block2 offset y],
			  block3 offset x, block3 offset y]]
		cw: [[block1 offset x, block1 offset y],
			  block2 offset x, block2 offset y],
			  block3 offset x, block3 offset y]]
		ccw: 	[[block1 offset x, block1 offset y],
				  block2 offset x, block2 offset y],
				  block3 offset x, block3 offset y]]
		u: 	[[block1 offset x, block1 offset y],
			  block2 offset x, block2 offset y],
			  block3 offset x, block3 offset y]]
		offset: [sprite offset x, sprite offset y];
	}

	I: {
		color : "red",
		orient_i: 	[[0,0],[0,0],[0,0]],
		orient_cw: 	[[0,0],[0,0],[0,0]],
		orient_ccw: [[0,0],[0,0],[0,0]],
		orient_u: 	[[0,0],[0,0],[0,0]]
	},

	---->x
	|
	|
	v
	y	*/
/*NEW  (29.03.12) PARADIGM:
Get rotation table from https://github.com/kesiev/akihabara/blob/master/resources/tspin/data/rot-ars.js
On mouseover tell it to draw the piece from an offsetted position
[ ][ ][ ][ ][ ]		[o][o][o][o][ ]		[ ][ ][ ][ ][ ]
[ ][ ][ ][ ][ ]		[o][o][o][o][ ]		[ ][L][L][ ][ ]
[ ][ ][x][ ][ ]		[o][o][o][o][ ]		[ ][ ][L][ ][ ]
[ ][ ][ ][ ][ ]		[o][o][o][o][ ]		[ ][ ][L][ ][ ]
[ ][ ][ ][ ][ ]		[ ][ ][ ][ ][ ]		[ ][ ][ ][ ][ ]
x: mouseover
o: rotation area
L: final result
 */


var ARS = {
	I: {
		color : "red",
		offset: [2,1],
		i:		[[0,0,0,0],
				 [1,1,1,1],
				 [0,0,0,0],
				 [0,0,0,0]],
		cw:		[[0,0,1,0],
				 [0,0,1,0],
				 [0,0,1,0],
				 [0,0,1,0]],
		ccw:	[[0,0,1,0],
				 [0,0,1,0],
				 [0,0,1,0],
				 [0,0,1,0]],
		u:		[[0,0,0,0],
				 [1,1,1,1],
				 [0,0,0,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]
	},
	T: {
		color : "cyan",
		offset: [6,1],
		i: 		[[0,0,0,0],
				 [1,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		cw: 	[[0,1,0,0],
				 [1,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		ccw: 	[[0,1,0,0],
				 [0,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		u: 		[[0,0,0,0],
				 [0,1,0,0],
				 [1,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	L: {
		color : "orange",
		offset: [3,1],
		i: 		[[0,0,0,0],
				 [1,1,1,0],
				 [1,0,0,0],
				 [0,0,0,0]],
		cw: 	[[1,1,0,0],
				 [0,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		ccw:	[[0,1,0,0],
				 [0,1,0,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		u: 		[[0,0,0,0],
				 [0,0,1,0],
				 [1,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},

	J: {
		color : "blue",
		offset: [7,1],
		i: 		[[0,0,0,0],
				 [1,1,1,0],
				 [0,0,1,0],
				 [0,0,0,0]],
		cw: 	[[0,1,0,0],
				 [0,1,0,0],
				 [1,1,0,0],
				 [0,0,0,0]],
		ccw: 	[[0,1,1,0],
				 [0,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		u: 		[[0,0,0,0],
				 [1,0,0,0],
				 [1,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	S: {
		color : "magenta",
		offset: [8,0],
		i: 		[[0,0,0,0],
				 [0,1,1,0],
				 [1,1,0,0],
				 [0,0,0,0]],
		cw: 	[[1,0,0,0],
				 [1,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],		
		ccw: 	[[1,0,0,0],
				 [1,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],				
		u: 		[[0,0,0,0],
				 [0,1,1,0],
				 [1,1,0,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	Z: {
		color : "green",
		offset: [5,1],
		i: 		[[0,0,0,0],
				 [1,1,0,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		cw: 	[[0,0,1,0],
				 [0,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		ccw: 	[[0,0,1,0],
				 [0,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		u: 		[[0,0,0,0],
				 [1,1,0,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},

	O: {
		color : "yellow",
		offset: [4,1],
		i: 		[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		cw: 	[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		ccw: 	[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		u: 		[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	G: {
		color : "gray",
		offset: [1,1],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]		
	}
};

var SRS = {
	I: {
		color : "cyan", 
		i:			[[0,1,0,0],
					 [1,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],
		
		cw:			[[0,1,0,0],
					 [0,1,1,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		
		u:			[[0,0,0,0],
					 [1,1,1,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		
		ccw:		[[0,1,0,0],
					 [1,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]


	},
	J: {
		color : "blue",
		i:			[[1,0,0,0],
					 [1,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],
		
		cw:			[[0,1,1,0],
					 [0,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		
		u:			[[0,0,0,0],
					 [1,1,1,0],
					 [0,0,1,0],
					 [0,0,0,0]],
		
		ccw:		[[0,1,0,0],
					 [0,1,0,0],
					 [1,1,0,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	L: {
		color : "orange",
		i:			[[0,0,1,0],
					 [1,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],
		
		cw:			[[0,1,0,0],
					 [0,1,0,0],
					 [0,1,1,0],
					 [0,0,0,0]],
		
		u:			[[0,0,0,0],
					 [1,1,1,0],
					 [1,0,0,0],
					 [0,0,0,0]],
		
		ccw:		[[1,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	O: {
		color : "yellow",
		i:			[[0,0,0,0],
					 [0,1,1,0],
					 [0,1,1,0],
					 [0,0,0,0]],
		cw:			[[0,0,0,0],
					 [0,1,1,0],
					 [0,1,1,0],
					 [0,0,0,0]],
		u:			[[0,0,0,0],
					 [0,1,1,0],
					 [0,1,1,0],
					 [0,0,0,0]],
		ccw:		[[0,0,0,0],
					 [0,1,1,0],
					 [0,1,1,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

		},
	S: {
		color : "green",
		i:			[[0,1,1,0],
					 [1,1,0,0],
					 [0,0,0,0],
					 [0,0,0,0]],
		
		cw:			[[0,1,0,0],
					 [0,1,1,0],
					 [0,0,1,0],
					 [0,0,0,0]],
		
		u:			[[0,0,0,0],
					 [0,1,1,0],
					 [1,1,0,0],
					 [0,0,0,0]],
		
		ccw:		[[1,0,0,0],
					 [1,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	T: {
		color : "purple",
		i:			[[0,1,0,0],
					 [1,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],
		
		cw:			[[0,1,0,0],
					 [0,1,1,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		
		u:			[[0,0,0,0],
					 [1,1,1,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		
		ccw:		[[0,1,0,0],
					 [1,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	Z: {
		color : "red",
		i:			[[1,1,0,0],
					 [0,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],
		
		cw:			[[0,0,1,0],
					 [0,1,1,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		
		u:			[[0,0,0,0],
					 [1,1,0,0],
					 [0,1,1,0],
					 [0,0,0,0]],
		
		ccw:		[[0,1,0,0],
					 [1,1,0,0],
					 [1,0,0,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	}
};

////////////////////////////////////////////////////////////////////

function getMatrix(type,orientation, RS){
	var matrix;
	switch(RS)
		{
			case "ARS":
				switch(type)
				{
					case "I": 
						switch(orientation)
							{
								case "i":	matrix = ARS.I.i;  break;
								case "cw":	matrix = ARS.I.cw;  break;
								case "ccw":	matrix = ARS.I.ccw;  break;
								case "u":	matrix = ARS.I.u;  break;
								case "singleton":	matrix = ARS.I.singleton;  break;
							}
						break;
					case "T": 
						switch(orientation)
							{
								case "i":	matrix = ARS.T.i;  break;
								case "cw":	matrix = ARS.T.cw;  break;
								case "ccw":	matrix = ARS.T.ccw;  break;
								case "u":	matrix = ARS.T.u;  break;
								case "singleton":	matrix = ARS.T.singleton;  break;
							}
						break;
					case "L": 
						switch(orientation)
							{
								case "i":	matrix = ARS.L.i;  break;
								case "cw":	matrix = ARS.L.cw;  break;
								case "ccw":	matrix = ARS.L.ccw;  break;
								case "u":	matrix = ARS.L.u;  break;
								case "singleton":	matrix = ARS.L.singleton;  break;
							}
						break;
					case "J": 
						switch(orientation)
							{
								case "i":	matrix = ARS.J.i;  break;
								case "cw":	matrix = ARS.J.cw;  break;
								case "ccw":	matrix = ARS.J.ccw;  break;
								case "u":	matrix = ARS.J.u;  break;
								case "singleton":	matrix = ARS.J.singleton;  break;
							}
						break;
					case "S": 
						switch(orientation)
							{
								case "i":	matrix = ARS.S.i;  break;
								case "cw":	matrix = ARS.S.cw;  break;
								case "ccw":	matrix = ARS.S.ccw;  break;
								case "u":	matrix = ARS.S.u;  break;
								case "singleton":	matrix = ARS.J.singleton;  break;
							}
						break;
					case "Z": 
						switch(orientation)
							{
								case "i":	matrix = ARS.Z.i;  break;
								case "cw":	matrix = ARS.Z.cw;  break;
								case "ccw":	matrix = ARS.Z.ccw;  break;
								case "u":	matrix = ARS.Z.u;  break;
								case "singleton":	matrix = ARS.Z.singleton;  break;
							}
						break;
					case "O": 
						switch(orientation)
							{
								case "i":	matrix = ARS.O.i;  break;
								case "cw":	matrix = ARS.O.cw;  break;
								case "ccw":	matrix = ARS.O.ccw;  break;
								case "u":	matrix = ARS.O.u;  break;
								case "singleton":	matrix = ARS.O.singleton;  break;
							}
						break;
					case "G": 
						switch(orientation)
							{
								case "i":	matrix = ARS.G.i;  break;
								case "cw":	matrix = ARS.G.cw;  break;
								case "ccw":	matrix = ARS.G.ccw;  break;
								case "u":	matrix = ARS.G.u;  break;
								case "singleton":	matrix = ARS.G.singleton;  break;
							}
						break;
			case "SRS":
				switch(type)
				{
					case "I": 
						switch(orientation)
							{
								case "i":	matrix = SRS.I.i;  break;
								case "cw":	matrix = SRS.I.cw;  break;
								case "ccw":	matrix = SRS.I.ccw;  break;
								case "u":	matrix = SRS.I.u;  break;
								case "singleton":	matrix = SRS.I.singleton;  break;
							}
						break;
					case "T": 
						switch(orientation)
							{
								case "i":	matrix = SRS.T.i;  break;
								case "cw":	matrix = SRS.T.cw;  break;
								case "ccw":	matrix = SRS.T.ccw;  break;
								case "u":	matrix = SRS.T.u;  break;
								case "singleton":	matrix = SRS.T.singleton;  break;
							}
						break;
					case "L": 
						switch(orientation)
							{
								case "i":	matrix = SRS.L.i;  break;
								case "cw":	matrix = SRS.L.cw;  break;
								case "ccw":	matrix = SRS.L.ccw;  break;
								case "u":	matrix = SRS.L.u;  break;
								case "singleton":	matrix = SRS.L.singleton;  break;
							}
						break;
					case "J": 
						switch(orientation)
							{
								case "i":	matrix = SRS.J.i;  break;
								case "cw":	matrix = SRS.J.cw;  break;
								case "ccw":	matrix = SRS.J.ccw;  break;
								case "u":	matrix = SRS.J.u;  break;
								case "singleton":	matrix = SRS.J.singleton;  break;
							}
						break;
					case "S": 
						switch(orientation)
							{
								case "i":	matrix = SRS.S.i;  break;
								case "cw":	matrix = SRS.S.cw;  break;
								case "ccw":	matrix = SRS.S.ccw;  break;
								case "u":	matrix = SRS.S.u;  break;
								case "singleton":	matrix = SRS.S.singleton;  break;
							}
						break;
					case "Z": 
						switch(orientation)
							{
								case "i":	matrix = SRS.Z.i;  break;
								case "cw":	matrix = SRS.Z.cw;  break;
								case "ccw":	matrix = SRS.Z.ccw;  break;
								case "u":	matrix = SRS.Z.u;  break;
								case "singleton":	matrix = SRS.Z.singleton;  break;
							}
						break;
					case "O": 
						switch(orientation)
							{
								case "i":	matrix = SRS.O.i;  break;
								case "cw":	matrix = SRS.O.cw;  break;
								case "ccw":	matrix = SRS.O.ccw;  break;
								case "u":	matrix = SRS.O.u;  break;
								case "singleton":	matrix = SRS.O.singleton;  break;
							}
						break;
					case "G": 
						switch(orientation)
							{
								case "i":	matrix = SRS.G.i;  break;
								case "cw":	matrix = SRS.G.cw;  break;
								case "ccw":	matrix = SRS.G.ccw;  break;
								case "u":	matrix = SRS.G.u;  break;
								case "singleton":	matrix = SRS.G.singleton;  break;
							}
						break;
				} // end type
			break;
		}// end rs
		return matrix;
	}
}



/*Function: alphanumconvert
Convert a letter to its corresponding number and vice-versa.
Currently convert the 19 first number (including zero) because
we don't need further coordinate (for now).
A possible expansion would be to also encode [A-Z] (uppcase)
*/
function alphanumconvert(input){
	var output;
	switch(input)
	{
	case "a" :
		output = 0;
		break;
	case "b" :
		output = 1;
		break;
	case "c" :
		output = 2;
		break;
	case "d" :
		output = 3;
		break;
	case "e" :
		output = 4;
		break;
	case "f" :
		output = 5;
		break;
	case "g" :
		output = 6;
		break;
	case "h" :
		output = 7;
		break;
	case "i" :
		output = 8;
		break;
	case "j" :
		output = 9;
		break;
	case "k" :
		output = 10;
		break;
	case "l" :
		output = 11;
		break;
	case "m" :
		output = 12;
		break;
	case "n" :
		output = 13;
		break;
	case "o" :
		output = 14;
		break;
	case "p" :
		output = 15;
		break;
	case "q" :
		output = 16;
		break;
	case "r" :
		output = 17;
		break;
	case "s" :
		output = 18;
		break;
	case "t" :
		output = 19;
		break;
	case 0 :
		output = "a";
		break;
	case 1 :
		output = "b";
		break;
	case 2 :
		output = "c";
		break;
	case 3 :
		output = "d";
		break;
	case 4 :
		output = "e";
		break;
	case 5 :
		output = "f";
		break;
	case 6 :
		output = "g";
		break;
	case 7 :
		output = "h";
		break;
	case 8 :
		output = "i";
		break;
	case 9 :
		output = "j";
		break;
	case 10 :
		output = "k";
		break;
	case 11 :
		output = "l";
		break;
	case 12 :
		output = "m";
		break;
	case 13 :
		output = "n";
		break;
	case 14 :
		output = "o";
		break;
	case 15 :
		output = "p";
		break;
	case 16 :
		output = "q";
		break;
	case 17 :
		output = "r";
		break;
	case 18 :
		output = "s";
		break;
	case 19 :
		output = "t";
		break;
	}
	return output;
}


/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/
/*******************************************************************************************/

/* Code to be separated  */


$(document).ready(function(){

	// Default state for the tetramino selection
	$("input[type=radio][name='select'][value=Ii]").attr("checked",true);
	$("input[type=radio][name='editor-tab'][value=inactive]").attr("checked",true);

	// Interface global constant
	var IS_CLICKING;
	var TOOL_DROP = false;
	var TOOL_FILL = false;
	var TOOL_RECTANGULAR = false;
	var TOOL_PENCIL = false;
	var TOOL_ERASER = false;

	var oneFrame = 1000/60;

	// initialization of the system
	var aPainter = new Painter('pf');
	var aDiag = new Diagram(aPainter);
	aDiag.init();
	aPainter.init();
	var initator = setInterval(function(){
		if(aPainter.ready) {
			clearInterval(initator);
			drawPalette('ARS',8,aPainter.sprite);
			aPainter.drawBorder("master");
			aPainter.drawGrid();
			//aDiag.frames[0].addPiece(2,3,'L','i','inactive');
			aDiag.new_copy_frame();
			//aDiag.frames[1].addPiece(7,8,'T','u','inactive');
			//aDiag.frames[1].addPiece(5,6,'S','ccw','inactive');
			aDiag.frames[1].modify_next(0,"S");
			aDiag.frames[1].modify_next(1,"J");
			aDiag.frames[1].modify_next(2,"O");
			aDiag.frames[1].modify_hold("T");
		}
	},10);

	/* ------------------------------------------------------------------------- */
	/* --------------------------- MOUSE MANAGEMENT  --------------------------- */
	/* ------------------------------------------------------------------------- */

	/*Event: CanvasPreview.mousemove
		Manages the move event on the outermost canvas*/
	aDiag.painter.CanvasPreview.mousemove(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		// this.PFOriginX,this.PFOriginY, 10*this.block, 20*this.block
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
			   mouseY < aDiag.painter.PFOriginYAbsolute){
			}

			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
			   mouseY > aDiag.painter.PFOriginYAbsolute && mouseY <= aDiag.painter.PFOriginYAbsolute+(20*aDiag.painter.blockSize))
			{
				var pfX = parseInt(Math.floor((mouseX - aDiag.painter.PFOriginXAbsolute)/aDiag.painter.blockSize),10);
				var pfY = parseInt(Math.floor((mouseY - aDiag.painter.PFOriginYAbsolute)/aDiag.painter.blockSize),10);
				aDiag.painter.eraseLayer("preview"); //erase the preview layer
				//console.log("["+mouseX+","+mouseY+"]");
				//console.log("["+pfX+","+pfY+"]");
				var extract = $("input[type=radio][name=select]:checked").attr("value");
				var type = extract.charAt(0);
				var orientation = extract.slice(1);
				if (IS_CLICKING)
					{
						if (TOOL_PENCIL) {
						aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,"singleton","inactive",TOOL_DROP);
						}
						else if (TOOL_ERASER) {
						aDiag.frames[aDiag.current_frame].removeBlock(pfX,pfY);
						}
						else
						{
						aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,"inactive",TOOL_DROP);
						}
					}
					else
					{
						if (TOOL_ERASER) {
							aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,"G","singleton","preview",TOOL_DROP);
						}
						else if(TOOL_FILL || TOOL_PENCIL)
						{
							aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,"singleton","preview",TOOL_DROP);
						}
						else
						{
							if (type == "I") { //offset I so it doesn't look weird on mouseover
								aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,"preview",TOOL_DROP);
							}
							else
							{
								aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,"preview",TOOL_DROP);
							}
						}
					}
			}
	//var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
	//console.log("( e.clientX, e.clientY ) : " + clientCoords);
	});// CanvasPreview.mousemove

	/*Event: CanvasPreview.click
	Manages the click event on the outermost canvas*/
	aDiag.painter.CanvasPreview.click(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
			   mouseY > aDiag.painter.PFOriginYAbsolute && mouseY <= aDiag.painter.PFOriginYAbsolute+(20*aDiag.painter.blockSize))
			{
				var pfX = parseInt(Math.floor((mouseX - aDiag.painter.PFOriginXAbsolute)/aDiag.painter.blockSize),10);
				var pfY = parseInt(Math.floor((mouseY - aDiag.painter.PFOriginYAbsolute)/aDiag.painter.blockSize),10);
				var extract = $("input[type=radio][name='select']:checked").attr("value");
				var type = extract.charAt(0);
				var orientation = extract.slice(1);
				var mode = $("input[type=radio][name='editor-tab']:checked").attr("value");
				if (TOOL_FILL && type != aDiag.frames[aDiag.current_frame].lookup(pfX,pfY)) {
					aDiag.frames[aDiag.current_frame].recursive_fill(pfX,
																		pfY,
																		aDiag.frames[aDiag.current_frame].lookup(pfX,pfY),
																		type);
					//addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);
					//aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);
				}
				else if (TOOL_PENCIL)
				{
					aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,"singleton","inactive",TOOL_DROP);
				}
				else if (TOOL_ERASER)
				{
					aDiag.frames[aDiag.current_frame].removeBlock(pfX,pfY);
				}
				else
				{
					if (type == "I") { //offset I so it doesn't look weird on mouseover
						aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,"inactive",TOOL_DROP);
					}
					else
					{
						aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,"inactive",TOOL_DROP);
					}
				}
				
			}
	});//end CanvasPreview.click

	/*Event: CanvasNextHold.click
	Manages the click event on the next & hold canvas*/
	aDiag.painter.CanvasNextHold.click(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		//var pfX = parseInt(Math.floor((mouseX)/aDiag.painter.blockSize),10);
		//var pfY = parseInt(Math.floor((mouseY)/aDiag.painter.blockSize),10);
		var pfX = parseInt(1+((mouseX - aDiag.painter.CanvasNextHold.offset().left)/aDiag.painter.blockSize),10);
		var pfY = parseInt(1+((mouseY - aDiag.painter.CanvasNextHold.offset().top)/aDiag.painter.blockSize),10);
		var extract = $("input[type=radio][name=select]:checked").attr("value");
		var type = extract.charAt(0);
		if (pfX >= 0 && pfX < 4) {
			aDiag.frames[aDiag.current_frame].modify_hold(type);
		}
		if (pfX >= 4 && pfX < 8) {
			aDiag.frames[aDiag.current_frame].modify_next(0,type);
		}
		if (pfX >= 8 && pfX < 11) {
			aDiag.frames[aDiag.current_frame].modify_next(1,type);
		}
		if (pfX >= 11) {
			aDiag.frames[aDiag.current_frame].modify_next(2,type);
		}

	}); //end CanvasNextHold.click

	/* ------------------------------------------------------------------------- */
	/* --------------------------- BUTTON MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */

	$("#cmd_clear_active").click(function(){
		aDiag.frames[aDiag.current_frame].clear("active");
	});

	$("#cmd_clear_inactive").click(function(){
		aDiag.frames[aDiag.current_frame].clear("inactive");
	});

	$("#cmd_new").click(function(){
		aDiag.new_frame();
	});

	$("#cmd_del").click(function(){
		aDiag.remove_current_frame();
	});

	
	$("#cmd_first").click(function(){
		aDiag.first_frame();
	});
	
	$("#cmd_prev").click(function(){
		aDiag.previous_frame();
	});
	
	$("#cmd_next").click(function(){
		if(aDiag.current_frame < aDiag.frames.length - 1){
		aDiag.next_frame();
		}
		else
		{
		aDiag.new_copy_frame();
		}
	});
	
	$("#cmd_last").click(function(){
		aDiag.last_frame();
	});

	$("#cmd_nuke").click(function(){
		aDiag.remove_all_playfields();
	});

	$("#piece-selection").click(function(){
		console.log("foo: "+$("#piece-selection input:checked"));
		$("#piece-selection td").removeClass("pressed");
		$("#piece-selection input:checked").parent().parent().addClass("pressed");
	});

	var _frames = 16.6666667;
	//aDiag.load("M~MyFoobarIsRich_A~Jgkccw_I~Tadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Shdhdhehfhhidifihjdjfjgjh_+A~e_I~Tahagbd~Shgje~Ebfbhif+I~Zaa+I~Zab+I~Zac+I~Zad+I~Zae+I~Zaf+I~Zag+I~Zai+I~Zba+I~Zbb+I~Zbc+I~Zbd+I~Zbe+I~Zbf+I~Zbg+I~Zbi+I~Zda+I~Zdb+I~Zdc+I~Zdd+I~Zde+I~Zdf+I~Zdg+I~Zdi+I~Zea+I~Zeb+I~Zec+I~Zed+I~Zee+I~Zef+I~Zeg+I~Zei+I~Zfa+I~Zfb+I~Zfc+I~Zfd+I~Zfe+I~Zff");

	// aDiag.painter.drawWhitePixel(aDiag.frames[aDiag.current_frame].playfield);
	//aDiag.painter.drawLocalWhitePixel(aDiag.frames[aDiag.current_frame].playfield,5,6)

	$("#cmd_playpause").click(function(){
		aDiag.first_frame();
		var i = 0;
		advance();
		function advance(){
			//console.log("Doki "+i);
			if(i<aDiag.frames.length-1)
			{
				aDiag.next_frame();
				setTimeout(advance,1*_frames);
				i++;
			} // change and see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
			else
			{
				console.log("Finished !");
			}
		}
	});

	var $utilites = $("#utilites");
	var $tabdeco = $('#tab-deco');
	var $tabactive = $('#tab-active');
	var $tabinactive = $('#tab-inactive');
	var $tabactions = $('#tab-actions');
	var $tabproperties = $('#tab-properties');

	var $pieceselection = $('#piece-selection-panel');
	var $tools = $('#tools');
	var $actionspanel = $("#panel-actions");
	var $decorationspanel = $("#panel-decorations");
	var $propertiespanel = $("#panel-proprieties");

	$('body').mousedown(function(){IS_CLICKING = true;}).mouseup(function(){IS_CLICKING = false;});

	function setbuttonfalse(){
		TOOL_DROP = false;
		TOOL_FILL = false;
		TOOL_RECTANGULAR = false;
		TOOL_PENCIL = false;
		TOOL_ERASER = false;
		$drop.removeClass("pressed");
		$fill.removeClass("pressed");
		$pencil.removeClass("pressed");
		$eraser.removeClass("pressed");
	}

	function hideallpanel(){
		$decorationspanel.fadeOut();
		$pieceselection.fadeOut();
		$tools.fadeOut();
		$actionspanel.fadeOut();
		$propertiespanel.fadeOut();
	}


	$tabdeco.click(function(){
		hideallpanel();
		setbuttonfalse();
		$utilites.removeClass().addClass("border-deco");
		$decorationspanel.fadeIn();
	});

	$tabactive.mousedown(function(){
		hideallpanel();
		setbuttonfalse();
		$utilites.removeClass().addClass("border-active");
		$pieceselection.fadeIn();
		$tools.fadeIn().find('.tools-button').not(":first-child").fadeOut();
		$('#cmd_clear_active').fadeIn();
		$('#cmd_clear_inactive').fadeOut();
	});

	$tabinactive.mousedown(function(){
		hideallpanel();
		setbuttonfalse();
		$utilites.removeClass().addClass("border-inactive");
		$pieceselection.fadeIn();
		$tools.fadeIn();
		$tools.fadeIn().find('.tools-button').fadeIn();
		$('#cmd_clear_inactive').fadeIn();
		$('#cmd_clear_active').fadeOut();
	});

	$tabproperties.mousedown(function(){
		hideallpanel();
		setbuttonfalse();
		$propertiespanel.fadeIn();
		$utilites.removeClass().addClass("border-properties");
		
	});

	$tabactions.mousedown(function(){
		hideallpanel();
		setbuttonfalse();
		$actionspanel.fadeIn();
	});

	var $drop = $("#button-drop");
	$drop.mousedown(function(){
		if (TOOL_DROP) {
			setbuttonfalse();
		}
		else
		{
			setbuttonfalse();
			TOOL_DROP = true;
			$drop.addClass("pressed");

		}
	});

	var $fill = $("#button-paint-bucket");
	$fill.mousedown(function(){
		if (TOOL_FILL) {
			setbuttonfalse();
		}
		else
		{
			setbuttonfalse();
			TOOL_FILL = true;
			$fill.addClass("pressed");

		}
	});

	var $pencil = $("#button-pencil");
	$pencil.mousedown(function(){
		if (TOOL_PENCIL) {
			setbuttonfalse();
		}
		else
		{
			setbuttonfalse();
			TOOL_PENCIL = true;
			$pencil.addClass("pressed");

		}
	});

	var $eraser = $("#button-eraser");
	$eraser.mousedown(function(){
		if (TOOL_ERASER) {
			setbuttonfalse();
		}
		else
		{
			setbuttonfalse();
			TOOL_ERASER = true;
			$eraser.addClass("pressed");

		}
	});

	$('#next1-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_next(0,$('#next1-select').val());
	});

	$('#next2-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_next(1,$('#next2-select').val());
	});

	$('#next3-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_next(0,$('#next3-select').val());
	});

	$('#hold-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_hold($('#hold-select').val());
	});


	$('#border-select').change(function(){
		aDiag.change_border($('#border-select').val());
	});

	$("#export-forum-button").click(function(){
		if($('input[name=export-type]:checked').val() == 'All')
		{
			$("#export").html("[tedige]"+aDiag.print()+"[/tedige]");
		}
		if($('input[name=export-type]:checked').val() == 'Current')
		{
			$("#export").html("[tedige]"+aDiag.frames[aDiag.current_frame].print()+"[/tedige]");
		}
	});

	$("#import-button").click(function(){
		var bigstr = $("#import").val();
		// TODO

	});
	
	
	$("#cmd_current_frame_load").click(function(){
		aDiag.frames[aDiag.current_frame].load($("#import").val(),"blank");
	});

	$("#cmd_diagram_load").click(function(){
		aDiag.load($("#import").val());
	});

}); // end jquery.ready

	function drawPaletteCell(type,orientation,RS,blockSize,sprite){
		var Canvas = $('#editor-palette-'+type+orientation);
		var ctx = Canvas[0].getContext("2d");
		var matrix = getMatrix(type, orientation, RS);
		Canvas.attr("width",Canvas.width());

		var color,sprite,spriteOffset;
		switch(RS){
			case "ARS":
				switch(type){
					case "I":
						color = ARS.I.color;
						spriteOffset = ARS.I.offset;
						break;
					case "T":
						color = ARS.T.color;
						spriteOffset = ARS.T.offset;
						break;
					case "L":
						color = ARS.L.color;
						spriteOffset = ARS.L.offset;
						break;
					case "J":
						color = ARS.J.color;
						spriteOffset = ARS.J.offset;
						break;
					case "S":
						color = ARS.S.color;
						spriteOffset = ARS.S.offset;
						break;
					case "Z":
						color = ARS.Z.color;
						spriteOffset = ARS.Z.offset;
						break;
					case "O":
						color = ARS.O.color;
						spriteOffset = ARS.O.offset;
						break;
					case "G":
						color = ARS.G.color;
						spriteOffset = ARS.G.offset;
						break;
				}
			break;
		}

		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (matrix[i][j]) {
					ctx.beginPath();
					ctx.rect(parseInt(j*blockSize),parseInt(i*blockSize),blockSize,blockSize);
					ctx.fillStyle = color;
					ctx.fill();
					ctx.closePath();
					if (sprite) {
						ctx.drawImage(sprite, // original image
									  spriteOffset[0]*blockSize,spriteOffset[1]*blockSize, //coordinate on the original image
									  blockSize,blockSize, // size of the rectangle to will be cut
									  parseInt(j*blockSize),parseInt(i*blockSize), // destination coordinate
									  blockSize,blockSize); // destination size
					}

				}
			}
		}

	}//end drawpalettecell

		
function drawPalette(RS, blockSize,sprite){
	var type = ['I','T','S','Z','L','J','O'];
	var orientation = ['i','cw','ccw','u'];

	for (var i = 0; i < type.length; i++) {
		for (var j = 0; j < orientation.length; j++) {
			drawPaletteCell(type[i],orientation[j],RS,blockSize,sprite);
		};
	};

}
