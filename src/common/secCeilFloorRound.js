"use strict";

( function() {

var prec = 1 / 4,
	prec2 = prec / 2;

common.secRound = function( sec ) {
	var rest = sec % prec;

	sec -= rest;
	if ( rest > prec2 ) {
		sec += prec;
	}
	return sec;
}

common.secFloor = function( sec ) {
	var xem = sec * ui.BPMem,
		n = common.secRound( xem );

	return ( n < xem || eq( n, xem ) ? n : n - prec ) / ui.BPMem;
};

common.secCeil = function( sec ) {
	var xem = sec * ui.BPMem,
		n = common.secRound( xem );

	return ( n > xem || eq( n, xem ) ? n : n + prec ) / ui.BPMem;
};

function eq( x, y ) {
	return Math.abs( x - y ) < .0001;
}

} )();
