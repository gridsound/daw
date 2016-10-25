"use strict";

( function() {

gs.samples.selected.copy = function() {
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

gs.samples.selected.paste = function() {
	gs.samples.selected.unselect();
	samplesCopied.forEach( function( smp ) {
		var smp2 = gs.sample.create( smp.data.gsfile );

		gs.sample.inTrack( smp2, smp.data.track.id );
		gs.sample.when( smp2, smp.when + allDuration );
		gs.sample.slip( smp2, smp.offset );
		gs.sample.duration( smp2, smp.duration );
		gs.sample.select( smp2, true );
		wa.composition.update( smp2, "ad" );
	} );
	gs.samples.selected.copy();
};

var allDuration,
	samplesCopied = [];

} )();
