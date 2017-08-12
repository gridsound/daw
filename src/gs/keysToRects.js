"use strict";

gs.keysToRects = function( keys ) {
	var keyId,
		keyObj,
		row,
		nbRows,
		minrow = Infinity,
		maxrow = -Infinity,
		dur = 0,
		samples = [],
		cmp = gs.currCmp;

	for ( keyId in keys ) {
		keyObj = keys[ keyId ];
		row = ui.keysGridSamples.uiKeys.keyToIndex( keyObj.key );
		minrow = Math.min( minrow, row );
		maxrow = Math.max( maxrow, row );
		dur = Math.max( dur, keyObj.when + keyObj.duration );
		samples.push( {
			row: row,
			when: keyObj.when,
			duration: keyObj.duration,
		} );
	}
	nbRows = maxrow - minrow;
	samples.forEach( function( smp ) {
		smp.row = nbRows - ( smp.row - minrow );
	} );
	return {
		nbRows: nbRows + 1,
		samples: samples,
		duration: Math.max( 1, Math.ceil( dur / cmp.beatsPerMeasure ) ) * cmp.beatsPerMeasure
	};
};
