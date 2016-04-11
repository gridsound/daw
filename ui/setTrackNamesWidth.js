"use strict";

ui.trackNamesWidth = 0;

ui.setTrackNamesWidth = function( wpx ) {
	var oldWidth = ui.trackNamesWidth;
	ui.jqTrackNames.css( "width", wpx );
	ui.trackNamesWidth = wpx = ui.jqTrackNames.outerWidth();
	ui.trackLinesWidth = ui.gridColsWidth - wpx;
	ui.jqGridColB.css( "left", wpx );
	ui.jqTimeline.css( "left", wpx );
	ui.jqVisual.css( "width", ui.filesWidth + wpx );
	ui.jqMenu.css( "left", ui.filesWidth + wpx );
	if ( ui.trackLinesLeft < 0 ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft - ( wpx - oldWidth ) );
	}
	ui.updateTimeline();
};
