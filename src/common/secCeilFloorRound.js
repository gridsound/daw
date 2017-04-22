"use strict";

( function() {

var prec = 1 / 4,
	prec2 = prec / 2;

common.beatRound = function( beat ) {
	var rest = beat % prec;

	beat -= rest;
	if ( rest > prec2 ) {
		beat += prec;
	}
	return beat;
};

common.secFloor = function( sec ) {
	var beat = sec * ui.BPMem,
		n = common.beatRound( beat );

	return ( n < beat || eq( n, beat ) ? n : n - prec ) / ui.BPMem;
};

common.secCeil = function( sec ) {
	var beat = sec * ui.BPMem,
		n = common.beatRound( beat );

	return ( n > beat || eq( n, beat ) ? n : n + prec ) / ui.BPMem;
};

function eq( x, y ) {
	return Math.abs( x - y ) < .0001;
}

} )();
