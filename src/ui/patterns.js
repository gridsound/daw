"use strict";

ui.patterns = {
	init() {
		ui.patterns.audioBlocks = {};
	},
	empty() {
		for ( var id in ui.patterns.audioBlocks ) {
			ui.patterns.remove( id );
		}
	},
	add( id, audioBlock ) {
		ui.patterns.audioBlocks[ id ] = audioBlock;
		ui.idElements.patterns.append( audioBlock.rootElement );
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
