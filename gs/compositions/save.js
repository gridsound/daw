"use strict";

gs.compositions.save = function( cmp ) {
	gs.compositions.current = cmp = cmp || {};
	gs.compositions.serialize( cmp );
	gs.compositions.store( cmp );
};
