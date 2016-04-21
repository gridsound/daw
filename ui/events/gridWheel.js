"use strict";

ui.jqBody.on( "wheel", function( e ) {
	if ( e.ctrlKey ) {
		return false;
	}
});

ui.jqGrid.on( "wheel", function( e ) {
	e = e.originalEvent;
	if ( ui.currentTool !== "hand" ) {
		// Vertical scroll:
		ui.setGridTop( ui.gridTop + ( e.deltaY < 0 ? .9 : -.9 ) * ui.gridEm );
	} else {
		// Zoom:
		ui.setGridZoom(
			ui.gridZoom * ( e.deltaY < 0 ? 1.1 : 0.9 ),
			e.pageX - ui.filesWidth - ui.trackNamesWidth,
			e.pageY - ui.gridColsY
		);
	}
	ui.updateGridBoxShadow();
});
