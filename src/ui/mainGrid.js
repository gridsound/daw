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
	getPatternBlocks( patId ) {
		var id, res = [], blocks = ui.mainGrid.blocks;

		for ( id in blocks ) {
			if ( blocks[ id ].data.pattern === patId ) {
				res.push( blocks[ id ] );
			}
		}
		return res;
	},
	updatePatternName( id, name ) {
		ui.mainGrid.getPatternBlocks( id ).forEach( function( uiBlock ) {
			uiBlock.name( name );
		} );
	},

	// events:
	_ondrop( e ) {
		var row = e.target,
			patId = e.dataTransfer.getData( "text" ),
			grid = ui.mainGridSamples,
			gridBCR = grid.rootElement.getBoundingClientRect();

		e.stopPropagation();
		while ( !row.classList.contains( "gsui-row" ) ) {
			row = row.parentNode;
		}
		gs.dropPattern(
			e.dataTransfer.getData( "text" ),
			row.dataset.track,
			( e.pageX - gridBCR.left - grid._panelWidth ) / grid._pxPerBeat + grid._timeOffset );
		return false;
	}
};
