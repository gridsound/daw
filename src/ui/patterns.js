"use strict";

ui.patterns = {
	init() {
		ui.patterns.audioBlocks = {};
		ui.idElements.patNew.onclick = gs.newPattern;
		ui.idElements.patRemove.onclick = ui.patterns._onclickRemove;
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
		pat.rootElement.ondblclick = ui.patterns._ondblclickPattern.bind( null, id );
		ui.patterns.audioBlocks[ id ] = pat;
		ui.idElements.patterns.prepend( pat.rootElement );
	},
	remove( id ) {
		var sibling,
			patRoot = ui.patterns.audioBlocks[ id ].rootElement;

		if ( id === gs.currCmp.patternOpened ) {
			delete gs.currCmp.patternOpened;

			// .2
			sibling = patRoot.nextSibling || patRoot.previousSibling;
			if ( sibling ) {
				ui.patterns.open( sibling._patId );
			}
		}
		delete ui.patterns.audioBlocks[ id ];
		patRoot.remove();
	},
	open( id ) {
		var pat, cmp = gs.currCmp;

		cmp.patternOpened = id;
		pat = cmp.patterns[ id ];
		ui.patterns.select( id );
		ui.pattern.name( pat.name );
		ui.pattern.load( cmp.keys[ pat.keys ] );
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
	},

	// events:
	_ondblclickPattern( id ) {
		if ( id !== gs.currCmp.patternOpened ) {
			ui.patterns.open( id );
		}
	},
	_onclickRemove() {
		var patId = gs.currCmp.patternOpened,
			patRoot = ui.patterns.audioBlocks[ patId ].rootElement;

		// .1
		if ( patRoot.nextSibling || patRoot.previousSibling ) {
			gs.removePattern( patId );
		}
	}
};

/*
.1 : Why the UI choose to block the deletion of the last pattern?
	The logic code can handle the deletion of all the pattern, but the UI not.
	Currently the UI need a pattern opened everytime.
	Because of this, the `if` is not in the logic code.

.2 : Why is there *another* sibling check in the ui.remove() function?
	The UI doesn't allow the deletion of the last pattern, but there is still
	another check in the simple `ui.remove()` function. This is because when
	a composition is unload (to load another one) ALL the patterns are removed.
*/
