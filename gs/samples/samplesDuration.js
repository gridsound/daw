"use strict";

gs.samplesDuration = function( smp, secRel ) {
	var durMin = Infinity;

	function calc( s ) {
		durMin = Math.min( durMin, s.duration );
		secRel = Math.min( secRel, s.bufferDuration - s.duration );
	}

	if ( smp.data.selected ) {
		gs.selectedSamples.forEach( calc );
	} else {
		calc( smp );
	}
	if ( secRel < 0 ) {
		secRel = -Math.min( durMin, -secRel );
	}
	gs.samplesForEach( smp, function( s ) {
		gs.sample.duration( s, s.duration + secRel );
	} );
	return secRel;
};
