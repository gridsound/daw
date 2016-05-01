"use strict";

(function() {

var jqFirstDiv,
	nb4emSave = 0;

function writeHtml( nb4em ) {
	var i, j, k,
		nb = nb4em - nb4emSave,
		html = "";

	nb4emSave = Math.max( nb4em, nb4emSave );
	for ( i = 0; i < nb; ++i ) {
		html += "<div>";
		for ( j = 0; j < 4; ++j ) {
			html += "<div>";
			for ( k = 0; k < 4; ++k ) {
				html += "<div></div>";
			}
			html += "</div>";
		}
		html += "</div>";
	}
	ui.jqTrackLinesBg.append( html );
	jqFirstDiv = jqFirstDiv || ui.jqTrackLinesBg.children().eq( 0 );
};

ui.updateTrackLinesBg = function() {
	writeHtml( Math.ceil( ui.trackLinesWidth / ui.gridEm / 4 ) + 2 );
	jqFirstDiv.css( "marginLeft", ( ui.trackLinesLeft / ui.gridEm % 8 ) + "em" );
};

})();
