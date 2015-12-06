var MidpointLine = function(canvas) {
  // Set the Drawing context for the object
  this.canvas = canvas;

  // Register the function for drawing a midpoint line with the oCanvas object
  this.canvas.display.register("midpointLine", {
    shapeType: "midpointLine",
    isVisible: 1
  }, this.drawMidpointLine);

  // Create the visual object
  this.midpointObj = this.canvas.display.midpointLine({
    p1: this.canvas.display.ellipse({
      x: 0,
      y: 0,
      radius: 5,
      stroke: "1px #000"
    }),
    p2: this.canvas.display.ellipse({
      x: 0,
      y: 0,
      radius: 5,
      stroke: "1px #000"
    }),
    midpoint: this.canvas.display.ellipse({
      x: 0,
      y: 0,
      radius: 5,
      stroke: "1px #000",
      moving: 0
    }),
    stroke: "1px #000",
    isVisible: 1
  });

  var dragOptions = {
    changeZindex: false
  };
  this.midpointObj.p1.dragAndDrop(dragOptions);
  this.midpointObj.p2.dragAndDrop(dragOptions);
  this.midpointObj.midpoint.dragAndDrop({
    move: function() {
      this.moving = 1;
    },
    end: function() {
      this.moving = 0;
    }
  });

  this.midpointObj.addChild(this.midpointObj.p1);
  this.midpointObj.addChild(this.midpointObj.p2);
  this.midpointObj.addChild(this.midpointObj.midpoint);

  this.canvas.addChild(this.midpointObj);
};

MidpointLine.prototype.drawMidpointLine = function(canvas) {
  var WHITE = "#FFF";
  var BLACK = "#000";
  var NO = 0;
  var YES = 1;

  if (this.isVisible == YES) {
    this.strokeColor = BLACK;
  } else {
    this.strokeColor = WHITE;
  }
  canvas.strokeStyle = this.strokeColor; // Set the canvas color
  canvas.lineWidth = this.strokeWidth;

  canvas.beginPath();

  // if one of the endpoints are being dragged recompute the midpoint
  if (this.isVisible == YES && this.midpoint.moving != YES) {
    canvas.moveTo(this.p1.x, this.p1.y);
    canvas.lineTo(this.p2.x, this.p2.y);
    this.midpoint.x = (this.p1.x + this.p2.x) / 2;
    this.midpoint.y = (this.p1.y + this.p2.y) / 2;
  }

  // If the midpoint is being dragged then recompute the endpoints
  if (this.isVisible == YES && this.midpoint.moving == YES) {
    var tempMidpoint = {x: (this.p1.x + this.p2.x) / 2, y: (this.p1.y + this.p2.y) / 2 }
    var diffx = this.midpoint.x - tempMidpoint.x;
    var diffy = this.midpoint.y - tempMidpoint.y;
    this.p1.x = this.p1.x + diffx;
    this.p1.y = this.p1.y + diffy;
    this.p2.x = this.p2.x + diffx;
    this.p2.y = this.p2.y + diffy;
    canvas.moveTo(this.p1.x, this.p1.y);
    canvas.lineTo(this.p2.x, this.p2.y);
  }


  canvas.stroke();
  canvas.closePath();
};

MidpointLine.prototype.setMidpointLine = function(p1, p2) {
  this.midpointObj.p1.x = p1.x;
  this.midpointObj.p1.y = p1.y;
  this.midpointObj.p2.x = p2.x;
  this.midpointObj.p2.y = p2.y;
  this.midpointObj.midpoint.x = (p1.x + p2.x) / 2;
  this.midpointObj.midpoint.y = (p1.y + p2.y) / 2;
};
