"use strict";

gs.samplesCut = function( sample, sec ) {
	if ( sample.wsample ) {
		var newDuration = sec - sample.wsample.when;
		gs.samplesForEach( sample, function( s ) {
			s.cut( newDuration );
		} );
	}
};
