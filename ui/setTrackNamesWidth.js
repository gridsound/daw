"use strict";

ui.trackNamesWidth = 0;

ui.setTrackNamesWidth = function( wpx ) {
	var visualWidth,
		oldWidth = ui.trackNamesWidth;

	ui.jqTrackNames.css( "width", wpx );
	ui.trackNamesWidth = wpx = ui.jqTrackNames.outerWidth();
	ui.trackLinesWidth = ui.gridColsWidth - wpx;
	visualWidth = ui.filesWidth + wpx;
	ui.jqGridColB.css( "left", wpx );
	ui.jqTimeline.css( "left", wpx );
	ui.jqVisual.css( "width", visualWidth );
	ui.jqMenu.css( "left", visualWidth );
	ui.jqVisualCanvas[ 0 ].width = visualWidth;
	if ( ui.trackLinesLeft < 0 ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft - ( wpx - oldWidth ) );
	}
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
