"use strict";

gs.samplesForEach = function( sample, fn ) {
	if ( sample && sample.wsample ) { // check wsample for empty sample
		if ( sample.selected ) {
			gs.selectedSamples.forEach( function( s ) { // check wsample for empty sample
				if ( s.wsample ) {
					fn( s );
				}
			});
		} else {
			fn( sample );
		}
	}
};
