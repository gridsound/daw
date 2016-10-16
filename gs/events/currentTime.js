"use strict";

ui.dom.gridTimeline.onmouseup = function( e ) {
	gs.currentTime( ui.getGridSec( e.pageX ) );
};
