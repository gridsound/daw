"use strict";

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

ui.jqBpmInt.on( "wheel", function( e ) {
	e = e.originalEvent.deltaY;
	gs.bpm( gs._bpm + ( e > 0 ? -1 : e ? 1 : 0 ) );
});

ui.jqBpmDec.on( "wheel", function( e ) {
	e = e.originalEvent.deltaY;
	gs.bpm( gs._bpm + ( e > 0 ? -.01 : e ? .01 : 0 ) );
});
