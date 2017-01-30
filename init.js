"use strict";

( function() {

gs.wctx = new gswaContext();
gs.ctx = gs.wctx.ctx;
gs.analyserNode = gs.wctx.ctx.createAnalyser();
gs.analyserNode.fftSize = 256;
gs.analyserData = new Uint8Array( gs.analyserNode.frequencyBinCount ),
gs.composition = gs.wctx.createComposition();
gs.wctx.filters.pushBack( gs.analyserNode );

ui.resize();
ui.setFilesWidth( 200 );
ui.setTrackLinesLeft( 0 );
ui.setTrackNamesWidth( 125 );
ui.setGridZoom( 1.5, 0 );
ui.visual.on();
ui.btnMagnet.toggle( true );
ui.tracksBg.update();
ui.timelineLoop.toggle( false );

gs.history.reset();
gs.currentTime( 0 );
gs.compositions.init();
gs.composition.onended( gs.compositionStop );
ui.dom.btnFiles.click();
ui.dom.clockUnits.querySelector( ".s" ).click();
ui.dom.menu.querySelector( "[data-tool='paint']" ).click();

} )();
