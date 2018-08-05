"use strict";

class uiCmps {
	constructor() {
		dom.openComposition.onclick = () => ui.openPopup.show();
		dom.newComposition.onclick = () => ( gs.loadNewComposition(), false );
		this._exportTextWAV = dom.exportCompositionWAV.textContent;
		this._html = new Map();
	}

	push( id ) {
		const root = dom.cmp.cloneNode( true ),
			qs = w => root.querySelector( ".cmp-" + w );

		qs( "save" ).onclick = gs.saveCurrentComposition;
		qs( "info" ).onclick = this._onclickLoadCmp.bind( this, id );
		qs( "delete" ).onclick = this._onclickDelete.bind( this, id );
		qs( "jsonExport" ).onclick = this._onclickJsonExport.bind( this, id );
		this._html.set( id, {
			root,
			bpm: qs( "bpm" ),
			name: qs( "name" ),
			duration: qs( "duration" ),
		} );
		dom.cmps.append( root );
	}
	remove( id ) {
		const cmps = this._html;

		if ( cmps.has( id ) ) {
			cmps.get( id ).root.remove();
			cmps.delete( id );
		}
	}
	update( id, cmp ) {
		const html = this._html.get( id );

		html.name.textContent = cmp.name;
		ui.controls.title( cmp.name );
		html.bpm.textContent = cmp.bpm;
		html.duration.textContent = common.time.beatToMin( cmp.duration, cmp.bpm ) +
			":" + common.time.beatToSec( cmp.duration, cmp.bpm );
	}
	load( id ) {
		const html = this._html.get( id );

		this._loadOne = html;
		html.root.classList.add( "cmp-loaded" );
		ui.controls.title( gs.currCmp.name );
		dom.cmps.prepend( html.root );
	}
	saved( saved ) {
		ui.controls.title( gs.currCmp.name );
		this._loadOne.root.classList.toggle( "cmp-notSaved", !saved );
	}
	unload() {
		this._loadOne.root.classList.remove( "cmp-loaded" );
		delete this._loadOne;
	}

	// private:
	_onclickLoadCmp( id ) {
		gs.loadCompositionById( id ).then( () => {
			dom.cmps.scrollTop = 0;
		}, e => {
			e && console.error( e );
		} );
		return false;
	}
	_onclickDelete( id ) {
		const cmp = id === gs.currCmp.id ? gs.currCmp : gs.localStorage.get( id );

		gsuiPopup.confirm( "Warning",
			`Are you sure you want to delete "${ cmp.name }" ? (no undo possible)`,
			"Delete"
		).then( b => b && gs.deleteComposition( id ) );
	}
	_onclickJsonExport( id, e ) {
		const cmp = id === gs.currCmp.id ? gs.currCmp : gs.localStorage.get( id ),
			a = e.currentTarget;

		a.download = ( cmp.name || "untitled" ) + ".gs";
		a.href = gs.exportCompositionToJSON( cmp );
	}
}
