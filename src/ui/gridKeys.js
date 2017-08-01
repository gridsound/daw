"use strict";

ui.gridKeys = {
	init() {
		var grid = new gsuiGridSamples();

		grid.loadKeys( 4, 3 );
		grid.offset( 0, 120 );
		grid.setFontSize( 20 );
		ui.idElements.keysGridWrap.append( grid.rootElement );
		ui.idElements.keysName.ondblclick = ui.gridKeys._evocKeysName;
		ui.idElements.keysListBtn.onclick = ui.gridKeys._evocKeysListBtn;
		grid.onchange = ui.gridKeys._evocGrid;
		grid.resized();
		ui.keysGridSamples = grid;
	},
	empty() {
		ui.keysGridSamples.empty();
		ui.gridKeys.updateName( "" );
	},
	updateName( name ) {
		ui.idElements.keysName.textContent = name;
	},
	load( keys ) {
		ui.keysGridSamples.change( keys );
	},
	toggleList( b ) {
		ui.idElements.keysListBtn.classList.toggle( "close", !b );
	},

	// private:
	_evocGrid( obj ) {
		gs.pushCompositionChange( { keys: {
			[ gs.currCmp.assets[ gs.currCmp.patternOpened ].keys ]: obj
		} } );
	},
	_evocKeysName() {
		var assetId = gs.currCmp.patternOpened,
			asset = gs.currCmp.assets[ assetId ],
			name = ( prompt( "Name asset :", asset.name ) || "" ).trim();

		if ( name !== asset.name ) {
			gs.pushCompositionChange( {
				assets: { [ assetId ]: { name: name } } } );
		}
	},
	_evocKeysListBtn( e ) {
		ui.gridKeys.toggleList( true );
		e.stopPropagation();
	}
};
