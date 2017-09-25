"use strict";

gs.getMaxCompositionInnerId = function( cmp ) {
	var keysKeys = Object.keys( cmp.keys );

	return Object.keys( cmp.patterns )
		.concat(
			keysKeys,
			keysKeys.reduce( function( arr, keyId ) {
				return arr.concat( Object.keys( cmp.keys[ keyId ] ) );
			}, [] ),
			Object.keys( cmp.blocks ),
			Object.keys( cmp.tracks ) )
		.reduce( function( n, key ) {
			return Math.max( n, common.smallIdParse( key ) );
		}, 0 );
};
