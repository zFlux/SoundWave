var SoundWave = function (canvas, audioCtx) {
  // Set the Drawing and Audio context for the object
  this.canvas = canvas;
  this.canvas.width  = window.innerWidth;
  this.audioCtx = audioCtx
  
  // Register the function for drawing a sound wave with the oCanvas object
  this.canvas.display.register("soundWave", {shapeType: "soundWave", isVisible: 1}, drawSoundwave);
  // Create the sound wave visual object
  this.soundWaveObj = this.canvas.display.soundWave({ctrlPoints: [], stroke: "1px #000", isVisible: 1});
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
  
}

SoundWave.prototype.reset = function() {
  this.canvas.children = [];
  this.canvas.clear();
  this.soundWaveObj.ctrlPoints = [];
};


