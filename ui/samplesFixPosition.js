"use strict";

ui.samplesFixPosition = function( sample ) {
	if ( sample && ui.isMagnetized ) {
		if ( sample.selected ) {
			ui.selectedSamples.forEach( function( s ) {
				s.xemMouse = s.xemMagnet;
			});
		} else {
			sample.xemMouse = sample.xemMagnet;
		}
	}
};
