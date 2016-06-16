"use strict";

gs.sampleDelete = function( sample ) {
	if ( sample && sample.wsample ) { // check wsample for empty sample
		gs.sampleSelect( sample, false );
		gs.samples.splice( gs.samples.indexOf( sample ), 1 );
		sample.delete();
	}
};
