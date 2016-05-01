"use strict";

ui.resize = function() {
	ui.screenWidth = ui.jqWindow.width();
	ui.screenHeight = ui.jqWindow.height();
	ui.gridColsWidth = ui.jqGridCols.width();
	ui.gridColsHeight = ui.jqTrackList.height();
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
