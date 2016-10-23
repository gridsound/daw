"use strict";

gs.samples.selected.do = function( smp, fn ) {
	if ( smp ) { // `smp` #uselessCheck
		if ( smp.data.selected ) {
			gs.selectedSamples.forEach( fn );
		} else {
			fn( smp );
		}
	}
};
