"use strict";

ui.slipSamples = function( mx ) {
	ui.selectedSamples.forEach( function( sample ) {
		sample.slip( mx );
	});
};
