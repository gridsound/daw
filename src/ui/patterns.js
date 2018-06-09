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
	getPatternElement( id ) {
		return this.list.get( id );
	},
	create( id, obj ) {
		const pat = dom.pattern.cloneNode( true );

		pat.querySelector( ".pattern-clone" ).onclick = this._onclickClone.bind( this, id );
		pat.querySelector( ".pattern-remove" ).onclick = this._onclickRemove.bind( this, id );
		pat.dataset.id = id;
		pat.onclick = this._onclickPattern.bind( this, id );
		pat.ondragstart = e => e.dataTransfer.setData( "text",
			id + ":" + gs.currCmp.patterns[ id ].duration );
		this.list.set( id, pat );
		this.updateName( id, obj.name );
		ui.synths.addPattern( obj.synth, id );
		gs.openPattern( id );
	},
	delete( id ) {
		const patRoot = this.getPatternElement( id );

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
			pat = this.getPatternElement( id );

		if ( patSel ) {
			patSel.classList.remove( "selected" );
			delete this._selectedPattern;
		}
		if ( pat ) {
			this._selectedPattern = pat;
			pat.classList.add( "selected" );
		}
	},
	updateName( id, name ) {
		this.getPatternElement( id ).querySelector( ".pattern-name" ).textContent = name;
	},
	updateContent( id ) {
		const elPat = this.getPatternElement( id );

		if ( !elPat._gsuiRectMatrix ) {
			const mat = new gsuiRectMatrix();

			mat.setResolution( 200, 32 );
			elPat._gsuiRectMatrix = mat;
			elPat.querySelector( ".pattern-content" ).append( mat.rootElement );
		}
		elPat._gsuiRectMatrix.render(
			ui.keysToRects( gs.currCmp.keys[ gs.currCmp.patterns[ id ].keys ] ) );
	},

	// events:
	_onclickPattern( id, e ) {
		if ( id !== gs.currCmp.patternOpened ) {
			gs.openPattern( id );
		}
	},
	_onclickClone( id, e ) {
		e.stopPropagation();
		gs.undoredo.change( jsonActions.clonePattern( id ) );
		return false;
	},
	_onclickRemove( id, e ) {
		const patRoot = this.getPatternElement( id );

		e.stopPropagation();
		// .1
		if ( patRoot.nextSibling || patRoot.previousSibling ) {
			gs.undoredo.change( jsonActions.removePattern( id ) );
		} else {
			gsuiPopup.alert( "Error", "You can not delete the last pattern" );
		}
		return false;
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
