"use strict";

( function() {

ui.resize();
ui.setFilesWidth( 200 );
ui.setTrackNamesWidth( 125 );
ui.btnMagnet.toggle( true );
ui.timelineLoop.toggle( false );

ui.dom.btnFiles.click();

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

ui.trackHeight = waFwk.tracks[ 0 ].userData.elColNamesTrack.offsetHeight;
ui.gridcontent.left( 0 );
ui.grid.zoom( 1.5, 0 );
ui.tracksBg.update();
ui.clock.inSeconds();
ui.tools.select( "paint" );

} )();
