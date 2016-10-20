"use strict";

ui.initElement( "timelineLoop", function( el ) {
	var that, timeFn;

	document.body.addEventListener( "mousemove", function( e ) {
		if ( timeFn ) {
			timeFn( ui.getGridSec( e.pageX ) );
		}
	} );

	document.body.addEventListener( "mouseup", function() {
		if ( timeFn ) {
			timeFn = null;
			that.dragging = false;
			ui.cursor( "app", null );
		}
	} );

	return that = {
		mousedown: function( e ) {
			var el = e.target;

			if ( el.classList.contains( "time" ) ) {
				that.clickTime( el.classList.contains( "a" ) ? "a" : "b" );
				e.stopPropagation();
			}
		},
		clickTime: function( time ) {
			timeFn = time === "a" ? gs.loop.timeA : gs.loop.timeB;
			gs.loop.reorderTimeAB();
			that.dragging = true;
			ui.cursor( "app", "w-resize" );
		},
		toggle: function( b ) {
			el.classList.toggle( "hidden", !b );
		},
		when: function( sec ) {
			el.style.left = ( sec * ui.BPMem ) + "em";
		},
		duration: function( dur ) {
			el.style.width = ( dur * ui.BPMem ) + "em";
		}
	};
} );
