"use strict";

gs.compositions.store = function( cmp ) {
	var cmps = gs.compositions.list,
		icmp = cmps.findIndex( function( _cmp ) {
			return cmp.id === _cmp.id;
		} );

	cmp.id = cmp.id || common.uuid();
	cmp.name = cmp.name
		|| prompt( "Please enter a name for your new composition :" )
		|| "Untitled";
	if ( icmp > -1 ) {
		cmps[ icmp ] = cmp;
		ui.save.updateComposition( cmp );
	} else {
		cmps.push( cmp );
		ui.save.addComposition( cmp );
	}
	localStorage.compositions = JSON.stringify( cmps );
};
