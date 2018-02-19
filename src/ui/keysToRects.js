"use strict";

ui.keysToRects = function( keys ) {
	var nbRows,
		minrow = Infinity,
		maxrow = -Infinity,
		dur = 0,
		cmp = gs.currCmp,
		samples = Object.values( keys ).map( ( { key, when, duration } ) => {
			minrow = Math.min( minrow, key );
			maxrow = Math.max( maxrow, key );
			dur = Math.max( dur, when + duration );
			return { when, duration, row: key };
		} );

	minrow -= minrow % 12;
	maxrow += 11 - maxrow % 12;
	nbRows = maxrow - minrow;
	samples.forEach( smp => smp.row = nbRows - ( smp.row - minrow ) );
	++nbRows;
	dur /= cmp.beatsPerMeasure;
	dur = Math.max( 1, Math.ceil( dur ) );
	return { nbRows, samples, duration: dur * cmp.beatsPerMeasure };
};
