"use strict";

gs.updatePatternContent = function( id ) {
	var keyId,
		keyObj,
		row,
		nbRows,
		cmp = gs.currCmp,
		minrow = Infinity,
		maxrow = -Infinity,
		samples = [],
		keys = cmp.keys[ cmp.patterns[ id ].keys ];

	for ( keyId in keys ) {
		keyObj = keys[ keyId ];
		row = ui.keysGridSamples.uiKeys.keyToIndex( keyObj.key );
		minrow = Math.min( row, minrow );
		maxrow = Math.max( row, maxrow );
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
		duration: 4, // !!!!!!!!!!!!!!!!!!!
		samples: samples
	} );
};
