/*

File: Tedige - a tetris diagram Generator*/
/* ToDo

-code cleanup
- better doc
- hold action
- diagram thumbnail
- wallkick (ARS, SRS[argh])
- generate tetramino sequence
- history



I~Ibdbebfbgbhcedfeefdfefffgfh~Sgdgdgegfggghhdhfhhidihjdjh_+I~Tadaeafbfbhcdcecfcgch~Ebdbebgdffefggdgegfgggh~Gedeeefegehfdfffh~Sheifjfjg_
I~Oasatbsbtisitjsjt~Ibdbdbebfbgbhcedfeefdfefffgfh~Zbpbpbqcocpdmdnelem~Sflflfmgdgegfggghgmgnhdhfhhhohpidihipiqjdjh_+I~Tadaeafbfbhcdcecfcgch~Lajakbjcj~Ebdbebgbpbqcocpdfdmdnelemfefgflfmgdgegfggghgmgnhohpipiq~Gedeeefegehfdfffh~Sheifjfjg~Jhjijjjjk_
--> Should give ME followed by YES
*/


/*
	+++---------------------------------------------------------------+
	¦¦¦	Class: Painter
	¦¦¦ Painter interact with the canvases and the html page. It binds
	¦¦¦ to / uses several layer of overlapping canvas elements. Think
	¦¦¦ of it a bit like the view part of a MVC model.
	¦¦¦	>						+-----------------------+
	¦¦¦	>						V						¦
	¦¦¦	>	Canvas/html <-- <Painter> <-- <Frame> <-- <Diagram>
	¦¦¦	>			¦		^^^^^^^^						^
	¦¦¦	>			¦										¦
	¦¦¦	>			+--------------------------------------+
	¦¦¦
	¦¦¦
	¦¦¦ Parameter:
	¦¦¦		CanvasIDString	-	the id of the canvas element
	¦¦¦		CanvasHeight	-	the height of the canvas element
	¦¦¦		CanvasWidth		-	the width of the canvas element
	¦¦¦		blockSize		-	the size of the canvas element
	¦¦¦
	¦¦¦ See also:
	¦¦¦		<Frame>
	¦¦¦		<Diagram>
	+++---------------------------------------------------------------+
*/
function Painter(CanvasIDString, CanvasHeight, CanvasWidth, blockSize) {
	/*
		Default canvas size (same as fumen) :
		- height: 193px
		- width: 80px
		- block size: 8*8px
	*/

	// default parameter method from: http://stackoverflow.com/questions/894860/how-do-i-make-a-default-value-for-a-parameter-to-a-javascript-function

	/*Property: CanvasHeight
	Height of the Canvas in px.*/
	this.CanvasHeight = typeof CanvasHeight !== 'undefined' ? CanvasHeight : 177;
	/*Property: CanvasHeight
	Width of the Canvas in px.*/
	this.CanvasWidth = typeof CanvasHeight !== 'undefined' ? CanvasHeight : 97;
	/*Property: CanvasHeight
	Size of a block element in px.*/
	this.blockSize = typeof blockSize !== 'undefined' ? blockSize : 8;

	/*Property: myself
	A variable referencing the class, used to exploit closure stuff in other methods*/
	var myself = this;

	this.IDString = CanvasIDString;

	/*** HTML-related properties ***/

	/*Properties: CanvasXXX
	Get the jQuery object of the canvas identified by #XXX
	Currently 9 canvases are used (that's probably too much), in appearance order:
		preview - Where things gets drawn on mouseover
		deco - Decorations: arrows, line clear effects, ...
		active - Where the active piece is drawn
		whiteborder - TGM's white pixel border
		pf - Where the inactive piece is drawn
		background - Where the background is drawn
		border - where the border is drawn
	nexthold - the next and hold box
	*/
	/*Properties: ContextXXX
	Get the 2D context of the related canvas.*/
	this.CanvasPF = $('#' + CanvasIDString + '-inactive');
	this.ContextPF = this.CanvasPF[0].getContext('2d');

	this.CanvasActive = $('#' + CanvasIDString + '-active');
	this.ContextActive = this.CanvasActive[0].getContext('2d'); // cPF: ContextPF

	this.CanvasBorder = $('#' + CanvasIDString + '-border');
	this.ContextBorder = this.CanvasBorder[0].getContext('2d'); // cPF: ContextPF

	this.CanvasPreview = $('#' + CanvasIDString + '-preview');
	this.ContextPreview = this.CanvasPreview[0].getContext('2d');

	this.CanvasBackground = $('#' + CanvasIDString + '-background');
	this.ContextBackground = this.CanvasBackground[0].getContext('2d');

	this.CanvasWhiteborder = $('#' + CanvasIDString + '-whiteborder');
	this.ContextWhiteborder = this.CanvasWhiteborder[0].getContext('2d');

	this.CanvasDeco = $('#' + CanvasIDString + '-deco');
	this.ContextDeco = this.CanvasDeco[0].getContext('2d');

	this.CanvasDecoPin = $('#' + CanvasIDString + '-decoPin');
	this.ContextDecoPin = this.CanvasDecoPin[0].getContext('2d');

	this.CanvasWhiteborder = $('#' + CanvasIDString + '-whiteborder');
	this.ContextWhiteborder = this.CanvasWhiteborder[0].getContext('2d');

	this.CanvasNextHold = $('#' + CanvasIDString + '-nexthold');
	this.ContextNextHold = this.CanvasNextHold[0].getContext('2d');

	this.CanvasProgressbar = $('#' + CanvasIDString + '-progressbar');
	this.ContextProgressbar = this.CanvasProgressbar[0].getContext('2d');

	this.CanvasControl = $('#' + CanvasIDString + '-control');
	this.ContextControl = this.CanvasControl[0].getContext('2d');

	this.CanvasExport = $('#pf-export');
	this.ContextExport = this.CanvasExport[0].getContext('2d');

	/*** Canvas-related properties ***/

	/*Property: PFOriginX
	Sets the position of the playfield relative to the canvas*/
	this.PFOriginX = 1 * this.blockSize;
	this.PFOriginY = 1 * this.blockSize;
	/*Property: PFOriginX
	Sets the position of the playfield relative to the page*/
	// get the absolute position of the canvas
	this.PFOriginXAbsolute = this.CanvasPF.offset().left + this.PFOriginX - 1;
	this.PFOriginYAbsolute = this.CanvasPF.offset().top + this.PFOriginY;

	/*Property: CntrlOriginX
	Sets the position of the controls (joystick, buttons) relative to the page*/
	// get the absolute position of the canvas
	this.CntrlOriginX = this.CanvasControl.offset().left;
	this.CntrlOriginY = this.CanvasControl.offset().top;


	/*Property: sprite
	An image object that contains the blocks' sprite*/
	this.sprite = '';
	/*Property: spritemini
	An image object that contains the blocks' sprite, mini version*/
	this.spritemini = '';
	/*Property: spritedeco
	An image object that contains the decorations' sprite*/
	this.spritedeco = '';

	/*Property: ready
	A boolean that sets if the painter object is ready to be painter, i.e. if the sprites have loaded*/
	this.ready = false;
	/* Method: init
	Loads the image into the sprite object*/
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

	/* Method: eraseLayer
		Erase the content one layer (the canvas still exists).

		Parameter:
			layer - define which layer will be erased. Either 'inactive', 'active','preview', 'nexthold', 'whiteborder' or 'all' */
	this.eraseLayer = function (layer) {
		var Canvas;
		switch (layer)
		{
			case 'decoration':
				Canvas = this.CanvasDeco;
				break;
			case 'inactive':
				Canvas = this.CanvasPF;
				break;
			case 'preview':
				Canvas = this.CanvasPreview;
				break;
			case 'active':
				Canvas = this.CanvasActive;
				break;
			case 'nexthold':
				Canvas = this.CanvasNextHold;
				break;
			case 'whiteborder':
				Canvas = this.CanvasWhiteborder;
				break;
			case 'all':
				Canvas = this.CanvasPF;
				this.CanvasDeco.attr('width', this.CanvasDeco.width());
				this.CanvasPreview.attr('width', this.CanvasPreview.width());
				this.CanvasActive.attr('width', this.CanvasActive.width());
				this.CanvasNextHold.attr('width', this.CanvasNextHold.width());
				break;
		}
		Canvas.attr('width', Canvas.width());
	};
	/* Method: eraseBlock
		Erase a 'block' area at the designated coordinate.

		Parameters:
			x - x position, in block unit
			y - y position, in block unit*/
	this.eraseBlock = function (x, y) {
		this.ContextPF.clearRect(this.PFOriginX+x*this.blockSize,this.PFOriginY+y*this.blockSize,this.blockSize,this.blockSize);
	};

	/* Method: eraseDeco
		Erase a 'block' area at the designated coordinate in the decoration layer.

		Parameters:
			x - x position, in block unit
			y - y position, in block unit*/
	this.eraseDeco = function(x,y){
		this.ContextDeco.clearRect(this.PFOriginX+x*this.blockSize,this.PFOriginY+y*this.blockSize,this.blockSize,this.blockSize);
	};

	this.drawComment = function(str){
		$('#'+this.IDString+'-comment').val(str);
	};
	this.drawDuration = function(str){
		$('#'+this.IDString+'-duration').val(str);
	};
	this.drawOpacity = function(str){
		$('#'+this.IDString+'-active-opacity').val(str);
	// TODO: this has nothing to do in normal load, only in editor mode !!
	};

	/* Method: drawProgressbar
		Draw the progressbar according to its status given in parameter

		Parameters:
			CurrentFrame - Which frame are we on ?
			TotalFrame - How many frame there are*/
	this.drawProgressbar = function(CurrentFrame,TotalFrame){
		if(CurrentFrame <= TotalFrame && CurrentFrame > 0) // filter out invalid input
		{
			this.CanvasProgressbar.attr('width',this.CanvasProgressbar.width());
			this.ContextProgressbar.beginPath();
			this.ContextProgressbar.rect(0,0,parseInt((CurrentFrame/TotalFrame)*100,10),24);
			this.ContextProgressbar.fillStyle= 'gray';
			this.ContextProgressbar.fill();
			this.ContextProgressbar.closePath();
		}
	};

	/* Method: drawWhiteBorder
		Draw a TGM-like white pixel around inactive blocks in the whole playfield.

		Parameter:
			playfield - the playfield on which to draw the white border*/
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
	/* Method: drawLocalWhitePixel
		Draw a TGM-like white pixel around in an empty case.

		Parameters:
			playfield - the playfield on which to draw the white border
			x - x coordinate, in block unit
			y - y coordinate, in block unit*/
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


	/* Method: drawGrid
		Draw a block sized grid on the background layer, for no particular reason
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

	/* Method: drawBorder
		Draws the Tetrion (the playfield's border).

		Parameter:
		kind - define what kind of tetrion you want. Currently supported: 'master' (gray-bluish), 'easy' (green) and 'death' (red). Defaults to master if none is selected*/
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

	/* Method: drawNextHold
		Draws a part of the next or holded piece.

		Parameter:
		position - define which position will be modified. 0 is hold, 1 is the next1 piece, 2 is the next2 piece, ...
		type - type of the tetraminmo */
	this.drawNextHold = function(position,type){
		matrix = getMatrix(type, 'i', 'ARS'); // TODO: make that rotation system idenpendant ?

		switch(position){
		case 0:
			this.ContextNextHold.clearRect(0,this.blockSize+3,4*this.blockSize,3*this.blockSize);
			if(!type)
				{return;}
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j]) {

					//this.ContextNextHold.clearRect(this.CanvasNextHold.offset().left);
						this.drawBlock(parseInt(-1+j,10),parseInt(2+i,10),type,'ARS','nextholdmini');
					}
				}
			}
		break;

		case 1:
			this.ContextNextHold.clearRect(4*this.blockSize,this.blockSize+3,4*this.blockSize,3*this.blockSize);
			if(!type)
				{return;}
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j]) {
						this.drawBlock(parseInt(3+j,10),parseInt(0+i,10),type,'ARS','nexthold');
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
						this.drawBlock(parseInt(13+j,10),parseInt(3+i,10),type,'ARS','nextholdmini');
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
						this.drawBlock(parseInt(17+j,10),parseInt(3+i,10),type,'ARS','nextholdmini');
					}
				}
			}
		break;
		}
		// ToDo: what happens when nextArray.length > 3 ? (i.e. more next than 3)

	};
	/* Method: changeActiveOpacity
		Change the opacity of the active layer.

		Parameter:
		level - a number between 0 and 1 (alternatively, 'flash' can be used instead of '1.0') */
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

	/* Method: drawDeco
		Draws a decoration at the designated coordinate.*/
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
	/* Method: drawBrowserBlock
		Draws a block in the playfield browser (that nifty thing from tages)

		Same parameter as drawBlock !
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


	/* Method: drawBlock
		Draw one block on a given layer, relative to the origin and using a block-length as unit.

		Parameters:
		x - horizontal coordinate
		y - vertical coordinate
		type - define the color of the block to be drawn
		RS - define the style of the block
		context - define on which layer the block will be drawn*/
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

	/*Method: highlight
		Highlight one block. Currently draw an expanding circle.

		Parameters:
		x - x coordinate
		y - y coordinate*/
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

	/*Method: resetJoystick
		Draw the joystick in rest position*/
	this.resetJoystick = function(){
		var height = this.CanvasControl.height();
		this.ContextControl.clearRect(0,0,height,height);
		this.drawJoystick('all','rest');
	};

	/*Method: drawJoystick
		Draw the joystick

		Parameters:
		direction - 'all', 'u', 'r', 'l', 'd', 'ul', 'ur', 'dl', 'dr' ... corresponds to the joystick movement
		state - 'rest', 'pressed' or 'holded'*/
	this.drawJoystick = function(direction,state){
		var height = this.CanvasControl.height();
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
					this.ContextControl.moveTo(height/3, height/3);
					this.ContextControl.lineTo(2*height/3,height/3);
					this.ContextControl.lineTo(height/2,0);
					this.ContextControl.closePath();
					break;
				case 'r':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(2*height/3, height/3);
					this.ContextControl.lineTo(2*height/3,2*height/3);
					this.ContextControl.lineTo(height,height/2);
					this.ContextControl.closePath();
					break;
				case 'd':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(2*height/3,2*height/3);
					this.ContextControl.lineTo(height/3,2*height/3);
					this.ContextControl.lineTo(height/2,height);
					this.ContextControl.closePath();
					break;
				case 'l':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(height/3,2*height/3);
					this.ContextControl.lineTo(height/3,height/3);
					this.ContextControl.lineTo(0,height/2);
					this.ContextControl.closePath();
					break;
				case 'ul':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(0+height/8,0+height/8);
					this.ContextControl.lineTo(height/4+height/8,0+height/8);
					this.ContextControl.lineTo(0+height/8,height/4+height/8);
					this.ContextControl.closePath();
					break;
				case 'ur':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(height-height/8,height/8);
					this.ContextControl.lineTo(height-height/8,height/4+height/8);
					this.ContextControl.lineTo(height-height/4-height/8,0+height/8);
					this.ContextControl.closePath();
					break;
				case 'dr':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(height-height/8,height-height/8);
					this.ContextControl.lineTo(height-height/8,height-height/4-height/8);
					this.ContextControl.lineTo(height-height/4-height/8,height-height/8);
					this.ContextControl.closePath();
					break;
				case 'dl':
					this.ContextControl.beginPath();
					this.ContextControl.moveTo(0+height/8,height-height/8);
					this.ContextControl.lineTo(0+height/8,height-height/4-height/8);
					this.ContextControl.lineTo(height/4+height/8,height-height/8);
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
	/*Method: drawAllButtons
		Draw all the button in a particular state

		Parameters:
		state - 'rest', 'pressed' or 'holded'
		layout - (not used at the moment; TODO: allow alternative button layout)*/
	this.drawAllButtons = function(state,layout){
		this.drawButton('A',state);
		this.drawButton('B',state);
		this.drawButton('C',state);
		this.drawButton('D',state);

		//this.drawButton('E',state);
		//this.drawButton('F',state);
	};
	/*Method: drawButton
		Draw a joystick button in a particular state.

		Parameters:
		button - 'A', 'B', 'C', 'D' for now
		state - 'rest', 'pressed' or 'holded'*/

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

	/*Method: frameCount
		Update the html part of the frame counter

		Parameters:
		cur - current frame number
		tot - total frame number*/

	this.frameCount = function(cur,tot){

		$('#'+CanvasIDString+'-current-frame').attr('value',cur);
		$('#'+CanvasIDString+'-total-frame').html(tot);

	};

	/*Method: generateNewPreviewTable
		Generate the browser thingy from tages. TODO: NOT WORKING AT THE MOMENT
		Also: WHY IS THIS ON THE MAIN FUMEN JS FILE AND NOT IN INTERFACE ??!

		Parameters:
		id - frame id
		position - where to draw*/

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

	/*Method: deletePreviewTable
		Delete a browser playfield table. TODO: NOT WORKING AT THE MOMENT

		Parameters:
		cur - current frame number
		tot - total frame number*/

	this.deletePreviewTable = function(id,position){
		//console.log(id);
		console.log('position: '+position);
		//$('#browser #preview-container > td:nth-child('+parseInt(position+1)+')').remove();
		$('#browser #preview-container > td:nth-child('+parseInt(position+1,10)+')').remove();
	};

	/*Method: exportImage
		Export the current frame into a png image
		*/

	this.exportImage = function(){
		this.CanvasExport.attr('width',this.CanvasExport.width());
		var buffer = document.createElement('canvas');
		buffer.width = this.CanvasWidth;
		buffer.height = this.CanvasHeight;

		this.ContextExport.drawImage(this.CanvasBorder[0],0,0);
		var imgData_PF = this.ContextPF.getImageData(0,0,this.CanvasWidth,this.CanvasHeight);
		var tmp = 0;
		for(var i=0, istop = imgData_PF.data.length ; i<istop ; i+=4)
		{
			imgData_PF.data[i+3]=parseInt(255*0.65,10); // get 0.65 opacity,
			tmp = imgData_PF.data[i] + imgData_PF.data[i+1] + imgData_PF.data[i+2];

			if(!tmp)
			{
				imgData_PF.data[i+3]= 0; // if black pixel -> transparent
			}
			tmp = 0;

		}
		buffer.getContext('2d').putImageData(imgData_PF,0,0);
		this.ContextExport.drawImage(buffer,0,0);
		this.ContextExport.drawImage(this.CanvasActive[0],0,0);
		this.ContextExport.drawImage(this.CanvasWhiteborder[0],0,0);
		this.ContextExport.drawImage(this.CanvasDeco[0],0,0);
	};
} // end painter -------------------------------------------------------------------------------

