"use strict";

gs.samplesWhen = function( sample, secRel ) {
	if ( sample.selected && sample.wsample && secRel < 0 ) {
		secRel = -Math.min(
			-secRel,

			// The minimum wsample.when of the selected samples :
			gs.selectedSamples.reduce( function( min, s ) {
				return Math.min( min, s.wsample.when );
			}, Infinity )
		);
	}

	gs.samplesForEach( sample, function( s ) {
		if ( s.wsample ) {
			s.when( Math.max( 0, s.wsample.when + secRel ) );
		}
	} );
};
