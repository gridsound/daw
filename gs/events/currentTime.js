"use strict";

ui.dom.timeline.onmouseup = function( e ) {
	gs.currentTime( ui.getGridSec( e.pageX ) );
};
