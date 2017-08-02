"use strict";

gs.updatePatternContent = function( id ) {
	var keyId,
		keyObj,
		row,
		nbRows,
		dur = 0,
		cmp = gs.currCmp,
		minrow = Infinity,
		maxrow = -Infinity,
		samples = [],
		keys = cmp.keys[ cmp.patterns[ id ].keys ];

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
	ui.patterns.updateData( id, {
		nbRows: nbRows + 1,
		samples: samples,
		duration: Math.ceil( dur / cmp.beatsPerMeasure ) * cmp.beatsPerMeasure
	} );
};
