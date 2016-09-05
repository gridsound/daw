"use strict";

gs.samplesSlip = function( sample, secRel ) {
	gs.samplesForEach( sample, function( s ) {
		s.slip( s.wsample.offset - secRel );
	} );
};
