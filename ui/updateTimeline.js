"use strict";

( function() {

var elFirstNum,
	nbNums = 0;

function createNb( nb ) {
	if ( nb > nbNums ) {
		var div, i = nbNums;
		nbNums = nb;
		while ( i++ < nb ) {
			div = document.createElement( "div" );
			div.appendChild( document.createElement( "span" ) );
			ui.elTimeline.appendChild( div );
			elFirstNum = elFirstNum || div;
		}
	}
}

ui.updateTimeline = function() {
	var leftEm = ui.trackLinesLeft / ui.gridEm,
		widthEm = ui.trackLinesWidth / ui.gridEm;

	createNb( Math.ceil( -leftEm + widthEm ) );
	wisdom.css( elFirstNum, "marginLeft", leftEm + "em" );
	wisdom.css( ui.elTimeArrow, "marginLeft", leftEm + "em" );
};

} )();
