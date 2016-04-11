"use strict";

ui.jqBpmA.mousedown( function() {
	ui.jqBpmA.toggleClass( "clicked" );
	return false;
});

ui.jqBpmList.children().mousedown( function() {
	ui.setBPM( +this.textContent );
});

ui.jqBody.mousedown( function() {
	ui.jqBpmA.removeClass( "clicked" );
});

ui.jqBpmInt.on( "wheel", function( e ) {
	e = e.originalEvent.deltaY;
	ui.setBPM( ui.BPM + ( e > 0 ? -1 : e ? 1 : 0 ) );
});

ui.jqBpmDec.on( "wheel", function( e ) {
	e = e.originalEvent.deltaY;
	ui.setBPM( ui.BPM + ( e > 0 ? -.01 : e ? .01 : 0 ) );
});
