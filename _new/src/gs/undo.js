"use strict";

gs.undo = function() {
	if ( gs.historyInd > 0 ) {
		gs.applyChange( gs.history[ --gs.historyInd ].undo );
	}
};
