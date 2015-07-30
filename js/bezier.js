// Custom bezier drawing function for this specific application.
// Computes an array of equidistant dots along a bezier curve
//  
// ctrlPointArray: An array of bezier curve control coordinates
// numRenderedPoints: The number of points to draw
// pathWidth: The width the curve must cover
// pathHeight: The height the curve must cover - this is only used for the first point
function bezierCurvePath(ctrlPointArray, numRenderedPoints, pathWidth, pathHeight) {
	
	var bezierCoordArray = [];

	if (ctrlPointArray.length > 3) {								// At least four points are necessary for a bezier
		

		ctrlPointArray[0].x = pathWidth - ctrlPointArray[ctrlPointArray.length-1].x;				// In order to smoothly curve from the end into the beginning and also to always go through the point 0,0
		ctrlPointArray[0].y = pathHeight - ctrlPointArray[ctrlPointArray.length-1].y;				// Set the first point's x y value so that it is the compliment of the last point's x y value
		
		// The first curve is a special case where it starts at the midpoint between the last control point and the first control point (0,0)
		var startx = 0;
		var starty = (ctrlPointArray[0].y + ctrlPointArray[ctrlPointArray.length-1].y) / 2;
 		// and the last point is the midpoint between point 3 and point 4
		var midx = (ctrlPointArray[1].x + ctrlPointArray[2].x) / 2;
		var midy = (ctrlPointArray[1].y + ctrlPointArray[2].y) / 2;
		var n = numRenderedPoints / (ctrlPointArray.length / 4);
		for (t = 0; t <= 1; t+=(1/n)) {
			x = Math.pow(1 - t, 3)*startx + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[0].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[1].x + Math.pow(t,3)*midx;
			y = Math.pow(1 - t, 3)*starty + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[0].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[1].y + Math.pow(t,3)*midy;
			bezierCoordArray[bezierCoordArray.length] = {x:x, y:y};
		}  
		
		var lastmidx;
		var lastmidy;
		// the remainder of the curves are drawn from from prior curves midpoint to the next curves midpoint thus only using three points
		for (i = 2; i < ctrlPointArray.length - 3; i+=2)
		{
			lastmidx = midx;
			lastmidy = midy;
			var midx = (ctrlPointArray[i+1].x + ctrlPointArray[i+2].x) / 2;
			var midy = (ctrlPointArray[i+1].y + ctrlPointArray[i+2].y) / 2;
			var n = numRenderedPoints / (ctrlPointArray.length / 4);
			
			for (t = 0; t <= 1; t+=(1/n)) {
				x = Math.pow(1 - t, 3)*lastmidx + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[i].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[i+1].x + Math.pow(t,3)*midx;
				y = Math.pow(1 - t, 3)*lastmidy + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[i].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[i+1].y + Math.pow(t,3)*midy;
				bezierCoordArray[bezierCoordArray.length] = {x:x, y:y};
			}  
		}
		
		// The last curve ends at a midpoint between the last control point and the first control point
		lastmidx = midx;
		lastmidy = midy;
		var endx = pathWidth
		var endy = (ctrlPointArray[ctrlPointArray.length-1].y + ctrlPointArray[0].y) / 2
		var n = numRenderedPoints / (ctrlPointArray.length / 4);
		
		for (t = 0; t <= 1; t+=(1/n)) {
			x = Math.pow(1 - t, 3)*lastmidx + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[ctrlPointArray.length-2].x + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[ctrlPointArray.length-1].x + Math.pow(t,3)*endx;
			y = Math.pow(1 - t, 3)*lastmidy + 3*Math.pow(1 -  t,2)*t*ctrlPointArray[ctrlPointArray.length-2].y + 3*(1 -  t)*Math.pow(t,2)*ctrlPointArray[ctrlPointArray.length-1].y + Math.pow(t,3)*endy;
			bezierCoordArray[bezierCoordArray.length] = {x:x, y:y};
		} 
	}
	
	// Once I have all the points for the bezier curve I need to loop through all of them looking for evenly spaced forward moving values of x
	
	// I should have the whole canvas for values of x
	var len = pathWidth
	var incr = len / numRenderedPoints;
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