"use strict";

ui.initElement( "timeline", function() {
	var firstClick;

	return {
		mousedown: function( e ) {
			var now = Date.now();

			if ( now - firstClick < 250 ) {
				gs.loop.stop();
				gs.loop.timeA( ui.getGridSec( e.pageX ) );
				ui.timelineLoop.clickTime( "b" );
			}
			firstClick = now;
		},
		mouseup: function( e ) {
			if ( !ui.timelineLoop.dragging ) {
				gs.currentTime( ui.getGridSec( e.pageX ) );
			}
		},
		update: function() {
			var leftEm = ui.trackLinesLeft / ui.gridEm,
				widthEm = ui.trackLinesWidth / ui.gridEm;

			ui.timelineBeats.fill( Math.ceil( -leftEm + widthEm ) );
			ui.dom.timelineBeats   .style.marginLeft = leftEm += "em";
			ui.dom.currentTimeArrow.style.marginLeft = leftEm;
			ui.dom.timelineLoop    .style.marginLeft = leftEm;
		}
	};
} );
