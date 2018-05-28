"use strict";

ui.mainGrid = {
	init() {
		const grid = new gsuiPatternroll(),
			elGridCnt = grid.rootElement.querySelector( ".gsuiBlocksManager-rows" );

		ui.mainGridSamples = grid;
		ui.mainGrid.blocks = {};
		grid.setFontSize( 32 );
		grid.setPxPerBeat( 40 );
		grid.onchange = ui.mainGrid._onchangeGrid;
		grid.onchangeCurrentTime = gs.controls.currentTime.bind( null, "main" );
		grid.onchangeLoop = gs.controls.loop.bind( null, "main" );
		grid.rootElement.onfocus = gs.controls.askFocusOn.bind( null, "main" );
		grid.fnSampleCreate = ( id, uiBlock ) => {
			const cmp = gs.currCmp,
				pat = cmp.patterns[ uiBlock.data.pattern ];

			ui.mainGrid.blocks[ id ] = uiBlock;
			uiBlock.name( pat.name );
			uiBlock.updateData( ui.keysToRects( cmp.keys[ pat.keys ] ) );
			uiBlock.rootElement.ondblclick = gs.openPattern.bind( null, uiBlock.data.pattern );
		};
		grid.fnSampleUpdate = ( id, uiBlock ) => {
			const cmp = gs.currCmp,
				blc = cmp.blocks[ id ],
				keys = cmp.keys[ cmp.patterns[ blc.pattern ].keys ];

			uiBlock.updateData( ui.keysToRects( keys ), blc.offset, blc.duration );
		};
		grid.fnSampleDelete = ( id, uiBlock ) => {
			delete ui.mainGrid.blocks[ id ];
		};
		dom.mainGridWrap.append( grid.rootElement );
		// elGridCnt.ondrop = ui.mainGrid._ondrop;
		// elGridCnt.ondragenter = e => e.dataTransfer.dropEffect = "copy";
		grid.attached();
	},
	empty() {
		// ui.mainGridSamples.offset( 0, 40 );
		// ui.mainGridSamples.contentY( 0 );
		ui.mainGridSamples.setFontSize( 32 );
		ui.mainGridSamples.setPxPerBeat( 40 );
		ui.mainGridSamples.empty();
		ui.mainGrid.blocks = {};
	},
	getPatternBlocks( patId ) {
		return Object.values( ui.mainGrid.blocks )
			.reduce( ( res, blc ) => {
				if ( blc.data.pattern === patId ) {
					res.push( blc );
				}
				return res;
			}, [] );
	},

	// events:
	_onchangeGrid( obj ) {
		gs.undoredo.change( obj.tracks ? obj : { blocks: obj } );
	},
	_ondrop( e ) {
		const grid = ui.mainGridSamples,
			patId = e.dataTransfer.getData( "text" ),
			gridBCR = grid.rootElement.getBoundingClientRect(),
			pageX = e.pageX - gridBCR.left - grid._panelWidth;

		if ( patId ) {
			let row = e.target;

			e.stopPropagation();
			while ( !row.classList.contains( "gsui-row" ) ) {
				row = row.parentNode;
			}
			gs.dropPattern(
				patId,
				row.dataset.track,
				grid.uiTimeline.beatFloor( pageX / grid._pxPerBeat + grid._timeOffset ) );
			return false;
		}
	}
};
