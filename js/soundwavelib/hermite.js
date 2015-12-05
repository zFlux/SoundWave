//Legacy Code No longer needed
function hermiteCurvePath(inputCtrlPointArray, numRenderedPoints, pathWidth, pathHeight) {

  var hermiteCoordArray = [];
  var ctrlPointArray = inputCtrlPointArray.slice();

  ctrlPointArray.unshift({
    x: 0,
    y: pathHeight / 2
  });
  ctrlPointArray.push({
    x: pathWidth,
    y: pathHeight / 2
  });
  if (ctrlPointArray.length > 0 && ctrlPointArray.length % 2 == 0) {

    var t = 0;
    var n = numRenderedPoints / (ctrlPointArray.length / 2);
    var a = 1;

    for (j = 0; j < Math.round(ctrlPointArray.length / 4); j += 1) {

      var p0 = ctrlPointArray[j];
      var m0 = ctrlPointArray[j + 1];
      var p1 = ctrlPointArray[j + 2];
      var m1 = ctrlPointArray[j + 3];

      for (i = 0; i < n; i++) {
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

  return {
    x: x,
    y: y
  };
}

// hermite functions
function h1(t) {
  return (2.0 * t * t * t - 3.0 * t * t + 1.0);
}

function h2(t) {
  return (t * t * t - 2.0 * t * t + t);
}

function h3(t) {
  return (-2.0 * t * t * t + 3.0 * t * t);
}

function h4(t) {
  return (t * t * t - t * t);
}
