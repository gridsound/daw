"use strict";

ui.gridColsWidth = 0;
ui.gridColsHeight = 0;

ui.resize = function() {
	ui.gridColsWidth = ui.jqGridCols.width();
	ui.gridColsHeight = ui.jqTrackList.height();
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.updateTimeline();
};
