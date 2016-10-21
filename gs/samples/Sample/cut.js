"use strict";

gs.sample.cut = function( smp, newDuration ) {
	var ns, ws = smp.wsample;

	if ( ws && newDuration < ws.duration ) { // TODO: #emptySample
		ns = gs.sampleCreate( smp.gsfile, smp.track.id, ws.when + newDuration );
		gs.sample.slip( ns, ws.offset + newDuration );
		gs.sample.duration( ns, ws.duration - newDuration );
		gs.sample.duration( smp, newDuration );
		wa.composition.update( ns.wsample, "mv" );
		wa.composition.update( smp.wsample, "mv" );
	}
};
