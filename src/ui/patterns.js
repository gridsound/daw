"use strict";

ui.patterns = {
	init() {
		dom.pattern.remove();
		dom.pattern.removeAttribute( "id" );
		this.list = new Map();
	},
	empty() {
		this.list.forEach( ( val, id ) => this.delete( id ) );
	},
	create( id, obj ) {
		const pat = dom.pattern.cloneNode( true );

		this._renamePattern( pat, obj.name );
		pat.dataset.id = id;
		pat.onclick = this._onclickPattern.bind( this, id );
		pat.ondragstart = this._ondragstartPattern.bind( this, id );
		pat.querySelector( ".pattern-clone" ).onclick = this._onclickClone.bind( this, id );
		pat.querySelector( ".pattern-remove" ).onclick = this._onclickRemove.bind( this, id );
		this.list.set( id, pat );
		ui.synths.addPattern( obj.synth, pat );
		gs.openPattern( id );
	},
	update( id, obj ) {
		const pat = this.list.get( id );

		if ( obj.synth ) {
			ui.synths.addPattern( obj.synth, pat );
		}
		if ( "name" in obj ) {
			const name = obj.name;

			this._renamePattern( pat, name );
			ui.mainGrid.getPatternBlocks( id ).forEach( pat => this._renamePattern( pat, name ) );
			if ( id === gs.currCmp.patternOpened ) {
				ui.pattern.name( name );
			}
		}
	},
	delete( id ) {
		const patRoot = this.list.get( id );

		if ( id === gs.currCmp.patternOpened ) {
			const sibling = patRoot.nextSibling || patRoot.previousSibling;

			// .2
			delete gs.currCmp.patternOpened;
			if ( sibling ) {
				gs.openPattern( sibling.dataset.id );
			}
		}
		this.list.delete( id );
		patRoot.remove();
	},
	select( id ) {
		const patSel = this._selectedPattern,
			pat = this.list.get( id );

		if ( patSel ) {
			patSel.classList.remove( "selected", "gsuiAudioBlock-reversedColors" );
			delete this._selectedPattern;
		}
		if ( pat ) {
			this._selectedPattern = pat;
			pat.classList.add( "selected", "gsuiAudioBlock-reversedColors" );
		}
	},
	updateContent( id, data ) {
		this._updatePatternData( this.list.get( id ), data );
		ui.mainGrid.getPatternBlocks( id ).forEach( pat => {
			const blc = gs.currCmp.blocks[ pat.id ];

			if ( !blc.durationEdited ) {
				pat.duration( blc.duration );
				pat.contentWidthFixed();
			}
			this._updatePatternData( pat, data, blc.offset, blc.duration );
		} );
	},

	// private:
	_renamePattern( elPat, name ) {
		elPat.querySelector( ".pattern-name" ).textContent = name;
	},
	_updatePatternData( elPat, data, off, dur ) {
		if ( !elPat._gsuiRectMatrix ) {
			const mat = new gsuiRectMatrix();

			elPat._gsuiRectMatrix = mat;
			mat.setResolution( 200, 32 );
			elPat.querySelector( ".pattern-content" ).append( mat.rootElement );
		}
		elPat._gsuiRectMatrix.render( data, off, dur );
	},

	// events:
	_onclickClone( id, e ) {
		e.stopPropagation();
		gs.undoredo.change( jsonActions.clonePattern( id ) );
		return false;
	},
	_onclickRemove( id, e ) {
		const patRoot = this.list.get( id );

		e.stopPropagation();
		// .1
		if ( patRoot.nextSibling || patRoot.previousSibling ) {
			gs.undoredo.change( jsonActions.removePattern( id ) );
		} else {
			gsuiPopup.alert( "Error", "You can not delete the last pattern" );
		}
		return false;
	},
	_onclickPattern( id, e ) {
		if ( id !== gs.currCmp.patternOpened ) {
			gs.openPattern( id );
		}
	},
	_ondragstartPattern( id, e ) {
		e.dataTransfer.setData( "text", id );
	}
};

/*
const uiBlock = this.list.get( id );

this._oncontextmenu();
this._uiBlockPlaying = uiBlock;
uiBlock.start( gs.currCmp.bpm );
wa.patterns.play( id );

_oncontextmenu( e ) {
	if ( !e || e.target !== dom.patterns ) {
		if ( this._uiBlockPlaying ) {
			wa.patterns.stop();
			this._uiBlockPlaying.stop();
			delete this._uiBlockPlaying;
		}
	}
	return false;
},

.1 : Why the UI choose to block the deletion of the last pattern?
	The logic code can handle the deletion of all the pattern, but the UI not.
	Currently the UI need a pattern opened everytime.
	Because of this, the `if` is not in the logic code.

.2 : Why is there *another* sibling check in the ui.remove() function?
	The UI doesn't allow the deletion of the last pattern, but there is still
	another check in the simple `ui.remove()` function. This is because when
	a composition is unload (to load another one) ALL the patterns are removed.
*/
