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
		min = common.secFloor( min );
		max = common.secCeil( max );
	}
	allDuration = max - min;
};

gs.samples.selected.paste = function() {
	if ( samplesCopied.length ) {
		gs.history.pushExec( "paste", {
			selected: gs.selectedSamples.slice(),
			allDuration: allDuration,
			copied: samplesCopied,
			pasted: samplesCopied.map( function( smp ) {
				return gs.sample.create( smp.data.gsfile );
			} )
		} );
		gs.samples.selected.copy();
	}
};

var allDuration,
	samplesCopied = [];

} )();
