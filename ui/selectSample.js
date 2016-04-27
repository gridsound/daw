"use strict";

ui.selectSample = function( sample, b ) {
	if ( sample && sample.selected !== b ) {
		sample.select( b );
		if ( b ) {
			ui.selectedSamples.push( sample );
		} else {
			ui.selectedSamples.splice( ui.selectedSamples.indexOf( sample ), 1 );
		}
	}
};

ui.unselectSamples = function() {
	ui.selectedSamples.forEach( function( sample ) {
		sample.select( false );
	});
	ui.selectedSamples = [];
};
