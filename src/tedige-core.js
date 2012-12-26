/** @preserve TeDiGe-2 - Core file, used everywhere - https://github.com/PetitPrince/TeDiGe-2/  */
  
/** Painter

	Painter interact with the canvases and the html page. It binds
	to / uses several layer of overlapping canvas elements. Think
	of it a bit like the view part of a MVC model.

	<pre>
	>                       +---------------------+
	>                       V                     |
	>    Canvas/html <-- Painter <-- Frame <-- Diagram
	>           |       ^^^^^^^^                ^
	>           |                               |
	>           +-------------------------------+
	</pre>

	@class
	@param {string} CanvasIDString The ID of the canvas element
	@param {number} CanvasHeight The height of the canvas element
	@param {number} CanvasWidth The width of the canvas element
	@param {blockSize} blockSize The size of the canvas element
	@requires Frame
	@requires Diagram

*/
function Painter(CanvasIDString) {
	/*
		Default canvas size (same as fumen) :
		- height: 193px
		- width: 80px
		- block size: 8*8px
	*/

	/** A variable referencing the class, used to exploit closure stuff in other methods*/
	var myself = this;

	// Default parameter method could be taken from: http://stackoverflow.com/questions/894860/how-do-i-make-a-default-value-for-a-parameter-to-a-javascript-function

	/** Height of the Canvas in px.*/
	this.CanvasHeight = 177;
	/** Width of the Canvas in px.*/
	this.CanvasWidth = 97;
	/**Size of a block element in px.*/
	this.blockSize = 8;

	this.IDString = CanvasIDString;
	/* ------------------------------- */
	/* --- HTML-related properties --- */
	/* ------------------------------- */

	/** Get the jQuery object of the preview canvas, where things gets drawn on mouseover*/
	this.CanvasPreview = $('#' + CanvasIDString + '-preview');
	/** Get the 2d context of the related canvas*/
	this.ContextPreview = this.CanvasPreview[0].getContext('2d');

	/** Get the jQuery object of the deco canvas, where things like arrows, line clear effects,
	symbols... are displayed*/
	this.CanvasDeco = $('#' + CanvasIDString + '-deco');
	/** Get the 2d context of the related canvas*/
	this.ContextDeco = this.CanvasDeco[0].getContext('2d');

	/** Get the jQuery object of the pf canvas where the inactive blocks are displayed */
	this.CanvasPF = $('#' + CanvasIDString + '-inactive');
	/** Get the 2d context of the related canvas*/
	this.ContextPF = this.CanvasPF[0].getContext('2d');

	/** Get the jQuery object of the active canvas, where the active pieces are displayed*/
	this.CanvasActive = $('#' + CanvasIDString + '-active');
	/** Get the 2d context of the related canvas*/
	this.ContextActive = this.CanvasActive[0].getContext('2d'); // cPF: ContextPF

	/** Get the jQuery object of the whiteborder canvas, where the TGM-ish white-border is drawn*/
	this.CanvasWhiteborder = $('#' + CanvasIDString + '-whiteborder');
	/** Get the 2d context of the related canvas*/
	this.ContextWhiteborder = this.CanvasWhiteborder[0].getContext('2d');

	/** Get the jQuery object of the background canvas.*/
	this.CanvasBackground = $('#' + CanvasIDString + '-background');
	/** Get the 2d context of the related canvas*/
	this.ContextBackground = this.CanvasBackground[0].getContext('2d');

	/** Get the jQuery object of the border canvas.*/
	this.CanvasBorder = $('#' + CanvasIDString + '-border');
	/** Get the 2d context of the related canvas*/
	this.ContextBorder = this.CanvasBorder[0].getContext('2d'); // cPF: ContextPF

	/** Get the jQuery object of the decopin canvas, where the "pin" is drawn in editor mode*/ // TODO: move this to tedige-editor.js
	this.CanvasDecoPin = $('#' + CanvasIDString + '-decoPin');
	/** Get the 2d context of the related canvas*/
	this.ContextDecoPin = this.CanvasDecoPin[0].getContext('2d');

	/* ---------------- */

	/** Get the jQuery object of the NextHold canvas, where the next and holded piece are drawn*/
	this.CanvasNextHold = $('#' + CanvasIDString + '-nexthold');
	/** Get the 2d context of the related canvas*/
	this.ContextNextHold = this.CanvasNextHold[0].getContext('2d');

	/** Get the jQuery object of the progressbar canvas.*/
	this.CanvasProgressbar = $('#' + CanvasIDString + '-progressbar');
	/** Get the 2d context of the related canvas*/
	this.ContextProgressbar = this.CanvasProgressbar[0].getContext('2d');

	/** Get the jQuery object of the control canvas, where the joystick is drawn*/
	this.CanvasControl = $('#' + CanvasIDString + '-control');
	/** Get the 2d context of the related canvas*/
	this.ContextControl = this.CanvasControl[0].getContext('2d');

	/* --------------------------------- */
	/* --- Canvas-related properties --- */
	/* --------------------------------- */

	/** Sets the position of the playfield relative to the canvas*/
	this.PFOriginX = 1 * this.blockSize;
	/** Sets the position of the playfield relative to the canvas*/
	this.PFOriginY = 1 * this.blockSize;
	/**Sets the position of the playfield relative to the page*/
	this.PFOriginXAbsolute = this.CanvasPF.offset().left + this.PFOriginX - 1;
	/**Sets the position of the playfield relative to the page*/
	this.PFOriginYAbsolute = this.CanvasPF.offset().top + this.PFOriginY;

	/** Sets the position of the controls (joystick, buttons) relative to the page*/
	this.CntrlOriginX = this.CanvasControl.offset().left;
	/** Sets the position of the controls (joystick, buttons) relative to the page*/
	this.CntrlOriginY = this.CanvasControl.offset().top;

	this.CanvasControlheight = this.CanvasControl.height();
	/** An image object that contains the blocks' sprite*/
	this.sprite = '';
	/**An image object that contains the blocks' sprite, mini version*/
	this.spritemini = '';
	/** An image object that contains the decorations' sprite*/
	this.spritedeco = '';

	/** A boolean that sets if the painter object is ready to be painter, i.e. if the sprites have loaded*/
	this.ready = false;
	/** Loads the image into the sprite object*/
	this.init = function () {
		// Don't know if it's the correct way to preload the image...
		// ARS.sprite = document.createElement('img'); // doesn't work in chrome ?!
		// ARS.spritemini = document.createElement('img');
		this.spritedeco = new Image();
		this.sprite = new Image();
		this.spritemini = new Image();
		this.spritedeco.src = 'res/deco-8px.png';
		this.sprite.src = 'res/palette-8px.png';
		this.spritemini.src = 'res/palette-4px.png';
		this.sprite.onload = function () {
			myself.ready = true;
		};
		this.sprite.onerror = function () {
			myself.ready = true;
		};
		this.drawJoystick('all', 'rest');
		this.drawAllButtons('rest');
		this.drawBorder('master');
		this.drawGrid();

	};

	/** Erase the content one layer (the canvas still exists)..

		@param {string} layer Define which layer will be erased. Possible value: 'inactive', 'active','preview', 'nexthold', 'whiteborder' or 'all'
	*/
	this.eraseLayer = function (layer) {
		var Canvas;
		switch (layer)
		{
			case 'decoration':
				Context = this.ContextDeco;
				break;
			case 'inactive':
				Context = this.ContextPF;
				break;
			case 'preview':
				Context = this.ContextPreview;
				break;
			case 'active':
				Context = this.ContextActive;
				break;
			case 'nexthold':
				Context = this.ContextNextHold;
				break;
			case 'whiteborder':
				Context = this.ContextWhiteborder;
				break;
			case 'all':
				Context = this.ContextPF;
				
				this.ContextDeco.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
				this.ContextPreview.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
				this.ContextActive.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
				this.ContextNextHold.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
				this.ContextWhiteborder.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
				break;
		}
		Context.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
	};

	/** Erase a 'block' area at the designated coordinate.

		@param {number} x x position, in block unit
		@param {number} y y position, in block unit
	*/
	this.eraseBlock = function (x, y) {
		this.ContextPF.clearRect(this.PFOriginX+x*this.blockSize,this.PFOriginY+y*this.blockSize,this.blockSize,this.blockSize);
	};

	/**Erase a 'block' area at the designated coordinate in the decoration layer.

		@param {number} x x position, in block unit
		@param {number} y y position, in block unit
	*/
	this.eraseDeco = function(x,y){
		this.ContextDeco.clearRect(this.PFOriginX+x*this.blockSize,this.PFOriginY+y*this.blockSize,this.blockSize,this.blockSize);
	};

	/** Change the value of the comment textarea.

		@param {string} str Value of the new comment
	*/
	this.drawComment = function(str){
		$('#'+this.IDString+'-comment').val(str);
	};

	/** Change the value of the duration textarea.

		@param {string} str Value of the new duration
	*/
	this.drawDuration = function(str){
		$('#'+this.IDString+'-duration').val(str);
	// TODO: move this to tedige-editor.js
	};

	/** Change the value of the opacity textarea.

		@param {string} str Value of the new opacity
	*/
	this.drawOpacity = function(str){
		$('#'+this.IDString+'-active-opacity').val(str);
	// TODO: move this to tedige-editor.js
	};

	/** Draw the progressbar according to its status given in parameter

		@param {number} CurrentFrame Which frame are we on ?
		@param {number} TotalFrame How many frame there are
	*/
	this.drawProgressbar = function(CurrentFrame,TotalFrame){
		if(CurrentFrame <= TotalFrame && CurrentFrame > 0) // filter out invalid input
		{
			this.ContextProgressbar.clearRect(0,0,this.CanvasWidth,this.CanvasHeight);
			this.ContextProgressbar.beginPath();
			this.ContextProgressbar.rect(0,0,parseInt((CurrentFrame/TotalFrame)*100,10),24);
			this.ContextProgressbar.fillStyle= 'gray';
			this.ContextProgressbar.fill();
			this.ContextProgressbar.closePath();
		}
	};

	/** Draw a TGM-like white pixel around inactive blocks in the whole playfield.

		@param playfield The playfield on which to draw the white border
	*/
	this.drawWhiteBorder = function(playfield)
	{
		// todo: do an 'anti white pixel' that clear instead of draw
		// we iterate on the playfield, look in each case if there's something in it, then look at the neighbour for empty cases to paint some borders in these cases
		this.eraseLayer('whiteborder');
		//this.ContextWhiteborder.rect((this.PFOriginX+i*this.blockSize)-1,this.PFOriginY+j*this.blockSize-1,1,this.blockSize+1);
		for(var i = 0, istop = playfield.length; i < istop; i++) { // for optimisation: caching the length instead of calculating it each time
			for(var j = 0, jstop = playfield[0].length; j < jstop; j++) {
				if (playfield[i][j][0]) {
					this.drawLocalWhiteBorder(playfield,i,j);
				}
			}
		}
	};
	/** Draw a TGM-like white pixel around in an empty case.

		@param playfield The playfield on which to draw the white border
		@param {number} x X coordinate, in block unit
		@param {number} y Y coordinate, in block unit
	*/
	this.drawLocalWhiteBorder = function(playfield,x,y){
		// Todo (procrastination level: 99999): I cannot get really good squary corners...
		this.ContextWhiteborder.beginPath();

		if (playfield[x][y][0]) // if the center case is full ; ILLOGICAL TODO: what's playfield[x][y][0] ??
		{
			if (x-1 >= 0)
			{
				if (!playfield[x-1][y][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+x*this.blockSize)-1,
												  this.PFOriginY+y*this.blockSize,
												  1,
												  this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';

					this.ContextWhiteborder.clearRect((this.PFOriginX+x*this.blockSize),
													   this.PFOriginY+y*this.blockSize,
													   1,
													   this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}
			if (x+1 < playfield.length)
			{
				if (!playfield[x+1][y][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+(x+1)*this.blockSize),
												  this.PFOriginY+y*this.blockSize,
												  1,
												  this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';
					this.ContextWhiteborder.clearRect((this.PFOriginX+(x+1)*this.blockSize)-1,
													   this.PFOriginY+y*this.blockSize,
													   1,
													   this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}

			if (y-1 >= 0)
			{
				if (!playfield[x][y-1][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+x*this.blockSize),
												  this.PFOriginY+y*this.blockSize-1,
												  this.blockSize,
												  1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';
					this.ContextWhiteborder.clearRect((this.PFOriginX+x*this.blockSize),
													   this.PFOriginY+y*this.blockSize,
													   this.blockSize,
													   1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}

			if (y+1 < playfield[0].length)
			{
				if (!playfield[x][y+1][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+x*this.blockSize),
												  this.PFOriginY+(y+1)*this.blockSize,
												  this.blockSize,
												  1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';
					this.ContextWhiteborder.clearRect((this.PFOriginX+x*this.blockSize),
													   this.PFOriginY+(y+1)*this.blockSize-1,
													   this.blockSize,
													   1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}

		}
	else
		{
			if (x-1 >= 0)
			{
				if (playfield[x-1][y][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+x*this.blockSize),
												  this.PFOriginY+y*this.blockSize,
												  1,
												  this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';
					this.ContextWhiteborder.clearRect((this.PFOriginX+x*this.blockSize)-1,
													   this.PFOriginY+y*this.blockSize,
													   1,
													   this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}
			if (x+1 < playfield.length)
			{
				if (playfield[x+1][y][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+(x+1)*this.blockSize)-1,
												  this.PFOriginY+y*this.blockSize,
												  1,
												  this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';
					this.ContextWhiteborder.clearRect((this.PFOriginX+(x+1)*this.blockSize),
													   this.PFOriginY+y*this.blockSize,
													   1,
													   this.blockSize);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}

			if (y-1 >= 0)
			{
				if (playfield[x][y-1][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+x*this.blockSize),
												  this.PFOriginY+y*this.blockSize,
												  this.blockSize,
												  1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';
					this.ContextWhiteborder.clearRect((this.PFOriginX+x*this.blockSize),
													   this.PFOriginY+y*this.blockSize-1,
													   this.blockSize,
													   1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}

			if (y+1 < playfield[0].length)
			{
				if (playfield[x][y+1][0])
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'white';
					this.ContextWhiteborder.rect((this.PFOriginX+x*this.blockSize),
												  this.PFOriginY+(y+1)*this.blockSize-1,
												  this.blockSize,
												  1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
				else
				{
					this.ContextWhiteborder.beginPath();
					this.ContextWhiteborder.fillStyle= 'pink';
					this.ContextWhiteborder.clearRect((this.PFOriginX+x*this.blockSize),
													   this.PFOriginY+(y+1)*this.blockSize,
													   this.blockSize,
													   1);
					this.ContextWhiteborder.closePath();
					this.ContextWhiteborder.fill();
				}
			}

		}

	};

	/** Draw a block sized grid on the background layer, for no particular reason
	*/
	this.drawGrid = function(){
		// todo: change if width/height variable
		this.ContextBackground.beginPath();

		// Rectangle method
		// using line (ctx.moveTo, lineTo, stroke()) doesn't give good results
		this.ContextBackground.beginPath();
		//hor
		for(var i = 1; i <= 9; i++) {
			this.ContextBackground.rect(this.PFOriginX+((i)*this.blockSize),this.PFOriginY,1,20*this.blockSize);
		}
		//vert
		for(var i = 1; i <= 19; i++) {
			this.ContextBackground.rect(this.PFOriginX,this.PFOriginY+((i)*this.blockSize),10*this.blockSize,1);
		}
		this.ContextBackground.fillStyle = '#444';
		this.ContextBackground.fill();

		this.ContextBackground.closePath();
	};

	/** Draws the Tetrion (the playfield's border).

		@param {string} kind Define what kind of tetrion you want. Currently supported:
		'master' (gray-bluish), 'easy' (green) and 'death' (red). Defaults to master if
		none is selected
	*/
	
	
	this.drawBorder = function(kind){
		var color1 = '#afafaf';
		var color2 = '#46545f';

		switch(kind)
		{
			case 'master':
				color1 = '#afafaf';
				color2 = '#46545f';
			break;

			case 'easy':
				color1 = '#afafaf';
				color2 = '#475f46';
			break;

			case 'death':
				color1 = '#ac434a';
				color2 = '#5f0004';
			break;

			default:
				color1 = '#afafaf';
				color2 = '#46545f';
			break;

		}

		var radgrd1 = this.ContextBorder.createRadialGradient(0,0,this.blockSize,
															0,0,this.CanvasWidth-2*this.blockSize),
			radgrd2 = this.ContextBorder.createRadialGradient(this.CanvasWidth,this.CanvasHeight,this.blockSize,
															this.CanvasWidth,this.CanvasHeight,this.CanvasWidth-2*this.blockSize);
		radgrd1.addColorStop(0,color1);
		radgrd1.addColorStop(1,color2);
		radgrd2.addColorStop(0,color1);
		radgrd2.addColorStop(1,color2);

		var grd_hor = this.ContextBorder.createLinearGradient(0,0,this.CanvasWidth-2*this.blockSize,0), // multiple declaration in a single statement ftw !
			grd_hor_rev = this.ContextBorder.createLinearGradient(0,0,this.CanvasWidth-2*this.blockSize,0),

			grd_vert = this.ContextBorder.createLinearGradient(0,0,0,this.CanvasWidth-2*this.blockSize),
			grd_vert_rev = this.ContextBorder.createLinearGradient(0,0,0,this.CanvasWidth-2*this.blockSize);

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
		drawrectangle(1*this.blockSize,1*this.blockSize,10*this.blockSize,20*this.blockSize,'black');

	}; // end drawborder

	/** Draws a part of the next or holded piece.

		@param {number} position Define which position will be drawn. 0 is hold, 1 is the next1 piece, 2 is the next2 piece, ...
		@param {string} type Type of the tetraminmo. Possible value: (SZLJTOIG)
		@param {string} RS Define the style of the block. Possible value: 'ARS, 'SRS'
	*/
	this.drawNextHold = function(position,type,RS){
		matrix = getMatrix(type, 'i', RS);

		switch(position){
		case 0:
			this.ContextNextHold.clearRect(0,this.blockSize+3,4*this.blockSize,3*this.blockSize);
			if(!type)
				{return;}
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j]) {

					//this.ContextNextHold.clearRect(this.CanvasNextHold.offset().left);
						this.drawBlock(parseInt(-1+j,10),parseInt(2+i,10),type,RS,'nextholdmini');
					}
				}
			}
		break;

		case 1:
			this.ContextNextHold.clearRect(4*this.blockSize,this.blockSize,4*this.blockSize,3*this.blockSize+3);
			if(!type)
				{return;}
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						if(RS == "SRS")
						{
							this.drawBlock(parseInt(3+j,10),parseInt(1+i,10),type,RS,'nexthold');
						}
						else
						{
							this.drawBlock(parseInt(3+j,10),parseInt(0+i,10),type,RS,'nexthold');
						}
						
					}
				}
			}
		break;

		case 2:
			this.ContextNextHold.clearRect(8*this.blockSize,this.blockSize+3,2*this.blockSize+1,3*this.blockSize);
			if(!type)
				{return;}
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						this.drawBlock(parseInt(13+j,10),parseInt(3+i,10),type,RS,'nextholdmini');
					}
				}
			}
		break;

		case 3:
			if(!type)
				{return;}
			this.ContextNextHold.clearRect(10*this.blockSize,this.blockSize+3,2*this.blockSize+1,3*this.blockSize);
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						this.drawBlock(parseInt(17+j,10),parseInt(3+i,10),type,RS,'nextholdmini');
					}
				}
			}
		break;
		}
		// ToDo: what happens when nextArray.length > 3 ? (i.e. more next than 3)

	};

	/** Change the opacity of the active layer.

		@param {(number|string)} level A number between 0 and 1 (alternatively, 'flash' can be used instead of '1.0').
	*/
	this.changeActiveOpacity = function(level){
		if (level == 'Flash' || level == 'flash')
		{
			this.CanvasActive.attr('style','z-index:4; opacity: 1.0');
		}
		else
		{
			this.CanvasActive.attr('style','z-index:4; opacity: '+level);
		}
	};

	/** Draws a decoration at the designated coordinate.

		@param {number} x X coordinate.
		@param {number} y Y coordinate.
		@param {string} kind Type of decoration.
		@param {string} layer Target layer. Possible values : ('preview' 'eraser' or 'dec').
	*/
	this.drawDeco = function(x,y,kind,layer){
		if(!kind)
		{
			return;
		}

		var sprite = this.spritedeco;
		var spriteOffsetStart, spriteOffsetEnd;
		var ctx;
		if (layer == 'preview')
		{
			ctx = this.ContextPreview;
		}
		else
		{
			ctx = this.ContextDeco;
		}
		switch(kind){ // there has to be a more elegant solution than *that* :/ ...
			case 'n1':	spriteOffsetStart = decoration.n1.s; spriteOffsetEnd = decoration.n1.e; break;
			case 'n2':	spriteOffsetStart = decoration.n2.s; spriteOffsetEnd = decoration.n2.e; break;
			case 'n3':	spriteOffsetStart = decoration.n3.s; spriteOffsetEnd = decoration.n3.e; break;
			case 'n4':	spriteOffsetStart = decoration.n4.s; spriteOffsetEnd = decoration.n4.e; break;
			case 'n5':	spriteOffsetStart = decoration.n5.s; spriteOffsetEnd = decoration.n5.e; break;
			case 'n6':	spriteOffsetStart = decoration.n6.s; spriteOffsetEnd = decoration.n6.e; break;
			case 'n7':	spriteOffsetStart = decoration.n7.s; spriteOffsetEnd = decoration.n7.e; break;
			case 'n8':	spriteOffsetStart = decoration.n8.s; spriteOffsetEnd = decoration.n8.e; break;
			case 'n9':	spriteOffsetStart = decoration.n9.s; spriteOffsetEnd = decoration.n9.e; break;
			case 'n0':	spriteOffsetStart = decoration.n0.s; spriteOffsetEnd = decoration.n0.e; break;
			case 'smallcw':	spriteOffsetStart = decoration.smallcw.s; spriteOffsetEnd = decoration.smallcw.e; break;
			case 'smallccw':	spriteOffsetStart = decoration.smallccw.s; spriteOffsetEnd = decoration.smallccw.e; break;
			case 'smalloktick':	spriteOffsetStart = decoration.smalloktick.s; spriteOffsetEnd = decoration.smalloktick.e; break;
			case 'smallokcircle':	spriteOffsetStart = decoration.smallokcircle.s; spriteOffsetEnd = decoration.smallokcircle.e; break;
			case 'smallnocross':	spriteOffsetStart = decoration.smallnocross.s; spriteOffsetEnd = decoration.smallnocross.e; break;
			case 'smallquestion':	spriteOffsetStart = decoration.smallquestion.s; spriteOffsetEnd = decoration.smallquestion.e; break;
			case 'smallexclamation':	spriteOffsetStart = decoration.smallexclamation.s; spriteOffsetEnd = decoration.smallexclamation.e; break;
			case 'nwarrow':	spriteOffsetStart = decoration.nwarrow.s; spriteOffsetEnd = decoration.nwarrow.e; break;
			case 'narrow':	spriteOffsetStart = decoration.narrow.s; spriteOffsetEnd = decoration.narrow.e; break;
			case 'nearrow':	spriteOffsetStart = decoration.nearrow.s; spriteOffsetEnd = decoration.nearrow.e; break;
			case 'earrow':	spriteOffsetStart = decoration.earrow.s; spriteOffsetEnd = decoration.earrow.e; break;
			case 'searrow':	spriteOffsetStart = decoration.searrow.s; spriteOffsetEnd = decoration.searrow.e; break;
			case 'sarrow':	spriteOffsetStart = decoration.sarrow.s; spriteOffsetEnd = decoration.sarrow.e; break;
			case 'swarrow':	spriteOffsetStart = decoration.swarrow.s; spriteOffsetEnd = decoration.swarrow.e; break;
			case 'warrow':	spriteOffsetStart = decoration.warrow.s; spriteOffsetEnd = decoration.warrow.e; break;
			case 'bigcw':	spriteOffsetStart = decoration.bigcw.s; spriteOffsetEnd = decoration.bigcw.e; break;
			case 'bigccw':	spriteOffsetStart = decoration.bigccw.s; spriteOffsetEnd = decoration.bigccw.e; break;
			case 'bigquestion':	spriteOffsetStart = decoration.bigquestion.s; spriteOffsetEnd = decoration.bigquestion.e; break;
			case 'bigexclamation':	spriteOffsetStart = decoration.bigexclamation.s; spriteOffsetEnd = decoration.bigexclamation.e; break;
			case 'bigoktick':	spriteOffsetStart = decoration.bigoktick.s; spriteOffsetEnd = decoration.bigoktick.e; break;
			case 'bigokcircle':	spriteOffsetStart = decoration.bigokcircle.s; spriteOffsetEnd = decoration.bigokcircle.e; break;
			case 'bignocross':	spriteOffsetStart = decoration.bignocross.s; spriteOffsetEnd = decoration.bignocross.e; break;
			case 'overlayyellow':	spriteOffsetStart = decoration.overlayyellow.s; spriteOffsetEnd = decoration.overlayyellow.e; break;
			case 'overlayblue':	spriteOffsetStart = decoration.overlayblue.s; spriteOffsetEnd = decoration.overlayblue.e; break;
			case 'overlaygreen':	spriteOffsetStart = decoration.overlaygreen.s; spriteOffsetEnd = decoration.overlaygreen.e; break;
			case 'overlaypink':	spriteOffsetStart = decoration.overlaypink.s; spriteOffsetEnd = decoration.overlaypink.e; break;
			case 'overlayorange':	spriteOffsetStart = decoration.overlayorange.s; spriteOffsetEnd = decoration.overlayorange.e; break;
			case 'clear1':	spriteOffsetStart = decoration.clear1.s; spriteOffsetEnd = decoration.clear1.e; break;
			case 'clear2':	spriteOffsetStart = decoration.clear2.s; spriteOffsetEnd = decoration.clear2.e; break;
			case 'clear3':	spriteOffsetStart = decoration.clear3.s; spriteOffsetEnd = decoration.clear3.e; break;
			case 'clear4':	spriteOffsetStart = decoration.clear4.s; spriteOffsetEnd = decoration.clear4.e; break;
			case 'clear5':	spriteOffsetStart = decoration.clear5.s; spriteOffsetEnd = decoration.clear5.e; break;
			case 'clear6':	spriteOffsetStart = decoration.clear6.s; spriteOffsetEnd = decoration.clear6.e; break;
			case 'clear7':	spriteOffsetStart = decoration.clear7.s; spriteOffsetEnd = decoration.clear7.e; break;
			}
		var ox = spriteOffsetStart[0]*(this.blockSize);
		var oy = spriteOffsetStart[1]*(this.blockSize);
		var w = (spriteOffsetEnd[0]-spriteOffsetStart[0])*(this.blockSize);
		var h = (spriteOffsetEnd[1]-spriteOffsetStart[1])*(this.blockSize);
		var nx = this.PFOriginX+((x)*this.blockSize);
		var ny = this.PFOriginY+((y)*(this.blockSize));
		if(layer != 'eraser')
		{
			// clear what's below
			ctx.clearRect(nx,ny,w,h);
			// draw the image
			ctx.drawImage(sprite, // original image
						ox,oy, //coordinate on the original image
						w,h, // size of the rectangle to will be cut
						nx,ny, // destination coordinate
						w,h); // destination size

		}
		else
		{
			ctx.clearRect(nx,ny,w,h);
			this.ContextDecoPin.clearRect(nx-this.blockSize/2,ny-this.blockSize/2,this.blockSize,this.blockSize);
		}


		if(layer != 'preview' && layer != 'eraser') // TODO: get wether the page is in editor mode (and then the pin is needed) or view mode (and it shouldn't even try to draw it)
		{
				// draw a 'pin'
				this.ContextDecoPin.beginPath();
				this.ContextDecoPin.fillStyle = 'red';
				this.ContextDecoPin.strokeStyle = 'red';
				this.ContextDecoPin.arc(nx,ny,this.blockSize/4,2*Math.PI,false);
				this.ContextDecoPin.fill();
				this.ContextDecoPin.lineTo(nx+4,ny+4);
				this.ContextDecoPin.stroke();
				this.ContextDecoPin.closePath();
		}

	}; // end drawDeco

	/** Draws a block in the playfield browser (that nifty thing from tages)

		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
		@param {string} type Define the color of the block to be drawn. Possible values: (SZLJTOIG)
		@param {string} RS Define the style of the block. Possible values: ARS, SRS, GB
		@param {number} id Define the id of the playfield in which the block is drawn
		@param {string} context Define on which layer the block will be drawn. Possible values: 'inactive', 'resetactive', 'active'
	*/
	this.drawBrowserBlock = function(x,y,type,RS,id,context){
		var color;
		switch(RS){
			case 'ARS':
				switch(type){
					case 'I':
						color = ARS.I.color;
						spriteOffset = ARS.I.offset;
						break;
					case 'T':
						color = ARS.T.color;
						spriteOffset = ARS.T.offset;
						break;
					case 'L':
						color = ARS.L.color;
						spriteOffset = ARS.L.offset;
						break;
					case 'J':
						color = ARS.J.color;
						spriteOffset = ARS.J.offset;
						break;
					case 'S':
						color = ARS.S.color;
						spriteOffset = ARS.S.offset;
						break;
					case 'Z':
						color = ARS.Z.color;
						spriteOffset = ARS.Z.offset;
						break;
					case 'O':
						color = ARS.O.color;
						spriteOffset = ARS.O.offset;
						break;
					case 'G':
						color = ARS.G.color;
						spriteOffset = ARS.G.offset;
						break;
				}
			break;
			case 'SRS':
				switch(type){
					case 'I':
						color = SRS.I.color;
						spriteOffset = SRS.I.offset;
						break;
					case 'T':
						color = SRS.T.color;
						spriteOffset = SRS.T.offset;
						break;
					case 'L':
						color = SRS.L.color;
						spriteOffset = SRS.L.offset;
						break;
					case 'J':
						color = SRS.J.color;
						spriteOffset = SRS.J.offset;
						break;
					case 'S':
						color = SRS.S.color;
						spriteOffset = SRS.S.offset;
						break;
					case 'Z':
						color = SRS.Z.color;
						spriteOffset = SRS.Z.offset;
						break;
					case 'O':
						color = SRS.O.color;
						spriteOffset = SRS.O.offset;
						break;
					case 'G':
						color = SRS.G.color;
						spriteOffset = SRS.G.offset;
						break;
				}
			break;
			case 'GB':
				switch(type){
					case 'I':
						color = GB.I.color;
						spriteOffset = GB.I.offset;
						break;
					case 'T':
						color = GB.T.color;
						spriteOffset = GB.T.offset;
						break;
					case 'L':
						color = GB.L.color;
						spriteOffset = GB.L.offset;
						break;
					case 'J':
						color = GB.J.color;
						spriteOffset = GB.J.offset;
						break;
					case 'S':
						color = GB.S.color;
						spriteOffset = GB.S.offset;
						break;
					case 'Z':
						color = GB.Z.color;
						spriteOffset = GB.Z.offset;
						break;
					case 'O':
						color = GB.O.color;
						spriteOffset = GB.O.offset;
						break;
					case 'G':
						color = GB.G.color;
						spriteOffset = GB.G.offset;
						break;
				}
			break;		
		}
		if (context == 'inactive')
		{
			if (type == 'E')
			{
				$('#pf-'+id+'-row-'+y+'-col-'+x+' .inactive').attr('style','background-color: transparent;');
			}
			else
			{
				$('#pf-'+id+'-row-'+y+'-col-'+x+' .inactive').attr('style','background-color: '+color+';');
			}
		}
		if (context == 'resetactive')
		{
			$('table div.active').attr('style','background-color: transparent;');
		}
		if (context == 'active')
		{
			$('#pf-'+id+'-row-'+y+'-col-'+x+' .active').attr('style','background-color: '+color+';');
		}

	};

	/** Method: drawBlock
		Draw one block on a given layer, relative to the origin and using a block-length as unit.

		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
		@param {string} type Define the color of the block to be drawn. Possible values: (SZLJTOIG)
		@param {string} RS Define the style of the block. Possible value: 'ARS, 'SRS'
		@param {string} context Define on which layer the block will be drawn. Possible value: 'inactive', 'preview', 'active','flash','nexthold','nextholdmini'
		@param {boolean} highlight Define wether to highlight the drawblock action or not.
	*/
	this.drawBlock = function(x,y,type,RS,context,highlight){
		if(type){
			var ctx;
			var mini = false; // 'mini' could just as well be called 'hey i'm drawing in the nexthold canvas !' but it's a bit long
			switch(context)
			{
				case 'inactive':
					ctx = this.ContextPF;
					break;
				case 'preview':
					ctx = this.ContextPreview;
					break;
				case 'active':
					ctx = this.ContextActive;
					break;
				case 'flash':
					ctx = this.ContextActive;
					break;
				case 'nexthold':
					ctx = this.ContextNextHold;
					break;
				case 'nextholdmini':
					ctx = this.ContextNextHold;
					mini = true;
					break;
			}
			ctx.beginPath();
			/*	rect need one point and two lengths to draw a rectangle.
				The first point is defined as [<origin x coordinate> + x*<block's size> ; <origin y coordinate> + y*<block's size>]
				The lengths are simply the block size.*/
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
			if (mini) {
				sprite = this.spritemini;
			}
			else{
				sprite = this.sprite;
			}
			switch(RS){
				case 'ARS':
					switch(type){
						case 'I':
							color = ARS.I.color;
							spriteOffset = ARS.I.offset;
							break;
						case 'T':
							color = ARS.T.color;
							spriteOffset = ARS.T.offset;
							break;
						case 'L':
							color = ARS.L.color;
							spriteOffset = ARS.L.offset;
							break;
						case 'J':
							color = ARS.J.color;
							spriteOffset = ARS.J.offset;
							break;
						case 'S':
							color = ARS.S.color;
							spriteOffset = ARS.S.offset;
							break;
						case 'Z':
							color = ARS.Z.color;
							spriteOffset = ARS.Z.offset;
							break;
						case 'O':
							color = ARS.O.color;
							spriteOffset = ARS.O.offset;
							break;
						case 'G':
							color = ARS.G.color;
							spriteOffset = ARS.G.offset;
							break;
							}
				break;
				case 'SRS':
					switch(type){
						case 'I':
							color = SRS.I.color;
							spriteOffset = SRS.I.offset;
							break;
						case 'T':
							color = SRS.T.color;
							spriteOffset = SRS.T.offset;
							break;
						case 'L':
							color = SRS.L.color;
							spriteOffset = SRS.L.offset;
							break;
						case 'J':
							color = SRS.J.color;
							spriteOffset = SRS.J.offset;
							break;
						case 'S':
							color = SRS.S.color;
							spriteOffset = SRS.S.offset;
							break;
						case 'Z':
							color = SRS.Z.color;
							spriteOffset = SRS.Z.offset;
							break;
						case 'O':
							color = SRS.O.color;
							spriteOffset = SRS.O.offset;
							break;
						case 'G':
							color = SRS.G.color;
							spriteOffset = SRS.G.offset;
							break;
					}
				break;
				case 'GB':
					switch(type){
						case 'I':
							color = GB.I.color;
							spriteOffset = GB.I.offset;
							break;
						case 'T':
							color = GB.T.color;
							spriteOffset = GB.T.offset;
							break;
						case 'L':
							color = GB.L.color;
							spriteOffset = GB.L.offset;
							break;
						case 'J':
							color = GB.J.color;
							spriteOffset = GB.J.offset;
							break;
						case 'S':
							color = GB.S.color;
							spriteOffset = GB.S.offset;
							break;
						case 'Z':
							color = GB.Z.color;
							spriteOffset = GB.Z.offset;
							break;
						case 'O':
							color = GB.O.color;
							spriteOffset = GB.O.offset;
							break;
						case 'G':
							color = GB.G.color;
							spriteOffset = GB.G.offset;
							break;
					}
				break;
			}

			if (context == 'flash')
			{
				if (RS == 'ARS')
				{
					color = ARS.Flash.color;
					spriteOffset = ARS.Flash.offset;
				}
				if (RS == 'SRS')
				{
					color = SRS.Flash.color;
					spriteOffset = SRS.Flash.offset;
				}
				if (RS == 'GB')
				{
					color = GB.Flash.color;
					spriteOffset = GB.Flash.offset;
				}


			}


			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
			if (sprite) {
				if (mini) {
					if (x >= 17){ // exception for the nexthold area so it looks good
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
				{ // normal draw
				ctx.drawImage(sprite, // original image
							  spriteOffset[0]*this.blockSize,spriteOffset[1]*this.blockSize, //coordinate on the original image
							  this.blockSize,this.blockSize, // size of the rectangle to will be cut
							  this.PFOriginX+((x)*this.blockSize),this.PFOriginY+((y)*this.blockSize), // destination coordinate
							  this.blockSize,this.blockSize); // destination size
				}
			}
		}
	};//end drawblock

	/** Highlight one block. Currently draw an expanding circle.

		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
	*/
	this.highlight = function(x,y){
		var coordx = this.PFOriginX+((x+0.5)*this.blockSize);
		var coordy = this.PFOriginY+((y+0.5)*this.blockSize);
		var counter = 20;
		function draw() {
			setTimeout(function() {
				var myReq = window.requestAnimationFrame(draw);

				if (counter > 0)
				{
					//myself.CanvasPreview.attr('width',myself.CanvasPreview.width());
					//console.log(x-counter);
					//console.log(counter);
					myself.ContextPreview.beginPath();
					myself.ContextPreview.strokeStyle = 'rgba(255,255,255,255)';
					myself.ContextPreview.globalCompositeOperation = 'destination-out';
					myself.ContextPreview.arc(coordx,coordy,counter+2,2*Math.PI,false);
					myself.ContextPreview.arc(coordx,coordy,counter+1,2*Math.PI,false);
					myself.ContextPreview.stroke();
					myself.ContextPreview.closePath();

					myself.ContextPreview.beginPath();
					myself.ContextPreview.arc(coordx,coordy,counter,2*Math.PI,false);
					myself.ContextPreview.globalCompositeOperation = 'source-over';
					myself.ContextPreview.strokeStyle = 'white';
					myself.ContextPreview.stroke();
					myself.ContextPreview.closePath();

										counter-=1;
				}
				else{
					myself.ContextPreview.beginPath();
					myself.ContextPreview.strokeStyle = 'rgba(255,255,255,255)';
					myself.ContextPreview.globalCompositeOperation = 'destination-out';
					myself.ContextPreview.arc(coordx,coordy,counter+2,2*Math.PI,false);
					myself.ContextPreview.arc(coordx,coordy,counter+1,2*Math.PI,false);
					myself.ContextPreview.stroke();
					myself.ContextPreview.closePath();
					//myself.CanvasPreview.attr('width',myself.CanvasPreview.width());
				window.cancelAnimationFrame(myReq);
				}

			}, 1000/60);
		}
		//draw();
	};
	/*
	this.highlight = function(x,y){
		console.log("in expand");

		var counter = 1;

		function draw() {
			setTimeout(function() {
				var myReq = window.requestAnimationFrame(draw);

				if ($('#highlight').width() < 300)
				{
					$('#highlight').width(counter);
					counter++;
				}
				else{
				window.cancelAnimationFrame(myReq)
				}

			}, 1000/60);
		}

		draw();
		//					this.ContextPreview.clearRect(x-counter,y-counter,counter,counter);
		//this.ContextPreview(x,y,counter,2*Math.PI,false);
	}*/

	/** Draw the joystick in rest position
	*/
	this.resetJoystick = function(){
		var height = this.CanvasControl.height();
		this.ContextControl.clearRect(0,0,height,height);
		this.drawJoystick('all','rest');
	};

	/** Draw the joystick

		@param {string} direction Define which joystick position to draw. Possible value: 'all', 'u', 'r', 'l', 'd', 'ul', 'ur', 'dl', 'dr'
		@param {string} state Define which color to draw. Possible value: 'rest', 'pressed' or 'holded'
	*/
	this.drawJoystick = function(direction,state){
		if (direction == 'all')
		{
			myself.drawJoystick('u','rest');
			myself.drawJoystick('r','rest');
			myself.drawJoystick('l','rest');
			myself.drawJoystick('d','rest');
			myself.drawJoystick('ul','rest');
			myself.drawJoystick('ur','rest');
			myself.drawJoystick('dl','rest');
			myself.drawJoystick('dr','rest');
		}
		else
		{
			switch(direction)
			{
				case 'u':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(this.CanvasControlheight/3, this.CanvasControlheight/3);
					this.ContextControl.lineTo(2*this.CanvasControlheight/3,this.CanvasControlheight/3);
					this.ContextControl.lineTo(this.CanvasControlheight/2,0);
					this.ContextControl.closePath();
					break;
				case 'r':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(2*this.CanvasControlheight/3, this.CanvasControlheight/3);
					this.ContextControl.lineTo(2*this.CanvasControlheight/3,2*this.CanvasControlheight/3);
					this.ContextControl.lineTo(this.CanvasControlheight,this.CanvasControlheight/2);
					this.ContextControl.closePath();
					break;
				case 'd':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(2*this.CanvasControlheight/3,2*this.CanvasControlheight/3);
					this.ContextControl.lineTo(this.CanvasControlheight/3,2*this.CanvasControlheight/3);
					this.ContextControl.lineTo(this.CanvasControlheight/2,this.CanvasControlheight);
					this.ContextControl.closePath();
					break;
				case 'l':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(this.CanvasControlheight/3,2*this.CanvasControlheight/3);
					this.ContextControl.lineTo(this.CanvasControlheight/3,this.CanvasControlheight/3);
					this.ContextControl.lineTo(0,this.CanvasControlheight/2);
					this.ContextControl.closePath();
					break;
				case 'ul':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(0+this.CanvasControlheight/8,0+this.CanvasControlheight/8);
					this.ContextControl.lineTo(this.CanvasControlheight/4+this.CanvasControlheight/8,0+this.CanvasControlheight/8);
					this.ContextControl.lineTo(0+this.CanvasControlheight/8,this.CanvasControlheight/4+this.CanvasControlheight/8);
					this.ContextControl.closePath();
					break;
				case 'ur':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(this.CanvasControlheight-this.CanvasControlheight/8,this.CanvasControlheight/8);
					this.ContextControl.lineTo(this.CanvasControlheight-this.CanvasControlheight/8,this.CanvasControlheight/4+this.CanvasControlheight/8);
					this.ContextControl.lineTo(this.CanvasControlheight-this.CanvasControlheight/4-this.CanvasControlheight/8,0+this.CanvasControlheight/8);
					this.ContextControl.closePath();
					break;
				case 'dr':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(this.CanvasControlheight-this.CanvasControlheight/8,this.CanvasControlheight-this.CanvasControlheight/8);
					this.ContextControl.lineTo(this.CanvasControlheight-this.CanvasControlheight/8,this.CanvasControlheight-this.CanvasControlheight/4-this.CanvasControlheight/8);
					this.ContextControl.lineTo(this.CanvasControlheight-this.CanvasControlheight/4-this.CanvasControlheight/8,this.CanvasControlheight-this.CanvasControlheight/8);
					this.ContextControl.closePath();
					break;
				case 'dl':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(0+this.CanvasControlheight/8,this.CanvasControlheight-this.CanvasControlheight/8);
					this.ContextControl.lineTo(0+this.CanvasControlheight/8,this.CanvasControlheight-this.CanvasControlheight/4-this.CanvasControlheight/8);
					this.ContextControl.lineTo(this.CanvasControlheight/4+this.CanvasControlheight/8,this.CanvasControlheight-this.CanvasControlheight/8);
					this.ContextControl.closePath();
					break;
			}

			switch(state){
				case 'rest':
					this.ContextControl.fillStyle = '#808080';
				break;
				case 'pressed':
					this.ContextControl.fillStyle = '#ff0000';
				break;
				case 'holded':
					this.ContextControl.fillStyle = '#ffa600';
				break;

			}

			this.ContextControl.fill();


		}

	};

	/** Draw all the button in a particular state

		@param {string} state Define in which color the buttos are drawn. Possible value: 'rest', 'pressed' or 'holded'
		@param {string} layout - (not used at the moment; TODO: allow alternative button layout)
	*/
	this.drawAllButtons = function(state,layout){
		this.drawButton('A',state);
		this.drawButton('B',state);
		this.drawButton('C',state);
		this.drawButton('D',state);

		//this.drawButton('E',state);
		//this.drawButton('F',state);
	};

	/** Draw a joystick button in a particular state.

		Parameters:
		@param {string} button Define which button to draw. Possible value: 'A', 'B', 'C', 'D' for now.
		@param {string} state Define in which color the button is drawn. Possible value: 'rest', 'pressed' or 'holded'.
	*/
	this.drawButton = function(button,state){
		var height = this.CanvasControl.height();
		var radius = height/5;

		this.ContextControl.textBaseline = 'middle';
		this.ContextControl.font = 'bold 10px sans-serif';

		this.ContextControl.beginPath();
		switch(button){
			case 'A':
				this.ContextControl.clearRect(height+height/4-radius-1,height/4-radius-1,2*radius+2,2*radius+2);
				this.ContextControl.arc(height+height/4,height/4,radius,0,2*Math.PI, false);
				break;
			case 'B':
				this.ContextControl.clearRect(height+height/4+2*radius+height/16-radius-1,height/4-radius-1,2*radius+2,2*radius+2);
				this.ContextControl.arc(height+height/4+2*radius+height/16,height/4,radius,0,2*Math.PI, false);
				break;
			case 'C':
				this.ContextControl.clearRect(height+height/4+4*radius+2*height/16-radius-1,height/4-radius-1,2*radius+2,2*radius+2);
				this.ContextControl.arc(height+height/4+4*radius+2*height/16,height/4,radius,0,2*Math.PI, false);
				break;
			case 'D':
				this.ContextControl.clearRect(height+height/4-radius-1, 3*height/4-radius-1,2*radius+2,2*radius+2);
				this.ContextControl.arc(height+height/4, 3*height/4,radius,0,2*Math.PI,false);
				break;
			/*
			case 'E':
				this.ContextControl.clearRect(height+height/4, 3*height/4,2*radius+1,2*radius+1);
				this.ContextControl.arc(height+height/4, 3*height/4,radius,0,2*Math.PI,false);
				break;
			case 'F':
				this.ContextControl.clearRect(height+height/4+4*radius+2*height/16,3*height/4,2*radius+1,2*radius+1);
				this.ContextControl.arc(height+height/4+4*radius+2*height/16,3*height/4,radius,0,2*Math.PI, false);
				break;
			*/
		}
		this.ContextControl.closePath();

		switch(state){
			case 'pressed':
				this.ContextControl.fillStyle = '#ff0000';
				break;
			case 'holded':
				this.ContextControl.fillStyle= '#ffa600';
				break;
			case 'rest':
				this.ContextControl.fillStyle= '#808080';
				break;
		}


		this.ContextControl.fill();

		switch(button){
			case 'A':
				this.ContextControl.fillStyle = '#000000';
				this.ContextControl.fillText('A',height+height/4-height/10, height/4+1);
				break;
			case 'B':
				this.ContextControl.fillStyle = '#000000';
				this.ContextControl.fillText('B',height+height/4+2*radius+height/16-height/10, height/4+1);
				break;
			case 'C':
				this.ContextControl.fillStyle = '#000000';
				this.ContextControl.fillText('C',height+height/4+4*radius+2*height/16-height/10 , height/4+1);
				break;
			case 'D':
				this.ContextControl.fillStyle = '#000000';
				this.ContextControl.fillText('H',height+height/4-height/10, 3*height/4+1); // so err yeah it's supposed to be dependent of the height of the canas... but it looks better 1 that +1 pixel nudge
				break;
		}

		/* TGM layout
		// A
		this.ContextControl.beginPath();
		this.ContextControl.arc(height+height/4,height/4,radius,0,2*Math.PI, false);
		this.ContextControl.closePath();
		this.ContextControl.fillStyle= "#808080";
		this.ContextControl.fill();
		this.ContextControl.fillStyle = "#000000";
		this.ContextControl.fillText("A",height+height/4-height/10, height/4+1);
		// B
		this.ContextControl.beginPath();
		this.ContextControl.arc(height+height/4+2*radius+height/16,height/4,radius,0,2*Math.PI, false);
		this.ContextControl.closePath();
		this.ContextControl.fillStyle= "#808080";
		this.ContextControl.fill();
		this.ContextControl.fillStyle = "#000000";
		this.ContextControl.fillText("B",height+height/4+2*radius+height/16-height/10, height/4+1);
		// C
		this.ContextControl.beginPath();
		this.ContextControl.arc(height+height/4+4*radius+2*height/16,height/4,radius,0,2*Math.PI, false);
		this.ContextControl.closePath();
		this.ContextControl.fillStyle= "#808080";
		this.ContextControl.fill();
		this.ContextControl.fillStyle = "#000000";
		this.ContextControl.fillText("C",height+height/4+4*radius+2*height/16-height/10 , height/4+1);
		// H
		this.ContextControl.beginPath();
		this.ContextControl.arc(height+height/4, 3*height/4,radius,0,2*Math.PI,false);
		this.ContextControl.closePath();
		this.ContextControl.fillStyle= "#808080";
		this.ContextControl.fill();
		this.ContextControl.fillStyle = "#000000";
		this.ContextControl.fillText("H",height+height/4-height/10, 3*height/4+1); // so err yeah it's supposed to be dependent of the height of the canas... but it looks better 1 that +1 pixel nudge
		*/
		// ccw character: ↺
		// cw caracter: ↻

	};

	/** Update the html part of the frame counter

		@param {number} cur Current frame number
		@param {number} tot Total frame number
	*/
	this.frameCount = function(cur,tot){

		$('#'+CanvasIDString+'-current-frame').attr('value',cur);
		$('#'+CanvasIDString+'-total-frame').html(tot);

	};

	/** Generate the browser thingy from tages. TODO: NOT WORKING AT THE MOMENT
		Also: WHY IS THIS ON THE MAIN FUMEN JS FILE AND NOT IN INTERFACE ??!

		@param {number} id Frame id
		@param {number} position where to draw (relative to the other playfields
	*/

	this.generateNewPreviewTable = function(id,position){

	// insert at position instead of append
		var output = '';
		// TODO
		// Okay I don't know why $('.preview-table').click() won't respond, so I use this instead. It's ugly and I know it :( .
		var code1 = '$(this).parent().addClass("pressed");';
		var code2 = 'console.log("fooooo")';
		// onclick="'+code1+'" ondblclick="'+code2+'"
		output += '<td "id="preview-block-'+this.IDString+'-'+id+'" class="preview-block"><table onclick="'+code1+'" ondblclick="'+code2+'" class="preview-table" id="'+this.IDString+'-'+id+'">';
		for(var i=0;i<20;i++)
		{
			output += '<tr class="preview-row" id="'+this.IDString+'-'+id+'-row-'+i+'">';
			for(var j=0;j<10;j++)
			{
				output += '<td class="preview-cell" id="'+this.IDString+'-'+id+'-row-'+i+'-col-'+j+'"><div class="active"><div class="inactive"></div></div></td>';
			}

		}

		output +='</table><!--'+GLOBAL_FRAME_COUNTER+' --> <input type="checkbox" class="select"> <input type="button" value="✕" class="delete actions-button" /> </div></td>';

		if (position)
		{
			$('#browser #preview-container > td:nth-child('+parseInt(position+1,10)+')').before(output);
		}
		else // insert nth child here !!!!
		{
			$('#browser #preview-container > td:nth-child('+parseInt(position+1,10)+')').before(output);
		}

	};

	/** Delete a browser playfield table. TODO: NOT WORKING AT THE MOMENT

		@param {number} id Frame id
		@param {number} position
	*/
	this.deletePreviewTable = function(id,position){
		//console.log(id);
		//console.log('position: '+position);
		//$('#browser #preview-container > td:nth-child('+parseInt(position+1)+')').remove();
		$('#browser #preview-container > td:nth-child('+parseInt(position+1,10)+')').remove();
	};

} // end painter -------------------------------------------------------------------------------


/** Painter

	Diagram stores <frame>s and manipulate them. It receives command from the html and gives order
	to the underlying frame or directly to the painter. It acts a bit like a model in a MVC model.

	<pre>
	>                       +---------------------+
	>                       V                     |
	>    Canvas/html <-- Painter <-- Frame <-- Diagram
	>           |                              ^^^^^^^
	>           |                               ^
	>           +-------------------------------+
	</pre>

	@class
	@param Painter A reference to its associated painter.
	@requires Frame
	@requires Painter

*/
function Diagram(painter){
	/** A variable referencing the class, used to exploit closure stuff in other methods*/
	var myself = this;
	/** A reference to the diagram's associated painter*/
	this.painter = painter;
	/** An array containing Frames.*/
	this.frames = [];
	/** A integer  that represent the current working frame*/
	this.current_frame = 0;
	/** A boolean that tells if the current frame is playing or not when the play/pause button is pressed */
	this.playing = false;

	/** Initialize the frames array.
	*/
	this.init = function(){
		// Draws the initial playfield (essentially a blank playfield)
		this.frames.push(new Frame(this.painter));
		//this.frames[0].clear();
		// var myself = this;
		// setTimeout(function(){myself.clear2()},1000) //<- this works, closure ftw !
		this.painter.generateNewPreviewTable(this.frames[this.current_frame].id,this.current_frame);
	};

	/* ---------------- */
	/* -- Management -- */
	/* ---------------- */

	/** Adds a new frame after the current one and displays it.
		<pre>
		>    [Sophie] {Elisa} [Therese] [Claire]
		>                    ^
		>                [Jeanne]
		>    =>
		>    Sophie Elisa Jeanne Therese Claire
		</pre>
	*/
	this.new_frame = function(){
		this.current_frame++;
		this.painter.eraseLayer('all');
		this.frames.splice(this.current_frame,0,new Frame(this.painter)); //inject a new frame after the current frame (modify at position current_frame, remove nothing, add new frame)
		//this.painter.generateNewPreviewTable(this.frames[this.current_frame].id,this.current_frame);
		this.update_framecount();
	};

	/** Makes a new frame based on the current frame
	*/
	this.new_copy_frame = function(){
		//this.frames.push(jQuery.extend(true, {}, this.frames[this.current_frame])) // deep copy the current frame
		var saved_frame = this.frames[this.current_frame].print();
		this.new_frame();
		this.frames[this.current_frame].load(saved_frame,'blank');
	};

	/** Remove the current frame from existence
	*/
	this.remove_current_frame = function(){
		if(this.frames.length > 1 )
		{
			if(this.current_frame-1 >= 0) // if the current frame is not the first one
			{
				this.current_frame--;  // redirect the current frame to the preceding one. Note that is deleting backwards (like the backspace key)... some may prefer a forward delete (like the del key)
				//this.painter.deletePreviewTable([this.current_frame].id,this.current_frame+1);
				this.frames.splice(this.current_frame+1,1);
				this.painter.eraseLayer('all');
				this.frames[this.current_frame].draw();
			}
			else
			{
				//this.painter.deletePreviewTable(this.frames[this.current_frame].id,this.current_frame);
				this.frames.splice(this.current_frame,1);
				this.painter.eraseLayer('all');
				this.frames[this.current_frame].draw();
			}

		}
		else
		{
			this.current_frame = 0;
			this.frames[this.current_frame].clear('all');
		}
	};

	/** Remove every frame after the current one. Analogous to 'remove following' in fumen.
	*/
	this.remove_following_frames = function(){
		//console.log('in');
		this.frames.splice(this.current_frame+1);
		this.frames[this.current_frame].draw();
		//console.log('out');

	/* TODO PRIORITY NOT FUNCTIONAL FOR NOW
		var i = this.current_frame;
		this.current_frame = this.frames.length;
		while(this.current_frame > i)
		{
			this.remove_current_frame();
		}
		this.frames[this.current_frame].draw();
		this.update_framecount();
		//this.frames.splice(this.current_frame+1); // this... doesn't work well with the previews
		this.update_framecount();
	*/
	};

	/** Nukes everything !
	*/
	this.remove_all_playfields = function(){
		this.current_frame = this.frames.length;
		while(this.current_frame > 0)
		{
			this.remove_current_frame();
		}
		this.frames[0].clear('all');
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	// DEPRECATED, keep this in case I brake something hard (the other design let me use removePreviewTable)(and no, no destructor in javascript)
	this.remove_all_playfields2 = function(){
		this.frames.splice(1);
		this.frames[0].clear('all');
		this.current_frame = 0;
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/* ---------------- */
	/* -- Navigation -- */
	/* ---------------- */

	/** Erase everything, paint what's on the given frame number

		@param {number} frame_number Indicate
	*/
	this.goto_frame = function(frame_number){
		this.painter.eraseLayer('all');
		this.current_frame = frame_number;
		if(frame_number == 0) // assumption: only the first frame hold the border information
		{
			this.frames[this.current_frame].draw();
		}
		else{
			var exception = { border: true};
			this.frames[this.current_frame].draw(exception);
		}
		
		
		this.update_framecount();
	};

	/** Switches the current frame to the first one, displays it.
	*/
	this.first_frame = function(){
		this.painter.eraseLayer('all');
		this.current_frame = 0;
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/** Switches the previous frame to the previous one, displays it.
	*/
	this.previous_frame = function(){
		if(this.current_frame > 0)
		{
			this.painter.eraseLayer('all');
			this.current_frame--,
			this.frames[this.current_frame].draw();
			this.update_framecount();
		}
	};

	/** Switches the current frame to the next one, displays it.
	*/
	this.next_frame = function(){
		this.painter.eraseLayer('all');
		this.current_frame++,
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/** Switches the current frame to the last one, displays it.
	*/
	this.last_frame = function(){
		this.painter.eraseLayer('all');
		this.current_frame = parseInt(this.frames.length-1,0); // http://nicolaasmatthijs.blogspot.com/2009/05/missing-radix-parameter.html
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/** Update the displayed frame index.
	*/
	this.update_framecount = function(){
		this.painter.frameCount(this.current_frame+1, this.frames.length);
		this.painter.drawProgressbar(this.current_frame+1,this.frames.length);
	};

	/* ------------------------- */
	/* -- Save/Load and stuff -- */
	/* ------------------------- */

	/** Print the diagram

		@return {string} A string encoded in TeDiGe format*/
	this.print = function(){
		var output = '';
		output += this.frames[0].print();
		if (this.frames.length) {
			for(var i = 1, istop = this.frames.length; i < istop; i++) {
				output += '+';
				output += this.print_differences(i,i-1);
			}
		}
		return output;
	};// end print


	/** Return the differences between two frames in a formatted string. WARNING: if you modify
		that, please also modify Frame.print

		@param {number} reference_frame Reference frame number
		@param {number} final_frame Final frame number

		@return {string} A string encoded in TeDiGe format
	*/
	this.print_differences = function(final_frame,reference_frame){
		var output = '';
		var tmp ='';

		// ## Active piece
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
				output += 'A~'+this.frames[final_frame].activePieceType;
				tmp = alphanumconvert(this.frames[final_frame].activePiecePositionX);
				output += tmp;
				tmp = alphanumconvert(this.frames[final_frame].activePiecePositionY);
				output += tmp+this.frames[final_frame].activePieceOrientation+'_';
				tmp = '';
			}
			else
			{
				// E = empty
				output += 'A~E_';
			}		
		}

		// ## Inactive blocks & deco
		//same principle as in frame.print(): iterate overy the 2D array, make a list of type check against it
		var candidate_case = [];
		var first_candidate = true;
		var newly_added = false;

		// ## Decoration layer - same thing
		var candidate_case_deco = [];
		var first_candidate_deco = true;
		var newly_added_deco = false;


		for(var i=0; i<10; i++){
			for(var j=0; j<20; j++){
				if(this.frames[final_frame].playfield[i][j][0] != this.frames[reference_frame].playfield[i][j][0])
				{
					if(first_candidate) // is this the very first case we study ?
					{
						if(this.frames[final_frame].playfield[i][j][0]) // is the new case is an empty one ?
						{
							candidate_case.push([]);
							candidate_case[0].val = this.frames[final_frame].playfield[i][j][0];
							candidate_case[0].push(alphanumconvert(i)+alphanumconvert(j));
							first_candidate = false;
						}
						else
						{
							candidate_case.push([]);
							candidate_case[0].val = '';
							candidate_case[0].push(alphanumconvert(i)+alphanumconvert(j));
							first_candidate = false;

						}
					}
					else
					{
						for(var k=0, kstop = candidate_case.length; k<kstop; k++)
						{
							if(this.frames[final_frame].playfield[i][j][0] == candidate_case[k].val) // does the case type exists in the candidate list ?
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
								candidate_case[parseFloat(k+1)].val = this.frames[final_frame].playfield[i][j][0];
								candidate_case[parseFloat(k+1)].push(alphanumconvert(i)+alphanumconvert(j));
								newly_added = true;
							}

						}

					}
				}

				// decoration

				if(this.frames[final_frame].playfield[i][j][1] != this.frames[reference_frame].playfield[i][j][1])
				{
					if(first_candidate_deco) // is this the very first case we study ?
					{
						if(this.frames[final_frame].playfield[i][j][1]) // is the new case is an empty one ?
						{
							candidate_case_deco.push([]);
							candidate_case_deco[0].val = this.frames[final_frame].playfield[i][j][1];
							candidate_case_deco[0].push(alphanumconvert(i)+alphanumconvert(j));
							first_candidate_deco = false;
						}
						else
						{
							candidate_case_deco.push([]);
							candidate_case_deco[0].val = '';
							candidate_case_deco[0].push(alphanumconvert(i)+alphanumconvert(j));
							first_candidate_deco = false;

						}
					}
					else
					{
						for(var k=0, kstop = candidate_case_deco.length; k<kstop; k++)
						{
							if(this.frames[final_frame].playfield[i][j][1] == candidate_case_deco[k].val) // does the case type exists in the candidate list ?
							{
								// yes
								if(newly_added_deco) // is it the very first of its kind ?
								{
									// yes, do nothing
									newly_added_deco = false;
								}
								else
								{
									// no, add it to the list
									candidate_case_deco[k].push(alphanumconvert(i)+alphanumconvert(j));
									break; // <- that break is quite important otherwise it continues forward, leading to nasty side effect
								}
							}
							else if( k == parseFloat(candidate_case_deco.length-1)) // Still no. Was it the last type tested ?
							{
								// Yes -> create a new type
								candidate_case_deco.push([]);
								candidate_case_deco[parseFloat(k+1)].val = this.frames[final_frame].playfield[i][j][1];
								candidate_case_deco[parseFloat(k+1)].push(alphanumconvert(i)+alphanumconvert(j));
								newly_added_deco = true;
							}

						}

					}
				}


			} //end for
		} // end for

		if(candidate_case) // if there something in the inactive state layer, iterate it's content
		{
			output += 'I';
			tmp = '';
			for(var i=0, istop = candidate_case.length; i<istop; i++){
				tmp += '~';
				if(candidate_case[i].val)
				{
					tmp += candidate_case[i].val;
				}
				else
				{
					tmp += 'E';
				}
				for(var j=0, jstop = candidate_case[i].length; j<jstop; j++){
					tmp += candidate_case[i][j];
				}
			}
			output += tmp+'_';
		}

		if(candidate_case_deco)
		{
			output += 'D';
			tmp = '';
			for(var i=0, istop = candidate_case_deco.length; i<istop; i++){
				tmp += '~';
				if(candidate_case_deco[i].val)
				{
					tmp += candidate_case_deco[i].val+'*';
				}
				else
				{
					tmp += 'E*';
				}
				for(var j=0, jstop = candidate_case_deco[i].length; j<jstop; j++){
					tmp += candidate_case_deco[i][j];
				}
			}
			output += tmp+'_';
		}

		tmp = '';

		// ## rotation system
		if(this.frames[final_frame].RS != this.frames[reference_frame].RS)
		{
		  output += 'R~'+this.frames[final_frame].RS+'_';
		}
		// ## piece opacity
		if(this.frames[final_frame].activePieceOpacity != this.frames[reference_frame].activePieceOpacity)
		{
			output +='O~'+this.frames[final_frame].activePieceOpacity+'_';
		}
		// ## piece whiteborder
		if(this.frames[final_frame].whiteborder != this.frames[reference_frame].whiteborder)
		{
			if(this.frames[final_frame].whiteborder)
			{
				output +='W~1_';
			}
			else
			{
				output +='W~0_';
			}

		}
		// ## border
		if(this.frames[final_frame].border != this.frames[reference_frame].border)
		{
		  output += 'B~'+this.frames[final_frame].border+'_';
		}


		if(this.frames[final_frame].duration != this.frames[reference_frame].duration)
		{
			output += 'T~'+parseInt(this.frames[final_frame].duration,10)+'_';
			}

		// ## joystick
		if(this.frames[final_frame].joystick_direction != this.frames[reference_frame].joystick_direction ||
		   this.frames[final_frame].joystick_state != this.frames[reference_frame].joystick_state)
		{
			switch(this.frames[final_frame].joystick_state)
			{
				case 'rest':
					tmp += 'r';
					break;
				case 'pressed':
					tmp += 'p';
					break;
				case 'holded':
					tmp += 'h';
					break;
			}
			switch(this.frames[final_frame].joystick_direction)
			{
				case 'u':
					tmp += '8';
					break;
				case 'r':
					tmp += '6';
					break;
				case 'd':
					tmp += '2';
					break;
				case 'l':
					tmp += '4';
					break;
				case 'c':
					tmp += '5';
					break;
				case 'ul':
					tmp += '7';
					break;
				case 'ur':
					tmp += '9';
					break;
				case 'dr':
					tmp += '3';
					break;
				case 'dl':
					tmp += '1';
					break;
			}
			output += 'J~'+tmp+'_';
			tmp = '';
		}

		// ## buttons
		if (!this.frames[final_frame].button_state.compare(this.frames[reference_frame].button_state)) // see Array.prototype.compare
		{
			for(var i=0, istop = this.frames[final_frame].button_state.length;i<istop;i++)
			{
				switch(this.frames[final_frame].button_state[i])
				{
					case 'rest':
						tmp += 'r';
						break;
					case 'pressed':
						tmp += 'p';
						break;
					case 'holded':
						tmp += 'h';
						break;
				}
			}
			output += 'C~'+tmp+'_';
			tmp ='';
		}

		// ## nexthold
		if (!this.frames[final_frame].nexthold.compare(this.frames[reference_frame].nexthold))
		{
			for(var i=0, istop = this.frames[final_frame].nexthold.length;i<istop;i++)
			{
				if(this.frames[final_frame].nexthold[i])
				{
					tmp += this.frames[final_frame].nexthold[i];
				}
				else
				{
					tmp += 0;
				}
			}
			output += 'N~'+tmp+'_';
			tmp = '';
		}

		// ## comment
		if(this.frames[final_frame].comment.localeCompare(this.frames[reference_frame].comment) !== 0)
		{
			output += 'S~'+this.frames[final_frame].comment;
		}



		return output;

	};// end print_differences

	/** Load the encoded string given in parameter into the diagram

		@param {string} str A string encoded with the format described below
	*/

	this.load = function(str){
		if(!str){return;} // check if there's nothing
		this.remove_all_playfields();
		this.current_frame = 0;
		this.update_framecount();
		var stringframe = str.split('+');

		this.frames[0].load(stringframe[0],'blank'); // load the first frame
		for(var i = 1, istop = stringframe.length; i < istop; i++) { // load the subsequent frame, if they exist
			this.new_copy_frame();
			this.frames[i].load(stringframe[i],'differences'); // load the first frame
		}
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

} // end Diagram -------------------------------------------------------------------------------

/** Global counter, used to give and unique ID the the frames*/
var GLOBAL_FRAME_COUNTER = 0;

/** Frame

	Frame stores the playfield, the active piece and everything needed to describe a single frame
	of the game.

	It receives command from Diagram and calls painter to update the display.

	<pre>
	>                       +---------------------+
	>                       V                     |
	>    Canvas/html <-- Painter <-- Frame <-- Diagram
	>           |                    ^^^^^      ^
	>           |                               |
	>           +-------------------------------+
	</pre>

	@class
	@param Painter A reference to its associated painter.
	@requires Painter
*/
function Frame(painter){
	GLOBAL_FRAME_COUNTER++;
	/** A variable referencing the class, used to exploit closure stuff in other methods*/
	var myself = this;
	this.sself = this;
	/** An unique ID*/
	this.id = GLOBAL_FRAME_COUNTER;

	/** A referece to the associated painter*/
	this.painter = painter;

	/** Height of the playfield*/
	this.height = 20;

	/** Width of the playfield*/
	this.width = 10;

	/** Rotation system of the playfield. Possible value: 'ARS','SRS'*/
	this.RS = 'ARS';

	/** Border style. Possible value: 'Master','Death','Easy'*/
	this.border = 'Master';

	/** Boolean that represent wether the whiteborder should be drawn or not*/
	this.whiteborder = false;

	/** 3 Dimensional playfield array*/
	this.playfield = [];// Initialization of the playfield table; first coord = x; second = y;

	/** Active piece type. Possible value: SZLJTOIG*/
	this.activePieceType = '';

	/** Active piece orientation. Possible value: i cw ccw u*/
	this.activePieceOrientation = '';

	/** Active piece X coordinate*/
	this.activePiecePositionX = '';

	/** Active piece Y coordinate*/
	this.activePiecePositionY = '';

	/** Number between 0 and 1*/
	this.activePieceOpacity = 1.0;

	/** Frame duration in frame (=1/60s)*/
	this.duration = 15;

	/** Array containing the holded, next1, next2 and next3 pieces. Possible value: SZLJTOIG */
	this.nexthold = ['','','',''];

	/** String that represent the joystick direction. Possible value: u, r, l, d, ul, ur, dl, dr*/
	this.joystick_direction = 'c';

	/** String that represent the joystick state. Possible value: 'rest', 'holded', 'pressed'*/
	this.joystick_state = 'rest';

	/** Array containing  the button state. Possible value: 'rest', 'holded', 'pressed'*/
	this.button_state = ['rest','rest','rest','rest','rest','rest'];

	/** String containing the user comment*/
	this.comment = '';


	// initialization of the frame. Should I make a method instead ?
		for(var oi=0, oistop = this.width; oi<oistop; oi++){
			this.playfield.push(new Array(this.height));
				for(var oj=0, ojstop = this.height; oj<ojstop; oj++){
					this.playfield[oi][oj] = new Array(1);
					this.playfield[oi][oj][0] = '';
					this.playfield[oi][oj][1] = '';
					// so we have 3 dimensions:
					// x: horizontal
					// y: vertical
					// z:	0 = content
					// 		1 = decoration
				}
			}

	/* ------------- */
	/* -- Utility -- */
	/* ------------- */

	/** Check whether a pair of coordinate is in the tetrion or not.

		@param {number} x X position, in block unit
		@param {number} y Y position, in block unit

		@return {bolean} Return a boolean that tells if the coordinate is in the playfield (true) or not (false)
	*/
	this.is_in = function(x,y){
		if(x < 0 ||y < 0 || x>=this.width || y>=this.height)
			{return false;}
		return true;
	};

	/** Return the block's type at the designated coordinate

		@param {number} x X position, in block unit
		@param {number} y Y position, in block unit

		@return {string} Block type at the designated coordinate
	*/
	this.lookup = function(x,y){
		return this.playfield[x][y][0];
	};

	/** Checks if a given piece would still be in the playfield

		Parameter:
		@param {number} x X position, in block unit
		@param {number} y Y position, in block unit
		@param {string} type Piece type. Possible value: SZLJTOIG
		@param {string} orientation Piece orientation. Possible value:  i cw ccw u

		@return {boolean}
	*/
	this.piece_is_in = function(x,y,type,orientation){
		var matrix = getMatrix(type, orientation, this.RS);
		if(orientation == 'singleton' && this.is_in(parseInt(x,10),parseInt(y,10)))
		{
			return true;
		}
		else
		{
			var counter = 0;
				for(var i = 0; i < 4; i++) {
					for(var j = 0; j < 4; j++) {
						if (matrix[i][j] && this.is_in(parseInt(x-1+j,10),parseInt(y-1+i,10))) {
							counter++;
						}
					}
				}
			if (counter == 4) {
				return true;
			}
			return false;
		}
	};

	/* ------------------------- */
	/* -- Save/Load and stuff -- */
	/* ------------------------- */

	/** Draws everything according to what's in memory.

		@param {string} exception An object containing a list of thing to be force-redrawed (because normally it shouldn't be) (todo:  ?? NOT IMPLEMENTED YET)
	*/
	this.draw = function(exception){
		for(var i = 0, istop = this.width; i < istop; i++) {
			for(var j = 0, jstop = this.height; j < jstop; j++) {
				if (this.playfield[i][j][0]) {
					this.painter.drawBlock(i,j,this.playfield[i][j][0],this.RS,'inactive');
				}
				if (this.playfield[i][j][1]) {
					this.painter.drawDeco(i,j,this.playfield[i][j][1],'decoration');
				}
			}
		}
		if (this.activePieceType){
			var matrix = getMatrix(this.activePieceType, this.activePieceOrientation, this.RS);
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j])
					{
						this.painter.drawBlock(parseInt(this.activePiecePositionX-1+j,10),parseInt(this.activePiecePositionY-1+i,10),this.activePieceType,this.RS,'active');
							if(this.activePieceOpacity == 'Flash')
							{
								this.painter.drawBlock(parseInt(this.activePiecePositionX-1+j,10),parseInt(this.activePiecePositionY-1+i,10),this.activePieceType,this.RS,'flash');
							}
					}
				}
			}
		}

		for(var i=0, istop = this.nexthold.length;i<istop;i++)
		{
			this.painter.drawNextHold(i,this.nexthold[i],this.RS);
		}

		if (!(exception && exception['border'])) // // http://stackoverflow.com/questions/6075458/performance-differences-between-jquery-inarray-vs-object-hasownproperty
		{
			this.painter.drawBorder(this.border);
		}
		if (!(exception && exception['joystick']))
		{
			this.painter.resetJoystick();
			this.painter.drawJoystick(this.joystick_direction,this.joystick_state);
		}
		if (!(exception && exception['buttons']))
		{
			this.painter.drawButton('A',this.button_state[0]);
			this.painter.drawButton('B',this.button_state[1]);
			this.painter.drawButton('C',this.button_state[2]);
			this.painter.drawButton('D',this.button_state[3]);
		}

		this.painter.drawComment(this.comment);

		this.painter.drawDuration(this.duration); // TODO: this has nothing to do in normal load, only in editor mode !!
		this.painter.drawOpacity(this.activePieceOpacity); // ditto

		this.painter.changeActiveOpacity(this.activePieceOpacity);
		
		this.painter.eraseLayer('whiteborder');
		if (this.whiteborder)
		{
			this.painter.drawWhiteBorder(this.playfield);
		}

	};//end draw

	/** Print a string that describe the playfield.
		WARNING: if you modify that, please also modify diagram.printdifference

		@param {string} exception An object containing a list of things of facultative or over-repetitive element (like RS)(todo:  ?? NOT IMPLEMENTED YET)
	*/
	this.print = function(){
		var output= '';
		var tmp ='';

		// ## Active piece: get the right propriety, put it in the output fame. Nothing too hard
		if(this.activePieceType)
		{
			output += 'A~'+this.activePieceType;
			tmp = alphanumconvert(this.activePiecePositionX);
			output += tmp;
			tmp = alphanumconvert(this.activePiecePositionY);
			output += tmp+this.activePieceOrientation+'_';
			tmp = '';
		}

		// ##  Rotation System: trivial
		if(this.RS != 'ARS') // TODO: make so that the first frame define the following frame 'till a change in RS occurs
		{
			output += 'R~'+this.RS+'_';
		}


		// ##  Opacity: trivial
		if(this.activePieceOpacity !=  1.0)
		{
			output += 'O~'+this.activePieceOpacity+'_';
		}


		// ##  border: ditto
		if(this.border != 'Master')
		{
			output += 'B~'+this.border+'_';
		}


		// ## duration
		if(this.duration != 15)
		{
			output += 'T~'+this.duration+'_';
		}

		// ##  joystick
		switch(this.joystick_state) // compression based on a keyboard numerical keyboard
		{
			case 'rest':
				tmp += 'r';
				break;
			case 'pressed':
				tmp += 'p';
				break;
			case 'holded':
				tmp += 'h';
				break;
		}

		switch(this.joystick_direction) // let's compress a bit the information (because 'pressed' takes 7 caracters and 'p' only one !
		{
			case 'u':
				tmp += '8';
				break;
			case 'r':
				tmp += '6';
				break;
			case 'd':
				tmp += '2';
				break;
			case 'l':
				tmp += '4';
				break;
			case 'c':
				tmp += '5';
				break;
			case 'ul':
				tmp += '7';
				break;
			case 'ur':
				tmp += '9';
				break;
			case 'dr':
				tmp += '3';
				break;
			case 'dl':
				tmp += '1';
				break;
		}

		output += 'J~'+tmp+'_';
		tmp = '';

		// ##  buttons
		for(var i=0, istop = this.button_state.length;i<istop;i++)
		{
		  switch(this.button_state[i])
		  {
			case 'rest':
				tmp += 'r';
				break;
			case 'pressed':
				tmp += 'p';
				break;
			case 'holded':
				tmp += 'h';
				break;
		  }
		}

		output += 'C~'+tmp+'_';
		tmp = '';

		if (this.comment) // comment / remark / string
		{
		  output += 'S~'+this.comment+'_';
		}

		// ## whiteborder

		if(this.whiteborder)
		{
			output += 'W~1_';
		}


		// ## nexthold
		if (this.nexthold.length)
		{
			for(var i=0, istop = this.nexthold.length;i<istop;i++)
			{
				if(this.nexthold[i])
				{
					tmp += this.nexthold[i];
				}
				else
				{
					tmp += 0;
				}

			}
			output += 'N~'+tmp+'_';
			tmp = '';
		}



		// ##  Inactive layer: that's harder to code !
		// First let's define some variable.
		var candidate_case = []; // A two dimensionnal array containing the type and all the position of a given type ('there is an S in [2,6][7,6][1,4], a T in [5,12][7,7][1,17], etc..')
		var candidate_case_deco = [];

		var first_candidate = true;
		// We iterate over each case looking for content.
		// If there's something, we look if the type is already registred on the list of candidate.
		// If it is, we add another position under the given type
		// If not, we add a brand new type on the list
		var first_candidate_deco = true;
		for(var i=0; i<10; i++)
		{
			for(var j=0; j<20; j++)
			{
				if(this.playfield[i][j][0])
				{
					if(first_candidate) // is this the very first case we study ?
					{
						candidate_case.push([]);
						candidate_case[0].val = this.playfield[i][j][0];
						candidate_case[0].push(alphanumconvert(i)+alphanumconvert(j));
						first_candidate = false;
					}
					else // not the first case
					{

						for(var k=0, kstop = candidate_case.length; k<kstop; k++)
						{
							if(this.playfield[i][j][0] == candidate_case[k].val) // does the type exists on the candidate list ?
							{
									//Yup, add it to the list
									candidate_case[k].push(alphanumconvert(i)+alphanumconvert(j));
									break; // <- that break is quite important otherwise it would continues forward, leading to nasty side effect
							}
							else if( k == parseFloat(candidate_case.length-1)) // Nope. Was it the last type tested ?
							{
								// Yes -> create a new type
								candidate_case.push([]);
								candidate_case[parseFloat(k+1)].val = this.playfield[i][j][0];
								candidate_case[parseFloat(k+1)].push(alphanumconvert(i)+alphanumconvert(j));
							}

						}
					}
				}

				// let's do the exact same thing for the decorations
				if(this.playfield[i][j][1])
				{
					if(first_candidate_deco)
					{
						candidate_case_deco.push([]);
						candidate_case_deco[0].val = this.playfield[i][j][1];
						candidate_case_deco[0].push(alphanumconvert(i)+alphanumconvert(j));
						first_candidate_deco = false;
					}
					else // not the first case
					{

						for(var k=0, kstop = candidate_case_deco.length; k<kstop; k++)
						{
							if(this.playfield[i][j][1] == candidate_case_deco[k].val) // does the type exists on the candidate list ?
							{
									//Yup, add it to the list
									candidate_case_deco[k].push(alphanumconvert(i)+alphanumconvert(j));
									break; // <- that break is quite important otherwise it would continues forward, leading to nasty side effect
							}
							else if( k == parseFloat(candidate_case_deco.length-1)) // Nope. Was it the last type tested ?
							{
								// Yes -> create a new type
								candidate_case_deco.push([]);
								candidate_case_deco[parseFloat(k+1)].val = this.playfield[i][j][1];
								candidate_case_deco[parseFloat(k+1)].push(alphanumconvert(i)+alphanumconvert(j));
							}

						}
					}
				}

			}
		}

		// the candidate_case array is now finished
		if(candidate_case.length) // is there something in the candidate array ? if yes iterate its content
		{
			output += 'I~'; // type identifier ('the string will now describe the inactive cases')
			for(var i=0, istop = candidate_case.length; i<istop; i++){
				tmp += candidate_case[i].val; //put the type
				for(var j=0, jstop = candidate_case[i].length; j<jstop; j++){
					tmp += candidate_case[i][j]; //and then the positions (candidate_case[i][j] already contains the position duplet)
				}
				if(i < candidate_case.length-1)
				{
					tmp += '~'; // if it's not the last piece type, add a tilda separator
				}
			}
			output += tmp+'_';
		}
		tmp = '';

		// again, same thing with the decoration layer
		if(candidate_case_deco.length)
		{
			output += 'D~';
			for(var i=0, istop = candidate_case_deco.length; i<istop; i++){
				tmp += candidate_case_deco[i].val+'*';
				for(var j=0, jstop = candidate_case_deco[i].length; j<jstop; j++){
					tmp += candidate_case_deco[i][j];
				}
				if(i < candidate_case_deco.length-1)
				{
					tmp += '~';
				}
			}
			output += tmp+'_';
		}
		tmp = '';


		// finished !
		//console.log(output);
		return output;

	}; // end print

	/** Load the playfield from a descriptive string.

		@param {string} str The descriptive string
		@param {strong} format Possible value: '' or 'differences'
	*/
	this.load = function(str, format){
		if(format != 'differences')
		{
			this.clear('all'); // first erase everything
		}
		/* Example

		A~Iigh_I~Taababbcagihihjii~Zai~Jde~Sdgefegff_

		Algorithm
		- make an array out of the 1st level marker '_'
		- make an array out of the 2nd level marker '~'
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
			var properties = str.split('_');

		for(var i=0, istop = properties.length; i<istop; i++){
			var subproperties = properties[i].split('~');
				switch(subproperties[0])
				{
				case 'A': // active piece
						if(subproperties[1].charAt(0) !== 'E')
						{
							this.activePieceType = subproperties[1].charAt(0);
							this.activePieceOrientation = subproperties[1].slice(3);
							this.activePiecePositionX = alphanumconvert(subproperties[1].charAt(1));
							this.activePiecePositionY = alphanumconvert(subproperties[1].charAt(2));
						}
						else
						{
							this.activePieceType = '';
							this.activePieceOrientation = '';
							this.activePiecePositionX = '';
							this.activePiecePositionY = '';
						}
						
					break;

				case 'I': // inactive piece
					for(var j=1, jstop = subproperties.length; j<jstop; j++){
						var type = subproperties[j].charAt(0); // first char
						if(type == 'E') // check we have an 'empty' character ('E')
						{
							type = ''; // modify type so it is now '' (empty string)
						}
							for(var k=1, kstop = subproperties[j].length; k<kstop; k+=2){
								var inact_x = subproperties[j].charAt(k);
								var inact_y = subproperties[j].charAt(k+1);
								this.modify(alphanumconvert(inact_x),alphanumconvert(inact_y),type);
								// if (type) {
									// this.painter.drawBlock(alphanumconvert(inact_x),alphanumconvert(inact_y),type,this.RS,'inactive');
								// }
								// else
								// {
									// this.painter.eraseBlock(alphanumconvert(inact_x),alphanumconvert(inact_y));
								// }
							}
					}
					break;

				case 'D': // decoration
					for(var j=1, jstop = subproperties.length; j<jstop; j++){
						var subsubproperties = subproperties[j].split('*');
						var type = subsubproperties[0];
						if(type == 'E') // check we have an 'empty' character ('E')
						{
							type = ''; // modify type so it is now '' (empty string)
						}
						if(subproperties[1] !== '')
						{
							for(var k=0, kstop = subsubproperties[1].length;k<kstop;k+=2)
							{
								var deco_x = subsubproperties[1].charAt(k);
								var deco_y = subsubproperties[1].charAt(k+1);
								this.modify_decoration(alphanumconvert(deco_x),alphanumconvert(deco_y),type);
									// if (type) {
										// this.painter.drawDeco(alphanumconvert(deco_x),alphanumconvert(deco_y),type,'decoration');
									// }
									// else
									// {
										// this.painter.eraseDeco(alphanumconvert(deco_x),alphanumconvert(deco_y)); // how to erase big decoration ?
									// }
							}
						}

					}
					break;
				case 'R': // rotation system
					this.RS = subproperties[1];
					break;
				case 'O':
					this.activePieceOpacity = subproperties[1];
					break;
				case 'N': // nexthold
					for(var k=0, kstop = subproperties[1].length;k<kstop;k++)
					{
						if(subproperties[1].charAt(k) != '0')
						{
							  this.nexthold[k] = subproperties[1].charAt(k);
						}
						else
						{
							  this.nexthold[k] = '';
						}
					}

					break;

				case 'S': // comment / remark
					this.comment = subproperties[1];
					break;
				case 'W': // whiteborder
					this.whiteborder = subproperties[1];
					break;

				case 'T': // time = duration
					this.duration = subproperties[1];
					break;


				case 'B': // border
					this.border = subproperties[1];
					break;

				case 'J': // joystick
					var tmp1,tmp2;
					switch(subproperties[1].charAt(0))
					{
						case 'r':
							tmp1 = 'rest';
							break;
						case 'p':
							tmp1 = 'pressed';
							break;
						case 'h':
							tmp1 = 'holded';
							break;
					}
					switch(subproperties[1].charAt(1)) // compression based on a keyboard numerical keyboard
					{
						case '8':
							tmp2 = 'u';
							break;
						case '6':
							tmp2 = 'r';
							break;
						case '2':
							tmp2 = 'd';
							break;
						case '4':
							tmp2 = 'l';
							break;
						case '7':
							tmp2 = 'ul';
							break;
						case '5':
							tmp2 = 'c';
							break;
						case '9':
							tmp2 = 'ur';
							break;
						case '3':
							tmp2 = 'dr';
							break;
						case '1':
							tmp2 = 'dl';
							break;
					}
					this.modify_control(tmp2,tmp1);
					break;
				case 'C': // control/buttons
					for(var k=0, kstop = subproperties[1].length;k<=kstop;k++) // TODO: bug ? (why <= instead of < ?)
					{
					var tmp;
					switch(subproperties[1].charAt(k))
						{
							case 'r':
								tmp = 'rest';
							break;
							case 'h':
								tmp = 'holded';
							break;
							case 'p':
								tmp = 'pressed';
							break;
						}
					switch(k)
						{
						case 0:
							this.modify_button('A',tmp);
						break;
						case 1:
							this.modify_button('B',tmp);
						break;
						case 2:
							this.modify_button('C',tmp);
						break;
						case 3:
							this.modify_button('D',tmp);
						break;

						}
					}

					break;

				} // end switch
		}//end for
	};//end load

	/** Erase and delete one layer.
	
		@param {string} mode Define which layer will be cleared. Possible value: 'inactive','active' or 'all'*/
	this.clear = function(mode){
		switch(mode)
		{
			case 'inactive':
				this.painter.eraseLayer('inactive');
				for(var i = 0, istop = this.width; i < istop; i++) {
					for(var j = 0, jstop = this.height; j < jstop; j++) {
							this.playfield[i][j][0] = '';
						}
				}
				break;
			case 'active':
				this.painter.eraseLayer('active');
				this.activePieceType = '';
				this.activePieceOrientation = '';
				this.activePiecePositionX = '';
				this.activePiecePositionY = '';
				break;
			case 'decoration':
				this.painter.eraseLayer('decoration');
				for(var i = 0, istop = this.width; i < istop; i++) {
					for(var j = 0, jstop = this.height; j < jstop; j++) {
							this.playfield[i][j][1] = '';
						}
				}
	
				break;
			case 'all':
				this.painter.eraseLayer('inactive');
				this.painter.eraseLayer('active');
				this.painter.eraseLayer('decoration');
				for(var i = 0, istop = this.width; i < istop; i++) {
					for(var j = 0, jstop = this.height; j < jstop; j++) {
							this.playfield[i][j][0] = '';
							this.playfield[i][j][1] = '';
						}
				}
				this.activePieceType = '';
				this.activePieceOrientation = '';
				this.activePiecePositionX = '';
				this.activePiecePositionY = '';
				this.comment = '';
			break;
		}
	};
	/** Checks if a given piece is colliding with some blocks or walls.
	
		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
		@param {string} type Define the color of the block to be added. Possible values: (SZLJTOIG)
		@param {string} orientation Orientation of the tetramino; Possible values: 'i', 'cw', 'ccw' or 'u'
	*/

	this.is_piece_colliding = function(x,y,type,orientation){
		var matrix = getMatrix(type, orientation, this.RS);
		var tmp = "", tmp2 = "";
		
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
			
				if(matrix[i][j])
				{
					// this.painter.drawBlock(parseInt(parseInt(x-1+j,10),10),parseInt(parseInt(y-1+i,10),10),'O','ARS','preview','false');
				}
				
				if(matrix[i][j] && !this.is_in(parseInt(x-1+j,10),parseInt(y-1+i,10)))
				{
				 // this.painter.drawBlock(parseInt(parseInt(x-1+j,10),10),parseInt(parseInt(y-1+i,10),10),'S','ARS','preview','false');
					return true;
				}
				
				
				if(matrix[i][j] // for each piece's block...
				&& this.is_in(parseInt(x-1+j,10),parseInt(y-1+i,10)) //... check that they are in the playfield ...
				&& this.playfield[parseInt(x-1+j,10)][parseInt(y+i-1,10)][0]) // and check if there's no collision with an existing piece
				{
					// this.painter.drawBlock(parseInt(parseInt(x-1+j,10),10),parseInt(parseInt(y-1+i,10),10),'I','ARS','preview','false');
					return true;
				}
			}
		}	
		return false;
	}
	
	/** 'Macro' method that modifies several times a given layer according to the tetramino shape given in parameter.
	
		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
		@param {string} type Define the color of the block to be added. Possible values: (SZLJTOIG)
		@param {string} orientation Orientation of the tetramino; Possible values: 'i', 'cw', 'ccw' or 'u'
		@param {string} mode Define which layer will be modified. Possible value: 'inactive','active',
						'garbage','preview','decoration-preview','decoration','erase','preview-eraser','Flash'
		@param {boolean}} drop Is the method is in drop mode ?
	*/
	
	this.addPiece = function(x,y,type,orientation,mode,drop){
		var matrix = getMatrix(type, orientation, this.RS);
		var still_droping = true;
		var counter = 0;
		while(drop & still_droping ){
			counter = 0;
			
			if(this.is_piece_colliding(parseInt(x),parseInt(y),type,orientation))
			{
				still_droping = false;
			}
			else{
			y++;
			}
		}
		if(drop)
			{y--;}
		
		if (mode == 'inactive' || mode == 'garbage') {
			this.painter.CanvasPreview.attr('width',this.painter.CanvasPreview.width()); //erase the preview layer
		}
		if (mode == 'active') {

			this.activePieceType = type;
			this.activePieceOrientation = orientation;
			this.activePiecePositionX = x;
			this.activePiecePositionY = y;
			this.painter.CanvasActive.attr('width',this.painter.CanvasPreview.width()); //erase the active layer
			this.painter.drawBrowserBlock(parseInt(x,10),parseInt(y,10),type,this.RS,this.id,'resetactive'); // TODO: potential bug ? (used erroneously parseInt(x+i) and parseInt(y+j) before...)
		}
	
		if (mode == 'decoration-preview')
		{
			this.painter.drawDeco(x,y,type,'preview');
		}
		else if (mode =='decoration'){
			this.modify_decoration(x,y,type);
			this.painter.drawDeco(x,y,type,'decoration');
			this.painter.highlight(x,y);
		}
		else
		{
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
	
					//if (matrix[i][j] && this.is_in(parseInt(x-1+j,10),parseInt(y-1+i,10))) {
					if (matrix[i][j] && this.piece_is_in(x,y,type,orientation)) {
						switch(mode)
						{
							case 'inactive':
								this.modify(parseInt(x-1+j,10),parseInt(y-1+i,10),type);
								this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,'inactive');
								if (this.whiteborder)
								{
									this.painter.drawLocalWhiteBorder(this.playfield,x-1+j,y-1+i);
								}
	
								this.painter.highlight(x-1+j,y-1+i);
							break;
							case 'garbage':
								this.modify(parseInt(x-1+j,10),parseInt(y-1+i,10),'G');
								this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),'G',this.RS,'inactive');
								if (this.whiteborder)
								{
									this.painter.drawLocalWhiteBorder(this.playfield,x-1+j,y-1+i);
								}
	
								this.painter.highlight(x-1+j,y-1+i);
							break;
							case 'preview':
								this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,'preview');
							break;
							case 'active':
								this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,'active');
								this.painter.highlight(x-1+j,y-1+i);
								this.painter.drawBrowserBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,this.id,'active'); // erase this line to disable the browser thing
							break;
							case 'erase':
								this.removeBlock(parseInt(x-1+j,10),parseInt(y-1+i,10));
								this.painter.highlight(x-1+j,y-1+i);
								this.painter.drawBrowserBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),'E',this.RS,this.id,'inactive'); // erase this line to disable the browser thing
							break;
							case 'preview-eraser':
								this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),'G',this.RS,'preview');
							break;
						}
					}
				}
			}
		}
	
	}; //end drawpiece
	

	/** Modify a block in the inactive layer.

		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
		@param {string} type Piece type. Possible value: SZLJTOIG and E (empty)
	*/
	this.modify = function(x,y,type){
		if (type == 'E')
		{
			this.playfield[x][y][0] = '';
		}
		else
		{
			this.playfield[x][y][0] = type;
		}
			//this.painter.drawBrowserBlock(x,y,type,this.RS,this.id,'inactive'); // I hope putting this here won't have any nasty side-effect
	};	
	
	/** Modify the decoration layer.
	
		@param {number} x Horizontal coordinate
		@param {number} y Vertical coordinate
		@param {string} type Type of the decoration
	*/
	Frame.prototype.modify_decoration = function(x,y,type){
		this.playfield[x][y][1] = type;
	};
	
	/** Change the control appearance
	
		@param {string} direction Define in which position the joystick is. Possible value: 'all', 'u', 'r', 'l', 'd', 'ul', 'ur', 'dl', 'dr'
		@param {string} state Define which color to draw. Possible value: 'rest', 'pressed' or 'holded'
	*/
	this.modify_control = function(direction,state){
		this.joystick_state = state;
		this.joystick_direction = direction;
	};
	
	/** Change the chosen button appearance
	
		@param {string} button Define which button to draw. Possible value: 'A', 'B', 'C', 'D' for now.
		@param {string} state Define in which color the button is drawn. Possible value: 'rest', 'pressed' or 'holded'.
	*/
	this.modify_button = function(button,state){
		var index = '';
		switch(button)
		{
			case 'A': index = 0; break;
			case 'B': index = 1; break;
			case 'C': index = 2; break;
			case 'D': index = 3; break;
			//case 'E': index = 4; break;
			//case 'F': index = 5; break;
		}
		this.button_state[index] = state;
	};	
}//end frame

