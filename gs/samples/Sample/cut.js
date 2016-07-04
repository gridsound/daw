"use strict";

gs.Sample.prototype.cut = function( newDuration ) {
	if ( this.wsample && this.wsample.duration > newDuration ) { // check wsample for empty sample
		var ns = gs.sampleCreate( this.gsfile, this.track.id, ( this.wsample.when + newDuration ) * ui.BPMem );
		ns.slip( this.wsample.offset + newDuration );
		ns.duration( this.wsample.duration - newDuration );

		this.duration( newDuration );
	}
};
