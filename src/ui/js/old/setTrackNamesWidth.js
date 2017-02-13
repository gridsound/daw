"use strict";

ui.trackNamesWidth = 0;

ui.setTrackNamesWidth = function( wpx ) {
	var visualWidth,
		oldWidth = ui.trackNamesWidth;

	ui.dom.tracksNames.style.width = wpx + "px";
	ui.trackNamesWidth = wpx = ui.dom.tracksNames.getBoundingClientRect().width;
	ui.trackLinesWidth = ui.gridColsWidth - wpx;
	visualWidth = ui.filesWidth + wpx;
	ui.dom.gridColB.style.left =
	ui.dom.timeline.style.left = wpx + "px";
	ui.dom.visual.style.width =
	ui.dom.menu.style.left = visualWidth + "px";
	if ( ui.trackLinesLeft < 0 ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft - ( wpx - oldWidth ) );
	}
	ui.timelineUpdate();
	ui.tracksBgUpdate();
};
