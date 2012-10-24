$(document).ready(function(){
	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */
	/* --------------------------- GLOBAL STUFF -------------------------------- */
	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */

	// Default state for the tetramino selection
	$('input[type=radio][name="select"][value=Ii]').attr('checked',true);
	$('input[type=radio][name="editor-tab"][value=inactive]').attr('checked',true);
	// Interface global constant
	var IS_CLICKING;
	// current tools:
	var TOOL_DROP = false;
	var TOOL_FILL = false;
	var TOOL_RECTANGULAR = false;
	var TOOL_PENCIL = false;
	var TOOL_ERASER = false; // todo: use hidden checkbox instead
	var TOOL_ERASER_DECO = false;
	// current panel
	var	DECORATION_PANEL = false;
	var	TETRAMINO_PANEL = true;
	var APCONTROL_PANEL = false;

	// initialization of the system
	var aPainter = new Painter('pf');
	var aDiag = new Diagram(aPainter);
	aDiag.init();
	aPainter.init();

	var initiator = setInterval(function(){
		if(aPainter.ready) {
			clearInterval(initiator);
			drawPalette('ARS',8,aPainter.sprite);
			drawPaletteDeco(8,aPainter.spritedeco);
			var URLsearch = window.location.search;
			if(URLsearch) // load if there's something in the url
			{
				$('#import').val(URLsearch);
				$('#import-button').click();
			}
			//aDiag.frames[0].addPiece(2,3,'L','i','inactive');
			//aDiag.new_copy_frame();
			//aDiag.frames[1].addPiece(7,8,'T','u','inactive');
			//aDiag.frames[1].addPiece(5,6,'S','ccw','inactive');
			//aDiag.frames[0].load('I~Ibdbebfbgbhcedfeefdfefffgfh~Sgdgdgegfggghhdhfhhidihjdjh_');
			//aDiag.frames[1].load('N~ISZ_J~p8_C~rhhp_I~Tadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Shdhdhehfhhidifihjdjfjgjh_');
			//aDiag.new_frame();
			//aDiag.frames[2].load('N~JJZ_J~p8_C~rhpr_I~Sadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Ihdhdhehfhhidifihjdjfjgjh_');
			//aDiag.frames[2].draw();
		}
	},10);



	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */
	/* --------------------------- MOUSE MANAGEMENT  --------------------------- */
	/* ------------------------------------------------------------------------- */
	/* ------------------------------------------------------------------------- */


	/*Event: CanvasPreview.mousemove
		Manages the move event on the outermost canvas*/
	aDiag.painter.CanvasPreview.mousemove(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		// this.PFOriginX,this.PFOriginY, 10*this.block, 20*this.block
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
				mouseY < aDiag.painter.PFOriginYAbsolute){}

			// if the mouse is in the playfield
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
				mouseY > aDiag.painter.PFOriginYAbsolute && mouseY <= aDiag.painter.PFOriginYAbsolute+(20*aDiag.painter.blockSize))
			{
				var pfX = parseInt(Math.floor((mouseX - aDiag.painter.PFOriginXAbsolute)/aDiag.painter.blockSize),10);
				var pfY = parseInt(Math.floor((mouseY - aDiag.painter.PFOriginYAbsolute)/aDiag.painter.blockSize),10);
				aDiag.painter.eraseLayer('preview'); //erase the preview layer
				// depending on the current active panel...
				if(TETRAMINO_PANEL)
				{
					//console.log('['+mouseX+','+mouseY+']');
					//console.log('['+pfX+','+pfY+']');
					var extract = $('input[type=radio][name=select]:checked').attr('value');
					var type = extract.charAt(0);
					var orientation = extract.slice(1);
					var mode = '';
					// set the right mode
					if ($('#checkbox-active').is(':checked'))
						{mode ='active';}
					// set the right mode
					else
						{mode='inactive';}
					if ($('#checkbox-garbage').is(':checked'))
						{mode ='garbage';}

					if (IS_CLICKING)
						{
							//aDiag.painter.highlight(pfX,pfY);
							if (TOOL_PENCIL)
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,'singleton',mode,TOOL_DROP);}
							else if (TOOL_ERASER)
								{aDiag.frames[aDiag.current_frame].removeBlock(pfX,pfY);}
							else
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);}
						}
					else
						{
							if (TOOL_ERASER)
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,'G','singleton','preview',TOOL_DROP);}
							else if(TOOL_FILL || TOOL_PENCIL)
								{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,'singleton','preview',TOOL_DROP);}
							else
							{
								if (type == 'I') { //offset I so it doesn't look weird on mouseover
									aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,'preview',TOOL_DROP);}
								else
									{aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,'preview',TOOL_DROP);}
							}
						}
				}
				else
				{
				aDiag.painter.eraseLayer('preview'); //erase the preview layer
					if(TOOL_ERASER_DECO){
					aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,'G','singleton','preview',TOOL_DROP);
					}
					else
					{
						var extract = $('input[type=radio][name="select-deco"]:checked').attr('value');
						aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,extract,'singleton','decoration-preview',false);

					}

				}
			}
	//var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
	//console.log("( e.clientX, e.clientY ) : " + clientCoords);
	});// CanvasPreview.mousemove

	/*Event: CanvasPreview.click
	Manages the click event on the outermost canvas*/
	aDiag.painter.CanvasPreview.mousedown(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
			if(mouseX > aDiag.painter.PFOriginXAbsolute && mouseX <= aDiag.painter.PFOriginXAbsolute+(10*aDiag.painter.blockSize) &&
				mouseY > aDiag.painter.PFOriginYAbsolute && mouseY <= aDiag.painter.PFOriginYAbsolute+(20*aDiag.painter.blockSize))
			{
				var pfX = parseInt(Math.floor((mouseX - aDiag.painter.PFOriginXAbsolute)/aDiag.painter.blockSize),10);
				var pfY = parseInt(Math.floor((mouseY - aDiag.painter.PFOriginYAbsolute)/aDiag.painter.blockSize),10);
					//aDiag.painter.highlight(pfX,pfY);
				if(TETRAMINO_PANEL)
				{
					var extract = $('input[type=radio][name="select"]:checked').attr('value');
					var type = extract.charAt(0);
					var orientation = extract.slice(1);
					var mode = '';


					if ($('#checkbox-active').is(':checked'))
					{
						mode ='active';
					}
					else{
						mode='inactive';
					}

					if ($('#checkbox-garbage').is(':checked'))
						{
						mode ='garbage';
						}


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
							aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,'singleton',mode,TOOL_DROP);
						}
						else if (TOOL_ERASER)
						{
							aDiag.frames[aDiag.current_frame].removeBlock(pfX,pfY);
						}
						else
						{
							if (type == 'I') { //offset I so it doesn't look weird on mouseover
								if(aDiag.frames[aDiag.current_frame].lookup(pfX,pfY)) // erase on occucupied case here
								{
									aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,'erase',TOOL_DROP);
									console.log('ierase');
								}
								else
								{
								aDiag.frames[aDiag.current_frame].addPiece(parseInt(pfX-1,10),pfY,type,orientation,mode,TOOL_DROP);

									console.log('iwrite :'+type);
								}
							}
							else
							{
								if(aDiag.frames[aDiag.current_frame].lookup(pfX,pfY))  // erase on occucupied case here
								{
									aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,'erase',TOOL_DROP);
									console.log('erase');
								}
								else
								{
									console.log('write');
								aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,type,orientation,mode,TOOL_DROP);
								}
							}
						}

				}
			else // aka if(DECORATION_PANEL)
			{
				if(TOOL_ERASER_DECO)
				{
					aDiag.frames[aDiag.current_frame].removeDeco(pfX,pfY);
				}
				else
				{
				var extract = $('input[type=radio][name="select-deco"]:checked').attr('value');
				aDiag.frames[aDiag.current_frame].addPiece(pfX,pfY,extract,'singleton','decoration',false);
				//aDiag.frames[aDiag.current_frame].drawDeco(pfX,pfY,extract);
				}
			}
		}
	});//end CanvasPreview.mousedown

	/*Event: CanvasControl.click
	Manages the click event on the joystick visualisation canvas*/
	aDiag.painter.CanvasControl.mousedown(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		var height = aDiag.painter.CanvasControl.height();
		var direction;
		if (mouseX < height + aDiag.painter.CntrlOriginX) // that if separates the joystick and the button
		{
			if (mouseX < aDiag.painter.CntrlOriginX + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height/3)
			{
				//ul
				direction = 'ul';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + height/3 &&
				mouseX < aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height/3)
			{
				//u
				direction = 'u';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseX < aDiag.painter.CntrlOriginX + height &&
				mouseY < aDiag.painter.CntrlOriginY + height/3)
			{
				//ur
				direction = 'ur';
			}

			if (mouseX < aDiag.painter.CntrlOriginX + height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + 2*height/3)
			{
				//l
				direction = 'l';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + height/3 &&
				mouseX < aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + 2*height/3)
			{
				//center
				aDiag.painter.resetJoystick();
				aDiag.frames[aDiag.current_frame].modify_control('c','rest');
				return;
			}


			if (mouseX > aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + 2*height/3)
			{
				//r
				direction = 'r';
			}


			if (mouseX < aDiag.painter.CntrlOriginX + height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height)
			{
				//dl
				direction = 'dl';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height)
			{
				//d
				direction = 'd';
			}

			if (mouseX > aDiag.painter.CntrlOriginX + 2*height/3 &&
				mouseY > aDiag.painter.CntrlOriginY + 2*height/3 &&
				mouseY < aDiag.painter.CntrlOriginY + height)
			{
				//dr
				direction = 'dr';
				//aDiag.painter.drawJoystick('dr','holded')
			}

			if (direction != aDiag.frames[aDiag.current_frame].joystick_direction)
			{
				aDiag.painter.resetJoystick();
				aDiag.frames[aDiag.current_frame].modify_control(direction,'pressed');
			}
			else
			{
				switch(aDiag.frames[aDiag.current_frame].joystick_state)
				{
				case 'rest':
					aDiag.painter.resetJoystick();
					aDiag.frames[aDiag.current_frame].modify_control(direction,'pressed');
				break;
				case 'pressed':
					aDiag.painter.resetJoystick();
					aDiag.frames[aDiag.current_frame].modify_control(direction,'holded');
				break;
				case 'holded':
					aDiag.painter.resetJoystick();
					aDiag.frames[aDiag.current_frame].modify_control(direction,'rest');
				break;
				default: break;
				}
			}

		} // end joystick

		if (mouseX > height + aDiag.painter.CntrlOriginX) //buttons
		{
			var radius = height/5;
			var button = '';
			var index = '';

			if(mouseX < height+height/4+radius + aDiag.painter.CntrlOriginX &&
				mouseY < height/4+radius + aDiag.painter.CntrlOriginY)
			{
				//A
				button = 'A';
			}
			if(mouseX > height+height/4+2*radius+height/16-radius + aDiag.painter.CntrlOriginX &&
				mouseX < height+height/4+2*radius+height/16+radius + aDiag.painter.CntrlOriginX &&
				mouseY < height/4+radius + aDiag.painter.CntrlOriginY)
			{
				// B
				button = 'B';
			}
			if(mouseX > height+height/4+4*radius+2*height/16-radius + aDiag.painter.CntrlOriginX&
				mouseX < height+height/4+4*radius+2*height/16+radius + aDiag.painter.CntrlOriginX&
				mouseY < height/4+radius + aDiag.painter.CntrlOriginY)
			{
				// C
				button = 'C';
			}

			if(mouseX < height+height/4+radius + aDiag.painter.CntrlOriginX &&
				mouseY > 3*height/4-radius + aDiag.painter.CntrlOriginY)
			{
				// D
				button = 'D';
			}
			/*
			if(mouseX > height+height/4+2*radius+height/16-radius + aDiag.painter.CntrlOriginX &&
				mouseX < height+height/4+2*radius+height/16+radius + aDiag.painter.CntrlOriginX &&
				mouseY > 3*height/4-radius + aDiag.painter.CntrlOriginY)
			{
				// E
				button = 'E';
			}
			if(mouseX > height+height/4+4*radius+2*height/16-radius + aDiag.painter.CntrlOriginX&
				mouseX < height+height/4+4*radius+2*height/16+radius + aDiag.painter.CntrlOriginX&
				mouseY > 3*height/4-radius + aDiag.painter.CntrlOriginY)
			{
				// F
				console.log ('F');
			}
			*/

			switch(button)
			{
				case 'A': index = 0; break;
				case 'B': index = 1; break;
				case 'C': index = 2; break;
				case 'D': index = 3; break;
				case 'E': index = 4; break;
				case 'F': index = 5; break;
			}
			switch(aDiag.frames[aDiag.current_frame].button_state[index])
			{
				case 'pressed':
					aDiag.frames[aDiag.current_frame].modify_button(button,'holded');
					break;
				case 'holded':
					aDiag.frames[aDiag.current_frame].modify_button(button,'rest');
					break;
				case 'rest':
					aDiag.frames[aDiag.current_frame].modify_button(button,'pressed');
					break;
			}
		}//end buttons



		// aDiag.painter.CntrlOriginX;
		// aDiag.painter.CntrlOriginY;

	});//end CanvasControl.click


	/*Event: CanvasNextHold.click
	Manages the click event on the next & hold canvas*/
	aDiag.painter.CanvasNextHold.click(function(e){
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		//console.log('['+mouseX+','+mouseY+']');
		//var pfX = parseInt(Math.floor((mouseX)/aDiag.painter.blockSize),10);
		//var pfY = parseInt(Math.floor((mouseY)/aDiag.painter.blockSize),10);
		var pfX = parseInt(1+((mouseX - aDiag.painter.CanvasNextHold.offset().left)/aDiag.painter.blockSize),10);
		var pfY = parseInt(1+((mouseY - aDiag.painter.CanvasNextHold.offset().top)/aDiag.painter.blockSize),10);
		var extract = $('input[type=radio][name=select]:checked').attr('value');
		var type = extract.charAt(0);
		if (pfX >= 0 && pfX < 4) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[0])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(0,type);
				aDiag.painter.drawNextHold(0,type);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(0,'');
				aDiag.painter.drawNextHold(0,'');
			}

		}
		if (pfX >= 4 && pfX < 8) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[1])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(1,type);
				aDiag.painter.drawNextHold(1,type);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(1,'');
				aDiag.painter.drawNextHold(1,'');
			}
		}
		if (pfX >= 8 && pfX < 11) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[2])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(2,type);
				aDiag.painter.drawNextHold(2,type);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(2,'');
				aDiag.painter.drawNextHold(2,'');
			}
		}
		if (pfX >= 11) {
			if(!aDiag.frames[aDiag.current_frame].nexthold[3])
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(3,type);
				aDiag.painter.drawNextHold(3,type);
			}
			else
			{
				aDiag.frames[aDiag.current_frame].modify_nexthold(3,'');
				aDiag.painter.drawNextHold(3,'');
			}
		}

	}); //end CanvasNextHold.click

	/* ------------------------------------------------------------------------- */
	/* --------------------------- BUTTON MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */

	$('#pf-current-frame').blur(function(){
		if ($('#pf-current-frame').val() > 0 && $('#pf-current-frame').val() <= aDiag.frames.length)
		{aDiag.goto_frame(parseInt($('#pf-current-frame').val()-1,10));}

	});

	$('#pf-comment').blur(function(){
		aDiag.frames[aDiag.current_frame].comment = $(this).val();
	});

	$('#pf-duration').blur(function(){
		aDiag.frames[aDiag.current_frame].duration = parseFloat($(this).val());
	});

	$('#pf-active-opacity').blur(function(){
		aDiag.frames[aDiag.current_frame].modify_AP_opacity($(this).val());
	});


	$('#cmd_clear_active').click(function(){
		aDiag.frames[aDiag.current_frame].clear('active');
	});

	$('#cmd_paint').click(function(){
		aDiag.frames[aDiag.current_frame].paintActivePiece();
	});

	$('#cmd_lock').click(function(){
		aDiag.frames[aDiag.current_frame].lockActivePiece();
	});

	$('#cmd_drop').click(function(){
		aDiag.frames[aDiag.current_frame].dropActivePiece();
	});
	$('#cmd_move_up').click(function(){
		aDiag.frames[aDiag.current_frame].moveActivePiece('up');
	});
	$('#cmd_move_down').click(function(){
		aDiag.frames[aDiag.current_frame].moveActivePiece('down');
	});
	$('#cmd_move_left').click(function(){
		aDiag.frames[aDiag.current_frame].moveActivePiece('left');
	});
	$('#cmd_move_right').click(function(){
		aDiag.frames[aDiag.current_frame].moveActivePiece('right');
	});

	$('#cmd_ccw').click(function(){
		aDiag.frames[aDiag.current_frame].rotateActivePiece('ccw');
	});

	$('#cmd_cw').click(function(){
		aDiag.frames[aDiag.current_frame].rotateActivePiece('cw');
	});

	$('#cmd_clear_inactive').click(function(){
		aDiag.frames[aDiag.current_frame].clear('inactive');
	});

	$('#pf-cmd_new').click(function(){
		aDiag.new_frame();
		aDiag.frames[aDiag.current_frame].draw();
	});
	$('#pf-cmd_clone').click(function(){
		aDiag.new_copy_frame();
		aDiag.frames[aDiag.current_frame].draw();
	});

	$('#pf-cmd_del').click(function(){
		aDiag.remove_current_frame();
		aDiag.frames[aDiag.current_frame].draw();
		aDiag.update_framecount();
	});


	$('#pf-cmd_first').click(function(){
		aDiag.first_frame();
	});

	$('#pf-cmd_prev').click(function(){
		aDiag.previous_frame();
	});

	$('#pf-cmd_next').click(function(){
		if(aDiag.current_frame < aDiag.frames.length - 1){
		aDiag.next_frame();
		}
		else
		{
		aDiag.new_copy_frame();
		aDiag.frames[aDiag.current_frame].draw();
		}
	});

	$('#pf-cmd_last').click(function(){
		aDiag.last_frame();
	});

	$('#tetramino-panel table').click(function(){
		$('#tetramino-panel td').removeClass('pressed');
		$('#tetramino-panel input[type=radio]:checked').parent().parent().addClass('pressed');
	});

	$('#panel-decorations').click(function(){
		$('#panel-decorations td').removeClass('pressed');
		$('#panel-decorations input:checked').parent().parent().addClass('pressed');
	});

	$('#fumen_import').click(function(){

	var encstr = $('#import').val();
	//'7ebhiipqbxqb5qbiqbqqbyqb6qbjqbrqbzqb7qbkqb?sqb0qb8qblqbtqb1qb9qbmqbuqb2qb+qbnqbvqb3qb/qb';// full rotation
	//var encstr = '7eYKHWOA0BeTASIjRASIyQEF2BAABmBUcBviBLjBWe?BAwNyAU9sJEFb0HEvT98AwSVTASY6dD2488AwA2JEnoo2AD?MeGEzXpTASICKEFbEcEP5BAAMQBOGBrRBtXBqHBpPBEOBv4?A9JBJPBnDBO+ALABdHBFgBdgBlfBAAA';
	//var encstr ='/dD3hbH3ibI3gbH3hbI3gbC3pbAoUxAso2TAySzTAS?ITeDZ2vvAuno2A5H5TASY6dD2488AQ+74Dzoo2Azo2TASo/?QEOAAAA7eEh9OEAlsyfCAAAbKBVJBSFBNdE3kbC3mbC3mbC?3mbC3icAwNEA6HXyD7eVtOqyAFreRAyp+5APGVTAyp78Axn?A6AFr+5AxnA6AFreRAyp7CEFStJEFreRAypeRAyZAAAlecF?ectHBtocFocNyc13cdiBt3cl3cF3cNBd1mBjYBZzcBcBGZB?aYBUycchBAAA";
	//First, run some actual fumen code, 'cause I (PP) am not a CS genius. Thanks myndzi for the hints about how it works
	// I stripped some useless (for my purposes) part of the code. Gomenasai Mihys-san !
	enclim=32768;
	enc=new Array(enclim+1024);
	enctbl='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	asctbl=' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
	framelim=2000;
	f=new Array(220);encf=new Array(220);af=new Array(220*(framelim+1));
	p=new Array(3);ap=new Array(3*(framelim+1));
	au=new Array(framelim);
	am=new Array(framelim);
	ac=new Array(framelim);
	ad=new Array(framelim);
	ct=1;
	b=new Array(
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,1,1,1,2,1,3,1,1,0,1,1,1,2,1,3,0,1,1,1,2,1,3,1,1,0,1,1,1,2,1,3,
	0,1,1,1,2,1,0,2,1,0,1,1,1,2,2,2,2,0,0,1,1,1,2,1,0,0,1,0,1,1,1,2,
	1,1,2,1,1,2,2,2,1,1,2,1,1,2,2,2,1,1,2,1,1,2,2,2,1,1,2,1,1,2,2,2,
	0,1,1,1,1,2,2,2,2,0,1,1,2,1,1,2,0,1,1,1,1,2,2,2,2,0,1,1,2,1,1,2,
	0,1,1,1,2,1,1,2,1,0,1,1,2,1,1,2,1,0,0,1,1,1,2,1,1,0,0,1,1,1,1,2,
	0,1,1,1,2,1,2,2,1,0,2,0,1,1,1,2,0,0,0,1,1,1,2,1,1,0,1,1,0,2,1,2,
	1,1,2,1,0,2,1,2,0,0,0,1,1,1,1,2,1,1,2,1,0,2,1,2,0,0,0,1,1,1,1,2
	);

	enclen=0;
	for(i=0;i<encstr.length;i++){
		tmp=enctbl.indexOf(encstr.charAt(i));if(tmp>=0)enc[enclen++]=tmp;
	}
	for(i=enclen;i<enclim;i++)enc[i]=0;
	encc=0;
	fldrepcnt=0;
	for(i=0;i<220;i++)af[i]=0;
	for(e=0;encc<enclen;e++){
		if(fldrepcnt<1){
		for(j=0;j<220;){
			tmp=enc[encc++];tmp+=enc[encc++]*64;
			tmp2=tmp%220;tmp=Math.floor(tmp/220);
			tmp1=tmp%17;tmp=Math.floor(tmp/17);
			for(i=0;i<=tmp2;i++)af[e*220+(j++)]+=tmp1-8;
			if(tmp1*220+tmp2==1979)fldrepcnt=enc[encc++];
		}
		}else{
		fldrepcnt--;
		}
		tmp=enc[encc++];tmp+=enc[encc++]*64;tmp+=enc[encc++]*4096;
		ap[e*3+0]=tmp%8;tmp=Math.floor(tmp/8);
		ap[e*3+1]=tmp%4;tmp=Math.floor(tmp/4);
		ap[e*3+2]=tmp%220;tmp=Math.floor(tmp/220);
		au[e]=tmp%2;tmp=Math.floor(tmp/2);
		am[e]=tmp%2;tmp=Math.floor(tmp/2);
		if(e===0){ct=tmp%2;}tmp=Math.floor(tmp/2);
		acflg=tmp%2;tmp=Math.floor(tmp/2);
		ac[e]=(e>0)?ac[e-1]:'';
		cmstrrep=ac[e];
		ac[e]=cmstrrep;
		ad[e]=tmp%2;tmp=Math.floor(tmp/2);
		if(acflg){
		tmp=enc[encc++];
		tmp+=enc[encc++]*64;
		tmplen=(tmp%4096);tmp=Math.floor(tmp/4096);
		tmpstr='';
		for(i=0;i<tmplen;i+=4){
			tmp=enc[encc++];
			tmp+=enc[encc++]*64;
			tmp+=enc[encc++]*4096;
			tmp+=enc[encc++]*262144;
			tmp+=enc[encc++]*16777216;
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
			tmpstr+=asctbl.charAt(tmp%96);tmp=Math.floor(tmp/96);
		}
		ac[e]=unescape(tmpstr.substring(0,tmplen));
		}
		for(i=0;i<220;i++)af[(e+1)*220+i]=af[e*220+i];
		if(!ad[e]){
		if(ap[e*3+0]>0){
			for(j=0;j<4;j++)af[(e+1)*220+ap[e*3+2]+b[ap[e*3+0]*32+ap[e*3+1]*8+j*2+1]*10+b[ap[e*3+0]*32+ap[e*3+1]*8+j*2]-11]=ap[e*3+0];
		}
		for(i=20,k=20;k>=0;k--){
			chk=0;for(j=0;j<10;j++)chk+=(af[(e+1)*220+k*10+j]>0);
			if(chk<10){
			for(j=0;j<10;j++)af[(e+1)*220+i*10+j]=af[(e+1)*220+k*10+j];
			i--;
			}
		}
		for(;i>=0;i--)for(j=0;j<10;j++)af[(e+1)*220+i*10+j]=0;
		if(au[e]){for(i=0;i<210;i++)af[(e+1)*220+i]=af[(e+1)*220+i+10];for(i=210;i<220;i++)af[(e+1)*220+i]=0;}
		if(am[e])for(i=0;i<21;i++)for(j=0;j<5;j++){tmp=af[(e+1)*220+i*10+j];af[(e+1)*220+i*10+j]=af[(e+1)*220+i*10+9-j];af[(e+1)*220+i*10+9-j]=tmp;}
		}
	}

	// Now for the actual tedige function.
	/* While I'm at it here's the variable that we are interested in:
	(foreword: fumen always initialize 2000 'frames' even if there's no data in it)
	= af - playfield =
		Always contains 440220 elements (2000 * 22 * 10). It stores the playfield matrix (size 22 x 10), each matrix appended to the other. So the first 220 elements is the first matrix, the 220 next the second one, etc. There's an extra line at the top and at the bottom

	= ap - active piece =
		Always contains 6000 elements. The data is stored in triplet in the 1D array: first is the piece type (0-6, see the translation table), then its orientation (0-3), then its position.

	= ac - comments =
		2000 elements, one for each playfield. Contains the comment string.

	= e - # of playfield =
		the amount of playfield, apparently

	=ct - rotation system=
		0 = ars
		1 = srs
	*/

	aDiag.remove_all_playfields(); // let's nuke everything first

	for (z=0;z<e;z++)
	{
		aDiag.new_frame(); // add a new frame for each playfield

		// rotation system
		if (ct)
		{
		  aDiag.frames[z].RS = 'SRS';
		}
		else
		{
		  aDiag.frames[z].RS = 'ARS';
		}

		// playfield
		for(var i=0;i<10;i++)
		{
			for (j=0;j<20;j++)
			{
			aDiag.frames[z].modify(i,j,fconvert(af[(z*220+10*(j+1)+i)])); // get the right case in the big array (z: frame; j: line; i: column; we dump the first and last line, hence the j+1 and why we go from 0 to 20 and not to 22)
			}
		}

		// active piece
		// fumen models a 3x3 (4x4 for I) bounding box, centered on the coordinate ( for the 4x4 box it's the center upper left case that define the center)

			aDiag.frames[z].activePieceType = fconvert(ap[3*z+0]);
			if (aDiag.frames[z].activePieceType)
			{
			aDiag.frames[z].activePieceOrientation = oconvert(ap[3*z+1],ct,aDiag.frames[z].activePieceType);
			var activePositions = pconvert(ap[3*z+2],aDiag.frames[z].activePieceOrientation,ct);
			aDiag.frames[z].activePiecePositionX = activePositions[0];
			aDiag.frames[z].activePiecePositionY = activePositions[1];
			}

		// comments
		if(ac[z])
		{
		aDiag.frames[z].comment = ac[z]; // todo: maybe a should do a method to change the comment ? (so it can be displayed ?)
		}

	}

	aDiag.remove_current_frame(); // dunno why it bugs when I try for (z=0;z<e-1;z++), so I do this instead; draw is in remove_current_frame, so I don't need to call it

	function pconvert(input,orientation,system){
		var x;
		var y;
			x = input%10;
			y = parseInt((input - x - 10)/10,10);
		return [x,y];
	}

	function fconvert(input){
		var out;
		switch(input){
			case 0:
				out = '';
			break;
			case 1:
				out = 'I';
			break;
			case 2:
				out = 'L';
			break;
			case 3:
				out = 'O';
			break;
			case 4:
				out = 'Z';
			break;
			case 5:
				out = 'T';
			break;
			case 6:
				out = 'J';
			break;
			case 7:
				out = 'S';
			break;
			case 8:
				out = 'G';
			break;
			default:
			break;
		}
		return out;
	}

	function oconvert(input, rs,piecetype)
	{
	/* cw i ccw u
	ars
	all piece follows: i ccw u cw
	*/
	var output;
	if (rs) // srs
	{
		switch(input) // SRS: some manual adjustement are needed because fumen SRS model isn't the same as tedige
		{
			case 0 :
			output =  'u';
			if (piecetype == 'I' || piecetype == 'Z')
			{
			  output =  'i';
			}

			break;
			case 1 :
			output =  'cw';
			if (piecetype == 'S')
			{
			  output =  'ccw';
			}

			break;
			case 2 :
			output = 'i';
			if (piecetype == 'Z' || piecetype == 'S')
			{
			  output =  'u';
			}

			break;
			case 3 :
			output = 'ccw';
			if (piecetype == 'Z')
			{
			  output =  'ccw';
			}
			break;
		}

	}
	else // ars
	{
		switch(input)
		{
			case 0 :
			output =  'i';
			break;
			case 1 :
			output =  'ccw';
			break;
			case 2 :
			output = 'u';
			break;
			case 3 :
			output = 'cw';
			break;
		}
	}

	return output;
	}

	});

	/* ---------------------------------------------------------------------------- */
	/* --------------------------- ANIMATION MANAGEMENT  -------------------------- */
	/* ---------------------------------------------------------------------------- */


	var _frames = 16.6666667;
	//aDiag.load('M~MyFoobarIsRich_A~Jgkccw_I~Tadaeafbfbhcdcecfcgch~Gededeeefegehfdfffh~Shdhdhehfhhidifihjdjfjgjh_+A~e_I~Tahagbd~Shgje~Ebfbhif+I~Zaa+I~Zab+I~Zac+I~Zad+I~Zae+I~Zaf+I~Zag+I~Zai+I~Zba+I~Zbb+I~Zbc+I~Zbd+I~Zbe+I~Zbf+I~Zbg+I~Zbi+I~Zda+I~Zdb+I~Zdc+I~Zdd+I~Zde+I~Zdf+I~Zdg+I~Zdi+I~Zea+I~Zeb+I~Zec+I~Zed+I~Zee+I~Zef+I~Zeg+I~Zei+I~Zfa+I~Zfb+I~Zfc+I~Zfd+I~Zfe+I~Zff');

	// aDiag.painter.drawWhitePixel(aDiag.frames[aDiag.current_frame].playfield);
	//aDiag.painter.drawLocalWhitePixel(aDiag.frames[aDiag.current_frame].playfield,5,6)

	$('#pf-cmd_playpause').click(function(){
	console.log('tick');
		var i = aDiag.current_frame;
		var len = aDiag.frames.length;
		if(aDiag.playing)
		{
			aDiag.playing = false;
			$('#pf-cmd_playpause').attr('value','▷');
		}
		else{
			aDiag.playing = true;
			$('#pf-cmd_playpause').attr('value','||');
		}
		var counter = 0;
		function render(){
			// TODO: does not escape properly when we press pause
			console.log('rendering... @'+i+' - '+counter);

			if (i < len && aDiag.playing)
				{
					if(counter < aDiag.frames[aDiag.current_frame].duration)
					{
						aDiag.goto_frame(i);
						counter++;
					}
					else{
					counter = 0;
					i++;
					}

					//interval = aDiag.frames[aDiag.current_frame].duration;
					requestAnimationFrame(render);
				}
				else if($('#pf-loop').is(':checked'))
				{
					i = 0;
					requestAnimationFrame(render);
				}
		}
		render();
	/* v2
		var i = aDiag.current_frame;
		var len = aDiag.frames.length;
		var interval = '';
		if(playpause)
		{
			playpause = false;
		}
		else{
			playpause = true;
		}

		function draw() {
			setTimeout(function() {
				var myReq = window.requestAnimationFrame(draw);
				console.log('req');
			if (i < len && playpause)
				{
					aDiag.goto_frame(i);
					interval = aDiag.frames[aDiag.current_frame].duration;
					i++;
				}
				else if($('#pf-loop').is(':checked'))
				{
					i = 0;
				}

				else
				{
				window.cancelAnimationFrame(myReq);
				console.log('release');
				}

			}, interval);
		}
		draw();
	*/

	/* v1
		aDiag.first_frame();
		var i = 0;
		advance();
		function advance(){
			//console.log('Doki '+i);
			if(i<aDiag.frames.length-1)
			{
				aDiag.next_frame();
				setTimeout(advance,1*_frames);
				i++;
			} // change and see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
			else
			{
				console.log('Finished !');
			}
		}

		*/
	});


	/* ------------------------------------------------------------------------- */
	/* --------------------------- PANEL MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */


	var $mainutilities = $('#main-utilities');
	var $secondaryutilities = $('#main-utilities');
	var $tabdeco = $('#tab-deco');
	var $tabtetramino = $('#tab-tetramino');
	var $tabactions = $('#tab-actions');
	var $tabapcontrol = $('#tab-apcontrol');
	var $tabproperties = $('#tab-properties');

	var $tetraminopanel = $('#tetramino-panel');
	var $decorationspanel = $('#panel-decorations');
	var $apcontrolpanel = $('#panel-apcontrol');
	var $propertiespanel = $('#panel-proprieties');

	//var $actionspanel = $("#panel-actions");

	$('body').mousedown(function(){IS_CLICKING = true;}).mouseup(function(){IS_CLICKING = false;});

	function setpanelfalse(){
		DECORATION_PANEL = false;
		TETRAMINO_PANEL = false;
	}

	function hideallpanelexcept(exception){
		if (exception !='decorationspanel')
			{$decorationspanel.fadeOut(200);}
		if (exception !='tetraminopanel')
			{$tetraminopanel.fadeOut(200);}
		if (exception !='propertiespanel')
			{$propertiespanel.fadeOut(200);}
		if (exception !='apcontrolpanel')
			{$apcontrolpanel.fadeOut(200);}
	}


	$tabdeco.click(function(){
		setpanelfalse();
		DECORATION_PANEL = true;
		$mainutilities.removeClass().addClass('border-deco');
		hideallpanelexcept('decorationspanel');
		$decorationspanel.delay(200).fadeIn();
	});

	$tabtetramino.click(function(){
		setpanelfalse();
		TETRAMINO_PANEL = true;
		$mainutilities.removeClass().addClass('border-tetramino');
		hideallpanelexcept('tetraminopanel');
		$tetraminopanel.delay(200).fadeIn(200);
	});

	$tabproperties.click(function(){
		$secondaryutilities.removeClass().addClass('border-properties');
		hideallpanelexcept('propertiespanel');
		$propertiespanel.delay(200).fadeIn(200);
	});

	$tabapcontrol.click(function(){
		$secondaryutilities.removeClass().addClass('border-AP');
		hideallpanelexcept('apcontrolpanel');
		$apcontrolpanel.delay(200).fadeIn(200);
	});

	/*
	$tabactions.click(function(){
		$secondaryutilities.removeClass().addClass('border-action');
		$propertiespanel.fadeOut(200);
		$actionspanel.delay(200).fadeIn();
	});
	*/


	/*
	function setpanelfalse(){
		DECORATION_PANEL = false;
		TETRAMINO_PANEL = false;
	}

	function settoolfalse(){
		TOOL_DROP = false;
		TOOL_FILL = false;
		TOOL_RECTANGULAR = false;
		TOOL_PENCIL = false;
		TOOL_ERASER = false;
		$drop.removeClass('pressed');
		$fill.removeClass('pressed');
		$pencil.removeClass('pressed');
		$eraser.removeClass('pressed');
	}

	function hideallpanelexcept(currentpanel){
		if(currentpanel != 'deco')
			{$decorationspanel.fadeOut();}
		if(currentpanel != 'pieceselection')
			{$pieceselection.fadeOut();}
		if(currentpanel != 'tools')
			{$tools.fadeOut();}
		if(currentpanel != 'actions')
			{$actionspanel.fadeOut();}
		if(currentpanel != 'properties')
			{$propertiespanel.fadeOut();}
	}


	$tabdeco.click(function(){
		hideallpanelexcept('deco');
		setpanelfalse();
		DECORATION_PANEL = true;
		$utilities.removeClass().addClass('border-deco');
		$decorationspanel.fadeIn();
	});

	$tabtetramino.mousedown(function(){
		hideallpanelexcept('pieceselection');
		setpanelfalse();
		TETRAMINO_PANEL = true;
		$utilities.removeClass().addClass('border-active');
		$pieceselection.fadeIn();
		$tools.fadeIn();
		$tools.fadeIn().find('.tools-button').fadeIn();
	});

	$tabproperties.mousedown(function(){
		hideallpanelexcept('properties');
		setpanelfalse();
		$propertiespanel.fadeIn();
		$utilities.removeClass().addClass('border-properties');

	});

	$tabactions.mousedown(function(){
		hideallpanelexcept('actions');
		settoolfalse();
		$actionspanel.fadeIn();
	});

	*/
	function settoolfalse(){
		TOOL_DROP = false;
		TOOL_FILL = false;
		TOOL_RECTANGULAR = false;
		TOOL_PENCIL = false;
		TOOL_ERASER = false;
		$drop.removeClass('pressed');
		$fill.removeClass('pressed');
		$pencil.removeClass('pressed');
		$eraser.removeClass('pressed');
	}

	var $drop = $('#button-drop');
	$drop.mousedown(function(){
		if (TOOL_DROP) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_DROP = true;
			$drop.addClass('pressed');

		}
	});

	var $fill = $('#button-paint-bucket');
	$fill.mousedown(function(){
		if (TOOL_FILL) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_FILL = true;
			$fill.addClass('pressed');

		}
	});

	var $pencil = $('#button-pencil');
	$pencil.mousedown(function(){
		if (TOOL_PENCIL) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_PENCIL = true;
			$pencil.addClass('pressed');

		}
	});

	var $eraser = $('#button-eraser');
	$eraser.mousedown(function(){
		if (TOOL_ERASER) {
			settoolfalse();
		}
		else
		{
			settoolfalse();
			TOOL_ERASER = true;
			$eraser.addClass('pressed');

		}
	});


	var $eraserdeco = $('#button-eraser-deco');
	$eraserdeco.mousedown(function(){
		if (TOOL_ERASER_DECO) {
			TOOL_ERASER_DECO = false;
			$eraserdeco.removeClass('pressed');
		}
		else
		{
			TOOL_ERASER_DECO = true;
			$eraserdeco.addClass('pressed');

		}
	});

