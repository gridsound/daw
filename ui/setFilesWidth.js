"use strict";

ui.setFilesWidth = function( wpx ) {
	ui.css( ui.elFiles, "width", wpx + "px" );
	ui.filesWidth = wpx = ui.elFiles.clientWidth;
	ui.gridColsWidth = ui.screenWidth - wpx;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.css( ui.elGrid, "left", wpx + "px" );
	ui.css( ui.elVisual, "width", wpx + ui.trackNamesWidth + "px" );
	ui.css( ui.elMenu, "left", wpx + ui.trackNamesWidth + "px" );
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
