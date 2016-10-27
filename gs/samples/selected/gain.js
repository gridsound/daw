"use strict";

gs.samples.selected.gain = function( smp, secRel ) {

	gs.samples.selected.do( smp, function( s ) {
		gs.sample.gain( s, secRel);
	} );

	return secRel;
};
