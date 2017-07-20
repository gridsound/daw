"use strict";

ui.keys = {
	init() {
		var grid = new gsuiGridSamples();

		grid.loadKeys( 4, 3 );
		grid.offset( 0, 120 );
		grid.setFontSize( 20 );
		grid.onchange = ui._evocGrid;
		ui.keysGridSamples = grid;
		ui.idElements.keysGridWrap.append( grid.rootElement );
		grid.resized();
	},

	// private:
	_evocGrid( obj ) {
		console.log( "ui.keysGridSamples.onchange", obj );
	}
};
