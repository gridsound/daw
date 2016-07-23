"use strict";

gs.Sample.prototype.cut = function( newDuration ) {
	var ns, ws = this.wsample;

	if ( ws && newDuration < ws.duration ) {
		ns = gs.sampleCreate( this.gsfile, this.track.id,
			( ws.when + newDuration ) * ui.BPMem );
		ns.slip( ws.offset + newDuration );
		ns.duration( ws.duration - newDuration );
		this.duration( newDuration );
	}
};
