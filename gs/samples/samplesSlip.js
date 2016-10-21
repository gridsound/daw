"use strict";

gs.samplesSlip = function( smp, secRel ) {
	secRel = secRel < 0
		? -Math.min( -secRel, smp.data.selected
			? gs.selectedSamples.reduce( function( min, s ) {
				return Math.min( min, s.bufferDuration - s.offset );
			}, Infinity )
			: smp.bufferDuration - smp.offset )
		: Math.min( secRel, smp.data.selected
			? gs.selectedSamples.reduce( function( min, s ) {
				return Math.min( min, s.offset );
			}, Infinity )
			: smp.offset );

	gs.samplesForEach( smp, function( s ) {
		gs.sample.slip( s, s.offset - secRel );
	} );
	return secRel;
};
