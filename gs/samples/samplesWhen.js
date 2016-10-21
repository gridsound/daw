"use strict";

gs.samplesWhen = function( sample, secRel ) {
	if ( !sample.wsample ) {
		return 0;
	}

	if ( secRel < 0 ) {
		secRel = -Math.min( -secRel, sample.selected
			? gs.selectedSamples.reduce( function( min, s ) {
				return Math.min( min, s.wsample.when );
			}, Infinity )
			: sample.wsample.when );
	}
	gs.samplesForEach( sample, function( s ) {
		if ( s.wsample ) {
			gs.sample.when( s, Math.max( 0, s.wsample.when + secRel ) );
		}
	} );
	return secRel;
};
