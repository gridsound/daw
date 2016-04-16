"use strict";

(function() {

var mouseIsDown = false;

ui.jqTrackLines.mousedown( function( e ) {
	if ( e.button === 0 && ui.currentTool === "hand" ) {
		mouseIsDown = true;
		ui.jqBody.addClass( "cursor-move" );
		ui.jqGridCols.add( ui.jqTrackLines ).addClass( "no-transition" );
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

ui.jqBody.on( {
	wheel: function( e ) {
		if ( e.ctrlKey ) {
			return false;
		}
	},
	mouseup: function( e ) {
		if ( e.button === 0 && mouseIsDown ) {
			mouseIsDown = false;
			ui.jqBody.removeClass( "cursor-move" );
			ui.jqGridCols.add( ui.jqTrackLines ).addClass( "no-transition" );
		}
	},
	mousemove: function( e ) {
		if ( mouseIsDown ) {
			e = e.originalEvent;
			ui.setTrackLinesLeft( ui.trackLinesLeft + e.movementX );
			ui.setGridTop( ui.gridTop + e.movementY );
			ui.updateTimeline();
			ui.updateGridBoxShadow();
		}
	}
});

})();
