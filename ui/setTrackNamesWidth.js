"use strict";

ui.trackNamesWidth = 0;

ui.setTrackNamesWidth = function( wpx ) {
	var visualWidth,
		oldWidth = ui.trackNamesWidth;

	wisdom.css( ui.dom.tracksNames, "width", wpx + "px" );
	ui.trackNamesWidth = wpx = ui.dom.tracksNames.getBoundingClientRect().width;
	ui.trackLinesWidth = ui.gridColsWidth - wpx;
	visualWidth = ui.filesWidth + wpx;
	wisdom.css( ui.dom.gridColB, "left", wpx + "px" );
	wisdom.css( ui.dom.gridTimeline, "left", wpx + "px" );
	wisdom.css( ui.dom.visual, "width", visualWidth + "px" );
	wisdom.css( ui.dom.menu, "left", visualWidth + "px" );
	if ( ui.trackLinesLeft < 0 ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft - ( wpx - oldWidth ) );
	}
	ui.updateGridTimeline();
	ui.updateTracksBg();
};
