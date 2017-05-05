"use strict";

( function() {

ui.tracksBg.init();
ui.history.init();
ui.clock.init();
ui.bpm.init();
ui.controls.init();
ui.gridcontent.init();
ui.visual.init();
ui.timeline.init();
ui.tools.init();
ui.tool.select.init();

waFwk.run();
waFwk.newComposition();
waFwk.analyser.fftSize = 256;
waFwk.analyserData = new Uint8Array( waFwk.analyser.frequencyBinCount );

ui.setFilesWidth( 200 );
ui.setTrackNamesWidth( 125 );
ui.gridcontent.left( 0 );
ui.btnMagnet.toggle( true );
ui.timelineLoop.toggle( false );
ui.dom.btnFiles.click();
ui.resize();

ui.trackHeight = waFwk.tracks[ 0 ].userData.elColNamesTrack.offsetHeight;
ui.grid.zoom( 1.5, 0 );
ui.tracksBg.update();
ui.clock.inSeconds();
ui.tools.select( "paint" );

frame();
function frame() {
	ui.visual.draw();
	requestAnimationFrame( frame );
}

} )();
