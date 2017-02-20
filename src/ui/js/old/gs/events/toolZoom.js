"use strict";

( function() {

function zoom( e, z ) {
	ui.grid.zoom( ui.grid._zoom * z,
		e.pageX - ui.filesWidth - ui.trackNamesWidth );
}

ui.tool.zoom = {
	start: function() {
		common.cursor( "grid", "zoom-in" );
	},
	end: function() {
		common.cursor( "grid", null );
	},
	keydown: function( e ) {
		if ( e.keyCode === 18 ) {
			common.cursor( "grid", "zoom-out" );
		}
	},
	keyup: function( e ) {
		if ( e.keyCode === 18 ) {
			common.cursor( "grid", "zoom-in" );
		}
	},
	wheel: function( e ) {
		zoom( e, e.deltaY < 0 ? 1.1 : .9 );
	},
	mousedown: function( e ) {
		if ( e.button === 0 ) {
			zoom( e, e.altKey ? .7 : 1.3 );
		}
	}
};

} )();
