// initialize canvas attributes
var start_x;
var zoom;
var canvas;
var canvas_ht;
var canvas_width;
var ctx;

// global bitrate variable
var bitrate;

// variable for JSON sound data
var sdata;
// variable for audio
var vAudio;

// variables for drawing a wave profile
var wavX;
var wavY;


$(document).ready(
	function(){ 
		// Set canvas attribute initial values
		start_x = 0;
		zoom = 1;
		canvas = document.getElementById('profileCanvas');
		canvas_width = $( "#canvasContainer" ).width();
		canvas_ht = 300;
		
		// set global bitrate
		bitrate = 16;
		
		// Apply canvas attributes
		canvas.width = canvas_width;
		canvas.ht = canvas_ht;
		
		// Canvas Click Event defines points for drawing the sound visual representation
		$("#profileCanvas").click(function(e){ 

			// If our previous wave position is undefined then define it at the zero midpoint
			if (!wavX) { wavX = 0;}
			if (!wavY) { wavY = canvas_ht / 2; }
			ctx = canvas.getContext('2d'); 
			ctx.beginPath();
			ctx.moveTo(wavX , wavY);
			wavX = e.pageX - $(this).position().left;
			wavY = e.pageY -$(this).position().top;
			ctx.lineTo(wavX, wavY);
			ctx.stroke();
			
    		}); 
		
    		$("#load").click(function(e){ 
    			vAudio = new Audio();
			vAudio.setAttribute("src", "/audio/" + $("#wav_file").val());
			ctx = canvas.getContext('2d');
			getJSONSound();
    		}); 
    		
    		$("#play").click(function(e){ 
        		vAudio.play();
    		});
    		
		$("#stop").click(function(e){ 
			vAudio.pause();
		}); 
		
		$("#right").click(function(e){ 
			start_x+= 100;
			drawSound(sdata);
		}); 
		
		$("#left").click(function(e){ 
			start_x-= 100;
			drawSound(sdata);
		}); 
		
		$("#zoomin").click(function(e){ 
			if (zoom <= 1) {
			zoom = 1/zoom;
			zoom++;
			zoom = 1/zoom;
		} else {
				zoom-= 1;
			}
			drawSound(sdata);
		}); 
		
		$("#zoomout").click(function(e){ 
			if (zoom < 1) {
			zoom = 1/zoom;
			zoom--;
			zoom = 1/zoom;
		} else {
				zoom+= 1;
			}
			drawSound(sdata);
		});    		
	});
	
// Retrieves JSON sound data then passes it to drawSound
function getJSONSound(){ 
  	var file_name=$("#wav_file").val();
  	var parsedData; 
  	$.get( "/cgi-bin/WavJSON.php", { file: file_name })
  		.done(function(data) {
  			sdata = JSON.parse(data);
  			drawSound(sdata);
  		});
  		
  }
  		
// Draws a visual representation of a sound wave using an array of wav data
// Input: array of wav data integers
// Output: draws data on ctx canvas
function drawSound(snd){
	var snd_ht = canvas_ht - 100;
	ctx.clearRect(0 , 0 ,  canvas_width , canvas_ht);
	ctx.beginPath();
	var x = start_x;
	var y = (snd[i] / (Math.pow(2,bitrate))) * snd_ht + snd_ht/2;
	ctx.moveTo(x , y);
	for (var i = 0  ; i < (canvas_width + Math.abs(start_x)) * zoom; i++) {
		x = (i + start_x) / zoom;
		y = (snd[i] / (Math.pow(2,bitrate))) * snd_ht + snd_ht/2;
		ctx.lineTo(x ,y);
	}
	ctx.stroke();	
	drawTimeMeasure();
}


function drawTimeMeasure() {
	ctx.beginPath();
	// Draw a tick every 1 millisecond
	var mil = 0;
	for (var j = 0; j <  canvas_width * zoom  + (start_x / zoom); j+=44.1/zoom) {
		
		ctx.moveTo(j + (start_x / zoom) , canvas_ht - 40);
		
		if ( zoom < 15) {
			ctx.lineTo(j + (start_x / zoom), canvas_ht - 50);
		}
		
		if ( mil % 100 == 0) {
			ctx.lineTo(j + (start_x / zoom), canvas_ht - 60);
		}
		
		if ( mil % 1000 == 0) {
			ctx.stroke();
			ctx.lineWidth=2;
			ctx.beginPath();
			ctx.moveTo(j + (start_x / zoom) , canvas_ht - 40);
			ctx.lineTo(j + (start_x / zoom), canvas_ht - 70);
			ctx.stroke();
			ctx.lineWidth=1;
			ctx.font = "12px Arial";
			ctx.fillText(mil / 1000, j + (start_x / zoom) -3, canvas_ht - 10);
			ctx.beginPath(); 
		} 
		mil++;
		
	}
	
	ctx.stroke();
}