"use strict";

gs.samplesDuration = function( sample, mxem ) {
	mxem /= ui.BPMem;

	if ( sample.selected ) {
		var durMin = Infinity;
		gs.selectedSamples.forEach( function( s ) {
			durMin = Math.min( durMin, s.wsample.duration );
			mxem = Math.min( mxem, s.wsample.bufferDuration - s.wsample.duration );
		});
		if ( mxem < 0 ) {
			mxem = -Math.min( durMin, -mxem );
		}
	}

	gs.samplesForEach( sample, function( s ) {
		s.duration( s.wsample.duration + mxem );
	});
};