//////// Actions panel////////////

	$('#cmd_nuke').click(function(){
		var confirmation = window.confirm('This will reset everything ! Are you sure ?');
		if (confirmation)
		{
		aDiag.remove_all_playfields();
		aDiag.frames[aDiag.current_frame].draw();
		}
	});
	$('#cmd_remove_following').click(function(){
		aDiag.frames[aDiag.current_frame].paintActivePiece();
		aDiag.frames[aDiag.current_frame].draw();
	});

	$('#cmd_paint').click(function(){
		aDiag.frames[aDiag.current_frame].paintActivePiece();
	});

//////// Properties panel////////////
	/*
	$('#next1-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(1,$('#next1-select').val());
	});

	$('#next2-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(2,$('#next2-select').val());
	});

	$('#next3-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(3,$('#next3-select').val());
	});

	$('#hold-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_nexthold(0,$('#hold-select').val());
	});
	*/
	$('#activate-white-border').click(function(){
	//change-all-border

		if ($('#activate-white-border:checked').val())
		{
			aDiag.frames[aDiag.current_frame].modify_whiteborder(true);
		}
		else
		{
			aDiag.frames[aDiag.current_frame].modify_whiteborder(false);
		}

	});

	$('#change-all-border').click(function(){
		aDiag.modify_border($('#border-select').val());
	});

	$('#rs-select').change(function(){
		aDiag.frames[aDiag.current_frame].modify_RS($('#rs-select').val());
	});
	$('#change-all-rs').click(function(){
		aDiag.modify_RS($('#rs-select').val());
	});

	$('#change-all-whiteborder').click(function(){
		aDiag.modify_whiteborder($('#border-select').val());
	});

	$('#change-all-duration').click(function(){
		aDiag.modify_duration(parseInt($('#pf-duration').val(),10));
		console.log(parseInt($('#pf-duration').val(),10));
	});
	$('#duration-1f').click(function(){
		$('#pf-duration').val('1').blur();
	});
	$('#duration-5f').click(function(){
		$('#pf-duration').val('5').blur();
	});
	$('#duration-15f').click(function(){
		$('#pf-duration').val('15').blur();
	});
	$('#duration-60f').click(function(){
		$('#pf-duration').val('60').blur();
	});

	$('#cmd_opacity_3').click(function(){
		$('#pf-active-opacity').val('0.9').blur();
	});
	$('#cmd_opacity_2').click(function(){
		$('#pf-active-opacity').val('0.8').blur();
	});
	$('#cmd_opacity_1').click(function(){
		$('#pf-active-opacity').val('0.7').blur();
	});
	$('#cmd_opacity_lock').click(function(){
		$('#pf-active-opacity').val('0.65').blur();
	});
	$('#cmd_opacity_flash').click(function(){
		$('#pf-active-opacity').val('Flash').blur();
	});


	$('#export-image-frame-button').click(function(){
		aDiag.painter.exportImage();
	});

	$('#export-image-diagram-button').click(function(){
		aDiag.getGIF();
	});


	/* ---------------------------------------------------------------------------- */
	/* --------------------------- SAVE/LOAD MANAGEMENT  -------------------------- */
	/* ---------------------------------------------------------------------------- */


	$('.export-button').click(function(){

		var export_string = '';
		var destination = $(this).attr('id');
		if($('input[name=export-type]:checked').val() == 'All')
		{
			//export_string = 'all-'+aDiag.flate_encode(aDiag.print()); // compressed
			export_string = 'all-'+aDiag.print(); // not compressed
			// export_string = aDiag.print();
		}

		if($('input[name=export-type]:checked').val() == 'Current')
		{
			//export_string = 'current-'+aDiag.flate_encode(aDiag.frames[aDiag.current_frame].print()); // compressed
			export_string = 'current-'+aDiag.frames[aDiag.current_frame].print(); // not compressed
		}
		switch(destination)
		{
			case 'export-forum-button':
				$('#export').html('[tedige]v01-'+export_string+'[/tedige]').select();
			break;
			case 'export-editor-button':
				$('#export').html(window.location.href.split('?')[0]+'?v01-'+export_string).select(); // the extra split is here to make sure you don't catch a leftover from a previous URL import.
			break;
			case 'export-viewer-button':
				var URL = window.location.href.split('?')[0].split('/');
				URL.pop();
				$('#export').html(URL.join('/')+'/viewer.html?v01-'+export_string).select();
			break;
		}


	});
	// textarea selection http://stackoverflow.com/questions/5797539/jquery-select-all-text-from-a-textarea#5797700
	$('#export').focus(function() {
		var $this = $(this);
		$this.select();
		// Work around Chrome's little problem
		$this.mouseup(function() {
			// Prevent further mouseup intervention
			$this.unbind('mouseup');
			return false;
		});
	});

