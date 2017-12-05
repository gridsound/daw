"use strict";

jsonActions.removePattern = function( patId ) {
	var filled,
		blocks,
		data = {
			keys: { [ gs.currCmp.patterns[ patId ].keys ]: null },
			patterns: { [ patId ]: null }
		};

	blocks = Object.entries( gs.currCmp.blocks ).reduce( ( obj, [ blcId, blc ] ) => {
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
};

