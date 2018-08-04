"use strict";

gs.handleOldComposition = cmp => {
	const blcsEntries = Object.entries( cmp.blocks ),
		blcsObj = {},
		sortWhen = ( a, b ) => {
			a = a[ 1 ].when;
			b = b[ 1 ].when;
			return a < b ? -1 : a > b ? 1 : 0;
		};
	let blcId = 0;

	if ( !cmp.synths ) {
		const synthId = common.smallId();

		Object.values( cmp.patterns ).forEach( pat => pat.synth = synthId );
		cmp.synthOpened = synthId;
		cmp.synths = { [ synthId ]: {
			name: "synth",
			oscillators: {
				[ common.smallId() ]: { type: "sine", detune: 0, pan: 0, gain: 1 }
			}
		} };
	}
	Object.values( cmp.synths ).forEach( syn => {
		delete syn.envelopes;
	} );
	Object.values( cmp.tracks ).forEach( tr => {
		tr.name = tr.name || "";
		tr.toggle = typeof tr.toggle === "boolean" ? tr.toggle : true;
	} );
	cmp.blocks = blcsObj;
	blcsEntries.sort( sortWhen );
	blcsEntries.forEach( ( [ id, blc ] ) => {
		blcsObj[ blcId++ ] = blc;
		blc.offset = blc.offset || 0;
		blc.selected = !!blc.selected;
		blc.durationEdited = !!blc.durationEdited;
	} );
	Object.entries( cmp.keys ).forEach( ( [ id, keys ] ) => {
		const keysEntries = Object.entries( keys ),
			keysObj = {};
		let keyId = 0;

		cmp.keys[ id ] = keysObj;
		keysEntries.sort( sortWhen );
		keysEntries.forEach( ( [ id, k ] ) => {
			keysObj[ keyId++ ] = k;
			k.pan = +castToNumber( -1, 1, 0, k.pan ).toFixed( 2 );
			k.gain = +castToNumber( 0, 1, .8, k.gain ).toFixed( 2 );
			k.selected = !!k.selected;
			delete k.durationEdited;
			if ( typeof k.key === "string" ) {
				k.key = gsuiKeys.keyStrToMidi( k.key );
			}
		} )
	} );
};
