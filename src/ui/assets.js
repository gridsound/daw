"use strict";

ui.assets = {
	init() {
		ui.assets.audioBlocks = {};
	},
	empty() {
		for ( var id in ui.assets.audioBlocks ) {
			ui.assets.remove( id );
		}
	},
	add( id, audioBlock ) {
		ui.assets.audioBlocks[ id ] = audioBlock;
		ui.idElements.assets.append( audioBlock.rootElement );
	},
	remove( assetId ) {
		ui.assets.audioBlocks[ assetId ].rootElement.remove();
		delete ui.assets.audioBlocks[ assetId ];
	},
	name( id, n ) {
		ui.assets.audioBlocks[ id ].name( n );
	},
	updateData( id, data ) {
		ui.assets.audioBlocks[ id ].updateData( data );
	}
};
