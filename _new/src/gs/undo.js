"use strict";

gs.undo = function() {
	if ( gs.historyInd > 0 ) {
		var act = gs.history[ --gs.historyInd ];

		gs.changeComposition( act.undo );
		ui.history.undo( act );
	}
};
