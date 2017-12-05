"use strict";

jsonActions.clonePattern = function( patId ) {
	var nKeys = {},
		nkeysId = common.smallId(),
		pat = gs.currCmp.patterns[ patId ],
		keys = gs.currCmp.keys[ pat.keys ];

	Object.keys( keys ).forEach( function( k ) {
		nKeys[ common.smallId() ] = Object.assign( {}, keys[ k ] );
	} );
	return {
		keys: { [ nkeysId ]: nKeys },
		patterns: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( pat.name, "patterns" ),
			type: "keys",
			keys: nkeysId,
			synth: pat.synth,
			duration: pat.duration
		} }
	};
};
