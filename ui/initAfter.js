"use strict";

ui.resize();
ui.setBPM( 120 );
ui.setClockTime( 0 );
ui.setCursorTime( 0 );
ui.setFilesWidth( 200 );
ui.setTrackLinesLeft( 0 );
ui.setTrackNamesWidth( 125 );
ui.setGridZoom( 1.5, 0, 0 );
ui.analyserToggle( true );
ui.toggleMagnetism( true );

ui.updateTrackLinesBg();

ui.jqBtnTools.filter( "[data-tool='paint']" ).click();
