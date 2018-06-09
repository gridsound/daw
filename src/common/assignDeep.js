"use strict";

common.copyObject = obj => {
	return JSON.parse( JSON.stringify( obj ) );
};

common.assignDeep = ( a, b ) => {
	const aFrozen = Object.isFrozen( a ),
		aSealed = Object.isSealed( a );

	Object.entries( b ).forEach( ( [ k, val ] ) => {
		if ( a[ k ] !== val ) {
			if ( val == null ) {
				aSealed || delete a[ k ];
			} else if ( typeof val !== "object" ) {
				aFrozen || ( a[ k ] = val );
			} else if ( typeof a[ k ] !== "object" ) {
				aFrozen || ( a[ k ] = common.copyObject( val ) );
			} else {
				common.assignDeep( a[ k ], val );
			}
		}
	} );
	return a;
};
