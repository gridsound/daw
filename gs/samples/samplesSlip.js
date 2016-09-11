"use strict";

gs.samplesSlip = function( sample, secRel ) {
	if ( !sample.wsample ) {
		return 0;
	}

	secRel = secRel < 0
		? -Math.min( -secRel, sample.selected
			? gs.selectedSamples.reduce( function( min, s ) {
				return Math.min( min, s.wsample.bufferDuration - s.wsample.offset );
			}, Infinity )
			: sample.wsample.bufferDuration - sample.wsample.offset )
		: Math.min( secRel, sample.selected
			? gs.selectedSamples.reduce( function( min, s ) {
				return Math.min( min, s.wsample.offset );
			}, Infinity )
			: sample.wsample.offset );

	gs.samplesForEach( sample, function( s ) {
		s.slip( s.wsample.offset - secRel );
	} );
	return secRel;
};
