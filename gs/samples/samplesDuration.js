"use strict";

gs.samplesDuration = function( sample, secRel ) {
	var durMin = Infinity;
	function calc( s ) {
		durMin = Math.min( durMin, s.wsample.duration );
		secRel = Math.min( secRel, s.wsample.bufferDuration - s.wsample.duration );
	}

	if ( sample.wsample ) { // check wsample for empty sample
		if ( sample.selected ) {
			gs.selectedSamples.forEach( calc );
		} else {
			calc( sample );
		}
		if ( secRel < 0 ) {
			secRel = -Math.min( durMin, -secRel );
		}
		gs.samplesForEach( sample, function( s ) {
			s.duration( s.wsample.duration + secRel );
		} );
	}
	return secRel;
};
