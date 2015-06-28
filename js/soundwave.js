$(document).ready(

	function(){ 
			
			// Create a new oCanvas object
			var canvas = oCanvas.create({canvas: "#profileCanvas"});
			canvas.width  = window.innerWidth;
			
			// Global variables for the Sound Wave object and its coordinates
			// to be manipulated by button clicks and user events
			var waveCoordCntr = 0;
			var waveCoordArray = []; 
			var soundWaveObj;
			
			// Global audio context to use in conjunction with the Sound Wave object to make a sound
			var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

			
			// Register a new soundWave shape on our oCanvas and link it to the drawSoundwave function for rendering
			canvas.display.register("soundWave", {shapeType: "soundWave", control: 1}, drawSoundwave);

			// Double clicking adds a control point
			canvas.bind("dblclick", function (x) {
			        
			        // Right button press
				if (x.which == 1) {
					// Detect if button press is within an existing control point
					var detectbit = 0;
					if (waveCoordCntr > 0) {
						for (i = 0; i < waveCoordArray.length; i++)
						{
							if ( Math.pow( canvas.mouse.x - waveCoordArray[i].x, 2) + Math.pow( canvas.mouse.y - waveCoordArray[i].y, 2) < Math.pow(waveCoordArray[i].radius,2)) {
								detectbit = 1;
							}
						}
					}
					
					// If not in an existing control point then add a new control point to the soundWave object
					if (detectbit == 0) {
						waveCoordCntr++;
						
						// if this is the first control point create the soundWave object and add it to the canvas
						if (waveCoordCntr == 1) {
							soundWaveObj = canvas.display.soundWave({points: waveCoordArray, stroke: "1px #000", control: 1});
							canvas.addChild(soundWaveObj);
						}
						
		    			var ctrlPoint = canvas.display.ellipse({x: canvas.mouse.x, y: canvas.mouse.y, radius: 5,stroke: "1px #FF0000"});
		    			waveCoordArray[waveCoordArray.length] = ctrlPoint;
						canvas.addChild(ctrlPoint);
						var dragOptions = { changeZindex: false };
						ctrlPoint.dragAndDrop(dragOptions);
					}
					
				}
				

			});
			
			
			canvas.bind("keydown", function (x) {
			
				// Spacebar turns on and off the control points and lines of the bezier object
				if (x.which == 32) {
					if(soundWaveObj.control == 0) {
						soundWaveObj.control = 1;
						canvas.redraw();
					} else {
						soundWaveObj.control = 0; 
						canvas.redraw();
					}
				}
				
				// the letter E creates an endpoint
				if (x.which == 69) {
					var point = canvas.display.ellipse({x: canvas.width, y: canvas.height / 2, radius: 5,stroke: "1px #FF0000"});
		    			waveCoordArray[waveCoordArray.length] = point;
					canvas.addChild(point);
				}
				
				// the letter C clears the canvas and resets the global variables
				if (x.which == 67) {
					canvas.children = [];
					canvas.clear();
					waveCoordCntr = 0;
					waveCoordArray = [];
					soundWaveObj = null;
				}
			
			});
			
			$( '#play' ).click ( function () {
			  
			    var wave = [];
			    wave = bezierCurve(waveCoordArray, $("#points").val());
			        
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
	