"use strict";

gs.clonePattern = function( patId ) {
	var nKeys = {},
		nkeysId = common.smallId(),
		cmp = gs.currCmp,
		pat = cmp.patterns[ patId ],
		keys = cmp.keys[ pat.keys ];

	Object.keys( keys ).forEach( function( k ) {
		nKeys[ common.smallId() ] = Object.assign( {}, keys[ k ] );
	} );
	gs.pushCompositionChange( {
		keys: { [ nkeysId ]: nKeys },
		patterns: { [ common.smallId() ]: {
			type: "keys",
			keys: nkeysId,
			name: gs.namePattern( pat.name ),
			duration: pat.duration
		} }
	} );
};
