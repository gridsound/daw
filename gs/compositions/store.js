"use strict";

gs.compositions.store = function( save ) {
	var icmp, cmps = localStorage.compositions;

	if ( !cmps ) {
		cmps = localStorage.compositions = [];
	}
	icmp = cmps.findIndex( function( cmp ) {
		return save.name === cmp.name;
	} );
	if ( icmp > -1 ) {
		cmps[ icmp ] = save;
	} else {
		cmps.push( save );
	}
};
