"use strict";

( function() {

ui.dom.filesFilters.onclick =
ui.dom.filesFilters.oncontextmenu = function() { return false; };
ui.dom.filesFilters.onmouseup = function( e ) {
	var b, a = e.target;
	if ( a.nodeName === "A" ) {
		if ( e.button === 0 ) {
			clist.toggle( a.className );
		} else if ( e.button === 2 ) {
			b = clist.contains( a.className ) && allFalseExcept( a.className );
			allClasses( b );
			if ( !b ) {
				clist.add( a.className );
			}
		}
	}
};

var clist = ui.dom.filesFilters.classList,
	fls = [ "used", "loaded", "unloaded" ];

allClasses( true );

function allFalseExcept( fsel ) {
	return fls.every( function( f ) {
		return f === fsel || !clist.contains( f );
	} );
}

function allClasses( b ) {
	clist.toggle( "used", b );
	clist.toggle( "loaded", b );
	clist.toggle( "unloaded", b );
}

} )();
