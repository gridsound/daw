"use strict";

ui.mainGrid = {
	init() {
		var grid = new gsuiGridSamples(),
			elGridCnt = grid.rootElement.querySelector( ".gsui-grid .gsui-content" );

		grid.loadTrackList();
		grid.offset( 0, 40 );
		grid.onchange = function( obj ) {
			// console.log( "grid.onchange", obj );
			gs.pushCompositionChange( obj );
		};
		grid.fnSampleCreate = function( id, uiBlock ) {
			ui.mainGrid.blocks[ id ] = uiBlock;
		};
		grid.fnSampleDelete = function( id, uiBlock ) {
			delete ui.mainGrid.blocks[ id ];
		};
		ui.idElements.mainGridWrap.append( grid.rootElement );
		ui.mainGridSamples = grid;
		ui.mainGrid.elGridCnt = elGridCnt;
		ui.mainGrid.blocks = {};
		elGridCnt.ondrop = ui.mainGrid._ondrop;
		elGridCnt.ondragenter = function( e ) {
			e.dataTransfer.dropEffect = "copy";
		};
		ui.mainGrid.uiBlocks = {};
		grid.resized();
	},
	empty() {
		// ui.mainGrid.uiBlocks = {};
	},
	change( data ) {
	},

	// events:
	_ondrop( e ) {
		var patId = e.dataTransfer.getData( "text" );

		console.log( "Drop in #mainGrid", patId );
		e.stopPropagation();
		return false;
	}
};
