"use strict";

gs.sampleDelete = function( sample ) {
	if ( sample ) {
		gs.sampleSelect( sample, false );
		gs.samples.splice( gs.samples.indexOf( sample ), 1 );
		sample.delete();
	}
};
