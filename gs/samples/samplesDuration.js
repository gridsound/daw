"use strict";

gs.samplesDuration = function( sample, mxem ) {
	var durMin = Infinity;
	function calc( s ) {
		durMin = Math.min( durMin, s.wsample.duration );
		mxem = Math.min( mxem, s.wsample.bufferDuration - s.wsample.duration );
	}

	mxem /= ui.BPMem;
	if ( sample.selected ) {
		gs.selectedSamples.forEach( calc );
	} else {
		calc( sample );
	}
	if ( mxem < 0 ) {
		mxem = -Math.min( durMin, -mxem );
	}
	gs.samplesForEach( sample, function( s ) {
		s.duration( s.wsample.duration + mxem );
	} );
	return mxem * ui.BPMem;
};
