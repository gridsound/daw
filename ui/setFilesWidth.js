"use strict";

ui.setFilesWidth = function( wpx ) {
	ui.css( ui.jqFiles[ 0 ], "width", wpx + "px" );
	ui.filesWidth = wpx = ui.jqFiles.outerWidth();
	ui.gridColsWidth = ui.screenWidth - wpx;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.css( ui.jqGrid[ 0 ], "left", wpx + "px" );
	ui.css( ui.jqVisual[ 0 ], "width", wpx + ui.trackNamesWidth + "px" );
	ui.css( ui.jqMenu[ 0 ], "left", wpx + ui.trackNamesWidth + "px" );
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
