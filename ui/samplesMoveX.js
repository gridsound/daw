"use strict";

ui.samplesMoveX = function( sample, mxem ) {
	if ( sample.selected ) {
		if ( mxem < 0 ) {
			var xemMin = Infinity;
			ui.selectedSamples.forEach( function( s ) {
				xemMin = Math.min( xemMin, s.xemMouse );
			});
			mxem = -Math.min( xemMin, -mxem );
		}
		ui.selectedSamples.forEach( function( s ) {
			s.moveX( s.xemMouse + mxem );
		});
	} else {
		sample.moveX( Math.max( 0, sample.xemMouse + mxem ) );
	}
};
