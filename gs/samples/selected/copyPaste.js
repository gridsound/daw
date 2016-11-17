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
	if ( samplesCopied.length ) {
		var data = {
				selected: gs.selectedSamples.slice(),
				allDuration: allDuration,
				copied: samplesCopied,
				pasted: samplesCopied.map( function( smp ) {
					return gs.sample.create( smp.data.gsfile );
				} )
			};

		gs.history.push( "paste", data );
		gs.history.paste( data, 1 ); // TODO: #history
		gs.samples.selected.copy();
	}
};

var allDuration,
	samplesCopied = [];

} )();
