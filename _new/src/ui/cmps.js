"use strict";

ui.cmps = {
	push( id ) {
		var root = document.createElement( "div" ),
			html = { root: root };

		root.className = "cmp";
		( html.name = document.createElement( "div" ) ).className = "name";
		( html.bpm = document.createElement( "span" ) ).className = "bpm";
		( html.duration = document.createElement( "span" ) ).className = "duration";
		root.append( html.name );
		root.append( html.bpm );
		root.append( html.duration );
		root.onclick = gs.loadComposition.bind( null, id );
		ui.cmps._html[ id ] = html;
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
