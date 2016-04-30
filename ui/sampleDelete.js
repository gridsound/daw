"use strict";

ui.sampleDelete = function( sample ) {
	if ( sample ) {
		ui.sampleSelect( sample, false );
		ui.samples.splice( ui.samples.indexOf( sample ), 1 );
		sample.delete();
	}
};
