function drawSoundwave(canvas) {							
				var WHITE = "#FFF";
				var BLACK = "#000";
				var NO = 0;
				var YES = 1;	
				
			    if (this.isVisible == YES) {this.strokeColor = BLACK;} else {this.strokeColor = WHITE;} 				// Set the color to white if the visible flag is off
				for (i = 0; i < this.ctrlPoints.length; i++){this.ctrlPoints[i].strokeColor = this.strokeColor;}		// Update the visibility of the all the control points
				canvas.strokeStyle = this.strokeColor;																	// Set the canvas color
				canvas.lineWidth = this.strokeWidth;
				
				canvas.beginPath();																						 
				if (this.isVisible == YES) {
					for (i = 2; i < this.ctrlPoints.length; i+=2) {														// Draw lines between every other two control points
							canvas.moveTo(this.ctrlPoints[i-1].x, this.ctrlPoints[i-1].y);
							canvas.lineTo(this.ctrlPoints[i].x, this.ctrlPoints[i].y);
						}
				}
	 			
				c = bezierCurvePath(this.ctrlPoints, $("#points").val(), canvas.canvas.width );
				canvas.strokeStyle = BLACK;
				for (t = 0; t < c.length ; t++) {
					canvas.fillRect(c[t].x,c[t].y,1,1);																	// Fill a pixel
				}
				canvas.stroke();
		 		canvas.closePath();
}

function playSoundWave(ctrlPointArray, audioCtx, frameWidth, frameHeight) {
				var wave = [];
			    wave = bezierCurvePath(ctrlPointArray, $("#points").val(), frameWidth); 											    
				var channels = 2;																						// Make it a stereo sound
				var frameCount = audioCtx.sampleRate * $("#duration").val();											
				var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);					// Create an empty duration seconds of stereo buffer at the sample rate of the AudioContext

				for (var channel = 0; channel < channels; channel++) {													// Fill the buffer with my invented sound 
					var nowBuffering = myArrayBuffer.getChannelData(channel);											// This gives us the actual array that contains the data
					for (var j = 0; j < Math.floor(frameCount / wave.length); j++) {									// loop over the entire frame count
						for (var i = 0; i < wave.length; i++) {
							nowBuffering[(j* wave.length) + i] = ((wave[i].y - (frameHeight / 2)) / frameHeight); 
						}	
					}
				}

				var source = audioCtx.createBufferSource();									// Get an AudioBufferSourceNode to play the AudioBuffer
				source.buffer = myArrayBuffer;												// set the buffer in the AudioBufferSourceNode
				source.connect(audioCtx.destination);										// connect the AudioBufferSourceNode to the destination so we can hear the sound
				source.start();																// start the source playing
}