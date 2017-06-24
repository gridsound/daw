"use strict";

gs.redo = function() {
	if ( gs.historyInd < gs.history.length ) {
		gs.applyChange( gs.history[ gs.historyInd++ ].redo );
	}
};
