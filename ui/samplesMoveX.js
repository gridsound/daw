"use strict";

ui.samplesMoveX = function( sample, mxem ) {
	if ( sample.selected ) {
		if ( mxem < 0 ) {
			var xemMin = Infinity;
			ui.selectedSamples.forEach( function( s ) {
				xemMin = Math.min( xemMin, s.xem );
			});
			mxem = -Math.min( xemMin, -mxem );
		}
		ui.selectedSamples.forEach( function( s ) {
			s.moveX( s.xem + mxem );
		});
	} else {
		sample.moveX( Math.max( 0, sample.xem + mxem ) );
	}
};
