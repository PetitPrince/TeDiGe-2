	$(document).ready(function(){

		// there's potentially loads and loads of playfield to render, so we create some containers
		var diagrams = [];
		var painters = [];

		// fill each wrapper with their canvas content
		$('.tedige-playfield-wrapper').each(function(index) {
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
			insert[i++] = '			<input class="cmd_playpause"id="'+newID+'-cmd_playpause" value ="▷" type="button" style="width:2.5em" /><br > <input type="checkbox"> loop';
			insert[i++] = '		</div>';
			insert[i++] = '	</div>';
			insert[i++] = '	<div id="under">';
			insert[i++] = '		<textarea readonly="" id="'+newID+'" class="comment"></textarea>';
			insert[i++] = '	</div>';
			$('#'+newID).html(insert.join('\n'));

			painters[newID] = new Painter(newID);
			diagrams[newID] = new Diagram(painters[newID]);
			diagrams[newID].init();
			painters[newID].init();
			console.log(newID); // remove this

		});

	// load the playfield data into the canvases
	var initiator = setInterval(function(){

		if(painters['tomtom'].ready) {
			clearInterval(initiator);
			var URLsearch = window.location.search;

			if(URLsearch) // load if there's something in the url
			{
			var littlestr = URLsearch.split('-');
				switch(littlestr[1])
				{
					case 'all':
						diagrams['tomtom'].load(diagrams['tomtom'].flate_decode(littlestr[2]));
						diagrams['tomtom'].frames[diagrams['tomtom'].current_frame].draw();
					break;

					case 'current':
						diagrams['tomtom'].frames[diagrams['tomtom'].current_frame].load(diagrams['tomtom'].flate_decode(littlestr[2]));
						diagrams['tomtom'].frames[diagrams['tomtom'].current_frame].draw();
					break;
				}
		}

		}
	},10);


	/* ------------------------------------------------------------------------- */
	/* --------------------------- ANIMATION MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */


		var playpause = false;
	$('#tomtom-cmd_playpause').click(function(){
		// this memory leak hards !!!
		var i = diagrams['tomtom'].current_frame;
		var len = diagrams['tomtom'].frames.length;
		var interval = '';
		if(playpause)
		{
			playpause = false;
			$('#tomtom-cmd_playpause').val('▷');
		}
		else{
			playpause = true;
			$('#tomtom-cmd_playpause').val('∥');
		}

		function draw() {
			setTimeout(function() {
				var myReq = window.requestAnimationFrame(draw);

			if (i < len && playpause)
				{
					diagrams['tomtom'].goto_frame(i);
					interval = diagrams['tomtom'].frames[diagrams['tomtom'].current_frame].duration;
					i++;
				}
				else if($('#tomtom-loop').is(':checked'))
				{
					i = 0;
				}

				else
				{
					window.cancelAnimationFrame(myReq);
				}

			}, interval);
		}
		draw();
	});

	/* ------------------------------------------------------------------------- */
	/* --------------------------- BUTTON MANAGEMENT  -------------------------- */
	/* ------------------------------------------------------------------------- */

	// $(this).attr('id').split('-')[0] == id name
	// diagrams[$(this).attr('id').split('-')[0]] == corresponding diagram
	$('.current-frame').blur(function(){
		if ($('#'+$(this).attr('id').split('-')[0]+'-current-frame').val() > 0 && $('#'+$(this).attr('id').split('-')[0]+'-current-frame').val() <= diagrams[$(this).attr('id').split('-')[0]].frames.length)
		{diagrams[$(this).attr('id').split('-')[0]].goto_frame($('#tomtom-current-frame').val());}

	});

	$('.cmd_first').click(function(){
		diagrams[$(this).attr('id').split('-')[0]].first_frame();
	});

	$('.cmd_prev').click(function(){
		diagrams[$(this).attr('id').split('-')[0]].previous_frame();
	});

	$('.cmd_next').click(function(){
		if(diagrams[$(this).attr('id').split('-')[0]].current_frame < diagrams[$(this).attr('id').split('-')[0]].frames.length - 1){
		diagrams[$(this).attr('id').split('-')[0]].next_frame();
		}
	});

	$('.cmd_last').click(function(){
		diagrams[$(this).attr('id').split('-')[0]].last_frame();
	});

}); // end jquery.ready