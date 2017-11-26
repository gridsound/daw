"use strict";

gs.getMaxCompositionInnerId = function( cmp ) {
	return common.deepKeys( cmp ).reduce( ( n, key ) => {
		var id = common.smallIdParse( key );

		return id < 0 ? n : Math.max( n, id );
	}, 0 );
};
