"use strict";

ui.patterns = {
	init() {
		ui.patterns.audioBlocks = {};
		ui.idElements.patNew.onclick = gs.newPattern;
	},
	empty() {
		for ( var id in ui.patterns.audioBlocks ) {
			ui.patterns.remove( id );
		}
	},
	add( id, data ) {
		var pat = new gsuiAudioBlock();

		pat.data = data;
		pat.name( data.name );
		pat.datatype( "keys" );
		pat.ondrag = function() {};
		pat.rootElement._patId = id;
		pat.rootElement.ondblclick = ui.patterns.open.bind( null, id );
		ui.patterns.audioBlocks[ id ] = pat;
		ui.idElements.patterns.prepend( pat.rootElement );
	},
	remove( id ) {
		var blockRoot = ui.patterns.audioBlocks[ id ].rootElement;

		if ( id === gs.currCmp.patternOpened ) {
			delete gs.currCmp.patternOpened;
			ui.patterns.open( blockRoot.nextSibling._patId );
		}
		blockRoot.remove();
		delete ui.patterns.audioBlocks[ id ];
	},
	open( id ) {
		var pat, cmp = gs.currCmp;

		if ( id !== cmp.patternOpened ) {
			cmp.patternOpened = id;
			pat = cmp.patterns[ id ];
			ui.patterns.select( id );
			ui.pattern.name( pat.name );
			ui.pattern.load( cmp.keys[ pat.keys ] );
		}
	},
	select( id ) {
		var patSel = ui.patterns._selectedPattern,
			pat = ui.patterns.audioBlocks[ id ];

		if ( patSel ) {
			patSel.rootElement.classList.remove( "selected" );
		}
		ui.patterns._selectedPattern = pat;
		pat.rootElement.classList.add( "selected" );
	},
	name( id, n ) {
		ui.patterns.audioBlocks[ id ].name( n );
	},
	update( id, dataChange ) {
		if ( "name" in dataChange ) {
			ui.patterns.name( id, dataChange.name )
			if ( id === gs.currCmp.patternOpened ) {
				ui.pattern.name( dataChange.name );
			}
		}
	},
	updatePreview( id ) {
		var keyId,
			keyObj,
			row,
			nbRows,
			minrow = Infinity,
			maxrow = -Infinity,
			dur = 0,
			samples = [],
			cmp = gs.currCmp,
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
		ui.patterns.audioBlocks[ id ].updateData( {
			nbRows: nbRows + 1,
			samples: samples,
			duration: Math.ceil( dur / cmp.beatsPerMeasure ) * cmp.beatsPerMeasure
		} );
	}
};
