"use strict";

// FIXME: if the sample is selected, check the minSlip etc. like in samplesWhen/Duration/etc.

gs.samplesSlip = function( sample, secRel ) {
	gs.samplesForEach( sample, function( s ) {
		s.slip( s.wsample.offset - secRel );
	} );
	return secRel;
};
