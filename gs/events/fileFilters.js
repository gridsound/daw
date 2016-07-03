"use strict";

( function() {

var clist = ui.jqFileFilters[ 0 ].classList,
	flsStr = "used loaded unloaded",
	fls = flsStr.split( " " );

function allFalseExcept( fsel ) {
	return fls.every( function( f ) {
		return f === fsel || !clist.contains( f );
	} );
}

ui.jqFileFilters
	.addClass( flsStr )
	.on( {
		click: false,
		contextmenu: false,
		mouseup: function( e ) {
			var a = e.target;
			if ( a.nodeName === "A" ) {
				if ( e.button === 0 ) {
					clist.toggle( a.className );
				} else if ( e.button === 2 ) {
					if ( clist.contains( a.className ) && allFalseExcept( a.className ) ) {
						ui.jqFileFilters.addClass( flsStr );
					} else {
						ui.jqFileFilters.removeClass( flsStr );
						clist.add( a.className );
					}
				}
			}
		}
	} );

} )();
