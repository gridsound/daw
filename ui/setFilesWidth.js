"use strict";

ui.setFilesWidth = function( wpx ) {
	wisdom.css( ui.dom.panel, "width", wpx + "px" );
	ui.filesWidth = wpx = ui.dom.panel.clientWidth;
	ui.gridColsWidth = ui.screenWidth - wpx;
	ui.trackLinesWidth = ui.gridColsWidth - ui.trackNamesWidth;
	wisdom.css( ui.dom.grid, "left", wpx + "px" );
	wisdom.css( ui.dom.visual, "width", wpx + ui.trackNamesWidth + "px" );
	wisdom.css( ui.dom.menu, "left", wpx + ui.trackNamesWidth + "px" );
	ui.timeline.update();
	ui.tracksBg.update();
};
