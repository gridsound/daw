"use strict";

ui.elTimeline.onmouseup = function( e ) {
	gs.currentTime( ui.getGridSec( e.pageX ) );
};
