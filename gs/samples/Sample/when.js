"use strict";

gs.Sample.prototype.when = function( sec ) {
	if ( this.wsample ) { // check wsample for empty sample
		this.wsample.when = sec;
		ui.CSS_sampleWhen( this );
	}
};
