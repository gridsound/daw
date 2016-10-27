"use strict";

gs.sample.create = function( gsfile ) {
	var smp = wa.wctx.createSample();

	if ( gsfile.file ) {
		smp.setBuffer( gsfile.wbuff );
	} else {
		smp.setBufferDuration( gsfile.bufferDuration );
	}
	smp.data = {
		selected: false,
		gsfile: gsfile,
	};
	++gsfile.nbSamples;
	wa.composition.add( smp );
	ui.file.used( gsfile );
	ui.sample.create( smp );
	ui.sample.duration( smp );
	ui.sample.select( smp );
	return smp;
};
