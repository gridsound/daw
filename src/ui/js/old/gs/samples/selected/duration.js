"use strict";

gs.samples.selected.duration = function( smp, secRel ) {
	secRel = secRel < 0
		? -Math.min( -secRel, gs.samples.selected.min( smp, function( s ) { return s.duration; } ) )
		:  Math.min(  secRel, gs.samples.selected.min( smp, function( s ) { return s.bufferDuration - s.duration; } ) );

	gs.samples.selected.do( smp, function( s ) {
		gs.sample.duration( s, s.duration + secRel );
	} );
	return secRel;
};
