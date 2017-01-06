"use strict";

gs.compositions.saveCurrent = function() {
	gs.compositions.save( gs.compositions.current );
	return false;
};

gs.compositions.save = function( cmp ) {
	var name;

	if ( !cmp ) {
		name = gs.compositions.askName();
		if ( !name ) {
			return;
		}
		cmp = { name: name };
	}
	gs.compositions.current = cmp;
	gs.compositions.serialize( cmp );
	gs.compositions.store( cmp );
	ui.save.selectComposition( cmp );
};
