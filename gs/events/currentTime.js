"use strict";

ui.jqTimeline.mouseup( function( e ) {
	gs.currentTime( ui.getGridXem( e.pageX ) / ui.BPMem );
} );
