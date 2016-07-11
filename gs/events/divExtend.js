"use strict";

( function() {

var fn, fns = {
		files: function( e ) {
			var w = e.pageX;
			ui.setFilesWidth( w < 35 ? 0 : w );
		},
		trackNames: function( e ) {
			var w = e.pageX - ui.jqGrid.offset().left;
			ui.setTrackNamesWidth( w < 35 ? 0 : w );
		}
	},
	mousemoving = false;

$( ".extend" ).mousedown( function( e ) {
	if ( e.button === 0 ) {
		mousemoving = true;
		ui.cursor( "app", "col-resize" );
		fn = fns[ this.dataset.mousemoveFn ];
	}
} );

ui.jqBody
	.mouseup( function( e ) {
		if ( e.button === 0 && mousemoving ) {
			mousemoving = false;
			ui.cursor( "app", null );
		}
	} )
	.mousemove( function( e ) {
		if ( mousemoving ) {
			fn( e );
		}
	} );

} )();
