"use strict";

( function() {

var samplesCopied = [],
	dist;

gs.samplesCopy = function() {
	var min = Infinity,
		max = -Infinity;
	samplesCopied = gs.selectedSamples.map( function( s ) {
		min = Math.min( min, s.xem );
		max = Math.max( max, s.xem + s.wsample.duration * ui.BPMem );
		return s;
	} );
	if ( ui.isMagnetized ) {
		min = ui.xemFloor( min );
		max = ui.xemCeil( max );
	}
	dist = max - min;
};

gs.samplesPaste = function() {
	samplesCopied.forEach( function( s ) {
		var ns = gs.sampleCreate( s.uifile, s.track.id, s.xem + dist );
		ns.slip( s.wsample.offset );
		ns.duration( s.wsample.duration );
	} );
};

} )();
