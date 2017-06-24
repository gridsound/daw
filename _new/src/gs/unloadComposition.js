"use strict";

gs.unloadComposition = function() {
	if ( gs.currCmp ) {
		ui.unloadComposition( gs.currCmp );
		gs.currCmp = null;
		gs.currCmpSaved = true;
		gs.historyInd = 0;
		gs.history.length = 0;
	}
};
