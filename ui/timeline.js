"use strict";

ui.initElement( "timeline", function() {
	return {
		mouseup: function( e ) {
			gs.currentTime( ui.getGridSec( e.pageX ) );
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
