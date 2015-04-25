function init(evt) 
{
	
	if (window.svgDocument == null) 
	{
		svgDocument = evt.target.ownerDocument;
	}
	
	setTimeout("timeIsNow()", 1000);
}

function timeIsNow() {
	
	var secondHand = svgDocument.getElementById('second');
	var minuteHand = svgDocument.getElementById('minute');
	var hourHand = svgDocument.getElementById('hour');
	
	var clock_time = new Date();
	var clock_seconds = clock_time.getSeconds();
	var clock_minutes = clock_time.getMinutes();
	var clock_hours = clock_time.getHours();

	if (clock_hours > 12) { clock_hours-=12; }
	
	var ClockCentreX = 240;
	var ClockCentreY = 110;
	 
	makeClock(ClockCentreX, ClockCentreY, 85);
	var secondX = ClockCentreX + 80 * Math.cos( (clock_seconds * 2 * Math.PI/60)- Math.PI/2);
	var secondY = ClockCentreY + 80 * Math.sin( (clock_seconds * 2 * Math.PI/60)- Math.PI/2);
	
	var minuteX = ClockCentreX + 75 * Math.cos( (clock_minutes * 2 * Math.PI/60)- Math.PI/2 );
	var minuteY = ClockCentreY + 75 * Math.sin( (clock_minutes * 2 * Math.PI/60)- Math.PI/2 );
	
	var hourX = ClockCentreX + 70 * Math.cos( (clock_hours * 2 * Math.PI/12)- Math.PI/2 );
	var hourY = ClockCentreY + 70 * Math.sin( (clock_hours * 2 * Math.PI/12)- Math.PI/2 );
	
	secondHand.setAttribute('d',"M" + ClockCentreX + "," + ClockCentreY + " L" + secondX + "," + secondY);
	minuteHand.setAttribute('d',"M" + ClockCentreX + "," + ClockCentreY + " L" + minuteX + "," + minuteY);
	hourHand.setAttribute('d',"M" + ClockCentreX + "," + ClockCentreY + " L" + hourX + "," + hourY);
	
	setTimeout("timeIsNow()", 1000);
}

function makeClock(cx, cy, r) {

	
	var clkCircle = svgDocument.getElementById('clkCircle');
	clkCircle.setAttribute('d', "M" + (cx - r) + "," + cy +
				    " C" + (cx - r) + "," + (cy - r*1.33) +
				    " " + (cx + r) + "," + (cy - r*1.33) +
				    " " + (cx + r) + "," + cy +
				    " C" + (cx + r) + "," + (cy + r*1.33) +
				    " " + (cx - r) + "," + (cy + r*1.33) +
				    " " + (cx - r) + "," + cy);
}