/*
				var output = window.location.protocol+window.location.hostname;
				var tmp = window.location.pathname.split("/");

				for(var i = 0; i<tmp.length-1;i++)
				{
					output += tmp[i]+"/";
				}
				output+="tedige.html";
				$("#export").html(output+"#"+this.print());
	*/
	var regforum = /\[tedige\](.+)\[\/tedige\]/; // matches everything between [tedige] and [/tedige]
	var regURL = /v01.+/; // matches everything after v01
	$('#import-button').click(function(){
		var bigstr = $('#import').val();

		resultforum = regforum.exec(bigstr); // todo: make that work ?
		resultURL = regURL.exec(bigstr);
		//console.log(resultforum.split('-'));
		var littlestr;
		if (resultURL)
		{
			littlestr = resultURL[0].split('-');
		}

		if (resultforum)
		{
			littlestr = resultforum[0].split('-');
			littlestr[2] = littlestr[2].split('[')[0];
		}

		switch(littlestr[1])
		{
			case 'all':
				//aDiag.load(aDiag.flate_decode(littlestr[2])); // compressed
				aDiag.load(littlestr[2]); // not compressed
				aDiag.frames[aDiag.current_frame].draw();
			break;

			case 'current':
				//aDiag.frames[aDiag.current_frame].load(aDiag.flate_decode(littlestr[2]));	 // compressed
				aDiag.frames[aDiag.current_frame].load(littlestr[2]); //not compressed
				aDiag.frames[aDiag.current_frame].draw();
			break;
		}


		/*switch($('#import-export-wrapper input[type=radio][name=export-type]:checked').attr('value')){

			case 'All':
				if(result)
				{
					aDiag.load(xflatedecode(result[1]));
					// aDiag.load(result[1]);
				}
				else
				{
					aDiag.load(xflatedecode(bigstr));
					// aDiag.load(bigstr);
				}
				break;

			case 'Current':
				if(result)
				{
					aDiag.frames[aDiag.current_frame].load(xflatedecode(result[1]));
					// aDiag.frames[aDiag.current_frame].load(result[1]);
				}
				else
				{
					aDiag.frames[aDiag.current_frame].load(xflatedecode(bigstr));
					// // aDiag.frames[aDiag.current_frame].load(bigstr);
				}
				break;
			break;

		}*/

	});

	/*
	$('.preview-table').click(function(){
		console.log('barabar');
		//$(this).parent().parent().parent().parent().parent().addClass('pressed');
	});
	*/

	$('#foobartest').click(function(){
		console.log(aDiag);
		console.log(aDiag.frames[aDiag.current_frame]);
		console.log(aDiag.print());
		//aDiag.painter.generateNewPreviewTable(1);
		//aDiag.frames[aDiag.current_frame].whiteborder = true;
		//aDiag.painter.drawWhiteBorder(aDiag.frames[aDiag.current_frame].playfield);
		//aPainter.highlight(3,4);
		//console.log(aDiag.frames[aDiag.current_frame].comment);
		//console.log(aDiag.flate_decode('bY6xDsIwDEQ/iJkPAIRQKsHQMHWJkthnN1MVmP3tuBESCz7J2717s53mmM52z6839zRZP6aL9XEpWChUuKBI0coEZvgDIFCLQh4WiIgqKVRXWrVR03QI9syUOcPLWqlyRZWqdh1AIThGfnW7MbHTWVh9AjteeUVDkxRca5dS3VzqYSEu+0D8OxDchL8uGDaOcKMwCFsfhGla0gc='));
		// file:///D:/Hoang/TeDiGe/Tetris-Diagram-Generator-2/tedige.html?v01-all-bY6xDsIwDEQ/iJkPAIRQKsHQMHWJkthnN1MVmP3tuBESCz7J2717s53mmM52z6839zRZP6aL9XEpWChUuKBI0coEZvgDIFCLQh4WiIgqKVRXWrVR03QI9syUOcPLWqlyRZWqdh1AIThGfnW7MbHTWVh9AjteeUVDkxRca5dS3VzqYSEu+0D8OxDchL8uGDaOcKMwCFsfhGla0gc=?v01-all-jcw9DoAgDIbhAzl7AHWi0ZAAE0sjxIEVNW49u3+DXzdhKXl52olJqbAT7zz3Ms3rtlQmqS0PUp/DTXd/ygeb676PAnP+ypjSDrMKBcNXLBCLxAKxikQoEUmEXVGRACUgCbArKEJACAkBIUU8EP+nnA==
		//'all-jcw9DoAgDIbhAzl7AHWi0ZAAE0sjxIEVNW49u3+DXzdhKXl52olJqbAT7zz3Ms3rtlQmqS0PUp/DTXd/ygeb676PAnP+ypjSDrMKBcNXLBCLxAKxikQoEUmEXVGRACUgCbArKEJACAkBIUU8EP+nnA=='
	});


}); // end jquery.ready

