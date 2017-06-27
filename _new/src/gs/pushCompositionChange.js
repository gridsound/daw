"use strict";

gs.pushCompositionChange = function( objDo, objUndo ) {
	var action = {
			redo: objDo,
			undo: objUndo
		};

	if ( gs.historyInd < gs.history.length ) {
		gs.history.length = gs.historyInd;
		ui.history.cut( gs.historyInd );
	}
	gs.historyInd = gs.history.push( action );
	gs.changeComposition( objDo );
	ui.history.push( action );
	ui.cmpSaved( gs.currCmp, false );
};