/* Rotation definition*/

	/*
	piece: {
		color: 'color',
		i:	[[block1 offset x, block1 offset y],
			  block2 offset x, block2 offset y],
			  block3 offset x, block3 offset y]]
		cw: [[block1 offset x, block1 offset y],
			  block2 offset x, block2 offset y],
			  block3 offset x, block3 offset y]]
		ccw:	[[block1 offset x, block1 offset y],
				  block2 offset x, block2 offset y],
				  block3 offset x, block3 offset y]]
		u:	[[block1 offset x, block1 offset y],
			  block2 offset x, block2 offset y],
			  block3 offset x, block3 offset y]]
		offset: [sprite offset x, sprite offset y];
	}

	I: {
		color : 'red',
		orient_i:	[[0,0],[0,0],[0,0]],
		orient_cw:	[[0,0],[0,0],[0,0]],
		orient_ccw:[[0,0],[0,0],[0,0]],
		orient_u:	[[0,0],[0,0],[0,0]]
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

/** Definition of the Arika Rotation System*/
var ARS = {
	I: {
		color : 'red',
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
		color : 'cyan',
		offset: [6,1],
		i:		[[0,0,0,0],
				 [1,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		cw:	[[0,1,0,0],
				 [1,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		ccw:	[[0,1,0,0],
				 [0,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		u:		[[0,0,0,0],
				 [0,1,0,0],
				 [1,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	L: {
		color : 'orange',
		offset: [3,1],
		i:		[[0,0,0,0],
				 [1,1,1,0],
				 [1,0,0,0],
				 [0,0,0,0]],
		cw:		[[1,1,0,0],
				 [0,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		ccw:	[[0,1,0,0],
				 [0,1,0,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		u:		[[0,0,0,0],
				 [0,0,1,0],
				 [1,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},

	J: {
		color : 'blue',
		offset: [7,1],
		i:		[[0,0,0,0],
				 [1,1,1,0],
				 [0,0,1,0],
				 [0,0,0,0]],
		cw:		[[0,1,0,0],
				 [0,1,0,0],
				 [1,1,0,0],
				 [0,0,0,0]],
		ccw:	[[0,1,1,0],
				 [0,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		u:		[[0,0,0,0],
				 [1,0,0,0],
				 [1,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	S: {
		color : 'magenta',
		offset: [8,0],
		i:		[[0,0,0,0],
				 [0,1,1,0],
				 [1,1,0,0],
				 [0,0,0,0]],
		cw:		[[1,0,0,0],
				 [1,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		ccw:	[[1,0,0,0],
				 [1,1,0,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		u:		[[0,0,0,0],
				 [0,1,1,0],
				 [1,1,0,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	Z: {
		color : 'green',
		offset: [5,1],
		i:		[[0,0,0,0],
				 [1,1,0,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		cw:		[[0,0,1,0],
				 [0,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		ccw:	[[0,0,1,0],
				 [0,1,1,0],
				 [0,1,0,0],
				 [0,0,0,0]],
		u:		[[0,0,0,0],
				 [1,1,0,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},

	O: {
		color : 'yellow',
		offset: [4,1],
		i:		[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		cw:		[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		ccw:	[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		u:		[[0,0,0,0],
				 [0,1,1,0],
				 [0,1,1,0],
				 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	G: {
		color : 'gray',
		offset: [1,1],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]
	},
	Flash: {
		color : 'lightgray',
		offset: [1,1],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]
	}
};

/** Definition of the Super Rotation System*/
var SRS = {
	I: {
		color : 'cyan',
		offset:[6,2],
		i:			[[0,0,0,0],
					 [1,1,1,1],
					 [0,0,0,0],
					 [0,0,0,0]],

		cw:			[[0,0,1,0],
					 [0,0,1,0],
					 [0,0,1,0],
					 [0,0,1,0]],

		u:			[[0,0,0,0],
					 [0,0,0,0],
					 [1,1,1,1],
					 [0,0,0,0]],

		ccw:		[[0,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]


	},
	J: {
		color : 'blue',
		offset:[7,2],
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
		color : 'orange',
		offset:[3,2],
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
		color : 'yellow',
		offset:[4,2],
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
		color : 'green',
		offset:[5,2],
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
		color : 'purple',
		offset:[8,2],
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
		color : 'red',
		offset:[2,2],
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

	},
	G: {
		color : 'gray',
		offset: [1,2],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]
	},
	Flash: {
		color : 'lightgray',
		offset: [1,2],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]
	}
};

/** Definition of the Nintendo Rotation System, Gameboy flavor*/
var GB = {
	I: {
		color : 'yellowgreen',
		offset:[6,9],
		i:			[[0,0,0,0],
					 [0,0,0,0],
					 [1,1,1,1],
					 [0,0,0,0]],

		cw:			[[0,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0]],

		u:			[[0,0,0,0],
					 [0,0,0,0],
					 [1,1,1,1],
					 [0,0,0,0]],

		ccw:		[[0,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]


	},
	J: {
		color : 'yellowgreen',
		offset:[1,9],
		i:			[[0,0,0,0],
					 [1,1,1,0],
					 [0,0,1,0],
					 [0,0,0,0]],

		cw:			[[0,1,0,0],
					 [0,1,0,0],
					 [1,1,0,0],
					 [0,0,0,0]],

		u:			[[1,0,0,0],
					 [1,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],

		ccw:		[[0,1,1,0],
					 [0,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],

		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	L: {
		color : 'yellowgreen',
		offset:[3,9],
		i:			[[0,0,0,0],
					 [1,1,1,0],
					 [1,0,0,0],
					 [0,0,0,0]],

		cw:			[[1,1,0,0],
					 [0,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],


		u:			[[0,0,1,0],
					 [1,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],

		ccw:		[[0,1,0,0],
					 [0,1,0,0],
					 [0,1,1,0],
					 [0,0,0,0]],

		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	O: {
		color : 'yellowgreen',
		offset:[4,9],
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
		color : 'yellowgreen',
		offset:[5,9],
		i:			[[0,0,0,0],
					 [0,1,1,0],
					 [1,1,0,0],
					 [0,0,0,0]],

		cw:			[[1,0,0,0],
					 [1,1,0,0],
					 [0,1,0,0],
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
		color : 'yellowgreen',
		offset:[8,9],
		i:			[[0,0,0,0],
					 [1,1,1,0],
					 [0,1,0,0],
					 [0,0,0,0]],

		cw:		[[0,1,0,0],
					 [1,1,0,0],
					 [0,1,0,0],
					 [0,0,0,0]],

		u:			[[0,1,0,0],
					 [1,1,1,0],
					 [0,0,0,0],
					 [0,0,0,0]],

		ccw:		[[0,1,0,0],
					 [0,1,1,0],
					 [0,1,0,0],
					 [0,0,0,0]],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]

	},
	Z: {
		color : 'yellowgreen',
		offset:[2,9],
		i:			[[0,0,0,0],
					 [1,1,0,0],
					 [0,1,1,0],
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

	},
	G: {
		color : 'gray',
		offset: [0,9],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]
	},
	Flash: {
		color : 'lightgray',
		offset: [0,9],
		singleton:	[[0,0,0,0],
				 [0,1,0,0],
				 [0,0,0,0],
				 [0,0,0,0]]
	}
};

/** Definition of the decorations*/
var decoration ={
	n1: {s: [0,0], e: [1,1]},
	n2: {s: [1,0], e: [2,1]},
	n3: {s: [2,0], e: [3,1]},
	n4: {s: [3,0], e: [4,1]},
	n5: {s: [4,0], e: [5,1]},
	n6: {s: [5,0], e: [6,1]},
	n7: {s: [6,0], e: [7,1]},
	n8: {s: [7,0], e: [8,1]},
	n9: {s: [8,0], e: [9,1]},
	n0: {s: [9,0], e: [10,1]},
	smallccw: {s: [0,1], e: [1,2]},
	smallcw: {s: [1,1], e: [2,2]},
	smalloktick: {s: [2,1], e: [3,2]},
	smallokcircle: {s: [3,1], e: [4,2]},
	smallnocross: {s: [4,1], e: [5,2]},
	smallquestion: {s: [5,1], e: [6,2]},
	smallexclamation: {s: [6,1], e: [7,2]},
	nwarrow: {s: [0,2], e: [1,3]},
	narrow: {s: [1,2], e: [2,3]},
	nearrow: {s: [2,2], e: [3,3]},
	warrow: {s: [0,3], e: [1,4]},
	earrow: {s: [2,3], e: [3,4]},
	swarrow: {s: [0,4], e: [1,5]},
	sarrow: {s: [1,4], e: [2,5]},
	searrow: {s: [2,4], e: [3,5]},

	bigcw: {s: [3,2], e: [5,4]},
	bigccw: {s: [5,2], e: [7,4]},
	bigquestion: {s: [7,2], e: [9,4]},
	bigexclamation: {s: [9,2], e: [10,4]},

	bigoktick: {s: [3,4], e: [5,6]},
	bigokcircle: {s: [5,4], e: [7,6]},
	bignocross: {s: [7,4], e: [9,6]},

	overlayyellow: {s: [1,6], e: [2,7]},
	overlayblue: {s: [2,6], e: [3,7]},
	overlaygreen: {s: [3,6], e: [4,7]},
	overlaypink: {s: [4,6], e: [5,7]},
	overlayorange: {s: [5,6], e: [6,7]},

	clear1: {s: [0,7], e: [10,8]},
	clear2: {s: [0,8], e: [10,9]},
	clear3: {s: [0,9], e: [10,10]},
	clear4: {s: [0,10], e: [10,11]},
	clear5: {s: [0,11], e: [10,12]},
	clear6: {s: [0,12], e: [10,13]},
	clear7: {s: [0,13], e: [10,14]}
	//n0: {s: [0,7], e: [10,8]},

	/*
	n1
	n2
	n3
	n4
	n5
	n6
	n7
	n8
	n9
	n0
	smallccw
	smallcw
	smalloktick
	smallokcircle
	smallnocross
	smallquestion
	smallexclamation
	nwarrow
	narrow
	nearrow
	earrow
	searrow
	sarrow
	swarrow
	warrow
	bigcw
	big ccw
	smallquestion
	bigexclamation
	bigoktick
	bigokcircle
	bignocross
	overlayyellow
	overlayblue
	overlaygreen
	overlaypink
	overlaypink
	clear1
	clear2
	clear3
	clear4
	clear5
	clear6
	clear7
	nwhl
	nhl
	nehl
	ehl
	sehl
	shl
	swhl
	whl
	chl
	nwshl
	neshl
	nshl
	wnehl
	wehl
	wsehl
	*/
};

////////////////////////////////////////////////////////////////////

/** Return a piece coordinate matrix
	@function
	@param {string} type Piece type
	@param {orientation} type Piece type
	@param {string} type Piece type
*/
function getMatrix(type,orientation, RS){
	var matrix;
	switch(RS)
		{
			case 'ARS':
				switch(type)
				{
					case 'I':
						switch(orientation)
							{
								case 'i':	matrix = ARS.I.i;  break;
								case 'cw':	matrix = ARS.I.cw;  break;
								case 'ccw':	matrix = ARS.I.ccw;  break;
								case 'u':	matrix = ARS.I.u;  break;
								case 'singleton':	matrix = ARS.I.singleton;  break;
							}
						break;
					case 'T':
						switch(orientation)
							{
								case 'i':	matrix = ARS.T.i;  break;
								case 'cw':	matrix = ARS.T.cw;  break;
								case 'ccw':	matrix = ARS.T.ccw;  break;
								case 'u':	matrix = ARS.T.u;  break;
								case 'singleton':	matrix = ARS.T.singleton;  break;
							}
						break;
					case 'L':
						switch(orientation)
							{
								case 'i':	matrix = ARS.L.i;  break;
								case 'cw':	matrix = ARS.L.cw;  break;
								case 'ccw':	matrix = ARS.L.ccw;  break;
								case 'u':	matrix = ARS.L.u;  break;
								case 'singleton':	matrix = ARS.L.singleton;  break;
							}
						break;
					case 'J':
						switch(orientation)
							{
								case 'i':	matrix = ARS.J.i;  break;
								case 'cw':	matrix = ARS.J.cw;  break;
								case 'ccw':	matrix = ARS.J.ccw;  break;
								case 'u':	matrix = ARS.J.u;  break;
								case 'singleton':	matrix = ARS.J.singleton;  break;
							}
						break;
					case 'S':
						switch(orientation)
							{
								case 'i':	matrix = ARS.S.i;  break;
								case 'cw':	matrix = ARS.S.cw;  break;
								case 'ccw':	matrix = ARS.S.ccw;  break;
								case 'u':	matrix = ARS.S.u;  break;
								case 'singleton':	matrix = ARS.J.singleton;  break;
							}
						break;
					case 'Z':
						switch(orientation)
							{
								case 'i':	matrix = ARS.Z.i;  break;
								case 'cw':	matrix = ARS.Z.cw;  break;
								case 'ccw':	matrix = ARS.Z.ccw;  break;
								case 'u':	matrix = ARS.Z.u;  break;
								case 'singleton':	matrix = ARS.Z.singleton;  break;
							}
						break;
					case 'O':
						switch(orientation)
							{
								case 'i':	matrix = ARS.O.i;  break;
								case 'cw':	matrix = ARS.O.cw;  break;
								case 'ccw':	matrix = ARS.O.ccw;  break;
								case 'u':	matrix = ARS.O.u;  break;
								case 'singleton':	matrix = ARS.O.singleton;  break;
							}
						break;
					case 'G':
						switch(orientation)
							{
								case 'i':	matrix = ARS.G.i;  break;
								case 'cw':	matrix = ARS.G.cw;  break;
								case 'ccw':	matrix = ARS.G.ccw;  break;
								case 'u':	matrix = ARS.G.u;  break;
								case 'singleton':	matrix = ARS.G.singleton;  break;
							}
						break;
				} // type
			break; // end ars
			case 'SRS':
				switch(type)
				{
					case 'I':
						switch(orientation)
							{
								case 'i':	matrix = SRS.I.i;  break;
								case 'cw':	matrix = SRS.I.cw;  break;
								case 'ccw':	matrix = SRS.I.ccw;  break;
								case 'u':	matrix = SRS.I.u;  break;
								case 'singleton':	matrix = SRS.I.singleton;  break;
							}
						break;
					case 'T':
						switch(orientation)
							{
								case 'i':	matrix = SRS.T.i;  break;
								case 'cw':	matrix = SRS.T.cw;  break;
								case 'ccw':	matrix = SRS.T.ccw;  break;
								case 'u':	matrix = SRS.T.u;  break;
								case 'singleton':	matrix = SRS.T.singleton;  break;
							}
						break;
					case 'L':
						switch(orientation)
							{
								case 'i':	matrix = SRS.L.i;  break;
								case 'cw':	matrix = SRS.L.cw;  break;
								case 'ccw':	matrix = SRS.L.ccw;  break;
								case 'u':	matrix = SRS.L.u;  break;
								case 'singleton':	matrix = SRS.L.singleton;  break;
							}
						break;
					case 'J':
						switch(orientation)
							{
								case 'i':	matrix = SRS.J.i;  break;
								case 'cw':	matrix = SRS.J.cw;  break;
								case 'ccw':	matrix = SRS.J.ccw;  break;
								case 'u':	matrix = SRS.J.u;  break;
								case 'singleton':	matrix = SRS.J.singleton;  break;
							}
						break;
					case 'S':
						switch(orientation)
							{
								case 'i':	matrix = SRS.S.i;  break;
								case 'cw':	matrix = SRS.S.cw;  break;
								case 'ccw':	matrix = SRS.S.ccw;  break;
								case 'u':	matrix = SRS.S.u;  break;
								case 'singleton':	matrix = SRS.S.singleton;  break;
							}
						break;
					case 'Z':
						switch(orientation)
							{
								case 'i':	matrix = SRS.Z.i;  break;
								case 'cw':	matrix = SRS.Z.cw;  break;
								case 'ccw':	matrix = SRS.Z.ccw;  break;
								case 'u':	matrix = SRS.Z.u;  break;
								case 'singleton':	matrix = SRS.Z.singleton;  break;
							}
						break;
					case 'O':
						switch(orientation)
							{
								case 'i':	matrix = SRS.O.i;  break;
								case 'cw':	matrix = SRS.O.cw;  break;
								case 'ccw':	matrix = SRS.O.ccw;  break;
								case 'u':	matrix = SRS.O.u;  break;
								case 'singleton':	matrix = SRS.O.singleton;  break;
							}
						break;
					case 'G':
						switch(orientation)
							{
								case 'i':	matrix = SRS.G.i;  break;
								case 'cw':	matrix = SRS.G.cw;  break;
								case 'ccw':	matrix = SRS.G.ccw;  break;
								case 'u':	matrix = SRS.G.u;  break;
								case 'singleton':	matrix = SRS.G.singleton;  break;
							}
						break;
				} // end type
			break; // end srs
			case 'GB':
				switch(type)
				{
					case 'I':
						switch(orientation)
							{
								case 'i':	matrix = GB.I.i;  break;
								case 'cw':	matrix = GB.I.cw;  break;
								case 'ccw':	matrix = GB.I.ccw;  break;
								case 'u':	matrix = GB.I.u;  break;
								case 'singleton':	matrix = GB.I.singleton;  break;
							}
						break;
					case 'T':
						switch(orientation)
							{
								case 'i':	matrix = GB.T.i;  break;
								case 'cw':	matrix = GB.T.cw;  break;
								case 'ccw':	matrix = GB.T.ccw;  break;
								case 'u':	matrix = GB.T.u;  break;
								case 'singleton':	matrix = GB.T.singleton;  break;
							}
						break;
					case 'L':
						switch(orientation)
							{
								case 'i':	matrix = GB.L.i;  break;
								case 'cw':	matrix = GB.L.cw;  break;
								case 'ccw':	matrix = GB.L.ccw;  break;
								case 'u':	matrix = GB.L.u;  break;
								case 'singleton':	matrix = GB.L.singleton;  break;
							}
						break;
					case 'J':
						switch(orientation)
							{
								case 'i':	matrix = GB.J.i;  break;
								case 'cw':	matrix = GB.J.cw;  break;
								case 'ccw':	matrix = GB.J.ccw;  break;
								case 'u':	matrix = GB.J.u;  break;
								case 'singleton':	matrix = GB.J.singleton;  break;
							}
						break;
					case 'S':
						switch(orientation)
							{
								case 'i':	matrix = GB.S.i;  break;
								case 'cw':	matrix = GB.S.cw;  break;
								case 'ccw':	matrix = GB.S.ccw;  break;
								case 'u':	matrix = GB.S.u;  break;
								case 'singleton':	matrix = GB.S.singleton;  break;
							}
						break;
					case 'Z':
						switch(orientation)
							{
								case 'i':	matrix = GB.Z.i;  break;
								case 'cw':	matrix = GB.Z.cw;  break;
								case 'ccw':	matrix = GB.Z.ccw;  break;
								case 'u':	matrix = GB.Z.u;  break;
								case 'singleton':	matrix = GB.Z.singleton;  break;
							}
						break;
					case 'O':
						switch(orientation)
							{
								case 'i':	matrix = GB.O.i;  break;
								case 'cw':	matrix = GB.O.cw;  break;
								case 'ccw':	matrix = GB.O.ccw;  break;
								case 'u':	matrix = GB.O.u;  break;
								case 'singleton':	matrix = GB.O.singleton;  break;
							}
						break;
					case 'G':
						switch(orientation)
							{
								case 'i':	matrix = GB.G.i;  break;
								case 'cw':	matrix = GB.G.cw;  break;
								case 'ccw':	matrix = GB.G.ccw;  break;
								case 'u':	matrix = GB.G.u;  break;
								case 'singleton':	matrix = GB.G.singleton;  break;
							}
						break;
				} // end type
			break; // end GB
		}// end rs
		return matrix;

}

/** Return a piece coordinate matrix
	@function
	@param {string} type Piece type
	@param {orientation} type Piece type
	@param {string} type Piece type
*/
/** Convert a letter to its corresponding number and vice-versa.
	Currently convert the 19 first number (including zero) because
	we don't need further coordinate (for now).
	A possible expansion would be to also encode [A-Z] (uppcase)

	@param {(string|number)} input Letter or number
	@return {(string|number)} Number or letter
*/
function alphanumconvert(input){
	var output;
	switch(input)
	{
	case 'a' :
		output = 0;
		break;
	case 'b' :
		output = 1;
		break;
	case 'c' :
		output = 2;
		break;
	case 'd' :
		output = 3;
		break;
	case 'e' :
		output = 4;
		break;
	case 'f' :
		output = 5;
		break;
	case 'g' :
		output = 6;
		break;
	case 'h' :
		output = 7;
		break;
	case 'i' :
		output = 8;
		break;
	case 'j' :
		output = 9;
		break;
	case 'k' :
		output = 10;
		break;
	case 'l' :
		output = 11;
		break;
	case 'm' :
		output = 12;
		break;
	case 'n' :
		output = 13;
		break;
	case 'o' :
		output = 14;
		break;
	case 'p' :
		output = 15;
		break;
	case 'q' :
		output = 16;
		break;
	case 'r' :
		output = 17;
		break;
	case 's' :
		output = 18;
		break;
	case 't' :
		output = 19;
		break;
	case 'z' :
		output = -1;
		break;
	case -1 :
		output = 'z';
		break;
	case 0 :
		output = 'a';
		break;
	case 1 :
		output = 'b';
		break;
	case 2 :
		output = 'c';
		break;
	case 3 :
		output = 'd';
		break;
	case 4 :
		output = 'e';
		break;
	case 5 :
		output = 'f';
		break;
	case 6 :
		output = 'g';
		break;
	case 7 :
		output = 'h';
		break;
	case 8 :
		output = 'i';
		break;
	case 9 :
		output = 'j';
		break;
	case 10 :
		output = 'k';
		break;
	case 11 :
		output = 'l';
		break;
	case 12 :
		output = 'm';
		break;
	case 13 :
		output = 'n';
		break;
	case 14 :
		output = 'o';
		break;
	case 15 :
		output = 'p';
		break;
	case 16 :
		output = 'q';
		break;
	case 17 :
		output = 'r';
		break;
	case 18 :
		output = 's';
		break;
	case 19 :
		output = 't';
		break;
	}
	return output;
}

 // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0, xstop = vendors.length; x < xstop && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                      window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        {window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };}

    if (!window.cancelAnimationFrame)
         {window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };}
}());

// compare prototype courtesy of Patrick Hunlock http://www.hunlock.com/blogs/Mastering_Javascript_Arrays#quickIDX41
Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length)
		{return false;}
    for(var i = 0, istop = testArr.length; i < istop; i++) {
        if (this[i].compare) {
            if (!this[i].compare(testArr[i]))
				{return false;}
        }
        if (this[i] !== testArr[i]) {return false;}
    }
    return true;
};