function drawPaletteDecoCell(kind,blockSize,sprite){

		var Canvas = $('#editor-palette-deco-'+kind);
		var ctx = Canvas[0].getContext('2d');

		var spriteOffsetStart, spriteOffsetEnd;
		switch(kind){
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

		var ox = spriteOffsetStart[0]*(blockSize);
		var oy = spriteOffsetStart[1]*(blockSize);
		var w = (spriteOffsetEnd[0]-spriteOffsetStart[0])*(blockSize);

		var h = (spriteOffsetEnd[1]-spriteOffsetStart[1])*(blockSize);
		var nx = 0;
		var ny = 0;

			ctx.drawImage(sprite, // original image
						  ox,oy, //coordinate on the original image
						  w,h, // size of the rectangle to will be cut
						  nx,ny, // destination coordinate
						  w,h); // destination size

}

	function drawPaletteCell(type,orientation,RS,blockSize,sprite){
		var Canvas = $('#editor-palette-'+type+orientation);
		var ctx = Canvas[0].getContext('2d');
		var matrix = getMatrix(type, orientation, RS);
		Canvas.attr('width',Canvas.width());

		var color,spriteOffset;
		switch(RS){ // TODO: add srs
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
		}

		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (matrix[i][j]) {
					ctx.beginPath();
					ctx.rect(parseInt(j*blockSize,10),parseInt(i*blockSize,10),blockSize,blockSize);
					ctx.fillStyle = color;
					ctx.fill();
					ctx.closePath();
					if (sprite) {
						ctx.drawImage(sprite, // original image
									  spriteOffset[0]*blockSize,spriteOffset[1]*blockSize, //coordinate on the original image
									  blockSize,blockSize, // size of the rectangle to will be cut
									  parseInt(j*blockSize,10),parseInt(i*blockSize,10), // destination coordinate
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
		}
	}
}

function drawPaletteDeco(blockSize,sprite){
	var type = ['n1','n2','n3','n4','n5','n6','n7','n8','n9','n0','smallccw','smallcw','smalloktick','smallokcircle','smallnocross','smallquestion','smallexclamation','nwarrow','narrow','nearrow','earrow','searrow','sarrow','swarrow','warrow','bigcw','bigccw','smallquestion','bigquestion','bigexclamation','bigoktick','bigokcircle','bignocross','overlayyellow','overlayblue','overlaygreen','overlaypink','overlaypink','clear1','clear2','clear3','clear4','clear5','clear6','clear7'];

	for (var i = 0; i < type.length; i++) {
			drawPaletteDecoCell(type[i],blockSize,sprite);
	}
}




