"use strict";

gs.samples.selected.cut = function( smp, sec ) {
	var arr = smp.data.selected ? gs.selectedSamples.slice() : [ smp ];

	gs.history.pushExec( "cut", {
		duration: sec - smp.when,
		samples: arr,
		newSamples: arr.map( function( smp ) {
			return gs.sample.create( smp.data.gsfile );
		} )
	} );
};
