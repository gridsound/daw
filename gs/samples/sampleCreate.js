"use strict";

gs.sampleCreate = function( gsfile, trackId, when ) {
	var sample = new gs.Sample( gsfile, trackId, when );
	gs.samples.push( sample );
	ui.CSS_fileUsed( gsfile );
	++gsfile.nbSamples;
	// gs.history.push( {
	// 	action: {
	// 		func: gs.history.insertSample,
	// 		samples: sample
	// 	},
	// 	undo: {
	// 		func: gs.history.undoInsertSample,
	// 		samples: sample
	// 	}
	// } );
	return sample;
};
