"use strict";

gs.Sample.prototype.select = function( b ) {
	if ( this.wsample ) { // check wsample for empty sample
		this.selected = b;
		ui.CSS_sampleSelect( this );
	}
};
