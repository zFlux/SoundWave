var SoundWave = function (canvas, audioCtx) {
  // Set the Drawing and Audio context for the object
  this.canvas = canvas;
  this.canvas.width  = window.innerWidth;
  this.audioCtx = audioCtx
  
  // Register the function for drawing a sound wave with the oCanvas object
  this.canvas.display.register("soundWave", {shapeType: "soundWave", isVisible: 1}, this.drawSoundwave);
  // Create the sound wave visual object
  this.soundWaveObj = this.canvas.display.soundWave({ctrlPoints: [], midPoints: [], stroke: "1px #000", isVisible: 1});
  // Add it to the canvas
  this.canvas.addChild(this.soundWaveObj);
  
};


SoundWave.prototype.isExistingCtrlPoint = function(mouseX, mouseY) {
  
  if (this.soundWaveObj.ctrlPoints.length > 0) {																	
    for (i = 0; i < this.soundWaveObj.ctrlPoints.length; i++) {
      if ( Math.pow( mouseX - this.soundWaveObj.ctrlPoints[i].x, 2) + Math.pow( mouseY - this.soundWaveObj.ctrlPoints[i].y, 2) < Math.pow(this.soundWaveObj.ctrlPoints[i].radius,2)) {
	return 1;
      }
    }
  }
  return 0;
};

SoundWave.prototype.createCtrlPoint = function(mouseX, mouseY) {
  // create control point
  var ctrlPoint = this.canvas.display.ellipse({x: mouseX, y: mouseY, radius: 5,stroke: "1px #000"}); 
  var dragOptions = { changeZindex: false };
  ctrlPoint.dragAndDrop(dragOptions);
  // add control point to the array
  this.soundWaveObj.ctrlPoints[this.soundWaveObj.ctrlPoints.length] = ctrlPoint;
  // add it to the canvas
  this.canvas.addChild(ctrlPoint);
  
};

SoundWave.prototype.toggleVisibleCtrlPoints = function() {
  if (this.soundWaveObj.isVisible == 0) {
    this.soundWaveObj.isVisible = 1;
    this.canvas.redraw();
  } else {
    this.soundWaveObj.isVisible = 0; 
    this.canvas.redraw();
  }
  
};

SoundWave.prototype.soundPoints = function(frequency) {
  var sndCtrlPointArray = [];
  
  // Transpose the control points to values between -1 and 1
  for (i = 0; i < this.soundWaveObj.ctrlPoints.length; i++) {
    var sndCtrlPoint = {x: (this.soundWaveObj.ctrlPoints[i].x / this.canvas.width) * frequency, y: ((this.soundWaveObj.ctrlPoints[i].y / this.canvas.height))*2 - 1 };  // for the sound y coordinate ensure it's a number between +1 and -1  
    sndCtrlPointArray[sndCtrlPointArray.length] = sndCtrlPoint;
  } 
  
  return bezierCurvePath(sndCtrlPointArray, frequency, frequency, 0); 
  
};

SoundWave.prototype.reset = function() {
  this.canvas.children = [];
  this.canvas.clear();
  this.soundWaveObj.ctrlPoints = [];
};

SoundWave.prototype.playSoundwave = function(frequency, duration) {
  var wave = this.soundPoints(frequency);
  var channels = 2;											// Make it a stereo sound
  var frameCount = this.audioCtx.sampleRate * duration;											
  var myArrayBuffer = this.audioCtx.createBuffer(channels, frameCount, this.audioCtx.sampleRate);	// Create an empty duration seconds of stereo buffer at the sample rate of the AudioContext
  
  for (var channel = 0; channel < channels; channel++) {						// Fill the buffer with my invented sound 
    var nowBuffering = myArrayBuffer.getChannelData(channel);						// This gives us the actual array that contains the data
    for (var j = 0; j < Math.floor(frameCount / wave.length); j++) {					// loop over the entire frame count
      for (var i = 0; i < wave.length; i++) {
	nowBuffering[(j* wave.length) + i] = wave[i].y; 
      }	
    }
  }
  
  var source = this.audioCtx.createBufferSource();							// Get an AudioBufferSourceNode to play the AudioBuffer
  source.buffer = myArrayBuffer;									// set the buffer in the AudioBufferSourceNode
  source.connect(this.audioCtx.destination);								// connect the AudioBufferSourceNode to the destination so we can hear the sound
  source.start();											// start the source playing
};

SoundWave.prototype.drawSoundwave = function(canvas) {							
  var WHITE = "#FFF";
  var BLACK = "#000";
  var NO = 0;
  var YES = 1;	
  
  if (this.isVisible == YES) {this.strokeColor = BLACK;} else {this.strokeColor = WHITE;} 			// Set the color to white if the visible flag is off
  for (i = 0; i < this.ctrlPoints.length; i++){this.ctrlPoints[i].strokeColor = this.strokeColor;}		// Update the visibility of the all the control points
  canvas.strokeStyle = this.strokeColor;									// Set the canvas color
  canvas.lineWidth = this.strokeWidth;
  
  canvas.beginPath();
  if (this.isVisible == YES) {
    for (i = 2; i < this.ctrlPoints.length; i+=2) {								// Draw lines between every other two control points
      canvas.moveTo(this.ctrlPoints[i-1].x, this.ctrlPoints[i-1].y);
      canvas.lineTo(this.ctrlPoints[i].x, this.ctrlPoints[i].y);
    }
  }
  
  c = bezierCurvePath(this.ctrlPoints, $("#points").val(), canvas.canvas.width, canvas.canvas.height );
  canvas.strokeStyle = BLACK;
  for (t = 0; t < c.length ; t++) {
    canvas.fillRect(c[t].x,c[t].y,1,1);										// Fill a pixel
  }
  canvas.stroke();
  canvas.closePath();
};
