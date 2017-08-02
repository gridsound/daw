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
	name( id, n ) {
		ui.patterns.audioBlocks[ id ].name( n );
	},
	updateData( id, data ) {
		ui.patterns.audioBlocks[ id ].updateData( data );
	}
};
