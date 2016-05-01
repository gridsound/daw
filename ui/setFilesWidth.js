"use strict";

ui.setFilesWidth = function( wpx ) {
	ui.jqFiles.css( "width", wpx );
	ui.filesWidth = wpx = ui.jqFiles.outerWidth();
	ui.gridColsWidth = ui.screenWidth - wpx;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.jqGrid.css( "left", wpx );
	ui.jqVisual.css( "width", wpx + ui.trackNamesWidth );
	ui.jqMenu.css( "left", wpx + ui.trackNamesWidth );
	ui.jqVisualCanvas[ 0 ].width = ui.jqVisualCanvas.width();
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
