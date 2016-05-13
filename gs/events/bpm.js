"use strict";

( function() {

ui.jqBpmA.mousedown( function() {
	ui.jqBpmA.toggleClass( "clicked" );
	return false;
});

ui.jqBpmList.children().mousedown( function() {
	gs.bpm( +this.textContent );
});

ui.jqBody.mousedown( function() {
	ui.jqBpmA.removeClass( "clicked" );
});

function wheel( inc, e ) {
	e = e.originalEvent.deltaY;
	gs.bpm( gs._bpm + ( e > 0 ? -inc : e ? inc : 0 ) );
}

ui.jqBpmInt.on( "wheel", wheel.bind( null, 1 ) );
ui.jqBpmDec.on( "wheel", wheel.bind( null, .01 ) );

} )();
