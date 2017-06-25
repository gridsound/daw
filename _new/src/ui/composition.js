"use strict";

ui.cmpPreload = function( cmp ) {
	var root = document.createElement( "div" ),
		html = { root: root };

	cmp._html = html;
	root.className = "cmp";
	( html.name = document.createElement( "div" ) ).className = "name";
	( html.bpm = document.createElement( "span" ) ).className = "bpm";
	( html.duration = document.createElement( "span" ) ).className = "duration";
	root.append( html.name );
	root.append( html.bpm );
	root.append( html.duration );
	root.onclick = gs.loadComposition.bind( null, cmp );
	ui.cmpName( cmp, cmp.name );
	ui.cmpBPM( cmp, cmp.bpm );
	ui.cmpDuration( cmp, cmp.duration );
	ui.idElements.cmps.append( root );
};

ui.cmpLoad = function( cmp ) {
	cmp._html.root.classList.add( "loaded" );
	ui.idElements.cmps.prepend( cmp._html.root );
	// ...
};

ui.cmpUnload = function( cmp ) {
	// ...
	cmp._html.root.classList.remove( "loaded" );
};

ui.cmpName = function( cmp, n ) {
	cmp._html.name.textContent = n;
};

ui.cmpBPM = function( cmp, bpm ) {
	cmp._html.bpm.textContent = bpm;
};

ui.cmpDuration = function( cmp, dur ) {
	var time = common.timestampText( dur );

	cmp._html.duration.textContent = time.a + ":" + time.b;
};
