"use strict";

( function() {

var fn,
	mousemoving = false,
	fns = {
		files: function( e ) {
			var w = e.pageX;
			ui.setFilesWidth( w < 35 ? 0 : w );
		},
		trackNames: function( e ) {
			var w = e.pageX - ui.elGrid.getBoundingClientRect().left;
			ui.setTrackNamesWidth( w < 35 ? 0 : w );
		}
	};

wisdom.qSA( ".extend" ).forEach( function( elExtend ) {
	elExtend.onmousedown = function( e ) {
		if ( e.button === 0 ) {
			mousemoving = true;
			ui.cursor( "app", "col-resize" );
			fn = fns[ this.dataset.mousemoveFn ];
		}
	};
} );

document.body.addEventListener( "mouseup", function( e ) {
	if ( e.button === 0 && mousemoving ) {
		mousemoving = false;
		ui.cursor( "app", null );
	}
} );

document.body.addEventListener( "mousemove", function( e ) {
	if ( mousemoving ) {
		fn( e );
	}
} );

} )();
