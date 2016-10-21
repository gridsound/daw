"use strict";

gs.samplesCut = function( smp, sec ) {
	sec -= smp.when;
	gs.samplesForEach( smp, function( s ) {
		gs.sample.cut( s, sec );
	} );
};
