"use strict";

gs.redo = function() {
	if ( gs.historyInd < gs.history.length ) {
		gs.changeComposition( gs.history[ gs.historyInd++ ].redo );
	}
};
