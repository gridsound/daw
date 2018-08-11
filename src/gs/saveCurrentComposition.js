"use strict";

gs.saveCurrentComposition = () => {
	const saveKo = document.cookie.indexOf( "cookieAccepted" ) < 0;

	if ( saveKo ) {
		gsuiPopup.alert( "Error",
			"You have to accept our cookies before saving locally your composition." );
	}
	return gs.currCmpSaved || saveKo
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
};
