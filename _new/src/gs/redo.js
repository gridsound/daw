"use strict";

gs.redo = function() {
	if ( gs.historyInd < gs.history.length ) {
		var act = gs.history[ gs.historyInd++ ];

		gs.changeComposition( act.redo );
		ui.history.redo( act );
	}
};
