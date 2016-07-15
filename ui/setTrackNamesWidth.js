"use strict";

ui.trackNamesWidth = 0;

ui.setTrackNamesWidth = function( wpx ) {
	var visualWidth,
		oldWidth = ui.trackNamesWidth;

	ui.css( ui.jqTrackNames[ 0 ], "width", wpx + "px" );
	ui.trackNamesWidth = wpx = ui.jqTrackNames.outerWidth();
	ui.trackLinesWidth = ui.gridColsWidth - wpx;
	visualWidth = ui.filesWidth + wpx;
	ui.css( ui.jqGridColB[ 0 ], "left", wpx + "px" );
	ui.css( ui.jqTimeline[ 0 ], "left", wpx + "px" );
	ui.css( ui.jqVisual[ 0 ], "width", visualWidth + "px" );
	ui.css( ui.jqMenu[ 0 ], "left", visualWidth + "px" );
	if ( ui.trackLinesLeft < 0 ) {
		ui.setTrackLinesLeft( ui.trackLinesLeft - ( wpx - oldWidth ) );
	}
	ui.updateTimeline();
	ui.updateTrackLinesBg();
};
