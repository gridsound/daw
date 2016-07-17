"use strict";

ui.resize = function() {
	ui.screenWidth = document.body.clientWidth;
	ui.screenHeight = document.body.clientHeight;
	ui.gridColsWidth = ui.elGridCols.getBoundingClientRect().width;
	ui.gridColsHeight = ui.elTrackList.clientHeight;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
