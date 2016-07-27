"use strict";

gs.samplesMoveX = function( sample, mxem ) {
	var actions = [];

	if ( sample.selected && sample.wsample && mxem < 0 ) { // check wsample for empty sample
		var xemMin = Infinity;
		gs.selectedSamples.forEach( function( s ) {
			xemMin = Math.min( xemMin, s.xem );
		});
		mxem = -Math.min( xemMin, -mxem );
	}

	gs.samplesForEach( sample, function( s ) {
		s.moveX( Math.max( 0, s.xem + mxem ) );
	});
};
