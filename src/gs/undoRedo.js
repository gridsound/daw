"use strict";

gs.undo = function() {
	// if ( gs.historyInd > 0 ) {
	if ( gs.undoredo.undo() ) {
		var act = gs.history[ --gs.historyInd ],
			prevAct = gs.history[ gs.historyInd - 1 ];

		gs.currCmpSaved = !!( prevAct
			? prevAct.saved
			: !gs.historyActionSaved &&
				( gs.currCmp.savedAt || localStorage[ gs.currCmp.id ] ) );
		gs.changeComposition( act.undo );
		ui.history.undo( act );
		ui.cmps.saved( gs.currCmpSaved );
	}
};

gs.redo = function() {
	// if ( gs.historyInd < gs.history.length ) {
	if ( gs.undoredo.redo() ) {
		var act = gs.history[ gs.historyInd++ ];

		gs.currCmpSaved = !!act.saved;
		gs.changeComposition( act.redo );
		ui.history.redo( act );
		ui.cmps.saved( gs.currCmpSaved );
	}
};
