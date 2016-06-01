"use strict";

ui.getTrackFromPageY = function( pageY ) {
	return ui.tracks[ Math.floor( ( pageY - ui.gridColsY - ui.gridTop ) / ui.gridEm ) ];
};
