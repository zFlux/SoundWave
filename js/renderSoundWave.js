function drawSoundwave(canvas) {
	   				

				
				if (this.strokeWidth > 0) {
					canvas.strokeStyle = this.strokeColor;
					canvas.lineWidth = this.strokeWidth;
				}
				
				// Draw red control lines for every other two control points if there's no lock
				canvas.beginPath();
		 		if (this.control == 1) {canvas.strokeStyle = "#000000";} else {canvas.strokeStyle = "#FFF";}
		 		for (i = 0; i < this.points.length; i++){this.points[i].strokeColor = canvas.strokeStyle;}

		 		for (i = 2; i < this.points.length; i+=2)
				{
					if (this.control == 1) {
						canvas.moveTo(this.points[i-1].x, this.points[i-1].y);
						canvas.lineTo(this.points[i].x, this.points[i].y);
					}

				}
				canvas.stroke();
	 			canvas.closePath();	
	 			
				c = bezierCurvePath(this.points, $("#points").val(), canvas.canvas.width );
				
				
				canvas.beginPath();
				canvas.strokeStyle = "#000000";
				for (t = 0; t < c.length ; t++) {
					canvas.fillRect(c[t].x,c[t].y,1,1);
				}  
				canvas.stroke();
		 		canvas.closePath();
}

function playSoundwave(waveCoordArray, audioCtx, canvas) {
				
				var wave = [];
			    wave = bezierCurvePath(waveCoordArray, $("#points").val(), canvas.width);
			        
			    // Stereo
				var channels = 2;
				
				// Create an empty duration seconds stereo buffer at the
				// sample rate of the AudioContext
				var frameCount = audioCtx.sampleRate * $("#duration").val();
				
				var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

				// Fill the buffer with my invented sound 
				for (var channel = 0; channel < channels; channel++) {
					// This gives us the actual array that contains the data
					var nowBuffering = myArrayBuffer.getChannelData(channel);

					// loop over the entire frame count
					for (var j = 0; j < Math.floor(frameCount / wave.length); j++) {
						for (var i = 0; i < wave.length; i++) {
							nowBuffering[(j* wave.length) + i] = ((wave[i].y - (canvas.height / 2)) / canvas.height); 
						}	
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
}