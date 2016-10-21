"use strict";

gs.samplesWhen = function( smp, secRel ) {
	if ( secRel < 0 ) {
		secRel = -Math.min( -secRel, smp.data.selected
			? gs.selectedSamples.reduce( function( min, s ) {
				return Math.min( min, s.when );
			}, Infinity )
			: smp.when );
	}
	gs.samplesForEach( smp, function( s ) {
		gs.sample.when( s, Math.max( 0, s.when + secRel ) );
	} );
	return secRel;
};
