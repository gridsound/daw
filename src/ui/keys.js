"use strict";

ui.keys = {
	init() {
		var grid = new gsuiGridSamples();

		grid.loadKeys( 4, 3 );
		grid.offset( 0, 120 );
		grid.setFontSize( 20 );
		grid.onchange = ui.keys._evocGrid;
		ui.keysGridSamples = grid;
		ui.idElements.keysGridWrap.append( grid.rootElement );
		grid.resized();

		ui.idElements.keysListBtn.onclick = ui.keys._evocKeysListBtn;
	},
	toggleList( b ) {
		ui.idElements.keysListBtn.classList.toggle( "close", !b );
	},

	// private:
	_evocGrid( obj ) {
		console.log( "ui.keysGridSamples.onchange", obj );
	},
	_evocKeysListBtn( e ) {
		ui.keys.toggleList( true );
		e.stopPropagation();
	}
};
