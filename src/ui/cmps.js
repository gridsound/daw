"use strict";

class uiCmps {
	constructor() {
		dom.newComposition.onclick = gs.loadNewComposition;
		dom.openComposition.onclick = () => ui.openPopup.show();
		dom.cmpMenu.onclick = this._clickMenu.bind( this );
		this._exportTextWAV = dom.exportCompositionWAV.textContent;
		this._html = {};
	}

	push( id ) {
		var root = document.createElement( "div" ),
			save = document.createElement( "div" ),
			info = document.createElement( "div" ),
			menu = document.createElement( "div" ),
			name = document.createElement( "div" ),
			bpm = document.createElement( "span" ),
			duration = document.createElement( "span" );

		root.className = "cmp";
		save.className = "save";
		info.className = "info";
		menu.className = "menu";
		name.className = "name";
		bpm.className = "bpm";
		duration.className = "duration";
		info.append( name, bpm, duration );
		root.append( save, info, menu );
		save.onclick = gs.saveCurrentComposition;
		info.onclick = gs.loadCompositionById.bind( null, id );
		menu.onclick = this._showMenu.bind( this, id );
		this._html[ id ] = { root, name, bpm, duration };
		dom.cmps.append( root );
	}
	remove( id ) {
		const cmps = this._html;

		if ( cmps[ id ] ) {
			cmps[ id ].root.remove();
			delete cmps[ id ];
		}
	}
	update( id, cmp ) {
		const html = this._html[ id ];

		html.name.textContent = cmp.name;
		ui.controls.title( cmp.name );
		html.bpm.textContent = cmp.bpm;
		html.duration.textContent = common.time.beatToMin( cmp.duration, cmp.bpm ) +
			":" + common.time.beatToSec( cmp.duration, cmp.bpm );
	}
	load( id ) {
		const html = this._html[ id ];

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
			setTimeout( this._hideMenu, 200 );
		}
		if ( !a.download || this._wavReady === 1 ) {
			return false;
		}
	}
}
