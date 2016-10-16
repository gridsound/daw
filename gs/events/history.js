"use strict";

ui.dom.btnUndo.onclick = function() { gs.history.undo(); return false; };
ui.dom.btnRedo.onclick = function() { gs.history.redo(); return false; };

ui.dom.historyList.onclick = function( e ) {
	var act = e.target.historyAction;
	if ( act ) {
		gs.history.goToAction( act );
	}
};
