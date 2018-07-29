"use strict";

class uiCmps {
	constructor() {
		dom.cmpMenu.onclick = this._clickMenu.bind( this );
		dom.openComposition.onclick = () => ui.openPopup.show();
		dom.newComposition.onclick = () => ( gs.loadNewComposition(), false );
		this._exportTextWAV = dom.exportCompositionWAV.textContent;
		this._html = new Map();
	}

	push( id ) {
		const root = dom.cmp.cloneNode( true );

		root.querySelector( ".save" ).onclick = gs.saveCurrentComposition;
		root.querySelector( ".info" ).onclick = this._onclickLoadCmp.bind( this, id );
		root.querySelector( ".menu" ).onclick = this._showMenu.bind( this, id );
		this._html.set( id, {
			root,
			name: root.querySelector( ".name" ),
			bpm: root.querySelector( ".bpm" ),
			duration: root.querySelector( ".duration" ),
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
		html.root.classList.add( "loaded" );
		ui.controls.title( gs.currCmp.name );
		dom.cmps.prepend( html.root );
	}
	saved( saved ) {
		ui.controls.title( gs.currCmp.name );
		this._loadOne.root.classList.toggle( "notSaved", !saved );
	}
	unload() {
		this._loadOne.root.classList.remove( "loaded" );
		delete this._loadOne;
	}

	// private:
	_onclickLoadCmp( id ) {
		gs.loadCompositionById( id ).then( () => {
			dom.cmps.scrollTop = 0;
		} );
		return false;
	}
	_showMenu( id, e ) {
		const gBCR = e.target.parentNode.getBoundingClientRect();

		this._cmpId = id;
		dom.cmpMenu.style.top = gBCR.top + ( gBCR.bottom - gBCR.top ) / 2 + "px";
		dom.cmpMenu.classList.remove( "hidden" );
		e.stopPropagation();
	}
	_hideMenu() {
		if ( this._cmpId ) {
			delete this._cmpId;
			delete this._wavReady;
			dom.exportCompositionWAV.textContent = this._exportTextWAV;
			dom.exportCompositionWAV.download =
			dom.exportCompositionWAV.href = "";
			dom.cmpMenu.classList.add( "hidden" );
		}
	}
	_clickMenu( e ) {
		const id = this._cmpId,
			currCmp = gs.currCmp,
			cmpLoaded = id === currCmp.id,
			a = e.target;
		let closeMenu = true;

		e.stopPropagation();
		if ( a.id === "deleteComposition" ) {
			const cmp = cmpLoaded ? currCmp : gs.localStorage.get( id );

			gsuiPopup.confirm( "Warning",
				`Are you sure you want to delete "${ cmp.name }" ? (no undo possible)`
			).then( b => b && gs.deleteComposition( id ) );
		} else if ( a.id === "exportCompositionJSON" || a.id === "exportCompositionWAV" ) {
			const cmp = cmpLoaded ? currCmp : gs.localStorage.get( id ),
				name = cmp.name || "untitled";

			if ( a.id === "exportCompositionJSON" ) {
				a.download = name + ".gs";
				a.href = gs.exportCompositionToJSON( cmp );
			} else if ( cmpLoaded ) {
				closeMenu = this._wavReady === 2;
				if ( !this._wavReady ) {
					this._wavReady = 1;
					a.download = name + ".wav";
					a.textContent += " (please wait...)";
					gs.exportCurrentCompositionToWAV().then( url => {
						this._wavReady = 2;
						a.href = url;
						a.textContent = this._exportTextWAV + " (re-click to download)";
					} );
				}
			} else {
				gsuiPopup.alert( "Error", `You have to open "${ name }" before exporting it in WAV.` );
			}
		}
		if ( closeMenu ) {
			setTimeout( this._hideMenu.bind( this ), 200 );
		}
		if ( !a.download || this._wavReady === 1 ) {
			return false;
		}
	}
}
