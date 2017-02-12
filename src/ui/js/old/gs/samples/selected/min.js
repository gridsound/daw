"use strict";

gs.samples.selected.min = function( smp, fn ) {
	if ( smp.data.selected ) {
		return gs.selectedSamples.reduce( function( min, smp ) {
			return Math.min( min, fn( smp ) );
		}, Infinity );
	}
	return fn( smp );
};
