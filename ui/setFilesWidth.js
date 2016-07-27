"use strict";

ui.setFilesWidth = function( wpx ) {
	wisdom.css( ui.elPanel, "width", wpx + "px" );
	ui.filesWidth = wpx = ui.elPanel.clientWidth;
	ui.gridColsWidth = ui.screenWidth - wpx;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	wisdom.css( ui.elGrid, "left", wpx + "px" );
	wisdom.css( ui.elVisual, "width", wpx + ui.trackNamesWidth + "px" );
	wisdom.css( ui.elMenu, "left", wpx + ui.trackNamesWidth + "px" );
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
