"use strict";

gs.pushCompositionChange = function( redo ) {
	var action = {
			redo: redo,
			undo: common.composeUndo( gs.currCmp, redo )
		};

	if ( gs.historyInd < gs.history.length ) {
		gs.history.length = gs.historyInd;
		ui.history.cut( gs.historyInd );
	}
	gs.historyInd = gs.history.push( action );
	gs.currCmpSaved = false;
	gs.changeComposition( redo );
	ui.history.push( action );
	ui.cmps.saved( false );
};
