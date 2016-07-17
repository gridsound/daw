"use strict";

ui.trackNamesWidth = 0;

ui.setTrackNamesWidth = function( wpx ) {
	var visualWidth,
		oldWidth = ui.trackNamesWidth;

	ui.css( ui.elTrackNames, "width", wpx + "px" );
	ui.trackNamesWidth = wpx = ui.elTrackNames.getBoundingClientRect().width;
	ui.trackLinesWidth = ui.gridColsWidth - wpx;
	visualWidth = ui.filesWidth + wpx;
	ui.css( ui.elGridColB, "left", wpx + "px" );
	ui.css( ui.elTimeline, "left", wpx + "px" );
	ui.css( ui.elVisual, "width", visualWidth + "px" );
	ui.css( ui.elMenu, "left", visualWidth + "px" );
	if ( ui.trackLinesLeft < 0 ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft - ( wpx - oldWidth ) );
	}
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
