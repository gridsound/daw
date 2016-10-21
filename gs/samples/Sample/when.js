"use strict";

gs.sample.when = function( smp, sec ) {
	if ( smp.wsample ) { // TODO: #emptySample
		smp.wsample.when = sec;
		ui.CSS_sampleWhen( smp );
	}
};
