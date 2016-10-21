"use strict";

( function() {

gs.samplesCopy = function() {
	var min = Infinity,
		max = -Infinity;

	samplesCopied = gs.selectedSamples.map( function( smp ) {
		min = Math.min( min, smp.when );
		max = Math.max( max, smp.when + smp.duration );
		return smp;
	} );
	if ( ui.isMagnetized ) {
		min = ui.secFloor( min );
		max = ui.secCeil( max );
	}
	allDuration = max - min;
};

gs.samplesPaste = function() {
	gs.samplesUnselect();
	samplesCopied.forEach( function( smp ) {
		var smp2 = gs.sample.create( smp.data.gsfile );

		gs.sample.inTrack( smp2, smp.data.track.id );
		gs.sample.when( smp2, smp.when + allDuration );
		gs.sample.slip( smp2, smp.offset );
		gs.sample.duration( smp2, smp.duration );
		wa.composition.update( smp2, "ad" );
		gs.sampleSelect( smp2, true );
	} );
	gs.samplesCopy();
};

var allDuration,
	samplesCopied = [];

} )();