/*
	+++--------------------------------------------------------------+
	¦¦¦	Class: Diagram
	¦¦¦	Diagram stores <frame>s and manipulate them.
	¦¦¦	It receives command from the html and gives order to the
	¦¦¦	underlying frame or directly to the painter
	¦¦¦	It acts a bit like a model in a MVC model.
	¦¦¦
	¦¦¦ >						+-----------------------+
	¦¦¦ >						V						¦
	¦¦¦ >	Canvas/html <-- <Painter> <-- <Frame> <-- <Diagram>
	¦¦¦ >			¦								   ^^^^^^^^
	¦¦¦ >			¦									   ^
    ¦¦¦ >			+--------------------------------------+
	¦¦¦
	¦¦¦ Parameter:
	¦¦¦		painter - a reference to its associated painter
	+++--------------------------------------------------------------+
*/

function Diagram(painter){
	var myself = this;
	this.painter = painter;
	this.frames = [];
	this.current_frame = 0;
	this.playing = false;
	/* Method: init
		Initialize the frames array.*/
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

	/* Method: new_frame
		Adds a new frame after the current one and displays it.
		>	[Sophie] {Elisa} [Therese] [Claire]
		>					^
		>				[Jeanne]
		>	=>
		>	Sophie Elisa Jeanne Therese Claire*/
	this.new_frame = function(){
		this.current_frame++;
		this.painter.eraseLayer('all');
		this.frames.splice(this.current_frame,0,new Frame(this.painter)); //inject a new frame after the current frame (modify at position current_frame, remove nothing, add new frame)
		//this.painter.generateNewPreviewTable(this.frames[this.current_frame].id,this.current_frame);
		this.update_framecount();
	};

	/* Method: new_copy_frame
		Makes a new frame based on the current frame*/
	this.new_copy_frame = function(){
		//this.frames.push(jQuery.extend(true, {}, this.frames[this.current_frame])) // deep copy the current frame
		var saved_frame = this.frames[this.current_frame].print();
		this.new_frame();
		this.frames[this.current_frame].load(saved_frame,'blank');
	};

	/* Method: remove_current_frame
		Remove the current frame from existence*/
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

	/* Method: remove_following_frames
		Remove every frame after the current one. Analogous to 'remove following' in fumen.
		*/
	this.remove_following_frames = function(){
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

	/* Method: remove_all_playfields
		Nukes everything !*/
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

	/* Method: goto_frame
		Erase everything, paint what's on the given frame number

		Parameter:
		frame_number - the frame number
		*/
	this.goto_frame = function(frame_number){
		this.painter.eraseLayer('all');
		this.current_frame = frame_number;
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/* Method: first_frame
		Switches the current frame to the first one, displays it.*/
	this.first_frame = function(){
		this.painter.eraseLayer('all');
		this.current_frame = 0;
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/* Method: previous_frame
		Switches the previous frame to the previous one, displays it.*/
	this.previous_frame = function(){
		if(this.current_frame > 0)
		{
			this.painter.eraseLayer('all');
			this.current_frame--,
			this.frames[this.current_frame].draw();
			this.update_framecount();
		}
	};

	/* Method: next_frame
		Switches the current frame to the next one, displays it.*/
	this.next_frame = function(){
				this.painter.eraseLayer('all');
				this.current_frame++,
				this.frames[this.current_frame].draw();
				this.update_framecount();
	};

	/* Method: last_frame
		Switches the current frame to the last one, displays it.*/
	this.last_frame = function(){
		this.painter.eraseLayer('all');
		this.current_frame = parseInt(this.frames.length-1,0); // http://nicolaasmatthijs.blogspot.com/2009/05/missing-radix-parameter.html
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};

	/* ----------------------------------- */
	/* -- Frames-wide properties change -- */
	/* ----------------------------------- */

	/* Method: change_border TODO: MOVE TO TEDIGE-EDITOR.JS
		Changes the border of the diagram.*/
	this.modify_border = function(kind){
		for(var i=0, istop = this.frames.length ; i<istop ;i++)
		{
			this.frames[i].border = kind;
		}
		this.frames[this.current_frame].modify_border = kind;
	};

	/* Method: modify_RS TODO: MOVE TO TEDIGE-EDITOR.JS
		Change the rotation system for the whole diagram
		*/
	this.modify_RS = function(system){
		for(var i=0, istop = this.frames.length ; i<istop ;i++)
		{
			this.frames[i].RS = system;
		}
		this.frames[this.current_frame].modify_RS(system);
	};
	/* Method: modify_whiteborder TODO: MOVE TO TEDIGE-EDITOR.JS
		Change the rotation system for the whole diagram
		*/
	this.modify_whiteborder = function(value){
		for(var i=0, istop = this.frames.length ; i<istop ;i++)
		{
			this.frames[i].whiteborder = value;
		}
		this.frames[this.current_frame].modify_whiteborder(value);
	};

	/* Method: modify_duration TODO: MOVE TO TEDIGE-EDITOR.JS
		Change the duration of each frame of a diagram
		*/
	this.modify_duration = function(new_duration){
		for(var i=0, istop = this.frames.length ; i<istop ;i++)
		{
			this.frames[i].duration = new_duration;
		}
	};

	/* Method: update_framecount
		Update the displayed frame index..*/
	this.update_framecount = function(){
		this.painter.frameCount(this.current_frame+1, this.frames.length);
		this.painter.drawProgressbar(this.current_frame+1,this.frames.length);
	};

	/* ------------------------- */
	/* -- Save/Load and stuff -- */
	/* ------------------------- */

	/*Method: print
		Print the diagram

		Returns:
		A string encoded with the format described below*/
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


	/* Method: print_differences
		Return the differences between two frames in a formatted string.
		WARNING: if you modify that, please also modify Frame.print

		Parameters:
			reference_frame - reference frame number
			final_frame - final frame number

		Returns:
			A string encoded with the format described below.
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
			switch(this.frames[final_frame].joystick_direction)
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
			switch(this.frames[final_frame].joystick_state)
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
					tmp += '6';
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
				if(this.nexthold[i])
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

	/*Method: load TODO: MOVE TO TEDIGE-EDITOR.JS
		Load the encoded string given in parameter into the diagram

		Parameter:
		str - A string encoded with the format described below*/
	this.load = function(str){
		if(!str){return;} // check if there's nothing
		this.remove_all_playfields();
		this.current_frame = 0;
		this.update_framecount();
		var stringframe = str.split('+');

		this.frames[0].load(stringframe[0],'blank'); // load the first frame
		for(var i = 1, istop = stringframe.length; i < istop; i++) { // load the subsequent frame, if they exist
			this.painter.eraseLayer('all');
			this.new_copy_frame();
			this.frames[i].load(stringframe[i],'differences'); // load the first frame
		}
		this.frames[this.current_frame].draw();
		this.update_framecount();
	};
// TODO: implement this http://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf
// ... using this ? https://github.com/antimatter15/jsgif
	//TODO: MOVE TO TEDIGE-EDITOR.JS
	this.flate_encode = function (str) {
    return $.base64.encode(RawDeflate.deflate(unescape(encodeURIComponent(str))));
	};

	//TODO: MOVE TO TEDIGE-EDITOR.JS
	this.flate_decode = function(str) {
    return decodeURIComponent(escape(RawDeflate.inflate($.base64.decode(str))));
	};

	//TODO: MOVE TO TEDIGE-EDITOR.JS
	this.getGIF = function(){
	 var encoder = new GIFEncoder();
	 encoder.setRepeat(0); // sets an infinite loop
	 encoder.setDelay(500); // frame rate in ms... maybe I should try to patch this and get a variable rate ?
	 encoder.start();
	 encoder.setQuality(10);
	 for(var i=0, istop = this.frames.length ; i<istop ;i++)
		{
		this.goto_frame(i);
		this.painter.exportImage();
		encoder.addFrame(this.painter.ContextExport);
		}
	 encoder.finish();
	 var binary_gif = encoder.stream().getData();
	document.getElementById('export-gif').src = 'data:image/gif;base64,'+$.base64.encode(encoder.stream().getData());
	};

} // end Diagram -------------------------------------------------------------------------------


/*
	+++--------------------------------------------------------------+
	¦¦¦	Class: Frame
	¦¦¦	Frame stores the playfield, the active piece and everything
	¦¦¦	needed to describe a single frame of the game.
	¦¦¦	It receives command from Diagram and calls painter to update
	¦¦¦	the display.
	¦¦¦
	¦¦¦ >						+-----------------------+
	¦¦¦ >						V						¦
	¦¦¦ >	Canvas/html <-- <Painter> <-- <Frame> <-- <Diagram>
	¦¦¦ >			¦					  ^^^^^^^
	¦¦¦ >			¦									   ^
    ¦¦¦ >			+--------------------------------------+
	¦¦¦
	¦¦¦ Parameter:
	¦¦¦		painter - a reference to its associated painter
	+++--------------------------------------------------------------+
*/

var GLOBAL_FRAME_COUNTER = 0;

function Frame(painter){
	var myself = this;
	GLOBAL_FRAME_COUNTER++;
	this.id = GLOBAL_FRAME_COUNTER;
	this.painter = painter;
	this.height = 20;
	this.width = 10;
	this.RS = 'ARS';
	this.border = 'Master';
	this.whiteborder = false;
	this.playfield = [];// Initialization of the playfield table; first coord = x; second = y;
	this.activePieceType = '';
	this.activePieceOrientation = '';
	this.activePiecePositionX = '';
	this.activePiecePositionY = '';
	this.activePieceOpacity = 1.0;
	this.duration = 15; // frame duration, in frame (== 1/60 s)
	this.nexthold = ['','','',''];
	this.joystick_direction = 'c';
	this.joystick_state = 'rest';
	this.button_state = ['rest','rest','rest','rest','rest','rest'];
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

	/* --------------------------- */
	/* -- Modifications (basic) -- */
	/* --------------------------- */

	// TODO: move everything to tedige-editor.js
	
	/* Method: modify
		Modify the inactive layer.
		Parameters:
			x - horizontal coordinate
			y - vertical coordinate
			type - type of the block*/
	this.modify = function(x,y,type){
		if (type == 'E')
		{
			this.playfield[x][y][0] = '';
		}
		else
		{
			this.playfield[x][y][0] = type;
		}
			this.painter.drawBrowserBlock(x,y,type,this.RS,this.id,'inactive'); // I hope putting this here won't have any nasty side-effect
	};

	/*Method: removeBlock
		Empties a block at the given coordinate.
		Parameters:
			x - horizontal coordinate
			y - vertical coordinate
	*/
	this.removeBlock = function(x,y){
		this.playfield[x][y][0] = '';
		this.painter.eraseBlock(x,y);
		this.painter.drawBrowserBlock(x,y,'E',this.RS,this.id); // I hope putting this here won't have any nasty side-effect
		if (this.whiteborder)
		{
			this.painter.drawLocalWhiteBorder(this.playfield,x,y,'inactive');
		}

	};

	/*Method: removeBlock
		Empties a block at the given coordinate.
		Parameters:
			x - horizontal coordinate
			y - vertical coordinate
	*/
	this.removeDeco = function(x,y){
		this.painter.drawDeco(x,y,this.playfield[x][y][1],'eraser');
		this.playfield[x][y][1] = '';
	};


	/*Method: modify_decoration
		Modify the decoration layer.
		Parameters:
			x - horizontal coordinate
			y - vertical coordinate
			type - type of the block*/
	this.modify_decoration = function(x,y,type){
		this.playfield[x][y][1] = type;
	};

	/*Method: modify_next
		Modify the next pieces.

		Parameters:
			position - the piece to be modified. '0' is hold, '1' is next1, '2' is next2, ...
			type - the piece type
		*/
	this.modify_nexthold = function(position,type){
		this.nexthold[position] = type;
	};

	/*Method: modify_next DEPRECATED
		Modify the next pieces.

		Parameters:
			position - the piece to be modified. '1' is next1, '2' is next2, ...
			type - the piece type
		*/
	this.modify_next = function(position,type){
		this.nexthold[position] = type;
		this.painter.drawNext(this.nexthold);
	};

	/*Method: modify_hold
		Modify the holded piece.

		Parameters:
			type - the piece type
	*/
	this.modify_hold = function(type){
		this.nexthold[0] = type;
		this.painter.drawNext(this.nexthold);
	};

	/*Method: modify_hold
		Modify the holded piece.

		Parameters:
			type - the piece type
	*/
	this.modify_AP_opacity = function(level){
		this.activePieceOpacity = level;
		this.painter.changeActiveOpacity(level);
		if (level == 'Flash' || level == 'flash')
		{
		  this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,'Flash',false);
		}

	};


	/* Method: clear
		Erase and delete one layer.

		Parameter:
			mode - define which layer will be cleared. Either 'inactive','active' or 'all'*/
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
			case 'all':
				this.painter.eraseLayer('inactive');
				for(var i = 0, istop = this.width; i < istop; i++) {
					for(var j = 0, jstop = this.height; j < jstop; j++) {
							this.playfield[i][j][0] = '';
						}
				}
				this.painter.eraseLayer('active');
				this.activePieceType = '';
				this.activePieceOrientation = '';
				this.activePiecePositionX = '';
				this.activePiecePositionY = '';
				this.comment = '';
			break;
		}
	};

	/* Method: modify_RS
		Changes the rotation system and call a redraw. */
	this.modify_RS = function(system){
		this.RS = system;
		this.draw();
	};
	/* Method: modify_RS
		Changes the duration of a frame. */
	this.modify_duration = function(new_duration){
		this.duration = new_duration;
	};

	this.modify_border = function(new_border){
		this.border = new_border;
		this.painter.drawBorder(this.border);
	};

	this.modify_whiteborder = function(new_border){
		this.whiteborder = new_border;
		if (this.whiteborder)
		{
			this.painter.drawWhiteBorder(this.playfield);
		}
		else
		{
			this.painter.eraseLayer('whiteborder');

		}

	};

	/*Method: modify_control
		Change the control appearance
		Parameters:
			direction - ul, u, ur, l, r, dl, d, dl
			state - rest, pressed, holded
	*/
	this.modify_control = function(direction,state){
		this.joystick_state = state;
		this.joystick_direction = direction;
		this.painter.drawJoystick(this.joystick_direction,this.joystick_state);
	};

	/*Method: modify_button
		Change the chosen button appearance
		Parameters:
			button - a,b,c,d,e,f
			state - rest, pressed, holded*/
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
		this.painter.drawButton(button,state);
	};

	/* ----------------------------- */
	/* -- Modifications (advanced)-- */
	/* ----------------------------- */

	/*Method: recursive_fill
		Fill the playfield with a piece type, similar to a 'paint bucket' tool. Thanks DigitalDevil for the original code !

		Parameter
			x - x coordinate
			y - y coordinate
			replaced
			replacer
	*/
	this.recursive_fill = function(x,y, replaced, replacer) {
		/**
		*  Fills the playfield like a paint bucket. Thanks Digital !
			todo: bug on click on an already filled ?
		*/

		x = parseFloat(x);
		y = parseFloat(y);

		if (this.playfield[x][y][0] != replaced)
			{return;}

		this.modify(x, y, replacer);
		this.painter.drawBlock(x,y,replacer,this.RS,'inactive');
		if (this.whiteborder)
			{this.painter.drawLocalWhiteBorder(this.playfield,x,y);}

		if (y-1 >= 0)
			{this.recursive_fill(x, y-1, replaced, replacer);}

		if (y+1 < this.height)
			{this.recursive_fill(x, y+1, replaced, replacer);}

		if (x+1 < this.width)
			{this.recursive_fill(x+1, y, replaced, replacer);}

		if (x-1 >= 0)
			{this.recursive_fill(x-1, y, replaced, replacer);}
	};

	/* Method: addPiece
		'Macro' method that modifies several times a given layer according to the tetramino shape given in parameter.

		Parameters:
		x - horizontal coordinate
		y - vertical coordinate
		type - type of the tetramino
		orientation - orientation of the tetramino; either 'i', 'cw', 'ccw' or 'u'
		mode - define which layer will be modified
		drop - is the method is in drop mode ?*/
	this.addPiece = function(x,y,type,orientation,mode,drop){
		var matrix = getMatrix(type, orientation, this.RS);
		var still_droping = true;
		var counter = 0;
		while(drop
				& still_droping ){
			counter = 0;
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (matrix[i][j] &&
						this.is_in(parseInt(x-1+j,10),parseInt(y+i,10)) &&
						!(this.playfield[parseInt(x-1+j,10)][parseInt(y+i,10)][0])
						)
					{
						counter++;
					}
				}
			}
			if (counter != 4) {
				still_droping = false;
			}
			else
			{
				y++;
			}
		}

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
							case 'Flash':
								this.painter.drawBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,'flash');
								this.painter.highlight(x-1+j,y-1+i);
								this.painter.drawBrowserBlock(parseInt(x-1+j,10),parseInt(y-1+i,10),type,this.RS,this.id,'active'); // erase this line to disable the browser thing
							break;
						}
					}
				}
			}
		}

	}; //end drawpiece

	/* ------------- */
	/* -- Utility -- */
	/* ------------- */

	/* Method: is_in
		Check whether a pair of coordinate is in the tetrion or not.

		Parameters:
			x - x coordinate
			y - y coordinate*/
	this.is_in = function(x,y){
		if(x < 0 ||y < 0 || x>=this.width || y>=this.height)
			{return false;}
		return true;
	};

	/*Method: lookup
		Return the block's type at the designated coordinate

		Parameters:
			x - the x coordinate
			y - the y coordinate
		Returns:
			The block's type at the designated coordinate
	*/
	this.lookup = function(x,y){
		return this.playfield[x][y][0];
	};

	/*Method: piece_is_in
		Checks if a given piece would still be in the playfield

		Parameter:
			x - x coordinate
			y - y coordinate
			type - piece type
			orientation - piece orientation
		Returns:
		True or false
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

	/* ------------------------ */
	/* -- Active piece stuff -- */
	/* ------------------------ */

	/* Method paintActivePiece
		'Paint' the active piece into the inactive layer*/
	this.paintActivePiece = function(){
		this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,'inactive',false);
	};

	/* Method lockActivePiece
		Set the active piece variable to zero, paint the active piece*/
	this.lockActivePiece = function(){
		this.paintActivePiece();
		this.activePieceType = '';
		this.activePieceOrientation = '';
		this.activePiecePositionX = '';
		this.activePiecePositionY = '';
		this.activePieceOpacity = 1.0;
		this.painter.eraseLayer('active');

	};
	/* Method dropActivePiece
		Call addPiece at the same coordinate than the current one, only with the drop flag on, effectively dropping the active piece*/
	this.dropActivePiece = function(){
		this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,'active',true);
	};
	/* Method dropActivePiece
		Move the active piece in the given direction by calling addPiece again

		Parameter:

			direction - 'left', 'right', 'up', 'down'
		*/
	this.moveActivePiece = function(direction){
	var posX = this.activePiecePositionX;
	var posY = this.activePiecePositionY;

		switch(direction)
		{
			case 'left':
				posX--;
			break;
			case 'right':
				posX++;
			break;
			case 'up':
				posY--;
			break;
			case 'down':
				posY++;
			break;
		}
		if (this.piece_is_in(posX,posY,this.activePieceType,this.activePieceOrientation))
		{
		  this.addPiece(posX,posY,this.activePieceType,this.activePieceOrientation,'active',false);
		}
	};
	/* Method dropActivePiece
		Rotate the active piece in the given direction by calling addPiece again

		Parameter:

			direction - 'cw', 'ccw'
		*/
	this.rotateActivePiece = function(direction){
	var ori = this.activePieceOrientation;

		switch(direction)
		{
			case 'cw':
				switch(ori)
				{
					case 'i':
						ori = 'cw';
					break;
					case 'cw':
						ori = 'u';
					break;
					case 'u':
						ori = 'ccw';
					break;
					case 'ccw':
						ori = 'i';
					break;
				}
			break;
			case 'ccw':
				switch(ori)
				{
					case 'i':
						ori = 'ccw';
					break;
					case 'ccw':
						ori = 'u';
					break;
					case 'u':
						ori = 'cw';
					break;
					case 'cw':
						ori = 'i';
					break;
				}
			break;

		}
		if (this.piece_is_in(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,ori))
		{
		  this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,ori,'active',false);
		}
	};


	/* ------------------------- */
	/* -- Save/Load and stuff -- */
	/* ------------------------- */

	/* Method: draw // DO NOT MOVE TO TEDIGE-EDITOR
		Draws everything according to what's in memory.

		Parameters:
			exception - an object containing a list of thing to be force-redrawed (because normally it shouldn't be)*/
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
					}
				}
			}
		}

		for(var i=0, istop = this.nexthold.length;i<istop;i++)
		{
			this.painter.drawNextHold(i,this.nexthold[i]);
		}

		if (!(exception && exception.hasOwnProperty(border))) // // http://stackoverflow.com/questions/6075458/performance-differences-between-jquery-inarray-vs-object-hasownproperty
		{
			//this.painter.drawBorder(this.border); // temporary deactivation for performance ; TODO: externalize the border drawing
		}
		if (!(exception && exception.hasOwnProperty(joystick)))
		{
			this.painter.resetJoystick();
			this.painter.drawJoystick(this.joystick_direction,this.joystick_state);
		}
		if (!(exception && exception.hasOwnProperty(buttons)))
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
		if(this.activePieceOpacity == 'Flash')
		{
			this.addPiece(this.activePiecePositionX,this.activePiecePositionY,this.activePieceType,this.activePieceOrientation,'Flash',false);

		}

		this.painter.eraseLayer('whiteborder');
		if (this.whiteborder)
		{
			this.painter.drawWhiteBorder(this.playfield);
		}

	};//end draw

	/*Method: print // DO NOT MOVE TO TEDIGE-EDITOR
		Print a string that describe the playfield.
		WARNING: if you modify that, please also modify diagram.printdifference

		Parameters:
			exception - an object containing a list of things of facultative or over-repetitive element (like RS)(todo:  ?? NOT IMPLEMENTED YET)*/

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
				tmp += '6';
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
							else if( k == parseFloat(candidate_case.length-1)) // Nope. Was it the last type tested ?
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

	/*Method: load
	Load the playfield from a descriptive string.

	Parameters:
		str - the descriptive string
		format - either nothing or 'differences'*/

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
						this.activePieceType = subproperties[1].charAt(0);
						this.activePieceOrientation = subproperties[1].slice(3);
						this.activePiecePositionX = alphanumconvert(subproperties[1].charAt(1));
						this.activePiecePositionY = alphanumconvert(subproperties[1].charAt(2));
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
						case '6':
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



}//end frame

/*Routine: ARS
	Define the pieces orientation and their color.*/

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
		}// end rs
		return matrix;

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