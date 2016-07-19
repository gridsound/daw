"use strict";

ui.trackNamesWidth = 0;

ui.setTrackNamesWidth = function( wpx ) {
	var visualWidth,
		oldWidth = ui.trackNamesWidth;

	wisdom.css( ui.elTrackNames, "width", wpx + "px" );
	ui.trackNamesWidth = wpx = ui.elTrackNames.getBoundingClientRect().width;
	ui.trackLinesWidth = ui.gridColsWidth - wpx;
	visualWidth = ui.filesWidth + wpx;
	wisdom.css( ui.elGridColB, "left", wpx + "px" );
	wisdom.css( ui.elTimeline, "left", wpx + "px" );
	wisdom.css( ui.elVisual, "width", visualWidth + "px" );
	wisdom.css( ui.elMenu, "left", visualWidth + "px" );
	if ( ui.trackLinesLeft < 0 ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft - ( wpx - oldWidth ) );
	}
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
