"use strict";

ui.cmps = {
	init() {
		dom.cmpMenu.onclick = ui.cmps._clickMenu;
	},
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
		menu.onclick = ui.cmps._showMenu.bind( null, id );
		ui.cmps._html[ id ] = { root, name, bpm, duration };
		dom.cmps.append( root );
	},
	remove( id ) {
		ui.cmps._html[ id ].root.remove();
		delete ui.cmps._html[ id ];
	},
	update( id, cmp ) {
		var html = ui.cmps._html[ id ];

		html.name.textContent = cmp.name;
		ui.controls.title( cmp.name );
		html.bpm.textContent = cmp.bpm;
		html.duration.textContent = common.time.beatToMin( cmp.duration, cmp.bpm ) +
			":" + common.time.beatToSec( cmp.duration, cmp.bpm );
	},
	load( id ) {
		var html = ui.cmps._html[ id ];

		ui.cmps._loadOne = html;
		html.root.classList.add( "loaded" );
		ui.controls.title( gs.currCmp.name );
		dom.cmps.prepend( html.root );
	},
	saved( saved ) {
		ui.controls.title( gs.currCmp.name );
		ui.cmps._loadOne.root.classList.toggle( "notSaved", !saved );
	},
	unload() {
		ui.cmps._loadOne.root.classList.remove( "loaded" );
		delete ui.cmps._loadOne;
	},

	// private:
	_html: {},
	_showMenu( id, e ) {
		var gBCR = e.target.parentNode.getBoundingClientRect();

		ui.cmps._cmpId = id;
		dom.cmpMenu.style.top = gBCR.top + ( gBCR.bottom - gBCR.top ) / 2 + "px";
		dom.cmpMenu.classList.remove( "hidden" );
		e.stopPropagation();
	},
	_hideMenu() {
		delete ui.cmps._cmpId;
		dom.cmpMenu.classList.add( "hidden" );
	},
	_clickMenu( e ) {
		gs[ e.target.id ]( ui.cmps._cmpId );
		ui.cmps._hideMenu();
		e.stopPropagation();
	}
};
