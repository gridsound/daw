"use strict";

( function() {

gs.samplesCopy = function() {
	var min = Infinity,
		max = -Infinity;

	samplesCopied = gs.selectedSamples.map( function( s ) {
		min = Math.min( min, s.wsample.when );
		max = Math.max( max, s.wsample.when + s.wsample.duration );
		return s;
	} );
	if ( ui.isMagnetized ) {
		min = ui.xemFloor( min * ui.BPMem );
		max = ui.xemCeil( max * ui.BPMem );
	}
	allDuration = ( max - min ) / ui.BPMem; // <--- pb
};

gs.samplesPaste = function() {
	gs.samplesUnselect();
	samplesCopied.forEach( function( s ) {
		var ns = gs.sampleCreate( s.gsfile, s.track.id, s.wsample.when + allDuration );
		ns.slip( s.wsample.offset );
		ns.duration( s.wsample.duration );
		gs.sampleSelect( ns, true );
	} );
	gs.samplesCopy();
};

var allDuration,
	samplesCopied = [];

} )();
