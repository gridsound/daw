"use strict";

gs.init = function() {
	var cmps = localStorage.cmps;

	gs.storedCmps = cmps ? JSON.parse( cmps ) : [];
	gs.history = [];
	gs.historyInd = 0;
	gs.currCmp = null;
	ui.init();
};
