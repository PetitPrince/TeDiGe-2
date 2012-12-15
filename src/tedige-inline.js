/** @preserve TeDiGe -2- Inline code, used to generate embedded diagram (forum, etc...) - https://github.com/PetitPrince/TeDiGe-2/  */
/** Encode a string with deflate

	@param {string} Input string
	@return {string} Output encoded string
*/
Diagram.prototype.flate_encode = function (str) {
return $.base64.encode(RawDeflate.deflate(unescape(encodeURIComponent(str))));
};

/** Decode a string with deflate

	@param {string} Input string
	@return {string} Output decoded string
*/
Diagram.prototype.flate_decode = function(str) {
return decodeURIComponent(escape(RawDeflate.inflate($.base64.decode(str))));
};
	$(document).ready(function(){
		
		// there's potentially loads and loads of playfield to render, so we create some containers
		var diagrams = [];
		var painters = [];
		
		// fill each wrapper with their canvas content
		$(".tedige-playfield-wrapper").each(function(index) {
			var newID = $(this).attr('id');
			var i = 0;
			var insert = []; // according to that guy, that goes faster: http://stackoverflow.com/questions/4864294/dynamic-creation-of-large-html-table-in-javascript-performance
			insert[i++] = '	<div class="left-pane">';
			insert[i++] = '		<div class="nexthold-container">';
			insert[i++] = '			<canvas id="'+newID+'-nexthold-background"	width="97" height="32" style="z-index:0;"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-nexthold"	width="97" height="32" style="z-index:1;"></canvas>';
			insert[i++] = '		</div>';
			insert[i++] = '		<div class="canvas-container" id="'+newID+'-container border-gray">';
			insert[i++] = '			<canvas id="'+newID+'-border"		width="97" height="177" style="z-index:0;background-color: black"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-background"	width="97" height="177" style="z-index:1;//background-color: black"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-inactive"	 width="97" height="177" style="z-index:2; border:none; opacity: 0.65"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-whiteborder" width="97" height="177" style="z-index:3"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-active"		width="97" height="177" style="z-index:4"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-deco"			width="97" height="177" style="z-index:5"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-decoPin"	 width="97" height="177" style="z-index:6; border:none; opacity: 0.65;display:none"></canvas>';
			insert[i++] = '			<canvas id="'+newID+'-preview"		width="97" height="177" style="z-index:6"></canvas>';
			insert[i++] = '		</div>';
			insert[i++] = '		<div class="control-div">';
			insert[i++] = '		<canvas class="canvas-control" id="'+newID+'-control" width="97" height="35" style=""></canvas>';
			insert[i++] = '		</div>';
			insert[i++] = '		</div>';
			insert[i++] = '		<div class="right-pane">';
			insert[i++] = '		<div class="progressbar">';
			insert[i++] = '			<p>';
			insert[i++] = '				<input class="current-frame" id="'+newID+'-current-frame" type="text" style="width: 2.5em; text-align:center" /> / <span id="'+newID+'-total-frame">1</span>';
			insert[i++] = '			</p>';
			insert[i++] = '			<canvas id="'+newID+'-progressbar" width="97" height="24" style="border: 1px solid white;" />';
			insert[i++] = '		</div>';
			insert[i++] = '		<div id="order-control"> ';
			insert[i++] = '			<input class="cmd_prev" id="'+newID+'-cmd_prev"	value="◄"	type="button" />';
			insert[i++] = '			<input class="cmd_next" id="'+newID+'-cmd_next"	value="►"	type="button" /><br />';
			insert[i++] = '			<input class="cmd_first" id="'+newID+'-cmd_first" value="|◄" type="button"/>';
			insert[i++] = '			<input class="cmd_last" id="'+newID+'-cmd_last" value="►|" type="button"	style="width:2.5em"/><br />';
			insert[i++] = '			<input class="cmd_playpause" id="'+newID+'-cmd_playpause" value ="▷" type="button" style="width:2.5em" /><br />';
			insert[i++] = '			<input class="check-loop" id="'+newID+'-loop"type="checkbox"> loop';
			insert[i++] = '		</div>';
			insert[i++] = '	</div>';
			insert[i++] = '	<div id="under">';
			insert[i++] = '		<textarea readonly="" id="'+newID+'-comment" class="comment"></textarea>';
			insert[i++] = '	</div>';
			$("#"+newID).html(insert.join('\n'));
			
			painters[newID] = new Painter(newID);
			diagrams[newID] = new Diagram(painters[newID]);
			diagrams[newID].init();
			painters[newID].init();
			});

			// now that the initialization is finished, let's loop a second time
			$(".tedige-playfield-wrapper").each(function(index) {
			var newID = $(this).attr('id');
			// load the playfield data into the canvases
			var initiator = setInterval(function(){

				if(painters[newID].ready) {
					clearInterval(initiator);
					var titlesearch = $("#"+newID).data('tedigecode');
					if(titlesearch) // load if there's something in the tedige-string attribute (for instance <div id="nana" class="tedige-playfield-wrapper" data-tedige-string="{tedige code here}"></div>)
					{
					var littlestr = titlesearch.split("-");
						switch(littlestr[1])
						{
							case "all":
								diagrams[newID].load(diagrams[newID].flate_decode(littlestr[2]));
								diagrams[newID].frames[diagrams[newID].current_frame].draw();
							break;
					
							case "current":
								diagrams[newID].frames[diagrams[newID].current_frame].load(diagrams[newID].flate_decode(littlestr[2]));			
								diagrams[newID].frames[diagrams[newID].current_frame].draw();
							break;
						}
					diagrams[newID].first_frame();
					}

				}
				},10);

				});



	/* ------------------------------------------------------------------------- */
	/* --------------------------- ANIMATION MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */

	
	$(".cmd_playpause").click(function(){
		var aDiag = diagrams[$(this).attr("id").split("-")[0]];
		var i = aDiag.current_frame;
		var len = aDiag.frames.length;
		if(aDiag.playing)
		{
			aDiag.playing = false;
			$('#pf-cmd_playpause').attr("value","▷");
		}
		else{
			aDiag.playing = true;		
			$('#pf-cmd_playpause').attr("value","||");
		}
		var counter = 0;
		function render(){
			// TODO: does not escape properly when we press pause
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
				else if($("#"+aDiag.painter.IDString+"-loop").is(":checked"))
				{
					i = 0; 
					requestAnimationFrame(render);
				}
		}
		render();
	});

	/* ------------------------------------------------------------------------- */
	/* --------------------------- BUTTON MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */
	// todo: there's too many $(this).attr("id").split("-")[0] ....
	// $(this).attr("id").split("-")[0] == id name
	// diagrams[$(this).attr("id").split("-")[0]] == corresponding diagram
	$(".current-frame").blur(function(){
		if ($("#"+$(this).attr("id").split("-")[0]+"-current-frame").val() > 0 && $("#"+$(this).attr("id").split("-")[0]+"-current-frame").val() <= diagrams[$(this).attr("id").split("-")[0]].frames.length)
		{diagrams[$(this).attr("id").split("-")[0]].goto_frame($("#tomtom-current-frame").val());}
		
	});		
		
	$(".cmd_first").click(function(){
		diagrams[$(this).attr("id").split("-")[0]].first_frame();
	});

	$(".cmd_prev").click(function(){
		diagrams[$(this).attr("id").split("-")[0]].previous_frame();
	});

	$(".cmd_next").click(function(){
		if(diagrams[$(this).attr("id").split("-")[0]].current_frame < diagrams[$(this).attr("id").split("-")[0]].frames.length - 1){
		diagrams[$(this).attr("id").split("-")[0]].next_frame();
		}
	});

	$(".cmd_last").click(function(){
		diagrams[$(this).attr("id").split("-")[0]].last_frame();
	});
		
}); // end jquery.ready	