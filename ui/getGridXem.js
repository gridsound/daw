"use strict";

ui.getGridXem = function( pageX ) {
	var rest,
		prec = 1 / 4,
		xem = ( pageX - ui.filesWidth - ui.trackNamesWidth - ui.trackLinesLeft ) / ui.gridEm;

	if ( ui.isMagnetized ) {
		rest = xem % prec;
		xem -= rest;
		if ( rest > prec / 2 ) {
			xem += prec;
		}
	}
	return xem;
};
