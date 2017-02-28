"use strict";

ui.history = {
	init: function() {
		ui.dom.btnUndo.onclick = waFwk.undo;
		ui.dom.btnRedo.onclick = waFwk.redo;
	},
	pushAction: function( actobj ) {
		var usrdat = new ui.historyAction( actobj );

		ui.dom.historyList.appendChild( usrdat.elRoot );
		return usrdat;
	},
	popAction: function( actobj ) {
		lg( "popAction" );
		actobj.userData.elRoot.remove();
	}
};
