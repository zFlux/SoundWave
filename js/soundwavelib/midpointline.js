var LineWithMidpoint = function(canvas) {
  // Set the Drawing context for the object
  this.canvas = canvas;

  // Register the function for drawing a midpoint line with the oCanvas object
  this.canvas.display.register("lineWithMidpoint", {
    shapeType: "lineWithMidpoint",
    isVisible: 1
  }, this.drawLineWithMidpoint);

  // Create the visual object
  this.line = this.canvas.display.lineWithMidpoint({
    p1: null,
    p2: null,
    midpoint: null,
    stroke: "1px #000",
    isVisible: 1
  });

  this.canvas.addChild(this.line);
};

LineWithMidpoint.prototype.drawLineWithMidpoint = function(canvas) {
  var WHITE = "#FFF";
  var BLACK = "#000";
  var NO = 0;
  var YES = 1;

  canvas.strokeStyle = BLACK; // Set the canvas color

  // if all the peices exist then do some work
  if (this.p1 && this.p2 && this.midpoint && this.isVisible == YES) {
      canvas.beginPath();

    // if one of the endpoints are being dragged recompute the other endpoint
    if (this.p1.dragging == YES) {
      var diffx = this.p1.x - this.midpoint.x;
      var diffy = this.p1.y - this.midpoint.y;
      this.p2.x = this.midpoint.x - diffx;
      this.p2.y = this.midpoint.y - diffy;
    }

    if (this.p2.dragging == YES) {
      var diffx = this.p2.x - this.midpoint.x;
      var diffy = this.p2.y - this.midpoint.y;
      this.p1.x = this.midpoint.x - diffx;
      this.p1.y = this.midpoint.y - diffy;
    }

    // If the midpoint is being dragged then recompute the endpoints
    if (this.midpoint.dragging == YES) {
      var tempMidpoint = {
        x: (this.p1.x + this.p2.x) / 2,
        y: (this.p1.y + this.p2.y) / 2
      }
      var diffx = this.midpoint.x - tempMidpoint.x;
      var diffy = this.midpoint.y - tempMidpoint.y;
      this.p1.x = this.p1.x + diffx;
      this.p1.y = this.p1.y + diffy;
      this.p2.x = this.p2.x + diffx;
      this.p2.y = this.p2.y + diffy;
    }
    canvas.moveTo(this.p1.x, this.p1.y);
    canvas.lineTo(this.p2.x, this.p2.y);
    canvas.stroke();
    canvas.closePath();
  }


};

LineWithMidpoint.prototype.createPoint = function(p) {

  if (!this.isExistingPoint(p.x, p.y)) {
    if (!this.line.p1) {
      this.line.p1 = this.canvas.display.ellipse({x: p.x,y: p.y,radius: 5,stroke: "1px #000"});
      this.line.p1.dragAndDrop({move: function() {this.dragging = 1;},end: function() {this.dragging = 0;}});
      this.canvas.addChild(this.line.p1);
    } else if (!this.line.p2) {
      this.line.p2 = this.canvas.display.ellipse({x: p.x,y: p.y,radius: 5,stroke: "1px #000"});
      this.line.p2.dragAndDrop({move: function() {this.dragging = 1;},end: function() {this.dragging = 0;}});
      this.canvas.addChild(this.line.p2);
    }
    if (this.line.p1 && this.line.p2) {
      this.line.midpoint = this.canvas.display.ellipse({x: (this.line.p1.x + this.line.p2.x) / 2,y: (this.line.p1.y + this.line.p2.y) / 2,radius: 5,stroke: "1px #000"});
      this.line.midpoint.dragAndDrop({move: function() {this.dragging = 1;},end: function() {this.dragging = 0;}});
      this.canvas.addChild(this.line.midpoint);
    }
  }

};

LineWithMidpoint.prototype.isExistingPoint = function(x, y) {

  if (this.line.p1) {
    if (Math.pow(x - this.line.p1.x, 2) + Math.pow(y - this.line.p1.y, 2) < Math.pow(5, 2)) {
      return 1;
    }
  }

  if (this.line.p2) {
    if (Math.pow(x - this.line.p2.x, 2) + Math.pow(y - this.line.p2.y, 2) < Math.pow(5, 2)) {
      return 1;
    }
  }

  return 0;
};

LineWithMidpoint.prototype.isFull = function() {
  if (this.line.p1 && this.line.p2 && this.line.midpoint) {
    return true;
  }
  return false;
};
