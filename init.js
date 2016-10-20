"use strict";

( function() {

ui.resize();
ui.setFilesWidth( 200 );
ui.setTrackLinesLeft( 0 );
ui.setTrackNamesWidth( 125 );
ui.setGridZoom( 1.5, 0, 0 );
ui.visualCanvas.on();
ui.btnMagnet.toggle( true );
ui.tracksBg.update();
ui.historyList.reset();
ui.timelineLoop.toggle( false );

gs.bpm( 120 );
gs.currentTime( 0 );

wa.composition.onended( gs.compositionStop );

ui.dom.btnFiles.click();
wisdom.qS( ui.dom.clockUnits, ".s" ).click();
wisdom.qS( ui.dom.menu, "[data-tool='paint']" ).click();

for ( var i = 0; i < 42; ++i ) {
	ui.newTrack();
}

} )();
