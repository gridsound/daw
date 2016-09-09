"use strict";

gs.sampleDelete = function( sample ) {
	if ( sample && sample.wsample ) { // check wsample for empty sample
		sample.oldSelected = !!sample.selected; // For the undo
		gs.sampleSelect( sample, false );
		gs.samples.splice( gs.samples.indexOf( sample ), 1 );
		if ( !--sample.gsfile.nbSamples ) {
			ui.CSS_fileUnused( sample.gsfile );
		}
		sample.delete();
	}
};
