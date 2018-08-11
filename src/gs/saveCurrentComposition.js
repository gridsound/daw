"use strict";

gs.saveCurrentComposition = () => (
	gs.currCmpSaved
		? Promise.resolve()
		: new Promise( res => {
			const cmp = gs.currCmp;

			cmp.savedAt = ~~( Date.now() / 1000 );
			gs.localStorage.put( cmp.id, cmp );
			gs.actionSaved = gs.undoredo.getCurrentAction();
			gs.currCmpSaved = true;
			ui.cmps.saved( true );
			res();
		} )
);
