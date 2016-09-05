"use strict";

( function() {

ui.getGridSec = function( pageX ) {
	var xem = ( pageX - ui.filesWidth - ui.trackNamesWidth - ui.trackLinesLeft ) / ui.gridEm;
	return ( ui.isMagnetized ? round( xem ) : xem ) / ui.BPMem;
};

ui.secFloor = function( sec ) {
	var xem = sec * ui.BPMem,
		n = round( xem );
	return ( n < xem || eq( n, xem ) ? n : n - prec ) / ui.BPMem;
};

ui.secCeil = function( sec ) {
	var xem = sec * ui.BPMem,
		n = round( xem );
	return ( n > xem || eq( n, xem ) ? n : n + prec ) / ui.BPMem;
};

var prec = 1 / 4,
	prec2 = prec / 2;

function eq( x, y ) {
	return Math.abs( x - y ) < .0001;
}

function round( x ) {
	var rest = x % prec;
	x -= rest;
	if ( rest > prec2 ) {
		x += prec;
	}
	return x;
}

} )();
