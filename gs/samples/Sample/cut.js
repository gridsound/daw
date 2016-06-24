"use strict";

gs.Sample.prototype.cut = function( sec ) {
	if ( this.wsample ) { // check wsample for empty sample
		var dist = sec - this.wsample.when;

		var ns = gs.sampleCreate( this.gsfile, this.track.id, ( this.wsample.when + dist ) * ui.BPMem );
		ns.slip( this.wsample.offset + dist);
		ns.duration( this.wsample.duration - dist );

		this.duration( dist );
	}
};