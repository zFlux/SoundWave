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

			
			// New bezier drawing function
			function bezierCurve2(ctrlPoints, numPoints) {
				
				var rtnPoints = [];
			
				
				// At least four points are neccesary for a bezier
				if (ctrlPoints.length > 3) {
					
					// First curve is a special case where the last point is the midpoint between point 3 and point 4
					var midx = (ctrlPoints[2].x + ctrlPoints[3].x) / 2
					var midy = (ctrlPoints[2].y + ctrlPoints[3].y) / 2
					var n = numPoints / (ctrlPoints.length / 4);
					for (t = 0; t <= 1; t+=(1/n)) {
					  	x = Math.pow(1 - t, 3)*ctrlPoints[0].x + 3*Math.pow(1 -  t,2)*t*ctrlPoints[1].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPoints[2].x + Math.pow(t,3)*midx;
					  	y = Math.pow(1 - t, 3)*ctrlPoints[0].y + 3*Math.pow(1 -  t,2)*t*ctrlPoints[1].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPoints[2].y + Math.pow(t,3)*midy;
					  	rtnPoints[rtnPoints.length] = {x:x, y:y};
					}  
					
					var lastmidx;
					var lastmidy;
					// the remainder of the curves are drawn from from prior curves midpoint to the next curves midpoint thus only using three points
					for (i = 3; i < ctrlPoints.length - 2; i+=2)
					{
						lastmidx = midx;
						lastmidy = midy;
					      	var midx = (ctrlPoints[i+1].x + ctrlPoints[i+2].x) / 2
					      	var midy = (ctrlPoints[i+1].y + ctrlPoints[i+2].y) / 2
					      	var n = numPoints / (ctrlPoints.length / 4);
					      	
					      	for (t = 0; t <= 1; t+=(1/n)) {
						  	x = Math.pow(1 - t, 3)*lastmidx + 3*Math.pow(1 -  t,2)*t*ctrlPoints[i].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPoints[i+1].x + Math.pow(t,3)*midx;
						  	y = Math.pow(1 - t, 3)*lastmidy + 3*Math.pow(1 -  t,2)*t*ctrlPoints[i].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPoints[i+1].y + Math.pow(t,3)*midy;
						  	rtnPoints[rtnPoints.length] = {x:x, y:y};
						}  
					}
		 				
					
				}
				
				// Once I have all the points for the bezier curve I need to loop through all of them looking for evenly spaced forward moving values of x
				
				// Im assuming that the first x minus the last x constitute the values of x I have to play with (this can be not true but is a necessary assumption)
				var len = Math.abs(ctrlPoints[ctrlPoints.length - 1].x - ctrlPoints[0].x)
				var incr = len / numPoints;
				var j = 0;
				
				
				var rtnDiscretePoints = [];
				var i = 1;
				while ( i < rtnPoints.length) {
					// if the smaller of the adjacent points x values is equal to j for then store it
					if(j == rtnPoints[i-1].x) { 
						rtnDiscretePoints[rtnDiscretePoints.length] = {x:rtnPoints[i-1].x, y:rtnPoints[i-1].y}; 
						j+=incr; 
					}
					// if j is between the two points then find j along the line between the two points and store the y value
					else if(j <= rtnPoints[i].x  && j > rtnPoints[i-1] < j) {
						// compute the slope
						var m = (rtnPoints[i].y - rtnPoints[i-1].y) / (rtnPoints[i].x - rtnPoints[i-1].x)
						// compute the value of y at x = j
						var y = m*(j - rtnPoints[i-1].x) + rtnPoints[i-1].y
						// store the point
						rtnDiscretePoints[rtnDiscretePoints.length] = {x:j, y:y};
						j+=incr; 
					}
					
					// if j is smaller than the first points x value then increment j
					else if (j < rtnPoints[i-1].x) { j+=incr; }
					// if j is larger than the last points x value then increment i
					else if(j > rtnPoints[i].x) { i++; }
						
				}
				  
				return rtnDiscretePoints;
	
				  

				  
			}
			
			
			// Register a new object for a curve
			canvas.display.register("bezierCurve", {shapeType: "bezierCurve", control: 1}, function (canvas) {
	   								
				if (this.strokeWidth > 0) {
					canvas.strokeStyle = this.strokeColor;
					canvas.lineWidth = this.strokeWidth;
				}
				
				// Draw lines for every other two control points if theres no lock
				canvas.beginPath();
		 		if (this.control == 1) {canvas.strokeStyle = "#FF0000";} else {canvas.strokeStyle = "#fff";}
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
	 			
				c = bezierCurve2(this.points, $("#points").val() );
				
				
				canvas.beginPath();
				canvas.strokeStyle = "#FF0000";
				for (t = 0; t < c.length ; t++) {
					canvas.fillRect(c[t].x,c[t].y,1,1);
				}  
				canvas.stroke();
		 		canvas.closePath();
	 			     

			});

			
			
			
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
							bezier = canvas.display.bezierCurve({points: pointArray, stroke: "1px #000", control: 1});
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
	