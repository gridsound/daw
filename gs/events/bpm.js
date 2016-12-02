"use strict";

( function() {

ui.dom.bpmInt.onwheel = wheel.bind( null, 1 );
ui.dom.bpmDec.onwheel = wheel.bind( null, .01 );

ui.dom.bpm.onmousedown = function( e ) {
	ui.dom.bpm.classList.toggle( "clicked" );
	e.stopPropagation();
};

ui.dom.bpmList.onmousedown = function( e ) {
	var bpm = +e.target.textContent;

	if ( bpm ) {
		gs.bpm( bpm );
	}
	return false;
};

function wheel( inc, e ) {
	e = e.deltaY;
	ui.bpm( ui._bpm + ( e > 0 ? -inc : e ? inc : 0 ) );
	clearTimeout( bpmTimeout );
	bpmTimeout = setTimeout( gs.bpm.bind( null, ui._bpm ), 400 );
}

var bpmTimeout;

} )();
