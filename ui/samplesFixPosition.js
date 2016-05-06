"use strict";

ui.samplesFixPosition = function( sample ) {
	if ( ui.isMagnetized ) {
		ui.samplesForEach( sample, function( s ) {
			s.xemMouse = s.xemMagnet;
		});
	}
};
