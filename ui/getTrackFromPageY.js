"use strict";

ui.getTrackFromPageY = function( pageY ) {
	return waFwk.tracks[ Math.floor(
		( pageY - ui.gridColsY + ui.gridScrollTop ) / ui.trackHeight
	) ].userData;
};
