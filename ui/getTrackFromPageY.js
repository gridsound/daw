"use strict";

ui.getTrackFromPageY = function( py ) {
	return waFwk.tracks[
		Math.floor( ( py - ui.gridColsY + ui.gridScrollTop ) / ui.trackHeight ) ];
};
