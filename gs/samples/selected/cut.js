"use strict";

gs.samples.selected.cut = function( smp, sec ) {
	var arrSmps = smp.data.selected ? gs.selectedSamples.slice() : [ smp ],
		data = {
			duration: sec - smp.when,
			samples: arrSmps,
			newSamples: arrSmps.map( function( smp ) {
				return gs.sample.create( smp.data.gsfile );
			} )
		};

	gs.history.push( "cut", data );
	gs.history.cut( data, 1 ); // TODO: #history
};
