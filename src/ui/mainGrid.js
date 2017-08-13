"use strict";

ui.mainGrid = {
	init() {
		var grid = new gsuiGridSamples(),
			elGridCnt = grid.rootElement.querySelector( ".gsuigs-grid .gsuigs-content" );

		grid.loadTrackList();
		grid.offset( 0, 40 );
		grid.onchange = ui.mainGrid._onchangeGrid;
		grid.fnSampleCreate = function( id, uiBlock ) {
			var cmp = gs.currCmp,
				pat = cmp.patterns[ uiBlock.data.pattern ];

			ui.mainGrid.blocks[ id ] = uiBlock;
			uiBlock.name( pat.name );
			uiBlock.updateData( gs.keysToRects( cmp.keys[ pat.keys ] ) );
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
		ui.mainGridSamples.empty();
		ui.mainGrid.uiBlocks = {};
	},
	change( data ) {
		if ( data.tracks ) { ui.mainGridSamples.change( data ); }
		if ( data.blocks ) { ui.mainGridSamples.change( data.blocks ); }
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

	// events:
	_onchangeGrid( obj ) {
		gs.pushCompositionChange( { blocks: obj } );
	},
	_ondrop( e ) {
		var row = e.target,
			patId = e.dataTransfer.getData( "text" ),
			grid = ui.mainGridSamples,
			gridBCR = grid.rootElement.getBoundingClientRect(),
			pageX = e.pageX - gridBCR.left - grid._panelWidth;

		e.stopPropagation();
		while ( !row.classList.contains( "gsui-row" ) ) {
			row = row.parentNode;
		}
		gs.dropPattern(
			e.dataTransfer.getData( "text" ),
			row.dataset.track,
			grid.uiTimeLine._round( pageX / grid._pxPerBeat + grid._timeOffset ) );
		return false;
	}
};
