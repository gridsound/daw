"use strict";

ui.patterns = {
	init() {
		ui.patterns.audioBlocks = {};
		ui.idElements.patNew.onclick = gs.newPattern;
	},
	empty() {
		for ( var id in ui.patterns.audioBlocks ) {
			ui.patterns.remove( id );
		}
	},
	add( id, data ) {
		var pat = new gsuiAudioBlock();

		pat.data = data;
		pat.name( data.name );
		pat.datatype( "keys" );
		pat.ondrag = function() {};
		pat.rootElement.ondblclick = gs.openPattern.bind( null, id );
		ui.patterns.audioBlocks[ id ] = pat;
		ui.idElements.patterns.prepend( pat.rootElement );
	},
	remove( id ) {
		ui.patterns.audioBlocks[ id ].rootElement.remove();
		delete ui.patterns.audioBlocks[ id ];
	},
	select( id ) {
		var patSel = ui.patterns._selectedPattern,
			pat = ui.patterns.audioBlocks[ id ];

		if ( patSel ) {
			patSel.rootElement.classList.remove( "selected" );
		}
		ui.patterns._selectedPattern = pat;
		pat.rootElement.classList.add( "selected" );
	},
	name( id, n ) {
		ui.patterns.audioBlocks[ id ].name( n );
	},
	updateData( id, data ) {
		ui.patterns.audioBlocks[ id ].updateData( data );
	}
};
