"use strict";

ui.patterns = {
	init() {
		ui.patterns.audioBlocks = {};
		dom.patNew.onclick = gs.newPattern;
		dom.patClone.onclick = ui.patterns._onclickClone;
		dom.patRemove.onclick = ui.patterns._onclickRemove;
		dom.patterns.oncontextmenu = ui.patterns._oncontextmenu;
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
	select( id ) {
		var patSel = ui.patterns._selectedPattern,
			pat = ui.patterns.audioBlocks[ id ];

		if ( patSel ) {
			patSel.rootElement.classList.remove( "selected", "gsuiAudioBlock-reversedColors" );
		}
		ui.patterns._selectedPattern = pat;
		pat.rootElement.classList.add( "selected", "gsuiAudioBlock-reversedColors" );
	},
	updateContent( id, data ) {
		ui.patterns.audioBlocks[ id ].updateData( data );
		ui.mainGrid.getPatternBlocks( id ).forEach( function( uiBlock ) {
			var blc = gs.currCmp.blocks[ uiBlock.id ];

			if ( !blc.durationEdited ) {
				uiBlock.duration( blc.duration );
				uiBlock.contentWidthFixed();
			}
			uiBlock.updateData( data, blc.offset, blc.duration );
		} );
	},

	// private:
	_add( id, data ) {
		var pat = new gsuiAudioBlock(),
			patRoot = pat.rootElement;

		pat.data = data;
		pat.name( data.name );
		pat.datatype( "keys" );
		patRoot._patId = id;
		patRoot.setAttribute( "draggable", "true" );
		patRoot.onclick = ui.patterns._onclickPattern.bind( null, id );
		patRoot.ondblclick = ui.patterns._ondblclickPattern.bind( null, id );
		patRoot.ondragstart = ui.patterns._ondragstartPattern.bind( null, id );
		ui.patterns.audioBlocks[ id ] = pat;
		dom.patterns.prepend( patRoot );
		gs.openPattern( id );
	},
	_remove( id ) {
		var sibling,
			patRoot = ui.patterns.audioBlocks[ id ].rootElement;

		if ( id === gs.currCmp.patternOpened ) {
			delete gs.currCmp.patternOpened;

			// .2
			sibling = patRoot.nextSibling || patRoot.previousSibling;
			if ( sibling ) {
				gs.openPattern( sibling._patId );
			}
		}
		delete ui.patterns.audioBlocks[ id ];
		patRoot.remove();
	},
	_update( id, dataChange ) {
		if ( "name" in dataChange ) {
			var val = dataChange.name;

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
	_oncontextmenu( e ) {
		if ( !e || e.target !== dom.patterns ) {
			if ( ui.patterns._uiBlockPlaying ) {
				wa.patterns.stop();
				ui.patterns._uiBlockPlaying.stop();
				delete ui.patterns._uiBlockPlaying;
			}
		}
		return false;
	},
	_onclickClone() {
		gs.clonePattern( gs.currCmp.patternOpened );
	},
	_onclickRemove() {
		var patId = gs.currCmp.patternOpened,
			patRoot = ui.patterns.audioBlocks[ patId ].rootElement;

		// .1
		if ( patRoot.nextSibling || patRoot.previousSibling ) {
			gs.removePattern( patId );
		} else {
			gsuiPopup.alert( "Error", "You can not delete the only pattern" );
		}
	},
	_onclickPattern( id, e ) {
		var uiBlock = ui.patterns.audioBlocks[ id ];

		ui.patterns._oncontextmenu();
		ui.patterns._uiBlockPlaying = uiBlock;
		uiBlock.start( gs.currCmp.bpm );
		wa.patterns.play( id );
	},
	_ondblclickPattern( id ) {
		if ( id !== gs.currCmp.patternOpened ) {
			ui.patterns._oncontextmenu();
			gs.openPattern( id );
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
