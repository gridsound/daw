"use strict";

ui.sampleSelect = function( sample, b ) {
	if ( sample && sample.selected !== b ) {
		sample.select( b );
		if ( b ) {
			ui.selectedSamples.push( sample );
		} else {
			ui.selectedSamples.splice( ui.selectedSamples.indexOf( sample ), 1 );
		}
	}
};
