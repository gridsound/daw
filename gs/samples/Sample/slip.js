"use strict";

gs.Sample.prototype.slip = function( offset ) {
	if ( this.wsample ) { // check wsample for empty sample
		this.wsample.offset = Math.min( this.wsample.bufferDuration, Math.max( offset, 0 ) );
		ui.CSS_sampleOffset( this );
	}
};
