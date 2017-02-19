"use strict";

( function() {

gs.wctx = new gswaContext();
gs.ctx = gs.wctx.ctx;
gs.composition = gs.wctx.createComposition();

ui.resize();
ui.setFilesWidth( 200 );
ui.setTrackNamesWidth( 125 );
ui.btnMagnet.toggle( true );
ui.timelineLoop.toggle( false );

gs.history.reset();
gs.currentTime( 0 );
gs.compositions.init();
gs.composition.onended( gs.compositionStop );
ui.dom.btnFiles.click();

waFwk.analyser.fftSize = 256;
waFwk.analyserData = new Uint8Array( waFwk.analyser.frequencyBinCount );
waFwk.do.setBPM( 120 );

for ( var i = 0; i < 42; ++i ) {
	waFwk.do.addTrack( {} );
}

ui.trackHeight = waFwk.tracks[ 0 ].userData.elColNamesTrack.offsetHeight;

ui.clockInit();
ui.gridInit();
ui.gridcontentInit();
ui.visualInit();
ui.timelineInit();
ui.toolsInit();

ui.gridcontentLeft( 0 );
ui.gridZoom( 1.5, 0 );
ui.tracksBgUpdate();
ui.visualOn();
ui.clockInSeconds();
ui.toolsSelect( "paint" );

} )();
