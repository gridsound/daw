"use strict";

( function() {

ui.elBpmInt.onwheel = wheel.bind( null, 1 );
ui.elBpmDec.onwheel = wheel.bind( null, .01 );

ui.elBpmA.onmousedown = function( e ) {
	ui.elBpmA.classList.toggle( "clicked" );
	e.stopPropagation();
};

ui.elBpmList.onmousedown = function( e ) {
	var bpm = +e.target.textContent;
	if ( bpm ) {
		gs.bpm( bpm );
	}
};

document.body.addEventListener( "mousedown", function() {
	ui.elBpmA.classList.remove( "clicked" );
} );

function wheel( inc, e ) {
	e = e.deltaY;
	gs.bpm( gs._bpm + ( e > 0 ? -inc : e ? inc : 0 ) );
}

} )();
