"use strict";

gs.samplesSlip = function( smp, secRel ) {
	secRel = secRel < 0
		? -Math.min( -secRel, gs.samples.selected.min( smp, function( s ) { return s.bufferDuration - s.offset; } ) )
		:  Math.min(  secRel, gs.samples.selected.min( smp, function( s ) { return s.offset; } ) );

	gs.samples.selected.do( smp, function( s ) {
		gs.sample.slip( s, s.offset - secRel );
	} );
	return secRel;
};
