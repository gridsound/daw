"use strict";

waFwk.on.pushAction = function( actobj ) {
	var usrdat = new ui.historyAction( actobj );

	ui.dom.historyList.appendChild( usrdat.elRoot );
	return usrdat;
};
