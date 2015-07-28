$(document).ready(

	function(){ 
			var canvas = oCanvas.create({canvas: "#profileCanvas"}); 							// Global oCanvas object
			canvas.width  = window.innerWidth;										// Set the canvas width equal to the browser's inner window width
			
			var ctrlPointArray = []; 											// Global variable array to hold the curve's control point coordinates for the drawn bezier curve
			var sndCtrlPointArray = [];											// Global variable array to hold the curve's control point coordinates for the sound wave 
			canvas.display.register("soundWave", {shapeType: "soundWave", isVisible: 1}, drawSoundwave);  			// Register a new custom soundWave shape for our oCanvas and link it to the drawSoundwave function																						
			var soundWaveObj = canvas.display.soundWave({ctrlPoints: ctrlPointArray, stroke: "1px #000", isVisible: 1}); 	// Global variable soundWave shape object	
			canvas.addChild(soundWaveObj);
			
			var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 					// Global audio context 
			var RIGHT_MOUSE = 1;												// Global constants
			var SPACEBAR = 32;
			var BACKSPACE = 8;
			var LETTER_C = 67;
			var NO = 0;
			var YES = 1;
			var KEY_MAP = 
			
			{
			
			// fourth row
			49 : {letter : '1', value : 24}, 50 : {letter : '2', value : 22}, 51 : {letter : '3', value : 20}, 52 : {letter : '4', value : 18}, 53 : {letter : '5', value : 16},  54 : {letter : '6', value : 14},  
			55 : {letter : '7', value : 12},  56 : {letter : '8', value : 10},  57 : {letter : '9', value : 8},  48 : {letter : '0', value : 6},  189 : {letter : '-', value : 4},  187 : {letter : '=', value : 2},
			// third row
			81 : {letter : 'Q', value : 23}, 87 : {letter : 'W', value : 21}, 69 : {letter : 'E', value : 19}, 82 : {letter : 'R', value : 17}, 84 : {letter : 'T', value : 15},  89 : {letter : 'Y', value : 13},  
			85 : {letter : 'U', value : 11}, 73 : {letter : 'I', value : 9},  79 : {letter : 'O', value : 7},  80 : {letter : 'P', value : 5},  219 : {letter : '\[', value : 3},  221 : {letter : '\]', value : 1}, 
			// second row
			65 : {letter : 'A', value : 0}, 83 : {letter : 'S', value : -2}, 68 : {letter : 'D', value : -4}, 70 : {letter : 'F', value : -6}, 71 : {letter : 'G', value : -8},  72 : {letter : 'H', value : -10},  
			74 : {letter : 'J', value : -12},  75 : {letter : 'K', value : -14},  76 : {letter : 'L', value : -16},  186 : {letter : ';', value : -18},  222 : {letter : '\'', value : -20},  220 : {letter : '\\', value : -22},
			// first row
			90 : {letter : 'Z', value : -1}, 88 : {letter : 'X', value : -3}, 67 : {letter : 'C', value : -5}, 86 : {letter : 'V', value : -7}, 66 : {letter : 'B', value : -9},  78 : {letter : 'N', value : -11},  
			77 : {letter : 'M', value : -13},  188 : {letter : '\,', value : -15},  190 : {letter : '\.', value : -17},  191 : {letter : '\/', value : -19},  16 : {letter : 'SHIFT', value : -21},  38 : {letter : '', value : -23},
			};
			
			canvas.bind("dblclick", function (click) { 																		// Double clicking adds a control point
			    
				if (click.which == RIGHT_MOUSE) {												 						// Right button press
					var isExistingCtrlPoint = NO;
					if (ctrlPointArray.length > 0) {																	// Detect if button press is within an existing control point
						for (i = 0; i < ctrlPointArray.length; i++) {
							if ( Math.pow( canvas.mouse.x - ctrlPointArray[i].x, 2) + Math.pow( canvas.mouse.y - ctrlPointArray[i].y, 2) < Math.pow(ctrlPointArray[i].radius,2)) {
								isExistingCtrlPoint = YES;
							}
						}
					}
					
					if (isExistingCtrlPoint == NO) {																	// If not in an existing control point then add a new drawn control point and sound control point 
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
				
				else if (key.which == BACKSPACE) {									// the letter C clears the canvas and resets the global variables
					canvas.children = [];
					canvas.clear();
					ctrlPointArray = [];
				}
				
				else {
				
					var frequency = $("#points").val() * Math.pow(2, KEY_MAP[key.which].value / 12);
					var wave = [];
					sndCtrlPointArray = [];
					
					// Transpose the control points to values between -1 and 1
					for (i = 0; i < ctrlPointArray.length; i++) {
							var sndCtrlPoint = {x: (ctrlPointArray[i].x / canvas.width) * frequency, y: ((ctrlPointArray[i].y / canvas.height))*2 - 1 };  // for the sound y coordinate ensure it's a number between +1 and -1  
							sndCtrlPointArray[sndCtrlPointArray.length] = sndCtrlPoint;
					} 
					
					wave = bezierCurvePath(sndCtrlPointArray, frequency, frequency, 0); 
					playSoundWave(wave, audioCtx);
				}
			});
			
			$( '#play' ).click ( function () { 
				var frequency = $("#points").val();
				var wave = [];
			    wave = bezierCurvePath(sndCtrlPointArray, frequency, frequency, 1); 
				playSoundWave(wave, audioCtx);
			});
	
	});
	