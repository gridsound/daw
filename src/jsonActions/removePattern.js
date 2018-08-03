"use strict";

function json_removePattern( cmp, patId ) {
	let filled;
	const data = {
			keys: { [ cmp.patterns[ patId ].keys ]: null },
			patterns: { [ patId ]: null }
		},
		blocks = Object.entries( cmp.blocks ).reduce( ( obj, [ blcId, blc ] ) => {
			if ( blc.pattern === patId ) {
				obj[ blcId ] = null;
				filled = true;
			}
			return obj;
		}, {} );

	if ( filled ) {
		data.blocks = blocks;
	}
	return data;
}
