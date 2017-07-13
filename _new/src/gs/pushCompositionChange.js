"use strict";

gs.pushCompositionChange = function( action ) {
	if ( gs.historyInd < gs.history.length ) {
		gs.history.length = gs.historyInd;
		ui.history.cut( gs.historyInd );
	}
	gs.historyInd = gs.history.push( action );
	gs.currCmpSaved = false;
	gs.changeComposition( action.redo );
	ui.history.push( action );
	ui.cmps.saved( false );
};
