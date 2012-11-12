TeDiGe-2
========
TeDiGe-2 is an online Tetris Diagram Generator.  A bit like [fumen](http://fumen.zui.jp/), a bit like [tage](http://tage.emaame.com/), except the comments are written in english (... sort of) instead of Japanese. It makes heavy use of the <Canvas> element.

Examples / Demo
----------------
See [this](http://petitprince.github.com/TeDiGe-2/examples.html) for a practical example. For how to use the editor, see [this wiki page](https://github.com/PetitPrince/TeDiGe-2/wiki/User-manual).

Usage
------
To use TeDiGe-2, you need to generate some TeDiGe-2 code and display it somewhere.
You should have this folder structure similar to this:
<pre>
|- res
  |---- lot of stuff
|- jquery.js
|- editor.html
|- tedige-editor.css
|- tedige-editor.min.js
|- tedige-inline.min.js
|- tedige-viewer.css
|- tedige-viewer.min.js
|- viewer.html
</pre>

### Setting up the editor
Simply open editor.html . Note that the "get editor/viewer string" function assumes that viewer.html and editor.html are in the same folder.


### Displaying the diagrams in your page

In your header place

    <link rel="stylesheet" type="text/css" src="viewer.cs" />
    <script src="jquery.js"></script> <!-- You can ignore this if you're already using it somewhere else -->
    <script src="tedige-the-inline.min.js"></script>

Doing so will convert any div in your page that look like

    <div id="UNIQUE_ID" class="tedige-playfield-wrapper" title="TEDIGE_CODE"></div>

into the corresponding nicely formatted canvas.
UNIQUE_ID is, you guessed it, an unique ID, and TEDIGE_CODE is a mumbo-jumbo of a string generated
by the editor. See example.html for a practical example.

You can edit viewer.css to style the diagram at your convenience. The canonical html code is:

    <div id="UNIQUE_ID" class="tedige-playfield-wrapper" title="TEDIGE_CODE">
    	<div class="left-pane">';
    		<div class="nexthold-container">';
    			<canvas id="'+UNIQUE_ID+'-nexthold-background"	width="97" height="32" style="z-index:0;"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-nexthold"	width="97" height="32" style="z-index:1;"></canvas>';
    		</div>';
    		<div class="canvas-container" id="'+UNIQUE_ID+'-container border-gray">';
    			<canvas id="'+UNIQUE_ID+'-border"		width="97" height="177" style="z-index:0;background-color: black"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-background"	width="97" height="177" style="z-index:1;//background-color: black"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-inactive"	 width="97" height="177" style="z-index:2; border:none; opacity: 0.65"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-whiteborder" width="97" height="177" style="z-index:3"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-active"		width="97" height="177" style="z-index:4"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-deco"			width="97" height="177" style="z-index:5"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-decoPin"	 width="97" height="177" style="z-index:6; border:none; opacity: 0.65;display:none"></canvas>';
    			<canvas id="'+UNIQUE_ID+'-preview"		width="97" height="177" style="z-index:6"></canvas>';
    		</div>';
    		<div class="control-div">';
    		<canvas class="canvas-control" id="'+UNIQUE_ID+'-control" width="97" height="35" style=""></canvas>';
    		</div>';
    		</div>';
    		<div class="right-pane">';
    		<div class="progressbar">';
    			<p>';
    				<input class="current-frame" id="'+UNIQUE_ID+'-current-frame" type="text" style="width: 2.5em; text-align:center" /> / <span id="'+UNIQUE_ID+'-total-frame">1</span>';
    			</p>';
    			<canvas id="'+UNIQUE_ID+'-progressbar" width="97" height="24" style="border: 1px solid white;" />';
    		</div>';
    		<div id="order-control"> ';
    			<input class="cmd_prev" id="'+UNIQUE_ID+'-cmd_prev"	value="?"	type="button" />';
    			<input class="cmd_next" id="'+UNIQUE_ID+'-cmd_next"	value="?"	type="button" /><br />';
    			<input class="cmd_first" id="'+UNIQUE_ID+'-cmd_first" value="|?" type="button"/>';
    			<input class="cmd_last" id="'+UNIQUE_ID+'-cmd_last" value="?|" type="button"	style="width:2.5em"/><br />';
    			<input class="cmd_playpause" id="'+UNIQUE_ID+'-cmd_playpause" value ="?" type="button" style="width:2.5em" /><br />';
    			<input class="check-loop" id="'+UNIQUE_ID+'-loop"type="checkbox"> loop';
    		</div>';
    	</div>';
    	<div id="under">';
    		<textarea readonly="" id="'+UNIQUE_ID+'-comment" class="comment"></textarea>';
    	</div>';
    </div>

Alternatively, you can use an iframe like you did with fumen

    <iframe width="230" scrolling="no" height="335" frameborder="0" src="PATH_TO_VIEWER.HTML?FUMEN_CODE"></iframe>

But iframes generally sucks and can lead to security issues.

Documentation
---------------
A generated documentation can be found in /doc/ . Otherwise, go take a look at the source !


Contributing & Reporting bug
----------------------------
If you want a particular feature or wish to report a big, please use the github system.

TeDiGe-2 uses [uglify-js2](https://github.com/mishoo/UglifyJS2) to compress its code, and [js-doc toolkit](https://code.google.com/p/jsdoc-toolkit/) to generate its documentation.

License
--------
TeDiGe-2 is under Creative Commons 3 Attribution (CC3 BY) ![CC3 BY Logo](http://i.creativecommons.org/l/by/3.0/ch/88x31.png "CC3 BY Logo")
Also, TeDiGe-2 is not affiliated nor endorsed by the Tetris Company (except if they happend to fork it :D). Yes, I know I use your trademark, but don't sue me, it would be stupid.