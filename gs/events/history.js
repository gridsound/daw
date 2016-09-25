"use strict";

ui.elBtnUndo.onclick = function() { gs.history.undo(); return false; };
ui.elBtnRedo.onclick = function() { gs.history.redo(); return false; };

ui.elHistoryActionList.onclick = function( e ) {
	var act = e.target.historyAction;
	if ( act ) {
		gs.history.goToAction( act );
	}
};
