"use strict";

gs.samples.selected.max = function( smp, fn ) {
	if ( smp.data.selected ) {
		return gs.selectedSamples.reduce( function( max, smp ) {
			return Math.max( max, fn( smp ) );
		}, -Infinity );
	}
	return fn( smp );
};
