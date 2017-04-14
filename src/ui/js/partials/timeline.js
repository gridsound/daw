"use strict";

ui.timeline = {
	init: function() {
		ui.dom.timeline.onmousedown = ui.timeline._mousedown;
		ui.dom.timeline.onmouseup = ui.timeline._mouseup;
	},
	update: function() {
		var leftEm = ui.trackLinesLeft / ui.gridEm,
			widthEm = ui.trackLinesWidth / ui.gridEm;

		ui.timelineBeats.fill( Math.ceil( -leftEm + widthEm ) );
		ui.dom.timelineBeats   .style.marginLeft = leftEm += "em";
		ui.dom.currentTimeArrow.style.marginLeft = leftEm;
		ui.dom.timelineLoop    .style.marginLeft = leftEm;
	},
	currentTime: function( sec ) {
		var visible = sec > 0,
			arrow = ui.dom.currentTimeArrow,
			cursor = ui.dom.currentTimeCursor;

		if ( visible ) {
			cursor.style.left =
			arrow.style.left = sec * ui.BPMem + "em";
		}
		cursor.classList.toggle( "visible", visible );
		arrow.classList.toggle( "visible", visible );
		ui.clock.currentTime( sec );
	},

	// private:
	_mousedown: function( e ) {
		var now = Date.now();

		if ( now - ui.timeline.firstClick < 250 ) {
			// gs.loop.stop();
			// gs.loop.timeA( ui.grid.getWhen( e.pageX ) );
			ui.timelineLoop.clickTime( "b" );
		}
		ui.timeline.firstClick = now;
	},
	_mouseup: function( e ) {
		if ( !ui.timelineLoop.dragging ) {
			waFwk.currentTime( ui.grid.getWhen( e.pageX ) );
		}
	}
};
