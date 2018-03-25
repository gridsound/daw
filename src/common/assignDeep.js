"use strict";

common.assignDeep = ( a, b ) => {
	const aFrozen = Object.isFrozen( a ),
		aSealed = Object.isSealed( a );

	Object.entries( b ).forEach( ( [ bKey, bVal ] ) => {
		const aVal = a[ bKey ];

		if ( aVal !== bVal ) {
			if ( bVal == null ) {
				aFrozen || aSealed || delete a[ bKey ];
			} else if ( typeof bVal !== "object" ) {
				aFrozen || ( a[ bKey ] = bVal );
			} else {
				if ( typeof aVal !== "object" ) {
					if ( aFrozen || aSealed ) {
						return;
					}
					a[ bKey ] = {};
				}
				common.assignDeep( a[ bKey ], bVal );
			}
		}
	} );
	return a;
};
