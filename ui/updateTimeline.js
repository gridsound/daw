"use strict";

( function() {

var elFirstNum,
	nbNums = 0;

function createNb( nb ) {
	if ( nb > nbNums ) {
		var html = "",
			i = nbNums,
			jqNums;

		nbNums = nb;
		while ( i++ < nb ) {
			html += "<div><span></span></div>";
		}
		jqNums = $( html );
		ui.jqTimeline.append( jqNums );
		if ( !elFirstNum ) {
			elFirstNum = jqNums[ 0 ];
		}
	}
}

ui.updateTimeline = function() {
	var leftEm = ui.trackLinesLeft / ui.gridEm,
		widthEm = ui.trackLinesWidth / ui.gridEm;

	createNb( Math.ceil( -leftEm + widthEm ) );
	ui.css( elFirstNum, "marginLeft", leftEm + "em" );
	ui.css( ui.jqTimeArrow[ 0 ], "marginLeft", leftEm + "em" );
};

} )();
