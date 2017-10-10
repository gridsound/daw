"use strict";

ui.mainGrid = {
	init() {
		var grid = new gsuiGridSamples(),
			elGridCnt = grid.rootElement.querySelector( ".gsuigs-grid .gsuigs-content" );

		ui.mainGridSamples = grid;
		ui.mainGrid.elGridCnt = elGridCnt;
		ui.mainGrid.blocks = {};
		grid.loadTrackList();
		grid.offset( 0, 40 );
		grid.onchange = ui.mainGrid._onchangeGrid;
		grid.onchangeCurrentTime = gs.controls.currentTime.bind( null, "main" );
		grid.fnSampleCreate = function( id, uiBlock ) {
			var cmp = gs.currCmp,
				pat = cmp.patterns[ uiBlock.data.pattern ];

			ui.mainGrid.blocks[ id ] = uiBlock;
			uiBlock.name( pat.name );
			uiBlock.updateData( ui.keysToRects( cmp.keys[ pat.keys ] ) );
			uiBlock.rootElement.ondblclick = ui.patterns.open.bind( null, uiBlock.data.pattern );
		};
		grid.fnSampleUpdate = function( id, uiBlock ) {
			var cmp = gs.currCmp,
				blc = cmp.blocks[ id ],
				keys = cmp.keys[ cmp.patterns[ blc.pattern ].keys ];

			uiBlock.updateData( ui.keysToRects( keys ), blc.offset, blc.duration );
		};
		grid.fnSampleDelete = function( id, uiBlock ) {
			delete ui.mainGrid.blocks[ id ];
		};
		dom.mainGridWrap.append( grid.rootElement );
		elGridCnt.ondrop = ui.mainGrid._ondrop;
		elGridCnt.ondragenter = function( e ) {
			e.dataTransfer.dropEffect = "copy";
		};
		grid.resized();
	},
	empty() {
		ui.mainGridSamples.empty();
		ui.mainGrid.blocks = {};
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
		if ( !obj.tracks ) {
			obj = { blocks: obj };
		}
		gs.pushCompositionChange( obj );
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
