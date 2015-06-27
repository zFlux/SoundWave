$(document).ready(

	function(){ 
			
			// Create a new oCanvas object
			var canvas = oCanvas.create({canvas: "#profileCanvas"});
			canvas.width  = window.innerWidth;
			
			// Global variables for points
			var pointCounter = 0;
			var pointArray = []; 
			var bezier;
			
			// Create an audio context
			var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

			
			// Register a new object for a curve
			canvas.display.register("soundWave", {shapeType: "soundWave", control: 1}, drawSoundwave);

			
			
			
			// Pressing x while the canvas is selected adds a small draggable circle to the canvas
			// As well as a line connecting it to the previous circle or the mid point of the canvas if its the first click
			canvas.bind("dblclick", function (x) {
			        
			        // Right button press
				if (x.which == 1) {
					// Detect if button press is within an existing circle
					var detectbit = 0;
					if (pointCounter > 0) {
						for (i = 0; i < pointArray.length; i++)
						{
							if ( Math.pow( canvas.mouse.x - pointArray[i].x, 2) + Math.pow( canvas.mouse.y - pointArray[i].y, 2) < Math.pow(pointArray[i].radius,2)) {
								detectbit = 1;
							}
						}
					}
					
					// If not in an existing circle then add a new circle
					if (detectbit == 0) {
						pointCounter++;
						// if this is the first small circle add an extra small circle at the midpoint of the start of the canvas
						if (pointCounter == 1) {
							var point = canvas.display.ellipse({x: 0, y: canvas.height / 2, radius: 5,stroke: "1px #FF0000"});
							canvas.addChild(point);
							pointArray[pointArray.length] = point;
							bezier = canvas.display.soundWave({points: pointArray, stroke: "1px #000", control: 1});
							canvas.addChild(bezier);
						}
		    				var point = canvas.display.ellipse({x: canvas.mouse.x, y: canvas.mouse.y, radius: 5,stroke: "1px #FF0000"});
		    				pointArray[pointArray.length] = point;
						canvas.addChild(point);
						var dragOptions = { changeZindex: false };
						point.dragAndDrop(dragOptions);
					}
					
				}
				

			});
			
			
			canvas.bind("keydown", function (x) {
			
				// Spacebar turns on and off the control points and lines of the bezier object
				if (x.which == 32) {
					if(bezier.control == 0) {
						bezier.control = 1;
						canvas.redraw();
					} else {
						bezier.control = 0; 
						canvas.redraw();
					}
				}
				
				// the letter E creates an endpoint
				if (x.which == 69) {
					var point = canvas.display.ellipse({x: canvas.width, y: canvas.height / 2, radius: 5,stroke: "1px #FF0000"});
		    			pointArray[pointArray.length] = point;
					canvas.addChild(point);
				}
				
				// the letter C clears the canvas and resets the global variables
				if (x.which == 67) {
					canvas.children = [];
					canvas.clear();
					pointCounter = 0;
					pointArray = [];
					bezier = null;
				}
			
			});
			
			$( '#play' ).click ( function () {
			  
			        var wave = [];
			        
			        wave = bezierCurve2(pointArray, $("#points").val());
			        
			        // Stereo
				var channels = 2;
				
				// Create an empty duration seconds stereo buffer at the
				// sample rate of the AudioContext
				var frameCount = audioCtx.sampleRate * $("#duration").val();
				
				
				var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
				

				// Fill the buffer with my invented sound and the complement
				for (var channel = 0; channel < channels; channel++) {
					// This gives us the actual array that contains the data
					var nowBuffering = myArrayBuffer.getChannelData(channel);

				// loop over the entire frame count
				for (var j = 0; j < Math.floor(frameCount / wave.length); j++)

					for (var i = 0; i < wave.length; i++) {
						nowBuffering[(j* wave.length) + i] = ((wave[i].y - (canvas.height / 2)) / canvas.height); 
						nowBuffering[(j* wave.length) + wave.length + i] = (-1 * (wave[i].y - (canvas.height / 2)) / canvas.height); 
					}	
					
	
				}
				
				// Get an AudioBufferSourceNode
				// This is the AudioNode to use when we want to play an AudioBuffer
				var source = audioCtx.createBufferSource();
				
				// set the buffer in the AudioBufferSourceNode
				source.buffer = myArrayBuffer;
				
				// connect the AudioBufferSourceNode to the
				// destination so we can hear the sound
				source.connect(audioCtx.destination);
				
				// start the source playing
				source.start();


			});
	

	
	});
	