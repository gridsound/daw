"use strict";

ui.history = {
	init: function() {
		ui.dom.btnUndo.onclick = waFwk.undo;
		ui.dom.btnRedo.onclick = waFwk.redo;
	},
	reset: function() {
		while ( ui.dom.historyList.hasChildNodes() ) {
			ui.dom.historyList.lastChild.remove();
		}
	},
	pushAction: function( actobj ) {
		var usrdat = new ui.historyAction( actobj ),
			el = usrdat.elRoot;

		el.onclick = ui.history._actionClick.bind( null, el );
		ui.dom.historyList.appendChild( el );
		ui.dom.historyList.scrollTop = 1000000000;
		return usrdat;
	},
	popAction: function( actobj ) {
		actobj.userData.elRoot.remove();
	},

	// private:
	_actionClick: function( act ) {
		var n = waFwk.actionsInd -
				Array.from( ui.dom.historyList.children ).lastIndexOf( act );

		if ( n > 0 ) {
			while ( n-- ) { waFwk.undo(); }
		} else if ( n < 0 ) {
			while ( n++ ) { waFwk.redo(); }
		}
	}
};
