"use strict";

ui.elTimeline.onmouseup = function( e ) {
	gs.currentTime( ui.getGridXem( e.pageX ) / ui.BPMem );
};
