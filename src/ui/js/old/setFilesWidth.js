"use strict";

ui.setFilesWidth = function( wpx ) {
	ui.dom.panel.style.width = wpx + "px";
	ui.filesWidth = wpx = ui.dom.panel.clientWidth;
	ui.gridColsWidth = ui.screenWidth - wpx;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	ui.dom.grid.style.left = wpx + "px";
	ui.dom.visual.style.width =
	ui.dom.menu.style.left = wpx + ui.trackNamesWidth + "px";
	ui.timeline.update();
	ui.tracksBg.update();
};
