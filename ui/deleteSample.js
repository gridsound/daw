"use strict";

ui.deleteSample = function( sample ) {
	if ( sample ) {
		ui.selectSample( sample, false );
		ui.samples.splice( ui.samples.indexOf( sample ), 1 );
		sample.delete();
	}
};
