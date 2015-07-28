$(document).ready(

	function(){ 
			var canvas = oCanvas.create({canvas: "#profileCanvas"}); 													// Global oCanvas object
			canvas.width  = window.innerWidth;																			// Set the canvas width equal to the browser's inner window width
			
			var ctrlPointArray = []; 																					// Global variable array to hold curve's control point coordinates		
			canvas.display.register("soundWave", {shapeType: "soundWave", isVisible: 1}, drawSoundwave);  				// Register a new custom soundWave shape for our oCanvas and link it to the drawSoundwave function																						
			var soundWaveObj = canvas.display.soundWave({ctrlPoints: ctrlPointArray, stroke: "1px #000", isVisible: 1}); 	// Global variable soundWave shape object	
			canvas.addChild(soundWaveObj);
			
			var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 									// Global audio context 
			var RIGHT_MOUSE = 1;																						// Global constants
			var SPACEBAR = 32;
			var LETTER_C = 67;
			var NO = 0;
			var YES = 1;
			
			canvas.bind("dblclick", function (click) { 																	// Double clicking adds a control point
			     
				if (click.which == RIGHT_MOUSE) {												 						// Right button press
					var isExistingCtrlPoint = NO;
					if (ctrlPointArray.length > 0) {																	// Detect if button press is within an existing control point
						for (i = 0; i < ctrlPointArray.length; i++) {
							if ( Math.pow( canvas.mouse.x - ctrlPointArray[i].x, 2) + Math.pow( canvas.mouse.y - ctrlPointArray[i].y, 2) < Math.pow(ctrlPointArray[i].radius,2)) {
								isExistingCtrlPoint = YES;
							}
						}
					}
					
					if (isExistingCtrlPoint == NO) {																	// If not in an existing control point then add a new control point to the soundWave object
		    			var ctrlPoint = canvas.display.ellipse({x: canvas.mouse.x, y: canvas.mouse.y, radius: 5,stroke: "1px #000"});
		    			ctrlPointArray[ctrlPointArray.length] = ctrlPoint;
						canvas.addChild(ctrlPoint);
						var dragOptions = { changeZindex: false };
						ctrlPoint.dragAndDrop(dragOptions);
						
					}
				}
			});
			
			canvas.bind("keydown", function (key) {
			
				if (key.which == SPACEBAR) {										// Spacebar turns on and off the control points and lines of the bezier object
					if (soundWaveObj.isVisible == NO) {
						soundWaveObj.isVisible = YES;
						canvas.redraw();
					} else {
						soundWaveObj.isVisible = NO; 
						canvas.redraw();
					}
				}
				
				if (key.which == LETTER_C) {										// the letter C clears the canvas and resets the global variables
					canvas.children = [];
					canvas.clear();
					ctrlPointArray = [];
					soundWaveObj = null;
				}
			
			});
			
			$( '#play' ).click ( function () { 
				playSoundWave(ctrlPointArray, audioCtx, canvas.width, canvas.height);
			});
	
	});
	