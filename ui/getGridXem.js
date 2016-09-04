"use strict";

( function() {

ui.xemFloor = function( xem ) {
	var n = round( xem );
	return n < xem || eq( n, xem ) ? n : n - prec;
};

ui.xemCeil = function( xem ) {
	var n = round( xem );
	return n > xem || eq( n, xem ) ? n : n + prec;
};

ui.getGridXem = function( pageX ) {
	var xem = ( pageX - ui.filesWidth - ui.trackNamesWidth - ui.trackLinesLeft ) / ui.gridEm;
	return ui.isMagnetized ? round( xem ) : xem;
};

ui.getGridSec = function( pageX ) {
	return ui.getGridXem( pageX ) / ui.BPMem;
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
