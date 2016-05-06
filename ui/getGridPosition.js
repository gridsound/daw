"use strict";

ui.getGridPosition = function( e ) {
	return {
		trackId: Math.floor( ( e.pageY - ui.gridColsY - ui.gridTop ) / ui.gridEm ),
		xem: ( e.pageX - ui.filesWidth - ui.trackNamesWidth - ui.trackLinesLeft ) / ui.gridEm
	};
};
