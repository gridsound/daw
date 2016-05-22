"use strict";

gs.samplesDuration = function( sample, mxem ) {
	mxem /= ui.BPMem;

	if ( sample.selected && mxem < 0 ) {
		var durMin = Infinity;
		gs.selectedSamples.forEach( function( s ) {
			durMin = Math.min( durMin, s.wsample.duration );
		});
		mxem = -Math.min( durMin, -mxem );
	}

	gs.samplesForEach( sample, function( s ) {
		s.duration( s.wsample.duration + mxem );
	});
};
