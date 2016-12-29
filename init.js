"use strict";

( function() {

ui.resize();
ui.setFilesWidth( 200 );
ui.setTrackLinesLeft( 0 );
ui.setTrackNamesWidth( 125 );
ui.setGridZoom( 1.5, 0 );
ui.visualCanvas.on();
ui.btnMagnet.toggle( true );
ui.tracksBg.update();
ui.timelineLoop.toggle( false );

gs.history.reset();
gs.bpm( 120 );
gs.currentTime( 0 );
gs.compositions.init();
wa.composition.onended( gs.compositionStop );
ui.dom.btnFiles.click();
ui.dom.clockUnits.querySelector( ".s" ).click();
ui.dom.menu.querySelector( "[data-tool='paint']" ).click();

for ( var i = 0; i < 42; ++i ) {
	ui.newTrack();
}

ui.trackHeight = ui.tracks[ 0 ].elColNamesTrack.offsetHeight;

} )();
