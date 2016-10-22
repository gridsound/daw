"use strict";

gs.sample.select = function( smp, b ) {
	if ( smp && smp.data.selected !== b ) { // `smp` #uselessCheck
		if ( typeof b !== "boolean" ) {
			b = !smp.data.selected;
		}
		if ( b ) {
			gs.selectedSamples.push( smp );
		} else {
			gs.selectedSamples.splice( gs.selectedSamples.indexOf( smp ), 1 );
		}
		smp.data.selected = b;
		ui.sample.select( smp );
	}
};
