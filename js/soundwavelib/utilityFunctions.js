function isExistingCtrlPoint(mouseX, mouseY, ctrlPointArray) {
  
  var isExistingCtrlPoint = NO;
  if (ctrlPointArray.length > 0) {																	// Detect if button press is within an existing control point
  for (i = 0; i < ctrlPointArray.length; i++) {
    if ( Math.pow( canvas.mouse.x - ctrlPointArray[i].x, 2) + Math.pow( canvas.mouse.y - ctrlPointArray[i].y, 2) < Math.pow(ctrlPointArray[i].radius,2)) {
								isExistingCtrlPoint = YES;
							}
						}
					}
					
					if (isExistingCtrlPoint == NO) {																	// If not in an existing control point then add a new drawn control point and sound control point 
					  var ctrlPoint = canvas.display.ellipse({x: canvas.mouse.x, y: canvas.mouse.y, radius: 5,stroke: "1px #000"}); 
					  ctrlPointArray[ctrlPointArray.length] = ctrlPoint;
					  canvas.addChild(ctrlPoint);
					  var dragOptions = { changeZindex: false };
					  ctrlPoint.dragAndDrop(dragOptions);
						
					}
				}