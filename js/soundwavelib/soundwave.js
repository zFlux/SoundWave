var SoundWave = function(canvas, audioCtx) {
  // Set the Drawing and Audio context for the object
  this.canvas = canvas;
  this.canvas.width = window.innerWidth;
  this.audioCtx = audioCtx

  // Register the function for drawing a sound wave with the oCanvas object
  this.canvas.display.register("soundWave", {
    shapeType: "soundWave",
    isVisible: 1
  }, this.drawSoundwave);

  // Create the sound wave visual object
  this.soundWaveObj = this.canvas.display.soundWave({
    ctrlLines: [],
    stroke: "1px #000",
    isVisible: 1
  });

  // Add it to the canvas
  this.canvas.addChild(this.soundWaveObj);
};

// This method is private and just sets up the first and last control lines
SoundWave.prototype.addFirstAndLastCtrlLines = function(mouseX, mouseY) {
  // create the first and last control lines based on the position of the mouse
    this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length] = new LineWithMidpoint(this.canvas);
    this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length - 1].createPoint({
      x: -mouseX,
      y: this.canvas.height - mouseY
    });
    this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length - 1].createPoint({
      x: mouseX,
      y: mouseY
    });
    this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length] = new LineWithMidpoint(this.canvas);
    this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length - 1].createPoint({
      x: this.canvas.width - mouseX,
      y: mouseY
    });
    this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length - 1].createPoint({
      x: this.canvas.width + mouseX,
      y: this.canvas.height - mouseY
    });
};

SoundWave.prototype.addCtrlLine = function(mouseX, mouseY) {
  // if control line array is empty create the first and last control lines
  if (this.soundWaveObj.ctrlLines.length == 0) {
    this.addFirstAndLastCtrlLines(mouseX, mouseY);
  // if there are at least two control lines and the second last control line (i.e. the user's last control line)
  // is full at the time of the click then move the ending control line forward and put a new control line in its place
  } else if (this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length - 2].isFull()) {
    var curCtrlLineLength = this.soundWaveObj.ctrlLines.length - 1;
    this.soundWaveObj.ctrlLines[curCtrlLineLength + 1] = this.soundWaveObj.ctrlLines[curCtrlLineLength];
    this.soundWaveObj.ctrlLines[curCtrlLineLength] = new LineWithMidpoint(this.canvas);
    this.soundWaveObj.ctrlLines[curCtrlLineLength].createPoint({
      x: mouseX,
      y: mouseY
    });
  // if the user's last control line is not full then add a point to it
  } else {
    this.soundWaveObj.ctrlLines[this.soundWaveObj.ctrlLines.length - 2].createPoint({
      x: mouseX,
      y: mouseY
    });
  }
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

SoundWave.prototype.returnSoundCtrlLines = function(frequency) {
  var sndCtrlLineArray = [];

  for (i = 0; i < this.soundWaveObj.ctrlLines.length; i++) {
    sndCtrlLineArray[sndCtrlLineArray.length] = this.soundWaveObj.ctrlLines[i].returnSoundLine(frequency);
  }

  return bezierCurvePath(sndCtrlLineArray, frequency, frequency, 0);

};

SoundWave.prototype.reset = function() {
  this.canvas.children = [];
  this.canvas.clear();
  this.soundWaveObj.ctrlPoints = [];
};

SoundWave.prototype.playSoundwave = function(frequency, duration) {
  var wave = this.returnSoundCtrlLines(frequency);
  var channels = 2; // Make it a stereo sound
  var frameCount = this.audioCtx.sampleRate * duration;
  var myArrayBuffer = this.audioCtx.createBuffer(channels, frameCount, this.audioCtx.sampleRate); // Create an empty duration seconds of stereo buffer at the sample rate of the AudioContext

  for (var channel = 0; channel < channels; channel++) { // Fill the buffer with my invented sound
    var nowBuffering = myArrayBuffer.getChannelData(channel); // This gives us the actual array that contains the data
    for (var j = 0; j < Math.floor(frameCount / wave.length); j++) { // loop over the entire frame count
      for (var i = 0; i < wave.length; i++) {
        nowBuffering[(j * wave.length) + i] = wave[i].y;
      }
    }
  }

  var source = this.audioCtx.createBufferSource(); // Get an AudioBufferSourceNode to play the AudioBuffer
  source.buffer = myArrayBuffer; // set the buffer in the AudioBufferSourceNode
  source.connect(this.audioCtx.destination); // connect the AudioBufferSourceNode to the destination so we can hear the sound
  source.start(); // start the source playing
};

SoundWave.prototype.drawSoundwave = function(canvas) {
  var WHITE = "#FFF";
  var BLACK = "#000";
  var NO = 0;
  var YES = 1;
  this.strokeColor = BLACK;
  canvas.strokeStyle = this.strokeColor; // Set the canvas color
  canvas.lineWidth = this.strokeWidth;

  // first two control lines with all points or more control lines so long as the second last one has all points
  if ((this.ctrlLines.length == 2 && this.ctrlLines[this.ctrlLines.length - 1].isFull()) || (this.ctrlLines.length > 2 && this.ctrlLines[this.ctrlLines.length - 2].isFull())) {

    // check if we're dragging p2 of the first control line or p1 of the last
    if (this.ctrlLines[0].line.p2.dragging == true) {
      this.ctrlLines[this.ctrlLines.length-1].line.p1.x =  this.ctrlLines[0].line.p1.x + canvas.canvas.width;
      this.ctrlLines[this.ctrlLines.length-1].line.p1.y =  this.ctrlLines[0].line.p1.y;
      this.ctrlLines[this.ctrlLines.length-1].line.p2.x = this.ctrlLines[0].line.p2.x + canvas.canvas.width;
      this.ctrlLines[this.ctrlLines.length-1].line.p2.y = this.ctrlLines[0].line.p2.y;
    }

    canvas.beginPath();
    c = bezierCurvePath(this.ctrlLines, $("#points").val(), canvas.canvas.width, canvas.canvas.height);
    canvas.strokeStyle = BLACK;
    for (t = 0; t < c.length; t++) {
      canvas.fillRect(c[t].x, c[t].y, 1, 1); // Fill a pixel
    }

    canvas.moveTo(this.ctrlLines[this.ctrlLines.length-1].line.p1.x, this.ctrlLines[this.ctrlLines.length-1].line.p1.y);
    canvas.lineTo(this.ctrlLines[this.ctrlLines.length-1].line.p2.x, this.ctrlLines[this.ctrlLines.length-1].line.p2.y);
    canvas.stroke();
    canvas.closePath();
  }

  SoundWave.prototype.loadSoundwave = function(filename) {
    this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    bufferLoader = new BufferLoader(
      this.audioCtx,
      [
        '../audio/' + filename,
      ],
      this.processLoadedSound
      );

    bufferLoader.load();
  }

  SoundWave.prototype.processLoadedSound = function(bufferList) {
    // Create two sources and play them both together.
    var source1 = context.createBufferSource();
    source1.buffer = bufferList[0];
    source1.connect(context.destination);
    source1.start(0);
  }

};
