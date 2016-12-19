"use strict";

ui.getTrackFromPageY = function( pageY ) {
	return ui.tracks[ Math.floor( ( pageY - ui.gridColsY + ui.gridScrollTop ) / ui.trackHeight ) ];
};
