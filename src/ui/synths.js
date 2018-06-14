"use strict";

class uiSynths {
	constructor() {
		dom.synth.remove();
		dom.synth.removeAttribute( "id" );
		dom.synthNew.onclick = this._onclickNew.bind( this );
		this.list = new Map();
	}

	empty() {
		this.list.forEach( ( synth, id ) => this.delete( id ) );
	}
	create( id, obj ) {
		const root = dom.synth.cloneNode( true );

		this.list.set( id, root );
		root.dataset.id = id;
		root.ondrop = this._ondrop.bind( this, id );
		root.querySelector( ".synth-name" ).onclick = gs.openSynth.bind( null, id );
		root.querySelector( ".synth-showBtn" ).onclick = this.show.bind( this, id, undefined );
		root.querySelector( ".synth-deleteBtn" ).onclick = this._onclickDelete.bind( this, id );
		root.querySelector( ".synth-newPatternBtn" ).onclick = this._onclickNewPattern.bind( this, id );
		this.updateName( id, obj.name );
		dom.patterns.prepend( root );
	}
	delete( id ) {
		const toDel = this.list.get( id ),
			toSel = id !== this._selected.dataset.id ? null
				: toDel.nextElementSibling || toDel.previousElementSibling;

		this.list.delete( id );
		toDel.remove();
		if ( toSel ) {
			gs.openSynth( toSel.dataset.id );
		}
	}
	show( id, b ) {
		this.list.get( id ).classList.toggle( "synth-show", b );
		return false;
	}
	select( id ) {
		if ( this._selected ) {
			this._selected.classList.remove( "synth-selected" );
		}
		this._selected = this.list.get( id );
		this._selected.classList.add( "synth-selected" );
	}
	updateName( id, name ) {
		this.list.get( id ).querySelector( ".synth-name" ).textContent = name;
	}
	getFirstPattern( synthId ) {
		const pat = this.list.get( synthId ).querySelector( ".pattern" );

		return pat && pat.dataset.id;
	}
	addPattern( synthId, patId ) {
		const patElement = ui.patterns.getPatternElement( patId );

		this.list.get( synthId ).querySelector( ".synth-patterns" ).prepend( patElement );
		if ( patElement.dataset.id === gs.currCmp.patternOpened ) {
			gs.openSynth( synthId );
		}
	}

	// events:
	_ondrop( synthId, e ) {
		const patId = e.dataTransfer.getData( "text" ),
			pat = gs.currCmp.patterns[ patId ];

		if ( pat && pat.synth !== synthId ) {
			gs.undoredo.change( jsonActions.patternChangeSynth( patId, synthId ) );
		}
	}
	_onclickNew() {
		const obj = jsonActions.newSynth();

		gs.undoredo.change( obj );
		gs.openSynth( Object.keys( obj.synths )[ 0 ] );
		return false;
	}
	_onclickDelete( synthId ) {
		if ( Object.keys( gs.currCmp.synths ).length > 1 ) {
			gs.undoredo.change( jsonActions.removeSynth( synthId ) );
		} else {
			gsuiPopup.alert( "Error", "You can not delete the last synthesizer" );
		}
		return false;
	}
	_onclickNewPattern( synthId ) {
		gs.undoredo.change( jsonActions.newPattern( synthId ) );
		this.show( synthId, true );
		return false;
	}
}
