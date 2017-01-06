"use strict";

gs.sample.create = function( gsfile ) {
	var smp = gs.wctx.createSample( gsfile.wbuff );

	if ( !gsfile.wbuff.buffer ) {
		gsfile.wbuff._setDuration( gsfile.bufferDuration );
	}
	smp.data = {
		selected: false,
		gsfile: gsfile,
	};
	++gsfile.nbSamples;
	ui.file.used( gsfile );
	ui.sample.create( smp );
	ui.sample.duration( smp );
	return smp;
};
