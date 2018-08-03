"use strict";

function json_clonePattern( cmp, patId ) {
	const nKeys = {},
		nkeysId = common.smallId(),
		pat = cmp.patterns[ patId ],
		keys = cmp.keys[ pat.keys ];

	Object.keys( keys ).forEach( ( k, i ) => {
		nKeys[ i ] = Object.assign( {}, keys[ k ] );
	} );
	return {
		keys: { [ nkeysId ]: nKeys },
		patterns: { [ common.smallId() ]: {
			name: gs.nameUniqueFrom( pat.name, "patterns" ),
			type: "keys",
			keys: nkeysId,
			synth: pat.synth,
			duration: pat.duration,
		} }
	};
}
