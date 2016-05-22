"use strict";

( function() {

var nbNums = 0,
	jqContent = $( ui.jqTimeArrow );

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
		if ( jqContent.length < 2 ) {
			jqContent = jqContent.add( jqNums.eq( 0 ) );
		}
	}
}

ui.updateTimeline = function() {
	var leftEm = ui.trackLinesLeft / ui.gridEm,
		widthEm = ui.trackLinesWidth / ui.gridEm;

	createNb( Math.ceil( -leftEm + widthEm ) );
	jqContent.css( "marginLeft", leftEm + "em" );
};

} )();
