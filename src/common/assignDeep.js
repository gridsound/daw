"use strict";

common.assignDeep = function( data, add ) {
	if ( data && add && typeof data === "object" && typeof add === "object" ) {
		for ( var k in add ) {
			data[ k ] = common.assignDeep( data[ k ], add[ k ] );
		}
		return data;
	}
	return add;
};
