"use strict";

ui.patterns = {
	init() {
		ui.patterns.audioBlocks = {};
		ui.idElements.patNew.onclick = gs.newPattern;
		ui.idElements.patRemove.onclick = ui.patterns._onclickRemove;
	},
	empty() {
		for ( var id in ui.patterns.audioBlocks ) {
			ui.patterns._remove( id );
		}
	},
	change( id, data ) {
		data
			? ui.patterns.audioBlocks[ id ]
				? ui.patterns._update( id, data )
				: ui.patterns._add( id, data )
			: ui.patterns._remove( id );
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
	updateContent( id, data ) {
		ui.patterns.audioBlocks[ id ].updateData( data );
		ui.mainGrid.getPatternBlocks( id ).forEach( function( uiBlock ) {
			if ( !gs.currCmp.blocks[ uiBlock.id ].durationEdited ) {
				uiBlock.duration( data.duration );
			}
			uiBlock.updateData( data );
		} );
	},

	// private:
	_add( id, data ) {
		var pat = new gsuiAudioBlock(),
			patRoot = pat.rootElement;

		pat.data = data;
		pat.name( data.name );
		pat.datatype( "keys" );
		pat.ondrag = function() {}; // !!!
		patRoot._patId = id;
		patRoot.setAttribute( "draggable", "true" );
		patRoot.ondragstart = ui.patterns._ondragstartPattern.bind( null, id );
		patRoot.ondblclick = ui.patterns._ondblclickPattern.bind( null, id );
		ui.patterns.audioBlocks[ id ] = pat;
		ui.idElements.patterns.prepend( patRoot );
		ui.patterns.open( id );
	},
	_remove( id ) {
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
	_update( id, dataChange ) {
		var val,
			blocks = ui.mainGrid.getPatternBlocks( id );

		if ( "name" in dataChange ) {
			val = dataChange.name;
			ui.patterns.audioBlocks[ id ].name( val );
			ui.mainGrid.getPatternBlocks( id ).forEach( function( uiBlock ) {
				uiBlock.name( val );
			} );
			if ( id === gs.currCmp.patternOpened ) {
				ui.pattern.name( val );
			}
		}
	},

	// events:
	_onclickRemove() {
		var patId = gs.currCmp.patternOpened,
			patRoot = ui.patterns.audioBlocks[ patId ].rootElement;

		// .1
		if ( patRoot.nextSibling || patRoot.previousSibling ) {
			gs.removePattern( patId );
		}
	},
	_ondblclickPattern( id ) {
		if ( id !== gs.currCmp.patternOpened ) {
			ui.patterns.open( id );
		}
	},
	_ondragstartPattern( id, e ) {
		e.dataTransfer.setData( "text", id );
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
