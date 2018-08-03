"use strict";

class uiPatterns {
	constructor() {
		dom.pattern.remove();
		dom.pattern.removeAttribute( "id" );
		this.list = new Map();
	}

	empty() {
		this.list.forEach( ( val, id ) => this.delete( id ) );
	}
	getPatternElement( id ) {
		return this.list.get( id );
	}
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
	}
	delete( id ) {
		const patRoot = this.getPatternElement( id );

		if ( id === gs.currCmp.patternOpened ) {
			const sibling = patRoot.nextSibling || patRoot.previousSibling;

			delete gs.currCmp.patternOpened;
			gs.openPattern( sibling && sibling.dataset.id );
		}
		this.list.delete( id );
		patRoot.remove();
	}
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
	}
	updateName( id, name ) {
		this.getPatternElement( id ).querySelector( ".pattern-name" ).textContent = name;
	}
	updateContent( id ) {
		const elPat = this.getPatternElement( id );

		if ( !elPat._gsuiRectMatrix ) {
			const mat = new gsuiRectMatrix();

			mat.setResolution( 200, 32 );
			elPat._gsuiRectMatrix = mat;
			elPat.querySelector( ".pattern-content" ).append( mat.rootElement );
		}
		elPat._gsuiRectMatrix.render(
			uiKeysToRects( gs.currCmp.keys[ gs.currCmp.patterns[ id ].keys ] ) );
	}

	// events:
	_onclickPattern( id, e ) {
		if ( id !== gs.currCmp.patternOpened ) {
			gs.openPattern( id );
		}
	}
	_onclickClone( id, e ) {
		e.stopPropagation();
		gs.undoredo.change( json_clonePattern( gs.currCmp, id ) );
		return false;
	}
	_onclickRemove( id, e ) {
		const patRoot = this.getPatternElement( id );

		e.stopPropagation();
		gs.undoredo.change( json_removePattern( gs.currCmp, id ) );
		return false;
	}
}
