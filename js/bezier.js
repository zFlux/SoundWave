function drawSoundwave(canvas) {
	   								
				if (this.strokeWidth > 0) {
					canvas.strokeStyle = this.strokeColor;
					canvas.lineWidth = this.strokeWidth;
				}
				
				// Draw red control lines for every other two control points if there's no lock
				canvas.beginPath();
		 		if (this.control == 1) {canvas.strokeStyle = "#FF0000";} else {canvas.strokeStyle = "#FFF";}
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
	 			
				c = bezierCurve(this.points, $("#points").val(), canvas.length );
				
				
				canvas.beginPath();
				canvas.strokeStyle = "#FF0000";
				for (t = 0; t < c.length ; t++) {
					canvas.fillRect(c[t].x,c[t].y,1,1);
				}  
				canvas.stroke();
		 		canvas.closePath();
}



// Custom bezier drawing function for this specific application.
// Computes an array of set number of coordinates (numDots) along a bezier curve having the control points
//  
// ctrlPointArray: An array of bezier curve control coordinates
// numDots: This 
function bezierCurve(ctrlPointArray, numDots, canvasLength) {
	
	var bezierCoordArray = [];

	// At least four points are necessary for a bezier
	if (ctrlPointArray.length > 3) {
		
		// In order to smoothly curve from the end into the beginning
		// Set the last point's x value to be the same distance from the end as the first point is from the beginning
		ctrlPointArray[ctrlPointArray.length-1].x = canvasLength - ctrlPointArray[1].x
		
		// The first curve is a special case where it starts at the midpoint between the last control point and the first control point
		var startx = 0;
		var starty = (ctrlPointArray[0].y + ctrlPointArray[ctrlPointArray.length-1].y) / 2
 		// and the last point is the midpoint between point 3 and point 4
		var midx = (ctrlPointArray[2].x + ctrlPointArray[3].x) / 2
		var midy = (ctrlPointArray[2].y + ctrlPointArray[3].y) / 2
		var n = numDots / (ctrlPointArray.length / 4);
		for (t = 0; t <= 1; t+=(1/n)) {
			x = Math.pow(1 - t, 3)*startx + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[1].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[2].x + Math.pow(t,3)*midx;
			y = Math.pow(1 - t, 3)*starty + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[1].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[2].y + Math.pow(t,3)*midy;
			bezierCoordArray[bezierCoordArray.length] = {x:x, y:y};
		}  
		
		var lastmidx;
		var lastmidy;
		// the remainder of the curves are drawn from from prior curves midpoint to the next curves midpoint thus only using three points
		for (i = 3; i < ctrlPointArray.length - 3; i+=2)
		{
			lastmidx = midx;
			lastmidy = midy;
			var midx = (ctrlPointArray[i+1].x + ctrlPointArray[i+2].x) / 2
			var midy = (ctrlPointArray[i+1].y + ctrlPointArray[i+2].y) / 2
			var n = numDots / (ctrlPointArray.length / 4);
			
			for (t = 0; t <= 1; t+=(1/n)) {
				x = Math.pow(1 - t, 3)*lastmidx + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[i].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[i+1].x + Math.pow(t,3)*midx;
				y = Math.pow(1 - t, 3)*lastmidy + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[i].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[i+1].y + Math.pow(t,3)*midy;
				bezierCoordArray[bezierCoordArray.length] = {x:x, y:y};
			}  
		}
		
		// The last curve ends at a midpoint between the last control point and the first control point
		lastmidx = midx;
		lastmidy = midy;
		var endx = canvasLength
		var endy = (ctrlPointArray[ctrlPointArray.length-1].y + ctrlPointArray[0].y) / 2
		var n = numDots / (ctrlPointArray.length / 4);
		
		for (t = 0; t <= 1; t+=(1/n)) {
			x = Math.pow(1 - t, 3)*lastmidx + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[ctrlPointArray.length-2].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[ctrlPointArray.length-1].x + Math.pow(t,3)*endx;
			y = Math.pow(1 - t, 3)*lastmidy + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[ctrlPointArray.length-2].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[ctrlPointArray.length-1].y + Math.pow(t,3)*endy;
			bezierCoordArray[bezierCoordArray.length] = {x:x, y:y};
		} 
	}
	
	// Once I have all the points for the bezier curve I need to loop through all of them looking for evenly spaced forward moving values of x
	
	// Im assuming that the first x minus the last x constitute the values of x I have to play with (this can be not true but is a necessary assumption)
	var len = Math.abs(ctrlPointArray[ctrlPointArray.length - 1].x - ctrlPointArray[0].x)
	var incr = len / numDots;
	var j = 0;
	
	var evenSpacedArray = [];
	var i = 1;
	while ( i < bezierCoordArray.length) {
		// if the smaller of the adjacent points x values is equal to j for then store it
		if(j == bezierCoordArray[i-1].x) { 
			evenSpacedArray[evenSpacedArray.length] = {x:bezierCoordArray[i-1].x, y:bezierCoordArray[i-1].y}; 
			j+=incr; 
		}
		// if j is between the two points then find j along the line between the two points and store the y value
		else if(j <= bezierCoordArray[i].x  && j > bezierCoordArray[i-1] < j) {
			// compute the slope
			var m = (bezierCoordArray[i].y - bezierCoordArray[i-1].y) / (bezierCoordArray[i].x - bezierCoordArray[i-1].x)
			// compute the value of y at x = j
			var y = m*(j - bezierCoordArray[i-1].x) + bezierCoordArray[i-1].y
			// store the point
			evenSpacedArray[evenSpacedArray.length] = {x:j, y:y};
			j+=incr; 
		}
		
		// if j is smaller than the first points x value then increment j
		else if (j < bezierCoordArray[i-1].x) { j+=incr; }
		// if j is larger than the last points x value then increment i
		else if (j > bezierCoordArray[i].x) { i++; }
			
	}
	  
	return evenSpacedArray;

}