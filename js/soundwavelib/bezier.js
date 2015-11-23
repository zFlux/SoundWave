function computeBezierPoint(t, p1, p2, p3, p4) {
  var x = Math.pow(1-t, 3)*p1.x + 3*Math.pow(1-t,2)*t*p2.x + 3*(1-t)*Math.pow(t,2)*p3.x + Math.pow(t,3)*p4.x;
  var y = Math.pow(1-t, 3)*p1.y + 3*Math.pow(1-t,2)*t*p2.y + 3*(1-t)*Math.pow(t,2)*p3.y + Math.pow(t,3)*p4.y;
  return {x: x, y: y};
}

function midPoint(p1, p2) {
  var x = (p1.x + p2.x) / 2;
  var y = (p1.y + p2.y) / 2;
  return {x: x, y: y};
}


function evenlySpacedForwardMovingPath(inputArray, numRenderedPoints, pathWidth) {
  // Once I have all the points for the bezier curve I need to loop through all of them looking for evenly spaced forward moving values of x
  
  // I should have the whole canvas for values of x
  var len = pathWidth
  var incr = len / numRenderedPoints;
  var j = 0;
  
  var evenSpacedArray = [];
  var i = 1;
  while ( i < inputArray.length) {
    // if the smaller of the adjacent points x values is equal to j for then store it
    if(j == inputArray[i-1].x) { 
      evenSpacedArray[evenSpacedArray.length] = {x:inputArray[i-1].x, y:inputArray[i-1].y}; 
      j+=incr; 
    }
    // if j is between the two points then find j along the line between the two points and store the y value
    else if(j <= inputArray[i].x  && j > inputArray[i-1] < j) {
      // compute the slope
      var m = (inputArray[i].y - inputArray[i-1].y) / (inputArray[i].x - inputArray[i-1].x)
      // compute the value of y at x = j
      var y = m*(j - inputArray[i-1].x) + inputArray[i-1].y
      // store the point
      evenSpacedArray[evenSpacedArray.length] = {x:j, y:y};
      j+=incr; 
    }
    
    // if j is smaller than the first points x value then increment j
    else if (j < inputArray[i-1].x) { j+=incr; }
    // if j is larger than the last points x value then increment i
    else if (j > inputArray[i].x) { i++; }
    
  }
  
  return evenSpacedArray;
}


// Computes an array of equidistant dots along a bezier curve
//  
// ctrlPointArray: An array of bezier curve control coordinates
// numRenderedPoints: The number of points to render
// pathWidth: The width the curve must cover
// pathHeight: The height the curve must cover - this is only used for the first point
function bezierCurvePath(ctrlPointArray, numRenderedPoints, pathWidth, pathHeight) {
  
  var bezierCoordArray = [];
  
  if (ctrlPointArray.length > 0 && ctrlPointArray.length % 2 == 0) {										// At least four points are necessary for a bezier
    
    ctrlPointArray[0].x = pathWidth - ctrlPointArray[ctrlPointArray.length-1].x
    ctrlPointArray[0].y = pathHeight - ctrlPointArray[ctrlPointArray.length-1].y								// In order to smoothly curve from the end into the beginning and also to always go through the point 0,0
																		// Set the first point's x y value so that it is the compliment of the last point's x y value
    var endPoint = midPoint(ctrlPointArray[0], ctrlPointArray[ctrlPointArray.length-1]);								
    endPoint.x = 0;
    var n = numRenderedPoints / (ctrlPointArray.length / 4);
    
    // curves are drawn using midpoints to ensure a continuous smooth bezier
    for (i = 0; i < ctrlPointArray.length - 1; i+=2)
    {
      startPoint = endPoint;

      if (i == ctrlPointArray.length - 2) {
	endPoint = midPoint(ctrlPointArray[0], ctrlPointArray[ctrlPointArray.length-1]);
	endPoint.x = pathWidth;
      }
      else {
        endPoint = midPoint(ctrlPointArray[i+1], ctrlPointArray[i+2]); // and the last point is the midpoint between point 3 and point 4
      }
      
      for (t = 0; t <= 1; t+=(1/n)) {
	bezierCoordArray[bezierCoordArray.length] = computeBezierPoint(t, startPoint, ctrlPointArray[i], ctrlPointArray[i+1], endPoint);
      }  
      
    }
    
  }
  
  return evenlySpacedForwardMovingPath(bezierCoordArray, numRenderedPoints, pathWidth);
  
}

function hermiteCurvePath(inputCtrlPointArray, numRenderedPoints, pathWidth, pathHeight) {
  
  var hermiteCoordArray = [];
  var ctrlPointArray = inputCtrlPointArray.slice();
  
  ctrlPointArray.unshift({x:0, y: pathHeight / 2});
  ctrlPointArray.push({x:pathWidth, y: pathHeight / 2});
  if (ctrlPointArray.length > 0 && ctrlPointArray.length % 2 == 0) {
    
    var t = 0;
    var n = numRenderedPoints / (ctrlPointArray.length / 2);
    var a = 0.5;
    
    for(j = 0; j < ctrlPointArray.length -1; j+=1) {
      
      var p0 = ctrlPointArray[j];
      var p1 = ctrlPointArray[j+1];
      var m0 = {x:0, y:0};
      var m1 = {x:0, y:0};
      
      if ( j == 0 ) {
	m0 = {x: p1.x * a, y: p1.y * a};
      } else {
	m0 = {x: (p1.x - ctrlPointArray[j-1].x)*a, y: (p1.y - ctrlPointArray[j-1].y)*a};
      }
      
      if (j == ctrlPointArray.length) {
	m1 = {x: -p0.x *a, y: -p0.y*a};
      } else {
	m1 = {x: (ctrlPointArray[j+1].x - p0.x)*a, y: (ctrlPointArray[j+1].y - p0.y)*a};
      }

      for(i = 0; i < n; i++) 
      {
	t = i / n;
	hermiteCoordArray[hermiteCoordArray.length] = computeHermiteCurvePoint(p0, m0, p1, m1, t);
      }
    }
  }
  return evenlySpacedForwardMovingPath(hermiteCoordArray, numRenderedPoints, pathWidth);
}

function computeHermiteCurvePoint(p0, m0, p1, m1, t) {
  var x = h1(t) * p0.x + h2(t) * m0.x + h3(t) * p1.x + h4(t) * m1.x;
  var y = h1(t) * p0.y + h2(t) * m0.y + h3(t) * p1.y + h4(t) * m1.y;
  
  return {x:x, y:y};
}

// hermite functions
function h1(t) {
  return (2.0*t*t*t - 3.0*t*t + 1.0);
}

function h2(t) {
  return (t*t*t - 2.0*t*t + t);
}

function h3(t) {
  return (-2.0*t*t*t + 3.0*t*t);
}

function h4(t) {
  return (t*t*t - t*t);
}


