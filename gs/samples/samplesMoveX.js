"use strict";

gs.samplesMoveX = function( sample, mxem ) {
	if ( sample.selected && mxem < 0 ) {
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
