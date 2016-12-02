"use strict";

ui.timestampText = function( t, bpm ) {
	//  0: 0. 000
	var a, b, c;

	if ( !bpm ) {
		a = ~~( t / 60 );
		b = ~~( t % 60 );
	} else {
		t *= bpm / 60;
		a = 1 + ~~t;
		t *= 4;
		b = 1 + ~~t % 4;
	}
	b = b < 10 ? "0" + b : b;
	c = Math.floor( ( t - ~~t ) * 1000 );
	if ( c < 10 ) {
		c = "00" + c;
	} else if ( c < 100 ) {
		c = "0" + c;
	}
	return { a: a, b: b, c: c };
};
