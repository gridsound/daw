"use strict";

gs.undo = function() {
	if ( gs.historyInd > 0 ) {
		gs.changeComposition( gs.history[ --gs.historyInd ].undo );
	}
};
