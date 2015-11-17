$(document).ready(
  
  function(){ 
    
    var RIGHT_MOUSE = 1;											// Useful global constants
    var SPACEBAR = 32;
    var BACKSPACE = 8;
    var LETTER_C = 67;
    var NO = 0;
    var YES = 1;
    
    var canvas = oCanvas.create({canvas: "#profileCanvas"}); 							// Global oCanvas object
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 					// Global audio context 
    var soundWave = new SoundWave(canvas, audioCtx);
    
    canvas.bind("dblclick", function (click) {
      if (click.which == RIGHT_MOUSE) {
	if (!soundWave.isExistingCtrlPoint(canvas.mouse.x, canvas.mouse.y)) {
	  soundWave.createCtrlPoint(canvas.mouse.x, canvas.mouse.y);
	}
      }
    });
    
    canvas.bind("keydown", function (key) {
      if (key.which == SPACEBAR) {
	soundWave.toggleVisibleCtrlPoints();
      }
      
      else if (key.which == BACKSPACE) {
	soundWave.reset();
      }
      
      else {
	
	var noteValue = Math.pow(2, keyToNote(key.which)  / 12);
	var frequency = $("#points").val();
	var soundPoints = soundWave.soundPoints(noteValue * frequency);
	playSoundWave(soundPoints, audioCtx);
      }
    });
    
    $( '#play' ).click ( function () { 
	var frequency = $("#points").val();
	var soundPoints = soundWave.soundPoints(frequency);
	playSoundWave(soundPoints, audioCtx);
    });
    
  });
