"use strict";

(function() {

var
	spaceIsDown = false,
	mouseIsDown = false
;

ui.jqTrackLines.mousedown( function( e ) {
	if ( e.button === 0 && spaceIsDown ) {
		if ( !mouseIsDown ) {
			mouseIsDown = true;
			ui.jqBody.addClass( "cursor-move" );
			ui.jqGridCols.add( ui.jqTrackLines ).addClass( "no-transition" );
		}
	}
});

ui.jqGrid.on( "wheel", function( e ) {
	e = e.originalEvent;
	if ( spaceIsDown || e.ctrlKey ) {
		ui.setGridZoom(
			ui.gridZoom * ( e.deltaY < 0 ? 1.1 : 0.9 ),
			e.pageX - ui.filesWidth - ui.trackNamesWidth,
			e.pageY - ui.gridColsY
		);
	} else {
		ui.setGridTop( ui.gridTop + ( e.deltaY < 0 ? .9 : -.9 ) * ui.em );
	}
	ui.updateGridBoxShadow();
});

ui.jqBody.on( {
	wheel: function( e ) {
		if ( e.ctrlKey ) {
			return false;
		}
	},
	keydown: function( e ) {
		if ( e.keyCode === 32 ) {
			spaceIsDown = true;
			ui.jqTrackLines.addClass( "cursor-move" );
		}
	},
	keyup: function( e ) {
		if ( e.keyCode === 32 ) {
			spaceIsDown = false;
			if ( !mouseIsDown ) {
				ui.jqTrackLines.removeClass( "cursor-move" );
			}
		}
	},
	mouseup: function( e ) {
		if ( e.button === 0 && mouseIsDown ) {
			mouseIsDown = false;
			if ( !spaceIsDown ) {
				ui.jqTrackLines.removeClass( "cursor-move" );
			}
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
