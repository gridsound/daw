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

gs.currentTime( 0 );
gs.compositions.init();
gs.composition.onended( gs.compositionStop );
ui.dom.btnFiles.click();

waFwk.analyser.fftSize = 256;
waFwk.analyserData = new Uint8Array( waFwk.analyser.frequencyBinCount );

for ( var i = 0; i < 42; ++i ) {
	gswaFramework.actions.addTrackBefore.call( waFwk, {}, null );
}

ui.trackHeight = waFwk.tracks[ 0 ].userData.elColNamesTrack.offsetHeight;

ui.history.init();
ui.clock.init();
ui.bpm.init();
ui.controls.init();
ui.grid.init();
ui.gridcontent.init();
ui.visual.init();
ui.timeline.init();
ui.tools.init();
ui.tool.select.init();

ui.gridcontent.left( 0 );
ui.grid.zoom( 1.5, 0 );
ui.tracksBg.update();
ui.visual.on();
ui.clock.inSeconds();
ui.tools.select( "paint" );

waFwk.do( "bpm", 120 );

} )();
