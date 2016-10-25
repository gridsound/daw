"use strict";

gs.samples.selected.cut = function( smp, sec ) {
	sec -= smp.when;
	gs.samples.selected.do( smp, function( s ) {
		gs.sample.cut( s, sec );
	} );
};
