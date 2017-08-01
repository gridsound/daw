"use strict";

common.assignDeep = function( data, add ) {
	if ( data && add && typeof data === "object" && typeof add === "object" ) {
		var k, val;

		for ( k in add ) {
			val = common.assignDeep( data[ k ], add[ k ] );
			if ( val !== null ) {
				data[ k ] = val;
			} else {
				delete data[ k ];
			}
		}
		return data;
	}
	return add;
};
