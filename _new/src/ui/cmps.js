"use strict";

ui.cmps = {
	push( id ) {
		var root = document.createElement( "div" ),
			save = document.createElement( "div" ),
			info = document.createElement( "div" ),
			name = document.createElement( "div" ),
			bpm = document.createElement( "span" ),
			duration = document.createElement( "span" );

		root.className = "cmp";
		save.className = "save";
		info.className = "info";
		name.className = "name";
		bpm.className = "bpm";
		duration.className = "duration";
		info.append( name, bpm, duration );
		root.append( save, info );
		save.onclick = gs.saveCurrentComposition;
		info.onclick = gs.loadComposition.bind( null, id );
		ui.cmps._html[ id ] = { root, name, bpm, duration };
		ui.idElements.cmps.append( root );
	},
	remove( id ) {
		ui.cmps._html[ id ].root.remove();
		delete ui.cmps._html[ id ];
	},
	update( id, dat ) {
		var html = ui.cmps._html[ id ],
			dur = common.timestampText( dat.duration );

		html.name.textContent = dat.name;
		html.bpm.textContent = dat.bpm;
		html.duration.textContent = dur.a + ":" + dur.b;
	},
	load( id ) {
		var html = ui.cmps._html[ id ];

		ui.cmps._loadOne = html;
		html.root.classList.add( "loaded" );
		ui.idElements.cmps.prepend( html.root );
	},
	saved( saved ) {
		ui.cmps._loadOne.root.classList.toggle( "notSaved", !saved );
	},
	unload() {
		ui.cmps._loadOne.root.classList.remove( "loaded" );
		delete ui.cmps._loadOne;
	},

	// private:
	_html: {}
};
