"use strict";

gs.samples.selected.when = function( smp, secRel ) {
	if ( secRel < 0 ) {
		secRel = -Math.min( -secRel,
			gs.samples.selected.min( smp, function( s ) { return s.when; } ) );
	}
	gs.samples.selected.do( smp, function( s ) {
		gs.sample.when( s, Math.max( 0, s.when + secRel ) );
	} );
	return secRel;
};
